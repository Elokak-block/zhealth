import { questions } from './questions';
import type { AnswerSet, PillarId, PillarScores, ResultData } from './types';
import { PILLARS } from './types';

export function calculateScores(answers: AnswerSet): ResultData {
  const pillarRawScores: Record<PillarId, number> = {
    diet: 0,
    activity: 0,
    sleep: 0,
    stress: 0,
    habits: 0,
    medical: 0,
    lifestyle: 0,
  };

  for (const question of questions) {
    const answerValue = answers[question.id];
    // For unanswered MCQs, default to the worst score (0).
    const score = answerValue !== undefined ? question.scoringFunction(answerValue) : 0;
    pillarRawScores[question.pillar] += score;
  }

  const pillarScores: PillarScores = pillarRawScores;
  
  const totalScore = Object.values(pillarScores).reduce((sum, score) => sum + score, 0);
  const maxScore = Object.values(PILLARS).reduce((sum, p) => sum + p.maxScore, 0);
  
  // The lifestyleStrainIndex is the inverse of the health score, normalized to 100.
  // Higher strain means lower health score.
  const lifestyleStrainIndex = 100 - Math.round((totalScore / maxScore) * 100);

  const tier = getResultTier(lifestyleStrainIndex);
  const riskFlags = generateRiskFlags(pillarScores);
  
  return {
    lifestyleStrainIndex,
    totalScore,
    maxScore,
    tier,
    pillarScores,
    riskFlags,
  };
}

function getResultTier(strainIndex: number) {
  if (strainIndex <= 20) { // Corresponds to 80-100 score, but strain is low
    return { name: 'Excellent', description: 'Your lifestyle habits are strong; maintain current routines.' };
  }
  if (strainIndex <= 31) { // 69-55 score range -> strain 31-45
     return { name: 'Moderate', description: 'Some areas may need attention. Focus on consistency.' };
  }
  if (strainIndex <= 50) { // 54-40 score range -> strain 46-60
    return { name: 'Elevated', description: 'Lifestyle strain is noticeable; consider habit adjustments.' };
  }
  if (strainIndex <= 69) { // 39-25 score range -> strain 61-75
    return { name: 'High', description: 'Significant lifestyle strain; prioritize stress, diet, and activity changes.' };
  }
  return { name: 'Very High', description: 'Very high lifestyle strain; professional guidance is recommended.' };
}


function generateRiskFlags(pillarScores: PillarScores) {
  const flags: { name: string; tip: string }[] = [];
  const thresholds: Record<PillarId, { limit: number; tip: string }> = {
    diet: { limit: 6, tip: 'Focus on whole foods and reduce processed items.' },
    activity: { limit: 6, tip: 'Incorporate at least 30 minutes of moderate activity most days.' },
    sleep: { limit: 6, tip: 'Aim for a consistent 7-9 hours of sleep per night.' },
    stress: { limit: 6, tip: 'Practice daily mindfulness or relaxation techniques.' },
    habits: { limit: 10, tip: 'Review substance use and its impact on your health.' },
    medical: { limit: 10, tip: 'Stay proactive with regular medical check-ups.' },
    lifestyle: { limit: 6, tip: 'Schedule time for hobbies and social connection.' },
  };

  for (const pillar in pillarScores) {
    const p = pillar as PillarId;
    if (pillarScores[p] < thresholds[p].limit) {
      flags.push({
        name: PILLARS[p].name,
        tip: thresholds[p].tip,
      });
    }
  }

  return flags;
}
