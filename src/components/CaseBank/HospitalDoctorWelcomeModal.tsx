import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  Coins, 
  Heart, 
  HelpCircle, 
  X, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Gamepad2, 
  BookOpen, 
  Building2,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { UserProgress, ActiveModule } from '../../types';

interface HospitalDoctorWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProgress?: UserProgress;
  onNavigate?: (module: ActiveModule) => void;
}

export const HospitalDoctorWelcomeModal: React.FC<HospitalDoctorWelcomeModalProps> = ({
  isOpen,
  onClose,
  userProgress,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'casos' | 'dinero'>('casos');
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(() => {
    return localStorage.getItem('ugr_hospital_welcome_dismissed') === 'true';
  });

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('ugr_hospital_welcome_dismissed', 'true');
    } else {
      localStorage.removeItem('ugr_hospital_welcome_dismissed');
    }
    onClose();
  };

  const handleGoToPark = () => {
    handleClose();
    if (onNavigate) {
      onNavigate('juegos');
    }
  };

  if (!isOpen) return null;

  const currentBudget = userProgress?.budget && userProgress.budget >= 1000 ? userProgress.budget : 5000;
  const currentLives = userProgress ? userProgress.lives : 3;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white p-5 sm:p-6 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              title="Cerrar guía"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1 flex-wrap">
              <Building2 className="w-4 h-4" />
              <span>Hospital Universitario • Campus Salud PTS (UGR)</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/70 text-emerald-200 border border-emerald-400/30 font-medium">
                PID 26-158
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>Bienvenida del Tutor Clínico</span>
              <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                Guía de Guardia
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg">
              Instrucciones indispensables para gestionar los casos de urgencias y tu presupuesto analítico.
            </p>
          </div>

          {/* Doctor Character & Speech Bubble Intro */}
          <div className="p-5 sm:p-6 pb-2 bg-gradient-to-b from-teal-50/50 to-white border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
            {/* Doctor Vector Illustration */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 shadow-md shadow-teal-700/20">
                <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center relative">
                  {/* Doctor Drawing (Custom SVG Artwork) */}
                  <svg
                    viewBox="0 0 160 160"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background Soft Hospital Circle */}
                    <circle cx="80" cy="80" r="76" fill="#F0FDFA" />
                    <circle cx="80" cy="80" r="64" fill="#CCFBF1" />
                    
                    {/* Medical Cross Background Watermark */}
                    <path d="M72 35H88V125H72V35Z" fill="#99F6E4" opacity="0.4" />
                    <path d="M35 72H125V88H35V72Z" fill="#99F6E4" opacity="0.4" />

                    {/* Doctor Body - White Coat & Teal Scrubs */}
                    <path d="M30 160C30 126 50 110 80 110C110 110 130 126 130 160H30Z" fill="#0D9488" />
                    {/* White Lab Coat Lapels */}
                    <path d="M40 160L52 114L80 142L108 114L120 160H40Z" fill="#FFFFFF" />
                    <path d="M52 114L80 138V160H74V142L48 116L52 114Z" fill="#F1F5F9" />
                    <path d="M108 114L80 138V160H86V142L112 116L108 114Z" fill="#E2E8F0" />
                    
                    {/* Teal Scrub V-Neck */}
                    <path d="M68 110L80 124L92 110H68Z" fill="#0F766E" />

                    {/* Hospital ID Badge on Coat Pocket */}
                    <rect x="94" y="128" width="16" height="20" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                    <rect x="96" y="130" width="12" height="6" rx="1" fill="#0284C7" />
                    <line x1="96" y1="139" x2="108" y2="139" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="96" y1="143" x2="105" y2="143" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Stethoscope around neck */}
                    <path
                      d="M58 112C58 132 68 140 76 140C80 140 84 135 84 130C84 125 78 123 78 123"
                      stroke="#475569"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M102 112C102 128 94 136 86 138"
                      stroke="#475569"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Stethoscope Chest Piece */}
                    <circle cx="77" cy="141" r="5" fill="#94A3B8" stroke="#334155" strokeWidth="2" />

                    {/* Neck */}
                    <rect x="71" y="94" width="18" height="20" rx="6" fill="#FBCFE8" />
                    <rect x="71" y="94" width="18" height="20" rx="6" fill="#FDBA74" opacity="0.4" />

                    {/* Head / Face */}
                    <circle cx="80" cy="72" r="28" fill="#FDE047" opacity="0.1" />
                    <circle cx="80" cy="72" r="26" fill="#FED7AA" />

                    {/* Friendly Smile & Cheeks */}
                    <path d="M72 82C74 86 86 86 88 82" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <circle cx="68" cy="78" r="3.5" fill="#F43F5E" opacity="0.25" />
                    <circle cx="92" cy="78" r="3.5" fill="#F43F5E" opacity="0.25" />

                    {/* Eyes - Happy and Warm */}
                    <circle cx="70" cy="69" r="3" fill="#1E293B" />
                    <circle cx="71" cy="68" r="1" fill="#FFFFFF" />
                    <circle cx="90" cy="69" r="3" fill="#1E293B" />
                    <circle cx="91" cy="68" r="1" fill="#FFFFFF" />

                    {/* Eyebrows */}
                    <path d="M66 63C68 61 74 62 75 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M94 63C92 61 86 62 85 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />

                    {/* Nose */}
                    <path d="M79 72L78 76H82" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                    {/* Doctor Modern Hair */}
                    <path
                      d="M54 70C53 52 64 42 80 42C96 42 107 52 106 70C106 72 104 64 100 60C96 56 89 54 80 54C71 54 64 56 60 60C56 64 54 72 54 70Z"
                      fill="#78350F"
                    />

                    {/* Pen in pocket */}
                    <rect x="58" y="132" width="2" height="10" rx="1" fill="#2563EB" />
                    <rect x="62" y="134" width="2" height="8" rx="1" fill="#DC2626" />
                  </svg>
                </div>
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Speech Bubble / Dialogue */}
            <div className="flex-1 bg-white p-3.5 sm:p-4 rounded-2xl border border-teal-100 shadow-xs relative">
              <div className="hidden sm:block absolute -left-2 top-6 w-3 h-3 bg-white border-l border-b border-teal-100 rotate-45" />
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                  <span className="text-emerald-600">Dr. Carlos Morales</span>
                  <span className="text-[10px] text-slate-400 font-semibold">• Tutor Clínico de Bioquímica UGR</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  En servicio activo
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                «¡Hola, colega! Te doy la bienvenida al Hospital Universitario. Hoy eres el médico responsable de la guardia de urgencias. Antes de comenzar a atender pacientes, es imprescindible que conozcas cómo funciona el <strong className="text-slate-900">Banco de Casos</strong> y la regla de oro de tu <strong className="text-amber-800">Presupuesto de Analíticas</strong>.»
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics Bar */}
          <div className="px-5 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>Presupuesto Inicial: <strong className="text-slate-950 font-black">{currentBudget.toLocaleString('es-ES')} €</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-rose-700">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Vidas de Guardia: <strong className="text-slate-950 font-black">{currentLives}/3</strong></span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Planta de Hospitalización & Urgencias</span>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveTab('casos')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'casos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                <span>1. ¿Qué es el Banco de Casos?</span>
              </button>

              <button
                onClick={() => setActiveTab('dinero')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'dinero'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>2. ¿Cómo funciona el Dinero? 💰</span>
              </button>
            </div>

            {/* Tab 1 Content: Banco de Casos */}
            {activeTab === 'casos' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3.5 text-xs text-slate-700 leading-relaxed"
              >
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    🏥
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs mb-1">
                      Pacientes reales y simulados de alta fidelidad
                    </h4>
                    <p className="text-slate-600">
                      Encontrarás casos clínicos organizados por especialidades médicas: <strong>Cardíaco</strong>, <strong>Hepático (Ictericias)</strong>, <strong>Metabólico</strong>, <strong>Renal / Purinas</strong>, <strong>Pancreático-Digestivo</strong> y <strong>Neuromuscular</strong>.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Paso 1: Anamnesis & Exploración
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Revisa la historia clínica, antecedentes, signos vitales y la analítica básica de urgencias. Los parámetros clave aparecen como <em>incógnitas</em>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Paso 2: Selección de Biomarcadores
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Tu objetivo como médico es solicitar <strong>únicamente las pruebas discriminatorias esenciales</strong> que confirmen el diagnóstico sin despilfarrar recursos.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-between gap-3 text-[11px]">
                  <span>💡 <em>Consejo del Tutor:</em> Puedes consultar la <strong>Biblioteca de Biomarcadores</strong> en cualquier momento si tienes dudas sobre los valores o ventanas temporales.</span>
                </div>
              </motion.div>
            )}

            {/* Tab 2 Content: Dinero y Presupuesto */}
            {activeTab === 'dinero' && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 text-xs text-slate-700 leading-relaxed"
              >
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-2xs">
                    💰
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-xs mb-1">
                      Economía Clínica: Los recursos del hospital son limitados
                    </h4>
                    <p className="text-slate-600">
                      En la medicina real, pedir pruebas a ciegas colapsa el laboratorio y encarece la sanidad. Por eso, dispones de una partida de <strong>Fondos Sanitarios (5.000 € de Presupuesto Inicial)</strong> asignada a tu guardia.
                    </p>
                  </div>
                </div>

                {/* Test Costs breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-extrabold text-emerald-700 block">60 € - 80 €</span>
                    <span className="text-[10px] font-bold text-slate-900">Analítica Básica</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">Glucosa, Iones, Transaminasas, Urea</p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-extrabold text-blue-700 block">120 € - 180 €</span>
                    <span className="text-[10px] font-bold text-slate-900">Especializada / Hormonal</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">Troponina, TSH, Insulina, Cloruro en sudor</p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-slate-200 bg-white">
                    <span className="text-[10px] font-extrabold text-purple-700 block">250 € - 300 €</span>
                    <span className="text-[10px] font-bold text-slate-900">Genética / Espectrometría</span>
                    <p className="text-[9px] text-slate-500 mt-0.5">Paneles de ADN, RFLP, Acilcarnitinas</p>
                  </div>
                </div>

                {/* How to recharge money */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                  <div className="flex items-center justify-between font-bold text-xs text-emerald-900">
                    <span className="flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-emerald-700" />
                      <span>¿Te estás quedando sin dinero? ¡Visita el Parque!</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-extrabold">
                      +150 € a +300 € 💰
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Si tu presupuesto baja o te quedas a cero, acude a la <strong>Zona Lúdica del Parque</strong>. Cada minijuego que superes (el <em>Rosco de Pasapalabra</em>, las <em>Preguntas del Reanimador</em> o el <em>Clasificador Flash</em>) recargará tus fondos para que puedas seguir pidiendo analíticas y sumando puntos XP.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 sm:p-6 pt-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Don't show again toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>No mostrar automáticamente al entrar</span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={handleGoToPark}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-600" />
                <span>Ganar Dinero al Parque</span>
              </button>

              <button
                onClick={handleClose}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <span>¡Entendido, Comenzar Guardia!</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
