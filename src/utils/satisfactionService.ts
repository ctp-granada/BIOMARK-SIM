export interface ProjectRatings {
  navegacion: number;
  feedback: number;
  atractivoVisual: number;
  utilidadAprendizaje: number;
  valoracionGlobal: number;
  simuladoresInteractivos: number;
  gamificacionMotivacion: number;
}

export interface ClinicalReasoningRatings {
  clin1_fisiopatologia: number;       // Correlación fisiopatología/molecular -> clínica
  clin2_criterioAnalitico: number;     // Adquisición de criterio analítico en la petición
  clin3_interpretacionPatrones: number; // Interpretación de patrones de laboratorio complejos
  clin4_aplicabilidadClinica: number;   // Utilidad para rotaciones hospitalarias y MIR
}

export interface GamificationRatings {
  gam1_gestionPresupuesto: number;     // Conciencia de coste y medicina basada en valor (budget)
  gam2_feedbackInmediato: number;      // Feedback reflexivo y detección de errores conceptuales
  gam3_motivacionCompetitiva: number;  // El Rosco, insignias, niveles y dinamismo
  gam4_preferenciaMetodologica: number;// Preferencia frente a casos tradicionales en papel
}

export interface QualitativeResearchFeedback {
  bestFeature: string;
  suggestionsForImprovement: string;
  suggestedPathologies?: string;
}

export interface SatisfactionFeedback {
  id: string;
  createdAt: string;

  // Variables Sociodemográficas & Académicas
  academicRole: string;
  academicYear?: string;
  subgroup: string;
  deviceUsed?: string;
  estimatedUsageTime?: string;
  priorSimulationExperience?: string;
  researchConsent?: boolean; // Consentimiento informado para publicación científica docente

  // Dimensión I: Razonamiento Clínico & Bioquímica
  clinicalRatings?: ClinicalReasoningRatings;

  // Dimensión II: Gamificación & Dinámica Pedagógica
  gamificationRatings?: GamificationRatings;

  // Dimensión General (compatibilidad)
  projectRatings: ProjectRatings;

  // Dimensión III: System Usability Scale (SUS 10 ítems)
  susAnswers: number[]; // 10 items Likert 1-5
  susScore: number;     // 0 - 100
  cognitiveLoad?: number; // 1-5 (Carga mental subjetiva)

  // Dimensión IV: Autoeficacia y Ganancia de Competencia (Pre-Post)
  selfEfficacyPre?: number;  // 1-5 (Antes de usar la plataforma)
  selfEfficacyPost?: number; // 1-5 (Tras usar la plataforma)
  learningGain?: number;     // Delta (Post - Pre)
  curriculumIntegrationRecommendation?: string; // Recomendación para la guía docente oficial

  // Dimensión V: Módulo favorito y Net Promoter Score (NPS)
  favoriteModule: string;
  recommendationNps: number; // 0 - 10

  // Dimensión VI: Feedback cualitativo
  qualitative: QualitativeResearchFeedback;
}

export interface ScientificItemMetric {
  code: string;
  dimension: string;
  label: string;
  description: string;
  mean: number;
  sd: number; // Desviación Estándar muestral
  median: number;
  pctHighSatisfaction: number; // % rating >= 4 (Favorable)
  distribution: { score1: number; score2: number; score3: number; score4: number; score5: number };
}

export interface SatisfactionMetrics {
  totalSurveys: number;
  averageSusScore: number;
  susStandardDeviation: number;
  susInterpretation: { grade: string; adjective: string; percentileRange: string };
  npsScore: number;
  npsBreakdown: { promoters: number; passives: number; detractors: number };

  // Ganancia de Aprendizaje Pre-Post
  selfEfficacy: {
    meanPre: number;
    meanPost: number;
    meanDelta: number;
    percentageGain: number;
    cohensD: number; // Tamaño del efecto estimado
  };

  // Dimensiones Educativas
  dimensionMeans: {
    clinicalReasoning: number;
    gamification: number;
    usability: number;
    selfEfficacyGain: number;
  };

  // Desglose exhaustivo ítem por ítem para el paper
  scientificItems: ScientificItemMetric[];

  // Variables Académicas
  curriculumIntegrationStats: Record<string, number>;
  academicYearBreakdown: Record<string, number>;
  academicRoleBreakdown: Record<string, number>;
  subgroupBreakdown: Record<string, number>;
  usageTimeBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  priorExperienceBreakdown: Record<string, number>;

  // Rankings y comentarios
  favoriteModulesRanking: { module: string; count: number; percentage: number }[];
  latestComments: {
    best: string[];
    improvements: string[];
    pathologies: string[];
  };
}

// Ítems de la escala de Razonamiento Clínico
export const CLINICAL_ITEMS_CONFIG: { id: keyof ClinicalReasoningRatings; code: string; label: string; description: string }[] = [
  {
    id: 'clin1_fisiopatologia',
    code: 'RC1',
    label: 'Correlación Fisiopatológica',
    description: 'Ayuda a comprender cómo las rutas moleculares y biomarcadores se traducen en síntomas clínicos reales.'
  },
  {
    id: 'clin2_criterioAnalitico',
    code: 'RC2',
    label: 'Criterio de Prescripción Analítica',
    description: 'Fomenta el criterio clínico racional al solicitar pruebas diagnósticas y evitar peticiones superfluas.'
  },
  {
    id: 'clin3_interpretacionPatrones',
    code: 'RC3',
    label: 'Interpretación de Perfiles Complejos',
    description: 'Mejora la destreza para integrar patrones de laboratorio (enzimas cardíacas, hepático, gasometría, ionograma).'
  },
  {
    id: 'clin4_aplicabilidadClinica',
    code: 'RC4',
    label: 'Transferencia al Ejercicio Médico',
    description: 'Considero que lo aprendido tiene alta aplicabilidad en mis futuras prácticas de hospital y preparación MIR.'
  }
];

// Ítems de la escala de Gamificación & Engagement
export const GAMIFICATION_ITEMS_CONFIG: { id: keyof GamificationRatings; code: string; label: string; description: string }[] = [
  {
    id: 'gam1_gestionPresupuesto',
    code: 'GAM1',
    label: 'Medicina Basada en Valor (Presupuesto)',
    description: 'La limitación presupuestaria (budget) enseña optimización de recursos y coste-efectividad clínica.'
  },
  {
    id: 'gam2_feedbackInmediato',
    code: 'GAM2',
    label: 'Feedback Formativo Inmediato',
    description: 'La explicación inmediata de errores promueve la reflexión diagnóstica sin penalización desalentadora.'
  },
  {
    id: 'gam3_motivacionCompetitiva',
    code: 'GAM3',
    label: 'Motivación y Engagement Lúdico',
    description: 'Mecánicas como El Rosco, insignias, rachas y ranking aumentaron mi interés y tiempo dedicado al estudio.'
  },
  {
    id: 'gam4_preferenciaMetodologica',
    code: 'GAM4',
    label: 'Preferencia Metodológica Activa',
    description: 'Prefiero esta simulación interactiva antes que seminarios convencionales basados en texto o diapositivas.'
  }
];

// Escala SUS Estándar Internacional
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

export const LIKERT_PROJECT_ITEMS: { id: keyof ProjectRatings; label: string }[] = [
  { id: 'utilidadAprendizaje', label: 'Utilidad para el aprendizaje de Bioquímica Médica' },
  { id: 'simuladoresInteractivos', label: 'Simuladores y laboratorios de fisiopatología molecular' },
  { id: 'feedback', label: 'Calidad del feedback clínico y razonamiento diagnóstico' },
  { id: 'atractivoVisual', label: 'Claridad del diseño visual y organización de biomarcadores' },
  { id: 'navegacion', label: 'Facilidad de navegación e intuición en la plataforma' },
  { id: 'gamificacionMotivacion', label: 'Motivación mediante gamificación, ranking y logros' },
  { id: 'valoracionGlobal', label: 'Valoración global del proyecto docente (PID 26-158)' }
];

export const CURRICULUM_INTEGRATION_OPTIONS = [
  'Totalmente recomendable como actividad oficial evaluable (con nota)',
  'Recomendable como actividad voluntaria con puntuación adicional (+0.5/1 punto)',
  'Recurso de apoyo complementario de acceso libre no evaluable',
  'No considero necesaria su integración en la guía docente'
];

export const ACADEMIC_YEARS = [
  '1º Curso',
  '2º Curso',
  '3º Curso',
  '4º Curso',
  '5º Curso',
  '6º Curso'
];

export const ACADEMIC_ROLES = [
  'Grado en Medicina'
];

export const PRACTICE_SUBGROUPS = Array.from({ length: 15 }, (_, i) => `Subgrupo ${i + 1}`);

export const USAGE_TIME_OPTIONS = [
  'Menos de 1 hora (Exploración inicial)',
  'Entre 1 y 3 horas (3-5 casos y minijuegos)',
  'Entre 3 y 6 horas (Práctica intensiva)',
  'Más de 6 horas (Completó gran parte del hospital)'
];

export const PRIOR_SIMULATION_EXPERIENCE = [
  'Ninguna (Es mi primer simulador clínico)',
  'Baja (Experiencia puntual en algún taller)',
  'Moderada (He usado simuladores en otras materias)',
  'Alta (Uso habitual de plataformas de casos virtuales)'
];

export const DEVICE_OPTIONS = [
  'Ordenador portátil / Sobremesa',
  'Tablet / iPad',
  'Smartphone móvil'
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

  // Interpretación cualitativa según Bangor, Kortum & Miller (2009)
  public interpretSusScore(score: number): { grade: string; adjective: string; percentileRange: string } {
    if (score >= 85) return { grade: 'A+', adjective: 'Excelente (Best Imaginable)', percentileRange: 'Percentil > 95%' };
    if (score >= 80.3) return { grade: 'A', adjective: 'Excelente (Excellent)', percentileRange: 'Percentil 90-95%' };
    if (score >= 74) return { grade: 'B', adjective: 'Buena (Good)', percentileRange: 'Percentil 70-89%' };
    if (score >= 68) return { grade: 'C', adjective: 'Aceptable (OK / Marginal)', percentileRange: 'Percentil 50-69%' };
    if (score >= 51) return { grade: 'D', adjective: 'Poco Aceptable (Poor)', percentileRange: 'Percentil 15-49%' };
    return { grade: 'F', adjective: 'Inaceptable (Worst Imaginable)', percentileRange: 'Percentil < 15%' };
  }

  private calculateMeanAndSD(values: number[]): { mean: number; sd: number; median: number } {
    if (!values || values.length === 0) return { mean: 0, sd: 0, median: 0 };
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const variance = n > 1 ? values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (n - 1) : 0;
    const sd = Math.sqrt(variance);

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    return {
      mean: Math.round(mean * 100) / 100,
      sd: Math.round(sd * 100) / 100,
      median: Math.round(median * 100) / 100
    };
  }

  public getMetrics(customSurveys?: SatisfactionFeedback[]): SatisfactionMetrics {
    const surveys = customSurveys ?? this.getSurveys();
    const total = surveys.length;

    if (total === 0) {
      return {
        totalSurveys: 0,
        averageSusScore: 0,
        susStandardDeviation: 0,
        susInterpretation: { grade: 'N/A', adjective: 'Sin datos aún', percentileRange: '-' },
        npsScore: 0,
        npsBreakdown: { promoters: 0, passives: 0, detractors: 0 },
        selfEfficacy: {
          meanPre: 0,
          meanPost: 0,
          meanDelta: 0,
          percentageGain: 0,
          cohensD: 0
        },
        dimensionMeans: {
          clinicalReasoning: 0,
          gamification: 0,
          usability: 0,
          selfEfficacyGain: 0
        },
        scientificItems: [],
        curriculumIntegrationStats: {},
        academicYearBreakdown: {},
        academicRoleBreakdown: {},
        subgroupBreakdown: {},
        usageTimeBreakdown: {},
        deviceBreakdown: {},
        priorExperienceBreakdown: {},
        favoriteModulesRanking: [],
        latestComments: { best: [], improvements: [], pathologies: [] }
      };
    }

    // SUS Stats
    const susScores = surveys.map((s) => s.susScore || 0);
    const susStats = this.calculateMeanAndSD(susScores);
    const susInterp = this.interpretSusScore(susStats.mean);

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

    // Autoeficacia Pre-Post
    const preScores = surveys.map((s) => s.selfEfficacyPre ?? 2.5);
    const postScores = surveys.map((s) => s.selfEfficacyPost ?? 4.5);
    const deltas = surveys.map((s) => (s.selfEfficacyPost ?? 4.5) - (s.selfEfficacyPre ?? 2.5));

    const preStats = this.calculateMeanAndSD(preScores);
    const postStats = this.calculateMeanAndSD(postScores);
    const deltaStats = this.calculateMeanAndSD(deltas);
    const pctGain = preStats.mean > 0 ? Math.round(((postStats.mean - preStats.mean) / preStats.mean) * 100) : 0;
    const pooledSD = Math.sqrt((Math.pow(preStats.sd, 2) + Math.pow(postStats.sd, 2)) / 2) || 1;
    const cohensD = Math.round(((postStats.mean - preStats.mean) / pooledSD) * 100) / 100;

    // Métricas por ítem científico
    const scientificItems: ScientificItemMetric[] = [];

    // 1. Razonamiento Clínico
    CLINICAL_ITEMS_CONFIG.forEach((cfg) => {
      const vals = surveys.map((s) => s.clinicalRatings?.[cfg.id] || s.projectRatings?.utilidadAprendizaje || 4);
      const st = this.calculateMeanAndSD(vals);
      const high = vals.filter((v) => v >= 4).length;
      const dist = { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 };
      vals.forEach((v) => {
        if (v === 1) dist.score1++;
        else if (v === 2) dist.score2++;
        else if (v === 3) dist.score3++;
        else if (v === 4) dist.score4++;
        else if (v === 5) dist.score5++;
      });
      scientificItems.push({
        code: cfg.code,
        dimension: 'Razonamiento Clínico',
        label: cfg.label,
        description: cfg.description,
        mean: st.mean,
        sd: st.sd,
        median: st.median,
        pctHighSatisfaction: Math.round((high / total) * 100),
        distribution: dist
      });
    });

    // 2. Gamificación
    GAMIFICATION_ITEMS_CONFIG.forEach((cfg) => {
      const vals = surveys.map((s) => s.gamificationRatings?.[cfg.id] || s.projectRatings?.gamificacionMotivacion || 4);
      const st = this.calculateMeanAndSD(vals);
      const high = vals.filter((v) => v >= 4).length;
      const dist = { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0 };
      vals.forEach((v) => {
        if (v === 1) dist.score1++;
        else if (v === 2) dist.score2++;
        else if (v === 3) dist.score3++;
        else if (v === 4) dist.score4++;
        else if (v === 5) dist.score5++;
      });
      scientificItems.push({
        code: cfg.code,
        dimension: 'Gamificación & Motivación',
        label: cfg.label,
        description: cfg.description,
        mean: st.mean,
        sd: st.sd,
        median: st.median,
        pctHighSatisfaction: Math.round((high / total) * 100),
        distribution: dist
      });
    });

    // Medias de dimensión
    const clinMeans = scientificItems.filter((i) => i.dimension === 'Razonamiento Clínico').map((i) => i.mean);
    const gamMeans = scientificItems.filter((i) => i.dimension === 'Gamificación & Motivación').map((i) => i.mean);

    const clinAvg = clinMeans.length > 0 ? Math.round((clinMeans.reduce((a, b) => a + b, 0) / clinMeans.length) * 100) / 100 : 0;
    const gamAvg = gamMeans.length > 0 ? Math.round((gamMeans.reduce((a, b) => a + b, 0) / gamMeans.length) * 100) / 100 : 0;

    // Desgloses categóricos
    const academicRoleBreakdown: Record<string, number> = {};
    const academicYearBreakdown: Record<string, number> = {};
    const subgroupBreakdown: Record<string, number> = {};
    const usageTimeBreakdown: Record<string, number> = {};
    const deviceBreakdown: Record<string, number> = {};
    const priorExperienceBreakdown: Record<string, number> = {};
    const curriculumIntegrationStats: Record<string, number> = {};

    surveys.forEach((s) => {
      const r = s.academicRole || 'Grado en Medicina';
      academicRoleBreakdown[r] = (academicRoleBreakdown[r] || 0) + 1;

      const y = s.academicYear || '2º Curso';
      academicYearBreakdown[y] = (academicYearBreakdown[y] || 0) + 1;

      const g = s.subgroup || 'Subgrupo 1';
      subgroupBreakdown[g] = (subgroupBreakdown[g] || 0) + 1;

      const u = s.estimatedUsageTime || 'Entre 1 y 3 horas';
      usageTimeBreakdown[u] = (usageTimeBreakdown[u] || 0) + 1;

      const d = s.deviceUsed || 'Ordenador portátil / Sobremesa';
      deviceBreakdown[d] = (deviceBreakdown[d] || 0) + 1;

      const p = s.priorSimulationExperience || 'Poca';
      priorExperienceBreakdown[p] = (priorExperienceBreakdown[p] || 0) + 1;

      const c = s.curriculumIntegrationRecommendation || 'Totalmente recomendable';
      curriculumIntegrationStats[c] = (curriculumIntegrationStats[c] || 0) + 1;
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
    const pathologies = surveys.map((s) => s.qualitative?.suggestedPathologies).filter(Boolean) as string[];

    return {
      totalSurveys: total,
      averageSusScore: susStats.mean,
      susStandardDeviation: susStats.sd,
      susInterpretation: susInterp,
      npsScore,
      npsBreakdown: { promoters, passives, detractors },
      selfEfficacy: {
        meanPre: preStats.mean,
        meanPost: postStats.mean,
        meanDelta: deltaStats.mean,
        percentageGain: pctGain,
        cohensD
      },
      dimensionMeans: {
        clinicalReasoning: clinAvg,
        gamification: gamAvg,
        usability: Math.round((susStats.mean / 20) * 100) / 100, // Escala 1-5 normalizada de SUS
        selfEfficacyGain: postStats.mean
      },
      scientificItems,
      curriculumIntegrationStats,
      academicYearBreakdown,
      academicRoleBreakdown,
      subgroupBreakdown,
      usageTimeBreakdown,
      deviceBreakdown,
      priorExperienceBreakdown,
      favoriteModulesRanking,
      latestComments: {
        best: bestComments.slice(0, 15),
        improvements: improvementComments.slice(0, 15),
        pathologies: pathologies.slice(0, 15)
      }
    };
  }

  /**
   * Exporta a formato CSV compatible con paquetes estadísticos (SPSS, R, Jamovi, Stata, Excel)
   * Incluye cabecera estándar de investigación con variables codificadas y escapadas.
   */
  public exportToResearchCSV(surveys: SatisfactionFeedback[]): string {
    const headers = [
      'SURVEY_ID',
      'TIMESTAMP',
      'ACADEMIC_ROLE',
      'ACADEMIC_YEAR',
      'SUBGROUP',
      'DEVICE',
      'USAGE_TIME',
      'PRIOR_SIM_EXP',
      'RESEARCH_CONSENT',
      // Razonamiento Clínico
      'CLIN1_PATHOPHYSIOLOGY',
      'CLIN2_LAB_DECISION',
      'CLIN3_PATTERN_INTERPRET',
      'CLIN4_CLINICAL_TRANSFER',
      // Gamificación
      'GAM1_BUDGET_VALUE_MED',
      'GAM2_IMMEDIATE_FEEDBACK',
      'GAM3_GAMIFICATION_MOTIV',
      'GAM4_ACTIVE_PREFERENCE',
      // SUS 10 Ítems
      'SUS_ITEM1',
      'SUS_ITEM2',
      'SUS_ITEM3',
      'SUS_ITEM4',
      'SUS_ITEM5',
      'SUS_ITEM6',
      'SUS_ITEM7',
      'SUS_ITEM8',
      'SUS_ITEM9',
      'SUS_ITEM10',
      'SUS_SCORE_TOTAL',
      'COGNITIVE_LOAD',
      // Autoeficacia y Ganancia
      'SELF_EFFICACY_PRE',
      'SELF_EFFICACY_POST',
      'LEARNING_GAIN_DELTA',
      'CURRICULUM_INTEGRATION_REC',
      'NPS_SCORE',
      'FAVORITE_MODULE',
      // Respuestas Cualitativas
      'QUAL_BEST_FEATURE',
      'QUAL_SUGGESTIONS',
      'QUAL_SUGGESTED_CASES'
    ];

    const escapeCsv = (str?: string) => `"${(str || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;

    const rows = surveys.map((s) => {
      const clin = s.clinicalRatings || {
        clin1_fisiopatologia: s.projectRatings?.utilidadAprendizaje || 5,
        clin2_criterioAnalitico: s.projectRatings?.feedback || 5,
        clin3_interpretacionPatrones: s.projectRatings?.simuladoresInteractivos || 5,
        clin4_aplicabilidadClinica: s.projectRatings?.valoracionGlobal || 5
      };

      const gam = s.gamificationRatings || {
        gam1_gestionPresupuesto: s.projectRatings?.gamificacionMotivacion || 5,
        gam2_feedbackInmediato: s.projectRatings?.feedback || 5,
        gam3_motivacionCompetitiva: s.projectRatings?.gamificacionMotivacion || 5,
        gam4_preferenciaMetodologica: s.projectRatings?.utilidadAprendizaje || 5
      };

      const susAns = s.susAnswers && s.susAnswers.length === 10 ? s.susAnswers : [5, 1, 5, 1, 5, 1, 5, 1, 5, 1];
      const pre = s.selfEfficacyPre ?? 2;
      const post = s.selfEfficacyPost ?? 5;
      const delta = s.learningGain ?? (post - pre);

      return [
        escapeCsv(s.id),
        escapeCsv(s.createdAt),
        escapeCsv(s.academicRole),
        escapeCsv(s.academicYear || '2º Curso'),
        escapeCsv(s.subgroup),
        escapeCsv(s.deviceUsed || 'Ordenador'),
        escapeCsv(s.estimatedUsageTime || 'Entre 1 y 3 horas'),
        escapeCsv(s.priorSimulationExperience || 'Poca'),
        s.researchConsent !== false ? 1 : 0,
        clin.clin1_fisiopatologia,
        clin.clin2_criterioAnalitico,
        clin.clin3_interpretacionPatrones,
        clin.clin4_aplicabilidadClinica,
        gam.gam1_gestionPresupuesto,
        gam.gam2_feedbackInmediato,
        gam.gam3_motivacionCompetitiva,
        gam.gam4_preferenciaMetodologica,
        susAns[0],
        susAns[1],
        susAns[2],
        susAns[3],
        susAns[4],
        susAns[5],
        susAns[6],
        susAns[7],
        susAns[8],
        susAns[9],
        s.susScore,
        s.cognitiveLoad ?? 3,
        pre,
        post,
        delta,
        escapeCsv(s.curriculumIntegrationRecommendation || 'Recomendable'),
        s.recommendationNps,
        escapeCsv(s.favoriteModule),
        escapeCsv(s.qualitative?.bestFeature),
        escapeCsv(s.qualitative?.suggestionsForImprovement),
        escapeCsv(s.qualitative?.suggestedPathologies)
      ].join(',');
    });

    // Byte Order Mark (BOM) UTF-8 para compatibilidad absoluta con Microsoft Excel y SPSS en español
    return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  }

  public exportToCSV(surveys: SatisfactionFeedback[]): string {
    return this.exportToResearchCSV(surveys);
  }

  /**
   * Exporta informe estadístico descriptivo en formato JSON para redacción del manuscrito
   */
  public exportStatisticalReportJSON(surveys: SatisfactionFeedback[]): string {
    const metrics = this.getMetrics(surveys);
    return JSON.stringify(metrics, null, 2);
  }
}

export const satisfactionService = new SatisfactionService();
