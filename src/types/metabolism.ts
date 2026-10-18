export type MetabolicStateId =
  | 'postprandial'
  | 'early_fasting'
  | 'late_fasting'
  | 'starvation'
  | 'insulin_resistance'
  | 'diabetes_t1_dka'
  | 'exercise_moderate'
  | 'exercise_intense';

export type OrganId =
  | 'liver'
  | 'muscle'
  | 'adipose'
  | 'brain'
  | 'gut'
  | 'kidney'
  | 'heart'
  | 'pancreas'
  | 'erythrocyte'
  | 'hypothalamus';

export type SubstrateId =
  | 'glucose'
  | 'free_fatty_acids'
  | 'ketone_bodies'
  | 'lactate'
  | 'alanine'
  | 'glycerol'
  | 'amino_acids'
  | 'vldl_chylomicrons'
  | 'urea';

export interface HormoneConcentration {
  name: string;
  symbol: string;
  level: 'muy_bajo' | 'bajo' | 'normal' | 'elevado' | 'muy_elevado';
  valueText: string;
  percent: number; // 0 - 100 for visual gauge
  color: string;
  sourceOrgan: string;
  primaryAction: string;
}

export interface BloodSubstrateMetric {
  id: SubstrateId;
  name: string;
  valueText: string;
  normalRange: string;
  status: 'normal' | 'elevado' | 'muy_elevado' | 'disminuido' | 'muy_disminuido';
  unit: string;
  description: string;
}

export interface EnzymeActivity {
  name: string;
  abbreviation: string;
  pathway: string;
  cellularLocation:
    | 'Citosol'
    | 'Mitocondria'
    | 'Retículo Endoplásmico'
    | 'Membrana Plasmática'
    | string;
  status: 'activa' | 'muy_activa' | 'inhibida' | 'reprimida' | 'inactiva';
  mechanism: string; // e.g., "Desfosforilada por PP1", "Alostérica por F-2,6-BP", "Activada por PKA"
  allostericModulators?: {
    activators: string[];
    inhibitors: string[];
  };
}

export interface OrganMetabolicProfile {
  organId: OrganId;
  organName: string;
  emoji: string;
  roleSummary: string;
  primaryFuelUsed: string;
  fuelProducedOrExported: string;
  keyEnzymes: EnzymeActivity[];
  activePathways: string[];
  inhibitedPathways: string[];
  transportersActive: string[]; // e.g. "GLUT2", "GLUT4", "CD36", "MCT1/MCT2"
  physiologicalNote: string;
  atpGenerationStrategy: string;
}

export interface InterOrganFlux {
  id: string;
  sourceOrgan: OrganId;
  targetOrgan: OrganId;
  substrate: SubstrateId;
  substrateName: string;
  rate: 'nulo' | 'bajo' | 'moderado' | 'alto' | 'masivo';
  directionDescription: string;
  biochemicalPurpose: string;
  pathwayInvolved: string;
}

export interface MetabolicState {
  id: MetabolicStateId;
  title: string;
  subtitle: string;
  category: 'Fisiológico Normal' | 'Ayuno & Inanición' | 'Patología Clínica' | 'Gasto Energético & Ejercicio';
  timeframe: string;
  summary: string;
  hormones: {
    insulin: HormoneConcentration;
    glucagon: HormoneConcentration;
    epinephrine: HormoneConcentration;
    cortisol: HormoneConcentration;
    ampkActivity: {
      status: 'baja' | 'moderada' | 'alta' | 'máxima';
      description: string;
      percent: number;
    };
    igRatio: {
      ratio: number;
      text: string;
      state: 'muy_alto' | 'alto' | 'equilibrado' | 'bajo' | 'muy_bajo' | 'cero';
    };
  };
  bloodSubstrates: BloodSubstrateMetric[];
  organProfiles: Partial<Record<OrganId, OrganMetabolicProfile>>;
  fluxes: InterOrganFlux[];
  hallmarkFeatures: string[];
  clinicalOrPhysiologicalContext: string;
  keyRegulatorySwitch: {
    title: string;
    description: string;
    enzyme: string;
    allostericOrCovalent: string;
  };
}

export interface PathwayNode {
  id: string;
  name: string;
  formulaOrFormulaName?: string;
  compartment: 'Citosol' | 'Mitocondria';
}

export interface PathwayReaction {
  id: string;
  from: string;
  to: string;
  enzyme: string;
  coenzymes?: string;
  isRateLimiting?: boolean;
  activityInCurrentState: 'muy_activa' | 'activa' | 'inactiva' | 'inhibida';
  regulationNote: string;
}

export interface BiochemicalPathwayModel {
  id: string;
  name: string;
  organ: string;
  description: string;
  mainSubstrates: string[];
  mainProducts: string[];
  masterSwitch: string;
  reactions: PathwayReaction[];
  clinicalRelevance: string;
}

export interface ClinicalCaseQuestion {
  id: string;
  patientScenario: string;
  symptoms: string[];
  labValues: { parameter: string; value: string; reference: string }[];
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  biochemicalExplanation: string;
  keyTakeaway: string;
  relatedStateId: MetabolicStateId;
}

export type DietPresetId =
  | 'custom'
  | 'high_carb'
  | 'keto_lchf'
  | 'high_protein'
  | 'balanced'
  | 'fasting_early'
  | 'fasting_late';

export interface DietaryComposition {
  carbsGrams: number;
  lipidsGrams: number;
  proteinGrams: number;
  preset: DietPresetId;
  totalCalories: number;
  respiratoryQuotient: number; // RQ: 0.70 to 1.00
  estimatedInsulin: number; // uU/mL
  estimatedGlucagon: number; // pg/mL
}

export interface DetailedEnzyme {
  id: string;
  name: string;
  abbreviation: string;
  ecNumber: string;
  pathway: string;
  compartment:
    | 'Citosol'
    | 'Mitocondria'
    | 'Membrana Plasmática'
    | 'Retículo Endoplásmico'
    | string;
  reactionText: string;
  substrates: string[];
  products: string[];
  coenzymes: string[];
  allostericActivators: string[];
  allostericInhibitors: string[];
  covalentRegulation: string;
  clinicalRelevance: string;
}

export interface DetailedSubstrate {
  id: string;
  name: string;
  formula: string;
  role: string;
  compartment: 'Citosol' | 'Mitocondria' | 'Circulación Sanguínea' | string;
  anabolicFate: string;
  catabolicFate: string;
  allostericRole: string;
  associatedEnzymes: string[];
}

