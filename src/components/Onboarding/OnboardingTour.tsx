import React, { useState, useEffect } from 'react';
import {
  Joyride,
  Step,
  TooltipRenderProps,
  EventData,
  STATUS,
  ACTIONS
} from 'react-joyride';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Stethoscope,
  BookOpen,
  Gamepad2,
  CheckCircle2,
  HelpCircle,
  Coins,
  Activity,
  Layers,
  Award
} from 'lucide-react';

export const DONT_SHOW_TOUR_STORAGE_KEY = 'biomark_dont_show_tour_on_startup';

interface OnboardingTourProps {
  run: boolean;
  onFinishTour: () => void;
}

const TOUR_STEPS: Step[] = [
  {
    target: '#tour-welcome-header',
    title: '🏛️ ¡Bienvenido a la Ciudad Biomédica UGR!',
    content: (
      <div className="space-y-2.5 text-xs">
        <p className="leading-relaxed">
          Esta es la plataforma oficial de aprendizaje clínico del{' '}
          <strong className="text-slate-900 font-bold">
            Departamento de Bioquímica y Biología Molecular III e Inmunología
          </strong>{' '}
          (Facultad de Medicina, Campus de la Salud PTS, Universidad de Granada • Proyecto PID 26-158).
        </p>
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] leading-relaxed space-y-1">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            <span>🎯 Objetivo formativo:</span>
          </p>
          <p>
            Aprenderás a interpretar biomarcadores moleculares en situaciones clínicas reales, optimizando el coste sanitario y dominando la integración metabólica a través de 3 distritos clave:
          </p>
          <div className="grid grid-cols-3 gap-1.5 pt-1 text-center font-bold text-[10px]">
            <span className="p-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-200">1. Hospital</span>
            <span className="p-1 rounded-lg bg-blue-100 text-blue-800 border border-blue-200">2. Biblioteca</span>
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">3. Parque</span>
          </div>
        </div>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-hospital',
    title: '🏥 1. Hospital Clínico: Casos Reales y Toma de Decisiones',
    content: (
      <div className="space-y-2.5 text-xs">
        <p className="leading-relaxed">
          En el <strong className="text-slate-900">Hospital Universitario</strong> actuarás como médico de guardia ante{' '}
          <strong className="text-rose-700">31 casos clínicos interactivos</strong> clasificados por sistemas orgánicos (Cardiovascular, Hepático, Metabólico, Renal, Pancreático y Neuromuscular).
        </p>
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-[11px] leading-relaxed space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-rose-900">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>Presupuesto Sanitario (5.000 € iniciales):</span>
          </div>
          <p>
            Cada biomarcador solicitado consume entre 60 € y 300 €. Debes seleccionar con criterio clínico únicamente las pruebas discriminatorias clave para no agotar los fondos de la guardia.
          </p>
          <p className="text-[10px] text-rose-700 font-medium">
            Al confirmar tu sospecha diagnóstica obtendrás retroalimentación inmediata, puntuación y experiencia (XP).
          </p>
        </div>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-biblioteca',
    title: '📚 2. Biblioteca Médica: Temario, Vademécum & Labs',
    content: (
      <div className="space-y-2.5 text-xs">
        <p className="leading-relaxed">
          Tu centro neurálgico de documentación, estudio y simulación molecular acreditada:
        </p>
        <div className="space-y-1.5 text-[11px] text-slate-700">
          <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
            <p>
              <strong className="text-blue-900">📖 Temario Oficial:</strong> 27 temas completos del programa teórico de Bioquímica Médica (7 créditos ECTS).
            </p>
            <p>
              <strong className="text-blue-900">🧪 Vademécum de Biomarcadores:</strong> Catálogo con más de 40 fichas analíticas con valores de referencia (convencionales y SI), ventanas cinéticas (inicio, pico, aclaramiento) y especificidad diagnóstica.
            </p>
            <p>
              <strong className="text-blue-900">⚗️ Simuladores Fisiopatológicos:</strong> Ciclo de Randle, Ictericias, Hemostasia y Lanzadera de Carnitina con explicaciones bioquímicas contextuales ('i').
            </p>
            <p>
              <strong className="text-blue-900">📅 Prácticas y Seminarios:</strong> Calendario interactivo por subgrupos 1 al 15 (LAB L-5/6 y Aula S3).
            </p>
          </div>
        </div>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-parque',
    title: '🌳 3. Parque Lúdico: Minijuegos & Ganar Dinero Hospitalario',
    content: (
      <div className="space-y-2.5 text-xs">
        <p className="leading-relaxed">
          Espacio interactivo de gamificación diseñado para afianzar conceptos y recuperar fondos para la guardia médica:
        </p>
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] leading-relaxed space-y-1.5">
          <p>
            <strong className="text-emerald-800">⭕ El Rosco Metabólico:</strong> 25 letras tipo Pasapalabra con definiciones bioquímicas. Cada acierto suma entre <strong className="text-emerald-900">+250 € y +300 € de fondos sanitarios</strong>.
          </p>
          <p>
            <strong className="text-emerald-800">🔍 Sopa de Letras & Crucigrama Clínico:</strong> Reconocimiento activo de metabolitos y enzimas clave.
          </p>
          <p>
            <strong className="text-emerald-800">⚡ Reto Diario STAT:</strong> Caso contrarreloj de 2 minutos con multiplicador <strong className="text-emerald-900">2.0x XP</strong> y racha diaria de días consecutivos.
          </p>
        </div>
      </div>
    ),
    placement: 'top',
    skipBeacon: true
  },
  {
    target: '#tour-stats-bar',
    title: '💼 Monitor de Guardia y Recursos del Estudiante',
    content: (
      <div className="space-y-2.5 text-xs">
        <p className="leading-relaxed">
          En esta barra superior puedes consultar en tiempo real el estado de tu guardia:
        </p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="font-bold text-amber-700 block">💰 Fondos (€):</span>
            <span className="text-slate-600 text-[10px]">Tu presupuesto de guardia para pedir analíticas en el Hospital.</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="font-bold text-emerald-700 block">⭐ XP (Experiencia):</span>
            <span className="text-slate-600 text-[10px]">Puntos ganados al resolver casos y responder correctamente.</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="font-bold text-rose-700 block">❤️ Vidas de Guardia:</span>
            <span className="text-slate-600 text-[10px]">Intentos disponibles antes de necesitar reposición.</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
            <span className="font-bold text-amber-600 block">🔥 Racha Diaria:</span>
            <span className="text-slate-600 text-[10px]">Días consecutivos entrando a la plataforma.</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 italic">
          Tip: Si te quedas sin presupuesto en el Hospital, dirígete al Parque y juega a El Rosco para ganar dinero de inmediato.
        </p>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-quick-tutorial-btn',
    title: '✨ ¡Listo para Iniciar tu Aprendizaje!',
    content: (
      <div className="space-y-2.5 text-xs">
        <p className="leading-relaxed">
          Ya conoces las herramientas principales de la Ciudad Biomédica UGR. Puedes comenzar atendiendo pacientes en el <strong className="text-slate-900">Hospital</strong> o explorando el material de la <strong className="text-slate-900">Biblioteca</strong> y los juegos del <strong className="text-slate-900">Parque</strong>.
        </p>
        <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-[11px] leading-relaxed">
          <p className="font-bold text-amber-900">
            🎓 ¡Mucho éxito en tu guardia formativa!
          </p>
          <p className="text-slate-600 text-[10px] mt-1">
            Pon a prueba tu criterio bioquímico, ahorra recursos sanitarios y alcanza el Top 10 del ranking del curso.
          </p>
        </div>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  }
];

interface CustomTooltipProps extends TooltipRenderProps {
  dontShowAgain: boolean;
  onToggleDontShowAgain: (checked: boolean) => void;
}

const TourTooltip: React.FC<CustomTooltipProps> = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
  size,
  dontShowAgain,
  onToggleDontShowAgain
}) => {
  return (
    <div
      {...tooltipProps}
      className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-500/30 text-slate-800 animate-in fade-in zoom-in-95 duration-150 relative z-[10000]"
      style={{ minWidth: 320 }}
    >
      {/* Top Close Button */}
      <button
        {...closeProps}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        title="Cerrar tutorial"
        aria-label="Cerrar tutorial"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Top Tag & Step Progress */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs">
          <Sparkles className="w-3 h-3 text-amber-700" />
          <span>Tutorial Rápido</span>
        </span>
        <span className="text-[11px] font-bold text-slate-400">
          Paso {index + 1} de {size}
        </span>
      </div>

      {/* Step Title */}
      {step.title && (
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 pr-6 leading-tight">
          {step.title}
        </h3>
      )}

      {/* Step Rich Content */}
      <div className="text-xs text-slate-600 leading-relaxed mb-4">
        {step.content}
      </div>

      {/* Step Indicator Dots & Skip Action */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: size }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index
                  ? 'w-6 bg-amber-600'
                  : i < index
                  ? 'w-2 bg-amber-300'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>

        <button
          {...skipProps}
          className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          Saltar tutorial
        </button>
      </div>

      {/* Bottom Controls: Explicit Reminder + "No volver a mostrar" + Next/Back Buttons */}
      <div className="pt-3 space-y-3">
        {/* Institutional reminder banner */}
        <div className="rounded-2xl bg-amber-50/90 border border-amber-300/80 p-2.5 text-xs text-amber-950 flex items-start gap-2 shadow-2xs">
          <div className="w-5 h-5 rounded-lg bg-amber-200/90 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            <Sparkles className="w-3 h-3 text-amber-700" />
          </div>
          <div className="text-[11px] leading-snug">
            <span className="font-bold text-amber-950 block">¿Tienes cualquier duda más adelante?</span>
            <span className="text-amber-900">
              Recuerda que tienes el apartado de <strong className="font-bold text-amber-950 underline decoration-amber-400">«Tutorial Rápido»</strong> siempre disponible en la barra superior y en el inicio para consultarlo cuando lo desees.
            </span>
          </div>
        </div>

        {/* Checkbox "No volver a mostrar" and Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 hover:text-slate-900 group">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => onToggleDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer accent-amber-600 transition-transform group-hover:scale-105"
            />
            <span className="font-semibold text-slate-700 group-hover:text-slate-950 text-[11px] sm:text-xs">
              No volver a mostrar al entrar
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 shrink-0">
            {index > 0 && (
              <button
                {...backProps}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            )}

            <button
              {...primaryProps}
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{isLastStep ? '¡Empezar a Explorar!' : 'Siguiente'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onFinishTour }) => {
  const [tourKey, setTourKey] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(DONT_SHOW_TOUR_STORAGE_KEY) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  // When run changes from false to true, refresh key to ensure tour starts from step 0
  useEffect(() => {
    if (run) {
      setTourKey((prev) => prev + 1);
    }
  }, [run]);

  const handleToggleDontShowAgain = (checked: boolean) => {
    setDontShowAgain(checked);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(DONT_SHOW_TOUR_STORAGE_KEY, checked ? 'true' : 'false');
      } catch (err) {
        console.warn('Could not save tour preference', err);
      }
    }
  };

  if (!run) return null;

  const handleJoyrideCallback = (data: EventData) => {
    const { status, action } = data;
    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      action === ACTIONS.CLOSE ||
      action === ACTIONS.SKIP
    ) {
      onFinishTour();
    }
  };

  return (
    <Joyride
      key={tourKey}
      steps={TOUR_STEPS}
      run={run}
      continuous
      scrollToFirstStep
      tooltipComponent={(props) => (
        <TourTooltip
          {...props}
          dontShowAgain={dontShowAgain}
          onToggleDontShowAgain={handleToggleDontShowAgain}
        />
      )}
      options={{
        overlayColor: 'rgba(15, 23, 42, 0.75)',
        zIndex: 10000,
        spotlightRadius: 16,
        spotlightPadding: 8,
        skipBeacon: true
      }}
      onEvent={handleJoyrideCallback}
    />
  );
};
