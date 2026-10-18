/**
 * System Badges Catalog & Evaluation Engine
 */

import { SystemBadge, UserProgress, OrganSystem } from '../types';

export const SYSTEM_BADGES_CATALOG: SystemBadge[] = [
  {
    id: 'badge_cardiac',
    system: 'cardiac',
    title: 'Especialista en Necrosis Miocárdica',
    shortTitle: 'Cardíaco',
    category: 'system',
    description: 'Dominio de troponinas hs-cTn, CK-MB y NT-proBNP en dolor torácico e insuficiencia cardíaca.',
    requirementDescription: 'Resuelve al menos 3 casos cardíacos con precisión ≥ 80%.',
    icon: 'Heart',
    themeColor: 'rose',
    badgeBg: 'bg-rose-50',
    badgeBorder: 'border-rose-200',
    badgeTextColor: 'text-rose-700',
    minCasesRequired: 3,
    targetAccuracy: 80,
    isUnlocked: false,
    currentAccuracy: 0,
    currentAttempted: 0,
    currentCorrect: 0,
    progressPct: 0
  },
  {
    id: 'badge_hepatic',
    system: 'hepatic',
    title: 'Maestro de las Ictericias y Citólisis',
    shortTitle: 'Hepático',
    category: 'system',
    description: 'Diagnóstico diferencial preciso de ictericias prehepáticas, obstructivas y daño hepatocelular.',
    requirementDescription: 'Resuelve al menos 3 casos hepáticos con precisión ≥ 80%.',
    icon: 'Activity',
    themeColor: 'amber',
    badgeBg: 'bg-amber-50',
    badgeBorder: 'border-amber-200',
    badgeTextColor: 'text-amber-700',
    minCasesRequired: 3,
    targetAccuracy: 80,
    isUnlocked: false,
    currentAccuracy: 0,
    currentAttempted: 0,
    currentCorrect: 0,
    progressPct: 0
  },
  {
    id: 'badge_metabolic',
    system: 'metabolic',
    title: 'Experto en β-Oxidación y Metabolismo',
    shortTitle: 'Metabolismo',
    category: 'system',
    description: 'Manejo impecable del perfil de acilcarnitinas, β-hidroxibutirato y descompensaciones metabólicas.',
    requirementDescription: 'Resuelve al menos 3 casos metabólicos con precisión ≥ 80%.',
    icon: 'Zap',
    themeColor: 'indigo',
    badgeBg: 'bg-indigo-50',
    badgeBorder: 'border-indigo-200',
    badgeTextColor: 'text-indigo-700',
    minCasesRequired: 3,
    targetAccuracy: 80,
    isUnlocked: false,
    currentAccuracy: 0,
    currentAttempted: 0,
    currentCorrect: 0,
    progressPct: 0
  },
  {
    id: 'badge_renal',
    system: 'renal',
    title: 'Guardián del Ciclo de la Urea y Purinas',
    shortTitle: 'Renal',
    category: 'system',
    description: 'Urgencias por hiperamonemia (OTC), artritis gotosa y manejo del equilibrio nitrogenado.',
    requirementDescription: 'Resuelve al menos 3 casos renales con precisión ≥ 80%.',
    icon: 'Stethoscope',
    themeColor: 'blue',
    badgeBg: 'bg-blue-50',
    badgeBorder: 'border-blue-200',
    badgeTextColor: 'text-blue-700',
    minCasesRequired: 3,
    targetAccuracy: 80,
    isUnlocked: false,
    currentAccuracy: 0,
    currentAttempted: 0,
    currentCorrect: 0,
    progressPct: 0
  },
  {
    id: 'badge_pancreatic',
    system: 'pancreatic',
    title: 'Tutor de Lipasa y Digestivo Clínico',
    shortTitle: 'Pancreático',
    category: 'system',
    description: 'Diagnóstico de pancreatitis aguda, interferencias lipémicas e insuficiencia exocrina.',
    requirementDescription: 'Resuelve al menos 3 casos pancreáticos con precisión ≥ 80%.',
    icon: 'Sparkles',
    themeColor: 'teal',
    badgeBg: 'bg-teal-50',
    badgeBorder: 'border-teal-200',
    badgeTextColor: 'text-teal-700',
    minCasesRequired: 3,
    targetAccuracy: 80,
    isUnlocked: false,
    currentAccuracy: 0,
    currentAttempted: 0,
    currentCorrect: 0,
    progressPct: 0
  },
  {
    id: 'badge_streak_master',
    title: 'Clínico Infalible (Racha x5)',
    shortTitle: 'Racha Épica',
    category: 'special',
    description: 'Has encadenado 5 diagnósticos perfectos consecutivos en la guardia hospitalaria.',
    requirementDescription: 'Alcanza una racha de 5 aciertos seguidos.',
    icon: 'Flame',
    themeColor: 'orange',
    badgeBg: 'bg-orange-50',
    badgeBorder: 'border-orange-200',
    badgeTextColor: 'text-orange-700',
    minCasesRequired: 5,
    targetAccuracy: 100,
    isUnlocked: false,
    currentAccuracy: 0,
    currentAttempted: 0,
    currentCorrect: 0,
    progressPct: 0
  },
  {
    id: 'badge_economist',
    title: 'Gestor Sanitario de Alta Eficiencia',
    shortTitle: 'Eficiencia',
    category: 'special',
    description: 'Finalización de guardia con fondos presupuestarios superiores a 4.000 € (80% del presupuesto).',
    requirementDescription: 'Mantén un presupuesto de guardia ≥ 4.000 € con al menos 4 casos resueltos.',
    icon: 'Award',
    themeColor: 'emerald',
    badgeBg: 'bg-emerald-50',
    badgeBorder: 'border-emerald-200',
    badgeTextColor: 'text-emerald-700',
    minCasesRequired: 4,
    targetAccuracy: 80,
    isUnlocked: false,
    currentAccuracy: 0,
    currentAttempted: 0,
    currentCorrect: 0,
    progressPct: 0
  }
];

export function evaluateUserBadges(progress: UserProgress): SystemBadge[] {
  const stats = progress.systemStats || ({} as Record<OrganSystem, { attempted: number; correct: number }>);
  const userUnlocked = new Set(progress.unlockedBadges || []);

  return SYSTEM_BADGES_CATALOG.map((badge) => {
    if (badge.category === 'system' && badge.system) {
      const sysData = stats[badge.system] || { attempted: 0, correct: 0 };
      const attempted = sysData.attempted;
      const correct = sysData.correct;
      const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
      const unlocked =
        userUnlocked.has(badge.id) ||
        (attempted >= badge.minCasesRequired && accuracy >= badge.targetAccuracy);
      const progressPct = Math.min(100, Math.round((attempted / badge.minCasesRequired) * 100));

      return {
        ...badge,
        isUnlocked: unlocked,
        currentAttempted: attempted,
        currentCorrect: correct,
        currentAccuracy: accuracy,
        progressPct
      };
    }

    if (badge.id === 'badge_streak_master') {
      const streak = progress.streak || 0;
      const unlocked = userUnlocked.has(badge.id) || streak >= 5;
      const progressPct = Math.min(100, Math.round((streak / 5) * 100));
      return {
        ...badge,
        isUnlocked: unlocked,
        currentAttempted: streak,
        currentCorrect: streak,
        currentAccuracy: 100,
        progressPct
      };
    }

    if (badge.id === 'badge_economist') {
      const budget = progress.budget || 0;
      const attempted = progress.casesAttempted || 0;
      const unlocked = userUnlocked.has(badge.id) || (budget >= 4000 && attempted >= 4);
      const progressPct = attempted >= 4 ? Math.min(100, Math.round((budget / 5000) * 100)) : Math.round((attempted / 4) * 50);
      return {
        ...badge,
        isUnlocked: unlocked,
        currentAttempted: attempted,
        currentCorrect: progress.casesCorrect || 0,
        currentAccuracy: Math.round((budget / 5000) * 100),
        progressPct
      };
    }

    return badge;
  });
}

export function getNewlyUnlockedBadges(
  prevBadges: SystemBadge[],
  currentBadges: SystemBadge[]
): SystemBadge[] {
  const prevUnlockedIds = new Set(prevBadges.filter((b) => b.isUnlocked).map((b) => b.id));
  return currentBadges.filter((b) => b.isUnlocked && !prevUnlockedIds.has(b.id));
}
