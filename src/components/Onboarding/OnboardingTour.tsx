import React, { useState, useEffect } from 'react';
import {
  Joyride,
  Step,
  TooltipRenderProps,
  EventData,
  STATUS,
  ACTIONS,
  EVENTS
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
  Wallet,
  Compass
} from 'lucide-react';

interface OnboardingTourProps {
  run: boolean;
  onFinishTour: () => void;
}

const TOUR_STEPS: Step[] = [
  {
    target: '#tour-welcome-header',
    title: '¡Bienvenido a la Ciudad Biomédica UGR!',
    content: (
      <div className="space-y-2">
        <p>
          Este portal es la plataforma oficial de aprendizaje clínico del{' '}
          <strong className="text-slate-900">
            Departamento de Bioquímica y Biología Molecular III e Inmunología
          </strong>{' '}
          (Facultad de Medicina, Campus de la Salud PTS, UGR).
        </p>
        <p className="text-slate-500 text-[11px] leading-relaxed">
          Aquí entrenarás la toma de decisiones médicas, la petición razonada de pruebas diagnósticas y el dominio metabólico a través de tres áreas principales:{' '}
          <strong className="text-rose-700">Hospital</strong>,{' '}
          <strong className="text-blue-700">Biblioteca</strong> y{' '}
          <strong className="text-emerald-700">Juegos</strong>.
        </p>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-hospital',
    title: '🏥 1. Hospital Clínico (Casos Reales)',
    content: (
      <div className="space-y-2">
        <p>
          En el <strong className="text-slate-900">Hospital Universitario</strong> asumirás el papel de médico de guardia ante{' '}
          <strong className="text-rose-700">16 casos clínicos reales</strong> clasificados por sistemas orgánicos (cardíaco, hepático, metabólico, renal...).
        </p>
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-tight space-y-1">
          <p className="font-bold flex items-center gap-1">
            <span>💰 Presupuesto Sanitario (5.000 € iniciales):</span>
          </p>
          <p>
            Cada biomarcador solicitado consume entre 60 € y 300 €. Pide solo los discriminatorios clave para no agotar los fondos de la guardia.
          </p>
        </div>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-biblioteca',
    title: '📚 2. Biblioteca Biomédica (Materiales & Labs)',
    content: (
      <div className="space-y-2">
        <p>
          Tu base de estudio y documentación acreditada:
        </p>
        <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
          <li>
            <strong className="text-slate-900">Temario Oficial:</strong> 27 temas teóricos completos de Bioquímica Médica.
          </li>
          <li>
            <strong className="text-slate-900">Prácticas y Seminarios:</strong> Calendario, grupos y turnos de laboratorio.
          </li>
          <li>
            <strong className="text-slate-900">Simuladores Virtuales:</strong> Integración Metabólica (Atlas & Curvas de Cahill), Ciclo de Randle, Ictericias y Hemostasia.
          </li>
          <li>
            <strong className="text-slate-900">Vademécum de Biomarcadores:</strong> Más de 40 fichas con valores de corte, cinética y sensibilidad.
          </li>
        </ul>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-parque',
    title: '🌳 3. Parque Biomédico (Juegos & Ganar Dinero)',
    content: (
      <div className="space-y-2">
        <p>
          Espacio lúdico de gamificación para afianzar conceptos y recuperar fondos sanitarios:
        </p>
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px] leading-tight space-y-1.5">
          <p>
            <strong className="text-emerald-800">⭕ El Rosco Metabólico:</strong> 25 letras tipo Pasapalabra para ganar dinero hospitalario (+250 € a +300 €).
          </p>
          <p>
            <strong className="text-emerald-800">🔍 Sopa de Letras & Crucigrama:</strong> Reconocimiento de biomarcadores e integración diagnóstica.
          </p>
          <p>
            <strong className="text-emerald-800">⚡ Reto Diario STAT:</strong> Caso rápido de 2 minutos con bonificador <strong className="text-emerald-900">2.0x XP</strong>.
          </p>
        </div>
      </div>
    ),
    placement: 'top',
    skipBeacon: true
  },
  {
    target: '#tour-stats-bar',
    title: '💼 Monitor de Guardia y Recursos',
    content: (
      <div className="space-y-2">
        <p>
          Controla en tiempo real tu experiencia como alumno (<strong className="text-amber-800">XP</strong>), tus vidas de guardia y el número de casos superados.
        </p>
        <p className="text-slate-500 text-[11px]">
          Si te quedas sin presupuesto en una guardia, puedes volver al Parque a ganar fondos respondiendo minijuegos.
        </p>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  },
  {
    target: '#tour-quick-tutorial-btn',
    title: '✨ ¡Listo para Iniciar tu Guardia!',
    content: (
      <div className="space-y-2">
        <p>
          Puedes volver a lanzar este <strong className="text-slate-900">Tutorial Rápido</strong> en cualquier momento desde este botón en la pantalla de bienvenida o desde la barra superior.
        </p>
        <p className="font-semibold text-amber-900 text-xs">
          Haz clic en el Hospital para atender a tu primer paciente o explora la Biblioteca y los Juegos. ¡Mucho éxito en la guardia!
        </p>
      </div>
    ),
    placement: 'bottom',
    skipBeacon: true
  }
];

const TourTooltip: React.FC<TooltipRenderProps> = ({
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
  size
}) => {
  return (
    <div
      {...tooltipProps}
      className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border-2 border-amber-500/20 text-slate-800 animate-in fade-in zoom-in-95 duration-150 relative z-[10000]"
      style={{ minWidth: 300 }}
    >
      <button
        {...closeProps}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        title="Cerrar tutorial"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 mb-2.5">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-700" />
          <span>Tutorial Rápido</span>
        </span>
        <span className="text-[11px] font-bold text-slate-400">
          Paso {index + 1} de {size}
        </span>
      </div>

      {step.title && (
        <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 pr-6 leading-tight">
          {step.title}
        </h3>
      )}

      <div className="text-xs text-slate-600 leading-relaxed mb-5">
        {step.content}
      </div>

      {/* Progress Dots & Actions */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between">
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

        <div className="flex items-center justify-end gap-2 pt-1">
          {index > 0 && (
            <button
              {...backProps}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
          )}

          <button
            {...primaryProps}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{isLastStep ? '¡Empezar a Explorar!' : 'Siguiente'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onFinishTour }) => {
  const [tourKey, setTourKey] = useState(0);

  // When run changes from false to true, refresh key to ensure tour starts from step 0
  useEffect(() => {
    if (run) {
      setTourKey((prev) => prev + 1);
    }
  }, [run]);

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
      tooltipComponent={TourTooltip}
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
