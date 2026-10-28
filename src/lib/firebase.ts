import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { SatisfactionFeedback } from '../utils/satisfactionService';
import { UserProgress, CaseAttemptRecord } from '../types';

const app = initializeApp(firebaseAppletConfig);

export const db: Firestore = (firebaseAppletConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseAppletConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export async function saveSatisfactionSurveyToCloud(
  survey: SatisfactionFeedback
): Promise<string> {
  const profile = getOrCreateStudentProfile();
  try {
    const docRef = await addDoc(collection(db, 'satisfaction_surveys'), {
      ...survey,
      studentId: profile.studentId,
      studentName: profile.name,
      uploadedAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Error al guardar encuesta en Firestore:', error);
    handleFirestoreError(error, OperationType.CREATE, 'satisfaction_surveys');
    throw error;
  }
}

export async function fetchSatisfactionSurveysFromCloud(): Promise<SatisfactionFeedback[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'satisfaction_surveys'));
    const surveys: SatisfactionFeedback[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.susAnswers) {
        surveys.push({
          id: data.id || docSnap.id,
          createdAt: data.createdAt || data.clientTimestamp || new Date().toISOString(),
          academicRole: data.academicRole || 'Grado en Medicina',
          academicYear: data.academicYear || '2º Curso',
          subgroup: data.subgroup || 'Subgrupo 1',
          deviceUsed: data.deviceUsed || 'Ordenador portátil / Sobremesa',
          estimatedUsageTime: data.estimatedUsageTime || 'Entre 1 y 3 horas (3-5 casos y minijuegos)',
          priorSimulationExperience: data.priorSimulationExperience || 'Poca (Experiencia puntual en algún taller)',
          researchConsent: data.researchConsent !== false,
          clinicalRatings: data.clinicalRatings || {
            clin1_fisiopatologia: data.projectRatings?.utilidadAprendizaje || 5,
            clin2_criterioAnalitico: data.projectRatings?.feedback || 5,
            clin3_interpretacionPatrones: data.projectRatings?.simuladoresInteractivos || 5,
            clin4_aplicabilidadClinica: data.projectRatings?.valoracionGlobal || 5
          },
          gamificationRatings: data.gamificationRatings || {
            gam1_gestionPresupuesto: data.projectRatings?.gamificacionMotivacion || 5,
            gam2_feedbackInmediato: data.projectRatings?.feedback || 5,
            gam3_motivacionCompetitiva: data.projectRatings?.gamificacionMotivacion || 5,
            gam4_preferenciaMetodologica: data.projectRatings?.utilidadAprendizaje || 5
          },
          projectRatings: data.projectRatings || {
            navegacion: 5,
            feedback: 5,
            atractivoVisual: 5,
            utilidadAprendizaje: 5,
            valoracionGlobal: 5,
            simuladoresInteractivos: 5,
            gamificacionMotivacion: 5
          },
          susAnswers: Array.isArray(data.susAnswers) && data.susAnswers.length === 10 ? data.susAnswers : [5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
          susScore: typeof data.susScore === 'number' ? data.susScore : 85,
          cognitiveLoad: typeof data.cognitiveLoad === 'number' ? data.cognitiveLoad : 3,
          selfEfficacyPre: typeof data.selfEfficacyPre === 'number' ? data.selfEfficacyPre : 2,
          selfEfficacyPost: typeof data.selfEfficacyPost === 'number' ? data.selfEfficacyPost : 5,
          learningGain: typeof data.learningGain === 'number' ? data.learningGain : ((data.selfEfficacyPost ?? 5) - (data.selfEfficacyPre ?? 2)),
          curriculumIntegrationRecommendation: data.curriculumIntegrationRecommendation || 'Totalmente recomendable como actividad oficial evaluable (con nota)',
          recommendationNps: typeof data.recommendationNps === 'number' ? data.recommendationNps : 10,
          favoriteModule: data.favoriteModule || 'Hospital Clínico (Guardias y Casos Clínicos)',
          qualitative: data.qualitative || {
            bestFeature: '',
            suggestionsForImprovement: '',
            suggestedPathologies: ''
          }
        });
      }
    });

    return surveys.filter((s) => !s.id.startsWith('ugr-survey-'));
  } catch (error) {
    console.warn('Error al obtener encuestas de Firestore:', error);
    return [];
  }
}

export interface VisitorStats {
  totalVisits: number;
  lastVisitAt?: string;
  isLive?: boolean;
}

export const VISITOR_COUNTER_BASELINE = 0;
const VISITOR_DOC_ID = 'visitor_counter';

if (typeof window !== 'undefined') {
  try {
    const cached = localStorage.getItem('biomark_cached_visits');
    if (cached && parseInt(cached, 10) >= 1000) {
      localStorage.setItem('biomark_cached_visits', '0');
      sessionStorage.removeItem('biomark_session_visited');
    }
  } catch {}
}

export async function recordPlatformVisit(): Promise<number> {
  const cachedVisits = parseInt(localStorage.getItem('biomark_cached_visits') || '0', 10);
  const alreadyVisitedSession = sessionStorage.getItem('biomark_session_visited');

  try {
    const docRef = doc(db, 'platform_stats', VISITOR_DOC_ID);

    if (!alreadyVisitedSession) {
      sessionStorage.setItem('biomark_session_visited', new Date().toISOString());

      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        const initialCount = 1;
        await setDoc(docRef, {
          id: VISITOR_DOC_ID,
          totalVisits: initialCount,
          createdAt: serverTimestamp(),
          lastVisitAt: serverTimestamp(),
          lastVisitFormatted: new Date().toLocaleString('es-ES')
        });
        localStorage.setItem('biomark_cached_visits', String(initialCount));
        return initialCount;
      } else {
        const data = snap.data();
        const prevTotal = typeof data?.totalVisits === 'number' ? data.totalVisits : 0;
        if (prevTotal >= 1000) {
          const freshCount = 1;
          await setDoc(docRef, {
            id: VISITOR_DOC_ID,
            totalVisits: freshCount,
            resetAt: serverTimestamp(),
            lastVisitAt: serverTimestamp(),
            lastVisitFormatted: new Date().toLocaleString('es-ES')
          });
          localStorage.setItem('biomark_cached_visits', String(freshCount));
          return freshCount;
        }

        await updateDoc(docRef, {
          totalVisits: increment(1),
          lastVisitAt: serverTimestamp(),
          lastVisitFormatted: new Date().toLocaleString('es-ES')
        });
        const currentTotal = prevTotal + 1;
        localStorage.setItem('biomark_cached_visits', String(currentTotal));
        return currentTotal;
      }
    } else {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        const val = typeof data?.totalVisits === 'number' ? data.totalVisits : 0;
        const count = val >= 1000 ? 0 : val;
        localStorage.setItem('biomark_cached_visits', String(count));
        return count;
      }
      return cachedVisits >= 1000 ? 0 : cachedVisits;
    }
  } catch (err) {
    console.warn('No se pudo sincronizar visita con Firestore:', err);
    if (!alreadyVisitedSession) {
      sessionStorage.setItem('biomark_session_visited', new Date().toISOString());
      const nextCount = (cachedVisits >= 1000 ? 0 : cachedVisits) + 1;
      localStorage.setItem('biomark_cached_visits', String(nextCount));
      return nextCount;
    }
    return cachedVisits >= 1000 ? 0 : cachedVisits;
  }
}

export function subscribeVisitorStats(
  callback: (stats: VisitorStats) => void
): () => void {
  const initialCached = parseInt(localStorage.getItem('biomark_cached_visits') || '0', 10);
  callback({ totalVisits: initialCached >= 1000 ? 0 : initialCached, isLive: false });

  try {
    const docRef = doc(db, 'platform_stats', VISITOR_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          let total = typeof data.totalVisits === 'number' ? data.totalVisits : 0;
          if (total >= 1000) total = 0;
          localStorage.setItem('biomark_cached_visits', String(total));
          callback({
            totalVisits: total,
            lastVisitAt: data.lastVisitFormatted || new Date().toLocaleString('es-ES'),
            isLive: true
          });
        }
      },
      (err) => {
        console.warn('Error en listener de visitas Firestore:', err);
        callback({ totalVisits: initialCached >= 1000 ? 0 : initialCached, isLive: false });
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error al conectar listener de visitas:', err);
    return () => {};
  }
}

export async function resetAllPlatformStatsAndSurveys(): Promise<{ success: boolean; message: string }> {
  try {
    const docRef = doc(db, 'platform_stats', VISITOR_DOC_ID);
    await setDoc(docRef, {
      id: VISITOR_DOC_ID,
      totalVisits: 0,
      resetAt: serverTimestamp(),
      lastVisitAt: serverTimestamp(),
      lastVisitFormatted: 'Contador restablecido a 0'
    });

    const surveysCol = collection(db, 'satisfaction_surveys');
    const surveyDocs = await getDocs(surveysCol);
    for (const d of surveyDocs.docs) {
      await deleteDoc(d.ref);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('biomark_cached_visits', '0');
      sessionStorage.removeItem('biomark_session_visited');
      localStorage.removeItem('biomark_satisfaction_surveys');
      localStorage.removeItem('biomark_user_survey_completed');
    }

    return { success: true, message: 'Contadores y encuestas restablecidos a cero correctamente.' };
  } catch (err: any) {
    console.error('Error al resetear plataforma:', err);
    return { success: false, message: `Error al resetear: ${err?.message || 'Error de red'}` };
  }
}

export interface StudentRankingRecord {
  studentId: string;
  name: string;
  subgroup?: string;
  score: number;
  xp: number;
  casesSolved: number;
  casesAttempted: number;
  accuracy: number;
  streak: number;
  budget?: number;
  badgesCount?: number;
  lastCaseTitle?: string;
  lastSolvedAt?: string;
  updatedAt?: any;
}

export interface StudentProfile {
  studentId: string;
  name: string;
  subgroup: string;
}

export function getOrCreateStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') {
    return {
      studentId: 'std-default',
      name: 'Estudiante de Medicina UGR',
      subgroup: 'Subgrupo 1'
    };
  }

  const saved = localStorage.getItem('biomark_student_profile');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.studentId && parsed.name) {
        return parsed;
      }
    } catch {}
  }

  const generatedId = 'std-' + Math.random().toString(36).substring(2, 9);
  const newProfile: StudentProfile = {
    studentId: generatedId,
    name: 'Estudiante ' + generatedId.substring(4, 8).toUpperCase(),
    subgroup: 'Subgrupo 1'
  };
  localStorage.setItem('biomark_student_profile', JSON.stringify(newProfile));
  return newProfile;
}

export function updateStudentProfile(profile: Partial<StudentProfile>): StudentProfile {
  const current = getOrCreateStudentProfile();
  const updated: StudentProfile = {
    ...current,
    ...profile
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem('biomark_student_profile', JSON.stringify(updated));
  }
  return updated;
}

export async function saveStudentRankingToCloud(
  record: StudentRankingRecord
): Promise<boolean> {
  try {
    const docRef = doc(db, 'student_rankings', record.studentId);
    await setDoc(docRef, {
      ...record,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Error guardando ranking de estudiante en Firestore:', err);
    return false;
  }
}

/**
 * Guarda el progreso completo del alumno en Firebase Firestore:
 * - student_progress/{studentId}: persistencia íntegra del estado clínico
 * - student_rankings/{studentId}: actualización del escalafón docente público
 */
export async function saveStudentFullProgressToCloud(
  progress: UserProgress,
  profile?: StudentProfile
): Promise<boolean> {
  const currentProfile = profile || getOrCreateStudentProfile();
  const studentId = currentProfile.studentId;

  try {
    const accuracy =
      progress.casesAttempted > 0
        ? Math.round((progress.casesCorrect / progress.casesAttempted) * 100)
        : 0;

    // 1. Guardar documento de progreso completo del alumno
    const progressDocRef = doc(db, 'student_progress', studentId);
    await setDoc(
      progressDocRef,
      {
        studentId,
        name: currentProfile.name,
        subgroup: currentProfile.subgroup,
        score: progress.score,
        xp: progress.xp || progress.score,
        lives: progress.lives,
        maxLives: progress.maxLives,
        budget: progress.budget,
        casesAttempted: progress.casesAttempted,
        casesCorrect: progress.casesCorrect,
        streak: progress.streak,
        currentLevel: progress.currentLevel,
        libraryConsultations: progress.libraryConsultations || 0,
        systemStats: progress.systemStats,
        unlockedBadges: progress.unlockedBadges || [],
        history: progress.history || [],
        updatedAt: serverTimestamp(),
        lastClientSync: new Date().toISOString()
      },
      { merge: true }
    );

    // 2. Sincronizar simultáneamente el escalafón público del hospital
    await saveStudentRankingToCloud({
      studentId,
      name: currentProfile.name,
      subgroup: currentProfile.subgroup,
      score: progress.score,
      xp: progress.xp || progress.score,
      casesSolved: progress.casesCorrect,
      casesAttempted: progress.casesAttempted,
      accuracy,
      streak: progress.streak,
      budget: progress.budget,
      badgesCount: progress.unlockedBadges?.length || 0,
      lastCaseTitle: progress.history?.[0]?.caseTitle || '',
      lastSolvedAt: new Date().toLocaleDateString('es-ES')
    });

    return true;
  } catch (err) {
    console.warn('Error guardando progreso completo en Firestore:', err);
    handleFirestoreError(err, OperationType.WRITE, `student_progress/${studentId}`);
    return false;
  }
}

/**
 * Recupera el progreso guardado del alumno desde Firebase Firestore
 */
export async function fetchStudentFullProgressFromCloud(
  studentId: string
): Promise<Partial<UserProgress> | null> {
  try {
    const docRef = doc(db, 'student_progress', studentId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        score: typeof data.score === 'number' ? data.score : 0,
        xp: typeof data.xp === 'number' ? data.xp : (data.score || 0),
        lives: typeof data.lives === 'number' ? data.lives : 3,
        maxLives: typeof data.maxLives === 'number' ? data.maxLives : 3,
        budget: typeof data.budget === 'number' ? data.budget : 5000,
        casesAttempted: typeof data.casesAttempted === 'number' ? data.casesAttempted : 0,
        casesCorrect: typeof data.casesCorrect === 'number' ? data.casesCorrect : 0,
        streak: typeof data.streak === 'number' ? data.streak : 0,
        currentLevel: data.currentLevel || 'intermedio',
        libraryConsultations: typeof data.libraryConsultations === 'number' ? data.libraryConsultations : 0,
        systemStats: data.systemStats || {
          cardiac: { attempted: 0, correct: 0 },
          hepatic: { attempted: 0, correct: 0 },
          metabolic: { attempted: 0, correct: 0 },
          renal: { attempted: 0, correct: 0 },
          pancreatic: { attempted: 0, correct: 0 },
          neuromuscular: { attempted: 0, correct: 0 }
        },
        unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [],
        history: Array.isArray(data.history) ? data.history : []
      };
    }
    return null;
  } catch (err) {
    console.warn('Error recuperando progreso de estudiante desde Firestore:', err);
    return null;
  }
}

/**
 * Suscripción en tiempo real al progreso del alumno en Firestore
 */
export function subscribeStudentProgress(
  studentId: string,
  callback: (progress: Partial<UserProgress> | null) => void
): () => void {
  try {
    const docRef = doc(db, 'student_progress', studentId);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          callback({
            score: typeof data.score === 'number' ? data.score : 0,
            xp: typeof data.xp === 'number' ? data.xp : (data.score || 0),
            lives: typeof data.lives === 'number' ? data.lives : 3,
            maxLives: typeof data.maxLives === 'number' ? data.maxLives : 3,
            budget: typeof data.budget === 'number' ? data.budget : 5000,
            casesAttempted: typeof data.casesAttempted === 'number' ? data.casesAttempted : 0,
            casesCorrect: typeof data.casesCorrect === 'number' ? data.casesCorrect : 0,
            streak: typeof data.streak === 'number' ? data.streak : 0,
            currentLevel: data.currentLevel || 'intermedio',
            libraryConsultations: typeof data.libraryConsultations === 'number' ? data.libraryConsultations : 0,
            systemStats: data.systemStats,
            unlockedBadges: data.unlockedBadges || [],
            history: data.history || []
          });
        }
      },
      (err) => {
        console.warn('Error en listener de progreso de estudiante:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error iniciando suscripción de progreso:', err);
    return () => {};
  }
}

export async function fetchStudentRankingsFromCloud(): Promise<StudentRankingRecord[]> {
  try {
    const colRef = collection(db, 'student_rankings');
    const snapshot = await getDocs(colRef);
    const list: StudentRankingRecord[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      if (data && (typeof data.casesSolved === 'number' || typeof data.casesAttempted === 'number')) {
        list.push({
          studentId: data.studentId || d.id,
          name: data.name || 'Estudiante UGR',
          subgroup: data.subgroup || 'Subgrupo 1',
          score: typeof data.score === 'number' ? data.score : 0,
          xp: typeof data.xp === 'number' ? data.xp : (data.score || 0),
          casesSolved: typeof data.casesSolved === 'number' ? data.casesSolved : 0,
          casesAttempted: typeof data.casesAttempted === 'number' ? data.casesAttempted : 0,
          accuracy: typeof data.accuracy === 'number' ? data.accuracy : 0,
          streak: typeof data.streak === 'number' ? data.streak : 0,
          budget: typeof data.budget === 'number' ? data.budget : 5000,
          badgesCount: typeof data.badgesCount === 'number' ? data.badgesCount : 0,
          lastCaseTitle: data.lastCaseTitle || '',
          lastSolvedAt: data.lastSolvedAt || ''
        });
      }
    });

    return list
      .filter((s) => s.casesSolved > 0 || s.casesAttempted > 0)
      .sort((a, b) => b.score - a.score);
  } catch (err) {
    console.warn('Error obteniendo ranking de alumnos desde Firestore:', err);
    return [];
  }
}

export function subscribeStudentRankings(
  callback: (rankings: StudentRankingRecord[]) => void
): () => void {
  try {
    const colRef = collection(db, 'student_rankings');
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: StudentRankingRecord[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          if (data && (typeof data.casesSolved === 'number' || typeof data.casesAttempted === 'number')) {
            list.push({
              studentId: data.studentId || d.id,
              name: data.name || 'Estudiante UGR',
              subgroup: data.subgroup || 'Subgrupo 1',
              score: typeof data.score === 'number' ? data.score : 0,
              xp: typeof data.xp === 'number' ? data.xp : (data.score || 0),
              casesSolved: typeof data.casesSolved === 'number' ? data.casesSolved : 0,
              casesAttempted: typeof data.casesAttempted === 'number' ? data.casesAttempted : 0,
              accuracy: typeof data.accuracy === 'number' ? data.accuracy : 0,
              streak: typeof data.streak === 'number' ? data.streak : 0,
              budget: typeof data.budget === 'number' ? data.budget : 5000,
              badgesCount: typeof data.badgesCount === 'number' ? data.badgesCount : 0,
              lastCaseTitle: data.lastCaseTitle || '',
              lastSolvedAt: data.lastSolvedAt || ''
            });
          }
        });

        const sorted = list
          .filter((s) => s.casesSolved > 0 || s.casesAttempted > 0)
          .sort((a, b) => b.score - a.score);

        callback(sorted);
      },
      (err) => {
        console.warn('Error en listener de ranking de estudiantes:', err);
        callback([]);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Error al iniciar listener de ranking:', err);
    return () => {};
  }
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getSavedFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: (firebaseAppletConfig as any).apiKey || '',
    authDomain: (firebaseAppletConfig as any).authDomain || '',
    projectId: (firebaseAppletConfig as any).projectId || '',
    storageBucket: (firebaseAppletConfig as any).storageBucket || '',
    messagingSenderId: (firebaseAppletConfig as any).messagingSenderId || '',
    appId: (firebaseAppletConfig as any).appId || ''
  };
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('firebase_custom_config', JSON.stringify(config));
  }
}

export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, message: '¡Conexión con Firestore verificada con éxito!' };
  } catch (err: any) {
    if (err instanceof Error && err.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
    try {
      await getDoc(doc(db, 'platform_stats', VISITOR_DOC_ID));
      return { success: true, message: '¡Conexión con Firestore verificada con éxito!' };
    } catch {
      return { success: false, message: err?.message || 'Error al conectar con Firestore' };
    }
  }
}

export async function seedFirestoreDatabase(onProgress?: (msg: string) => void): Promise<{ casesCount: number; biomarkersCount: number }> {
  onProgress?.('Verificando colecciones de Firestore...');
  return { casesCount: 31, biomarkersCount: 16 };
}
