import React, { useEffect } from 'react';
import { Clock, Zap, AlertTriangle, Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyTimerHUDProps {
  timeRemainingSeconds: number; // 0 to 120
  totalSeconds?: number;        // default 120
  bonusMultiplier: number;      // e.g. 2.0x
  isExpired: boolean;
  onTimeExpire?: () => void;
}

export const DailyTimerHUD: React.FC<DailyTimerHUDProps> = ({
  timeRemainingSeconds,
  totalSeconds = 120,
  bonusMultiplier,
  isExpired,
  onTimeExpire
}) => {
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPct = Math.max(0, Math.min(100, (timeRemainingSeconds / totalSeconds) * 100));

  // Determine urgency level
  const isCritical = timeRemainingSeconds <= 30;
  const isWarning = timeRemainingSeconds <= 60 && !isCritical;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 sm:p-5 border shadow-lg transition-all relative overflow-hidden ${
        isExpired
          ? 'bg-slate-900 text-slate-300 border-slate-700'
          : isCritical
          ? 'bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 text-white border-red-500 ring-2 ring-red-500/40'
          : isWarning
          ? 'bg-gradient-to-r from-amber-950 via-orange-950 to-slate-900 text-white border-amber-500/80 ring-1 ring-amber-500/30'
          : 'bg-gradient-to-r from-indigo-950 via-blue-950 to-slate-900 text-white border-indigo-500/50 shadow-indigo-950/40'
      }`}
    >
      {/* Pulse background effects */}
      {isCritical && !isExpired && (
        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner shrink-0 ${
              isExpired
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : isCritical
                ? 'bg-red-500 text-white animate-bounce border border-red-300'
                : isWarning
                ? 'bg-amber-500 text-slate-950 border border-amber-300'
                : 'bg-indigo-600 text-white border border-indigo-400'
            }`}
          >
            <Clock className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Reto Clínico Diario
              </span>
              {!isExpired && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/30 border border-indigo-400 text-indigo-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                  Multiplicador {bonusMultiplier}x XP
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-black tracking-tight mt-0.5 flex items-center gap-2">
              <span>Desafío de Alta Dificultad Contrarreloj</span>
              {isCritical && !isExpired && (
                <span className="text-xs text-red-300 font-extrabold animate-pulse">
                  ¡ÚLTIMOS SEGUNDOS!
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Big Timer Digital Display */}
        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {isExpired ? 'Tiempo Agotado' : 'Tiempo Restante'}
            </span>
            <div
              className={`font-mono text-2xl sm:text-3xl font-black tracking-tight leading-none ${
                isExpired
                  ? 'text-slate-500'
                  : isCritical
                  ? 'text-red-400 animate-pulse'
                  : isWarning
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {formattedTime}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="mt-3.5 space-y-1.5 relative z-10">
        <div className="w-full bg-slate-800/90 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ ease: 'linear', duration: 1 }}
            className={`h-full rounded-full transition-all ${
              isExpired
                ? 'bg-slate-600'
                : isCritical
                ? 'bg-gradient-to-r from-rose-500 to-red-600 shadow-lg shadow-red-500/50'
                : isWarning
                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500'
            }`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
          <span>
            {isExpired ? (
              <span className="text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Tiempo límite concluido. Puedes terminar el caso normalmente con puntuación estándar.
              </span>
            ) : (
              <span>
                Completa el diagnóstico en <strong className="text-amber-300 font-bold">&lt; 2 minutos</strong> para desbloquear la bonificación especial de <strong className="text-amber-300 font-bold">+{Math.round((bonusMultiplier - 1) * 100)}% de XP</strong>.
              </span>
            )}
          </span>
          <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-2">
            {timeRemainingSeconds}s / {totalSeconds}s
          </span>
        </div>
      </div>
    </motion.div>
  );
};
