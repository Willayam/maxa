import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          Maxa
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/hogskoleprovet/guide" className="text-text-muted hover:text-text-primary">
            Om provet
          </Link>
          <Link href="/hogskoleprovet/provdatum-2026" className="text-text-muted hover:text-text-primary">
            Provdatum
          </Link>
          <Link href="/hogskoleprovet/poang-antagning" className="text-text-muted hover:text-text-primary">
            Poang & antagning
          </Link>
        </nav>
        <a
          href="#"
          className="bg-primary text-text-primary font-bold uppercase text-sm px-4 py-2 rounded-xl border-b-[4px] border-primary-dark"
        >
          Ladda ner
        </a>
      </div>
    </header>
  );
}
