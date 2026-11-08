import { Biomarker, ClinicalCase, DifficultyLevel, OrganSystem } from '../types';

// Forma abreviada para escribir casos y pruebas sin repetir la estructura completa en cada uno.

type Option = [biomarkerId: string, name: string, rationale: string, why: string];

export interface CaseSpec {
  id: string;
  title: string;
  system: OrganSystem;
  difficulty: DifficultyLevel;
  summary: string;
  glossary: [string, string][];
  concept: string;
  patient: { age: number; ageLabel?: string; gender: string; occupation?: string };
  complaint: string;
  illness: string;
  history: string[];
  meds: string[];
  lifestyle?: string;
  vitals: [bp: string, hr: string, rr: string, temp: string, sao2: string];
  exam: [string, string][];
  labs: [test: string, result: string, unit: string, ref: string][];
  target: string;
  targetWhy: string;
  differentials: [string, string][];
  correct: Option;
  distractors: Option[];
  key: string;
  category: string;
  pathway: string;
  alteration: string;
}

export function buildCase(s: CaseSpec): ClinicalCase {
  const tag = s.id.replace(/^case_/, '').replace(/_\d+$/, '');
  return {
    id: s.id,
    title: s.title,
    system: s.system,
    difficulty: s.difficulty,
    studentSummary: s.summary,
    clinicalGlossary: s.glossary.map(([term, simpleDefinition]) => ({ term, simpleDefinition })),
    biochemicalConceptSimple: s.concept,
    clinicalHistory: {
      patientDemographics: s.patient,
      chiefComplaint: s.complaint,
      presentIllness: s.illness,
      pastMedicalHistory: s.history,
      medications: s.meds,
      lifestyle: s.lifestyle,
    },
    physicalExam: {
      vitalSigns: { bp: s.vitals[0], hr: s.vitals[1], rr: s.vitals[2], temp: s.vitals[3], sao2: s.vitals[4] },
      findings: s.exam.map(([systemName, description]) => ({ systemName, description })),
    },
    initialLabWork: s.labs.map(([test, result, unit, referenceRange]) => ({ test, result, unit, referenceRange })),
    differentialDiagnoses: [
      { disease: s.target, plausibilityRationale: s.targetWhy, isTargetDisease: true },
      ...s.differentials.map(([disease, plausibilityRationale]) => ({ disease, plausibilityRationale, isTargetDisease: false })),
    ],
    targetDisease: s.target,
    biomarkerOptions: [
      { id: `bm_opt_${tag}_correct`, biomarkerId: s.correct[0], biomarkerName: s.correct[1], isCorrect: true, biochemicalRationale: s.correct[2], whyOptimalOrSuboptimal: s.correct[3] },
      ...s.distractors.map(([biomarkerId, biomarkerName, biochemicalRationale, whyOptimalOrSuboptimal], i) => ({
        id: `bm_opt_${tag}_distractor_${i + 1}`,
        biomarkerId,
        biomarkerName,
        isCorrect: false,
        biochemicalRationale,
        whyOptimalOrSuboptimal,
      })),
    ],
    expertClinicalKey: s.key,
    essentialBiomarkerIds: [s.correct[0]],
    categoryDocente: s.category,
    molecularPathway: s.pathway,
    molecularAlteration: s.alteration,
  };
}

export interface BiomarkerSpec {
  id: string;
  name: string;
  abbreviation: string;
  system: OrganSystem;
  reference: string;
  timing: [start: string, peak: string, normalization: string];
  performance: [sensitivity: string, specificity: string, cutoff: string];
  relevance: string;
  indication: string;
  falsePositives: string[];
  falseNegatives: string[];
  discriminates: string[];
  cost: number;
}

export function buildBiomarker(b: BiomarkerSpec): Biomarker {
  return {
    id: b.id,
    name: b.name,
    abbreviation: b.abbreviation,
    system: b.system,
    referenceValues: { conventional: b.reference, si: b.reference },
    temporalWindow: { elevationStart: b.timing[0], peak: b.timing[1], normalizationWindow: b.timing[2] },
    diagnosticParams: { sensitivity: b.performance[0], specificity: b.performance[1], optimalCutoff: b.performance[2] },
    clinicalRelevance: b.relevance,
    diagnosticIndication: b.indication,
    falsePositivesNegatives: { falsePositives: b.falsePositives, falseNegatives: b.falseNegatives },
    discriminatoryContexts: b.discriminates,
    cost: b.cost,
  };
}
