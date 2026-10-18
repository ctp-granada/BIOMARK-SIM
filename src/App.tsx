/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ActiveModule, ClinicalCase, BiomarkerOption, UserProgress, OrganSystem, DifficultyLevel, LabOrderEvaluation, SystemBadge } from './types';
import { CLINICAL_CASES_DATABASE } from './data/clinicalCases';
import { BIOMARKERS_DATABASE } from './data/biomarkers';
import { getStreakMultiplier } from './utils/gamification';
import { evaluateLabOrder } from './utils/labOrderEvaluator';
import { evaluateUserBadges, getNewlyUnlockedBadges } from './data/badges';
import { 
  getDailyChallengeCase, 
  loadDailyChallengeState, 
  saveDailyChallengeCompletion, 
  DailyChallengeState 
} from './utils/dailyChallenge';

import { Navbar } from './components/Navbar';
import { GamifiedDashboard } from './components/GamifiedDashboard';
import { AdaptiveProgressBanner } from './components/AdaptiveProgressBanner';
import { CaseList } from './components/CaseBank/CaseList';
import { CaseDetailModal } from './components/CaseBank/CaseDetailModal';
import { ChallengeMode } from './components/Challenge/ChallengeMode';
import { ImmediateFeedbackModal } from './components/Challenge/ImmediateFeedbackModal';
import { GuardiaOverModal } from './components/Challenge/GuardiaOverModal';
import { BadgeUnlockModal } from './components/Stats/BadgeUnlockModal';
import { BiomarkerLibrary } from './components/Library/BiomarkerLibrary';
import { UserStatsView } from './components/Stats/UserStatsView';
import { Leaderboard } from './components/Stats/Leaderboard';
import { AICaseGeneratorModal } from './components/AICaseGeneratorModal';
import { DailyChallengeView } from './components/DailyChallenge/DailyChallengeView';
import { OnboardingTour } from './components/Onboarding/OnboardingTour';
import { AuthModal } from './components/Auth/AuthModal';
import { CourseHome } from './components/Portal/CourseHome';
import { LandingPage } from './components/LandingPage';
import { BiomedicalCity } from './components/City/BiomedicalCity';
import { InteractiveLabsContainer } from './components/InteractiveLabs/InteractiveLabsContainer';
import { GamesHub } from './components/InteractiveLabs/GamesHub';
import { TeachingMaterialView } from './components/TeachingMaterial/TeachingMaterialView';
import { PracticasSeminariosView } from './components/PracticasSeminarios/PracticasSeminariosView';
import { FirebaseHubModal } from './components/Firebase/FirebaseHubModal';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { X } from 'lucide-react';

const INITIAL_PROGRESS: UserProgress = {
  score: 0,
  xp: 0,
  lives: 3,
  maxLives: 3,
  budget: 5000,
  casesAttempted: 0,
  casesCorrect: 0,
  streak: 0,
  currentLevel: 'intermedio',
  libraryConsultations: 0,
  unlockedBadges: [],
  systemStats: {
    cardiac: { attempted: 0, correct: 0 },
    hepatic: { attempted: 0, correct: 0 },
    metabolic: { attempted: 0, correct: 0 },
    renal: { attempted: 0, correct: 0 },
    pancreatic: { attempted: 0, correct: 0 },
    neuromuscular: { attempted: 0, correct: 0 }
  },
  history: []
};

const DAILY_CHALLENGE_TOTAL_SECONDS = 120; // 2 minutes limit
const DAILY_CHALLENGE_MULTIPLIER = 2.0;    // 2.0x XP

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('inicio');
  const [selectedInitialLab, setSelectedInitialLab] = useState<'randle' | 'ictericias' | 'hemostasia' | 'integra'>('randle');
  const [cases, setCases] = useState<ClinicalCase[]>(CLINICAL_CASES_DATABASE);
  const [activeCase, setActiveCase] = useState<ClinicalCase>(CLINICAL_CASES_DATABASE[0]);

  // Daily Challenge State
  const [dailyState, setDailyState] = useState<DailyChallengeState | null>(() => loadDailyChallengeState());
  const dailyCase = useMemo(() => getDailyChallengeCase(cases), [cases]);
  const [isDailyActiveChallenge, setIsDailyActiveChallenge] = useState(false);
  const [dailyTimeRemaining, setDailyTimeRemaining] = useState(DAILY_CHALLENGE_TOTAL_SECONDS);
  const [isDailyTimerExpired, setIsDailyTimerExpired] = useState(false);
  const dailyTimerIntervalRef = useRef<number | null>(null);

  // Modals state
  const [selectedDetailCase, setSelectedDetailCase] = useState<ClinicalCase | null>(null);
  const [isLibraryOverlayOpen, setIsLibraryOverlayOpen] = useState(false);
  const [consultedLibraryInCurrentChallenge, setConsultedLibraryInCurrentChallenge] = useState(false);
  const [aiCaseModalOpen, setAiCaseModalOpen] = useState(false);
  const [newlyUnlockedBadgeForModal, setNewlyUnlockedBadgeForModal] = useState<SystemBadge | null>(null);

  // Onboarding Guided Tour State (auto-runs on first visit)
  const [runTour, setRunTour] = useState<boolean>(() => {
    const hasSeenTour = localStorage.getItem('biomark_onboarding_completed');
    return !hasSeenTour;
  });

  const handleStartTour = () => {
    // If we're not in home / landing page, switch to inicio so all portal features are visible
    if (activeModule !== 'inicio') {
      setActiveModule('inicio');
    }
    setRunTour(true);
  };

  const handleFinishTour = () => {
    setRunTour(false);
    localStorage.setItem('biomark_onboarding_completed', 'true');
  };

  // Feedback Modal State
  const [feedbackData, setFeedbackData] = useState<{
    caseData: ClinicalCase;
    selectedOption?: BiomarkerOption | null;
    labOrderEvaluation?: LabOrderEvaluation | null;
    consultedLibrary: boolean;
    scoreEarned: number;
    streak?: number;
    newlyUnlockedBadge?: SystemBadge | null;
    dailyBonusApplied?: boolean;
    dailyBonusMultiplier?: number;
    dailyTimeTakenSeconds?: number;
  } | null>(null);

  // Supabase Auth & Cloud Sync
  const { user, syncStatus, loadCloudProgress, saveCloudProgress, signOut } = useSupabaseAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [firebaseModalOpen, setFirebaseModalOpen] = useState(false);

  // User Progress with localStorage & Supabase persistence
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('biomarkdx_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migratedBudget = (!parsed.budget || parsed.budget < 1000) ? 5000 : parsed.budget;
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          budget: migratedBudget,
          unlockedBadges: parsed.unlockedBadges || [],
          systemStats: {
            ...INITIAL_PROGRESS.systemStats,
            ...(parsed.systemStats || {})
          }
        };
      } catch (e) {
        return INITIAL_PROGRESS;
      }
    }
    return INITIAL_PROGRESS;
  });

  // Guarantee that legacy budgets (< 1000 €) are normalized to 5.000 € initial funds
  useEffect(() => {
    setUserProgress((prev) => {
      if (!prev.budget || prev.budget < 1000) {
        return {
          ...prev,
          budget: 5000
        };
      }
      return prev;
    });
  }, []);

  // When user logs in, retrieve progress from Supabase if available
  useEffect(() => {
    if (user) {
      loadCloudProgress().then((cloudData) => {
        if (cloudData) {
          setUserProgress((current) => {
            // Pick higher score/xp if local exists
            const mergedScore = Math.max(current.score || 0, cloudData.score || 0);
            const mergedXP = Math.max(current.xp || 0, cloudData.xp || 0);
            const validCloudBudget = (!cloudData.budget || cloudData.budget < 1000) ? 5000 : cloudData.budget;
            const finalBudget = current.budget >= 1000 ? current.budget : validCloudBudget;
            return {
              ...current,
              ...cloudData,
              budget: finalBudget,
              score: mergedScore,
              xp: mergedXP,
              unlockedBadges: Array.from(new Set([...(current.unlockedBadges || []), ...(cloudData.unlockedBadges || [])]))
            };
          });
        }
      });
    }
  }, [user]);

  // Sync to localStorage and to Supabase (debounce/whenever userProgress changes)
  useEffect(() => {
    localStorage.setItem('biomarkdx_progress', JSON.stringify(userProgress));
    if (user) {
      const timer = setTimeout(() => {
        saveCloudProgress(userProgress);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userProgress, user]);

  // Countdown timer for Daily Challenge
  useEffect(() => {
    if (isDailyActiveChallenge && activeModule === 'desafio' && !isDailyTimerExpired) {
      dailyTimerIntervalRef.current = window.setInterval(() => {
        setDailyTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsDailyTimerExpired(true);
            if (dailyTimerIntervalRef.current) clearInterval(dailyTimerIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (dailyTimerIntervalRef.current) {
        clearInterval(dailyTimerIntervalRef.current);
        dailyTimerIntervalRef.current = null;
      }
    }

    return () => {
      if (dailyTimerIntervalRef.current) {
        clearInterval(dailyTimerIntervalRef.current);
        dailyTimerIntervalRef.current = null;
      }
    };
  }, [isDailyActiveChallenge, activeModule, isDailyTimerExpired]);

  // Start standard challenge
  const handleStartChallenge = (c: ClinicalCase) => {
    setActiveCase(c);
    setIsDailyActiveChallenge(false);
    setIsDailyTimerExpired(false);
    setDailyTimeRemaining(DAILY_CHALLENGE_TOTAL_SECONDS);
    setConsultedLibraryInCurrentChallenge(false);
    setActiveModule('desafio');
  };

  // Start Daily Challenge (2 min timer & 2.0x XP)
  const handleStartDailyChallenge = (c: ClinicalCase) => {
    setActiveCase(c);
    setIsDailyActiveChallenge(true);
    setIsDailyTimerExpired(false);
    setDailyTimeRemaining(DAILY_CHALLENGE_TOTAL_SECONDS);
    setConsultedLibraryInCurrentChallenge(false);
    setActiveModule('desafio');
  };

  // Game over state
  const [isGuardiaOver, setIsGuardiaOver] = useState(false);

  // Reset Guardia (restore budget to initial funds of 5.000 €)
  const handleResetGuardia = () => {
    setUserProgress((prev) => ({
      ...prev,
      lives: 3,
      budget: 5000,
      streak: 0
    }));
    setIsGuardiaOver(false);
  };

  // Earn budget/money through park minigames (between 250 € and 300 €)
  const handleEarnBudget = (amount: number = 260) => {
    setUserProgress((prev) => ({
      ...prev,
      budget: Math.min(10000, prev.budget + amount)
    }));
    setIsGuardiaOver(false);
  };

  // Backward compatibility alias
  const handleRechargeLife = (amount: number = 1) => {
    handleEarnBudget(amount * 260);
  };

  // Add bonus XP from park minigames and extra activities
  const handleAddBonusXP = (amount: number) => {
    setUserProgress((prev) => ({
      ...prev,
      xp: (prev.xp || prev.score) + amount,
      score: prev.score + amount
    }));
  };

  // Open library during challenge (costs 120 € interconsulta fee)
  const handleOpenLibraryInChallenge = () => {
    if (!consultedLibraryInCurrentChallenge) {
      setConsultedLibraryInCurrentChallenge(true);
      setUserProgress((prev) => ({
        ...prev,
        budget: Math.max(0, prev.budget - 120)
      }));
    }
    setIsLibraryOverlayOpen(true);
  };

  // Deduct budget for parameter consultation during challenge
  const handleDeductBudget = (amount: number, _reason?: string) => {
    setUserProgress((prev) => ({
      ...prev,
      budget: Math.max(0, prev.budget - amount),
      libraryConsultations: prev.libraryConsultations + 1
    }));
    setConsultedLibraryInCurrentChallenge(true);
  };

  // Handle challenge answer submission
  const handleSubmitAnswer = (selectedOption: BiomarkerOption, consultedLibrary: boolean) => {
    const isCorrect = selectedOption.isCorrect;

    // Base XP calculation
    let baseScore = isCorrect ? 100 : 0;
    const diffMultiplier =
      activeCase.difficulty === 'experto' ? 1.5 : activeCase.difficulty === 'avanzado' ? 1.25 : 1.0;
    
    // Apply streak multiplier
    const streakInfo = getStreakMultiplier(userProgress.streak);
    let earned = Math.round(baseScore * diffMultiplier * streakInfo.multiplier);

    // Apply Daily Challenge 2.0x multiplier if solved within the 2 minute window
    let dailyBonusApplied = false;
    let timeTaken = DAILY_CHALLENGE_TOTAL_SECONDS - dailyTimeRemaining;
    if (isDailyActiveChallenge && isCorrect && !isDailyTimerExpired) {
      earned = Math.round(earned * DAILY_CHALLENGE_MULTIPLIER);
      dailyBonusApplied = true;

      // Save completion in localStorage state
      const newState = saveDailyChallengeCompletion(
        activeCase.id,
        earned,
        timeTaken,
        DAILY_CHALLENGE_MULTIPLIER
      );
      setDailyState(newState);
    }

    // Apply 10 XP penalty if library was consulted
    if (isCorrect && consultedLibrary) {
      earned = Math.max(0, earned - 10);
    }

    let budgetAfter = userProgress.budget;
    let newlyEarnedBadge: SystemBadge | null = null;

    // Update progress state
    setUserProgress((prev) => {
      const prevBadges = evaluateUserBadges(prev);

      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newAttempted = prev.casesAttempted + 1;
      const newCorrect = prev.casesCorrect + (isCorrect ? 1 : 0);
      const newScore = prev.score + earned;
      const newXP = (prev.xp || prev.score) + earned;

      let newBudget = prev.budget;
      if (isCorrect) {
        newBudget = Math.min(10000, prev.budget + 150); // +150 € bonificación por acierto diagnóstico certero
      } else {
        newBudget = Math.max(0, prev.budget - 350); // -350 € coste de manejo clínico/fármacos por sospecha errónea
      }
      budgetAfter = newBudget;

      // Update system stats
      const sys = activeCase.system;
      const currentSysStats = prev.systemStats[sys] || { attempted: 0, correct: 0 };
      const updatedSysStats = {
        attempted: currentSysStats.attempted + 1,
        correct: currentSysStats.correct + (isCorrect ? 1 : 0)
      };

      // Calculate new adaptive difficulty level
      const sysAccuracy = Math.round((updatedSysStats.correct / updatedSysStats.attempted) * 100);
      let newLevel: DifficultyLevel = prev.currentLevel;

      if (newStreak >= 3 || sysAccuracy >= 80) {
        newLevel = prev.currentLevel === 'intermedio' ? 'avanzado' : 'experto';
      } else if (sysAccuracy < 50 && updatedSysStats.attempted >= 2) {
        newLevel = 'intermedio';
      }

      // Evaluate new badges
      const newBadges = evaluateUserBadges({
        ...prev,
        score: newScore,
        xp: newXP,
        lives: prev.lives,
        budget: newBudget,
        casesAttempted: newAttempted,
        casesCorrect: newCorrect,
        streak: newStreak,
        currentLevel: newLevel,
        systemStats: {
          ...prev.systemStats,
          [sys]: updatedSysStats
        }
      });
      const unlockedList = getNewlyUnlockedBadges(prevBadges, newBadges);
      if (unlockedList.length > 0) {
        newlyEarnedBadge = unlockedList[0];
      }

      // Record history
      const historyItem = {
        caseId: activeCase.id,
        caseTitle: activeCase.title,
        system: activeCase.system,
        difficulty: activeCase.difficulty,
        selectedBiomarkerId: selectedOption.id,
        selectedBiomarkerName: selectedOption.biomarkerName,
        isCorrect,
        consultedLibrary,
        scoreEarned: earned,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        badgeUnlocked: newlyEarnedBadge ? newlyEarnedBadge.title : undefined
      };

      const candidateProgress: UserProgress = {
        ...prev,
        score: newScore,
        xp: newXP,
        lives: prev.lives,
        budget: newBudget,
        casesAttempted: newAttempted,
        casesCorrect: newCorrect,
        streak: newStreak,
        currentLevel: newLevel,
        libraryConsultations: prev.libraryConsultations + (consultedLibrary ? 1 : 0),
        systemStats: {
          ...prev.systemStats,
          [sys]: updatedSysStats
        },
        history: [historyItem, ...prev.history]
      };

      if (unlockedList.length > 0) {
        const newBadgeIds = unlockedList.map((b) => b.id);
        candidateProgress.unlockedBadges = Array.from(
          new Set([...(prev.unlockedBadges || []), ...newBadgeIds])
        );
      }

      return candidateProgress;
    });

    // Stop timer
    if (dailyTimerIntervalRef.current) {
      clearInterval(dailyTimerIntervalRef.current);
      dailyTimerIntervalRef.current = null;
    }

    // Check if Guardia is Over (0 budget / fondos agotados)
    if (!isCorrect && budgetAfter <= 0) {
      setIsGuardiaOver(true);
    } else {
      // Trigger immediate feedback modal
      const nextStreak = isCorrect ? userProgress.streak + 1 : 0;
      setFeedbackData({
        caseData: activeCase,
        selectedOption,
        labOrderEvaluation: null,
        consultedLibrary,
        scoreEarned: earned,
        streak: nextStreak,
        newlyUnlockedBadge: newlyEarnedBadge,
        dailyBonusApplied,
        dailyBonusMultiplier: DAILY_CHALLENGE_MULTIPLIER,
        dailyTimeTakenSeconds: timeTaken
      });
    }
  };

  // Handle multi-biomarker lab order submission
  const handleSubmitLabOrder = (orderedBiomarkerIds: string[], consultedLibrary: boolean) => {
    const evalResult = evaluateLabOrder(activeCase, orderedBiomarkerIds, BIOMARKERS_DATABASE);
    const isFullyCorrect = evalResult.isFullyCorrect;
    const isPartiallyCorrect = evalResult.isPartiallyCorrect;

    // Multi-order score calculation based on precision and efficiency
    let baseScore = evalResult.accuracyScore;
    const diffMultiplier =
      activeCase.difficulty === 'experto' ? 1.5 : activeCase.difficulty === 'avanzado' ? 1.25 : 1.0;
    
    // Efficiency bonus (+20% if budget efficiency >= 80)
    let efficiencyBonus = evalResult.budgetEfficiencyScore >= 80 ? 1.2 : 1.0;

    const streakInfo = getStreakMultiplier(userProgress.streak);
    let earned = Math.round(baseScore * diffMultiplier * efficiencyBonus * (isFullyCorrect ? streakInfo.multiplier : 1.0));

    // Apply Daily Challenge 2.0x multiplier if fully correct and within the 2 minute window
    let dailyBonusApplied = false;
    let timeTaken = DAILY_CHALLENGE_TOTAL_SECONDS - dailyTimeRemaining;
    if (isDailyActiveChallenge && isFullyCorrect && !isDailyTimerExpired) {
      earned = Math.round(earned * DAILY_CHALLENGE_MULTIPLIER);
      dailyBonusApplied = true;

      const newState = saveDailyChallengeCompletion(
        activeCase.id,
        earned,
        timeTaken,
        DAILY_CHALLENGE_MULTIPLIER
      );
      setDailyState(newState);
    }

    // Apply 10 XP penalty if library was consulted
    if (consultedLibrary && earned > 10) {
      earned -= 10;
    }

    let budgetAfter = userProgress.budget;
    let newlyEarnedBadge: SystemBadge | null = null;

    setUserProgress((prev) => {
      const prevBadges = evaluateUserBadges(prev);

      const newStreak = isFullyCorrect ? prev.streak + 1 : 0;
      const newAttempted = prev.casesAttempted + 1;
      const newCorrect = prev.casesCorrect + (isFullyCorrect ? 1 : 0);
      const newScore = prev.score + earned;
      const newXP = (prev.xp || prev.score) + earned;

      // Deduct order cost from budget, but reward correct diagnostic performance
      let newBudget = Math.max(0, prev.budget - evalResult.totalBudgetCost);
      if (isFullyCorrect) {
        newBudget = Math.min(10000, newBudget + 200); // +200 € bonificación por protocolo analítico de alta eficiencia
      }
      budgetAfter = newBudget;

      // Update system stats
      const sys = activeCase.system;
      const currentSysStats = prev.systemStats[sys] || { attempted: 0, correct: 0 };
      const updatedSysStats = {
        attempted: currentSysStats.attempted + 1,
        correct: currentSysStats.correct + (isFullyCorrect ? 1 : 0)
      };

      // Evaluate new badges
      const newBadges = evaluateUserBadges({
        ...prev,
        score: newScore,
        xp: newXP,
        lives: prev.lives,
        budget: newBudget,
        casesAttempted: newAttempted,
        casesCorrect: newCorrect,
        streak: newStreak,
        systemStats: {
          ...prev.systemStats,
          [sys]: updatedSysStats
        }
      });
      const unlockedList = getNewlyUnlockedBadges(prevBadges, newBadges);
      if (unlockedList.length > 0) {
        newlyEarnedBadge = unlockedList[0];
      }

      // History Record
      const historyItem = {
        caseId: activeCase.id,
        caseTitle: activeCase.title,
        system: activeCase.system,
        difficulty: activeCase.difficulty,
        selectedBiomarkerId: orderedBiomarkerIds.join(','),
        selectedBiomarkerName: `Petición Multianalítica (${orderedBiomarkerIds.length} biomarcadores)`,
        isCorrect: isFullyCorrect,
        consultedLibrary,
        scoreEarned: earned,
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        isMultiOrder: true,
        orderedBiomarkerCount: orderedBiomarkerIds.length,
        badgeUnlocked: newlyEarnedBadge ? newlyEarnedBadge.title : undefined
      };

      const candidateProgress: UserProgress = {
        ...prev,
        score: newScore,
        xp: newXP,
        lives: prev.lives,
        budget: newBudget,
        casesAttempted: newAttempted,
        casesCorrect: newCorrect,
        streak: newStreak,
        libraryConsultations: prev.libraryConsultations + (consultedLibrary ? 1 : 0),
        systemStats: {
          ...prev.systemStats,
          [sys]: updatedSysStats
        },
        history: [historyItem, ...prev.history]
      };

      if (unlockedList.length > 0) {
        const newBadgeIds = unlockedList.map((b) => b.id);
        candidateProgress.unlockedBadges = Array.from(
          new Set([...(prev.unlockedBadges || []), ...newBadgeIds])
        );
      }

      return candidateProgress;
    });

    // Stop timer
    if (dailyTimerIntervalRef.current) {
      clearInterval(dailyTimerIntervalRef.current);
      dailyTimerIntervalRef.current = null;
    }

    if (budgetAfter <= 0) {
      setIsGuardiaOver(true);
    } else {
      const nextStreak = isFullyCorrect ? userProgress.streak + 1 : 0;
      setFeedbackData({
        caseData: activeCase,
        selectedOption: null,
        labOrderEvaluation: evalResult,
        consultedLibrary,
        scoreEarned: earned,
        streak: nextStreak,
        newlyUnlockedBadge: newlyEarnedBadge,
        dailyBonusApplied,
        dailyBonusMultiplier: DAILY_CHALLENGE_MULTIPLIER,
        dailyTimeTakenSeconds: timeTaken
      });
    }
  };

  // Next Case Navigation
  const handleNextCase = () => {
    setFeedbackData(null);
    setIsDailyActiveChallenge(false);
    setIsDailyTimerExpired(false);
    setDailyTimeRemaining(DAILY_CHALLENGE_TOTAL_SECONDS);

    const currentIndex = cases.findIndex((c) => c.id === activeCase.id);
    const nextIndex = (currentIndex + 1) % cases.length;
    setActiveCase(cases[nextIndex]);
    setConsultedLibraryInCurrentChallenge(false);
    setActiveModule('desafio');
  };

  // Add AI Generated Case
  const handleCaseGeneratedByAI = (newCase: ClinicalCase) => {
    setCases((prev) => [newCase, ...prev]);
    setActiveCase(newCase);
    setIsDailyActiveChallenge(false);
    setConsultedLibraryInCurrentChallenge(false);
    setActiveModule('desafio');
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (window.confirm('¿Está seguro de que desea restablecer todo su progreso y puntuaciones?')) {
      setUserProgress(INITIAL_PROGRESS);
      localStorage.removeItem('biomarkdx_progress');
      localStorage.removeItem('biomark_daily_challenge');
      setDailyState(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        userProgress={userProgress}
        onStartTour={handleStartTour}
        user={user}
        syncStatus={syncStatus}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onSignOut={signOut}
        onOpenFirebaseModal={() => setFirebaseModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Gamified Status Dashboard & Adaptive Progress Banner (Exclusively in Challenge Mode) */}
        {activeModule === 'desafio' && (
          <>
            <GamifiedDashboard
              userProgress={userProgress}
              onResetGuardia={handleResetGuardia}
              onOpenStats={() => setActiveModule('estadisticas')}
              onOpenRanking={() => setActiveModule('ranking')}
              onGoToGames={() => {
                setActiveModule('juegos');
              }}
            />
            <AdaptiveProgressBanner userProgress={userProgress} />
          </>
        )}

        {/* Module 0: Pantalla Principal / LandingPage (Hospital, Biblioteca, Parque) */}
        {activeModule === 'inicio' && (
          <LandingPage
            onNavigate={(mod) => setActiveModule(mod)}
            onOpenLab={(lab) => {
              if (lab === 'randle' || lab === 'ictericias' || lab === 'hemostasia' || lab === 'integra') {
                setSelectedInitialLab(lab);
                if (lab === 'integra') {
                  setActiveModule('integracion-metabolica');
                } else {
                  setActiveModule('laboratorios');
                }
              } else {
                setActiveModule('juegos');
              }
            }}
            onStartTour={handleStartTour}
            userXP={userProgress.xp || userProgress.score}
            completedCasesCount={userProgress.casesCorrect}
          />
        )}

        {/* Module Ciudad: Campus Ciudad Biomédica UGR (Hospital, Biblioteca, Parque Lúdico) */}
        {activeModule === 'ciudad' && (
          <BiomedicalCity
            onNavigate={(mod) => setActiveModule(mod)}
            onOpenLab={(lab) => {
              if (lab === 'randle' || lab === 'ictericias' || lab === 'hemostasia' || lab === 'integra') {
                setSelectedInitialLab(lab);
                if (lab === 'integra') {
                  setActiveModule('integracion-metabolica');
                } else {
                  setActiveModule('laboratorios');
                }
              } else {
                setActiveModule('juegos');
              }
            }}
            onStartChallenge={handleStartChallenge}
            onStartDailyChallenge={() => handleStartDailyChallenge(dailyCase)}
            userProgress={userProgress}
            cases={cases}
            onAddXP={handleAddBonusXP}
            onEarnBudget={handleEarnBudget}
            onRechargeLife={handleRechargeLife}
          />
        )}

        {/* Module 1: Case Bank (BIOMARK-SIM) */}
        {activeModule === 'casos' && (
          <CaseList
            cases={cases}
            onSelectCase={(c) => setSelectedDetailCase(c)}
            onStartChallenge={handleStartChallenge}
            userProgress={userProgress}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        )}

        {/* Module 2: Challenge Mode */}
        {activeModule === 'desafio' && (
          <ChallengeMode
            currentCase={activeCase}
            userProgress={userProgress}
            isDailyChallenge={isDailyActiveChallenge}
            dailyTimeRemaining={dailyTimeRemaining}
            dailyBonusMultiplier={DAILY_CHALLENGE_MULTIPLIER}
            isDailyTimerExpired={isDailyTimerExpired}
            onDailyTimerExpire={() => setIsDailyTimerExpired(true)}
            onOpenLibraryModal={handleOpenLibraryInChallenge}
            onDeductBudget={handleDeductBudget}
            onSubmitAnswer={handleSubmitAnswer}
            onSubmitLabOrder={handleSubmitLabOrder}
            consultedLibrary={consultedLibraryInCurrentChallenge}
            onNextCase={handleNextCase}
            onBackToCaseList={() => setActiveModule('casos')}
          />
        )}

        {/* Module 3: Daily Challenge */}
        {activeModule === 'reto-diario' && (
          <DailyChallengeView
            dailyCase={dailyCase}
            dailyState={dailyState}
            userProgress={userProgress}
            onStartDailyChallenge={handleStartDailyChallenge}
          />
        )}

        {/* Module 4: Biblioteca - Simuladores de Apoyo al Aprendizaje (Randle, Ictericias, Hemostasia, Integra) */}
        {activeModule === 'laboratorios' && (
          <InteractiveLabsContainer
            initialLab={selectedInitialLab}
            userProgress={userProgress}
            onEarnBudget={handleEarnBudget}
            onRechargeLife={handleRechargeLife}
            onAddBonusXP={handleAddBonusXP}
            onNavigate={(mod) => setActiveModule(mod)}
            onBackToPortal={() => setActiveModule('docencia')}
          />
        )}

        {/* Module: Biblioteca - Integración Metabólica (Direct Suite) */}
        {activeModule === 'integracion-metabolica' && (
          <InteractiveLabsContainer
            initialLab="integra"
            userProgress={userProgress}
            onEarnBudget={handleEarnBudget}
            onRechargeLife={handleRechargeLife}
            onAddBonusXP={handleAddBonusXP}
            onNavigate={(mod) => setActiveModule(mod)}
            onBackToPortal={() => setActiveModule('docencia')}
          />
        )}

        {/* Module Parque: Zona Lúdica & Minijuegos (Preguntas, Parejas, Pasapalabra) */}
        {activeModule === 'juegos' && (
          <GamesHub
            userProgress={userProgress}
            onEarnBudget={handleEarnBudget}
            onRechargeLife={handleRechargeLife}
            onAddBonusXP={handleAddBonusXP}
            onNavigate={(mod) => setActiveModule(mod)}
          />
        )}

        {/* Module 5: Teaching Material & Academic Guide */}
        {activeModule === 'docencia' && (
          <TeachingMaterialView />
        )}

        {/* Module: Prácticas y Seminarios (Calendario & Organización Docente UGR) */}
        {activeModule === 'practicas-seminarios' && (
          <PracticasSeminariosView />
        )}

        {/* Module 6: Biomarker Reference Library */}
        {activeModule === 'biblioteca' && (
          <BiomarkerLibrary
            biomarkers={BIOMARKERS_DATABASE}
            activeCase={activeCase}
          />
        )}

        {/* Module 7: User Progress & Statistics */}
        {activeModule === 'estadisticas' && (
          <UserStatsView
            userProgress={userProgress}
            onResetProgress={handleResetProgress}
          />
        )}

        {/* Module 8: Global Student Leaderboard (Top 10 & Clinical Escalafón) */}
        {activeModule === 'ranking' && (
          <Leaderboard
            userProgress={userProgress}
            onNavigateToCases={() => setActiveModule('casos')}
            onNavigateToGames={() => {
              setActiveModule('juegos');
            }}
          />
        )}
      </main>

      {/* Footer: Official UGR Faculty of Medicine Accreditation & Teaching Innovation Project */}
      <footer className="h-auto py-3 bg-white border-t border-slate-200 px-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-600 font-medium shrink-0 mt-auto gap-2.5">
        <div className="flex items-center gap-2 text-slate-700 flex-wrap justify-center md:justify-start">
          <span className="font-bold text-slate-900">Bioquímica Médica</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-bold text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Trabajo del Proyecto de Innovación Docente 26-158
          </span>
          <span>•</span>
          <span>Facultad de Medicina • Universidad de Granada (PTS)</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap justify-center md:justify-end">
          <span>Departamento de Bioquímica y Biología Molecular III e Inmunología</span>
          <span>•</span>
          <span>Curso 2026/2027</span>
        </div>
      </footer>

      {/* Modal: Case Details */}
      <CaseDetailModal
        caseData={selectedDetailCase}
        onClose={() => setSelectedDetailCase(null)}
        onStartChallenge={handleStartChallenge}
      />

      {/* Modal / Drawer: Library Overlay during Challenge */}
      {isLibraryOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setIsLibraryOverlayOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              <X className="w-5 h-5" />
            </button>
            <BiomarkerLibrary
              biomarkers={BIOMARKERS_DATABASE}
              isChallengeModeContext={true}
              activeCase={activeCase}
            />
          </div>
        </div>
      )}

      {/* Modal: Immediate Biochemical Feedback */}
      {feedbackData && (
        <ImmediateFeedbackModal
          currentCase={feedbackData.caseData}
          selectedOption={feedbackData.selectedOption}
          labOrderEvaluation={feedbackData.labOrderEvaluation}
          consultedLibrary={feedbackData.consultedLibrary}
          scoreEarned={feedbackData.scoreEarned}
          streak={feedbackData.streak ?? userProgress.streak}
          newlyUnlockedBadge={feedbackData.newlyUnlockedBadge}
          dailyBonusApplied={feedbackData.dailyBonusApplied}
          dailyBonusMultiplier={feedbackData.dailyBonusMultiplier}
          dailyTimeTakenSeconds={feedbackData.dailyTimeTakenSeconds}
          onClose={() => setFeedbackData(null)}
          onNextCase={handleNextCase}
        />
      )}

      {/* Modal: Badge Unlocked Celebration */}
      <BadgeUnlockModal
        badge={newlyUnlockedBadgeForModal}
        onClose={() => setNewlyUnlockedBadgeForModal(null)}
        onViewGallery={() => {
          setNewlyUnlockedBadgeForModal(null);
          setActiveModule('estadisticas');
        }}
      />

      {/* Modal: AI Case Generator */}
      <AICaseGeneratorModal
        isOpen={aiCaseModalOpen}
        onClose={() => setAiCaseModalOpen(false)}
        onCaseGenerated={handleCaseGeneratedByAI}
      />

      {/* Modal: Guardia Over / Game Over */}
      <GuardiaOverModal
        isOpen={isGuardiaOver}
        onRestartGuardia={handleResetGuardia}
        onGoToGames={() => {
          setIsGuardiaOver(false);
          setActiveModule('juegos');
        }}
      />

      {/* Guided Onboarding Tour with react-joyride */}
      <OnboardingTour
        run={runTour}
        onFinishTour={handleFinishTour}
      />

      {/* Auth Modal for Supabase Student Login / Register */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Firebase Hub Modal (Firestore Database & Hosting Management) */}
      <FirebaseHubModal
        isOpen={firebaseModalOpen}
        onClose={() => setFirebaseModalOpen(false)}
      />
    </div>
  );
}
