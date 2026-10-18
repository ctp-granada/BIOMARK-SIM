import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Database, 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Terminal, 
  ExternalLink,
  Save,
  Server,
  KeyRound,
  RefreshCw,
  FolderTree
} from 'lucide-react';
import { 
  getSavedFirebaseConfig, 
  saveFirebaseConfig, 
  testFirestoreConnection, 
  seedFirestoreDatabase, 
  FirebaseConfig 
} from '../../lib/firebase';

interface FirebaseHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseHubModal: React.FC<FirebaseHubModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'seeder' | 'rules' | 'deploy'>('config');
  const [config, setConfig] = useState<FirebaseConfig>(getSavedFirebaseConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  // Seeder state
  const [seeding, setSeeding] = useState(false);
  const [seedLog, setSeedLog] = useState<string>('');
  const [seedResult, setSeedResult] = useState<{ casesCount: number; biomarkersCount: number } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(getSavedFirebaseConfig());
      setTestResult(null);
      setSeedResult(null);
      setSeedLog('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirebaseConfig(config);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testFirestoreConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message || 'Error al conectar' });
    } finally {
      setTesting(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedResult(null);
    setSeedLog('Iniciando carga estructurada...');
    try {
      const res = await seedFirestoreDatabase((msg: string) => setSeedLog(msg));
      setSeedResult(res);
    } catch (err: any) {
      setSeedLog(`Error en el volcado: ${err?.message || 'Verifica los permisos de Firestore'}`);
    } finally {
      setSeeding(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const FIRESTORE_RULES_TEXT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.role == 'admin' || 
         request.auth.token.email.matches('.*@ugr\\\\.es') && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    // Perfiles de Alumnos y Docentes
    match /users/{userId} {
      allow read: if true;
      allow create, update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();

      // Historial de intentos clínicos
      match /attempts/{attemptId} {
        allow read: if isOwner(userId) || isAdmin();
        allow create: if isOwner(userId);
        allow update, delete: if isAdmin();
      }
    }

    // Casos clínicos del Hospital Clínico UGR
    match /cases/{caseId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Catálogo analítico de Biomarcadores
    match /biomarkers/{biomarkerId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /test/{docId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Firebase theme & UGR badge */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <Flame className="w-6 h-6 text-amber-200 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Centro de Control Firebase</h2>
                <span className="bg-amber-500/30 text-amber-100 text-xs px-2 py-0.5 rounded-full font-medium border border-amber-400/30">
                  Firestore & Hosting UGR
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                Configuración del backend, persistencia en la nube, volcado de datos y reglas de seguridad
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-2 pt-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
              activeTab === 'config'
                ? 'bg-white text-orange-600 border-orange-500 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Credenciales Firebase</span>
          </button>

          <button
            onClick={() => setActiveTab('seeder')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
              activeTab === 'seeder'
                ? 'bg-white text-orange-600 border-orange-500 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sembrado de Datos (Firestore)</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-white text-orange-600 border-orange-500 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Reglas de Seguridad</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
              activeTab === 'deploy'
                ? 'bg-white text-orange-600 border-orange-500 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Despliegue & Hosting</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto grow">

          {/* TAB 1: Config */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-950">Conexión directa con tu Proyecto de Firebase</p>
                  <p>
                    Puedes usar tu propio proyecto gratuito de Firebase. Para obtener estas claves, ve a{' '}
                    <a 
                      href="https://console.firebase.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline font-bold text-amber-900 inline-flex items-center gap-0.5 hover:text-orange-700"
                    >
                      Firebase Console <ExternalLink className="w-3 h-3" />
                    </a>
                    , crea un proyecto, pulsa <strong>"Agregar aplicación Web (&lt;/&gt;)"</strong> y copia el bloque <code>firebaseConfig</code>.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">API Key (apiKey)</label>
                    <input
                      type="text"
                      value={config.apiKey}
                      onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                      placeholder="AIzaSy..."
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project ID (projectId)</label>
                    <input
                      type="text"
                      value={config.projectId}
                      onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                      placeholder="bioquimica-medica-ugr"
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Auth Domain (authDomain)</label>
                    <input
                      type="text"
                      value={config.authDomain}
                      onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                      placeholder="tu-proyecto.firebaseapp.com"
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">App ID (appId)</label>
                    <input
                      type="text"
                      value={config.appId || ''}
                      onChange={(e) => setConfig({ ...config, appId: e.target.value })}
                      placeholder="1:606572041333:web:..."
                      className="w-full text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={testing}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {testing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-600" />
                          <span>Comprobando...</span>
                        </>
                      ) : (
                        <>
                          <Server className="w-3.5 h-3.5 text-slate-500" />
                          <span>Probar Conexión Firestore</span>
                        </>
                      )}
                    </button>
                    {testResult && (
                      <span className={`text-xs flex items-center gap-1 font-medium ${testResult.success ? 'text-emerald-600' : 'text-amber-700'}`}>
                        {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {testResult.message}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> ¡Configuración guardada!
                      </span>
                    )}
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Guardar en esta App</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Firestore Seeder */}
          {activeTab === 'seeder' && (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-orange-600" />
                      Arquitectura NoSQL de Colecciones en Firestore
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Estructura diseñada para la Facultad de Medicina UGR optimizada para consultas en tiempo real:
                    </p>
                  </div>
                  <button
                    onClick={handleSeedDatabase}
                    disabled={seeding}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    {seeding ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Subiendo Datos...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Sembrar Datos en Firestore</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-mono font-bold text-orange-700">/cases</span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">Casos Clínicos UGR</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Casos de patologías cardíacas, hepáticas, renales, pancreáticas y metabólicas con ECG y constantes.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-mono font-bold text-orange-700">/biomarkers</span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">Catálogo Analítico</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Troponinas, NT-proBNP, transaminasas, lipasa, gasometría, perfiles lipídicos y costes de pruebas.
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-[11px] font-mono font-bold text-orange-700">/users/{'{uid}'}/attempts</span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">Historial Alumnos</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Puntuaciones, rachas, insignias médicas desbloqueadas y progreso de cada estudiante.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seeding feedback */}
              {(seedLog || seedResult) && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
                    <span>Estado del proceso de sembrado:</span>
                    {seedResult && <span className="text-emerald-400 font-bold">COMPLETADO</span>}
                  </div>
                  <p className="text-amber-300">{seedLog}</p>
                  {seedResult && (
                    <div className="text-emerald-300 space-y-1 pt-1">
                      <p>✓ {seedResult.casesCount} Casos Clínicos sincronizados en Firestore</p>
                      <p>✓ {seedResult.biomarkersCount} Fichas de Biomarcadores sincronizadas en Firestore</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security Rules */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Reglas de Seguridad ABAC (firestore.rules)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Garantizan el aislamiento de datos por alumno y lectura pública de contenidos docentes.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(FIRESTORE_RULES_TEXT, 'rules')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedSection === 'rules' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar Reglas</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-[350px]">
                <pre>{FIRESTORE_RULES_TEXT}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: Deploy & CLI */}
          {activeTab === 'deploy' && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-orange-600" />
                  Paso a paso para Desplegar en Firebase Hosting
                </h3>
                <p className="text-xs text-slate-600">
                  Si deseas publicar la plataforma con un dominio oficial (ej. <code>https://bioquimica-medica-ugr.web.app</code>):
                </p>

                <ol className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <div>
                      <p className="font-semibold text-slate-900">Instalar Firebase CLI en tu terminal:</p>
                      <code className="block bg-slate-900 text-slate-100 p-2 rounded-lg mt-1 font-mono text-[11px]">
                        npm install -g firebase-tools
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <div>
                      <p className="font-semibold text-slate-900">Iniciar sesión con tu cuenta de Google / UGR:</p>
                      <code className="block bg-slate-900 text-slate-100 p-2 rounded-lg mt-1 font-mono text-[11px]">
                        firebase login
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <div>
                      <p className="font-semibold text-slate-900">Compilar el proyecto React y publicar:</p>
                      <code className="block bg-slate-900 text-slate-100 p-2 rounded-lg mt-1 font-mono text-[11px]">
                        npm run build && firebase deploy
                      </code>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-orange-950">Archivos ya generados en este proyecto</h4>
                  <p className="text-[11px] text-orange-800 mt-0.5">
                    Se han generado automáticamente <code>firebase.json</code>, <code>firestore.rules</code> y <code>firebase-blueprint.json</code>.
                  </p>
                </div>
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Ir a Firebase Console</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Facultad de Medicina • Universidad de Granada
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
