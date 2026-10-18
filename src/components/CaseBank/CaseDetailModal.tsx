import React, { useState } from 'react';
import { ClinicalCase } from '../../types';
import { X, User, Activity, FileText, Heart, AlertCircle, Sparkles, ArrowRight, CheckCircle2, GraduationCap, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface CaseDetailModalProps {
  caseData: ClinicalCase | null;
  onClose: () => void;
  onStartChallenge: (caseData: ClinicalCase) => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  caseData,
  onClose,
  onStartChallenge
}) => {
  const [showGlossary, setShowGlossary] = useState(true);

  if (!caseData) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col my-auto">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white border-b border-slate-800 flex items-start justify-between sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800">
                Sistema {caseData.system}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Nivel {caseData.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{caseData.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-800">
          {/* Patient Demographics Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-cyan-100 text-cyan-800 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 block">Filiación del Paciente</span>
                <span className="font-bold text-slate-900">
                  {caseData.clinicalHistory.patientDemographics.gender}, {caseData.clinicalHistory.patientDemographics.age} años — {caseData.clinicalHistory.patientDemographics.occupation}
                </span>
              </div>
            </div>
          </div>

          {/* Student Guidance & Clinical Glossary Card */}
          {(caseData.studentSummary || caseData.clinicalGlossary || caseData.biochemicalConceptSimple) && (
            <div className="bg-emerald-50/60 border border-emerald-200/90 rounded-xl p-4.5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  Guía Didáctica y Glosario Clínico
                </span>
              </div>

              {caseData.studentSummary && (
                <div className="bg-white/90 rounded-lg p-3 border border-emerald-100/90">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                    Orientación Clínica del Caso
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {caseData.studentSummary}
                  </p>
                </div>
              )}

              {caseData.biochemicalConceptSimple && (
                <div className="bg-white/90 rounded-lg p-3 border border-emerald-100/90">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                    Mecanismo Bioquímico y Fisiopatológico:
                  </span>
                  <p className="text-xs text-slate-700 font-mono leading-relaxed bg-emerald-50/40 p-2.5 rounded border border-emerald-100">
                    {caseData.biochemicalConceptSimple}
                  </p>
                </div>
              )}

              {caseData.clinicalGlossary && caseData.clinicalGlossary.length > 0 && (
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowGlossary(!showGlossary)}
                    className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-900 hover:text-emerald-950 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      Glosario de Términos Médicos del Caso ({caseData.clinicalGlossary.length})
                    </span>
                    <span className="text-xs text-emerald-700 flex items-center gap-0.5">
                      {showGlossary ? <>Ocultar <ChevronUp className="w-3.5 h-3.5" /></> : <>Ver definiciones <ChevronDown className="w-3.5 h-3.5" /></>}
                    </span>
                  </button>

                  {showGlossary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {caseData.clinicalGlossary.map((item, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-emerald-200/70 shadow-2xs text-xs">
                          <span className="font-bold text-emerald-950 block mb-0.5">{item.term}</span>
                          <span className="text-slate-600 text-[11px] leading-snug block">{item.simpleDefinition}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Molecular Signaling Pathway Section (Docencia Departamental) */}
          {caseData.molecularPathway && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 border border-amber-300">
                  Transducción de Señales & Vía Molecular
                </span>
                {caseData.signalingType && 
                 !caseData.signalingType.toLowerCase().includes('ligand') && 
                 !caseData.signalingType.toLowerCase().includes('canal') && (
                  <span className="text-[11px] font-mono text-amber-800 font-semibold">
                    {caseData.signalingType.replace(/_/g, ' • ')}
                  </span>
                )}
              </div>
              <div className="text-xs space-y-1.5 pt-1">
                <div>
                  <strong className="text-amber-950">Vía de transducción:</strong>{' '}
                  <span className="text-amber-900 font-medium">{caseData.molecularPathway}</span>
                </div>
                {caseData.molecularAlteration && (
                  <div>
                    <strong className="text-amber-950">Diana molecular alterada:</strong>{' '}
                    <span className="text-amber-800">{caseData.molecularAlteration}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Anamnesis / History of Present Illness */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Anamnesis y Enfermedad Actual</span>
            </h3>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-500 block">Motivo de Consulta:</span>
                <p className="text-sm font-medium text-slate-800 italic">"{caseData.clinicalHistory.chiefComplaint}"</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">Enfermedad Actual:</span>
                <p className="text-sm text-slate-700 leading-relaxed">{caseData.clinicalHistory.presentIllness}</p>
              </div>
            </div>
          </div>

          {/* Past History & Meds Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Antecedentes Personales</span>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {caseData.clinicalHistory.pastMedicalHistory.map((pmh, idx) => (
                  <li key={idx}>{pmh}</li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Tratamiento Habitual</span>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                {caseData.clinicalHistory.medications.map((med, idx) => (
                  <li key={idx}>{med}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Physical Exam & Vital Signs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Examen Físico y Signos Vitales</span>
            </h3>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4">
              {/* Vital Signs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">P.A.</span>
                  <span className="text-xs font-bold text-slate-800">{caseData.physicalExam.vitalSigns.bp}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">F.C.</span>
                  <span className="text-xs font-bold text-slate-800">{caseData.physicalExam.vitalSigns.hr}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">F.R.</span>
                  <span className="text-xs font-bold text-slate-800">{caseData.physicalExam.vitalSigns.rr}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Temp.</span>
                  <span className="text-xs font-bold text-slate-800">{caseData.physicalExam.vitalSigns.temp}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">SatO₂</span>
                  <span className="text-xs font-bold text-slate-800">{caseData.physicalExam.vitalSigns.sao2}</span>
                </div>
              </div>

              {/* Systemic Findings */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                {caseData.physicalExam.findings.map((f, idx) => (
                  <div key={idx} className="text-xs text-slate-700">
                    <span className="font-bold text-slate-900">{f.systemName}: </span>
                    <span>{f.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Initial Labs Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Pruebas Complementarias Iniciales</span>
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Prueba / Parámetro</th>
                    <th className="p-3">Resultado</th>
                    <th className="p-3">Rango de Referencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {caseData.initialLabWork.map((lab, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-slate-900">{lab.test}</td>
                      <td className="p-3 font-mono font-bold text-cyan-800">{lab.result} {lab.unit}</td>
                      <td className="p-3 text-slate-500">{lab.referenceRange}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinical Objective Banner */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Objetivo Docente del Caso
              </span>
              <p className="text-xs text-slate-700">
                Analice los datos clínicos y constantes del paciente para seleccionar razonadamente los biomarcadores bioquímicos de mayor utilidad diagnóstica.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            Cerrar Historia
          </button>

          <button
            onClick={() => {
              onClose();
              onStartChallenge(caseData);
            }}
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-cyan-700 hover:bg-cyan-800 text-white shadow-lg shadow-cyan-900/20 flex items-center space-x-2 transition-colors"
          >
            <span>Resolver Caso Clínico</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
