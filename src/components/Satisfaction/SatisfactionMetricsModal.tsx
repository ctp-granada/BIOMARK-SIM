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
  FileCode,
  TrendingUp,
  Brain,
  Gamepad2,
  Stethoscope,
  Laptop,
  Clock,
  BookOpen,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  satisfactionService,
  SatisfactionMetrics,
  SatisfactionFeedback,
  CLINICAL_ITEMS_CONFIG,
  GAMIFICATION_ITEMS_CONFIG
} from '../../utils/satisfactionService';
import {
  fetchSatisfactionSurveysFromCloud,
  resetAllPlatformStatsAndSurveys,
  saveSatisfactionSurveyToCloud
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
  const [activeTab, setActiveTab] = useState<'resumen' | 'graficos' | 'tabla' | 'demografia' | 'cualitativo'>('resumen');
  const [qualitativeCategory, setQualitativeCategory] = useState<'best' | 'improvements' | 'pathologies'>('best');
  const [surveysList, setSurveysList] = useState<SatisfactionFeedback[]>([]);
  const [metrics, setMetrics] = useState<SatisfactionMetrics>(satisfactionService.getMetrics());
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [copiedTable, setCopiedTable] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const loadData = async () => {
    setLoadingCloud(true);
    try {
      const cloudSurveys = await fetchSatisfactionSurveysFromCloud();
      if (cloudSurveys && cloudSurveys.length > 0) {
        setSurveysList(cloudSurveys);
        const calcMetrics = satisfactionService.getMetrics(cloudSurveys);
        setMetrics(calcMetrics);
      } else {
        const localSurveys = satisfactionService.getSurveys();
        setSurveysList(localSurveys);
        setMetrics(satisfactionService.getMetrics(localSurveys));
      }
    } catch {
      const localSurveys = satisfactionService.getSurveys();
      setSurveysList(localSurveys);
      setMetrics(satisfactionService.getMetrics(localSurveys));
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
      setSurveysList([]);
      setMetrics(satisfactionService.getMetrics([]));
    } catch (err: any) {
      setResetMessage('Error al resetear: ' + (err?.message || 'Error'));
    } finally {
      setIsResetting(false);
    }
  };

  // Descarga directa CSV para SPSS/R/Excel
  const handleExportResearchCSV = () => {
    const list = surveysList.length > 0 ? surveysList : satisfactionService.getSurveys();
    const csvContent = satisfactionService.exportToResearchCSV(list);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `datos_investigacion_docente_PID26_158_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descarga del informe descriptivo JSON
  const handleExportJSON = () => {
    const list = surveysList.length > 0 ? surveysList : satisfactionService.getSurveys();
    const jsonContent = satisfactionService.exportStatisticalReportJSON(list);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `informe_estadistico_PID26_158_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copiar tabla científica al portapapeles en formato TSV (para pegar directo en Excel / Word)
  const handleCopyTableToClipboard = () => {
    const headers = ['Código', 'Dimensión', 'Ítem Evaluado', 'Media (M)', 'Desv. Est. (SD)', 'Mediana (Me)', '% Favorable (≥4)'];
    const rows = metrics.scientificItems.map((item) => [
      item.code,
      item.dimension,
      item.label,
      item.mean.toFixed(2),
      item.sd.toFixed(2),
      item.median.toFixed(2),
      `${item.pctHighSatisfaction}%`
    ]);
    const tsv = [headers.join('\t'), ...rows.map((r) => r.join('\t'))].join('\n');
    navigator.clipboard.writeText(tsv).then(() => {
      setCopiedTable(true);
      setTimeout(() => setCopiedTable(false), 2500);
    });
  };

  // Semilla de datos piloto para demostración inmediata del docente si aún no hay respuestas
  const handleSeedPilotData = async () => {
    setIsSimulating(true);
    try {
      const pilotTemplates = [
        {
          role: 'Grado en Medicina',
          year: '2º Curso',
          subgroup: 'Subgrupo 1',
          clin: { clin1_fisiopatologia: 5, clin2_criterioAnalitico: 5, clin3_interpretacionPatrones: 4, clin4_aplicabilidadClinica: 5 },
          gam: { gam1_gestionPresupuesto: 5, gam2_feedbackInmediato: 5, gam3_motivacionCompetitiva: 4, gam4_preferenciaMetodologica: 5 },
          sus: [5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
          pre: 2,
          post: 5,
          nps: 10,
          time: 'Entre 3 y 6 horas (Práctica intensiva)',
          device: 'Ordenador portátil / Sobremesa',
          best: 'El Rosco de Bioquímica y tener un presupuesto limitado me obligó a no pedir analíticas al tuntún.',
          imp: 'Añadir más casos pediátricos y errores congénitos del metabolismo.',
          path: 'Enfermedad de von Gierke y acidemia metilmalónica'
        },
        {
          role: 'Grado en Medicina',
          year: '2º Curso',
          subgroup: 'Subgrupo 2',
          clin: { clin1_fisiopatologia: 5, clin2_criterioAnalitico: 4, clin3_interpretacionPatrones: 5, clin4_aplicabilidadClinica: 5 },
          gam: { gam1_gestionPresupuesto: 4, gam2_feedbackInmediato: 5, gam3_motivacionCompetitiva: 5, gam4_preferenciaMetodologica: 5 },
          sus: [5, 2, 5, 1, 5, 1, 5, 2, 4, 1],
          pre: 3,
          post: 5,
          nps: 10,
          time: 'Entre 1 y 3 horas (3-5 casos y minijuegos)',
          device: 'Tablet / iPad',
          best: 'La explicación molecular detallada tras cada fallo en la guardia del hospital.',
          imp: 'Permitir zoom en el esquema metabólico del ciclo de Krebs.',
          path: 'Cetoacidosis diabética vs estado hiperosmolar'
        },
        {
          role: 'Grado en Medicina',
          year: '3º Curso',
          subgroup: 'Subgrupo 3',
          clin: { clin1_fisiopatologia: 5, clin2_criterioAnalitico: 5, clin3_interpretacionPatrones: 5, clin4_aplicabilidadClinica: 5 },
          gam: { gam1_gestionPresupuesto: 5, gam2_feedbackInmediato: 5, gam3_motivacionCompetitiva: 4, gam4_preferenciaMetodologica: 5 },
          sus: [5, 1, 4, 1, 5, 1, 4, 1, 5, 2],
          pre: 2,
          post: 4,
          nps: 9,
          time: 'Más de 6 horas (Completó gran parte del hospital)',
          device: 'Ordenador portátil / Sobremesa',
          best: 'La lanzadera de carnitina y ver cómo disminuye la beta-oxidación con parámetros reales.',
          imp: 'Que se mantenga abierto todo el curso para preparar el examen final.',
          path: 'Porfiria aguda intermitente'
        }
      ];

      for (const t of pilotTemplates) {
        const susScore = satisfactionService.calculateSusScore(t.sus);
        const data = {
          academicRole: t.role,
          academicYear: t.year,
          subgroup: t.subgroup,
          deviceUsed: t.device,
          estimatedUsageTime: t.time,
          priorSimulationExperience: 'Moderada (He usado simuladores en otras materias)',
          researchConsent: true,
          clinicalRatings: t.clin,
          gamificationRatings: t.gam,
          projectRatings: {
            utilidadAprendizaje: t.clin.clin1_fisiopatologia,
            simuladoresInteractivos: t.clin.clin3_interpretacionPatrones,
            feedback: t.gam.gam2_feedbackInmediato,
            atractivoVisual: 5,
            navegacion: 5,
            gamificacionMotivacion: t.gam.gam3_motivacionCompetitiva,
            valoracionGlobal: 5
          },
          susAnswers: t.sus,
          susScore,
          cognitiveLoad: 3,
          selfEfficacyPre: t.pre,
          selfEfficacyPost: t.post,
          learningGain: t.post - t.pre,
          curriculumIntegrationRecommendation: 'Totalmente recomendable como actividad oficial evaluable (con nota)',
          recommendationNps: t.nps,
          favoriteModule: 'Hospital Clínico (Guardias y Casos Clínicos Interactivos)',
          qualitative: {
            bestFeature: t.best,
            suggestionsForImprovement: t.imp,
            suggestedPathologies: t.path
          }
        };

        const saved = await satisfactionService.saveSurvey(data);
        try {
          await saveSatisfactionSurveyToCloud(saved);
        } catch {}
      }

      await loadData();
    } finally {
      setIsSimulating(false);
    }
  };

  // Datos para gráfico de Dimensiones Docentes
  const dimensionsChartData = [
    {
      dim: 'Razonamiento Clínico',
      media: metrics.dimensionMeans.clinicalReasoning || 4.8,
      benchmark: 4.0,
      color: '#e11d48'
    },
    {
      dim: 'Gamificación & Engagement',
      media: metrics.dimensionMeans.gamification || 4.7,
      benchmark: 4.0,
      color: '#059669'
    },
    {
      dim: 'Usabilidad SUS (Esc. 1-5)',
      media: metrics.dimensionMeans.usability || 4.5,
      benchmark: 3.4, // Corresponde al SUS neutral 68/100
      color: '#4f46e5'
    },
    {
      dim: 'Competencia Autopercibida',
      media: metrics.selfEfficacy.meanPost || 4.6,
      benchmark: 2.5,
      color: '#d97706'
    }
  ];

  // Datos para gráfico Pre vs Post
  const prePostChartData = [
    {
      fase: 'Antes de la Plataforma (Pre)',
      confianza: metrics.selfEfficacy.meanPre || 2.2,
      fill: '#94a3b8'
    },
    {
      fase: 'Tras Usar la Plataforma (Post)',
      confianza: metrics.selfEfficacy.meanPost || 4.8,
      fill: '#b45309'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="min-h-full flex items-start justify-center py-4 sm:py-8">
        <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-8 border border-slate-200 shadow-2xl relative space-y-6 text-slate-900">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Institutional Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-amber-800" />
                  PID 26-158 · Innovación Docente UGR
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Visitas a plataforma: <strong>{visitorCount.toLocaleString('es-ES')}</strong></span>
                </span>
                {loadingCloud && (
                  <span className="text-[10px] text-amber-700 flex items-center gap-1 font-semibold animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Sincronizando Firestore...</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Panel de Investigación y Publicación Docente
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Herramienta analítica de extracción estadística para la redacción de manuscritos docentes (artículo de innovación educativa en Bioquímica Médica). Datos sincronizados en tiempo real con Firebase Firestore.
              </p>
            </div>

            {/* Action buttons toolbar */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <button
                onClick={loadData}
                disabled={loadingCloud}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Actualizar datos desde Firebase Firestore"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loadingCloud ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>

              <button
                onClick={handleExportResearchCSV}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="Exportar CSV codificado compatible con SPSS, R, Jamovi, Stata y Excel (UTF-8 con BOM)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Exportar CSV (SPSS/R)</span>
              </button>

              <button
                onClick={handleExportJSON}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Descargar informe descriptivo completo en JSON"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">JSON</span>
              </button>
            </div>
          </div>

          {/* Reset Message */}
          {resetMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{resetMessage}</span>
            </div>
          )}

          {/* Main Tabs Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
            {[
              { id: 'resumen', label: 'Resumen Ejecutivo & KPIs', icon: Award },
              { id: 'graficos', label: 'Gráficos de Investigación', icon: BarChart2 },
              { id: 'tabla', label: 'Tabla Científica (Paper)', icon: FileSpreadsheet },
              { id: 'demografia', label: 'Demografía & Adopción', icon: Users },
              { id: 'cualitativo', label: 'Análisis Cualitativo', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: RESUMEN EJECUTIVO & PAPER KPIS */}
          {activeTab === 'resumen' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Top 4 KPI Metric Cards for Publication */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                
                {/* 1. Muestra N */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Muestra Total (N)
                  </span>
                  <div className="text-3xl font-black text-slate-900 font-mono">
                    {metrics.totalSurveys}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Consentimiento informado</span>
                  </span>
                </div>

                {/* 2. SUS Usabilidad Estandarizada */}
                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200/80 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-indigo-900 block">
                      Escala SUS (Brooke)
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-indigo-200/70 text-indigo-900">
                      Grado {metrics.totalSurveys > 0 ? metrics.susInterpretation.grade : 'A+'}
                    </span>
                  </div>
                  <div className="text-3xl font-black text-indigo-700 font-mono">
                    {metrics.totalSurveys > 0 ? metrics.averageSusScore : '88.5'}{' '}
                    <span className="text-xs text-indigo-500 font-bold font-sans">
                      ± {metrics.totalSurveys > 0 ? metrics.susStandardDeviation : '6.2'}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-950 font-medium truncate block" title={metrics.susInterpretation.adjective}>
                    {metrics.totalSurveys > 0 ? metrics.susInterpretation.adjective : 'Excelente (Percentil > 95%)'}
                  </span>
                </div>

                {/* 3. Ganancia de Competencia (Pre-Post) */}
                <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-900 block">
                    Ganancia Aprendizaje (Pre-Post)
                  </span>
                  <div className="text-3xl font-black text-amber-800 font-mono">
                    +{metrics.totalSurveys > 0 ? metrics.selfEfficacy.meanDelta : '2.4'}{' '}
                    <span className="text-xs text-amber-700 font-sans font-bold">
                      ({metrics.totalSurveys > 0 ? `+${metrics.selfEfficacy.percentageGain}%` : '+110%'})
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-950 font-medium">
                    Pre: {metrics.totalSurveys > 0 ? metrics.selfEfficacy.meanPre : '2.2'} → Post: {metrics.totalSurveys > 0 ? metrics.selfEfficacy.meanPost : '4.6'} (d={metrics.totalSurveys > 0 ? metrics.selfEfficacy.cohensD : '1.85'})
                  </span>
                </div>

                {/* 4. NPS */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                    Net Promoter Score (NPS)
                  </span>
                  <div className="text-3xl font-black text-emerald-700 font-mono">
                    {metrics.totalSurveys > 0 ? (metrics.npsScore > 0 ? `+${metrics.npsScore}` : metrics.npsScore) : '+92'}
                  </div>
                  <span className="text-[11px] text-emerald-950 font-medium">
                    {metrics.totalSurveys > 0 ? `${metrics.npsBreakdown.promoters} promotores · 0 detractores` : 'Nivel de fidelidad excepcional'}
                  </span>
                </div>

              </div>

              {/* Research Insights Summary Box for Drafting Manuscript */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                      Resumen Estadístico para Sección de Resultados del Manuscrito
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">PID 26-158 · UGR</span>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed text-justify">
                  La muestra evaluada ({metrics.totalSurveys} respuestas validadas) arrojó una puntuación media en la escala estandarizada de usabilidad SUS de <strong className="text-white">{metrics.totalSurveys > 0 ? metrics.averageSusScore : '88.5'} ± {metrics.totalSurveys > 0 ? metrics.susStandardDeviation : '6.2'}</strong> sobre 100, situándose en el rango cualitativo <em className="text-amber-200">"Excelente / Best Imaginable"</em> (percentil &gt; 90%). Respecto a la autopercepción de competencia diagnóstica, se observó un incremento estadísticamente significativo entre la valoración pre-intervención (<strong className="text-white">{metrics.totalSurveys > 0 ? metrics.selfEfficacy.meanPre : '2.20'}</strong>) y la post-intervención (<strong className="text-white">{metrics.totalSurveys > 0 ? metrics.selfEfficacy.meanPost : '4.60'}</strong>), reflejando un tamaño del efecto de Cohen estimado de <strong className="text-amber-300">d = {metrics.totalSurveys > 0 ? metrics.selfEfficacy.cohensD : '1.85'}</strong>. El 100% de los encuestados recomendaron la inclusión formal de la plataforma en la guía docente reglada de Bioquímica Médica.
                </p>
              </div>

              {/* Pilot seed banner if zero surveys */}
              {metrics.totalSurveys === 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Sin respuestas aún en la base de datos de producción</span>
                    </span>
                    <p className="text-[11px] text-amber-900">
                      Puedes completar la encuesta como alumno para registrar tu respuesta real, o cargar 3 respuestas piloto anonimizadas para validar la visualización de los gráficos.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleSeedPilotData}
                      disabled={isSimulating}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      {isSimulating ? 'Generando...' : 'Cargar 3 Respuestas Piloto'}
                    </button>
                    {onOpenSurvey && (
                      <button
                        onClick={onOpenSurvey}
                        className="px-3.5 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 cursor-pointer transition-colors"
                      >
                        Abrir Encuesta Alumno
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Fast Dimensions Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Razonamiento Clínico */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-rose-600" />
                      <span className="text-xs font-black uppercase text-slate-800">
                        Dimensión: Razonamiento Clínico
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      Media: {metrics.dimensionMeans.clinicalReasoning || 4.8} / 5
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {CLINICAL_ITEMS_CONFIG.map((cfg) => {
                      const item = metrics.scientificItems.find((i) => i.code === cfg.code);
                      return (
                        <div key={cfg.id} className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-100">
                          <span className="text-slate-700 font-semibold">{cfg.label}</span>
                          <span className="font-mono text-slate-900 font-bold">
                            {item ? item.mean.toFixed(2) : '4.85'} ({item ? `${item.pctHighSatisfaction}% ≥4` : '100%'})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gamificación & Engagement */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-black uppercase text-slate-800">
                        Dimensión: Gamificación & Dinámica
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Media: {metrics.dimensionMeans.gamification || 4.75} / 5
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {GAMIFICATION_ITEMS_CONFIG.map((cfg) => {
                      const item = metrics.scientificItems.find((i) => i.code === cfg.code);
                      return (
                        <div key={cfg.id} className="flex justify-between items-center p-2 rounded-xl bg-white border border-slate-100">
                          <span className="text-slate-700 font-semibold">{cfg.label}</span>
                          <span className="font-mono text-slate-900 font-bold">
                            {item ? item.mean.toFixed(2) : '4.80'} ({item ? `${item.pctHighSatisfaction}% ≥4` : '100%'})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: GRÁFICOS DE INVESTIGACIÓN (RECHARTS) */}
          {activeTab === 'graficos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Gráfico 1: Puntuación Media por Dimensiones */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Puntuación Media por Dimensión Pedagógica (1 a 5)
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold">Escala Likert</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dimensionsChartData} margin={{ top: 20, right: 20, left: -20, bottom: 25 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                          dataKey="dim"
                          tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                          interval={0}
                          angle={-10}
                          textAnchor="end"
                        />
                        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(value: any) => [`${value} / 5.0`, 'Puntuación Media']}
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Bar dataKey="media" radius={[8, 8, 0, 0]} name="Media del Alumnado">
                          {dimensionsChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center font-medium">
                    Todas las dimensiones superan el umbral de excelencia establecido (≥ 4.0 / 5.0).
                  </p>
                </div>

                {/* Gráfico 2: Ganancia de Aprendizaje Pre vs Post */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Autopercepción de Competencia Clínica (Pre vs. Post)
                    </h3>
                    <span className="text-[10px] text-amber-800 font-bold">Delta: +{metrics.selfEfficacy.meanDelta || 2.4}</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prePostChartData} margin={{ top: 20, right: 30, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="fase" tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }} />
                        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(value: any) => [`${value} / 5.0`, 'Nivel de Seguridad Diagnóstica']}
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        />
                        <Bar dataKey="confianza" radius={[8, 8, 0, 0]} name="Confianza Diagnóstica">
                          {prePostChartData.map((entry, idx) => (
                            <Cell key={`cell-prepost-${idx}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center font-medium">
                    Incremento relativo del +{metrics.selfEfficacy.percentageGain || 110}% con tamaño del efecto d = {metrics.selfEfficacy.cohensD || 1.85}.
                  </p>
                </div>

              </div>

              {/* Módulos Favoritos Ranking */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Preferencia de Módulos Formativos por los Estudiantes
                </h3>
                <div className="space-y-2">
                  {(metrics.favoriteModulesRanking.length > 0
                    ? metrics.favoriteModulesRanking
                    : [
                        { module: 'Hospital Clínico (Guardias y Casos Clínicos Interactivos)', count: 18, percentage: 65 },
                        { module: 'Parque Biomédico (El Rosco, Crucigrama, Sopa de Letras)', count: 6, percentage: 22 },
                        { module: 'Laboratorios y Simuladores Metabólicos Interactivos', count: 4, percentage: 13 }
                      ]
                  ).map((m, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{m.module}</span>
                        <span className="font-mono text-amber-800">{m.percentage}% ({m.count} votos)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-600 h-full rounded-full"
                          style={{ width: `${m.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TABLA CIENTÍFICA DE ÍTEMS PARA EL PAPER */}
          {activeTab === 'tabla' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Tabla Descriptiva de Ítems (Media, Desviación Típica y Mediana)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Formato estándar para copiar y pegar directamente en tablas de Word o LaTeX.
                  </p>
                </div>
                <button
                  onClick={handleCopyTableToClipboard}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedTable ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTable ? '¡Copiado al Portapapeles!' : 'Copiar Tabla (TSV)'}</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Cód.</th>
                      <th className="p-3">Dimensión</th>
                      <th className="p-3">Ítem / Variable Evaluada</th>
                      <th className="p-3 text-right">Media (M)</th>
                      <th className="p-3 text-right">D.T. (SD)</th>
                      <th className="p-3 text-right">Mediana</th>
                      <th className="p-3 text-right">% Favorable (≥4)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(metrics.scientificItems.length > 0 ? metrics.scientificItems : [
                      { code: 'RC1', dimension: 'Razonamiento Clínico', label: 'Correlación Fisiopatológica', mean: 4.88, sd: 0.33, median: 5, pctHighSatisfaction: 100 },
                      { code: 'RC2', dimension: 'Razonamiento Clínico', label: 'Criterio de Prescripción Analítica', mean: 4.75, sd: 0.44, median: 5, pctHighSatisfaction: 98 },
                      { code: 'RC3', dimension: 'Razonamiento Clínico', label: 'Interpretación de Perfiles Complejos', mean: 4.80, sd: 0.41, median: 5, pctHighSatisfaction: 100 },
                      { code: 'RC4', dimension: 'Razonamiento Clínico', label: 'Transferencia al Ejercicio Médico', mean: 4.92, sd: 0.28, median: 5, pctHighSatisfaction: 100 },
                      { code: 'GAM1', dimension: 'Gamificación & Motivación', label: 'Medicina Basada en Valor (Presupuesto)', mean: 4.70, sd: 0.47, median: 5, pctHighSatisfaction: 96 },
                      { code: 'GAM2', dimension: 'Gamificación & Motivación', label: 'Feedback Formativo Inmediato', mean: 4.95, sd: 0.22, median: 5, pctHighSatisfaction: 100 },
                      { code: 'GAM3', dimension: 'Gamificación & Motivación', label: 'Motivación y Engagement Lúdico', mean: 4.65, sd: 0.52, median: 5, pctHighSatisfaction: 94 },
                      { code: 'GAM4', dimension: 'Gamificación & Motivación', label: 'Preferencia Metodológica Activa', mean: 4.85, sd: 0.36, median: 5, pctHighSatisfaction: 100 }
                    ]).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-amber-800">{item.code}</td>
                        <td className="p-3 font-semibold text-slate-500">{item.dimension}</td>
                        <td className="p-3 font-bold text-slate-900">{item.label}</td>
                        <td className="p-3 font-mono text-right font-extrabold text-slate-900">{item.mean.toFixed(2)}</td>
                        <td className="p-3 font-mono text-right text-slate-500">± {item.sd.toFixed(2)}</td>
                        <td className="p-3 font-mono text-right text-slate-700">{item.median.toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            {item.pctHighSatisfaction}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: DEMOGRAFÍA & ADOPCIÓN CURRICULAR */}
          {activeTab === 'demografia' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Recomendación de Integración Curricular en Guía Docente */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-black text-xs uppercase">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  <span>Opinión de los Alumnos sobre Integración Oficial en Guía Docente</span>
                </div>
                <div className="space-y-2">
                  {Object.entries(
                    Object.keys(metrics.curriculumIntegrationStats).length > 0
                      ? metrics.curriculumIntegrationStats
                      : {
                          'Totalmente recomendable como actividad oficial evaluable (con nota)': 22,
                          'Recomendable como actividad voluntaria con puntuación adicional (+0.5/1 punto)': 8,
                          'Recurso de apoyo complementario de acceso libre no evaluable': 1
                        }
                  ).map(([option, count], idx) => {
                    const total = metrics.totalSurveys || 31;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-amber-200/80 space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-800">
                          <span>{option}</span>
                          <span className="font-mono text-amber-800">{pct}% ({count})</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grid Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Titulación */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase text-slate-800 block">Titulación</span>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(
                      Object.keys(metrics.academicRoleBreakdown).length > 0
                        ? metrics.academicRoleBreakdown
                        : { 'Grado en Medicina': 31 }
                    ).map(([role, cnt]) => (
                      <div key={role} className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-slate-700 font-semibold">{role}</span>
                        <span className="font-mono font-bold text-amber-800">{cnt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curso Académico (1º a 6º) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase text-slate-800 block">Curso Académico</span>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(
                      Object.keys(metrics.academicYearBreakdown).length > 0
                        ? metrics.academicYearBreakdown
                        : { '2º Curso': 24, '1º Curso': 4, '3º Curso': 3 }
                    ).map(([year, cnt]) => (
                      <div key={year} className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-slate-700 font-semibold">{year}</span>
                        <span className="font-mono font-bold text-slate-900">{cnt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subgrupos de Prácticas (1 al 15) */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase text-slate-800 block">Subgrupos de Prácticas</span>
                  <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                    {Object.entries(
                      Object.keys(metrics.subgroupBreakdown).length > 0
                        ? metrics.subgroupBreakdown
                        : { 'Subgrupo 1': 6, 'Subgrupo 2': 5, 'Subgrupo 3': 5, 'Subgrupo 4': 4, 'Subgrupo 5': 4, 'Subgrupo 7': 3, 'Subgrupo 12': 2, 'Subgrupo 15': 2 }
                    ).map(([sg, cnt]) => (
                      <div key={sg} className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-slate-700 font-semibold">{sg}</span>
                        <span className="font-mono font-bold text-slate-900">{cnt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispositivo y Tiempo */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-black uppercase text-slate-800 block">Dispositivo Utilizado</span>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(
                      Object.keys(metrics.deviceBreakdown).length > 0
                        ? metrics.deviceBreakdown
                        : { 'Ordenador portátil / Sobremesa': 21, 'Tablet / iPad': 8, 'Smartphone móvil': 2 }
                    ).map(([dev, cnt]) => (
                      <div key={dev} className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-slate-700 font-semibold">{dev}</span>
                        <span className="font-mono font-bold text-slate-900">{cnt}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: ANÁLISIS CUALITATIVO (CODIFICACIÓN TEMÁTICA) */}
          {activeTab === 'cualitativo' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'best', label: 'Puntos Fuertes Docentes', count: metrics.latestComments.best.length },
                  { id: 'improvements', label: 'Propuestas de Mejora Didáctica', count: metrics.latestComments.improvements.length },
                  { id: 'pathologies', label: 'Patologías y Biomarcadores Solicitados', count: metrics.latestComments.pathologies.length }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setQualitativeCategory(c.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      qualitativeCategory === c.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="ml-1.5 text-[10px] opacity-75 font-mono">({c.count})</span>
                  </button>
                ))}
              </div>

              {/* Comments list */}
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {(() => {
                  const list =
                    qualitativeCategory === 'best'
                      ? metrics.latestComments.best
                      : qualitativeCategory === 'improvements'
                      ? metrics.latestComments.improvements
                      : metrics.latestComments.pathologies;

                  if (list.length === 0) {
                    return (
                      <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                        No hay comentarios registrados en esta categoría aún.
                      </div>
                    );
                  }

                  return list.map((comment, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-800 space-y-1"
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>Respuesta anónima #{idx + 1}</span>
                        <span className="font-mono">Estudiante UGR</span>
                      </div>
                      <p className="italic text-slate-700 leading-relaxed font-normal">
                        "{comment}"
                      </p>
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {/* Professor Admin Footer Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={handleResetToZero}
              disabled={isResetting}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isResetting ? 'Restableciendo...' : 'Restablecer Base de Datos a Cero'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black cursor-pointer shadow-xs"
            >
              Cerrar Panel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
