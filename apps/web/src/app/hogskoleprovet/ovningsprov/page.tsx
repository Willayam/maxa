import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const metadata = {
  title: 'Ovningsprov - Maxa',
  description: 'Gratis ovningsprov for Hogskoleprovet',
};

export default function OvningsprovPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8">Ovningsprov</h1>
          <p className="text-text-muted mb-6">
            Trana infor Hogskoleprovet med vara ovningsprov och tidigare prov.
          </p>
          <a
            href="#"
            className="inline-block bg-primary text-text-primary font-bold uppercase px-6 py-3 rounded-xl border-b-[4px] border-primary-dark"
          >
            Borja trana i appen
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
