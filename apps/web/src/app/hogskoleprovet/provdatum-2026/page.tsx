import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const metadata = {
  title: 'Provdatum 2026 - Maxa',
  description: 'Hogskoleprovet provdatum och anmalningsdatum for 2026',
};

export default function ProvdatumPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8">Provdatum 2026</h1>
          <p className="text-text-muted mb-6">
            Har hittar du alla viktiga datum for Hogskoleprovet 2026.
          </p>
          <div className="p-6 rounded-2xl border-2 border-border mb-4">
            <h3 className="font-bold">Varprovet 2026</h3>
            <p className="text-text-muted">Datum: April 2026</p>
          </div>
          <div className="p-6 rounded-2xl border-2 border-border">
            <h3 className="font-bold">Hostprovet 2026</h3>
            <p className="text-text-muted">Datum: Oktober 2026</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
