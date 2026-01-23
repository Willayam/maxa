import type { Href } from 'expo-router';

interface NavItem {
  label: string;
  href: Href;
}

export const SiteLinks = {
  brand: 'Maxa HP',
  ctaLabel: 'Hämta Maxa HP gratis',
  appStoreUrl: 'https://maxahp.se/ios',
  playStoreUrl: 'https://maxahp.se/android',
  nav: [
    { label: 'Guide', href: '/hogskoleprovet/guide' },
    { label: 'Provdatum 2026', href: '/hogskoleprovet/provdatum-2026' },
    { label: 'Poäng & antagning', href: '/hogskoleprovet/poang-antagning' },
    { label: 'Övningsprov', href: '/hogskoleprovet/ovningsprov' },
  ] as NavItem[],
};

/** Next exam date for countdown calculations - update alongside ExamDates2026 */
export const NextExamDate = new Date(2026, 3, 18); // April 18, 2026

export const ExamDates2026 = [
  {
    season: 'Vår 2026',
    date: '18 april 2026',
    registration: '7–14 januari 2026',
    note: 'Anmälan sker via hogskoleprov.nu',
  },
  {
    season: 'Höst 2026',
    date: '18 oktober 2026',
    registration: '11–18 augusti 2026',
    note: 'Anmälan sker via hogskoleprov.nu',
  },
];

export const ScoreExamples = [
  { program: 'Läkarprogrammet (Lund)', range: '1.75–1.95', note: 'HP-kvoten' },
  { program: 'Psykolog (Stockholm)', range: '1.55–1.80', note: 'HP-kvoten' },
  { program: 'Civilingenjör (Chalmers)', range: '1.35–1.65', note: 'HP-kvoten' },
  { program: 'Civilekonom (Uppsala)', range: '1.25–1.55', note: 'HP-kvoten' },
  { program: 'Jurist (Umeå)', range: '1.20–1.45', note: 'HP-kvoten' },
];

export const PricingTiers = [
  {
    name: 'Gratis',
    price: '0 kr',
    accent: 'primary',
    description: 'Perfekt för att komma igång direkt.',
    bullets: [
      'Dagens pass + nivåtest',
      'Begränsat antal frågor per dag',
      'Grundläggande statistik',
    ],
  },
  {
    name: 'Pro',
    price: '79 kr/mån',
    accent: 'accent',
    description: 'Bygg streak och lås upp hela träningsplanen.',
    bullets: [
      'Obegränsade frågor',
      'AI-förklaringar + smart repetition',
      'Detaljerad statistik per delprov',
    ],
    highlight: true,
  },
  {
    name: 'Founders Lifetime',
    price: '1 490 kr',
    accent: 'success',
    description: 'Engångsbetalning för dig som vill maxa allt.',
    bullets: [
      'Allt i Pro',
      'Prioriterad support',
      'Tidiga nya funktioner',
    ],
  },
];

export const FaqItems = [
  {
    question: 'Är Maxa HP gratis att börja med?',
    answer: 'Ja. Du kan göra ett nivåtest och få ett dagligt pass gratis innan du uppgraderar.',
  },
  {
    question: 'För vem passar appen?',
    answer: 'För dig som vill höja resultatet utan att lägga timmar varje dag. 10–20 min räcker.',
  },
  {
    question: 'Hur skiljer ni er från andra HP-resurser?',
    answer: 'Vi tränar dina svagaste delar först och bygger en tydlig plan mot ditt målpoäng.',
  },
];

export const PracticeLinks = [
  {
    label: 'Tidigare prov och facit (Studera.nu)',
    href: 'https://www.studera.nu/hogskoleprov/om/forbereda/tidigare/',
  },
  {
    label: 'Så fungerar provdagen (Studera.nu)',
    href: 'https://www.studera.nu/hogskoleprov/infor-hogskoleprovet/provdagen-sa-fungerar-det/',
  },
  {
    label: 'Resultat & normering (Studera.nu)',
    href: 'https://www.studera.nu/hogskoleprov/resultat/resultat/senaste/',
  },
];

export const GuideQuickFacts = [
  'Högskoleprovet ger en extra urvalsgrupp utöver betyg.',
  'Provdagen består av fem pass à 55 minuter.',
  'Resultatet normeras och skalan går från 0.00 till 2.00.',
  'Ditt bästa resultat gäller i 8 år.',
];

export const SeoFooterText =
  'Maxa HP är en övningsapp för högskoleprovet som hjälper dig att plugga smartare, inte längre. ' +
  'Målet är att ge dig en tydlig plan för förberedelse inför högskoleprovet – oavsett om du siktar ' +
  'på 1.0, 1.5 eller 2.0. I appen får du dagliga pass som fokuserar på dina svagaste delar, så att ' +
  'varje minut ger maximal effekt. Istället för att bara göra gamla prov får du adaptiv träning, ' +
  'tidsstyrda frågor och förklaringar som gör att du faktiskt förstår varför svaret är rätt. ' +
  'Du kan börja gratis, välja ditt provdatum och se en konkret väg mot ditt mål. ' +
  'Många söker efter högskoleprovet tips, övningsprov, gamla prov eller hur man förbättrar sin poäng. ' +
  'Maxa HP samlar allt det i ett enkelt upplägg: nivåtest, daglig träning och uppföljning. ' +
  'Oavsett om du pluggar till vårens eller höstens prov, vill höja din HP-poäng för läkarprogrammet, ' +
  'psykologprogrammet eller civilekonom, eller bara vill ha bättre valmöjligheter i antagningen, ' +
  'är Maxa HP ett effektivt sätt att komma igång. Appen funkar lika bra för dig som har skrivit provet ' +
  'tidigare som för dig som ska göra det för första gången. Med små, smarta pass varje dag bygger du ' +
  'rutin, tempo och trygghet – utan att tappa motivationen.';
