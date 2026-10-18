import React from 'react';
import { ClinicalCase } from '../../types';
import { DailyChallengeState } from '../../utils/dailyChallenge';
import { 
  Sparkles, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  Trophy 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyChallengeBannerProps {
  dailyCase: ClinicalCase;
  dailyState: DailyChallengeState | null;
  onStartDailyChallenge: (c: ClinicalCase) => void;
}

export const DailyChallengeBanner: React.FC<DailyChallengeBannerProps> = ({
  dailyCase,
  dailyState,
  onStartDailyChallenge
}) => {
  const isCompleted = dailyState?.isCompletedToday ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-800 relative overflow-hidden mb-6"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
        
        {/* Left Info */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Reto Clínico Diario
            </span>

            <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-900 text-slate-300 border border-slate-800">
              Caso Complejo
            </span>

            <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Límite 2 Minutos
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{dailyCase.title}</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            Enfrenta el caso de alta complejidad seleccionado para hoy. Resuélvelo en menos de <strong className="text-slate-200 font-semibold">120 segundos</strong> para obtener una bonificación especial de <strong className="text-emerald-400 font-semibold">2.0x Multiplicador de XP</strong>.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1 flex-wrap">
            <span className="flex items-center gap-1 font-medium">
              <span className="text-slate-500">Sistema:</span> <span className="text-slate-200 uppercase">{dailyCase.system}</span>
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span className="text-slate-500">Dificultad:</span> <span className="text-slate-200 uppercase">{dailyCase.difficulty}</span>
            </span>
            <span className="flex items-center gap-1 font-medium text-emerald-400">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Multiplicador Contrarreloj: 2.0x (+100% XP)
            </span>
          </div>
        </div>

        {/* Right CTA / Status */}
        <div className="shrink-0 w-full lg:w-auto flex flex-col items-center sm:items-end justify-center">
          {isCompleted ? (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center w-full lg:w-64 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>¡Reto Diario Completado!</span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">
                Puntuación obtenida: <strong className="text-white font-semibold">{dailyState?.scoreEarned} XP</strong>
                {dailyState?.bonusMultiplierApplied && dailyState.bonusMultiplierApplied > 1 && (
                  <span className="block text-emerald-400 font-medium text-[10px]">
                    ⚡ Bonificación de velocidad {dailyState.bonusMultiplierApplied}x aplicada
                  </span>
                )}
              </p>
              <button
                onClick={() => onStartDailyChallenge(dailyCase)}
                className="mt-2 text-[11px] text-slate-400 hover:text-white font-medium underline cursor-pointer"
              >
                Repetir práctica
              </button>
            </div>
          ) : (
            <button
              onClick={() => onStartDailyChallenge(dailyCase)}
              className="w-full lg:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Zap className="w-4 h-4 text-white" />
              <span className="uppercase">Iniciar Reto Diario (2 min)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
};
