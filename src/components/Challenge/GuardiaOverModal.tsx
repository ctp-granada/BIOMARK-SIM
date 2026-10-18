import React, { useEffect } from 'react';
import { RefreshCw, Wallet, AlertTriangle, ShieldAlert, Gamepad2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { audioService } from '../../utils/audioService';

interface GuardiaOverModalProps {
  isOpen: boolean;
  onRestartGuardia: () => void;
  onGoToGames?: () => void;
}

export const GuardiaOverModal: React.FC<GuardiaOverModalProps> = ({
  isOpen,
  onRestartGuardia,
  onGoToGames
}) => {
  useEffect(() => {
    if (isOpen) {
      audioService.playGuardiaOver();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white max-w-md w-full rounded-2xl shadow-2xl border border-red-200 overflow-hidden text-center p-6 sm:p-8"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600 mb-4 animate-bounce">
          <Wallet className="w-9 h-9 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
          ¡Presupuesto de Guardia Agotado!
        </h2>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Has consumido los <strong className="text-red-600">Fondos Sanitarios (0 € restantes)</strong> debido al coste acumulado de determinaciones analíticas o penalizaciones por pruebas redundantes.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase mb-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Refinanciación Asistencial en el Parque</span>
          </div>
          <p className="text-xs text-amber-800 leading-normal">
            Puedes <strong className="font-semibold text-amber-950">ganar más dinero y presupuesto jugando</strong> en el Parque Biomédico (+250 € a +300 € de fondos por cada minijuego resuelto) o reiniciar directamente tu presupuesto a 5.000 €.
          </p>
        </div>

        <div className="space-y-2.5">
          {onGoToGames && (
            <button
              onClick={onGoToGames}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Gamepad2 className="w-4 h-4 text-white" />
              <span>Ganar Dinero en el Parque (Minijuegos)</span>
            </button>
          )}

          <button
            onClick={onRestartGuardia}
            className="w-full py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Restablecer Presupuesto Inicial (5.000 € Fondos)</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
