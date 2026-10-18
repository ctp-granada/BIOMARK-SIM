import React from 'react';
import { ActiveModule, UserProgress } from '../types';
import { getPlayerRank, getStreakMultiplier } from '../utils/gamification';
import { User } from '@supabase/supabase-js';
import {
  Home,
  Building2,
  Stethoscope,
  Target,
  FlaskConical,
  GraduationCap,
  BookOpen,
  BarChart3,
  Heart,
  Flame,
  Sparkles,
  Zap,
  LogIn,
  LogOut,
  User as UserIcon,
  Cloud,
  RefreshCw,
  ArrowLeft,
  Trees,
  Gamepad2,
  Trophy,
  Coins,
  Wallet,
  Calendar,
  Volume2,
  VolumeX
} from 'lucide-react';
import { audioService } from '../utils/audioService';

interface NavbarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
  userProgress: UserProgress;
  onStartTour?: () => void;
  user?: User | null;
  syncStatus?: 'idle' | 'syncing' | 'saved' | 'error';
  onOpenAuthModal?: () => void;
  onSignOut?: () => void;
  onOpenFirebaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  setActiveModule,
  userProgress,
  onStartTour,
  user,
  syncStatus = 'idle',
  onOpenAuthModal,
  onSignOut,
  onOpenFirebaseModal
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(audioService.getIsMuted());

  React.useEffect(() => {
    return audioService.subscribe((muted) => {
      setIsMuted(muted);
    });
  }, []);

  const rank = getPlayerRank(userProgress.xp || userProgress.score);
  const streakInfo = getStreakMultiplier(userProgress.streak);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Alumno';

  // Check if user has entered one of the 3 key districts or stats
  const isHospital = activeModule === 'casos' || activeModule === 'desafio';
  const isLibrary = activeModule === 'docencia' || activeModule === 'practicas-seminarios' || activeModule === 'biblioteca' || activeModule === 'laboratorios' || activeModule === 'integracion-metabolica';
  const isPark = activeModule === 'reto-diario' || activeModule === 'juegos';
  const isStats = activeModule === 'estadisticas' || activeModule === 'ranking';
  const isInsideKeyPlace = isHospital || isLibrary || isPark || isStats;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      {/* 1. TOP HEADER: Medical Gold Institutional Bar (Facultad de Medicina UGR) */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white px-4 py-2.5 sm:py-3 border-b border-amber-800 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          
          {/* Main Brand Identifier: Bioquímica Médica UGR */}
          <div 
            id="tour-brand-header"
            className="flex items-center justify-center gap-3 cursor-pointer group"
            onClick={() => setActiveModule('inicio')}
          >
            {/* Official Subject Logo: Caduceo + ADN + Granada UGR */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white p-1 shadow-xs border border-amber-300/90 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
              <img
                src="/course_logo.jpg"
                alt="Logo Bioquímica Médica UGR"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                  BIOQUÍMICA<span className="text-amber-200 font-extrabold"> MÉDICA</span>
                </h1>
                <span className="bg-amber-900/60 border border-amber-400/50 text-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Facultad de Medicina UGR
                </span>
                <span className="bg-amber-950/80 border border-amber-400/60 text-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                  PID 26-158
                </span>
              </div>
              <p className="text-[11px] sm:text-xs font-normal text-amber-100/90 tracking-normal mt-0.5 max-w-xl">
                Proyecto de Innovación Docente 26-158 • Dpto. Bioquímica y Biología Molecular III e Inmunología • UGR
              </p>
            </div>
          </div>

          {/* User Auth and Cloud Sync Status in Top Right */}
          <div className="flex items-center gap-2">
            {/* Cloud Sync Status Indicator */}
            {user && (
              <div 
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-900/60 border border-amber-500/40 text-[11px] text-amber-100"
                title={
                  syncStatus === 'syncing'
                    ? 'Sincronizando con Supabase...'
                    : syncStatus === 'saved'
                    ? 'Progreso guardado en la nube'
                    : 'Conectado a la nube'
                }
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span className="text-amber-100 hidden sm:inline">Sincronizando...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-3.5 h-3.5 text-amber-300" />
                    <span className="text-amber-100 font-medium hidden sm:inline">Nube Activa</span>
                  </>
                )}
              </div>
            )}

            {/* Auth Button: Login / User Profile */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-amber-900/60 border border-amber-500/40 rounded-lg px-2.5 py-1 text-xs text-white">
                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] uppercase">
                  {userName.charAt(0)}
                </div>
                <span className="font-semibold max-w-[100px] truncate hidden sm:inline text-amber-100">{userName}</span>
                <button
                  onClick={onSignOut}
                  title="Cerrar sesión de alumno"
                  className="p-1 text-amber-200 hover:text-white transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/70 hover:bg-amber-900 text-white text-xs font-semibold transition-all shadow-2xs border border-amber-400/50 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>Acceso Alumno UGR</span>
              </button>
            )}

            {/* Firebase Hub Button */}
            {onOpenFirebaseModal && (
              <button
                onClick={onOpenFirebaseModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-400/50 text-amber-100 hover:text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                title="Configuración de Firebase Firestore & Hosting UGR"
              >
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span className="hidden sm:inline">Firebase Hub</span>
              </button>
            )}

            {/* Audio Mute/Unmute Toggle Button */}
            <button
              type="button"
              onClick={() => audioService.toggleMute()}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                isMuted
                  ? 'bg-amber-950/40 border-amber-500/30 text-amber-300/60 hover:text-amber-200'
                  : 'bg-amber-900/70 hover:bg-amber-900 border-amber-400/50 text-amber-100 hover:text-white'
              }`}
              title={isMuted ? 'Activar efectos de sonido' : 'Silenciar efectos de sonido'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-300" />}
              <span className="hidden sm:inline">{isMuted ? 'Silencio' : 'Sonido'}</span>
            </button>

            {/* Quick Tour Button */}
            {onStartTour && (
              <button
                onClick={onStartTour}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-900/50 hover:bg-amber-900/80 border border-amber-500/40 text-amber-100 hover:text-white text-xs font-medium transition-all cursor-pointer"
                title="Iniciar Tutorial Rápido Guiado (Hospital, Biblioteca, Juegos)"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden lg:inline">Tutorial Rápido</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. CONTEXTUAL LOWER BAR: Visible ONLY when user enters Hospital, Biblioteca, Parque, or Estadísticas */}
      {isInsideKeyPlace && (
        <div className="px-4 sm:px-8 py-2.5 bg-white border-b border-slate-200/90 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left: Back to City Plano + Contextual Place Tabs */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto">
              {/* Back to Landing Page / City Entrance Button */}
              <button
                onClick={() => setActiveModule('inicio')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer group"
                title="Volver a la Pantalla Principal (Hospital, Biblioteca, Parque)"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-200 group-hover:-translate-x-0.5 transition-transform" />
                <span>Volver al Inicio</span>
              </button>

              <div className="h-5 w-px bg-slate-200 shrink-0 hidden sm:block" />

              {/* HOSPITAL TABS */}
              {isHospital && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                    <Stethoscope className="w-3.5 h-3.5 text-rose-600" />
                    <span>HOSPITAL CLÍNICO</span>
                  </span>

                  <button
                    onClick={() => setActiveModule('casos')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'casos' || activeModule === 'desafio'
                        ? 'bg-rose-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Casos Clínicos</span>
                  </button>

                  {activeModule === 'desafio' && (
                    <button
                      onClick={() => setActiveModule('casos')}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer"
                      title="Volver a la selección de casos"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>
                  )}
                </div>
              )}

              {/* BIBLIOTECA TABS */}
              {isLibrary && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>BIBLIOTECA MÉDICA</span>
                  </span>

                  <button
                    onClick={() => setActiveModule('docencia')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'docencia'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Temario Oficial</span>
                  </button>

                  <button
                    onClick={() => setActiveModule('practicas-seminarios')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'practicas-seminarios'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-amber-50/80 text-amber-900 border border-amber-200 hover:bg-amber-100 font-semibold'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-700" />
                    <span>Prácticas y Seminarios</span>
                  </button>

                  <button
                    onClick={() => setActiveModule('biblioteca')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'biblioteca'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Vademécum</span>
                  </button>

                  <button
                    onClick={() => setActiveModule('laboratorios')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'laboratorios' || activeModule === 'integracion-metabolica'
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-blue-50/80 text-blue-800 border border-blue-200 hover:bg-blue-100'
                    }`}
                  >
                    <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                    <span>Simuladores de Aprendizaje</span>
                  </button>
                </div>
              )}

              {/* PARQUE TABS */}
              {isPark && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <Trees className="w-3.5 h-3.5 text-emerald-600" />
                    <span>PARQUE LÚDICO</span>
                  </span>

                  <button
                    onClick={() => setActiveModule('juegos')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'juegos'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-emerald-50/70 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>El Rosco & Minijuegos</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-white text-emerald-700 border border-emerald-300">
                      +💰 Dinero
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveModule('reto-diario')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'reto-diario'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>Reto Diario (2x XP)</span>
                  </button>
                </div>
              )}

              {/* STATS & RANKING TABS */}
              {isStats && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-600" />
                    <span>EXPEDIENTE & RANKING</span>
                  </span>

                  <button
                    onClick={() => setActiveModule('estadisticas')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'estadisticas'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Progreso & Insignias</span>
                  </button>

                  <button
                    onClick={() => setActiveModule('ranking')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      activeModule === 'ranking'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ranking Top 10</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Gamification Status */}
            <div className="flex items-center justify-end gap-2 sm:gap-2.5 shrink-0">
              {/* Hospital Live Status: Budget Funds & Streak */}
              {isHospital && (
                <>
                  <div 
                    className={`border px-2.5 py-1 rounded-xl flex items-center gap-1.5 shadow-2xs ${
                      userProgress.budget < 1000
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-amber-50/80 border-amber-200 text-amber-900'
                    }`} 
                    title="Fondos y Presupuesto Hospitalario (Gana más dinero jugando en el Parque: 250 € - 300 €)"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[10px] font-bold uppercase tracking-tight hidden sm:inline">Fondos:</span>
                    <span className="text-xs font-black font-mono">{userProgress.budget.toLocaleString('es-ES')} €</span>
                  </div>

                  {userProgress.streak > 0 && (
                    <div 
                      className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center gap-1 text-emerald-900 text-xs font-semibold shadow-2xs"
                      title={`Racha Actual: ${userProgress.streak} aciertos seguidos (+${(streakInfo.multiplier - 1) * 100}% bonus)`}
                    >
                      <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      <span>{userProgress.streak}</span>
                      <span className="text-[10px] text-emerald-700 font-mono hidden sm:inline">x{streakInfo.multiplier}</span>
                    </div>
                  )}
                </>
              )}

              {/* Rank Badge - Clickable to open Ranking / Escalafón */}
              <button
                onClick={() => setActiveModule('ranking')}
                title="Ver Escalafón y Ranking Top 10"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold shadow-2xs hover:scale-105 transition-all cursor-pointer ${rank.badgeBg} ${rank.badgeTextColor} ${rank.badgeBorder}`}
              >
                <span>{rank.icon}</span>
                <span className="truncate max-w-[110px] sm:max-w-[130px]">{rank.shortTitle}</span>
              </button>

              {/* XP Score Badge - Clickable to open Ranking */}
              <button
                onClick={() => setActiveModule('ranking')}
                title="Ver Ranking Global de Puntos"
                className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1 rounded-xl flex items-center gap-1.5 text-xs font-bold font-mono shadow-2xs border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer"
              >
                <span className="text-emerald-400">XP</span>
                <span>{userProgress.xp || userProgress.score}</span>
              </button>

              {/* Audio Sound Toggle */}
              <button
                type="button"
                onClick={() => audioService.toggleMute()}
                title={isMuted ? 'Activar efectos de sonido' : 'Silenciar efectos de sonido'}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl flex items-center gap-1 text-xs font-semibold shadow-2xs border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-slate-100 border-slate-300 text-slate-400 hover:text-slate-600'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                <span className="hidden sm:inline">{isMuted ? 'Mudo' : 'Audio'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile Sub-Navigation Bar for Small Screens: Only visible inside places */}
      {isInsideKeyPlace && (
        <div className="md:hidden flex items-center justify-around bg-amber-950 px-2 py-2 text-xs font-medium fixed bottom-0 left-0 right-0 z-50 border-t border-amber-800 text-amber-100">
          <button
            onClick={() => setActiveModule('inicio')}
            className="px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 text-amber-300 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[9px]">Plano Ciudad</span>
          </button>
          {isHospital && (
            <button
              onClick={() => setActiveModule('casos')}
              className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                activeModule === 'casos' || activeModule === 'desafio' ? 'text-rose-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span className="text-[9px]">Casos</span>
            </button>
          )}
          {isLibrary && (
            <>
              <button
                onClick={() => setActiveModule('docencia')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'docencia' ? 'text-blue-400 font-bold' : 'text-slate-400'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="text-[9px]">Temario</span>
              </button>
              <button
                onClick={() => setActiveModule('practicas-seminarios')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'practicas-seminarios' ? 'text-amber-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-[9px]">Prácticas</span>
              </button>
              <button
                onClick={() => setActiveModule('biblioteca')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'biblioteca' ? 'text-blue-400 font-bold' : 'text-slate-400'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-[9px]">Biomarcadores</span>
              </button>
              <button
                onClick={() => setActiveModule('laboratorios')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'laboratorios' || activeModule === 'integracion-metabolica' ? 'text-blue-400 font-bold' : 'text-slate-400'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span className="text-[9px]">Simuladores</span>
              </button>
            </>
          )}
          {isPark && (
            <>
              <button
                onClick={() => setActiveModule('juegos')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'juegos' ? 'text-emerald-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="text-[9px]">Rosco & Dinero</span>
              </button>
              <button
                onClick={() => setActiveModule('reto-diario')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'reto-diario' ? 'text-amber-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-[9px]">Reto 2x</span>
              </button>
            </>
          )}
          {isStats && (
            <>
              <button
                onClick={() => setActiveModule('estadisticas')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'estadisticas' ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-[9px]">Insignias</span>
              </button>
              <button
                onClick={() => setActiveModule('ranking')}
                className={`px-2 py-1 rounded-lg flex flex-col items-center gap-0.5 ${
                  activeModule === 'ranking' ? 'text-amber-400 font-bold' : 'text-slate-400'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="text-[9px]">Top 10</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};


