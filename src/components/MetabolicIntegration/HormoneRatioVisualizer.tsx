import React from 'react';
import { MetabolicState } from './types/metabolism';
import { Scale, Info, X } from 'lucide-react';

interface HormoneRatioVisualizerProps {
  currentState: MetabolicState;
  onClose?: () => void;
}

export const HormoneRatioVisualizer: React.FC<HormoneRatioVisualizerProps> = ({
  currentState,
  onClose
}) => {
  const insulin = currentState.hormones.insulin;
  const glucagon = currentState.hormones.glucagon;
  const igRatio = currentState.hormones.igRatio;

  // Calculate comparative weight (0 = pure glucagon, 100 = pure insulin)
  const totalHormoneLoad = (insulin?.percent || 0) + (glucagon?.percent || 0);
  const balancePercentage = totalHormoneLoad > 0 
    ? Math.round(((insulin?.percent || 0) / totalHormoneLoad) * 100) 
    : 50;

  // Ratio badge styling
  const getRatioBadgeStyle = (state: string) => {
    switch (state) {
      case 'muy_alto':
      case 'alto':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'equilibrado':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'bajo':
      case 'muy_bajo':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'cero':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border border-teal-200/90 rounded-2xl p-4 shadow-xs space-y-3 animate-in fade-in duration-200 transition-all">
      {/* Bar Header */}
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-teal-100 text-teal-800">
            <Scale className="w-3.5 h-3.5 text-teal-700" />
          </div>
          <span className="text-xs font-extrabold text-slate-900">
            Balance Hormonal en vivo: Insulina vs. Glucagón
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            (en {currentState.title})
          </span>
        </div>

        <div className="flex items-center gap-2">

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer shrink-0"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
              <span>Cerrar</span>
            </button>
          )}
        </div>
      </div>


      {/* Insulina, glucagón y balance I/G, uno debajo de otro */}
      <div className="space-y-3">
        {/* INSULIN STRIP (Col 1 to 4) */}
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Insulina (INS)
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-900 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
              {insulin?.valueText}
            </span>
          </div>

          {/* Visual Bar */}
          <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(4, Math.min(100, insulin?.percent || 0))}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px]">
            <span className="text-emerald-800 font-semibold uppercase">{insulin?.level.replace('_', ' ')}</span>
            <span className="text-emerald-700 font-mono font-bold">{insulin?.percent}% potencia</span>
          </div>
          <span className="text-[9.5px] text-slate-500 block leading-tight">
            Señal: <strong>PP1 activa</strong> (desfosforilación · anabolismo)
          </span>
        </div>

        {/* GLUCAGON STRIP (Col 9 to 12) */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
              Glucagón (GLU)
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-900 bg-white px-1.5 py-0.5 rounded border border-amber-200">
              {glucagon?.valueText}
            </span>
          </div>

          {/* Visual Bar */}
          <div className="w-full bg-amber-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(4, Math.min(100, glucagon?.percent || 0))}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px]">
            <span className="text-amber-800 font-semibold uppercase">{glucagon?.level.replace('_', ' ')}</span>
            <span className="text-amber-700 font-mono font-bold">{glucagon?.percent}% potencia</span>
          </div>
          <span className="text-[9.5px] text-slate-500 block leading-tight">
            Señal: <strong>PKA activa</strong> (fosforilación · catabolismo)
          </span>
        </div>

        {/* CENTRAL SEESAW GAUGE (Col 5 to 8) */}
        <div className="bg-slate-100/70 border border-slate-200 rounded-xl p-3 flex flex-col space-y-2 text-center">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-900">Balance I/G</span>
            {/* Ratio I/G Badge */}
            <div className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 ${getRatioBadgeStyle(igRatio?.state || '')}`}>
              <span className="text-slate-500 font-medium">Cociente I/G:</span>
              <span className="font-mono font-extrabold">{igRatio?.text || `${igRatio?.ratio}`}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-600">
            <span className="text-amber-800">Glucagón</span>
            <span className="text-slate-800 font-extrabold">
              {balancePercentage > 55 ? 'Anabolismo (I > G)' : balancePercentage < 45 ? 'Catabolismo (G > I)' : 'Equilibrio'}
            </span>
            <span className="text-emerald-800">Insulina</span>
          </div>

          {/* Balance Bar with Dynamic Marker */}
          <div className="relative w-full h-3 bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-500 rounded-full shadow-inner">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white -translate-x-1/2" />
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-slate-800 rounded-full shadow-xs transition-all duration-300"
              style={{ left: `${balancePercentage}%` }}
            />
          </div>

          <span className="text-[9.5px] text-slate-500 font-mono">
            {balancePercentage}% Insulina · {100 - balancePercentage}% Glucagón
          </span>
        </div>
      </div>
    </div>
  );
};
