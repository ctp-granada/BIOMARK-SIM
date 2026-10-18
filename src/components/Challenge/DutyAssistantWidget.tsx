import React, { useState, useEffect } from 'react';
import { ClinicalCase, Biomarker } from '../../types';
import { getDutyAssistantAdvice } from '../../utils/dutyAssistantAdvice';
import { 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Wallet, 
  ShieldAlert, 
  Stethoscope, 
  Info,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DutyAssistantWidgetProps {
  currentCase: ClinicalCase;
  budget: number;
  onApplyRecommended?: (biomarkerIds: string[]) => void;
  selectedBiomarkerIds?: string[];
}

export const DutyAssistantWidget: React.FC<DutyAssistantWidgetProps> = ({
  currentCase,
  budget,
  onApplyRecommended,
  selectedBiomarkerIds = []
}) => {
  const isCritical = budget < 1000;
  const isLow = budget <= 2000;

  // Auto-expand when budget is critical (< 1.000 €)
  const [isExpanded, setIsExpanded] = useState<boolean>(isCritical);

  useEffect(() => {
    if (isCritical) {
      setIsExpanded(true);
    }
  }, [isCritical]);

  const advice = getDutyAssistantAdvice(currentCase, budget);

  const allRecommendedSelected = advice.recommendedIds.every((id: string) =>
    selectedBiomarkerIds.includes(id)
  );

  const totalRecommendedCost = advice.recommendedBiomarkers.reduce(
    (sum: number, b: { cost: number }) => sum + b.cost,
    0
  );

  return (
    <div
      className={`rounded-2xl transition-all border shadow-md overflow-hidden ${
        isCritical
          ? 'bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 border-rose-600/60 shadow-rose-900/20'
          : isLow
          ? 'bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border-amber-500/50'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-slate-800'
      }`}
    >
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer select-none text-white transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isCritical
                ? 'bg-rose-600/30 text-rose-300 border-rose-500/50 animate-bounce'
                : isLow
                ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                : 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>Asistente de Guardia & Tutor Clínico</span>
              </span>

              {isCritical ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500 text-white flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="w-3 h-3" />
                  Presupuesto Crítico (&lt; 1.000 €)
                </span>
              ) : isLow ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/30 text-amber-200 border border-amber-400/40">
                  Presupuesto Ajustado ({budget.toLocaleString('es-ES')} €)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Consejos de Eficiencia
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {isCritical
                ? '⚠️ ¡Alerta presupuestaria! Aplica biomarcadores esenciales costo-efectivos para no agotar la guardia.'
                : 'Recomendaciones contextuales para optimizar la rentabilidad de las pruebas.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs font-mono">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span className={isCritical ? 'text-rose-400 font-bold' : 'text-slate-200'}>
              {budget.toLocaleString('es-ES')} €
            </span>
          </div>

          <button
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 px-5 py-4 space-y-4 text-xs text-slate-200"
          >
            {/* Supervisor Quote / Strategic Insight */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                  Orientación del Adjunto del Laboratorio de Urgencias:
                </div>
                <p className="italic text-slate-200 leading-relaxed">
                  {advice.supervisorQuote}
                </p>
                <div className="text-[11px] text-slate-400 font-medium pt-1">
                  💡 {advice.strategicTip}
                </div>
              </div>
            </div>

            {/* Grid of Recommended Biomarkers vs Tests to Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Cost-Effective Recommended Tests */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 space-y-2">
                <div className="flex items-center justify-between text-emerald-300 font-bold text-xs pb-1 border-b border-emerald-800/40">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Biomarcadores Clave Costo-Efectivos
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200 border border-emerald-700">
                    Total: -{totalRecommendedCost} €
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {advice.recommendedBiomarkers.map(({ biomarker, cost, efficiencyRationale }: any) => {
                    const isSelected = selectedBiomarkerIds.includes(biomarker.id);
                    return (
                      <div
                        key={biomarker.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                          isSelected
                            ? 'bg-emerald-900/60 border-emerald-400 text-white'
                            : 'bg-slate-900/80 border-emerald-800/60 text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{biomarker.name}</span>
                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                              {biomarker.abbreviation}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] bg-emerald-500 text-white px-1.5 py-0.2 rounded font-bold">
                                Añadido
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                            {efficiencyRationale}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 shrink-0 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                          -{cost} €
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tests to Avoid (Budget Wasters) */}
              <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 space-y-2">
                <div className="flex items-center text-rose-300 font-bold text-xs pb-1 border-b border-rose-800/40">
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Pruebas a Evitar en Este Contexto (Sobrecoste)
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {advice.biomarkersToAvoid.length === 0 ? (
                    <div className="p-2 text-[11px] text-slate-400 italic">
                      Evita añadir paneles de sistemas no relacionados para evitar penalizaciones.
                    </div>
                  ) : (
                    advice.biomarkersToAvoid.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/80 border border-rose-900/60 text-xs space-y-0.5"
                      >
                        <div className="font-bold text-rose-300 flex items-center gap-1">
                          <span>❌ {item.biomarkerName}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {item.reason}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action: Apply Recommended Battery */}
            {onApplyRecommended && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/10">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>
                    Esta selección garantiza confirmación diagnóstica con máxima eficiencia de presupuesto.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onApplyRecommended(advice.recommendedIds)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 ${
                    allRecommendedSelected
                      ? 'bg-emerald-700 text-emerald-100 hover:bg-emerald-600'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25 active:scale-[0.98]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {allRecommendedSelected
                      ? '✓ Batería Costo-Efectiva Ya Cargada'
                      : `Cargar Batería Costo-Efectiva Sugerida (${advice.recommendedIds.length} pruebas / -${totalRecommendedCost} €)`}
                  </span>
                  {!allRecommendedSelected && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
