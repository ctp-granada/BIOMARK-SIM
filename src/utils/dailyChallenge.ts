/**
 * Daily Challenge Engine
 * Computes deterministic daily case based on the current date
 * and manages persistence of daily challenge progress.
 */

import { ClinicalCase } from '../types';

export interface DailyChallengeState {
  date: string;
  caseId: string;
  completed: boolean;
  isCompletedToday: boolean;
  scoreEarned: number;
  timeSpentSeconds: number;
  bonusMultiplierApplied?: number;
  answeredOptionId?: string;
  isCorrect?: boolean;
}

export function getFormattedDailyDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getDailyChallengeCase(cases: ClinicalCase[]): ClinicalCase {
  if (!cases || cases.length === 0) {
    throw new Error('No cases available for daily challenge');
  }

  const todayStr = getFormattedDailyDate();
  let hash = 0;
  for (let i = 0; i < todayStr.length; i++) {
    hash = (hash << 5) - hash + todayStr.charCodeAt(i);
    hash |= 0;
  }
  const positiveIndex = Math.abs(hash) % cases.length;
  return cases[positiveIndex];
}

export function loadDailyChallengeState(): DailyChallengeState | null {
  try {
    const raw = localStorage.getItem('biomark_daily_challenge_state');
    if (!raw) return null;
    const parsed: DailyChallengeState = JSON.parse(raw);
    const today = getFormattedDailyDate();
    if (parsed.date === today) {
      return {
        ...parsed,
        isCompletedToday: parsed.completed || parsed.isCompletedToday || false
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveDailyChallengeCompletion(
  caseIdOrState: string | DailyChallengeState,
  scoreEarned?: number,
  timeSpentSeconds?: number,
  bonusMultiplierApplied?: number
): DailyChallengeState {
  const today = getFormattedDailyDate();
  let stateToSave: DailyChallengeState;

  if (typeof caseIdOrState === 'string') {
    stateToSave = {
      date: today,
      caseId: caseIdOrState,
      completed: true,
      isCompletedToday: true,
      scoreEarned: scoreEarned || 0,
      timeSpentSeconds: timeSpentSeconds || 0,
      bonusMultiplierApplied: bonusMultiplierApplied || 1.0,
      isCorrect: true
    };
  } else {
    stateToSave = {
      ...caseIdOrState,
      date: today,
      completed: true,
      isCompletedToday: true
    };
  }

  try {
    localStorage.setItem('biomark_daily_challenge_state', JSON.stringify(stateToSave));
  } catch (err) {
    console.error('Failed to save daily challenge completion', err);
  }

  return stateToSave;
}
