import { questions } from './questions';
import type { AnswerSet, PillarId, PillarScores, ResultData } from './types';
import { PILLARS } from './types';

// Maps a 0-10 user response to a 0-4 score for calculation.
// Slider (0-10) or MCQ (0, 3, 7, 10 etc) -> 0-10 (scoringFunction) -> 0-4 (internal score for flags)
// This is not used for the main score, only for flag logic.
function convertToFourPointScale(score: number): number {
  if (score <= 1) return 0; // Never / Very Low
  if (score <= 3.5) return 1; // Rarely
  if (score <= 6.5) return 2; // Sometimes
  if (score <= 9) return 3; // Often
  return 4; // Very Often / Always
}

export function calculateScores(answers: AnswerSet): ResultData {
  const individualScores: Record<string, number> = {};
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer !== undefined) {
      individualScores[question.id] = question.scoringFunction(answer);
    }
  }

  const pillarRawScores: Record<PillarId, { total: number; count: number }> = {
    metabolic: { total: 0, count: 0 },
    inflammatory: { total: 0, count: 0 },
    cardiovascular: { total: 0, count: 0 },
    hormonal: { total: 0, count: 0 },
    stability: { total: 0, count: 0 },
  };

  for (const question of questions) {
    const score = individualScores[question.id];
    if (score !== undefined) {
      pillarRawScores[question.pillar].total += score;
      pillarRawScores[question.pillar].count += 1;
    }
  }

  const pillarScores: PillarScores = (
    Object.keys(pillarRawScores) as PillarId[]
  ).reduce((acc, pillarId) => {
    const { total, count } = pillarRawScores[pillarId];
    acc[pillarId] = count > 0 ? (total / (count * 10)) * 100 : 0; // Normalize to 0-100
    return acc;
  }, {} as PillarScores);

  const lifestyleStrainIndex = Math.round(
    Object.values(PILLARS).reduce((total, pillar) => {
      return total + (pillarScores[pillar.id] || 0) * pillar.weight;
    }, 0)
  );

  const tier = getResultTier(lifestyleStrainIndex);
  const riskFlags = generateRiskFlags(pillarScores, individualScores, lifestyleStrainIndex);
  const primaryRiskDrivers = getPrimaryRiskDrivers(individualScores);

  return {
    lifestyleStrainIndex,
    tier,
    pillarScores,
    riskFlags,
    primaryRiskDrivers,
  };
}

function getResultTier(score: number) {
  if (score <= 25) {
    return { name: 'Low Strain', description: 'Your lifestyle habits appear balanced and supportive of your well-being.' };
  }
  if (score <= 45) {
    return { name: 'Moderate Load', description: 'Some of your habits may be contributing to lifestyle strain. It\'s a good time to pay attention to these areas.' };
  }
  if (score <= 70) {
    return { name: 'High Strain', description: 'Your lifestyle is likely putting sustained pressure on you, which could impact your long-term health.' };
  }
  return { name: 'Critical Load', description: 'Your current lifestyle patterns show a strong alignment with health risk indicators and may indicate a high level of burnout.' };
}


function generateRiskFlags(pillarScores: PillarScores, individualScores: Record<string, number>, lifestyleStrainIndex: number): string[] {
  const flags = new Set<string>();

  const fourPointScores = Object.entries(individualScores).reduce((acc, [key, value]) => {
    acc[key] = convertToFourPointScale(value);
    return acc;
    }, {} as Record<string, number>);


  // TYPE 2 DIABETES
  const diabetesConditions = [
    fourPointScores.q1 >= 3,
    fourPointScores.q2 >= 3,
    fourPointScores.q3 >= 2,
    fourPointScores.q6 >= 3,
    fourPointScores.q7 >= 2,
  ].filter(Boolean).length;
  if (pillarScores.metabolic >= 65 && diabetesConditions >= 3) {
    flags.add('Elevated Metabolic Risk Signals');
  }

  // CANCER-LINKED
  const cancerConditions = [
    fourPointScores.q8 >= 2,
    fourPointScores.q9 >= 3,
    fourPointScores.q10 >= 3,
    fourPointScores.q11 >= 3, // Reverse scored in questions.ts, high score is bad
    fourPointScores.q12 >= 3, // Reverse scored
    fourPointScores.q13 >= 3,
  ].filter(Boolean).length;
  if (pillarScores.inflammatory >= 60 && cancerConditions >= 3) {
    flags.add('Inflammatory Lifestyle Risk Signals Present');
  }

  // CARDIOVASCULAR
  const cardioConditions = [
    fourPointScores.q16 >= 2,
    fourPointScores.q18 >= 3,
    fourPointScores.q19 >= 3,
    fourPointScores.q15 >= 3, // Reverse scored
  ].filter(Boolean).length;
  if (pillarScores.cardiovascular >= 55 && cardioConditions >= 2) {
    flags.add('Cardiovascular Strain Indicators Detected');
  }

  // HORMONAL
  const hormonalConditions = [
    fourPointScores.q22 >= 3,
    fourPointScores.q23 >= 3,
    fourPointScores.q24 >= 3,
    fourPointScores.q25 >= 3,
  ].filter(Boolean).length;
  if (pillarScores.hormonal >= 60 && hormonalConditions >= 3) {
    flags.add('Stress Load & Recovery Imbalance');
  }
  
  // BURNOUT
  const highPillarCount = Object.values(pillarScores).filter(score => score >= 60).length;
  if (lifestyleStrainIndex >= 70 || highPillarCount >= 3) {
    flags.add('High Systemic Lifestyle Strain');
  }

  // Rank by severity and take top 3
  const severityOrder = [
    'High Systemic Lifestyle Strain',
    'Cardiovascular Strain Indicators Detected',
    'Inflammatory Lifestyle Risk Signals Present',
    'Elevated Metabolic Risk Signals',
    'Stress Load & Recovery Imbalance',
  ];

  return Array.from(flags).sort((a, b) => severityOrder.indexOf(a) - severityOrder.indexOf(b)).slice(0, 3);
}


function getPrimaryRiskDrivers(individualScores: Record<string, number>) {
  return Object.entries(individualScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, 3)
    .map(([questionId]) => {
      const question = questions.find((q) => q.id === questionId);
      return {
        questionText: question?.text || '',
        questionId: questionId,
        answerValue: individualScores[questionId]
      };
    });
}
