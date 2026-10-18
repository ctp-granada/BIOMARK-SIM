/**
 * Encuesta de satisfacción y usabilidad del alumnado (BIOMARK-SIM)
 *
 * - Las respuestas se guardan de forma ANÓNIMA en la tabla `encuestas_satisfaccion` de Supabase
 *   (ver supabase/encuesta_satisfaccion.sql). No se guarda el usuario ni el correo.
 * - Solo las cuentas de coordinación (tabla `coordinadores_encuesta`) pueden leer los resultados.
 * - No hay respuestas de ejemplo ni valores por defecto: todo lo que aparece en las métricas
 *   procede de respuestas reales.
 */

import { supabase } from '../lib/supabase';

export type AcademicRole = 'Alumno/a Grado en Medicina' | 'Alumno/a Grado en Enfermería' | 'Otro';

/** Ítems de la evaluación del proyecto (escala Likert 1-5) */
export const PROJECT_ITEMS = [
  { key: 'navegacion', label: 'Facilidad de navegación', description: 'Encontrar lo que buscas y moverte por la plataforma es sencillo.' },
  { key: 'claridad_feedback', label: 'Claridad de las respuestas analíticas (feedback)', description: 'Las explicaciones que recibes al acertar o fallar son claras.' },
  { key: 'atractivo_visual', label: 'Atractivo visual', description: 'El diseño y las imágenes de la plataforma resultan atractivos.' },
  { key: 'utilidad_aprendizaje', label: 'Utilidad para el aprendizaje', description: 'La plataforma me ayuda a aprender y a razonar la bioquímica clínica.' },
  { key: 'valoracion_global', label: 'Valoración global de la herramienta', description: 'Valoración general de la plataforma como apoyo a la asignatura.' },
] as const;

/** Ítems complementarios (Likert 1-5) */
export const EXTRA_ITEMS = [
  { key: 'simuladores', label: 'Simuladores interactivos', description: 'Integra, ciclo de Randle, ictericias, hemostasia…' },
  { key: 'gamificacion', label: 'Gamificación y motivación', description: 'Guardias, presupuesto, ranking y retos me animan a estudiar con constancia.' },
] as const;

/** System Usability Scale (SUS), versión en español. Escala 1 (muy en desacuerdo) - 5 (muy de acuerdo) */
export const SUS_ITEMS = [
  'Creo que me gustaría utilizar esta herramienta con frecuencia.',
  'Encontré la herramienta innecesariamente compleja.',
  'Pensé que la herramienta era fácil de usar.',
  'Creo que necesitaría el apoyo de una persona experta para poder utilizarla.',
  'Encontré que las distintas funciones de la herramienta estaban bien integradas.',
  'Pensé que había demasiada inconsistencia en la herramienta.',
  'Imagino que la mayoría de las personas aprenderían a utilizarla muy rápidamente.',
  'Encontré la herramienta muy difícil de utilizar.',
  'Me sentí muy seguro/a utilizando la herramienta.',
  'Necesité aprender muchas cosas antes de poder empezar a usarla.',
];

export type ProjectItemKey = (typeof PROJECT_ITEMS)[number]['key'];
export type ExtraItemKey = (typeof EXTRA_ITEMS)[number]['key'];

export interface SurveySubmission {
  perfil: AcademicRole;
  subgrupo: string;
  items: Record<ProjectItemKey | ExtraItemKey, number>;
  sus: number[]; // 10 valores 1-5
  nps: number; // 0-10
  mejor_aspecto: string;
  sugerencias: string;
  modulo_favorito: string;
}

export interface SurveyRow {
  id: string;
  created_at: string;
  perfil: string;
  subgrupo: string | null;
  navegacion: number;
  claridad_feedback: number;
  atractivo_visual: number;
  utilidad_aprendizaje: number;
  valoracion_global: number;
  simuladores: number;
  gamificacion: number;
  sus_1: number; sus_2: number; sus_3: number; sus_4: number; sus_5: number;
  sus_6: number; sus_7: number; sus_8: number; sus_9: number; sus_10: number;
  sus_puntuacion: number;
  nps: number;
  mejor_aspecto: string | null;
  sugerencias: string | null;
  modulo_favorito: string | null;
}

export interface ItemStats { mean: number; sd: number; pctAtLeast4: number; n: number; }

export interface SatisfactionMetrics {
  total: number;
  byProfile: Record<string, number>;
  bySubgroup: Record<string, number>;
  items: Record<string, ItemStats>;
  sus: { mean: number; sd: number; pctAtLeast68: number };
  nps: { score: number; promoters: number; passives: number; detractors: number };
  comments: Array<{ date: string; perfil: string; mejor: string; sugerencia: string }>;
}

export type MetricsResult =
  | { status: 'ok'; metrics: SatisfactionMetrics; rows: SurveyRow[] }
  | { status: 'not_configured' | 'forbidden' | 'error'; message: string };

const USER_COMPLETED_KEY = 'biomark_encuesta_satisfaccion_enviada_v2';

/** ¿Hay una base de datos Supabase real configurada? */
export function isSurveyBackendConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  return !!url && !!key && !url.includes('mock-supabase');
}

/** Puntuación SUS (0-100): ítems impares (x-1), pares (5-x), suma × 2,5 */
export function computeSusScore(sus: number[]): number {
  const sum = sus.reduce((acc, v, i) => acc + (i % 2 === 0 ? v - 1 : 5 - v), 0);
  return Math.round(sum * 2.5 * 10) / 10;
}

const stats = (values: number[], threshold: number): { mean: number; sd: number; pct: number } => {
  const n = values.length;
  if (!n) return { mean: 0, sd: 0, pct: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / (n - 1)) : 0;
  const pct = (values.filter((v) => v >= threshold).length / n) * 100;
  return { mean: Number(mean.toFixed(2)), sd: Number(sd.toFixed(2)), pct: Math.round(pct) };
};

export function computeMetrics(rows: SurveyRow[]): SatisfactionMetrics {
  const count = (key: 'perfil' | 'subgrupo') =>
    rows.reduce<Record<string, number>>((acc, r) => {
      const k = (r[key] as string) || 'No indicado';
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

  const items: Record<string, ItemStats> = {};
  [...PROJECT_ITEMS, ...EXTRA_ITEMS].forEach(({ key }) => {
    const s = stats(rows.map((r) => (r as any)[key] as number), 4);
    items[key] = { mean: s.mean, sd: s.sd, pctAtLeast4: s.pct, n: rows.length };
  });

  const susStats = stats(rows.map((r) => r.sus_puntuacion), 68);
  const n = rows.length || 1;
  const promoters = rows.filter((r) => r.nps >= 9).length;
  const detractors = rows.filter((r) => r.nps <= 6).length;
  const passives = rows.length - promoters - detractors;

  return {
    total: rows.length,
    byProfile: count('perfil'),
    bySubgroup: count('subgrupo'),
    items,
    sus: { mean: susStats.mean, sd: susStats.sd, pctAtLeast68: susStats.pct },
    nps: {
      score: Math.round(((promoters - detractors) / n) * 100),
      promoters: Math.round((promoters / n) * 100),
      passives: Math.round((passives / n) * 100),
      detractors: Math.round((detractors / n) * 100),
    },
    comments: rows
      .filter((r) => (r.mejor_aspecto || '').trim() || (r.sugerencias || '').trim())
      .slice(0, 50)
      .map((r) => ({
        date: new Date(r.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        perfil: r.perfil,
        mejor: r.mejor_aspecto || '',
        sugerencia: r.sugerencias || '',
      })),
  };
}

export const satisfactionService = {
  hasUserCompletedSurvey(): boolean {
    try {
      return localStorage.getItem(USER_COMPLETED_KEY) === 'true';
    } catch {
      return false;
    }
  },

  /** Envía una respuesta anónima. Lanza un error si no se ha podido guardar. */
  async submitSurvey(data: SurveySubmission): Promise<void> {
    if (!isSurveyBackendConfigured()) {
      throw new Error('La encuesta todavía no está conectada a la base de datos de la asignatura, así que tu respuesta no se guardaría. Avisa al profesorado.');
    }
    const row: Record<string, unknown> = {
      perfil: data.perfil,
      subgrupo: data.subgrupo,
      ...data.items,
      nps: data.nps,
      sus_puntuacion: computeSusScore(data.sus),
      mejor_aspecto: data.mejor_aspecto.trim() || null,
      sugerencias: data.sugerencias.trim() || null,
      modulo_favorito: data.modulo_favorito || null,
    };
    data.sus.forEach((v, i) => { row[`sus_${i + 1}`] = v; });

    const { error } = await supabase.from('encuestas_satisfaccion').insert(row);
    if (error) {
      throw new Error('No se ha podido guardar tu respuesta. Comprueba tu conexión e inténtalo de nuevo.');
    }
    try {
      localStorage.setItem(USER_COMPLETED_KEY, 'true');
    } catch {
      /* sin almacenamiento local: no impide el envío */
    }
  },

  /** Lee todas las respuestas (solo coordinación, controlado por RLS en Supabase). */
  async fetchMetrics(): Promise<MetricsResult> {
    if (!isSurveyBackendConfigured()) {
      return { status: 'not_configured', message: 'La base de datos de la encuesta no está configurada (faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY).' };
    }
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      return { status: 'forbidden', message: 'Los resultados solo los puede ver la coordinación. Inicia sesión con tu cuenta de coordinación.' };
    }
    const { data, error } = await supabase
      .from('encuestas_satisfaccion')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return { status: 'error', message: 'No se han podido leer las respuestas.' };
    }
    const rows = (data || []) as SurveyRow[];
    // Con RLS, una cuenta que no es de coordinación recibe 0 filas sin error
    const { data: isCoord } = await supabase.rpc('es_coordinador_encuesta');
    if (isCoord === false) {
      return { status: 'forbidden', message: 'Tu cuenta no está autorizada para ver los resultados. Pide a la coordinación que la añada.' };
    }
    return { status: 'ok', metrics: computeMetrics(rows), rows };
  },

  toCSV(rows: SurveyRow[]): string {
    const headers = [
      'id', 'fecha', 'perfil', 'subgrupo',
      ...PROJECT_ITEMS.map((i) => i.key), ...EXTRA_ITEMS.map((i) => i.key),
      ...SUS_ITEMS.map((_, i) => `sus_${i + 1}`), 'sus_puntuacion', 'nps',
      'mejor_aspecto', 'sugerencias', 'modulo_favorito',
    ];
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = rows.map((r) => [
      esc(r.id), esc(r.created_at), esc(r.perfil), esc(r.subgrupo),
      ...PROJECT_ITEMS.map((i) => (r as any)[i.key]), ...EXTRA_ITEMS.map((i) => (r as any)[i.key]),
      ...SUS_ITEMS.map((_, i) => (r as any)[`sus_${i + 1}`]), r.sus_puntuacion, r.nps,
      esc(r.mejor_aspecto), esc(r.sugerencias), esc(r.modulo_favorito),
    ].join(','));
    return '﻿' + [headers.join(','), ...lines].join('\n');
  },
};
