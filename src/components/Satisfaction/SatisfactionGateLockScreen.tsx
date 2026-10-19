import React from 'react';
import {
  Lock,
  Sparkles,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  Stethoscope,
  Trees,
  FlaskConical,
  Award,
  Coins,
  ShieldAlert
} from 'lucide-react';

interface SatisfactionGateLockScreenProps {
  reason?: 'access_park' | 'cases_milestone' | 'access_advanced_labs' | 'general';
  onOpenSurvey: () => void;
  onBackToHome: () => void;
}

export const SatisfactionGateLockScreen: React.FC<SatisfactionGateLockScreenProps> = ({
  reason = 'general',
  onOpenSurvey,
  onBackToHome
}) => {
  const getHeaderInfo = () => {
    switch (reason) {
      case 'access_park':
        return {
          badge: 'Parque Biomédico Bloqueado',
          title: 'Acceso Restringido al Parque Lúdico',
          description:
            'Para disfrutar de los minijuegos (El Rosco de Bioquímica, Crucigrama y Sopa de Letras) y recargar vidas o presupuesto para tus guardias, debes completar primero la encuesta docente de satisfacción.',
          icon: <Trees className="w-8 h-8 text-emerald-400" />
        };
      case 'cases_milestone':
        return {
          badge: 'Hito Docente (4 Casos Completados)',
          title: 'Has completado los 4 casos clínicos de prueba',
          description:
            'Has completado los 4 casos clínicos de entrenamiento en el Hospital. Para continuar resolviendo pacientes adicionales y acceder al Parque Biomédico, el equipo docente solicita tu valoración anónima de la plataforma (~90 seg). La Biblioteca y Simuladores continúan abiertos.',
          icon: <Stethoscope className="w-8 h-8 text-rose-400" />
        };
      case 'access_advanced_labs':
        return {
          badge: 'Acceso a la Biblioteca',
          title: 'Simuladores y Recursos de Aprendizaje',
          description:
            'Los simuladores metabólicos interactivos y el vademécum de biomarcadores están siempre a tu disposición para preparar casos y seminarios.',
          icon: <FlaskConical className="w-8 h-8 text-blue-400" />
        };
      default:
        return {
          badge: 'Requisito de Calidad Docente',
          title: 'Encuesta de Satisfacción Oficial',
          description:
            'Para continuar resolviendo casos clínicos y acceder al parque lúdico, completa la encuesta de satisfacción y usabilidad del PID 26-158 (~90 seg).',
          icon: <Lock className="w-8 h-8 text-amber-400" />
        };
    }
  };

  const info = getHeaderInfo();

  return (
    <div className="max-w-4xl mx-auto my-6 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white rounded-3xl border border-amber-200/90 shadow-xl overflow-hidden">
        {/* Top Institutional Header */}
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
                {info.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-950/80 text-amber-200 px-2.5 py-0.5 rounded border border-amber-500/40">
                    PID 26-158 · UGR
                  </span>
                  <span className="text-[10px] font-bold bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-300" />
                    {info.badge}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {info.title}
                </h1>
                <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-2xl leading-relaxed">
                  {info.description}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-center justify-center p-3.5 rounded-2xl bg-amber-950/70 border border-amber-400/30 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Duración estimada</span>
              <span className="text-xl font-black text-white">~90 seg</span>
              <span className="text-[10px] text-amber-200/80 font-medium">100% Anónima</span>
            </div>
          </div>
        </div>

        {/* Reward Callout */}
        <div className="bg-amber-50 border-y border-amber-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/15 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-950 block">
                Recompensa Automática al Enviar la Encuesta
              </span>
              <span className="text-xs text-amber-800">
                Se añadirá inmediatamente a tu perfil de estudiante de la Universidad de Granada:
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>+150 XP</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span>+100 € Presupuesto</span>
            </div>
          </div>
        </div>

        {/* Content Preview & Lock Details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
              <GraduationCap className="w-4 h-4 text-amber-700" />
              <span>Evaluación Docente Oficial · Bioquímica Médica</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              ¿Por qué es necesario responder la encuesta?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              En el marco del Proyecto de Innovación Docente PID 26-158 de la Universidad de Granada,
              necesitamos medir la usabilidad (mediante la escala estandarizada SUS) y la satisfacción real
              con los módulos formativos para calibrar la docencia y justificar la memoria oficial.
            </p>
          </div>

          {/* Grid of Locked Features that will unlock */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🏥</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Desbloqueable
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Casos Clínicos Continuos</h3>
              <p className="text-xs text-slate-600">
                Resuelve todos los pacientes del catálogo y avanza en las guardias de urgencias sin límites.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🎡</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Desbloqueable
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Parque Biomédico Completo</h3>
              <p className="text-xs text-slate-600">
                Acceso a El Rosco de Bioquímica, Crucigrama clínico, Sopa de letras y ruleta de vidas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📚</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Siempre Abierto
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Biblioteca y Simuladores</h3>
              <p className="text-xs text-slate-600">
                Acceso libre permanente al vademécum y simuladores de Randle, ictericias, hemostasia e integración metabólica.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onBackToHome}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Pantalla de Inicio</span>
            </button>

            <button
              onClick={onOpenSurvey}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-800 hover:to-amber-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ring-2 ring-amber-400/40 group"
            >
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span>Completar Encuesta Ahora y Desbloquear Todo</span>
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Las respuestas se guardan de forma anónima en la base de datos de Firebase Firestore para la Memoria Docente UGR.
          </div>
        </div>
      </div>
    </div>
  );
};
