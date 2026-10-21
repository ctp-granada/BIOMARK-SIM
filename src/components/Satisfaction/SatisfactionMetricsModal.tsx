import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Award,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  MessageSquare,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';
import {
  satisfactionService,
  SatisfactionMetrics,
  SatisfactionFeedback
} from '../../utils/satisfactionService';
import {
  fetchSatisfactionSurveysFromCloud,
  resetAllPlatformStatsAndSurveys
} from '../../lib/firebase';

interface SatisfactionMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSurvey?: () => void;
  visitorCount?: number;
}

export const SatisfactionMetricsModal: React.FC<SatisfactionMetricsModalProps> = ({
  isOpen,
  onClose,
  onOpenSurvey,
  visitorCount = 0
}) => {
  const [metrics, setMetrics] = useState<SatisfactionMetrics>(satisfactionService.getMetrics());
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoadingCloud(true);
    try {
      const cloudSurveys = await fetchSatisfactionSurveysFromCloud();
      if (cloudSurveys && cloudSurveys.length > 0) {
        // Calculate metrics with cloud surveys
        const total = cloudSurveys.length;
        const avgSus = Math.round((cloudSurveys.reduce((a, s) => a + (s.susScore || 0), 0) / total) * 10) / 10;
        let promoters = 0;
        let passives = 0;
        let detractors = 0;
        cloudSurveys.forEach((s) => {
          const nps = s.recommendationNps ?? 10;
          if (nps >= 9) promoters++;
          else if (nps >= 7) passives++;
          else detractors++;
        });
        const npsScore = Math.round(((promoters - detractors) / total) * 100);

        setMetrics({
          ...satisfactionService.getMetrics(),
          totalSurveys: total,
          averageSusScore: avgSus,
          npsScore
        });
      } else {
        setMetrics(satisfactionService.getMetrics());
      }
    } catch {
      setMetrics(satisfactionService.getMetrics());
    } finally {
      setLoadingCloud(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResetToZero = async () => {
    if (!window.confirm('¿Confirmas que deseas reiniciar todos los contadores de visitas y encuestas a cero?')) {
      return;
    }

    setIsResetting(true);
    setResetMessage(null);
    try {
      satisfactionService.clearAllSurveys();
      const res = await resetAllPlatformStatsAndSurveys();
      setResetMessage(res.message);
      setMetrics(satisfactionService.getMetrics());
    } catch (err: any) {
      setResetMessage('Error al resetear: ' + (err?.message || 'Error'));
    } finally {
      setIsResetting(false);
    }
  };

  const handleExportCSV = () => {
    const surveys = satisfactionService.getSurveys();
    const csvContent = satisfactionService.exportToCSV(surveys);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `encuestas_satisfaccion_ugr_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Panel Docente de Calidad (PID 26-158)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Visitas registradas: <strong>{visitorCount.toLocaleString('es-ES')}</strong></span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Métricas de Satisfacción y Rendimiento Docente
            </h2>
            <p className="text-xs text-slate-500">
              Datos cuantitativos en tiempo real recopilados directamente de los alumnos de Medicina (UGR).
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Reset Feedback Notification */}
        {resetMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            {resetMessage}
          </div>
        )}

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Surveys */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Encuestas</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {metrics.totalSurveys}
            </div>
            <span className="text-[10px] text-slate-400">Sin datos ficticios</span>
          </div>

          {/* Card 2: Average SUS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">SUS Score (Usabilidad)</span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
              {metrics.totalSurveys > 0 ? metrics.averageSusScore : '0'} <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {metrics.totalSurveys > 0 ? 'Escala estándar SUS' : 'Pendiente de datos'}
            </span>
          </div>

          {/* Card 3: NPS */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Net Promoter Score</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {metrics.totalSurveys > 0 ? `${metrics.npsScore > 0 ? '+' : ''}${metrics.npsScore}` : '0'}
            </div>
            <span className="text-[10px] text-slate-400">Fidelidad de alumnos</span>
          </div>

          {/* Card 4: Platform Visits */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Visitas a Plataforma</span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {visitorCount.toLocaleString('es-ES')}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sincronizado Firestore
            </span>
          </div>
        </div>

        {/* Indicators List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Desglose de Indicadores del Proyecto (Escala Likert 1 - 5)
          </h3>
          <div className="space-y-2">
            {metrics.indicators.map((ind) => (
              <div key={ind.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between gap-4">
                <span className="text-slate-700 font-semibold">{ind.label}</span>
                <div className="flex items-center gap-4 shrink-0 font-mono">
                  <span className="text-slate-500">Media: <strong className="text-slate-900">{ind.average.toFixed(1)} / 5</strong></span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    {ind.pctHighSatisfaction}% ≥ 4★
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professor Admin Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleResetToZero}
            disabled={isResetting}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isResetting ? 'Restableciendo...' : 'Restablecer Contadores y Encuestas a Cero'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
