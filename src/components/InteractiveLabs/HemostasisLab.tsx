import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface VirchowItem {
  title: string;
  subtitle: string;
  desc: string;
  impact: string;
}

const VIRCHOW_DATA: Record<'lesion' | 'flujo' | 'hiper', VirchowItem> = {
  lesion: {
    title: 'Lesión Endotelial (Pilar I)',
    subtitle: 'El disparador biológico primordial',
    desc: 'Es el factor desencadenante más crítico para la trombosis arterial. Al romperse el revestimiento endotelial sano, se expone de forma inmediata el colágeno subendotelial y el Factor Tisular de la pared vascular profunda.',
    impact: 'Este fenómeno provoca la adhesión instantánea de las plaquetas mediada por el Factor de von Willebrand (vWF), y pone en marcha la cascada de la coagulación mediante la vía extrínseca.'
  },
  flujo: {
    title: 'Alteraciones del Flujo Sanguíneo (Pilar II)',
    subtitle: 'Turbulencia y Estasis',
    desc: 'Tanto la estasis (enfermedad venosa, reposo prolongado) como la turbulencia (estrechamientos arteriales, bifurcaciones) alteran el flujo de cizalladura laminar de la sangre normal.',
    impact: 'Estas anomalías físicas impiden que los factores de coagulación activados se diluyan de forma natural en el torrente sanguíneo circundante, facilitando la retención de plaquetas y acelerando la nidación de trombos.'
  },
  hiper: {
    title: 'Hipercoagulabilidad (Pilar III)',
    subtitle: 'Trombofilia adquirida o hereditaria',
    desc: 'Cualquier alteración patológica sistémica de las vías hemostáticas que predisponga activamente a la trombosis.',
    impact: 'Incluye defectos hereditarios específicos de los factores naturales de regulación (como la mutación del Factor V de Leiden, la deficiencia hereditaria de antitrombina III, o mutaciones que cursan con baja de Proteína C/S) y condiciones adquiridas de riesgo (como el cáncer metastásico y el embarazo).'
  }
};

interface PlateletItem {
  title: string;
  type: string;
  desc: string;
  pathology: string;
}

const PLATELET_DATA: Record<string, PlateletItem> = {
  gp1b: {
    title: 'Glicoproteína GPIb-IX-V',
    type: 'Receptor de Adhesión Primaria',
    desc: 'El receptor encargado de anclarse de forma inicial al Factor de von Willebrand (vWF) expuesto en la matriz subendotelial. Es fundamental para fijar las plaquetas circulantes, especialmente bajo grandes velocidades de cizalla del flujo de la sangre.',
    pathology: 'Su ausencia congénita parcial o total da lugar al Síndrome de Bernard-Soulier (plaquetas gigantes y defectos de coagulación).'
  },
  gp2b3a: {
    title: 'Glicoproteína GPIIb/IIIa (Integrina αIIbβ3)',
    type: 'Receptor de Agregación Cohesiva',
    desc: 'Es el receptor plaquetario más numeroso. Ante la activación, su estructura molecular sufre un cambio conformacional drástico (activación de dentro hacia fuera), lo que le permite enlazarse ávidamente al Fibrinógeno plasmático para formar puentes entre plaquetas adyacentes.',
    pathology: 'Su deficiencia congénita causa la Tromboastenia de Glanzmann (agregación plaquetaria ausente).'
  },
  gp1a2a: {
    title: 'GPIa/IIa e Integrina GPVI',
    type: 'Receptores directos del Colágeno',
    desc: 'Permiten que la plaqueta interactúe directamente con las fibras de colágeno expuestas en el subendotelio del vaso sanguíneo roto para estabilizar el anclaje.',
    pathology: 'Su ausencia causa un incremento severo en el tiempo de sangrado.'
  },
  alfa: {
    title: 'Gránulos Alfa (α)',
    type: 'Orgánulos de Almacenamiento Proteico',
    desc: 'Orgánulos vesiculares abundantes cargados con macromoléculas funcionales: Factor de von Willebrand, Fibrinógeno de alta pureza, Factor V y PDGF (factor de crecimiento derivado de plaquetas para regenerar el vaso).',
    pathology: 'Su escasez causa el Síndrome de la Plaqueta Gris.'
  },
  denso: {
    title: 'Gránulos Densos (δ)',
    type: 'Orgánulos de Moléculas Pequeñas',
    desc: 'Almacenan moléculas de activación alostérica: ADP y ATP, Serotonina (agente vasoconstrictor) y altas concentraciones de Calcio (Ca²⁺).',
    pathology: 'El Calcio es expulsado al medio extracelular para actuar como cofactor de unión de los factores de coagulación sobre la superficie plaquetaria cargada negativamente.'
  }
};

const SIMULATION_STEPS = {
  ext: [
    { id: 'f-FT', text: 'Paso 1: Traumatismo tisular. Se expone de forma directa el Factor Tisular (III) al flujo sanguíneo.' },
    { id: 'f-VII', text: 'Paso 2: El Factor Tisular une y activa al Factor VII (complejo tenasa extrínseca, FT-VIIa).' },
    { id: 'f-X', text: 'Paso 3: El complejo enzimático FT-VIIa rompe por proteólisis directa al Factor X, activándolo (Xa).' },
    { id: 'f-V', text: 'Paso 4: El Factor Xa recluta de forma alostérica a su cofactor esencial, el Factor V activado (Va).' },
    { id: 'f-II', text: 'Paso 5: El complejo protrombinasa (Xa-Va-Ca²⁺) corta enzimáticamente la Protrombina en Trombina (IIa).' },
    { id: 'f-I', text: 'Paso 6: La Trombina cataliza la conversión del Fibrinógeno soluble en fibras cruzadas de Fibrina insoluble, consolidando la red del coágulo.' }
  ],
  int: [
    { id: 'f-XII', text: 'Paso 1: Contacto de la sangre con superficies negativas subendoteliales. El Factor XII (Hageman) se autoactiva (XIIa) junto con el HMWK y la precalicreína.' },
    { id: 'f-XI', text: 'Paso 2: El Factor XIIa escinde al Factor XI de forma directa para formar XIa.' },
    { id: 'f-IX', text: 'Paso 3: El Factor XIa cataliza la conversión enzimática del Factor IX en IXa.' },
    { id: 'f-VIII', text: 'Paso 4: El Factor IXa se asocia con el Factor VIIIa para constituir el complejo tenasa intrínseco sobre la superficie de la plaqueta.' },
    { id: 'f-X', text: 'Paso 5: El complejo tenasa intrínseco (IXa-VIIIa) activa de forma masiva el Factor X a Xa.' },
    { id: 'f-V', text: 'Paso 6: El Factor Xa de la vía común recluta al cofactor Factor Va sobre la membrana.' },
    { id: 'f-II', text: 'Paso 7: El complejo protrombinasa convierte de forma rápida Protrombina en Trombina.' },
    { id: 'f-I', text: 'Paso 8: La Trombina forma filamentos insolubles de Fibrina para conformar la red del coágulo.' }
  ]
};

export const HemostasisLab: React.FC = () => {
  // Virchow
  const [selectedVirchow, setSelectedVirchow] = useState<'lesion' | 'flujo' | 'hiper'>('lesion');

  // Platelet
  const [selectedPlatelet, setSelectedPlatelet] = useState<string>('gp1b');

  // Platelet State (Reposo vs Activado)
  const [plateletState, setPlateletState] = useState<'reposo' | 'activado'>('reposo');

  // Coagulation Simulation
  const [activeFactors, setActiveFactors] = useState<string[]>([]);
  const [simStepInfo, setSimStepInfo] = useState<{ stepNumber: number; text: string } | null>(null);
  const activeTimersRef = useRef<number[]>([]);

  // Chart ref
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Granules doughnut chart
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Fibrinógeno (Gránulo α)',
          'Factor vWF (Gránulo α)',
          'Factores Crecimiento - PDGF (Gránulo α)',
          'Nucleótidos - ADP/ATP (Gránulo δ)',
          'Serotonina (Gránulo δ)',
          'Iones Calcio - Ca²⁺ (Gránulo δ)'
        ],
        datasets: [
          {
            data: [30, 20, 15, 20, 5, 10],
            backgroundColor: [
              'rgba(190, 18, 60, 0.85)', // Rose 700
              'rgba(225, 29, 72, 0.7)', // Rose 600
              'rgba(244, 63, 94, 0.55)', // Rose 500
              'rgba(31, 41, 55, 0.95)', // Gray 800
              'rgba(55, 65, 81, 0.85)', // Gray 700
              'rgba(245, 158, 11, 0.9)' // Amber 500
            ],
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#1f2937',
              font: { size: 10, family: 'sans-serif' },
              boxWidth: 12
            }
          }
        },
        cutout: '60%'
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  const resetSimulation = () => {
    activeTimersRef.current.forEach((timer) => clearTimeout(timer));
    activeTimersRef.current = [];
    setActiveFactors([]);
    setSimStepInfo(null);
  };

  const runSimulation = (route: 'ext' | 'int') => {
    resetSimulation();
    const steps = SIMULATION_STEPS[route];

    steps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        setActiveFactors((prev) => [...prev, step.id]);
        setSimStepInfo({
          stepNumber: index + 1,
          text: step.text
        });
      }, index * 1200);
      activeTimersRef.current.push(timer);
    });
  };

  useEffect(() => {
    return () => {
      activeTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const virchowInfo = VIRCHOW_DATA[selectedVirchow];
  const plateletInfo = PLATELET_DATA[selectedPlatelet];

  return (
    <div className="bg-stone-50 text-stone-800 font-sans antialiased min-h-screen flex flex-col rounded-2xl shadow-sm overflow-hidden">
      {/* Sticky Navigation */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🩸</span>
              <div>
                <span className="font-black text-rose-800 text-lg tracking-tight uppercase block leading-none">
                  Hemostasia & Coagulación
                </span>
                <span className="text-[10px] text-stone-500 font-semibold tracking-wider uppercase">
                  Plataforma Médica Interactiva
                </span>
              </div>
            </div>
            <div className="hidden lg:flex space-x-6 items-center">
              <button
                onClick={() => scrollToSection('fundamentos')}
                className="text-stone-600 hover:text-rose-800 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                Vaso & Endotelio
              </button>
              <button
                onClick={() => scrollToSection('virchow')}
                className="text-stone-600 hover:text-rose-800 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                Tríada de Virchow
              </button>
              <button
                onClick={() => scrollToSection('plaqueta')}
                className="text-stone-600 hover:text-rose-800 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                Anatomía Plaquetaria
              </button>
              <button
                onClick={() => scrollToSection('senalizacion')}
                className="text-stone-600 hover:text-rose-800 px-3 py-2 text-sm font-semibold transition-colors cursor-pointer"
              >
                Señalización (PLC/AMPc)
              </button>
              <button
                onClick={() => scrollToSection('cascada-coag')}
                className="bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                Simulador de Coagulación
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 w-full">
        {/* Intro Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-block bg-rose-100 text-rose-800 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Bioquímica Médica Fisiopatológica
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            El Equilibrio Sangre-Vaso
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed">
            Estudio sistemático de los mecanismos moleculares que mantienen la fluidez de la sangre o detienen su salida ante una brecha mecánica en la vasculatura.
          </p>
        </header>

        {/* SECTION 1: FUNDAMENTOS Y FISIOLOGÍA VASCULAR */}
        <section id="fundamentos" className="scroll-mt-24 pt-4">
          <div className="border-b border-stone-200 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-stone-900">1. Fundamentos de la Pared Vascular</h2>
            <p className="text-stone-600 mt-1">
              Diferencias clave entre el estado fisiológico y patológico, y la respuesta refleja de los vasos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-xl font-bold text-teal-800">Hemostasia (Fisiológico)</h3>
              </div>
              <p className="text-stone-600 leading-relaxed text-sm">
                La <strong>hemostasia</strong> es el conjunto de mecanismos fisiológicos diseñados para detener la pérdida de sangre tras un daño en los vasos sanguíneos. Es una respuesta rápida, sumamente localizada y regulada de manera precisa. Consiste en la formación de un tapón hemostático temporal en el sitio del daño mecánico.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-xl font-bold text-rose-800">Trombosis (Patológico)</h3>
              </div>
              <p className="text-stone-600 leading-relaxed text-sm">
                La <strong>trombosis</strong> es el equivalente patológico de la hemostasia. Ocurre cuando se forma un agregado hemático sólido (trombo) dentro de la luz de un vaso sanguíneo intacto (no lesionado) o cuando se desencadena una respuesta de coagulación desproporcionada ante un daño menor, obstruyendo el flujo sanguíneo tisular.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vasoconstricción */}
            <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-2">
                  Respuesta Física Inmediata
                </span>
                <h3 className="text-2xl font-bold mb-4">La Vasoconstricción</h3>
                <p className="text-stone-300 text-sm leading-relaxed mb-4">
                  Ante la ruptura del vaso, la vasoconstricción local reduce instantáneamente el flujo y la pérdida hemática, facilitando que las plaquetas se adhieran a la brecha. Se produce mediante tres mecanismos principales:
                </p>
                <ul className="space-y-3 text-xs text-stone-300">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">1. Reflejo Miogénico:</span>
                    <span>Contracción automática del músculo liso en respuesta directa al estiramiento o daño.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">2. Reflejo Nociceptivo:</span>
                    <span>Impulsos nerviosos locales generados por el dolor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">3. Factores Humorales:</span>
                    <span>
                      Liberación masiva de <strong>Endotelina-1</strong> (por el endotelio dañado) y de <strong>Tromboxano A2 (TXA2)</strong> y Serotonina (por las plaquetas activadas).
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-800 text-stone-400 text-[11px] italic">
                La vasoconstricción inicial disminuye el área de sección del vaso, reteniendo temporalmente la sangre en el compartimento intravascular.
              </div>
            </div>

            {/* Factores Antitrombóticos */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200">
              <span className="text-teal-700 font-bold text-xs uppercase tracking-wider block mb-2">
                Homeostasis del Vaso Sano
              </span>
              <h3 className="text-2xl font-bold text-stone-900 mb-4">Barreras Antitrombóticas del Endotelio</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                El endotelio intacto actúa activamente como una superficie antiadhesiva y anticoagulante mediante la secreción y exposición de componentes bioactivos específicos:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                  <h4 className="font-bold text-teal-800 text-sm mb-1">Óxido Nítrico (NO) & Prostaciclina (PGI2)</h4>
                  <p className="text-stone-600 text-xs">
                    Potentes vasodilatadores e inhibidores fisiológicos directos de la adhesión y agregación de las plaquetas.
                  </p>
                </div>
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                  <h4 className="font-bold text-teal-800 text-sm mb-1">Trombomodulina</h4>
                  <p className="text-stone-600 text-xs">
                    Se une a la trombina y altera su especificidad, permitiéndole activar a la Proteína C para degradar los factores Va y VIIIa.
                  </p>
                </div>
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                  <h4 className="font-bold text-teal-800 text-sm mb-1">Moléculas Símil-Heparina</h4>
                  <p className="text-stone-600 text-xs">
                    Proteoglicanos que se unen a la Antitrombina III circulante y potencian mil veces su capacidad para inactivar la trombina y el factor Xa.
                  </p>
                </div>
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                  <h4 className="font-bold text-teal-800 text-sm mb-1">TFPI (Inhibidor de la Vía del FT)</h4>
                  <p className="text-stone-600 text-xs">
                    Proteína que bloquea de forma directa el complejo enzimático inicial Factor Tisular - Factor VIIa en la vía extrínseca.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: TRÍADA DE VIRCHOW */}
        <section id="virchow" className="scroll-mt-24 pt-12 border-t border-stone-200">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2 className="text-3xl font-bold text-stone-900">2. Patología de la Trombosis: Tríada de Virchow</h2>
            <p className="text-stone-600 mt-1">
              Los tres pilares postulados por Rudolf Virchow que gobiernan la patogénesis de la formación anormal de coágulos.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Triángulo Gráfico Interactivo */}
            <div className="relative w-80 h-80 flex-shrink-0 mx-auto lg:mx-0">
              <div className="absolute inset-0 border-[3px] border-stone-300 rounded-lg rotate-45 transform scale-75 opacity-10" />

              <button
                onClick={() => setSelectedVirchow('lesion')}
                className={`absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-md hover:scale-105 transition-all z-10 p-2 text-center cursor-pointer ${
                  selectedVirchow === 'lesion' ? 'bg-rose-700 text-white' : 'bg-stone-900 text-white'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">Pilar I</span>
                <span className="text-xs font-bold leading-tight">Lesión Endotelial</span>
              </button>

              <button
                onClick={() => setSelectedVirchow('flujo')}
                className={`absolute -bottom-4 -left-4 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-md hover:scale-105 transition-all z-10 p-2 text-center cursor-pointer ${
                  selectedVirchow === 'flujo' ? 'bg-blue-700 text-white' : 'bg-stone-900 text-white'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">Pilar II</span>
                <span className="text-xs font-bold leading-tight">Flujo de Sangre Anómalo</span>
              </button>

              <button
                onClick={() => setSelectedVirchow('hiper')}
                className={`absolute -bottom-4 -right-4 w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-md hover:scale-105 transition-all z-10 p-2 text-center cursor-pointer ${
                  selectedVirchow === 'hiper' ? 'bg-amber-700 text-white' : 'bg-stone-900 text-white'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Pilar III</span>
                <span className="text-xs font-bold leading-tight">Hipercoagulabilidad</span>
              </button>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-rose-800/10 font-extrabold text-5xl tracking-widest uppercase pointer-events-none">
                  TROMBO
                </span>
              </div>
            </div>

            {/* Detalles de Selección */}
            <div className="flex-grow w-full">
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm min-h-[280px] flex flex-col justify-center transition-all duration-300">
                <span className="text-xs font-bold uppercase text-stone-400 block mb-1">
                  {virchowInfo.subtitle}
                </span>
                <h3 className="text-2xl font-black text-stone-900 mb-4">{virchowInfo.title}</h3>
                <p className="text-stone-700 text-sm leading-relaxed mb-4">{virchowInfo.desc}</p>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <strong className="text-xs text-rose-800 uppercase block mb-1">Mecanismo Fisiopatológico:</strong>
                  <p className="text-xs text-stone-600 leading-relaxed">{virchowInfo.impact}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: LA PLAQUETA */}
        <section id="plaqueta" className="scroll-mt-24 pt-12 border-t border-stone-200">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2 className="text-3xl font-bold text-stone-900">3. Fisiología y Anatomía Plaquetaria</h2>
            <p className="text-stone-600 mt-1">
              Análisis detallado de sus receptores de membrana, el contenido interno de sus gránulos y las patologías plaquetarias.
            </p>
          </div>

          {/* Interactive Platelet Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-stone-200 flex flex-col items-center justify-center">
              <span className="text-stone-400 font-bold text-[10px] uppercase tracking-wider mb-4">
                Haga clic en las estructuras moleculares
              </span>

              <div className="relative w-80 h-80 flex-shrink-0">
                {/* Cuerpo de la plaqueta */}
                <div className="absolute inset-4 bg-rose-50 border-4 border-rose-300 rounded-[45%] flex items-center justify-center shadow-inner">
                  <span className="text-rose-300/60 font-black text-2xl uppercase tracking-widest">
                    Citosol
                  </span>
                </div>

                {/* Hotspots Glicoproteínas */}
                <button
                  onClick={() => setSelectedPlatelet('gp1b')}
                  className={`absolute top-2 left-1/4 -translate-x-1/2 text-white font-bold text-xs px-2 py-1 rounded-md shadow-md hover:scale-110 transition-transform cursor-pointer ${
                    selectedPlatelet === 'gp1b' ? 'bg-blue-800 ring-2 ring-blue-400 scale-105' : 'bg-blue-600'
                  }`}
                >
                  GPIb-IX-V
                </button>
                <button
                  onClick={() => setSelectedPlatelet('gp2b3a')}
                  className={`absolute top-1/2 -right-2 text-white font-bold text-xs px-2 py-1 rounded-md shadow-md hover:scale-110 transition-transform cursor-pointer ${
                    selectedPlatelet === 'gp2b3a' ? 'bg-teal-800 ring-2 ring-teal-400 scale-105' : 'bg-teal-600'
                  }`}
                >
                  GPIIb/IIIa
                </button>
                <button
                  onClick={() => setSelectedPlatelet('gp1a2a')}
                  className={`absolute bottom-4 left-1/3 text-white font-bold text-xs px-2 py-1 rounded-md shadow-md hover:scale-110 transition-transform cursor-pointer ${
                    selectedPlatelet === 'gp1a2a' ? 'bg-indigo-800 ring-2 ring-indigo-400 scale-105' : 'bg-indigo-600'
                  }`}
                >
                  GPIa/IIa & GPVI
                </button>

                {/* Hotspots Gránulos */}
                <button
                  onClick={() => setSelectedPlatelet('alfa')}
                  className={`absolute top-1/3 left-1/3 border font-bold text-xs w-12 h-12 rounded-full flex items-center justify-center shadow-inner transition-all cursor-pointer ${
                    selectedPlatelet === 'alfa'
                      ? 'bg-rose-200 border-rose-500 text-rose-900 ring-2 ring-rose-400 scale-110'
                      : 'bg-stone-300 border-stone-400 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Gránulo α
                </button>
                <button
                  onClick={() => setSelectedPlatelet('denso')}
                  className={`absolute bottom-1/3 right-1/3 font-bold text-xs w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
                    selectedPlatelet === 'denso'
                      ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-110'
                      : 'bg-stone-800 text-stone-100 hover:bg-stone-700'
                  }`}
                >
                  Gránulo δ
                </button>
              </div>
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm h-full flex flex-col justify-center transition-all duration-300">
                <span className="text-xs font-bold uppercase text-rose-600 block mb-1">
                  {plateletInfo.type}
                </span>
                <h3 className="text-2xl font-black text-stone-900 mb-3">{plateletInfo.title}</h3>
                <p className="text-stone-700 text-sm leading-relaxed mb-4">{plateletInfo.desc}</p>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <strong className="text-xs text-rose-900 uppercase block mb-1">
                    Impacto Clínico / Patología Relacionada:
                  </strong>
                  <p className="text-xs text-stone-600 leading-relaxed">{plateletInfo.pathology}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Granule Chart & Pathologies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visualización Bioquímica de Gránulos */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">Composición Molecular de los Gránulos</h3>
                <p className="text-xs text-stone-500 mb-4">
                  Los gránulos densos y los gránulos alfa almacenan solutos cruciales para la hemostasia primaria y la coagulación enzimática secundaria.
                </p>
              </div>
              <div className="relative w-full max-w-[600px] mx-auto h-[300px]">
                <canvas ref={chartCanvasRef} />
              </div>
            </div>

            {/* Tabla de Patologías */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-4">Patologías Hemorrágicas Hereditarias</h3>
              <div className="space-y-4">
                <div className="p-3 bg-stone-50 rounded-xl border-l-4 border-rose-600 text-xs">
                  <span className="font-bold text-stone-900 text-sm block mb-1">Síndrome de Bernard-Soulier</span>
                  <p className="text-stone-600">
                    Deficiencia hereditaria de la glicoproteína <strong>GPIb-IX-V</strong>. Provoca macrotrombocitopenia y una incapacidad absoluta de las plaquetas para adherirse al vWF.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border-l-4 border-rose-600 text-xs">
                  <span className="font-bold text-stone-900 text-sm block mb-1">Tromboastenia de Glanzmann</span>
                  <p className="text-stone-600">
                    Defecto congénito cuantitativo o cualitativo del receptor <strong>GPIIb/IIIa</strong>. Las plaquetas se adhieren normalmente pero no pueden unirse al Fibrinógeno, impidiendo la agregación.
                  </p>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl border-l-4 border-rose-600 text-xs">
                  <span className="font-bold text-stone-900 text-sm block mb-1">Síndrome de la Plaqueta Gris</span>
                  <p className="text-stone-600">
                    Ausencia congénita selectiva de los <strong>Gránulos Alfa (α)</strong>. Las plaquetas presentan un característico color grisáceo al frotis por falta de tinción y defectos de agregación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SEÑALIZACIÓN MOLECULAR */}
        <section id="senalizacion" className="scroll-mt-24 pt-12 border-t border-stone-200">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2 className="text-3xl font-bold text-stone-900">4. Vías de Señalización Intracelular y Segundos Mensajeros</h2>
            <p className="text-stone-600 mt-1">
              Análisis de la cascada bioquímica plaquetaria gobernada por la Fosfolipasa C, Receptores purinérgicos y el balance de AMPc.
            </p>
          </div>

          {/* Dynamic Switch: Reposo vs Activación */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900">Simulador de Estado Plaquetario</h3>
                <p className="text-xs text-stone-500">
                  Mueva el selector para comparar el microentorno bioquímico de una plaqueta en reposo con el de una activada.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center bg-stone-100 p-1.5 rounded-full border border-stone-200">
                <button
                  onClick={() => setPlateletState('reposo')}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    plateletState === 'reposo'
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Plaqueta en Reposo
                </button>
                <button
                  onClick={() => setPlateletState('activado')}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    plateletState === 'activado'
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  Plaqueta Activada
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {/* Caja AMPc */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-stone-400 block mb-2">Nivel de AMPc</span>
                  <span
                    className={`text-3xl font-black block mb-2 ${
                      plateletState === 'reposo' ? 'text-teal-700' : 'text-rose-700'
                    }`}
                  >
                    {plateletState === 'reposo' ? 'ALTO (Freno)' : 'BAJO (Activación)'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mt-2">
                  {plateletState === 'reposo'
                    ? 'La adenilato ciclasa (AC) activa genera abundante AMPc intracelular, estimulando de forma constante a la Proteinasa Quinasa A (PKA). La PKA promueve de forma constante el bombeo de Calcio libre hacia el sistema tubular denso.'
                    : 'Los receptores acoplados a proteína Gi (como el receptor de ADP P2Y12) apagan la Adenilato Ciclasa. La drástica caída del AMPc inhibe la PKA, liberando el freno bioquímico del calcio.'}
                </p>
              </div>

              {/* Caja Calcio */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-stone-400 block mb-2">Calcio Citosólico [Ca²⁺]</span>
                  <span
                    className={`text-3xl font-black block mb-2 ${
                      plateletState === 'reposo' ? 'text-stone-400' : 'text-rose-700'
                    }`}
                  >
                    {plateletState === 'reposo' ? 'BAJO (<0.1 µM)' : 'ALTO (>1.0 µM)'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mt-2">
                  {plateletState === 'reposo'
                    ? 'El Calcio libre citosólico permanece estrictamente secuestrado. El citoesqueleto se mantiene sin contracción, dando a la plaqueta su forma fisiológica de disco plano y liso.'
                    : 'La vía del IP3 fuerza la salida rápida del Calcio (Ca²⁺) del retículo plaquetario al citoplasma. El aumento masivo de calcio deforma el citoesqueleto y activa a la Miosina Quinasa para iniciar la degranulación.'}
                </p>
              </div>

              {/* Caja Forma/Cambio */}
              <div className="p-6 rounded-xl border border-stone-200 bg-stone-50 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-stone-400 block mb-2">Estado Físico</span>
                  <span
                    className={`text-3xl font-black block mb-2 ${
                      plateletState === 'reposo' ? 'text-teal-700' : 'text-rose-700'
                    }`}
                  >
                    {plateletState === 'reposo' ? 'DISCO LISO' : 'FILÓPODOS ACTIVOS'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mt-2">
                  {plateletState === 'reposo'
                    ? 'Las integrinas de membrana como la GPIIb/IIIa mantienen de forma estricta sus bisagras en configuración cerrada, impidiendo la unión del fibrinógeno plasmático.'
                    : 'La degranulación y fosforilación cambian la conformación de la integrina GPIIb/IIIa a su estado abierto de alta afinidad, uniendo de forma activa puentes de Fibrinógeno.'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vía PLC */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-4 border-b pb-2">Señalización por Fosfolipasa C (PLC)</h3>
              <p className="text-stone-600 leading-relaxed mb-4">
                La unión de ligandos de fuerte activación como la <strong>Trombina</strong> (vía receptores PAR1/PAR4) o el <strong>Colágeno</strong> (vía receptor GPVI) activa la subunidad Gq, la cual a su vez moviliza a la enzima efectora de membrana <strong>PLC-β</strong> o <strong>PLC-γ</strong>:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-stone-50 rounded-lg border-l-4 border-rose-700">
                  <strong className="text-rose-900 block">Hidrólisis del PIP2:</strong>
                  La PLC hidroliza de forma directa el fosfatidilinositol 4,5-bifosfato (PIP2) de la membrana para dar origen a dos segundos mensajeros claves: <strong>IP3</strong> y <strong>DAG</strong>.
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border-l-4 border-rose-700">
                  <strong className="text-rose-900 block">IP3 (Inositol 1,4,5-trifosfato):</strong>
                  Difunde por el citosol y se une a sus receptores específicos en la membrana del sistema tubular denso (STD), provocando la liberación rápida y masiva de depósitos de <strong>Calcio (Ca²⁺)</strong>.
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border-l-4 border-rose-700">
                  <strong className="text-rose-900 block">DAG (Diacilglicerol):</strong>
                  Permanece anclado en la bicapa lipídica de la membrana celular donde recluta y activa, junto con el Calcio, a la <strong>Proteína Quinasa C (PKC)</strong>, que fosforila proteínas promotoras de la degranulación celular.
                </div>
              </div>
            </div>

            {/* Receptores ADP */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-sm">
              <h3 className="text-xl font-bold text-stone-900 mb-4 border-b pb-2">Receptores Purinérgicos para ADP (P2Y1 y P2Y12)</h3>
              <p className="text-stone-600 leading-relaxed mb-4">
                El nucleótido ADP segregado por los gránulos densos actúa como un crucial amplificador de retroalimentación a través de dos receptores transmembrana específicos:
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 text-base mb-1">Receptor P2Y1 (Acoplado a Gq)</h4>
                  <p className="text-stone-600 text-xs">
                    Su estimulación activa la cascada de la PLC, iniciando la primera movilización de calcio. Es el encargado de provocar el cambio conformacional inicial plaquetario (pseudópodos) y el primer amago de agregación.
                  </p>
                </div>
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100">
                  <h4 className="font-bold text-teal-900 text-base mb-1">Receptor P2Y12 (Acoplado a Gi)</h4>
                  <p className="text-stone-600 text-xs">
                    Su estimulación <strong>inhibe a la Adenilato Ciclasa</strong>, disminuyendo la producción interna de AMPc. Esto desbloquea el estado de reposo, consolida la degranulación y estabiliza permanentemente el coágulo plaquetario. Es la diana farmacológica de las tienopiridinas (Clopidogrel, Prasugrel, Ticagrelor).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CASCADA DE COAGULACIÓN */}
        <section id="cascada-coag" className="scroll-mt-24 pt-12 border-t border-stone-200">
          <div className="border-b border-stone-200 pb-4 mb-8">
            <h2 className="text-3xl font-bold text-stone-900">5. Bioquímica de la Coagulación (Hemostasia Secundaria)</h2>
            <p className="text-stone-600 mt-1">
              Exploración detallada de la cascada enzimática con el sistema de contacto (Cininógeno y Precalicreína) y simulador paso a paso.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
                  Fase de Amplificación
                </span>
                <h3 className="text-xl font-bold text-stone-900 mb-3">El Sistema de Contacto</h3>
                <p className="text-stone-600 text-xs leading-relaxed mb-4">
                  La vía intrínseca de la coagulación se inicia mediante el contacto con superficies cargadas negativamente. Este complejo de activación requiere de cofactores específicos: el <strong>Cininógeno de Alto Peso Molecular (HMWK)</strong> y la <strong>Precalicreína</strong> (que es escindida a Calicreína por el Factor XIIa).
                </p>
                <p className="text-stone-600 text-xs leading-relaxed">
                  El HMWK sirve como un andamio molecular no catalítico que ancla la precalicreína y al Factor XI de forma directa sobre las superficies celulares o el colágeno expuesto, acelerando exponencialmente la velocidad de activación del Factor XII, asegurando la amplificación local de la cascada.
                </p>
              </div>
              <div className="mt-4 p-3 bg-stone-50 rounded-lg text-stone-500 text-[11px] italic">
                La Calicreína también puede escindir el HMWK para liberar Bradicinina, un potente mediador de la inflamación y la vasodilatación.
              </div>
            </div>

            <div className="lg:col-span-2 bg-stone-900 text-stone-100 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-rose-400 font-bold text-xs uppercase tracking-wider block mb-1">
                  Simulador de Reacción Enzimática
                </span>
                <h3 className="text-2xl font-bold mb-4">Visualizador del Proceso de Cascada</h3>
                <p className="text-stone-300 text-sm mb-6">
                  Elija iniciar una de las dos vías fisiológicas para observar cómo los zimógenos se transforman secuencialmente en enzimas activas.
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={() => runSimulation('ext')}
                    className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-md flex-1 cursor-pointer"
                  >
                    Activar Vía Extrínseca (Tisular)
                  </button>
                  <button
                    onClick={() => runSimulation('int')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-md flex-1 cursor-pointer"
                  >
                    Activar Vía Intrínseca (Contacto)
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="border border-stone-700 hover:bg-stone-800 text-stone-400 text-xs font-bold px-4 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Reiniciar
                  </button>
                </div>
              </div>

              <div className="p-4 bg-stone-800 rounded-xl border border-stone-700 min-h-[120px] flex items-center justify-center text-center">
                {simStepInfo ? (
                  <div>
                    <span className="text-white text-sm font-bold block mb-1">
                      Paso {simStepInfo.stepNumber}:
                    </span>
                    <span className="text-stone-300 text-xs">{simStepInfo.text}</span>
                  </div>
                ) : (
                  <span className="text-stone-500 text-sm">
                    Seleccione una vía para iniciar el modelado tridimensional y cinético de los factores de coagulación.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Panel de Mapeo Gráfico de la Cascada */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
            <div
              className="absolute inset-0 bg-stone-50/20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#e5e7eb 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 text-center font-mono font-bold text-xs text-stone-600">
              {/* Columna Intrínseca */}
              <div className="space-y-4 p-4 bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center">
                <span className="text-blue-600 text-[10px] uppercase font-bold block mb-2">
                  Vía Intrínseca (Contacto)
                </span>
                <div
                  className={`p-3 border-2 rounded-lg w-full transition-all duration-400 ${
                    activeFactors.includes('f-XII')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  Factor XII (Zimógeno)
                </div>
                <div className="text-stone-400 text-base">↓</div>
                <div
                  className={`p-3 border-2 rounded-lg w-full transition-all duration-400 ${
                    activeFactors.includes('f-XI')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  Factor XI (HMWK/Precalicreína)
                </div>
                <div className="text-stone-400 text-base">↓</div>
                <div
                  className={`p-3 border-2 rounded-lg w-full transition-all duration-400 ${
                    activeFactors.includes('f-IX')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  Factor IX (Zimógeno)
                </div>
                <div className="text-stone-400 text-base">↓</div>
                <div
                  className={`p-3 border-2 rounded-lg w-full transition-all duration-400 ${
                    activeFactors.includes('f-VIII')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  Factor VIII (Cofactor)
                </div>
              </div>

              {/* Columna Común */}
              <div className="space-y-4 p-4 bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center justify-end">
                <span className="text-rose-600 text-[10px] uppercase font-bold block mb-2">
                  Vía Común (Fibrinogénesis)
                </span>

                <div
                  className={`p-4 border-2 rounded-xl w-full font-black text-sm transition-all duration-400 ${
                    activeFactors.includes('f-X')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-500'
                  }`}
                >
                  Factor X (Zimógeno clave)
                </div>
                <div className="text-stone-400 text-base">↓</div>
                <div
                  className={`p-3 border-2 rounded-lg w-full transition-all duration-400 ${
                    activeFactors.includes('f-V')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  Factor V (Cofactor)
                </div>
                <div className="text-stone-400 text-base">↓</div>
                <div
                  className={`p-4 border-2 rounded-xl w-full font-black text-sm transition-all duration-400 ${
                    activeFactors.includes('f-II')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-500'
                  }`}
                >
                  Protrombina (II)
                </div>
                <div className="text-stone-400 text-base">↓</div>
                <div
                  className={`p-4 border-2 rounded-xl w-full font-black text-sm uppercase transition-all duration-400 ${
                    activeFactors.includes('f-I')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-300 bg-stone-900 text-stone-100'
                  }`}
                >
                  Red de Fibrina
                </div>
              </div>

              {/* Columna Extrínseca */}
              <div className="space-y-4 p-4 bg-stone-50 rounded-xl border border-stone-100 flex flex-col items-center">
                <span className="text-orange-600 text-[10px] uppercase font-bold block mb-2">
                  Vía Extrínseca (Rápida)
                </span>
                <div
                  className={`p-3 border-2 rounded-lg w-full transition-all duration-400 ${
                    activeFactors.includes('f-FT')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  Factor Tisular (III)
                </div>
                <div className="text-stone-400 text-base">↓</div>
                <div
                  className={`p-3 border-2 rounded-lg w-full transition-all duration-400 ${
                    activeFactors.includes('f-VII')
                      ? 'bg-rose-700 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-stone-200 bg-white text-stone-400'
                  }`}
                >
                  Factor VII (Zimógeno)
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16 py-12 text-center text-stone-500 text-xs">
        <p className="font-bold mb-1">HemostasiaLab - Herramienta Educativa Universitaria de Bioquímica y Hematología</p>
        <p>Facultad de Medicina, Universidad de Granada (UGR). Desarrollado para el análisis interactivo de conceptos fisiológicos y de patología circulatoria.</p>
      </footer>
    </div>
  );
};
