import React, { useState, useMemo } from 'react';
import { Biomarker, ClinicalCase, OrganSystem } from '../../types';
import { BIOMARKERS_DATABASE } from '../../data/biomarkers';
import { getBiomarkerCost, getEssentialBiomarkerIdsForCase } from '../../utils/labOrderEvaluator';
import { HospitalLabProcessingModal } from './HospitalLabProcessingModal';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Check, 
  Trash2, 
  AlertCircle, 
  Zap, 
  Sparkles, 
  ArrowRight,
  Wallet,
  Activity,
  Filter,
  CheckSquare,
  Square,
  ShieldCheck,
  Loader2,
  HelpCircle,
  BookOpen,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MultiBiomarkerLabPanelProps {
  currentCase: ClinicalCase;
  userBudget: number;
  onSubmitLabOrder: (orderedBiomarkerIds: string[]) => void;
  consultedBiomarkerIds?: string[];
  onConsultBiomarker?: (biomarkerId: string, cost?: number) => boolean;
}

const SYSTEM_TABS: { id: OrganSystem | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Todos', icon: '🌐' },
  { id: 'pancreatic', label: 'Pancreático-Digestivo', icon: '🔬' },
  { id: 'cardiac', label: 'Cardíaco', icon: '🫀' },
  { id: 'hepatic', label: 'Hepático / Ictericias', icon: '🪵' },
  { id: 'metabolic', label: 'Metabólico / β-Oxid.', icon: '⚡' },
  { id: 'renal', label: 'Renal / Uricemia', icon: '🫘' },
  { id: 'neuromuscular', label: 'Neuromuscular', icon: '🧠' },
];

interface PresetBattery {
  id: string;
  name: string;
  description: string;
  system: OrganSystem;
  biomarkerIds: string[];
}

const PRESET_BATTERIES: PresetBattery[] = [
  {
    id: 'preset_pancreatic_tg',
    name: 'Perfil Pancreático & Lipemia',
    description: 'Lipasa + Triglicéridos + Amilasa',
    system: 'pancreatic',
    biomarkerIds: ['bm_lipasa', 'bm_trigliceridos', 'bm_amilasa']
  },
  {
    id: 'preset_digestive_malabsorp',
    name: 'Perfil Celíaca & Malabsorción',
    description: 'tTG-IgA + Vitamina B12 + Magnesio',
    system: 'pancreatic',
    biomarkerIds: ['bm_ttg_iga', 'bm_vitamina_b12', 'bm_magnesio']
  },
  {
    id: 'preset_cardiac_ami',
    name: 'Perfil Síndrome Coronario',
    description: 'Troponina hs + CK-MB + NT-proBNP',
    system: 'cardiac',
    biomarkerIds: ['bm_troponin_c', 'bm_ckmb', 'bm_nt_probnp']
  },
  {
    id: 'preset_hepatic_cholestasis',
    name: 'Perfil Hepático & Colestasis',
    description: 'Bilirrubinas + FA + GGT + ALT',
    system: 'hepatic',
    biomarkerIds: ['bm_bilirrubina_total', 'bm_bilirrubina_directa', 'bm_fosfatasa_alcalina', 'bm_ggt', 'bm_alt']
  },
  {
    id: 'preset_metabolic_crisis',
    name: 'Perfil Cetoacidosis / β-Oxidación',
    description: 'Glucosa + Cuerpos Cetónicos + Acilcarnitinas',
    system: 'metabolic',
    biomarkerIds: ['bm_glucosa', 'bm_beta_hidroxibutirato', 'bm_perfil_acilcarnitinas']
  },
  {
    id: 'preset_renal_nitrogen',
    name: 'Perfil Ciclo Urea & Uricemia',
    description: 'Amonio + Ácido Úrico + Creatinina + Urea',
    system: 'renal',
    biomarkerIds: ['bm_amonio_plasmatico', 'bm_acido_urico', 'bm_creatinina', 'bm_urea']
  }
];

export const MultiBiomarkerLabPanel: React.FC<MultiBiomarkerLabPanelProps> = ({
  currentCase,
  userBudget,
  onSubmitLabOrder,
  consultedBiomarkerIds = [],
  onConsultBiomarker
}) => {
  const [selectedBiomarkerIds, setSelectedBiomarkerIds] = useState<string[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<OrganSystem | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [biomarkerPendingConsultation, setBiomarkerPendingConsultation] = useState<Biomarker | null>(null);
  const [consultationToast, setConsultationToast] = useState<string | null>(null);

  // Total cost calculation
  const selectedBiomarkers = useMemo(() => {
    return BIOMARKERS_DATABASE.filter((b) => selectedBiomarkerIds.includes(b.id));
  }, [selectedBiomarkerIds]);

  const totalCost = useMemo(() => {
    return selectedBiomarkers.reduce((sum, b) => sum + getBiomarkerCost(b), 0);
  }, [selectedBiomarkers]);

  const projectedRemainingBudget = Math.max(0, userBudget - totalCost);
  const isOverBudget = totalCost > userBudget;

  // Filtered biomarkers database (prevents matching hidden indications unless already unlocked)
  const filteredBiomarkers = useMemo(() => {
    return BIOMARKERS_DATABASE.filter((b) => {
      const matchSystem = selectedSystem === 'all' || b.system === selectedSystem;
      const q = searchQuery.toLowerCase().trim();
      const isUnlocked = consultedBiomarkerIds.includes(b.id);
      const matchSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.abbreviation.toLowerCase().includes(q) ||
        (isUnlocked && (
          b.diagnosticIndication.toLowerCase().includes(q) ||
          b.clinicalRelevance.toLowerCase().includes(q)
        ));
      return matchSystem && matchSearch;
    });
  }, [selectedSystem, searchQuery, consultedBiomarkerIds]);

  const handleConfirmConsultation = (b: Biomarker) => {
    if (userBudget < 50) return;
    const ok = onConsultBiomarker ? onConsultBiomarker(b.id, 50) : true;
    if (ok) {
      setBiomarkerPendingConsultation(null);
      setConsultationToast(`Ficha clínica desbloqueada para ${b.name} (-50 € Presupuesto Sanitario).`);
      setTimeout(() => {
        setConsultationToast(null);
      }, 4000);
    }
  };

  const essentialIds = useMemo(() => {
    return getEssentialBiomarkerIdsForCase(currentCase);
  }, [currentCase]);

  const toggleBiomarker = (id: string) => {
    setSelectedBiomarkerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const applyPreset = (preset: PresetBattery) => {
    setSelectedBiomarkerIds((prev) => {
      const combined = Array.from(new Set([...prev, ...preset.biomarkerIds]));
      return combined;
    });
  };

  const clearSelection = () => {
    setSelectedBiomarkerIds([]);
  };

  const handleSubmit = () => {
    if (selectedBiomarkerIds.length === 0 || isProcessingOrder) return;
    setIsProcessingOrder(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessingOrder(false);
    onSubmitLabOrder(selectedBiomarkerIds);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner for Multi-Biomarker Requisition */}
      {/* Top Banner: Panel Information & Budget Balance */}
      <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-slate-900 text-emerald-400 border border-slate-800 flex items-center gap-1">
                <ClipboardList className="w-3 h-3 text-emerald-400" />
                <span>Petitorio Analítico Multianalítica</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                • Solicitud de Pruebas de Laboratorio
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Orden de Laboratorio y Selección Múltiple de Biomarcadores
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Seleccione uno o más biomarcadores para formular la batería analítica óptima. Evalúa la pertinencia diagnóstica, especificidad y gestión del presupuesto sanitario.
            </p>
          </div>

          {/* Budget Meter Tag */}
          <div className="bg-slate-900 px-4 py-3 rounded-xl border border-slate-800 shrink-0 flex items-center gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <Wallet className="w-3 h-3 text-emerald-400" />
                <span>Coste Petición</span>
              </div>
              <div className={`text-base font-mono font-bold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                {totalCost.toLocaleString('es-ES')} € <span className="text-xs text-slate-400 font-sans">({selectedBiomarkerIds.length} pruebas)</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Presupuesto Restante</div>
              <div className="text-base font-mono font-bold text-slate-200">
                {projectedRemainingBudget.toLocaleString('es-ES')} €
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Quick Preset Batteries */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Perfiles Rápidos Sugeridos por Especialidad:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_BATTERIES.map((preset) => {
              const allIncluded = preset.biomarkerIds.every((id) => selectedBiomarkerIds.includes(id));
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                    allIncluded
                      ? 'bg-slate-800 border-slate-700 text-emerald-300 font-semibold shadow-xs'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                  title={preset.description}
                >
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span className="font-semibold">{preset.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({preset.biomarkerIds.length})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Column: Biomarker Catalog & Search Filters (8 cols) */}
        <div id="tour-multi-biomarker-catalog" className="lg:col-span-8 flex flex-col gap-4">
          {/* Controls: Search and System Category Tabs */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar biomarcador por nombre, sigla (p.ej. Lipasa, Troponina, tTG-IgA, Amonio)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* System Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {SYSTEM_TABS.map((tab) => {
                const isActive = selectedSystem === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedSystem(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Biomarkers Catalog List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredBiomarkers.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">No se encontraron biomarcadores con ese criterio de búsqueda</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedSystem('all'); }}
                  className="mt-2 text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              filteredBiomarkers.map((biomarker) => {
                const isSelected = selectedBiomarkerIds.includes(biomarker.id);
                const cost = getBiomarkerCost(biomarker);

                return (
                  <div
                    key={biomarker.id}
                    onClick={() => toggleBiomarker(biomarker.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {biomarker.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {biomarker.abbreviation}
                          </span>
                        </div>

                        {/* Parameter Clinical Utility: hidden by default to test clinical knowledge; consultable at cost of budget */}
                        {consultedBiomarkerIds.includes(biomarker.id) ? (
                          <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-emerald-200 text-xs space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                              <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                                Ficha Diagnóstica Consultada
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
                                -50 € Presupuesto Aplicado
                              </span>
                            </div>
                            <div className="text-slate-800 leading-relaxed">
                              <span className="font-semibold text-slate-900">Para qué sirve / Indicación: </span>
                              <span className="text-slate-700">{biomarker.diagnosticIndication}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 border-t border-slate-200/80 pt-1 leading-relaxed">
                              <span className="font-semibold text-slate-700">Mecanismo fisiopatológico: </span>
                              <span>{biomarker.clinicalRelevance}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setBiomarkerPendingConsultation(biomarker);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/90 border border-slate-300 transition-colors cursor-pointer group shadow-2xs"
                              title="Consultar indicación y para qué sirve este parámetro (-50 € presupuesto)"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
                              <span>¿Para qué sirve este parámetro?</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold ml-0.5">
                                -50 € Presupuesto
                              </span>
                            </button>
                            <span className="text-[11px] text-slate-400 italic">
                              (Oculto para evaluar criterio clínico)
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                          <span>Ref: {biomarker.referenceValues.conventional}</span>
                          <span>• Ventana: {biomarker.temporalWindow.peakWindow}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        isSelected 
                          ? 'bg-slate-900 text-emerald-400 border-slate-800' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        🪙 -{cost} € Presupuesto
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBiomarker(biomarker.id);
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {isSelected ? 'Quitar' : '+ Añadir'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Order Requisition Slip / Summary Cart (4 cols) */}
        <div id="tour-order-slip" className="lg:col-span-4 flex flex-col gap-4 sticky top-4">
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              {/* Slip Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Volante de Laboratorio
                  </span>
                </div>
                {selectedBiomarkerIds.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Vaciar</span>
                  </button>
                )}
              </div>

              {/* Selected List */}
              <div className="py-4 space-y-2">
                {selectedBiomarkers.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-2">
                    <Activity className="w-8 h-8 mx-auto text-slate-700" />
                    <p className="text-xs font-medium text-slate-300">Ningún biomarcador seleccionado</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Marca las pruebas diagnósticas necesarias en el catálogo para tramitar la orden analítica.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    <AnimatePresence>
                      {selectedBiomarkers.map((b) => (
                        <motion.div
                          key={b.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-slate-900 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                            <span className="font-semibold text-slate-100 truncate">
                              {b.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-emerald-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                              -{getBiomarkerCost(b)} €
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBiomarker(b.id);
                              }}
                              className="text-slate-400 hover:text-rose-400 p-0.5 cursor-pointer"
                              title="Quitar"
                            >
                              ✕
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Cost & Coverage Summary */}
              {selectedBiomarkerIds.length > 0 && (
                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Pruebas Solicitadas:</span>
                    <span className="font-bold text-white font-mono">{selectedBiomarkerIds.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Gasto Presupuestario:</span>
                    <span className={`font-bold font-mono ${isOverBudget ? 'text-rose-400' : 'text-slate-200'}`}>
                      -{totalCost.toLocaleString('es-ES')} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Presupuesto Final:</span>
                    <span className={`font-bold font-mono ${projectedRemainingBudget < 1000 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {projectedRemainingBudget.toLocaleString('es-ES')} €
                    </span>
                  </div>

                  {isOverBudget && (
                    <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-[11px] flex items-start gap-2 mt-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>El coste de la petición excede el presupuesto disponible. Revisa pruebas prescindibles.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="pt-4 mt-2">
              <button
                onClick={handleSubmit}
                disabled={selectedBiomarkerIds.length === 0 || isProcessingOrder}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  isProcessingOrder
                    ? 'bg-slate-800 text-slate-400 cursor-wait animate-pulse'
                    : selectedBiomarkerIds.length > 0
                    ? 'bg-slate-100 hover:bg-white text-slate-900 cursor-pointer shadow-xs active:scale-[0.99]'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800'
                }`}
              >
                {isProcessingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    <span>Enviando al Laboratorio STAT...</span>
                  </>
                ) : (
                  <>
                    <span>Tramitar Orden de Laboratorio ({selectedBiomarkerIds.length})</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                Los resultados analíticos y fundamentación se emitirán de inmediato.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hospital Real-Time Processing Animation Modal */}
      <AnimatePresence>
        {isProcessingOrder && (
          <HospitalLabProcessingModal
            orderedBiomarkerIds={selectedBiomarkerIds}
            currentCase={currentCase}
            onComplete={handleProcessingComplete}
          />
        )}
      </AnimatePresence>

      {/* Consultation Confirmation Modal */}
      <AnimatePresence>
        {biomarkerPendingConsultation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Interconsulta de Parámetro</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Acceso a la utilidad diagnóstica</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBiomarkerPendingConsultation(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/90">
                  <div className="font-bold text-slate-900 text-sm">{biomarkerPendingConsultation.name}</div>
                  <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                    {biomarkerPendingConsultation.abbreviation}
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  ¿Deseas consultar para qué sirve este parámetro clínico y su mecanismo fisiopatológico?
                </p>

                <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl space-y-2 text-[11px] text-amber-950">
                  <div className="flex justify-between items-center font-bold">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-amber-700" />
                      Coste de Interconsulta:
                    </span>
                    <span className="font-mono text-amber-800 font-extrabold text-xs">-50 € Presupuesto</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 border-t border-amber-200/60 pt-1.5">
                    <span>Presupuesto actual:</span>
                    <span className="font-mono font-semibold">{userBudget.toLocaleString('es-ES')} €</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Presupuesto tras consulta:</span>
                    <span className={`font-mono font-bold ${userBudget - 50 < 1000 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {Math.max(0, userBudget - 50).toLocaleString('es-ES')} €
                    </span>
                  </div>
                </div>

                {userBudget < 50 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <span>Presupuesto insuficiente (&lt; 50 €). No dispones de fondos de guardia suficientes para consultar este parámetro.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBiomarkerPendingConsultation(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={userBudget < 50}
                  onClick={() => handleConfirmConsultation(biomarkerPendingConsultation)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    userBudget >= 50
                      ? 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confirmar e Interconsultar (-50 €)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {consultationToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{consultationToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
