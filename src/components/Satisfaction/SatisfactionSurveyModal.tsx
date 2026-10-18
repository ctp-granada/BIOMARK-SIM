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
  GraduationCap
} from 'lucide-react';
import { satisfactionService, SatisfactionFeedback } from '../../utils/satisfactionService';
import { audioService } from '../../utils/audioService';

interface SatisfactionSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardUser?: (xp: number, budget: number) => void;
  onOpenMetrics?: () => void;
}

export const SatisfactionSurveyModal: React.FC<SatisfactionSurveyModalProps> = ({
  isOpen,
  onClose,
  onRewardUser,
  onOpenMetrics
}) => {
  const [subgroup, setSubgroup] = useState<string>('Subgrupo 1 (LAB L-5/6)');
  const [academicRole, setAcademicRole] = useState<'Alumno Grado Medicina' | 'Alumno Otro Grado Salud' | 'Docente / Tutor'>('Alumno Grado Medicina');
  
  // Ratings 1 to 5
  const [clinicalUtility, setClinicalUtility] = useState<number>(5);
  const [interactiveSimulators, setInteractiveSimulators] = useState<number>(5);
  const [gamificationMotivation, setGamificationMotivation] = useState<number>(5);
  const [usabilityInterface, setUsabilityInterface] = useState<number>(5);
  const [overallSatisfaction, setOverallSatisfaction] = useState<number>(5);
  const [recommendationScore, setRecommendationScore] = useState<number>(10);

  // Qualitative
  const [bestFeature, setBestFeature] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [favoriteModule, setFavoriteModule] = useState<string>('Simulador de Integración Metabólica');

  const [submitted, setSubmitted] = useState<boolean>(false);
  const alreadyCompleted = satisfactionService.hasUserCompletedSurvey();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    satisfactionService.submitSurvey({
      subgroup,
      academicRole,
      ratings: {
        clinicalUtility,
        interactiveSimulators,
        gamificationMotivation,
        usabilityInterface,
        overallSatisfaction,
        recommendationScore
      },
      qualitative: {
        bestFeature: bestFeature.trim() || 'Muy buena integración de casos y simuladores.',
        suggestionsForImprovement: suggestions.trim() || 'Continuar incorporando casos clínicos y ampliando el banco.',
        favoriteModule
      }
    });

    audioService.playSuccess();
    setSubmitted(true);

    if (onRewardUser) {
      onRewardUser(150, 100);
    }
  };

  const renderStarSelector = (
    label: string,
    description: string,
    value: number,
    onChange: (val: number) => void
  ) => {
    const labels = ['Muy Insuficiente', 'Mejorable', 'Aceptable', 'Muy Buena', 'Excelente'];
    return (
      <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <span className="text-xs font-bold text-slate-900 block">{label}</span>
            <span className="text-[11px] text-slate-500">{description}</span>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 self-start sm:self-center shrink-0">
            {value} / 5 · {labels[value - 1]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => onChange(star)}
              className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer focus:outline-hidden"
              title={`${star} estrellas - ${labels[star - 1]}`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= value
                    ? 'text-amber-400 fill-amber-400 filter drop-shadow-xs'
                    : 'text-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-6 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-amber-900/60 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0 mt-0.5">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                  Calidad Docente & Acreditación UGR
                </span>
                <span className="text-[10px] font-mono text-amber-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  +150 XP y +100 € Recompensa
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Encuesta de Satisfacción del Alumnado
              </h2>
              <p className="text-xs text-amber-100/90 mt-1">
                Tu valoración anónima ayuda a perfeccionar los casos clínicos, los simuladores y la docencia de Bioquímica Médica.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">
                  ¡Muchísimas gracias por tu evaluación!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tus respuestas han quedado registradas para la memoria docente del Departamento de Bioquímica y Biología Molecular III e Inmunología de la UGR.
                </p>
              </div>

              {/* Reward Box */}
              <div className="bg-gradient-to-r from-amber-50 to-emerald-50 p-4 rounded-2xl border border-amber-200/80 max-w-sm mx-auto flex items-center justify-around gap-4 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-black">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Bonus Recibido</span>
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

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onOpenMetrics && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenMetrics();
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 text-slate-600" />
                    <span>Ver Métricas Globales de la Plataforma</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Continuar Aprendiendo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {alreadyCompleted && (
                <div className="bg-blue-50 border border-blue-200 text-blue-900 p-3 rounded-xl flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-[11px]">
                    Ya has enviado tu valoración previamente, pero puedes actualizar tus respuestas o comentarios siempre que lo desees.
                  </span>
                </div>
              )}

              {/* Demographic / Academic Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Tu Perfil Académico
                  </label>
                  <select
                    value={academicRole}
                    onChange={(e) => setAcademicRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Alumno Grado Medicina">Alumno/a Grado en Medicina (UGR)</option>
                    <option value="Alumno Otro Grado Salud">Alumno/a Otro Grado en Salud / Ciencias</option>
                    <option value="Docente / Tutor">Profesor/a / Tutor Clínico</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Subgrupo de Prácticas / Seminarios
                  </label>
                  <select
                    value={subgroup}
                    onChange={(e) => setSubgroup(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((num) => (
                      <option key={num} value={`Subgrupo ${num} (LAB / Aula)`}>
                        Subgrupo {num} (Prácticas y Seminarios)
                      </option>
                    ))}
                    <option value="Alumno General / Turno Libre">Alumno General / Turno Libre</option>
                  </select>
                </div>
              </div>

              {/* 5 Core Evaluation Dimensions */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  1. Dimensiones de Calidad Docente & Usabilidad
                </span>

                {renderStarSelector(
                  'Utilidad de los Casos Clínicos y Biomarcadores',
                  '¿La resolución de casos clínicos y las fichas de biomarcadores te ayudan a razonar la bioquímica médica?',
                  clinicalUtility,
                  setClinicalUtility
                )}

                {renderStarSelector(
                  'Simuladores Interactivos (Randle, Ictericias, Hemostasia, Integra)',
                  '¿Los simuladores moleculares y el atlas del cuerpo humano facilitan el aprendizaje de rutas complejas?',
                  interactiveSimulators,
                  setInteractiveSimulators
                )}

                {renderStarSelector(
                  'Gamificación, Vidas y Motivación (Guardias, Presupuesto, Rosco)',
                  '¿El sistema de turnos de guardia de urgencias, vidas, ranking y retos hace el estudio más ameno y constante?',
                  gamificationMotivation,
                  setGamificationMotivation
                )}

                {renderStarSelector(
                  'Facilidad de Uso, Navegación y Rapidez de la Plataforma',
                  '¿La plataforma es rápida, intuitiva y fácil de usar en tu ordenador o dispositivo móvil?',
                  usabilityInterface,
                  setUsabilityInterface
                )}

                {renderStarSelector(
                  'Satisfacción Global con la Herramienta',
                  'Valoración general de la plataforma como apoyo docente para la asignatura de Bioquímica Médica.',
                  overallSatisfaction,
                  setOverallSatisfaction
                )}
              </div>

              {/* NPS Question: Recommendation 0-10 */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-950">
                    2. Recomendación a Compañeros de Cursos Siguientes (NPS)
                  </span>
                  <span className="text-xs font-black text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-300">
                    {recommendationScore} / 10
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80">
                  ¿Con qué probabilidad recomendarías esta plataforma a futuros alumnos de 1º o 2º de Medicina?
                </p>
                <div className="grid grid-cols-11 gap-1 pt-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRecommendationScore(num)}
                      className={`h-8 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        recommendationScore === num
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

              {/* Qualitative Feedback */}
              <div className="space-y-3 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  3. Tu Opinión Cualitativa (Opcional)
                </span>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    Módulo o Simulador Favorito
                  </label>
                  <select
                    value={favoriteModule}
                    onChange={(e) => setFavoriteModule(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Simulador de Integración Metabólica (Integra)">Simulador de Integración Metabólica (Integra)</option>
                    <option value="Hospital Clínico (Guardias & Casos Clínicos)">Hospital Clínico (Guardias & Casos Clínicos)</option>
                    <option value="Simulador de Ictericias">Simulador de Ictericias</option>
                    <option value="Simulador del Ciclo de Randle">Simulador del Ciclo de Randle</option>
                    <option value="Simulador de Hemostasia">Simulador de Hemostasia</option>
                    <option value="Parque Biomédico & Rosco de Bioquímica">Parque Biomédico & Rosco de Bioquímica</option>
                    <option value="Vademécum de Biomarcadores">Vademécum de Biomarcadores</option>
                    <option value="Temario Oficial & Preguntas Test">Temario Oficial & Preguntas Test</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    ¿Qué es lo que más te ha gustado o más te ha ayudado a aprender?
                  </label>
                  <textarea
                    rows={2}
                    value={bestFeature}
                    onChange={(e) => setBestFeature(e.target.value)}
                    placeholder="Ej. La explicación al fallar un diagnóstico, el atlas dinámico del cuerpo..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">
                    ¿Qué añadirías o mejorarías de cara al próximo curso?
                  </label>
                  <textarea
                    rows={2}
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    placeholder="Ej. Nuevos casos de endocrinología, modo desafío con temporizador más amplio..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Envío 100% anónimo para docencia UGR</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Encuesta & Ganar +150 XP</span>
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
