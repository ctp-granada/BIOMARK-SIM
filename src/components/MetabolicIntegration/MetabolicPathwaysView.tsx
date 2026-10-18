import React, { useState } from 'react';
import { PATHWAY_MODELS } from './data/metabolicData';
import { DETAILED_ENZYMES, DETAILED_SUBSTRATES } from './data/pathwayDetailsData';
import { DetailedEnzyme, DetailedSubstrate, MetabolicStateId } from './types/metabolism';
import { BiochemicalInspectorModal } from './BiochemicalInspectorModal';
import { Dna, Atom, ArrowRight } from 'lucide-react';

// ---------------------------------------------------------------------------
// Situaciones: cada una fija de forma coherente todos los interruptores
// ---------------------------------------------------------------------------
type SituationId = MetabolicStateId;
type Tone = 'ana' | 'cat' | 'neutral' | 'patho';
interface Reg { value: string; note: string; tone: Tone; }

const SITUATIONS: Record<SituationId, { label: string; hormones: Reg; f26bp: Reg; malonyl: Reg; ampk: Reg }> = {
  postprandial: {
    label: 'Postprandial',
    hormones: { value: 'Insulina ≫ glucagón', note: 'Fosfatasas activas: enzimas clave desfosforiladas', tone: 'ana' },
    f26bp: { value: 'Alta', note: 'PFK-1 activa · FBPasa-1 inhibida', tone: 'ana' },
    malonyl: { value: 'Alto', note: 'CPT-1 cerrada: no entran ácidos grasos a la mitocondria', tone: 'ana' },
    ampk: { value: 'Inactiva', note: 'Carga energética alta', tone: 'neutral' },
  },
  early_fasting: {
    label: 'Ayuno nocturno',
    hormones: { value: 'Glucagón > insulina', note: 'AMPc / PKA: enzimas clave fosforiladas', tone: 'cat' },
    f26bp: { value: 'Baja', note: 'PFK-1 frenada · FBPasa-1 activa', tone: 'cat' },
    malonyl: { value: 'Bajo', note: 'CPT-1 abierta: β-oxidación activa', tone: 'cat' },
    ampk: { value: 'Moderada', note: 'Favorece la oxidación de grasas', tone: 'neutral' },
  },
  exercise_moderate: {
    label: 'Ejercicio moderado',
    hormones: { value: 'Adrenalina ↑ · insulina ↓ (α2)', note: 'Glucagón algo elevado: el hígado exporta glucosa', tone: 'cat' },
    f26bp: { value: 'Baja en hígado', note: 'El hígado exporta glucosa; el músculo usa la suya', tone: 'cat' },
    malonyl: { value: 'Bajo (músculo)', note: 'AMPK fosforila ACC2 → CPT-1 abierta', tone: 'cat' },
    ampk: { value: 'Activa', note: 'GLUT4 a la membrana sin insulina', tone: 'cat' },
  },
  exercise_intense: {
    label: 'Ejercicio intenso',
    hormones: { value: 'Catecolaminas muy altas · insulina ↓', note: 'Glucogenólisis muscular y hepática máximas', tone: 'cat' },
    f26bp: { value: 'Baja en hígado', note: 'En el músculo, AMP, Pi y Ca2+ activan directamente la PFK-1 y la fosforilasa', tone: 'cat' },
    malonyl: { value: 'Bajo (músculo)', note: 'Aun así la β-oxidación es demasiado lenta para la demanda', tone: 'neutral' },
    ampk: { value: 'Muy activa', note: 'Cociente AMP/ATP alto: captación de glucosa y glucólisis máximas', tone: 'cat' },
  },
  late_fasting: {
    label: 'Ayuno tardío',
    hormones: { value: 'Insulina mínima · glucagón y cortisol altos', note: 'Inducción génica de PEPCK y G6Pasa', tone: 'cat' },
    f26bp: { value: 'Muy baja', note: 'Gluconeogénesis máxima', tone: 'cat' },
    malonyl: { value: 'Muy bajo', note: 'CPT-1 abierta al máximo → cetogénesis', tone: 'cat' },
    ampk: { value: 'Alta', note: 'Frena la síntesis de lípidos y proteínas', tone: 'cat' },
  },
  starvation: {
    label: 'Inanición extrema',
    hormones: { value: 'Insulina mínima · glucagón por debajo del pico del día 3', note: 'T3 baja: menor gasto energético', tone: 'cat' },
    f26bp: { value: 'Muy baja', note: 'Gluconeogénesis sostenida pero menor; el riñón aporta una parte creciente', tone: 'cat' },
    malonyl: { value: 'Muy bajo', note: 'CPT-1 abierta: cetogénesis máxima', tone: 'cat' },
    ampk: { value: 'Alta', note: 'Ahorro de ATP: síntesis de lípidos y proteínas frenadas', tone: 'cat' },
  },
  insulin_resistance: {
    label: 'Resistencia a la insulina',
    hormones: { value: 'Hiperinsulinemia · glucagón poco suprimido', note: 'Resistencia selectiva: falla la vía PI3K/Akt de la glucosa, no la lipogénica (SREBP-1c)', tone: 'patho' },
    f26bp: { value: 'Insuficiente en hígado', note: 'La gluconeogénesis no se frena pese a la insulina alta', tone: 'patho' },
    malonyl: { value: 'Alto en hígado', note: 'Lipogénesis de novo aumentada → esteatosis (MASLD)', tone: 'patho' },
    ampk: { value: 'Baja', note: 'Exceso de nutrientes e inactividad física', tone: 'neutral' },
  },
  diabetes_t1_dka: {
    label: 'Cetoacidosis diabética',
    hormones: { value: 'Insulina ausente · glucagón, cortisol y catecolaminas muy altos', note: 'PKA sin oposición: todas las enzimas clave fosforiladas', tone: 'patho' },
    f26bp: { value: 'Muy baja', note: 'Gluconeogénesis y glucogenólisis sin freno → hiperglucemia', tone: 'patho' },
    malonyl: { value: 'Prácticamente nulo', note: 'CPT-1 abierta sin límite → cetogénesis descontrolada', tone: 'patho' },
    ampk: { value: 'Secundaria', note: 'No es el determinante: domina la falta de insulina', tone: 'neutral' },
  },
};

// ---------------------------------------------------------------------------
// Estado de cada ruta según la situación
//  side: 'A' = primera enzima del par (síntesis/glucólisis), 'B' = segunda (degradación/gluconeogénesis)
// ---------------------------------------------------------------------------
type Status = 'on' | 'partial' | 'off';
interface PathwayState { status: Status; direction: string; why: string; side?: 'A' | 'B'; }

const PATHWAY_STATES: Record<string, Record<SituationId, PathwayState>> = {
  glycolysis_gluconeogenesis: {
    postprandial: { status: 'on', side: 'A', direction: 'Glucólisis hepática', why: 'La insulina desfosforila la PFK-2: sube la F-2,6-BP, se activa la PFK-1 y se inhibe la FBPasa-1.' },
    early_fasting: { status: 'on', side: 'B', direction: 'Gluconeogénesis creciente', why: 'El glucagón fosforila la PFK-2/FBPasa-2: cae la F-2,6-BP y se libera la FBPasa-1; la piruvato quinasa L queda inactiva.' },
    exercise_moderate: { status: 'on', side: 'B', direction: 'El hígado exporta glucosa', why: 'Glucogenólisis y gluconeogénesis hepáticas igualan el consumo muscular; el músculo, en cambio, acelera su propia glucólisis.' },
    exercise_intense: { status: 'on', side: 'A', direction: 'Glucólisis anaerobia muscular máxima', why: 'AMP, Pi y Ca2+ activan la PFK-1 muscular; la LDH regenera el NAD+ y el lactato sube hasta 10-15 mM. El hígado, mientras, exporta glucosa.' },
    late_fasting: { status: 'on', side: 'B', direction: 'Gluconeogénesis máxima', why: 'Glucagón y cortisol inducen PEPCK y glucosa-6-fosfatasa; el acetil-CoA de la β-oxidación activa la piruvato carboxilasa.' },
    starvation: { status: 'on', side: 'B', direction: 'Gluconeogénesis reducida pero sostenida', why: 'El cerebro usa cuerpos cetónicos y necesita menos glucosa; glicerol y lactato ganan peso frente a los aminoácidos y el riñón (glutamina) aporta una fracción creciente.' },
    insulin_resistance: { status: 'partial', side: 'B', direction: 'Gluconeogénesis no suprimida', why: 'Akt no fosforila FOXO1 y siguen transcribiéndose PEPCK y G6Pasa; llegan además AGL y glicerol en exceso. Resultado: glucemia basal de 100-125 mg/dL.' },
    diabetes_t1_dka: { status: 'on', side: 'B', direction: 'Gluconeogénesis desbocada', why: 'Sin insulina, glucagón y cortisol inducen PEPCK y G6Pasa; aminoácidos y glicerol alimentan la ruta. Sin captación por GLUT4, la glucosa se acumula (> 250 mg/dL).' },
  },
  glycogen_metabolism: {
    postprandial: { status: 'on', side: 'A', direction: 'Síntesis de glucógeno', why: 'Insulina: PP1 activa e inhibición de GSK-3 → glucógeno sintasa desfosforilada (forma a); fosforilasa inactiva.' },
    early_fasting: { status: 'on', side: 'B', direction: 'Glucogenólisis hepática', why: 'Glucagón → PKA → fosforilasa quinasa → fosforilasa a; la glucógeno sintasa pasa a la forma b.' },
    exercise_moderate: { status: 'on', side: 'B', direction: 'Glucogenólisis muscular y hepática', why: 'En el músculo, Ca2+ y AMP activan la fosforilasa sin hormonas; la adrenalina refuerza la glucogenólisis en músculo e hígado. El glucógeno muscular se consume de forma progresiva.' },
    exercise_intense: { status: 'on', side: 'B', direction: 'Glucogenólisis muscular masiva', why: 'Ca2+ y adrenalina activan la fosforilasa quinasa y el AMP activa la fosforilasa b. Cada residuo de glucógeno rinde 3 ATP por vía anaerobia.' },
    late_fasting: { status: 'off', side: 'B', direction: 'Glucógeno hepático agotado', why: 'Hacia las 24-36 h el glucógeno hepático se ha consumido; la glucemia depende de la gluconeogénesis.' },
    starvation: { status: 'off', side: 'B', direction: 'Glucógeno agotado', why: 'Sin aporte de glúcidos no se repone el glucógeno hepático; el muscular apenas se usa en reposo.' },
    insulin_resistance: { status: 'partial', side: 'A', direction: 'Síntesis de glucógeno reducida', why: 'En el músculo hay menos GLUT4 en la membrana y menos activación de la glucógeno sintasa: la glucosa de la comida se almacena peor.' },
    diabetes_t1_dka: { status: 'on', side: 'B', direction: 'Glucogenólisis sin freno', why: 'La fosforilasa permanece fosforilada; el glucógeno hepático se vacía y contribuye a la hiperglucemia inicial.' },
  },
  lipid_oxidation_lipogenesis: {
    postprandial: { status: 'on', side: 'A', direction: 'Lipogénesis de novo', why: 'Citrato e insulina activan la ACC: el malonil-CoA alimenta la síntesis de ácidos grasos y bloquea la CPT-1.' },
    early_fasting: { status: 'on', side: 'B', direction: 'β-oxidación', why: 'La ACC fosforilada (PKA y AMPK) deja de producir malonil-CoA: la CPT-1 se abre y los ácidos grasos entran en la mitocondria.' },
    exercise_moderate: { status: 'on', side: 'B', direction: 'β-oxidación muscular (~50-60 % de la energía)', why: 'La AMPK fosforila la ACC2 muscular, cae el malonil-CoA y la CPT-1 muscular se abre. La lipólisis adipocitaria aporta los AGL.' },
    exercise_intense: { status: 'partial', side: 'B', direction: 'β-oxidación limitada', why: 'Aunque el malonil-CoA esté bajo, la oxidación de ácidos grasos es demasiado lenta para la demanda; el acetil-CoA procedente de la glucólisis secuestra la carnitina libre y frena la entrada de AG.' },
    late_fasting: { status: 'on', side: 'B', direction: 'β-oxidación masiva', why: 'El flujo de AGL desde el tejido adiposo satura la β-oxidación hepática y genera exceso de acetil-CoA.' },
    starvation: { status: 'on', side: 'B', direction: 'β-oxidación como fuente principal', why: 'Los AGL del tejido adiposo cubren la mayor parte del gasto; el músculo en reposo oxida casi solo AGL.' },
    insulin_resistance: { status: 'on', side: 'A', direction: 'Lipogénesis de novo aumentada', why: 'La rama SREBP-1c sigue respondiendo a la hiperinsulinemia; junto a la llegada de AGL, el hígado acumula triacilgliceroles (MASLD) y exporta más VLDL.' },
    diabetes_t1_dka: { status: 'on', side: 'B', direction: 'Lipólisis y β-oxidación masivas', why: 'La HSL sin inhibición libera AGL en exceso; la ACC inactiva deja la CPT-1 abierta sin límite.' },
  },
  ketogenesis_ketolysis: {
    postprandial: { status: 'off', direction: 'Cetogénesis apagada', why: 'Con malonil-CoA alto la CPT-1 está cerrada y no llega acetil-CoA de la β-oxidación.' },
    early_fasting: { status: 'partial', direction: 'Cetogénesis basal', why: 'La β-oxidación empieza a aportar acetil-CoA; los cuerpos cetónicos aún no superan ~0,3 mM.' },
    exercise_moderate: { status: 'partial', direction: 'Cetogénesis baja', why: 'Solo aumenta en el ejercicio muy prolongado; los músculos activos oxidan cuerpos cetónicos.' },
    exercise_intense: { status: 'off', direction: 'Cetogénesis prácticamente nula', why: 'El esfuerzo es breve: el hígado prioriza exportar glucosa y no da tiempo a acumular cuerpos cetónicos.' },
    late_fasting: { status: 'on', direction: 'Cetogénesis intensa', why: 'El oxalacetato se desvía a la gluconeogénesis y el acetil-CoA sobrante se condensa en la mHMG-CoA sintasa (inducida).' },
    starvation: { status: 'on', direction: 'Cetogénesis máxima (6-8 mM)', why: 'El cerebro capta cuerpos cetónicos (MCT1) y obtiene de ellos ~60-70 % de su energía; la cetonemia es alta pero el pH se mantiene.' },
    insulin_resistance: { status: 'off', direction: 'Cetogénesis frenada', why: 'La insulina, aunque con menos efecto, mantiene el malonil-CoA hepático alto: los cuerpos cetónicos siguen bajos (< 0,2 mM).' },
    diabetes_t1_dka: { status: 'on', direction: 'Cetogénesis descontrolada (> 10 mM)', why: 'La producción supera la utilización periférica: acetoacetato y β-hidroxibutirato consumen el bicarbonato → acidosis metabólica con anión gap elevado.' },
  },
  cori_and_cahill_cycles: {
    postprandial: { status: 'partial', direction: 'Ciclos poco activos', why: 'Sobra glucosa exógena; los eritrocitos siguen produciendo lactato, pero el hígado lo usa poco para fabricar glucosa.' },
    early_fasting: { status: 'on', direction: 'Cori y glucosa-alanina activos', why: 'El lactato (eritrocitos, músculo) y la alanina muscular alimentan la gluconeogénesis hepática.' },
    exercise_moderate: { status: 'partial', direction: 'Lactato bajo (~1-2 mM)', why: 'El lactato que se forma se oxida sobre todo en las fibras lentas y el corazón; el ciclo glucosa-alanina aporta algo de sustrato al hígado.' },
    exercise_intense: { status: 'on', direction: 'Ciclo de Cori acelerado', why: 'El músculo glucolítico vierte lactato: una parte se oxida en corazón y fibras lentas y otra vuelve a glucosa en el hígado (con un coste de 6 ATP por glucosa).' },
    late_fasting: { status: 'on', direction: 'Alanina máxima a los 2-3 días', why: 'La proteólisis muscular inducida por cortisol exporta alanina y glutamina; con la ceto-adaptación cerebral irá disminuyendo.' },
    starvation: { status: 'partial', direction: 'Alanina reducida: ahorro proteico', why: 'Al caer la demanda cerebral de glucosa, los cuerpos cetónicos frenan la proteólisis y la excreción de nitrógeno baja a ~3-5 g/día; el ciclo de Cori persiste (eritrocitos).' },
    insulin_resistance: { status: 'partial', direction: 'Ciclos poco alterados', why: 'Lactato y alanina contribuyen a una gluconeogénesis basal algo aumentada.' },
    diabetes_t1_dka: { status: 'on', direction: 'Proteólisis y alanina aumentadas', why: 'Sin insulina predomina la proteólisis muscular: alanina y glutamina alimentan la gluconeogénesis; el ciclo de Cori se mantiene.' },
  },
};

// La nota de relevancia clínica (patología) solo se muestra en las situaciones patológicas
const PATHOLOGICAL: SituationId[] = ['late_fasting', 'starvation', 'insulin_resistance', 'diabetes_t1_dka'];

// Enzimas y sustratos con ficha detallada para cada ruta
const PATHWAY_ITEMS: Record<string, { enzymes: string[]; substrates: string[] }> = {
  glycolysis_gluconeogenesis: { enzymes: ['glucoquinasa', 'pfk1', 'fbpase1', 'piruvato_quinasa', 'pepck', 'pdh'], substrates: ['glucosa', 'g6p', 'f26bp', 'piruvato', 'oxaloacetato'] },
  glycogen_metabolism: { enzymes: ['glucogeno_sintasa', 'glucogeno_fosforilasa', 'glucoquinasa'], substrates: ['glucosa', 'g6p'] },
  lipid_oxidation_lipogenesis: { enzymes: ['acc', 'cpt1', 'hsl'], substrates: ['citrato', 'acetil_coa', 'malonil_coa'] },
  ketogenesis_ketolysis: { enzymes: ['hmgcs_mitocondrial', 'cpt1'], substrates: ['acetil_coa', 'oxaloacetato', 'beta_hidroxibutirato'] },
  cori_and_cahill_cycles: { enzymes: ['pepck', 'pdh', 'piruvato_quinasa'], substrates: ['lactato', 'piruvato', 'glucosa'] },
};

const STATUS_STYLE: Record<Status, { label: string; pill: string; dot: string }> = {
  on: { label: 'Activa', pill: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' },
  partial: { label: 'Parcial', pill: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  off: { label: 'Apagada', pill: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
};

const TONE: Record<Tone, string> = {
  ana: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
  cat: 'border-amber-200 bg-amber-50/60 text-amber-900',
  neutral: 'border-slate-200 bg-slate-50 text-slate-800',
  patho: 'border-rose-200 bg-rose-50/60 text-rose-900',
};

export const MetabolicPathwaysView: React.FC<{ stateId: MetabolicStateId }> = ({ stateId }) => {
  const situation: SituationId = stateId;
  const [pathwayKey, setPathwayKey] = useState<string>('glycolysis_gluconeogenesis');
  const [inspected, setInspected] = useState<
    { type: 'enzyme'; data: DetailedEnzyme } | { type: 'substrate'; data: DetailedSubstrate } | null
  >(null);

  const sit = SITUATIONS[situation];
  const pathway = PATHWAY_MODELS[pathwayKey];
  const pState = PATHWAY_STATES[pathwayKey][situation];
  const items = PATHWAY_ITEMS[pathwayKey];

  const openItem = (type: 'enzyme' | 'substrate', id: string) => {
    if (type === 'enzyme' && DETAILED_ENZYMES[id]) setInspected({ type: 'enzyme', data: DETAILED_ENZYMES[id] });
    if (type === 'substrate' && DETAILED_SUBSTRATES[id]) setInspected({ type: 'substrate', data: DETAILED_SUBSTRATES[id] });
  };

  const regulators = [
    { title: 'Insulina / glucagón', ...sit.hormones },
    { title: 'Fructosa-2,6-bisfosfato', ...sit.f26bp },
    { title: 'Malonil-CoA', ...sit.malonyl },
    { title: 'AMPK', ...sit.ampk },
  ];

  return (
    <div className="space-y-5">
      <p className="text-xs text-slate-500">
        Los interruptores reguladores de esta situación y cómo encienden o apagan cada ruta. Pulsa una ruta para ver sus pasos regulados, y una enzima o un sustrato para ver su ficha.
      </p>

      {/* 2. Interruptores */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Interruptores reguladores</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {regulators.map((r) => (
            <div key={r.title} className={`p-3 rounded-xl border ${TONE[r.tone]}`}>
              <span className="text-[10.5px] font-semibold opacity-80 block">{r.title}</span>
              <span key={situation + r.title} className="metabolix-fade block text-sm font-extrabold mt-0.5">{r.value}</span>
              <span className="text-[11px] opacity-90 block mt-0.5 leading-snug">{r.note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Rutas */}
      <div>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Rutas</span>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] gap-4">
          {/* Lista de rutas */}
          <div className="flex flex-col gap-2">
            {Object.keys(PATHWAY_MODELS).map((key) => {
              const st = PATHWAY_STATES[key][situation];
              const s = STATUS_STYLE[st.status];
              const active = key === pathwayKey;
              return (
                <button
                  key={key}
                  onClick={() => setPathwayKey(key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/20' : 'bg-white border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-snug">{PATHWAY_MODELS[key].name}</span>
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${s.pill}`}>{s.label}</span>
                  </div>
                  <span className="text-[11px] text-slate-600 block mt-1 flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                    {st.direction}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detalle de la ruta */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-4 min-w-0">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">{pathway.name}</h3>
                <span className="text-[10.5px] text-slate-500 font-medium">{pathway.organ}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{pathway.description}</p>
            </div>

            <div key={situation + pathwayKey} className={`metabolix-fade p-3 rounded-xl border ${STATUS_STYLE[pState.status].pill}`}>
              <span className="text-[10.5px] font-bold uppercase tracking-wider block">En {sit.label.toLowerCase()}</span>
              <span className="text-sm font-extrabold block mt-0.5">{pState.direction}</span>
              <span className="text-[11.5px] block mt-1 leading-snug">{pState.why}</span>
            </div>

            <div className="text-[11.5px] text-slate-700">
              <span className="font-bold text-slate-900">Interruptor maestro: </span>{pathway.masterSwitch}
            </div>

            {/* Reacciones */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pasos regulados</span>
              {pathway.reactions.map((rx) => {
                const pair = rx.enzyme.split(' vs ');
                return (
                  <div key={rx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11.5px] space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 font-semibold text-slate-800">
                      <span>{rx.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rx.to}</span>
                      {rx.isRateLimiting && <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">Paso limitante</span>}
                    </div>
                    {pair.length === 2 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {pair.map((enz, i) => {
                          const on = pState.status !== 'off' && (pState.side ? (i === 0 && pState.side === 'A') || (i === 1 && pState.side === 'B') : true);
                          return (
                            <span key={enz} className={`px-2 py-1 rounded-lg border font-semibold ${on ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-400 line-through decoration-slate-300'}`}>
                              {on ? '● ' : ''}{enz}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className={`inline-block px-2 py-1 rounded-lg border font-semibold ${STATUS_STYLE[pState.status].pill}`}>{rx.enzyme}</span>
                    )}
                    <p className="text-slate-600 leading-snug">{rx.regulationNote}</p>
                    {rx.coenzymes && <p className="text-[10.5px] text-slate-500 font-mono">{rx.coenzymes}</p>}
                  </div>
                );
              })}
            </div>

            {/* Fichas de enzimas y sustratos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Dna className="w-3.5 h-3.5 text-teal-700" /> Enzimas</span>
                <div className="flex flex-wrap gap-1.5">
                  {items.enzymes.map((id) => (
                    <button key={id} onClick={() => openItem('enzyme', id)} className="px-2.5 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-900 text-[11px] font-semibold hover:bg-teal-100 cursor-pointer">
                      {DETAILED_ENZYMES[id]?.abbreviation || id}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><Atom className="w-3.5 h-3.5 text-teal-700" /> Sustratos y reguladores</span>
                <div className="flex flex-wrap gap-1.5">
                  {items.substrates.map((id) => (
                    <button key={id} onClick={() => openItem('substrate', id)} className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 text-[11px] font-semibold hover:border-teal-300 cursor-pointer">
                      {DETAILED_SUBSTRATES[id]?.name || id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {PATHOLOGICAL.includes(situation) && (
              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-[11.5px] text-rose-900">
                <span className="font-bold">Relevancia clínica: </span>{pathway.clinicalRelevance}
              </div>
            )}
          </div>
        </div>
      </div>

      <BiochemicalInspectorModal item={inspected} onClose={() => setInspected(null)} onSelectRelatedItem={openItem} />
    </div>
  );
};
