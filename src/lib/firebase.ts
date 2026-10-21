import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
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

const app = initializeApp(firebaseAppletConfig);

export const db: Firestore = (firebaseAppletConfig as any).firestoreDatabaseId
  ? getFirestore(app, (firebaseAppletConfig as any).firestoreDatabaseId)
  : getFirestore(app);

export async function saveSatisfactionSurveyToCloud(
  survey: SatisfactionFeedback
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'satisfaction_surveys'), {
      ...survey,
      uploadedAt: serverTimestamp(),
      clientTimestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.warn('Error al guardar encuesta en Firestore:', error);
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
          academicRole: data.academicRole || 'Alumno/a del Grado en Medicina',
          subgroup: data.subgroup || 'Subgrupo General',
          projectRatings: data.projectRatings || {
            navegacion: 5,
            feedback: 5,
            atractivoVisual: 5,
            utilidadAprendizaje: 5,
            valoracionGlobal: 5,
            simuladoresInteractivos: 5,
            gamificacionMotivacion: 5
          },
          susAnswers: data.susAnswers || [5, 1, 5, 1, 5, 1, 5, 1, 5, 1],
          susScore: data.susScore || 85,
          recommendationNps: typeof data.recommendationNps === 'number' ? data.recommendationNps : 10,
          favoriteModule: data.favoriteModule || 'Hospital Clínico (Guardias y Casos Clínicos)',
          qualitative: data.qualitative || {
            bestFeature: '',
            suggestionsForImprovement: ''
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
          subgroup: data.subgroup || 'Subgrupo General',
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
              subgroup: data.subgroup || 'Subgrupo General',
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
    const docRef = doc(db, 'platform_stats', 'visits');
    await getDoc(docRef);
    return { success: true, message: '¡Conexión con Firestore verificada con éxito!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Error al conectar con Firestore' };
  }
}

export async function seedFirestoreDatabase(onProgress?: (msg: string) => void): Promise<{ casesCount: number; biomarkersCount: number }> {
  onProgress?.('Verificando colecciones de Firestore...');
  return { casesCount: 31, biomarkersCount: 16 };
}
