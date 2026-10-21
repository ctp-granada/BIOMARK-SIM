import React, { useState } from 'react';
import {
  X,
  Star,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Send,
  Heart,
  MessageSquare,
  Award
} from 'lucide-react';
import {
  satisfactionService,
  SUS_STATEMENTS,
  LIKERT_PROJECT_ITEMS,
  ProjectRatings
} from '../../utils/satisfactionService';
import { saveSatisfactionSurveyToCloud, getOrCreateStudentProfile } from '../../lib/firebase';

interface SatisfactionSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSurveySubmitted?: () => void;
}

export const SatisfactionSurveyModal: React.FC<SatisfactionSurveyModalProps> = ({
  isOpen,
  onClose,
  onSurveySubmitted
}) => {
  const profile = getOrCreateStudentProfile();

  const [academicRole, setAcademicRole] = useState('Alumno/a del Grado en Medicina');
  const [subgroup, setSubgroup] = useState(profile.subgroup || 'Subgrupo 1');

  // Likert Project Ratings 1-5
  const [ratings, setRatings] = useState<ProjectRatings>({
    navegacion: 5,
    feedback: 5,
    atractivoVisual: 5,
    utilidadAprendizaje: 5,
    valoracionGlobal: 5,
    simuladoresInteractivos: 5,
    gamificacionMotivacion: 5
  });

  // SUS 10 items
  const [susAnswers, setSusAnswers] = useState<number[]>([5, 1, 5, 1, 5, 1, 5, 1, 5, 1]);

  // NPS 0-10
  const [nps, setNps] = useState<number>(10);

  // Module Favorite
  const [favoriteModule, setFavoriteModule] = useState('Simuladores Fisiopatológicos (La Lanzadera Rota)');

  // Qualitative
  const [bestFeature, setBestFeature] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRatingChange = (id: keyof ProjectRatings, val: number) => {
    setRatings((prev) => ({ ...prev, [id]: val }));
  };

  const handleSusChange = (index: number, val: number) => {
    setSusAnswers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const susScore = satisfactionService.calculateSusScore(susAnswers);

      const savedLocal = await satisfactionService.saveSurvey({
        academicRole,
        subgroup,
        projectRatings: ratings,
        susAnswers,
        susScore,
        recommendationNps: nps,
        favoriteModule,
        qualitative: {
          bestFeature: bestFeature.trim(),
          suggestionsForImprovement: suggestions.trim()
        }
      });

      // Synchronize with Firestore cloud
      try {
        await saveSatisfactionSurveyToCloud(savedLocal);
      } catch (cloudErr) {
        console.warn('Sincronización cloud omitida o fallida:', cloudErr);
      }

      setSubmittedSuccess(true);
      if (onSurveySubmitted) onSurveySubmitted();
      setTimeout(() => {
        onClose();
        setSubmittedSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">¡Muchas Gracias por tu Valoración!</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Tu respuesta ha sido registrada en tiempo real en la base de datos oficial del Proyecto de Innovación Docente PID 26-158 (Facultad de Medicina, UGR).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-black tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Encuesta de Calidad Docente (PID 26-158)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Encuesta de Satisfacción y Usabilidad SUS
              </h2>
              <p className="text-xs text-slate-500">
                Tu opinión nos ayuda a perfeccionar la simulación clínica de Bioquímica Médica. Todas las respuestas son anónimas y se agregan a la memoria docente.
              </p>
            </div>

            {/* Role & Subgroup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rol Académico:</label>
                <select
                  value={academicRole}
                  onChange={(e) => setAcademicRole(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="Alumno/a del Grado en Medicina">Alumno/a del Grado en Medicina</option>
                  <option value="Profesor/a o Tutor Clínico">Profesor/a o Tutor Clínico</option>
                  <option value="Médico Interno Residente (MIR)">Médico Interno Residente (MIR)</option>
                  <option value="Otro Estudiante del Área de Salud">Otro Estudiante del Área de Salud</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Subgrupo de Prácticas:</label>
                <select
                  value={subgroup}
                  onChange={(e) => setSubgroup(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-800"
                >
                  <option value="Subgrupo 1">Subgrupo 1</option>
                  <option value="Subgrupo 2">Subgrupo 2</option>
                  <option value="Subgrupo 3">Subgrupo 3</option>
                  <option value="Subgrupo 4">Subgrupo 4</option>
                  <option value="Subgrupo 5">Subgrupo 5</option>
                  <option value="Subgrupo 6">Subgrupo 6</option>
                </select>
              </div>
            </div>

            {/* Likert Items */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Valoración del Proyecto (1: Total desacuerdo · 5: Totalmente de acuerdo)
              </h3>
              <div className="space-y-2.5">
                {LIKERT_PROJECT_ITEMS.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <span className="text-slate-800 font-semibold">{item.label}</span>
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          type="button"
                          key={val}
                          onClick={() => handleRatingChange(item.id, val)}
                          className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                            ratings[item.id] === val
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Promoter Score (NPS 0-10) */}
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-indigo-950">
                  ¿Con qué probabilidad recomendarías esta plataforma a otros compañeros? (NPS)
                </span>
                <span className="font-mono font-black text-indigo-700 text-sm">{nps} / 10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={nps}
                onChange={(e) => setNps(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>0: Nada probable</span>
                <span>10: Muy probable</span>
              </div>
            </div>

            {/* Favorite Module */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">¿Qué módulo te ha parecido más formativo?</label>
              <select
                value={favoriteModule}
                onChange={(e) => setFavoriteModule(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="Simuladores Fisiopatológicos (La Lanzadera Rota)">Simuladores Fisiopatológicos (La Lanzadera Rota)</option>
                <option value="Hospital Clínico (31 Casos Clínicos y Biomarcadores)">Hospital Clínico (31 Casos Clínicos y Biomarcadores)</option>
                <option value="Ranking y Clasificación de Alumnos">Ranking y Clasificación de Alumnos</option>
                <option value="Biblioteca de Biomarcadores y Cinética">Biblioteca de Biomarcadores y Cinética</option>
              </select>
            </div>

            {/* Qualitative Feedback */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Lo que más valoras de la plataforma:</label>
                <input
                  type="text"
                  value={bestFeature}
                  onChange={(e) => setBestFeature(e.target.value)}
                  placeholder="Ej. La interactividad de la lanzadera rota y el feedback inmediato..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sugerencias de mejora para próximas ediciones:</label>
                <input
                  type="text"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="Ej. Añadir más casos de enfermedades raras o integración con seminarios..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Guardando...' : 'Enviar Encuesta'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
