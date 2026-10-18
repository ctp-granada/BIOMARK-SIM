import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Biomarker, ClinicalCase } from '../../types';
import { BIOMARKERS_DATABASE } from '../../data/biomarkers';
import { 
  FlaskConical, 
  Dna, 
  Activity, 
  CheckCircle2, 
  Cpu, 
  Sparkles, 
  Layers, 
  Clock, 
  Gauge, 
  ShieldCheck,
  Zap,
  TestTubes
} from 'lucide-react';

interface HospitalLabProcessingModalProps {
  orderedBiomarkerIds: string[];
  currentCase: ClinicalCase;
  onComplete: () => void;
}

interface ProcessingStage {
  label: string;
  sublabel: string;
  icon: string;
  minProgress: number;
}

const STAGES: ProcessingStage[] = [
  {
    label: 'Recepción & Centrifugación STAT',
    sublabel: 'Separación de fase sérica a 3500 RPM (37°C)',
    icon: '🧪',
    minProgress: 0
  },
  {
    label: 'Autoanalizador Bioquímico en Curso',
    sublabel: 'Ensayo espectrofotométrico e inmunoquimioluminiscencia',
    icon: '⚡',
    minProgress: 28
  },
  {
    label: 'Control de Calidad & Calibración',
    sublabel: 'Validación de curvas cinéticas y límites de detección',
    icon: '🔬',
    minProgress: 65
  },
  {
    label: 'Emisión de Informe Analítico',
    sublabel: 'Firma electrónica y transmisión a Urgencias',
    icon: '📋',
    minProgress: 90
  }
];

export const HospitalLabProcessingModal: React.FC<HospitalLabProcessingModalProps> = ({
  orderedBiomarkerIds,
  currentCase,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Selected biomarkers objects
  const orderedBiomarkers: Biomarker[] = orderedBiomarkerIds
    .map((id) => BIOMARKERS_DATABASE.find((b) => b.id === id))
    .filter((b): b is Biomarker => b !== undefined);

  useEffect(() => {
    const totalDurationMs = 2400;
    const intervalTimeMs = 40;
    const step = 100 / (totalDurationMs / intervalTimeMs);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        // Update stage based on progress
        if (next >= 90) setActiveStageIndex(3);
        else if (next >= 65) setActiveStageIndex(2);
        else if (next >= 28) setActiveStageIndex(1);
        else setActiveStageIndex(0);

        return next;
      });
    }, intervalTimeMs);

    return () => clearInterval(interval);
  }, [onComplete]);

  const currentStage = STAGES[activeStageIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden relative text-white"
      >
        {/* Glowing Background Ambiance */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Top Header */}
        <div className="bg-slate-950/80 px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <TestTubes className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-cyan-400">
                  Laboratorio Central de Urgencias
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1" />
                  ANALIZADOR STAT ACTIVO
                </span>
              </div>
              <h3 className="text-sm font-black text-white tracking-tight">
                Procesando Petición Multianalítica en Tiempo Real
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onComplete}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Saltar animación y ver resultados inmediatamente"
            >
              <span>Saltar</span>
              <span className="text-[10px]">⏩</span>
            </button>
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Protocolo</span>
              <span className="text-xs font-mono font-bold text-cyan-300">
                URG-{Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 space-y-6">
          
          {/* Animated Centrifuge / Scanner Visual */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-center gap-5">
            
            {/* Centrifuge Rotor Animation */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              {/* Outer spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/60"
              />
              {/* Inner counter-rotating ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-blue-500/40"
              />
              {/* Core pulsing glowing center */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/40"
              >
                <Activity className="w-6 h-6 text-white" />
              </motion.div>

              {/* Scanning laser beam overlay */}
              <motion.div
                animate={{ y: [-30, 30, -30] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee] pointer-events-none"
              />
            </div>

            {/* Current Stage Info */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xl">{currentStage.icon}</span>
                <h4 className="text-base font-black text-white tracking-tight">
                  {currentStage.label}
                </h4>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {currentStage.sublabel}
              </p>

              {/* Telemetry info badges */}
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  37.0 °C
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Velocidad: 3500 RPM
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Calibrado
                </span>
              </div>
            </div>

            {/* Progress Percentage Display */}
            <div className="text-right shrink-0">
              <span className="font-mono text-3xl font-black text-cyan-400">
                {Math.min(100, Math.round(progress))}%
              </span>
              <span className="block text-[10px] uppercase font-bold text-slate-400">
                Progreso
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-lg shadow-cyan-500/50"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Stage Steps Indicator */}
            <div className="grid grid-cols-4 gap-1 text-center">
              {STAGES.map((s, idx) => {
                const isPassed = progress >= s.minProgress;
                const isCurrent = activeStageIndex === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full mb-1 transition-colors ${
                        isCurrent
                          ? 'bg-cyan-400 ring-2 ring-cyan-400/50'
                          : isPassed
                          ? 'bg-emerald-400'
                          : 'bg-slate-700'
                      }`}
                    />
                    <span
                      className={`text-[9px] font-bold leading-tight line-clamp-1 ${
                        isCurrent
                          ? 'text-cyan-300'
                          : isPassed
                          ? 'text-emerald-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Biomarkers in Batch Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span className="flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5 text-cyan-400" />
                Marcadores en Columna de Ensayo ({orderedBiomarkers.length})
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {orderedBiomarkers.filter((_, i) => progress >= ((i + 1) / orderedBiomarkers.length) * 80).length} / {orderedBiomarkers.length} cuantificados
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
              {orderedBiomarkers.map((bm, index) => {
                const threshold = ((index + 1) / orderedBiomarkers.length) * 80;
                const isItemDone = progress >= threshold;

                return (
                  <motion.div
                    key={bm.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                      isItemDone
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-xs shadow-emerald-500/10'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          isItemDone
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        }`}
                      >
                        {isItemDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          >
                            <Zap className="w-3 h-3 text-cyan-400" />
                          </motion.div>
                        )}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate text-white">
                          {bm.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {bm.abbreviation} • Rango: {bm.referenceValues.conventional}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isItemDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      }`}
                    >
                      {isItemDone ? 'OK' : 'Midiendo...'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Note */}
        <div className="bg-slate-950/90 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Simulación analítica hospitalaria acelerada
          </span>
          <span className="font-mono text-cyan-400 font-bold">
            Autoanalizador Roche Cobas / Abbott ARCHITECT
          </span>
        </div>
      </motion.div>
    </div>
  );
};
