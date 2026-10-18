import React, { useState } from 'react';
import { UserProgress, CaseAttemptRecord } from '../../types';
import { evaluateUserBadges } from '../../data/badges';
import { CLINICAL_CASES_DATABASE } from '../../data/clinicalCases';
import {
  Trophy,
  Award,
  Zap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  ShieldCheck,
  TrendingUp,
  Clock,
  Star,
  ChevronDown,
  Filter,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MilestoneTimelineProps {
  userProgress: UserProgress;
}

export type MilestoneType = 'all' | 'badge' | 'difficulty' | 'streak' | 'rank';

export interface TimelineMilestone {
  id: string;
  type: 'badge' | 'difficulty' | 'streak' | 'rank';
  title: string;
  subtitle: string;
  timestamp: string;
  badgeTag: string;
  badgeColor: string;
  icon: React.ReactNode;
  details?: string;
  xpEarned?: number;
  highlight?: boolean;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ userProgress }) => {
  const [selectedFilter, setSelectedFilter] = useState<MilestoneType>('all');

  // Build timeline milestones dynamically from userProgress history & badges
  const milestones: TimelineMilestone[] = [];

  const allBadges = evaluateUserBadges(userProgress);
  const unlockedBadges = allBadges.filter((b) => b.isUnlocked);

  // 1. Difficulty milestones: Advanced and Expert cases successfully resolved
  const historyRecords = userProgress.history || [];

  historyRecords.forEach((record, idx) => {
    // Attempt lookup in database to infer difficulty if missing on older records
    const matchedCase = CLINICAL_CASES_DATABASE.find((c) => c.id === record.caseId);
    const difficulty = record.difficulty || matchedCase?.difficulty;

    if (record.isCorrect && (difficulty === 'experto' || difficulty === 'avanzado')) {
      const isExpert = difficulty === 'experto';
      milestones.push({
        id: `diff-${record.caseId}-${idx}`,
        type: 'difficulty',
        title: isExpert
          ? `Caso de Nivel Experto Resuelto: ${record.caseTitle}`
          : `Caso Avanzado Completado: ${record.caseTitle}`,
        subtitle: `Superado con éxito diagnosticando con ${record.selectedBiomarkerName}.`,
        timestamp: record.timestamp,
        badgeTag: isExpert ? 'Dificultad Experto ⭐⭐⭐' : 'Nivel Avanzado ⭐⭐',
        badgeColor: isExpert
          ? 'bg-purple-100 text-purple-800 border-purple-300'
          : 'bg-amber-100 text-amber-800 border-amber-300',
        icon: isExpert ? <Star className="w-4 h-4 text-purple-600 fill-purple-600" /> : <TrendingUp className="w-4 h-4 text-amber-600" />,
        details: `Sistema ${record.system.toUpperCase()} • Precisión clínica exacta en guardia.`,
        xpEarned: record.scoreEarned,
        highlight: isExpert
      });
    }

    // Direct badge unlocks recorded during history
    if (record.badgeUnlocked) {
      milestones.push({
        id: `hist-badge-${idx}`,
        type: 'badge',
        title: `Insignia Obtenida: ${record.badgeUnlocked}`,
        subtitle: `Logro desbloqueado tras resolver "${record.caseTitle}".`,
        timestamp: record.timestamp,
        badgeTag: 'Insignia Desbloqueada 🏅',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: <Trophy className="w-4 h-4 text-emerald-600" />,
        details: 'Acreditación facultativa sumada a tu expediente.',
        highlight: true
      });
    }
  });

  // 2. Unlocked badges that might not be in history records yet (e.g. initial or catalog evaluation)
  unlockedBadges.forEach((b) => {
    const alreadyListed = milestones.some(
      (m) => m.type === 'badge' && m.title.includes(b.title)
    );
    if (!alreadyListed) {
      milestones.push({
        id: `badge-${b.id}`,
        type: 'badge',
        title: `Insignia de Maestría: ${b.title}`,
        subtitle: b.description,
        timestamp: 'Hito Acreditado',
        badgeTag: b.category === 'special' ? 'Especial 🌟' : 'Sistema Clínico 🏅',
        badgeColor: b.badgeBg + ' ' + b.badgeTextColor + ' ' + b.badgeBorder,
        icon: <Award className="w-4 h-4 text-indigo-600" />,
        details: b.requirementDescription,
        highlight: true
      });
    }
  });

  // 3. Streak Milestones: if current streak or record streak >= 3
  if (userProgress.streak >= 3) {
    milestones.push({
      id: `streak-active-${userProgress.streak}`,
      type: 'streak',
      title: `Racha de Aciertos en Guardia: ${userProgress.streak} Consecutivos`,
      subtitle: `Bonificador multiplicador de experiencia activado en el hospital.`,
      timestamp: 'Racha Activa',
      badgeTag: 'Racha de Fuego 🔥',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: <Flame className="w-4 h-4 text-rose-600 fill-rose-600" />,
      details: 'Precisión diagnóstica sin fallos en guardias continuas.'
    });
  }

  // 4. Initial Milestone if list is empty or as starting point
  if (userProgress.casesAttempted > 0) {
    milestones.push({
      id: 'first-case',
      type: 'difficulty',
      title: 'Bautismo en Guardia Hospitalaria',
      subtitle: 'Comienzo oficial de la rotación y primer caso clínico atendido.',
      timestamp: 'Inicio de Rotación',
      badgeTag: 'Primer Turno 🏥',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
      details: 'Ingreso al simulador de Bioquímica Clínica.'
    });
  }

  // Filter milestones
  const filteredMilestones = milestones.filter((m) => {
    if (selectedFilter === 'all') return true;
    return m.type === selectedFilter;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Línea Temporal de Progresión</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Cronología de Hitos & Conquistas Médicas</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
              {filteredMilestones.length} hitos
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro cronológico de insignias desbloqueadas, casos de alta dificultad superados y rachas en guardia.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedFilter('badge')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              selectedFilter === 'badge'
                ? 'bg-emerald-100 text-emerald-900 shadow-2xs border border-emerald-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Insignias</span>
            {unlockedBadges.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-mono">
                {unlockedBadges.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedFilter('difficulty')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              selectedFilter === 'difficulty'
                ? 'bg-purple-100 text-purple-900 shadow-2xs border border-purple-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Nivel Alto</span>
          </button>
          <button
            onClick={() => setSelectedFilter('streak')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === 'streak'
                ? 'bg-rose-100 text-rose-900 shadow-2xs border border-rose-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rachas
          </button>
        </div>
      </div>

      {/* Timeline Visualization */}
      {filteredMilestones.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
          {filteredMilestones.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              {/* Bullet Node */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 bg-white shadow-xs transition-transform group-hover:scale-110 ${
                  item.highlight
                    ? 'border-emerald-500 text-emerald-600 ring-4 ring-emerald-50'
                    : 'border-slate-400 text-slate-600'
                }`}
              >
                {item.icon}
              </div>

              {/* Card Container */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-emerald-50/40 via-white to-slate-50 border-emerald-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.badgeTag}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.timestamp}</span>
                    {item.xpEarned && (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        +{item.xpEarned} XP
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.subtitle}
                </p>

                {item.details && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{item.details}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 space-y-3 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-slate-200/60 text-slate-500 flex items-center justify-center mx-auto text-xl">
            ⏳
          </div>
          <h4 className="text-sm font-bold text-slate-800">
            Aún no se registran hitos en esta categoría
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Supera casos clínicos de dificultad avanzada o experto y desbloquea insignias para ver tu línea temporal aquí.
          </p>
        </div>
      )}
    </div>
  );
};
