import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const metadata = {
  title: 'Poang & Antagning - Maxa',
  description: 'Information om poangsystemet och antagningsstatistik for Hogskoleprovet',
};

export default function PoangAntagningPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8">Poang & Antagning</h1>
          <p className="text-text-muted mb-6">
            Forsta hur poangsystemet fungerar och vad som kravs for att komma in pa olika utbildningar.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">Poangskalan</h2>
          <p className="text-text-muted">
            Hogskoleprovet ger ett normerat resultat mellan 0.0 och 2.0.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
