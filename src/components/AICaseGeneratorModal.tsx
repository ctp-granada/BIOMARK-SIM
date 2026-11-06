import React, { useState } from 'react';
import { ClinicalCase, OrganSystem, DifficultyLevel } from '../types';
import { Star, X, Loader2, AlertCircle, BookOpen, Layers, CheckCircle2, ShieldAlert, Bean, Brain, Droplets, HeartPulse, Microscope, Zap } from 'lucide-react';

interface AICaseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseGenerated: (newCase: ClinicalCase) => void;
}

const SYSTEM_CURRICULUM_DETAILS: record<OrganSystem, {
  label: string;
  icon: React.ReactNode;
  subtopics: { id: string; name: string }[];
  biomarkers: string[];
}> = {
  cardiac: {
    label: 'Cardíaco y síndrome coronario',
    icon: <HeartPulse className="inline-block w-[1em] h-[1em]" />,
    subtopics: [
      { id: 'scasest_iam', name: 'SCASEST / IAM Agudo en ventana precoz (2-4 horas)' },
      { id: 'reinfarction', name: 'Sospecha de Reinfarto precoz a los 4 días (Cinética CK-MB vs Troponina)' },
      { id: 'heart_failure', name: 'Insuficiencia cardíaca aguda / disnea cardiogénica (NT-proBNP)' }
    ],
    biomarkers: ['Troponina hs-cTn', 'CK-MB Masa', 'CK Total', 'NT-proBNP', 'LDH']
  },
  hepatic: {
    label: 'Hepático e ictericias',
    icon: <Droplets className="inline-block w-[1em] h-[1em]" />,
    subtopics: [
      { id: 'obstructive_jaundice', name: 'Ictericia posthepática / obstructiva (bilirrubina directa, FA, GGT)' },
      { id: 'hemolytic_jaundice', name: 'Ictericia prehepática / hemolítica (bilirrubina indirecta, haptoglobina)' },
      { id: 'toxic_hepatitis', name: 'Hepatitis Aguda Citolítica (ALT / AST extremas > 1000 U/L)' },
      { id: 'alcoholic_liver', name: 'Hepatopatía alcohólica (cociente AST/ALT > 2 y GGT)' }
    ],
    biomarkers: ['Bilirrubina Directa', 'Bilirrubina Total', 'ALT (GPT)', 'AST (GOT)', 'GGT', 'Fosfatasa Alcalina']
  },
  metabolic: {
    label: 'Metabolismo, β-oxidación y glúcidos',
    icon: <Zap className="inline-block w-[1em] h-[1em]" />,
    subtopics: [
      { id: 'mcadd_defect', name: 'Deficiencia de MCADD / defecto de β-oxidación (hipoglucemia hipocetósica)' },
      { id: 'diabetic_ketoacidosis', name: 'Cetoacidosis Diabética (β-Hidroxibutirato elevado > 3.0 mmol/L)' },
      { id: 'insulin_resistance', name: 'Resistencia a la insulina y síndrome metabólico (triglicéridos/glucosa)' }
    ],
    biomarkers: ['Perfil Acilcarnitinas (C8)', 'Carnitina Libre C0', 'β-Hidroxibutirato', 'Glucemia en Ayunas', 'HbA1c', 'Triglicéridos']
  },
  renal: {
    label: 'Renal, ciclo de la urea y purinas',
    icon: <Bean className="inline-block w-[1em] h-[1em]" />,
    subtopics: [
      { id: 'otc_deficiency', name: 'Defecto ciclo de la urea por déficit de OTC (hiperamonemia masiva)' },
      { id: 'gout_hyperuricemia', name: 'Artritis gotosa aguda / hiperuricemia primaria (ácido úrico sérico)' },
      { id: 'tumor_lysis', name: 'Síndrome de lisis tumoral / hiperuricemia secundaria masiva' }
    ],
    biomarkers: ['Amonio Plasmático (tubo frío)', 'Ácido Úrico', 'Urea Sérica', 'Creatinina Sérica', 'eGFR']
  },
  pancreatic: {
    label: 'Pancreático-Digestivo y malabsorción',
    icon: <Microscope className="inline-block w-[1em] h-[1em]" />,
    subtopics: [
      { id: 'hypertriglyceridemic_pancreatitis', name: 'Pancreatitis por Hipertrigliceridemia (>1000 mg/dL con suero lechoso)' },
      { id: 'omeprazole_chronic', name: 'Uso crónico de omeprazol/IBPs (hipomagnesemia, hipocalcemia y déficit B12)' },
      { id: 'celiac_disease', name: 'Enfermedad celíaca del adulto (anticuerpos tTG-IgA y malabsorción)' },
      { id: 'acute_biliary_pancreatitis', name: 'Pancreatitis aguda biliar clásica (lipasa sérica > 3x LSN)' }
    ],
    biomarkers: ['Lipasa Sérica', 'Triglicéridos Séricos', 'tTG-IgA', 'Vitamina B12', 'Magnesio / Calcio', 'Amilasa Total']
  },
  neuromuscular: {
    label: 'Neuromuscular y señalización celular',
    icon: <Brain className="inline-block w-[1em] h-[1em]" />,
    subtopics: [
      { id: 'myasthenia_gravis', name: 'Miastenia Gravis (Receptores nicotínicos AChR y canales iónicos)' },
      { id: 'lambert_eaton', name: 'Síndrome de Lambert-Eaton (Canales de calcio VGCC presinápticos)' }
    ],
    biomarkers: ['Anticuerpos Anti-AChR', 'Anticuerpos Anti-MuSK', 'Anti-VGCC', 'CK Total', 'Electromiografía']
  }
};

export const AICaseGeneratorModal: React.FC<AICaseGeneratorModalProps> = ({
  isOpen,
  onClose,
  onCaseGenerated
}) => {
  const [system, setSystem] = useState<OrganSystem>('cardiac');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermedio');
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCurriculum = SYSTEM_CURRICULUM_DETAILS[system];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const subtopicObject = currentCurriculum.subtopics.find((s) => s.id === selectedSubtopic);
    const subtopicLabel = subtopicObject ? subtopicObject.name : undefined;

    try {
      const response = await fetch('/api/generate-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system,
          difficulty,
          subtopic: subtopicLabel
        })
      });

      const data = await response.json();

      if (!response.ok || !data.case) {
        throw new Error(data.error || 'No se pudo generar el caso clínico.');
      }

      // Add a unique ID
      const generatedCase: ClinicalCase = {
        ...data.case,
        id: `ai_case_${Date.now()}`
      };

      onCaseGenerated(generatedCase);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con el servidor de generación de IA.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-lg border border-slate-200 overflow-hidden flex flex-col my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-400/30 text-purple-300">
              <Star className="w-5 h-5 " />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Generador de casos clínicos por IA</h2>
              <p className="text-xs text-purple-200">Alineado al temario, patologías y marcadores estudiados</p>
            </div>
          </div>
          <button onClick={onClose} className="text-purple-300 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* System Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>1. Sistema orgánico del temario:</span>
            </label>
            <select
              value={system}
              onChange={(e) => {
                const newSys = e.target.value as OrganSystem;
                setSystem(newSys);
                setSelectedSubtopic('');
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="cardiac">Cardíaco y síndrome coronario (SCASEST, IAM, reinfarto, IC)</option>
              <option value="hepatic">Hepático e ictericias (prehepática, posthepática, citólisis, alcohol)</option>
              <option value="metabolic">Metabolismo y β-oxidación (MCADD, cetoacidosis, resistencia insulina)</option>
              <option value="renal">Renal y ciclo de la urea (amonio, OTC, gota, lisis tumoral)</option>
              <option value="pancreatic">Pancreático-Digestivo (pancreatitis, IBPs/omeprazol, celíaca)</option>
            </select>
          </div>

          {/* Subtopic Focus Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>2. Enfoque fisiopatológico específico:</span>
            </label>
            <select
              value={selectedSubtopic}
              onChange={(e) => setSelectedSubtopic(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Síntesis curricular automática (cualquier escenario del módulo)</option>
              {currentCurriculum.subtopics.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          {/* Allowed Biomarkers Badge Preview */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Biomarcadores estudiados que integrará el caso:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentCurriculum.biomarkers.map((bm, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  {bm}
                </span>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 block flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>3. Calibración de dificultad:</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDifficulty('intermedio')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  difficulty === 'intermedio'
                    ? 'border-blue-500 bg-blue-50/80 text-blue-900 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">Intermedio</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-tight">
                  Presentación clínica paradigmática en ventana típica
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('avanzado')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  difficulty === 'avanzado'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">Avanzado</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-tight">
                  Comorbilidades, polimedicación y cinéticas finas
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('experto')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  difficulty === 'experto'
                    ? 'border-purple-500 bg-purple-50/80 text-purple-900 ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">Experto</div>
                <div className="text-[10px] text-slate-500 mt-1 leading-tight">
                  Interferencias analíticas y ventanas críticas
                </div>
              </button>
            </div>
          </div>

          <div className="p-3 bg-purple-50/80 rounded-xl border border-purple-100 text-[11px] text-purple-900 leading-relaxed">
            <span className="font-bold">Garantía académica:</span> El caso generado evaluará la discriminación analítica entre 4 opciones con fundamentación bioquímica y valores de laboratorio numéricos concordantes con la práctica clínica real.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 text-xs transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-900/20 flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sintetizando caso clínico...</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                <span>Generar caso ahora</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
