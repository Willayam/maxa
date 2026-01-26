import Link from 'next/link';
import { tests, type Season } from '@/data/tests';

// Get display name for season
function getSeasonDisplay(season: Season): string {
  return season === 'vår' ? 'Våren' : 'Hösten';
}

// Get the 4 most recent tests (already sorted by year DESC, höst before vår)
const recentTests = tests.slice(0, 4);

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-extrabold text-primary mb-4">Maxa</h3>
          <p className="text-foreground-muted text-sm">
            Plugga smart för Högskoleprovet.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Resurser</h4>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li><Link href="/antagningsstatistik" className="hover:text-primary transition-colors">Antagningsstatistik</Link></li>
            <li><Link href="/studieplan" className="hover:text-primary transition-colors">Studieplan</Link></li>
            <li><Link href="/hogskoleprovet" className="hover:text-primary transition-colors">Gamla prov</Link></li>
            <li><Link href="/normering" className="hover:text-primary transition-colors">Normering</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Senaste proven</h4>
          <ul className="space-y-2 text-sm text-foreground-muted">
            {recentTests.map((test) => (
              <li key={test.id}>
                <Link
                  href={`/hogskoleprovet/${test.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {getSeasonDisplay(test.season)} {test.year}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-4">Företaget</h4>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li><a href="#" className="hover:text-primary transition-colors">Om oss</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Kontakt</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Integritetspolicy</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-foreground-muted">
        © 2026 Maxa. Alla rättigheter förbehållna.
      </div>
    </footer>
  );
}
