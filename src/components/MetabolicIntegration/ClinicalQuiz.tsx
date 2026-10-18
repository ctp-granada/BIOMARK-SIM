import React, { useState, useMemo } from 'react';
import { CLINICAL_CASES } from './data/metabolicData';
import { MetabolicStateId } from './types/metabolism';
import { BookOpen, CheckCircle, XCircle, ArrowRight, HelpCircle, Award, RotateCcw } from 'lucide-react';

interface ClinicalQuizProps {
  onNavigateToState: (stateId: MetabolicStateId) => void;
}

export const ClinicalQuiz: React.FC<ClinicalQuizProps> = ({ onNavigateToState }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});

  const currentCase = CLINICAL_CASES[currentQuestionIndex];
  const totalQuestions = CLINICAL_CASES.length;

  // Orden de opciones barajado de forma estable por caso (la correcta no queda siempre en la A)
  const shuffledOptions = useMemo(() => {
    let seed = 0;
    for (const ch of currentCase.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const arr = [...currentCase.options];
    for (let i = arr.length - 1; i > 0; i--) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      const j = seed % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentCase]);

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return; // already answered
    setSelectedOptionId(optionId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) return;
    const selectedOption = currentCase.options.find((o) => o.id === selectedOptionId);
    if (selectedOption?.isCorrect && !answeredQuestions[currentQuestionIndex]) {
      setUserScore((prev) => prev + 1);
    }
    setAnsweredQuestions((prev) => ({ ...prev, [currentQuestionIndex]: true }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setShowExplanation(false);
    setUserScore(0);
    setAnsweredQuestions({});
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-6">
      {/* Quiz Header with Score */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            <span>Casos Clínicos & Retos de Razonamiento Bioquímico</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pon a prueba tu comprensión de la integración metabólica resolviendo casos reales con deducción fisiopatológica.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="text-slate-500 font-medium">Puntuación:</span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {userScore} / {totalQuestions}
            </span>
          </div>

          <button
            onClick={handleResetQuiz}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reiniciar Evaluación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Progress Dots */}
      <div className="flex items-center gap-2">
        {CLINICAL_CASES.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => {
              setCurrentQuestionIndex(idx);
              setSelectedOptionId(null);
              setShowExplanation(false);
            }}
            className={`flex-1 h-2 rounded-full transition-all ${
              idx === currentQuestionIndex
                ? 'bg-teal-700 ring-2 ring-teal-600/30'
                : answeredQuestions[idx]
                ? 'bg-emerald-500'
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Case Scenario Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Caso Clínico #{currentQuestionIndex + 1} de {totalQuestions}</span>
          <button
            onClick={() => onNavigateToState(currentCase.relatedStateId)}
            className="text-teal-800 hover:text-teal-950 font-semibold normal-case flex items-center gap-1"
          >
            <span>Ver Simulación del Estado Relacionado</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mb-3">
          {currentCase.patientScenario}
        </p>

        {/* Symptoms and Lab Values Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200/80">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
              Hallazgos Clínicos & Signos:
            </span>
            <ul className="space-y-1 text-slate-700">
              {currentCase.symptoms.map((s, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0"></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">
              Valores de Laboratorio:
            </span>
            <div className="space-y-1">
              {currentCase.labValues.map((lv, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200/70">
                  <span className="text-slate-600 font-medium">{lv.parameter}:</span>
                  <span className="font-mono font-bold text-slate-900">{lv.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The Question */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 flex items-start gap-2">
          <HelpCircle className="w-4 h-4 text-teal-700 mt-0.5 shrink-0" />
          <span>{currentCase.question}</span>
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {shuffledOptions.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';

            if (showExplanation) {
              if (isSelected && opt.isCorrect) {
                optionStyle = 'bg-white border-emerald-500 text-slate-800 ring-1 ring-emerald-500';
              } else if (isSelected) {
                optionStyle = 'bg-white border-rose-500 text-slate-800 ring-1 ring-rose-500';
              } else {
                optionStyle = 'bg-white border-slate-200 text-slate-600';
              }
            } else if (isSelected) {
              optionStyle = 'bg-white border-slate-500 text-slate-900 ring-1 ring-slate-400';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={showExplanation}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${optionStyle}`}
              >
                <span className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 font-bold text-[11px] mt-0.5 bg-white">
                  {String.fromCharCode(65 + idx)}
                </span>
                <div className="flex-1">
                  <span className="font-medium leading-relaxed block">{opt.text}</span>
                  {showExplanation && (
                    <span className="text-[11px] mt-1.5 block font-normal leading-relaxed text-slate-600 border-t border-slate-200/50 pt-1">
                      {opt.feedback}
                    </span>
                  )}
                </div>
                {showExplanation && opt.isCorrect && (
                  <span className="text-[10px] font-bold text-emerald-700 whitespace-nowrap mt-0.5">Correcta</span>
                )}
                {showExplanation && opt.isCorrect && (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {showExplanation && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation & Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        {!showExplanation ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={!selectedOptionId}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
              selectedOptionId
                ? 'bg-teal-700 hover:bg-teal-800 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            Verificar Respuesta
          </button>
        ) : (
          <div className="w-full space-y-4">
            {/* Deep Biochemical Explanation Box */}
            <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 text-xs text-teal-950 space-y-2">
              <span className="font-bold text-teal-900 block uppercase tracking-wider text-[11px]">
                Explicación Bioquímica Detallada:
              </span>
              <p className="leading-relaxed text-slate-700">
                {currentCase.biochemicalExplanation}
              </p>
              <div className="pt-2 border-t border-teal-200/80 text-[11px] font-bold text-teal-900">
                💡 Conclusión Clave: {currentCase.keyTakeaway}
              </div>
            </div>

            <div className="flex justify-end">
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Siguiente Caso Clínico</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Finalizar y Reiniciar Cuestionario</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
