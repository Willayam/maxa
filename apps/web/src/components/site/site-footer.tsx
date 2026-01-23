import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-extrabold text-primary mb-4">Maxa</h3>
          <p className="text-text-muted text-sm">
            Plugga smart for Hogskoleprovet.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Resurser</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><Link href="/antagningsstatistik">Antagningsstatistik</Link></li>
            <li><Link href="/studieplan">Studieplan</Link></li>
            <li><Link href="/gamla-prov">Gamla prov</Link></li>
            <li><Link href="/normering">Normering</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Appen</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><a href="#">Ladda ner</a></li>
            <li><a href="#">Funktioner</a></li>
            <li><a href="#">Priser</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Foretaget</h4>
          <ul className="space-y-2 text-sm text-text-muted">
            <li><a href="#">Om oss</a></li>
            <li><a href="#">Kontakt</a></li>
            <li><a href="#">Integritetspolicy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-text-muted">
        © 2026 Maxa. Alla rattigheter forbehallna.
      </div>
    </footer>
  );
}
