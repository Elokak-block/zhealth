export const PILLARS = {
  diet: {
    id: 'diet',
    name: 'Diet & Nutrition',
    weight: 2,
    maxScore: 10
  },
  activity: {
    id: 'activity',
    name: 'Physical Activity',
    weight: 2,
    maxScore: 10
  },
  sleep: {
    id: 'sleep',
    name: 'Sleep & Recovery',
    weight: 2,
    maxScore: 10
  },
  stress: {
    id: 'stress',
    name: 'Stress & Mental Health',
    weight: 2,
    maxScore: 10
  },
  habits: {
    id: 'habits',
    name: 'Substance Use',
    weight: 3,
    maxScore: 15
  },
  medical: {
    id: 'medical',
    name: 'Medical & Family History',
    weight: 3,
    maxScore: 15
  },
  lifestyle: {
    id: 'lifestyle',
    name: 'Lifestyle & Habits',
    weight: 2,
    maxScore: 10
  }
} as const;

export type PillarId = keyof typeof PILLARS;

export interface QuestionOption {
  value: number;
  label: string;
}

export interface Question {
  id: string;
  pillar: PillarId;
  text: string;
  type: 'slider' | 'multiple-choice';
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  // Maps input value (slider value or option value) to a score
  scoringFunction: (value: number) => number;
}

export type AnswerSet = Record<string, number>;

export type PillarScores = Record<PillarId, number>;

export interface ResultData {
  lifestyleStrainIndex: number; // This will now be the percentage score
  totalScore: number;
  maxScore: number;
  tier: {
    name: string;
    description: string;
  };
  pillarScores: PillarScores;
  riskFlags: {
    name: string;
    tip: string;
  }[];
}
