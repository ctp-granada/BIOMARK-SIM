import React, { useState } from 'react';
import { 
  RefreshCw, 
  Flame, 
  Sparkles, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle,
  Zap,
  ArrowDown
} from 'lucide-react';

interface OrganState {
  act: string;
  mech: string;
  res: string;
}

interface MetabolicStateData {
  title: string;
  badgeColor: string;
  hormones: {
    insulin: { label: string; status: 'baja' | 'alta'; value: string };
    glucagon: { label: string; status: 'baja' | 'alta'; value: string };
    fuel: { label: string; source: string; highlightClass: string };
  };
  organs: {
    musculo: OrganState;
    adiposo: OrganState;
    higado: OrganState;
    corazon: OrganState;
  };
  chartData: {
    glucolisis: number;
    betaOxidacion: number;
  };
  clinicalKey: string;
}

const METABOLIC_DATA: Record<'ayuno' | 'postprandio', MetabolicStateData> = {
  ayuno: {
    title: 'Estado de Ayuno (Catabólico)',
    badgeColor: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
    hormones: {
      insulin: { label: 'Insulina', status: 'baja', value: 'Baja (Concentración basal)' },
      glucagon: { label: 'Glucagón', status: 'alta', value: 'Elevado (Señal catabólica)' },
      fuel: { label: 'Origen Dominante Acetil-CoA', source: 'Beta-Oxidación de Ácidos Grasos Libres', highlightClass: 'text-amber-800' }
    },
    organs: {
      musculo: {
        act: 'Desinhibición de CAT-1 por descenso crítico de Malonil-CoA',
        mech: 'El Acetil-CoA procede de la beta-oxidación de AGL. El incremento masivo de Acetil-CoA y Citrato mitocondrial inhibe alostéricamente a la Piruvato Deshidrogenasa (PDH) y a la Fosfofructoquinasa-1 (PFK-1).',
        res: 'La oxidación acelerada de ácidos grasos bloquea el consumo celular de glucosa, reservándola para el SNC y eritrocitos.'
      },
      adiposo: {
        act: 'Lipólisis activa mediada por Lipasa Sensible a Hormonas (LSH)',
        mech: 'El glucagón y catecolaminas elevan el AMPc intracelular y fosforilan a la LSH y perilipinas, hidrolizando triglicéridos a glicerol y AGL.',
        res: 'Liberación continua de AGL plasmáticos hacia el músculo, corazón e hígado.'
      },
      higado: {
        act: 'Beta-oxidación masiva, Gluconeogénesis y Cetogénesis activa',
        mech: 'El Acetil-CoA de origen lipídico es un activador alostérico obligado de la Piruvato Carboxilasa (PC) y frena la PDH, forzando al piruvato hacia la gluconeogénesis.',
        res: 'Mantenimiento de la glucemia basal y síntesis hepática de cuerpos cetónicos (acetoacetato y beta-hidroxibutirato).'
      },
      corazon: {
        act: 'Uso preferente y casi exclusivo de Ácidos Grasos Libres',
        mech: 'La carnitina palmitoiltransferasa-1 (CAT-1) activa facilita la captación mitocondrial masiva de acil-CoA. El Acetil-CoA satura el ciclo de Krebs e inhibe la captación de piruvato.',
        res: 'Ahorro absoluto de glucosa para mantener la contractilidad con el sustrato más denso energéticamente.'
      }
    },
    chartData: {
      glucolisis: 15,
      betaOxidacion: 85
    },
    clinicalKey: 'En el ayuno, el bloqueo de la PDH por el Acetil-CoA derivado de lípidos evita que el piruvato (generado a partir de lactato o aminoácidos) sea oxidado irreversiblemente a CO2, permitiendo su reconversión hepática a glucosa.'
  },
  postprandio: {
    title: 'Estado Postprandial (Absortivo)',
    badgeColor: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
    hormones: {
      insulin: { label: 'Insulina', status: 'alta', value: 'Elevada (Pico postprandial)' },
      glucagon: { label: 'Glucagón', status: 'baja', value: 'Inhibido por hiperglucemia' },
      fuel: { label: 'Origen Dominante Acetil-CoA', source: 'Glucólisis Aerobia (Descarboxilación de Piruvato)', highlightClass: 'text-emerald-800' }
    },
    organs: {
      musculo: {
        act: 'Inhibición potente de CAT-1 mediada por Malonil-CoA citosólico',
        mech: 'La captación de glucosa vía GLUT4 y la glucólisis generan piruvato. La fosfatasa de PDH (activada por insulina) desfosforila y activa al complejo PDH.',
        res: 'El flujo glucolítico domina la producción de Acetil-CoA y ATP. Se inhibe el ingreso de ácidos grasos a la mitocondria.'
      },
      adiposo: {
        act: 'Lipogénesis, captación de glucosa vía GLUT4 y síntesis de TAG',
        mech: 'La insulina desfosforila e inactiva a la LSH, suprimiendo la lipólisis. Activa la lipoproteína lipasa (LPL) endotelial para captar quilomicrones y VLDL.',
        res: 'Almacenamiento neto de grasa y desaparición de AGL circulantes.'
      },
      higado: {
        act: 'Glucólisis, Glucogenogénesis y Lipogénesis de novo',
        mech: 'El exceso de glucosa se oxida a Acetil-CoA, que sale al citosol como citrato para generar Malonil-CoA (vía Acetil-CoA Carboxilasa, ACC activa).',
        res: 'Exportación de triglicéridos recién sintetizados en partículas VLDL.'
      },
      corazon: {
        act: 'Aumento relativo del consumo de glucosa y lactato circulante',
        mech: 'El incremento de Malonil-CoA atenúa la CAT-1 miocárdica, permitiendo que el corazón metabolice activamente glucosa según disponibilidad.',
        res: 'Flexibilidad metabólica fisiológica para adaptarse a la carga circulatoria.'
      }
    },
    chartData: {
      glucolisis: 80,
      betaOxidacion: 20
    },
    clinicalKey: 'La molécula clave del control recíproco es el Malonil-CoA: sintetizado por la Acetil-CoA Carboxilasa (ACC) en respuesta a la insulina y el citrato, actúa como un potente inhibidor alostérico de la CAT-1, impidiendo la entrada mitocondrial de acil-CoA.'
  }
};

export const RandleCycleLab: React.FC = () => {
  const [metabolicState, setMetabolicState] = useState<'ayuno' | 'postprandio'>('ayuno');
  const [selectedOrgan, setSelectedOrgan] = useState<'musculo' | 'adiposo' | 'higado' | 'corazon'>('musculo');
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const currentData = METABOLIC_DATA[metabolicState];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Laboratorio Interactivo de Metabolismo Intermediario
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-300 bg-slate-900 border border-slate-800">
              Departamento de Bioquímica y Biología Molecular III e Inmunología • UGR
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>El Ciclo de Randle</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
              Ciclo Glucosa-Ácidos Grasos
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Descrito en 1963 por Philip Randle, este mecanismo alostérico fundamental gobierna la <strong className="text-white">competencia recíproca entre la glucosa y los ácidos grasos</strong> por su oxidación mitocondrial. En función del balance hormonal, la célula selecciona su combustible metabólico primario para alimentar el nodo central de convergencia: el <strong>Acetil-CoA</strong>.
          </p>
        </div>
      </div>

      {/* Main Interactive Controller: Ayuno vs Postprandio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Contexto Fisiológico Global
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Conmutador de Estado Metabólico
            </h2>
          </div>

          {/* Toggle buttons */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 shadow-inner">
            <button
              onClick={() => setMetabolicState('ayuno')}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                metabolicState === 'ayuno'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>⏳</span>
              <span>Estado de Ayuno</span>
            </button>
            <button
              onClick={() => setMetabolicState('postprandio')}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                metabolicState === 'postprandio'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🍽️</span>
              <span>Estado Postprandial</span>
            </button>
          </div>
        </div>

        {/* Global Hormonal Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Señal de Insulina (Páncreas)
            </span>
            <div className="my-2">
              <span className={`text-xl font-bold font-mono ${metabolicState === 'ayuno' ? 'text-slate-600' : 'text-emerald-700'}`}>
                {currentData.hormones.insulin.status === 'baja' ? '⬇️ BAJA' : '⬆️ ELEVADA'}
              </span>
              <p className="text-xs text-slate-600 mt-1">{currentData.hormones.insulin.value}</p>
            </div>
            <span className="text-[11px] text-slate-500 italic">
              {metabolicState === 'ayuno' ? 'Permite lipólisis adipocitaria' : 'Estimula GLUT4 y ACC'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Señal de Glucagón
            </span>
            <div className="my-2">
              <span className={`text-xl font-bold font-mono ${metabolicState === 'ayuno' ? 'text-amber-700' : 'text-slate-600'}`}>
                {currentData.hormones.glucagon.status === 'alta' ? '⬆️ ALTO' : '⬇️ BASAL / INHIBIDO'}
              </span>
              <p className="text-xs text-slate-600 mt-1">{currentData.hormones.glucagon.value}</p>
            </div>
            <span className="text-[11px] text-slate-500 italic">
              {metabolicState === 'ayuno' ? 'Promueve gluconeogénesis y cetogénesis' : 'Vía de señalización desactivada'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Origen del Acetil-CoA
            </span>
            <div className="my-2">
              <span className={`text-base font-bold ${currentData.hormones.fuel.highlightClass}`}>
                {currentData.hormones.fuel.source}
              </span>
              <p className="text-xs text-slate-600 mt-1">
                {metabolicState === 'ayuno' ? 'Rendimiento energético masivo lipídico' : 'Consumo preferencial de carbohidratos'}
              </p>
            </div>
            <span className="text-[11px] text-slate-500 italic">
              {metabolicState === 'ayuno' ? 'Inhibe a la Piruvato Deshidrogenasa (PDH)' : 'CAT-1 bloqueada por Malonil-CoA'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Enzyme Competition Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Enzyme Flow Diagram */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Competencia Enzimática Mitocondrial</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Punto de Control Alostérico
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Observe cómo la activación recíproca de una vía frena de forma mecánica y alostérica a la otra a nivel mitocondrial:
            </p>
          </div>

          {/* Flow Comparison Nodes */}
          <div className="p-5 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Branch 1: Glycolysis / Pyruvate */}
              <div className={`p-4 rounded-xl border transition-all ${
                metabolicState === 'postprandio'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Vía Glucolítica</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    metabolicState === 'postprandio' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-950 text-rose-400'
                  }`}>
                    {metabolicState === 'postprandio' ? 'ACTIVA (80%)' : 'FRENADA (15%)'}
                  </span>
                </div>
                <div className="text-center py-2 text-xs space-y-1">
                  <span className="block font-semibold">Glucosa ➔ Piruvato</span>
                  <ArrowDown className="w-3.5 h-3.5 mx-auto text-slate-400" />
                  <span className="font-bold">Piruvato Deshidrogenasa (PDH)</span>
                  <div className={`mt-1 text-[11px] p-1.5 rounded ${
                    metabolicState === 'postprandio' ? 'bg-emerald-900/40 text-emerald-200' : 'bg-rose-950/60 text-rose-300'
                  }`}>
                    {metabolicState === 'postprandio' ? '✓ Desfosforilada / Activa' : '✕ Fosforilada / Inhibida por Acetil-CoA'}
                  </div>
                </div>
              </div>

              {/* Branch 2: Beta-Oxidation / Fatty Acids */}
              <div className={`p-4 rounded-xl border transition-all ${
                metabolicState === 'ayuno'
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 opacity-60'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Beta-Oxidación</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    metabolicState === 'ayuno' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-950 text-rose-400'
                  }`}>
                    {metabolicState === 'ayuno' ? 'ACTIVA (85%)' : 'FRENADA (20%)'}
                  </span>
                </div>
                <div className="text-center py-2 text-xs space-y-1">
                  <span className="block font-semibold">Ácidos Grasos ➔ Acil-CoA</span>
                  <ArrowDown className="w-3.5 h-3.5 mx-auto text-slate-400" />
                  <span className="font-bold">CAT-1 (Carnitina Transferasa 1)</span>
                  <div className={`mt-1 text-[11px] p-1.5 rounded ${
                    metabolicState === 'ayuno' ? 'bg-amber-900/40 text-amber-200' : 'bg-rose-950/60 text-rose-300'
                  }`}>
                    {metabolicState === 'ayuno' ? '✓ Desinhibida (Sin Malonil-CoA)' : '✕ Inhibida por Malonil-CoA'}
                  </div>
                </div>
              </div>

            </div>

            {/* Central Node: Acetyl-CoA Pool */}
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Nodo Central de Convergencia Mitocondrial
              </span>
              <div className="text-lg font-bold font-mono text-white flex items-center justify-center gap-2">
                <span>⚡ POOL DE ACETIL-CoA</span>
              </div>
              <p className="text-xs text-slate-300">
                Alimenta el Ciclo de Krebs para generar NADH / FADH2 y ATP en la Cadena de Transporte de Electrones.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">Fundamento del Efecto Randle:</span>
            {currentData.clinicalKey}
          </div>
        </div>

        {/* Right: Substrate Proportion Visualizer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Distribución de Fuentes Energéticas (%)
            </h3>
            <p className="text-xs text-slate-500">
              Contribución estimada a la generación de Acetil-CoA en el músculo esquelético y miocardio.
            </p>
          </div>

          {/* Visual Bar Distribution */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-6 text-center">
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <span className="text-2xl font-black font-mono text-emerald-800 block">
                  {currentData.chartData.glucolisis}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Glucosa / Piruvato</span>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-2xl font-black font-mono text-amber-800 block">
                  {currentData.chartData.betaOxidacion}%
                </span>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Ácidos Grasos Libres</span>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-emerald-600 transition-all duration-500"
                style={{ width: `${currentData.chartData.glucolisis}%` }}
                title={`Vía Glucolítica: ${currentData.chartData.glucolisis}%`}
              />
              <div
                className="bg-amber-600 transition-all duration-500"
                style={{ width: `${currentData.chartData.betaOxidacion}%` }}
                title={`Beta-Oxidación: ${currentData.chartData.betaOxidacion}%`}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-600 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                Vía Glucolítica (PDH)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                Beta-oxidación (CAT-1)
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
              Repercusión en la Flexibilidad Metabólica:
            </span>
            <p className="leading-relaxed">
              En patologías como la <strong className="text-slate-900">diabetes mellitus tipo 2</strong> o la <strong className="text-slate-900">obesidad con resistencia a la insulina</strong>, la afluencia ininterrumpida de ácidos grasos mantiene permanentemente activado el ciclo de Randle, bloqueando el consumo de glucosa muscular incluso en presencia de hiperglucemia e hiperinsulinemia postprandial.
            </p>
          </div>
        </div>
      </div>

      {/* Organ-Specific Biochemical Analysis */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Respuesta y Regulación Tisular Específica
          </h2>
          <p className="text-xs text-slate-600">
            Haga clic en cada uno de los cuatro órganos diana para revisar el comportamiento enzimático detallado.
          </p>
        </div>

        {/* Organ Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'musculo', label: 'Músculo Esquelético', emoji: '💪' },
            { id: 'adiposo', label: 'Tejido Adiposo', emoji: '🟡' },
            { id: 'higado', label: 'Hígado', emoji: '🩸' },
            { id: 'corazon', label: 'Miocardio', emoji: '🫀' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedOrgan(item.id as any)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                selectedOrgan === item.id
                  ? 'bg-slate-950 text-white border-slate-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{item.emoji}</span>
                <span className="text-xs font-bold">{item.label}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${selectedOrgan === item.id ? 'text-emerald-400' : 'text-slate-400'}`} />
            </button>
          ))}
        </div>

        {/* Selected Organ Detail Card */}
        {selectedOrgan && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Bioquímica Tisular del Órgano
                </span>
                <h3 className="text-base font-bold text-slate-900 capitalize">
                  {selectedOrgan === 'musculo' && '💪 Músculo Esquelético'}
                  {selectedOrgan === 'adiposo' && '🟡 Tejido Adiposo'}
                  {selectedOrgan === 'higado' && '🩸 Hígado'}
                  {selectedOrgan === 'corazon' && '🫀 Miocardio'}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${currentData.badgeColor}`}>
                {currentData.title}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Entrada de Sustrato / Regulación CAT-1:
                </span>
                <p className="font-semibold text-slate-900 leading-relaxed">
                  {currentData.organs[selectedOrgan].act}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Mecanismo Molecular:
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {currentData.organs[selectedOrgan].mech}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Resultado Fisiológico:
                </span>
                <p className="font-semibold text-slate-900 leading-relaxed">
                  {currentData.organs[selectedOrgan].res}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Self-Assessment Check */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Autoevaluación Docente • Ciclo de Randle
          </h3>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Pregunta tipo examen:</strong> En un individuo en ayuno prolongado de 18 horas, ¿cuál de los siguientes mecanismos explica primariamente que el músculo esquelético no consuma la escasa glucosa sanguínea?
        </p>

        <div className="space-y-2">
          {[
            { id: 0, text: 'A) Disminución irreversible de los niveles de hexoquinasa muscular por proteólisis.' },
            { id: 1, text: 'B) La alta relación Acetil-CoA/CoA y citrato procedentes de la beta-oxidación inhiben alostéricamente a la PDH y PFK-1.', correct: true },
            { id: 2, text: 'C) Aumento del Malonil-CoA que acelera la síntesis de novo de ácidos grasos musculares.' },
            { id: 3, text: 'D) Activación constitutiva de la piruvato quinasa por el glucagón muscular.' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setQuizAnswer(opt.id)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                quizAnswer === opt.id
                  ? opt.correct
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {quizAnswer !== null && (
          <div className={`p-3 rounded-xl text-xs ${quizAnswer === 1 ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'bg-rose-50 text-rose-950 border border-rose-200'}`}>
            {quizAnswer === 1 ? (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  <strong>¡Correcto!</strong> La beta-oxidación de ácidos grasos genera un incremento marcado en la relación Acetil-CoA/CoA y en el citrato mitocondrial. El Acetil-CoA activa a la PDH quinasa (que fosforila e inactiva a la PDH), mientras que el citrato citosólico inhibe a la PFK-1, deteniendo la glucólisis y ahorrando glucosa para tejidos obligados como el encéfalo.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Incorrecto.</strong> Recuerde que la respuesta B describe exactamente el ciclo de Randle: los productos de la degradación de grasas inhiben los dos complejos clave de la glucólisis y utilización de piruvato.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
