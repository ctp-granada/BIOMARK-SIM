import React, { useState } from 'react';
import { ActiveModule, ClinicalCase, UserProgress } from '../../types';
import { 
  Building2, 
  Stethoscope, 
  BookOpen, 
  Trees, 
  FlaskConical, 
  Zap, 
  Award, 
  Sparkles, 
  Sun, 
  Moon, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Activity, 
  GraduationCap, 
  Flame, 
  Heart, 
  ShieldCheck, 
  Layers, 
  HelpCircle, 
  RotateCcw,
  Volume2,
  VolumeX,
  MapPin,
  ChevronRight,
  ExternalLink,
  Play,
  Gamepad2,
  Coins,
  Wallet,
  Calendar,
  Lock
} from 'lucide-react';
import { satisfactionService } from '../../utils/satisfactionService';

interface BiomedicalCityProps {
  onNavigate: (module: ActiveModule) => void;
  onOpenLab?: (lab: 'randle' | 'ictericias' | 'hemostasia' | 'juegos' | 'rosco' | 'integra') => void;
  onStartChallenge?: (caseData: ClinicalCase) => void;
  onStartDailyChallenge?: () => void;
  userProgress: UserProgress;
  cases: ClinicalCase[];
  onAddXP?: (amount: number) => void;
  onEarnBudget?: (amount?: number) => void;
  onRechargeLife?: (amount?: number) => void;
}

type DistrictId = 'hospital' | 'biblioteca' | 'parque' | null;

interface QuickTriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  system: string;
}

const PARK_TRIVIA_QUESTIONS: QuickTriviaQuestion[] = [
  {
    question: "¿Qué enzima regula la entrada de ácidos grasos a la mitocondria y es inhibida alostéricamente por el Malonil-CoA?",
    options: ["Carnitina Palmitoil Transferasa 1 (CPT-1)", "Piruvato Deshidrogenasa", "HMG-CoA Reductasa", "Citrato Sintasa"],
    correctIndex: 0,
    explanation: "La CPT-1 es el marcapasos de la beta-oxidación. Cuando abunda la glucosa y la insulina, aumenta el Malonil-CoA que inhibe la CPT-1, bloqueando la oxidación lipídica (base del ciclo de Randle).",
    system: "Metabolismo"
  },
  {
    question: "En una ictericia por hemólisis masiva extravascular, ¿qué fracción de bilirrubina predomina en plasma?",
    options: ["Bilirrubina Conjugada / Directa", "Bilirrubina No Conjugada / Indirecta", "Bilirrubina Delta ligada covalentemente a albúmina", "Ambas por igual con coluria"],
    correctIndex: 1,
    explanation: "La degradación exagerada del grupo hemo satura la glucuroniltransferasa hepática (UGT1A1), elevándose la fracción libre o indirecta, la cual es liposoluble y no aparece en orina (no hay coluria).",
    system: "Hepático"
  },
  {
    question: "¿Qué biomarcador es el estándar de oro para el diagnóstico precoz del daño miocárdico con alta sensibilidad a las 2-3 horas?",
    options: ["Troponina I o T de alta sensibilidad (hs-cTn)", "CK-MB total", "Lactato Deshidrogenasa (LDH-1)", "Mioglobina sérica aislada"],
    correctIndex: 0,
    explanation: "Las troponinas cardíacas ultrasensibles (hs-cTnI y hs-cTnT) tienen especificidad miocárdica casi absoluta y permiten el descarte o confirmación en protocolos rápidos a 0h/1h/3h según las guías ESC.",
    system: "Cardíaco"
  },
  {
    question: "¿Qué factor de la coagulación inicia la vía extrínseca al interactuar con el Factor Tisular (FT) tras una lesión endotelial?",
    options: ["Factor VII activado (FVIIa)", "Factor XII (Hageman)", "Factor VIII (Antihemofílico)", "Factor XIII (Estabilizador de fibrina)"],
    correctIndex: 0,
    explanation: "El complejo FT-FVIIa es el desencadenante fisiológico principal de la hemostasia secundaria in vivo, activando directamente al Factor X y al Factor IX.",
    system: "Hemostasia"
  }
];

export const BiomedicalCity: React.FC<BiomedicalCityProps> = ({
  onNavigate,
  onOpenLab,
  onStartChallenge,
  onStartDailyChallenge,
  userProgress,
  cases,
  onAddXP,
  onEarnBudget,
  onRechargeLife
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId>(null);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [hoveredBuilding, setHoveredBuilding] = useState<DistrictId>(null);

  // Trivia Minigame State (Park)
  const [triviaActive, setTriviaActive] = useState<boolean>(false);
  const [triviaQuestionIdx, setTriviaQuestionIdx] = useState<number>(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaAnswerRevealed, setTriviaAnswerRevealed] = useState<boolean>(false);
  const [triviaScore, setTriviaScore] = useState<number>(0);
  const [triviaCompleted, setTriviaCompleted] = useState<boolean>(false);

  const startTrivia = () => {
    setTriviaActive(true);
    setTriviaQuestionIdx(0);
    setSelectedTriviaOption(null);
    setTriviaAnswerRevealed(false);
    setTriviaScore(0);
    setTriviaCompleted(false);
  };

  const handleTriviaAnswer = (index: number) => {
    if (triviaAnswerRevealed) return;
    setSelectedTriviaOption(index);
    setTriviaAnswerRevealed(true);
    if (index === PARK_TRIVIA_QUESTIONS[triviaQuestionIdx].correctIndex) {
      setTriviaScore((prev) => prev + 1);
      if (onAddXP) {
        onAddXP(15);
      }
    }
  };

  const handleNextTriviaQuestion = () => {
    if (triviaQuestionIdx + 1 < PARK_TRIVIA_QUESTIONS.length) {
      setTriviaQuestionIdx((prev) => prev + 1);
      setSelectedTriviaOption(null);
      setTriviaAnswerRevealed(false);
    } else {
      setTriviaCompleted(true);
      if (onAddXP) {
        onAddXP(25); // Bonus for completion
      }
      if (onEarnBudget) {
        onEarnBudget(20); // Earn money in the park
      } else if (onRechargeLife) {
        onRechargeLife(1);
      }
    }
  };

  return (
    <div className={`space-y-8 animate-fadeIn transition-colors duration-500 ${isNightMode ? 'dark text-slate-100' : ''}`}>
      
      {/* 1. CITY TOP CONTROLLER & ATMOSPHERE BAR */}
      <div className={`rounded-3xl p-5 sm:p-7 border shadow-sm transition-all duration-500 relative overflow-hidden ${
        isNightMode 
          ? 'bg-slate-950 border-slate-800 text-white' 
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border-slate-800 text-white'
      }`}>
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Campus Virtual UGR
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Trabajo del Proyecto de Innovación Docente 26-158
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-slate-200 border border-white/10">
                Parque Tecnológico de la Salud (PTS) • Bioquímica Médica
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Ciudad Biomédica</span>
              <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-xl bg-slate-800/80 text-emerald-400 border border-emerald-500/30">
                Modo Exploración
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explora los <strong className="text-emerald-300">3 distritos clave</strong> de la asignatura: el <strong className="text-white">Hospital</strong> para resolver casos de guardia, la <strong className="text-white">Biblioteca</strong> para estudiar el temario y biomarcadores, y el <strong className="text-white">Parque Lúdico</strong> para actividades de gamificación y laboratorios interactivos.
            </p>
          </div>

          {/* Quick Controls: Day/Night Toggle & Player Campus Stats */}
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-end">
            {/* Day / Night Shift Toggle */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                isNightMode
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/50 hover:bg-indigo-900/80 shadow-inner'
                  : 'bg-amber-400/20 text-amber-200 border-amber-300/40 hover:bg-amber-400/30'
              }`}
              title={isNightMode ? 'Cambiar a Modo Día en el Campus' : 'Cambiar a Guardia Nocturna en el Hospital'}
            >
              {isNightMode ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-300 animate-pulse" />
                  <span>Guardia Nocturna</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span>Campus de Día</span>
                </>
              )}
            </button>

            {/* Quick Status Pill */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3.5 py-2 flex items-center gap-3 text-xs text-slate-200">
              <div className="flex items-center gap-1.5" title="Fondos y Presupuesto de Guardia">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-white">{userProgress.budget.toLocaleString('es-ES')} € Fondos</span>
              </div>
              <div className="h-3 w-px bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white">{userProgress.streak}d</span>
              </div>
              <div className="h-3 w-px bg-slate-700" />
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-emerald-300">{userProgress.xp || userProgress.score} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE INTERACTIVE CITY LANDSCAPE (3D / ISOMETRIC VISUAL MAP) */}
      <div className={`relative rounded-3xl p-6 sm:p-10 border transition-all duration-500 overflow-hidden ${
        isNightMode 
          ? 'bg-slate-950 border-slate-800 shadow-2xl' 
          : 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800 shadow-md'
      }`}>
        
        {/* Sky / Atmospheric Backing */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className={`absolute inset-0 ${isNightMode ? 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black' : 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-950'}`} />
          {/* Subtle star or light dots in night mode */}
          {isNightMode && (
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
          )}
        </div>

        {/* Ambient Map Header */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Distritos de la Ciudad Biomédica</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Haz clic en un edificio para explorar
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Selecciona cualquier zona para abrir sus instalaciones y comenzar tus actividades docentes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Campus Activo • {cases.length} Casos Clínicos en vivo</span>
            </span>
          </div>
        </div>

        {/* ISOMETRIC CITY MAP VIEW WITH INTERACTIVE OVERLAYS */}
        <div className="relative z-10 mb-8 rounded-2xl overflow-hidden border-2 border-slate-700/80 shadow-2xl aspect-16/9 bg-slate-900 group">
          <img
            src="/biomedical_city_map.jpg"
            alt="Plano Isométrico de la Ciudad Biomédica UGR"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

          {/* Hospital Pin */}
          <div
            style={{ left: '10%', top: '8%', width: '28%', height: '34%' }}
            className={`absolute z-20 cursor-pointer rounded-2xl transition-all duration-300 ${
              selectedDistrict === 'hospital' || hoveredBuilding === 'hospital'
                ? 'ring-4 ring-rose-500 bg-rose-500/20 shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                : 'hover:bg-rose-500/10 hover:ring-2 hover:ring-rose-400'
            }`}
            onMouseEnter={() => setHoveredBuilding('hospital')}
            onMouseLeave={() => setHoveredBuilding(null)}
            onClick={() => setSelectedDistrict(selectedDistrict === 'hospital' ? null : 'hospital')}
          >
            <div className="absolute top-4 left-6 flex items-center gap-2 animate-bounce">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-7 w-7 bg-rose-600 text-white items-center justify-center shadow-lg border-2 border-white">
                  <Stethoscope className="w-3.5 h-3.5" />
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-white text-xs font-black border border-rose-500/60 backdrop-blur-md">
                <span className="text-rose-400">HOSPITAL</span>
                <span className="text-[10px] text-slate-300 font-normal">({cases.length} Casos)</span>
              </span>
            </div>

            {/* Hover Floating Action */}
            <div className={`absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-950/95 border border-rose-500 text-white text-xs transition-all duration-200 shadow-xl backdrop-blur-md ${
              hoveredBuilding === 'hospital' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 text-[11px] truncate">Casos Clínicos</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onNavigate('casos'); }}
                  className="text-[10px] bg-rose-600 hover:bg-rose-500 px-2.5 py-1 rounded-lg font-black text-white flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                >
                  VISITAR HOSPITAL <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Biblioteca Pin */}
          <div
            style={{ left: '38%', top: '24%', width: '26%', height: '36%' }}
            className={`absolute z-20 cursor-pointer rounded-2xl transition-all duration-300 ${
              selectedDistrict === 'biblioteca' || hoveredBuilding === 'biblioteca'
                ? 'ring-4 ring-blue-500 bg-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.5)]'
                : 'hover:bg-blue-500/10 hover:ring-2 hover:ring-blue-400'
            }`}
            onMouseEnter={() => setHoveredBuilding('biblioteca')}
            onMouseLeave={() => setHoveredBuilding(null)}
            onClick={() => setSelectedDistrict(selectedDistrict === 'biblioteca' ? null : 'biblioteca')}
          >
            <div className="absolute top-4 left-6 flex items-center gap-2 animate-bounce">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-7 w-7 bg-blue-600 text-white items-center justify-center shadow-lg border-2 border-white">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-white text-xs font-black border border-blue-500/60 backdrop-blur-md">
                <span className="text-blue-400">BIBLIOTECA</span>
                <span className="text-[10px] text-slate-300 font-normal">(Materiales & Labs)</span>
              </span>
            </div>

            {/* Hover Floating Action */}
            <div className={`absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-950/95 border border-blue-500 text-white text-xs transition-all duration-200 shadow-xl backdrop-blur-md ${
              hoveredBuilding === 'biblioteca' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-300 text-[11px] truncate">Materiales & Labs</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onNavigate('docencia'); }}
                  className="text-[10px] bg-blue-600 hover:bg-blue-500 px-2.5 py-1 rounded-lg font-black text-white flex items-center gap-1 shrink-0 cursor-pointer shadow-xs"
                >
                  VISITAR BIBLIOTECA <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Parque Pin */}
          <div
            style={{ left: '56%', top: '50%', width: '36%', height: '40%' }}
            className={`absolute z-20 cursor-pointer rounded-2xl transition-all duration-300 ${
              selectedDistrict === 'parque' || hoveredBuilding === 'parque'
                ? 'ring-4 ring-emerald-500 bg-emerald-500/20 shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                : 'hover:bg-emerald-500/10 hover:ring-2 hover:ring-emerald-400'
            }`}
            onMouseEnter={() => setHoveredBuilding('parque')}
            onMouseLeave={() => setHoveredBuilding(null)}
            onClick={() => setSelectedDistrict(selectedDistrict === 'parque' ? null : 'parque')}
          >
            <div className="absolute top-4 left-6 flex items-center gap-2 animate-bounce">
              <span className="relative flex h-7 w-7 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-7 w-7 bg-emerald-600 text-white items-center justify-center shadow-lg border-2 border-white">
                  <Trees className="w-3.5 h-3.5" />
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-white text-xs font-black border border-emerald-500/60 backdrop-blur-md">
                <span className="text-emerald-400">PARQUE</span>
                <span className="text-[10px] text-slate-300 font-normal">(Rosco & Dinero 💰)</span>
              </span>
            </div>

            {/* Hover Floating Action */}
            <div className={`absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-950/95 border border-emerald-500 text-white text-xs transition-all duration-200 shadow-xl backdrop-blur-md ${
              hoveredBuilding === 'parque' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 text-[11px] truncate">
                  {!satisfactionService.hasUserCompletedSurvey() ? '🔒 Parque Bloqueado' : 'Rosco & Dinero 💰'}
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); onNavigate('juegos'); }}
                  className={`text-[10px] px-2.5 py-1 rounded-lg font-black text-white flex items-center gap-1 shrink-0 cursor-pointer shadow-xs ${
                    !satisfactionService.hasUserCompletedSurvey()
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  {!satisfactionService.hasUserCompletedSurvey() ? (
                    <>DESBLOQUEAR <Lock className="w-3 h-3" /></>
                  ) : (
                    <>VISITAR PARQUE <ArrowRight className="w-3 h-3" /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Map Helper overlay bar */}
          <div className="absolute bottom-3 left-4 right-4 z-10 hidden sm:flex items-center justify-between text-xs text-white/90 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 pointer-events-none">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Haz clic sobre el Hospital, la Biblioteca o el Parque para desplegar sus actividades</span>
            </span>
          </div>
        </div>

        {/* THE 3 KEY CITY LANDMARKS (Interactive Cards Grid) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* ======================================================== */}
          {/* 1. EL HOSPITAL UNIVERSITARIO: CASOS CLÍNICOS */}
          {/* ======================================================== */}
          <div 
            onMouseEnter={() => setHoveredBuilding('hospital')}
            onMouseLeave={() => setHoveredBuilding(null)}
            className={`group relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              selectedDistrict === 'hospital'
                ? 'bg-slate-900/95 border-rose-500 ring-2 ring-rose-500/30 shadow-xl'
                : 'bg-slate-900/80 border-slate-800 hover:border-rose-500/70 hover:bg-slate-900 hover:shadow-xl'
            }`}
            onClick={() => setSelectedDistrict(selectedDistrict === 'hospital' ? null : 'hospital')}
          >
            {/* Landmark Tag & Status Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Distrito Clínico
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Urgencias 24h
                </span>
              </div>

              {/* Landmark Graphic Illustration Box */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-4 group-hover:scale-[1.01] transition-transform">
                {/* Visual Hospital Facade / Iconography */}
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-rose-300 font-mono bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/50">
                  <span>HELIPUERTO H1</span>
                </div>

                {/* Big Hospital Visual Symbol */}
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border-2 border-rose-500/60 flex items-center justify-center text-rose-400 shadow-lg group-hover:shadow-rose-500/20 group-hover:border-rose-400 transition-all">
                    <Stethoscope className="w-9 h-9" />
                  </div>
                  {/* Glowing Medical Cross */}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                    +
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-sm font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                    <span>Hospital Universitario</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Resolución de Casos Clínicos & Urgencias
                  </p>
                </div>

                {/* Animated Ambient Indicator */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{cases.length} Pacientes en Triaje</span>
                </div>
              </div>

              {/* Title & Core Purpose */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-rose-300 transition-colors flex items-center justify-between">
                  <span>1. El Hospital</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lugar donde se resuelven los casos clínicos reales. Pon a prueba tus habilidades diagnósticas mediante peticiones analíticas razonadas, coste por biomarcador y toma de decisiones.
                </p>
              </div>

              {/* Facilities / Sub-zones */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Instalaciones Activas
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-slate-300">
                    🚑 <strong>Urgencias & Triaje:</strong> {cases?.length || 31} Casos Clínicos
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-slate-300">
                    💰 <strong>Presupuesto:</strong> 5.000 € y Pruebas
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-5 mt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('casos');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Entrar al Hospital (Casos Clínicos)</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. LA BIBLIOTECA MÉDICA: MATERIAL DE APOYO Y ESTUDIO */}
          {/* ======================================================== */}
          <div 
            onMouseEnter={() => setHoveredBuilding('biblioteca')}
            onMouseLeave={() => setHoveredBuilding(null)}
            className={`group relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              selectedDistrict === 'biblioteca'
                ? 'bg-slate-900/95 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                : 'bg-slate-900/80 border-slate-800 hover:border-blue-500/70 hover:bg-slate-900 hover:shadow-xl'
            }`}
            onClick={() => setSelectedDistrict(selectedDistrict === 'biblioteca' ? null : 'biblioteca')}
          >
            {/* Landmark Tag & Status Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  Distrito del Saber
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  Acceso 24h
                </span>
              </div>

              {/* Landmark Graphic Illustration Box */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-4 group-hover:scale-[1.01] transition-transform">
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-blue-300 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/50">
                  <span>SALA LECTURA</span>
                </div>

                {/* Big Library Visual Symbol */}
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border-2 border-blue-500/60 flex items-center justify-center text-blue-400 shadow-lg group-hover:shadow-blue-500/20 group-hover:border-blue-400 transition-all">
                    <BookOpen className="w-9 h-9" />
                  </div>
                  {/* Academic Cap / Distinction */}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-sm font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                    <span>Biblioteca Biomédica Central</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Material de Apoyo, Temario Oficial & Simuladores
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Temario + 3 Simuladores de Apoyo + Vademécum</span>
                </div>
              </div>

              {/* Title & Core Purpose */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors flex items-center justify-between">
                  <span>2. La Biblioteca</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Espacio académico donde encontrarás el material de apoyo al aprendizaje: el temario oficial de Bioquímica Médica UGR, simuladores interactivos (Ciclo de Randle, Ictericias, Hemostasia), vademécum analítico y autoevaluación test.
                </p>
              </div>

              {/* Facilities / Sub-zones */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Materiales de Apoyo al Aprendizaje
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-slate-300">
                    📖 <strong>Temario & Guías:</strong> Docencia
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-slate-300">
                    ⚗️ <strong>Simuladores:</strong> Randle, Ictericia, Sangre
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-5 mt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('docencia');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Visitar Biblioteca</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('biblioteca');
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-blue-300 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Consultar Catálogo de Biomarcadores"
              >
                <span>Fichas</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. EL PARQUE BIOMÉDICO: ZONA LÚDICA & GAMIFICACIÓN */}
          {/* ======================================================== */}
          <div 
            onMouseEnter={() => setHoveredBuilding('parque')}
            onMouseLeave={() => setHoveredBuilding(null)}
            className={`group relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
              selectedDistrict === 'parque'
                ? 'bg-slate-900/95 border-emerald-500 ring-2 ring-emerald-500/30 shadow-xl'
                : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/70 hover:bg-slate-900 hover:shadow-xl'
            }`}
            onClick={() => setSelectedDistrict(selectedDistrict === 'parque' ? null : 'parque')}
          >
            {/* Landmark Tag & Status Badge */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Zona Lúdica & Retos
                </span>
                <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  2.0x XP
                </span>
              </div>

              {/* Landmark Graphic Illustration Box */}
              <div className="relative h-44 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center p-4 group-hover:scale-[1.01] transition-transform">
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  <span>PABELLÓN LÚDICO</span>
                </div>

                {/* Big Park Visual Symbol */}
                <div className="relative mb-2">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-lg group-hover:shadow-emerald-500/20 group-hover:border-emerald-400 transition-all">
                    <Trees className="w-9 h-9" />
                  </div>
                  {/* Gamepad / Games & Rosco */}
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-sm font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
                    <span>Parque Biomédico & Gamificación</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    El Rosco Metabólico, Minijuegos & Ganar Dinero 💰
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>El Rosco (25 Letras) + Minijuegos (+💰 Fondos)</span>
                </div>
              </div>

              {/* Title & Core Purpose */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
                  <span>3. El Parque Lúdico</span>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Zona lúdica donde poner actividades de gamificación: El Rosco Metabólico tipo Pasapalabra (2 opciones de dificultad para ganar dinero), minijuegos analíticos (+💰 Dinero), el Reto Diario y trivia flash.
                </p>
              </div>

              {/* Facilities / Sub-zones */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Atracciones Lúdicas
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-slate-300">
                    ⭕ <strong>El Rosco Metabólico:</strong> Pasapalabra 25 letras
                  </div>
                  <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 text-slate-300">
                    💰 <strong>Kiosco de Dinero:</strong> Minijuegos analíticos
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-5 mt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('juegos');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !satisfactionService.hasUserCompletedSurvey()
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {!satisfactionService.hasUserCompletedSurvey() ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-200" />
                    <span>Desbloquear Parque</span>
                  </>
                ) : (
                  <>
                    <Trees className="w-3.5 h-3.5" />
                    <span>Visitar Parque</span>
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('reto-diario');
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Jugar el Reto Diario"
              >
                <span>Reto</span>
                <Zap className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 3. DISTRICT DETAIL DRAWER / EXPANDED WORKSPACE (When a district is clicked) */}
      {selectedDistrict && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 animate-fadeIn">
          
          {/* Header of the Selected District */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md ${
                selectedDistrict === 'hospital'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : selectedDistrict === 'biblioteca'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {selectedDistrict === 'hospital' && <Stethoscope className="w-6 h-6" />}
                {selectedDistrict === 'biblioteca' && <BookOpen className="w-6 h-6" />}
                {selectedDistrict === 'parque' && <Trees className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Plano Detallado del Distrito
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  {selectedDistrict === 'hospital' && 'Hospital Universitario'}
                  {selectedDistrict === 'biblioteca' && 'La Biblioteca Médica de la UGR'}
                  {selectedDistrict === 'parque' && 'El Parque Biomédico & Zona Lúdica'}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedDistrict(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 self-start sm:self-auto cursor-pointer"
            >
              Cerrar Plano ✕
            </button>
          </div>

          {/* District Content: Sub-facilities, Activities & Quick Access */}
          {selectedDistrict === 'hospital' && (
            <div className="space-y-6">
              {/* High-Resolution District Illustration */}
              <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                <img
                  src="/hospital_section.jpg"
                  alt="Hospital Universitario"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-bold text-rose-300">Hospital Universitario • Urgencias y Triaje</span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-900/90 text-rose-200 px-2.5 py-1 rounded-lg border border-rose-500/40">
                    {cases.length} Pacientes en Espera
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                El Hospital es el corazón de la práctica médica del estudiante. Cada caso recrea un paciente en urgencias o planta con anamnesis, exploración y pruebas analíticas en las que debes solicitar los biomarcadores adecuados sin incurrir en costes innecesarios.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hospital Wing 1 */}
                <div 
                  onClick={() => onNavigate('casos')}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-rose-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📋</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Triaje & Admisión
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                    Banco de Casos Clínicos
                  </h4>
                  <p className="text-xs text-slate-400">
                    Consulta el listado clasificado por sistemas: Síndrome coronario, hepatopatías, cetoacidosis diabética, fracaso renal y pancreatitis.
                  </p>
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1 pt-1">
                    <span>Acceder a Triaje</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hospital Wing 2 */}
                <div 
                  onClick={() => onNavigate('casos')}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-rose-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🧪</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      5.000 € Fondos
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                    Resolución y Petición Analítica
                  </h4>
                  <p className="text-xs text-slate-400">
                    Evalúa la analítica de cada paciente, selecciona biomarcadores discriminatorios y emite el informe de laboratorio razonado.
                  </p>
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1 pt-1">
                    <span>Resolver Casos</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hospital Wing 3 */}
                <div 
                  onClick={() => onNavigate('estadisticas')}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-rose-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📊</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Auditoría Clínica
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                    Historial de Diagnósticos
                  </h4>
                  <p className="text-xs text-slate-400">
                    Revisa tus tasas de acierto por órgano, gastos de laboratorio, casos superados y las medallas de maestría clínica desbloqueadas.
                  </p>
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1 pt-1">
                    <span>Ver Expediente Clínico</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDistrict === 'biblioteca' && (
            <div className="space-y-6">
              {/* High-Resolution District Illustration */}
              <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                <img
                  src="/library_section.jpg"
                  alt="Biblioteca Biomédica UGR"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-bold text-blue-300">Biblioteca Biomédica Central • Material Docente y Vademécum</span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-900/90 text-blue-200 px-2.5 py-1 rounded-lg border border-blue-500/40">
                    4 Módulos Teóricos
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                La Biblioteca reúne el corpus científico y las guías de estudio del Departamento de Bioquímica y Biología Molecular III e Inmunología de la Facultad de Medicina UGR. Aquí afianzarás los fundamentos teóricos antes de emitir cualquier juicio clínico.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Library Wing 1: Temario */}
                <div 
                  onClick={() => onNavigate('docencia')}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">📚</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Temario Oficial
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    Programa Teórico (27 Temas)
                  </h4>
                  <p className="text-xs text-slate-400">
                    7 créditos completos: Homeostasis, señalización, metabolismo glucídico, lipídico, aminoácidos, nucleótidos y hematología.
                  </p>
                  <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-1">
                    <span>Abrir Temario</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Library Wing 2: Prácticas y Seminarios */}
                <div 
                  onClick={() => onNavigate('practicas-seminarios')}
                  className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🗓️</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      Organización UGR
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    Prácticas y Seminarios
                  </h4>
                  <p className="text-xs text-slate-400">
                    Calendario completo por subgrupos 1 al 15, LAB L-5/6, Aula S3, exportación iCal y panel de coordinación docente.
                  </p>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1 pt-1">
                    <span>Ver Calendario</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Library Wing 3: Vademécum */}
                <div 
                  onClick={() => onNavigate('biblioteca')}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🧪</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Vademécum
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    Archivo de Biomarcadores
                  </h4>
                  <p className="text-xs text-slate-400">
                    Fichas técnicas con valores de referencia, ventanas cinéticas de elevación y normalización, sensibilidad y especificidad.
                  </p>
                  <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-1">
                    <span>Consultar Fichas</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Library Wing 4: Autoevaluación Test */}
                <div 
                  onClick={() => onNavigate('docencia')}
                  className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">✍️</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Evaluación
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    Banco de Autoevaluación Test
                  </h4>
                  <p className="text-xs text-slate-400">
                    Autoevaluación tipo test con retroalimentación inmediata y justificación fisiopatológica detallada de cada respuesta.
                  </p>
                  <div className="text-xs font-bold text-blue-400 flex items-center gap-1 pt-1">
                    <span>Practicar Preguntas Test</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Materiales de Apoyo al Aprendizaje: Simuladores Interactivos */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                      Materiales de Apoyo al Aprendizaje
                    </span>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>Simuladores Bioquímicos y Modelos Moleculares</span>
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 px-2.5 py-0.5 rounded-lg border border-teal-800">
                    4 Simuladores Oficiales
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Simulator 1: Randle */}
                  <div 
                    onClick={() => {
                      if (onOpenLab) onOpenLab('randle');
                      onNavigate('laboratorios');
                    }}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🔄</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Metabolismo
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white group-hover:text-blue-400">
                      El Ciclo de Randle
                    </h5>
                    <p className="text-xs text-slate-400">
                      Competencia glucosa vs ácidos grasos, Malonil-CoA y regulación de la CPT-1 en miocito y adipocito.
                    </p>
                    <span className="text-xs font-bold text-blue-400 block pt-1">Abrir Simulador ➔</span>
                  </div>

                  {/* Simulator 2: Ictericias */}
                  <div 
                    onClick={() => {
                      if (onOpenLab) onOpenLab('ictericias');
                      onNavigate('laboratorios');
                    }}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🧪</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Hepatobiliar
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white group-hover:text-blue-400">
                      Simulador de Ictericias
                    </h5>
                    <p className="text-xs text-slate-400">
                      Diagnóstico prehepático, hepático y posthepático con bilirrubina total, directa y enzimas colestásicas.
                    </p>
                    <span className="text-xs font-bold text-blue-400 block pt-1">Abrir Simulador ➔</span>
                  </div>

                  {/* Simulator 3: Hemostasia */}
                  <div 
                    onClick={() => {
                      if (onOpenLab) onOpenLab('hemostasia');
                      onNavigate('laboratorios');
                    }}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🩸</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Hematología
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white group-hover:text-blue-400">
                      Cascada de Hemostasia
                    </h5>
                    <p className="text-xs text-slate-400">
                      Simulación interactiva de TP, TTPa, Fibrinógeno y Dímero D en trastornos protrombóticos y diátesis hemorrágicas.
                    </p>
                    <span className="text-xs font-bold text-blue-400 block pt-1">Abrir Simulador ➔</span>
                  </div>

                  {/* Simulator 4: Integración Metabólica */}
                  <div 
                    onClick={() => {
                      if (onOpenLab) onOpenLab('integra');
                      onNavigate('integracion-metabolica');
                    }}
                    className="bg-slate-950 p-4 rounded-2xl border border-teal-500/50 hover:border-teal-400 transition-all cursor-pointer space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">🌐</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Nuevo · Atlas
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white group-hover:text-teal-300">
                      Integración Metabólica
                    </h5>
                    <p className="text-xs text-slate-400">
                      Atlas de órganos y situaciones fisiopatológicas, curvas de ayuno de Cahill y casos clínicos interactivos.
                    </p>
                    <span className="text-xs font-bold text-teal-400 block pt-1">Abrir Simulador ➔</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDistrict === 'parque' && (
            <div className="space-y-6">
              {/* High-Resolution District Illustration */}
              <div className="relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                <img
                  src="/park_section.jpg"
                  alt="Parque Biomédico UGR"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-bold text-emerald-300">Parque Biomédico & Zona Lúdica</span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-900/90 text-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                    El Rosco Metabólico, Minijuegos (+💰 Fondos) & Reto
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                El Parque Biomédico es la zona lúdica y de gamificación del campus. Aquí ganarás dinero para tus guardias hospitalarias jugando a «El Rosco Metabólico» tipo Pasapalabra, resolviendo minijuegos analíticos rápidos y superando el Reto Diario con bonificador de experiencia.
              </p>

              {/* Park Gamification: Rosco, Daily Challenge, Minijuegos & Trivia Flash Game */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Activity 0: El Rosco Metabólico & Kiosco de Minijuegos */}
                <div 
                  onClick={() => {
                    onNavigate('juegos');
                  }}
                  className="bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-950 p-5 rounded-2xl border border-blue-500/40 hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group shadow-sm ring-1 ring-blue-500/20"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {!satisfactionService.hasUserCompletedSurvey() ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          Bloqueado (¡Danos tu opinión!)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-400" />
                          Gana Dinero 💰
                        </span>
                      )}
                      <span className="text-xs text-blue-400 font-mono font-bold">+250 XP Extra</span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-blue-300 flex items-center gap-1.5">
                      <span className="text-base">⭕</span>
                      <span>El Rosco Metabólico (Pasapalabra)</span>
                    </h4>
                    <p className="text-xs text-slate-300">
                      Juego de 25 letras tipo Pasapalabra con definición central. 2 opciones de dificultad para ganar fondos de guardia (aciertos suman dinero, fallos 0€).
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>Jugar al Rosco</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Activity 1: Reto Diario */}
                <div 
                  onClick={() => onNavigate('reto-diario')}
                  className="bg-gradient-to-r from-emerald-950/70 to-slate-950 p-5 rounded-2xl border border-emerald-500/30 hover:border-emerald-500 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        Multiplicador 2.0x XP
                      </span>
                      <span className="text-xs text-slate-400">120 segundos</span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-emerald-300">
                      Plaza del Reto Diario
                    </h4>
                    <p className="text-xs text-slate-300">
                      Un caso clínico único cada día para toda la facultad. Resuélvelo a contrarreloj para mantener tu racha y duplicar tu experiencia.
                    </p>
                  </div>
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Jugar Reto de Hoy</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Activity 2: Interactive Trivia Mini-game */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        Minijuego de Gamificación
                      </span>
                      <span className="text-xs text-emerald-400 font-mono font-bold">+15 XP / acierto</span>
                    </div>
                    <h4 className="text-base font-bold text-white">
                      Quiosco de Trivia Rápida
                    </h4>
                    <p className="text-xs text-slate-400">
                      Ronda exprés de preguntas bioquímicas de alta frecuencia para calentar neuronas antes de entrar al hospital.
                    </p>
                  </div>

                  {!triviaActive ? (
                    <button
                      onClick={startTrivia}
                      className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Iniciar Ronda de Trivia Flash</span>
                    </button>
                  ) : (
                    <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs">
                      {!triviaCompleted ? (
                        <>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                            <span>Pregunta {triviaQuestionIdx + 1} de {PARK_TRIVIA_QUESTIONS.length}</span>
                            <span className="font-bold text-purple-300">{PARK_TRIVIA_QUESTIONS[triviaQuestionIdx].system}</span>
                          </div>

                          <p className="font-semibold text-white leading-relaxed">
                            {PARK_TRIVIA_QUESTIONS[triviaQuestionIdx].question}
                          </p>

                          <div className="space-y-1.5 pt-1">
                            {PARK_TRIVIA_QUESTIONS[triviaQuestionIdx].options.map((option, idx) => {
                              const isSelected = selectedTriviaOption === idx;
                              const isCorrect = idx === PARK_TRIVIA_QUESTIONS[triviaQuestionIdx].correctIndex;
                              let btnStyle = "bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800";

                              if (triviaAnswerRevealed) {
                                if (isCorrect) {
                                  btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold";
                                } else if (isSelected) {
                                  btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
                                } else {
                                  btnStyle = "bg-slate-950 border-slate-800 text-slate-500 opacity-60";
                                }
                              }

                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleTriviaAnswer(idx)}
                                  disabled={triviaAnswerRevealed}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
                                >
                                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span className="leading-snug">{option}</span>
                                </button>
                              );
                            })}
                          </div>

                          {triviaAnswerRevealed && (
                            <div className="pt-2 space-y-2">
                              <p className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                                <strong className="text-emerald-400">Explicación:</strong> {PARK_TRIVIA_QUESTIONS[triviaQuestionIdx].explanation}
                              </p>
                              <button
                                onClick={handleNextTriviaQuestion}
                                className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <span>{triviaQuestionIdx + 1 < PARK_TRIVIA_QUESTIONS.length ? 'Siguiente Pregunta' : 'Ver Puntuación'}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-3 space-y-3">
                          <span className="text-3xl">🎉</span>
                          <h5 className="font-bold text-white text-sm">
                            ¡Ronda de Trivia Completada!
                          </h5>
                          <p className="text-xs text-slate-300">
                            Has acertado <strong className="text-emerald-400">{triviaScore}</strong> de {PARK_TRIVIA_QUESTIONS.length} preguntas. ¡Has ganado XP extra en el Parque Biomédico!
                          </p>
                          <button
                            onClick={startTrivia}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Jugar Otra Ronda</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. CITY COMPASS & ARCHITECTURE SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => onNavigate('casos')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
              1. Visitar Hospital
            </span>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-700">
              Casos Clínicos & Urgencias
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1">
              {cases.length} casos interactivos con feedback bioquímico
            </p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('docencia')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
              2. Visitar Biblioteca
            </span>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
              Material de Apoyo & Estudio
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1">
              Temario UGR, Simuladores (Randle, Ictericia, Sangre) y Biomarcadores
            </p>
          </div>
        </div>

        <div 
          onClick={() => onNavigate('laboratorios')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Trees className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              3. Visitar Parque
            </span>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
              El Rosco & Minijuegos de Dinero
            </h4>
            <p className="text-xs text-slate-500 line-clamp-1">
              El Rosco (Pasapalabra 25 letras), Minijuegos (+💰 Fondos) y Reto Diario
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
