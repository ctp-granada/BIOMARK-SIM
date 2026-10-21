import React, { useState, useEffect } from 'react';
import { RandleCycleLab } from './RandleCycleLab';
import { JaundiceSimulatorLab } from './JaundiceSimulatorLab';
import { HemostasisLab } from './HemostasisLab';
import { CarnitineShuttleLab } from './CarnitineShuttleLab';
import { MetabolicIntegrationLab } from '../MetabolicIntegration/MetabolicIntegrationLab';
import { UserProgress, ActiveModule } from '../../types';
import { RefreshCw, Droplets, FlaskConical, ArrowLeft, BookOpen, Trees, Network, Dna } from 'lucide-react';

interface InteractiveLabsContainerProps {
  initialLab?: 'randle' | 'ictericias' | 'hemostasia' | 'carnitina' | 'integra';
  onBackToPortal?: () => void;
  userProgress?: UserProgress;
  onEarnBudget?: (amount?: number) => void;
  onRechargeLife?: (amount?: number) => void;
  onAddBonusXP?: (amount: number, reason: string) => void;
  onNavigate?: (module: ActiveModule) => void;
}

export const InteractiveLabsContainer: React.FC<InteractiveLabsContainerProps> = ({
  initialLab = 'randle',
  onBackToPortal,
  userProgress,
  onEarnBudget,
  onRechargeLife,
  onAddBonusXP,
  onNavigate = () => {}
}) => {
  const [selectedLab, setSelectedLab] = useState<'randle' | 'ictericias' | 'hemostasia' | 'carnitina' | 'integra'>(initialLab);

  useEffect(() => {
    if (initialLab && (initialLab === 'randle' || initialLab === 'ictericias' || initialLab === 'hemostasia' || initialLab === 'carnitina' || initialLab === 'integra')) {
      setSelectedLab(initialLab);
    }
  }, [initialLab]);

  return (
    <div className="space-y-6">
      {/* Top Bar: Biblioteca Biomédica · Materiales de Apoyo al Aprendizaje */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToPortal && (
            <button
              onClick={onBackToPortal}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Volver al Portal / Material Docente"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Biblioteca Biomédica · Materiales de Apoyo al Aprendizaje (Curso 26-27)
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">
              Simuladores Interactivos y Modelos Fisiopatológicos de Apoyo
            </h2>
          </div>
        </div>

        {/* Switcher Tabs: The 3 Learning Support Simulators in Biblioteca */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 overflow-x-auto gap-1">
            <button
              onClick={() => setSelectedLab('randle')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedLab === 'randle'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${selectedLab === 'randle' ? 'text-white' : 'text-blue-600'}`} />
              <span>Ciclo de Randle</span>
            </button>

            <button
              onClick={() => setSelectedLab('ictericias')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedLab === 'ictericias'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <FlaskConical className={`w-3.5 h-3.5 ${selectedLab === 'ictericias' ? 'text-white' : 'text-amber-600'}`} />
              <span>Simulador Ictericias</span>
            </button>

            <button
              onClick={() => setSelectedLab('hemostasia')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedLab === 'hemostasia'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <Droplets className={`w-3.5 h-3.5 ${selectedLab === 'hemostasia' ? 'text-white' : 'text-rose-600'}`} />
              <span>Hemostasia</span>
            </button>

            <button
              onClick={() => setSelectedLab('carnitina')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedLab === 'carnitina'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-indigo-900 hover:bg-indigo-50'
              }`}
            >
              <Dna className={`w-3.5 h-3.5 ${selectedLab === 'carnitina' ? 'text-white' : 'text-indigo-600'}`} />
              <span>Lanzadera de Carnitina</span>
              <span className="text-[9px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-full uppercase">Nuevo</span>
            </button>

            <button
              onClick={() => setSelectedLab('integra')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedLab === 'integra'
                  ? 'bg-teal-700 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50'
              }`}
            >
              <Network className={`w-3.5 h-3.5 ${selectedLab === 'integra' ? 'text-white' : 'text-teal-600'}`} />
              <span>Integración Metabólica (Integra)</span>
            </button>
          </div>

          {/* Quick link to Parque for minigames */}
          <button
            onClick={() => onNavigate('juegos')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Ir al Parque Biomédico para jugar a minijuegos y ganar dinero"
          >
            <Trees className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ir al Parque (Minijuegos) 💰</span>
          </button>
        </div>
      </div>

      {/* Render selected simulator */}
      <div className="rounded-2xl overflow-hidden">
        {selectedLab === 'randle' && <RandleCycleLab />}
        {selectedLab === 'ictericias' && <JaundiceSimulatorLab />}
        {selectedLab === 'hemostasia' && <HemostasisLab />}
        {selectedLab === 'carnitina' && <CarnitineShuttleLab />}
        {selectedLab === 'integra' && (
          <MetabolicIntegrationLab
            hideExternalHeader={true}
            onBackToPortal={onBackToPortal}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
};

