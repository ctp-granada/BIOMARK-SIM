import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Coins, Send, X, HelpCircle, GraduationCap, AlertTriangle, Loader2 } from 'lucide-react';
import {
  satisfactionService,
  isSurveyBackendConfigured,
  PROJECT_ITEMS,
  EXTRA_ITEMS,
  SUS_ITEMS,
  AcademicRole,
  ProjectItemKey,
  ExtraItemKey,
} from '../../utils/satisfactionService';
import { audioService } from '../../utils/audioService';

interface SatisfactionSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardUser?: (xp: number, budget: number) => void;
  /** Se mantiene por compatibilidad; los resultados solo los ve la coordinación */
  onOpenMetrics?: () => void;
}

const LIKERT_LABELS = ['Muy mal', 'Mal', 'Regular', 'Bien', 'Muy bien'];
const AGREE_LABELS = ['Muy en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Muy de acuerdo'];

const MODULES = [
  'Simulador de Integración Metabólica (Integra)',
  'Hospital Clínico (Guardias y Casos Clínicos)',
  'Simulador de Ictericias',
  'Simulador del Ciclo de Randle',
  'Simulador de Hemostasia',
  'Parque Biomédico y Rosco de Bioquímica',
  'Vademécum de Biomarcadores',
  'Temario y Preguntas Test',
];

type ItemKey = ProjectItemKey | ExtraItemKey;
const ALL_ITEMS = [...PROJECT_ITEMS, ...EXTRA_ITEMS];

export const SatisfactionSurveyModal: React.FC<SatisfactionSurveyModalProps> = ({ isOpen, onClose, onRewardUser }) => {
  const [perfil, setPerfil] = useState<AcademicRole | ''>('');
  const [subgrupo, setSubgrupo] = useState<string>('');
  const [items, setItems] = useState<Partial<Record<ItemKey, number>>>({});
  const [sus, setSus] = useState<(number | null)[]>(Array(10).fill(null));
  const [nps, setNps] = useState<number | null>(null);
  const [mejor, setMejor] = useState('');
  const [sugerencias, setSugerencias] = useState('');
  const [modulo, setModulo] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMissing, setShowMissing] = useState(false);

  const alreadyCompleted = satisfactionService.hasUserCompletedSurvey();
  const backendReady = isSurveyBackendConfigured();

  if (!isOpen) return null;

  const missing: string[] = [];
  if (!perfil) missing.push('perfil académico');
  ALL_ITEMS.forEach((it) => { if (!items[it.key]) missing.push(it.label); });
  sus.forEach((v, i) => { if (v == null) missing.push(`pregunta ${i + 1} de usabilidad`); });
  if (nps == null) missing.push('recomendación (0-10)');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (missing.length) {
      setShowMissing(true);
      return;
    }
    setSending(true);
    try {
      await satisfactionService.submitSurvey({
        perfil: perfil as AcademicRole,
        subgrupo: subgrupo || 'No indicado',
        items: items as Record<ItemKey, number>,
        sus: sus as number[],
        nps: nps as number,
        mejor_aspecto: mejor,
        sugerencias,
        modulo_favorito: modulo,
      });
      audioService.playSuccess();
      setSubmitted(true);
      // La recompensa no depende de las respuestas
      if (onRewardUser && !alreadyCompleted) onRewardUser(150, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se ha podido enviar la encuesta.');
    } finally {
      setSending(false);
    }
  };

  const Scale: React.FC<{ value: number | null | undefined; onChange: (v: number) => void; labels: string[]; name: string }> = ({ value, onChange, labels, name }) => (
    <div role="radiogroup" aria-label={name} className="grid grid-cols-5 gap-1.5">
      {labels.map((lab, i) => {
        const v = i + 1;
        const active = value === v;
        return (
          <button
            type="button"
            key={v}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(v)}
            className={`px-1 py-1.5 rounded-lg border text-[10.5px] leading-tight font-semibold transition-colors cursor-pointer ${
              active ? 'bg-amber-700 border-amber-700 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span className="block text-xs font-black">{v}</span>
            <span className="block">{lab}</span>
          </button>
        );
      })}
    </div>
  );

  const missingClass = (isMissing: boolean) => (showMissing && isMissing ? 'border-rose-400 bg-rose-50/40' : 'border-slate-200/80 bg-slate-50');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-amber-900/60 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">Encuesta de satisfacción y usabilidad</h2>
              <p className="text-xs text-amber-100/90 mt-1">
                Anónima y voluntaria. No se guarda tu nombre ni tu correo, y no cuenta para la nota. Unos 5 minutos.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold cursor-pointer shrink-0" aria-label="Cerrar">
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">¡Gracias por tu valoración!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Tu respuesta anónima se ha guardado correctamente.</p>
              </div>
              {!alreadyCompleted && onRewardUser && (
                <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-4 rounded-2xl border border-amber-200/80 max-w-sm mx-auto flex items-center justify-around gap-4 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-black text-amber-800">+150 XP</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-black text-emerald-800">+100 €</span>
                  </div>
                </div>
              )}
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs cursor-pointer">
                Continuar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {!backendReady && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="text-[11px]">
                    La encuesta todavía no está conectada a la base de datos de la asignatura: si la envías ahora, tu respuesta no se guardará.
                  </span>
                </div>
              )}
              {alreadyCompleted && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px]">Ya enviaste la encuesta desde este dispositivo. Por favor, respóndela solo una vez.</span>
                </div>
              )}

              {/* Perfil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold text-slate-700">Perfil académico *</span>
                  <select
                    value={perfil}
                    onChange={(e) => setPerfil(e.target.value as AcademicRole)}
                    className={`w-full p-2.5 border rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${missingClass(!perfil)}`}
                  >
                    <option value="">Elige una opción…</option>
                    <option value="Alumno/a Grado en Medicina">Alumno/a del Grado en Medicina</option>
                    <option value="Alumno/a Grado en Enfermería">Alumno/a del Grado en Enfermería</option>
                    <option value="Otro">Otro</option>
                  </select>
                </label>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold text-slate-700">Subgrupo de prácticas (opcional)</span>
                  <select
                    value={subgrupo}
                    onChange={(e) => setSubgrupo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Prefiero no indicarlo</option>
                    {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={`Subgrupo ${n}`}>Subgrupo {n}</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* 1. Valoración */}
              <section className="space-y-3">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">1. Valora la plataforma (1 = muy mal · 5 = muy bien)</h3>
                {ALL_ITEMS.map((it) => (
                  <div key={it.key} className={`p-3.5 border rounded-2xl space-y-2 ${missingClass(!items[it.key])}`}>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{it.label} *</span>
                      <span className="text-[11px] text-slate-500">{it.description}</span>
                    </div>
                    <Scale name={it.label} value={items[it.key]} onChange={(v) => setItems((p) => ({ ...p, [it.key]: v }))} labels={LIKERT_LABELS} />
                  </div>
                ))}
              </section>

              {/* 2. SUS */}
              <section className="space-y-3">
                <div>
                  <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">2. Usabilidad (escala SUS)</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Indica tu grado de acuerdo con cada frase. Algunas están redactadas en negativo a propósito: léelas con calma.</p>
                </div>
                {SUS_ITEMS.map((txt, i) => (
                  <div key={i} className={`p-3.5 border rounded-2xl space-y-2 ${missingClass(sus[i] == null)}`}>
                    <span className="text-xs font-semibold text-slate-900 block">{i + 1}. {txt} *</span>
                    <Scale
                      name={txt}
                      value={sus[i]}
                      onChange={(v) => setSus((p) => p.map((x, j) => (j === i ? v : x)))}
                      labels={AGREE_LABELS}
                    />
                  </div>
                ))}
              </section>

              {/* 3. Recomendación */}
              <section className={`p-4 border rounded-2xl space-y-2 ${showMissing && nps == null ? 'border-rose-400 bg-rose-50/40' : 'bg-amber-50/60 border-amber-200'}`}>
                <h3 className="text-xs font-bold text-amber-950">3. ¿Con qué probabilidad recomendarías la plataforma a estudiantes de cursos siguientes? *</h3>
                <div role="radiogroup" aria-label="Recomendación de 0 a 10" className="grid grid-cols-11 gap-1 pt-1">
                  {Array.from({ length: 11 }, (_, n) => n).map((n) => (
                    <button
                      type="button"
                      key={n}
                      role="radio"
                      aria-checked={nps === n}
                      onClick={() => setNps(n)}
                      className={`h-8 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                        nps === n ? 'bg-amber-700 text-white' : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 px-0.5">
                  <span>0: nada probable</span>
                  <span>10: muy probable</span>
                </div>
              </section>

              {/* 4. Abiertas */}
              <section className="space-y-3">
                <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">4. Tu opinión (opcional)</h3>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold text-slate-700">Módulo que más te ha servido</span>
                  <select
                    value={modulo}
                    onChange={(e) => setModulo(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">Sin respuesta</option>
                    {MODULES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </label>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold text-slate-700">¿Qué es lo que más te ha ayudado a aprender?</span>
                  <textarea rows={2} maxLength={2000} value={mejor} onChange={(e) => setMejor(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none" />
                </label>
                <label className="space-y-1 block">
                  <span className="text-[11px] font-bold text-slate-700">¿Qué cambiarías o añadirías?</span>
                  <textarea rows={2} maxLength={2000} value={sugerencias} onChange={(e) => setSugerencias(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none" />
                </label>
              </section>

              {showMissing && missing.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl text-[11px]">
                  Faltan {missing.length} respuesta{missing.length > 1 ? 's' : ''} obligatoria{missing.length > 1 ? 's' : ''} (marcadas en rojo).
                </div>
              )}
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-xl text-[11px] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Respuesta anónima. La recompensa del juego no depende de lo que contestes.</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">
                    Cancelar
                  </button>
                  <button type="submit" disabled={sending}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white shadow-xs flex items-center justify-center gap-2 cursor-pointer">
                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{sending ? 'Enviando…' : 'Enviar encuesta'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
