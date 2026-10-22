import React, { useState, useEffect, useRef } from 'react';
import {
  ActiveModule,
  ClinicalCase,
  BiomarkerOption,
  UserProgress,
  DifficultyLevel,
  OrganSystem,
  SystemBadge,
  LabOrderEvaluation
} from './types';
import { CLINICAL_CASES_DATABASE } from './data/clinicalCases';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { BiomedicalCity } from './components/City/BiomedicalCity';
import { CaseList } from './components/CaseBank/CaseList';
import { CaseDetailModal } from './components/CaseBank/CaseDetailModal';
import { ChallengeMode } from './components/Challenge/ChallengeMode';
import { TeachingMaterialView } from './components/TeachingMaterial/TeachingMaterialView';
import { VademecumView } from './components/TeachingMaterial/VademecumView';
import { PracticasSeminariosView } from './components/PracticasSeminarios/PracticasSeminariosView';
import { InteractiveLabsContainer } from './components/InteractiveLabs/InteractiveLabsContainer';
import { MetabolicIntegrationLab } from './components/MetabolicIntegration/MetabolicIntegrationLab';
import { GamesHub } from './components/InteractiveLabs/GamesHub';
import { DailyChallengeView } from './components/DailyChallenge/DailyChallengeView';
import { UserStatsView } from './components/Stats/UserStatsView';
import { Leaderboard } from './components/Stats/Leaderboard';
import { SatisfactionSurveyModal } from './components/Satisfaction/SatisfactionSurveyModal';
import { SatisfactionMetricsModal } from './components/Satisfaction/SatisfactionMetricsModal';
import { SatisfactionGateLockScreen } from './components/Satisfaction/SatisfactionGateLockScreen';
import { satisfactionService } from './utils/satisfactionService';
import { AuthModal } from './components/Auth/AuthModal';
import { OnboardingTour } from './components/Onboarding/OnboardingTour';
import { BadgeUnlockModal } from './components/Stats/BadgeUnlockModal';
import { ImmediateFeedbackModal } from './components/Challenge/ImmediateFeedbackModal';
import { GuardiaOverModal } from './components/Challenge/GuardiaOverModal';
import { AICaseGeneratorModal } from './components/AICaseGeneratorModal';
import { useSupabaseAuth } from './hooks/useSupabaseAuth';
import { evaluateUserBadges, getNewlyUnlockedBadges } from './data/badges';
import { evaluateLabOrder, getBiomarkerCost } from './utils/labOrderEvaluator';
import {
  getDailyChallengeCase,
  loadDailyChallengeState,
  saveDailyChallengeCompletion,
  DailyChallengeState
} from './utils/dailyChallenge';
import {
  recordPlatformVisit,
  subscribeVisitorStats,
  VisitorStats,
  getOrCreateStudentProfile,
  saveStudentRankingToCloud
} from './lib/firebase';
import { BIOMARKERS_DATABASE } from './data/biomarkers';
import { audioService } from './utils/audioService';

const STORAGE_PROGRESS_KEY = 'biomark_user_progress_v2';

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
  systemStats: {
    cardiac: { attempted: 0, correct: 0 },
    hepatic: { attempted: 0, correct: 0 },
    metabolic: { attempted: 0, correct: 0 },
    renal: { attempted: 0, correct: 0 },
    pancreatic: { attempted: 0, correct: 0 },
    neuromuscular: { attempted: 0, correct: 0 }
  },
  history: [],
  unlockedBadges: []
};

export const App: React.FC = () => {
  // Navigation
  const [activeModule, setActiveModule] = useState<ActiveModule>('inicio');
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<ClinicalCase | null>(null);
  const [currentChallengeCase, setCurrentChallengeCase] = useState<ClinicalCase | null>(null);
  const [isDailyChallengeActive, setIsDailyChallengeActive] = useState<boolean>(false);
  const [initialLab, setInitialLab] = useState<'randle' | 'ictericias' | 'hemostasia' | 'carnitina' | 'integra'>('carnitina');
  const [initialGameTab, setInitialGameTab] = useState<'rosco' | 'trivia' | 'sopa' | 'crucigrama'>('rosco');

  // User Progress & Gamification
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            ...INITIAL_PROGRESS,
            ...parsed
          };
        }
      } catch {}
    }
    return INITIAL_PROGRESS;
  });

  // Daily Challenge State
  const [dailyState, setDailyState] = useState<DailyChallengeState | null>(() => loadDailyChallengeState());
  const dailyCase = getDailyChallengeCase(CLINICAL_CASES_DATABASE);

  // Modals & Feedback
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [satisfactionSurveyOpen, setSatisfactionSurveyOpen] = useState(false);
  const [satisfactionMetricsOpen, setSatisfactionMetricsOpen] = useState(false);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(satisfactionService.hasCompletedSurvey());
  const [aiCaseModalOpen, setAiCaseModalOpen] = useState(false);
  const [guardiaOverModalOpen, setGuardiaOverModalOpen] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<SystemBadge | null>(null);

  // Challenge Mode State & Modal
  const [consultedLibraryInChallenge, setConsultedLibraryInChallenge] = useState(false);
  const [immediateFeedbackData, setImmediateFeedbackData] = useState<{
    caseData: ClinicalCase;
    selectedOption: BiomarkerOption | null;
    labOrderEvaluation: LabOrderEvaluation | null;
    scoreEarned: number;
    streak: number;
    isDaily: boolean;
  } | null>(null);

  // Supabase Auth
  const { user, syncStatus, loadCloudProgress, saveCloudProgress } = useSupabaseAuth();

  // Visitor Counter (Firebase Firestore Real-Time Sync)
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    isLive: false
  });

  // Sync visitor stats & record visit on mount
  useEffect(() => {
    recordPlatformVisit();
    const unsubscribe = subscribeVisitorStats((stats) => {
      setVisitorStats(stats);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to satisfaction survey status
  useEffect(() => {
    return satisfactionService.subscribeToSurveyStatus((status) => {
      setHasCompletedSurvey(status);
    });
  }, []);

  // Save progress locally and sync with Firestore ranking
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(userProgress));
    }

    if (userProgress.casesAttempted > 0 || userProgress.casesCorrect > 0) {
      const profile = getOrCreateStudentProfile();
      const accuracy =
        userProgress.casesAttempted > 0
          ? Math.round((userProgress.casesCorrect / userProgress.casesAttempted) * 100)
          : 0;

      saveStudentRankingToCloud({
        studentId: profile.studentId,
        name: profile.name,
        subgroup: profile.subgroup,
        score: userProgress.score,
        xp: userProgress.xp || userProgress.score,
        casesSolved: userProgress.casesCorrect,
        casesAttempted: userProgress.casesAttempted,
        accuracy,
        streak: userProgress.streak,
        budget: userProgress.budget,
        badgesCount: userProgress.unlockedBadges?.length || 0,
        lastSolvedAt: new Date().toLocaleDateString('es-ES')
      });
    }
  }, [userProgress]);

  // Open Lab helper
  const handleOpenLab = (lab: 'randle' | 'ictericias' | 'hemostasia' | 'juegos' | 'rosco' | 'integra' | 'carnitina') => {
    if (lab === 'juegos' || lab === 'rosco') {
      setInitialGameTab(lab === 'rosco' ? 'rosco' : 'trivia');
      setActiveModule('juegos');
    } else if (lab === 'integra') {
      setActiveModule('integracion-metabolica');
    } else {
      setInitialLab(lab);
      setActiveModule('laboratorios');
    }
  };

  // Start Challenge on a Case
  const handleStartChallenge = (c: ClinicalCase) => {
    setSelectedCaseForDetail(null);
    setCurrentChallengeCase(c);
    setIsDailyChallengeActive(false);
    setConsultedLibraryInChallenge(false);
    setActiveModule('desafio');
  };

  // Start Daily Challenge
  const handleStartDailyChallenge = () => {
    setCurrentChallengeCase(dailyCase);
    setIsDailyChallengeActive(true);
    setConsultedLibraryInChallenge(false);
    setActiveModule('desafio');
  };

  // Select case for detail modal
  const handleSelectCase = (c: ClinicalCase) => {
    setSelectedCaseForDetail(c);
  };

  // Deduct budget
  const handleDeductBudget = (amount: number, _reason?: string) => {
    setUserProgress((prev) => {
      const newBudget = Math.max(0, prev.budget - amount);
      if (newBudget <= 0) {
        setGuardiaOverModalOpen(true);
      }
      return { ...prev, budget: newBudget };
    });
  };

  // Earn budget in games
  const handleEarnBudget = (amount: number = 250) => {
    setUserProgress((prev) => ({
      ...prev,
      budget: prev.budget + amount
    }));
  };

  // Recharge life in games
  const handleRechargeLife = (amount: number = 1) => {
    setUserProgress((prev) => ({
      ...prev,
      lives: Math.min(prev.maxLives, prev.lives + amount)
    }));
  };

  // Add bonus XP
  const handleAddBonusXP = (amount: number, _reason: string) => {
    setUserProgress((prev) => ({
      ...prev,
      xp: (prev.xp || prev.score) + amount,
      score: prev.score + amount
    }));
  };

  // Handle single diagnostic answer submit in challenge mode
  const handleSubmitAnswer = (selectedOption: BiomarkerOption, consultedLibrary: boolean) => {
    if (!currentChallengeCase) return;

    const isCorrect = selectedOption.isCorrect;
    const isDaily = isDailyChallengeActive;
    const baseScore = isCorrect ? (isDaily ? 300 : 150) : 30;

    audioService.playSubmit();
    if (isCorrect) {
      setTimeout(() => audioService.playSuccess(), 200);
    } else {
      setTimeout(() => audioService.playError(), 200);
    }

    setUserProgress((prev) => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newScore = prev.score + baseScore;
      const newXp = (prev.xp || prev.score) + baseScore;
      const newCorrect = isCorrect ? prev.casesCorrect + 1 : prev.casesCorrect;
      const newAttempted = prev.casesAttempted + 1;

      const system = currentChallengeCase.system;
      const systemStats = {
        ...prev.systemStats,
        [system]: {
          attempted: (prev.systemStats[system]?.attempted || 0) + 1,
          correct: (prev.systemStats[system]?.correct || 0) + (isCorrect ? 1 : 0)
        }
      };

      const newHistory = [
        {
          caseId: currentChallengeCase.id,
          caseTitle: currentChallengeCase.title,
          system,
          isCorrect,
          scoreEarned: baseScore,
          timestamp: new Date().toISOString()
        },
        ...prev.history
      ];

      const updatedProgress: UserProgress = {
        ...prev,
        score: newScore,
        xp: newXp,
        casesCorrect: newCorrect,
        casesAttempted: newAttempted,
        streak: newStreak,
        systemStats,
        history: newHistory
      };

      // Check badge unlocks
      const prevBadges = evaluateUserBadges(prev);
      const nextBadges = evaluateUserBadges(updatedProgress);
      const newlyUnlocked = getNewlyUnlockedBadges(prevBadges, nextBadges);
      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedBadge(newlyUnlocked[0]);
        updatedProgress.unlockedBadges = Array.from(
          new Set([...(prev.unlockedBadges || []), newlyUnlocked[0].id])
        );
      }

      return updatedProgress;
    });

    if (isDaily) {
      saveDailyChallengeCompletion(currentChallengeCase.id, baseScore, 60, isCorrect ? 1.5 : 1.0);
      setDailyState(loadDailyChallengeState());
    }

    setImmediateFeedbackData({
      caseData: currentChallengeCase,
      selectedOption,
      labOrderEvaluation: null,
      scoreEarned: baseScore,
      streak: isCorrect ? userProgress.streak + 1 : 0,
      isDaily
    });
  };

  // Handle multi-biomarker lab order submit in challenge mode
  const handleSubmitLabOrder = (orderedBiomarkerIds: string[], consultedLibrary: boolean) => {
    if (!currentChallengeCase) return;

    const evaluation = evaluateLabOrder(currentChallengeCase, orderedBiomarkerIds, BIOMARKERS_DATABASE);
    const isOptimal = evaluation.isOptimal;
    const score = evaluation.score;

    audioService.playSubmit();
    if (isOptimal) {
      setTimeout(() => audioService.playSuccess(), 200);
    } else {
      setTimeout(() => audioService.playWarning(), 200);
    }

    setUserProgress((prev) => {
      const newStreak = isOptimal ? prev.streak + 1 : 0;
      const newScore = prev.score + score;
      const newXp = (prev.xp || prev.score) + score;
      const newCorrect = isOptimal ? prev.casesCorrect + 1 : prev.casesCorrect;
      const newAttempted = prev.casesAttempted + 1;

      const system = currentChallengeCase.system;
      const systemStats = {
        ...prev.systemStats,
        [system]: {
          attempted: (prev.systemStats[system]?.attempted || 0) + 1,
          correct: (prev.systemStats[system]?.correct || 0) + (isOptimal ? 1 : 0)
        }
      };

      const newHistory = [
        {
          caseId: currentChallengeCase.id,
          caseTitle: currentChallengeCase.title,
          system,
          isCorrect: isOptimal,
          scoreEarned: score,
          timestamp: new Date().toISOString(),
          isMultiOrder: true,
          orderedBiomarkerCount: orderedBiomarkerIds.length
        },
        ...prev.history
      ];

      const updatedProgress: UserProgress = {
        ...prev,
        score: newScore,
        xp: newXp,
        casesCorrect: newCorrect,
        casesAttempted: newAttempted,
        streak: newStreak,
        systemStats,
        history: newHistory
      };

      // Check badges
      const prevBadges = evaluateUserBadges(prev);
      const nextBadges = evaluateUserBadges(updatedProgress);
      const newlyUnlocked = getNewlyUnlockedBadges(prevBadges, nextBadges);
      if (newlyUnlocked.length > 0) {
        setNewlyUnlockedBadge(newlyUnlocked[0]);
        updatedProgress.unlockedBadges = Array.from(
          new Set([...(prev.unlockedBadges || []), newlyUnlocked[0].id])
        );
      }

      return updatedProgress;
    });

    setImmediateFeedbackData({
      caseData: currentChallengeCase,
      selectedOption: null,
      labOrderEvaluation: evaluation,
      scoreEarned: score,
      streak: isOptimal ? userProgress.streak + 1 : 0,
      isDaily: false
    });
  };

  // Next case after feedback
  const handleNextCase = () => {
    setImmediateFeedbackData(null);
    if (isDailyChallengeActive) {
      setActiveModule('reto-diario');
      setIsDailyChallengeActive(false);
      return;
    }
    const currentIndex = CLINICAL_CASES_DATABASE.findIndex(
      (c) => c.id === currentChallengeCase?.id
    );
    const nextIndex = (currentIndex + 1) % CLINICAL_CASES_DATABASE.length;
    setCurrentChallengeCase(CLINICAL_CASES_DATABASE[nextIndex]);
    setConsultedLibraryInChallenge(false);
  };

  // Reset progress
  const handleResetProgress = () => {
    if (window.confirm('¿Deseas reiniciar tu progreso personal en este navegador?')) {
      setUserProgress(INITIAL_PROGRESS);
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
    }
  };

  const totalCasesCount = CLINICAL_CASES_DATABASE.length; // Exactly 31!

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Main Navigation Bar with Institutional Gold Header and Audio Controls */}
      <Navbar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        userProgress={userProgress}
        hasCompletedSurvey={hasCompletedSurvey}
        onStartTour={() => setRunTour(true)}
        user={user}
        syncStatus={syncStatus}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onSignOut={() => setAuthModalOpen(true)}
        onOpenSatisfactionSurvey={() => setSatisfactionSurveyOpen(true)}
      />

      {/* 2. Main Content Routing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* INICIO: Landing Page */}
        {activeModule === 'inicio' && (
          <LandingPage
            onNavigate={setActiveModule}
            onOpenLab={handleOpenLab}
            onStartTour={() => setRunTour(true)}
            userXP={userProgress.xp || userProgress.score}
            completedCasesCount={userProgress.casesCorrect}
            totalCasesCount={totalCasesCount}
            visitorCount={visitorStats.totalVisits}
            isLiveStats={visitorStats.isLive}
          />
        )}

        {/* CIUDAD BIOMÉDICA UGR */}
        {activeModule === 'ciudad' && (
          <BiomedicalCity
            onNavigate={setActiveModule}
            onOpenLab={handleOpenLab}
            onStartChallenge={handleStartChallenge}
            onStartDailyChallenge={handleStartDailyChallenge}
            userProgress={userProgress}
            cases={CLINICAL_CASES_DATABASE}
            onAddXP={(amt) => handleAddBonusXP(amt, 'Trivia Ciudad')}
            onEarnBudget={handleEarnBudget}
            onRechargeLife={handleRechargeLife}
          />
        )}

        {/* HOSPITAL: Casos Clínicos (31 Casos) */}
        {activeModule === 'casos' && (
          <CaseList
            cases={CLINICAL_CASES_DATABASE}
            onSelectCase={handleSelectCase}
            onStartChallenge={handleStartChallenge}
            onOpenAICaseModal={() => setAiCaseModalOpen(true)}
            userProgress={userProgress}
            onNavigate={setActiveModule}
          />
        )}

        {/* DESAFÍO / MODO GUARDIA EN VIVO */}
        {activeModule === 'desafio' && currentChallengeCase && (
          <ChallengeMode
            currentCase={currentChallengeCase}
            userProgress={userProgress}
            isDailyChallenge={isDailyChallengeActive}
            onOpenLibraryModal={() => {
              setConsultedLibraryInChallenge(true);
              setActiveModule('biblioteca');
            }}
            onDeductBudget={handleDeductBudget}
            onSubmitAnswer={handleSubmitAnswer}
            onSubmitLabOrder={handleSubmitLabOrder}
            consultedLibrary={consultedLibraryInChallenge}
            onNextCase={handleNextCase}
            onBackToCaseList={() => setActiveModule('casos')}
          />
        )}

        {/* TEMARIO DOCENTE OFICIAL UGR */}
        {activeModule === 'docencia' && (
          <TeachingMaterialView
            initialTab="temario"
            onNavigate={setActiveModule}
          />
        )}

        {/* VADEMÉCUM OFICIAL DE BIOMARCADORES */}
        {activeModule === 'biblioteca' && (
          <VademecumView
            onBackToPortal={() => setActiveModule('inicio')}
            onNavigate={setActiveModule}
          />
        )}

        {/* PRÁCTICAS Y SEMINARIOS (CRONOGRAMA & CALENDARIO) */}
        {activeModule === 'practicas-seminarios' && (
          <PracticasSeminariosView />
        )}

        {/* SIMULADORES Y LABORATORIOS INTERACTIVOS (INCLUYENDO LA LANZADERA ROTA) */}
        {activeModule === 'laboratorios' && (
          <InteractiveLabsContainer
            initialLab={initialLab}
            onBackToPortal={() => setActiveModule('biblioteca')}
            onNavigate={setActiveModule}
            userProgress={userProgress}
            onEarnBudget={handleEarnBudget}
            onRechargeLife={handleRechargeLife}
            onAddBonusXP={handleAddBonusXP}
          />
        )}

        {/* ATLAS DE INTEGRACIÓN METABÓLICA */}
        {activeModule === 'integracion-metabolica' && (
          <MetabolicIntegrationLab
            onBackToPortal={() => setActiveModule('biblioteca')}
            onNavigate={setActiveModule}
          />
        )}

        {/* PARQUE BIOMÉDICO & MINIJUEGOS (EL ROSCO, SOPA, CRUCIGRAMA) */}
        {activeModule === 'juegos' && (
          <GamesHub
            userProgress={userProgress}
            initialTab={initialGameTab}
            onEarnBudget={handleEarnBudget}
            onRechargeLife={handleRechargeLife}
            onAddBonusXP={handleAddBonusXP}
            onNavigate={setActiveModule}
          />
        )}

        {/* RETO DIARIO */}
        {activeModule === 'reto-diario' && (
          <DailyChallengeView
            dailyCase={dailyCase}
            dailyState={dailyState}
            userProgress={userProgress}
            onStartDailyChallenge={handleStartChallenge}
          />
        )}

        {/* ESTADÍSTICAS DEL ALUMNO */}
        {activeModule === 'estadisticas' && (
          <UserStatsView
            userProgress={userProgress}
            onResetProgress={handleResetProgress}
            onOpenSatisfactionSurvey={() => setSatisfactionSurveyOpen(true)}
            onOpenSatisfactionMetrics={() => setSatisfactionMetricsOpen(true)}
          />
        )}

        {/* RANKING & CUADRO DE HONOR DE ESTUDIANTES */}
        {activeModule === 'ranking' && (
          <Leaderboard
            userProgress={userProgress}
            onNavigateToCases={() => setActiveModule('casos')}
            onNavigateToGames={() => setActiveModule('juegos')}
          />
        )}
      </main>

      {/* 3. Footer with Institutional UGR Identity, PID 26-158 and Live Visitor Counter */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
              <span>Universidad de Granada · Facultad de Medicina</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Departamento de Bioquímica y Biología Molecular III e Inmunología · Proyecto de Innovación Docente PID 26-158.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Visitor Counter Live Pill */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs"
              title="Contador de visitas en tiempo real conectado a Firebase Firestore"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Visitas: <strong className="text-white font-mono">{visitorStats.totalVisits.toLocaleString('es-ES')}</strong></span>
            </div>

            <button
              onClick={() => setSatisfactionSurveyOpen(true)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Encuesta de Calidad</span>
            </button>

            <button
              onClick={() => setSatisfactionMetricsOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Panel del Profesorado</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Modals */}
      {/* Case Detail Modal */}
      <CaseDetailModal
        caseData={selectedCaseForDetail}
        onClose={() => setSelectedCaseForDetail(null)}
        onStartChallenge={handleStartChallenge}
      />

      {/* Immediate Diagnostic Feedback Modal */}
      {immediateFeedbackData && (
        <ImmediateFeedbackModal
          currentCase={immediateFeedbackData.caseData}
          selectedOption={immediateFeedbackData.selectedOption}
          labOrderEvaluation={immediateFeedbackData.labOrderEvaluation}
          consultedLibrary={consultedLibraryInChallenge}
          scoreEarned={immediateFeedbackData.scoreEarned}
          streak={immediateFeedbackData.streak}
          dailyBonusApplied={immediateFeedbackData.isDaily}
          onClose={() => setImmediateFeedbackData(null)}
          onNextCase={handleNextCase}
        />
      )}

      {/* Guardia Over / Budget Exhausted Modal */}
      <GuardiaOverModal
        isOpen={guardiaOverModalOpen}
        onRestartGuardia={() => {
          setUserProgress((prev) => ({ ...prev, budget: 5000, lives: 3 }));
          setGuardiaOverModalOpen(false);
        }}
        onGoToGames={() => {
          setGuardiaOverModalOpen(false);
          setActiveModule('juegos');
        }}
      />

      {/* Onboarding Joyride Tour */}
      <OnboardingTour
        run={runTour}
        onFinishTour={() => setRunTour(false)}
      />

      {/* Badge Unlock Celebration Modal */}
      <BadgeUnlockModal
        badge={newlyUnlockedBadge}
        onClose={() => setNewlyUnlockedBadge(null)}
        onViewGallery={() => {
          setNewlyUnlockedBadge(null);
          setActiveModule('estadisticas');
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* AI Case Generator Modal */}
      <AICaseGeneratorModal
        isOpen={aiCaseModalOpen}
        onClose={() => setAiCaseModalOpen(false)}
        onCaseGenerated={(newCase) => {
          setAiCaseModalOpen(false);
          handleStartChallenge(newCase);
        }}
      />

      {/* Student Satisfaction & SUS Survey Modal */}
      <SatisfactionSurveyModal
        isOpen={satisfactionSurveyOpen}
        onClose={() => setSatisfactionSurveyOpen(false)}
        onSurveySubmitted={() => {
          setHasCompletedSurvey(true);
        }}
      />

      {/* Teaching Metrics & Quality Modal (For Professors) */}
      <SatisfactionMetricsModal
        isOpen={satisfactionMetricsOpen}
        onClose={() => setSatisfactionMetricsOpen(false)}
        onOpenSurvey={() => {
          setSatisfactionMetricsOpen(false);
          setSatisfactionSurveyOpen(true);
        }}
        visitorCount={visitorStats.totalVisits}
      />
    </div>
  );
};

export default App;
