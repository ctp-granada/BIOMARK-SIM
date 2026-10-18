import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, OrganSystem } from '../types';
import {
  getPlayerRank,
  getPatientHealth,
  getBudgetInfo,
  getStreakMultiplier
} from '../utils/gamification';
import { evaluateUserBadges } from '../data/badges';
import { Heart, Flame, Wallet, RefreshCw, Trophy, AlertTriangle, Award, Crown, Sparkles, HelpCircle, Info, TrendingUp, TrendingDown, Gamepad2, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GamifiedDashboardProps {
  userProgress: UserProgress;
  onResetGuardia: () => void;
  onOpenStats?: () => void;
  onOpenRanking?: () => void;
  onGoToGames?: () => void;
}

export const GamifiedDashboard: React.FC<GamifiedDashboardProps> = ({
  userProgress,
  onResetGuardia,
  onOpenStats,
  onOpenRanking,
  onGoToGames
}) => {
  const [showBudgetTooltip, setShowBudgetTooltip] = useState(false);
  const prevStreakRef = useRef(userProgress.streak);
  const [isStreakingUp, setIsStreakingUp] = useState(false);

  useEffect(() => {
    if (userProgress.streak > prevStreakRef.current && userProgress.streak > 0) {
      setIsStreakingUp(true);
      const timer = setTimeout(() => {
        setIsStreakingUp(false);
      }, 1800);
      return () => clearTimeout(timer);
    }
    prevStreakRef.current = userProgress.streak;
  }, [userProgress.streak]);

  const rank = getPlayerRank(userProgress.xp || userProgress.score);
  const health = getPatientHealth(userProgress.lives);
  const budgetInfo = getBudgetInfo(userProgress.budget);
  const streakInfo = getStreakMultiplier(userProgress.streak);

  const badges = evaluateUserBadges(userProgress);
  const unlockedBadges = badges.filter((b) => b.isUnlocked);

  const systemNames: Record<OrganSystem, string> = {
    cardiac: 'Cardíaco',
    hepatic: 'Hepático / Ictericias',
    metabolic: 'Metabolismo / β-Oxidación',
    renal: 'Renal / Urea / Uricemia',
    pancreatic: 'Pancreático-Digestivo',
    neuromuscular: 'Neuromuscular / Señalización'
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6 overflow-hidden">
      {/* Top Header: Player Profile Rank & Hearts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-5 border-b border-slate-100">
        
        {/* Card 1: Perfil y Rango Médico (Deep Navy Clinical Master) */}
        <div 
          onClick={onOpenRanking}
          className={`bg-slate-950 text-white rounded-xl p-4 flex flex-col justify-between shadow-xs border border-slate-800 ${
            onOpenRanking ? 'cursor-pointer hover:border-emerald-500/60 transition-all' : ''
          }`}
          title={onOpenRanking ? "Ver Ranking Global y Clasificación Top 10" : undefined}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
              Perfil Facultativo
              {onOpenRanking && <Trophy className="w-3 h-3 text-amber-400" />}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rank.badgeBg} ${rank.badgeTextColor} ${rank.badgeBorder}`}>
              Nivel {rank.levelNumber}
            </span>
          </div>

          <div className="flex items-center gap-3 my-1">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
              {rank.icon}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm text-white leading-tight truncate">{rank.title}</h3>
              <p className="text-xs text-emerald-400 font-mono font-bold mt-0.5">{userProgress.xp || userProgress.score} XP</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span className="truncate pr-1">Sig: {rank.nextRankTitle}</span>
              <span className="font-mono font-bold text-slate-300">{rank.progressPct}%</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rank.progressPct}%` }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Ganancias y Fondos del Parque - Pure White & Titanium */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">Parque Lúdico</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">+Dinero 💰</span>
            </div>

            <div className="flex items-center gap-3 my-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                <Coins className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 block font-mono">
                  {userProgress.budget.toLocaleString('es-ES')} € Fondos
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Juega minijuegos para ganar más dinero
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-600 border-t border-slate-100">
            {onGoToGames && (
              <button
                onClick={onGoToGames}
                className="w-full text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                title="Juega en el Parque para ganar dinero (+250 € a +300 € de fondos) y conseguir puntos extra"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ganar Dinero en el Parque</span>
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Presupuesto Sanitario en Tiempo Real */}
        {(() => {
          const isCriticalUnder1000 = userProgress.budget < 1000;
          return (
            <div
              className={`rounded-xl p-4 border flex flex-col justify-between relative transition-all bg-white ${
                isCriticalUnder1000
                  ? 'border-rose-400 ring-2 ring-rose-500/20'
                  : budgetInfo.isRedAlert
                  ? 'border-amber-300'
                  : 'border-slate-200/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Wallet className={`w-3.5 h-3.5 ${isCriticalUnder1000 ? 'text-rose-600' : 'text-emerald-600'}`} />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-600">
                      Presupuesto
                    </span>
                    
                    {/* Tooltip trigger button */}
                    <div className="relative inline-block">
                      <button
                        type="button"
                        onClick={() => setShowBudgetTooltip((prev) => !prev)}
                        onMouseEnter={() => setShowBudgetTooltip(true)}
                        onMouseLeave={() => setShowBudgetTooltip(false)}
                        aria-label="Información de gestión presupuestaria"
                        className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>

                      {/* Tooltip Card Popover */}
                      {showBudgetTooltip && (
                        <div
                          onMouseEnter={() => setShowBudgetTooltip(true)}
                          onMouseLeave={() => setShowBudgetTooltip(false)}
                          className="absolute z-50 left-0 top-full mt-2 w-72 sm:w-80 bg-slate-950 text-white rounded-xl p-3.5 shadow-2xl border border-slate-800 text-xs backdrop-blur-md pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150"
                        >
                          <div className="flex items-center gap-1.5 font-bold text-slate-100 pb-2 border-b border-slate-800 text-[11px] uppercase tracking-wide">
                            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>Gestión de Presupuesto Clínico (5.000 €)</span>
                          </div>

                          <div className="space-y-2 mt-2.5 text-[11px] leading-relaxed">
                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                              <strong className="text-rose-400 block font-semibold">Costes de Pruebas Reales</strong>
                              <span className="text-slate-300 text-[10px]">
                                Cada biomarcador solicitado descuenta un coste hospitalario real (45 € a 180 €). Solicitar pruebas innecesarias penaliza la eficiencia.
                              </span>
                            </div>

                            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                              <strong className="text-emerald-400 block font-semibold">Reembolsos & Ganancias</strong>
                              <span className="text-slate-300 text-[10px]">
                                Aciertos diagnósticos otorgan bonificaciones asistenciales. Juega en el Parque para ganar entre 250 € y 300 € por minijuego.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isCriticalUnder1000
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : budgetInfo.badgeBg
                  }`}>
                    {userProgress.budget.toLocaleString('es-ES')} €
                  </span>
                </div>

                <div className="my-2">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 p-0.5">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: `${Math.min(100, Math.max(0, (userProgress.budget / 5000) * 100))}%` }}
                      className={`h-full rounded-full transition-all ${
                        isCriticalUnder1000 ? 'bg-rose-600' : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {isCriticalUnder1000 ? (
                <div className="mt-1 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <p className="text-[10px] font-bold text-rose-700 leading-tight">
                    Presupuesto crítico (&lt; 1.000 €). Optimiza tus peticiones analíticas o gana fondos en el Parque.
                  </p>
                </div>
              ) : (
                <p className={`text-[11px] ${budgetInfo.colorClass} flex items-center gap-1 mt-1`}>
                  {budgetInfo.isRedAlert && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                  <span>{budgetInfo.statusText}</span>
                </p>
              )}
            </div>
          );
        })()}

        {/* Card 4: Racha Activa y Multiplicador (Pure White + Gold Celebration Pulse) */}
        <div
          className={`border rounded-xl p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden transition-all duration-300 ${
            isStreakingUp
              ? 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/50 border-amber-400 ring-2 ring-amber-400/40 shadow-md shadow-amber-200/50'
              : 'bg-white border-slate-200/90'
          }`}
        >
          {/* Subtle golden celebration sheen */}
          <AnimatePresence>
            {isStreakingUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-amber-400/10 via-yellow-300/15 to-transparent z-0"
              />
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-1 relative z-10">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 flex items-center gap-1">
              <motion.div
                animate={
                  isStreakingUp
                    ? {
                        scale: [1, 1.4, 1.1, 1.3, 1],
                        rotate: [0, -12, 12, -8, 0]
                      }
                    : {}
                }
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              >
                <Flame
                  className={`w-3.5 h-3.5 transition-colors ${
                    isStreakingUp || userProgress.streak >= 3
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-emerald-600'
                  }`}
                />
              </motion.div>
              <span>Racha de Aciertos</span>
            </span>

            <motion.span
              animate={isStreakingUp ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.6 }}
              className={`font-semibold text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                isStreakingUp
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              {isStreakingUp ? '¡+1 Acierto Dorado! ✨' : streakInfo.label}
            </motion.span>
          </div>

          <div className="flex items-center gap-2.5 my-1 relative z-10">
            <motion.span
              className="text-xl select-none"
              animate={
                isStreakingUp
                  ? {
                      scale: [1, 1.5, 1.2, 1.4, 1],
                      rotate: [0, -20, 20, -10, 0]
                    }
                  : {}
              }
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              {isStreakingUp ? '🌟' : '✨'}
            </motion.span>

            <div className="relative inline-flex items-baseline">
              {/* Golden pulsing ring/shockwave behind the number */}
              {isStreakingUp && (
                <motion.span
                  initial={{ opacity: 0.8, scale: 0.9 }}
                  animate={{
                    opacity: [0.8, 0, 0.7, 0],
                    scale: [0.9, 2.2, 1.1, 2.4]
                  }}
                  transition={{ duration: 1.4, times: [0, 0.5, 0.6, 1], ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-amber-400/40 blur-xs pointer-events-none"
                />
              )}

              {/* Main Animated Streak Counter with Golden Pulse */}
              <motion.span
                key={userProgress.streak}
                initial={isStreakingUp ? { scale: 0.8, opacity: 0.8 } : false}
                animate={
                  isStreakingUp
                    ? {
                        scale: [1, 1.55, 1.15, 1.35, 1],
                        color: ['#0f172a', '#d97706', '#b45309', '#d97706', '#0f172a'],
                        textShadow: [
                          '0 0 0px rgba(245, 158, 11, 0)',
                          '0 0 16px rgba(245, 158, 11, 0.95), 0 0 28px rgba(234, 179, 8, 0.7)',
                          '0 0 10px rgba(245, 158, 11, 0.8), 0 0 20px rgba(234, 179, 8, 0.5)',
                          '0 0 14px rgba(245, 158, 11, 0.9), 0 0 24px rgba(234, 179, 8, 0.6)',
                          '0 0 0px rgba(245, 158, 11, 0)'
                        ]
                      }
                    : { scale: 1 }
                }
                transition={{
                  duration: 1.4,
                  times: [0, 0.3, 0.55, 0.8, 1],
                  ease: 'easeInOut'
                }}
                className="text-2xl font-black font-mono leading-none tracking-tight inline-block"
              >
                {userProgress.streak}
              </motion.span>

              <span className="text-xs text-slate-500 ml-1.5 font-medium">
                {userProgress.streak === 1 ? 'seguido' : 'seguidos'}
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-100 relative z-10 flex items-center justify-between">
            <span>
              {userProgress.streak >= 2
                ? `Multiplicador x${streakInfo.multiplier} activo`
                : '2 aciertos consecutivos activan multiplicador'}
            </span>
            {isStreakingUp && (
              <motion.span
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded text-[9px] border border-amber-300"
              >
                {streakInfo.bonusText}
              </motion.span>
            )}
          </div>
        </div>

      </div>

      {/* System Stats Mini Breakdown & Badges Row */}
      <div className="mt-4 pt-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Especialidades:</span>
          {(Object.keys(systemNames) as OrganSystem[]).map((sys) => {
            const stats = userProgress.systemStats?.[sys] || { attempted: 0, correct: 0 };
            const sysAcc = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
            const isExpert = stats.attempted >= 3 && sysAcc >= 90;

            return (
              <div
                key={sys}
                className={`border px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                  isExpert
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span>{systemNames[sys]}</span>
                <span className={`font-mono text-[11px] font-bold ${isExpert ? 'text-emerald-700' : sysAcc >= 80 ? 'text-slate-900' : 'text-slate-500'}`}>
                  {stats.attempted > 0 ? `${sysAcc}%` : '—'}
                </span>
                {isExpert && <Crown className="w-3 h-3 text-emerald-600" />}
              </div>
            );
          })}
        </div>

        {/* Unlocked Badges count or shortcut */}
        <div className="flex items-center gap-3">
          {unlockedBadges.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg text-xs">
              <Award className="w-4 h-4 text-slate-700" />
              <span className="font-semibold text-slate-800 text-[11px]">
                {unlockedBadges.length} {unlockedBadges.length === 1 ? 'Insignia' : 'Insignias'}
              </span>
              <div className="flex items-center -space-x-1 ml-1">
                {unlockedBadges.slice(0, 4).map((b) => (
                  <span key={b.id} title={b.title} className="text-sm cursor-help">
                    {b.icon}
                  </span>
                ))}
              </div>
            </div>
          )}

          {onOpenStats && (
            <button
              onClick={onOpenStats}
              className="text-xs font-semibold text-slate-800 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-slate-700" />
              <span>Insignias & Analíticas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
