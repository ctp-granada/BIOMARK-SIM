import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  RotateCcw, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Baby, 
  User, 
  FlaskConical, 
  Eye,
  Info
} from 'lucide-react';

interface PresetCase {
  name: string;
  bt: number;
  bd: number;
  ast: number;
  alt: number;
  alp: number;
  ggt: number;
  alb: number;
  inr: number;
}

const PRESETS: Record<'adult' | 'neonatal', PresetCase[]> = {
  adult: [
    { name: "Normalidad Fisiológica", bt: 0.8, bd: 0.2, ast: 25, alt: 20, alp: 80, ggt: 25, alb: 4.2, inr: 1.0 },
    { name: "S. Gilbert (Benigno Indirecto)", bt: 2.8, bd: 0.2, ast: 25, alt: 20, alp: 75, ggt: 20, alb: 4.3, inr: 1.0 },
    { name: "Anemia Hemolítica (Prehepática)", bt: 5.5, bd: 0.4, ast: 45, alt: 35, alp: 90, ggt: 30, alb: 4.0, inr: 1.0 },
    { name: "Hepatitis Viral Aguda (Hepática)", bt: 12.0, bd: 6.5, ast: 1250, alt: 1450, alp: 180, ggt: 110, alb: 3.8, inr: 1.1 },
    { name: "Falla Hepática Fulminante", bt: 18.0, bd: 9.0, ast: 1850, alt: 2100, alp: 190, ggt: 130, alb: 2.4, inr: 3.2 },
    { name: "Coledocolitiasis (Obstrucción Biliar)", bt: 14.5, bd: 11.2, ast: 120, alt: 95, alp: 480, ggt: 320, alb: 4.1, inr: 1.1 },
    { name: "Cáncer de Páncreas (Colestasis Maligna)", bt: 22.0, bd: 17.5, ast: 140, alt: 110, alp: 620, ggt: 480, alb: 3.1, inr: 1.4 },
    { name: "Síndrome Dubin-Johnson / Rotor", bt: 4.2, bd: 3.1, ast: 25, alt: 22, alp: 85, ggt: 25, alb: 4.1, inr: 1.0 }
  ],
  neonatal: [
    { name: "Fisiológica Neonatal (Normal)", bt: 6.0, bd: 0.3, ast: 30, alt: 25, alp: 120, ggt: 40, alb: 3.5, inr: 1.0 },
    { name: "Hemólisis por Incompatibilidad (Rh/ABO)", bt: 16.5, bd: 0.5, ast: 60, alt: 45, alp: 140, ggt: 45, alb: 3.2, inr: 1.1 },
    { name: "Hiperbilirrubinemia Crítica (Kernícterus)", bt: 24.5, bd: 0.8, ast: 70, alt: 50, alp: 150, ggt: 50, alb: 3.0, inr: 1.1 },
    { name: "Atresia de Vías Biliares (Colestasis neonatal)", bt: 12.5, bd: 8.2, ast: 180, alt: 160, alp: 550, ggt: 290, alb: 3.2, inr: 1.2 }
  ]
};

export const JaundiceSimulatorLab: React.FC = () => {
  const [profile, setProfile] = useState<'adult' | 'neonatal'>('adult');

  // Sliders State
  const [bt, setBt] = useState<number>(0.8);
  const [bd, setBd] = useState<number>(0.2);
  const [ast, setAst] = useState<number>(25);
  const [alt, setAlt] = useState<number>(20);
  const [alp, setAlp] = useState<number>(80);
  const [ggt, setGgt] = useState<number>(25);
  const [alb, setAlb] = useState<number>(4.2);
  const [inr, setInr] = useState<number>(1.0);

  // Neonatal BIND score
  const [bindMental, setBindMental] = useState<number>(0);
  const [bindTone, setBindTone] = useState<number>(0);
  const [bindCry, setBindCry] = useState<number>(0);

  const applyPreset = (preset: PresetCase) => {
    setBt(preset.bt);
    setBd(preset.bd);
    setAst(preset.ast);
    setAlt(preset.alt);
    setAlp(preset.alp);
    setGgt(preset.ggt);
    setAlb(preset.alb);
    setInr(preset.inr);
    setBindMental(0);
    setBindTone(0);
    setBindCry(0);
  };

  const handleBtChange = (val: number) => {
    setBt(val);
    if (bd > val) {
      setBd(val);
    }
  };

  const handleBdChange = (val: number) => {
    if (val > bt) {
      setBt(val);
    }
    setBd(val);
  };

  const resetValues = () => {
    applyPreset(PRESETS[profile][0]);
  };

  // Derived Calculations
  const bi = Math.max(0, Number((bt - bd).toFixed(1)));
  const ratioBD = bt > 0 ? (bd / bt) * 100 : 0;
  const ratioBI = Math.max(0, 100 - ratioBD);

  // Diagnosis logic
  const diagnosis = useMemo(() => {
    let emoji = '✅';
    let title = 'Metabolismo Normal de la Bilirrubina';
    let desc = 'Los parámetros se encuentran dentro de los rangos fisiológicos normales de un paciente adulto sano.';
    let perla = 'La bilirrubina sérica normal en un adulto es <1.2 mg/dL. La ictericia es clínicamente evidente en escleróticas a partir de 2.0-2.5 mg/dL debido a la elevada afinidad de la bilirrubina por la elastina.';
    let urineColorClass = 'bg-amber-200/80';
    let urineHeight = '30%';
    let urineText = 'Pajizo / Fisiológico';
    let stoolEmoji = '💩';
    let stoolText = 'Marrón Fisiológico';
    let stripBil = 'Negativo';
    let stripUro = 'Normal (0.1 - 1.0 mg/dL)';

    if (bt <= 1.2) {
      emoji = '✅';
      title = profile === 'adult' ? 'Metabolismo Fisiológico Normal' : 'Bilirrubina Neonatal Normal';
      desc = 'Parámetros bioquímicos y de excreción dentro de la normalidad fisiológica.';
    } else {
      emoji = '🟡';
      if (ratioBD < 20) {
        // Prehepatic / Indirect predominant
        if (alt <= 80 && ast <= 80 && alp <= 150) {
          if (bt < 4.0 && profile === 'adult') {
            title = 'Síndrome de Gilbert Presuntivo';
            desc = 'Hiperbilirrubinemia indirecta leve y aislada. Trastorno autosómico recesivo caracterizado por reducción (~30-50%) de la actividad enzimática de la UGT1A1. Es benigno y no progresivo.';
            perla = 'En el Síndrome de Gilbert no existe anemia hemolítica ni reticulocitosis. Las transaminasas y fosfatasa alcalina normales descartan citolisis y colestasis. La ictericia se exacerba típicamente ante el ayuno, estrés físico o infecciones.';
          } else if (bt >= 5.0 && profile === 'adult') {
            title = 'Síndrome de Crigler-Najjar (Tipo I / II)';
            desc = 'Déficit severo o nulo de la glucuronosiltransferasa (UGT1A1). El tipo I carece por completo de actividad enzimática con riesgo inminente de encefalopatía, mientras que el tipo II responde parcialmente a fenobarbital.';
            perla = 'El tipo I requiere fototerapia prolongada diaria de por vida o trasplante hepático ortotópico definitivo para prevenir la muerte por daño neurotóxico irreversible.';
          } else {
            title = 'Ictericia Prehepática (Hemólisis Intensa)';
            desc = 'Producción masiva de bilirrubina no conjugada que desborda la capacidad de conjugación del hepatocito (anemias hemolíticas inmunes, hemoglobinopatías, esferocitosis).';
            perla = 'Al ser lipófila y transportarse fuertemente unida a albúmina, la bilirrubina no conjugada NO filtra por el glomérulo renal. Por tanto, la tira de orina es NEGATIVA para bilirrubina, pero el urobilinógeno urinario está intensamente elevado por la sobrecarga enterohepática.';
          }
        } else {
          title = 'Ictericia Prehepática con Estrés Hepático';
          desc = 'La elevación indirecta coexiste con aumentos leves o moderados de transaminasas por hipoxia o congestión pasiva.';
        }

        urineColorClass = 'bg-yellow-400';
        urineHeight = '50%';
        urineText = 'Amarillo Intenso (Hiperurobilinuria)';
        stoolEmoji = '💩';
        stoolText = 'Pleiocromía Fecal (Marrón Muy Oscuro)';
        stripBil = 'Negativo';
        stripUro = 'ELEVADO (> 3.0 mg/dL)';
      } else if (ratioBD >= 20 && (alt > 150 || ast > 150)) {
        // Hepatic / Hepatocellular damage
        emoji = '🟠';
        title = 'Ictericia Hepática (Lesión Hepatocelular Aguda)';
        desc = 'La citolisis hepática compromete todas las fases del metabolismo de la bilirrubina (captación, conjugación y transporte canalicular). Se observa típicamente en hepatitis víricas agudas, tóxicos o hepatitis autoinmune.';
        perla = 'Niveles de transaminasas >1000 U/L indican necrosis celular masiva (isquemia, fármacos como paracetamol, hepatitis viral). Una relación AST/ALT > 2 es muy orientativa de hepatopatía alcohólica.';

        if (inr >= 1.5 && alb < 3.0) {
          emoji = '🚨';
          title = 'Falla Hepática Aguda / Insuficiencia Hepatocelular';
          desc += ' La prolongación crítica del INR y la hipoalbuminemia evidencian fallo grave de la capacidad de síntesis proteica del hígado. Requiere monitorización en UCI.';
        }

        urineColorClass = 'bg-amber-800';
        urineHeight = '80%';
        urineText = 'Coluria Marcada (Color Té/Refresco de Cola)';
        stoolEmoji = '💩';
        stoolText = 'Hipocolia / Ligeramente Pálido';
        stripBil = 'Positivo (++)';
        stripUro = 'Moderadamente Elevado';
      } else if (ratioBD >= 50 && alp > 250 && ggt > 120) {
        // Posthepatic / Obstructive cholestasis
        emoji = '🔴';
        title = 'Ictericia Posthepática (Colestasis Obstructiva)';
        desc = 'Obstrucción mecánica del árbol biliar (coledocolitiasis, adenocarcinoma de cabeza de páncreas, colangiocarcinoma). La bilirrubina directa refluye a los sinusoides y torrente sanguíneo.';
        perla = 'La ausencia de bilis en el intestino impide la síntesis de estercobilina (acolia) y urobilinógeno (urobilinógeno urinario 0). Además, la falta de sales biliares en la luz intestinal impide la absorción de vitaminas liposolubles (A, D, E, K).';

        urineColorClass = 'bg-stone-900';
        urineHeight = '90%';
        urineText = 'Coluria Severa (Espuma Amarilla y Tinte Oscuro)';
        stoolEmoji = '⚪';
        stoolText = 'Acolia Completa (Heces Blancas como Arcilla)';
        stripBil = 'Positivo (+++)';
        stripUro = 'AUSENTE (0.0 mg/dL)';
      } else if (ratioBD >= 50 && alt <= 80 && ast <= 80) {
        title = 'Síndrome de Dubin-Johnson / Síndrome de Rotor';
        desc = 'Trastornos hereditarios autosómicos recesivos caracterizados por hiperbilirrubinemia directa aislada sin colestasis por defectos en el transportador canalicular MRP2 (Dubin-Johnson) o de recaptación sinusoidal OATP1B (Rotor).';
        perla = 'El hígado en Dubin-Johnson es de coloración negra azabache microscópicamente por pigmento lisosomal similar a melanina/lipofuscina, mientras que en el Síndrome de Rotor el parénquima hepático es histológicamente normal.';
        urineColorClass = 'bg-amber-700';
        urineHeight = '65%';
        urineText = 'Coluria Moderada';
        stoolEmoji = '💩';
        stoolText = 'Normal';
        stripBil = 'Positivo (+)';
        stripUro = 'Normal o Levemente Disminuido';
      } else {
        title = 'Patrón de Ictericia Mixta / En Resolución';
        desc = 'Coexisten alteraciones analíticas mixtas. Puede corresponder a colestasis intrahepática o daño hepatocelular en fase subaguda.';
      }
    }

    return {
      emoji,
      title,
      desc,
      perla,
      urineColorClass,
      urineHeight,
      urineText,
      stoolEmoji,
      stoolText,
      stripBil,
      stripUro
    };
  }, [bt, bd, ast, alt, alp, ggt, alb, inr, profile, ratioBD]);

  // Neonatal calculations
  const neonatalEvaluation = useMemo(() => {
    let kramerZone = 'Zona I';
    let kramerDesc = 'Ictericia limitada a cabeza y cuello. Bilirrubina esperable <5 mg/dL.';
    if (bt >= 5 && bt <= 12) {
      kramerZone = 'Zona II';
      kramerDesc = 'Afectación del tórax superior hasta el ombligo. Bilirrubina esperable entre 5 y 12 mg/dL.';
    } else if (bt > 12 && bt <= 15) {
      kramerZone = 'Zona III';
      kramerDesc = 'Abdomen inferior y muslos hasta las rodillas. Bilirrubina esperable entre 8 y 16 mg/dL.';
    } else if (bt > 15 && bt <= 18) {
      kramerZone = 'Zona IV';
      kramerDesc = 'Extremidades superiores y piernas. Bilirrubina esperable entre 10 y 18 mg/dL.';
    } else if (bt > 18) {
      kramerZone = 'Zona V';
      kramerDesc = 'Afectación distal completa que incluye palmas de las manos y plantas de los pies. Bilirrubina >15-20 mg/dL.';
    }

    let neuroRisk = 'Bajo Riesgo de Neurotoxicidad';
    let neuroClass = 'text-slate-900';
    let neuroDesc = 'La bilirrubina no conjugada se encuentra ligada a la albúmina circulante y no satura su capacidad de unión.';
    if (bt > 15 && bt < 20) {
      neuroRisk = 'Riesgo Intermedio • Indicación de Fototerapia Intensa';
      neuroClass = 'text-amber-700';
      neuroDesc = 'Riesgo de que la fracción de BNC libre difunda a tejidos. Indicación estandarizada de fototerapia con luz azul (460-490 nm) para fotoisomerización a lumirrubina.';
    } else if (bt >= 20) {
      neuroRisk = 'Riesgo Crítico de Encefalopatía Bilirrubínica / Kernícterus';
      neuroClass = 'text-rose-700 font-black';
      neuroDesc = 'La BNC libre atraviesa la barrera hematoencefálica inmadura, depositándose en los ganglios basales (globo pálido, subtálamo) y núcleos del tronco encefálico. Indicación inmediata de exanguinotransfusión.';
    }

    const totalBind = bindMental + bindTone + bindCry;

    return {
      kramerZone,
      kramerDesc,
      neuroRisk,
      neuroClass,
      neuroDesc,
      totalBind
    };
  }, [bt, bindMental, bindTone, bindCry]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Laboratorio Interactivo de Diagnóstico Bioquímico
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-slate-300 bg-slate-900 border border-slate-800">
              Facultad de Medicina UGR
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Simulador Clínico de Ictericias y Metabolismo de la Bilirrubina</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Plataforma didáctica para el <strong className="text-white">diagnóstico diferencial de los síndromes ictéricos</strong> (prehepático, hepático y posthepático). Ajuste los parámetros del perfil analítico para observar en tiempo real la clasificación fisiopatológica, el color de orina y heces, la tira reactiva y el riesgo de neurotoxicidad neonatal.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Perfil Clínico:</span>
            <div className="inline-flex rounded-xl p-1 bg-slate-900 border border-slate-700">
              <button
                onClick={() => {
                  setProfile('adult');
                  applyPreset(PRESETS.adult[0]);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  profile === 'adult' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Paciente Adulto</span>
              </button>
              <button
                onClick={() => {
                  setProfile('neonatal');
                  applyPreset(PRESETS.neonatal[0]);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  profile === 'neonatal' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Baby className="w-3.5 h-3.5" />
                <span>Neonato (Pediatría)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Diagnostic Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset Selector & Sliders (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preset Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Casos Clínicos de Referencia (Presets)
              </span>
              <button
                onClick={resetValues}
                className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESETS[profile].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/90 rounded-xl text-left truncate transition-all cursor-pointer"
                  title={preset.name}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Laboratory Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-600" />
                <span>Perfil Bioquímico Hepático</span>
              </h3>
              <span className="text-[10px] text-slate-500">Ajuste interactivo</span>
            </div>

            {/* Bilirrubina Total (BT) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Bilirrubina Total (BT)</span>
                <span className="font-bold font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                  {bt.toFixed(1)} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="30"
                step="0.1"
                value={bt}
                onChange={(e) => handleBtChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Ref: 0.2 - 1.2 mg/dL</span>
                <span>Max: 30 mg/dL</span>
              </div>
            </div>

            {/* Bilirrubina Directa / Conjugada (BD) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Bilirrubina Directa (BD)</span>
                <span className="font-bold font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded">
                  {bd.toFixed(1)} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="30"
                step="0.1"
                value={bd}
                onChange={(e) => handleBdChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Ref: 0.0 - 0.3 mg/dL</span>
                <span>Restricción: BD ≤ BT</span>
              </div>
            </div>

            {/* AST / GOT */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">AST / GOT</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {ast} U/L
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={ast}
                onChange={(e) => setAst(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Ref: 0 - 40 U/L</span>
                <span>Marcador de citolisis</span>
              </div>
            </div>

            {/* ALT / GPT */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">ALT / GPT</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {alt} U/L
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={alt}
                onChange={(e) => setAlt(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Ref: 0 - 41 U/L</span>
                <span>Alta especificidad hepática</span>
              </div>
            </div>

            {/* Fosfatasa Alcalina (FA) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Fosfatasa Alcalina (FA)</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {alp} U/L
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="1000"
                step="10"
                value={alp}
                onChange={(e) => setAlp(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Ref: 30 - 120 U/L</span>
                <span>Marcador de colestasis canalicular</span>
              </div>
            </div>

            {/* GGT */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Gamma-Glutamil Transferasa (GGT)</span>
                <span className="font-bold font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                  {ggt} U/L
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="800"
                step="5"
                value={ggt}
                onChange={(e) => setGgt(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Ref: 5 - 61 U/L</span>
                <span>Confirma origen hepático de FA</span>
              </div>
            </div>

            {/* Albúmina e INR */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Albúmina</span>
                  <span className="font-bold font-mono text-slate-900">{alb.toFixed(1)} g/dL</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.5"
                  step="0.1"
                  value={alb}
                  onChange={(e) => setAlb(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-[10px] text-slate-500 block">Ref: 3.5 - 5.2 g/dL</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">INR</span>
                  <span className="font-bold font-mono text-slate-900">{inr.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="6.0"
                  step="0.1"
                  value={inr}
                  onChange={(e) => setInr(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <span className="text-[10px] text-slate-500 block">Ref: 0.8 - 1.2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Interpretation & Simulation Visuals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Presumptive Judgment Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-200">
                {diagnosis.emoji}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Juicio Diagnóstico Presuntivo
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Ratio BD: {ratioBD.toFixed(0)}%
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {diagnosis.title}
                </h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {diagnosis.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Excretion Simulation: Urine & Feces Reactivity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Urine & Stool Chamber */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Simulación Visual de Excreción y Sedimento
              </h3>

              <div className="grid grid-cols-2 gap-4 py-2 text-center">
                {/* Urine graduated cylinder */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-16 h-28 bg-slate-100 border-2 border-slate-300 rounded-b-xl rounded-t-sm shadow-inner flex items-end overflow-hidden">
                    <div 
                      className={`w-full transition-all duration-500 ${diagnosis.urineColorClass}`}
                      style={{ height: diagnosis.urineHeight }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-1 pointer-events-none opacity-30 text-[8px] font-mono">
                      <span>- 50mL</span>
                      <span>- 25mL</span>
                      <span>- 10mL</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Orina</span>
                  <span className="text-[10px] text-slate-500 font-medium">{diagnosis.urineText}</span>
                </div>

                {/* Stool visual */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-28 flex items-center justify-center text-4xl bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                    <span>{diagnosis.stoolEmoji}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Heces</span>
                  <span className="text-[10px] text-slate-500 font-medium">{diagnosis.stoolText}</span>
                </div>
              </div>

              {/* Reactive Urinalysis Strip */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/90 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Bilirrubina en orina:</span>
                  <span className={`font-bold ${diagnosis.stripBil.includes('Positivo') ? 'text-amber-700' : 'text-slate-700'}`}>
                    {diagnosis.stripBil}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-600">Urobilinógeno en orina:</span>
                  <span className={`font-bold ${
                    diagnosis.stripUro.includes('AUSENTE') 
                      ? 'text-rose-700' 
                      : diagnosis.stripUro.includes('ELEVADO') 
                      ? 'text-amber-700' 
                      : 'text-slate-700'
                  }`}>
                    {diagnosis.stripUro}
                  </span>
                </div>
              </div>
            </div>

            {/* Bilirubin Fractions Balance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Balance de Fracciones Séricas
              </h3>

              <div className="py-2 space-y-4 text-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">Indirecta (No Conjugada)</span>
                    <span className="text-lg font-black font-mono text-amber-900">{bi.toFixed(1)} mg/dL</span>
                    <span className="text-[11px] text-amber-700 font-mono block">({ratioBI.toFixed(0)}%)</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block">Directa (Conjugada)</span>
                    <span className="text-lg font-black font-mono text-emerald-900">{bd.toFixed(1)} mg/dL</span>
                    <span className="text-[11px] text-emerald-700 font-mono block">({ratioBD.toFixed(0)}%)</span>
                  </div>
                </div>

                {/* Visual Ratio Bar */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex shadow-inner">
                  <div 
                    className="bg-amber-500 transition-all duration-500"
                    style={{ width: `${ratioBI}%` }}
                    title={`Indirecta: ${ratioBI.toFixed(0)}%`}
                  />
                  <div 
                    className="bg-emerald-600 transition-all duration-500"
                    style={{ width: `${ratioBD}%` }}
                    title={`Directa: ${ratioBD.toFixed(0)}%`}
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <span className="font-semibold text-slate-700 block">Fisiología del Transporte:</span>
                <p>
                  La bilirrubina no conjugada (BNC) es hidrofóbica y viaja ligada a albúmina. La bilirrubina conjugada (BC) es hidrosoluble gracias a la adición de ácido glucurónico por la UGT1A1 hepática.
                </p>
              </div>
            </div>

          </div>

          {/* Neonatal Specific Assessment Panel */}
          {profile === 'neonatal' && (
            <div className="bg-amber-50/50 rounded-2xl border border-amber-200 p-6 shadow-xs space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                <h3 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
                  <Baby className="w-4 h-4 text-amber-700" />
                  <span>Evaluación Neonatal Específica • Escalas Kramer & BIND</span>
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  Score BIND: {neonatalEvaluation.totalBind}/9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kramer and Neuro Risk */}
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-amber-200/90 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      Progresión Cefalocaudal (Kramer):
                    </span>
                    <h4 className="font-bold text-slate-900">{neonatalEvaluation.kramerZone}</h4>
                    <p className="text-slate-600 text-[11px]">{neonatalEvaluation.kramerDesc}</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-200/90 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      Riesgo de Neurotoxicidad:
                    </span>
                    <h4 className={neonatalEvaluation.neuroClass}>{neonatalEvaluation.neuroRisk}</h4>
                    <p className="text-slate-600 text-[11px]">{neonatalEvaluation.neuroDesc}</p>
                  </div>
                </div>

                {/* BIND Score Selectors */}
                <div className="p-4 bg-white rounded-xl border border-amber-200/90 space-y-2.5 text-xs">
                  <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                    Escala BIND (Bilirubin-Induced Neurologic Dysfunction):
                  </span>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block">Estado Mental:</label>
                    <select
                      value={bindMental}
                      onChange={(e) => setBindMental(parseInt(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
                    >
                      <option value="0">0 - Normal / Activo</option>
                      <option value="1">1 - Somnoliento, succión débil</option>
                      <option value="2">2 - Letargia, irritable, rechazo de tomas</option>
                      <option value="3">3 - Semicoma, convulsiones, apnea</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block">Tono Muscular:</label>
                    <select
                      value={bindTone}
                      onChange={(e) => setBindTone(parseInt(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
                    >
                      <option value="0">0 - Normal</option>
                      <option value="1">1 - Hipotonía leve o moderada</option>
                      <option value="2">2 - Hipertonía o tono fluctuante</option>
                      <option value="3">3 - Retrocolis y opistótonos severos</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block">Patrón de Llanto:</label>
                    <select
                      value={bindCry}
                      onChange={(e) => setBindCry(parseInt(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 text-slate-800"
                    >
                      <option value="0">0 - Normal y vigoroso</option>
                      <option value="1">1 - Tono ligeramente agudo al estimular</option>
                      <option value="2">2 - Persistentemente agudo e inconsolable</option>
                      <option value="3">3 - Llanto débil, apagado o ausente</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fisiopathological Pearl Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Perla Fisiopatológica Docente
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {diagnosis.perla}
            </p>
            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
              <strong>Prueba de Koller:</strong> Para discernir si un tiempo de protrombina (TP/INR) prolongado se debe a malabsorción de vitamina K por colestasis o a necrosis celular primaria, se administra vitamina K parenteral. Si el TP corrige en 24h, el parénquima conserva su capacidad biosintética.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
