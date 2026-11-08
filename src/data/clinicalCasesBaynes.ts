import { ClinicalCase } from '../types';
import { buildCase } from './caseBuilder';
import { BAYNES_CASES_1 } from './casesBaynes1';
import { BAYNES_CASES_2 } from './casesBaynes2';
import { BAYNES_CASES_3 } from './casesBaynes3';
import { BAYNES_CASES_4 } from './casesBaynes4';

// Casos añadidos en noviembre de 2026 a partir de los pacientes del Baynes (y de los casos de
// aminoácidos aportados por el profesorado) que aún no estaban en la plataforma.
// Pacientes, edades y circunstancias son nuevos; el nivel está pensado para 1.º de Medicina.

export const BAYNES_CASES: ClinicalCase[] = [
  ...BAYNES_CASES_1,
  ...BAYNES_CASES_2,
  ...BAYNES_CASES_3,
  ...BAYNES_CASES_4,
].map(buildCase);
