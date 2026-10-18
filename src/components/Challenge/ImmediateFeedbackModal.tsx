import React, { useEffect } from 'react';
import { ClinicalCase, BiomarkerOption, LabOrderEvaluation, SystemBadge } from '../../types';
import { getStreakMultiplier } from '../../utils/gamification';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { audioService } from '../../utils/audioService';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Award, 
  Sparkles, 
  BookOpen, 
  X, 
  ClipboardList, 
  Wallet, 
  Check, 
  AlertCircle, 
  Layers,
  Flame,
  Zap,
  Trophy,
  Crown
} from 'lucide-react';

interface ImmediateFeedbackModalProps {
  currentCase: ClinicalCase;
  selectedOption?: BiomarkerOption | null;
  labOrderEvaluation?: LabOrderEvaluation | null;
  consultedLibrary: boolean;
  scoreEarned: number;
  streak?: number;
  newlyUnlockedBadge?: SystemBadge | null;
  dailyBonusApplied?: boolean;
  dailyBonusMultiplier?: number;
  dailyTimeTakenSeconds?: number;
  onClose: () => void;
  onNextCase: () => void;
}

// Celebration particles for streak celebration
const STREAK_EMOJIS = ['🔥', '✨', '⚡', '🏆', '🎯', '🌟', '💎', '🔥'];

export const ImmediateFeedbackModal: React.FC<ImmediateFeedbackModalProps> = ({
  currentCase,
  selectedOption,
  labOrderEvaluation,
  consultedLibrary,
  scoreEarned,
  streak = 0,
  newlyUnlockedBadge,
  dailyBonusApplied = false,
  dailyBonusMultiplier = 2.0,
  dailyTimeTakenSeconds,
  onClose,
  onNextCase
}) => {
  const isMultiOrder = !!labOrderEvaluation;
  const isCorrect = isMultiOrder
    ? labOrderEvaluation.isFullyCorrect
    : selectedOption?.isCorrect ?? false;
  const isPartiallyCorrect = isMultiOrder ? labOrderEvaluation.isPartiallyCorrect : false;

  // Streak celebration triggers when user achieves a streak of more than 3 cases (streak > 3 or streak >= 3)
  const isStreakCelebration = isCorrect && streak > 3;
  const streakMultiplier = getStreakMultiplier(streak);

  // Play specific sound effect based on answer status
  useEffect(() => {
    if (newlyUnlockedBadge) {
      audioService.playBadgeUnlock();
    } else if (isCorrect) {
      audioService.playSuccess();
    } else {
      audioService.playError();
    }
  }, [isCorrect, newlyUnlockedBadge]);

  // Trigger confetti burst on streak celebration, badge unlock or daily challenge bonus
  useEffect(() => {
    if (isStreakCelebration || newlyUnlockedBadge || (isCorrect && dailyBonusApplied)) {
      // First burst - center
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899', '#3b82f6']
      });

      // Lateral cannons
      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ['#fbbf24', '#f97316', '#3b82f6']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ['#10b981', '#8b5cf6', '#f43f5e']
        });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isStreakCelebration, newlyUnlockedBadge, isCorrect, dailyBonusApplied]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', duration: 0.45, bounce: 0.25 }}
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto relative"
      >
        {/* SPECIAL CELEBRATION BANNER FOR NEWLY UNLOCKED BADGE */}
        {newlyUnlockedBadge && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="overflow-hidden bg-slate-950 text-white p-4.5 shadow-xs border-b border-slate-800 relative z-20"
          >
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center space-x-3">
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0"
                >
                  {newlyUnlockedBadge.icon}
                </motion.div>

                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>Insignia de Especialidad Desbloqueada</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <span>{newlyUnlockedBadge.title}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    {newlyUnlockedBadge.requirementDescription} (Precisión: {newlyUnlockedBadge.currentAccuracy}% en {newlyUnlockedBadge.currentAttempted} casos).
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center shrink-0">
                <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">
                  Reconocimiento
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  +100 XP
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* SPECIAL CELEBRATION BANNER FOR DAILY CHALLENGE WITH SPEED BONUS */}
        {dailyBonusApplied && isCorrect && !newlyUnlockedBadge && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="overflow-hidden bg-slate-950 text-white p-4.5 shadow-xs border-b border-slate-800 relative z-20"
          >
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center space-x-3">
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0"
                >
                  ⚡
                </motion.div>

                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Reto Diario de Guardia Superado</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <span>Bonificación por Eficiencia Temporal:</span>
                    <span className="text-emerald-400 font-mono">{dailyBonusMultiplier}x XP</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    Completado en {dailyTimeTakenSeconds ? `${dailyTimeTakenSeconds}s` : '< 2 min'}. Recompensa máxima aplicada por resolución rápida.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center shrink-0">
                <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider block">
                  Bonus Contrarreloj
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>+{Math.round(scoreEarned - (scoreEarned / dailyBonusMultiplier))} XP</span>
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* SPECIAL CELEBRATION BANNER FOR STREAK > 3 */}
        {isStreakCelebration && !newlyUnlockedBadge && !dailyBonusApplied && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="overflow-hidden bg-slate-950 text-white p-4.5 shadow-xs border-b border-slate-800 relative z-20"
          >
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  <Flame className="w-6 h-6 text-emerald-400 fill-emerald-400" />
                </div>

                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-emerald-400" />
                      <span>Racha Consecutiva de Precisión</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      • Multiplicador {streakMultiplier.multiplier}x
                    </span>
                  </div>

                  <h3 className="text-base font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <span>{streak} Diagnósticos Acertados Consecutivos</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">
                    Alto rendimiento analítico (+{Math.round((streakMultiplier.multiplier - 1) * 100)}% de bonificación por precisión acumulada).
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center shrink-0">
                <div className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                  Bonus de Racha
                </div>
                <div className="text-xs font-bold text-emerald-400 font-mono flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>+{Math.round((streakMultiplier.multiplier - 1) * scoreEarned)} XP</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Banner Header */}
        <div className={`p-6 text-white sticky top-0 z-10 flex items-start justify-between border-b ${
          isCorrect
            ? 'bg-slate-950 border-slate-800'
            : isPartiallyCorrect
            ? 'bg-slate-950 border-amber-900/60'
            : 'bg-slate-950 border-rose-900/60'
        }`}>
          <div className="flex items-start space-x-3.5">
            <motion.div 
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className={`p-2.5 rounded-xl shrink-0 border ${
                isCorrect 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isPartiallyCorrect
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              ) : isPartiallyCorrect ? (
                <AlertTriangle className="w-7 h-7 text-amber-400" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-400" />
              )}
            </motion.div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  isCorrect
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : isPartiallyCorrect
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}>
                  {isMultiOrder
                    ? isCorrect
                      ? 'Orden de Laboratorio Concluyente'
                      : isPartiallyCorrect
                      ? 'Orden Parcialmente Orientada'
                      : 'Orden No Diagnóstica'
                    : isCorrect
                    ? 'Selección Diagnóstica Correcta'
                    : 'Diagnóstico Incorrecto'}
                </span>
                {consultedLibrary && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Biblio -10 pts</span>
                  </span>
                )}
                {streak > 1 && isCorrect && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800 flex items-center space-x-1">
                    <Flame className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    <span>Racha: {streak}</span>
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isCorrect
                  ? 'Fundamentación Bioquímica y Diagnóstico Confirmado'
                  : isPartiallyCorrect
                  ? 'Diagnóstico Incompleto: Faltan Marcadores Esenciales'
                  : 'Análisis de la Petición Diagnóstica'}
              </h2>
              <div className="flex flex-wrap items-center gap-2.5 text-xs mt-1.5 font-medium">
                <span className="bg-slate-900 text-slate-200 border border-slate-800 px-2.5 py-0.5 rounded-md font-mono font-bold">
                  +{scoreEarned} XP
                </span>
                {isCorrect ? (
                  <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                    ✓ Paciente compensado | Presupuesto sanitario optimizado
                  </span>
                ) : isPartiallyCorrect ? (
                  <span className="text-amber-400 text-xs font-medium flex items-center gap-1">
                    ⚠ Paciente en observación | Requiere marcador confirmatorio
                  </span>
                ) : (
                  <span className="text-rose-400 text-xs font-medium flex items-center gap-1">
                    ✕ Penalización clínica aplicada
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-800">
          {/* Target Disease Summary */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-500 uppercase">Patología Diana / Sospecha Primaria:</span>
              <span className="font-bold text-slate-900 text-sm">{currentCase.targetDisease}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-500 uppercase">
                {isMultiOrder ? 'Tipo de Petición Emitida:' : 'Biomarcador Elegido:'}
              </span>
              <span className={`font-bold text-sm ${isCorrect ? 'text-emerald-700' : isPartiallyCorrect ? 'text-amber-700' : 'text-rose-700'}`}>
                {isMultiOrder
                  ? `Orden Multianalítica (${labOrderEvaluation.orderedBiomarkerIds.length} pruebas solicitadas)`
                  : selectedOption?.biomarkerName}
              </span>
            </div>
          </div>

          {/* MULTI-BIOMARKER LAB ORDER BREAKDOWN */}
          {isMultiOrder && labOrderEvaluation && (
            <div className="space-y-4">
              {/* Score & Efficiency Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-center">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">Precisión Diagnóstica</span>
                  <span className="text-xl font-bold font-mono text-slate-900">{labOrderEvaluation.accuracyScore}%</span>
                </div>
                <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-center">
                  <span className="text-[10px] font-semibold uppercase text-emerald-800 block">Eficiencia Presupuestaria</span>
                  <span className="text-xl font-bold font-mono text-emerald-900">{labOrderEvaluation.budgetEfficiencyScore}%</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-center">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 block">Coste Analítico Petición</span>
                  <span className="text-xl font-bold font-mono text-slate-900">-{labOrderEvaluation.totalBudgetCost} €</span>
                </div>
              </div>

              {/* Evaluation Summary Text */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : isPartiallyCorrect ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}>
                <p className="font-bold text-sm mb-1">Informe de Calidad del Laboratorio Clínico:</p>
                <p className="text-slate-700 leading-relaxed">{labOrderEvaluation.clinicalSummary}</p>
              </div>

              {/* Itemized Tests Evaluation */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Desglose de Pruebas Solicitadas en el Volante</span>
                </h3>

                {/* Essential Tests Found */}
                {labOrderEvaluation.essentialBiomarkersFound.length > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                    <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      <span>Biomarcadores Críticos / Esenciales Acertados:</span>
                    </div>
                    <div className="space-y-1.5 pl-5">
                      {labOrderEvaluation.essentialBiomarkersFound.map((b) => (
                        <div key={b.id} className="text-xs text-emerald-950">
                          <span className="font-bold">{b.name} ({b.abbreviation}): </span>
                          <span className="opacity-90">{b.clinicalRelevance}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Essential Tests */}
                {labOrderEvaluation.missingEssentialBiomarkers.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                    <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Biomarcadores Clave Omitidos en la Orden:</span>
                    </div>
                    <div className="space-y-1.5 pl-5">
                      {labOrderEvaluation.missingEssentialBiomarkers.map((b) => (
                        <div key={b.id} className="text-xs text-amber-950">
                          <span className="font-bold">{b.name} ({b.abbreviation}): </span>
                          <span>Indispensable para discriminar {currentCase.targetDisease}.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complementary Tests */}
                {labOrderEvaluation.complementaryBiomarkers.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Pruebas Complementarias Aceptables (Mismo Sistema):</span>
                    </div>
                    <div className="space-y-1.5 pl-5">
                      {labOrderEvaluation.complementaryBiomarkers.map((b) => (
                        <div key={b.id} className="text-xs text-blue-950">
                          <span className="font-bold">{b.name}: </span>
                          <span className="opacity-90">{b.diagnosticIndication}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Redundant Tests */}
                {labOrderEvaluation.redundantBiomarkers.length > 0 && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                    <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Pruebas Redundantes / No Indicadas (Sobrecoste):</span>
                    </div>
                    <div className="space-y-1.5 pl-5">
                      {labOrderEvaluation.redundantBiomarkers.map((b) => (
                        <div key={b.id} className="text-xs text-rose-950">
                          <span className="font-bold">{b.name}: </span>
                          <span>No indicada para la patología sospechada ({b.diagnosticIndication}).</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SINGLE OPTION BREAKDOWN (IF NOT MULTI-ORDER) */}
          {!isMultiOrder && selectedOption && (
            <>
              {/* Detailed Justification for Selected Option */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Explicación Fisiopatológica y Cinética de la Opción Elegida
                </h3>
                <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}>
                  <p className="font-semibold text-sm leading-relaxed">
                    {selectedOption.whyOptimalOrSuboptimal}
                  </p>
                  <p className="leading-relaxed opacity-90">
                    {selectedOption.biochemicalRationale}
                  </p>
                </div>
              </div>

              {/* Comparative Analysis of ALL Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Análisis Comparativo de las Opciones Presentadas
                </h3>
                <div className="space-y-2">
                  {currentCase.biomarkerOptions.map((opt, idx) => {
                    const isThisSelected = opt.id === selectedOption.id;
                    return (
                      <div
                        key={opt.id}
                        className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                          opt.isCorrect
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                            : isThisSelected
                            ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center space-x-1.5">
                            <span>{String.fromCharCode(65 + idx)}. {opt.biomarkerName}</span>
                            {opt.isCorrect && (
                              <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase">
                                Óptimo / Correcto
                              </span>
                            )}
                            {isThisSelected && !opt.isCorrect && (
                              <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-extrabold uppercase">
                                Tu Elección (Inadecuada)
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="mt-1 leading-relaxed">{opt.whyOptimalOrSuboptimal}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Expert Takeaway Key */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs text-slate-800 space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Perla Clínica y Resumen Docente Departamental:</span>
            </span>
            <p className="italic leading-relaxed text-slate-700">{currentCase.expertClinicalKey}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-slate-200 flex items-center justify-between sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Revisar Caso
          </button>

          <button
            onClick={() => {
              onClose();
              onNextCase();
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <span>Siguiente Caso Clínico</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
