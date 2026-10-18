import React, { useEffect, useState } from 'react';
import { Header, ActiveTab, ReferenceTool } from './Header';
import { CentralHumanBodyAtlas } from './CentralHumanBodyAtlas';
import { TimelineCurveView } from './TimelineCurveView';
import { ClinicalQuiz } from './ClinicalQuiz';
import { BiochemistryGlossaryDrawer } from './BiochemistryGlossaryDrawer';
import { ReferenceTablesModal } from './ReferenceTablesModal';
import { MetabolicStateId, OrganId } from './types/metabolism';
import { ArrowLeft, BookOpen, FlaskConical, Network, Sparkles } from 'lucide-react';
import { ActiveModule } from '../../types';

interface MetabolicIntegrationLabProps {
  onBackToPortal?: () => void;
  onNavigate?: (module: ActiveModule) => void;
  hideExternalHeader?: boolean;
}

export const MetabolicIntegrationLab: React.FC<MetabolicIntegrationLabProps> = ({
  onBackToPortal,
  onNavigate,
  hideExternalHeader = false
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('atlas');
  const [selectedStateId, setSelectedStateId] = useState<MetabolicStateId>('postprandial');
  const [selectedOrganId, setSelectedOrganId] = useState<OrganId>('liver');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [activeGlossaryTermId, setActiveGlossaryTermId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ReferenceTool | null>(null);
  const [situationChosen, setSituationChosen] = useState(false);

  const handleSelectState = (id: MetabolicStateId) => {
    setSelectedStateId(id);
    setSituationChosen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveTool(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleOpenTool = (tool: ReferenceTool) => setActiveTool(tool);

  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'atlas' && activeTab === 'atlas') {
      setSituationChosen(false);
    }
    setActiveTab(tab);
  };

  const handleOpenGlossaryWithTerm = (termId?: string) => {
    if (termId) {
      setActiveGlossaryTermId(termId);
    }
    setIsGlossaryOpen(true);
  };

  const handleNavigateToStateFromQuiz = (stateId: MetabolicStateId) => {
    setSelectedStateId(stateId);
    setSituationChosen(true);
    setActiveTab('atlas');
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-xs flex flex-col text-slate-800 relative overflow-hidden">
      {/* Top Banner Contextual for Biblioteca Médica */}
      {!hideExternalHeader && (
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-teal-800/60">
          <div className="flex items-center gap-3">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Volver a la Biblioteca / Simuladores"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Network className="w-4 h-4 text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                    Biblioteca Biomédica · Simulador Avanzado
                  </span>
                  <span className="bg-teal-500/20 text-teal-200 border border-teal-400/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                    Oficial
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-white">
                  Simulador de Integración Metabólica (Integra)
                </h1>
              </div>
            </div>
          </div>

          {/* Quick navigation helpers */}
          {onNavigate && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('docencia')}
                className="text-xs text-teal-200 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Temario Oficial</span>
              </button>
              <button
                onClick={() => onNavigate('laboratorios')}
                className="text-xs text-teal-200 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Otros Simuladores</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Internal Integra Sub-Header with Situaciones, Curvas, Casos, Glosario, Tablas */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenGlossary={() => handleOpenGlossaryWithTerm()}
        onOpenTool={handleOpenTool}
      />

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        {/* Tab 1: Central Human Body Atlas */}
        {activeTab === 'atlas' && (
          <CentralHumanBodyAtlas
            selectedStateId={selectedStateId}
            onSelectState={handleSelectState}
            situationChosen={situationChosen}
            onChangeSituation={() => setSituationChosen(false)}
            onOpenTool={handleOpenTool}
            selectedOrganId={selectedOrganId}
            onSelectOrgan={setSelectedOrganId}
            onOpenGlossary={handleOpenGlossaryWithTerm}
            activeTool={activeTool}
            onCloseTool={() => setActiveTool(null)}
          />
        )}

        {/* Tab 2: Cahill Sequential Fasting Timeline Curves */}
        {activeTab === 'timeline' && <TimelineCurveView />}

        {/* Tab 3: Clinical Cases & Self-Assessment Quiz */}
        {activeTab === 'quiz' && (
          <ClinicalQuiz onNavigateToState={handleNavigateToStateFromQuiz} />
        )}
      </div>

      {/* Reference Modals: Hormonal regulation & Organ matrix */}
      {(activeTool === 'hormonal_regulation' || activeTool === 'organ_matrix') && (
        <ReferenceTablesModal tool={activeTool} onClose={() => setActiveTool(null)} />
      )}

      {/* Slide-out Biochemistry Glossary Drawer */}
      <BiochemistryGlossaryDrawer
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        initialTermId={activeGlossaryTermId}
      />
    </div>
  );
};
