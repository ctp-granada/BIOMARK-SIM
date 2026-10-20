import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Users,
  Search,
  Flame,
  CheckCircle2,
  Stethoscope,
  Filter,
  Download,
  Edit3,
  Sparkles,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Clock,
  ShieldCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import {
  subscribeStudentRankings,
  StudentRankingRecord,
  getOrCreateStudentProfile,
  updateStudentProfile,
  saveStudentRankingToCloud
} from '../../lib/firebase';
import { UserProgress } from '../../types';

interface StudentRankingTableProps {
  userProgress: UserProgress;
  onNavigateToCases?: () => void;
  onNavigateToGames?: () => void;
}

type SortField = 'score' | 'casesSolved' | 'accuracy' | 'streak';

export const StudentRankingTable: React.FC<StudentRankingTableProps> = ({
  userProgress,
  onNavigateToCases
}) => {
  const [rankings, setRankings] = useState<StudentRankingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubgroup, setSelectedSubgroup] = useState<string>('todos');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  
  // Profile edit modal
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profile, setProfile] = useState(() => getOrCreateStudentProfile());
  const [editName, setEditName] = useState(profile.name);
  const [editSubgroup, setEditSubgroup] = useState(profile.subgroup);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Subscribe to real-time rankings from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeStudentRankings((records) => {
      setRankings(records);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Guarantee current user's entry is synced if they have solved/attempted cases
  useEffect(() => {
    if (userProgress.casesAttempted > 0 || userProgress.casesCorrect > 0) {
      const currentProfile = getOrCreateStudentProfile();
      const userAccuracy =
        userProgress.casesAttempted > 0
          ? Math.round((userProgress.casesCorrect / userProgress.casesAttempted) * 100)
          : 0;

      const userRecord: StudentRankingRecord = {
        studentId: currentProfile.studentId,
        name: currentProfile.name,
        subgroup: currentProfile.subgroup,
        score: userProgress.score,
        xp: userProgress.xp || userProgress.score,
        casesSolved: userProgress.casesCorrect,
        casesAttempted: userProgress.casesAttempted,
        accuracy: userAccuracy,
        streak: userProgress.streak,
        budget: userProgress.budget,
        badgesCount: userProgress.unlockedBadges?.length || 0,
        lastSolvedAt: new Date().toISOString()
      };

      saveStudentRankingToCloud(userRecord);
    }
  }, [
    userProgress.casesAttempted,
    userProgress.casesCorrect,
    userProgress.score,
    userProgress.xp,
    userProgress.streak,
    userProgress.budget,
    userProgress.unlockedBadges
  ]);

  // Handle saving customized name/subgroup
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;

    const updated = updateStudentProfile({
      name: editName.trim(),
      subgroup: editSubgroup
    });
    setProfile(updated);

    // Sync updated name to ranking in Firestore
    if (userProgress.casesAttempted > 0 || userProgress.casesCorrect > 0) {
      const userAccuracy =
        userProgress.casesAttempted > 0
          ? Math.round((userProgress.casesCorrect / userProgress.casesAttempted) * 100)
          : 0;

      saveStudentRankingToCloud({
        studentId: updated.studentId,
        name: updated.name,
        subgroup: updated.subgroup,
        score: userProgress.score,
        xp: userProgress.xp || userProgress.score,
        casesSolved: userProgress.casesCorrect,
        casesAttempted: userProgress.casesAttempted,
        accuracy: userAccuracy,
        streak: userProgress.streak,
        budget: userProgress.budget,
        badgesCount: userProgress.unlockedBadges?.length || 0,
        lastSolvedAt: new Date().toISOString()
      });
    }

    setIsEditingProfile(false);
    setSaveToast('¡Perfil y alias del ranking actualizados con éxito!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Subgroups available for filter
  const subgroupOptions = useMemo(() => {
    const list = Array.from(new Set(rankings.map((r) => r.subgroup || 'General'))).filter(Boolean);
    return ['todos', ...list];
  }, [rankings]);

  // Filtered and sorted students
  const filteredAndSortedRankings = useMemo(() => {
    let list = [...rankings];

    // Filter by search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (st) =>
          st.name.toLowerCase().includes(q) ||
          (st.subgroup && st.subgroup.toLowerCase().includes(q)) ||
          (st.lastCaseTitle && st.lastCaseTitle.toLowerCase().includes(q))
      );
    }

    // Filter by subgroup
    if (selectedSubgroup !== 'todos') {
      list = list.filter((st) => (st.subgroup || 'General') === selectedSubgroup);
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[sortField] ?? 0;
      let valB = b[sortField] ?? 0;
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return list;
  }, [rankings, searchTerm, selectedSubgroup, sortField, sortAsc]);

  // Summary Metrics
  const statsSummary = useMemo(() => {
    const totalStudents = rankings.length;
    const totalSolvedCases = rankings.reduce((acc, r) => acc + (r.casesSolved || 0), 0);
    const avgScore = totalStudents > 0 ? Math.round(rankings.reduce((acc, r) => acc + (r.score || 0), 0) / totalStudents) : 0;
    const topScore = rankings.length > 0 ? Math.max(...rankings.map((r) => r.score || 0)) : 0;

    return { totalStudents, totalSolvedCases, avgScore, topScore };
  }, [rankings]);

  // Export ranking as CSV
  const handleExportCSV = () => {
    const headers = [
      'Puesto',
      'ID_Alumno',
      'Nombre_Alumno',
      'Subgrupo',
      'Puntuacion_Total',
      'Puntos_XP',
      'Casos_Resueltos',
      'Casos_Intentados',
      'Precision_Porcentaje',
      'Racha_Aciertos',
      'Presupuesto_Final',
      'Ultimo_Caso',
      'Fecha_Ultima_Resolucion'
    ];

    const rows = filteredAndSortedRankings.map((st, idx) => [
      idx + 1,
      `"${st.studentId}"`,
      `"${st.name.replace(/"/g, '""')}"`,
      `"${(st.subgroup || 'General').replace(/"/g, '""')}"`,
      st.score,
      st.xp,
      st.casesSolved,
      st.casesAttempted,
      `${st.accuracy}%`,
      st.streak,
      `${st.budget || 5000} €`,
      `"${(st.lastCaseTitle || '').replace(/"/g, '""')}"`,
      `"${st.lastSolvedAt || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ranking_alumnos_casos_ugr_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSaveToast('Ranking descargado en CSV para la memoria docente.');
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleToggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const currentRankPosition = useMemo(() => {
    const idx = rankings.findIndex((r) => r.studentId === profile.studentId);
    return idx >= 0 ? idx + 1 : null;
  }, [rankings, profile.studentId]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-50/40 rounded-3xl border border-amber-200/80 p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-600 text-white flex items-center gap-1.5 shadow-2xs">
                <Trophy className="w-3.5 h-3.5 text-amber-200" />
                Escalafón Clínico Oficial
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-900 bg-emerald-100/70 border border-emerald-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Firestore en Vivo</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200">
                Curso 2026/2027
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Ranking de Alumnos · Casos Clínicos Resueltos
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Listado en tiempo real de todos los estudiantes de Medicina que han resuelto casos clínicos en el Hospital. Las puntuaciones, diagnósticos acertados y rachas se actualizan automáticamente en Firebase Firestore.
            </p>
          </div>

          {/* User profile capsule & action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <div className="bg-white border border-amber-300/80 rounded-2xl p-3 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-base border border-amber-300">
                👨‍⚕️
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900 truncate max-w-[140px] sm:max-w-[180px]">
                    {profile.name}
                  </span>
                  <button
                    onClick={() => {
                      setEditName(profile.name);
                      setEditSubgroup(profile.subgroup);
                      setIsEditingProfile(true);
                    }}
                    className="p-1 text-slate-400 hover:text-amber-700 transition-colors cursor-pointer"
                    title="Editar mi nombre o subgrupo"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span>{profile.subgroup}</span>
                  {currentRankPosition && (
                    <>
                      <span>•</span>
                      <span className="font-extrabold text-amber-700">Puesto #{currentRankPosition}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={rankings.length === 0}
              className="px-3.5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Descargar ranking de estudiantes en archivo CSV"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-amber-200/60">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Alumnos con Casos
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{statsSummary.totalStudents}</span>
              <span className="text-xs font-semibold text-slate-500">estudiantes</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Casos Resueltos Totales
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-700">{statsSummary.totalSolvedCases}</span>
              <span className="text-xs font-semibold text-emerald-600">aciertos</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Puntuación Media
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-700">{statsSummary.avgScore}</span>
              <span className="text-xs font-semibold text-amber-600">pts</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Puntuación Máxima
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-purple-700">{statsSummary.topScore}</span>
              <span className="text-xs font-semibold text-purple-600">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards (when at least 1 student has solved cases) */}
      {rankings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1st Place */}
          {rankings[0] && (
            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-2 border-amber-400 rounded-3xl p-5 shadow-sm relative overflow-hidden order-1 sm:order-2">
              <div className="absolute top-3 right-3 text-2xl font-black text-amber-500/40">#1</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-300">
                  🥇
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full inline-block mb-0.5">
                    Líder del Escalafón
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm truncate max-w-[160px]">
                    {rankings[0].name}
                    {rankings[0].studentId === profile.studentId && (
                      <span className="text-[10px] ml-1 bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">Tú</span>
                    )}
                  </h3>
                  <span className="text-[11px] text-slate-500">{rankings[0].subgroup || 'Subgrupo General'}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-amber-200">
                <span className="text-xs text-slate-600 font-semibold">Puntuación:</span>
                <span className="text-xl font-black text-amber-700">{rankings[0].score.toLocaleString('es-ES')} pts</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span>Casos superados:</span>
                <span className="font-bold text-slate-900">{rankings[0].casesSolved}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span>Precisión diagnóstica:</span>
                <span className="font-bold text-emerald-700">{rankings[0].accuracy}%</span>
              </div>
            </div>
          )}

          {/* 2nd Place */}
          {rankings[1] && (
            <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-300 rounded-3xl p-5 shadow-2xs relative overflow-hidden order-2 sm:order-1">
              <div className="absolute top-3 right-3 text-2xl font-black text-slate-400/40">#2</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-300 text-slate-800 flex items-center justify-center font-black text-lg shadow-xs border border-slate-400">
                  🥈
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full inline-block mb-0.5">
                    Segundo Puesto
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm truncate max-w-[160px]">
                    {rankings[1].name}
                    {rankings[1].studentId === profile.studentId && (
                      <span className="text-[10px] ml-1 bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">Tú</span>
                    )}
                  </h3>
                  <span className="text-[11px] text-slate-500">{rankings[1].subgroup || 'Subgrupo General'}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-600 font-semibold">Puntuación:</span>
                <span className="text-xl font-black text-slate-800">{rankings[1].score.toLocaleString('es-ES')} pts</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span>Casos superados:</span>
                <span className="font-bold text-slate-900">{rankings[1].casesSolved}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span>Precisión diagnóstica:</span>
                <span className="font-bold text-emerald-700">{rankings[1].accuracy}%</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {rankings[2] && (
            <div className="bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 border border-amber-300 rounded-3xl p-5 shadow-2xs relative overflow-hidden order-3">
              <div className="absolute top-3 right-3 text-2xl font-black text-amber-600/30">#3</div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-700 text-amber-100 flex items-center justify-center font-black text-lg shadow-xs border border-amber-600">
                  🥉
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full inline-block mb-0.5">
                    Tercer Puesto
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-sm truncate max-w-[160px]">
                    {rankings[2].name}
                    {rankings[2].studentId === profile.studentId && (
                      <span className="text-[10px] ml-1 bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">Tú</span>
                    )}
                  </h3>
                  <span className="text-[11px] text-slate-500">{rankings[2].subgroup || 'Subgrupo General'}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-amber-200">
                <span className="text-xs text-slate-600 font-semibold">Puntuación:</span>
                <span className="text-xl font-black text-amber-900">{rankings[2].score.toLocaleString('es-ES')} pts</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span>Casos superados:</span>
                <span className="font-bold text-slate-900">{rankings[2].casesSolved}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                <span>Precisión diagnóstica:</span>
                <span className="font-bold text-emerald-700">{rankings[2].accuracy}%</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre de alumno, subgrupo o caso clínico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-[11px]">Subgrupo:</span>
            <select
              value={selectedSubgroup}
              onChange={(e) => setSelectedSubgroup(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
            >
              {subgroupOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'todos' ? 'Todos los Subgrupos' : opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
            <p className="text-xs text-slate-500">Cargando ranking de estudiantes desde Firestore...</p>
          </div>
        ) : filteredAndSortedRankings.length === 0 ? (
          <div className="p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-inner text-2xl">
              🏥
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 mb-1">
                Aún no hay alumnos con casos resueltos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ningún estudiante ha diagnosticado casos clínicos todavía. Cuando los alumnos resuelvan pacientes en el Hospital, sus puntuaciones y puestos aparecerán aquí en directo.
              </p>
            </div>
            {onNavigateToCases && (
              <button
                onClick={onNavigateToCases}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Ir al Hospital a Resolver un Caso</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold text-[11px]">
                  <th className="p-3.5 text-center w-16">Puesto</th>
                  <th className="p-3.5">Estudiante</th>
                  <th className="p-3.5 text-center">Subgrupo</th>
                  <th 
                    className="p-3.5 text-center cursor-pointer hover:bg-slate-200/60 transition-colors select-none"
                    onClick={() => handleToggleSort('score')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>Puntuación</span>
                      {sortField === 'score' && (sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th 
                    className="p-3.5 text-center cursor-pointer hover:bg-slate-200/60 transition-colors select-none"
                    onClick={() => handleToggleSort('casesSolved')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>Casos Superados</span>
                      {sortField === 'casesSolved' && (sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th 
                    className="p-3.5 text-center cursor-pointer hover:bg-slate-200/60 transition-colors select-none"
                    onClick={() => handleToggleSort('accuracy')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>Precisión</span>
                      {sortField === 'accuracy' && (sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th 
                    className="p-3.5 text-center cursor-pointer hover:bg-slate-200/60 transition-colors select-none"
                    onClick={() => handleToggleSort('streak')}
                  >
                    <div className="inline-flex items-center gap-1">
                      <span>Racha</span>
                      {sortField === 'streak' && (sortAsc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                    </div>
                  </th>
                  <th className="p-3.5">Último Caso Resuelto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredAndSortedRankings.map((st, idx) => {
                  const isCurrent = st.studentId === profile.studentId;
                  const pos = idx + 1;
                  return (
                    <tr
                      key={st.studentId}
                      className={`hover:bg-amber-50/40 transition-colors ${
                        isCurrent ? 'bg-amber-50/70 font-semibold' : ''
                      }`}
                    >
                      {/* Puesto */}
                      <td className="p-3.5 text-center font-black">
                        {pos === 1 && <span className="text-base" title="1º Puesto - Oro">🥇</span>}
                        {pos === 2 && <span className="text-base" title="2º Puesto - Plata">🥈</span>}
                        {pos === 3 && <span className="text-base" title="3º Puesto - Bronce">🥉</span>}
                        {pos > 3 && <span className="text-slate-500 font-mono text-xs">#{pos}</span>}
                      </td>

                      {/* Estudiante */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-sm shrink-0">
                            {pos === 1 ? '👑' : pos === 2 ? '🌟' : pos === 3 ? '⭐' : '🧑‍⚕️'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 text-xs">
                                {st.name}
                              </span>
                              {isCurrent && (
                                <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                                  Tú
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">
                              Facultad de Medicina UGR
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Subgrupo */}
                      <td className="p-3.5 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                          {st.subgroup || 'General'}
                        </span>
                      </td>

                      {/* Puntuación */}
                      <td className="p-3.5 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-black text-amber-700 text-sm">
                            {st.score.toLocaleString('es-ES')}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {st.xp || st.score} XP
                          </span>
                        </div>
                      </td>

                      {/* Casos Superados */}
                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{st.casesSolved}</span>
                          <span className="text-slate-400 text-[10px]">/ 31</span>
                        </div>
                      </td>

                      {/* Precisión Diagnóstica */}
                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black ${
                            st.accuracy >= 80
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : st.accuracy >= 60
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {st.accuracy}%
                        </span>
                      </td>

                      {/* Racha */}
                      <td className="p-3.5 text-center">
                        {st.streak > 0 ? (
                          <span className="inline-flex items-center gap-1 text-orange-600 font-black text-xs">
                            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600 animate-pulse" />
                            <span>{st.streak}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>

                      {/* Último Caso */}
                      <td className="p-3.5">
                        <div className="max-w-[200px] truncate text-slate-700 text-[11px] font-medium" title={st.lastCaseTitle || 'N/A'}>
                          {st.lastCaseTitle || 'Caso de urgencias'}
                        </div>
                        {st.lastSolvedAt && (
                          <span className="text-[9px] text-slate-400 block flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(st.lastSolvedAt).toLocaleDateString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile / Alias Customization Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Personalizar mi Perfil en el Ranking</h3>
                  <p className="text-[10px] text-slate-500">Tu nombre o alias aparecerá públicamente en el escalafón</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nombre o Alias del Estudiante
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ej: Francisco Ortuño, Lucía M."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Subgrupo de Prácticas
                </label>
                <select
                  value={editSubgroup}
                  onChange={(e) => setEditSubgroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs bg-white"
                >
                  <option value="Subgrupo 1">Subgrupo 1</option>
                  <option value="Subgrupo 2">Subgrupo 2</option>
                  <option value="Subgrupo 3">Subgrupo 3</option>
                  <option value="Subgrupo 4">Subgrupo 4</option>
                  <option value="Subgrupo 5">Subgrupo 5</option>
                  <option value="Subgrupo 6">Subgrupo 6</option>
                  <option value="Subgrupo 7">Subgrupo 7</option>
                  <option value="Subgrupo 8">Subgrupo 8</option>
                  <option value="Subgrupo 9">Subgrupo 9</option>
                  <option value="Subgrupo 10">Subgrupo 10</option>
                  <option value="Subgrupo 11">Subgrupo 11</option>
                  <option value="Subgrupo 12">Subgrupo 12</option>
                  <option value="Subgrupo 13">Subgrupo 13</option>
                  <option value="Subgrupo 14">Subgrupo 14</option>
                  <option value="Subgrupo 15">Subgrupo 15</option>
                  <option value="Subgrupo General">Subgrupo General</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
