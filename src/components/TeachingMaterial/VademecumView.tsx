import React, { useState, useMemo } from 'react';
import { BIOMARKERS_DATABASE } from '../../data/biomarkers';
import { Biomarker, OrganSystem, ActiveModule } from '../../types';
import { 
  Search, 
  Filter, 
  FlaskConical, 
  Clock, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowLeft, 
  Heart, 
  Droplet, 
  Zap, 
  Layers, 
  X, 
  Info, 
  ChevronRight,
  FileText,
  DollarSign,
  Sparkles,
  BookmarkCheck,
  Stethoscope
} from 'lucide-react';
import { BiochemicalInfoTooltip } from '../BiochemicalInfoTooltip';

interface VademecumViewProps {
  onBackToPortal?: () => void;
  onNavigate?: (module: ActiveModule) => void;
  embedded?: boolean;
}

const SYSTEM_CONFIG: Record<OrganSystem | 'all', { label: string; icon: string; color: string; badgeClass: string; borderClass: string }> = {
  all: { 
    label: 'Todos los Sistemas', 
    icon: '📚', 
    color: 'slate', 
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200', 
    borderClass: 'border-slate-200' 
  },
  cardiac: { 
    label: 'Cardiovascular', 
    icon: '❤️', 
    color: 'rose', 
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200', 
    borderClass: 'border-rose-200 hover:border-rose-300' 
  },
  hepatic: { 
    label: 'Hepático y Biliar', 
    icon: '🩸', 
    color: 'amber', 
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200', 
    borderClass: 'border-amber-200 hover:border-amber-300' 
  },
  metabolic: { 
    label: 'Metabólico y Endocrino', 
    icon: '⚡', 
    color: 'emerald', 
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200', 
    borderClass: 'border-emerald-200 hover:border-emerald-300' 
  },
  renal: { 
    label: 'Renal y Urinario', 
    icon: '💧', 
    color: 'blue', 
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200', 
    borderClass: 'border-blue-200 hover:border-blue-300' 
  },
  pancreatic: { 
    label: 'Pancreático', 
    icon: '🧪', 
    color: 'orange', 
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200', 
    borderClass: 'border-orange-200 hover:border-orange-300' 
  },
  neuromuscular: { 
    label: 'Neuromuscular', 
    icon: '🧠', 
    color: 'purple', 
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200', 
    borderClass: 'border-purple-200 hover:border-purple-300' 
  }
};

export const VademecumView: React.FC<VademecumViewProps> = ({
  onBackToPortal,
  onNavigate,
  embedded = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<OrganSystem | 'all'>('all');
  const [selectedBiomarker, setSelectedBiomarker] = useState<Biomarker | null>(null);

  const filteredBiomarkers = useMemo(() => {
    return BIOMARKERS_DATABASE.filter((b) => {
      // System filter
      if (selectedSystem !== 'all' && b.system !== selectedSystem) {
        return false;
      }
      // Text search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        b.name.toLowerCase().includes(q) ||
        b.abbreviation.toLowerCase().includes(q) ||
        b.clinicalRelevance.toLowerCase().includes(q) ||
        b.diagnosticIndication.toLowerCase().includes(q) ||
        (b.isoforms && b.isoforms.toLowerCase().includes(q)) ||
        b.discriminatoryContexts.some((ctx) => ctx.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedSystem]);

  const systemCounts = useMemo(() => {
    const counts: Record<string, number> = { all: BIOMARKERS_DATABASE.length };
    BIOMARKERS_DATABASE.forEach((b) => {
      counts[b.system] = (counts[b.system] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Top Banner (only when not embedded or standalone) */}
      {!embedded && (
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 border border-blue-900 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {onBackToPortal && (
                <button
                  onClick={onBackToPortal}
                  className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer mr-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver</span>
                </button>
              )}
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-600/30 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-300" />
                Vademécum Clínico Analítico
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-300 bg-slate-900 border border-slate-800">
                Departamento de Bioquímica Médica • Facultad de Medicina UGR
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>🧪 Vademécum de Biomarcadores</span>
              </h1>
              <BiochemicalInfoTooltip
                title="Catálogo de Biomarcadores y Diagnóstico Bioquímico"
                mechanism="Un biomarcador es una molécula cuantificable en fluidos biológicos (sangre, orina, LCR) cuya concentración y cinética temporal reflejan un proceso fisiológico normal, un estado patológico (lisis celular, sobrecarga mecánica, colestasis) o la respuesta a una terapia."
                molecularKey="Ventana cinética • Sensibilidad • Especificidad • Valores de corte"
                clinicalRelevance="La correcta interpretación de la semivida y del pico de elevación evita falsos diagnósticos por toma hiperprecoz o tardía."
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Catálogo oficial de más de 40 biomarcadores analíticos con valores de referencia (convencionales e internacionales SI), cinética de elevación y normalización, sensibilidad diagnóstica, falsos positivos y contextos discriminatorios.
            </p>
          </div>
        </div>
      )}

      {/* Search and System Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar biomarcador (ej. Troponina, ALT, BNP, Procalcitonina...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-semibold self-end sm:self-center shrink-0">
            Mostrando <strong className="text-slate-900">{filteredBiomarkers.length}</strong> de {BIOMARKERS_DATABASE.length} biomarcadores
          </div>
        </div>

        {/* System Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scroll">
          {(Object.keys(SYSTEM_CONFIG) as Array<OrganSystem | 'all'>).map((sysKey) => {
            const config = SYSTEM_CONFIG[sysKey];
            const isSelected = selectedSystem === sysKey;
            const count = systemCounts[sysKey] || 0;

            return (
              <button
                key={sysKey}
                onClick={() => setSelectedSystem(sysKey)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <span>{config.icon}</span>
                <span>{config.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Biomarker Cards Grid */}
      {filteredBiomarkers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="text-base font-bold text-slate-800">No se encontraron biomarcadores</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No coincide ningún parámetro con «{searchQuery}». Intenta buscar por abreviatura (ej. CK, Tn, GGT) o selecciona otro sistema orgánico.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSystem('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBiomarkers.map((bm) => {
            const sysConfig = SYSTEM_CONFIG[bm.system] || SYSTEM_CONFIG.all;

            return (
              <div
                key={bm.id}
                onClick={() => setSelectedBiomarker(bm)}
                className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${sysConfig.borderClass}`}
              >
                <div className="space-y-3">
                  {/* Card Header: Abbreviation & System Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-xs font-black font-mono tracking-tight">
                      {bm.abbreviation}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${sysConfig.badgeClass}`}>
                      <span>{sysConfig.icon}</span>
                      <span>{sysConfig.label}</span>
                    </span>
                  </div>

                  {/* Biomarker Name */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {bm.name}
                    </h3>
                    {bm.isoforms && (
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Isoformas: {bm.isoforms}
                      </span>
                    )}
                  </div>

                  {/* Reference Values Quick Box */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Rango de Referencia Normal
                    </div>
                    <div className="font-semibold text-slate-800 text-[11px] truncate" title={bm.referenceValues.conventional}>
                      {bm.referenceValues.conventional}
                    </div>
                    {bm.referenceValues.si && (
                      <div className="text-[10px] text-slate-500 font-mono truncate" title={bm.referenceValues.si}>
                        SI: {bm.referenceValues.si}
                      </div>
                    )}
                  </div>

                  {/* Kinetic and Diagnostic Parameters Pills */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-slate-400 block uppercase">Pico</span>
                        <span className="font-bold text-slate-800 truncate block">{bm.temporalWindow.peak}</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-slate-400 block uppercase">Sensibilidad</span>
                        <span className="font-bold text-slate-800 truncate block">{bm.diagnosticParams.sensitivity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Relevance snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {bm.clinicalRelevance}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {bm.cost ? (
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                      <span>Coste hosp.:</span>
                      <strong className="text-slate-700 font-mono">{bm.cost} €</strong>
                    </span>
                  ) : <span />}
                  <span className="text-blue-600 group-hover:text-blue-800 font-bold flex items-center gap-1 text-[11px]">
                    <span>Ver Ficha Técnica</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DETAILED BIOMARKER SHEET */}
      {selectedBiomarker && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-slate-800">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 border border-blue-200 text-xs font-black font-mono">
                    {selectedBiomarker.abbreviation}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 ${SYSTEM_CONFIG[selectedBiomarker.system]?.badgeClass || ''}`}>
                    <span>{SYSTEM_CONFIG[selectedBiomarker.system]?.icon}</span>
                    <span>{SYSTEM_CONFIG[selectedBiomarker.system]?.label}</span>
                  </span>
                  {selectedBiomarker.cost && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      Coste: {selectedBiomarker.cost} €
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {selectedBiomarker.name}
                </h2>
                {selectedBiomarker.isoforms && (
                  <p className="text-xs text-slate-500 font-mono">
                    Isoformas / Subtipos: {selectedBiomarker.isoforms}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedBiomarker(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Cerrar ficha"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reference Values and Cutoff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                  Valores de Referencia Fisiológicos
                </span>
                <div className="text-sm font-bold text-slate-900">
                  {selectedBiomarker.referenceValues.conventional}
                </div>
                {selectedBiomarker.referenceValues.si && (
                  <div className="text-xs text-blue-700 font-mono">
                    Unidades SI: {selectedBiomarker.referenceValues.si}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Punto de Corte Diagnóstico (Cutoff)
                </span>
                <div className="text-sm font-bold text-amber-950 font-mono">
                  {selectedBiomarker.diagnosticParams.optimalCutoff}
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>Sensibilidad: <strong className="text-slate-900">{selectedBiomarker.diagnosticParams.sensitivity}</strong></span>
                  <span>Especificidad: <strong className="text-slate-900">{selectedBiomarker.diagnosticParams.specificity}</strong></span>
                </div>
              </div>
            </div>

            {/* Kinetic Timeline */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Cinética Temporal Plasmática</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Inicio Elevación</span>
                  <strong className="text-slate-800 text-[11px] block mt-0.5">{selectedBiomarker.temporalWindow.elevationStart}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Pico Máximo</span>
                  <strong className="text-amber-800 text-[11px] block mt-0.5">{selectedBiomarker.temporalWindow.peak}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Normalización</span>
                  <strong className="text-emerald-800 text-[11px] block mt-0.5">{selectedBiomarker.temporalWindow.normalizationWindow}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase">Semivida</span>
                  <strong className="text-slate-800 text-[11px] block mt-0.5">{selectedBiomarker.temporalWindow.halfLife || 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Diagnostic Indications & Clinical Relevance */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs block mb-1 flex items-center gap-1.5 font-bold">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                  <span>Indicación Diagnóstica Principal:</span>
                </strong>
                <p className="text-slate-700 leading-relaxed">{selectedBiomarker.diagnosticIndication}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 text-xs block mb-1 flex items-center gap-1.5 font-bold">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>Relevancia Bioquímica y Fisiopatológica:</span>
                </strong>
                <p className="text-slate-700 leading-relaxed">{selectedBiomarker.clinicalRelevance}</p>
              </div>
            </div>

            {/* False Positives & Negatives */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200">
                <strong className="text-amber-900 block mb-2 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Falsos Positivos Clave:</span>
                </strong>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {selectedBiomarker.falsePositivesNegatives.falsePositives.map((fp, i) => (
                    <li key={i}>{fp}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200">
                <strong className="text-rose-900 block mb-2 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Falsos Negativos Clave:</span>
                </strong>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {selectedBiomarker.falsePositivesNegatives.falseNegatives.map((fn, i) => (
                    <li key={i}>{fn}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Discriminatory Contexts */}
            {selectedBiomarker.discriminatoryContexts.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs">
                <strong className="text-emerald-900 block mb-1.5 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contextos de Utilidad Discriminatoria:</span>
                </strong>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {selectedBiomarker.discriminatoryContexts.map((dc, i) => (
                    <li key={i}>{dc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                PID 26-158 • Bioquímica Médica UGR
              </span>
              <button
                onClick={() => setSelectedBiomarker(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
