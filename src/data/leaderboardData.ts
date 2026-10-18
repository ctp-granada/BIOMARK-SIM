/**
 * Leaderboard Data for Student Escalafón
 * No fabricated or mock peer records: genuine real-student data only.
 */

export interface PeerStudent {
  id: string;
  name: string;
  avatar: string;
  institution: string;
  specialty: string;
  accuracyPct: number;
  streak: number;
  casesResolved: number;
  isUgr: boolean;
  badgeTitle: string;
  biomarkerFocus: string;
  lastActive: string;
  xp: number;
  score?: number;
  weeklyXp?: number;
  isCurrentUser?: boolean;
}

// Emptied: fabricated peer students and invented points removed
export const MOCK_LEADERBOARD_PEERS: PeerStudent[] = [];
