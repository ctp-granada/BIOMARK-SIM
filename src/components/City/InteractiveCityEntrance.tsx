import React, { useState } from 'react';
import { ActiveModule } from '../../types';
import { 
  Stethoscope, 
  BookOpen, 
  Trees, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  Activity, 
  Flame, 
  FlaskConical,
  Award,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { CLINICAL_CASES_DATABASE } from '../../data/clinicalCases';

const cityMapImage = '/biomedical_city_map.jpg';

interface InteractiveCityEntranceProps {
  onNavigate: (module: ActiveModule) => void;
  onOpenLab?: (lab: 'randle' | 'ictericias' | 'hemostasia') => void;
  onStartDailyChallenge?: () => void;
  casesCount?: number;
}

type ActiveHotspot = 'hospital' | 'biblioteca' | 'parque' | null;

export const InteractiveCityEntrance: React.FC<InteractiveCityEntranceProps> = ({
  onNavigate,
  onOpenLab,
  onStartDailyChallenge,
  casesCount = CLINICAL_CASES_DATABASE.length
}) => {
  const [hoveredSpot, setHoveredSpot] = useState<ActiveHotspot>(null);
  const [selectedSpot, setSelectedSpot] = useState<ActiveHotspot>(null);

  const activeFocus = hoveredSpot || selectedSpot;

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADER: Clinical Modern Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Ciudad Biomédica UGR
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Facultad de Medicina • Campus de la Salud
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Selecciona tu destino en el Campus
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Haz clic directamente en la imagen o en las tarjetas inferiores para acceder a las 3 áreas principales:
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>3 Lugares Clave Activos</span>
          </div>
        </div>
      </div>

      {/* 2. THE ISOMETRIC CITY IMAGE WITH INTERACTIVE HOTSPOTS */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-xl group">
        
        {/* Main Isometric City Map Image */}
        <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900 select-none">
          <img
            src={cityMapImage || '/biomedical_city_map.jpg'}
            alt="Plano Isométrico de la Ciudad Biomédica UGR: Hospital, Biblioteca Pública y Parque Infantil"
            className={`w-full h-full object-cover transition-all duration-700 ${
              activeFocus ? 'scale-[1.02] filter brightness-95' : 'scale-100'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* Vignette & Soft Gradient for readable overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/30 pointer-events-none" />

          {/* ============================================================ */}
          {/* HOTSPOT 1: EL HOSPITAL (Casos Clínicos) - Top Left */}
          {/* ============================================================ */}
          <div
            style={{ left: '10%', top: '8%', width: '28%', height: '34%' }}
            className={`absolute z-20 cursor-pointer rounded-2xl transition-all duration-300 ${
              activeFocus === 'hospital'
                ? 'ring-4 ring-rose-500 bg-rose-500/15 backdrop-blur-[1px] shadow-[0_0_30px_rgba(244,63,94,0.4)]'
                : 'hover:bg-rose-500/10 hover:ring-2 hover:ring-rose-400/80'
            }`}
            onMouseEnter={() => setHoveredSpot('hospital')}
            onMouseLeave={() => setHoveredSpot(null)}
            onClick={() => onNavigate('casos')}
            role="button"
            tabIndex={0}
            aria-label="Acceder al Hospital y Casos Clínicos"
          >
            {/* Beacon Pin */}
            <div className="absolute top-4 left-6 flex items-center gap-2 animate-bounce duration-1000">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-8 w-8 bg-rose-600 text-white items-center justify-center shadow-lg border-2 border-white">
                  <Stethoscope className="w-4 h-4" />
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 text-white text-xs font-black shadow-lg border border-rose-500/60 backdrop-blur-md">
                <span className="text-rose-400 font-extrabold">HOSPITAL</span>
                <span className="text-[10px] text-slate-300 font-medium">({casesCount} Casos)</span>
              </span>
            </div>

            {/* Floating Action Badge on Hover */}
            <div className={`absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/95 border border-rose-500 text-white text-xs transition-all duration-200 shadow-2xl backdrop-blur-md ${
              activeFocus === 'hospital' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
                  <span>Hospital Clínico • Casos de Pacientes</span>
                </div>
                <span className="text-[10px] bg-rose-600 px-2.5 py-1 rounded-lg font-black text-white flex items-center gap-1 shadow-xs">
                  VISITAR HOSPITAL <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* HOTSPOT 2: LA BIBLIOTECA (Materiales de Apoyo) - Center */}
          {/* ============================================================ */}
          <div
            style={{ left: '38%', top: '24%', width: '26%', height: '36%' }}
            className={`absolute z-20 cursor-pointer rounded-2xl transition-all duration-300 ${
              activeFocus === 'biblioteca'
                ? 'ring-4 ring-blue-500 bg-blue-500/15 backdrop-blur-[1px] shadow-[0_0_30px_rgba(59,130,246,0.4)]'
                : 'hover:bg-blue-500/10 hover:ring-2 hover:ring-blue-400/80'
            }`}
            onMouseEnter={() => setHoveredSpot('biblioteca')}
            onMouseLeave={() => setHoveredSpot(null)}
            onClick={() => onNavigate('docencia')}
            role="button"
            tabIndex={0}
            aria-label="Acceder a la Biblioteca y Materiales de Apoyo"
          >
            {/* Beacon Pin */}
            <div className="absolute top-4 left-6 flex items-center gap-2 animate-bounce duration-1000">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-8 w-8 bg-blue-600 text-white items-center justify-center shadow-lg border-2 border-white">
                  <BookOpen className="w-4 h-4" />
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 text-white text-xs font-black shadow-lg border border-blue-500/60 backdrop-blur-md">
                <span className="text-blue-400 font-extrabold">BIBLIOTECA</span>
                <span className="text-[10px] text-slate-300 font-medium">(Material Docente)</span>
              </span>
            </div>

            {/* Floating Action Badge on Hover */}
            <div className={`absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/95 border border-blue-500 text-white text-xs transition-all duration-200 shadow-2xl backdrop-blur-md ${
              activeFocus === 'biblioteca' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>Biblioteca Pública • Vademécum & Autoevaluación</span>
                </div>
                <span className="text-[10px] bg-blue-600 px-2.5 py-1 rounded-lg font-black text-white flex items-center gap-1 shadow-xs">
                  VISITAR BIBLIOTECA <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* HOTSPOT 3: EL PARQUE (Actividades y Juegos) - Bottom Right */}
          {/* ============================================================ */}
          <div
            style={{ left: '56%', top: '50%', width: '36%', height: '40%' }}
            className={`absolute z-20 cursor-pointer rounded-2xl transition-all duration-300 ${
              activeFocus === 'parque'
                ? 'ring-4 ring-emerald-500 bg-emerald-500/15 backdrop-blur-[1px] shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : 'hover:bg-emerald-500/10 hover:ring-2 hover:ring-emerald-400/80'
            }`}
            onMouseEnter={() => setHoveredSpot('parque')}
            onMouseLeave={() => setHoveredSpot(null)}
            onClick={() => onNavigate('ciudad')}
            role="button"
            tabIndex={0}
            aria-label="Acceder al Parque y Juegos de Gamificación"
          >
            {/* Beacon Pin */}
            <div className="absolute top-4 left-6 flex items-center gap-2 animate-bounce duration-1000">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-8 w-8 bg-emerald-600 text-white items-center justify-center shadow-lg border-2 border-white">
                  <Trees className="w-4 h-4" />
                </span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 text-white text-xs font-black shadow-lg border border-emerald-500/60 backdrop-blur-md">
                <span className="text-emerald-400 font-extrabold">PARQUE</span>
                <span className="text-[10px] text-slate-300 font-medium">(Juegos & Gamificación)</span>
              </span>
            </div>

            {/* Floating Action Badge on Hover */}
            <div className={`absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/95 border border-emerald-500 text-white text-xs transition-all duration-200 shadow-2xl backdrop-blur-md ${
              activeFocus === 'parque' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zona Lúdica • El Rosco & Minijuegos</span>
                </div>
                <span className="text-[10px] bg-emerald-600 px-2.5 py-1 rounded-lg font-black text-white flex items-center gap-1 shadow-xs">
                  VISITAR PARQUE <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Bottom HUD Bar on image */}
          <div className="absolute bottom-3 left-4 right-4 z-10 hidden sm:flex items-center justify-between text-xs text-white/90 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 pointer-events-none">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Mapa Interactivo • Haz clic sobre cualquier edificio del plano</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              [1] Hospital • [2] Biblioteca • [3] Parque Lúdico
            </span>
          </div>

        </div>
      </div>

      {/* 3. THE 3 CLINICAL ACCESS CARDS: Direct Elegant Action Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* ======================================================== */}
        {/* CARD 1: EL HOSPITAL (Casos Clínicos) */}
        {/* ======================================================== */}
        <div
          onMouseEnter={() => setHoveredSpot('hospital')}
          onMouseLeave={() => setHoveredSpot(null)}
          onClick={() => onNavigate('casos')}
          className={`group bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-xl ${
            activeFocus === 'hospital'
              ? 'border-rose-500 ring-4 ring-rose-500/15 -translate-y-1'
              : 'border-slate-200/90 hover:border-rose-400'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold shadow-2xs group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                Urgencias & Diagnóstico
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-rose-600 uppercase tracking-wider block">
                Lugar Clave 1
              </span>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                El Hospital Clínico
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Donde se resuelven los casos clínicos
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Atiende a pacientes en el servicio de urgencias con dolor torácico, ictericia, dolor abdominal agudo, etc. Analiza constantes, solicita biomarcadores y confirma diagnósticos con coste eficiente.
            </p>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                {casesCount} Casos Reales
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                5 Sistemas Orgánicos
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600 group-hover:text-rose-700">
            <span>Visitar Hospital</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 2: LA BIBLIOTECA (Materiales de Apoyo y Estudio) */}
        {/* ======================================================== */}
        <div
          onMouseEnter={() => setHoveredSpot('biblioteca')}
          onMouseLeave={() => setHoveredSpot(null)}
          onClick={() => onNavigate('docencia')}
          className={`group bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-xl ${
            activeFocus === 'biblioteca'
              ? 'border-blue-500 ring-4 ring-blue-500/15 -translate-y-1'
              : 'border-slate-200/90 hover:border-blue-400'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                Estudio & Simuladores de Apoyo
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider block">
                Lugar Clave 2
              </span>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                La Biblioteca Médica
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Donde se encuentra el material de apoyo al aprendizaje
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Consulta los temarios oficiales del Departamento de Bioquímica y Biología Molecular III e Inmunología (UGR), simuladores cinéticos de apoyo (Ciclo de Randle, Ictericias, Hemostasia), vademécum analítico y preguntas de autoevaluación test.
            </p>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                Temario Oficial
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                Simuladores (Randle, Ictericia, Sangre)
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                Vademécum Analítico
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
            <span>Visitar Biblioteca</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD 3: EL PARQUE (Actividades y Juegos de Gamificación) */}
        {/* ======================================================== */}
        <div
          onMouseEnter={() => setHoveredSpot('parque')}
          onMouseLeave={() => setHoveredSpot(null)}
          onClick={() => onNavigate('ciudad')}
          className={`group bg-white rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-xl ${
            activeFocus === 'parque'
              ? 'border-emerald-500 ring-4 ring-emerald-500/15 -translate-y-1'
              : 'border-slate-200/90 hover:border-emerald-400'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Trees className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                Gamificación & Ganar Dinero 💰
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-emerald-600 uppercase tracking-wider block">
                Lugar Clave 3
              </span>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                El Parque Lúdico
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Donde jugar al Rosco, ganar dinero y superar retos
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Practica con actividades de gamificación: El Rosco Metabólico tipo Pasapalabra con 2 niveles (aciertos dan dinero), minijuegos analíticos (+💰 Fondos), Reto Diario contrarreloj 2.0x XP y trivia médica flash.
            </p>

            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                ⭕ El Rosco Metabólico
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                💰 Minijuegos Dinero
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                Reto Diario 2x XP
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
            <span>Visitar Parque</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>
    </div>
  );
};
