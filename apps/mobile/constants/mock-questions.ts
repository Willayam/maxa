// apps/mobile/constants/mock-questions.ts

/**
 * Mock questions data for quiz UI development
 * These will be replaced with real data from Convex later
 */

export type SectionCode = 'ORD' | 'LÄS' | 'MEK' | 'ELF' | 'XYZ' | 'KVA' | 'NOG' | 'DTK';
export type OptionLabel = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  label: OptionLabel;
  text: string;
}

export interface Question {
  id: string;
  section: SectionCode;
  number: number;
  text: string;
  image?: string; // optional image URI
  options: QuestionOption[];
  correctAnswer: OptionLabel;
  explanation: string;
}

export interface QuizSession {
  section: SectionCode;
  questions: Question[];
  currentIndex: number;
  answers: AnswerRecord[];
  startTime: number;
}

export interface AnswerRecord {
  questionId: string;
  selected: OptionLabel | null;
  correct: boolean;
  timeSpent: number; // seconds
}

// Mock questions for XYZ (Matematisk problemlösning)
export const MOCK_QUESTIONS_XYZ: Question[] = [
  {
    id: 'xyz-001',
    section: 'XYZ',
    number: 1,
    text: 'Vad är 45 % av 2/9?',
    options: [
      { label: 'A', text: '1/9' },
      { label: 'B', text: '1/10' },
      { label: 'C', text: '1/11' },
      { label: 'D', text: '1/12' },
    ],
    correctAnswer: 'B',
    explanation: '45% = 0.45 = 9/20. Så 9/20 × 2/9 = 18/180 = 1/10.',
  },
  {
    id: 'xyz-002',
    section: 'XYZ',
    number: 2,
    text: 'En rektangel har omkretsen 28 cm. Om längden är 3 cm längre än bredden, vad är arean?',
    options: [
      { label: 'A', text: '40 cm²' },
      { label: 'B', text: '45 cm²' },
      { label: 'C', text: '46.75 cm²' },
      { label: 'D', text: '48 cm²' },
    ],
    correctAnswer: 'C',
    explanation: 'Låt bredden = b, längden = b+3. Omkrets: 2(b + b+3) = 28 → 4b + 6 = 28 → b = 5.5. Area = 5.5 × 8.5 = 46.75 cm².',
  },
  {
    id: 'xyz-003',
    section: 'XYZ',
    number: 3,
    text: 'Om x² - 5x + 6 = 0, vad är summan av lösningarna?',
    options: [
      { label: 'A', text: '2' },
      { label: 'B', text: '3' },
      { label: 'C', text: '5' },
      { label: 'D', text: '6' },
    ],
    correctAnswer: 'C',
    explanation: 'Enligt Vietas formler är summan av rötterna = -(-5)/1 = 5. (Rötterna är 2 och 3.)',
  },
  {
    id: 'xyz-004',
    section: 'XYZ',
    number: 4,
    text: 'En butik sänker priset med 20%. Hur mycket måste priset höjas för att återgå till ursprungspriset?',
    options: [
      { label: 'A', text: '20%' },
      { label: 'B', text: '25%' },
      { label: 'C', text: '30%' },
      { label: 'D', text: '40%' },
    ],
    correctAnswer: 'B',
    explanation: 'Om ursprungspriset är 100 kr blir det nya priset 80 kr. För att gå från 80 till 100 behövs 20/80 = 25% höjning.',
  },
  {
    id: 'xyz-005',
    section: 'XYZ',
    number: 5,
    text: 'Hur många treställiga tal finns det där alla siffror är olika och summan av siffrorna är 10?',
    options: [
      { label: 'A', text: '24' },
      { label: 'B', text: '30' },
      { label: 'C', text: '36' },
      { label: 'D', text: '42' },
    ],
    correctAnswer: 'C',
    explanation: 'Kombinationer som summerar till 10 med olika siffror: (1,2,7), (1,3,6), (1,4,5), (2,3,5), (2,4,4)... Efter att räkna permutationer får vi 36.',
  },
  {
    id: 'xyz-006',
    section: 'XYZ',
    number: 6,
    text: 'En klocka visar rätt tid kl 12:00. Om den går 2 minuter för fort per timme, vad visar den när den riktiga tiden är 18:00?',
    options: [
      { label: 'A', text: '18:10' },
      { label: 'B', text: '18:12' },
      { label: 'C', text: '18:14' },
      { label: 'D', text: '18:16' },
    ],
    correctAnswer: 'B',
    explanation: '6 timmar × 2 minuter = 12 minuter för fort. Klockan visar 18:12.',
  },
  {
    id: 'xyz-007',
    section: 'XYZ',
    number: 7,
    text: 'Om 3ˣ = 27 och 2ʸ = 16, vad är x + y?',
    options: [
      { label: 'A', text: '5' },
      { label: 'B', text: '6' },
      { label: 'C', text: '7' },
      { label: 'D', text: '8' },
    ],
    correctAnswer: 'C',
    explanation: '3ˣ = 27 = 3³ → x = 3. 2ʸ = 16 = 2⁴ → y = 4. x + y = 7.',
  },
  {
    id: 'xyz-008',
    section: 'XYZ',
    number: 8,
    text: 'En triangel har sidorna 5 cm, 12 cm och 13 cm. Vad är triangelns area?',
    options: [
      { label: 'A', text: '24 cm²' },
      { label: 'B', text: '30 cm²' },
      { label: 'C', text: '32.5 cm²' },
      { label: 'D', text: '36 cm²' },
    ],
    correctAnswer: 'B',
    explanation: '5² + 12² = 25 + 144 = 169 = 13². Det är en rätvinklig triangel! Area = (5 × 12)/2 = 30 cm².',
  },
  {
    id: 'xyz-009',
    section: 'XYZ',
    number: 9,
    text: 'Vilket är det minsta positiva heltal som är delbart med både 12 och 18?',
    options: [
      { label: 'A', text: '24' },
      { label: 'B', text: '30' },
      { label: 'C', text: '36' },
      { label: 'D', text: '72' },
    ],
    correctAnswer: 'C',
    explanation: 'MGM(12, 18) = 36. 12 = 2² × 3, 18 = 2 × 3². MGM = 2² × 3² = 36.',
  },
  {
    id: 'xyz-010',
    section: 'XYZ',
    number: 10,
    text: 'Om f(x) = 2x + 3, vad är f(f(2))?',
    options: [
      { label: 'A', text: '13' },
      { label: 'B', text: '15' },
      { label: 'C', text: '17' },
      { label: 'D', text: '19' },
    ],
    correctAnswer: 'C',
    explanation: 'f(2) = 2(2) + 3 = 7. f(f(2)) = f(7) = 2(7) + 3 = 17.',
  },
];

// Mock questions for ORD (Ordförståelse)
export const MOCK_QUESTIONS_ORD: Question[] = [
  {
    id: 'ord-001',
    section: 'ORD',
    number: 1,
    text: 'PRAGMATISK betyder ungefär:',
    options: [
      { label: 'A', text: 'teoretisk' },
      { label: 'B', text: 'praktisk' },
      { label: 'C', text: 'pessimistisk' },
      { label: 'D', text: 'idealistisk' },
    ],
    correctAnswer: 'B',
    explanation: 'Pragmatisk betyder praktiskt inriktad, fokuserad på vad som fungerar snarare än teorier.',
  },
  {
    id: 'ord-002',
    section: 'ORD',
    number: 2,
    text: 'LATENT betyder ungefär:',
    options: [
      { label: 'A', text: 'uppenbar' },
      { label: 'B', text: 'dold' },
      { label: 'C', text: 'sen' },
      { label: 'D', text: 'aktiv' },
    ],
    correctAnswer: 'B',
    explanation: 'Latent betyder dold, vilande, inte synlig men närvarande under ytan.',
  },
  {
    id: 'ord-003',
    section: 'ORD',
    number: 3,
    text: 'AMBIVALENT betyder ungefär:',
    options: [
      { label: 'A', text: 'bestämd' },
      { label: 'B', text: 'likgiltig' },
      { label: 'C', text: 'kluven' },
      { label: 'D', text: 'entusiastisk' },
    ],
    correctAnswer: 'C',
    explanation: 'Ambivalent betyder att ha motstridiga känslor, vara kluven mellan två hållningar.',
  },
  {
    id: 'ord-004',
    section: 'ORD',
    number: 4,
    text: 'REDUNDANT betyder ungefär:',
    options: [
      { label: 'A', text: 'nödvändig' },
      { label: 'B', text: 'överflödig' },
      { label: 'C', text: 'betydelsefull' },
      { label: 'D', text: 'komplicerad' },
    ],
    correctAnswer: 'B',
    explanation: 'Redundant betyder överflödig, onödig upprepning eller mer än vad som behövs.',
  },
  {
    id: 'ord-005',
    section: 'ORD',
    number: 5,
    text: 'SUBTIL betyder ungefär:',
    options: [
      { label: 'A', text: 'tydlig' },
      { label: 'B', text: 'grov' },
      { label: 'C', text: 'fin' },
      { label: 'D', text: 'snabb' },
    ],
    correctAnswer: 'C',
    explanation: 'Subtil betyder fin, diskret, inte påträngande eller svår att uppfatta.',
  },
  {
    id: 'ord-006',
    section: 'ORD',
    number: 6,
    text: 'DOGMATISK betyder ungefär:',
    options: [
      { label: 'A', text: 'flexibel' },
      { label: 'B', text: 'tvivelaktig' },
      { label: 'C', text: 'oeftergivlig' },
      { label: 'D', text: 'opartisk' },
    ],
    correctAnswer: 'C',
    explanation: 'Dogmatisk betyder att strikt hålla fast vid vissa principer utan att acceptera ifrågasättande.',
  },
  {
    id: 'ord-007',
    section: 'ORD',
    number: 7,
    text: 'EMPATISK betyder ungefär:',
    options: [
      { label: 'A', text: 'känslokall' },
      { label: 'B', text: 'inlevelseförmögen' },
      { label: 'C', text: 'energisk' },
      { label: 'D', text: 'impulsiv' },
    ],
    correctAnswer: 'B',
    explanation: 'Empatisk betyder att ha förmåga att sätta sig in i andras känslor och upplevelser.',
  },
  {
    id: 'ord-008',
    section: 'ORD',
    number: 8,
    text: 'KONTRADIKTORISK betyder ungefär:',
    options: [
      { label: 'A', text: 'motsägelsefull' },
      { label: 'B', text: 'sammanhängande' },
      { label: 'C', text: 'överensstämmande' },
      { label: 'D', text: 'avtalsmässig' },
    ],
    correctAnswer: 'A',
    explanation: 'Kontradiktorisk betyder motsägelsefull, innehåller eller uttrycker motsägelser.',
  },
  {
    id: 'ord-009',
    section: 'ORD',
    number: 9,
    text: 'PREVALENT betyder ungefär:',
    options: [
      { label: 'A', text: 'sällsynt' },
      { label: 'B', text: 'förhärskande' },
      { label: 'C', text: 'förebyggande' },
      { label: 'D', text: 'preliminär' },
    ],
    correctAnswer: 'B',
    explanation: 'Prevalent betyder förhärskande, dominerande, utbredd eller vanligt förekommande.',
  },
  {
    id: 'ord-010',
    section: 'ORD',
    number: 10,
    text: 'ESOTERISK betyder ungefär:',
    options: [
      { label: 'A', text: 'allmänt känd' },
      { label: 'B', text: 'för de invigda' },
      { label: 'C', text: 'utländsk' },
      { label: 'D', text: 'estetisk' },
    ],
    correctAnswer: 'B',
    explanation: 'Esoterisk betyder avsedd för eller förstådd av endast en liten grupp med specialkunskap.',
  },
];

// Mock questions for LÄS (Läsförståelse / Swedish Reading Comprehension)
export const MOCK_QUESTIONS_LAS: Question[] = [
  {
    id: 'las-001',
    section: 'LÄS',
    number: 1,
    text: 'Lagen om allemansrätten ger alla rätt att vistas i naturen, även på privat mark. Man får dock inte skada natur eller djurliv. Det är tillåtet att plocka vilda bär och svamp, men inte att skada träd eller buskar.\n\nVad är huvudsyftet med allemansrätten?',
    options: [
      { label: 'A', text: 'Att skydda privat egendom' },
      { label: 'B', text: 'Att ge allmänheten tillgång till naturen' },
      { label: 'C', text: 'Att reglera kommersiell bärplockning' },
      { label: 'D', text: 'Att bevara hotade växtarter' },
    ],
    correctAnswer: 'B',
    explanation: 'Texten beskriver hur allemansrätten ger alla rätt att vistas i naturen, vilket visar att huvudsyftet är att ge allmänheten naturtillgång.',
  },
  {
    id: 'las-002',
    section: 'LÄS',
    number: 2,
    text: 'Fotosyntes är processen där växter omvandlar solljus till energi. Klorofyll i växternas blad absorberar ljus, främst blått och rött ljus, medan grönt ljus reflekteras. Därför ser vi bladen som gröna.\n\nVarför ser växternas blad gröna ut?',
    options: [
      { label: 'A', text: 'Klorofyll producerar grönt ljus' },
      { label: 'B', text: 'Bladen absorberar grönt ljus' },
      { label: 'C', text: 'Grönt ljus reflekteras av bladen' },
      { label: 'D', text: 'Solljuset innehåller mest grönt ljus' },
    ],
    correctAnswer: 'C',
    explanation: 'Texten anger tydligt att "grönt ljus reflekteras", vilket är anledningen till att vi uppfattar bladen som gröna.',
  },
  {
    id: 'las-003',
    section: 'LÄS',
    number: 3,
    text: 'Under vikingatiden var Sverige inte ett enat rike utan bestod av flera småkungariken. Handeln var viktig och vikingarna reste långt för att handla och erövra. Runskrift användes för att dokumentera viktiga händelser på runstenar.\n\nVad kan man dra för slutsats om vikingasamhället?',
    options: [
      { label: 'A', text: 'Sverige var politiskt splittrat under vikingatiden' },
      { label: 'B', text: 'Vikingarna var främst bönder utan kontakt med omvärlden' },
      { label: 'C', text: 'Runskrift var det enda skriftspråket i Norden' },
      { label: 'D', text: 'Alla vikingar kunde läsa och skriva' },
    ],
    correctAnswer: 'A',
    explanation: 'Texten beskriver explicit att Sverige "inte var ett enat rike utan bestod av flera småkungariken", vilket visar politisk splittring.',
  },
];

// Mock questions for KVA (Kvantitativa jämförelser / Quantitative Comparisons)
export const MOCK_QUESTIONS_KVA: Question[] = [
  {
    id: 'kva-001',
    section: 'KVA',
    number: 1,
    text: 'Jämför de två kvantiteterna:\nKvantitet I: 3x + 5, där x = 4\nKvantitet II: 2x + 10, där x = 5',
    options: [
      { label: 'A', text: 'Kvantitet I är störst' },
      { label: 'B', text: 'Kvantitet II är störst' },
      { label: 'C', text: 'Kvantiteterna är lika stora' },
      { label: 'D', text: 'Det går inte att avgöra' },
    ],
    correctAnswer: 'B',
    explanation: 'Kvantitet I: 3(4) + 5 = 12 + 5 = 17. Kvantitet II: 2(5) + 10 = 10 + 10 = 20. Så kvantitet II är störst (20 > 17).',
  },
  {
    id: 'kva-002',
    section: 'KVA',
    number: 2,
    text: 'Jämför de två kvantiteterna:\nKvantitet I: Arean av en cirkel med radie 3 cm\nKvantitet II: Arean av en kvadrat med sida 5 cm',
    options: [
      { label: 'A', text: 'Kvantitet I är störst' },
      { label: 'B', text: 'Kvantitet II är störst' },
      { label: 'C', text: 'Kvantiteterna är lika stora' },
      { label: 'D', text: 'Det går inte att avgöra' },
    ],
    correctAnswer: 'A',
    explanation: 'Kvantitet I: πr² = π(3²) = 9π ≈ 28.3 cm². Kvantitet II: 5² = 25 cm². Så kvantitet I är störst (28.3 > 25).',
  },
  {
    id: 'kva-003',
    section: 'KVA',
    number: 3,
    text: 'Jämför de två kvantiteterna:\nKvantitet I: x² där x > 1\nKvantitet II: 2x där x > 1',
    options: [
      { label: 'A', text: 'Kvantitet I är störst' },
      { label: 'B', text: 'Kvantitet II är störst' },
      { label: 'C', text: 'Kvantiteterna är lika stora' },
      { label: 'D', text: 'Det går inte att avgöra' },
    ],
    correctAnswer: 'D',
    explanation: 'För x = 1.5: x² = 2.25, 2x = 3, så II > I. För x = 3: x² = 9, 2x = 6, så I > II. Svaret beror på värdet av x, därför går det inte att avgöra.',
  },
];

// Map section code to questions
export const MOCK_QUESTIONS: Record<SectionCode, Question[]> = {
  XYZ: MOCK_QUESTIONS_XYZ,
  ORD: MOCK_QUESTIONS_ORD,
  LÄS: MOCK_QUESTIONS_LAS,
  KVA: MOCK_QUESTIONS_KVA,
  // For other sections, use placeholders
  MEK: MOCK_QUESTIONS_ORD,
  ELF: MOCK_QUESTIONS_ORD,
  NOG: MOCK_QUESTIONS_XYZ,
  DTK: MOCK_QUESTIONS_XYZ,
};

// Helper to get questions for a section
export function getQuestionsForSection(section: SectionCode, count: number = 10): Question[] {
  const questions = MOCK_QUESTIONS[section] || MOCK_QUESTIONS.XYZ;
  return questions.slice(0, count).map((q, index) => ({
    ...q,
    number: index + 1,
  }));
}

// Get a mixed set of questions from different sections
export function getMixedQuestions(count: number = 10): Question[] {
  // Take proportional amounts from each section (representative HP mix)
  const ord = MOCK_QUESTIONS_ORD.slice(0, 3);
  const las = MOCK_QUESTIONS_LAS.slice(0, 2);
  const xyz = MOCK_QUESTIONS_XYZ.slice(0, 3);
  const kva = MOCK_QUESTIONS_KVA.slice(0, 2);

  // Combine and shuffle
  const mixed = [...ord, ...las, ...xyz, ...kva]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map((q, i) => ({ ...q, number: i + 1 }));

  return mixed;
}

// Calculate XP earned from a quiz session
export function calculateSessionXP(answers: AnswerRecord[]): { xp: number; accuracy: number } {
  let xp = 0;
  let streak = 0;
  let correct = 0;

  for (const answer of answers) {
    if (answer.correct) {
      correct++;
      xp += 10 + (streak * 2);
      streak++;
    } else {
      streak = 0;
    }
  }

  const accuracy = answers.length > 0 ? (correct / answers.length) * 100 : 0;
  return { xp: Math.round(xp), accuracy: Math.round(accuracy) };
}
