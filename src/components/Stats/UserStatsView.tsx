import React from 'react';
import { UserProgress, OrganSystem } from '../../types';
import { evaluateUserBadges } from '../../data/badges';
import { getPlayerRank, getStreakMultiplier } from '../../utils/gamification';
import { MilestoneTimeline } from './MilestoneTimeline';
import {
  Trophy,
  Activity,
  Award,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Target,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface UserStatsViewProps {
  userProgress: UserProgress;
  onResetProgress?: () => void;
}

export const UserStatsView: React.FC<UserStatsViewProps> = ({
  userProgress,
  onResetProgress
}) => {
  const rank = getPlayerRank(userProgress.xp || userProgress.score || 0);
  const streak = getStreakMultiplier(userProgress.streak || 0);
  const badges = evaluateUserBadges(userProgress);
  const unlockedBadges = badges.filter((b) => b.isUnlocked);

  const accuracy =
    userProgress.casesAttempted > 0
      ? Math.round((userProgress.casesCorrect / userProgress.casesAttempted) * 100)
      : 0;

  const systems: { key: OrganSystem; label: string; color: string }[] = [
    { key: 'cardiac', label: 'Cardíaco & Coronario', color: 'bg-rose-500' },
    { key: 'hepatic', label: 'Hepático & Ictericias', color: 'bg-amber-500' },
    { key: 'metabolic', label: 'Metabolismo & β-Oxidación', color: 'bg-indigo-500' },
    { key: 'renal', label: 'Renal, Urea & Purinas', color: 'bg-blue-500' },
    { key: 'pancreatic', label: 'Pancreático & Digestivo', color: 'bg-teal-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Rendimiento Académico & Historial Clínico</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Estadísticas Globales de Diagnóstico
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Métricas de precisión, gestión de guardias e historial de resoluciones de casos clínicos.
          </p>
        </div>

        {onResetProgress && (
          <button
            onClick={onResetProgress}
            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 transition-colors self-start md:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Progreso</span>
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Experiencia (XP)</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {userProgress.xp || userProgress.score || 0} XP
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Escalafón: <span className="font-bold text-slate-700">{rank.title}</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Precisión Global</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{accuracy}%</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {userProgress.casesCorrect} aciertos de {userProgress.casesAttempted} casos
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Racha Activa</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{userProgress.streak} 🔥</div>
          <p className="text-[11px] text-slate-400 mt-1">{streak.bonusText}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Insignias Ganadas</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {unlockedBadges.length} / {badges.length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {Math.round((unlockedBadges.length / badges.length) * 100)}% de maestría
          </p>
        </div>
      </div>

      {/* Systems Accuracy Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <span>Dominio por Sistemas y Especialidades Bioquímicas</span>
        </h2>

        <div className="space-y-3">
          {systems.map((sys) => {
            const data = userProgress.systemStats?.[sys.key] || { attempted: 0, correct: 0 };
            const sysAcc = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;

            return (
              <div key={sys.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800">{sys.label}</span>
                  <span className="text-slate-500 font-mono">
                    {sysAcc}% ({data.correct}/{data.attempted} casos)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${sys.color} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${sysAcc}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Galería de Acreditaciones e Insignias Médicas</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all ${
                badge.isUnlocked
                  ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 opacity-60 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    badge.isUnlocked
                      ? 'bg-amber-400 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs leading-tight">{badge.title}</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {badge.isUnlocked ? '✓ Desbloqueada' : 'Bloqueada'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                {badge.description}
              </p>

              <div className="text-[10px] text-slate-400 border-t border-slate-200/50 pt-2 font-mono">
                {badge.requirementDescription}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cronología de Hitos & Conquistas (Milestone Timeline) */}
      <MilestoneTimeline userProgress={userProgress} />

      {/* Case Resolution History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Historial Reciente de Resoluciones en Guardia</span>
        </h2>

        {userProgress.history && userProgress.history.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {userProgress.history.map((record, index) => (
              <div key={index} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{record.caseTitle}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="capitalize">{record.system}</span>
                    <span>•</span>
                    <span>Biomarcador: {record.selectedBiomarkerName}</span>
                    <span>•</span>
                    <span>{new Date(record.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      record.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {record.isCorrect ? 'Correcto' : 'Error'}
                  </span>
                  <span className="font-mono font-bold text-slate-700">
                    +{record.scoreEarned} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-4 text-center">
            Aún no has resuelto casos en la guardia hospitalaria. ¡Comienza en el simulador!
          </p>
        )}
      </div>
    </div>
  );
};
