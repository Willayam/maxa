import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6 text-center">
          <h1 className="text-5xl font-extrabold text-text-primary mb-6">
            Plugga smart for Hogskoleprovet
          </h1>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Maxa hjalper dig att forbereda dig for Hogskoleprovet med
            personlig traning, statistik och AI-coaching.
          </p>
          <a
            href="#"
            className="inline-block bg-primary text-text-primary font-bold uppercase px-8 py-4 rounded-2xl border-b-[6px] border-primary-dark hover:translate-y-[3px] hover:border-b-[3px] transition-all"
          >
            Ladda ner appen
          </a>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border-2 border-border">
              <h3 className="text-xl font-bold mb-2">Alla 8 delproven</h3>
              <p className="text-text-muted">
                Trana pa ORD, LAS, MEK, ELF, XYZ, KVA, NOG och DTK.
              </p>
            </div>
            <div className="p-6 rounded-2xl border-2 border-border">
              <h3 className="text-xl font-bold mb-2">Personlig statistik</h3>
              <p className="text-text-muted">
                Se din utveckling och identifiera forbattringsomraden.
              </p>
            </div>
            <div className="p-6 rounded-2xl border-2 border-border">
              <h3 className="text-xl font-bold mb-2">AI-coach</h3>
              <p className="text-text-muted">
                Fa personlig hjalp och forklaringar fran din AI-coach.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
