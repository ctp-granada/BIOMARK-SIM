import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { BiochemicalInfoTooltip } from '../BiochemicalInfoTooltip';

ChartJS.register(...registerables);

interface OrganData {
  act: string;
  mech: string;
  res: string;
  tag: string;
}

interface StateData {
  colors: {
    border: string;
    bg: string;
    text: string;
  };
  hormones: {
    insulin: string;
    glucagon: string;
    fuel: string;
    fuelColor: string;
  };
  organs: {
    musculo: OrganData;
    adiposo: OrganData;
    higado: OrganData;
    corazon: OrganData;
  };
  chartData: number[];
  chartLabels: string[];
}

const APP_DATA: Record<'ayuno' | 'postprandio', StateData> = {
  ayuno: {
    colors: {
      border: 'border-amber-500',
      bg: 'bg-amber-50',
      text: 'text-amber-700'
    },
    hormones: {
      insulin: '⬇️ Baja',
      glucagon: '⬆️ Alto',
      fuel: 'Beta-oxidación',
      fuelColor: 'text-amber-600'
    },
    organs: {
      musculo: {
        tag: 'Ayuno',
        act: 'Activación de CAT-1 por baja de Malonil-CoA',
        mech: 'Derivado prioritariamente de la beta-oxidación de ácidos grasos libres (AGL). El exceso de Acetil-CoA resultante inhibe la Piruvato Deshidrogenasa (PDH).',
        res: 'La alta relación Acetil-CoA/CoA bloquea la oxidación de glucosa.'
      },
      adiposo: {
        tag: 'Proveedor',
        act: 'Lipólisis (LSH activa)',
        mech: 'Suministra los AGL que circularán hacia el músculo para ser oxidados y generar el Acetil-CoA que frenará el consumo de glucosa.',
        res: 'Aumento de AGL plasmáticos.'
      },
      higado: {
        tag: 'Regulador',
        act: 'Generado por Beta-oxidación',
        mech: 'El Acetil-CoA de las grasas activa la Piruvato Carboxilasa, desviando el piruvato hacia la Gluconeogénesis en lugar de la oxidación.',
        res: 'Mantenimiento de la glucemia y producción de cuerpos cetónicos.'
      },
      corazon: {
        tag: 'Vital',
        act: 'Preferencia por AGL',
        mech: 'La CAT-1 activa permite un flujo masivo de grasas. El Acetil-CoA de origen lipídico satura el ciclo de Krebs e inhibe la entrada de piruvato.',
        res: 'Ahorro absoluto de glucosa sanguínea.'
      }
    },
    chartData: [15, 85],
    chartLabels: ['Vía Glucolítica', 'Beta-oxidación']
  },
  postprandio: {
    colors: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700'
    },
    hormones: {
      insulin: '⬆️ Alta',
      glucagon: '⬇️ Bajo',
      fuel: 'Glucólisis-Piruvato',
      fuelColor: 'text-emerald-600'
    },
    organs: {
      musculo: {
        tag: 'Postprandio',
        act: 'Inhibición de CAT-1 por Malonil-CoA',
        mech: 'El Acetil-CoA procede de la descarboxilación del piruvato (glucólisis). La insulina activa la PDH.',
        res: 'El flujo de glucosa domina la producción de energía.'
      },
      adiposo: {
        tag: 'Almacén',
        act: 'Lipogénesis (almacén)',
        mech: 'La insulina frena la salida de AGL. Se detiene el suministro de grasas para oxidación.',
        res: 'Captación de glucosa y síntesis de TG.'
      },
      higado: {
        tag: 'Sintetizador',
        act: 'Glucólisis y Síntesis de Novo',
        mech: 'El Acetil-CoA se deriva de la glucosa y se utiliza para la síntesis de ácidos grasos (Lipogénesis de novo).',
        res: 'Almacenamiento y exportación de VLDL.'
      },
      corazon: {
        tag: 'Flexible',
        act: 'Aumento del uso de Glucosa',
        mech: 'La formación de Malonil-CoA inhibe la CAT-1, reduciendo el Acetil-CoA lipídico a favor del derivado de glucosa.',
        res: 'Flexibilidad metabólica ante la abundancia.'
      }
    },
    chartData: [80, 20],
    chartLabels: ['Vía Glucolítica', 'Beta-oxidación']
  }
};

export const RandleCycleLab: React.FC = () => {
  const [metabolicState, setMetabolicState] = useState<'ayuno' | 'postprandio'>('ayuno');
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  const data = APP_DATA[metabolicState];

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
        labels: data.chartLabels,
        datasets: [
          {
            data: data.chartData,
            backgroundColor: ['#10b981', '#f59e0b'],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        cutout: '70%'
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [metabolicState]);

  return (
    <div className="bg-stone-50 text-stone-800 font-sans antialiased min-h-screen flex flex-col rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              <span className="text-3xl">🔄</span> El Ciclo de Randle
              <BiochemicalInfoTooltip
                title="Ciclo Glucosa - Ácidos Grasos (Randle)"
                mechanism="Competencia recíproca entre glucosa y ácidos grasos descrita por Philip Randle (1963). Cuando la célula oxida masivamente lípidos, el exceso de Acetil-CoA y Citrato bloquea alostéricamente a la Piruvato Deshidrogenasa (PDH) y a la PFK-1, ahorrando glucosa. En abundancia nutricional, la síntesis de Malonil-CoA frena a la CAT-1, priorizando el uso de carbohidratos."
                molecularKey="CAT-1 (Carnitina palmitoiltransferasa 1) • PDH (Piruvato Deshidrogenasa) • Malonil-CoA"
                clinicalRelevance="Mecanismo clave alterado en la resistencia a la insulina y diabetes mellitus tipo 2, donde la lipotoxicidad frena crónicamente el consumo celular de glucosa."
              />
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Competencia metabólica: El origen del Acetil-CoA y la regulación enzimática.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* Intro Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-xl font-semibold text-stone-800">Mecanismo de Selección de Combustible</h2>
            <BiochemicalInfoTooltip
              title="Selección de Sustratos y Nodo Acetil-CoA"
              mechanism="El Acetil-CoA mitocondrial es la encrucijada donde convergen la descarboxilación del piruvato (glucosa) y la beta-oxidación (grasas). La velocidad de entrada depende de la apertura o bloqueo de la CAT-1 externa y del estado de fosforilación de la PDH."
              molecularKey="Acetil-CoA mitocondrial • Citrato citosólico"
            />
          </div>
          <p className="text-stone-600 leading-relaxed mb-4">
            El <strong>Ciclo de Randle</strong> explica cómo la célula elige qué "quemar". En el ayuno, la desinhibición de la <strong>CAT-1</strong> prioriza las grasas. En el postprandio, el <strong>Malonil-CoA</strong> bloquea la entrada de grasas para priorizar la glucosa.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Observe cómo cambia la <strong>procedencia del Acetil-CoA</strong>: un nodo central donde convergen ambas vías y se ejerce el control metabólico.
          </p>
        </section>

        {/* Metabolic State Selector */}
        <section className="flex flex-col items-center justify-center space-y-6 bg-stone-100 p-8 rounded-3xl border border-stone-200">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-stone-600 uppercase tracking-wider">Estado Metabólico Actual</h3>
            <BiochemicalInfoTooltip
              title="Conmutador Hormonal Insulina vs Glucagón"
              mechanism="La relación molar Insulina/Glucagón dicta la fosforilación de enzimas maestras. La insulina activa a la Acetil-CoA Carboxilasa (ACC) produciendo Malonil-CoA (inhibidor de CAT-1) e induce a la PDH fosfatasa. El glucagón eleva el AMPc, activa a la PKA y a la lipasa sensible a hormonas (LSH), inundando el plasma de ácidos grasos."
              molecularKey="ACC (Acetil-CoA Carboxilasa) • PKA • LSH"
            />
          </div>
          <div className="flex p-1 bg-white rounded-full shadow-inner border border-stone-200">
            <button
              onClick={() => setMetabolicState('ayuno')}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 cursor-pointer ${
                metabolicState === 'ayuno'
                  ? 'bg-amber-500 text-white shadow-md transform scale-105'
                  : 'text-stone-500 hover:text-stone-700 bg-transparent'
              }`}
            >
              ⏳ Ayuno
            </button>
            <button
              onClick={() => setMetabolicState('postprandio')}
              className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 cursor-pointer ${
                metabolicState === 'postprandio'
                  ? 'bg-emerald-500 text-white shadow-md transform scale-105'
                  : 'text-stone-500 hover:text-stone-700 bg-transparent'
              }`}
            >
              🍽️ Postprandio
            </button>
          </div>

          {/* Hormone & Fuel Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-6 text-center">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 transition-colors duration-300">
              <p className="text-sm text-stone-500 font-semibold uppercase">Insulina</p>
              <p className="text-2xl font-bold mt-1">{data.hormones.insulin}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 transition-colors duration-300">
              <p className="text-sm text-stone-500 font-semibold uppercase">Glucagón</p>
              <p className="text-2xl font-bold mt-1">{data.hormones.glucagon}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 transition-colors duration-300">
              <p className="text-sm text-stone-500 font-semibold uppercase">Origen Acetil-CoA</p>
              <p className={`text-xl font-bold mt-1 transition-colors duration-300 ${data.hormones.fuelColor}`}>
                {data.hormones.fuel}
              </p>
            </div>
          </div>
        </section>

        {/* Tissue Analysis */}
        <section>
          <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-stone-800">Análisis Tisular</h2>
                <BiochemicalInfoTooltip
                  title="Especialización y Cooperación Tisular"
                  mechanism="El tejido adiposo actúa como proveedor de AGL mediante la lipólisis; el músculo esquelético y cardíaco modulan su flexibilidad metabólica adaptando la captación de sustratos según la disponibilidad; el hígado desvía el piruvato hacia la gluconeogénesis al estar saturada la beta-oxidación y exporta cuerpos cetónicos."
                  molecularKey="GLUT4 • LSH adiposa • Piruvato Carboxilasa hepática"
                />
              </div>
              <p className="text-stone-600 mt-1">Distribución de la carga metabólica y señales de bloqueo recíproco.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Músculo Esquelético */}
            <div className={`bg-white rounded-2xl shadow-sm border-l-4 p-6 transition-colors duration-300 ${data.colors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">💪 Músculo Esquelético</h3>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">
                  {data.organs.musculo.tag}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Entrada de Sustrato</p>
                  <p className="text-lg font-medium text-stone-800">{data.organs.musculo.act}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-stone-700 mb-1">Procedencia Acetil-CoA:</p>
                  <p className="text-sm text-stone-600">{data.organs.musculo.mech}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Efecto Randle</p>
                  <p className="text-stone-700 font-medium">{data.organs.musculo.res}</p>
                </div>
              </div>
            </div>

            {/* Tejido Adiposo */}
            <div className={`bg-white rounded-2xl shadow-sm border-l-4 p-6 transition-colors duration-300 ${data.colors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">🟡 Tejido Adiposo</h3>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">
                  {data.organs.adiposo.tag}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Actividad Metabólica</p>
                  <p className="text-lg font-medium text-stone-800">{data.organs.adiposo.act}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-stone-700 mb-1">Función en el ciclo:</p>
                  <p className="text-sm text-stone-600">{data.organs.adiposo.mech}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Resultado</p>
                  <p className="text-stone-700 font-medium">{data.organs.adiposo.res}</p>
                </div>
              </div>
            </div>

            {/* Hígado */}
            <div className={`bg-white rounded-2xl shadow-sm border-l-4 p-6 transition-colors duration-300 ${data.colors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">🩸 Hígado</h3>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">
                  {data.organs.higado.tag}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Acetil-CoA Hepático</p>
                  <p className="text-lg font-medium text-stone-800">{data.organs.higado.act}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-stone-700 mb-1">Mecanismo:</p>
                  <p className="text-sm text-stone-600">{data.organs.higado.mech}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Salida</p>
                  <p className="text-stone-700 font-medium">{data.organs.higado.res}</p>
                </div>
              </div>
            </div>

            {/* Corazón */}
            <div className={`bg-white rounded-2xl shadow-sm border-l-4 p-6 transition-colors duration-300 ${data.colors.border}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">🫀 Corazón</h3>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-stone-100 text-stone-600 uppercase tracking-wider">
                  {data.organs.corazon.tag}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Uso Energético</p>
                  <p className="text-lg font-medium text-stone-800">{data.organs.corazon.act}</p>
                </div>
                <div className="bg-stone-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-stone-700 mb-1">Bioquímica:</p>
                  <p className="text-sm text-stone-600">{data.organs.corazon.mech}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 font-semibold uppercase">Eficiencia</p>
                  <p className="text-stone-700 font-medium">{data.organs.corazon.res}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enzymatic Competition and Energy Chart */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-stone-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-stone-800">Competencia Enzimática</h2>
              <BiochemicalInfoTooltip
                title="Regulación Alostérica del Complejo PDH y CAT-1"
                mechanism="La PDH quinasa (PDK) es activada alostéricamente por alta relación Acetil-CoA/CoA y NADH/NAD⁺ derivados de la beta-oxidación, fosforilando e inactivando la subunidad E1 de la PDH. A la inversa, en el postprandio el Malonil-CoA citosólico bloquea la cara externa de CAT-1 impidiendo la entrada de acil-CoA a la matriz."
                molecularKey="PDH Quinasa (PDK) • PDH Fosfatasa (PDP) • CAT-1"
              />
            </div>
            <p className="text-stone-600 mb-6">Visualización del flujo dominante hacia el Acetil-CoA mitocondrial.</p>

            <div className="relative p-6 bg-stone-50 rounded-xl border border-stone-200 h-64 flex flex-col justify-center overflow-hidden">
              {/* Flow Ayuno */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-500 ${
                  metabolicState === 'ayuno' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex w-full items-center justify-between px-4 sm:px-8">
                  <div className="text-center w-1/3">
                    <div className="bg-stone-200 text-stone-400 p-2 rounded-lg font-bold">Glucólisis</div>
                    <div className="text-xs text-stone-400 mt-1">(Piruvato)</div>
                    <div className="text-2xl my-1 text-stone-300">⬇️</div>
                    <div className="border-2 border-red-500 text-red-500 p-1 rounded-lg font-bold text-[10px]">
                      PDH INHIBIDA
                    </div>
                  </div>
                  <div className="w-1/3 flex flex-col items-center">
                    <div className="text-2xl mb-1">🏁</div>
                    <div className="bg-stone-800 text-white p-2 rounded-lg font-bold text-xs">Acetil-CoA</div>
                  </div>
                  <div className="text-center w-1/3">
                    <div className="bg-amber-100 text-amber-700 border-2 border-amber-500 p-2 rounded-lg font-bold shadow-md">
                      Beta-oxidación
                    </div>
                    <div className="text-xs text-amber-600 mt-1">CAT-1 ACTIVA</div>
                    <div className="text-2xl my-1 text-amber-500 font-bold">⬇️</div>
                    <div className="bg-amber-500 text-white p-1 rounded-lg font-bold text-[10px]">
                      ORIGEN PRINCIPAL
                    </div>
                  </div>
                </div>
              </div>

              {/* Flow Postprandio */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-500 ${
                  metabolicState === 'postprandio' ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex w-full items-center justify-between px-4 sm:px-8">
                  <div className="text-center w-1/3">
                    <div className="bg-emerald-100 text-emerald-700 border-2 border-emerald-500 p-2 rounded-lg font-bold shadow-md">
                      Glucólisis
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">(Piruvato)</div>
                    <div className="text-2xl my-1 text-emerald-500 font-bold">⬇️</div>
                    <div className="bg-emerald-500 text-white p-1 rounded-lg font-bold text-[10px]">
                      ORIGEN PRINCIPAL
                    </div>
                  </div>
                  <div className="w-1/3 flex flex-col items-center">
                    <div className="text-2xl mb-1">🏁</div>
                    <div className="bg-stone-800 text-white p-2 rounded-lg font-bold text-xs">Acetil-CoA</div>
                  </div>
                  <div className="text-center w-1/3">
                    <div className="bg-stone-200 text-stone-400 p-2 rounded-lg font-bold">Beta-oxidación</div>
                    <div className="text-2xl my-1 text-stone-300">⬇️</div>
                    <div className="border-2 border-red-500 text-red-500 p-1 rounded-lg font-bold text-[10px]">
                      CAT-1 INHIBIDA
                    </div>
                    <div className="text-[9px] text-red-400 mt-1">(por Malonil-CoA)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Energy Sources Doughnut Chart */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Fuentes de Energía (%)</h2>
            <p className="text-stone-600 mb-6">Contribución al pool de Acetil-CoA en el músculo.</p>
            <div className="relative w-full max-w-[400px] mx-auto h-[300px] md:h-[350px] bg-stone-50 rounded-xl border border-stone-200 p-4 flex-grow flex items-center justify-center">
              <canvas ref={chartCanvasRef} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-sm mt-8">
        <p>Ciclo de Randle: Navegador Metabólico Interactivo.</p>
      </footer>
    </div>
  );
};
