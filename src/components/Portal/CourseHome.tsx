import React from 'react';
import { ActiveModule } from '../../types';
import { 
  Building2,
  Trees,
  Stethoscope, 
  FlaskConical, 
  BookOpen, 
  Award, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  Layers, 
  Droplets, 
  RefreshCw, 
  CheckCircle2, 
  GraduationCap,
  Clock,
  Bell,
  FileText
} from 'lucide-react';
import { InteractiveCityEntrance } from '../City/InteractiveCityEntrance';
import { CLINICAL_CASES_DATABASE } from '../../data/clinicalCases';

interface CourseHomeProps {
  onNavigate: (module: ActiveModule) => void;
  onOpenLab?: (lab: 'randle' | 'ictericias' | 'hemostasia') => void;
  onStartTour?: () => void;
  userXP?: number;
  completedCasesCount?: number;
}

export const CourseHome: React.FC<CourseHomeProps> = ({
  onNavigate,
  onOpenLab,
  onStartTour,
  userXP = 0,
  completedCasesCount = 0
}) => {
  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. HERO ENTRANCE: Isometric Biomedical City with 3 Key Places (Hospital, Biblioteca, Parque) */}
      <InteractiveCityEntrance 
        onNavigate={onNavigate}
        onOpenLab={onOpenLab}
        casesCount={CLINICAL_CASES_DATABASE.length}
      />

      {/* Institutional Faculty Info Banner in Warm Medical Gold */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-10 border border-amber-800 shadow-md relative overflow-hidden">
        {/* Subtle decorative warm glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-900/60 text-amber-200 border border-amber-400/40 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Facultad de Medicina • Universidad de Granada (UGR)
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-amber-100 bg-amber-900/40 border border-amber-500/30">
              Campus de la Salud (PTS) • Curso Académico 2026/2027 (26-27)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Departamento de Bioquímica y Biología Molecular III e Inmunología
            <span className="block text-lg sm:text-xl font-normal text-amber-100 mt-1">
              Portal Oficial de la Asignatura y Plataforma de Aprendizaje Clínico
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-amber-50/90 leading-relaxed max-w-3xl">
            Bienvenido al entorno docente digital del Departamento de Bioquímica y Biología Molecular III e Inmunología. Aquí encontrará el <strong className="text-white">simulador clínico de casos reales y biomarcadores</strong>, los <strong className="text-white">laboratorios virtuales interactivos</strong> (Ciclo de Randle, Ictericias, Hemostasia) y todo el <strong className="text-white">material docente acreditado</strong> para el Grado en Medicina.
          </p>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            {onStartTour && (
              <button
                id="tour-quick-tutorial-btn-portal"
                onClick={onStartTour}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
                <span>Tutorial rápido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onNavigate('casos')}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-white" />
              <span>Entrar a Casos Clínicos (Hospital)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('docencia')}
              className="px-4 py-2.5 rounded-xl bg-amber-900/60 hover:bg-amber-900/90 text-white text-xs sm:text-sm font-semibold border border-amber-400/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-200" />
              <span>Biblioteca & Materiales</span>
            </button>

            <button
              onClick={() => onNavigate('laboratorios')}
              className="px-4 py-2.5 rounded-xl bg-amber-900/60 hover:bg-amber-900/90 text-white text-xs sm:text-sm font-semibold border border-amber-400/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-amber-200" />
              <span>Laboratorios Virtuales</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid: Access to Key Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Estructura Docente
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Espacios de Aprendizaje y Prácticas
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Clinical Simulator */}
          <div 
            onClick={() => onNavigate('casos')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Simulador de Casos Clínicos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Entrenamiento con pacientes virtuales. Petición analítica razonada, coste de biomarcadores y retroalimentación bioquímica inmediata.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Acceder al Banco de Casos</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Interactive Labs */}
          <div 
            onClick={() => onNavigate('laboratorios')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Laboratorios Interactivos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modelos cinéticos dinámicos: el Ciclo de Randle, Simulador de Ictericias de adulto/neonato y la Cascada de Coagulación.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Abrir Simuladores</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Teaching Material */}
          <div 
            onClick={() => onNavigate('docencia')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-blue-400 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Material Docente Oficial
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Temario oficial de 27 temas, calendario de prácticas y seminarios, preguntas tipo test de autoevaluación comentadas y bibliografía docente oficial.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Consultar Temario</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Biomarker Library */}
          <div 
            onClick={() => onNavigate('biblioteca')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-slate-300 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Biblioteca de Biomarcadores
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compendio analítico completo: valores de referencia, ventanas cinéticas, sensibilidad, especificidad y falsos positivos.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Ver Fichas Analíticas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section: The 3 Interactive Labs from Last Year */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
              Biblioteca Biomédica • Materiales de Apoyo al Aprendizaje
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Simuladores Interactivos de Fisiopatología Molecular (Biblioteca)
            </h2>
          </div>
          <button
            onClick={() => onNavigate('laboratorios')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Ver todos los laboratorios</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Lab 1: Randle */}
          <div 
            onClick={() => {
              onNavigate('laboratorios');
              if (onOpenLab) onOpenLab('randle');
            }}
            className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔄</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Metabolismo
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              El Ciclo de Randle
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Navegador metabólico interactivo. Competencia entre glucosa y ácidos grasos por el Acetil-CoA en ayuno y postprandio. Regulación por Malonil-CoA y CAT-1.
            </p>
            <span className="text-xs font-bold text-emerald-400 block pt-2">Abrir Navegador ➔</span>
          </div>

          {/* Lab 2: Ictericias */}
          <div 
            onClick={() => {
              onNavigate('laboratorios');
              if (onOpenLab) onOpenLab('ictericias');
            }}
            className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🧪</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Diagnóstico Clínico
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Simulador de Ictericias
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diagnóstico diferencial de ictericias con sliders analíticos de BT, BD, transaminasas y FA. Probeta de orina reactiva, acolia fecal y panel neonatal BIND/Kramer.
            </p>
            <span className="text-xs font-bold text-emerald-400 block pt-2">Iniciar Simulación ➔</span>
          </div>

          {/* Lab 3: Hemostasia */}
          <div 
            onClick={() => {
              onNavigate('laboratorios');
              if (onOpenLab) onOpenLab('hemostasia');
            }}
            className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">🩸</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Hematología
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              Hemostasia & Coagulación
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plataforma interactiva con animación paso a paso de la cascada intrínseca, extrínseca y común, señalización plaquetaria AMPc/calcio y la Tríada de Virchow.
            </p>
            <span className="text-xs font-bold text-emerald-400 block pt-2">Ver Cascada ➔</span>
          </div>
        </div>
      </div>

      {/* Section: Avisos de Nuevo Material y Actualizaciones Disponibles */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Avisos de Nuevo Material y Actualizaciones
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Activo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Materiales, casos clínicos y guías de estudio recién incorporados al campus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3 Recursos Disponibles</span>
            </span>
          </div>
        </div>

        {/* Notices Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Notice 1: Nuevo Caso en el Hospital */}
          <div className="bg-rose-50/40 rounded-xl border border-rose-200/80 p-4 space-y-3 flex flex-col justify-between hover:border-rose-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  <span>Hospital • Urgencias</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Nuevo</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                Caso Clínico: Cetoacidosis Diabética e Hiperpotasemia Severa
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Nuevo caso con analítica de gasometría arterial, cetonemia, ionograma con cálculo de Anión Gap e indicación de insulinoterapia.
              </p>
            </div>

            <button
              onClick={() => onNavigate('casos')}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Resolver en el Hospital</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notice 2: Nuevo Material en la Biblioteca */}
          <div className="bg-blue-50/40 rounded-xl border border-blue-200/80 p-4 space-y-3 flex flex-col justify-between hover:border-blue-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Biblioteca • Estudio</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Actualizado</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                Guía Docente: Algoritmos ESC 2024 para Troponina Ultrasensible
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Documento docente oficial con curvas cinéticas de elevación precoz (0h/1h/3h) y diagnóstico diferencial entre SCA y daño miocárdico secundario.
              </p>
            </div>

            <button
              onClick={() => onNavigate('docencia')}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Consultar en Biblioteca</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Notice 3: Nuevo Laboratorio en el Parque */}
          <div className="bg-emerald-50/40 rounded-xl border border-emerald-200/80 p-4 space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Trees className="w-3 h-3" />
                  <span>Parque • Gamificación</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Interactivo</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                Simulador Dinámico de Hemostasia y Cascada de Coagulación
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Laboratorio virtual interactivo con animación paso a paso de las vías intrínseca, extrínseca y común, y pruebas de TTPA e INR.
              </p>
            </div>

            <button
              onClick={() => onNavigate('laboratorios')}
              className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <span>Jugar en el Parque</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Automatic Material Upload Notification Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Detección automática:</strong> Cada vez que se suba nuevo material a Firestore o se genere un caso clínico, estará disponible y catalogado con aviso activo en esta sección.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-slate-500 text-[11px]">Casos resueltos: <strong>{completedCasesCount}</strong></span>
            <button
              onClick={() => onNavigate('estadisticas')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
            >
              Ver mi expediente ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
