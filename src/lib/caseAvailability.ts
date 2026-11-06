import { doc, onSnapshot, writeBatch, serverTimestamp, collection, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { ClinicalCase } from '../types';
import { DEFAULT_CASE_BLOCK, SYLLABUS_BLOCKS } from '../data/caseBlocks';

// Qué casos clínicos están abiertos para el alumnado.
// Mientras el profesorado no guarde ninguna configuración, todos los casos siguen disponibles.

export interface CaseAvailability {
  configured: boolean;
  activeBlocks: string[];
  activeCases: string[];
  blockOverrides: Record<string, string>;
}

export const OPEN_AVAILABILITY: CaseAvailability = {
  configured: false,
  activeBlocks: SYLLABUS_BLOCKS.map((b) => b.id),
  activeCases: [],
  blockOverrides: {},
};

const SETTINGS_DOC = () => doc(db, 'course_settings', 'case_availability');
const CACHE_KEY = 'biomark_case_availability';

function readCache(): CaseAvailability | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(value: CaseAvailability) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(value));
  } catch {}
}

export function getInitialAvailability(): CaseAvailability {
  return readCache() ?? OPEN_AVAILABILITY;
}

export function subscribeToCaseAvailability(onChange: (value: CaseAvailability) => void): () => void {
  try {
    return onSnapshot(
      SETTINGS_DOC(),
      (snap) => {
        // Sin conexión, Firestore responde «no existe» desde su caché vacía: no es una respuesta real.
        if (snap.metadata.fromCache && !snap.exists()) return;
        if (!snap.exists()) {
          writeCache(OPEN_AVAILABILITY);
          onChange(OPEN_AVAILABILITY);
          return;
        }
        const data = snap.data();
        const value: CaseAvailability = {
          configured: true,
          activeBlocks: Array.isArray(data.activeBlocks) ? data.activeBlocks : [],
          activeCases: Array.isArray(data.activeCases) ? data.activeCases : [],
          blockOverrides: data.blockOverrides && typeof data.blockOverrides === 'object' ? data.blockOverrides : {},
        };
        writeCache(value);
        onChange(value);
      },
      (err) => console.warn('No se pudo leer la activación de casos:', err)
    );
  } catch (err) {
    console.warn('No se pudo suscribir a la activación de casos:', err);
    return () => {};
  }
}

export function getCaseBlockId(caseId: string, availability: CaseAvailability): string {
  return availability.blockOverrides[caseId] ?? DEFAULT_CASE_BLOCK[caseId] ?? SYLLABUS_BLOCKS[SYLLABUS_BLOCKS.length - 1].id;
}

export function isCaseAvailable(c: ClinicalCase, availability: CaseAvailability): boolean {
  if (!availability.configured) return true;
  if (availability.activeCases.includes(c.id)) return true;
  return availability.activeBlocks.includes(getCaseBlockId(c.id, availability));
}

export function getAvailableCases(cases: ClinicalCase[], availability: CaseAvailability): ClinicalCase[] {
  return cases.filter((c) => isCaseAvailable(c, availability));
}

// La clave del profesorado no está en el código de la app: la comprueban las reglas de Firestore.
// Se escribe en una colección que nadie puede leer, y la configuración solo se acepta si va
// acompañada de una de esas entradas con la clave correcta.
export function normalizeTeacherKey(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export interface TeacherSession {
  sessionId: string;
}

export async function startTeacherSession(rawKey: string): Promise<TeacherSession> {
  const ref = doc(collection(db, 'teacher_sessions'));
  await setDoc(ref, { clave: normalizeTeacherKey(rawKey), createdAt: serverTimestamp() });
  return { sessionId: ref.id };
}

export async function saveCaseAvailability(
  session: TeacherSession,
  rawKey: string,
  value: Omit<CaseAvailability, 'configured'>
): Promise<void> {
  const batch = writeBatch(db);
  batch.set(doc(db, 'teacher_sessions', session.sessionId), {
    clave: normalizeTeacherKey(rawKey),
    createdAt: serverTimestamp(),
  });
  batch.set(SETTINGS_DOC(), {
    activeBlocks: value.activeBlocks,
    activeCases: value.activeCases,
    blockOverrides: value.blockOverrides,
    sessionId: session.sessionId,
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
}
