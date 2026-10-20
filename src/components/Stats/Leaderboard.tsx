import React from 'react';
import { UserProgress } from '../../types';
import { StudentRankingTable } from './StudentRankingTable';

export interface LeaderboardProps {
  userProgress: UserProgress;
  onNavigateToCases?: () => void;
  onNavigateToGames?: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  userProgress,
  onNavigateToCases,
  onNavigateToGames
}) => {
  return (
    <StudentRankingTable
      userProgress={userProgress}
      onNavigateToCases={onNavigateToCases}
      onNavigateToGames={onNavigateToGames}
    />
  );
};

export { StudentRankingTable };
