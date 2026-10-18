export type OrganSystem = 'cardiac' | 'hepatic' | 'metabolic' | 'renal' | 'pancreatic' | 'neuromuscular';

export type DifficultyLevel = 'intermedio' | 'avanzado' | 'experto';

export type ActiveModule = 
  | 'inicio'
  | 'ciudad'
  | 'casos' 
  | 'desafio' 
  | 'reto-diario' 
  | 'laboratorios' 
  | 'juegos'
  | 'docencia'
  | 'practicas-seminarios'
  | 'biblioteca' 
  | 'integracion-metabolica'
  | 'estadisticas' 
  | 'ranking' 
  | 'prompt-arquitectura';

export interface BiomarkerReferenceValues {
  conventional: string;
  si: string;
  genderAgeVariations?: string;
}

export interface TemporalWindow {
  elevationStart: string; // Ej. "2 - 4 horas"
  peakWindow: string;    // Ej. "12 - 24 horas"
  normalizationWindow: string; // Ej. "7 - 14 días"
  halfLife?: string;
}

export interface DiagnosticParams {
  sensitivity: string; // Ej. "96.5% en T0-T3h"
  specificity: string; // Ej. "98.2% para necrosis miocárdica"
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
  clinicalRelevance: string; // Mecanismo bioquímico y fisiopatológico
  diagnosticIndication: string; // Indicaciones principales
  falsePositivesNegatives: FalsePositivesNegatives;
  discriminatoryContexts: string[]; // Contextos de diagnóstico diferencial donde destaca
}

export interface PatientDemographics {
  age: number;
  gender: 'Masculino' | 'Femenino' | 'Otro';
  occupation: string;
}

export interface ClinicalHistory {
  patientDemographics: PatientDemographics;
  chiefComplaint: string;
  presentIllness: string;
  pastMedicalHistory: string[];
  medications: string[];
  lifestyle: string;
}

export interface VitalSigns {
  bp: string;
  hr: string;
  rr: string;
  temp: string;
  sao2: string;
}

export interface PhysicalExamFinding {
  systemName: string;
  description: string;
}

export interface PhysicalExam {
  vitalSigns: VitalSigns;
  findings: PhysicalExamFinding[];
}

export interface LabResult {
  test: string;
  result: string;
  unit: string;
  referenceRange: string;
  isAbnormal?: boolean;
}

export interface DifferentialDiagnosis {
  disease: string;
  plausibilityRationale: string;
  isTargetDisease: boolean;
}

export interface BiomarkerOption {
  id: string;
  biomarkerId: string;
  biomarkerName: string;
  isCorrect: boolean;
  biochemicalRationale: string; // Fundamentación científica rigurosa
  whyOptimalOrSuboptimal: string; // Por qué es el más discriminatorio o por qué falla frente a las alternativas
}

export interface LabOrderItem {
  biomarker: Biomarker;
  status: 'essential' | 'complementary' | 'redundant' | 'missing';
  cost: number;
  clinicalNote: string;
}

export interface LabOrderEvaluation {
  isFullyCorrect: boolean;
  isPartiallyCorrect?: boolean;
  accuracyScore: number; // 0 - 100
  budgetEfficiencyScore: number; // 0 - 100
  orderedBiomarkerIds: string[];
  essentialBiomarkersFound: Biomarker[];
  complementaryBiomarkers: Biomarker[];
  redundantBiomarkers: Biomarker[];
  missingEssentialBiomarkers: Biomarker[];
  totalBudgetCost: number;
  clinicalSummary: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  system: OrganSystem;
  difficulty: DifficultyLevel;
  clinicalHistory: ClinicalHistory;
  physicalExam: PhysicalExam;
  initialLabWork: LabResult[];
  differentialDiagnoses: DifferentialDiagnosis[];
  targetDisease: string;
  biomarkerOptions: BiomarkerOption[];
  expertClinicalKey: string;
  essentialBiomarkerIds?: string[];
  categoryDocente?: string;
  signalingType?: string;
  molecularPathway?: string;
  molecularAlteration?: string;
  studentSummary?: string;
  clinicalGlossary?: { term: string; simpleDefinition: string }[];
  biochemicalConceptSimple?: string;
}

export interface CaseAttemptRecord {
  caseId: string;
  caseTitle: string;
  system: OrganSystem;
  difficulty?: DifficultyLevel;
  selectedBiomarkerId: string;
  selectedBiomarkerName: string;
  isCorrect: boolean;
  consultedLibrary: boolean;
  scoreEarned: number;
  timestamp: string;
  isMultiOrder?: boolean;
  orderedBiomarkerCount?: number;
  badgeUnlocked?: string;
}

export interface SystemBadge {
  id: string;
  system?: OrganSystem;
  title: string;
  shortTitle: string;
  category: 'system' | 'special';
  description: string;
  requirementDescription: string;
  icon: string;
  themeColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeTextColor: string;
  minCasesRequired: number;
  targetAccuracy: number; // e.g. 90
  isUnlocked: boolean;
  currentAccuracy: number;
  currentAttempted: number;
  currentCorrect: number;
  progressPct: number; // 0 to 100
}

export interface UserProgress {
  score: number;
  xp: number;
  lives: number;
  maxLives: number;
  budget: number; // Fondos de guardia en Euros (€) (ej. 5.000 € iniciales)
  casesAttempted: number;
  casesCorrect: number;
  streak: number;
  currentLevel: DifficultyLevel;
  libraryConsultations: number;
  systemStats: Record<OrganSystem, { attempted: number; correct: number }>;
  history: CaseAttemptRecord[];
  unlockedBadges?: string[];
}
