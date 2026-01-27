import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/lib/structured-data";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";

const BASE_URL = "https://maxa.se";

export const metadata: Metadata = {
  title: "Verbala Fällor på Högskoleprovet - ORD, LÄS, MEK, ELF | Maxa",
  description:
    "Undvik de vanligaste fällorna i verbala delen av högskoleprovet. Lär dig känna igen falska vänner, sekundära betydelser och andra tricks i ORD, LÄS, MEK och ELF.",
  keywords: [
    "verbala delen hogskoleprovet",
    "ord fallor",
    "lasforstaelse hp",
    "mek tips",
    "elf strategi",
    "hogskoleprovet svenska",
    "hp verbala",
  ],
  alternates: {
    canonical: "/hogskoleprovet/strategier/verbala-fallor",
  },
  openGraph: {
    title: "Verbala Fällor på Högskoleprovet - ORD, LÄS, MEK, ELF",
    description:
      "Undvik de vanligaste fällorna i verbala delen. Lär dig känna igen falska vänner, sekundära betydelser och andra tricks.",
    type: "article",
    url: "/hogskoleprovet/strategier/verbala-fallor",
  },
};

// Breadcrumb JSON-LD: Hem > Högskoleprovet > Strategier > Verbala Fällor
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
      name: "Verbala Fällor",
      // Final item omits 'item' property per Google docs
    },
  ],
};

// Article JSON-LD
const articleJsonLd: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Verbala Fällor på Högskoleprovet - ORD, LÄS, MEK, ELF",
  datePublished: "2026-01-27",
  publisher: {
    "@type": "Organization",
    name: "Maxa",
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/hogskoleprovet/strategier/verbala-fallor`,
  },
};

export default function VerbalaFallorPage() {
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
            Verbala fällor
          </h1>
          <p className="text-lg text-foreground-muted mb-8">
            Så undviker du de vanligaste misstagen i ORD, LÄS, MEK och ELF
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
                  <strong>Falska vänner:</strong> Ord som liknar engelska eller
                  andra svenska ord men betyder något helt annat
                  (eventuellt/eventually, semester/semester)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>Sekundära betydelser:</strong> Vanliga ord med
                  ovanliga betydelser (fåfäng = förgäves, inte bara utseendefixerad)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>LÄS-fällan:</strong> Svarsalternativ som är sant i
                  verkligheten men inte nämns i texten – fråga alltid &ldquo;Var står
                  detta?&rdquo;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>MEK-fällan:</strong> Ord som passar grammatiskt men
                  inte logiskt – kolla signalord som &ldquo;men&rdquo;, &ldquo;trots&rdquo;, &ldquo;däremot&rdquo;
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong>ELF-fällan:</strong> Swenglish-fel och vokabulärförvirring
                  (actual/aktuell, fabric/fabrik)
                </span>
              </li>
            </ul>
          </div>

          {/* ORD Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ORD – Ordförståelse
            </h2>
            <p className="text-foreground-muted mb-6">
              ORD-delen testar djup och nyans i svenskan. Med cirka 8000 ord
              som potentiellt underlag bygger fällorna på associationer och
              bristande ordförråd.
            </p>

            {/* Falska vänner */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Falska vänner (False Friends)
            </h3>
            <p className="text-foreground mb-4">
              Falska vänner är ord som ser ut att betyda en sak men betyder
              något helt annat. De kan vara interlingvistiska (mellan språk)
              eller intralingvistiska (inom samma språk).
            </p>

            <h4 className="text-lg font-bold text-foreground mb-3">
              Interlingvistiska falska vänner (Svenska/Engelska)
            </h4>
            <p className="text-foreground mb-4">
              Många svenskar förväxlar ord som liknar engelska men betyder olika
              saker:
            </p>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>
                <strong>Eventuellt</strong> (svenska: möjligen) vs{" "}
                <strong>Eventually</strong> (engelska: slutligen)
              </li>
              <li>
                <strong>Semester</strong> (svenska: ledighet) vs{" "}
                <strong>Semester</strong> (engelska: termin)
              </li>
              <li>
                <strong>Genus</strong> (svenska: kön grammatiskt) vs{" "}
                <strong>Genius</strong> (engelska: geni)
              </li>
              <li>
                <strong>Aktuell</strong> (svenska: pågående/relevant) vs{" "}
                <strong>Actual</strong> (engelska: faktisk)
              </li>
            </ul>

            <h4 className="text-lg font-bold text-foreground mb-3">
              Intralingvistiska falska vänner (Svenska/Svenska)
            </h4>
            <p className="text-foreground mb-6">
              Ord som låter lika men betyder olika saker:
            </p>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>
                <strong>Referera</strong> (återge) vs <strong>Resonera</strong>{" "}
                (diskutera/argumentera)
              </li>
              <li>
                <strong>Statuter</strong> (stadgar/regler) vs{" "}
                <strong>Statyer</strong> (skulpturer)
              </li>
              <li>
                <strong>Distinkt</strong> (tydlig) vs <strong>Instinkt</strong>{" "}
                (naturlig drift)
              </li>
            </ul>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Studera etymologi (ordets ursprung). Lägg tid på att lära dig de
                vanligaste falska vännerna mellan svenska och engelska. Skapa
                flashcards med ordet, vad du tror det betyder, och vad det
                faktiskt betyder.
              </p>
            </div>

            {/* Polysemi och arkaismer */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Polysemi och arkaismer
            </h3>
            <p className="text-foreground mb-4">
              Polysemi är när samma ord har flera olika betydelser. Arkaismer är
              äldre ord eller betydelser som inte längre är vanliga i
              vardagsspråk.
            </p>
            <p className="text-foreground mb-4">
              Exempel på ord med sekundära betydelser:
            </p>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>
                <strong>Fåfäng:</strong> De flesta känner till betydelsen
                &ldquo;utseendefixerad&rdquo;. Men i äldre svenska och litterära sammanhang
                betyder det &ldquo;förgäves&rdquo; eller &ldquo;nyttolös&rdquo; (en fåfäng kamp).
              </li>
              <li>
                <strong>Rolig:</strong> I danska och äldre svenska kan det
                betyda &ldquo;lugn&rdquo; eller &ldquo;fridfull&rdquo;, inte bara &ldquo;skojig&rdquo;.
              </li>
              <li>
                <strong>Avoga:</strong> Inte &ldquo;ogilla&rdquo; utan &ldquo;avrå från&rdquo; eller
                &ldquo;varna mot&rdquo;.
              </li>
            </ul>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Läs äldre svensk litteratur (Strindberg, Lagerlöf, Söderberg) för
                att möta orden i kontext. Provkonstruktörerna älskar att testa
                sekundära betydelser som dyker upp i klassisk litteratur.
              </p>
            </div>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">Sammanfattning ORD</p>
              <p className="text-foreground text-sm">
                ORD:s största fällor är falska vänner (ord som liknar engelska
                eller andra svenska ord) och sekundära betydelser (vanliga ord
                med ovanliga betydelser). Motdraget är att studera etymologi och
                läsa klassisk litteratur.
              </p>
            </div>
          </section>

          {/* LÄS Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              LÄS – Svensk läsförståelse
            </h2>
            <p className="text-foreground-muted mb-6">
              LÄS är den mest tidskrävande delen av provet. Fällorna handlar om
              att skilja textens innehåll från din egen kunskap och att undvika
              logiska felslut.
            </p>

            {/* Det rimliga men ogrundade */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Det &ldquo;rimliga men ogrundade&rdquo; svaret
            </h3>
            <p className="text-foreground mb-4">
              Detta är den mest förrädiska fällan i läsförståelse. Ett
              svarsalternativ utgörs av ett påstående som är allmänt känt som
              sant (till exempel &ldquo;Motion är bra för hälsan&rdquo;), men som inte nämns
              i texten.
            </p>
            <p className="text-foreground mb-6">
              Du läser alternativet, håller med om det (&ldquo;Ja, det stämmer ju!&rdquo;),
              och markerar det. Men provet testar läsförståelse, inte
              allmänbildning. Om det inte står i texten är det fel.
            </p>

            <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">⚠️ Vanligt misstag</p>
              <p className="text-foreground text-sm">
                Texten handlar om träning. Ett alternativ säger: &ldquo;Regelbunden
                motion minskar risken för hjärt-kärlsjukdomar.&rdquo; Detta är sant i
                verkligheten, men om texten inte nämner hjärt-kärlsjukdomar är
                svaret fel.
              </p>
            </div>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                För varje svarsalternativ, fråga dig: &ldquo;Kan jag peka på raden där
                detta står?&rdquo; Om svaret är nej, är alternativet fel – oavsett hur
                sant det låter.
              </p>
            </div>

            {/* Generaliseringsfällan */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Generaliseringsfällan
            </h3>
            <p className="text-foreground mb-4">
              Texten beskriver en specifik situation, men svarsalternativet
              generaliserar detta till en allmängiltig regel. En liten
              förskjutning i modalitet kan göra ett sant påstående falskt.
            </p>
            <p className="text-foreground mb-6">
              Nyckelord att vara försiktig med: <strong>alltid</strong>,{" "}
              <strong>aldrig</strong>, <strong>alla</strong>,{" "}
              <strong>ingen</strong>. Texten kanske säger &ldquo;många fåglar flyttar
              söderut&rdquo;, medan distraktorn säger &ldquo;alla fåglar flyttar söderut&rdquo;.
            </p>

            {/* Orsak-verkan-omkastning */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Orsak-verkan-omkastning (Reverse Causality)
            </h3>
            <p className="text-foreground mb-4">
              Texten säger att A leder till B. Distraktorn säger att B leder till
              A. I komplexa texter om ekonomi, biologi eller sociala fenomen kan
              det vara svårt att hålla isär riktningen på sambandet under
              tidspress.
            </p>
            <p className="text-foreground mb-6">
              Exempel: Texten säger &ldquo;Ökad stress leder till sömnproblem&rdquo;.
              Distraktorn säger &ldquo;Sömnproblem leder till ökad stress&rdquo;. Även om båda
              kan vara sanna i verkligheten, testar provet vad texten faktiskt
              säger.
            </p>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">Sammanfattning LÄS</p>
              <p className="text-foreground text-sm">
                LÄS:s stora fällor är det &ldquo;rimliga men ogrundade&rdquo; svaret (sant i
                verkligheten men inte i texten), generaliseringsfällan
                (alla/aldrig vs många/sällan) och orsak-verkan-omkastning.
                Motdraget är att alltid fråga &ldquo;Var står detta i texten?&rdquo;
              </p>
            </div>
          </section>

          {/* MEK Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              MEK – Meningskomplettering
            </h2>
            <p className="text-foreground-muted mb-6">
              MEK testar din känsla för ord i kontext. Ett ord kan passa perfekt
              grammatiskt men ändå vara fel om det skär sig mot meningens logik
              eller stil.
            </p>

            {/* Kontextuell dissonans */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Kontextuell dissonans
            </h3>
            <p className="text-foreground mb-4">
              Ett ord passar grammatiskt men inte innehållsligt. Meningen kräver
              ett visst logiskt eller emotionellt samband mellan orden.
            </p>
            <p className="text-foreground mb-6">
              Signalord som <strong>men</strong>, <strong>trots</strong>,{" "}
              <strong>däremot</strong> indikerar kontrast. Exempel: &ldquo;Trots sin
              _____ var han mycket _____&rdquo; kräver två ord med motsatt laddning
              (rikedom/snål, litenhet/stark). Fällan är alternativ där orden är
              synonymer eller saknar kontrast.
            </p>

            {/* Stilbrott */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Stilbrott
            </h3>
            <p className="text-foreground mb-6">
              Svenskan har olika stilnivåer (formell, neutral, vardaglig, slang).
              Ett ord som är vardagligt passar inte i en formell akademisk text,
              även om betydelsen är snarlik. MEK testar din känsla för stilistisk
              valör och register.
            </p>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Läs meningen tyst för dig själv med ordet insatt. &ldquo;Låter&rdquo; det rätt?
                Passa ihop tonen i texten med tonen i ordet. En formell text
                kräver formella ord.
              </p>
            </div>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">Sammanfattning MEK</p>
              <p className="text-foreground text-sm">
                MEK:s fällor är kontextuell dissonans (ordet passar grammatiskt
                men inte logiskt) och stilbrott (fel register/formality).
                Motdraget är att läsa meningen högt för dig själv och lyssna efter
                signalord som &ldquo;men&rdquo;, &ldquo;trots&rdquo;, &ldquo;däremot&rdquo;.
              </p>
            </div>
          </section>

          {/* ELF Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ELF – Engelsk läsförståelse
            </h2>
            <p className="text-foreground-muted mb-6">
              ELF testar engelsk läsförståelse och vokabulär. Fällorna bygger på
              samma principer som LÄS, men med tillägg av språkliga fallgropar
              mellan svenska och engelska.
            </p>

            {/* Swenglish-fällan */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Swenglish-fällan
            </h3>
            <p className="text-foreground mb-4">
              Många svenskar översätter direkt från svenska till engelska, vilket
              leder till specifika grammatiska fel som provkonstruktörerna känner
              till och utnyttjar.
            </p>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>
                <strong>&ldquo;I am agree&rdquo;</strong> (fel, baserat på &ldquo;Jag är enig&rdquo;)
                istället för <strong>&ldquo;I agree&rdquo;</strong>
              </li>
              <li>
                <strong>&ldquo;I am interesting in&rdquo;</strong> istället för{" "}
                <strong>&ldquo;I am interested in&rdquo;</strong>
              </li>
              <li>
                <strong>&ldquo;It is difficult to do it&rdquo;</strong> (onödigt &ldquo;it&rdquo;)
                istället för <strong>&ldquo;It is difficult to do&rdquo;</strong>
              </li>
            </ul>

            {/* Vokabulärförvirring */}
            <h3 className="text-xl font-bold text-foreground mb-3 mt-8">
              Vokabulärförvirring (False Friends Svenska/Engelska)
            </h3>
            <p className="text-foreground mb-6">
              Samma fenomen som i ORD-delen, fast mellan engelska och svenska:
            </p>
            <ul className="list-disc list-inside text-foreground mb-6 space-y-2">
              <li>
                <strong>Actual</strong> (faktisk) inte <strong>Aktuell</strong>{" "}
                (current)
              </li>
              <li>
                <strong>Fabric</strong> (tyg) inte <strong>Fabrik</strong>{" "}
                (factory)
              </li>
              <li>
                <strong>Novel</strong> (roman) inte <strong>Novell</strong>{" "}
                (short story)
              </li>
              <li>
                <strong>Billion</strong> (miljard) inte <strong>Biljon</strong>{" "}
                (trillion)
              </li>
            </ul>

            <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-4 mb-6">
              <p className="text-foreground font-bold mb-2">✓ Motdrag</p>
              <p className="text-foreground text-sm">
                Plugga fasta uttryck och prepositioner på engelska (interested
                in, good at, afraid of). Skapa en lista över vanliga
                Swenglish-fel som du själv gör. Läs engelsk text regelbundet för
                att bygga språkkänsla.
              </p>
            </div>

            {/* Section summary */}
            <div className="border-l-4 border-primary pl-4 bg-card-background p-4 rounded">
              <p className="text-foreground font-bold mb-2">Sammanfattning ELF</p>
              <p className="text-foreground text-sm">
                ELF:s fällor är Swenglish-fel (direkt översättning från svenska)
                och vokabulärförvirring (actual/aktuell, fabric/fabrik). Motdraget
                är att plugga fasta uttryck, prepositioner och vanliga falska
                vänner mellan engelska och svenska.
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
                      Mekanism
                    </th>
                    <th className="border-b border-border p-3 text-left text-foreground font-bold">
                      Motdrag
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">ORD</td>
                    <td className="p-3 text-foreground">Falska vänner</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Ord liknar engelska/svenska ord
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Studera etymologi, lär listor
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">ORD</td>
                    <td className="p-3 text-foreground">Sekundär betydelse</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Vanligt ord, ovanlig betydelse
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Läs klassisk litteratur
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">LÄS</td>
                    <td className="p-3 text-foreground">Allmänbildning</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Sant i verkligheten, ej i texten
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Fråga: &ldquo;Var står detta?&rdquo;
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">LÄS</td>
                    <td className="p-3 text-foreground">Generalisering</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Alla/aldrig vs många/sällan
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Akta dig för absolutord
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">LÄS</td>
                    <td className="p-3 text-foreground">Orsak-verkan</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Kausalitet omkastas (A→B blir B→A)
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Rita pilar, följ textens logik
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">MEK</td>
                    <td className="p-3 text-foreground">Kontextuell dissonans</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Grammatiskt ok, innehållsligt fel
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Läs meningen högt, lyssna
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">MEK</td>
                    <td className="p-3 text-foreground">Stilbrott</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Fel register (formell/vardaglig)
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Matcha textens ton
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-foreground font-bold">ELF</td>
                    <td className="p-3 text-foreground">Swenglish</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Direkt översättning från svenska
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Plugga fasta uttryck, prepositioner
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 text-foreground font-bold">ELF</td>
                    <td className="p-3 text-foreground">Vokabulär</td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Actual/aktuell, fabric/fabrik
                    </td>
                    <td className="p-3 text-foreground-muted text-sm">
                      Lär falska vänner Eng/Sve
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
                <strong>ORD – Ordförståelse:</strong> De två stora fällorna är
                falska vänner (ord som liknar engelska eller andra svenska ord
                men betyder något annat) och sekundära betydelser (vanliga ord
                med ovanliga betydelser). Motdraget är att studera etymologi och
                läsa klassisk litteratur för att möta orden i kontext.
              </li>
              <li>
                <strong>LÄS – Svensk läsförståelse:</strong> Största fällan är
                det &ldquo;rimliga men ogrundade&rdquo; svaret (sant i verkligheten men inte
                i texten), generaliseringsfällan (alla/aldrig vs många/sällan)
                och orsak-verkan-omkastning. Motdraget är att alltid fråga &ldquo;Var
                står detta i texten?&rdquo; och rita pilar för kausalitet.
              </li>
              <li>
                <strong>MEK – Meningskomplettering:</strong> Fällorna är
                kontextuell dissonans (ordet passar grammatiskt men inte
                innehållsligt) och stilbrott (fel register). Motdraget är att
                läsa meningen högt och lyssna efter signalord som &ldquo;men&rdquo;, &ldquo;trots&rdquo;,
                &ldquo;däremot&rdquo; som indikerar kontrast.
              </li>
              <li>
                <strong>ELF – Engelsk läsförståelse:</strong> Fällorna är
                Swenglish-fel (direkt översättning från svenska som &ldquo;I am agree&rdquo;)
                och vokabulärförvirring (actual/aktuell, fabric/fabrik).
                Motdraget är att plugga fasta uttryck, prepositioner och vanliga
                falska vänner mellan engelska och svenska.
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
                href="/hogskoleprovet/strategier/kvantitativa-fallor"
                className="block p-6 bg-card-background rounded-2xl border-2 border-border hover:border-primary transition-colors group"
              >
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Kvantitativa fällor
                </h3>
                <p className="text-foreground-muted mb-4">
                  Undvik fallorna i XYZ, KVA, NOG och DTK. Mellanräkningsfällan
                  och enhetsförbistring.
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
