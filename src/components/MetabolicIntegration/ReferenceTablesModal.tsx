import React from 'react';
import { X, Network, Table2 } from 'lucide-react';

export type ReferenceTableTool = 'hormonal_regulation' | 'organ_matrix';

interface Props {
  tool: ReferenceTableTool;
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Regulación hormonal (Informe técnico §2 y Manual de referencia §3)
// ---------------------------------------------------------------------------
const TIME_SCALES = [
  { level: 'Masa de acción y alosterismo', time: 'Milisegundos a segundos', example: 'AMP activa la PFK-1; el citrato la inhibe; la F-2,6-BP la activa. La glucosa libre inactiva la glucógeno fosforilasa hepática.' },
  { level: 'Modificación covalente', time: 'Minutos', example: 'Fosforilación por PKA (glucagón, adrenalina) frente a desfosforilación por fosfatasas activadas por insulina: glucógeno sintasa, fosforilasa, PFK-2, piruvato quinasa, ACC, HSL.' },
  { level: 'Expresión génica', time: 'Horas a días', example: 'Inducción de PEPCK y glucosa-6-fosfatasa por glucagón (CREB) y cortisol (GRE); inducción de glucoquinasa y enzimas lipogénicas por insulina (SREBP-1c).' },
];

const HORMONES = [
  {
    name: 'Insulina',
    tone: 'border-emerald-200 bg-emerald-50/60',
    title: 'text-emerald-900',
    points: [
      'Receptor tirosina quinasa → IRS-1/2 → PI3K/Akt (metabolismo) y MAPK (crecimiento).',
      'Músculo y adiposo: translocación de GLUT4 a la membrana.',
      'Activa la fosfodiesterasa 3B (↓AMPc, ↓PKA) y fosfatasas que desfosforilan enzimas clave: activa síntesis (glucógeno, lípidos, glucólisis) y frena las vías catabólicas.',
      'Genómica: fosforila FoxO1 y lo expulsa del núcleo (reprime PEPCK y glucosa-6-fosfatasa); induce glucoquinasa y enzimas lipogénicas vía SREBP-1c.',
    ],
  },
  {
    name: 'Glucagón',
    tone: 'border-amber-200 bg-amber-50/60',
    title: 'text-amber-900',
    points: [
      'Receptor acoplado a Gs → adenilato ciclasa → AMPc → PKA.',
      'Hígado: glucogenólisis, gluconeogénesis (induce PEPCK, FBPasa-1, glucosa-6-fosfatasa), β-oxidación y cetogénesis (ACC fosforilada, ↓malonil-CoA).',
      'Reprime glucoquinasa y piruvato quinasa; inhibe glucólisis y síntesis de ácidos grasos.',
      'El músculo esquelético carece de receptores funcionales: el glucagón no moviliza su glucógeno ni sus proteínas.',
    ],
  },
  {
    name: 'Adrenalina / Noradrenalina',
    tone: 'border-rose-200 bg-rose-50/60',
    title: 'text-rose-900',
    points: [
      'Receptores β1, β2 y α1 (AMPc/PKA o Ca2+); α2 en la célula β pancreática frena la secreción de insulina.',
      'Músculo (β2): glucogenólisis masiva para la glucólisis local; la glucosa no sale a la sangre (sin glucosa-6-fosfatasa).',
      'Hígado: glucogenólisis y gluconeogénesis con exportación de glucosa.',
      'Tejido adiposo: potente activación de la lipólisis (HSL y perilipinas).',
    ],
  },
  {
    name: 'Cortisol',
    tone: 'border-indigo-200 bg-indigo-50/60',
    title: 'text-indigo-900',
    points: [
      'Esteroide: receptor de glucocorticoides citosólico → núcleo → elementos de respuesta (GRE). Acción lenta y sostenida.',
      'Músculo: induce las ubiquitina ligasas MuRF1 y atrogina-1 → proteólisis por el proteasoma (libera alanina).',
      'Hígado: induce PEPCK, glucosa-6-fosfatasa y aminotransferasas (ALT); favorece el depósito de glucógeno hepático.',
      'Tejido adiposo: efecto permisivo sobre la lipólisis inducida por catecolaminas.',
    ],
  },
];

const ENZYME_MATRIX = [
  { enzyme: 'Glucoquinasa (hígado)', covalent: 'No la regula la PKA; la GKRP la secuestra en el núcleo (F-6-P) y la fructosa-1-P la libera.', genomic: 'Insulina ↑ · Glucagón ↓', state: 'Postprandial' },
  { enzyme: 'PFK-2 / FBPasa-2 (hígado)', covalent: 'Insulina: desfosforilada → PFK-2 activa (↑F-2,6-BP). Glucagón: PKA → FBPasa-2 activa (↓F-2,6-BP).', genomic: 'Sin efecto dominante', state: 'Desfosforilada: saciedad · Fosforilada: ayuno' },
  { enzyme: 'Piruvato quinasa L (hígado)', covalent: 'Insulina: desfosforilada (activa). Glucagón: PKA (inactiva). F-1,6-BP la activa.', genomic: 'Insulina/ChREBP ↑ · Glucagón ↓', state: 'Desfosforilada: saciedad · Fosforilada: ayuno' },
  { enzyme: 'Glucógeno sintasa', covalent: 'Insulina: PP1 e inhibición de GSK-3 (activa). Glucagón/adrenalina: PKA (inactiva). G-6-P la activa.', genomic: 'Cortisol ↑ (lento)', state: 'Desfosforilada: saciedad · Fosforilada: ayuno/estrés' },
  { enzyme: 'Glucógeno fosforilasa (hígado)', covalent: 'Glucagón/adrenalina: fosforilasa quinasa → forma a (activa). Insulina: PP1 (inactiva). La glucosa libre la inactiva.', genomic: 'Sin efecto dominante', state: 'Fosforilada: ayuno/estrés' },
  { enzyme: 'PEPCK', covalent: 'No se regula por fosforilación', genomic: 'Insulina ↓ (FoxO1) · Glucagón ↑ (CREB) · Cortisol ↑↑ (GRE)', state: 'Inducida en ayuno y estrés' },
  { enzyme: 'Glucosa-6-fosfatasa', covalent: 'No se regula por fosforilación', genomic: 'Insulina ↓ · Glucagón y cortisol ↑', state: 'Inducida en ayuno y estrés' },
  { enzyme: 'Acetil-CoA carboxilasa', covalent: 'Insulina: desfosforilada (activa); citrato la polimeriza. Glucagón/adrenalina (PKA) y AMPK: fosforilada (inactiva).', genomic: 'Insulina ↑ (SREBP-1c) · Glucagón ↓', state: 'Activa: saciedad · Inactiva: ayuno y ejercicio' },
  { enzyme: 'Lipoproteína lipasa (adiposo)', covalent: 'No se regula por fosforilación citosólica', genomic: 'Insulina ↑ · Catecolaminas y glucagón ↓', state: 'Inducida en postprandial' },
  { enzyme: 'Lipasa sensible a hormonas', covalent: 'Adrenalina (PKA): fosforila HSL y perilipinas (activa). Insulina: ↓AMPc (PDE3B) y desfosforilación (inactiva).', genomic: 'Cortisol ↑ (HSL y ATGL)', state: 'Activa: ayuno y ejercicio' },
  { enzyme: 'Glucógeno fosforilasa (músculo)', covalent: 'Adrenalina (β2/PKA) y Ca2+ (fosforilasa quinasa): activa. AMP la activa alostéricamente. Sin respuesta al glucagón.', genomic: 'Sin efecto dominante', state: 'Activa: contracción y estrés agudo' },
  { enzyme: 'Proteínas musculares', covalent: '—', genomic: 'Insulina: ↑ síntesis (mTORC1, eIF4E) · Cortisol: ↑↑ degradación (MuRF1, atrogina-1)', state: 'Síntesis: saciedad · Degradación: ayuno/estrés' },
];

// ---------------------------------------------------------------------------
// Perfil metabólico de órganos (Informe técnico §1.2 y Manual de referencia §1)
// ---------------------------------------------------------------------------
const ORGAN_MATRIX = [
  { organ: 'Hígado', role: 'Glucostato, ureogénesis, lipogénesis, proteínas plasmáticas y detoxificación', pathways: 'Glucogenogénesis y glucogenólisis, gluconeogénesis, β-oxidación, cetogénesis, ciclo de la urea, vía de las pentosas, glucuronidación (fase 2), ácidos biliares, ácido úrico', inputs: 'Glucosa, lactato, glicerol, alanina, AGL, fructosa, etanol', outputs: 'Glucosa, VLDL, HDL, urea, cuerpos cetónicos, ácido úrico, albúmina', enzymes: 'Glucoquinasa (Km ~10 mM), glucosa-6-fosfatasa, glicerol quinasa, fructoquinasa, PEPCK, arginasa, HMG-CoA sintasa y liasa, 7-α-hidroxilasa, alcohol deshidrogenasa, xantina oxidasa' },
  { organ: 'Cerebro', role: 'Potenciales de membrana (Na+/K+-ATPasa; ~20% del O2 basal con ~2% de la masa)', pathways: 'Glucólisis aerobia + Krebs + fosforilación oxidativa; cetólisis en el ayuno; descarboxilación de aminoácidos', inputs: 'Glucosa (GLUT1/GLUT3); β-hidroxibutirato y acetoacetato en el ayuno (MCT1); DHA en el desarrollo', outputs: 'CO2, H2O, poco lactato, neurotransmisores', enzymes: 'Hexoquinasa I (Km ~0,05 mM), glutamato descarboxilasa, tioforasa (SCOT)' },
  { organ: 'Músculo esquelético', role: 'Trabajo mecánico y reserva proteica movilizable (~6 kg)', pathways: 'Glucólisis anaerobia (fibras rápidas), β-oxidación (fibras lentas), Krebs, glucogenogénesis, proteólisis por el proteasoma, ciclo glucosa-alanina', inputs: 'Glucosa (GLUT4), AGL, cuerpos cetónicos, aminoácidos ramificados', outputs: 'Lactato, alanina, glutamina, CO2, H2O', enzymes: 'Glucógeno fosforilasa muscular, creatina quinasa, PFK-1, PDH, LPL' },
  { organ: 'Músculo cardíaco', role: 'Bombeo continuo, estrictamente aerobio', pathways: 'β-oxidación (~60-80% del ATP), Krebs, fosforilación oxidativa, oxidación de lactato y cetonas', inputs: 'AGL, lactato, cuerpos cetónicos, glucosa', outputs: 'CO2, H2O', enzymes: 'LPL constitutiva, CPT-1, PFK-2 cardíaca (activada por AMPK), LDH-1' },
  { organ: 'Tejido adiposo', role: 'Reserva de triacilgliceroles (~15 kg) y órgano endocrino (leptina, adiponectina)', pathways: 'Esterificación de AGL, lipólisis (ATGL, HSL, MGL), glucólisis para glicerol-3-P, vía de las pentosas', inputs: 'Glucosa (GLUT4), AGL de quilomicrones y VLDL (LPL)', outputs: 'AGL (unidos a albúmina), glicerol, leptina', enzymes: 'LPL inducible por insulina, ATGL, HSL; carece de glicerol quinasa funcional' },
  { organ: 'Corteza renal', role: 'Gluconeogénesis (hasta 40-50% en el ayuno prolongado) y excreción de NH4+/H+', pathways: 'Gluconeogénesis, β-oxidación, desaminación de glutamina (amoniogénesis)', inputs: 'AGL, glutamina, glicerol, lactato', outputs: 'Glucosa, HCO3-, NH4+ (orina)', enzymes: 'Glutaminasa, glutamato deshidrogenasa, PEPCK, glucosa-6-fosfatasa, glicerol quinasa' },
  { organ: 'Médula renal', role: 'Mantenimiento del gradiente osmótico (baja pO2, vasos rectos)', pathways: 'Glucólisis anaerobia', inputs: 'Glucosa', outputs: 'Lactato', enzymes: 'PFK-1, lactato deshidrogenasa' },
  { organ: 'Eritrocito', role: 'Transporte de O2 y CO2; sin núcleo ni mitocondrias', pathways: 'Glucólisis anaerobia (Embden-Meyerhof), vía de las pentosas (fase oxidativa), derivación de 2,3-BPG', inputs: 'Glucosa (GLUT1)', outputs: 'Lactato (ciclo de Cori)', enzymes: 'Glucosa-6-fosfato deshidrogenasa, glutatión reductasa, bisfosfoglicerato mutasa' },
  { organ: 'Intestino delgado', role: 'Digestión, absorción e incretinas', pathways: 'Oxidación de glutamina, reesterificación de TAG, ensamblaje de quilomicrones (apoB-48)', inputs: 'Nutrientes de la luz intestinal, glutamina arterial', outputs: 'Glucosa y aminoácidos a la vena porta; quilomicrones a la linfa; GLP-1 y GIP', enzymes: 'SGLT1, GLUT5, GLUT2, MTP, glutaminasa' },
];

export const ReferenceTablesModal: React.FC<Props> = ({ tool, onClose }) => {
  const isHormonal = tool === 'hormonal_regulation';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isHormonal ? 'Regulación hormonal' : 'Perfil metabólico de órganos'}
        className="bg-white border border-slate-200 rounded-3xl shadow-xl max-w-6xl w-full max-h-[88vh] overflow-y-auto custom-scrollbar p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end -mt-2 mb-1 pointer-events-none">
              <button
                onClick={onClose}
                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>

        {isHormonal ? (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Network className="w-5 h-5 text-teal-700" />
                Regulación hormonal y modulación enzimática
              </h3>
              <p className="text-xs text-slate-500 mt-1">Cómo coordinan las hormonas la actividad y la cantidad de las enzimas clave.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TIME_SCALES.map((t, i) => (
                <div key={t.level} className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Nivel {i + 1} · {t.time}</span>
                  <span className="block text-sm font-bold text-slate-900 mt-0.5">{t.level}</span>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">{t.example}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HORMONES.map((h) => (
                <div key={h.name} className={`p-3.5 rounded-2xl border ${h.tone}`}>
                  <span className={`text-sm font-extrabold ${h.title}`}>{h.name}</span>
                  <ul className="mt-1.5 space-y-1 text-[11.5px] text-slate-700 leading-snug list-disc pl-4">
                    {h.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Matriz de modulación enzimática</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-[11.5px] text-left min-w-[760px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold">
                    <tr>
                      <th className="py-2 px-3">Enzima</th>
                      <th className="py-2 px-3">Modulación covalente (minutos)</th>
                      <th className="py-2 px-3">Modulación genómica (horas-días)</th>
                      <th className="py-2 px-3">Estado predominante</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ENZYME_MATRIX.map((r) => (
                      <tr key={r.enzyme} className="align-top">
                        <td className="py-2 px-3 font-bold text-slate-900">{r.enzyme}</td>
                        <td className="py-2 px-3 text-slate-700">{r.covalent}</td>
                        <td className="py-2 px-3 text-slate-700">{r.genomic}</td>
                        <td className="py-2 px-3 text-teal-800 font-semibold">{r.state}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Table2 className="w-5 h-5 text-teal-700" />
                Perfil metabólico de órganos y tejidos
              </h3>
              <p className="text-xs text-slate-500 mt-1">División del trabajo metabólico: qué hace cada tejido, qué consume, qué exporta y con qué enzimas.</p>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-[11.5px] text-left min-w-[980px]">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2 px-3">Órgano / tejido</th>
                    <th className="py-2 px-3">Función principal</th>
                    <th className="py-2 px-3">Vías características</th>
                    <th className="py-2 px-3">Entran</th>
                    <th className="py-2 px-3">Salen</th>
                    <th className="py-2 px-3">Enzimas clave</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ORGAN_MATRIX.map((r) => (
                    <tr key={r.organ} className="align-top">
                      <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">{r.organ}</td>
                      <td className="py-2 px-3 text-slate-700">{r.role}</td>
                      <td className="py-2 px-3 text-slate-700">{r.pathways}</td>
                      <td className="py-2 px-3 text-emerald-800">{r.inputs}</td>
                      <td className="py-2 px-3 text-amber-800">{r.outputs}</td>
                      <td className="py-2 px-3 text-slate-700">{r.enzymes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
