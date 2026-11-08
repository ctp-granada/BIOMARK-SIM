// Bloques de casos clínicos ordenados según los 27 temas del temario.
// El profesorado puede mover casos de bloque desde el panel de activación;
// aquí está solo la asignación inicial.

export interface SyllabusBlock {
  id: string;
  number: number;
  title: string;
  topics: [number, number];
  description: string;
  keyBiomarkers: string[];
}

export const SYLLABUS_BLOCKS: SyllabusBlock[] = [
  {
    id: 'b1',
    number: 1,
    title: 'Comunicación celular y digestión',
    topics: [1, 3],
    description:
      'Receptores acoplados a proteínas G, receptores tirosina quinasa y canales iónicos; digestión y absorción de nutrientes.',
    keyBiomarkers: ['Metanefrinas', 'TRAb', 'Anti-AChR', 'Insulina / HOMA-IR', 'tTG-IgA', 'Cloruro en sudor', 'Vitamina B12'],
  },
  {
    id: 'b2',
    number: 2,
    title: 'Músculo y ejercicio',
    topics: [4, 7],
    description: 'Metabolismo muscular, necrosis de la fibra y cinética de las proteínas que se liberan a la sangre.',
    keyBiomarkers: ['Troponina hs-cTn', 'CK-MB', 'Mioglobina'],
  },
  {
    id: 'b3',
    number: 3,
    title: 'Hígado e hidratos de carbono',
    topics: [8, 10],
    description: 'Glucemia, gluconeogénesis, cetogénesis, metabolismo de la galactosa y coenzimas como la tiamina.',
    keyBiomarkers: ['β-hidroxibutirato', 'Péptido C', 'Actividad GALT', 'Transcetolasa (efecto TPP)'],
  },
  {
    id: 'b4',
    number: 4,
    title: 'Lípidos',
    topics: [11, 15],
    description: 'Lipoproteínas, β-oxidación mitocondrial y esfingolípidos.',
    keyBiomarkers: ['Acilcarnitinas', 'Triglicéridos', 'Lipasa', 'Hexosaminidasa A'],
  },
  {
    id: 'b5',
    number: 5,
    title: 'Aminoácidos y nucleótidos',
    topics: [16, 19],
    description: 'Ciclo de la urea, transporte de aminoácidos, purinas, pirimidinas y neurotransmisores.',
    keyBiomarkers: ['Amonio', 'Ácido úrico', 'Cistina en orina', 'Ácido orótico', 'Acetilcolinesterasa'],
  },
  {
    id: 'b6',
    number: 6,
    title: 'Sangre y hemoglobina',
    topics: [20, 26],
    description: 'Hematíe, hemoglobina, degradación del hemo e ictericias.',
    keyBiomarkers: ['Electroforesis de Hb', 'LDH', 'Bilirrubina directa / indirecta', 'GGT', 'Fosfatasa alcalina'],
  },
  {
    id: 'b7',
    number: 7,
    title: 'Integración metabólica',
    topics: [27, 27],
    description: 'Casos que exigen relacionar varios órganos y rutas a la vez.',
    keyBiomarkers: ['NT-proBNP', 'ALT / AST', 'INR'],
  },
];

export const DEFAULT_CASE_BLOCK: Record<string, string> = {
  case_metabolic_signaling_01: 'b1',
  case_marks_colera_01: 'b1',
  case_cardiac_signaling_01: 'b1',
  case_marks_graves_01: 'b1',
  case_metabolic_01: 'b1',
  case_metabolic_signaling_02: 'b1',
  case_neuromuscular_01: 'b1',
  case_marks_miastenia_01: 'b1',
  case_pancreatic_03: 'b1',
  case_marks_fibrosis_quistica_01: 'b1',
  case_pancreatic_02: 'b1',
  case_cardiac_01: 'b2',
  case_metabolic_02: 'b3',
  case_marks_insulinoma_01: 'b3',
  case_marks_galactosemia_01: 'b3',
  case_marks_alcohol_tiamina_01: 'b3',
  case_metabolic_03: 'b4',
  case_pancreatic_01: 'b4',
  case_marks_tay_sachs_01: 'b4',
  case_renal_01: 'b5',
  case_renal_02: 'b5',
  case_marks_gota_01: 'b5',
  case_renal_03: 'b5',
  case_marks_cistinuria_01: 'b5',
  case_marks_orotica_01: 'b5',
  case_marks_organofosforados_01: 'b5',
  case_marks_falciforme_01: 'b6',
  case_hepatic_01: 'b6',
  case_hepatic_02: 'b6',
  case_marks_insuficiencia_cardiaca_01: 'b7',
  case_hepatic_03: 'b7',
  // Casos añadidos en noviembre de 2026
  case_marks_lactosa_01: 'b1',
  case_marks_trehalasa_01: 'b1',
  case_marks_fructosa_01: 'b3',
  case_marks_dm2_01: 'b3',
  case_marks_sindrome_metabolico_01: 'b4',
  case_marks_amanitina_01: 'b5',
  case_marks_talasemia_01: 'b6',
  case_marks_anorexia_01: 'b7',
  case_marks_desnutricion_01: 'b7',
  // Casos basados en el Baynes (noviembre de 2026)
  case_baynes_glut1_01: 'b1',
  case_baynes_mcardle_01: 'b2',
  case_baynes_melas_01: 'b2',
  case_baynes_dinitrofenol_01: 'b2',
  case_baynes_von_gierke_01: 'b3',
  case_baynes_metanol_01: 'b3',
  case_baynes_disbetalipoproteinemia_01: 'b4',
  case_baynes_tangier_01: 'b4',
  case_baynes_refsum_01: 'b4',
  case_baynes_fenilcetonuria_01: 'b5',
  case_baynes_jarabe_arce_01: 'b5',
  case_baynes_alcaptonuria_01: 'b5',
  case_baynes_homocistinuria_01: 'b5',
  case_baynes_cistinosis_01: 'b5',
  case_baynes_hartnup_01: 'b5',
  case_baynes_pelagra_01: 'b5',
  case_baynes_escorbuto_01: 'b5',
  case_baynes_creutzfeldt_jakob_01: 'b5',
  case_baynes_g6pd_01: 'b6',
  case_baynes_monoxido_01: 'b6',
  case_baynes_metahemoglobina_01: 'b6',
  case_baynes_hemofilia_01: 'b6',
  case_baynes_tvp_01: 'b6',
  case_baynes_mieloma_01: 'b6',
  case_baynes_wilson_01: 'b6',
  case_baynes_nefrotico_01: 'b6',
};

export function topicsLabel(block: SyllabusBlock): string {
  const [a, b] = block.topics;
  return a === b ? `Tema ${a}` : `Temas ${a}–${b}`;
}
