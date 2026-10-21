import React, { useState, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Dna,
  FlaskConical,
  HelpCircle,
  Stethoscope,
  Info
} from 'lucide-react';

export const CarnitineShuttleLab: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReset = () => {
    try {
      localStorage.removeItem('lanzadera-state');
    } catch {}
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className={`space-y-4 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-4 sm:p-6 overflow-y-auto' : ''}`}>
      {/* Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/60 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white border border-indigo-400/40 shadow-xs">
                <Dna className="w-3 h-3 text-indigo-200" />
                Simulador Fisiopatológico · Metabolismo Lipídico
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                UGR · Grado en Medicina
              </span>
              <span className="text-[11px] text-slate-300 font-medium">
                Bioquímica Médica
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>🧬 La Lanzadera Rota</span>
              <span className="text-sm font-normal text-indigo-200 hidden sm:inline">|</span>
              <span className="text-sm font-semibold text-indigo-200 hidden sm:inline">
                Defectos del Transporte Mitocondrial de Ácidos Grasos
              </span>
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Explora los defectos moleculares de entrada de acilos de cadena larga en la mitocondria (<strong>OCTN2 / PCD</strong>, <strong>CPT1A</strong>, <strong>CACT</strong>, <strong>CPT2 neonatal</strong> y <strong>CPT2 del adulto</strong>). Analiza la fuga urinaria de carnitina, el perfil de acilcarnitinas, la respuesta a <strong>L-carnitina</strong> y <strong>MCT</strong>, y resuelve casos clínicos en el <strong>Modo Detective</strong>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reiniciar parámetros del simulador"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reiniciar</span>
            </button>

            <a
              href="/assets/aistudio/La_lanzadera_rota_da6e2b05.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Abrir simulador en una nueva pestaña completa"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Nueva Pestaña</span>
            </a>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title={isFullscreen ? 'Salir de pantalla completa' : 'Ver a pantalla completa'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Salir Pantalla Completa</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Pantalla Completa</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-indigo-900/80 text-[11px]">
          <div className="flex items-center gap-1.5 text-indigo-200">
            <span className="font-extrabold text-amber-400">1.</span>
            <span>5 Bloqueos Moleculares</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-200">
            <span className="font-extrabold text-indigo-400">2.</span>
            <span>Perfil Acilcarnitinas C16/C18</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-200">
            <span className="font-extrabold text-emerald-400">3.</span>
            <span>L-Carnitina & Bypass MCT</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-200">
            <span className="font-extrabold text-rose-400">4.</span>
            <span>Modo Detective Clínico</span>
          </div>
        </div>
      </div>

      {/* Simulator Frame Container */}
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'h-[calc(100vh-160px)]' : 'h-[860px]'}`}>
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src="/assets/aistudio/La_lanzadera_rota_da6e2b05.html"
          title="Simulador de los Defectos de la Lanzadera de Carnitina"
          className="w-full h-full border-0 rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
};
