import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  Sparkles,
  Award,
  Coins,
  Send,
  X,
  MessageSquare,
  BarChart3,
  Heart,
  HelpCircle,
  GraduationCap,
  ChevronRight,
  Info,
  Check,
  Lock
} from 'lucide-react';
import {
  satisfactionService,
  SUS_QUESTIONS,
  LIKERT_PROJECT_ITEMS,
  AVAILABLE_MODULES,
  calculateSusScore
} from '../../utils/satisfactionService';
import { audioService } from '../../utils/audioService';

interface SatisfactionSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardUser?: (xp: number, budget: number) => void;
  onOpenMetrics?: () => void;
  gateReason?: 'none' | 'access_park' | 'cases_milestone' | 'access_advanced_labs';
  onCompletedGate?: () => void;
}

export const SatisfactionSurveyModal: React.FC<SatisfactionSurveyModalProps> = ({
  isOpen,
  onClose,
  onRewardUser,
  onOpenMetrics,
  gateReason = 'none',
  onCompletedGate
}) => {
  // Step navigation (0: Perfil & Valoración, 1: Escala SUS, 2: Recomendación & Opinión)
  const [activeTab, setActiveTab] = useState<'indicadores' | 'sus' | 'opinion'>('indicadores');

  // Academic Profile
  const [academicRole, setAcademicRole] = useState<'Alumno/a del Grado en Medicina' | 'Alumno/a del Grado en Enfermería' | 'Otro'>('Alumno/a del Grado en Medicina');
  const [subgroup, setSubgroup] = useState<string>('Subgrupo 1');

  // 1. Project Ratings (1 to 5)
  const [projectRatings, setProjectRatings] = useState<Record<string, number>>({
    navegacion: 5,
    feedback: 5,
    atractivoVisual: 5,
    utilidadAprendizaje: 5,
    valoracionGlobal: 5,
    simuladoresInteractivos: 5,
    gamificacionMotivacion: 5
  });

  // 2. SUS Answers (10 items, 1 to 5, default 4 or 2)
  const [susAnswers, setSusAnswers] = useState<number[]>([
    5, // 1. Me gustaría usarla con frecuencia (positivo)
    1, // 2. Innecesariamente compleja (negativo)
    5, // 3. Fácil de usar (positivo)
    1, // 4. Necesitaría apoyo de un experto (negativo)
    5, // 5. Funciones bien integradas (positivo)
    1, // 6. Demasiada inconsistencia (negativo)
    5, // 7. La mayoría aprendería muy rápidamente (positivo)
    1, // 8. Muy difícil de utilizar (negativo)
    5, // 9. Me sentí muy seguro/a utilizándola (positivo)
    1  // 10. Necesité aprender muchas cosas antes de empezar (negativo)
  ]);

  // 3. NPS & Qualitative
  const [recommendationNps, setRecommendationNps] = useState<number>(10);
  const [favoriteModule, setFavoriteModule] = useState<string>(AVAILABLE_MODULES[0]);
  const [bestFeature, setBestFeature] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [finalSusScore, setFinalSusScore] = useState<number>(0);
  const [confirmExit, setConfirmExit] = useState<boolean>(false);
  const alreadyCompleted = satisfactionService.hasUserCompletedSurvey();

  if (!isOpen) return null;

  const currentSusScore = calculateSusScore(susAnswers);

  const handleSusChange = (questionIndex: number, value: number) => {
    const updated = [...susAnswers];
    updated[questionIndex] = value;
    setSusAnswers(updated);
  };

  const handleProjectRatingChange = (id: string, value: number) => {
    setProjectRatings((prev) => ({ ...prev, [id]: value }));
  };

  const handleAttemptClose = () => {
    if (gateReason !== 'none' && !submitted) {
      setConfirmExit(true);
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = satisfactionService.submitSurvey({
      academicRole,
      subgroup,
      projectRatings: {
        navegacion: projectRatings.navegacion || 5,
        feedback: projectRatings.feedback || 5,
        atractivoVisual: projectRatings.atractivoVisual || 5,
        utilidadAprendizaje: projectRatings.utilidadAprendizaje || 5,
        valoracionGlobal: projectRatings.valoracionGlobal || 5,
        simuladoresInteractivos: projectRatings.simuladoresInteractivos || 5,
        gamificacionMotivacion: projectRatings.gamificacionMotivacion || 5
      },
      susAnswers,
      recommendationNps,
      favoriteModule,
      qualitative: {
        bestFeature: bestFeature.trim() || 'Casos clínicos integrados y simuladores metabólicos.',
        suggestionsForImprovement: suggestions.trim() || 'Continuar añadiendo nuevos casos y simuladores de laboratorio.'
      }
    });

    setFinalSusScore(result.susScore);
    audioService.playSuccess();
    setSubmitted(true);

    if (onRewardUser) {
      onRewardUser(150, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-amber-900/60 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                  PID 26-158 · UGR
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-400/30">
                  Escala SUS + Indicadores
                </span>
                <span className="text-[10px] font-mono text-amber-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  +150 XP y +100 €
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                BIOMARK-SIM · Encuesta de Satisfacción y Usabilidad
              </h2>
              <p className="text-xs text-amber-100/90 mt-1">
                Encuesta anónima y voluntaria para evaluar la calidad docente de Bioquímica Médica (UGR).
              </p>
            </div>
          </div>

          <button
            onClick={handleAttemptClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation overlay if student attempts to exit while gated */}
        {confirmExit && (
          <div className="bg-amber-950/95 text-amber-100 p-4 border-b border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40">
                <Lock className="w-4 h-4 text-amber-300" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-amber-200 block">¿Posponer la encuesta docente?</span>
                <span className="text-amber-100/80 text-[11px]">
                  El acceso a esta sección permanecerá bloqueado y volverás al inicio hasta que la completes.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => {
                  setConfirmExit(false);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-900/80 hover:bg-amber-900 text-amber-200 text-xs font-semibold border border-amber-600/40 cursor-pointer"
              >
                Volver al Inicio
              </button>
              <button
                type="button"
                onClick={() => setConfirmExit(false)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs shadow-xs cursor-pointer"
              >
                Continuar Encuesta
              </button>
            </div>
          </div>
        )}

        {/* Milestone Gate Banner (when triggered to unlock content) */}
        {gateReason !== 'none' && !submitted && !confirmExit && (
          <div className="bg-amber-950 text-amber-100 px-5 py-3.5 border-b border-amber-800 flex items-start gap-3 shrink-0 animate-in fade-in">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-400/40">
              <Lock className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="font-black text-amber-200 uppercase tracking-wider text-[10px] block">
                {gateReason === 'access_park' && '🔒 Desbloqueo de Acceso al Parque Biomédico'}
                {gateReason === 'cases_milestone' && '🔒 ¡Danos tu opinión! · 4 Casos Clínicos Completados'}
                {gateReason === 'access_advanced_labs' && '🔒 Desbloqueo de Actividades Avanzadas'}
              </span>
              <p className="text-amber-100/90 leading-relaxed text-[11px]">
                {gateReason === 'access_park' &&
                  'Para acceder a los minijuegos del Parque (Rosco, Ruleta, etc.) y recargar vidas o presupuesto, ¡danos tu opinión sobre la plataforma (~90 seg)!'}
                {gateReason === 'cases_milestone' &&
                  '¡Has completado tus primeros 4 casos clínicos! Para continuar resolviendo más pacientes en el Hospital y acceder al Parque Biomédico, ¡danos tu opinión sobre la plataforma (~90 seg)! La Biblioteca y los Simuladores siguen siempre abiertos.'}
                {gateReason === 'access_advanced_labs' &&
                  'Para acceder a estas actividades, ¡danos tu opinión sobre la plataforma (~90 seg)!'}
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation if not submitted */}
        {!submitted && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-2 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('indicadores')}
              className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'indicadores'
                  ? 'border-amber-600 text-amber-800 font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>1. Valoración del Proyecto (PID)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sus')}
              className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'sus'
                  ? 'border-amber-600 text-amber-800 font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>2. Usabilidad (Escala SUS)</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-mono font-bold">
                {currentSusScore.toFixed(0)}/100
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('opinion')}
              className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'opinion'
                  ? 'border-amber-600 text-amber-800 font-bold bg-white rounded-t-xl'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>3. Recomendación & Opinión</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {submitted ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">
                  ¡Muchas gracias! Tu respuesta anónima se ha registrado
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tus respuestas se han guardado tanto localmente como en la base de datos Firestore del proyecto para la memoria de innovación docente de la UGR.
                </p>
              </div>

              {/* SUS Result Badge */}
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 max-w-sm mx-auto space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                  Tu Puntuación SUS Calculada
                </span>
                <div className="text-2xl font-black text-amber-950">
                  {finalSusScore.toFixed(1)} <span className="text-xs font-bold text-amber-700">/ 100</span>
                </div>
                <p className="text-[11px] text-amber-900">
                  {finalSusScore >= 80.3
                    ? '🌟 Grado A / Excelente (Alta aceptabilidad)'
                    : finalSusScore >= 68
                    ? '✅ Usabilidad Satisfactoria (Por encima del estándar ≥68)'
                    : '⚠️ Mejorable (Puntos de fricción señalados)'}
                </p>
              </div>

              {/* Reward Box */}
              <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-4 rounded-2xl border border-amber-200/80 max-w-sm mx-auto flex items-center justify-around gap-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-black">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Bonus Añadido</span>
                    <span className="text-sm font-black text-amber-800">+150 XP</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200" />

                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center font-black">
                    <Coins className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Presupuesto</span>
                    <span className="text-sm font-black text-emerald-800">+100 €</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onOpenMetrics && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMetrics();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 text-slate-600" />
                    <span>Ver Informe de Resultados Docentes</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onCompletedGate) {
                      onCompletedGate();
                    } else {
                      onClose();
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-800 hover:to-amber-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>
                    {gateReason !== 'none'
                      ? '🚀 Continuar a la Actividad Desbloqueada'
                      : 'Continuar Aprendiendo'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {alreadyCompleted && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px]">
                    Ya has enviado tu evaluación anteriormente, pero puedes actualizar tus respuestas o comentarios si lo deseas.
                  </span>
                </div>
              )}

              {/* TAB 1: INDICADORES DEL PROYECTO (PID 26-158) */}
              {activeTab === 'indicadores' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Academic Profile */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 block">
                      Perfil Académico del Alumno
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Grado Universitario</label>
                        <select
                          value={academicRole}
                          onChange={(e) => setAcademicRole(e.target.value as any)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Alumno/a del Grado en Medicina">Alumno/a del Grado en Medicina</option>
                          <option value="Alumno/a del Grado en Enfermería">Alumno/a del Grado en Enfermería</option>
                          <option value="Otro">Otro (Ciencias de la Salud / Profesor)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Subgrupo de Prácticas</label>
                        <select
                          value={subgroup}
                          onChange={(e) => setSubgroup(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="Prefiero no indicarlo">Prefiero no indicarlo</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                            <option key={n} value={`Subgrupo ${n}`}>
                              Subgrupo {n}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 7 Likert Items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                        1. Valora la plataforma (1 = Muy mal · 5 = Muy bien)
                      </span>
                      <span className="text-[10px] text-slate-400">7 preguntas clave</span>
                    </div>

                    {LIKERT_PROJECT_ITEMS.map((item) => {
                      const val = projectRatings[item.id] || 5;
                      const labels = ['Muy mal', 'Mal', 'Regular', 'Bien', 'Muy bien'];
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl space-y-2 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div>
                              <span className="font-bold text-slate-900 text-xs block">{item.title}</span>
                              <span className="text-[11px] text-slate-500">{item.help}</span>
                            </div>
                            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 self-start sm:self-center shrink-0">
                              {val} / 5 · {labels[val - 1]}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleProjectRatingChange(item.id, star)}
                                className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer focus:outline-hidden"
                                title={`${star} - ${labels[star - 1]}`}
                              >
                                <Star
                                  className={`w-5 h-5 transition-colors ${
                                    star <= val
                                      ? 'text-amber-400 fill-amber-400 filter drop-shadow-2xs'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('sus')}
                      className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Siguiente: Escala SUS de Usabilidad</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: ESCALA SUS (SYSTEM USABILITY SCALE, 10 PREGUNTAS) */}
              {activeTab === 'sus' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-950">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 text-[11px] leading-relaxed">
                      <p className="font-bold">
                        Instrucciones de la Escala SUS (System Usability Scale):
                      </p>
                      <p className="text-amber-900/90">
                        Indica tu grado de acuerdo con cada frase (1 = Muy en desacuerdo · 5 = Muy de acuerdo).
                        <strong> Algunas frases están redactadas en negativo a propósito</strong>: léelas con atención.
                      </p>
                    </div>
                  </div>

                  {/* Real-time score indicator */}
                  <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-xl">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs">Puntuación SUS en directo:</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-amber-300">
                        {currentSusScore.toFixed(1)} / 100
                      </span>
                      <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        {currentSusScore >= 68 ? 'Aceptable / Excelente (≥68)' : 'Bajo revisión (<68)'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {SUS_QUESTIONS.map((question, i) => {
                      const val = susAnswers[i] || 3;
                      const isEven = i % 2 === 1; // Negative items in SUS are even (2, 4, 6, 8, 10 in 1-index)
                      return (
                        <div
                          key={i}
                          className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:bg-slate-100/60 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-slate-900 text-xs">
                              <span className="font-mono text-amber-700 font-bold mr-1.5">
                                SUS {i + 1}.
                              </span>
                              {question}
                            </span>
                            {isEven && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 shrink-0">
                                En negativo
                              </span>
                            )}
                          </div>

                          {/* 1 to 5 Radio Buttons */}
                          <div className="flex items-center justify-between gap-1 pt-1">
                            <span className="text-[10px] text-slate-400 hidden sm:inline">Muy en desacuerdo</span>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => handleSusChange(i, num)}
                                  className={`w-9 h-8 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                                    val === num
                                      ? 'bg-amber-700 text-white shadow-xs scale-105'
                                      : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-400 hidden sm:inline">Muy de acuerdo</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('indicadores')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('opinion')}
                      className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <span>Siguiente: Recomendación & Opinión</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: RECOMENDACIÓN (NPS) Y OPINIÓN */}
              {activeTab === 'opinion' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* NPS Scale 0-10 */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-amber-950">
                        ¿Con qué probabilidad recomendarías la plataforma a estudiantes de cursos siguientes?
                      </span>
                      <span className="text-xs font-black text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-300">
                        {recommendationNps} / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-11 gap-1 pt-1">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          type="button"
                          key={num}
                          onClick={() => setRecommendationNps(num)}
                          className={`h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                            recommendationNps === num
                              ? 'bg-amber-700 text-white shadow-xs scale-105'
                              : 'bg-white hover:bg-amber-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 px-0.5">
                      <span>0: Nada probable</span>
                      <span>10: Muy probable</span>
                    </div>
                  </div>

                  {/* Favorite Module */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">
                      Módulo que más te ha servido
                    </label>
                    <select
                      value={favoriteModule}
                      onChange={(e) => setFavoriteModule(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    >
                      {AVAILABLE_MODULES.map((mod) => (
                        <option key={mod} value={mod}>
                          {mod}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Open Questions */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        ¿Qué es lo que más te ha ayudado a aprender?
                      </label>
                      <textarea
                        rows={2}
                        value={bestFeature}
                        onChange={(e) => setBestFeature(e.target.value)}
                        placeholder="Ej: Los simuladores de rutas metabólicas, la justificación diagnóstica de las guardias, el rosco..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">
                        ¿Qué cambiarías o añadirías?
                      </label>
                      <textarea
                        rows={2}
                        value={suggestions}
                        onChange={(e) => setSuggestions(e.target.value)}
                        placeholder="Ej: Nuevos casos clínicos de endocrino, más tiempo en el temporizador, modo torneo en clase..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('sus')}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Atrás
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {gateReason !== 'none' ? 'Volver al Inicio (sin desbloquear)' : 'Cancelar'}
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>
                          {gateReason !== 'none'
                            ? 'Enviar Opinión y Desbloquear Acceso (+150 XP)'
                            : 'Enviar Opinión & Ganar +150 XP'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
