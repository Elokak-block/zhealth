import { questions } from './questions';
import type { AnswerSet, PillarId, PillarScores, ResultData } from './types';
import { PILLARS } from './types';

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
  const riskFlags = generateRiskFlags(pillarScores, answers);
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

function generateRiskFlags(pillarScores: PillarScores, answers: AnswerSet): string[] {
  const flags = new Set<string>();

  if (pillarScores.metabolic > 60 || (answers.q2 > 4 && answers.q5 > 8)) {
    flags.add('Elevated Type 2 Diabetes Risk Signals');
  }

  if (pillarScores.cardiovascular > 50 || (answers.q11 > 7 && answers.q14 > 4)) {
    flags.add('Lifestyle Pattern Aligns With Increased Cardiovascular Risk');
  }

  if (pillarScores.inflammatory > 55 || (answers.q7 > 3 && answers.q10 > 6)) {
    flags.add('Inflammatory Load Higher Than Recommended Range');
  }
    
  if (answers.q6 > 5 || answers.q8 > 4) {
      flags.add('Cancer-Linked Lifestyle Signals Present (Non-Diagnostic)');
  }
    
  if (pillarScores.hormonal > 65 || (answers.q16 < 4 && answers.q17 > 7)) {
    flags.add('High Hormonal & Stress Load Indicators');
  }

  return Array.from(flags);
}

function getPrimaryRiskDrivers(individualScores: Record<string, number>) {
  return Object.entries(individualScores)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
    .slice(0, 2)
    .map(([questionId]) => {
      const question = questions.find((q) => q.id === questionId);
      return {
        questionText: question?.text || '',
        questionId: questionId,
        answerValue: individualScores[questionId]
      };
    });
}
