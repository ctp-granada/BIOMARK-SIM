import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell
} from 'recharts';
import { MetabolicStateId } from './types/metabolism';
import { METABOLIC_STATES } from './data/metabolicData';
import { Activity, Droplets, Flame, TrendingUp, Info } from 'lucide-react';

export interface StateSubstrateData {
  id: MetabolicStateId;
  shortName: string;
  fullName: string;
  timeframe: string;
  category: 'Fisiológica' | 'Patológica';
  glucose: number; // mg/dL
  ffa: number; // mM
  ketones: number; // mM
  lactate: number; // mM
  glucoseRange: string;
  ffaRange: string;
  ketonesRange: string;
  lactateRange: string;
  keyEnzyme: string;
  glucoseClinicalNote: string;
  ffaClinicalNote: string;
  ketonesClinicalNote: string;
  generalClinicalNote: string;
}

export const METABOLIC_SUBSTRATES_DATA: Record<MetabolicStateId, StateSubstrateData> = {
  postprandial: {
    id: 'postprandial',
    shortName: 'Postprandial',
    fullName: 'Postprandial (0-4h)',
    timeframe: '0 - 4 horas post-ingesta',
    category: 'Fisiológica',
    glucose: 142,
    ffa: 0.18,
    ketones: 0.04,
    lactate: 1.1,
    glucoseRange: '135 - 150 mg/dL',
    ffaRange: '0.10 - 0.25 mM',
    ketonesRange: '< 0.05 mM (Trazas)',
    lactateRange: '0.8 - 1.3 mM',
    keyEnzyme: 'Fosfofructoquinasa-1 (PFK-1) & Glucógeno Sintasa activas vía PP1',
    glucoseClinicalNote: 'Absorción masiva intestinal; captación activa en hígado (GLUT2) y músculo/adipocito (GLUT4).',
    ffaClinicalNote: 'Lipólisis suprimida al 95% por insulina vía desfosforilación de la Lipasa Sensible a Hormonas (HSL).',
    ketonesClinicalNote: 'Cetogénesis apagada: Malonil-CoA bloquea alostéricamente la carnitina palmitoiltransferasa-1 (CPT-1).',
    generalClinicalNote: 'Predominio absoluto de la insulina. Anabolismo y almacenamiento de energía (glucogenogénesis y lipogénesis de novo).'
  },
  early_fasting: {
    id: 'early_fasting',
    shortName: 'Ayuno',
    fullName: 'Ayuno Temprano (4-16h)',
    timeframe: '4 - 16 horas post-ingesta',
    category: 'Fisiológica',
    glucose: 86,
    ffa: 0.52,
    ketones: 0.2,
    lactate: 0.9,
    glucoseRange: '80 - 90 mg/dL',
    ffaRange: '0.40 - 0.65 mM',
    ketonesRange: '0.10 - 0.30 mM',
    lactateRange: '0.7 - 1.2 mM',
    keyEnzyme: 'Glucógeno Fosforilasa activa vía Glucagón / PKA',
    glucoseClinicalNote: 'Euglucemia mantenida por glucogenólisis hepática (~50-60% tras una noche de ayuno) y gluconeogénesis creciente (~40-50%).',
    ffaClinicalNote: 'Desinhibición gradual de HSL adipocitaria por descenso de la ratio insulina/glucagón.',
    ketonesClinicalNote: 'Producción hepática basal incipiente; aún no significativa para el consumo energético cerebral.',
    generalClinicalNote: 'Transición post-absortiva: mantenimiento de glucemia basal para tejidos glucodependientes estrictos.'
  },
  late_fasting: {
    id: 'late_fasting',
    shortName: 'Ayuno Tardío',
    fullName: 'Ayuno Tardío (24-72h)',
    timeframe: '24 - 72 horas post-ingesta',
    category: 'Patológica',
    glucose: 70,
    ffa: 1.4,
    ketones: 1.5,
    lactate: 1.0,
    glucoseRange: '65 - 75 mg/dL',
    ffaRange: '1.2 - 1.6 mM',
    ketonesRange: '~0.3 mM (24 h) → 2 - 3 mM (72 h)',
    lactateRange: '0.8 - 1.3 mM',
    keyEnzyme: 'Fructosa-1,6-bisfosfatasa y CPT-1 hepáticas al máximo flujo',
    glucoseClinicalNote: 'Glucógeno hepático prácticamente agotado; casi toda la glucosa proviene de gluconeogénesis hepática y renal.',
    ffaClinicalNote: 'Lipólisis vigorosa; los AGL son el combustible prioritario del músculo esquelético y miocardio.',
    ketonesClinicalNote: 'Cetonemia fisiológica adaptativa; el cerebro comienza a captar y oxidar β-hidroxibutirato y acetoacetato.',
    generalClinicalNote: 'Viraje catabólico: lipólisis vigorosa y proteólisis muscular máxima para sostener la gluconeogénesis (el ahorro proteico llega con la ceto-adaptación cerebral).'
  },
  starvation: {
    id: 'starvation',
    shortName: 'Inanición Extrema',
    fullName: 'Inanición Extrema (>3d)',
    timeframe: '> 3 días a semanas de ayuno',
    category: 'Patológica',
    glucose: 64,
    ffa: 1.75,
    ketones: 7.2,
    lactate: 0.8,
    glucoseRange: '60 - 68 mg/dL',
    ffaRange: '1.5 - 2.0 mM',
    ketonesRange: '6.0 - 8.0 mM',
    lactateRange: '0.6 - 1.0 mM',
    keyEnzyme: 'HMG-CoA Sintasa mitocondrial a máxima capacidad de transcripción',
    glucoseClinicalNote: 'Meseta mínima constante (~64 mg/dL); el cerebro reduce su requerimiento de glucosa en un 70%.',
    ffaClinicalNote: 'Saturación de unión de albúmina sérica; combustible masivo de todos los tejidos con mitocondrias.',
    ketonesClinicalNote: 'Máxima cetosis fisiológica adaptativa (~7.2 mM); combustible primario del SNC sin generar acidosis clínica.',
    generalClinicalNote: 'Máxima adaptación evolutiva al ayuno prolongado: el cerebro obtiene ~2/3 de su energía de los cuerpos cetónicos.'
  },
  insulin_resistance: {
    id: 'insulin_resistance',
    shortName: 'Resistencia Insulina',
    fullName: 'Resistencia a la Insulina',
    timeframe: 'Estado crónico prediabético / Síndrome Metabólico',
    category: 'Patológica',
    glucose: 112,
    ffa: 1.05,
    ketones: 0.15,
    lactate: 1.3,
    glucoseRange: '100 - 125 mg/dL (ayunas)',
    ffaRange: '0.8 - 1.2 mM',
    ketonesRange: '< 0.2 mM (Normales)',
    lactateRange: '1.0 - 1.5 mM',
    keyEnzyme: 'Sustrato del Receptor de Insulina (IRS-1) bloqueado por fosforilación en serinas',
    glucoseClinicalNote: 'Defecto en translocación de GLUT4 e incapacidad para suprimir la gluconeogénesis hepática nocturna.',
    ffaClinicalNote: 'Lipotoxicidad: el tejido adiposo visceral inflamado vierte AGL al torrente portal sin freno insulínico.',
    ketonesClinicalNote: 'Sin cetosis: la hiperinsulinemia basal compensatoria basta para inhibir la CPT-1 hepática.',
    generalClinicalNote: 'Sobrecarga de nutrientes e inflamación subclínica: hiperinsulinemia reactiva con glucemia en rango de prediabetes.'
  },
  diabetes_t1_dka: {
    id: 'diabetes_t1_dka',
    shortName: 'CAD (Diabetes T1)',
    fullName: 'Cetoacidosis Diabética (CAD)',
    timeframe: 'Urgencia médica aguda (déficit total de insulina)',
    category: 'Patológica',
    glucose: 485,
    ffa: 2.85,
    ketones: 16.5,
    lactate: 2.4,
    glucoseRange: '350 - 650 mg/dL',
    ffaRange: '> 2.5 mM (Surge Masivo)',
    ketonesRange: '10 - 25 mM (Cetoacidosis)',
    lactateRange: '1.8 - 3.2 mM',
    keyEnzyme: 'HSL al 100% y CPT-1 desinhibida totalmente sin freno insulínico',
    glucoseClinicalNote: 'Déficit absoluto de insulina: hiperglucemia severa, glucosuria masiva, diuresis osmótica y deshidratación.',
    ffaClinicalNote: 'Lipólisis desenfrenada inundando el hígado de ácidos grasos que saturan la beta-oxidación.',
    ketonesClinicalNote: 'Cetoacidosis severa: acetoacetato y β-OHB saturan la capacidad tampón plasmática con brecha aniónica elevada y pH < 7.2.',
    generalClinicalNote: 'Emergencia metabólica mortal sin tratamiento: acidosis metabólica profunda por cetonas y deshidratación celular.'
  },
  exercise_moderate: {
    id: 'exercise_moderate',
    shortName: 'Ejercicio Moderado',
    fullName: 'Ejercicio Moderado (Aeróbico)',
    timeframe: '45-60 min esfuerzo continuo (50-65% VO2 máx)',
    category: 'Fisiológica',
    glucose: 88,
    ffa: 1.05,
    ketones: 0.35,
    lactate: 1.6,
    glucoseRange: '85 - 95 mg/dL',
    ffaRange: '0.8 - 1.2 mM',
    ketonesRange: '0.2 - 0.5 mM',
    lactateRange: '1.2 - 2.0 mM',
    keyEnzyme: 'Proteína Quinasa Activada por AMP (AMPK) muscular y ACC fosforilada',
    glucoseClinicalNote: 'Euglucemia exacta: la producción hepática de glucosa se empareja milimétricamente con la captación muscular mediada por AMPK.',
    ffaClinicalNote: 'Oxidación mitocondrial preferente de AGL en fibras musculares tipo I ricas en mioglobina.',
    ketonesClinicalNote: 'Concentración basal o leve elevación post-esfuerzo prolongado por rápido aclaramiento periférico.',
    generalClinicalNote: 'Equilibrio oxidativo aeróbico: consumo balanceado de glucosa y grasas con mínima producción de lactato.'
  },
  exercise_intense: {
    id: 'exercise_intense',
    shortName: 'Ejercicio Intenso',
    fullName: 'Ejercicio Alta Intensidad (Sprint)',
    timeframe: 'Esfuerzo supramáximo / anaeróbico (>85% VO2 máx)',
    category: 'Fisiológica',
    glucose: 128,
    ffa: 0.42,
    ketones: 0.12,
    lactate: 12.0,
    glucoseRange: '110 - 140 mg/dL',
    ffaRange: '0.3 - 0.5 mM',
    ketonesRange: '< 0.2 mM',
    lactateRange: '8.0 - 16.0 mM',
    keyEnzyme: 'Glucógeno Fosforilasa: forma b activada alostéricamente por AMP y paso a forma a por adrenalina y Ca2+',
    glucoseClinicalNote: 'Pico adrenérgico agudo: glucogenólisis hepática rápida que supera temporalmente la captación muscular periférica.',
    ffaClinicalNote: 'Vasoconstricción cutáneo-adiposa y acidosis por lactato inhiben temporalmente la salida de AGL del adipocito.',
    ketonesClinicalNote: 'Cetogénesis apagada: flujo glucolítico masivo hacia piruvato y lactato con alta disponibilidad de oxaloacetato.',
    generalClinicalNote: 'Metabolismo glucolítico anaeróbico rápido: acumulación de lactato como lanzadera energética celular.'
  }
};

export const ALL_STATES_ORDER: MetabolicStateId[] = [
  'postprandial',
  'early_fasting',
  'exercise_moderate',
  'exercise_intense',
  'late_fasting',
  'starvation',
  'insulin_resistance',
  'diabetes_t1_dka'
];

interface SubstrateComparisonChartsProps {
  /** Si se indica, el comparador se muestra dentro de esa situación (resaltada) */
  stateId?: MetabolicStateId;
  onSelectState?: (id: MetabolicStateId) => void;
}

export const SubstrateComparisonCharts: React.FC<SubstrateComparisonChartsProps> = ({ stateId, onSelectState }) => {
  const embedded = !!stateId;
  const [selectedSubstrate, setSelectedSubstrate] = useState<'glucose' | 'ffa' | 'ketones' | 'lactate'>('glucose');
  const [ownStateId, setOwnStateId] = useState<MetabolicStateId>('postprandial');
  const selectedStateId = stateId ?? ownStateId;
  const setSelectedStateId = (id: MetabolicStateId) => (onSelectState ? onSelectState(id) : setOwnStateId(id));

  // Chart data mapping across all 8 states
  // Dentro de una situación se comparan, por defecto, solo las de su mismo grupo
  const [showAllGroups, setShowAllGroups] = useState(false);
  const ownCategory = METABOLIC_SUBSTRATES_DATA[selectedStateId].category;
  const visibleStates = embedded && !showAllGroups
    ? ALL_STATES_ORDER.filter((k) => METABOLIC_SUBSTRATES_DATA[k].category === ownCategory)
    : ALL_STATES_ORDER;
  const otherGroupLabel = ownCategory === 'Fisiológica' ? 'patológicas' : 'fisiológicas';

  const chartData = visibleStates.map((stateKey) => {
    const item = METABOLIC_SUBSTRATES_DATA[stateKey];
    return {
      stateKey,
      shortName: item.shortName,
      fullName: item.fullName,
      category: item.category,
      glucose: item.glucose,
      ffa: item.ffa,
      ketones: item.ketones,
      lactate: item.lactate,
      glucoseRange: item.glucoseRange,
      ffaRange: item.ffaRange,
      ketonesRange: item.ketonesRange,
      glucoseClinicalNote: item.glucoseClinicalNote,
      ffaClinicalNote: item.ffaClinicalNote,
      ketonesClinicalNote: item.ketonesClinicalNote,
      generalClinicalNote: item.generalClinicalNote,
      isSelected: stateKey === selectedStateId
    };
  });

  const activeStateData = METABOLIC_SUBSTRATES_DATA[selectedStateId];

  // Helper color functions for bars
  const SUBSTRATE_COLORS = {
    glucose: { physio: '#34d399', patho: '#047857', selected: '#0f766e' },
    ffa: { physio: '#fbbf24', patho: '#b45309', selected: '#92400e' },
    ketones: { physio: '#fb7185', patho: '#be123c', selected: '#881337' },
    lactate: { physio: '#a5b4fc', patho: '#4338ca', selected: '#312e81' },
  } as const;
  const getBarColor = (category: string, isSelected: boolean) => {
    const c = SUBSTRATE_COLORS[selectedSubstrate];
    if (isSelected) return c.selected;
    return category === 'Patológica' ? c.patho : c.physio;
  };

  const activeState = METABOLIC_STATES[selectedStateId];

  return (
    <div className={embedded ? 'flex flex-col gap-6' : 'bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-6 shadow-xs'}>
      {/* Header & Substrate Filter */}
      <div className={`order-1 flex flex-col md:flex-row md:items-center justify-between gap-4 ${embedded ? '' : 'pb-4 border-b border-slate-100'}`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {embedded ? 'Sustratos en sangre: esta situación frente a las demás' : 'Espectro Metabólico (8 Estados)'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {embedded
                  ? 'La barra oscura es la situación en la que estás; pulsa otra barra o una fila de la tabla para cambiar de situación.'
                  : 'Concentraciones de los sustratos plasmáticos circulantes en las 8 situaciones.'}
              </p>
              {embedded && (
                <label className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer select-none">
                  <input type="checkbox" className="accent-teal-600" checked={showAllGroups} onChange={(e) => setShowAllGroups(e.target.checked)} />
                  Comparar también con las situaciones {otherGroupLabel}
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Substrate Selector Buttons */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0 gap-1">
          <button
            onClick={() => setSelectedSubstrate('glucose')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              selectedSubstrate === 'glucose'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Glucosa (mg/dL)</span>
          </button>
          <button
            onClick={() => setSelectedSubstrate('ffa')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              selectedSubstrate === 'ffa'
                ? 'bg-amber-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Ácidos Grasos Libres (mM)</span>
          </button>
          <button
            onClick={() => setSelectedSubstrate('ketones')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              selectedSubstrate === 'ketones'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Cuerpos Cetónicos (mM)</span>
          </button>
          <button
            onClick={() => setSelectedSubstrate('lactate')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              selectedSubstrate === 'lactate'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Lactato (mM)</span>
          </button>
        </div>
      </div>

      {/* Main Recharts BarChart */}
      <div className="order-3 bg-slate-50/70 rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                selectedSubstrate === 'glucose'
                  ? 'bg-emerald-500'
                  : selectedSubstrate === 'ffa'
                  ? 'bg-amber-500'
                  : selectedSubstrate === 'ketones'
                  ? 'bg-rose-500'
                  : 'bg-indigo-500'
              }`}
            />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {selectedSubstrate === 'glucose' && 'Glucosa Plasmática en Sangre (mg/dL)'}
              {selectedSubstrate === 'ffa' && 'Ácidos Grasos Libres en Sangre (mM)'}
              {selectedSubstrate === 'ketones' && 'Cuerpos Cetónicos Circulantes (mM)'}
              {selectedSubstrate === 'lactate' && 'Lactato en Sangre (mM)'}
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            {embedded ? 'Pulsa una barra para ir a esa situación' : 'Pulsa una barra o una fila de la tabla para ver el detalle'}
          </span>
        </div>

        <div className="h-72 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 35 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length) {
                  const clickedKey = e.activePayload[0].payload.stateKey as MetabolicStateId;
                  if (clickedKey) setSelectedStateId(clickedKey);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="shortName"
                interval={0}
                angle={-20}
                textAnchor="end"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                domain={[
                  0,
                  (dataMax: number) => {
                    if (selectedSubstrate === 'glucose') return Math.max(500, Math.ceil(dataMax * 1.1));
                    if (selectedSubstrate === 'ffa') return 3.2;
                    if (selectedSubstrate === 'lactate') return 14;
                    return Math.max(18, Math.ceil(dataMax * 1.1));
                  }
                ]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs shadow-2xl border border-slate-800 max-w-sm space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5">
                          <div>
                            <span className="font-bold text-teal-300 block text-sm">{d.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{d.category}</span>
                          </div>
                          <span className="bg-teal-900/60 text-teal-300 border border-teal-700/50 text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                            {d.shortName}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                          <div className={`p-1.5 rounded ${selectedSubstrate === 'glucose' ? 'bg-emerald-950/80 border border-emerald-500/40' : 'bg-slate-800/50'}`}>
                            <span className="text-[9px] text-emerald-400 block font-sans">Glucosa</span>
                            <span className="font-bold text-white">{d.glucose} mg/dL</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{d.glucoseRange}</span>
                          </div>
                          <div className={`p-1.5 rounded ${selectedSubstrate === 'ffa' ? 'bg-amber-950/80 border border-amber-500/40' : 'bg-slate-800/50'}`}>
                            <span className="text-[9px] text-amber-400 block font-sans">AGL</span>
                            <span className="font-bold text-white">{d.ffa} mM</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{d.ffaRange}</span>
                          </div>
                          <div className={`p-1.5 rounded ${selectedSubstrate === 'ketones' ? 'bg-rose-950/80 border border-rose-500/40' : 'bg-slate-800/50'}`}>
                            <span className="text-[9px] text-rose-400 block font-sans">Cetonas</span>
                            <span className="font-bold text-white">{d.ketones} mM</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">{d.ketonesRange}</span>
                          </div>
                        </div>
                        <div className="border-t border-slate-800 pt-2 text-[11px] text-slate-300 leading-snug">
                          <span className="text-teal-400 font-semibold block text-[10px] uppercase tracking-wide">
                            Mecanismo Bioquímico:
                          </span>
                          {selectedSubstrate === 'glucose' && d.glucoseClinicalNote}
                          {selectedSubstrate === 'ffa' && d.ffaClinicalNote}
                          {selectedSubstrate === 'ketones' && d.ketonesClinicalNote}
                          {selectedSubstrate === 'lactate' && `Lactato: ${d.lactate} mM`}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Reference Lines for clinical context */}
              {selectedSubstrate === 'glucose' && (
                <>
                  <ReferenceLine
                    y={99}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{ value: 'Normoglucemia Ayuno (99 mg/dL)', position: 'insideTopRight', fill: '#059669', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <ReferenceLine
                    y={140}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: 'Límite Postprandial Normal (140 mg/dL)', position: 'insideTopRight', fill: '#d97706', fontSize: 10, fontWeight: 'bold' }}
                  />
                </>
              )}

              {selectedSubstrate === 'ffa' && (
                <>
                  <ReferenceLine
                    y={0.3}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{ value: 'Basal Mínimo (0.3 mM)', position: 'insideTopRight', fill: '#059669', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <ReferenceLine
                    y={0.6}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: 'Límite Fisiológico Reposo (0.6 mM)', position: 'insideTopRight', fill: '#d97706', fontSize: 10, fontWeight: 'bold' }}
                  />
                </>
              )}

              {selectedSubstrate === 'lactate' && (
                <ReferenceLine
                  y={2}
                  stroke="#6366f1"
                  strokeDasharray="3 3"
                  label={{ value: 'Umbral anaeróbico (~2 mM)', position: 'insideTopRight', fill: '#4338ca', fontSize: 10, fontWeight: 'bold' }}
                />
              )}

              {selectedSubstrate === 'ketones' && (
                <>
                  <ReferenceLine
                    y={0.2}
                    stroke="#10b981"
                    strokeDasharray="3 3"
                    label={{ value: 'Límite Basal Postprandial (<0.2 mM)', position: 'insideTopRight', fill: '#059669', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <ReferenceLine
                    y={3.0}
                    stroke="#f59e0b"
                    strokeDasharray="3 3"
                    label={{ value: 'Cetosis Fisiológica Adaptativa (3.0 mM)', position: 'insideTopRight', fill: '#d97706', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <ReferenceLine
                    y={10.0}
                    stroke="#ef4444"
                    strokeDasharray="3 3"
                    label={{ value: 'Cetoacidosis Patológica CAD (>10 mM)', position: 'insideTopRight', fill: '#dc2626', fontSize: 10, fontWeight: 'bold' }}
                  />
                </>
              )}

              <Bar
                dataKey={selectedSubstrate}
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
                cursor="pointer"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarColor(entry.category, entry.isSelected)}
                    stroke={entry.isSelected ? '#0f172a' : 'transparent'}
                    strokeWidth={entry.isSelected ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SUBSTRATE_COLORS[selectedSubstrate].physio }} />
              <span>Situaciones fisiológicas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SUBSTRATE_COLORS[selectedSubstrate].patho }} />
              <span>Situaciones patológicas</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SUBSTRATE_COLORS[selectedSubstrate].selected }} />
              <span>Seleccionada: {activeStateData.shortName}</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">
            Valores cuantitativos de referencia clínica y bioquímica médica.
          </span>
        </div>
      </div>

      {/* Selected State Clinical & Biochemical Detail Card */}
      <div className={`${embedded ? 'order-2' : 'order-3'} bg-gradient-to-r from-teal-50/60 to-slate-50 border border-teal-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-200/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  activeStateData.category === 'Fisiológica'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {activeStateData.category}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {activeStateData.fullName}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono mt-0.5 block">
              {activeStateData.timeframe}
            </span>
          </div>
          <div className="bg-white/80 border border-teal-200 px-3 py-1.5 rounded-xl text-xs max-w-md">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Interruptor clave:</span>
            <span className="font-bold text-teal-900">{activeState.keyRegulatorySwitch.title}</span>
          </div>
        </div>

        {/* Substrate Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Glucosa Plasmática</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-900 font-mono">{activeStateData.glucose}</span>
              <span className="text-xs text-slate-500">mg/dL</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Rango: {activeStateData.glucoseRange}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-amber-700 font-bold uppercase block">Ácidos Grasos Libres</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-900 font-mono">{activeStateData.ffa}</span>
              <span className="text-xs text-slate-500">mM</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Rango: {activeStateData.ffaRange}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-rose-700 font-bold uppercase block">Cuerpos Cetónicos</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-900 font-mono">{activeStateData.ketones}</span>
              <span className="text-xs text-slate-500">mM</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Rango: {activeStateData.ketonesRange}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] text-indigo-700 font-bold uppercase block">Lactato Plasmático</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-900 font-mono">{activeStateData.lactate}</span>
              <span className="text-xs text-slate-500">mM</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Rango: {activeStateData.lactateRange}</span>
          </div>
        </div>

        {/* Clinical Rationale Explanation */}
        <div className="bg-white/90 p-3.5 rounded-xl border border-teal-100 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-teal-900 font-bold">
            <Info className="w-4 h-4 text-teal-700" />
            <span>Fisiopatología y Destino de Combustibles:</span>
          </div>
          {!embedded && (
            <p className="text-slate-700 leading-relaxed">
              {activeState.summary}
            </p>
          )}
          <p className="text-slate-600 leading-relaxed text-[11.5px]">
            <strong className="text-teal-900">Cómo se produce el cambio: </strong>{activeState.keyRegulatorySwitch.description}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-[11.5px] text-slate-700 list-disc pl-4">
            {activeState.hallmarkFeatures.map((h) => <li key={h}>{h}</li>)}
          </ul>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            <div>
              <strong className="text-emerald-800">Glucosa: </strong>
              <span className="text-slate-600">{activeStateData.glucoseClinicalNote}</span>
            </div>
            <div>
              <strong className="text-amber-800">Ácidos Grasos: </strong>
              <span className="text-slate-600">{activeStateData.ffaClinicalNote}</span>
            </div>
            <div>
              <strong className="text-rose-800">Cuerpos Cetónicos: </strong>
              <span className="text-slate-600">{activeStateData.ketonesClinicalNote}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Complete 8-State Comparison Table */}
      <div className="order-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          {embedded && !showAllGroups
            ? `Concentraciones plasmáticas en las situaciones ${ownCategory === 'Fisiológica' ? 'fisiológicas' : 'patológicas'}`
            : 'Matriz de Concentraciones Plasmáticas en los 8 Estados Metabólicos'}
        </h4>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <tr>
                <th className="py-2.5 px-3">Estado Metabólico</th>
                <th className="py-2.5 px-3">Categoría</th>
                <th className="py-2.5 px-3 text-emerald-800">Glucosa (mg/dL)</th>
                <th className="py-2.5 px-3 text-amber-800">AGL (mM)</th>
                <th className="py-2.5 px-3 text-rose-800">Cetonas (mM)</th>
                <th className="py-2.5 px-3 text-indigo-800">Lactato (mM)</th>
                <th className="py-2.5 px-3">Comportamiento Bioquímico Primario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleStates.map((stateKey) => {
                const item = METABOLIC_SUBSTRATES_DATA[stateKey];
                const isSelected = stateKey === selectedStateId;
                return (
                  <tr
                    key={stateKey}
                    onClick={() => setSelectedStateId(stateKey)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-teal-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-800 flex items-center gap-2">
                      {isSelected && <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />}
                      <span>{item.fullName}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-semibold ${
                          item.category === 'Fisiológica'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-900">
                      {item.glucose} <span className="text-[10px] font-normal text-slate-400">({item.glucoseRange})</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-900">
                      {item.ffa} <span className="text-[10px] font-normal text-slate-400">({item.ffaRange})</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-rose-900">
                      {item.ketones} <span className="text-[10px] font-normal text-slate-400">({item.ketonesRange})</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-900">
                      {item.lactate}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={item.generalClinicalNote}>
                      {item.generalClinicalNote}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
