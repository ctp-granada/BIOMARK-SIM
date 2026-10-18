import React, { useState, useMemo } from 'react';
import { Biomarker, ClinicalCase, OrganSystem } from '../../types';
import {
  Search,
  BookOpen,
  Filter,
  Activity,
  Heart,
  Zap,
  Clock,
  AlertTriangle,
  Info,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  FlaskConical,
  X,
  Layers
} from 'lucide-react';

interface BiomarkerLibraryProps {
  biomarkers: Biomarker[];
  activeCase?: ClinicalCase | null;
  isChallengeModeContext?: boolean;
}

export const BiomarkerLibrary: React.FC<BiomarkerLibraryProps> = ({
  biomarkers,
  activeCase,
  isChallengeModeContext = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<OrganSystem | 'all'>('all');
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);

  const filteredBiomarkers = useMemo(() => {
    return biomarkers.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.clinicalRelevance.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.diagnosticIndication.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSystem = selectedSystem === 'all' || b.system === selectedSystem;
      return matchesSearch && matchesSystem;
    });
  }, [biomarkers, searchTerm, selectedSystem]);

  const activeBiomarker = selectedBiomarker || filteredBiomarkers[0] || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Vademécum & Biblioteca de Diagnóstico Bioquímico</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Catálogo Oficial de Biomarcadores Clínicos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Valores de referencia (SI y convencionales), cinéticas enzimáticas, ventanas temporales y fisiopatología diagnóstica.
          </p>
        </div>

        {isChallengeModeContext && (
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Modo Consulta en Guardia Activa</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, sigla (hs-cTn, CK-MB, Lipasa...) o indicación clínica..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* System Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'all', label: 'Todos' },
              { id: 'cardiac', label: 'Cardíaco' },
              { id: 'hepatic', label: 'Hepático' },
              { id: 'metabolic', label: 'Metabolismo' },
              { id: 'renal', label: 'Renal / Urea' },
              { id: 'pancreatic', label: 'Pancreático' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSystem(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedSystem === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Biomarkers List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredBiomarkers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-400 text-xs">
              No se han encontrado biomarcadores con los criterios especificados.
            </div>
          ) : (
            filteredBiomarkers.map((b) => {
              const isSelected = activeBiomarker?.id === b.id;
              const isRelevantToCase = activeCase && b.system === activeCase.system;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBiomarker(b)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-emerald-50/60 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {b.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-bold">
                        {b.abbreviation}
                      </span>
                    </div>

                    {isRelevantToCase && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Caso Activo
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {b.diagnosticIndication}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize font-medium">
                      Sistema: {b.system}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      Consultar ficha <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Biomarker Detail Sheet */}
        <div className="lg:col-span-7">
          {activeBiomarker ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 sticky top-6">
              {/* Header */}
              <div className="pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    <FlaskConical className="w-4 h-4" />
                    <span>Ficha Bioquímica & Laboratorial</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <span>{activeBiomarker.name}</span>
                    <span className="text-sm font-mono text-slate-500">
                      ({activeBiomarker.abbreviation})
                    </span>
                  </h2>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {activeBiomarker.system}
                </span>
              </div>

              {/* Reference Values Grid */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  Valores de Referencia Fisiológicos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Unidades Convencionales
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {activeBiomarker.referenceValues?.conventional || 'N/D'}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Sistema Internacional (SI)
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      {activeBiomarker.referenceValues?.si || 'N/D'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Temporal Kinetics */}
              {activeBiomarker.temporalWindow && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    Cinética de Elevación y Aclaramiento
                  </h3>
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[10px] font-bold uppercase text-amber-800 block mb-1">
                        Inicio Elevación
                      </span>
                      <span className="font-bold text-amber-950">
                        {activeBiomarker.temporalWindow.elevationStart}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
                      <span className="text-[10px] font-bold uppercase text-rose-800 block mb-1">
                        Pico Máximo
                      </span>
                      <span className="font-bold text-rose-950">
                        {activeBiomarker.temporalWindow.peakWindow}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                        Normalización
                      </span>
                      <span className="font-bold text-emerald-950">
                        {activeBiomarker.temporalWindow.normalizationWindow}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pathophysiological and Clinical Mechanism */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-500" />
                  Mecanismo Fisiopatológico & Relevancia Clínica
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  {activeBiomarker.clinicalRelevance}
                </div>
              </div>

              {/* Differential Contexts / False Positives / False Negatives */}
              {activeBiomarker.falsePositivesNegatives && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs space-y-1">
                    <span className="font-bold text-rose-800 block text-[11px] uppercase tracking-wide">
                      ⚠️ Falsos Positivos:
                    </span>
                    <ul className="list-disc list-inside text-rose-900 text-[11px] space-y-0.5">
                      {activeBiomarker.falsePositivesNegatives.falsePositives?.map((fp, i) => (
                        <li key={i}>{fp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs space-y-1">
                    <span className="font-bold text-amber-800 block text-[11px] uppercase tracking-wide">
                      ⚡ Falsos Negativos / Limitaciones:
                    </span>
                    <ul className="list-disc list-inside text-amber-900 text-[11px] space-y-0.5">
                      {activeBiomarker.falsePositivesNegatives.falseNegatives?.map((fn, i) => (
                        <li key={i}>{fn}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Selecciona un biomarcador de la lista para inspeccionar sus características.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
