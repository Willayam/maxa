import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/lib/structured-data";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";

const BASE_URL = "https://maxa.se";

export const metadata: Metadata = {
  title: "Kvantitativa Fällor på Högskoleprovet - XYZ, KVA, NOG, DTK | Maxa",
  description:
    "Undvik de vanligaste fällorna i kvantitativa delen av högskoleprovet. Lär dig känna igen mellanräkningsfällan, enhetsförbistring och andra tricks i XYZ, KVA, NOG och DTK.",
  keywords: [
    "kvantitativa delen hogskoleprovet",
    "xyz fallor",
    "kva tips",
    "nog strategi",
    "dtk fallor",
    "hogskoleprovet matte",
    "hp kvantitativa",
  ],
  alternates: {
    canonical: "/hogskoleprovet/strategier/kvantitativa-fallor",
  },
  openGraph: {
    title: "Kvantitativa Fällor på Högskoleprovet - XYZ, KVA, NOG, DTK",
    description:
      "Undvik de vanligaste fällorna i kvantitativa delen. Lär dig känna igen mellanräkningsfällan, enhetsförbistring och andra tricks.",
    type: "article",
    url: "/hogskoleprovet/strategier/kvantitativa-fallor",
  },
};

// Breadcrumb JSON-LD: Hem > Högskoleprovet > Strategier > Kvantitativa Fällor
const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Hem",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Högskoleprovet",
      item: `${BASE_URL}/hogskoleprovet`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Strategier",
      item: `${BASE_URL}/hogskoleprovet/strategier`,
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Kvantitativa Fällor",
      // Final item omits 'item' property per Google docs
    },
  ],
};

// Article JSON-LD
const articleJsonLd: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Kvantitativa Fällor på Högskoleprovet - XYZ, KVA, NOG, DTK",
  datePublished: "2026-01-27",
  publisher: {
    "@type": "Organization",
    name: "Maxa",
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/hogskoleprovet/strategier/kvantitativa-fallor`,
  },
};

export default function KvantitativaFallorPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            href="/hogskoleprovet/strategier"
            className="text-foreground-muted hover:text-primary transition-colors mb-6 inline-flex items-center gap-2 text-sm"
          >
            <span>←</span> Strategier
          </Link>

          {/* Page header */}
          <h1 className="text-4xl font-extrabold text-foreground mb-2">
            Kvantitativa fällor
          </h1>
          <p className="text-lg text-foreground-muted mb-8">
            Så undviker du de vanligaste misstagen i XYZ, KVA, NOG och DTK
          </p>

          {/* TL;DR Section */}
          <div className="bg-primary/10 border-2 border-primary rounded-2xl p-6 mb-12">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Snabbguide
            </h2>
            <ul className="space-y-2 text-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Mellanräkningsfällan:</strong> Det tal du räknar fram
                  i ett mellansteg finns ofta som distraktor – läs alltid frågan
                  till slutet
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Enhetsförbistring:</strong> Kolla alltid om frågan är
                  i meter men svarsalternativen i centimeter (eller tvärtom)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>KVA-fällan:</strong> Testa alltid negativa tal, noll
                  och bråk mellan 0 och 1 – inte bara positiva heltal
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>NOG-fällan:</strong> Räkna inte ut svaret – fråga bara
                  om det går att lösa med informationen
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>DTK-fällan:</strong> Läs alltid y-axelns startvärde
                  innan du tittar på grafen – en kapad axel lurar ögat
                </span>
              </li>
            </ul>
          </div>

          {/* XYZ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              XYZ – Matematisk problemlösning
            </h2>
            <p className="text-foreground-muted mb-6">
              XYZ-delen testar grundläggande matematik: aritmetik, algebra och
              geometri. De vanligaste fällorna bygger på att du gör precis det
              som känns naturligt – men stannar för tidigt i uträkningen.
            </p>

            {/* Mellanräkningsfällan */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Mellanräkningsfällan
            </h3>
            <p className="text-foreground mb-4">
              Detta är den absolut vanligaste fällan i XYZ.Uppgiften kräver att
              du räknar ut något i flera steg – till exempel: &ldquo;Först beräkna x,
              sedan använd x för att räkna ut 2x + 3&rdquo;. Det värde du räknar fram
              i det första steget (x) finns ofta som ett svarsalternativ.
            </p>
            <p className="text-foreground mb-4">
              När hjärnan ser ett tal i svarsraderna som matchar det du precis
              räknat fram uppstår en omedelbar känsla av &ldquo;ja, det stämmer!&rdquo; och
              du markerar reflexmässigt. Men frågan frågade efter något annat.
            </p>

            <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">⚠️ Vanligt misstag</p>
              <p className="text-foreground text-sm">
                En rektangel har bredden 5 cm och arean 40 cm². Frågan: &ldquo;Vad är
                rektangelns omkrets?&rdquo; Du räknar: 40/5 = 8 (längden). Ser 8 som
                alternativ B och markerar direkt. Men frågan frågade efter
                omkrets (2 × 5 + 2 × 8 = 26 cm).
              </p>
            </div>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Skriv ner vad frågan faktiskt frågar efter innan du börjar
                räkna. Ring in det med penna. När du får fram ett tal, titta på
                din markering: &ldquo;Är detta verkligen det jag söker?&rdquo;
              </p>
            </div>

            {/* Enhetsfällan */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Enhetsfällan
            </h3>
            <p className="text-foreground mb-4">
              Frågan anger värden i en enhet (t.ex. meter), men svarsalternativen
              är angivna i en annan enhet (t.ex. centimeter eller kvadratmeter).
              Det numeriska värdet du räknat fram finns alltid som ett alternativ
              – men med fel enhet.
            </p>
            <p className="text-foreground mb-6">
              Under tidspress är det lätt att missa texten &ldquo;(i cm)&rdquo; eller &ldquo;i
              tusental&rdquo; vid svarsraderna. Du ser ditt tal och markerar.
            </p>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Läs alltid enheten i svarsalternativen FÖRST, innan du börjar
                räkna. Om frågan är i meter men svaren i centimeter, multiplice
                ra ditt slutresultat med 100 innan du letar efter det bland
                alternativen.
              </p>
            </div>

            {/* Algebraiska missuppfattningar */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Algebraiska missuppfattningar
            </h3>
            <p className="text-foreground mb-4">
              Vissa algebrafel är så vanliga att de nästan alltid finns med som
              distraktorer:
            </p>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>
                <strong>Teckenfel med parenteser:</strong> a - (b + c) blir
                felaktigt a - b + c istället för a - b - c
              </li>
              <li>
                <strong>Kvadreringsfel:</strong> (a + b)² blir felaktigt a² + b²
                istället för a² + 2ab + b²
              </li>
              <li>
                <strong>Rotfel:</strong> √(a² + b²) blir felaktigt a + b
                istället av att lämnas som rot
              </li>
            </ul>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">
                Sammanfattning XYZ
              </p>
              <p className="text-foreground text-sm">
                De tre vanligaste fällorna i XYZ är mellanräkningsfällan
                (mellansteget finns som alternativ), enhetsfällan (rätt tal men
                fel enhet) och algebraiska missuppfattningar (klassiska regler
                som glöms bort). Motdraget är att läsa frågan noga, markera vad
                som efterfrågas och dubbelkolla enheter.
              </p>
            </div>
          </section>

          {/* KVA Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              KVA – Kvantitativa jämförelser
            </h2>
            <p className="text-foreground-muted mb-6">
              KVA skiljer sig från andra delprov eftersom du inte räknar ut ett
              exakt svar utan jämför två kvantiteter (I och II). Fällan här är
              att du gör omedvetna antaganden om variablerna.
            </p>

            {/* Begränsade antaganden */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Fällan med begränsade antaganden
            </h3>
            <p className="text-foreground mb-4">
              När du ser &ldquo;x är ett tal&rdquo; antar hjärnan automatiskt att x är ett
              positivt heltal (typ 1, 2, 3...). Men om inget annat anges kan x
              vara noll, negativt, eller ett bråk mellan 0 och 1.
            </p>
            <p className="text-foreground mb-4">
              Exempel: Kvantitet I är x². Kvantitet II är x. Vad gäller?
            </p>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>Om x = 2: x² = 4, x = 2. Alltså I {">"} II</li>
              <li>Om x = 1: x² = 1, x = 1. Alltså I = II</li>
              <li>Om x = 0,5: x² = 0,25, x = 0,5. Alltså I {"<"} II</li>
              <li>Om x = 0: x² = 0, x = 0. Alltså I = II</li>
              <li>
                Om x = -2: x² = 4 (positivt), x = -2. Alltså I {">"} II
              </li>
            </ul>
            <p className="text-foreground mb-6">
              Eftersom relationen varierar beroende på vilket värde x har, är
              svaret &ldquo;Informationen är otillräcklig&rdquo; (alternativ D).
            </p>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Testa alltid minst fyra värden: 2, 1, 0,5 och -1. Om relationen
                håller för alla fyra, välj A, B eller C. Om den växlar, välj D.
              </p>
            </div>

            {/* Geometriska synvillor */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Geometriska synvillor
            </h3>
            <p className="text-foreground mb-6">
              Figurer i KVA är inte nödvändigtvis skalenliga. En vinkel som ser
              ut att vara 90 grader kan vara 89 eller 91 grader. Ett ögonmått
              räcker inte.
            </p>

            <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">⚠️ Vanligt misstag</p>
              <p className="text-foreground text-sm">
                Du ser en triangel som ser liksidig ut och antar att alla sidor
                är lika. Men om texten inte säger &ldquo;liksidig triangel&rdquo;, kan
                sidorna ha olika längd trots det visuella intrycket.
              </p>
            </div>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">
                Sammanfattning KVA
              </p>
              <p className="text-foreground text-sm">
                KVA:s största fälla är att du antar att variabler är positiva
                heltal. Testa alltid gränsfall (0, negativa tal, bråk mellan 0
                och 1). Lita aldrig på ögonmått i figurer – endast vad texten
                uttryckligen anger.
              </p>
            </div>
          </section>

          {/* NOG Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              NOG – Kvantitativa resonemang
            </h2>
            <p className="text-foreground-muted mb-6">
              NOG-delen testar logisk suficiens: räcker informationen för att
              lösa uppgiften? Det vanligaste misstaget är att faktiskt räkna ut
              svaret – vilket slösar tid och ökar risken för fel.
            </p>

            {/* C-fällan */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              C-fällan (Kombinationsfällan)
            </h3>
            <p className="text-foreground mb-4">
              Många läser påstående (1), ser att det inte räcker. Läser påstående
              (2), ser att det inte heller räcker. Slår mentalt ihop (1) och (2)
              och upptäcker att uppgiften går att lösa. Svarar C: &ldquo;Båda
              påståendena tillsammans, men inget påstående för sig, är
              tillräckliga för att besvara frågan.&rdquo;
            </p>
            <p className="text-foreground mb-6">
              Felet: De glömde att kontrollera om (1) eller (2) faktiskt räckte
              för sig själva om man tänkte ett steg längre. Ofta är svaret
              egentligen D (båda påståendena var för sig räcker).
            </p>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Täck över påstående (2). Räcker (1) för sig själv? Testa
                noggrant. Täck sedan över (1). Räcker (2) för sig själv? Om båda
                räcker ensamma är svaret D. Om ingen räcker ensam men tillsammans
                funkar det, då är svaret C.
              </p>
            </div>

            {/* Sufficiency vs solving */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Suficiens vs. lösning
            </h3>
            <p className="text-foreground mb-4">
              NOG testar om du kan lösa uppgiften, inte att du faktiskt löser
              den. Att räkna ut det exakta svaret är slöseri med tid.
            </p>
            <p className="text-foreground mb-6">
              Exempel: &ldquo;Hur stor är arean av en rektangel?&rdquo; (1) Ger bredden 4 cm
              och omkretsen 18 cm. Räcker detta? Ja, eftersom omkrets = 2 × (b +
              l) ger 18 = 2 × (4 + l), alltså l = 5. Men du behöver inte räkna
              ut l = 5 eller arean 20. Det räcker att inse att det går att räkna
              ut.
            </p>

            {/* Överinformation */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Överinformation
            </h3>
            <p className="text-foreground mb-6">
              Ibland ger ett påstående information som är redundant eller
              ovidkommande. Detta testar om du kan skilja väsentlig från
              överflödig information. Om (1) ger tre fakta men bara två behövs,
              räcker (1) fortfarande.
            </p>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">
                Sammanfattning NOG
              </p>
              <p className="text-foreground text-sm">
                NOG:s stora fälla är C-fällan: att kombinera påståendena för
                tidigt utan att testa om de räcker var för sig. Motdraget är att
                testa (1) isolerat, sedan (2) isolerat, och bara då gå vidare
                till kombinationen. Slösa inte tid på att räkna ut exakta svar.
              </p>
            </div>
          </section>

          {/* DTK Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              DTK – Diagram, Tabeller och Kartor
            </h2>
            <p className="text-foreground-muted mb-6">
              DTK handlar om att tolka stora mängder data snabbt. Fällorna här
              utnyttjar visuella synvillor och slarv vid avläsning.
            </p>

            {/* Kapade y-axeln */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Den kapade y-axeln
            </h3>
            <p className="text-foreground mb-4">
              En klassisk fälla i statistik är att y-axeln inte börjar på noll.
              En stapel som representerar värdet 105 kan se dubbelt så hög ut
              som en stapel för 100 om axeln börjar på 95.
            </p>
            <p className="text-foreground mb-6">
              Hjärnan gör automatiskt en visuell bedömning: &ldquo;Det är dubbelt så
              mycket!&rdquo; Men när du läser av siffrorna är skillnaden minimal.
            </p>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Läs alltid y-axelns startvärde INNAN du tittar på staplarna
                eller kurvorna. Är det inte noll? Då är grafen manipulerad för
                att överdriva skillnader.
              </p>
            </div>

            {/* Enhetsförbistring */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Enhetsförbistring
            </h3>
            <p className="text-foreground mb-4">
              Diagrammet visar &ldquo;500&rdquo; och vid axeln står det litet &ldquo;(tusental
              kr)&rdquo;. Rätt svar är 500 000 kr. Men distraktorn är &ldquo;500 kr&rdquo; – det
              numeriska värdet utan konvertering.
            </p>
            <p className="text-foreground mb-6">
              Under stress missar ögat lätt den lilla texten vid axeln. Du läser
              av 500 och markerar alternativet &ldquo;500&rdquo;.
            </p>

            <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">⚠️ Vanligt misstag</p>
              <p className="text-foreground text-sm">
                Stapeln visar 75 och axeln säger &ldquo;(miljoner kr)&rdquo;. Du ser
                alternativet &ldquo;75 000 kr&rdquo; och markerar. Korrekt svar: 75 000 000
                kr.
              </p>
            </div>

            {/* Kategoriförbistring */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Kategoriförbistring (Matrix Confusion)
            </h3>
            <p className="text-foreground mb-4">
              I stora tabeller med många rader och kolumner (t.ex. &ldquo;Män 2020&rdquo;,
              &ldquo;Kvinnor 2020&rdquo;, &ldquo;Män 2025&rdquo;, &ldquo;Kvinnor 2025&rdquo;) ligger informationen
              tätt.
            </p>
            <p className="text-foreground mb-6">
              Frågan gäller &ldquo;Kvinnor 2025&rdquo;. Ögat halkar lätt en rad upp eller en
              kolumn åt sidan. Värdet från den felaktiga cellen finns alltid som
              ett svarsalternativ.
            </p>

            {/* Relativa vs absoluta tal */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Relativa vs absoluta tal
            </h3>
            <p className="text-foreground mb-4">
              Diagrammet visar procent (andel), men frågan gäller antal (absolut
              tal). Eller tvärtom.
            </p>
            <p className="text-foreground mb-6">
              Exempel: 40% av grupp A och 30% av grupp B. Frågan: &ldquo;Vilken grupp
              har flest personer?&rdquo; Utan att veta totalmängden för A och B går
              det inte att avgöra. Om grupp A har 100 personer (40 st) och grupp
              B har 200 personer (60 st), har B fler trots lägre procent.
            </p>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">
                Sammanfattning DTK
              </p>
              <p className="text-foreground text-sm">
                DTK:s fällor är visuella synvillor (kapad y-axel),
                enhetsförbistring (tusental, miljoner), kategoriförbistring
                (läsa fel rad/kolumn) och förväxling av relativa vs absoluta tal
                (procent vs antal). Motdraget är att alltid läsa axlar, enheter
                och kategorier noggrant innan du svarar.
              </p>
            </div>
          </section>

          {/* Summary Table */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Snabbreferens: Fällor och motdrag
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-2 border-border rounded-xl overflow-hidden">
                <thead className="bg-card-background">
                  <tr>
                    <th className="border-b border-border p-3 text-left text-foreground font-bold">
                      Delprov
                    </th>
                    <th className="border-b border-border p-3 text-left text-foreground font-bold">
                      Fälla
                    </th>
                    <th className="border-b border-border p-3 text-left text-foreground font-bold">
                      Hur den fungerar
                    </th>
                    <th className="border-b border-border p-3 text-left text-foreground font-bold">
                      Motdrag
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">XYZ</td>
                    <td className="p-3 text-foreground">Mellanräkning</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Mellansteget finns som alternativ
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Markera vad frågan söker innan du räknar
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">XYZ</td>
                    <td className="p-3 text-foreground">Enhet</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Rätt tal men fel enhet (m vs cm)
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Läs enheten i svarsalternativen först
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">XYZ</td>
                    <td className="p-3 text-foreground">Algebra</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Teckenfel, kvadreringsfel
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Dubbelkolla parenteser och kvadrater
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">KVA</td>
                    <td className="p-3 text-foreground">Antaganden</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Anta att x är positivt heltal
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Testa 2, 1, 0.5, -1
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">KVA</td>
                    <td className="p-3 text-foreground">Geometri</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Figurer är inte skalenliga
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Lita bara på text, inte ögonmått
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">NOG</td>
                    <td className="p-3 text-foreground">C-fällan</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Kombinera (1) och (2) för tidigt
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Testa (1) ensamt, sedan (2) ensamt
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">NOG</td>
                    <td className="p-3 text-foreground">Räkna ut</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Slösa tid på att räkna exakt svar
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Fråga bara: Kan jag lösa detta?
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">DTK</td>
                    <td className="p-3 text-foreground">Kapad axel</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Y-axeln börjar på 95 istället för 0
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Läs startvärdet innan du tittar på grafen
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">DTK</td>
                    <td className="p-3 text-foreground">Enhet</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Tusental, miljoner, procent
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Läs enhetsangivelsen vid axeln
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-foreground font-bold">DTK</td>
                    <td className="p-3 text-foreground">Procent vs antal</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Diagram visar andel, frågan gäller antal
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Kolla om totalmängden finns angiven
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Final Recap */}
          <section className="border-t-2 border-border pt-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sammanfattning
            </h2>
            <ol className="list-decimal list-inside text-foreground space-y-3">
              <li>
                <strong>XYZ – Matematisk problemlösning:</strong> De tre stora
                fällorna är mellanräkningsfällan (mellansteget finns som
                alternativ), enhetsfällan (rätt tal men fel enhet) och
                algebraiska missuppfattningar (glömda regler för parenteser och
                kvadrater). Motdraget är att markera vad frågan söker, läsa
                enheter noggrant och dubbelkolla algebraiska steg.
              </li>
              <li>
                <strong>KVA – Kvantitativa jämförelser:</strong> Största fällan
                är att anta att variabler är positiva heltal. Testa alltid
                gränsfall: negativa tal, noll och bråk mellan 0 och 1. Lita
                aldrig på ögonmått i figurer – endast textens explicita
                information gäller.
              </li>
              <li>
                <strong>NOG – Kvantitativa resonemang:</strong> C-fällan är att
                kombinera påståendena för tidigt. Testa alltid (1) isolerat,
                sedan (2) isolerat. Om båda räcker ensamma är svaret D, inte C.
                Slösa inte tid på att räkna ut exakta svar – fråga bara om det
                går att lösa.
              </li>
              <li>
                <strong>DTK – Diagram, Tabeller och Kartor:</strong> Fällorna
                är visuella synvillor (kapad y-axel), enhetsförbistring
                (tusental, miljoner), kategoriförbistring (fel rad/kolumn) och
                förväxling av relativa vs absoluta tal. Motdraget är att alltid
                läsa axlar, enheter och kategorier innan du svarar.
              </li>
            </ol>
          </section>

          {/* Related Strategies Section */}
          <section className="border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Relaterade strategier
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/hogskoleprovet/strategier/verbala-fallor"
                className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
              >
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Verbala fällor
                </h3>
                <p className="text-foreground-muted mb-4">
                  Undvik fallorna i ORD, LÄS, MEK och ELF. Falska vänner och
                  betydelseförskjutningar.
                </p>
                <span className="text-primary font-bold">Läs mer →</span>
              </Link>

              <Link
                href="/hogskoleprovet/strategier/vanliga-misstag"
                className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
              >
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Vanliga misstag
                </h3>
                <p className="text-foreground-muted mb-4">
                  De 12 vanligaste misstagen som sänker ditt resultat – och hur
                  du undviker dem.
                </p>
                <span className="text-primary font-bold">Läs mer →</span>
              </Link>

              <Link
                href="/hogskoleprovet/strategier/tidsstrategi"
                className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
              >
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Tidsstrategi
                </h3>
                <p className="text-foreground-muted mb-4">
                  Planera ditt prov och maximera poängen per minut. Lär dig när
                  du ska gissa.
                </p>
                <span className="text-primary font-bold">Läs mer →</span>
              </Link>

              <Link
                href="/hogskoleprovet"
                className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
              >
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Öva med gamla prov
                </h3>
                <p className="text-foreground-muted mb-4">
                  Testa dina nya kunskaper på riktiga högskoleprov med facit och
                  normering.
                </p>
                <span className="text-primary font-bold">Till proven →</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
