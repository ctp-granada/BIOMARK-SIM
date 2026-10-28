import React, { useState, useMemo } from 'react';
import { UserProgress, OrganSystem } from '../../types';
import { evaluateUserBadges } from '../../data/badges';
import { getPlayerRank, getStreakMultiplier } from '../../utils/gamification';
import { MilestoneTimeline } from './MilestoneTimeline';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
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
  BookOpen,
  Star,
  TrendingUp,
  Zap,
  HelpCircle
} from 'lucide-react';

interface UserStatsViewProps {
  userProgress: UserProgress;
  onResetProgress?: () => void;
  onOpenSatisfactionSurvey?: () => void;
  onOpenSatisfactionMetrics?: () => void;
}

export const UserStatsView: React.FC<UserStatsViewProps> = ({
  userProgress,
  onResetProgress,
  onOpenSatisfactionSurvey,
  onOpenSatisfactionMetrics
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

  const [chartViewMode, setChartViewMode] = useState<'cumulative' | 'delta'>('cumulative');

  // Compute chronologically sorted chart data from userProgress history
  const chartData = useMemo(() => {
    const history = userProgress.history || [];
    if (history.length === 0) return [];

    const sorted = [...history].sort((a, b) => {
      const tA = new Date(a.timestamp).getTime() || 0;
      const tB = new Date(b.timestamp).getTime() || 0;
      return tA - tB;
    });

    let runningTotal = 0;
    const points = [
      {
        index: 0,
        caseNumber: 'Inicio',
        cumulativeXP: 0,
        scoreEarned: 0,
        caseTitle: 'Punto de partida',
        isCorrect: true,
        system: 'Línea base',
        dateFormatted: 'Día 1',
        biomarker: '-'
      }
    ];

    sorted.forEach((item, idx) => {
      runningTotal += (item.scoreEarned || 0);
      const dateObj = new Date(item.timestamp);
      const isValid = !isNaN(dateObj.getTime());
      const dateFormatted = isValid
        ? `${dateObj.getDate()} ${dateObj.toLocaleDateString('es-ES', { month: 'short' })}`
        : `Caso #${idx + 1}`;
      const timeFormatted = isValid
        ? dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        : '';

      points.push({
        index: idx + 1,
        caseNumber: `#${idx + 1}`,
        cumulativeXP: runningTotal,
        scoreEarned: item.scoreEarned || 0,
        caseTitle: item.caseTitle || `Caso Clínico #${idx + 1}`,
        isCorrect: item.isCorrect,
        system: item.system,
        dateFormatted: `${dateFormatted}${timeFormatted ? ' ' + timeFormatted : ''}`,
        biomarker: item.selectedBiomarkerName || ''
      });
    });

    return points;
  }, [userProgress.history]);

  // Summary metrics for the score history
  const historyStats = useMemo(() => {
    const history = userProgress.history || [];
    const count = history.length;
    const correctCount = history.filter((h) => h.isCorrect).length;
    const totalEarned = history.reduce((sum, h) => sum + (h.scoreEarned || 0), 0);
    const avgEarned = count > 0 ? Math.round(totalEarned / count) : 0;
    const maxEarned = count > 0 ? Math.max(...history.map((h) => h.scoreEarned || 0)) : 0;
    const accuracyPct = count > 0 ? Math.round((correctCount / count) * 100) : 0;

    return {
      count,
      correctCount,
      totalEarned,
      avgEarned,
      maxEarned,
      accuracyPct
    };
  }, [userProgress.history]);

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
          <div className="flex items-center gap-2 mt-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Sincronizado con Firebase Firestore (Progreso y Encuestas)
            </span>
          </div>
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

      {/* Student Satisfaction Survey Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/15 border border-amber-300/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-700 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
            <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                Calidad Docente & Acreditación UGR
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Gana +150 XP y +100 €
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Evaluación de Satisfacción del Alumnado con la Plataforma
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              Tu opinión como estudiante de Medicina es fundamental para evaluar el impacto formativo de los casos clínicos, la gamificación y los simuladores de la asignatura.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          {onOpenSatisfactionSurvey && (
            <button
              onClick={onOpenSatisfactionSurvey}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
            >
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>Evaluar Plataforma</span>
            </button>
          )}

          {onOpenSatisfactionMetrics && (
            <button
              onClick={onOpenSatisfactionMetrics}
              className="w-full md:w-auto px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              title="Ver informe de resultados docentes agregados"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
              <span>Ver Métricas</span>
            </button>
          )}
        </div>
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

      {/* Evolución de Puntuación (Score Evolution Line Chart con recharts) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Analítica del Desempeño Clínico</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              Evolución Temporal del Rendimiento & Puntuación
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curva de aprendizaje del alumno y trayectoria de puntos de experiencia (XP) a lo largo del tiempo.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => setChartViewMode('cumulative')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartViewMode === 'cumulative'
                  ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              XP Acumulado
            </button>
            <button
              onClick={() => setChartViewMode('delta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartViewMode === 'delta'
                  ? 'bg-white text-emerald-700 shadow-xs border border-emerald-100'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              XP por Caso
            </button>
          </div>
        </div>

        {/* Quick Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">XP Total en Casos</span>
            <div className="text-base font-black text-indigo-600 font-mono">
              {historyStats.totalEarned} XP
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Casos en Historial</span>
            <div className="text-base font-black text-slate-800 font-mono">
              {historyStats.count}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Media por Intento</span>
            <div className="text-base font-black text-emerald-600 font-mono">
              +{historyStats.avgEarned} XP
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Récord en un Caso</span>
            <div className="text-base font-black text-amber-600 font-mono">
              +{historyStats.maxEarned} XP
            </div>
          </div>
        </div>

        {/* Line Chart or Empty State */}
        {chartData.length > 1 ? (
          <div className="space-y-3">
            <div className="w-full h-72 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 12, right: 20, left: -10, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="caseNumber"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    unit=" XP"
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const data = payload[0]?.payload;
                      if (!data) return null;

                      return (
                        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-700/80 text-xs max-w-xs space-y-2 pointer-events-none z-50">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <span className="font-extrabold text-indigo-300 truncate max-w-[190px]" title={data.caseTitle}>
                              {data.caseNumber === 'Inicio' ? 'Punto de Partida' : `${data.caseNumber}: ${data.caseTitle}`}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                              {data.dateFormatted}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px]">
                            {data.system && data.system !== 'Línea base' && (
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Especialidad:</span>
                                <span className="capitalize text-slate-200 font-medium">{data.system}</span>
                              </div>
                            )}
                            {data.biomarker && data.biomarker !== '-' && (
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Biomarcador:</span>
                                <span className="text-slate-200 font-mono text-[10px]">{data.biomarker}</span>
                              </div>
                            )}
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-slate-400">Resultado:</span>
                              <span
                                className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                                  data.isCorrect
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800/80'
                                }`}
                              >
                                {data.caseNumber === 'Inicio'
                                  ? 'Línea Base'
                                  : data.isCorrect
                                  ? `✓ Acierto (+${data.scoreEarned} XP)`
                                  : '✗ Fallo (+0 XP)'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between font-bold text-xs pt-1.5 border-t border-slate-800 text-amber-300">
                              <span>Puntuación Acumulada:</span>
                              <span className="font-mono text-sm">{data.cumulativeXP} XP</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  {chartViewMode === 'delta' && historyStats.avgEarned > 0 && (
                    <ReferenceLine
                      y={historyStats.avgEarned}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      label={{
                        value: `Media: ${historyStats.avgEarned} XP`,
                        fill: '#d97706',
                        fontSize: 10,
                        position: 'insideTopRight'
                      }}
                    />
                  )}
                  {chartViewMode === 'cumulative' ? (
                    <Line
                      type="monotone"
                      dataKey="cumulativeXP"
                      name="XP Acumulado"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: '#4f46e5', strokeWidth: 2, fill: '#ffffff' }}
                      activeDot={{ r: 6, stroke: '#312e81', strokeWidth: 2, fill: '#4f46e5' }}
                    />
                  ) : (
                    <Line
                      type="monotone"
                      dataKey="scoreEarned"
                      name="XP Ganado en Caso"
                      stroke="#059669"
                      strokeWidth={2.5}
                      dot={{ r: 4, stroke: '#059669', strokeWidth: 2, fill: '#ffffff' }}
                      activeDot={{ r: 6, stroke: '#064e3b', strokeWidth: 2, fill: '#059669' }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                <span>
                  {chartViewMode === 'cumulative'
                    ? 'Progresión acumulada hacia escalafones superiores'
                    : 'Puntos obtenidos por resolución diagnóstica'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Tasa de aciertos: <span className="font-bold text-slate-700">{historyStats.accuracyPct}%</span> ({historyStats.correctCount}/{historyStats.count} casos resueltos)
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 rounded-xl border border-dashed border-slate-200 p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="max-w-md">
              <h4 className="text-sm font-bold text-slate-800">
                Curva de evolución en espera de tus primeras resoluciones
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                A medida que resuelvas casos clínicos en el simulador de urgencias o en las especialidades, el gráfico trazará en tiempo real la progresión cronológica de tu puntuación XP y efectividad diagnóstica.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/70 text-indigo-800 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Puntuación actual en plataforma: {userProgress.xp || userProgress.score || 0} XP</span>
            </div>
          </div>
        )}
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
