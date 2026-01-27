import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/lib/structured-data";
import type { Article, BreadcrumbList, WithContext } from "schema-dts";
import { RecentTests } from "@/components/navigation/recent-tests";

const BASE_URL = "https://maxa.se";

export const metadata: Metadata = {
  title: "Tidsstrategi för Högskoleprovet - Maximera Poängen per Minut | Maxa",
  description:
    "Lär dig hur du planerar din tid på högskoleprovet. Tidsbudget per fråga, prioritering, gissningsstrategi och träningsmetodik för bästa resultat.",
  keywords: [
    "tidsstrategi högskoleprovet",
    "tid per fråga hp",
    "tidsplanering högskoleprovet",
    "hp prov tid",
    "högskoleprovet tidsbudget",
    "hp gissningsstrategi",
    "högskoleprovet träning",
  ],
  alternates: {
    canonical: "/hogskoleprovet/strategier/tidsstrategi",
  },
  openGraph: {
    title: "Tidsstrategi för Högskoleprovet - Maximera Poängen per Minut",
    description:
      "Lär dig hur du planerar din tid på högskoleprovet för bästa resultat.",
    type: "article",
    url: "/hogskoleprovet/strategier/tidsstrategi",
  },
};

// Breadcrumb JSON-LD for Hem > Högskoleprovet > Strategier > Tidsstrategi
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
      name: "Tidsstrategi",
      // Final item omits 'item' property per Google docs
    },
  ],
};

// Article JSON-LD
const articleJsonLd: WithContext<Article> = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Tidsstrategi för Högskoleprovet - Maximera Poängen per Minut",
  datePublished: "2026-01-27",
  publisher: {
    "@type": "Organization",
    name: "Maxa",
    url: BASE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${BASE_URL}/hogskoleprovet/strategier/tidsstrategi`,
  },
};

export default function TidsstrategiPage() {
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
            Tidsstrategi för högskoleprovet
          </h1>
          <p className="text-lg text-foreground-muted mb-8">
            Maximera poängen per minut med rätt tidsplanering
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
                  Du har cirka 1-2 minuter per fråga beroende på delprov
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Tvåpass-strategin: Enkla frågor först, svåra frågor sen
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  2-minutersregeln: Fastnar du längre än 2 minuter – gissa och gå vidare
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Gissa alltid på kvarvarande frågor – ingen minuspoäng
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>
                  Träna uthållighet för 5 provpass genom att göra hela gamla prov
                </span>
              </li>
            </ul>
          </div>

          {/* Content Section 1: Provets tidsramar */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Provets tidsramar
            </h2>
            <p className="text-foreground-muted mb-6">
              Högskoleprovet består av 5 provpass som löper under en dag. Varje
              pass har 55 minuter och ett fast antal frågor. Din första uppgift
              är att förstå hur mycket tid du har per fråga.
            </p>

            <div className="space-y-6">
              {/* Provpassöversikt */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Provpassens struktur
                </h3>
                <div className="bg-card-background border-2 border-border rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4 font-semibold text-foreground border-b border-border pb-2">
                    <div>Provpass</div>
                    <div>Antal frågor</div>
                    <div>Tid per fråga</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-foreground">
                    <div>Pass 1 (XYZ)</div>
                    <div>20 frågor</div>
                    <div>~2 min 45 sek</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-foreground">
                    <div>Pass 2 (Verbal)</div>
                    <div>40 frågor</div>
                    <div>~1 min 23 sek</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-foreground">
                    <div>Pass 3 (ELF)</div>
                    <div>20 frågor</div>
                    <div>~2 min 45 sek</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-foreground">
                    <div>Pass 4 (Kvant)</div>
                    <div>20 frågor</div>
                    <div>~2 min 45 sek</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-foreground">
                    <div>Pass 5 (LÄS)</div>
                    <div>20 frågor</div>
                    <div>~2 min 45 sek</div>
                  </div>
                </div>
              </div>

              {/* Viktiga insikter */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Vad betyder detta?
                </h3>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Pass 2 (Verbal del)</span> är
                  tidsintensivt med bara 1 minut 23 sekunder per fråga i
                  snitt. ORD och MEK är snabba, men LÄS-frågorna äter tid. Du
                  behöver kompensera genom att gå fort på ORD och MEK för att ha
                  buffert för läsförståelsen.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">LÄS-delen (Pass 5)</span> har färre
                  frågor men längre texter. Här är det lätt att fastna. Läs
                  frågorna FÖRST innan du läser texten – då vet du vad du letar
                  efter.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">XYZ och DTK</span> varierar
                  enormt. Vissa frågor tar 30 sekunder, andra 5 minuter. Lär
                  dig känna igen tidsfällorna och skippa dem tidigt.
                </p>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning tidsramar:
              </p>
              <p className="text-foreground mt-2">
                5 provpass, 55 minuter vardera. Tid per fråga varierar från 1
                minut 23 sekunder till 2 minuter 45 sekunder. Verbal del är
                snabbast, mattefrågor kan ta längre tid men varierar mycket.
              </p>
            </div>
          </section>

          {/* Content Section 2: Tidsbudget per fråga */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Tidsbudget per fråga
            </h2>
            <p className="text-foreground-muted mb-6">
              Snittet ovan är precis det – ett snitt. Vissa frågor tar 20
              sekunder, andra tar 4 minuter. Din uppgift är att lära dig
              skillnaden och fördela tiden effektivt.
            </p>

            <div className="space-y-8">
              {/* Snabba vs långsamma frågor */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Snabba kontra långsamma frågor
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-500/10 border-2 border-green-500 rounded-xl p-5">
                    <h4 className="font-bold text-foreground mb-2">
                      Snabba frågor (30 sek - 1 min)
                    </h4>
                    <ul className="space-y-2 text-foreground text-sm">
                      <li>• ORD – orddefinitioner</li>
                      <li>• MEK – meningskompletteringar</li>
                      <li>• Enkla XYZ – grundaritmetik</li>
                      <li>• Faktabaserade DTK – avläsningar</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-5">
                    <h4 className="font-bold text-foreground mb-2">
                      Långsamma frågor (3-5 min)
                    </h4>
                    <ul className="space-y-2 text-foreground text-sm">
                      <li>• LÄS – läsförståelse med långa texter</li>
                      <li>• Komplexa XYZ – flera steg</li>
                      <li>• NOG – resonemangsfrågor</li>
                      <li>• DTK – kombinerade tolkningar</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2-minutersregeln */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  2-minutersregeln
                </h3>
                <p className="text-foreground mb-3">
                  Om du har kämpat med en fråga i 2 minuter utan att komma fram
                  till ett svar du känner dig säker på – gissa och gå vidare.
                  Detta är den viktigaste regeln för tidshantering.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Varför 2 minuter?</span> Eftersom
                  det är ungefär snittet per fråga. Om du lägger längre tid än
                  så på en enda fråga, stjäl du tid från andra frågor som du
                  kanske hade klarat snabbt.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Hur tillämpar du det?</span> Ha
                  klockan framme. Markera när du började med frågan (mentalt
                  eller med liten prick på papperet). Efter 2 minuter: gör en
                  kvalificerad gissning, markera frågan med en stjärna, och gå
                  vidare. Kom tillbaka om det finns tid.
                </p>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning tidsbudget:
              </p>
              <p className="text-foreground mt-2">
                Vissa frågor tar 30 sekunder, andra 5 minuter. Använd
                2-minutersregeln: Om du inte är säker efter 2 minuter, gissa
                och gå vidare. Kom tillbaka om tid finns kvar.
              </p>
            </div>
          </section>

          {/* Content Section 3: Prioriteringsstrategi */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Prioriteringsstrategi
            </h2>
            <p className="text-foreground-muted mb-6">
              Alla frågor ger samma poäng. En lätt fråga du klarar på 30
              sekunder är lika mycket värd som en svår du kämpar med i 5
              minuter. Din strategi måste vara att maximera antalet rätta svar,
              inte att lösa dem i ordning.
            </p>

            <div className="space-y-8">
              {/* Tvåpass-strategin */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Tvåpass-strategin
                </h3>
                <p className="text-foreground mb-4">
                  Detta är guldstandarden för högskoleprovet. Du går igenom
                  provet två gånger:
                </p>
                <div className="space-y-4">
                  <div className="bg-card-background border-2 border-border rounded-xl p-5">
                    <h4 className="font-bold text-foreground mb-2">
                      Pass 1: Säkra poängen (35-40 minuter)
                    </h4>
                    <p className="text-foreground mb-3">
                      Gå igenom alla frågor i ordning. Svara på de du direkt
                      känner dig säker på. Om du inte vet svaret inom 30
                      sekunder efter att ha läst frågan – markera den med en
                      stjärna och gå vidare.
                    </p>
                    <p className="text-foreground text-sm">
                      <span className="font-bold">Mål:</span> Ha svarat på
                      60-70% av frågorna innan pass 1 är slut.
                    </p>
                  </div>
                  <div className="bg-card-background border-2 border-border rounded-xl p-5">
                    <h4 className="font-bold text-foreground mb-2">
                      Pass 2: Kämpa med de svåra (15-20 minuter)
                    </h4>
                    <p className="text-foreground mb-3">
                      Gå tillbaka till de frågor du markerade med stjärna. Nu
                      kan du lägga mer tid på dem eftersom du redan har säkrat
                      de enkla poängen. Använd 2-minutersregeln här också.
                    </p>
                    <p className="text-foreground text-sm">
                      <span className="font-bold">Mål:</span> Svara på så många
                      som möjligt av de kvarvarande frågorna.
                    </p>
                  </div>
                </div>
              </div>

              {/* Identifiera tidsfällor */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Identifiera tidsfällor
                </h3>
                <p className="text-foreground mb-3">
                  Vissa frågor är designade för att äta din tid. De ser ut att
                  vara lösningsbara, men kräver flera steg eller komplex
                  reasoning. Lär dig känna igen dem tidigt.
                </p>
                <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-5">
                  <h4 className="font-bold text-foreground mb-2">
                    Varningstecken för tidsfällor:
                  </h4>
                  <ul className="space-y-2 text-foreground">
                    <li>
                      • XYZ-fråga med flera variabler och flera ekvationer
                    </li>
                    <li>
                      • DTK med flera diagram som ska kombineras
                    </li>
                    <li>
                      • LÄS-text över 2 sidor med detaljfrågor
                    </li>
                    <li>
                      • NOG där båda påståendena verkar otillräckliga
                    </li>
                  </ul>
                  <p className="text-foreground mt-3 text-sm">
                    <span className="font-bold">Strategi:</span> När du ser
                    dessa tecken i pass 1 – skippa direkt och gå vidare. Dessa
                    är pass 2-frågor.
                  </p>
                </div>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning prioritering:
              </p>
              <p className="text-foreground mt-2">
                Använd tvåpass-strategin: säkra enkla frågor först, jobba på
                svåra frågor sen. Lär dig känna igen tidsfällor och skippa dem
                i pass 1.
              </p>
            </div>
          </section>

          {/* Content Section 4: Gissningsstrategi */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Gissningsstrategi
            </h2>
            <p className="text-foreground-muted mb-6">
              Det finns ingen minuspoäng på högskoleprovet. Detta betyder att
              du ALLTID ska gissa på frågor du inte vet svaret på. Men det
              finns smartare och mindre smarta sätt att gissa.
            </p>

            <div className="space-y-8">
              {/* Elimineringstekniken */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Elimineringstekniken
                </h3>
                <p className="text-foreground mb-3">
                  Istället för att gissa blindt mellan 4 alternativ (25%
                  chans), försök eliminera 1-2 alternativ först. Det höjer dina
                  odds dramatiskt.
                </p>
                <div className="space-y-3">
                  <div className="bg-card-background border-2 border-border rounded-xl p-4">
                    <p className="text-foreground">
                      <span className="font-bold">4 alternativ:</span> 25%
                      chans att gissa rätt
                    </p>
                  </div>
                  <div className="bg-card-background border-2 border-border rounded-xl p-4">
                    <p className="text-foreground">
                      <span className="font-bold">3 alternativ (1 eliminerat):</span>{" "}
                      33% chans
                    </p>
                  </div>
                  <div className="bg-card-background border-2 border-border rounded-xl p-4">
                    <p className="text-foreground">
                      <span className="font-bold">2 alternativ (2 eliminerade):</span>{" "}
                      50% chans
                    </p>
                  </div>
                </div>
                <p className="text-foreground mt-4">
                  <span className="font-bold">Hur eliminerar du?</span> I XYZ:
                  Testa extremvärden (ofta fel). I LÄS: Eliminera alternativ med
                  &quot;alltid&quot; eller &quot;aldrig&quot;. I ORD: Eliminera ord du definitivt
                  känner till har en annan betydelse.
                </p>
              </div>

              {/* Gissningsbokstaven */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Välj en gissningsbokstav
                </h3>
                <p className="text-foreground mb-3">
                  När tiden är ute och du har 5-10 frågor kvar tomma – använd en
                  konsekvent gissningsbokstav för alla. Statistiskt ger det
                  bättre resultat än att slumpa.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Varför?</span> Eftersom
                  svarsalternativen är jämnt fördelade över A, B, C, D i ett helt
                  prov. Om du konsekvent gissar C på alla tomma rader, får du
                  statistiskt rätt på cirka 25% av dem.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Rekommendation:</span> Välj C eller
                  B (mittenbokstäverna). Undvik A och D som många omedvetet
                  väljer, vilket kan skapa kluster i dina svar.
                </p>
              </div>

              {/* Sista minuten */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Sista minuten-strategin
                </h3>
                <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-5">
                  <h4 className="font-bold text-foreground mb-3">
                    När provledaren säger &quot;1 minut kvar&quot;:
                  </h4>
                  <ol className="space-y-2 text-foreground">
                    <li>1. Sluta arbeta på nuvarande fråga</li>
                    <li>2. Bläddra snabbt igenom alla sidor</li>
                    <li>
                      3. Fyll i alla tomma rader med din gissningsbokstav (t.ex. C)
                    </li>
                    <li>
                      4. Om tid: gå tillbaka till den fråga du arbetade på
                    </li>
                  </ol>
                  <p className="text-foreground mt-3 text-sm font-semibold">
                    Detta tar 20-30 sekunder och kan ge dig 2-3 extra poäng.
                  </p>
                </div>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning gissning:
              </p>
              <p className="text-foreground mt-2">
                Använd eliminering för att höja oddsen. Välj en
                gissningsbokstav (C eller B) för alla kvarvarande tomma rader.
                Fyll i alla tomma svar i sista minuten.
              </p>
            </div>
          </section>

          {/* Content Section 5: Förberedelse och simulering */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Förberedelse och simulering
            </h2>
            <p className="text-foreground-muted mb-6">
              Att veta strategin är en sak. Att kunna genomföra den under
              provdagens stress är en annan. Det kräver träning.
            </p>

            <div className="space-y-8">
              {/* Träna med gamla prov */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Träna med tidspress
                </h3>
                <p className="text-foreground mb-3">
                  Gör gamla högskoleprov under exakt samma tidsramar som riktiga
                  provet. Sätt en timer på 55 minuter. Ingen paus. Ingen extra
                  tid.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Progressiv träning:</span>
                </p>
                <ul className="space-y-2 text-foreground ml-6">
                  <li>
                    <span className="font-bold">Vecka 1-2:</span> Ett provpass
                    i taget. Analysera felen.
                  </li>
                  <li>
                    <span className="font-bold">Vecka 3-4:</span> Två provpass i
                    rad. Bygg uthållighet.
                  </li>
                  <li>
                    <span className="font-bold">Vecka 5-6:</span> Hela provet (5
                    pass) med korrekta pauser. Simulera hela dagen.
                  </li>
                </ul>
              </div>

              {/* Bygg stamina */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Bygg kognitiv uthållighet
                </h3>
                <p className="text-foreground mb-3">
                  Provpass 5 är betydligt svårare än provpass 1 – inte för att
                  frågorna är svårare, utan för att din hjärna är utmattad efter
                  4 timmar intensivt tänkande.
                </p>
                <p className="text-foreground mb-3">
                  <span className="font-bold">Träningsmetod:</span> Gör hela
                  gamla prov från start till slut. Inga shortcuts. Detta tränar
                  din hjärna att behålla fokus även när du är trött.
                </p>
                <p className="text-foreground">
                  <span className="font-bold">Bonus:</span> Gör provpass 5 när du
                  redan är trött (t.ex. efter en hel dag i skolan). Detta
                  simulerar den mentala trötthet du kommer känna på riktigt.
                </p>
              </div>

              {/* Simulera provdagen */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Simulera provdagen helt
                </h3>
                <p className="text-foreground mb-3">
                  1-2 veckor innan riktiga provet: Gör en fullständig
                  provsimulering med exakt samma tidsschema som provdagen.
                </p>
                <div className="bg-card-background border-2 border-border rounded-xl p-5">
                  <h4 className="font-bold text-foreground mb-2">
                    Simuleringsschema:
                  </h4>
                  <ul className="space-y-2 text-foreground text-sm">
                    <li>• <span className="font-bold">08:30:</span> Provpass 1 (XYZ)</li>
                    <li>• <span className="font-bold">09:40:</span> Paus 20 min</li>
                    <li>• <span className="font-bold">10:00:</span> Provpass 2 (Verbal)</li>
                    <li>• <span className="font-bold">11:10:</span> Paus 20 min</li>
                    <li>• <span className="font-bold">11:30:</span> Provpass 3 (ELF)</li>
                    <li>• <span className="font-bold">12:40:</span> Lunch 60 min</li>
                    <li>• <span className="font-bold">13:40:</span> Provpass 4 (Kvant)</li>
                    <li>• <span className="font-bold">14:50:</span> Paus 20 min</li>
                    <li>• <span className="font-bold">15:10:</span> Provpass 5 (LÄS)</li>
                    <li>• <span className="font-bold">16:20:</span> Klart</li>
                  </ul>
                  <p className="text-foreground mt-4">
                    Ät samma typ av mat i pauserna som du planerar på
                    provdagen. Testa din energinivå.
                  </p>
                </div>
              </div>
            </div>

            {/* Section summary */}
            <div className="mt-8 bg-green-500/10 border-2 border-green-500 rounded-xl p-4">
              <p className="text-foreground font-semibold">
                Sammanfattning träning:
              </p>
              <p className="text-foreground mt-2">
                Träna progressivt med gamla prov under exakt tidspress. Bygg
                uthållighet genom att göra hela provet i ett svep. Simulera
                provdagen helt 1-2 veckor innan.
              </p>
            </div>
          </section>

          {/* Quick Reference Checklist */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Checklista för provdagen
            </h2>
            <div className="bg-card-background border-2 border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">
                Din tidsstrategi – steg för steg:
              </h3>
              <ol className="space-y-3 text-foreground">
                <li>
                  <span className="font-bold">1. Innan provet börjar:</span>{" "}
                  Bestäm din gissningsbokstav (C eller B)
                </li>
                <li>
                  <span className="font-bold">2. Pass 1 (35-40 min):</span>{" "}
                  Svara på alla frågor du känner dig säker på. Markera svåra med stjärna.
                </li>
                <li>
                  <span className="font-bold">3. Använd 2-minutersregeln:</span>{" "}
                  Fastnar du i över 2 minuter – gissa och gå vidare
                </li>
                <li>
                  <span className="font-bold">4. Pass 2 (15-20 min):</span>{" "}
                  Gå tillbaka till stjärnmarkerade frågor och jobba på dem
                </li>
                <li>
                  <span className="font-bold">5. Eliminera när du gissar:</span>{" "}
                  Stryk alternativ du vet är fel för att höja oddsen
                </li>
                <li>
                  <span className="font-bold">6. Sista minuten:</span> Fyll i
                  alla tomma rader med din gissningsbokstav
                </li>
                <li>
                  <span className="font-bold">7. Mellan passen:</span> Kort
                  promenad, lätt mat, återställ mentalt
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
                <span className="font-bold">1. Tidsramar:</span> 5 provpass à 55
                minuter. Cirka 1-2 minuter per fråga beroende på delprov.
                Verbal del är snabbast, mattefrågor varierar mest i tidsbehov.
              </p>
              <p>
                <span className="font-bold">2. Tidsbudget:</span>{" "}
                2-minutersregeln är nyckeln. Om du inte är säker efter 2
                minuter, gissa och gå vidare. Vissa frågor tar 30 sekunder,
                andra 5 minuter – lär dig skillnaden.
              </p>
              <p>
                <span className="font-bold">3. Prioritering:</span>{" "}
                Tvåpass-strategin ger bäst resultat. Säkra enkla frågor först,
                jobba på svåra sen. Lär dig känna igen tidsfällor och skippa dem
                tidigt.
              </p>
              <p>
                <span className="font-bold">4. Gissning:</span> Använd
                eliminering för att höja oddsen från 25% till 50%. Välj en
                gissningsbokstav för alla kvarvarande tomma rader. Fyll i allt i
                sista minuten.
              </p>
              <p>
                <span className="font-bold">5. Träning:</span> Progressiv
                träning med gamla prov. Bygg uthållighet genom att göra hela
                provet i ett svep. Simulera provdagen helt 1-2 veckor innan.
              </p>
              <p className="pt-4">
                <span className="font-bold">Bottom line:</span> Högskoleprovet
                är lika mycket en tidshanteringstävling som en kunskapstävling.
                Med rätt tidsstrategi kan du höja ditt resultat med 0.2-0.4 utan
                att lära dig en enda ny mattesats.
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
                href="/hogskoleprovet/strategier/vanliga-misstag"
                className="p-4 bg-background rounded-xl border-2 border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">
                  Vanliga misstag
                </h3>
                <p className="text-sm text-foreground-muted">
                  Lär dig undvika de 11 vanligaste misstagen som sänker ditt resultat
                </p>
              </Link>
              <Link
                href="/hogskoleprovet/strategier/kvantitativa-fallor"
                className="p-4 bg-background rounded-xl border-2 border-border hover:border-primary transition-colors"
              >
                <h3 className="font-bold text-foreground mb-1">
                  Kvantitativa fällor
                </h3>
                <p className="text-sm text-foreground-muted">
                  Undvik misstagen i XYZ, KVA, NOG och DTK
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
                  Klara ORD, LÄS, MEK och ELF utan att falla i fallorna
                </p>
              </Link>
            </div>
          </section>

          <RecentTests count={4} />
        </div>
      </div>
    </>
  );
}
