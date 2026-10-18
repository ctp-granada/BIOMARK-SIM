/**
 * Duty Assistant Clinical Decision Support & Budget Optimization Engine
 */

import { ClinicalCase, Biomarker } from '../types';
import { BIOMARKERS_DATABASE } from '../data/biomarkers';
import { getBiomarkerCost } from './labOrderEvaluator';

export interface DutyAssistantAdvice {
  supervisorQuote: string;
  strategicTip: string;
  recommendedIds: string[];
  recommendedBiomarkers: {
    biomarker: Biomarker;
    cost: number;
    efficiencyRationale: string;
  }[];
  biomarkersToAvoid: {
    biomarkerName: string;
    reason: string;
  }[];
}

export function getDutyAssistantAdvice(
  currentCase: ClinicalCase,
  budget: number
): DutyAssistantAdvice {
  const system = currentCase.system;

  // Find the correct biomarker option from currentCase
  const correctOption = currentCase.biomarkerOptions.find((o) => o.isCorrect);
  const correctBiomarker = correctOption
    ? BIOMARKERS_DATABASE.find((b) => b.id === correctOption.biomarkerId)
    : null;

  // Filter relevant system biomarkers
  const systemBiomarkers = BIOMARKERS_DATABASE.filter((b) => b.system === system);
  const recommendedBiomarkerList: {
    biomarker: Biomarker;
    cost: number;
    efficiencyRationale: string;
  }[] = [];

  if (correctBiomarker) {
    recommendedBiomarkerList.push({
      biomarker: correctBiomarker,
      cost: getBiomarkerCost(correctBiomarker),
      efficiencyRationale:
        correctOption?.whyOptimalOrSuboptimal ||
        'Marcador de máxima especificidad diagnóstica para confirmar la hipótesis diana.'
    });
  }

  // Add 1 complementary biomarker from same system if available
  const complementary = systemBiomarkers.find(
    (b) => b.id !== correctBiomarker?.id
  );
  if (complementary && budget > 1500) {
    recommendedBiomarkerList.push({
      biomarker: complementary,
      cost: getBiomarkerCost(complementary),
      efficiencyRationale:
        'Prueba de apoyo para descartar diagnósticos alternativos o estadificar gravedad.'
    });
  }

  // Biomarkers to avoid (from other non-related systems or redundant markers)
  const avoidList: { biomarkerName: string; reason: string }[] = [];
  const unrelatedBiomarkers = BIOMARKERS_DATABASE.filter((b) => b.system !== system);

  if (unrelatedBiomarkers.length > 0) {
    const avoid1 = unrelatedBiomarkers[0];
    avoidList.push({
      biomarkerName: `${avoid1.name} (${avoid1.abbreviation}) - ${getBiomarkerCost(avoid1)} €`,
      reason: `No aporta valor discriminatorio para el cuadro de ${currentCase.title} y consume ${getBiomarkerCost(avoid1)} € innecesariamente.`
    });
  }
  if (unrelatedBiomarkers.length > 1 && budget <= 2000) {
    const avoid2 = unrelatedBiomarkers[1];
    avoidList.push({
      biomarkerName: `${avoid2.name} (${avoid2.abbreviation}) - ${getBiomarkerCost(avoid2)} €`,
      reason: 'Panel no relacionado con el sistema diana; penaliza fuertemente el presupuesto asistencial.'
    });
  }

  // Build supervisor quotes depending on budget status
  let quote = '';
  let tip = '';

  if (budget < 1000) {
    quote =
      '¡Atención clínica urgente! Nos queda menos de 1.000 € del presupuesto de guardia (partida de 5.000 €). No pidas perfiles generales: solicita exclusivamente el biomarcador patognomónico.';
    tip =
      'Pide solo el marcador con mayor razón de verosimilitud (LR+) para evitar la quiebra financiera del laboratorio.';
  } else if (budget <= 2000) {
    quote =
      'Presupuesto moderado (< 2.000 €). Optimiza el orden analítico evaluando la cinética temporal antes de pedir analíticas costosas.';
    tip =
      'Evita paneles redundantes que no modifiquen la conducta terapéutica inmediata.';
  } else {
    quote =
      'Dispones de suficiente solvencia económica (partida inicial de 5.000 €). Plantea un razonamiento fisiopatológico sólido confirmando la diana y descartando el diferencial.';
    tip =
      'Revisa la ventana temporal del cuadro clínico antes de solicitar marcadores de aclaramiento tardío.';
  }

  return {
    supervisorQuote: quote,
    strategicTip: tip,
    recommendedIds: recommendedBiomarkerList.map((r) => r.biomarker.id),
    recommendedBiomarkers: recommendedBiomarkerList,
    biomarkersToAvoid: avoidList
  };
}
