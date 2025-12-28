import { questions } from './questions';
import type { AnswerSet, PillarId, PillarScores, ResultData } from './types';
import { PILLARS } from './types';

// This function is not used with the new question set but is kept for potential future use.
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
    // A default value of 5 is used for sliders if not answered.
    // We treat this as a neutral score.
    const valueToScore = answer !== undefined ? answer : 5;
    individualScores[question.id] = question.scoringFunction(valueToScore);
  }

  const pillarRawScores: Record<PillarId, { total: number; count: number }> = {
    diet: { total: 0, count: 0 },
    activity: { total: 0, count: 0 },
    sleep: { total: 0, count: 0 },
    stress: { total: 0, count: 0 },
    habits: { total: 0, count: 0 },
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

  const totalWeight = Object.values(PILLARS).reduce((sum, p) => sum + p.weight, 0);
  
  const lifestyleStrainIndex = Math.round(
    Object.values(PILLARS).reduce((total, pillar) => {
      return total + (pillarScores[pillar.id] || 0) * pillar.weight;
    }, 0) / totalWeight
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

  if (pillarScores.diet > 65) {
    flags.add('Diet & Nutrition Patterns Observed');
  }
  if (pillarScores.activity > 60) {
    flags.add('Activity & Sedentary Balance Risks');
  }
  if (pillarScores.sleep > 55) {
    flags.add('Sleep & Recovery Imbalance');
  }
  if (pillarScores.stress > 60) {
    flags.add('Elevated Stress & Mental Fatigue');
  }
  
  const highPillarCount = Object.values(pillarScores).filter(score => score >= 60).length;
  if (lifestyleStrainIndex >= 70 || highPillarCount >= 3) {
    flags.add('High Systemic Lifestyle Strain');
  }

  // Rank by severity and take top 3
  const severityOrder = [
    'High Systemic Lifestyle Strain',
    'Elevated Stress & Mental Fatigue',
    'Diet & Nutrition Patterns Observed',
    'Activity & Sedentary Balance Risks',
    'Sleep & Recovery Imbalance',
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
