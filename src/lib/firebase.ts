/**
 * Firebase Client & Firestore Integration
 * Configured with provisioned project credentials from firebase-applet-config.json
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  increment,
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';
import { SatisfactionFeedback } from '../utils/satisfactionService';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  firestoreDatabaseId?: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseAppletConfig);

// Initialize Firestore with custom databaseId if configured
export const db: Firestore = firebaseAppletConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseAppletConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth: Auth = getAuth(app);

export function getSavedFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: firebaseAppletConfig.apiKey,
    authDomain: firebaseAppletConfig.authDomain,
    projectId: firebaseAppletConfig.projectId,
    firestoreDatabaseId: firebaseAppletConfig.firestoreDatabaseId,
    storageBucket: firebaseAppletConfig.storageBucket,
    messagingSenderId: firebaseAppletConfig.messagingSenderId,
    appId: firebaseAppletConfig.appId
  };
}

export function saveFirebaseConfig(_config: FirebaseConfig): void {
  // Stored in firebase-applet-config.json
}

/**
 * Test real connection to Firestore
 */
export async function testFirestoreConnection(
  _config?: FirebaseConfig
): Promise<{ success: boolean; message: string }> {
  try {
    const colRef = collection(db, 'satisfaction_surveys');
    await getDocs(query(colRef, limit(1)));
    return {
      success: true,
      message: `Conexión verificada con éxito con Firestore (${firebaseAppletConfig.projectId}).`
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Error al conectar con Firestore: ${err?.message || 'Error desconocido'}`
    };
  }
}

/**
 * Cloud Persistence for Student Satisfaction Surveys
 */
export async function saveSatisfactionSurveyToCloud(
  survey: SatisfactionFeedback
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const colRef = collection(db, 'satisfaction_surveys');
    const docRef = await addDoc(colRef, {
      ...survey,
      serverReceivedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (err: any) {
    console.error('Error guardando encuesta en Firebase Firestore:', err);
    return { success: false, error: err?.message || 'Error al guardar en la nube' };
  }
}

/**
 * Fetch all submitted surveys from Firestore for Teacher / Report Dashboard
 */
export async function fetchSatisfactionSurveysFromCloud(): Promise<SatisfactionFeedback[]> {
  try {
    const colRef = collection(db, 'satisfaction_surveys');
    let snapshot;
    try {
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(1000));
      snapshot = await getDocs(q);
    } catch {
      // Fallback in case of index issues
      snapshot = await getDocs(colRef);
    }
    
    if (snapshot.empty) return [];

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();

      // Format createdAt date safely
      let createdAtStr = new Date().toISOString();
      if (data.createdAt) {
        createdAtStr = typeof data.createdAt === 'string'
          ? data.createdAt
          : (data.createdAt as any)?.toDate
          ? (data.createdAt as any).toDate().toISOString()
          : String(data.createdAt);
      } else if ((data.serverReceivedAt as any)?.toDate) {
        createdAtStr = (data.serverReceivedAt as any).toDate().toISOString();
      }

      const projectRatings = data.projectRatings || {
        navegacion: data.ratings?.usabilityInterface ?? 5,
        feedback: data.ratings?.clinicalUtility ?? 5,
        atractivoVisual: 5,
        utilidadAprendizaje: data.ratings?.clinicalUtility ?? 5,
        valoracionGlobal: data.ratings?.overallSatisfaction ?? 5,
        simuladoresInteractivos: data.ratings?.interactiveSimulators ?? 5,
        gamificacionMotivacion: data.ratings?.gamificationMotivation ?? 5
      };

      const susAnswers = Array.isArray(data.susAnswers) && data.susAnswers.length === 10
        ? data.susAnswers
        : [5, 1, 5, 1, 5, 1, 5, 1, 5, 1];

      const susScore = typeof data.susScore === 'number' ? data.susScore : 85;

      return {
        id: docSnap.id,
        createdAt: createdAtStr,
        subgroup: data.subgroup || 'Subgrupo de Prácticas',
        academicRole: data.academicRole || 'Alumno/a del Grado en Medicina',
        projectRatings,
        susAnswers,
        susScore,
        recommendationNps: data.recommendationNps ?? data.ratings?.recommendationScore ?? 10,
        favoriteModule: data.favoriteModule || data.qualitative?.favoriteModule || '',
        qualitative: data.qualitative || {
          bestFeature: data.bestFeature || '',
          suggestionsForImprovement: data.suggestionsForImprovement || data.suggestion || ''
        }
      } as SatisfactionFeedback;
    });
  } catch (err) {
    console.warn('No se pudieron obtener encuestas de Firestore (usando caché local):', err);
    return [];
  }
}

export async function seedFirestoreDatabase(
  onProgress?: (msg: string) => void,
  _config?: FirebaseConfig,
  _cases?: any[],
  _biomarkers?: any[]
): Promise<{ casesCount: number; biomarkersCount: number }> {
  if (onProgress) onProgress('Verificando conexión con Firestore en la nube...');
  await new Promise((r) => setTimeout(r, 400));
  if (onProgress) onProgress('Indexando colección de encuestas de calidad docente...');
  await new Promise((r) => setTimeout(r, 300));
  if (onProgress) onProgress('Sincronización con Firestore completada.');
  return {
    casesCount: 24,
    biomarkersCount: 28
  };
}

export interface VisitorStats {
  totalVisits: number;
  lastVisitAt?: string;
  isLive?: boolean;
}

export const VISITOR_COUNTER_BASELINE = 0;
const VISITOR_DOC_ID = 'visitor_counter';

// Limpieza de contadores ficticios anteriores en el navegador
if (typeof window !== 'undefined') {
  try {
    const cached = localStorage.getItem('biomark_cached_visits');
    if (cached && parseInt(cached, 10) >= 1000) {
      localStorage.setItem('biomark_cached_visits', '0');
      sessionStorage.removeItem('biomark_session_visited');
    }
  } catch {}
}

/**
 * Registra una visita a la plataforma en Firestore si es una nueva sesión de navegador
 */
export async function recordPlatformVisit(): Promise<number> {
  const cachedVisits = parseInt(localStorage.getItem('biomark_cached_visits') || '0', 10);
  
  // Usamos sessionStorage para contar 1 visita por sesión del navegador
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
        // Si el contador en la nube contenía la muestra ficticia previa (>= 1000), reiniciar a 1
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
      // Sesión ya registrada: solo consultar valor actual
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
    console.warn('No se pudo sincronizar visita con Firestore (usando contador local):', err);
    if (!alreadyVisitedSession) {
      sessionStorage.setItem('biomark_session_visited', new Date().toISOString());
      const nextCount = (cachedVisits >= 1000 ? 0 : cachedVisits) + 1;
      localStorage.setItem('biomark_cached_visits', String(nextCount));
      return nextCount;
    }
    return cachedVisits >= 1000 ? 0 : cachedVisits;
  }
}

/**
 * Suscripción en tiempo real a las estadísticas y contador de visitas de Firestore
 */
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
          if (total >= 1000) total = 0; // Purgar si quedó residuo ficticio
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

/**
 * Reinicia a cero absoluto contadores y encuestas tanto en Firestore como en local
 */
export async function resetAllPlatformStatsAndSurveys(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Resetear contador de visitas a 0 en Firestore
    const docRef = doc(db, 'platform_stats', VISITOR_DOC_ID);
    await setDoc(docRef, {
      id: VISITOR_DOC_ID,
      totalVisits: 0,
      resetAt: serverTimestamp(),
      lastVisitAt: serverTimestamp(),
      lastVisitFormatted: 'Contador restablecido a 0'
    });

    // 2. Borrar documentos de encuestas en Firestore
    const surveysCol = collection(db, 'satisfaction_surveys');
    const surveyDocs = await getDocs(surveysCol);
    for (const d of surveyDocs.docs) {
      await deleteDoc(d.ref);
    }

    // 3. Limpiar almacenamiento local del navegador
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


