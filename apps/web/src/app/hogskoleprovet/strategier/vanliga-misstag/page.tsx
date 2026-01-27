import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/lib/structured-data";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";

const BASE_URL = "https://maxa.se";

export const metadata: Metadata = {
  title: "Vanliga Misstag på Högskoleprovet - Undvik Dessa Fallgropar | Maxa",
  description:
    "Lär dig känna igen de vanligaste misstagen på högskoleprovet och hur du undviker dem. Strategiska, tekniska och mentala fel som sänker ditt resultat.",
  keywords: [
    "vanliga misstag högskoleprovet",
    "hp tips",
    "högskoleprovet strategi",
    "hp fallgropar",
    "högskoleprovet fel",
    "hp teknik",
    "högskoleprovet misstag",
  ],
  alternates: {
    canonical: "/hogskoleprovet/strategier/vanliga-misstag",
  },
  openGraph: {
    title: "Vanliga Misstag på Högskoleprovet - Undvik Dessa Fallgropar",
    description:
      "Lär dig känna igen de vanligaste misstagen på högskoleprovet och hur du undviker dem.",
    type: "article",
    url: "/hogskoleprovet/strategier/vanliga-misstag",
  },
};

// Breadcrumb JSON-LD for Hem > Högskoleprovet > Strategier > Vanliga Misstag
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
      name: "Vanliga Misstag",
      // Final item omits 'item' property per Google docs
    },
  ],
};

// Article JSON-LD
const articleJsonLd: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Vanliga Misstag på Högskoleprovet - Undvik Dessa Fallgropar",
  datePublished: "2026-01-27",
  publisher: {
    "@type": "Organization",
    name: "Maxa",
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/hogskoleprovet/strategier/vanliga-misstag`,
  },
};

export default function VanligaMisstagPage() {
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
            Vanliga misstag på högskoleprovet
          </h1>
          <p className="text-lg text-foreground-muted mb-8">
            Undvik fällorna som kostar dig poäng
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
                  De flesta provtagare förlorar poäng på misstag i teknik, inte
                  kunskap
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Tidsoptimism är den största fällan – budgetera din tid per
                  fråga
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Lämna aldrig tomt – det finns ingen minuspoäng för fel svar
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Din första instinkt är rätt i cirka 70% av fallen
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Läs frågan ordentligt – många svarar rätt på fel fråga
                </span>
              </li>
            </ul>
          </div>

          {/* Content Section 1: Strategiska misstag */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Strategiska misstag
            </h2>
            <p className="text-foreground-muted mb-6">
              Dessa misstag handlar om hur du närmar dig provet som helhet.
              De kostar dig mer poäng än du tror.
            </p>

            <div className="space-y-8">
              {/* Tidsoptimism */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  1. Tidsoptimism – att fastna på svåra frågor
                </h3>
                <p className="text-foreground mb-3">
                  Du har 55 minuter per provpass. Det låter som mycket, men det
                  går fortare än du tror. Att spendera 5 minuter på en svår
                  fråga betyder att du missar 3-4 enkla frågor i slutet.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Varför det händer:</span> Du vill
                  inte ge upp. Din hjärna säger &quot;bara lite till, sen löser jag
                  den&quot;. Men tiden rinner ut.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Sätt en
                  tidsbudget per fråga innan du börjar. Om du fastnar i mer än
                  2 minuter – markera frågan, gissa, och gå vidare. Kom
                  tillbaka om du har tid över.
                </p>
              </div>

              {/* Perfektionism */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  2. Perfektionism – att kräva 100% säkerhet
                </h3>
                <p className="text-foreground mb-3">
                  Högskoleprovet är designat för att ingen ska få alla rätt. Om
                  du väntar på 100% säkerhet innan du svarar hinner du aldrig
                  klart.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Forskning visar:</span> Din första
                  instinkt är rätt i cirka 70% av fallen. När du tvivlar och
                  byter svar, byter du oftare från rätt till fel än tvärtom.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Lita på din första
                  känsla. Om du har 70-80% säkerhet – svara och gå vidare. Slösa
                  inte tid på att leta efter absolut visshet.
                </p>
              </div>

              {/* Att lämna blankt */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  3. Att lämna tomma rader – att inte gissa
                </h3>
                <p className="text-foreground mb-3">
                  Det finns <span className="font-bold">ingen minuspoäng</span>{" "}
                  på högskoleprovet. Ett fel svar ger 0 poäng. Ett tomt svar ger
                  0 poäng. Men ett gissat svar ger dig en chans.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Matematik:</span> Med 4
                  svarsalternativ har du 25% chans att gissa rätt. Om du lämnar
                  10 frågor tomma förlorar du statistiskt 2-3 poäng.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Gissa ALLTID på
                  frågor du inte hinner med. I sista minuten: välj en
                  &quot;gissningsbokstav&quot; (t.ex. C) och fyll i alla tomma rader med
                  den.
                </p>
              </div>

              {/* Fel prioritering */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  4. Fel prioritering – svårt före enkelt
                </h3>
                <p className="text-foreground mb-3">
                  Många börjar med fråga 1 och jobbar sig igenom i ordning. När
                  tiden tar slut har de missat 5 enkla frågor längre bak medan
                  de kämpade med 2 svåra i början.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Problem:</span> Alla frågor ger
                  lika mycket poäng. En lätt fråga du klarar på 30 sekunder är
                  lika mycket värd som en svår du kämpar med i 5 minuter.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Använd
                  &quot;tvåpass-strategin&quot;. Pass 1: Svara på alla frågor du är säker
                  på. Pass 2: Gå tillbaka och jobba på de svåra. Säkra de enkla
                  poängen först.
                </p>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning strategiska misstag:
              </p>
              <p className="text-foreground mt-2">
                Tidsbudget, lita på din första instinkt, gissa alltid, och ta
                de enkla frågorna först. Provet är en tävling mot klockan –
                teknik vinner över perfektion.
              </p>
            </div>
          </section>

          {/* Content Section 2: Tekniska misstag */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tekniska misstag
            </h2>
            <p className="text-foreground-muted mb-6">
              Dessa misstag handlar om hur du läser och tolkar frågorna. De är
              ofta &quot;slarvfel&quot; som känns onödiga i efterhand.
            </p>

            <div className="space-y-8">
              {/* Provteknik vs kunskap */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  1. Fokus på kunskap istället för teknik
                </h3>
                <p className="text-foreground mb-3">
                  Många tror att de behöver plugga mer matematik eller mer
                  svenska för att bli bättre på högskoleprovet. Men provet
                  testar inte hur mycket du kan – det testar hur bra du är på
                  att undvika fällor.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Exempel:</span> En elev med 22.5 i
                  gymnasiebetyg kan få 1.1 på HP om hen inte förstår provets
                  spelregler. En elev med 18.0 kan få 1.6 genom smart träning.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Träna på gamla
                  prov. Analysera varje fel: &quot;Var det en kunskapsbrist eller en
                  teknikbrist?&quot; Oftast är det teknik.
                </p>
              </div>

              {/* Läsa frågan för snabbt */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  2. Att läsa frågan för snabbt
                </h3>
                <p className="text-foreground mb-3">
                  Det klassiska misstaget: Du räknar fram rätt svar, men frågan
                  var &quot;Hur många <span className="font-bold">fler</span> äpplen
                  har A än B?&quot; – inte &quot;Hur många äpplen har A?&quot;. Du svarar på
                  fel fråga.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Fällan:</span> Provkonstruktörerna
                  vet detta. Därför finns ditt mellansteg ofta som ett
                  svarsalternativ. Din hjärna ser sitt eget tal i listan och
                  klickar direkt.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Läs frågan två
                  gånger. Första gången: förstå vad som efterfrågas. Andra
                  gången: svara. Ta extra tid på nyckelord som &quot;fler&quot;, &quot;skillnad&quot;,
                  &quot;totalt&quot;.
                </p>
              </div>

              {/* Inte eliminera */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  3. Att inte använda eliminering
                </h3>
                <p className="text-foreground mb-3">
                  Du är osäker mellan två alternativ. Istället för att gissa
                  50/50, kan du ofta eliminera 1-2 alternativ och öka dina odds
                  till 50% eller 33%.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Teknik:</span> I XYZ: Eliminera
                  extremvärden (ofta är högsta och lägsta talet fel). I LÄS:
                  Eliminera alternativ med &quot;alltid&quot; eller &quot;aldrig&quot; (texten är
                  sällan så kategorisk).
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Gör eliminering
                  till en vana. Innan du gissar, fråga: &quot;Vilka alternativ kan
                  jag definitivt utesluta?&quot;
                </p>
              </div>

              {/* Enhetsmisstag */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  4. Att glömma enheter och skalor
                </h3>
                <p className="text-foreground mb-3">
                  DTK-delen är full av dessa fällor. Diagrammet visar
                  &quot;tusental kronor&quot; men du läser det som &quot;kronor&quot;. Eller
                  y-axeln börjar på 50 istället för 0, vilket gör små skillnader
                  se enorma ut.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Klassiskt exempel:</span>{" "}
                  Diagrammet visar 500 (tusental kr). Rätt svar är 500 000 kr.
                  Fel svar (som finns som alternativ): 500 kr. I stressen missar
                  du texten &quot;(1000-tal)&quot;.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Läs axlarna FÖRST
                  innan du tittar på grafen. Kolla enheter. Kolla var y-axeln
                  börjar. Detta tar 5 sekunder men räddar dig från dumma fel.
                </p>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning tekniska misstag:
              </p>
              <p className="text-foreground mt-2">
                Fokusera på provteknik, läs frågan två gånger, använd
                eliminering, och dubbelkolla enheter. Små rutiner räddar stora
                poäng.
              </p>
            </div>
          </section>

          {/* Content Section 3: Mentala misstag */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Mentala misstag
            </h2>
            <p className="text-foreground-muted mb-6">
              Högskoleprovet är lika mycket en mental utmaning som en
              kunskapstävling. Dessa misstag handlar om hur du hanterar stress
              och trötthet.
            </p>

            <div className="space-y-8">
              {/* Panikreaktion */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  1. Panikreaktion vid svåra frågor
                </h3>
                <p className="text-foreground mb-3">
                  Du stöter på en fråga du inte förstår. Din hjärna börjar
                  stressa: &quot;Alla andra kan säkert detta. Jag kommer att
                  misslyckas.&quot; Koncentrationen försvinner.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Sanningen:</span> Svåra frågor är
                  designade för att vara svåra för alla. De är där för att
                  skapa normalfördelningen. Om du gissar rätt på dem, bra. Om
                  inte, har de flesta andra också fel.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Acceptera att några
                  frågor är omöjliga. När du känner paniken komma: ta ett djupt
                  andetag, gissa, och gå vidare. Varje fråga är en ny chans.
                </p>
              </div>

              {/* Trötthet */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  2. Att inte hantera mental trötthet
                </h3>
                <p className="text-foreground mb-3">
                  Högskoleprovet består av 5 provpass på en dag. Pass 5 är
                  betydligt svårare än pass 1 – inte för att frågorna är
                  svårare, utan för att din hjärna är utmattad.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Kognitiv utmattning:</span> Efter
                  3-4 timmars intensivt tänkande sjunker din förmåga att
                  fokusera och fatta beslut. Du börjar göra slarvfel.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> Träna uthållighet
                  genom att göra hela gamla prov i ett svep. Ät lätt mat i
                  pauserna (tunga måltider tröttär ut dig mer). Ha en mental
                  ritual mellan passen för att &quot;återställa&quot;.
                </p>
              </div>

              {/* Övertro på känsla */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  3. Övertro på magkänsla istället för analys
                </h3>
                <p className="text-foreground mb-3">
                  I verbala delen, särskilt LÄS, lutar sig många på &quot;det här
                  känns rätt&quot; istället för att faktiskt kolla vad texten säger.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Fällan:</span> Ett svarsalternativ
                  säger något du vet är sant i verkligheten. Men det står inte i
                  texten. Provet testar läsförståelse, inte allmänbildning.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Motdrag:</span> För varje svar i
                  LÄS: Fråga dig &quot;Kan jag peka på raden där detta står?&quot; Om nej
                  – det är fel, hur rimligt det än låter.
                </p>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning mentala misstag:
              </p>
              <p className="text-foreground mt-2">
                Hantera panik genom att acceptera svåra frågor, bygg uthållighet
                genom träning, och lita på analys istället för magkänsla.
              </p>
            </div>
          </section>

          {/* Quick Reference List */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              De 11 vanligaste misstagen – snabbreferens
            </h2>
            <div className="bg-card-background border-2 border-border rounded-2xl p-6">
              <ol className="space-y-3 text-foreground">
                <li>
                  <span className="font-bold">Tidsoptimism</span> – Fastna inte
                  på svåra frågor i mer än 2 minuter
                </li>
                <li>
                  <span className="font-bold">Perfektionism</span> – Din första
                  instinkt är rätt i 70% av fallen
                </li>
                <li>
                  <span className="font-bold">Lämna tomt</span> – Gissa alltid,
                  ingen minuspoäng
                </li>
                <li>
                  <span className="font-bold">Fel prioritering</span> – Ta de
                  enkla frågorna först
                </li>
                <li>
                  <span className="font-bold">Kunskap över teknik</span> –
                  Träna provteknik, inte bara ämneskunskap
                </li>
                <li>
                  <span className="font-bold">Läsa för snabbt</span> – Läs
                  frågan två gånger
                </li>
                <li>
                  <span className="font-bold">Inte eliminera</span> – Använd
                  elimineringsstrategin för att öka odds
                </li>
                <li>
                  <span className="font-bold">Glömma enheter</span> – Läs
                  axlar och enheter först i DTK
                </li>
                <li>
                  <span className="font-bold">Panikreaktion</span> – Svåra
                  frågor är svåra för alla
                </li>
                <li>
                  <span className="font-bold">Mental trötthet</span> – Träna
                  uthållighet för 5 provpass
                </li>
                <li>
                  <span className="font-bold">Övertro på känsla</span> – Analys
                  över magkänsla i LÄS
                </li>
              </ol>
            </div>
          </section>

          {/* Final Recap */}
          <section className="pt-8 border-t-2 border-border mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sammanfattning
            </h2>
            <div className="space-y-4 text-foreground">
              <p>
                <span className="font-bold">1. Strategiska misstag</span> kostar
                dig mest. Tidsbudget, eliminera perfektionism, gissa alltid,
                och prioritera enkla frågor först. Detta är grundläggande
                provteknik som många missar.
              </p>
              <p>
                <span className="font-bold">2. Tekniska misstag</span> känns
                onödiga i efterhand men är lätta att göra under stress. Fokusera
                på provteknik istället för bara kunskap, läs frågan ordentligt,
                använd eliminering, och dubbelkolla enheter.
              </p>
              <p>
                <span className="font-bold">3. Mentala misstag</span> uppstår
                när stressen tar över. Acceptera att vissa frågor är omöjliga,
                träna din uthållighet för hela provdagen, och lita på systematisk
                analys istället för magkänsla.
              </p>
              <p className="pt-4">
                <span className="font-bold">Nyckeln:</span> De flesta förlorar
                poäng på teknik, inte kunskap. Genom att känna igen dessa
                misstag och aktivt motarbeta dem kan du höja ditt resultat med
                0.3-0.5 utan att plugga en enda ny mattesats eller svenskt ord.
              </p>
            </div>
          </section>

          {/* Related strategies */}
          <section className="bg-card-background border-2 border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Relaterade strategier
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/hogskoleprovet/strategier/kvantitativa-fallor"
                className="p-4 bg-background rounded-xl border-2 border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">
                  Kvantitativa fällor
                </h3>
                <p className="text-sm text-foreground-muted">
                  Lär dig känna igen fällorna i XYZ, KVA, NOG och DTK
                </p>
              </Link>
              <Link
                href="/hogskoleprovet/strategier/verbala-fallor"
                className="p-4 bg-background rounded-xl border-2 border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">
                  Verbala fällor
                </h3>
                <p className="text-sm text-foreground-muted">
                  Undvik misstagen i ORD, LÄS, MEK och ELF
                </p>
              </Link>
              <Link
                href="/hogskoleprovet/strategier/tidsstrategi"
                className="p-4 bg-background rounded-xl border-2 border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">
                  Tidsstrategi
                </h3>
                <p className="text-sm text-foreground-muted">
                  Maximera poängen per minut med rätt tidsplanering
                </p>
              </Link>
              <Link
                href="/hogskoleprovet"
                className="p-4 bg-background rounded-xl border-2 border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">
                  Öva med gamla prov
                </h3>
                <p className="text-sm text-foreground-muted">
                  Tillämpa strategierna på riktiga högskoleprov
                </p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
