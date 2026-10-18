import React, { useState } from 'react';
import {
  BarChart3,
  Star,
  Users,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  Award,
  Sparkles,
  X,
  PlusCircle,
  Building2,
  PieChart
} from 'lucide-react';
import { satisfactionService, SatisfactionMetrics } from '../../utils/satisfactionService';

interface SatisfactionMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSurvey?: () => void;
}

export const SatisfactionMetricsModal: React.FC<SatisfactionMetricsModalProps> = ({
  isOpen,
  onClose,
  onOpenSurvey
}) => {
  const [metrics, setMetrics] = useState<SatisfactionMetrics>(() => satisfactionService.getMetrics());
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csvContent = satisfactionService.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluacion_satisfaccion_alumnado_ugr_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification('Archivo CSV exportado para memoria docente.');
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const handleDownloadJSON = () => {
    const jsonContent = satisfactionService.exportToJSON();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `encuestas_alumnado_ugr_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification('Archivo JSON exportado correctamente.');
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const renderProgressBar = (label: string, score: number, max: number = 5, color: string = 'bg-amber-500') => {
    const percent = Math.min(100, Math.round((score / max) * 100));
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">{label}</span>
          <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {score.toFixed(2)} / {max} ({percent}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className={`h-full ${color} rounded-full transition-all duration-500`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-amber-900/60 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
              <BarChart3 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                  Panel de Calidad Docente · Facultad de Medicina UGR
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  {metrics.totalSurveys} encuestas registradas
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white leading-tight">
                Métricas de Satisfacción y Evaluación del Alumnado
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Resultados consolidados de utilidad clínica, motivación por gamificación, usabilidad y Net Promoter Score (NPS).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          
          {/* Notification toast */}
          {copiedNotification && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-xs">{copiedNotification}</span>
            </div>
          )}

          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Global Satisfaction */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-[11px] font-bold uppercase">Satisfacción Global</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-950">
                  {metrics.averageOverall.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-amber-700">/ 5.0</span>
              </div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Net Promoter Score */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-[11px] font-bold uppercase">Recomendación (NPS)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-950">
                  +{metrics.npsScore}
                </span>
                <span className="text-xs font-bold text-emerald-700">Puntos</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold block">
                {metrics.npsPromotersPercent}% Promotores (9-10)
              </span>
            </div>

            {/* Total Surveys */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-blue-800">
                <span className="text-[11px] font-bold uppercase">Muestra Total</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-950">
                  {metrics.totalSurveys}
                </span>
                <span className="text-xs font-bold text-blue-700">Respuestas</span>
              </div>
              <span className="text-[10px] text-blue-800 font-semibold block">
                Grado en Medicina UGR
              </span>
            </div>

            {/* Clinical Utility Score */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between text-indigo-800">
                <span className="text-[11px] font-bold uppercase">Utilidad Docente</span>
                <Award className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-indigo-950">
                  {metrics.averageClinicalUtility.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-indigo-700">/ 5.0</span>
              </div>
              <span className="text-[10px] text-indigo-800 font-semibold block">
                Impacto en Aprendizaje
              </span>
            </div>
          </div>

          {/* Breakdown By Dimension */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-slate-600" />
                <span>Desglose por Dimensión de Calidad Docente</span>
              </h3>
              <span className="text-[10px] font-semibold text-slate-500">
                Escala Likert 1 (Muy Insuficiente) a 5 (Excelente)
              </span>
            </div>

            <div className="space-y-3.5">
              {renderProgressBar(
                '1. Utilidad de Casos Clínicos y Comprensión de Biomarcadores',
                metrics.averageClinicalUtility,
                5,
                'bg-indigo-600'
              )}

              {renderProgressBar(
                '2. Simuladores Moleculares e Integración Metabólica (Atlas & Curvas de Cahill)',
                metrics.averageSimulators,
                5,
                'bg-teal-600'
              )}

              {renderProgressBar(
                '3. Motivación por Dinámicas de Gamificación (Guardias, Vidas, Presupuesto, Rosco)',
                metrics.averageGamification,
                5,
                'bg-amber-600'
              )}

              {renderProgressBar(
                '4. Usabilidad, Velocidad de Respuesta y Diseño de la Interfaz',
                metrics.averageUsability,
                5,
                'bg-emerald-600'
              )}
            </div>
          </div>

          {/* Qualitative Feedback Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Valoraciones Cualitativas y Sugerencias de los Estudiantes</span>
              </h3>
              <span className="text-[10px] text-slate-500">
                Últimas opiniones recogidas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metrics.recentComments.map((comment, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900">
                      {comment.role}
                    </span>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-bold text-amber-800">
                        {comment.rating} / 5
                      </span>
                    </div>
                  </div>

                  {comment.bestFeature && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Aspecto más valorado:
                      </span>
                      <p className="text-[11.5px] text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                        «{comment.bestFeature}»
                      </p>
                    </div>
                  )}

                  {comment.suggestion && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Propuesta de mejora:
                      </span>
                      <p className="text-[11.5px] text-slate-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed italic">
                        «{comment.suggestion}»
                      </p>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block text-right pt-1">
                    Registrado el {comment.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer / Export Actions */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onOpenSurvey && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSurvey();
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Rellenar Nueva Encuesta (+150 XP)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar informe de satisfacción en formato CSV para memorias de innovación docente"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar CSV (Memoria Docente)</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Exportar archivo de datos en JSON"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>JSON</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
