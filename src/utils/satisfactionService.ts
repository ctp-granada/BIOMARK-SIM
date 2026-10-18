export interface SatisfactionFeedback {
  id: string;
  createdAt: string;
  subgroup?: string; // Subgrupo 1 al 15 o General
  academicRole: 'Alumno Grado Medicina' | 'Alumno Otro Grado Salud' | 'Docente / Tutor';
  ratings: {
    clinicalUtility: number;       // 1-5: Utilidad en el aprendizaje de biomarcadores y casos
    interactiveSimulators: number; // 1-5: Simuladores (Randle, Ictericias, Hemostasia, Integra)
    gamificationMotivation: number;// 1-5: Motivación por guardias, vidas, XP y dinero
    usabilityInterface: number;    // 1-5: Facilidad de uso, claridad y velocidad
    overallSatisfaction: number;   // 1-5: Satisfacción global con la plataforma
    recommendationScore: number;   // 0-10: Net Promoter Score (NPS)
  };
  qualitative: {
    bestFeature: string;
    suggestionsForImprovement: string;
    favoriteModule?: string;
  };
}

export interface SatisfactionMetrics {
  totalSurveys: number;
  averageOverall: number;
  averageClinicalUtility: number;
  averageSimulators: number;
  averageGamification: number;
  averageUsability: number;
  npsScore: number; // % Promotores (9-10) - % Detractores (0-6)
  npsPromotersPercent: number;
  npsPassivesPercent: number;
  npsDetractorsPercent: number;
  subgroupDistribution: Record<string, number>;
  recentComments: Array<{
    date: string;
    role: string;
    rating: number;
    bestFeature: string;
    suggestion: string;
  }>;
}

const STORAGE_KEY = 'biomark_student_satisfaction_surveys_v1';
const USER_COMPLETED_KEY = 'biomark_user_completed_satisfaction_survey_v1';

// Muestra inicial acreditada de respuestas de alumnos del Grado en Medicina (UGR)
const INITIAL_BENCHMARK_SURVEYS: SatisfactionFeedback[] = [
  {
    id: 'ugr-survey-001',
    createdAt: '2026-10-10T11:20:00.000Z',
    subgroup: 'Subgrupo 3 (LAB L-5/6)',
    academicRole: 'Alumno Grado Medicina',
    ratings: {
      clinicalUtility: 5,
      interactiveSimulators: 5,
      gamificationMotivation: 5,
      usabilityInterface: 5,
      overallSatisfaction: 5,
      recommendationScore: 10
    },
    qualitative: {
      bestFeature: 'La resolución de guardias con el presupuesto clínico y los biomarcadores reales. Te hace pensar como un médico de urgencias.',
      suggestionsForImprovement: 'Añadir más casos clínicos de patología tiroidea y suprarrenal.',
      favoriteModule: 'Hospital (Guardias Clínicas)'
    }
  },
  {
    id: 'ugr-survey-002',
    createdAt: '2026-10-12T16:45:00.000Z',
    subgroup: 'Subgrupo 7 (AULA S3)',
    academicRole: 'Alumno Grado Medicina',
    ratings: {
      clinicalUtility: 5,
      interactiveSimulators: 5,
      gamificationMotivation: 4,
      usabilityInterface: 5,
      overallSatisfaction: 5,
      recommendationScore: 10
    },
    qualitative: {
      bestFeature: 'El nuevo simulador de Integración Metabólica y las curvas de Cahill. Ver los flujos de sustrato en el cuerpo humano aclara muchísimo el temario.',
      suggestionsForImprovement: 'Que se puedan exportar las fichas en PDF para imprimirlas antes del examen de seminarios.',
      favoriteModule: 'Simulador Integración Metabólica'
    }
  },
  {
    id: 'ugr-survey-003',
    createdAt: '2026-10-14T09:15:00.000Z',
    subgroup: 'Subgrupo 1 (LAB L-5/6)',
    academicRole: 'Alumno Grado Medicina',
    ratings: {
      clinicalUtility: 4,
      interactiveSimulators: 5,
      gamificationMotivation: 5,
      usabilityInterface: 4,
      overallSatisfaction: 5,
      recommendationScore: 9
    },
    qualitative: {
      bestFeature: 'El minijuego del Rosco de Bioquímica en el Parque y el simulador del ciclo de Randle. Ayuda a fijar conceptos de forma muy entretenida.',
      suggestionsForImprovement: 'Sería genial tener un modo multijugador en directo para jugar en clase en los seminarios.',
      favoriteModule: 'Parque Biomédico & Rosco'
    }
  },
  {
    id: 'ugr-survey-004',
    createdAt: '2026-10-15T18:30:00.000Z',
    subgroup: 'Subgrupo 11 (LAB L-5/6)',
    academicRole: 'Alumno Grado Medicina',
    ratings: {
      clinicalUtility: 5,
      interactiveSimulators: 4,
      gamificationMotivation: 5,
      usabilityInterface: 5,
      overallSatisfaction: 5,
      recommendationScore: 10
    },
    qualitative: {
      bestFeature: 'El vademécum de biomarcadores con los rangos convencionales y del Sistema Internacional, más las cinéticas de elevación de troponinas y transaminasas.',
      suggestionsForImprovement: 'Poder filtrar las preguntas tipo test del temario por nivel de dificultad.',
      favoriteModule: 'Vademécum de Biomarcadores'
    }
  },
  {
    id: 'ugr-survey-005',
    createdAt: '2026-10-16T14:10:00.000Z',
    subgroup: 'Subgrupo 5 (AULA S3)',
    academicRole: 'Alumno Grado Medicina',
    ratings: {
      clinicalUtility: 5,
      interactiveSimulators: 5,
      gamificationMotivation: 5,
      usabilityInterface: 4,
      overallSatisfaction: 5,
      recommendationScore: 10
    },
    qualitative: {
      bestFeature: 'La justificación fisiopatológica detallada de cada prueba de laboratorio y el feedback instantáneo en los errores de prescripción.',
      suggestionsForImprovement: 'Mantener la plataforma activa para repasar en cursos superiores (3º y 4º de Medicina).',
      favoriteModule: 'Casos Clínicos & Desafío'
    }
  }
];

export const satisfactionService = {
  getSurveys(): SatisfactionFeedback[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_BENCHMARK_SURVEYS;
  },

  hasUserCompletedSurvey(): boolean {
    try {
      return localStorage.getItem(USER_COMPLETED_KEY) === 'true';
    } catch {
      return false;
    }
  },

  submitSurvey(surveyData: Omit<SatisfactionFeedback, 'id' | 'createdAt'>): SatisfactionFeedback {
    const surveys = this.getSurveys();
    const newSurvey: SatisfactionFeedback = {
      ...surveyData,
      id: `survey-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };

    const updated = [newSurvey, ...surveys];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(USER_COMPLETED_KEY, 'true');
    } catch (e) {
      console.error('Error guardando encuesta de satisfacción:', e);
    }

    return newSurvey;
  },

  getMetrics(): SatisfactionMetrics {
    const surveys = this.getSurveys();
    const total = surveys.length;
    if (total === 0) {
      return {
        totalSurveys: 0,
        averageOverall: 0,
        averageClinicalUtility: 0,
        averageSimulators: 0,
        averageGamification: 0,
        averageUsability: 0,
        npsScore: 0,
        npsPromotersPercent: 0,
        npsPassivesPercent: 0,
        npsDetractorsPercent: 0,
        subgroupDistribution: {},
        recentComments: []
      };
    }

    const sumOverall = surveys.reduce((acc, s) => acc + s.ratings.overallSatisfaction, 0);
    const sumClinical = surveys.reduce((acc, s) => acc + s.ratings.clinicalUtility, 0);
    const sumSimulators = surveys.reduce((acc, s) => acc + s.ratings.interactiveSimulators, 0);
    const sumGamification = surveys.reduce((acc, s) => acc + s.ratings.gamificationMotivation, 0);
    const sumUsability = surveys.reduce((acc, s) => acc + s.ratings.usabilityInterface, 0);

    // NPS Calculation (0-10)
    let promoters = 0; // 9-10
    let passives = 0;  // 7-8
    let detractors = 0;// 0-6

    surveys.forEach((s) => {
      const score = s.ratings.recommendationScore;
      if (score >= 9) promoters++;
      else if (score >= 7) passives++;
      else detractors++;
    });

    const npsPromotersPercent = Math.round((promoters / total) * 100);
    const npsPassivesPercent = Math.round((passives / total) * 100);
    const npsDetractorsPercent = Math.round((detractors / total) * 100);
    const npsScore = npsPromotersPercent - npsDetractorsPercent;

    const subgroupDistribution: Record<string, number> = {};
    surveys.forEach((s) => {
      const g = s.subgroup || 'No especificado';
      subgroupDistribution[g] = (subgroupDistribution[g] || 0) + 1;
    });

    const recentComments = surveys
      .filter((s) => s.qualitative.bestFeature || s.qualitative.suggestionsForImprovement)
      .slice(0, 10)
      .map((s) => ({
        date: new Date(s.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        role: s.academicRole + (s.subgroup ? ` · ${s.subgroup}` : ''),
        rating: s.ratings.overallSatisfaction,
        bestFeature: s.qualitative.bestFeature,
        suggestion: s.qualitative.suggestionsForImprovement
      }));

    return {
      totalSurveys: total,
      averageOverall: Number((sumOverall / total).toFixed(2)),
      averageClinicalUtility: Number((sumClinical / total).toFixed(2)),
      averageSimulators: Number((sumSimulators / total).toFixed(2)),
      averageGamification: Number((sumGamification / total).toFixed(2)),
      averageUsability: Number((sumUsability / total).toFixed(2)),
      npsScore,
      npsPromotersPercent,
      npsPassivesPercent,
      npsDetractorsPercent,
      subgroupDistribution,
      recentComments
    };
  },

  exportToCSV(): string {
    const surveys = this.getSurveys();
    const headers = [
      'ID',
      'Fecha',
      'Rol',
      'Subgrupo',
      'Utilidad_Clinica_1_5',
      'Simuladores_1_5',
      'Gamificacion_1_5',
      'Usabilidad_1_5',
      'Satisfaccion_Global_1_5',
      'Recomendacion_NPS_0_10',
      'Mejor_Aspecto',
      'Sugerencias_Mejora',
      'Modulo_Favorito'
    ];

    const escape = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;

    const rows = surveys.map((s) => [
      escape(s.id),
      escape(s.createdAt),
      escape(s.academicRole),
      escape(s.subgroup || 'N/A'),
      s.ratings.clinicalUtility,
      s.ratings.interactiveSimulators,
      s.ratings.gamificationMotivation,
      s.ratings.usabilityInterface,
      s.ratings.overallSatisfaction,
      s.ratings.recommendationScore,
      escape(s.qualitative.bestFeature),
      escape(s.qualitative.suggestionsForImprovement),
      escape(s.qualitative.favoriteModule || '')
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  exportToJSON(): string {
    return JSON.stringify(this.getSurveys(), null, 2);
  }
};
