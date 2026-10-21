import React, { useState, useRef, useEffect } from 'react';
import { Info, Sparkles, X } from 'lucide-react';

interface BiochemicalInfoTooltipProps {
  title: string;
  mechanism: string;
  molecularKey?: string;
  clinicalRelevance?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  className?: string;
  buttonVariant?: 'subtle' | 'badge' | 'solid';
  buttonLabel?: string;
}

export const BiochemicalInfoTooltip: React.FC<BiochemicalInfoTooltipProps> = ({
  title,
  mechanism,
  molecularKey,
  clinicalRelevance,
  position = 'auto',
  className = '',
  buttonVariant = 'subtle',
  buttonLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const buttonStyles = {
    subtle:
      'w-6 h-6 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center transition-all shadow-2xs group-hover:scale-105 cursor-pointer',
    badge:
      'px-2.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer',
    solid:
      'w-6 h-6 rounded-full bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer'
  }[buttonVariant];

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={buttonStyles}
        title="Ver mecanismo bioquímico simulado"
        aria-label="Ver mecanismo bioquímico simulado"
      >
        <Info className="w-3.5 h-3.5 shrink-0" />
        {buttonLabel && <span className="font-semibold">{buttonLabel}</span>}
      </button>

      {/* Floating Tooltip Card */}
      {isOpen && (
        <div
          className={`absolute z-50 w-72 sm:w-84 p-3.5 rounded-2xl bg-slate-950/95 text-white border border-slate-700 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 text-left pointer-events-auto ${
            position === 'top'
              ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
              : position === 'left'
              ? 'right-full mr-2 top-1/2 -translate-y-1/2'
              : position === 'right'
              ? 'left-full ml-2 top-1/2 -translate-y-1/2'
              : 'top-full mt-2 left-1/2 -translate-x-1/2'
          }`}
          style={{ maxWidth: 'calc(100vw - 32px)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block leading-tight">
                  Mecanismo Bioquímico
                </span>
                <h4 className="text-xs font-bold text-white leading-snug">{title}</h4>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer sm:hidden"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body explanation */}
          <p className="text-xs text-slate-300 leading-relaxed font-normal">{mechanism}</p>

          {/* Molecular Key */}
          {molecularKey && (
            <div className="mt-2.5 p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-amber-200/90 flex items-start gap-1.5">
              <strong className="text-amber-400 shrink-0 font-bold">Diana Clave:</strong>
              <span>{molecularKey}</span>
            </div>
          )}

          {/* Clinical Relevance */}
          {clinicalRelevance && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
              <strong className="text-emerald-400">Relevancia Clínica: </strong>
              <span>{clinicalRelevance}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
