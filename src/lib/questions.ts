import type { Question } from './types';

// Scoring function helper: linear scale from min to max -> 0-10
const linearScale = (value: number, min: number, max: number, reverse: boolean = false) => {
  const score = ((value - min) / (max - min)) * 10;
  return reverse ? 10 - score : score;
};

// Scoring for multiple choice is just the option value
const mcqScore = (value: number) => value;

export const questions: Question[] = [
  // A. Metabolic & Blood Sugar Load
  {
    id: 'q1',
    pillar: 'metabolic',
    text: 'How often do you consume sugary drinks (soda, sweetened teas, fruit juices)?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Never or rarely' },
      { value: 3, label: 'A few times a month' },
      { value: 7, label: 'A few times a week' },
      { value: 10, label: 'Daily or more' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q2',
    pillar: 'metabolic',
    text: 'How much of your diet consists of ultra-processed foods (e.g., packaged snacks, fast food, ready-to-eat meals)?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Less than 10%' },
      { value: 4, label: '10-30%' },
      { value: 7, label: '30-50%' },
      { value: 10, label: 'More than 50%' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q3',
    pillar: 'metabolic',
    text: 'How consistent is your meal timing from day to day?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'Very inconsistent',
    maxLabel: 'Very consistent',
    scoringFunction: (value) => linearScale(value, 0, 10, true), // Reverse score
  },
  {
    id: 'q4',
    pillar: 'metabolic',
    text: 'How often do you experience significant energy crashes or "afternoon slumps"?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Rarely or never' },
      { value: 4, label: 'Once or twice a week' },
      { value: 8, label: 'Most days' },
      { value: 10, label: 'Multiple times a day' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q5',
    pillar: 'metabolic',
    text: 'On average, how many hours a day are you sedentary (sitting at a desk, watching TV)?',
    type: 'slider',
    min: 0,
    max: 16,
    step: 1,
    minLabel: '0 hours',
    maxLabel: '16+ hours',
    scoringFunction: (value) => linearScale(value, 0, 16),
  },

  // B. Inflammation & Cancer-Linked Habits
  {
    id: 'q6',
    pillar: 'inflammatory',
    text: 'How frequently are you exposed to smoking or vaping (first or second-hand)?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Never' },
      { value: 5, label: 'Occasionally' },
      { value: 10, label: 'Daily' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q7',
    pillar: 'inflammatory',
    text: 'How many alcoholic drinks do you have in a typical week?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: '0' },
      { value: 3, label: '1-3' },
      { value: 7, label: '4-7' },
      { value: 10, label: 'More than 7' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q8',
    pillar: 'inflammatory',
    text: 'How many servings of red or processed meat (e.g., bacon, sausage, deli meats) do you eat per week?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: '0-1' },
      { value: 4, label: '2-3' },
      { value: 8, label: '4-6' },
      { value: 10, label: '7 or more' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q9',
    pillar: 'inflammatory',
    text: 'How would you rate your daily fiber intake (from fruits, vegetables, whole grains)?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'Very low',
    maxLabel: 'Very high',
    scoringFunction: (value) => linearScale(value, 0, 10, true), // Reverse score
  },
  {
    id: 'q10',
    pillar: 'inflammatory',
    text: 'How would you rate your level of chronic stress (ongoing pressure from work, relationships, etc.)?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'Very low',
    maxLabel: 'Very high',
    scoringFunction: (value) => linearScale(value, 0, 10),
  },

  // C. Cardiovascular Strain
  {
    id: 'q11',
    pillar: 'cardiovascular',
    text: 'How many days a week do you get at least 30 minutes of moderate physical activity (e.g., brisk walking, cycling)?',
    type: 'multiple-choice',
    options: [
      { value: 10, label: '0-1 days' },
      { value: 7, label: '2-3 days' },
      { value: 3, label: '4-5 days' },
      { value: 0, label: '6-7 days' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q12',
    pillar: 'cardiovascular',
    text: 'How often do you feel fatigued or tired even after a full night\'s sleep?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Rarely or never' },
      { value: 4, label: 'Sometimes' },
      { value: 8, label: 'Often' },
      { value: 10, label: 'Almost always' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q13',
    pillar: 'cardiovascular',
    text: 'Do you experience breathlessness during light physical activity (e.g., walking up a single flight of stairs)?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Never' },
      { value: 5, label: 'Sometimes' },
      { value: 10, label: 'Frequently' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q14',
    pillar: 'cardiovascular',
    text: 'How often do you add salt to your food or eat high-sodium processed foods?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Rarely' },
      { value: 4, label: 'Sometimes' },
      { value: 8, label: 'Often' },
      { value: 10, label: 'Almost every meal' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q15',
    pillar: 'cardiovascular',
    text: 'Are you aware of your family history regarding cardiovascular diseases (e.g., heart attack, stroke)?',
    type: 'multiple-choice',
    options: [
      { value: 0, label: 'Yes, and there is no significant history.' },
      { value: 1, label: 'Yes, and there is a history.' }, // Lightly weighted
      { value: 2, label: 'No, I am not aware.' }, // Slightly higher risk for not knowing
    ],
    scoringFunction: mcqScore,
  },

  // D. Hormonal & Stress Load
  {
    id: 'q16',
    pillar: 'hormonal',
    text: 'On a scale of 1 to 10, how would you rate your overall sleep quality?',
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    minLabel: 'Very poor',
    maxLabel: 'Excellent',
    scoringFunction: (value) => linearScale(value, 1, 10, true), // Reverse score
  },
  {
    id: 'q17',
    pillar: 'hormonal',
    text: 'How often do you feel restless, anxious, or "on edge" without a clear reason?',
    type: 'multiple-choice',
    options: [
        { value: 0, label: 'Rarely or never' },
        { value: 4, label: 'A few times a month' },
        { value: 8, label: 'A few times a week' },
        { value: 10, label: 'Most days' },
    ],
    scoringFunction: mcqScore
  },
  {
    id: 'q18',
    pillar: 'hormonal',
    text: 'How dependent do you feel on caffeine to get through the day?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'Not at all',
    maxLabel: 'Completely dependent',
    scoringFunction: (value) => linearScale(value, 0, 10),
  },
  {
    id: 'q19',
    pillar: 'hormonal',
    text: 'How many hours of screen time (phone, computer, TV) do you have in the last 2 hours before bed?',
    type: 'slider',
    min: 0,
    max: 4,
    step: 0.5,
    minLabel: '0 hours',
    maxLabel: '4+ hours',
    scoringFunction: (value) => linearScale(value, 0, 4),
  },

  // E. Lifestyle Stability
  {
    id: 'q20',
    pillar: 'stability',
    text: 'How consistent is your daily routine (wake-up time, work schedule, etc.)?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'Very chaotic',
    maxLabel: 'Very consistent',
    scoringFunction: (value) => linearScale(value, 0, 10, true), // Reverse score
  },
  {
    id: 'q21',
    pillar: 'stability',
    text: 'How would you rate your current level of financial stress?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'No stress',
    maxLabel: 'Extreme stress',
    scoringFunction: (value) => linearScale(value, 0, 10),
  },
  {
    id: 'q22',
    pillar: 'stability',
    text: 'How often do you feel rushed or under time pressure?',
    type: 'multiple-choice',
    options: [
        { value: 0, label: 'Rarely' },
        { value: 4, label: 'Sometimes' },
        { value: 8, label: 'Often' },
        { value: 10, label: 'Constantly' },
    ],
    scoringFunction: mcqScore,
  },
  {
    id: 'q23',
    pillar: 'stability',
    text: 'How effectively can you regulate your emotions when faced with a setback?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'Not at all',
    maxLabel: 'Very effectively',
    scoringFunction: (value) => linearScale(value, 0, 10, true), // Reverse score
  },
  {
    id: 'q24',
    pillar: 'stability',
    text: 'How strong is your social support network (friends, family you can confide in)?',
    type: 'slider',
    min: 0,
    max: 10,
    step: 1,
    minLabel: 'Very weak',
    maxLabel: 'Very strong',
    scoringFunction: (value) => linearScale(value, 0, 10, true), // Reverse score
  },
];
