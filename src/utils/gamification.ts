/**
 * Gamification & Progression Utilities
 * Handles streaks, ranks, budget tiers, and health metrics
 */

export interface StreakInfo {
  multiplier: number;
  label: string;
  bonusText: string;
  isHot: boolean;
  color: string;
}

export function getStreakMultiplier(streak: number): StreakInfo {
  if (streak >= 5) {
    return {
      multiplier: 2.0,
      label: 'Racha Épica 🔥',
      bonusText: '+100% XP (x2.0)',
      isHot: true,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    };
  }
  if (streak >= 3) {
    return {
      multiplier: 1.5,
      label: 'Racha Activa ⚡',
      bonusText: '+50% XP (x1.5)',
      isHot: true,
      color: 'text-orange-500 bg-orange-500/10 border-orange-500/30'
    };
  }
  if (streak >= 1) {
    return {
      multiplier: 1.1,
      label: 'En Racha ✨',
      bonusText: '+10% XP (x1.1)',
      isHot: false,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    };
  }
  return {
    multiplier: 1.0,
    label: 'Sin Racha',
    bonusText: 'x1.0 XP',
    isHot: false,
    color: 'text-slate-400 bg-slate-100 border-slate-200'
  };
}

export interface PlayerRank {
  rank: string;
  nextRank: string;
  nextRankTitle: string;
  title: string;
  shortTitle: string;
  levelNumber: number;
  currentXp: number;
  nextRankXp: number;
  progress: number;
  progressPct: number;
  badgeColor: string;
  badgeBg: string;
  badgeTextColor: string;
  badgeBorder: string;
  icon: string;
}

export function getPlayerRank(xp: number): PlayerRank {
  const current = xp || 0;
  if (current >= 2500) {
    return {
      rank: 'Catedrático de Bioquímica Clínica',
      nextRank: 'Máximo Escalafón Alcanzado',
      nextRankTitle: 'Máximo Escalafón',
      title: 'Catedrático de Bioquímica Clínica',
      shortTitle: 'Catedrático',
      levelNumber: 5,
      currentXp: current,
      nextRankXp: 2500,
      progress: 100,
      progressPct: 100,
      badgeColor: 'text-purple-600 bg-purple-50 border-purple-200',
      badgeBg: 'bg-purple-100',
      badgeTextColor: 'text-purple-800',
      badgeBorder: 'border-purple-300',
      icon: 'Crown'
    };
  }
  if (current >= 1500) {
    return {
      rank: 'Médico Adjunto de Urgencias',
      nextRank: 'Catedrático de Bioquímica Clínica',
      nextRankTitle: 'Catedrático de Bioquímica',
      title: 'Médico Adjunto de Urgencias',
      shortTitle: 'Médico Adjunto',
      levelNumber: 4,
      currentXp: current,
      nextRankXp: 2500,
      progress: Math.min(100, Math.round(((current - 1500) / 1000) * 100)),
      progressPct: Math.min(100, Math.round(((current - 1500) / 1000) * 100)),
      badgeColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badgeBg: 'bg-indigo-100',
      badgeTextColor: 'text-indigo-800',
      badgeBorder: 'border-indigo-300',
      icon: 'Award'
    };
  }
  if (current >= 800) {
    return {
      rank: 'Médico Residente R3/R4',
      nextRank: 'Médico Adjunto de Urgencias',
      nextRankTitle: 'Médico Adjunto',
      title: 'Médico Residente R3/R4',
      shortTitle: 'Residente Mayor',
      levelNumber: 3,
      currentXp: current,
      nextRankXp: 1500,
      progress: Math.min(100, Math.round(((current - 800) / 700) * 100)),
      progressPct: Math.min(100, Math.round(((current - 800) / 700) * 100)),
      badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
      badgeBg: 'bg-blue-100',
      badgeTextColor: 'text-blue-800',
      badgeBorder: 'border-blue-300',
      icon: 'Stethoscope'
    };
  }
  if (current >= 300) {
    return {
      rank: 'Médico Residente R1/R2',
      nextRank: 'Médico Residente R3/R4',
      nextRankTitle: 'Residente R3/R4',
      title: 'Médico Residente R1/R2',
      shortTitle: 'Residente R1/R2',
      levelNumber: 2,
      currentXp: current,
      nextRankXp: 800,
      progress: Math.min(100, Math.round(((current - 300) / 500) * 100)),
      progressPct: Math.min(100, Math.round(((current - 300) / 500) * 100)),
      badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badgeBg: 'bg-emerald-100',
      badgeTextColor: 'text-emerald-800',
      badgeBorder: 'border-emerald-300',
      icon: 'GraduationCap'
    };
  }
  return {
    rank: 'Estudiante de Medicina UGR',
    nextRank: 'Médico Residente R1/R2',
    nextRankTitle: 'Residente R1/R2',
    title: 'Estudiante de Medicina UGR',
    shortTitle: 'Estudiante',
    levelNumber: 1,
    currentXp: current,
    nextRankXp: 300,
    progress: Math.min(100, Math.round((current / 300) * 100)),
    progressPct: Math.min(100, Math.round((current / 300) * 100)),
    badgeColor: 'text-slate-600 bg-slate-50 border-slate-200',
    badgeBg: 'bg-slate-100',
    badgeTextColor: 'text-slate-800',
    badgeBorder: 'border-slate-300',
    icon: 'BookOpen'
  };
}

export interface PatientHealth {
  percent: number;
  status: string;
  label: string;
  color: string;
  heartClass: string;
}

export function getPatientHealth(lives: number): PatientHealth {
  const safeLives = Math.max(0, Math.min(3, lives));
  if (safeLives === 3) {
    return {
      percent: 100,
      status: 'Estable',
      label: '3/3 Vidas de Guardia',
      color: 'text-rose-500',
      heartClass: 'fill-rose-500 text-rose-500'
    };
  }
  if (safeLives === 2) {
    return {
      percent: 66,
      status: 'Comprometido',
      label: '2/3 Vidas de Guardia',
      color: 'text-amber-500',
      heartClass: 'fill-amber-500 text-amber-500'
    };
  }
  if (safeLives === 1) {
    return {
      percent: 33,
      status: 'Crítico',
      label: '1/3 Vida Restante',
      color: 'text-rose-600 animate-pulse',
      heartClass: 'fill-rose-600 text-rose-600'
    };
  }
  return {
    percent: 0,
    status: 'Guardia Fallida',
    label: '0/3 Sin Vidas',
    color: 'text-slate-400',
    heartClass: 'text-slate-300'
  };
}

export interface BudgetInfo {
  percent: number;
  label: string;
  status: 'healthy' | 'caution' | 'critical';
  color: string;
  colorClass: string;
  icon: string;
  advice: string;
  isRedAlert: boolean;
  statusText: string;
  badgeBg: string;
}

export function getBudgetInfo(budget: number): BudgetInfo {
  const safeBudget = Math.max(0, budget);
  const percent = Math.min(100, Math.max(0, Math.round((safeBudget / 5000) * 100)));
  const isRedAlert = safeBudget < 1000;
  const formatted = `${safeBudget.toLocaleString('es-ES')} €`;

  if (safeBudget > 2000) {
    return {
      percent,
      label: 'Presupuesto Solvente',
      status: 'healthy',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: 'Wallet',
      advice: 'Dispones de fondos suficientes para analíticas completas (partida inicial de 5.000 €).',
      isRedAlert: false,
      statusText: `${formatted} Solvente`
    };
  }
  if (safeBudget >= 1000) {
    return {
      percent,
      label: 'Presupuesto Ajustado',
      status: 'caution',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: 'AlertTriangle',
      advice: 'Presupuesto moderado. Selecciona pruebas costo-efectivas para no agotar la partida asistencial.',
      isRedAlert: false,
      statusText: `${formatted} Ajustado`
    };
  }
  return {
    percent,
    label: 'Presupuesto Crítico (< 1.000 €)',
    status: 'critical',
    color: 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse',
    colorClass: 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: 'ShieldAlert',
    advice: '¡Alerta financiera! Quedan menos de 1.000 €. Solicita solo pruebas imprescindibles o gana fondos en el Parque.',
    isRedAlert: true,
    statusText: `${formatted} Crítico`
  };
}
