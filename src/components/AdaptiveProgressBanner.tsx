import React from 'react';
import { UserProgress, OrganSystem } from '../types';
import { Award, Flame, TrendingUp } from 'lucide-react';

interface AdaptiveProgressBannerProps {
  userProgress: UserProgress;
}

export const AdaptiveProgressBanner: React.FC<AdaptiveProgressBannerProps> = ({ userProgress }) => {
  const total = userProgress.casesAttempted;
  const correct = userProgress.casesCorrect;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const systemNames: Record<OrganSystem, string> = {
    cardiac: 'Cardíaco',
    hepatic: 'Hepático / Ictericias',
    metabolic: 'Metabolismo / β-Oxidación',
    renal: 'Renal / Urea / Uricemia',
    pancreatic: 'Pancreático-Digestivo',
    neuromuscular: 'Neuromuscular / Señalización'
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (acc >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-amber-500/15 rounded-xl border border-amber-300 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Progreso Adaptativo</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize">
                Nivel {userProgress.currentLevel}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-900 mt-0.5">
              Dificultad adaptada dinámicamente según precisión diagnóstica
            </p>
          </div>
        </div>

        {/* Global Key Indicators */}
        <div className="flex items-center gap-2.5">
          <div className="text-center px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400">Precisión</div>
            <div className="text-sm font-mono font-bold text-slate-900">{accuracy}%</div>
          </div>
          <div className="text-center px-3.5 py-1.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <div className="text-[10px] uppercase font-bold text-emerald-800 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Racha</span>
            </div>
            <div className="text-sm font-mono font-bold text-emerald-950">{userProgress.streak} aciertos</div>
          </div>
          <div className="text-center px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-400">Consultas</div>
            <div className="text-sm font-mono font-bold text-slate-800">{userProgress.libraryConsultations}</div>
          </div>
        </div>
      </div>

      {/* Accuracy Breakdown per System */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
            <span>Dominio de Sistemas Orgánicos</span>
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-medium">
            Retención y aciertos analíticos por especialidad
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {(Object.keys(systemNames) as OrganSystem[]).map((sys) => {
            const stats = userProgress.systemStats?.[sys] || { attempted: 0, correct: 0 };
            const sysAcc = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
            return (
              <div key={sys} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-800 truncate">{systemNames[sys]}</span>
                  {stats.attempted > 0 && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${getAccuracyColor(sysAcc)}`}>
                      {sysAcc}%
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {stats.correct}/{stats.attempted} resueltos
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${stats.attempted > 0 ? sysAcc : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

