import { Biomarker, BiomarkerOption, ClinicalCase, LabOrderEvaluation, OrganSystem } from '../types';
import { BIOMARKERS_DATABASE } from '../data/biomarkers';

// Known target essential biomarker mapping per case ID for gold-standard precision
const CASE_ESSENTIAL_MAP: Record<string, string[]> = {
  case_cardiac_01: ['bm_troponin_c'],
  case_hepatic_01: ['bm_ldh'],
  case_hepatic_02: ['bm_ggt', 'bm_fosfatasa_alcalina'],
  case_hepatic_03: ['bm_alt', 'bm_ast'],
  case_metabolic_01: ['bm_trigliceridos', 'bm_fasting_insulin'],
  case_metabolic_02: ['bm_beta_hidroxibutirato'],
  case_metabolic_03: ['bm_relacion_acilcarnitina_carnitina', 'bm_perfil_acilcarnitinas'],
  case_renal_01: ['bm_amonio_plasmatico'],
  case_renal_02: ['bm_cristales_liquido_sinovial', 'bm_acido_urico'],
  case_renal_03: ['bm_acido_urico', 'bm_ldh'],
  case_pancreatic_01: ['bm_lipasa', 'bm_trigliceridos'],
  case_pancreatic_02: ['bm_vitamina_b12', 'bm_magnesio'],
  case_pancreatic_03: ['bm_ttg_iga'],
  case_neuromuscular_01: ['bm_achr_ab'],
  case_metabolic_signaling_01: ['bm_cholera_toxin'],
  case_cardiac_signaling_01: ['bm_metanephrines_plasma'],
  case_metabolic_signaling_02: ['bm_fasting_insulin'],
  case_marks_gota_01: ['bm_cristales_liquido_sinovial', 'bm_acido_urico'],
  case_marks_miastenia_01: ['bm_achr_ab'],
  case_marks_organofosforados_01: ['bm_colinesterasa'],
  case_marks_colera_01: ['bm_cholera_toxin'],
  case_marks_falciforme_01: ['bm_electroforesis_hemoglobina'],
  case_marks_fibrosis_quistica_01: ['bm_test_sudor_cftr'],
  case_marks_lactosa_01: ['bm_hidrogeno_espirado_lactosa'],
  case_marks_fructosa_01: ['bm_gen_aldob_mutaciones'],
  case_marks_galactosemia_01: ['bm_galt_eritrocitaria'],
  case_marks_insulinoma_01: ['bm_peptido_c_insulina'],
  case_marks_graves_01: ['bm_tsh_ultrasensible', 'bm_tsi_trab'],
  case_marks_cistinuria_01: ['bm_aminoacidos_orina_cola'],
  case_marks_orotica_01: ['bm_acido_orotico_orina'],
  case_marks_coledocolitiasis_01: ['bm_bilirrubina_directa', 'bm_fosfatasa_alcalina'],
  case_marks_alcohol_tiamina_01: ['bm_tiamina_tpp'],
  case_marks_amanitina_01: ['bm_alfa_amanitina_orina'],
  case_marks_trehalasa_01: ['bm_hidrogeno_espirado_trehalosa'],
  case_marks_sindrome_metabolico_01: ['bm_perfil_lipidico_completo'],
  case_marks_tay_sachs_01: ['bm_hexosaminidasa_a']
};

// Unit cost in Euros (€) per clinical laboratory diagnostic test (realistic hospital laboratory economics)
export const getBiomarkerCost = (biomarker: Biomarker): number => {
  // Specialized immunological, genetic, or mass spectrometry profiles (180 €)
  if ([
    'bm_perfil_acilcarnitinas', 'bm_ttg_iga', 'bm_nt_probnp', 'bm_achr_ab', 
    'bm_anti_vgcc', 'bm_metanephrines_plasma', 'bm_gen_aldob_mutaciones', 
    'bm_aminoacidos_orina_cola', 'bm_tsi_trab', 'bm_alfa_amanitina_orina', 
    'bm_hexosaminidasa_a', 'bm_electroforesis_hemoglobina'
  ].includes(biomarker.id)) {
    return 180;
  }
  // High-sensitivity immunoassay, fecal, or specialized hormone/vitamin tests (95 €)
  if ([
    'bm_troponin_c', 'bm_elastasa_fecal', 'bm_vitamina_b12', 'bm_gastrina', 
    'bm_cholera_toxin', 'bm_fasting_insulin', 'bm_test_sudor_cftr', 
    'bm_hidrogeno_espirado_lactosa', 'bm_hidrogeno_espirado_trehalosa', 
    'bm_galt_eritrocitaria', 'bm_peptido_c_insulina', 'bm_acido_orotico_orina', 
    'bm_tsh_ultrasensible', 'bm_tiamina_tpp', 'bm_perfil_lipidico_completo'
  ].includes(biomarker.id)) {
    return 95;
  }
  return 45; // Standard routine biochemical enzymes, substrates, ions (45 €)
};

export const getEssentialBiomarkerIdsForCase = (caseData: ClinicalCase): string[] => {
  if (caseData.essentialBiomarkerIds && caseData.essentialBiomarkerIds.length > 0) {
    return caseData.essentialBiomarkerIds;
  }
  if (CASE_ESSENTIAL_MAP[caseData.id]) {
    return CASE_ESSENTIAL_MAP[caseData.id];
  }
  // Fallback: extract from correct biomarker options
  const correctOptions = caseData.biomarkerOptions.filter((o) => o.isCorrect);
  const ids: string[] = [];
  correctOptions.forEach((o) => {
    if (o.biomarkerId && !ids.includes(o.biomarkerId)) {
      ids.push(o.biomarkerId);
    }
  });
  return ids.length > 0 ? ids : ['bm_troponin_c'];
};

/**
 * Determines if a biomarker is patognomonic, confirmatory, or fundamental
 * for the active clinical case. These biomarkers are filtered/hidden from
 * the initial selection list to avoid trivializing the diagnostic challenge.
 */
export const isBiomarkerPathognomonicOrEssential = (
  biomarkerId: string,
  caseData: ClinicalCase
): boolean => {
  const essentialIds = getEssentialBiomarkerIdsForCase(caseData);
  if (essentialIds.includes(biomarkerId)) return true;

  const correctOption = caseData.biomarkerOptions.find((o) => o.isCorrect);
  if (correctOption && correctOption.biomarkerId === biomarkerId) {
    return true;
  }

  return false;
};

/**
 * Filters the initial options list for a clinical case, hiding patognomonic
 * or fundamental biomarkers to prevent trivializing the diagnostic exercise.
 */
export const getInitialBiomarkerOptions = (caseData: ClinicalCase): BiomarkerOption[] => {
  const filtered = caseData.biomarkerOptions.filter(
    (opt) => !isBiomarkerPathognomonicOrEssential(opt.biomarkerId, caseData)
  );
  // Ensure we always have at least 2 differential options
  return filtered.length > 0 ? filtered : caseData.biomarkerOptions.slice(1);
};

/**
 * Returns the patognomonic / fundamental confirmatory options for a clinical case.
 */
export const getPathognomonicConfirmatoryOptions = (caseData: ClinicalCase): BiomarkerOption[] => {
  const pathognomonic = caseData.biomarkerOptions.filter((opt) =>
    isBiomarkerPathognomonicOrEssential(opt.biomarkerId, caseData)
  );
  return pathognomonic.length > 0
    ? pathognomonic
    : caseData.biomarkerOptions.filter((o) => o.isCorrect);
};

export const evaluateLabOrder = (
  caseData: ClinicalCase,
  orderedBiomarkerIds: string[],
  allBiomarkers: Biomarker[] = BIOMARKERS_DATABASE
): LabOrderEvaluation => {
  const essentialIds = getEssentialBiomarkerIdsForCase(caseData);
  const orderedBiomarkers = allBiomarkers.filter((b) => orderedBiomarkerIds.includes(b.id));

  // Find essential biomarkers that were ordered
  const essentialFound = orderedBiomarkers.filter((b) => essentialIds.includes(b.id));

  // Find essential biomarkers that were missed
  const missingEssential = allBiomarkers.filter(
    (b) => essentialIds.includes(b.id) && !orderedBiomarkerIds.includes(b.id)
  );

  // Other biomarkers ordered
  const nonEssentialOrdered = orderedBiomarkers.filter((b) => !essentialIds.includes(b.id));

  // Partition into complementary (same system or related diagnostic context) vs redundant (different system / misleading window)
  const complementary: Biomarker[] = [];
  const redundant: Biomarker[] = [];

  nonEssentialOrdered.forEach((b) => {
    if (b.system === caseData.system) {
      // Test is in same organ system, reasonable complementary battery
      complementary.push(b);
    } else {
      // Completely unrelated organ system or unindicated test
      redundant.push(b);
    }
  });

  // Calculate total budget cost
  const totalBudgetCost = orderedBiomarkers.reduce((sum, b) => sum + getBiomarkerCost(b), 0);

  // Calculate accuracy score (0 - 100%)
  const essentialRatio = essentialIds.length > 0 ? essentialFound.length / essentialIds.length : 0;
  const isFullyCorrect = essentialFound.length >= essentialIds.length && missingEssential.length === 0;
  const isPartiallyCorrect = essentialFound.length > 0 && !isFullyCorrect;

  let accuracyScore = Math.round(essentialRatio * 100);

  // Calculate budget efficiency score (0 - 100%)
  // Perfect score if only essential and max 1 complementary test is ordered without redundants
  let budgetEfficiencyScore = 100;
  budgetEfficiencyScore -= redundant.length * 20;
  budgetEfficiencyScore -= Math.max(0, complementary.length - 1) * 10;
  budgetEfficiencyScore = Math.max(0, Math.min(100, budgetEfficiencyScore));

  // Generate comprehensive clinical summary
  let clinicalSummary = '';
  if (isFullyCorrect) {
    if (redundant.length === 0) {
      clinicalSummary = `¡Excelente solicitud de laboratorio! Has incluido todos los biomarcadores críticos requeridos (${essentialFound.map((b) => b.name).join(', ')}) con un gasto presupuestario altamente eficiente y sin pruebas innecesarias.`;
    } else {
      clinicalSummary = `Has incluido los biomarcadores confirmatorios clave (${essentialFound.map((b) => b.name).join(', ')}), estableciendo el diagnóstico definitivo. No obstante, se solicitaron ${redundant.length} prueba(s) no indicadas que aumentaron el costo de la guardia.`;
    }
  } else if (isPartiallyCorrect) {
    clinicalSummary = `Orden de laboratorio incompleta: Se solicitó ${essentialFound.map((b) => b.name).join(', ')}, pero se omitió ${missingEssential.map((b) => b.name).join(', ')}, necesario para la confirmación categórica en este escenario.`;
  } else {
    clinicalSummary = `La orden emitida no incluyó los biomarcadores discriminatorios prioritarios (${missingEssential.map((b) => b.name).join(', ')}) para confirmar la patología diana (${caseData.targetDisease}).`;
  }

  return {
    isFullyCorrect,
    isPartiallyCorrect,
    accuracyScore,
    budgetEfficiencyScore,
    orderedBiomarkerIds,
    essentialBiomarkersFound: essentialFound,
    complementaryBiomarkers: complementary,
    redundantBiomarkers: redundant,
    missingEssentialBiomarkers: missingEssential,
    totalBudgetCost,
    clinicalSummary
  };
};
