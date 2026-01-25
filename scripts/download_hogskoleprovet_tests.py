#!/usr/bin/env python3
"""
Download historical Hogskoleprovet PDFs from studera.nu listing pages.
"""

import argparse
import html
import os
import re
import sys
import time
import unicodedata
from html.parser import HTMLParser
from typing import List, Optional, Set, Tuple
from urllib.parse import urljoin, urlsplit, urlunsplit, unquote
from urllib.request import Request, urlopen

DEFAULT_INDEX_URL = "https://www.studera.nu/hogskoleprov/om/forbereda/tidigare/"
DEFAULT_OUT_DIR = os.path.join("content", "hogskoleprovet-tests")
USER_AGENT = "hp-downloader/1.0 (+https://www.studera.nu/)"


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: List[Tuple[str, str]] = []
        self._in_a = False
        self._a_href: Optional[str] = None
        self._a_text: List[str] = []
        self._in_h1 = False
        self._h1_text: List[str] = []
        self._in_title = False
        self._title_text: List[str] = []

    @property
    def h1(self) -> Optional[str]:
        text = "".join(self._h1_text).strip()
        return text or None

    @property
    def title(self) -> Optional[str]:
        text = "".join(self._title_text).strip()
        return text or None

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self._in_a = True
            self._a_text = []
            self._a_href = None
            for key, value in attrs:
                if key == "href":
                    self._a_href = value
        elif tag == "h1":
            self._in_h1 = True
        elif tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "a" and self._in_a:
            text = html.unescape("".join(self._a_text).strip())
            if self._a_href:
                self.links.append((self._a_href, text))
            self._in_a = False
            self._a_href = None
            self._a_text = []
        elif tag == "h1" and self._in_h1:
            self._in_h1 = False
        elif tag == "title" and self._in_title:
            self._in_title = False

    def handle_data(self, data):
        if self._in_a:
            self._a_text.append(data)
        if self._in_h1:
            self._h1_text.append(data)
        if self._in_title:
            self._title_text.append(data)


def fetch(url: str) -> str:
    req = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(req, timeout=30) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")


def normalize_url(url: str) -> str:
    parts = urlsplit(url)
    parts = parts._replace(fragment="", query="")
    return urlunsplit(parts)


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = value.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "item"


LISTING_PREFIXES = (
    "/hogskoleprov/om/forbereda",
    "/hogskoleprov/forbered-dig/ovningsprov",
)


def is_listing_path(path: str) -> bool:
    return any(path.startswith(prefix) for prefix in LISTING_PREFIXES)


def is_test_page(path: str) -> bool:
    if "/hogskoleprov/fpn/" in path:
        return True
    if "/hogskoleprov/provfragor-" in path:
        return True
    return "provfragor-och-facit" in path


def crawl_test_pages(start_url: str, max_pages: int) -> Set[str]:
    queue = [start_url]
    seen_pages: Set[str] = set()
    test_pages: Set[str] = set()

    while queue and len(seen_pages) < max_pages:
        url = queue.pop(0)
        url = normalize_url(url)
        if url in seen_pages:
            continue
        seen_pages.add(url)

        try:
            html_text = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"Warning: failed to fetch {url}: {exc}", file=sys.stderr)
            continue

        parser = PageParser()
        parser.feed(html_text)

        for href, text in parser.links:
            if not href:
                continue
            full = normalize_url(urljoin(url, href))
            parts = urlsplit(full)
            if parts.netloc != "www.studera.nu":
                continue
            if is_test_page(parts.path):
                test_pages.add(full)
                continue

            if is_listing_path(parts.path) and full not in seen_pages:
                queue.append(full)

        time.sleep(0.2)

    return test_pages


def extract_test_assets(test_url: str) -> Tuple[str, List[str]]:
    html_text = fetch(test_url)
    parser = PageParser()
    parser.feed(html_text)

    title = parser.h1 or parser.title or urlsplit(test_url).path.split("/")[-1]
    folder = slugify(title)

    pdf_links: List[str] = []
    for href, _text in parser.links:
        if not href:
            continue
        full = normalize_url(urljoin(test_url, href))
        parts = urlsplit(full)
        if ".pdf" not in parts.path.lower():
            continue
        pdf_links.append(full)

    return folder, sorted(set(pdf_links))


def sanitize_filename(name: str) -> str:
    name = unquote(name)
    base = os.path.basename(name)
    base = base.replace("%", "-")
    stem, ext = os.path.splitext(base)
    ext = ext or ".pdf"
    stem = slugify(stem)
    return f"{stem}{ext.lower()}"


def download_file(url: str, dest_path: str, dry_run: bool) -> None:
    if dry_run:
        print(f"[dry-run] {url} -> {dest_path}")
        return
    req = Request(url, headers={"User-Agent": USER_AGENT})
    tmp_path = dest_path + ".part"
    with urlopen(req, timeout=60) as resp, open(tmp_path, "wb") as fh:
        fh.write(resp.read())
    os.replace(tmp_path, dest_path)


def main() -> int:
    parser = argparse.ArgumentParser(description="Download historical Hogskoleprovet PDFs.")
    parser.add_argument("--out", default=DEFAULT_OUT_DIR, help="Output directory")
    parser.add_argument("--index", default=DEFAULT_INDEX_URL, help="Start index URL")
    parser.add_argument("--max-pages", type=int, default=20, help="Max listing pages to crawl")
    parser.add_argument("--dry-run", action="store_true", help="Only print planned downloads")
    args = parser.parse_args()

    out_dir = os.path.abspath(args.out)
    os.makedirs(out_dir, exist_ok=True)

    print(f"Crawling listing pages from {args.index}")
    test_pages = crawl_test_pages(args.index, args.max_pages)
    if not test_pages:
        print("No test pages found. Check the index URL or max-pages.", file=sys.stderr)
        return 1

    print(f"Found {len(test_pages)} test pages")
    total = 0

    for test_url in sorted(test_pages):
        try:
            folder_name, pdfs = extract_test_assets(test_url)
        except Exception as exc:  # noqa: BLE001
            print(f"Warning: failed to parse {test_url}: {exc}", file=sys.stderr)
            continue

        if not pdfs:
            print(f"No PDFs found on {test_url}")
            continue

        dest_dir = os.path.join(out_dir, folder_name)
        os.makedirs(dest_dir, exist_ok=True)

        for pdf_url in pdfs:
            filename = sanitize_filename(urlsplit(pdf_url).path)
            dest_path = os.path.join(dest_dir, filename)
            if os.path.exists(dest_path):
                print(f"Skip existing {dest_path}")
                continue
            try:
                download_file(pdf_url, dest_path, args.dry_run)
                total += 1
                time.sleep(0.2)
            except Exception as exc:  # noqa: BLE001
                print(f"Warning: failed to download {pdf_url}: {exc}", file=sys.stderr)
                if os.path.exists(dest_path + ".part"):
                    os.remove(dest_path + ".part")

    print(f"Done. Downloaded {total} files into {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
