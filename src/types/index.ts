export type OrganSystem = 'cardiac' | 'hepatic' | 'metabolic' | 'renal' | 'pancreatic' | 'neuromuscular';

export type DifficultyLevel = 'intermedio' | 'avanzado' | 'experto';

export type ActiveModule =
  | 'inicio'
  | 'ciudad'
  | 'casos'
  | 'desafio'
  | 'biblioteca'
  | 'docencia'
  | 'practicas-seminarios'
  | 'laboratorios'
  | 'integracion-metabolica'
  | 'juegos'
  | 'reto-diario'
  | 'estadisticas'
  | 'ranking';

export interface BiomarkerReferenceValues {
  conventional: string;
  si: string;
}

export interface TemporalWindow {
  elevationStart: string;
  peak: string;
  normalizationWindow: string;
  halfLife?: string;
  peakWindow?: string;
}

export interface DiagnosticParams {
  sensitivity: string;
  specificity: string;
  optimalCutoff: string;
}

export interface FalsePositivesNegatives {
  falsePositives: string[];
  falseNegatives: string[];
}

export interface Biomarker {
  id: string;
  name: string;
  abbreviation: string;
  isoforms?: string;
  system: OrganSystem;
  referenceValues: BiomarkerReferenceValues;
  temporalWindow: TemporalWindow;
  diagnosticParams: DiagnosticParams;
  clinicalRelevance: string;
  diagnosticIndication: string;
  falsePositivesNegatives: FalsePositivesNegatives;
  discriminatoryContexts: string[];
  cost?: number;
  criticalThreshold?: string;
  category?: string;
}

export interface BiomarkerOption {
  id: string;
  biomarkerId: string;
  biomarkerName: string;
  isCorrect: boolean;
  biochemicalRationale: string;
  whyOptimalOrSuboptimal: string;
}

export interface DifferentialDiagnosis {
  disease: string;
  plausibilityRationale: string;
  isTargetDisease: boolean;
}

export interface ClinicalHistory {
  patientDemographics: {
    age: number;
    gender: string;
    occupation?: string;
  };
  chiefComplaint: string;
  presentIllness: string;
  pastMedicalHistory: string[];
  medications: string[];
  lifestyle?: string;
}

export interface PhysicalExamFinding {
  systemName: string;
  description: string;
}

export interface InitialLabTest {
  test: string;
  result: string;
  unit: string;
  referenceRange: string;
  isAbnormal?: boolean;
}

export interface ClinicalCase {
  id: string;
  title: string;
  system: OrganSystem;
  difficulty: DifficultyLevel;
  studentSummary: string;
  clinicalGlossary: { term: string; simpleDefinition: string }[];
  biochemicalConceptSimple: string;
  clinicalHistory: ClinicalHistory;
  physicalExam: {
    vitalSigns: {
      bp: string;
      hr: string;
      rr: string;
      temp: string;
      sao2: string;
    };
    findings: PhysicalExamFinding[];
  };
  initialLabWork: InitialLabTest[];
  differentialDiagnoses: DifferentialDiagnosis[];
  targetDisease: string;
  biomarkerOptions: BiomarkerOption[];
  expertClinicalKey: string;
  isMultiOrderCase?: boolean;
  essentialBiomarkerIds?: string[];
  categoryDocente?: string;
  signalingType?: string;
  molecularPathway?: string;
  molecularAlteration?: string;
}

export interface CaseAttemptRecord {
  caseId: string;
  caseTitle: string;
  system: OrganSystem;
  isCorrect: boolean;
  scoreEarned: number;
  timestamp: string;
  isMultiOrder?: boolean;
  orderedBiomarkerCount?: number;
  badgeUnlocked?: string;
  difficulty?: DifficultyLevel;
  selectedBiomarkerName?: string;
}

export interface SystemBadge {
  id: string;
  title: string;
  shortTitle?: string;
  category?: string;
  description: string;
  requirementDescription?: string;
  system?: OrganSystem;
  icon: string;
  themeColor?: string;
  badgeBg?: string;
  badgeBorder?: string;
  badgeTextColor?: string;
  minCasesRequired?: number;
  targetAccuracy?: number;
  isUnlocked?: boolean;
  currentAccuracy?: number;
  currentAttempted?: number;
  currentCorrect?: number;
  progressPct?: number;
  unlockedAt?: string;
}

export interface LabOrderEvaluation {
  isOptimal: boolean;
  score: number;
  orderedCount: number;
  costTotal: number;
  overRequestedCount: number;
  underRequestedCount: number;
  feedback: string[];
  optimalBiomarkers?: string[];
  missingEssentialCount?: number;
  correctBiomarkersFound?: string[];
  suboptimalBiomarkersFound?: string[];
  isFullyCorrect?: boolean;
  clinicalSummary?: string;
  essentialBiomarkersFound?: any[];
  missingEssentialBiomarkers?: any[];
  complementaryBiomarkers?: any[];
  redundantBiomarkers?: any[];
  isPartiallyCorrect?: boolean;
  orderedBiomarkerIds?: string[];
  accuracyScore?: number;
  budgetEfficiencyScore?: number;
  totalBudgetCost?: number;
}

export interface UserProgress {
  score: number;
  xp: number;
  lives: number;
  maxLives: number;
  budget: number;
  casesAttempted: number;
  casesCorrect: number;
  streak: number;
  currentLevel: DifficultyLevel;
  libraryConsultations: number;
  systemStats: Record<OrganSystem, { attempted: number; correct: number }>;
  history: CaseAttemptRecord[];
  unlockedBadges?: string[];
}
