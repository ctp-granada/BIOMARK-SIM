import React, { useState, useEffect } from 'react';
import { ClinicalCase, UserProgress } from '../../types';
import { DailyChallengeState, getFormattedDailyDate } from '../../utils/dailyChallenge';
import { 
  Sparkles, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  ShieldAlert, 
  Trophy, 
  Calendar,
  AlertTriangle,
  Stethoscope,
  Heart,
  Timer,
  Award,
  Activity,
  User,
  RefreshCw,
  Target
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DailyChallengeViewProps {
  dailyCase: ClinicalCase;
  dailyState: DailyChallengeState | null;
  userProgress: UserProgress;
  onStartDailyChallenge: (c: ClinicalCase) => void;
}

export const DailyChallengeView: React.FC<DailyChallengeViewProps> = ({
  dailyCase,
  dailyState,
  userProgress,
  onStartDailyChallenge
}) => {
  const isCompleted = dailyState?.isCompletedToday ?? false;
  const [timeUntilMidnight, setTimeUntilMidnight] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Calculate countdown to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilMidnight({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = getFormattedDailyDate();

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-500/40 relative overflow-hidden">
        {/* Glow ambient lights */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                Reto Clínico Diario
              </span>

              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-indigo-200 border border-white/20 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                {formattedDate}
              </span>

              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-red-500/20 text-red-300 border border-red-400/40 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Límite 120 Segundos
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Caso de Alta Complejidad del Día
            </h1>

            <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
              Cada 24 horas se activa un caso clínico de dificultad elevada. Resuélvelo contrarreloj para obtener una bonificación especial de <strong className="text-amber-300 font-black">2.0x Multiplicador de XP</strong> y mantener activa tu racha diaria.
            </p>

            {/* Countdown to next reset */}
            <div className="flex items-center gap-2 pt-1 text-xs text-indigo-200 font-mono">
              <Timer className="w-4 h-4 text-cyan-400" />
              <span>Siguiente caso en:</span>
              <span className="font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-md border border-indigo-500/30">
                {String(timeUntilMidnight.hours).padStart(2, '0')}:
                {String(timeUntilMidnight.minutes).padStart(2, '0')}:
                {String(timeUntilMidnight.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Right Action / Completed Card */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col items-center">
            {isCompleted ? (
              <div className="bg-emerald-950/80 border-2 border-emerald-400/60 p-6 rounded-2xl text-center w-full lg:w-72 shadow-xl space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-emerald-300 uppercase tracking-tight">
                    ¡Completado Hoy!
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1">
                    Puntos obtenidos: <strong className="text-white font-bold text-sm">+{dailyState?.scoreEarned} XP</strong>
                  </p>
                  {dailyState?.bonusMultiplierApplied && dailyState.bonusMultiplierApplied > 1 && (
                    <span className="inline-block mt-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                      ⚡ Bonificación 2.0x aplicada
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onStartDailyChallenge(dailyCase)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 hover:text-white font-bold text-xs border border-indigo-500/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Repetir en Modo Práctica</span>
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onStartDailyChallenge(dailyCase)}
                className="w-full lg:w-72 py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-base shadow-2xl shadow-orange-500/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:scale-110 transition-transform" />
                  <span>INICIAR RETO DIARIO</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-[11px] font-bold text-slate-900 tracking-wide uppercase">
                  ⚡ 120 Seg • Bonificación 2.0x XP
                </span>
              </motion.button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Today's Case Preview & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Clinical Case Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Ficha del Paciente del Día
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {dailyCase.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 uppercase">
                {dailyCase.system}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 uppercase">
                {dailyCase.difficulty}
              </span>
            </div>
          </div>

          {/* Demographic & Anamnesis Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <div className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                Demografía
              </div>
              <div className="font-bold text-slate-800 mt-1">
                {dailyCase.clinicalHistory.patientDemographics.age} años • {dailyCase.clinicalHistory.patientDemographics.gender}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs sm:col-span-2">
              <div className="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-1">
                <Activity className="w-3 h-3 text-blue-500" />
                Motivo de Consulta Urgente
              </div>
              <div className="font-bold text-slate-800 mt-1 line-clamp-1">
                {dailyCase.clinicalHistory.chiefComplaint}
              </div>
            </div>
          </div>

          {/* Present Illness */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Enfermedad Actual
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed">
              {dailyCase.clinicalHistory.presentIllness}
            </div>
          </div>

          {/* Vital Signs & Initial Physical Exam */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
              Constantes Vitales y Exploración Física Inicial
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pb-2 border-b border-slate-200/60 font-semibold text-slate-800">
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">P.A.</span>{dailyCase.physicalExam.vitalSigns.bp}</div>
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">F.C.</span>{dailyCase.physicalExam.vitalSigns.hr}</div>
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">Temp.</span>{dailyCase.physicalExam.vitalSigns.temp}</div>
                <div><span className="text-slate-400 block text-[10px] font-bold uppercase">SatO₂</span>{dailyCase.physicalExam.vitalSigns.sao2}</div>
              </div>
              {dailyCase.physicalExam.findings.length > 0 && (
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-800 font-semibold">{dailyCase.physicalExam.findings[0].systemName}:</strong>{' '}
                  {dailyCase.physicalExam.findings[0].description}
                </p>
              )}
            </div>
          </div>

          {/* CTA Inside */}
          <div className="pt-2">
            <button
              onClick={() => onStartDailyChallenge(dailyCase)}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>{isCompleted ? 'Volver a Resolver este Caso' : 'Resolver Caso del Día Ahora'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Col: Rules, Mechanics & Rewards */}
        <div className="space-y-4">
          {/* Rules Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Reglas del Reto Diario
            </h3>

            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span><strong>Temporizador de 120 seg:</strong> Tendrás 2 minutos para evaluar al paciente, pedir la batería analítica y diagnosticar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span><strong>2.0x Multiplicador de XP:</strong> Si completas la orden y aciertas antes de que expire el tiempo, duplicas la puntuación obtenida.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span><strong>Racha de Guardias:</strong> Aumenta tu racha de días consecutivos para desbloquear insignias de honor médico.</span>
              </li>
            </ul>
          </div>

          {/* Gamification Stats */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
              Tu Rendimiento de Retos
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="text-[10px] uppercase font-bold text-indigo-200">Racha Actual</div>
                <div className="text-xl font-black text-amber-400 mt-0.5 flex items-center gap-1">
                  {userProgress.streak} días
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="text-[10px] uppercase font-bold text-indigo-200">Total XP</div>
                <div className="text-xl font-black text-cyan-300 mt-0.5">
                  {userProgress.xp || userProgress.score} XP
                </div>
              </div>
            </div>

            <div className="p-3 bg-indigo-900/60 rounded-xl border border-indigo-500/30 text-[11px] text-indigo-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>
                Completar el reto diario es la forma más rápida de subir de rango hacia <strong>Catedrático de Bioquímica</strong>.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
