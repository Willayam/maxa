import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-primary">
          Maxa
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/antagningsstatistik"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Antagning
          </Link>
          <Link
            href="/studieplan"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Studieplan
          </Link>
          <Link
            href="/gamla-prov"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Gamla prov
          </Link>
          <Link
            href="/normering"
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            Normering
          </Link>
        </nav>
        <a
          href="#"
          className="bg-primary text-text-primary font-bold uppercase text-sm px-4 py-2 rounded-xl border-b-[4px] border-primary-dark hover:translate-y-[2px] hover:border-b-[2px] transition-all"
        >
          Ladda ner
        </a>
      </div>
    </header>
  );
}
