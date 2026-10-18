import React, { useEffect, useState } from 'react';
import { BarChart3, Users, FileSpreadsheet, MessageSquare, X, Loader2, Lock, Target } from 'lucide-react';
import {
  satisfactionService,
  MetricsResult,
  PROJECT_ITEMS,
  EXTRA_ITEMS,
} from '../../utils/satisfactionService';

interface SatisfactionMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSurvey?: () => void;
}

/** Objetivo del proyecto: valoración media ≥ 4 sobre 5 */
const PROJECT_TARGET = 4;

export const SatisfactionMetricsModal: React.FC<SatisfactionMetricsModalProps> = ({ isOpen, onClose }) => {
  const [result, setResult] = useState<MetricsResult | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setResult(null);
    satisfactionService.fetchMetrics().then((r) => { if (!cancelled) setResult(r); });
    return () => { cancelled = true; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    if (result?.status !== 'ok') return;
    const blob = new Blob([satisfactionService.toCSV(result.rows)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `encuesta_satisfaccion_biomark_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const Bar: React.FC<{ label: string; mean: number; sd: number; pct: number; highlight?: boolean }> = ({ label, mean, sd, pct, highlight }) => {
    const width = Math.min(100, (mean / 5) * 100);
    const ok = mean >= PROJECT_TARGET;
    return (
      <div className={`space-y-1.5 ${highlight ? 'p-3 rounded-xl border border-amber-200 bg-amber-50/50' : ''}`}>
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-700">{label}</span>
          <span className="font-mono text-slate-900 shrink-0">
            <strong>{mean.toFixed(2)}</strong> ± {sd.toFixed(2)} · {pct}% ≥ 4
          </span>
        </div>
        <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div className={`h-full rounded-full ${ok ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${width}%` }} />
          <div className="absolute top-0 bottom-0 w-px bg-slate-700" style={{ left: `${(PROJECT_TARGET / 5) * 100}%` }} title="Objetivo del proyecto (4/5)" />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
              <BarChart3 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white leading-tight">Resultados de la encuesta de satisfacción</h2>
              <p className="text-xs text-slate-300 mt-1">Solo para la coordinación. Datos reales y anónimos guardados en la base de datos de la asignatura.</p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold cursor-pointer shrink-0" aria-label="Cerrar">
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {!result && (
            <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Cargando respuestas…</span>
            </div>
          )}

          {result && result.status !== 'ok' && (
            <div className="py-10 text-center space-y-3 max-w-md mx-auto">
              <Lock className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-700">{result.message}</p>
            </div>
          )}

          {result?.status === 'ok' && result.metrics.total === 0 && (
            <div className="py-10 text-center text-sm text-slate-600">Todavía no hay ninguna respuesta.</div>
          )}

          {result?.status === 'ok' && result.metrics.total > 0 && (() => {
            const m = result.metrics;
            const global = m.items['valoracion_global'];
            return (
              <>
                {/* Resumen */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Respuestas</span>
                    <span className="text-2xl font-black text-slate-900 block mt-1">{m.total}</span>
                  </div>
                  <div className={`p-4 rounded-2xl border ${global.mean >= PROJECT_TARGET ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                    <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Valoración global</span>
                    <span className="text-2xl font-black text-slate-900 block mt-1">{global.mean.toFixed(2)} <span className="text-xs font-semibold text-slate-500">/ 5</span></span>
                    <span className="text-[10.5px] text-slate-600">Objetivo del proyecto: ≥ {PROJECT_TARGET} · {global.mean >= PROJECT_TARGET ? 'alcanzado' : 'no alcanzado'}</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold uppercase text-slate-500">SUS (0-100)</span>
                    <span className="text-2xl font-black text-slate-900 block mt-1">{m.sus.mean.toFixed(1)}</span>
                    <span className="text-[10.5px] text-slate-600">± {m.sus.sd.toFixed(1)} · {m.sus.pctAtLeast68}% ≥ 68 (aceptable)</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <span className="text-[10px] font-bold uppercase text-slate-500">NPS</span>
                    <span className="text-2xl font-black text-slate-900 block mt-1">{m.nps.score > 0 ? '+' : ''}{m.nps.score}</span>
                    <span className="text-[10.5px] text-slate-600">{m.nps.promoters}% promotores · {m.nps.detractors}% detractores</span>
                  </div>
                </div>

                {/* Ítems */}
                <section className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Ítems del proyecto (media ± DE · % que puntúa 4 o 5)</h3>
                  {PROJECT_ITEMS.map((it) => {
                    const s = m.items[it.key];
                    return <Bar key={it.key} label={it.label} mean={s.mean} sd={s.sd} pct={s.pctAtLeast4} highlight={it.key === 'valoracion_global'} />;
                  })}
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 pt-2">Ítems complementarios</h3>
                  {EXTRA_ITEMS.map((it) => {
                    const s = m.items[it.key];
                    return <Bar key={it.key} label={it.label} mean={s.mean} sd={s.sd} pct={s.pctAtLeast4} />;
                  })}
                  <p className="text-[10.5px] text-slate-500">La línea vertical marca el objetivo del proyecto (4 sobre 5).</p>
                </section>

                {/* Perfil */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([['Perfil', m.byProfile], ['Subgrupo', m.bySubgroup]] as const).map(([title, dist]) => (
                    <div key={title} className="p-4 rounded-2xl border border-slate-200 space-y-1.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-1">{title}</h3>
                      {Object.entries(dist as Record<string, number>).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                        <div key={k} className="flex justify-between text-[11.5px]">
                          <span className="text-slate-700">{k}</span>
                          <span className="font-mono font-bold">{v} ({Math.round((v / m.total) * 100)}%)</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </section>

                {/* Comentarios */}
                <section className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-slate-600" /> Comentarios ({m.comments.length})
                  </h3>
                  {m.comments.length === 0 && <p className="text-slate-500">Nadie ha dejado comentarios todavía.</p>}
                  {m.comments.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                      <span className="text-[10px] text-slate-500">{c.date} · {c.perfil}</span>
                      {c.mejor && <p><strong>Lo más útil:</strong> {c.mejor}</p>}
                      {c.sugerencia && <p><strong>Cambiaría:</strong> {c.sugerencia}</p>}
                    </div>
                  ))}
                </section>
              </>
            );
          })()}
        </div>

        <div className="p-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-2 shrink-0">
          <button
            onClick={handleDownloadCSV}
            disabled={result?.status !== 'ok' || result.metrics.total === 0}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar respuestas (CSV para Excel)</span>
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
