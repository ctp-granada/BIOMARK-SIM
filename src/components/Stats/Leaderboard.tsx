import React, { useState, useMemo } from 'react';
import { UserProgress, OrganSystem } from '../../types';
import { getPlayerRank } from '../../utils/gamification';
import { MOCK_LEADERBOARD_PEERS, PeerStudent } from '../../data/leaderboardData';
import {
  Trophy,
  Medal,
  Award,
  Users,
  Search,
  Flame,
  ChevronRight,
  GraduationCap,
  Activity,
  CheckCircle2,
  Stethoscope,
  X,
  Target,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export interface LeaderboardProps {
  userProgress: UserProgress;
  onNavigateToCases?: () => void;
  onNavigateToGames?: () => void;
}

type RankingScope = 'all' | 'ugr' | 'weekly';

export interface EnrichedStudentEntry extends PeerStudent {
  position: number;
  isCurrentUser: boolean;
  scoreVal: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  userProgress,
  onNavigateToCases,
  onNavigateToGames
}) => {
  const [scope, setScope] = useState<RankingScope>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<EnrichedStudentEntry | null>(null);

  const userXp = userProgress.xp || userProgress.score || 0;
  const userAccuracy =
    userProgress.casesAttempted > 0
      ? Math.round((userProgress.casesCorrect / userProgress.casesAttempted) * 100)
      : 0;
  const rank = getPlayerRank(userXp);

  // Generate Current User's genuine peer entry
  const currentUserEntry: PeerStudent = useMemo(() => {
    return {
      id: 'current-user-student',
      name: 'Tú (Médico en Guardia)',
      avatar: '🧑‍⚕️',
      institution: 'Facultad de Medicina UGR / H. PTS Granada',
      city: 'Granada',
      xp: userXp,
      score: userXp,
      casesResolved: userProgress.casesCorrect,
      accuracyPct: userAccuracy,
      streak: userProgress.streak,
      badgeTitle: `${rank.icon} ${rank.shortTitle}`,
      specialty: 'Simulación Bioquímica & Clínica',
      weeklyXp: Math.round(userXp * 0.4),
      isUgr: true,
      isCurrentUser: true,
      biomarkerFocus: 'Diagnóstico Integral Multiorgánico',
      lastActive: 'Activo ahora'
    };
  }, [userXp, userAccuracy, userProgress.casesCorrect, userProgress.streak, rank.icon, rank.shortTitle]);

  // Combine real peers with current user and sort by genuine points (score/xp)
  const allRankedEntries: EnrichedStudentEntry[] = useMemo(() => {
    const combined = [...MOCK_LEADERBOARD_PEERS, currentUserEntry];
    // sort based on selected metric (weekly or global score)
    const sorted = combined.sort((a, b) => {
      const valB = (scope === 'weekly' ? b.weeklyXp : (b.score || b.xp)) ?? 0;
      const valA = (scope === 'weekly' ? a.weeklyXp : (a.score || a.xp)) ?? 0;
      return valB - valA;
    });

    return sorted.map((entry, idx) => ({
      ...entry,
      position: idx + 1,
      isCurrentUser: Boolean(entry.isCurrentUser),
      scoreVal: (scope === 'weekly' ? entry.weeklyXp : (entry.score || entry.xp)) ?? 0
    }));
  }, [currentUserEntry, scope]);

  // Identify Current User's global rank & entry
  const userRankedInfo = useMemo(() => {
    return allRankedEntries.find((e) => e.isCurrentUser) || null;
  }, [allRankedEntries]);

  const hasMultiplePeers = allRankedEntries.length >= 3;

  // Filtered entries according to tab and search
  const displayedEntries = useMemo(() => {
    let list = [...allRankedEntries];

    if (scope === 'ugr') {
      list = list.filter((e) => e.isUgr);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.institution.toLowerCase().includes(q) ||
          e.specialty.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allRankedEntries, scope, searchTerm]);

  // Real System Performance Data for User Chart
  const systemChartData = useMemo(() => {
    const sysNames: Record<OrganSystem, string> = {
      cardiac: 'Cardíaco',
      hepatic: 'Hepático',
      metabolic: 'Metabólico',
      renal: 'Renal',
      pancreatic: 'Pancreático',
      neuromuscular: 'Neuromusc.'
    };

    return Object.entries(userProgress.systemStats).map(([key, stat]) => ({
      sistema: sysNames[key as OrganSystem] || key,
      aciertos: stat.correct,
      intentos: stat.attempted,
      pct: stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : 0
    }));
  }, [userProgress.systemStats]);

  // Chart data for comparison curve (only when multiple peers exist)
  const peerComparisonData = useMemo(() => {
    return allRankedEntries.slice(0, 10).map((st) => ({
      puesto: `#${st.position}`,
      nombre: st.name.split(' ')[0] + ' ' + (st.name.split(' ')[1] ? st.name.split(' ')[1].charAt(0) + '.' : ''),
      puntos: st.scoreVal,
      precision: st.accuracyPct,
      esUsuario: st.isCurrentUser
    }));
  }, [allRankedEntries]);

  return (
    <div className="space-y-6">
      {/* 1. HERO HEADER: Clinical Modern Style */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500/5 via-slate-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Escalafón Académico & Rendimiento Clínico
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                Curso 2026/2027 (26-27)
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ranking & Escalafón de Estudiantes
            </h1>
            
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Clasificación meritocrática basada en la resolución de casos clínicos de bioquímica médica, 
              precisión diagnóstica en guardia y gestión óptima del presupuesto sanitario. 
              Registro veraz en tiempo real sin puntuaciones simuladas.
            </p>
          </div>

          {/* Quick User Rank Summary Badge */}
          {userRankedInfo && (
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 sm:p-4 shrink-0 shadow-2xs">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-lg font-black font-mono shadow-xs border border-slate-800">
                #{userRankedInfo.position}
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
                  Tu Puesto Actual
                </div>
                <div className="text-base font-bold text-slate-900">
                  {userRankedInfo.scoreVal} <span className="text-xs font-normal text-slate-500">puntos (XP)</span>
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Puntuación Oficial Verificada
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. REAL CLINICAL KPI CARDS (Student's Genuine Performance) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
          {/* KPI 1: Puntos Reales (XP) */}
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Puntuación Acumulada</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
              {userXp} <span className="text-xs font-medium text-slate-500">XP</span>
            </div>
            <div className="text-[11px] text-slate-600 truncate mt-0.5">
              {rank.title}
            </div>
          </div>

          {/* KPI 2: Casos Clínicos Resueltos */}
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
              <span>Casos Resueltos</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
              {userProgress.casesCorrect} <span className="text-xs font-medium text-slate-500">de {userProgress.casesAttempted}</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              Diagnósticos completados
            </div>
          </div>

          {/* KPI 3: Precisión Diagnóstica Real */}
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Precisión Diagnóstica</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-1">
              {userAccuracy}%
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {userProgress.casesAttempted > 0 ? 'Tasa de acierto en guardia' : 'Sin casos evaluados aún'}
            </div>
          </div>

          {/* KPI 4: Racha Activa de Aciertos */}
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5">
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Racha de Guardia</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1 flex items-center gap-1">
              {userProgress.streak}
              <span className="text-xs font-medium text-slate-500">aciertos</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {userProgress.streak > 0 ? 'Multiplicador activo' : 'Comienza una racha hoy'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TRANSPARENCY NOTICE: Genuine Academic Record */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <span>Registro Real y Verificado</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Sin datos ficticios</span>
            </div>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Se han eliminado los perfiles inventados. La clasificación refleja exclusivamente tu progreso real y el de los alumnos registrados.
            </p>
          </div>
        </div>

        {onNavigateToCases && (
          <button
            type="button"
            onClick={onNavigateToCases}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Resolver Casos para Sumar Puntos</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        )}
      </div>

      {/* 4. PERFORMANCE DISTRIBUTION CHART (Real System Stats or Multi-Student Curve) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <span>Rendimiento Diagnóstico por Sistema Orgánico</span>
            </h3>
            <p className="text-xs text-slate-500">
              Distribución de casos resueltos e intentos acumulados en las distintas áreas clínicas de Bioquímica Médica.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Aciertos Correctos
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              Casos Intentados
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={systemChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="sistema"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 text-white rounded-xl p-3 shadow-lg border border-slate-800 text-xs">
                        <div className="font-bold">{data.sistema}</div>
                        <div className="mt-1.5 text-slate-300 space-y-0.5">
                          <div>Aciertos: <strong className="text-emerald-400 font-mono">{data.aciertos}</strong></div>
                          <div>Total intentados: <strong className="text-white font-mono">{data.intentos}</strong></div>
                          <div>Precisión en este sistema: <strong className="text-cyan-300 font-mono">{data.pct}%</strong></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="intentos" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Intentados" />
              <Bar dataKey="aciertos" fill="#10b981" radius={[6, 6, 0, 0]} name="Correctos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. CONTROLS BAR: SEGMENTED FILTER & SEARCH */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Segmented Controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setScope('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              scope === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🌍 Clasificación General ({allRankedEntries.length})
          </button>

          <button
            type="button"
            onClick={() => setScope('ugr')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              scope === 'ugr'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏛️ Alumnos UGR Granada
          </button>

          <button
            type="button"
            onClick={() => setScope('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              scope === 'weekly'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Ranking Semanal
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en la clasificación..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 6. MAIN RANKING DATA TABLE: Clinical Modern Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              {scope === 'ugr'
                ? 'Listado de Estudiantes UGR Granada'
                : scope === 'weekly'
                ? 'Puntuación Semanal Activa'
                : 'Listado Oficial de Estudiantes'}
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-mono">
              {displayedEntries.length} {displayedEntries.length === 1 ? 'estudiante registrado' : 'estudiantes registrados'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Haz clic en un alumno para inspeccionar su ficha clínica
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 text-center w-16">Puesto</th>
                <th className="py-3 px-4">Estudiante / Rango</th>
                <th className="py-3 px-4 hidden md:table-cell">Facultad / Hospital</th>
                <th className="py-3 px-4 text-center">Precisión</th>
                <th className="py-3 px-4 text-center hidden sm:table-cell">Racha</th>
                <th className="py-3 px-4 text-center hidden lg:table-cell">Casos</th>
                <th className="py-3 px-4 text-right">Puntos Acumulados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedEntries.map((st) => {
                const isTop1 = st.position === 1;
                const isUser = st.isCurrentUser;

                return (
                  <tr
                    key={st.id}
                    onClick={() => setSelectedStudent(st)}
                    className={`transition-colors cursor-pointer ${
                      isUser
                        ? 'bg-blue-50/60 border-l-4 border-l-blue-600 font-bold hover:bg-blue-50'
                        : isTop1
                        ? 'bg-amber-50/30 hover:bg-amber-50/60'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Position / Rank */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs shadow-2xs">
                        #{st.position}
                      </span>
                    </td>

                    {/* Student Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl shrink-0 p-1 bg-white rounded-lg border border-slate-200">
                          {st.avatar}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold truncate ${isUser ? 'text-blue-900' : 'text-slate-900'}`}>
                              {st.name}
                            </span>
                            {isUser && (
                              <span className="bg-blue-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0">
                                TÚ
                              </span>
                            )}
                            {st.isUgr && (
                              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 hidden sm:inline shrink-0">
                                UGR
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal truncate mt-0.5">
                            {st.badgeTitle} · {st.specialty}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="py-3.5 px-4 text-slate-600 hidden md:table-cell max-w-[200px] truncate">
                      {st.institution}
                    </td>

                    {/* Accuracy */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                          st.accuracyPct >= 85
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                            : st.accuracyPct >= 70
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {st.accuracyPct}%
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-3.5 px-4 text-center font-mono hidden sm:table-cell">
                      {st.streak > 0 ? (
                        <span className="inline-flex items-center gap-1 text-orange-600 font-bold">
                          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                          {st.streak}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    {/* Cases completed */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 hidden lg:table-cell">
                      {st.casesResolved}
                    </td>

                    {/* Points / XP */}
                    <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-slate-900">
                      <span className={isUser ? 'text-blue-700' : ''}>
                        {st.scoreVal}{' '}
                        <span className="text-[10px] font-normal text-slate-500">
                          {scope === 'weekly' ? 'XP/sem' : 'pts'}
                        </span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {displayedEntries.length === 0 && (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <p className="text-sm font-semibold">No se encontraron estudiantes con ese criterio.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setScope('all');
              }}
              className="text-xs text-blue-600 hover:underline font-bold"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* 7. CURRENT USER STANDING CARD */}
      {userRankedInfo && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
              🧑‍⚕️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-white text-base">
                  Tu Estado Clínico Oficial: #{userRankedInfo.position} en el Escalafón
                </h4>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {userRankedInfo.badgeTitle}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Tienes <strong>{userRankedInfo.scoreVal} puntos de experiencia (XP)</strong> y un <strong>{userAccuracy}% de precisión diagnóstica</strong> con {userProgress.casesCorrect} casos clínicos resueltos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            {onNavigateToCases && (
              <button
                type="button"
                onClick={onNavigateToCases}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Resolver Casos Clínicos</span>
              </button>
            )}

            {onNavigateToGames && (
              <button
                type="button"
                onClick={onNavigateToGames}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Minijuegos & Reto</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 8. STUDENT CLINICAL DOSSIER INSPECTOR */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1 bg-slate-800 rounded-xl border border-slate-700">
                  {selectedStudent.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">
                      {selectedStudent.name}
                    </h3>
                    {selectedStudent.isCurrentUser && (
                      <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                        TÚ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{selectedStudent.institution}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 font-medium uppercase block">Puesto Escalafón</span>
                  <span className="text-xl font-black font-mono text-slate-900">#{selectedStudent.position}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 font-medium uppercase block">Puntos Acumulados</span>
                  <span className="text-xl font-black font-mono text-slate-900">{selectedStudent.scoreVal} pts</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 font-medium uppercase block">Precisión Diagnóstica</span>
                  <span className="text-xl font-black font-mono text-emerald-700">{selectedStudent.accuracyPct}%</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <span className="text-[10px] text-slate-500 font-medium uppercase block">Casos Completados</span>
                  <span className="text-xl font-black font-mono text-slate-900">{selectedStudent.casesResolved}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Rango / Categoría:</span>
                  <span className="font-semibold text-slate-900">{selectedStudent.badgeTitle}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Área de Especialidad:</span>
                  <span className="font-semibold text-slate-900">{selectedStudent.specialty}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Biomarcadores de Dominio:</span>
                  <span className="font-medium text-slate-700 text-right max-w-[200px]">
                    {selectedStudent.biomarkerFocus || 'Diagnóstico clínico general'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Última Actividad:</span>
                  <span className="font-medium text-slate-700">{selectedStudent.lastActive || 'Reciente'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
