import React from 'react';
import { DetailedEnzyme, DetailedSubstrate } from './types/metabolism';
import { X, Dna, Atom, Layers, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';

interface BiochemicalInspectorModalProps {
  item: { type: 'enzyme'; data: DetailedEnzyme } | { type: 'substrate'; data: DetailedSubstrate } | null;
  onClose: () => void;
  onSelectRelatedItem?: (type: 'enzyme' | 'substrate', id: string) => void;
}

export const BiochemicalInspectorModal: React.FC<BiochemicalInspectorModalProps> = ({
  item,
  onClose,
  onSelectRelatedItem
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 relative"
        role="dialog"
      >
        {/* Close Button */}
        <div className="sticky top-0 z-10 flex justify-end -mt-2 mb-1 pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer"
            title="Cerrar Inspector"
          >
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* ENZYME INSPECTION VIEW */}
        {item.type === 'enzyme' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
                <Dna className="w-4 h-4 text-teal-700" />
                <span>Inspector Enzimático · {item.data.ecNumber}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {item.data.name}{' '}
                <span className="text-sm font-mono text-teal-700 font-semibold">({item.data.abbreviation})</span>
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>Vía: {item.data.pathway}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-slate-700">Compartimento: {item.data.compartment}</span>
              </div>
            </div>

            {/* Reaction Catalyzed Banner */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Reacción Química Catalizada</span>
              <div className="font-mono font-bold text-slate-900 text-sm tracking-tight">
                {item.data.reactionText}
              </div>
            </div>

            {/* Substrates & Products */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Sustratos</span>
                <div className="flex flex-wrap gap-1">
                  {item.data.substrates.map((s, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-800 text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Productos</span>
                <div className="flex flex-wrap gap-1">
                  {item.data.products.map((p, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-800 text-[11px]">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Coenzymes */}
            {item.data.coenzymes.length > 0 && (
              <div className="text-xs">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Cofactores & Coenzimas Requeridas</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.data.coenzymes.map((co, idx) => (
                    <span key={idx} className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded font-mono text-[11px] font-semibold">
                      {co}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Allosteric & Covalent Regulation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-emerald-900 uppercase block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Moduladores Alostéricos Positivos (+)</span>
                </span>
                <ul className="space-y-1 text-emerald-950 text-[11px]">
                  {item.data.allostericActivators.length > 0 ? (
                    item.data.allostericActivators.map((act, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                        <span>{act}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">Sin activadores alostéricos directos descritos</li>
                  )}
                </ul>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-rose-900 uppercase block mb-1.5 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                  <span>Moduladores Alostéricos Negativos (-)</span>
                </span>
                <ul className="space-y-1 text-rose-950 text-[11px]">
                  {item.data.allostericInhibitors.length > 0 ? (
                    item.data.allostericInhibitors.map((inh, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                        <span>{inh}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">Sin inhibidores alostéricos directos descritos</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Covalent & Hormonal Regulation */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                Regulación Hormonal Covalente (Fosforilación / Desfosforilación)
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {item.data.covalentRegulation}
              </p>
            </div>

            {/* Clinical & Pharmacological Significance */}
            <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-200 text-xs text-teal-950">
              <span className="font-bold text-teal-900 block uppercase tracking-wider text-[10px] mb-1">
                Relevancia Fisiopatológica & Farmacología
              </span>
              <p className="leading-relaxed text-[11px] text-slate-700">
                {item.data.clinicalRelevance}
              </p>
            </div>
          </div>
        )}

        {/* SUBSTRATE INSPECTION VIEW */}
        {item.type === 'substrate' && (
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
                <Atom className="w-4 h-4 text-sky-700" />
                <span>Inspector de Metabolito · Fórmula: {item.data.formula}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.data.name}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.data.role}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <span className="text-slate-500 font-medium">Compartimento Celular Primario:</span>
              <span className="font-bold text-slate-800">{item.data.compartment}</span>
            </div>

            {/* Anabolic vs Catabolic Fates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-emerald-900 uppercase block mb-1">Destino Anabólico (Síntesis)</span>
                <p className="text-[11px] text-emerald-950 leading-relaxed">{item.data.anabolicFate}</p>
              </div>

              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-amber-900 uppercase block mb-1">Destino Catabólico (Degradación)</span>
                <p className="text-[11px] text-amber-950 leading-relaxed">{item.data.catabolicFate}</p>
              </div>
            </div>

            {/* Allosteric Modulator Role */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
                Rol Regulador Alostérico sobre Otras Vías
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                {item.data.allostericRole}
              </p>
            </div>

            {/* Associated Enzymes List */}
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1.5">
                Enzimas & Transportadores Vinculados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.data.associatedEnzymes.map((enz, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium"
                  >
                    {enz}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
