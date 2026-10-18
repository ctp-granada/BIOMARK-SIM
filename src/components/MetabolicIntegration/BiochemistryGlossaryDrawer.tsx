import React, { useState, useMemo, useEffect } from 'react';
import {
  BIOCHEMISTRY_GLOSSARY,
  GLOSSARY_CATEGORIES,
  GlossaryTerm,
  GlossaryCategory
} from './data/biochemistryGlossaryData';
import {
  BookOpen,
  X,
  Search,
  Sparkles,
  Lightbulb,
  ArrowRight,
  Activity,
  Layers,
  Dna,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  Shuffle,
  Maximize2,
  Minimize2,
  Filter
} from 'lucide-react';

interface BiochemistryGlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTermId?: string | null;
}

export const BiochemistryGlossaryDrawer: React.FC<BiochemistryGlossaryDrawerProps> = ({
  isOpen,
  onClose,
  initialTermId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'all'>('all');
  const [selectedTermId, setSelectedTermId] = useState<string>(
    initialTermId || BIOCHEMISTRY_GLOSSARY[0].id
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Sync initialTermId when opened with a specific term
  useEffect(() => {
    if (initialTermId) {
      setSelectedTermId(initialTermId);
      // Ensure the category of this term is visible if filtered
      const found = BIOCHEMISTRY_GLOSSARY.find((t) => t.id === initialTermId);
      if (found && selectedCategory !== 'all' && found.category !== selectedCategory) {
        setSelectedCategory('all');
      }
    }
  }, [initialTermId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered terms
  const filteredTerms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return BIOCHEMISTRY_GLOSSARY.filter((term) => {
      const matchesCategory =
        selectedCategory === 'all' || term.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!query) return true;

      const inName = term.name.toLowerCase().includes(query);
      const inEnName = term.nameEn?.toLowerCase().includes(query) ?? false;
      const inAcronym = term.acronym?.toLowerCase().includes(query) ?? false;
      const inShortDef = term.shortDefinition.toLowerCase().includes(query);
      const inDetailed = term.detailedExplanation.toLowerCase().includes(query);
      const inEnzyme = term.keyEnzyme.toLowerCase().includes(query);
      const inClinical = term.clinicalRelevance.toLowerCase().includes(query);
      const inMolecules = term.keyMolecules?.some((m) => m.toLowerCase().includes(query)) ?? false;

      return (
        inName ||
        inEnName ||
        inAcronym ||
        inShortDef ||
        inDetailed ||
        inEnzyme ||
        inClinical ||
        inMolecules
      );
    });
  }, [searchQuery, selectedCategory]);

  // Currently selected term
  const activeTerm = useMemo(() => {
    const found = BIOCHEMISTRY_GLOSSARY.find((t) => t.id === selectedTermId);
    return found || filteredTerms[0] || BIOCHEMISTRY_GLOSSARY[0];
  }, [selectedTermId, filteredTerms]);

  // Select a random term for quick student review
  const handleRandomTerm = () => {
    const randomIndex = Math.floor(Math.random() * BIOCHEMISTRY_GLOSSARY.length);
    setSelectedTermId(BIOCHEMISTRY_GLOSSARY[randomIndex].id);
    setIsCardFlipped(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
      aria-modal="true"
      role="dialog"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Drawer Container */}
      <div
        className={`relative z-10 bg-white h-full shadow-2xl flex flex-col transition-all duration-300 ease-in-out border-l border-slate-200 ${
          isExpanded ? 'w-full md:w-[90vw] lg:w-[85vw]' : 'w-full md:w-[680px] lg:w-[740px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 backdrop-blur flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  Glosario de Bioquímica Médica
                </h2>
                <span className="text-[11px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                  {BIOCHEMISTRY_GLOSSARY.length} Términos
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Conceptos clave, vías metabólicas, enzimas marcapasos y correlación clínica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Flashcard / Active Recall Mode Toggle */}
            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                setIsCardFlipped(false);
              }}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isFlashcardMode
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
              title="Modo Repaso / Flashcards de Examen"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Modo Repaso</span>
            </button>

            {/* Random Term Picker */}
            <button
              onClick={handleRandomTerm}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors"
              title="Término aleatorio de estudio"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Expand / Collapse Width */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 transition-colors hidden md:block"
              title={isExpanded ? 'Contraer panel lateral' : 'Expandir panel'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer shrink-0"
              title="Cerrar Glosario (Esc)"
            >
              <X className="w-4 h-4" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="p-3 sm:p-4 bg-white border-b border-slate-200 space-y-3 shrink-0">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar término (ej. glucogenólisis, cetogénesis, PFK-1, urea, Km)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-600 transition-all text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({BIOCHEMISTRY_GLOSSARY.length})
            </button>
            {GLOSSARY_CATEGORIES.map((cat) => {
              const count = BIOCHEMISTRY_GLOSSARY.filter((t) => t.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-teal-700 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row">
          {/* Left Column: Terms Navigation List (on wider screens or when searching) */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/50 p-2 sm:p-3 overflow-y-auto max-h-56 md:max-h-none shrink-0 space-y-1.5">
            {filteredTerms.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-semibold">No se encontraron términos</p>
                <p className="text-[11px] mt-1 text-slate-400">
                  Intenta buscar por enzima, ruta o sustrato
                </p>
              </div>
            ) : (
              filteredTerms.map((term) => {
                const isSelected = term.id === activeTerm?.id;
                return (
                  <button
                    key={term.id}
                    onClick={() => {
                      setSelectedTermId(term.id);
                      setIsCardFlipped(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-white border-teal-500 shadow-sm ring-1 ring-teal-500/20'
                        : 'bg-white/80 hover:bg-white border-slate-200/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {term.name}
                      </span>
                      {term.acronym && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                          {term.acronym}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {term.shortDefinition}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-medium">
                        {term.keyEnzyme.split('(')[0].trim()}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed View of the Selected Term */}
          <div className="flex-1 p-4 sm:p-6 bg-white overflow-y-auto space-y-5">
            {/* FLASHCARD ACTIVE RECALL MODE */}
            {isFlashcardMode ? (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Modo Repaso Activo (Autoevaluación de Examen)</span>
                  </div>
                  <button
                    onClick={handleRandomTerm}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-lg"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Siguiente Ficha</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    {isCardFlipped ? 'Término Revelado:' : 'Pregunta de Repaso:'}
                  </span>

                  {!isCardFlipped ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-slate-800 bg-white p-4 rounded-xl border border-amber-200 leading-relaxed shadow-xs">
                        "{activeTerm.shortDefinition}"
                      </p>
                      <div className="p-3 bg-amber-100/60 rounded-xl text-xs text-amber-900 space-y-1">
                        <p className="font-semibold">Pistas:</p>
                        <p>• Localización: {activeTerm.cellularLocation} · {activeTerm.tissueLocation}</p>
                        <p>• Enzima marcapasos: {activeTerm.keyEnzyme}</p>
                      </div>
                      <button
                        onClick={() => setIsCardFlipped(true)}
                        className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Revelar Nombre y Detalles Bioquímicos</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in">
                      <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-xs">
                        <span className="text-xs text-slate-400 font-semibold">Respuesta:</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-1">{activeTerm.name}</h3>
                        {activeTerm.nameEn && (
                          <span className="text-xs text-slate-500 italic block">{activeTerm.nameEn}</span>
                        )}
                      </div>
                      <button
                        onClick={() => setIsCardFlipped(false)}
                        className="text-xs text-amber-800 underline font-semibold hover:text-amber-900"
                      >
                        Ocultar respuesta y repasar de nuevo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* TERM HEADER */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                  {activeTerm.categoryLabel}
                </span>
                {activeTerm.acronym && (
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {activeTerm.acronym}
                  </span>
                )}
                {activeTerm.nameEn && (
                  <span className="text-xs text-slate-400 italic">
                    (En: {activeTerm.nameEn})
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeTerm.name}
              </h1>

              <div className="mt-2.5 p-3.5 bg-teal-50/60 rounded-xl border border-teal-200/80 text-xs sm:text-sm text-teal-950 font-medium leading-relaxed">
                {activeTerm.shortDefinition}
              </div>
            </div>

            {/* DETAILED EXPLANATION */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-700" />
                <span>Mecanismo y Fundamento Bioquímico</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
                {activeTerm.detailedExplanation}
              </p>
            </div>

            {/* KEY METRICS GRID: Localization & Energy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cellular & Tissue Localization */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                  <Activity className="w-3.5 h-3.5 text-teal-700" />
                  <span>Localización Compartimental</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">Celular:</span>{' '}
                  <span className="text-slate-600">{activeTerm.cellularLocation}</span>
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">Tisular:</span>{' '}
                  <span className="text-slate-600">{activeTerm.tissueLocation}</span>
                </div>
              </div>

              {/* Energy Balance & ATP Yield/Cost */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                  <Dna className="w-3.5 h-3.5 text-amber-600" />
                  <span>Balance Energético</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {activeTerm.energyBalance || 'Modulación no acoplada directamente a hidrólisis de ATP.'}
                </p>
              </div>
            </div>

            {/* RATE-LIMITING ENZYME & REGULATION */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4 text-teal-700" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Enzima Marcapasos / Paso Limitante
                </h3>
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                {activeTerm.keyEnzyme}
              </div>
              {activeTerm.keyEnzymeDetails && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeTerm.keyEnzymeDetails}
                </p>
              )}
            </div>

            {/* HORMONAL & ALLOSTERIC REGULATION */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-600" />
                <span>Control Hormonal y Regulación</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Stimulated By */}
                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
                  <span className="font-bold text-emerald-900 block text-[11px] uppercase">
                    Activadores / Inducida por:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeTerm.hormonalControl.stimulatedBy.map((stim, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-emerald-100/90 text-emerald-950 font-semibold text-[11px]"
                      >
                        {stim}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inhibited By */}
                <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 space-y-1">
                  <span className="font-bold text-rose-900 block text-[11px] uppercase">
                    Inhibidores / Reprimida por:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {activeTerm.hormonalControl.inhibitedBy.map((inhib, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-rose-100/90 text-rose-950 font-semibold text-[11px]"
                      >
                        {inhib}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold not-italic text-slate-700">Mecanismo:</span>{' '}
                {activeTerm.hormonalControl.mechanismSummary}
              </p>
            </div>

            {/* CLINICAL CORRELATION */}
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Relevancia Clínica & Fisiopatología</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                {activeTerm.clinicalRelevance}
              </p>
            </div>

            {/* EXAM TIP / MNEMONIC CALLOUT */}
            {activeTerm.examTip && (
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-3.5 rounded-xl border border-teal-200 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800 shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4 text-teal-700" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block">
                    Perla Bioquímica para Exámenes
                  </span>
                  <p className="text-xs text-teal-950 font-medium mt-0.5 leading-relaxed">
                    {activeTerm.examTip}
                  </p>
                </div>
              </div>
            )}

            {/* RELATED TERMS */}
            {activeTerm.relatedTermIds && activeTerm.relatedTermIds.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Términos Relacionados en el Glosario:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeTerm.relatedTermIds.map((relId) => {
                    const related = BIOCHEMISTRY_GLOSSARY.find((t) => t.id === relId);
                    if (!related) return null;
                    return (
                      <button
                        key={relId}
                        onClick={() => {
                          setSelectedTermId(relId);
                          setIsCardFlipped(false);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 border border-slate-200 transition-colors"
                      >
                        <span>{related.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-60" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
