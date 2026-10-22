import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { BiochemicalInfoTooltip } from '../BiochemicalInfoTooltip';

ChartJS.register(...registerables);

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
    { name: "Coledocolitiasis (Obstrucción)", bt: 14.5, bd: 11.2, ast: 120, alt: 95, alp: 480, ggt: 320, alb: 4.1, inr: 1.1 },
    { name: "Cáncer Páncreas (Colestasis)", bt: 22.0, bd: 17.5, ast: 140, alt: 110, alp: 620, ggt: 480, alb: 3.1, inr: 1.4 },
    { name: "Síndrome Dubin-Johnson", bt: 4.2, bd: 3.1, ast: 25, alt: 22, alp: 85, ggt: 25, alb: 4.1, inr: 1.0 }
  ],
  neonatal: [
    { name: "Fisiológica Neonatal (Normal)", bt: 6.0, bd: 0.3, ast: 30, alt: 25, alp: 120, ggt: 40, alb: 3.5, inr: 1.0 },
    { name: "Hemólisis por Incompatibilidad", bt: 16.5, bd: 0.5, ast: 60, alt: 45, alp: 140, ggt: 45, alb: 3.2, inr: 1.1 },
    { name: "Hiperbilirrubinemia Crítica", bt: 24.5, bd: 0.8, ast: 70, alt: 50, alp: 150, ggt: 50, alb: 3.0, inr: 1.1 },
    { name: "Atresia de Vías Biliares", bt: 12.5, bd: 8.2, ast: 180, alt: 160, alp: 550, ggt: 290, alb: 3.2, inr: 1.2 }
  ]
};

export const JaundiceSimulatorLab: React.FC = () => {
  const [profile, setProfile] = useState<'adult' | 'neonatal'>('adult');
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);

  // Sliders
  const [bt, setBt] = useState<number>(0.8);
  const [bd, setBd] = useState<number>(0.2);
  const [ast, setAst] = useState<number>(25);
  const [alt, setAlt] = useState<number>(20);
  const [alp, setAlp] = useState<number>(80);
  const [ggt, setGgt] = useState<number>(25);
  const [alb, setAlb] = useState<number>(4.2);
  const [inr, setInr] = useState<number>(1.0);

  // Neonatal BIND scale
  const [bindMental, setBindMental] = useState<number>(0);
  const [bindTone, setBindTone] = useState<number>(0);
  const [bindCry, setBindCry] = useState<number>(0);

  // Chart ref
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  const applyPreset = (index: number, prof: 'adult' | 'neonatal' = profile) => {
    setActivePresetIndex(index);
    const data = PRESETS[prof][index];
    setBt(data.bt);
    setBd(data.bd);
    setAst(data.ast);
    setAlt(data.alt);
    setAlp(data.alp);
    setGgt(data.ggt);
    setAlb(data.alb);
    setInr(data.inr);

    if (prof === 'neonatal') {
      setBindMental(0);
      setBindTone(0);
      setBindCry(0);
    }
  };

  const setPatientProfile = (newProfile: 'adult' | 'neonatal') => {
    setProfile(newProfile);
    applyPreset(0, newProfile);
  };

  const resetSliders = () => {
    applyPreset(0);
  };

  const onBTChange = (val: number) => {
    setBt(val);
    setActivePresetIndex(-1);
    if (bd > val) {
      setBd(val);
    }
  };

  const onBDChange = (val: number) => {
    setBd(val);
    setActivePresetIndex(-1);
    if (val > bt) {
      setBt(val);
    }
  };

  // Calculations
  const bi = Math.max(0, bt - bd);
  const ratioBD = bt > 0 ? (bd / bt) * 100 : 0;
  const ratioBI = Math.max(0, 100 - ratioBD);

  // Diagnostic logic matching exact original HTML
  const diagnosis = useMemo(() => {
    let emoji = '✅';
    let title = 'Metabolismo Normal';
    let desc = '';
    let perla = '';

    let urineColor = 'bg-yellow-200';
    let urineHeight = '30%';
    let urineText = 'Normal';
    let stoolEmoji = '💩';
    let stoolText = 'Normal (Marrón)';

    let stripBil = 'Negativo';
    let stripUro = 'Normal (0.1 - 1.0 mg/dL)';

    if (bt <= 1.2) {
      emoji = '✅';
      title = profile === 'adult' ? 'Metabolismo Normal de la Bilirrubina' : 'Neonato con Bilirrubina Normal';
      desc = 'Los parámetros se encuentran dentro de los rangos fisiológicos óptimos en sangre, orina y materias fecales.';
      perla = 'La bilirrubina sérica normal en un adulto es inferior a 1.2 mg/dL. La ictericia es clínicamente visible solo cuando las cifras superan los 2.0 a 2.5 mg/dL, manifestándose primero en las escleróticas debido a su alta afinidad por la elastina.';
    } else {
      emoji = '🟡';

      if (ratioBD < 20) {
        if (alt <= 80 && ast <= 80 && alp <= 150) {
          if (bt < 4.0 && profile === 'adult') {
            title = 'Síndrome de Gilbert Presuntivo';
            desc = 'Hiperbilirrubinemia indirecta leve y aislada. Condición de herencia autosómica recesiva caracterizada por una reducción (~30%) de la enzima UGT1A1. Es totalmente benigna y asintomática.';
            perla = 'En el Síndrome de Gilbert no existe anemia ni reticulocitosis. Los niveles normales de transaminasas descartan daño celular primario. La ictericia se puede exacerbar por el ayuno, estrés o deshidratación.';
          } else if (bt > 5.0 && profile === 'adult') {
            title = 'Síndrome de Crigler-Najjar (Tipo I o II)';
            desc = 'Hereditario y muy infrecuente. Caracterizado por un déficit severo (Tipo II, fenobarbital sensible) o abolición total (Tipo I, alto riesgo de kernícterus) de la actividad conjugadora de la UGT1A1.';
            perla = 'El tipo I no responde al fenobarbital y el tratamiento de mantenimiento requiere fototerapia prolongada de por vida o trasplante de hígado de emergencia.';
          } else {
            title = 'Ictericia Prehepática (Hemólisis)';
            desc = 'Elevación de bilirrubina libre debido a la destrucción masiva de eritrocitos (como en anemias hemolíticas, esferocitosis o incompatibilidad Rh). Supera la capacidad máxima del hígado.';
            perla = 'Al ser insoluble en agua y transportarse unida a albúmina, la bilirrubina no conjugada no puede ser filtrada por el glomérulo. La tira urinaria dará negativo para bilirrubina.';
          }
        } else {
          title = 'Ictericia Prehepática con Estrés Hepático';
          desc = 'La elevación de bilirrubina indirecta coexiste con aumentos leves o moderados de transaminasas por congestión o hipoxia tisular.';
        }

        urineColor = 'bg-yellow-300';
        urineHeight = '50%';
        urineText = 'Amarillo Intenso';
        stoolEmoji = '💩';
        stoolText = 'Pleiocromía Fecal (Muy Oscuro)';
        stripBil = 'Negativo';
        stripUro = 'ELEVADO (> 3.0 mg/dL)';
      } else if (ratioBD >= 20 && (alt > 150 || ast > 150)) {
        emoji = '🟠';
        title = 'Ictericia Hepática (Daño Hepatocelular)';
        desc = 'El daño celular (lisis de hepatocitos) compromete todas las fases de la bilirrubina (captación, conjugación y excreción). Causado clásicamente por hepatitis agudas (virales o medicamentosas) o cirrosis.';
        perla = 'Las transaminasas elevadas en miles sugieren daño hepatocelular agudo (isquemia, tóxicos como paracetamol). Una relación AST/ALT mayor de 2 es común en hepatitis alcohólica.';

        if (inr >= 1.5 && alb < 3.0) {
          emoji = '🚨';
          title = 'Insuficiencia Hepática / Falla Hepática';
          desc += ' El INR prolongado y la albúmina disminuida confirman la pérdida verdadera de la capacidad de síntesis biológica del hígado. Requiere manejo de cuidados intensivos.';
        }

        urineColor = 'bg-amber-800';
        urineHeight = '85%';
        urineText = 'Coluria (Color Té)';
        stoolEmoji = '💩';
        stoolText = 'Normal / Ligeramente Pálido';
        stripBil = 'Positivo (++)';
        stripUro = 'Moderadamente Elevado';
      } else if (ratioBD >= 50 && alp > 250 && ggt > 120) {
        emoji = '🔴';
        title = 'Ictericia Posthepática (Obstructiva / Colestasis)';
        desc = 'Interrupción del flujo biliar por un obstáculo físico (cálculos en el colédoco, tumores de páncreas o de la vía biliar). La bilirrubina conjugada refluye de forma masiva al torrente sinusoidal.';
        perla = 'La colestasis extrahepática prolongada se asocia con prurito intenso debido a la acumulación de ácidos biliares en el tejido cutáneo, requiriendo de descompresión quirúrgica o endoscópica.';

        urineColor = 'bg-amber-950';
        urineHeight = '85%';
        urineText = 'Coluria Intensa (Cola)';
        stoolEmoji = '⚪';
        stoolText = 'Acolia Completa (Heces Blancas)';
        stripBil = 'Positivo (+++)';
        stripUro = 'AUSENTE (0.0 mg/dL)';
      } else if (ratioBD >= 50 && alt <= 80 && ast <= 80) {
        title = 'Síndrome de Dubin-Johnson / Rotor';
        desc = 'Condiciones benignas hereditarias asociadas a la elevación de bilirrubina directa por fallas de transportadores de excreción apical (MRP2 en Dubin-Johnson) o recaptación basolateral (OATP1B en Rotor).';
        perla = 'El síndrome de Dubin-Johnson tiñe el hígado de negro de forma característica por depósitos de tipo lipofuscina, mientras que la histología de Rotor es completamente normal.';

        urineColor = 'bg-amber-700';
        urineHeight = '85%';
        urineText = 'Coluria Moderada';
        stripBil = 'Positivo (+)';
        stripUro = 'Disminuido o Normal';
      } else {
        title = 'Patrón de Ictericia Mixta';
        desc = 'Coexisten alteraciones mixtas de la analítica. Puede ser debida a una colestasis intrahepática o daño hepatocelular en fase de recuperación.';
        urineColor = 'bg-yellow-300';
        urineHeight = '50%';
        urineText = 'Amarillo Turbio';
        stoolEmoji = '💩';
        stoolText = 'Normal';
      }
    }

    return {
      emoji,
      title,
      desc,
      perla,
      urineColor,
      urineHeight,
      urineText,
      stoolEmoji,
      stoolText,
      stripBil,
      stripUro
    };
  }, [bt, bd, alt, ast, alp, ggt, alb, inr, profile, ratioBD]);

  // Neonatal calculations
  const neonatalData = useMemo(() => {
    let zone = 'Zona I';
    let zoneDesc = 'Limitada a cara y cabeza. Bilirrubina esperable menor de 5 mg/dL.';
    if (bt >= 5 && bt <= 12) {
      zone = 'Zona II';
      zoneDesc = 'Tronco superior (hasta el ombligo). Bilirrubina esperable de 5 a 12 mg/dL.';
    } else if (bt > 12 && bt <= 15) {
      zone = 'Zona III';
      zoneDesc = 'Abdomen inferior y rodillas. Bilirrubina esperable de 8 a 16 mg/dL.';
    } else if (bt > 15 && bt <= 18) {
      zone = 'Zona IV';
      zoneDesc = 'Porción proximal de extremidades. Bilirrubina esperable de 10 a 18 mg/dL.';
    } else if (bt > 18) {
      zone = 'Zona V';
      zoneDesc = 'Afectación distal completa (palmas y plantas). Bilirrubina esperable mayor de 15 mg/dL.';
    }

    let risk = 'Bajo Riesgo de Neurotoxicidad';
    let riskDesc = 'La bilirrubina está unida de forma segura a la albúmina sérica.';
    let riskColorClass = 'text-slate-800';

    if (bt > 15 && bt < 20) {
      risk = 'Riesgo Intermedio / Indicación de Fototerapia';
      riskDesc = 'La BNC libre puede aumentar. Se requiere fototerapia para evitar el depósito tisular.';
      riskColorClass = 'text-amber-600 font-bold';
    } else if (bt >= 20) {
      risk = 'Alto Riesgo de Kernícterus';
      riskDesc = 'La BNC supera la albúmina, pudiendo atravesar la barrera hematoencefálica desprovista de mielina.';
      riskColorClass = 'text-red-600 font-bold animate-pulse';
    }

    const totalScore = bindMental + bindTone + bindCry;
    let scoreBadgeClass = 'bg-slate-500 text-white';
    if (totalScore >= 7) {
      scoreBadgeClass = 'bg-red-600 text-white animate-bounce';
    } else if (totalScore >= 4) {
      scoreBadgeClass = 'bg-amber-600 text-white';
    } else if (totalScore > 0) {
      scoreBadgeClass = 'bg-yellow-500 text-white';
    }

    return {
      zone,
      zoneDesc,
      risk,
      riskDesc,
      riskColorClass,
      totalScore,
      scoreBadgeClass
    };
  }, [bt, bindMental, bindTone, bindCry]);

  // Update Doughnut Chart
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
        labels: ['Indirecta', 'Directa'],
        datasets: [
          {
            data: [ratioBI, ratioBD],
            backgroundColor: ['#eab308', '#06b6d4'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${(context.raw as number).toFixed(0)}%`
            }
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
  }, [ratioBI, ratioBD]);

  return (
    <div className="bg-[#f1f5f9] text-slate-800 antialiased min-h-screen flex flex-col rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <header className="bg-indigo-950 text-white shadow-md border-b border-indigo-900 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl shadow-inner">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">CLINICAL SIMULATOR</h1>
                <BiochemicalInfoTooltip
                  title="Metabolismo y Fisiopatología de la Bilirrubina"
                  mechanism="La bilirrubina no conjugada (BNC / indirecta) deriva del catabolismo del grupo hemo de eritrocitos senescentes (~80%) en el bazo. Es hidrofóbica y viaja ligada a albúmina. En el hepatocito se conjuga con ácido glucurónico por la enzima UGT1A1 a bilirrubina conjugada (BD / directa, soluble en agua), excretándose activamente al canalículo biliar vía MRP2."
                  molecularKey="Hemo oxigenasa • UGT1A1 • MRP2 (ABCC2)"
                  clinicalRelevance="Permite diferenciar ictericia prehepática (hemólisis/Gilbert), hepática (citolisis) y posthepática (colestasis obstructiva)."
                />
              </div>
              <p className="text-xs text-indigo-300">Diagnóstico Diferencial del Síndrome Ictérico</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Perfil del Paciente:
            </span>
            <div className="inline-flex rounded-lg p-0.5 bg-indigo-900 border border-indigo-800">
              <button
                onClick={() => setPatientProfile('adult')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  profile === 'adult' ? 'bg-indigo-600 text-white shadow' : 'text-indigo-300 hover:text-white'
                }`}
              >
                Adulto
              </button>
              <button
                onClick={() => setPatientProfile('neonatal')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  profile === 'neonatal' ? 'bg-indigo-600 text-white shadow' : 'text-indigo-300 hover:text-white'
                }`}
              >
                Neonato
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="container mx-auto px-4 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
        {/* Left Column (Presets & Sliders) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Presets */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              🎯 Casos Clínicos de Referencia (Presets)
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS[profile].map((preset, index) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(index)}
                  className={`px-3 py-2 text-xs font-bold rounded-lg text-left truncate transition-all cursor-pointer border ${
                    activePresetIndex === index
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 ring-1 ring-indigo-300'
                      : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
                  }`}
                  title={preset.name}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Analítica de Sangre */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b pb-3 border-slate-100">
              <span className="flex items-center gap-1.5">
                <span>🧪 Analítica de Sangre</span>
                <BiochemicalInfoTooltip
                  title="Patrones Bioquímicos: Citolisis vs Colestasis"
                  mechanism="AST y ALT reflejan daño directo a la membrana del hepatocito (citolisis). FA y GGT reflejan síntesis e inducción ante estasis de bilis en canalículos (colestasis). La albúmina sérica y el INR (tiempo de protrombina) valoran la función de síntesis biológica verdadera del parénquima."
                  molecularKey="AST / ALT (Transaminasas) • FA / GGT • Albúmina / INR"
                />
              </span>
              <button
                onClick={resetSliders}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer"
              >
                Restablecer
              </button>
            </h3>

            {/* Bilirrubina Total */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Bilirrubina Total (BT)</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {bt.toFixed(1)} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="30"
                step="0.1"
                value={bt}
                onChange={(e) => onBTChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 0.2 - 1.2 mg/dL</span>
            </div>

            {/* Bilirrubina Directa */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Bilirrubina Directa / Conjugada (BD)</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {bd.toFixed(1)} mg/dL
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="30"
                step="0.1"
                value={bd}
                onChange={(e) => onBDChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 0.0 - 0.3 mg/dL</span>
            </div>

            {/* AST */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">AST / TGO</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {ast} U/L
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={ast}
                onChange={(e) => {
                  setAst(parseInt(e.target.value));
                  setActivePresetIndex(-1);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 0 - 40 U/L</span>
            </div>

            {/* ALT */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">ALT / TGP</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {alt} U/L
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={alt}
                onChange={(e) => {
                  setAlt(parseInt(e.target.value));
                  setActivePresetIndex(-1);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 0 - 41 U/L</span>
            </div>

            {/* ALP */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Fosfatasa Alcalina (FA)</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {alp} U/L
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="1000"
                step="10"
                value={alp}
                onChange={(e) => {
                  setAlp(parseInt(e.target.value));
                  setActivePresetIndex(-1);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 30 - 120 U/L (Varía en niños)</span>
            </div>

            {/* GGT */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Gamma-Glutamil Transferasa (GGT)</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {ggt} U/L
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="800"
                step="5"
                value={ggt}
                onChange={(e) => {
                  setGgt(parseInt(e.target.value));
                  setActivePresetIndex(-1);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 5 - 61 U/L</span>
            </div>

            {/* Albúmina */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">Albúmina Sérica</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {alb.toFixed(1)} g/dL
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.5"
                step="0.1"
                value={alb}
                onChange={(e) => {
                  setAlb(parseFloat(e.target.value));
                  setActivePresetIndex(-1);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 3.5 - 5.2 g/dL</span>
            </div>

            {/* INR */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">INR (Tiempo de Protrombina)</span>
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {inr.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0.8"
                max="6.0"
                step="0.1"
                value={inr}
                onChange={(e) => {
                  setInr(parseFloat(e.target.value));
                  setActivePresetIndex(-1);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] text-slate-400">Rango normal: 0.8 - 1.2</span>
            </div>
          </div>
        </section>

        {/* Right Column (Diagnosis, Urine/Stool, Chart, Neonatal, Perla) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Juicio Presuntivo */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{diagnosis.emoji}</span>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Juicio Presuntivo
                </span>
                <h2 className="text-xl font-bold text-indigo-900">{diagnosis.title}</h2>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed">
              {diagnosis.desc}
            </div>
          </div>

          {/* Excreción Visual & Balance de Fracciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Excreción Visual */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  💩 Excreción Visual y Tira de Orina
                </h3>
                <BiochemicalInfoTooltip
                  title="Bases Bioquímicas de Coluria y Acolia"
                  mechanism="La BNC (indirecta) no filtra por el glomérulo renal por estar unida a albúmina (tira negativa). La BD (directa) es hidrosoluble y filtra cuando aumenta en sangre, tiñendo la orina de color té o caoba (coluria). En la colestasis obstructiva, al no llegar bilirrubina al intestino, las bacterias colónicas no pueden sintetizar estercobilina (color marrón de las heces), produciendo heces blancas (acolia) y ausencia de urobilinógeno urinario."
                  molecularKey="Filtración glomerular de BD • Estercobilina fecal • Urobilina urinaria"
                />
              </div>

              <div className="flex justify-around items-center py-4">
                {/* Vaso de orina */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative w-16 h-20 bg-slate-50 border-4 border-slate-300 rounded-b-2xl rounded-t-sm shadow-inner flex items-end overflow-hidden">
                    <div
                      className={`w-full transition-all duration-500 ${diagnosis.urineColor}`}
                      style={{ height: diagnosis.urineHeight }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">Orina</span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {diagnosis.urineText}
                  </span>
                </div>

                {/* Heces */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-20 h-20 flex items-center justify-center text-5xl transition-all duration-500 ${
                      diagnosis.stoolEmoji === '⚪'
                        ? 'bg-slate-200 rounded-full border border-slate-300 shadow-inner'
                        : ''
                    }`}
                    style={{
                      filter: diagnosis.stoolText.includes('Pleiocromía') ? 'brightness(40%)' : 'brightness(100%)'
                    }}
                  >
                    {diagnosis.stoolEmoji}
                  </div>
                  <span className="text-xs font-bold text-slate-600">Heces</span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {diagnosis.stoolText}
                  </span>
                </div>
              </div>

              {/* Tira reactiva de orina */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span className="font-semibold">Bilirrubina en orina:</span>
                  <span
                    className={`font-bold ${
                      diagnosis.stripBil.includes('Positivo') ? 'text-amber-700' : 'text-slate-700'
                    }`}
                  >
                    {diagnosis.stripBil}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Urobilinógeno en orina:</span>
                  <span
                    className={`font-bold ${
                      diagnosis.stripUro.includes('AUSENTE')
                        ? 'text-red-600'
                        : diagnosis.stripUro.includes('ELEVADO')
                        ? 'text-yellow-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {diagnosis.stripUro}
                  </span>
                </div>
              </div>
            </div>

            {/* Balance de Fracciones Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  📊 Balance de Fracciones
                </h3>
                <BiochemicalInfoTooltip
                  title="Fraccionamiento de Bilirrubina"
                  mechanism="Un porcentaje de Bilirrubina Directa <20% apunta a causa prehepática (hemólisis o defecto congénito de conjugación como Gilbert/Crigler-Najjar). Un porcentaje >50% con elevación de FA y GGT define patrón colestásico obstructivo."
                  molecularKey="Fracción BD / BT"
                />
              </div>
              <div className="relative w-full h-44 flex items-center justify-center">
                <canvas ref={chartCanvasRef} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-bold px-2">
                <span className="text-yellow-600">Indirecta: {ratioBI.toFixed(0)}%</span>
                <span className="text-cyan-600">Directa: {ratioBD.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Panel Neonatal */}
          {profile === 'neonatal' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-amber-200 bg-amber-50/20 flex flex-col gap-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black text-amber-800 uppercase tracking-wider flex items-center gap-2">
                  👶 Evaluación Clínica Neonatal
                </h3>
                <BiochemicalInfoTooltip
                  title="Ictericia Neonatal y Encefalopatía Bilirrubínica"
                  mechanism="En el recién nacido confluyen poliglobulia fisiológica, menor vida media eritrocitaria y actividad inmadura de la UGT1A1 (~1% del adulto). Si la BNC libre supera la capacidad de unión de la albúmina, atraviesa la barrera hematoencefálica lipófila inmadura y se deposita en los núcleos de la base (globo pálido, subtalámico), provocando neurotoxicidad y Kernícterus."
                  molecularKey="UGT1A1 neonatal • Albúmina libre • Escala Kramer & BIND"
                  clinicalRelevance="La fototerapia fotoisomeriza la bilirrubina 4Z,15Z a lumirrubina soluble 4E,15E que se excreta sin necesidad de conjugación."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-white border border-amber-100 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">
                      Progresión Cefalocaudal (Kramer)
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">
                      {neonatalData.zone}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{neonatalData.zoneDesc}</p>
                  </div>
                  <div className="p-3 bg-white border border-amber-100 rounded-xl">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">
                      Riesgo de Daño Neurológico
                    </span>
                    <h4 className={`text-sm mt-1 ${neonatalData.riskColorClass}`}>
                      {neonatalData.risk}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{neonatalData.riskDesc}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-100 flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b pb-2 border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase">
                      Escala BIND (Puntuación)
                    </span>
                    <span
                      className={`font-black text-xs px-2 py-0.5 rounded-full ${neonatalData.scoreBadgeClass}`}
                    >
                      Score: {neonatalData.totalScore}/9
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-xs">
                    <label className="font-bold text-slate-600">Estado Mental</label>
                    <select
                      value={bindMental}
                      onChange={(e) => setBindMental(parseInt(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded bg-slate-50 text-slate-700"
                    >
                      <option value="0">0 - Normal</option>
                      <option value="1">1 - Somnoliento, mala succión</option>
                      <option value="2">2 - Letargia, irritable, succión pobre</option>
                      <option value="3">3 - Semicoma, convulsiones, no se alimenta</option>
                    </select>

                    <label className="font-bold text-slate-600">Tono Muscular</label>
                    <select
                      value={bindTone}
                      onChange={(e) => setBindTone(parseInt(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded bg-slate-50 text-slate-700"
                    >
                      <option value="0">0 - Normal</option>
                      <option value="1">1 - Hipotonía leve o moderada</option>
                      <option value="2">2 - Hipertonía / Hipotonía fluctuante</option>
                      <option value="3">3 - Retrocolis y opistótonos severos</option>
                    </select>

                    <label className="font-bold text-slate-600">Patrón de Llanto</label>
                    <select
                      value={bindCry}
                      onChange={(e) => setBindCry(parseInt(e.target.value))}
                      className="w-full p-1.5 border border-slate-200 rounded bg-slate-50 text-slate-700"
                    >
                      <option value="0">0 - Normal</option>
                      <option value="1">1 - Tono ligeramente agudo al estimular</option>
                      <option value="2">2 - Persistentemente chillón e inconsolable</option>
                      <option value="3">3 - Llanto sibilante, débil o ausente</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Perla Fisiopatológica */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-b pb-2 border-slate-100">
              💡 Perla Fisiopatológica
            </h3>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2">
              {diagnosis.perla}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 py-6 text-center text-xs border-t border-slate-800 mt-8">
        <div className="container mx-auto px-6">
          <p>© 2026 Clinical Data Hub. Desarrollado como recurso didáctico interactivo para medicina y fisiopatología.</p>
        </div>
      </footer>
    </div>
  );
};
