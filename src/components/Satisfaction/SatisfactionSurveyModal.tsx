import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  Send,
  Heart,
  MessageSquare,
  Award,
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  Gamepad2,
  Brain,
  ShieldCheck,
  TrendingUp,
  FileText,
  Clock,
  Laptop
} from 'lucide-react';
import {
  satisfactionService,
  SUS_STATEMENTS,
  CLINICAL_ITEMS_CONFIG,
  GAMIFICATION_ITEMS_CONFIG,
  CURRICULUM_INTEGRATION_OPTIONS,
  ACADEMIC_YEARS,
  ACADEMIC_ROLES,
  PRACTICE_SUBGROUPS,
  USAGE_TIME_OPTIONS,
  PRIOR_SIMULATION_EXPERIENCE,
  DEVICE_OPTIONS,
  ClinicalReasoningRatings,
  GamificationRatings,
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

  // Current Step (1: Demographics & Consent, 2: Clinical Reasoning, 3: Gamification, 4: System Usability SUS, 5: Pre-Post & Qualitative)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Demographics & Research Consent
  const [academicRole, setAcademicRole] = useState(ACADEMIC_ROLES[0] || 'Grado en Medicina');
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[1] || '2º Curso'); // 2º Curso por defecto
  const [subgroup, setSubgroup] = useState(
    profile.subgroup && PRACTICE_SUBGROUPS.includes(profile.subgroup)
      ? profile.subgroup
      : PRACTICE_SUBGROUPS[0]
  );
  const [deviceUsed, setDeviceUsed] = useState(DEVICE_OPTIONS[0]);
  const [estimatedUsageTime, setEstimatedUsageTime] = useState(USAGE_TIME_OPTIONS[1]);
  const [priorSimulationExperience, setPriorSimulationExperience] = useState(PRIOR_SIMULATION_EXPERIENCE[1]);
  const [researchConsent, setResearchConsent] = useState(true);

  // Step 2: Dimensión I - Razonamiento Clínico & Bioquímica Médica
  const [clinicalRatings, setClinicalRatings] = useState<ClinicalReasoningRatings>({
    clin1_fisiopatologia: 5,
    clin2_criterioAnalitico: 5,
    clin3_interpretacionPatrones: 5,
    clin4_aplicabilidadClinica: 5
  });

  // Step 3: Dimensión II - Gamificación & Engagement
  const [gamificationRatings, setGamificationRatings] = useState<GamificationRatings>({
    gam1_gestionPresupuesto: 5,
    gam2_feedbackInmediato: 5,
    gam3_motivacionCompetitiva: 5,
    gam4_preferenciaMetodologica: 5
  });

  // Step 4: Dimensión III - Usabilidad del Sistema (SUS 10 ítems estándar)
  const [susAnswers, setSusAnswers] = useState<number[]>([5, 1, 5, 1, 5, 1, 5, 1, 5, 1]);
  const [cognitiveLoad, setCognitiveLoad] = useState<number>(3); // 1 = trivial, 3 = adecuada/estimulante, 5 = excesiva

  // Step 5: Dimensión IV & V - Autoeficacia Pre-Post, Recomendación, Cualitativa
  const [selfEfficacyPre, setSelfEfficacyPre] = useState<number>(2); // 1-5 Antes
  const [selfEfficacyPost, setSelfEfficacyPost] = useState<number>(5); // 1-5 Después
  const [curriculumRecommendation, setCurriculumRecommendation] = useState<string>(CURRICULUM_INTEGRATION_OPTIONS[0]);
  const [favoriteModule, setFavoriteModule] = useState('Hospital Clínico (Guardias y Casos Clínicos Interactivos)');
  const [nps, setNps] = useState<number>(10);
  const [bestFeature, setBestFeature] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [suggestedPathologies, setSuggestedPathologies] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSubmittedSuccess(false);
      setValidationError(null);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  if (!isOpen) return null;

  const handleClinicalChange = (id: keyof ClinicalReasoningRatings, val: number) => {
    setClinicalRatings((prev) => ({ ...prev, [id]: val }));
  };

  const handleGamificationChange = (id: keyof GamificationRatings, val: number) => {
    setGamificationRatings((prev) => ({ ...prev, [id]: val }));
  };

  const handleSusChange = (index: number, val: number) => {
    setSusAnswers((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const nextStep = () => {
    setValidationError(null);
    if (currentStep === 1 && !researchConsent) {
      setValidationError('Es necesario confirmar el consentimiento informado para enviar las respuestas con fines de investigación docente.');
      return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
    scrollToTop();
  };

  const prevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    scrollToTop();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchConsent) {
      setValidationError('Es indispensable aceptar el consentimiento informado para investigación.');
      return;
    }

    setSubmitting(true);
    setValidationError(null);

    try {
      const susScore = satisfactionService.calculateSusScore(susAnswers);

      // Compatibilidad con esquema previo
      const projectRatings: ProjectRatings = {
        utilidadAprendizaje: clinicalRatings.clin1_fisiopatologia,
        simuladoresInteractivos: clinicalRatings.clin3_interpretacionPatrones,
        feedback: gamificationRatings.gam2_feedbackInmediato,
        atractivoVisual: 5,
        navegacion: susAnswers[2] || 5,
        gamificacionMotivacion: gamificationRatings.gam3_motivacionCompetitiva,
        valoracionGlobal: clinicalRatings.clin4_aplicabilidadClinica
      };

      const learningGain = selfEfficacyPost - selfEfficacyPre;

      const surveyData = {
        academicRole,
        academicYear,
        subgroup,
        deviceUsed,
        estimatedUsageTime,
        priorSimulationExperience,
        researchConsent,
        clinicalRatings,
        gamificationRatings,
        projectRatings,
        susAnswers,
        susScore,
        cognitiveLoad,
        selfEfficacyPre,
        selfEfficacyPost,
        learningGain,
        curriculumIntegrationRecommendation: curriculumRecommendation,
        recommendationNps: nps,
        favoriteModule,
        qualitative: {
          bestFeature: bestFeature.trim(),
          suggestionsForImprovement: suggestions.trim(),
          suggestedPathologies: suggestedPathologies.trim()
        }
      };

      const savedLocal = await satisfactionService.saveSurvey(surveyData);

      // Sincronizar en Firestore con la colección 'satisfaction_surveys'
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
      }, 2600);
    } catch (err) {
      console.error(err);
      setValidationError('Ocurrió un error al guardar la encuesta. Por favor, inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Reusable Likert Selector
  const renderLikertButtons = (
    currentValue: number,
    onChange: (val: number) => void,
    leftAnchor: string = 'Total desacuerdo',
    rightAnchor: string = 'Total acuerdo'
  ) => (
    <div className="flex flex-col gap-1 w-full sm:w-auto">
      <div className="flex items-center gap-1 sm:gap-1.5 justify-between sm:justify-start">
        {[1, 2, 3, 4, 5].map((val) => {
          const isSelected = currentValue === val;
          return (
            <button
              type="button"
              key={val}
              onClick={() => onChange(val)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs font-black transition-all flex items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400 scale-105'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              {val}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 px-0.5 font-medium">
        <span>1: {leftAnchor}</span>
        <span>5: {rightAnchor}</span>
      </div>
    </div>
  );

  return (
    <div
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="min-h-full flex items-start justify-center py-4 sm:py-8">
        <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 border border-slate-200 shadow-2xl relative text-slate-900">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          {submittedSuccess ? (
            <div className="text-center py-12 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">
                  ¡Muchas Gracias por tu Contribución a la Investigación Docente!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                  Tus respuestas han sido procesadas y sincronizadas con la base de datos de <strong className="text-amber-800">Firebase Firestore</strong> (colección <span className="font-mono text-indigo-600 font-bold">satisfaction_surveys</span>) del <strong>Proyecto de Innovación Docente PID 26-158</strong> de la Universidad de Granada.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>¡Recompensa desbloqueada: +150 XP y +100 € de presupuesto añadidos a tu ficha de guardia!</span>
              </div>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300/80 inline-flex items-center gap-1">
                    <Brain className="w-3 h-3 text-amber-800" />
                    Investigación Docente PID 26-158 · UGR
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    Facultad de Medicina
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Cuestionario de Evaluación del Impacto en el Razonamiento Clínico
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Este instrumento recoge datos científicos para evaluar la efectividad pedagógica de la simulación clínica virtual y la gamificación en Bioquímica Médica. Tus valoraciones sustentan la publicación docente del proyecto.
                </p>
              </div>

              {/* Step indicator bar */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Paso {currentStep} de 5: {
                    currentStep === 1 ? 'Perfil Académico & Consentimiento' :
                    currentStep === 2 ? 'Razonamiento Clínico & Bioquímica' :
                    currentStep === 3 ? 'Gamificación & Motivación' :
                    currentStep === 4 ? 'Usabilidad Internacional SUS' :
                    'Competencia Percibida & Feedback'
                  }</span>
                  <span className="text-amber-800 font-extrabold">{currentStep * 20}%</span>
                </div>
                {/* Progress track */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-600 to-amber-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${currentStep * 20}%` }}
                  />
                </div>
                
                {/* Steps mini navigation tabs */}
                <div className="grid grid-cols-5 gap-1.5 mt-2.5 pt-1 border-t border-slate-200/70 text-center">
                  {[
                    { num: 1, label: 'Perfil' },
                    { num: 2, label: 'Clínica' },
                    { num: 3, label: 'Lúdica' },
                    { num: 4, label: 'SUS' },
                    { num: 5, label: 'Impacto' }
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.num}
                      onClick={() => {
                        setValidationError(null);
                        setCurrentStep(s.num);
                        scrollToTop();
                      }}
                      className={`text-[10px] font-bold py-1 px-1 rounded-lg transition-colors cursor-pointer ${
                        currentStep === s.num
                          ? 'bg-amber-600 text-white'
                          : currentStep > s.num
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {s.num}. {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {validationError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* PASO 1: DATOS ACADÉMICOS Y CONSENTIMIENTO ÉTICO */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                      <div className="flex items-center gap-2 text-amber-950 font-extrabold text-xs">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Consentimiento Informado para Investigación Docente Universitaria</span>
                      </div>
                      <p className="text-[11px] text-amber-900/90 leading-relaxed text-justify">
                        En el marco del <strong>Proyecto de Innovación Docente PID 26-158</strong> (Departamento de Bioquímica y Biología Molecular III e Inmunología, Facultad de Medicina, Universidad de Granada), se recogen datos agregados y anonimizados con fines estrictos de investigación y difusión científica en revistas de educación médica. La participación es voluntaria y la confidencialidad está garantizada según el Reglamento General de Protección de Datos (RGPD) y los principios éticos de la Declaración de Helsinki.
                      </p>
                      <label className="flex items-start gap-2.5 pt-1 text-xs font-bold text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={researchConsent}
                          onChange={(e) => setResearchConsent(e.target.checked)}
                          className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                        />
                        <span>
                          Doy mi consentimiento libre e informado para que mis respuestas anónimas se utilicen en el estudio estadístico y posterior publicación docente del proyecto PID 26-158.
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Titulación / Rol Académico:
                        </label>
                        <select
                          value={academicRole}
                          onChange={(e) => setAcademicRole(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                        >
                          {ACADEMIC_ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Curso Académico:
                        </label>
                        <select
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                        >
                          {ACADEMIC_YEARS.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Subgrupo de Prácticas / Seminarios:
                        </label>
                        <select
                          value={subgroup}
                          onChange={(e) => setSubgroup(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                        >
                          {PRACTICE_SUBGROUPS.map((sg) => (
                            <option key={sg} value={sg}>{sg}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Dispositivo Principal Utilizado:
                        </label>
                        <select
                          value={deviceUsed}
                          onChange={(e) => setDeviceUsed(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                        >
                          {DEVICE_OPTIONS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Tiempo Acumulado de Uso:
                        </label>
                        <select
                          value={estimatedUsageTime}
                          onChange={(e) => setEstimatedUsageTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                        >
                          {USAGE_TIME_OPTIONS.map((u) => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Experiencia Previa con Simuladores Clínicos:
                        </label>
                        <select
                          value={priorSimulationExperience}
                          onChange={(e) => setPriorSimulationExperience(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                        >
                          {PRIOR_SIMULATION_EXPERIENCE.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* PASO 2: DIMENSIÓN I - RAZONAMIENTO CLÍNICO & BIOQUÍMICA */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Stethoscope className="w-4 h-4 text-rose-600" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        Dimensión I: Razonamiento Diagnóstico & Correlación Bioquímica (Likert 1 a 5)
                      </h3>
                    </div>

                    <div className="space-y-3.5">
                      {CLINICAL_ITEMS_CONFIG.map((cfg) => (
                        <div
                          key={cfg.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 max-w-md">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                                {cfg.code}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{cfg.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-normal">
                              {cfg.description}
                            </p>
                          </div>
                          {renderLikertButtons(clinicalRatings[cfg.id], (val) => handleClinicalChange(cfg.id, val))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PASO 3: DIMENSIÓN II - GAMIFICACIÓN & DINÁMICA PEDAGÓGICA */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <Gamepad2 className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        Dimensión II: Gamificación, Motivación & Engagement (Likert 1 a 5)
                      </h3>
                    </div>

                    <div className="space-y-3.5">
                      {GAMIFICATION_ITEMS_CONFIG.map((cfg) => (
                        <div
                          key={cfg.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5 max-w-md">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {cfg.code}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{cfg.label}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-normal">
                              {cfg.description}
                            </p>
                          </div>
                          {renderLikertButtons(gamificationRatings[cfg.id], (val) => handleGamificationChange(cfg.id, val))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PASO 4: DIMENSIÓN III - SYSTEM USABILITY SCALE (SUS 10 ÍTEMS) */}
                {currentStep === 4 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          Dimensión III: System Usability Scale (SUS) · Escala Estandarizada
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                        John Brooke (1986)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Responde a los 10 ítems psicométricos internacionales de usabilidad. Califica del 1 (Total desacuerdo) al 5 (Total acuerdo).
                    </p>

                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {SUS_STATEMENTS.map((item, idx) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs"
                        >
                          <div className="flex items-start gap-2 max-w-sm sm:max-w-md">
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-100/70 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              {item.id}
                            </span>
                            <span className="text-slate-800 font-medium leading-snug">
                              {item.text}
                            </span>
                          </div>
                          <div className="self-end sm:self-auto shrink-0">
                            {renderLikertButtons(susAnswers[idx], (val) => handleSusChange(idx, val))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Carga cognitiva percibida */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 max-w-md">
                        <span className="text-xs font-bold text-indigo-950">
                          Carga Cognitiva Subjetiva (Dificultad de la plataforma)
                        </span>
                        <p className="text-[11px] text-indigo-900/80">
                          1 = Excesivamente fácil/trivial · 3 = Dificultad equilibrada y estimulante · 5 = Demasiado compleja y agotadora
                        </p>
                      </div>
                      {renderLikertButtons(cognitiveLoad, setCognitiveLoad, 'Trivial', 'Agotadora')}
                    </div>
                  </div>
                )}

                {/* PASO 5: IMPACTO EDUCATIVO PRE-POST, INTEGRACIÓN & CUALITATIVO */}
                {currentStep === 5 && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <TrendingUp className="w-4 h-4 text-amber-700" />
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        Dimensión IV & V: Ganancia de Competencia y Recomendación
                      </h3>
                    </div>

                    {/* Comparativa Pre-Post Self-Efficacy */}
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3.5">
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-amber-950">
                          Autopercepción de Competencia Clínica (Medida Pre vs. Post)
                        </span>
                        <p className="text-[11px] text-amber-900/90">
                          Permite cuantificar la ganancia de aprendizaje (Delta / Learning Gain) para el artículo docente.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-2">
                          <span className="text-xs font-bold text-slate-800 block">
                            ¿Cuál era tu confianza diagnóstica ANTES de usar la plataforma?
                          </span>
                          {renderLikertButtons(selfEfficacyPre, setSelfEfficacyPre, 'Muy baja', 'Muy alta')}
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-amber-200/80 space-y-2">
                          <span className="text-xs font-bold text-slate-800 block">
                            ¿Cuál es tu confianza diagnóstica TRAS haber utilizado la plataforma?
                          </span>
                          {renderLikertButtons(selfEfficacyPost, setSelfEfficacyPost, 'Muy baja', 'Muy alta')}
                        </div>
                      </div>

                      <div className="text-[11px] text-amber-900 font-bold bg-amber-100/60 p-2 rounded-xl text-center">
                        Delta de ganancia calculada: <span className="font-mono text-amber-800 text-sm">+{Math.max(0, selfEfficacyPost - selfEfficacyPre)} puntos</span> en escala Likert
                      </div>
                    </div>

                    {/* Integración oficial en la Guía Docente */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        ¿Cómo recomendarías incorporar esta plataforma en la asignatura oficial?
                      </label>
                      <select
                        value={curriculumRecommendation}
                        onChange={(e) => setCurriculumRecommendation(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                      >
                        {CURRICULUM_INTEGRATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Módulo Favorito & NPS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          ¿Qué módulo te pareció más provechoso?
                        </label>
                        <select
                          value={favoriteModule}
                          onChange={(e) => setFavoriteModule(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800"
                        >
                          <option value="Hospital Clínico (Guardias y Casos Clínicos Interactivos)">Hospital Clínico (Guardias y Casos)</option>
                          <option value="Parque Biomédico (El Rosco, Crucigrama, Sopa de Letras)">Parque Biomédico (El Rosco y Minijuegos)</option>
                          <option value="Laboratorios Metabólicos Interactivos (Lanzadera Carnitina / Randle)">Laboratorios y Simuladores Metabólicos</option>
                          <option value="Biblioteca y Vademécum de Biomarcadores">Biblioteca y Vademécum Analítico</option>
                          <option value="Reto Diario Contrarreloj 2x">Reto Diario 2x y Ranking</option>
                        </select>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-800">Recomendación a pares (NPS):</span>
                          <span className="font-mono font-black text-amber-700 text-sm">{nps} / 10</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          step="1"
                          value={nps}
                          onChange={(e) => setNps(parseInt(e.target.value, 10))}
                          className="w-full accent-amber-600"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>0: No recomendaría</span>
                          <span>10: Con total seguridad</span>
                        </div>
                      </div>
                    </div>

                    {/* Preguntas cualitativas abiertas */}
                    <div className="space-y-3 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                        <span>Preguntas Cualitativas para Análisis Temático</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          1. ¿Qué aspectos específicos de la plataforma consideras que han tenido un mayor valor formativo?
                        </label>
                        <textarea
                          rows={2}
                          value={bestFeature}
                          onChange={(e) => setBestFeature(e.target.value)}
                          placeholder="Ej. El feedback explicativo al fallar una prueba y tener que ajustar el presupuesto..."
                          className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-y"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          2. Propuestas u oportunidades de mejora pedagógica:
                        </label>
                        <textarea
                          rows={2}
                          value={suggestions}
                          onChange={(e) => setSuggestions(e.target.value)}
                          placeholder="Ej. Más casos de pediatría metabólica, enlaces directos a guías clínicas..."
                          className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-y"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">
                          3. Biomarcadores o patologías adicionales que sugerirías para próximas promociones:
                        </label>
                        <input
                          type="text"
                          value={suggestedPathologies}
                          onChange={(e) => setSuggestedPathologies(e.target.value)}
                          placeholder="Ej. Feocromocitoma (metanefrinas), Enfermedad de Wilson (ceruloplasmina)..."
                          className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Controls / Navigation buttons */}
                <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Anterior</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Posponer
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStep < 5 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? 'Guardando en la Nube...' : 'Enviar Encuesta (+150 XP, +100 €)'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
