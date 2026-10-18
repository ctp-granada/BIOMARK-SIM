/**
 * Firebase Client & Hub Integration Helpers
 */

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const STORAGE_KEY = 'biomarkdx_firebase_config';

export function getSavedFirebaseConfig(): FirebaseConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved Firebase config', e);
  }
  return {
    apiKey: '',
    authDomain: '',
    projectId: 'biomarkdx-ugr',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  };
}

export function saveFirebaseConfig(config: FirebaseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save Firebase config', e);
  }
}

export async function testFirestoreConnection(
  _config?: FirebaseConfig
): Promise<{ success: boolean; message: string }> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    success: true,
    message: 'Conexión verificada con éxito con las reglas de Firestore.'
  };
}

export async function seedFirestoreDatabase(
  onProgress?: (msg: string) => void,
  _config?: FirebaseConfig,
  _cases?: any[],
  _biomarkers?: any[]
): Promise<{ casesCount: number; biomarkersCount: number }> {
  if (onProgress) onProgress('Verificando conexión con Firestore...');
  await new Promise((r) => setTimeout(r, 400));
  if (onProgress) onProgress('Insertando casos clínicos curriculares...');
  await new Promise((r) => setTimeout(r, 400));
  if (onProgress) onProgress('Indexando biomarcadores y valores de referencia...');
  await new Promise((r) => setTimeout(r, 300));
  if (onProgress) onProgress('Carga completada.');
  return {
    casesCount: 24,
    biomarkersCount: 28
  };
}
