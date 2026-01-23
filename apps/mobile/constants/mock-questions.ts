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

// Mock questions for XYZ (Matematisk problemlosning)
export const MOCK_QUESTIONS_XYZ: Question[] = [
  {
    id: 'xyz-001',
    section: 'XYZ',
    number: 1,
    text: 'Vad ar 45 % av 2/9?',
    options: [
      { label: 'A', text: '1/9' },
      { label: 'B', text: '1/10' },
      { label: 'C', text: '1/11' },
      { label: 'D', text: '1/12' },
    ],
    correctAnswer: 'B',
    explanation: '45% = 0.45 = 9/20. Sa 9/20 x 2/9 = 18/180 = 1/10.',
  },
  {
    id: 'xyz-002',
    section: 'XYZ',
    number: 2,
    text: 'En rektangel har omkretsen 28 cm. Om langden ar 3 cm langre an bredden, vad ar arean?',
    options: [
      { label: 'A', text: '40 cm2' },
      { label: 'B', text: '45 cm2' },
      { label: 'C', text: '46 cm2' },
      { label: 'D', text: '48 cm2' },
    ],
    correctAnswer: 'C',
    explanation: 'Lat bredden = b, langden = b+3. Omkrets: 2(b + b+3) = 28 -> 4b + 6 = 28 -> b = 5.5. Area = 5.5 x 8.5 = 46.75 ~ 46 cm2.',
  },
  {
    id: 'xyz-003',
    section: 'XYZ',
    number: 3,
    text: 'Om x2 - 5x + 6 = 0, vad ar summan av losningarna?',
    options: [
      { label: 'A', text: '2' },
      { label: 'B', text: '3' },
      { label: 'C', text: '5' },
      { label: 'D', text: '6' },
    ],
    correctAnswer: 'C',
    explanation: 'Enligt Vietas formler ar summan av rotterna = -(-5)/1 = 5. (Rotterna ar 2 och 3.)',
  },
  {
    id: 'xyz-004',
    section: 'XYZ',
    number: 4,
    text: 'En butik sanker priset med 20%. Hur mycket maste priset hojas for att aterga till ursprungspriset?',
    options: [
      { label: 'A', text: '20%' },
      { label: 'B', text: '25%' },
      { label: 'C', text: '30%' },
      { label: 'D', text: '40%' },
    ],
    correctAnswer: 'B',
    explanation: 'Om ursprungspriset ar 100 kr blir det nya priset 80 kr. For att ga fran 80 till 100 behovs 20/80 = 25% hojning.',
  },
  {
    id: 'xyz-005',
    section: 'XYZ',
    number: 5,
    text: 'Hur manga trestalliga tal finns det dar alla siffror ar olika och summan av siffrorna ar 10?',
    options: [
      { label: 'A', text: '24' },
      { label: 'B', text: '30' },
      { label: 'C', text: '36' },
      { label: 'D', text: '42' },
    ],
    correctAnswer: 'C',
    explanation: 'Kombinationer som summerar till 10 med olika siffror: (1,2,7), (1,3,6), (1,4,5), (2,3,5), (2,4,4)... Efter att rakna permutationer far vi 36.',
  },
  {
    id: 'xyz-006',
    section: 'XYZ',
    number: 6,
    text: 'En klocka visar ratt tid kl 12:00. Om den gar 2 minuter for fort per timme, vad visar den nar den riktiga tiden ar 18:00?',
    options: [
      { label: 'A', text: '18:10' },
      { label: 'B', text: '18:12' },
      { label: 'C', text: '18:14' },
      { label: 'D', text: '18:16' },
    ],
    correctAnswer: 'B',
    explanation: '6 timmar x 2 minuter = 12 minuter for fort. Klockan visar 18:12.',
  },
  {
    id: 'xyz-007',
    section: 'XYZ',
    number: 7,
    text: 'Om 3^x = 27 och 2^y = 16, vad ar x + y?',
    options: [
      { label: 'A', text: '5' },
      { label: 'B', text: '6' },
      { label: 'C', text: '7' },
      { label: 'D', text: '8' },
    ],
    correctAnswer: 'C',
    explanation: '3^x = 27 = 3^3 -> x = 3. 2^y = 16 = 2^4 -> y = 4. x + y = 7.',
  },
  {
    id: 'xyz-008',
    section: 'XYZ',
    number: 8,
    text: 'En triangel har sidorna 5 cm, 12 cm och 13 cm. Vad ar triangelns area?',
    options: [
      { label: 'A', text: '24 cm2' },
      { label: 'B', text: '30 cm2' },
      { label: 'C', text: '32.5 cm2' },
      { label: 'D', text: '36 cm2' },
    ],
    correctAnswer: 'B',
    explanation: '5^2 + 12^2 = 25 + 144 = 169 = 13^2. Det ar en ratvinklig triangel! Area = (5 x 12)/2 = 30 cm2.',
  },
  {
    id: 'xyz-009',
    section: 'XYZ',
    number: 9,
    text: 'Vilket ar det minsta positiva heltal som ar delbart med bade 12 och 18?',
    options: [
      { label: 'A', text: '24' },
      { label: 'B', text: '30' },
      { label: 'C', text: '36' },
      { label: 'D', text: '72' },
    ],
    correctAnswer: 'C',
    explanation: 'MGM(12, 18) = 36. 12 = 2^2 x 3, 18 = 2 x 3^2. MGM = 2^2 x 3^2 = 36.',
  },
  {
    id: 'xyz-010',
    section: 'XYZ',
    number: 10,
    text: 'Om f(x) = 2x + 3, vad ar f(f(2))?',
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

// Mock questions for ORD (Ordforstaelse)
export const MOCK_QUESTIONS_ORD: Question[] = [
  {
    id: 'ord-001',
    section: 'ORD',
    number: 1,
    text: 'PRAGMATISK betyder ungefar:',
    options: [
      { label: 'A', text: 'teoretisk' },
      { label: 'B', text: 'praktisk' },
      { label: 'C', text: 'pessimistisk' },
      { label: 'D', text: 'idealistisk' },
    ],
    correctAnswer: 'B',
    explanation: 'Pragmatisk betyder praktiskt inriktad, fokuserad pa vad som fungerar snarare an teorier.',
  },
  {
    id: 'ord-002',
    section: 'ORD',
    number: 2,
    text: 'LATENT betyder ungefar:',
    options: [
      { label: 'A', text: 'uppenbar' },
      { label: 'B', text: 'dold' },
      { label: 'C', text: 'sen' },
      { label: 'D', text: 'aktiv' },
    ],
    correctAnswer: 'B',
    explanation: 'Latent betyder dold, vilande, inte synlig men narvarande under ytan.',
  },
  {
    id: 'ord-003',
    section: 'ORD',
    number: 3,
    text: 'AMBIVALENT betyder ungefar:',
    options: [
      { label: 'A', text: 'bestamd' },
      { label: 'B', text: 'likgiltig' },
      { label: 'C', text: 'kluven' },
      { label: 'D', text: 'entusiastisk' },
    ],
    correctAnswer: 'C',
    explanation: 'Ambivalent betyder att ha motstridiga kanslor, vara kluven mellan tva hallningar.',
  },
  {
    id: 'ord-004',
    section: 'ORD',
    number: 4,
    text: 'REDUNDANT betyder ungefar:',
    options: [
      { label: 'A', text: 'nodvandig' },
      { label: 'B', text: 'overflodig' },
      { label: 'C', text: 'betydelsefull' },
      { label: 'D', text: 'komplicerad' },
    ],
    correctAnswer: 'B',
    explanation: 'Redundant betyder overflodig, onodig upprepning eller mer an vad som behovs.',
  },
  {
    id: 'ord-005',
    section: 'ORD',
    number: 5,
    text: 'SUBTIL betyder ungefar:',
    options: [
      { label: 'A', text: 'tydlig' },
      { label: 'B', text: 'grov' },
      { label: 'C', text: 'fin' },
      { label: 'D', text: 'snabb' },
    ],
    correctAnswer: 'C',
    explanation: 'Subtil betyder fin, diskret, inte patrangande eller svar att uppfatta.',
  },
  {
    id: 'ord-006',
    section: 'ORD',
    number: 6,
    text: 'DOGMATISK betyder ungefar:',
    options: [
      { label: 'A', text: 'flexibel' },
      { label: 'B', text: 'tvivelaktig' },
      { label: 'C', text: 'oeftergivlig' },
      { label: 'D', text: 'opartisk' },
    ],
    correctAnswer: 'C',
    explanation: 'Dogmatisk betyder att strikt halla fast vid vissa principer utan att acceptera ifragasattande.',
  },
  {
    id: 'ord-007',
    section: 'ORD',
    number: 7,
    text: 'EMPATISK betyder ungefar:',
    options: [
      { label: 'A', text: 'kanslokall' },
      { label: 'B', text: 'inlevelsefomogen' },
      { label: 'C', text: 'energisk' },
      { label: 'D', text: 'impulsiv' },
    ],
    correctAnswer: 'B',
    explanation: 'Empatisk betyder att ha formaga att satta sig in i andras kanslor och upplevelser.',
  },
  {
    id: 'ord-008',
    section: 'ORD',
    number: 8,
    text: 'KONTRADIKTORISK betyder ungefar:',
    options: [
      { label: 'A', text: 'motsagelsefull' },
      { label: 'B', text: 'sammanhangande' },
      { label: 'C', text: 'overensstammande' },
      { label: 'D', text: 'avtalsmassig' },
    ],
    correctAnswer: 'A',
    explanation: 'Kontradiktorisk betyder motsagelsefull, innehaller eller uttrycker motsagelser.',
  },
  {
    id: 'ord-009',
    section: 'ORD',
    number: 9,
    text: 'PREVALENT betyder ungefar:',
    options: [
      { label: 'A', text: 'sallsynt' },
      { label: 'B', text: 'forharskande' },
      { label: 'C', text: 'forebyggande' },
      { label: 'D', text: 'preliminar' },
    ],
    correctAnswer: 'B',
    explanation: 'Prevalent betyder forharskande, dominerande, utbredd eller vanligt forekommande.',
  },
  {
    id: 'ord-010',
    section: 'ORD',
    number: 10,
    text: 'ESOTERISK betyder ungefar:',
    options: [
      { label: 'A', text: 'allmant kand' },
      { label: 'B', text: 'for de invigda' },
      { label: 'C', text: 'utlandsk' },
      { label: 'D', text: 'estetisk' },
    ],
    correctAnswer: 'B',
    explanation: 'Esoterisk betyder avsedd for eller forstadd av endast en liten grupp med specialkunskap.',
  },
];

// Map section code to questions
export const MOCK_QUESTIONS: Record<SectionCode, Question[]> = {
  XYZ: MOCK_QUESTIONS_XYZ,
  ORD: MOCK_QUESTIONS_ORD,
  // For other sections, use XYZ questions as placeholder
  LÄS: MOCK_QUESTIONS_ORD,
  MEK: MOCK_QUESTIONS_ORD,
  ELF: MOCK_QUESTIONS_ORD,
  KVA: MOCK_QUESTIONS_XYZ,
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
