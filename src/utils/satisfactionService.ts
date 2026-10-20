/**
 * BIOMARK-SIM · Encuesta de satisfacción y usabilidad del alumnado
 * Adaptado a la Escala SUS (System Usability Scale) e Indicadores del PID 26-158 (UGR)
 */

import { saveSatisfactionSurveyToCloud, fetchSatisfactionSurveysFromCloud } from '../lib/firebase';

export const SUS_QUESTIONS = [
  'Creo que me gustaría utilizar esta herramienta con frecuencia.',
  'Encontré la herramienta innecesariamente compleja.',
  'Pensé que la herramienta era fácil de usar.',
  'Creo que necesitaría el apoyo de una persona experta para poder utilizarla.',
  'Encontré que las distintas funciones de la herramienta estaban bien integradas.',
  'Pensé que había demasiada inconsistencia en la herramienta.',
  'Imagino que la mayoría de las personas aprenderían a utilizarla muy rápidamente.',
  'Encontré la herramienta muy difícil de utilizar.',
  'Me sentí muy seguro/a utilizando la herramienta.',
  'Necesité aprender muchas cosas antes de poder empezar a usarla.'
];

export const LIKERT_PROJECT_ITEMS = [
  { id: 'navegacion', title: 'Facilidad de navegación', help: 'Encontrar lo que buscas y moverte por la plataforma es sencillo.', objetivo: 4 },
  { id: 'feedback', title: 'Claridad de las respuestas analíticas (feedback)', help: 'Las explicaciones que recibes al acertar o fallar son claras.', objetivo: 4 },
  { id: 'atractivoVisual', title: 'Atractivo visual', help: 'El diseño y las imágenes de la plataforma resultan atractivos.', objetivo: 4 },
  { id: 'utilidadAprendizaje', title: 'Utilidad para el aprendizaje', help: 'La plataforma me ayuda a aprender y a razonar la bioquímica clínica.', objetivo: 4 },
  { id: 'valoracionGlobal', title: 'Valoración global de la herramienta', help: 'Valoración general de la plataforma como apoyo a la asignatura.', objetivo: 4 },
  { id: 'simuladoresInteractivos', title: 'Simuladores interactivos', help: 'Integra, ciclo de Randle, ictericias, hemostasia…', objetivo: 4 },
  { id: 'gamificacionMotivacion', title: 'Gamificación y motivación', help: 'Guardias, presupuesto, ranking y retos me animan a estudiar con constancia.', objetivo: 4 }
];

export const AVAILABLE_MODULES = [
  'Simulador de Integración Metabólica (Integra)',
  'Hospital Clínico (Guardias y Casos Clínicos)',
  'Simulador de Ictericias',
  'Simulador del Ciclo de Randle',
  'Simulador de Hemostasia',
  'Parque Biomédico y Rosco de Bioquímica',
  'Vademécum de Biomarcadores',
  'Temario y Preguntas Test'
];

export interface SatisfactionFeedback {
  id: string;
  createdAt: string;
  academicRole: 'Alumno/a del Grado en Medicina' | 'Alumno/a del Grado en Enfermería' | 'Otro';
  subgroup: string; // 'Prefiero no indicarlo' | 'Subgrupo 1' ... 'Subgrupo 15'
  
  // 1. Indicadores Proyecto (1 a 5)
  projectRatings: {
    navegacion: number;
    feedback: number;
    atractivoVisual: number;
    utilidadAprendizaje: number;
    valoracionGlobal: number;
    simuladoresInteractivos: number;
    gamificacionMotivacion: number;
  };

  // 2. Escala SUS (10 preguntas, 1 a 5)
  susAnswers: number[]; // Array de 10 números
  susScore: number;     // 0 a 100

  // 3. Recomendación (0 a 10)
  recommendationNps: number;

  // 4. Módulo y Cualitativas
  favoriteModule?: string;
  qualitative: {
    bestFeature: string;
    suggestionsForImprovement: string;
  };
}

export interface IndicatorMetric {
  id: string;
  nombre: string;
  n: number;
  media: number;
  de: number;
  pctGe4: number; // Porcentaje >= 4 (o >= 68 para SUS)
  objetivo: number;
  alcanzado: boolean;
}

export interface SatisfactionMetrics {
  totalSurveys: number;
  indicators: IndicatorMetric[];
  susMetric: IndicatorMetric;
  npsScore: number; // % Promotores (9-10) - % Detractores (0-6)
  npsPromotersPercent: number;
  npsPassivesPercent: number;
  npsDetractorsPercent: number;
  subgroupDistribution: Record<string, number>;
  roleDistribution: Record<string, number>;
  favoriteModulesRanking: Array<{ module: string; count: number }>;
  recentComments: Array<{
    date: string;
    role: string;
    subgroup: string;
    susScore: number;
    overallRating: number;
    bestFeature: string;
    suggestion: string;
  }>;
}

const STORAGE_KEY = 'biomark_student_satisfaction_surveys_v2';
const USER_COMPLETED_KEY = 'biomark_user_completed_satisfaction_survey_v2';
const surveyStatusListeners = new Set<(completed: boolean) => void>();

export function calculateSusScore(answers: number[]): number {
  if (!answers || answers.length !== 10) return 0;
  const rawSum = answers.reduce((acc, val, i) => {
    // Items impares (1, 3, 5, 7, 9 -> índices 0, 2, 4, 6, 8): val - 1
    // Items pares (2, 4, 6, 8, 10 -> índices 1, 3, 5, 7, 9): 5 - val
    return acc + (i % 2 === 0 ? val - 1 : 5 - val);
  }, 0);
  return Math.min(100, Math.max(0, Math.round(rawSum * 2.5 * 10) / 10));
}

// Limpieza inicial de encuestas mock de pruebas previas en el navegador
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && (raw.includes('ugr-survey-001') || raw.includes('ugr-survey-'))) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

export const satisfactionService = {
  getSurveys(): SatisfactionFeedback[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filtrar cualquier encuesta ficticia de prueba
          const realSurveys = parsed.filter((s) => s && s.id && !s.id.startsWith('ugr-survey-'));
          return realSurveys;
        }
      }
    } catch {
      // Fallback
    }
    return []; // Cero encuestas iniciales (sin datos ficticios)
  },

  clearAllSurveys(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_COMPLETED_KEY);
      this.notifyListeners(false);
    } catch (e) {
      console.error(e);
    }
  },

  resetUserSurveyCompletion(): void {
    try {
      localStorage.removeItem(USER_COMPLETED_KEY);
      this.notifyListeners(false);
    } catch (e) {
      console.error(e);
    }
  },

  setUserSurveyCompleted(completed: boolean): void {
    try {
      if (completed) {
        localStorage.setItem(USER_COMPLETED_KEY, 'true');
      } else {
        localStorage.removeItem(USER_COMPLETED_KEY);
      }
      this.notifyListeners(completed);
    } catch (e) {
      console.error(e);
    }
  },

  subscribeToSurveyStatus(callback: (completed: boolean) => void): () => void {
    surveyStatusListeners.add(callback);
    return () => {
      surveyStatusListeners.delete(callback);
    };
  },

  notifyListeners(completed: boolean): void {
    surveyStatusListeners.forEach((cb) => {
      try {
        cb(completed);
      } catch (err) {
        console.error('Error in survey listener callback:', err);
      }
    });
  },

  hasUserCompletedSurvey(): boolean {
    try {
      return localStorage.getItem(USER_COMPLETED_KEY) === 'true';
    } catch {
      return false;
    }
  },

  submitSurvey(surveyData: Omit<SatisfactionFeedback, 'id' | 'createdAt' | 'susScore'>): SatisfactionFeedback {
    const surveys = this.getSurveys();
    const susScore = calculateSusScore(surveyData.susAnswers);
    
    const newSurvey: SatisfactionFeedback = {
      ...surveyData,
      susScore,
      id: `survey-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };

    const updated = [newSurvey, ...surveys];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(USER_COMPLETED_KEY, 'true');
      this.notifyListeners(true);
    } catch (e) {
      console.error('Error guardando encuesta de satisfacción localmente:', e);
    }

    // Persistencia transparente en la nube (Firestore)
    saveSatisfactionSurveyToCloud(newSurvey).catch((err) => {
      console.warn('Sincronización en Firestore pendiente (modo offline):', err);
    });

    return newSurvey;
  },

  async syncCloudSurveys(): Promise<SatisfactionFeedback[]> {
    try {
      const cloudSurveys = await fetchSatisfactionSurveysFromCloud();
      if (cloudSurveys && cloudSurveys.length > 0) {
        const localSurveys = this.getSurveys();
        const map = new Map<string, SatisfactionFeedback>();
        cloudSurveys.forEach((s) => map.set(s.id, s));
        localSurveys.forEach((s) => map.set(s.id, s));
        const merged = Array.from(map.values());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (e) {
      console.warn('No se pudieron descargar encuestas de Firestore:', e);
    }
    return this.getSurveys();
  },

  getMetrics(): SatisfactionMetrics {
    const surveys = this.getSurveys();
    const total = surveys.length;

    if (total === 0) {
      const indicators: IndicatorMetric[] = LIKERT_PROJECT_ITEMS.map((item) => ({
        id: item.id,
        nombre: item.title,
        n: 0,
        media: 0,
        de: 0,
        pctGe4: 0,
        objetivo: item.objetivo,
        alcanzado: false
      }));

      const susMetric: IndicatorMetric = {
        id: 'sus',
        nombre: 'Puntuación SUS Global (System Usability Scale 0–100)',
        n: 0,
        media: 0,
        de: 0,
        pctGe4: 0,
        objetivo: 68,
        alcanzado: false
      };

      return {
        totalSurveys: 0,
        indicators,
        susMetric,
        npsScore: 0,
        npsPromotersPercent: 0,
        npsPassivesPercent: 0,
        npsDetractorsPercent: 0,
        subgroupDistribution: {},
        roleDistribution: {},
        favoriteModulesRanking: [],
        recentComments: []
      };
    }

    // Helper statistics functions
    const calcMean = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    const calcStdDev = (arr: number[], mean: number) => {
      if (arr.length < 2) return 0;
      const variance = arr.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (arr.length - 1);
      return Math.sqrt(variance);
    };
    const calcPctGe = (arr: number[], threshold: number) => {
      return arr.length ? arr.filter((x) => x >= threshold).length / arr.length : 0;
    };

    // Calculate metrics for each project indicator
    const indicators: IndicatorMetric[] = LIKERT_PROJECT_ITEMS.map((item) => {
      const vals = surveys.map((s) => (s.projectRatings as any)?.[item.id] || 5);
      const media = calcMean(vals);
      const de = calcStdDev(vals, media);
      const pctGe4 = calcPctGe(vals, item.objetivo);
      return {
        id: item.id,
        nombre: item.title,
        n: vals.length,
        media: Number(media.toFixed(2)),
        de: Number(de.toFixed(2)),
        pctGe4: Math.round(pctGe4 * 100),
        objetivo: item.objetivo,
        alcanzado: media >= item.objetivo
      };
    });

    // Calculate SUS metric
    const susVals = surveys.map((s) => s.susScore || calculateSusScore(s.susAnswers || []));
    const susMedia = calcMean(susVals);
    const susDe = calcStdDev(susVals, susMedia);
    const susPctGe68 = calcPctGe(susVals, 68);
    const susMetric: IndicatorMetric = {
      id: 'sus',
      nombre: 'Puntuación SUS Global (System Usability Scale 0–100)',
      n: susVals.length,
      media: Number(susMedia.toFixed(2)),
      de: Number(susDe.toFixed(2)),
      pctGe4: Math.round(susPctGe68 * 100),
      objetivo: 68,
      alcanzado: susMedia >= 68
    };

    // NPS Calculation
    let promoters = 0; // 9-10
    let passives = 0;  // 7-8
    let detractors = 0;// 0-6

    surveys.forEach((s) => {
      const score = s.recommendationNps ?? 10;
      if (score >= 9) promoters++;
      else if (score >= 7) passives++;
      else detractors++;
    });

    const npsPromotersPercent = Math.round((promoters / (total || 1)) * 100);
    const npsPassivesPercent = Math.round((passives / (total || 1)) * 100);
    const npsDetractorsPercent = Math.round((detractors / (total || 1)) * 100);
    const npsScore = npsPromotersPercent - npsDetractorsPercent;

    // Subgroup & Role distributions
    const subgroupDistribution: Record<string, number> = {};
    const roleDistribution: Record<string, number> = {};
    const modCount: Record<string, number> = {};

    surveys.forEach((s) => {
      const g = s.subgroup || 'Prefiero no indicarlo';
      subgroupDistribution[g] = (subgroupDistribution[g] || 0) + 1;

      const r = s.academicRole || 'Alumno/a del Grado en Medicina';
      roleDistribution[r] = (roleDistribution[r] || 0) + 1;

      if (s.favoriteModule) {
        modCount[s.favoriteModule] = (modCount[s.favoriteModule] || 0) + 1;
      }
    });

    const favoriteModulesRanking = Object.entries(modCount)
      .map(([module, count]) => ({ module, count }))
      .sort((a, b) => b.count - a.count);

    const recentComments = surveys
      .filter((s) => s.qualitative.bestFeature || s.qualitative.suggestionsForImprovement)
      .slice(0, 10)
      .map((s) => ({
        date: new Date(s.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        role: s.academicRole,
        subgroup: s.subgroup,
        susScore: s.susScore,
        overallRating: s.projectRatings?.valoracionGlobal || 5,
        bestFeature: s.qualitative.bestFeature,
        suggestion: s.qualitative.suggestionsForImprovement
      }));

    return {
      totalSurveys: total,
      indicators,
      susMetric,
      npsScore,
      npsPromotersPercent,
      npsPassivesPercent,
      npsDetractorsPercent,
      subgroupDistribution,
      roleDistribution,
      favoriteModulesRanking,
      recentComments
    };
  },

  exportToCSV(): string {
    const metrics = this.getMetrics();
    const surveys = this.getSurveys();
    const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;

    const lines: string[] = [];

    // Header Sheet 1: Resumen de Indicadores PID 26-158
    lines.push('INFORME ESTADÍSTICO DE USABILIDAD Y CALIDAD DOCENTE (PID 26-158 · UGR)');
    lines.push(`Fecha de generación: ${new Date().toLocaleString('es-ES')}`);
    lines.push(`Muestra total de estudiantes (n): ${surveys.length}`);
    lines.push('');
    lines.push('Indicador,n,Media,Desviación Estándar (DE),% Cumple Objetivo,Objetivo,¿Alcanzado?');

    // Indicators rows
    metrics.indicators.forEach((ind) => {
      lines.push([
        escape(ind.nombre),
        ind.n,
        ind.media.toFixed(2),
        ind.de.toFixed(2),
        `${ind.pctGe4}%`,
        ind.objetivo,
        ind.alcanzado ? 'Sí' : 'No'
      ].join(','));
    });

    // SUS Row
    lines.push([
      escape(metrics.susMetric.nombre),
      metrics.susMetric.n,
      metrics.susMetric.media.toFixed(2),
      metrics.susMetric.de.toFixed(2),
      `${metrics.susMetric.pctGe4}%`,
      metrics.susMetric.objetivo,
      metrics.susMetric.alcanzado ? 'Sí' : 'No'
    ].join(','));

    // NPS Row
    lines.push([
      escape('NPS (% Promotores - % Detractores)'),
      surveys.length,
      metrics.npsScore,
      '',
      `${metrics.npsPromotersPercent}% promotores / ${metrics.npsDetractorsPercent}% detractores`,
      '>= +50',
      metrics.npsScore >= 50 ? 'Sí' : 'No'
    ].join(','));

    lines.push('');
    lines.push('DETALLE INDIVIDUAL DE ENCUESTAS');
    
    // Detailed rows
    const detailHeaders = [
      'ID',
      'Fecha',
      'Perfil Académico',
      'Subgrupo',
      'SUS_Score_0_100',
      'NPS_0_10',
      'Navegacion',
      'Feedback_Analitico',
      'Atractivo_Visual',
      'Utilidad_Aprendizaje',
      'Valoracion_Global',
      'Simuladores',
      'Gamificacion',
      'Modulo_Favorito',
      'Lo_que_mas_ha_ayudado',
      'Propuestas_Mejora'
    ];
    lines.push(detailHeaders.join(','));

    surveys.forEach((s) => {
      lines.push([
        escape(s.id),
        escape(s.createdAt),
        escape(s.academicRole),
        escape(s.subgroup),
        s.susScore,
        s.recommendationNps,
        s.projectRatings.navegacion,
        s.projectRatings.feedback,
        s.projectRatings.atractivoVisual,
        s.projectRatings.utilidadAprendizaje,
        s.projectRatings.valoracionGlobal,
        s.projectRatings.simuladoresInteractivos,
        s.projectRatings.gamificacionMotivacion,
        escape(s.favoriteModule || ''),
        escape(s.qualitative.bestFeature),
        escape(s.qualitative.suggestionsForImprovement)
      ].join(','));
    });

    return '\uFEFF' + lines.join('\r\n');
  },

  exportFirestoreSurveysToCSV(surveys: SatisfactionFeedback[]): string {
    const lines: string[] = [];
    const escape = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    // Header informativo para memoria de innovación docente UGR
    lines.push('RESPUESTAS DE ENCUESTAS DE SATISFACCIÓN Y USABILIDAD (BASE DE DATOS FIRESTORE)');
    lines.push('Proyecto de Innovación Docente PID 26-158 · Facultad de Medicina · Universidad de Granada');
    lines.push('Colección Firestore: satisfaction_surveys');
    lines.push(`Fecha de descarga: ${new Date().toLocaleString('es-ES')}`);
    lines.push(`Total de encuestas recopiladas en Firestore: ${surveys.length}`);
    lines.push('');

    // Encabezados detallados con items individuales SUS y valoraciones
    const headers = [
      'ID_Firestore',
      'Fecha_Registro',
      'Perfil_Academico',
      'Subgrupo_Practicas',
      'SUS_Score_0_100',
      'SUS_Valoracion_Adjetival',
      'NPS_Recomendacion_0_10',
      'NPS_Categoria',
      'P1_Navegacion_1_5',
      'P2_Claridad_Feedback_1_5',
      'P3_Atractivo_Visual_1_5',
      'P4_Utilidad_Aprendizaje_1_5',
      'P5_Valoracion_Global_1_5',
      'P6_Simuladores_Interactivos_1_5',
      'P7_Gamificacion_Motivacion_1_5',
      'SUS_Q1_Uso_Frecuente_1_5',
      'SUS_Q2_Complejidad_1_5',
      'SUS_Q3_Facilidad_Uso_1_5',
      'SUS_Q4_Necesidad_Apoyo_1_5',
      'SUS_Q5_Funciones_Integradas_1_5',
      'SUS_Q6_Inconsistencia_1_5',
      'SUS_Q7_Rapido_Aprender_1_5',
      'SUS_Q8_Dificultad_Uso_1_5',
      'SUS_Q9_Confianza_Seguridad_1_5',
      'SUS_Q10_Mucho_Por_Aprender_1_5',
      'Modulo_Mas_Util',
      'Aspecto_Que_Mas_Ha_Ayudado',
      'Sugerencias_De_Mejora'
    ];
    lines.push(headers.map((h) => escape(h)).join(','));

    surveys.forEach((s) => {
      const susAdj =
        s.susScore >= 80.3
          ? 'Excelente (Grado A)'
          : s.susScore >= 68
          ? 'Bueno / Aceptable (Grado B)'
          : s.susScore >= 51
          ? 'Marginal (Grado C/D)'
          : 'Inaceptable (Grado F)';
      const npsCat =
        s.recommendationNps >= 9 ? 'Promotor' : s.recommendationNps >= 7 ? 'Pasivo' : 'Detractor';
      const susQ = (idx: number) => s.susAnswers?.[idx] ?? '';

      lines.push([
        escape(s.id),
        escape(s.createdAt),
        escape(s.academicRole),
        escape(s.subgroup),
        s.susScore,
        escape(susAdj),
        s.recommendationNps,
        escape(npsCat),
        s.projectRatings?.navegacion ?? '',
        s.projectRatings?.feedback ?? '',
        s.projectRatings?.atractivoVisual ?? '',
        s.projectRatings?.utilidadAprendizaje ?? '',
        s.projectRatings?.valoracionGlobal ?? '',
        s.projectRatings?.simuladoresInteractivos ?? '',
        s.projectRatings?.gamificacionMotivacion ?? '',
        susQ(0),
        susQ(1),
        susQ(2),
        susQ(3),
        susQ(4),
        susQ(5),
        susQ(6),
        susQ(7),
        susQ(8),
        susQ(9),
        escape(s.favoriteModule || ''),
        escape(s.qualitative?.bestFeature || ''),
        escape(s.qualitative?.suggestionsForImprovement || '')
      ].join(','));
    });

    return '\uFEFF' + lines.join('\r\n');
  },

  exportToJSON(): string {
    return JSON.stringify({
      metrics: this.getMetrics(),
      surveys: this.getSurveys()
    }, null, 2);
  }
};
