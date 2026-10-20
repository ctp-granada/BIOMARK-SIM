import React, { useState, useEffect } from 'react';
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
  Copy,
  ExternalLink,
  Code2,
  Check,
  GraduationCap,
  Lock,
  Unlock,
  RotateCcw,
  Database,
  CloudDownload,
  RefreshCw
} from 'lucide-react';
import { satisfactionService, SatisfactionMetrics } from '../../utils/satisfactionService';
import { fetchSatisfactionSurveysFromCloud, resetAllPlatformStatsAndSurveys } from '../../lib/firebase';

interface SatisfactionMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSurvey?: () => void;
  visitorCount?: number;
  onResetStats?: () => void;
}

export const SatisfactionMetricsModal: React.FC<SatisfactionMetricsModalProps> = ({
  isOpen,
  onClose,
  onOpenSurvey,
  visitorCount = 0,
  onResetStats
}) => {
  const [metrics, setMetrics] = useState<SatisfactionMetrics>(() => satisfactionService.getMetrics());
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [showScriptModal, setShowScriptModal] = useState<boolean>(false);
  const [downloadingCloudCSV, setDownloadingCloudCSV] = useState<boolean>(false);
  const [cloudCount, setCloudCount] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMetrics(satisfactionService.getMetrics());
      satisfactionService.syncCloudSurveys().then(() => {
        setMetrics(satisfactionService.getMetrics());
      }).catch((e) => console.warn('Could not sync surveys from Firestore', e));

      fetchSatisfactionSurveysFromCloud().then((surveys) => {
        setCloudCount(surveys.length);
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csvContent = satisfactionService.exportToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluacion_satisfaccion_sus_ugr_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification('Informe CSV descargado para la Memoria Docente UGR.');
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const handleDownloadFirestoreCSV = async () => {
    setDownloadingCloudCSV(true);
    try {
      setCopiedNotification('Conectando con Firestore y descargando respuestas reales...');
      const cloudSurveys = await fetchSatisfactionSurveysFromCloud();
      setCloudCount(cloudSurveys.length);

      if (!cloudSurveys || cloudSurveys.length === 0) {
        setCopiedNotification('Aviso: Colección Firestore vacía aún. Descargando respuestas combinadas disponibles.');
        const allSurveys = satisfactionService.getSurveys();
        const csvContent = satisfactionService.exportFirestoreSurveysToCSV(allSurveys);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `respuestas_satisfaccion_ugr_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => setCopiedNotification('CSV generado con respuestas locales/benchmark disponibles.'), 1500);
        return;
      }

      // Generate complete CSV from Firestore surveys
      const csvContent = satisfactionService.exportFirestoreSurveysToCSV(cloudSurveys);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `respuestas_firestore_ugr_bioquimica_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setCopiedNotification(`✅ Descargadas con éxito ${cloudSurveys.length} respuestas recopiladas en Firestore.`);
      setTimeout(() => setCopiedNotification(null), 4500);
    } catch (err: any) {
      console.error('Error al exportar desde Firestore:', err);
      setCopiedNotification(`Error al conectar con Firestore: ${err?.message || 'Error de red'}`);
      setTimeout(() => setCopiedNotification(null), 4500);
    } finally {
      setDownloadingCloudCSV(false);
    }
  };

  const handleDownloadJSON = () => {
    const jsonContent = satisfactionService.exportToJSON();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `encuestas_satisfaccion_sus_ugr_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification('Archivo JSON exportado correctamente.');
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const handleCopyGoogleScript = () => {
    const scriptCode = `/**
 * BIOMARK-SIM · Encuesta de satisfacción y usabilidad del alumnado
 * PID 26-158 · Facultad de Medicina · Universidad de Granada
 */
const TITULO = 'BIOMARK-SIM · Encuesta de satisfacción y usabilidad';

const LIKERT_PROYECTO = [
  ['Facilidad de navegación', 'Encontrar lo que buscas y moverte por la plataforma es sencillo.'],
  ['Claridad de las respuestas analíticas (feedback)', 'Las explicaciones que recibes al acertar o fallar son claras.'],
  ['Atractivo visual', 'El diseño y las imágenes de la plataforma resultan atractivos.'],
  ['Utilidad para el aprendizaje', 'La plataforma me ayuda a aprender y a razonar la bioquímica clínica.'],
  ['Valoración global de la herramienta', 'Valoración general de la plataforma como apoyo a la asignatura.'],
];
const LIKERT_EXTRA = [
  ['Simuladores interactivos', 'Integra, ciclo de Randle, ictericias, hemostasia…'],
  ['Gamificación y motivación', 'Guardias, presupuesto, ranking y retos me animan a estudiar con constancia.'],
];
const SUS = [
  'Creo que me gustaría utilizar esta herramienta con frecuencia.',
  'Encontré la herramienta innecesariamente compleja.',
  'Pensé que la herramienta era fácil de usar.',
  'Creo que necesitaría el apoyo de una persona experta para poder utilizarla.',
  'Encontré que las distintas funciones de la herramienta estaban bien integradas.',
  'Pensé que había demasiada inconsistencia en la herramienta.',
  'Imagino que la mayoría de las personas aprenderían a utilizarla muy rápidamente.',
  'Encontré la herramienta muy difícil de utilizar.',
  'Me sentí muy seguro/a utilizando la herramienta.',
  'Necesité aprender muchas cosas antes de poder empezar a usarla.',
];
const NPS_TITULO = '¿Con qué probabilidad recomendarías la plataforma a estudiantes de cursos siguientes?';
const MODULOS = [
  'Simulador de Integración Metabólica (Integra)',
  'Hospital Clínico (Guardias y Casos Clínicos)',
  'Simulador de Ictericias',
  'Simulador del Ciclo de Randle',
  'Simulador de Hemostasia',
  'Parque Biomédico y Rosco de Bioquímica',
  'Vademécum de Biomarcadores',
  'Temario y Preguntas Test',
];

function susTitulo_(i) { return 'SUS ' + (i + 1) + '. ' + SUS[i]; }

function crearEncuesta() {
  const form = FormApp.create(TITULO);
  form.setDescription('Encuesta anónima y voluntaria sobre la plataforma BIOMARK-SIM.');
  form.setCollectEmail(false);
  form.setRequireLogin(true);
  form.setLimitOneResponsePerUser(true);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);

  form.addMultipleChoiceItem()
    .setTitle('Perfil académico')
    .setChoiceValues(['Alumno/a del Grado en Medicina', 'Alumno/a del Grado en Enfermería', 'Otro'])
    .setRequired(true);
  const sub = ['Prefiero no indicarlo'];
  for (let n = 1; n <= 15; n++) sub.push('Subgrupo ' + n);
  form.addListItem().setTitle('Subgrupo de prácticas').setChoiceValues(sub).setRequired(false);

  form.addPageBreakItem().setTitle('1. Valora la plataforma').setHelpText('1 = muy mal · 5 = muy bien');
  LIKERT_PROYECTO.concat(LIKERT_EXTRA).forEach(function (it) {
    form.addScaleItem().setTitle(it[0]).setHelpText(it[1]).setBounds(1, 5).setLabels('Muy mal', 'Muy bien').setRequired(true);
  });

  form.addPageBreakItem().setTitle('2. Usabilidad (escala SUS)');
  SUS.forEach(function (_, i) {
    form.addScaleItem().setTitle(susTitulo_(i)).setBounds(1, 5).setLabels('Muy en desacuerdo', 'Muy de acuerdo').setRequired(true);
  });

  form.addPageBreakItem().setTitle('3. Recomendación y opinión');
  form.addScaleItem().setTitle(NPS_TITULO).setBounds(0, 10).setLabels('Nada probable', 'Muy probable').setRequired(true);
  form.addListItem().setTitle('Módulo que más te ha servido').setChoiceValues(MODULOS).setRequired(false);
  form.addParagraphTextItem().setTitle('¿Qué es lo que más te ha ayudado a aprender?').setRequired(false);
  form.addParagraphTextItem().setTitle('¿Qué cambiarías o añadirías?').setRequired(false);

  const ss = SpreadsheetApp.create(TITULO + ' (respuestas)');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  PropertiesService.getScriptProperties().setProperties({ FORM_ID: form.getId(), SHEET_ID: ss.getId() });
}`;

    navigator.clipboard.writeText(scriptCode);
    setCopiedNotification('Script de Google Apps Script copiado al portapapeles.');
    setTimeout(() => setCopiedNotification(null), 3500);
  };

  const susInterpretation = (score: number) => {
    if (metrics.totalSurveys === 0 || score === 0) {
      return { grade: 'Sin respuestas aún', color: 'text-slate-600 bg-slate-100 border-slate-300' };
    }
    if (score >= 80.3) return { grade: 'A / Excelente', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (score >= 68) return { grade: 'B / Aceptable (≥68)', color: 'text-teal-700 bg-teal-50 border-teal-300' };
    if (score >= 51) return { grade: 'C / Regular', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { grade: 'F / Insuficiente', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const susInfo = susInterpretation(metrics.susMetric.media);

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
                  PID 26-158 · Innovación Docente UGR
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  {metrics.totalSurveys} evaluaciones en Firestore / Local
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white leading-tight">
                Informe de Usabilidad (Escala SUS) y Calidad Docente
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Resultados psicométricos estandarizados para la memoria docente del Dpto. de Bioquímica y Biología Molecular III e Inmunología.
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
          
          {/* Toast */}
          {copiedNotification && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-xs">{copiedNotification}</span>
            </div>
          )}

          {/* Firestore Cloud Data Banner for Professors */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Database className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-xs">
                    Base de Datos Firebase Firestore
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Colección: satisfaction_surveys</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-700" />
                    <span>{visitorCount.toLocaleString('es-ES')} Visitas a la Plataforma</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {cloudCount !== null
                    ? `Se han recopilado ${cloudCount} respuesta${cloudCount === 1 ? '' : 's'} de estudiantes en Firestore (nube).`
                    : 'Consultando respuestas de estudiantes en la base de datos de Firestore...'}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadFirestoreCSV}
              disabled={downloadingCloudCSV}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 shrink-0"
              title="Descargar archivo CSV con todas las respuestas recopiladas en Firestore"
            >
              {downloadingCloudCSV ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                  <span>Descargando de Firestore...</span>
                </>
              ) : (
                <>
                  <CloudDownload className="w-4 h-4 text-amber-200" />
                  <span>Descargar CSV de Firestore</span>
                </>
              )}
            </button>
          </div>

          {/* Top 4 Key KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* 1. SUS SCORE */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300 rounded-2xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-[10px] font-black uppercase tracking-wider">Escala SUS (0–100)</span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-amber-950">
                  {metrics.totalSurveys > 0 ? metrics.susMetric.media.toFixed(1) : '0.0'}
                </span>
                <span className="text-xs font-bold text-amber-700">/ 100</span>
              </div>
              <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block ${susInfo.color}`}>
                {susInfo.grade}
              </div>
            </div>

            {/* 2. NPS RECOMENDACIÓN */}
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 rounded-2xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-[10px] font-black uppercase tracking-wider">Recomendación (NPS)</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-950">
                  {metrics.totalSurveys > 0 ? (metrics.npsScore > 0 ? `+${metrics.npsScore}` : metrics.npsScore) : '0'}
                </span>
                <span className="text-xs font-bold text-emerald-700">Pts</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold block">
                {metrics.totalSurveys > 0 ? `${metrics.npsPromotersPercent}% Promotores (9–10)` : '0% Promotores'}
              </span>
            </div>

            {/* 3. MUESTRA TOTAL */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 rounded-2xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-blue-800">
                <span className="text-[10px] font-black uppercase tracking-wider">Muestra (n)</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-blue-950">
                  {metrics.totalSurveys}
                </span>
                <span className="text-xs font-bold text-blue-700">Alumnos</span>
              </div>
              <span className="text-[10px] text-blue-800 font-semibold block">
                Facultad de Medicina UGR
              </span>
            </div>

            {/* 4. SUS % CUMPLE ESTÁNDAR */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-200 rounded-2xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between text-purple-800">
                <span className="text-[10px] font-black uppercase tracking-wider">% SUS ≥ 68</span>
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-purple-950">
                  {metrics.totalSurveys > 0 ? `${metrics.susMetric.pctGe4}%` : '0%'}
                </span>
                <span className="text-xs font-bold text-purple-700">de alumnos</span>
              </div>
              <span className="text-[10px] text-purple-800 font-semibold block">
                Estándar Internacional
              </span>
            </div>
          </div>

          {/* OFFICIAL TABLE MATCHING APPS SCRIPT RESULTADOS SHEET */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                  <span>Tabla Oficial de Indicadores · Memoria Docente UGR</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Cálculo automático de Media, Desviación Estándar (DE) y cumplimiento de objetivos prefijados.
                </p>
              </div>

              <button
                onClick={handleDownloadCSV}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar CSV Formateado</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold text-[11px]">
                    <th className="p-2.5">Indicador</th>
                    <th className="p-2.5 text-center">n</th>
                    <th className="p-2.5 text-center">Media</th>
                    <th className="p-2.5 text-center">DE</th>
                    <th className="p-2.5 text-center">% ≥ 4 (o SUS ≥ 68)</th>
                    <th className="p-2.5 text-center">Objetivo</th>
                    <th className="p-2.5 text-center">¿Alcanzado?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {metrics.indicators.map((ind) => (
                    <tr key={ind.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 font-medium">{ind.nombre}</td>
                      <td className="p-2.5 text-center text-slate-500">{ind.n}</td>
                      <td className="p-2.5 text-center font-bold text-slate-900">{ind.media.toFixed(2)}</td>
                      <td className="p-2.5 text-center text-slate-500 font-mono text-[11px]">{ind.de.toFixed(2)}</td>
                      <td className="p-2.5 text-center font-semibold">{ind.pctGe4}%</td>
                      <td className="p-2.5 text-center text-slate-500">{ind.objetivo}</td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ind.alcanzado
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {ind.alcanzado ? 'Sí' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {/* SUS Row */}
                  <tr className="bg-amber-50/60 font-bold border-t-2 border-amber-200">
                    <td className="p-2.5 text-amber-950 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-700" />
                      <span>{metrics.susMetric.nombre}</span>
                    </td>
                    <td className="p-2.5 text-center text-slate-500">{metrics.susMetric.n}</td>
                    <td className="p-2.5 text-center text-amber-950 font-black">{metrics.susMetric.media.toFixed(1)}</td>
                    <td className="p-2.5 text-center text-slate-500 font-mono text-[11px]">{metrics.susMetric.de.toFixed(2)}</td>
                    <td className="p-2.5 text-center text-amber-900">{metrics.susMetric.pctGe4}%</td>
                    <td className="p-2.5 text-center text-slate-500">68</td>
                    <td className="p-2.5 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          metrics.susMetric.alcanzado
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {metrics.susMetric.alcanzado ? 'Sí' : 'No'}
                      </span>
                    </td>
                  </tr>

                  {/* NPS Row */}
                  <tr className="bg-emerald-50/40 font-bold">
                    <td className="p-2.5 text-emerald-950">NPS (% promotores − % detractores)</td>
                    <td className="p-2.5 text-center text-slate-500">{metrics.totalSurveys}</td>
                    <td className="p-2.5 text-center text-emerald-950 font-black">+{metrics.npsScore}</td>
                    <td className="p-2.5 text-center text-slate-400">-</td>
                    <td className="p-2.5 text-center text-emerald-800">
                      {metrics.npsPromotersPercent}% / {metrics.npsDetractorsPercent}%
                    </td>
                    <td className="p-2.5 text-center text-slate-400">≥ 50</td>
                    <td className="p-2.5 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {metrics.npsScore >= 50 ? 'Sí' : 'No'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Qualitative Opinions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-600" />
                <span>Respuestas Cualitativas Recogidas en la Plataforma</span>
              </h3>
              <span className="text-[10px] text-slate-400">Últimas aportaciones</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {metrics.recentComments.map((c, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900">
                      {c.role} · {c.subgroup}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      SUS: {c.susScore?.toFixed(0) || 85}/100
                    </span>
                  </div>

                  {c.bestFeature && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Lo que más le ha ayudado:
                      </span>
                      <p className="text-[11.5px] text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200/80 leading-relaxed">
                        «{c.bestFeature}»
                      </p>
                    </div>
                  )}

                  {c.suggestion && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        Propuesta de cambio o mejora:
                      </span>
                      <p className="text-[11.5px] text-slate-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60 leading-relaxed italic">
                        «{c.suggestion}»
                      </p>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block text-right pt-0.5">
                    {c.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
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
                <span>Rellenar Encuesta SUS (+150 XP)</span>
              </button>
            )}

            <button
              onClick={handleCopyGoogleScript}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar el código de Google Apps Script para Google Forms @go.ugr.es"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Copiar Script Google Forms UGR</span>
            </button>

            {/* Professor Testing Tools */}
            <button
              onClick={() => {
                const current = satisfactionService.hasUserCompletedSurvey();
                if (current) {
                  satisfactionService.resetUserSurveyCompletion();
                  setCopiedNotification('Modo Prueba Alumno activado: Encuesta marcada como NO completada (puerta de acceso bloqueada para probar).');
                } else {
                  satisfactionService.setUserSurveyCompleted(true);
                  setCopiedNotification('Plataforma desbloqueada: Encuesta marcada como completada para pruebas.');
                }
                setTimeout(() => setCopiedNotification(null), 4000);
              }}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Alternar estado de encuesta para probar el bloqueo docente de casos y parque"
            >
              {satisfactionService.hasUserCompletedSurvey() ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Probar Bloqueo (Resetear)</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Desbloquear Todo</span>
                </>
              )}
            </button>
            <button
              onClick={async () => {
                setCopiedNotification('Restableciendo contadores y encuestas a CERO...');
                satisfactionService.clearAllSurveys();
                await resetAllPlatformStatsAndSurveys();
                setMetrics(satisfactionService.getMetrics());
                setCloudCount(0);
                if (onResetStats) onResetStats();
                setCopiedNotification('¡Contadores y encuestas reseteados a cero correctamente!');
                setTimeout(() => setCopiedNotification(null), 4000);
              }}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restablecer todos los contadores de visitas y encuestas a cero (Firestore y Local)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-700" />
              <span>Poner a Cero</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={handleDownloadFirestoreCSV}
              disabled={downloadingCloudCSV}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              title="Descargar archivo CSV con todas las respuestas recopiladas en Firestore"
            >
              {downloadingCloudCSV ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-200" />
              ) : (
                <Database className="w-3.5 h-3.5 text-amber-200" />
              )}
              <span>CSV de Firestore</span>
              {cloudCount !== null && (
                <span className="bg-amber-950/60 text-amber-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-0.5">
                  {cloudCount}
                </span>
              )}
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar informe completo en CSV para la memoria docente"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar CSV</span>
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
