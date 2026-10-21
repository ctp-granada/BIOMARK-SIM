export interface ProjectRatings {
  navegacion: number;
  feedback: number;
  atractivoVisual: number;
  utilidadAprendizaje: number;
  valoracionGlobal: number;
  simuladoresInteractivos: number;
  gamificacionMotivacion: number;
}

export interface QualitativeFeedback {
  bestFeature: string;
  suggestionsForImprovement: string;
}

export interface SatisfactionFeedback {
  id: string;
  createdAt: string;
  academicRole: string;
  subgroup: string;
  projectRatings: ProjectRatings;
  susAnswers: number[]; // 10 items Likert 1-5
  susScore: number;     // 0 - 100
  recommendationNps: number; // 0 - 10
  favoriteModule: string;
  qualitative: QualitativeFeedback;
}

export interface IndicatorMetric {
  id: keyof ProjectRatings;
  label: string;
  average: number;
  pctHighSatisfaction: number; // % rating >= 4
}

export interface SatisfactionMetrics {
  totalSurveys: number;
  averageSusScore: number;
  npsScore: number;
  indicators: IndicatorMetric[];
  npsBreakdown: {
    promoters: number;
    passives: number;
    detractors: number;
  };
  subgroupBreakdown: Record<string, number>;
  favoriteModulesRanking: { module: string; count: number; percentage: number }[];
  latestComments: {
    best: string[];
    improvements: string[];
  };
}

export const LIKERT_PROJECT_ITEMS: { id: keyof ProjectRatings; label: string }[] = [
  { id: 'utilidadAprendizaje', label: 'Utilidad para el aprendizaje de Bioquímica Médica' },
  { id: 'simuladoresInteractivos', label: 'Simuladores y laboratorios de fisiopatología molecular' },
  { id: 'feedback', label: 'Calidad del feedback clínico y razonamiento diagnóstico' },
  { id: 'atractivoVisual', label: 'Claridad del diseño visual y organización de biomarcadores' },
  { id: 'navegacion', label: 'Facilidad de navegación e intuición en la plataforma' },
  { id: 'gamificacionMotivacion', label: 'Motivación mediante gamificación, ranking y logros' },
  { id: 'valoracionGlobal', label: 'Valoración global del proyecto docente (PID 26-158)' }
];

export const SUS_STATEMENTS: { id: number; text: string; positive: boolean }[] = [
  { id: 1, text: 'Creo que me gustaría utilizar este sistema con frecuencia en mi formación médica.', positive: true },
  { id: 2, text: 'Encontré el sistema innecesariamente complejo.', positive: false },
  { id: 3, text: 'Pensé que el sistema era fácil de usar e intuitivo.', positive: true },
  { id: 4, text: 'Creo que necesitaría el apoyo de un técnico para poder utilizar este sistema.', positive: false },
  { id: 5, text: 'Encontré que las diversas funciones de este sistema estaban muy bien integradas.', positive: true },
  { id: 6, text: 'Pensé que había demasiada inconsistencia en este sistema.', positive: false },
  { id: 7, text: 'Imagino que la mayoría de estudiantes de medicina aprenderían a usar este sistema muy rápidamente.', positive: true },
  { id: 8, text: 'Encontré el sistema muy engorroso o molesto de utilizar.', positive: false },
  { id: 9, text: 'Me sentí muy seguro y confiado utilizando el sistema.', positive: true },
  { id: 10, text: 'Necesité aprender muchas cosas antes de poder empezar a manejar este sistema.', positive: false }
];

const STORAGE_KEY = 'biomark_satisfaction_surveys';
const USER_COMPLETED_KEY = 'biomark_user_survey_completed';

// Limpieza proactiva de datos mock anteriores en el navegador
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && (raw.includes('ugr-survey-') || raw.includes('benchmark'))) {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

class SatisfactionService {
  private listeners: ((completed: boolean) => void)[] = [];

  public getSurveys(): SatisfactionFeedback[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed: SatisfactionFeedback[] = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.filter((s) => !s.id.startsWith('ugr-survey-')) : [];
    } catch {
      return [];
    }
  }

  public hasCompletedSurvey(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(USER_COMPLETED_KEY) === 'true';
  }

  public hasUserCompletedSurvey(): boolean {
    return this.hasCompletedSurvey();
  }

  public subscribeToSurveyStatus(cb: (completed: boolean) => void): () => void {
    this.listeners.push(cb);
    cb(this.hasCompletedSurvey());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notifyStatusChange(completed: boolean) {
    this.listeners.forEach((cb) => cb(completed));
  }

  public async saveSurvey(survey: Omit<SatisfactionFeedback, 'id' | 'createdAt'>): Promise<SatisfactionFeedback> {
    const newSurvey: SatisfactionFeedback = {
      ...survey,
      id: 'survey-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString()
    };

    const current = this.getSurveys();
    const updated = [newSurvey, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(USER_COMPLETED_KEY, 'true');
    }

    this.notifyStatusChange(true);
    return newSurvey;
  }

  public clearAllSurveys(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_COMPLETED_KEY);
    }
    this.notifyStatusChange(false);
  }

  public calculateSusScore(answers: number[]): number {
    if (!answers || answers.length !== 10) return 0;
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const isOdd = (i + 1) % 2 === 1;
      const val = answers[i] || 3;
      if (isOdd) {
        sum += (val - 1);
      } else {
        sum += (5 - val);
      }
    }
    return Math.min(100, Math.max(0, Math.round(sum * 2.5 * 10) / 10));
  }

  public getMetrics(): SatisfactionMetrics {
    const surveys = this.getSurveys();
    const total = surveys.length;

    if (total === 0) {
      return {
        totalSurveys: 0,
        averageSusScore: 0,
        npsScore: 0,
        indicators: LIKERT_PROJECT_ITEMS.map((item) => ({
          id: item.id,
          label: item.label,
          average: 0,
          pctHighSatisfaction: 0
        })),
        npsBreakdown: { promoters: 0, passives: 0, detractors: 0 },
        subgroupBreakdown: {},
        favoriteModulesRanking: [],
        latestComments: { best: [], improvements: [] }
      };
    }

    // SUS promedio
    const avgSus = Math.round((surveys.reduce((acc, s) => acc + (s.susScore || 0), 0) / total) * 10) / 10;

    // NPS
    let promoters = 0;
    let passives = 0;
    let detractors = 0;
    surveys.forEach((s) => {
      const nps = s.recommendationNps ?? 10;
      if (nps >= 9) promoters++;
      else if (nps >= 7) passives++;
      else detractors++;
    });
    const npsScore = Math.round(((promoters - detractors) / total) * 100);

    // Indicadores Likert 1-5
    const indicators: IndicatorMetric[] = LIKERT_PROJECT_ITEMS.map((item) => {
      const ratings = surveys.map((s) => s.projectRatings?.[item.id] || 0).filter((v) => v > 0);
      const count = ratings.length;
      if (count === 0) {
        return { id: item.id, label: item.label, average: 0, pctHighSatisfaction: 0 };
      }
      const avg = Math.round((ratings.reduce((a, b) => a + b, 0) / count) * 10) / 10;
      const highSat = ratings.filter((r) => r >= 4).length;
      const pctHigh = Math.round((highSat / count) * 100);
      return { id: item.id, label: item.label, average: avg, pctHighSatisfaction: pctHigh };
    });

    // Subgrupos
    const subgroupBreakdown: Record<string, number> = {};
    surveys.forEach((s) => {
      const g = s.subgroup || 'Sin especificar';
      subgroupBreakdown[g] = (subgroupBreakdown[g] || 0) + 1;
    });

    // Módulos favoritos
    const moduleCounts: Record<string, number> = {};
    surveys.forEach((s) => {
      if (s.favoriteModule) {
        moduleCounts[s.favoriteModule] = (moduleCounts[s.favoriteModule] || 0) + 1;
      }
    });
    const favoriteModulesRanking = Object.entries(moduleCounts)
      .map(([mod, cnt]) => ({
        module: mod,
        count: cnt,
        percentage: Math.round((cnt / total) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Comentarios cualitativos
    const bestComments = surveys.map((s) => s.qualitative?.bestFeature).filter(Boolean) as string[];
    const improvementComments = surveys.map((s) => s.qualitative?.suggestionsForImprovement).filter(Boolean) as string[];

    return {
      totalSurveys: total,
      averageSusScore: avgSus,
      npsScore,
      indicators,
      npsBreakdown: { promoters, passives, detractors },
      subgroupBreakdown,
      favoriteModulesRanking,
      latestComments: {
        best: bestComments.slice(0, 10),
        improvements: improvementComments.slice(0, 10)
      }
    };
  }

  public exportToCSV(surveys: SatisfactionFeedback[]): string {
    const headers = [
      'ID',
      'Fecha',
      'Rol',
      'Subgrupo',
      'SUS_Score',
      'NPS (0-10)',
      'Modulo_Favorito',
      'Utilidad_Aprendizaje',
      'Simuladores_Interactivos',
      'Feedback_Clinico',
      'Atractivo_Visual',
      'Navegacion',
      'Gamificacion',
      'Valoracion_Global',
      'Punto_Fuerte',
      'Propuesta_Mejora'
    ];

    const rows = surveys.map((s) => [
      s.id,
      s.createdAt,
      `"${s.academicRole}"`,
      `"${s.subgroup}"`,
      s.susScore,
      s.recommendationNps,
      `"${s.favoriteModule}"`,
      s.projectRatings.utilidadAprendizaje,
      s.projectRatings.simuladoresInteractivos,
      s.projectRatings.feedback,
      s.projectRatings.atractivoVisual,
      s.projectRatings.navegacion,
      s.projectRatings.gamificacionMotivacion,
      s.projectRatings.valoracionGlobal,
      `"${(s.qualitative.bestFeature || '').replace(/"/g, '""')}"`,
      `"${(s.qualitative.suggestionsForImprovement || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const satisfactionService = new SatisfactionService();
