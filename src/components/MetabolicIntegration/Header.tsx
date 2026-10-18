import React from 'react';
import { Activity, BookOpen, Clock, Network, Table2 } from 'lucide-react';

export type ActiveTab = 'atlas' | 'timeline' | 'quiz';
export type ReferenceTool = 'hormones' | 'muscle_bioenergetics' | 'ampk_sensor' | 'hormonal_regulation' | 'organ_matrix';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenGlossary?: () => void;
  onOpenTool?: (tool: ReferenceTool) => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'atlas', label: 'Situaciones metabólicas', icon: <Activity className="w-3.5 h-3.5 text-teal-700" /> },
  { id: 'timeline', label: 'Curvas Temporales', icon: <Clock className="w-3.5 h-3.5 text-teal-700" /> },
  { id: 'quiz', label: 'Casos Clínicos', icon: <BookOpen className="w-3.5 h-3.5 text-teal-700" /> },
];

const TOOLS: { id: ReferenceTool; label: string; title: string; icon: React.ReactNode }[] = [
  { id: 'hormonal_regulation', label: 'Regulación hormonal', title: 'Escalas de regulación, acciones hormonales y matriz de modulación enzimática', icon: <Network className="w-3.5 h-3.5 text-teal-700" /> },
  { id: 'organ_matrix', label: 'Perfil de órganos', title: 'Matriz de especialización metabólica de cada órgano', icon: <Table2 className="w-3.5 h-3.5 text-teal-700" /> },
];

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab, onOpenGlossary, onOpenTool }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fila 1: marca y herramientas de consulta */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5 text-teal-100" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">Integra</span>
              <span className="hidden md:inline-block text-xs text-slate-400 ml-2 font-medium">
                Integración metabólica
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {onOpenTool && TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => onOpenTool(t.id)}
                title={t.title}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
            {onOpenGlossary && (
              <button
                onClick={onOpenGlossary}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors shadow-2xs cursor-pointer whitespace-nowrap shrink-0"
                title="Abrir Glosario Bioquímico de Términos (Glucogenólisis, Gluconeogénesis, Cetogénesis...)"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                <span>Glosario</span>
              </button>
            )}
          </div>
        </div>

        {/* Fila 2: pestañas principales */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 -mt-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTab(t.id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeTab === t.id
                  ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
