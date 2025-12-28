export const PILLARS = {
  diet: {
    id: 'diet',
    name: 'Diet & Nutrition',
    weight: 0.2,
  },
  activity: {
    id: 'activity',
    name: 'Physical Activity',
    weight: 0.2,
  },
  sleep: {
    id: 'sleep',
    name: 'Sleep & Recovery',
    weight: 0.2,
  },
  stress: {
    id: 'stress',
    name: 'Stress & Mental Health',
    weight: 0.2,
  },
  habits: {
    id: 'habits',
    name: 'Substance & Lifestyle Habits',
    weight: 0.2,
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
