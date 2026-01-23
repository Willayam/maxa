import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export const metadata = {
  title: 'Hogskoleprovet Guide - Maxa',
  description: 'Allt du behover veta om Hogskoleprovet',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-8">Guide till Hogskoleprovet</h1>
          <p className="text-text-muted mb-6">
            Hogskoleprovet ar ett svenskt antagningsprov for hogre utbildning. Har hittar du allt du behover veta for att forbereda dig.
          </p>
          <h2 className="text-2xl font-bold mt-8 mb-4">De 8 delproven</h2>
          <p className="text-text-muted">
            Provet bestar av 8 delprov: ORD, LAS, MEK, ELF (verbala) och XYZ, KVA, NOG, DTK (kvantitativa).
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
