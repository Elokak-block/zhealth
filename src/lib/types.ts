export const PILLARS = {
  metabolic: {
    id: 'metabolic',
    name: 'Metabolic & Blood Sugar Load',
    weight: 0.25,
  },
  inflammatory: {
    id: 'inflammatory',
    name: 'Inflammation & Cancer-Linked Habits',
    weight: 0.25,
  },
  cardiovascular: {
    id: 'cardiovascular',
    name: 'Cardiovascular Strain',
    weight: 0.2,
  },
  hormonal: {
    id: 'hormonal',
    name: 'Hormonal & Stress Load',
    weight: 0.2,
  },
  stability: {
    id: 'stability',
    name: 'Lifestyle Stability',
    weight: 0.1,
  },
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
  // Maps input value (slider value or option value) to a 0-10 score
  scoringFunction: (value: number) => number;
}

export type AnswerSet = Record<string, number>;

export type PillarScores = Record<PillarId, number>;

export interface ResultData {
  lifestyleStrainIndex: number;
  tier: {
    name: string;
    description: string;
  };
  pillarScores: PillarScores;
  riskFlags: string[];
  primaryRiskDrivers: {
    questionText: string;
    answerValue: number;
    questionId: string;
  }[];
}
