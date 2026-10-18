import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Sparkles, 
  Zap, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  HelpCircle,
  ChevronRight,
  Droplets,
  Layers,
  ArrowRight
} from 'lucide-react';

interface VirchowPillar {
  title: string;
  subtitle: string;
  desc: string;
  impact: string;
  colorClass: string;
}

const VIRCHOW_DATA: Record<'lesion' | 'flujo' | 'hiper', VirchowPillar> = {
  lesion: {
    title: 'Lesión Endotelial (Pilar I)',
    subtitle: 'El disparador biológico primordial',
    desc: 'Constituye el factor desencadenante más determinante en la trombosis arterial y sobre placas ateroscleróticas. Al romperse el endotelio intacto, se expone de forma inmediata el colágeno subendotelial y el Factor Tisular de la íntima y adventicia.',
    impact: 'Provoca la adhesión plaquetaria ultrarrápida mediada por el Factor de von Willebrand (vWF) y la activación simultánea de la cascada de coagulación por la vía extrínseca.',
    colorClass: 'text-rose-700 border-rose-300 bg-rose-50'
  },
  flujo: {
    title: 'Flujo Sanguíneo Anómalo (Pilar II)',
    subtitle: 'Estasis venosa y turbulencia arterial',
    desc: 'Tanto la estasis (reposo prolongado, insuficiencia venosa, compresión) como la turbulencia (bifurcaciones arteriales, aneurismas, estenosis valvular) alteran el flujo laminar normal donde las células viajan en el centro protegidas del endotelio.',
    impact: 'Impiden que los factores activados se diluyan fisiológicamente en el torrente sanguíneo circulante, facilitan el contacto íntimo de las plaquetas con la pared y retrasan la llegada de inhibidores naturales como la Antitrombina III.',
    colorClass: 'text-blue-800 border-blue-300 bg-blue-50'
  },
  hiper: {
    title: 'Hipercoagulabilidad / Trombofilia (Pilar III)',
    subtitle: 'Trombofilia congénita o adquirida',
    desc: 'Alteración patológica intrínseca de los mecanismos procoagulantes o anticoagulantes que predispone activamente a la trombosis sistémica.',
    impact: 'Comprende defectos hereditarios como la Mutación del Factor V de Leiden (resistencia a la Proteína C activada), mutación G20210A de la protrombina, deficiencias de antitrombina III o proteínas C/S, y estados adquiridos de alto riesgo (cáncer activo, síndrome antifosfolípido, embarazo, terapia estrogénica).',
    colorClass: 'text-amber-800 border-amber-300 bg-amber-50'
  }
};

interface PlateletPart {
  name: string;
  role: string;
  detail: string;
  pathology: string;
}

const PLATELET_DATA: Record<string, PlateletPart> = {
  gp1b: {
    name: 'Glicoproteína GPIb-IX-V',
    role: 'Receptor de Adhesión Primaria al vWF',
    detail: 'Complejo transmembrana encargado de anclarse inicialmente al Factor de von Willebrand (vWF) inmovilizado en el colágeno subendotelial. Es indispensable a altas fuerzas de cizallamiento en arterias y capilares.',
    pathology: 'Su deficiencia congénita causa el Síndrome de Bernard-Soulier (trombocitopenia con plaquetas gigantes y diátesis hemorrágica severa).'
  },
  gp2b3a: {
    name: 'Glicoproteína GPIIb/IIIa (Integrina αIIbβ3)',
    role: 'Receptor de Agregación Plaquetaria',
    detail: 'Es el receptor más abundante de la superficie plaquetaria (~80.000 copias). Al activarse la célula, sufre un cambio conformacional («inside-out») exponiendo el sitio de unión afín para el Fibrinógeno plasmático, formando puentes interplaquetarios.',
    pathology: 'Su ausencia causa la Tromboastenia de Glanzmann. Es la diana farmacológica de inhibidores potentes como abciximab, eptifibatida y tirofibán.'
  },
  gp1a2a: {
    name: 'Receptor GPIa/IIa e Integrina GPVI',
    role: 'Receptores Directos de Colágeno',
    detail: 'GPVI activa una cascada intracelular potente similar a receptores inmunes con activación de la tirosina quinasa Syk y PLC-γ2, desencadenando la activación plaquetaria definitiva.',
    pathology: 'Defectos en GPVI provocan hemorragias leves o moderadas tras traumatismos mecánicos.'
  },
  alfa: {
    name: 'Gránulos Alfa (α)',
    role: 'Vesículas de Macromoléculas Proteicas',
    detail: 'Almacenan Fibrinógeno, Factor de von Willebrand (vWF), Factor V, Factor IV plaquetario, Fibronectina y Factor de Crecimiento Derivado de Plaquetas (PDGF) para reparar el vaso.',
    pathology: 'Su ausencia congénita produce el Síndrome de la Plaqueta Gris (plaquetas descoloridas en frotis y hemorragia).'
  },
  denso: {
    name: 'Gránulos Densos (δ)',
    role: 'Vesículas de Moléculas Pequeñas y Cofactores',
    detail: 'Contienen altas concentraciones de Calcio (Ca²⁺), ADP y ATP, Serotonina y Pirofosfato. El ADP liberado amplifica la activación vecina mediante receptores P2Y1 y P2Y12.',
    pathology: 'Deficiencia en almacenamiento denso provoca diátesis hemorrágica por defecto en la amplificación de la agregación secundaria.'
  }
};

export const HemostasisLab: React.FC = () => {
  // Navigation / sub-sections
  const [activeTab, setActiveTab] = useState<'fundamentos' | 'virchow' | 'plaqueta' | 'senalizacion' | 'cascada'>('cascada');

  // Virchow selection
  const [virchowSelected, setVirchowSelected] = useState<'lesion' | 'flujo' | 'hiper'>('lesion');

  // Platelet hotspot selection
  const [selectedPlateletHotspot, setSelectedPlateletHotspot] = useState<string>('gp1b');

  // Platelet Activation Simulation state
  const [plateletState, setPlateletState] = useState<'reposo' | 'activada'>('reposo');

  // Coagulation cascade simulation
  const [activeRoute, setActiveRoute] = useState<'ext' | 'int' | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [activeFactors, setActiveFactors] = useState<string[]>([]);
  const timerRef = useRef<number | null>(null);

  const EXT_STEPS = [
    { id: 'f-FT', name: 'Factor Tisular (III)', desc: 'Traumatismo endotelial. El FT de la adventicia/fibroblastos entra en contacto con la sangre.' },
    { id: 'f-VII', name: 'Factor VIIa (Tenasa Extrínseca)', desc: 'El FT se une al FVII circulante formando el complejo catalítico FT-VIIa activado por calcio.' },
    { id: 'f-X', name: 'Factor X a Xa', desc: 'El complejo FT-VIIa corta por proteólisis específica al Factor X, generando Factor Xa activo.' },
    { id: 'f-V', name: 'Factor Va (Cofactor)', desc: 'El FXa recluta a su cofactor acelerador, el Factor Va activado por trazas iniciales de trombina.' },
    { id: 'f-II', name: 'Protrombinasa ➔ Trombina (IIa)', desc: 'El complejo Protrombinasa (FXa-FVa-Ca²⁺-PL) convierte la Protrombina en Trombina activa (IIa).' },
    { id: 'f-I', name: 'Fibrinógeno ➔ Red de Fibrina', desc: 'La Trombina escinde fibrinopeptidos A y B del fibrinógeno para polimerizar la red de Fibrina insoluble, estabilizada por FXIIIa.' }
  ];

  const INT_STEPS = [
    { id: 'f-XII', name: 'Factor XII a XIIa (Sistema Contacto)', desc: 'Contacto de la sangre con colágeno o superficies cargadas negativamente. El FXII se autoactiva junto con HMWK y precalicreína.' },
    { id: 'f-XI', name: 'Factor XI a XIa', desc: 'El FXIIa escinde proteolíticamente al Factor XI anclado al Cininógeno de Alto Peso Molecular (HMWK).' },
    { id: 'f-IX', name: 'Factor IX a IXa', desc: 'El Factor XIa activa al Factor IX dependiente de vitamina K en presencia de iones calcio.' },
    { id: 'f-VIII', name: 'Factor VIIIa (Complejo Tenasa Intrínseco)', desc: 'El FIXa se asocia con su cofactor activado FVIIIa sobre la superficie fosfolipídica plaquetaria (Tenasa intrínseca).' },
    { id: 'f-X', name: 'Factor X a Xa (Amplificación Masiva)', desc: 'El complejo tenasa intrínseco es 1.000 veces más eficiente que la vía extrínseca para generar FXa masivo.' },
    { id: 'f-V', name: 'Factor Va (Protrombinasa)', desc: 'Reclutamiento del Factor Va sobre la membrana de fosfatidilserina expuesta en la plaqueta.' },
    { id: 'f-II', name: 'Trombina (Explosión de Trombina)', desc: 'Generación acelerada de trombina que retroalimenta la cascada activando plaquetas, FV, FVIII y FXI.' },
    { id: 'f-I', name: 'Polímero de Fibrina Insoluble', desc: 'Conversión masiva del fibrinógeno en filamentos cruzados de fibrina que atrapan eritrocitos y consolidan el trombo.' }
  ];

  const runSimulation = (route: 'ext' | 'int') => {
    resetSimulation();
    setActiveRoute(route);
    const steps = route === 'ext' ? EXT_STEPS : INT_STEPS;
    
    let current = 0;
    setCurrentStepIndex(0);
    setActiveFactors([steps[0].id]);

    timerRef.current = window.setInterval(() => {
      current++;
      if (current < steps.length) {
        setCurrentStepIndex(current);
        setActiveFactors((prev) => [...prev, steps[current].id]);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 1400);
  };

  const resetSimulation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveRoute(null);
    setCurrentStepIndex(-1);
    setActiveFactors([]);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-rose-400" />
              Laboratorio Interactivo de Hematología y Bioquímica Vascular
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-300 bg-slate-900 border border-slate-800">
              Facultad de Medicina UGR
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Hemostasia, Coagulación y Patología Vascular</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Estudio integral de la <strong className="text-white">hemostasia primaria (plaquetaria)</strong> y la <strong className="text-white">hemostasia secundaria (cascada enzimática plasmática)</strong>, la señalización intracelular del calcio y AMPc, y los determinantes fisiopatológicos de la <strong className="text-white">Tríada de Virchow</strong> en la trombosis clínica.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        {[
          { id: 'cascada', label: '1. Cascada de Coagulación', icon: Zap },
          { id: 'senalizacion', label: '2. Señalización Molecular (PLC / AMPc)', icon: Activity },
          { id: 'plaqueta', label: '3. Anatomía y Gránulos Plaquetarios', icon: Layers },
          { id: 'virchow', label: '4. Tríada de Virchow', icon: ShieldAlert },
          { id: 'fundamentos', label: '5. Endotelio & Vaso Sano', icon: Droplets }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-950 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COAGULATION CASCADE SIMULATOR */}
      {activeTab === 'cascada' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Controls & Narrative Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Simulador de Cinética Enzimática
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Activación Secuencial de Zimógenos y Cofactores
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => runSimulation('ext')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeRoute === 'ext'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Activar Vía Extrínseca (Tisular)</span>
                </button>

                <button
                  onClick={() => runSimulation('int')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeRoute === 'int'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Activar Vía Intrínseca (Contacto)</span>
                </button>

                <button
                  onClick={resetSimulation}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>
              </div>
            </div>

            {/* Live Simulation Step Narrative */}
            <div className="p-4 bg-slate-950 text-white rounded-xl border border-slate-800 min-h-[90px] flex items-center">
              {currentStepIndex >= 0 && activeRoute ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Paso {currentStepIndex + 1} de {activeRoute === 'ext' ? EXT_STEPS.length : INT_STEPS.length}:</span>
                    <span className="text-white font-mono">
                      {(activeRoute === 'ext' ? EXT_STEPS : INT_STEPS)[currentStepIndex].name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {(activeRoute === 'ext' ? EXT_STEPS : INT_STEPS)[currentStepIndex].desc}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center w-full">
                  Seleccione «Vía Extrínseca» o «Vía Intrínseca» para iniciar la animación paso a paso de la cascada enzimática.
                </p>
              )}
            </div>
          </div>

          {/* Interactive Flow Map: Intrínseca vs Común vs Extrínseca */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              
              {/* Intrínseca */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3 flex flex-col items-center">
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase text-blue-700 block">Vía Intrínseca (Contacto)</span>
                  <span className="text-[10px] text-slate-500 font-sans">Explorada mediante el TTPA</span>
                </div>

                {[
                  { id: 'f-XII', name: 'Factor XII (Hageman)', sub: 'Autoactivación con Precalicreína / HMWK' },
                  { id: 'f-XI', name: 'Factor XI', sub: 'Escindido a XIa por FXIIa' },
                  { id: 'f-IX', name: 'Factor IX', sub: 'Dependiente de vitamina K' },
                  { id: 'f-VIII', name: 'Factor VIIIa (Cofactor)', sub: 'Forma Tenasa Intrínseca (IXa-VIIIa)' }
                ].map((node) => {
                  const isActive = activeFactors.includes(node.id);
                  return (
                    <div
                      key={node.id}
                      className={`w-full p-3 rounded-xl border text-center transition-all ${
                        isActive
                          ? 'bg-blue-700 text-white border-blue-800 shadow-md scale-102 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="block font-bold text-xs">{node.name}</span>
                      <span className={`text-[10px] font-sans ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{node.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Vía Común */}
              <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/60 space-y-3 flex flex-col items-center justify-end">
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase text-rose-800 block">Vía Común (Fibrinogénesis)</span>
                  <span className="text-[10px] text-slate-500 font-sans">Convergencia de ambas vías</span>
                </div>

                {[
                  { id: 'f-X', name: 'Factor X a Xa', sub: 'Punto crítico de convergencia' },
                  { id: 'f-V', name: 'Factor Va (Cofactor)', sub: 'Acelera 300.000x la protrombinasa' },
                  { id: 'f-II', name: 'Protrombina ➔ Trombina (IIa)', sub: 'Enzima efectora multifuncional' },
                  { id: 'f-I', name: 'Red de Fibrina Insoluble', sub: 'Polímero estabilizado por FXIIIa' }
                ].map((node) => {
                  const isActive = activeFactors.includes(node.id);
                  return (
                    <div
                      key={node.id}
                      className={`w-full p-3.5 rounded-xl border text-center transition-all ${
                        isActive
                          ? 'bg-rose-700 text-white border-rose-800 shadow-md scale-102 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="block font-bold text-xs">{node.name}</span>
                      <span className={`text-[10px] font-sans ${isActive ? 'text-rose-100' : 'text-slate-500'}`}>{node.sub}</span>
                    </div>
                  );
                })}
              </div>

              {/* Extrínseca */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3 flex flex-col items-center">
                <div className="text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-700 block">Vía Extrínseca (Tisular)</span>
                  <span className="text-[10px] text-slate-500 font-sans">Explorada mediante el TP / INR</span>
                </div>

                {[
                  { id: 'f-FT', name: 'Factor Tisular (III)', sub: 'Expresión subendotelial / adventicia' },
                  { id: 'f-VII', name: 'Factor VIIa', sub: 'Complejo Tenasa Extrínseco (FT-VIIa)' }
                ].map((node) => {
                  const isActive = activeFactors.includes(node.id);
                  return (
                    <div
                      key={node.id}
                      className={`w-full p-3 rounded-xl border text-center transition-all ${
                        isActive
                          ? 'bg-amber-700 text-white border-amber-800 shadow-md scale-102 font-bold'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="block font-bold text-xs">{node.name}</span>
                      <span className={`text-[10px] font-sans ${isActive ? 'text-amber-100' : 'text-slate-500'}`}>{node.sub}</span>
                    </div>
                  );
                })}

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-center w-full text-[11px] font-sans text-slate-600 mt-4">
                  <span className="font-bold text-slate-900 block mb-1">Iniciación In Vivo:</span>
                  El modelo celular actual demuestra que la vía extrínseca (FT-VIIa) inicia la hemostasia, mientras que la vía intrínseca amplifica y mantiene la generación de trombina.
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOLECULAR SIGNALING (PLC / cAMP / CALCIUM) */}
      {activeTab === 'senalizacion' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Dynamic Switcher: Reposo vs Activada */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Simulador de Estado Bioquímico Plaquetario
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Control por Segundos Mensajeros: AMPc vs Calcio Citosólico
                </h2>
              </div>

              <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200">
                <button
                  onClick={() => setPlateletState('reposo')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    plateletState === 'reposo'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Plaqueta en Reposo (Vaso Sano)
                </button>
                <button
                  onClick={() => setPlateletState('activada')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    plateletState === 'activada'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Plaqueta Activada (Lesión Vascular)
                </button>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {/* AMPc */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Concentración de AMPc</span>
                  <span className={`text-2xl font-black font-mono block ${plateletState === 'reposo' ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {plateletState === 'reposo' ? 'ALTO (Freno Fisiológico)' : 'BAJO (Freno Retirado)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {plateletState === 'reposo'
                    ? 'La Prostaciclina (PGI2) endotelial activa la adenilato ciclasa; el AMPc elevado estimula a la PKA para bombear activamente Ca²⁺ al sistema tubular denso.'
                    : 'La activación del receptor de ADP P2Y12 (acoplado a Gi) inhibe a la adenilato ciclasa, reduciendo el AMPc y desbloqueando la cascada de activación.'}
                </p>
              </div>

              {/* Calcio */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Calcio Libre Citosólico [Ca²⁺]</span>
                  <span className={`text-2xl font-black font-mono block ${plateletState === 'activada' ? 'text-rose-700' : 'text-slate-400'}`}>
                    {plateletState === 'activada' ? 'ELEVADO (>1.0 µM)' : 'BASAL (<0.1 µM)'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {plateletState === 'activada'
                    ? 'El IP3 generado por la PLC abre canales de calcio en el retículo (sistema tubular denso). El calcio activa la miosina quinasa e inicia la exocitosis de gránulos.'
                    : 'El calcio permanece secuestrado en almacenes intracelulares; el citoesqueleto se mantiene en relajación.'}
                </p>
              </div>

              {/* Morfología e Integrinas */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-1">Estado Conformacional de GPIIb/IIIa</span>
                  <span className={`text-2xl font-black font-mono block ${plateletState === 'activada' ? 'text-rose-700' : 'text-emerald-700'}`}>
                    {plateletState === 'activada' ? 'ABIERTA / ALTA AFINIDAD' : 'CERRADA / BAJA AFINIDAD'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {plateletState === 'activada'
                    ? 'La señalización intracelular («inside-out») desenrolla la integrina GPIIb/IIIa, permitiendo el anclaje ávido de fibrinógeno bivalente para formar el tapón.'
                    : 'La conformación cerrada impide la unión inútil de fibrinógeno plasmático en vasos sanos.'}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Biochemistry: PLC and Purinergic Receptors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Cascada de la Fosfolipasa C (PLC-β y PLC-γ)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Desencadenada por la unión de ligandos potentes como la <strong className="text-slate-900">Trombina</strong> (vía receptores PAR-1 y PAR-4) o el <strong className="text-slate-900">Colágeno</strong> (vía GPVI):
              </p>
              <div className="space-y-2 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90">
                  <span className="font-bold text-slate-900 block mb-0.5">1. Hidrólisis de PIP2:</span>
                  La PLC corta el fosfatidilinositol-4,5-bifosfato de la membrana para generar dos mensajeros cruciales: <strong>IP3</strong> y <strong>DAG</strong>.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90">
                  <span className="font-bold text-slate-900 block mb-0.5">2. IP3 y Calcio:</span>
                  El IP3 difunde y se une a sus receptores en el sistema tubular denso, provocando la salida masiva de iones Ca²⁺ hacia el citosol.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90">
                  <span className="font-bold text-slate-900 block mb-0.5">3. DAG y Proteína Quinasa C (PKC):</span>
                  El DAG activa a la PKC, que fosforila proteínas promotoras de la degranulación y la reorganización de actina/miosina.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Receptores Purinérgicos para ADP (P2Y1 y P2Y12) • Diana Farmacológica
              </h3>
              <p className="text-slate-600 leading-relaxed">
                El ADP liberado de los gránulos densos actúa sobre dos receptores acoplados a proteína G complementarios:
              </p>
              <div className="space-y-2 pt-1">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/70">
                  <span className="font-bold text-blue-900 block mb-0.5">Receptor P2Y1 (Acoplado a Gq):</span>
                  Provoca la movilización rápida inicial de calcio, el cambio de forma (emisión de pseudópodos) y una agregación débil y transitoria.
                </div>
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/70">
                  <span className="font-bold text-rose-900 block mb-0.5">Receptor P2Y12 (Acoplado a Gi):</span>
                  Inhibe la adenilato ciclasa, amplifica la secreción de gránulos y estabiliza permanentemente el trombo. <strong className="text-rose-950 block mt-1">Dianas antiagregantes:</strong> Clopidogrel, Prasugrel y Ticagrelor bloquean este receptor para prevenir reinfartos e ictus.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLATELET ANATOMY & GRANULES */}
      {activeTab === 'plaqueta' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Hotspot Explorer */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Explorador Molecular</span>
                <h3 className="text-base font-bold text-slate-900">Estructuras de la Plaqueta</h3>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'gp1b', label: 'GPIb-IX-V (Receptor vWF)', tag: 'Adhesión' },
                  { id: 'gp2b3a', label: 'GPIIb/IIIa (Integrina αIIbβ3)', tag: 'Agregación' },
                  { id: 'gp1a2a', label: 'GPIa/IIa y GPVI', tag: 'Colágeno' },
                  { id: 'alfa', label: 'Gránulos Alfa (α)', tag: 'Macromoléculas' },
                  { id: 'denso', label: 'Gránulos Densos (δ)', tag: 'ADP & Calcio' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPlateletHotspot(item.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedPlateletHotspot === item.id
                        ? 'bg-slate-950 text-white border-slate-800 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      selectedPlateletHotspot === item.id ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Detailed Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              {PLATELET_DATA[selectedPlateletHotspot] && (
                <div className="space-y-4 text-xs">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[10px] font-bold uppercase text-rose-700 block">
                      {PLATELET_DATA[selectedPlateletHotspot].role}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-1">
                      {PLATELET_DATA[selectedPlateletHotspot].name}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block text-[11px] uppercase">Función Bioquímica:</span>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {PLATELET_DATA[selectedPlateletHotspot].detail}
                    </p>
                  </div>

                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200/80 space-y-1">
                    <span className="font-bold text-rose-900 block text-[11px] uppercase">
                      Relevancia Clínica y Patología Hereditaria:
                    </span>
                    <p className="text-rose-950 leading-relaxed">
                      {PLATELET_DATA[selectedPlateletHotspot].pathology}
                    </p>
                  </div>
                </div>
              )}

              {/* Granule Composition Summary */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-900 block mb-1">Contenido Gránulos Alfa:</span>
                  <span className="text-slate-600">Fibrinógeno, vWF, Factor V, Fibronectina, PDGF, PF4.</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-900 block mb-1">Contenido Gránulos Densos:</span>
                  <span className="text-slate-600">ADP, ATP, Calcio (Ca²⁺), Serotonina, Pirofosfatos.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VIRCHOW TRIAD */}
      {activeTab === 'virchow' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Fisiopatología de la Trombosis
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                La Tríada de Rudolf Virchow (1856)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Seleccione uno de los tres vértices para desglosar sus mecanismos celulares y repercusión diagnóstica:
              </p>
            </div>

            {/* Triad 3 Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'lesion', label: '1. Lesión Endotelial', sub: 'Pared Vascular' },
                { id: 'flujo', label: '2. Flujo Anómalo', sub: 'Estasis / Turbulencia' },
                { id: 'hiper', label: '3. Hipercoagulabilidad', sub: 'Trombofilia' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setVirchowSelected(p.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    virchowSelected === p.id
                      ? 'bg-slate-950 text-white border-slate-800 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold block">{p.label}</span>
                  <span className={`text-[10px] block mt-1 ${virchowSelected === p.id ? 'text-emerald-400' : 'text-slate-500'}`}>{p.sub}</span>
                </button>
              ))}
            </div>

            {/* Selected Pillar Detail */}
            <div className={`p-6 rounded-2xl border ${VIRCHOW_DATA[virchowSelected].colorClass} space-y-3 animate-fadeIn`}>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                {VIRCHOW_DATA[virchowSelected].subtitle}
              </span>
              <h3 className="text-xl font-bold">
                {VIRCHOW_DATA[virchowSelected].title}
              </h3>
              <p className="text-xs leading-relaxed opacity-90">
                {VIRCHOW_DATA[virchowSelected].desc}
              </p>
              <div className="pt-2 border-t border-current/20 text-xs">
                <strong>Impacto Clínico:</strong> {VIRCHOW_DATA[virchowSelected].impact}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ENDOTHELIUM & HEALTHY VESSEL */}
      {activeTab === 'fundamentos' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Hemostasia vs Trombosis */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-teal-800 flex items-center gap-2">
                <span>🛡️</span>
                <span>Hemostasia (Respuesta Fisiológica)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Conjunto coordinado de procesos que detienen la extravasación de sangre tras la ruptura mecánica de un vaso. Es rápida, sumamente localizada y rigurosamente regulada por inhibidores plasmáticos.
              </p>
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200/70 text-teal-900">
                <strong>Objetivo:</strong> Formar un tapón hemostático temporal que preserve la volemia sin ocluir la circulación general.
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                <span>⚠️</span>
                <span>Trombosis (Proceso Patológico)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Activación inapropiada de los mecanismos hemostáticos en un vaso intacto o respuesta desproporcionada ante un daño endotelial mínimo, generando una masa intravascular que compromete la perfusión tisular.
              </p>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/70 text-rose-900">
                <strong>Consecuencias:</strong> Infarto agudo de miocardio, ictus isquémico o tromboembolismo pulmonar masivo.
              </div>
            </div>
          </div>

          {/* Endothelial Antithrombotic Shield */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Mecanismos Antitrombóticos del Endotelio Sano
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <span className="font-bold text-slate-900 block">Óxido Nítrico & PGI2</span>
                <p className="text-slate-600">Potentes vasodilatadores e inhibidores fisiológicos de la adhesión y agregación plaquetaria.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <span className="font-bold text-slate-900 block">Trombomodulina</span>
                <p className="text-slate-600">Une a la trombina y redirige su especificidad hacia la activación de la Proteína C, que degrada FVa y FVIIIa.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <span className="font-bold text-slate-900 block">Símil-Heparina + ATIII</span>
                <p className="text-slate-600">Proteoglicanos endoteliales que aceleran 1.000 veces la inactivación de trombina y FXa por la Antitrombina III.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <span className="font-bold text-slate-900 block">TFPI</span>
                <p className="text-slate-600">Inhibidor de la Vía del Factor Tisular que bloquea el complejo FT-VIIa tras la iniciación de la coagulación.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
