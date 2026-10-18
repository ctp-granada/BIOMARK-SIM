import React, { useState, useEffect, useMemo } from 'react';
import { ClinicalCase, BiomarkerOption, UserProgress } from '../../types';
import { BIOMARKERS_DATABASE } from '../../data/biomarkers';
import { getBudgetInfo, getStreakMultiplier } from '../../utils/gamification';
import { MultiBiomarkerLabPanel } from './MultiBiomarkerLabPanel';
import { DailyTimerHUD } from './DailyTimerHUD';
import { 
  Target, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight, 
  Activity, 
  Coins,
  Flame, 
  Wallet, 
  ShieldAlert, 
  ClipboardList, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Check, 
  AlertCircle,
  User,
  Stethoscope,
  Info,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChallengeModeProps {
  currentCase: ClinicalCase;
  userProgress: UserProgress;
  isDailyChallenge?: boolean;
  dailyTimeRemaining?: number;
  dailyBonusMultiplier?: number;
  isDailyTimerExpired?: boolean;
  onDailyTimerExpire?: () => void;
  onOpenLibraryModal: () => void;
  onDeductBudget?: (amount: number, reason?: string) => void;
  onSubmitAnswer: (selectedOption: BiomarkerOption, consultedLibrary: boolean) => void;
  onSubmitLabOrder: (orderedBiomarkerIds: string[], consultedLibrary: boolean) => void;
  consultedLibrary: boolean;
  onNextCase: () => void;
  onBackToCaseList?: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({
  currentCase,
  userProgress,
  isDailyChallenge = false,
  dailyTimeRemaining = 120,
  dailyBonusMultiplier = 2.0,
  isDailyTimerExpired = false,
  onDailyTimerExpire,
  onOpenLibraryModal,
  onDeductBudget,
  onSubmitAnswer,
  onSubmitLabOrder,
  consultedLibrary,
  onNextCase,
  onBackToCaseList
}) => {
  const [resolutionMode, setResolutionMode] = useState<'multi' | 'single'>('multi');
  const [isCaseDetailsExpanded, setIsCaseDetailsExpanded] = useState<boolean>(true);
  const [showQuickGuide, setShowQuickGuide] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [consultedBiomarkerIds, setConsultedBiomarkerIds] = useState<string[]>([]);
  const [singleConsultPrompt, setSingleConsultPrompt] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    setConsultedBiomarkerIds([]);
    setSelectedOptionId(null);
    setIsCaseDetailsExpanded(true);
  }, [currentCase.id]);

  const handleConsultBiomarker = (biomarkerId: string, cost = 50): boolean => {
    if (consultedBiomarkerIds.includes(biomarkerId)) return true;
    if (userProgress.budget < cost) return false;
    onDeductBudget?.(cost, 'Consulta de indicación clínica');
    setConsultedBiomarkerIds((prev) => [...prev, biomarkerId]);
    return true;
  };

  const budgetInfo = getBudgetInfo(userProgress.budget);
  const streakInfo = getStreakMultiplier(userProgress.streak);

  const selectedOption = currentCase.biomarkerOptions.find((o) => o.id === selectedOptionId);

  const handleSingleSubmit = () => {
    if (!selectedOption) return;
    onSubmitAnswer(selectedOption, consultedLibrary);
  };

  const handleMultiSubmit = (orderedBiomarkerIds: string[]) => {
    onSubmitLabOrder(orderedBiomarkerIds, consultedLibrary);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Reto Clínico Diario HUD Timer if active */}
      {isDailyChallenge && (
        <DailyTimerHUD
          timeRemainingSeconds={dailyTimeRemaining}
          totalSeconds={120}
          bonusMultiplier={dailyBonusMultiplier}
          isExpired={isDailyTimerExpired}
          onTimeExpire={onDailyTimerExpire}
        />
      )}

      {/* Top Header: Back to Cases & Case Identity */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          {onBackToCaseList && (
            <button
              type="button"
              onClick={onBackToCaseList}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Casos</span>
            </button>
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
              Resolución de Caso Clínico #{currentCase.id}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {currentCase.title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
            {currentCase.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
            {currentCase.system}
          </span>
        </div>
      </div>

      {/* 3-Step Clinical Progress Stepper Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span className="whitespace-nowrap">Historia Clínica</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Step 2 */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span className="whitespace-nowrap">
                {resolutionMode === 'multi' ? 'Petición Analítica' : 'Selección de Prueba'}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

            {/* Step 3 */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-xs">
                3
              </span>
              <span className="whitespace-nowrap">Informe STAT & Evaluación</span>
            </div>
          </div>

          {/* Quick Guide Trigger */}
          <button
            type="button"
            onClick={() => setShowQuickGuide(!showQuickGuide)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>¿Cómo resolver el caso?</span>
          </button>
        </div>

        {/* Collapsible Quick Guide */}
        <AnimatePresence>
          {showQuickGuide && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">1</span>
                  <span><strong>Lee el caso:</strong> Revisa el motivo de consulta, constantes y analítica básica en la ficha del paciente.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">2</span>
                  <span><strong>Solicita las pruebas:</strong> Selecciona solo las determinaciones necesarias para no agotar tus 5.000 € de fondos.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">3</span>
                  <span><strong>Emite la orden:</strong> El autoanalizador procesará la muestra y evaluará tu acierto diagnóstico y eficiencia.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clean HUD: Hospital Funds & Budget Meter */}
      <div id="tour-gamification-hud" className="bg-slate-950 text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Fondos Hospitalarios */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-2xs">
            <Coins className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fondos Hospitalarios</div>
            <div className="text-sm font-bold text-amber-300 font-mono flex items-center gap-1.5">
              <span>{userProgress.budget.toLocaleString('es-ES')} € Disponibles</span>
              {userProgress.budget < 1000 && (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-sans">
                  ¡Alerta Fondos Bajos!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Realtime Budget Bar */}
        <div className="flex-1 min-w-[200px] max-w-sm">
          <div className="flex justify-between items-center text-[10px] mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              Presupuesto de Guardia
            </span>
            <span className={`font-mono font-bold ${budgetInfo.isRedAlert ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {budgetInfo.statusText}
            </span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              animate={{ width: `${Math.min(100, Math.max(0, (userProgress.budget / 5000) * 100))}%` }}
              className={`h-full rounded-full transition-all ${budgetInfo.isRedAlert ? 'bg-rose-600' : 'bg-emerald-500'}`}
            />
          </div>
          {budgetInfo.isRedAlert && (
            <span className="text-[9px] text-rose-400 font-bold flex items-center gap-1 mt-0.5">
              <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
              Presupuesto crítico: puedes ganar fondos resolviendo juegos en el Parque
            </span>
          )}
        </div>

        {/* Multiplicador de Racha */}
        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
          <Flame className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <div>
            <div className="text-[9px] text-slate-400 font-bold uppercase">Racha de Casos</div>
            <div className="text-xs font-mono font-bold text-emerald-300">{streakInfo.label}</div>
          </div>
        </div>
      </div>

      {/* Case Clinical Presentation Card (Foldable / Collapsible for Clean Experience) */}
      <div id="tour-clinical-scenario" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="bg-slate-50/80 px-4 sm:px-6 py-3.5 border-b border-slate-200/80 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <span>Caso Clínico #{currentCase.id.slice(-4).toUpperCase()}</span>
                <span className="text-slate-400 font-normal">•</span>
                <span className="text-slate-600 font-semibold">{currentCase.title}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full text-[10px] font-semibold uppercase border border-slate-200">
              {currentCase.system}
            </span>
            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-semibold uppercase border border-blue-200">
              Nivel {currentCase.difficulty}
            </span>

            {/* Collapse / Expand Toggle Button */}
            <button
              type="button"
              onClick={() => setIsCaseDetailsExpanded(!isCaseDetailsExpanded)}
              className="ml-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>{isCaseDetailsExpanded ? 'Plegar Ficha' : 'Ver Historia Completa'}</span>
              {isCaseDetailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Compact Summary Strip (Visible When Collapsed) */}
        {!isCaseDetailsExpanded && (
          <div className="px-6 py-3 bg-slate-50/40 border-b border-slate-100 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-900">
                {currentCase.clinicalHistory.patientDemographics.gender}, {currentCase.clinicalHistory.patientDemographics.age} años
              </span>
              <span className="text-slate-400">•</span>
              <span className="italic text-slate-600 line-clamp-1">
                "{currentCase.clinicalHistory.presentIllness.slice(0, 95)}..."
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
              <span>PA: {currentCase.physicalExam.vitalSigns.bp}</span>
              <span>•</span>
              <span>FC: {currentCase.physicalExam.vitalSigns.hr}</span>
              <span>•</span>
              <span>SatO₂: {currentCase.physicalExam.vitalSigns.sao2}</span>
            </div>
          </div>
        )}

        {/* Full Details Body (When Expanded) */}
        <AnimatePresence>
          {isCaseDetailsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="p-4 sm:p-6 space-y-4 text-slate-800 overflow-hidden"
            >
              {/* Filiación y Datos del Paciente */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Paciente en Consulta / Guardia
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{currentCase.title}</h3>
                </div>
                <div className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-700">
                  <span className="font-bold text-slate-900">
                    {currentCase.clinicalHistory.patientDemographics.gender}, {currentCase.clinicalHistory.patientDemographics.age} años
                  </span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span>{currentCase.clinicalHistory.patientDemographics.occupation}</span>
                </div>
              </div>

              {/* Anamnesis y Enfermedad Actual */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Anamnesis & Enfermedad Actual
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100 font-normal">
                  "{currentCase.clinicalHistory.presentIllness}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Exploración Física & Signos Vitales
                  </h4>
                  <ul className="text-xs space-y-1 text-slate-700 font-medium">
                    <li>• P.A: {currentCase.physicalExam.vitalSigns.bp} | F.C: {currentCase.physicalExam.vitalSigns.hr}</li>
                    <li>• Temp: {currentCase.physicalExam.vitalSigns.temp} | SatO₂: {currentCase.physicalExam.vitalSigns.sao2}</li>
                    {currentCase.physicalExam.findings.map((f, idx) => (
                      <li key={idx}>• {f.systemName}: {f.description}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Antecedentes y Contexto Clínico
                  </h4>
                  <ul className="text-xs space-y-1 text-slate-700 font-medium">
                    {currentCase.clinicalHistory.pastMedicalHistory.length > 0 ? (
                      currentCase.clinicalHistory.pastMedicalHistory.slice(0, 3).map((pmh, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-slate-400 font-bold">•</span>
                          <span>{pmh}</span>
                        </li>
                      ))
                    ) : (
                      <li>• Sin antecedentes médicos de interés.</li>
                    )}
                    {currentCase.clinicalHistory.medications.length > 0 && (
                      <li className="pt-1 text-[11px] text-slate-500">
                        <strong className="text-slate-700">Tratamiento:</strong> {currentCase.clinicalHistory.medications.join(', ')}
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Initial Triaje Labs */}
              {currentCase.initialLabWork.length > 0 && (
                <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/90">
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-600" />
                      Analítica Básica de Triaje de Urgencias:
                    </span>
                    <span className="text-[10px] text-slate-500 italic">
                      Parámetros rutinarios basales ya disponibles. Solicita abajo los biomarcadores específicos.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentCase.initialLabWork.map((lab, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium shadow-2xs ${
                          lab.isAbnormal
                            ? 'bg-amber-50/80 border-amber-300 text-amber-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-800'
                        }`}
                      >
                        <strong className="text-slate-900">{lab.test}:</strong> {lab.result} {lab.unit}
                        {lab.isAbnormal && <span className="ml-1 text-[10px] text-amber-700 uppercase font-bold">(!)</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode Switcher: Lab Order Requisition vs Quick Direct Multiple Choice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setResolutionMode('multi')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              resolutionMode === 'multi'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-emerald-400" />
            <span>Petición de Laboratorio (Orden Múltiple)</span>
            <span className="bg-emerald-500 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded font-mono">
              Recomendado
            </span>
          </button>

          <button
            type="button"
            onClick={() => setResolutionMode('single')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              resolutionMode === 'single'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Pregunta Tipo Test (1 Prueba Clave)</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-medium px-2">
          {resolutionMode === 'multi' 
            ? 'Elige una o más pruebas y gestiona el presupuesto'
            : 'Formato test de opción única directa'}
        </span>
      </div>

      {/* RESOLUTION MODE 1: MULTI-BIOMARKER LAB PANEL */}
      {resolutionMode === 'multi' && (
        <MultiBiomarkerLabPanel
          currentCase={currentCase}
          userBudget={userProgress.budget}
          onSubmitLabOrder={handleMultiSubmit}
          consultedBiomarkerIds={consultedBiomarkerIds}
          onConsultBiomarker={handleConsultBiomarker}
        />
      )}

      {/* RESOLUTION MODE 2: CLEAN DIRECT MULTIPLE CHOICE (NO CONFUSING PHASES) */}
      {resolutionMode === 'single' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/90 text-slate-900 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Pregunta de Decisión Clínica
                </span>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase font-semibold">
                  Dificultad: {currentCase.difficulty}
                </span>
              </div>

              <h3 className="text-slate-900 text-base sm:text-lg font-bold tracking-tight">
                ¿Cuál es la prueba analítica o biomarcador más adecuado para confirmar el diagnóstico de este paciente?
              </h3>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Selecciona la opción con mayor sensibilidad y especificidad diagnóstica según el cuadro clínico presentado.
              </p>
            </div>

            {/* Clean Multiple Choice Options List */}
            <div className="space-y-3">
              {currentCase.biomarkerOptions.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = selectedOptionId === option.id;
                const biomarker = BIOMARKERS_DATABASE.find((b) => b.id === option.biomarkerId);
                const isConsulted = option.biomarkerId ? consultedBiomarkerIds.includes(option.biomarkerId) : false;

                return (
                  <div key={option.id} className="space-y-1.5">
                    <div
                      onClick={() => setSelectedOptionId(option.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all group flex justify-between items-center cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300 transition-colors'
                          }`}
                        >
                          {letter}
                        </span>
                        <div>
                          <span className={`text-xs sm:text-sm font-semibold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {option.biomarkerName}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isConsulted ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSingleConsultPrompt({ id: option.biomarkerId, name: option.biomarkerName });
                            }}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                            title="Consultar indicación clínica (-50 € presupuesto)"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                            <span>¿Para qué sirve?</span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-bold">
                              -50 €
                            </span>
                          </button>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>Ficha Consultada</span>
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 transition-opacity ${isSelected ? 'opacity-100 text-emerald-400' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`} />
                      </div>
                    </div>

                    {/* Unlocked clinical sheet for this option */}
                    {isConsulted && biomarker && (
                      <div className="mx-2 p-3 bg-slate-50 rounded-xl border border-emerald-200 text-xs text-slate-800 space-y-1 animate-fadeIn">
                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                            Ficha Diagnóstica Consultada:
                          </span>
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[9px] font-semibold border border-emerald-200">
                            -50 € Presupuesto Aplicado
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900">Indicación clínica: </span>
                          <span className="text-slate-700">{biomarker.diagnosticIndication}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 border-t border-slate-200/80 pt-1 leading-relaxed">
                          <span className="font-semibold text-slate-700">Mecanismo: </span>
                          <span>{biomarker.clinicalRelevance}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSingleSubmit}
                disabled={!selectedOptionId}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                  selectedOptionId
                    ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-md active:scale-[0.99]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
              >
                <span>Confirmar Respuesta y Evaluar Caso</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Recibirás la explicación fisiopatológica y la justificación clínica de inmediato.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Modal for Single Selection Mode */}
      <AnimatePresence>
        {singleConsultPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Interconsulta de Biomarcador</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Consulta de indicación y utilidad</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSingleConsultPrompt(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-900 text-sm">{singleConsultPrompt.name}</div>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  ¿Deseas consultar para qué sirve este parámetro? Esta acción deducirá 50 € de tu presupuesto sanitario restante.
                </p>

                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-[11px] text-amber-950">
                  <div className="flex justify-between items-center font-bold">
                    <span>Coste de Interconsulta:</span>
                    <span className="font-mono text-amber-800 font-extrabold">-50 € Presupuesto</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Presupuesto actual:</span>
                    <span className="font-mono font-semibold">{userProgress.budget.toLocaleString('es-ES')} €</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Presupuesto tras consulta:</span>
                    <span className={`font-mono font-bold ${userProgress.budget - 50 < 1000 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {Math.max(0, userProgress.budget - 50).toLocaleString('es-ES')} €
                    </span>
                  </div>
                </div>

                {userProgress.budget < 50 && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>Presupuesto insuficiente (&lt; 50 €). No dispones de saldo suficiente para interconsultar este parámetro.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSingleConsultPrompt(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={userProgress.budget < 50}
                  onClick={() => {
                    if (singleConsultPrompt) {
                      handleConsultBiomarker(singleConsultPrompt.id, 50);
                      setSingleConsultPrompt(null);
                    }
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                    userProgress.budget >= 50
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confirmar e Interconsultar (-50 €)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
