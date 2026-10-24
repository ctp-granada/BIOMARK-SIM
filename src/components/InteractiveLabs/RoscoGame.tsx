import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Wallet,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../../utils/audioService';

export interface RoscoGameProps {
  onEarnBudget?: (amount?: number) => void;
  onAddBonusXP: (amount: number, reason: string) => void;
}

interface RoscoQuestion {
  letter: string;
  word: string;
  definition: string;
  system: string;
  options: string[];
}

const ROSCO_QUESTIONS: RoscoQuestion[] = [
  {
    letter: 'A',
    word: 'Amilasa',
    definition: 'Enzima hidrolítica producida por las células acinares del páncreas que se eleva precozmente en pancreatitis aguda, pero puede ser falsamente normal en lipemia extrema.',
    system: 'Pancreático',
    options: ['Amilasa', 'Albúmina', 'Aspartato transferasa', 'Amonio']
  },
  {
    letter: 'B',
    word: 'Bilirrubina',
    definition: 'Pigmento tetrapirrólico derivado de la degradación del grupo hemo; su fracción conjugada o directa se excreta en orina causando coluria en ictericias obstructivas.',
    system: 'Hepático',
    options: ['Bilirrubina', 'Betahidroxibutirato', 'Bicarbonato', 'Brain Natriuretic']
  },
  {
    letter: 'C',
    word: 'CK-MB',
    definition: 'Isoenzima híbrida de la creatina quinasa, esencial para diagnosticar reinfarto precoz a los 3-5 días gracias a su rápido aclaramiento en plasma.',
    system: 'Cardíaco',
    options: ['CK-MB', 'Colesterol', 'Ceruloplasmina', 'Calcitonina']
  },
  {
    letter: 'D',
    word: 'Dímero D',
    definition: 'Fragmento de degradación de la fibrina estabilizada por el factor XIIIa; su alto valor predictivo negativo descarta tromboembolismo pulmonar y TVP.',
    system: 'Hemostasia',
    options: ['Dímero D', 'Dihidroxiacetona', 'Dopamina', 'Dipeptidasa']
  },
  {
    letter: 'E',
    word: 'Elastasa-1',
    definition: 'Enzima fecal que no se degrada en su tránsito intestinal; su concentración <200 µg/g es el estándar no invasivo de insuficiencia pancreática exocrina.',
    system: 'Pancreático',
    options: ['Elastasa-1', 'Enteroquinasa', 'Epinefrina', 'Enolasa']
  },
  {
    letter: 'F',
    word: 'Fosfatasa Alcalina',
    definition: 'Enzima canalicular unida a membrana cuya elevación marcada junto a la GGT confirma colestasis intrahepática o coledocolitiasis.',
    system: 'Hepático',
    options: ['Fosfatasa Alcalina', 'Ferritina', 'Fibrinógeno', 'Folato']
  },
  {
    letter: 'G',
    word: 'GGT',
    definition: 'Gamma-glutamil transferasa microsomal canalicular; sirve como prueba confirmatoria de que la elevación de fosfatasa alcalina es de origen biliar y no óseo.',
    system: 'Hepático',
    options: ['GGT', 'Glucagón', 'Glucosa', 'Glutatión']
  },
  {
    letter: 'H',
    word: 'HbA1c',
    definition: 'Hemoglobina con unión no enzimática irreversible a glucosa que refleja la media de la glucemia de los últimos 2-3 meses (vida media eritrocitaria).',
    system: 'Metabolismo',
    options: ['HbA1c', 'Haptoglobina', 'Histamina', 'Homocisteína']
  },
  {
    letter: 'I',
    word: 'Insulina',
    definition: 'Hormona anabólica pancreática secretada por células β que favorece la desfosforilación de enzimas y activa la síntesis de glucógeno y ácidos grasos.',
    system: 'Metabolismo',
    options: ['Insulina', 'Inositol', 'Inmunoglobulina', 'Interleucina']
  },
  {
    letter: 'L',
    word: 'Lipasa',
    definition: 'Marcador de elección para pancreatitis aguda por su mayor especificidad pancreática y ventana diagnóstica prolongada de 8 a 14 días.',
    system: 'Pancreático',
    options: ['Lipasa', 'Lactato', 'Leucina', 'Lecitina']
  },
  {
    letter: 'M',
    word: 'MCADD',
    definition: 'Error congénito de la β-oxidación mitocondrial que debuta con hipoglucemia hipocetósica severa y elevación plasmática de octanoilcarnitina (C8).',
    system: 'Metabolismo',
    options: ['MCADD', 'Mioglobina', 'Miosina', 'Malato']
  },
  {
    letter: 'N',
    word: 'NT-proBNP',
    definition: 'Péptido natriurético biológicamente inactivo de vida media prolongada (70-120 min), estándar para descartar o confirmar insuficiencia cardíaca aguda.',
    system: 'Cardíaco',
    options: ['NT-proBNP', 'Noradrenalina', 'Niacina', 'Nicotinamida']
  },
  {
    letter: 'O',
    word: 'OTC',
    definition: 'Déficit de ornitina transcarbamilasa ligada al cromosoma X, causa más común de fallo en el ciclo de la urea con hiperamonemia neurotóxica masiva.',
    system: 'Renal / Urea',
    options: ['OTC', 'Osteocalcina', 'Oxalato', 'Oxaloacetato']
  },
  {
    letter: 'P',
    word: 'PCR',
    definition: 'Proteína reactante de fase aguda sintetizada en el hepatocito bajo estímulo de IL-6 con cinética rápida de ascenso (6h) y descenso en inflamación.',
    system: 'Inmunología',
    options: ['PCR', 'Procalcitonina', 'Péptido C', 'Piruvato']
  },
  {
    letter: 'R',
    word: 'Randle',
    definition: 'Ciclo metabólico de sustratos donde la oxidación acelerada de ácidos grasos libres inhibe la captación y utilización periférica de glucosa.',
    system: 'Metabolismo',
    options: ['Randle', 'Renina', 'Reticulocito', 'Ribosa']
  },
  {
    letter: 'T',
    word: 'Troponina hs-cTn',
    definition: 'Estándar de oro indiscutible para el diagnóstico de necrosis miocárdica e infarto agudo de miocardio (SCASEST / IAMCEST).',
    system: 'Cardíaco',
    options: ['Troponina hs-cTn', 'Transferrina', 'Triglicéridos', 'Trombina']
  },
  {
    letter: 'U',
    word: 'Urea',
    definition: 'Compuesto no tóxico sintetizado en el hígado que elimina el exceso de grupos amino procedentes del catabolismo de aminoácidos.',
    system: 'Renal / Urea',
    options: ['Urea', 'Urobilina', 'Urobilinógeno', 'Uracilo']
  },
  {
    letter: 'V',
    word: 'Vitamina B12',
    definition: 'Cofactor esencial cuya absorción ileal disminuye en hipoclorhidria gástrica provocada por el uso continuado de inhibidores de bomba de protones.',
    system: 'Digestivo',
    options: ['Vitamina B12', 'Vitamina D', 'Valina', 'VLDL']
  }
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const generateShuffledMap = (): Record<number, string[]> => {
  const map: Record<number, string[]> = {};
  ROSCO_QUESTIONS.forEach((q, idx) => {
    map[idx] = shuffleArray(q.options);
  });
  return map;
};

export const RoscoGame: React.FC<RoscoGameProps> = ({
  onEarnBudget,
  onAddBonusXP
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answersStatus, setAnswersStatus] = useState<Record<number, 'correct' | 'wrong' | 'passed'>>({});
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<Record<number, string[]>>(generateShuffledMap);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);

  // Timer loop
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying && timeLeft > 0 && !isFinished) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft, isFinished]);

  const handleStartGame = () => {
    setShuffledOptionsMap(generateShuffledMap());
    setAnswersStatus({});
    setCurrentIndex(0);
    setTimeLeft(180);
    setIsFinished(false);
    setRewardClaimed(false);
    setIsPlaying(true);
  };

  const handleAnswer = (chosenWord: string) => {
    if (!isPlaying || isFinished) return;

    const currentQ = ROSCO_QUESTIONS[currentIndex];
    const isCorrect = chosenWord.toLowerCase() === currentQ.word.toLowerCase();

    if (isCorrect) {
      audioService.playSuccess();
    } else {
      audioService.playError();
    }

    setAnswersStatus((prev) => ({
      ...prev,
      [currentIndex]: isCorrect ? 'correct' : 'wrong'
    }));

    // Find next unanswered index
    advanceToNext(currentIndex);
  };

  const handlePass = () => {
    if (!isPlaying || isFinished) return;
    setAnswersStatus((prev) => ({
      ...prev,
      [currentIndex]: 'passed'
    }));
    advanceToNext(currentIndex);
  };

  const advanceToNext = (fromIndex: number) => {
    // Check if all are answered (not passed)
    const newCount = Object.keys(answersStatus).length + 1;
    if (newCount >= ROSCO_QUESTIONS.length) {
      // Find any passed questions
      const passedIndices = ROSCO_QUESTIONS.map((_, i) => i).filter(
        (i) => i !== fromIndex && answersStatus[i] === 'passed'
      );
      if (passedIndices.length === 0) {
        setIsFinished(true);
        setIsPlaying(false);
        return;
      }
    }

    // Advance circular
    let next = (fromIndex + 1) % ROSCO_QUESTIONS.length;
    let loops = 0;
    while (
      (answersStatus[next] === 'correct' || answersStatus[next] === 'wrong') &&
      loops < ROSCO_QUESTIONS.length
    ) {
      next = (next + 1) % ROSCO_QUESTIONS.length;
      loops++;
    }

    if (loops >= ROSCO_QUESTIONS.length) {
      setIsFinished(true);
      setIsPlaying(false);
    } else {
      setCurrentIndex(next);
    }
  };

  const correctCount = Object.values(answersStatus).filter((s) => s === 'correct').length;
  const wrongCount = Object.values(answersStatus).filter((s) => s === 'wrong').length;

  // Claim reward strictly on user button click (NEVER during render)
  const handleClaimReward = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);

    audioService.playCoin();

    const bonusXP = Math.max(50, correctCount * 12);
    // Range between 250 € and 300 € according to accuracy
    const bonusBudget = Math.min(300, 250 + Math.round((correctCount / ROSCO_QUESTIONS.length) * 50));

    if (onEarnBudget) {
      onEarnBudget(bonusBudget);
    }
    onAddBonusXP(
      bonusXP,
      `El Rosco Metabólico: ${correctCount}/${ROSCO_QUESTIONS.length} aciertos (+${bonusBudget} € presupuesto)`
    );
  };

  const currentQ = ROSCO_QUESTIONS[currentIndex];
  // Opciones barajadas aleatoriamente por pregunta para que la respuesta correcta no esté siempre arriba a la izquierda
  const displayedOptions = (currentQ && shuffledOptionsMap[currentIndex])
    ? shuffledOptionsMap[currentIndex]
    : currentQ ? currentQ.options : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Pasapalabra Bioquímico & Diagnóstico Clínico</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            El Rosco Metabólico de Medicina
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pon a prueba tu vocabulario clínico con definiciones de la cátedra de Bioquímica Médica de la UGR.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-xs text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {!isPlaying && !isFinished && (
            <button
              onClick={handleStartGame}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Iniciar Rosco</span>
            </button>
          )}

          {(isPlaying || isFinished) && (
            <button
              onClick={handleStartGame}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>
          )}
        </div>
      </div>

      {/* Wheel of Letters (El Rosco Circular Layout) */}
      <div className="flex flex-wrap items-center justify-center gap-2 py-2">
        {ROSCO_QUESTIONS.map((q, idx) => {
          const status = answersStatus[idx];
          const isCurrent = idx === currentIndex && isPlaying && !isFinished;

          let btnColor = 'bg-slate-100 text-slate-700 border-slate-200';
          if (status === 'correct') {
            btnColor = 'bg-emerald-500 text-white border-emerald-600 shadow-xs';
          } else if (status === 'wrong') {
            btnColor = 'bg-rose-500 text-white border-rose-600 shadow-xs';
          } else if (status === 'passed') {
            btnColor = 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
          } else if (isCurrent) {
            btnColor = 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400 animate-pulse';
          }

          return (
            <div
              key={q.letter}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs border transition-all select-none ${btnColor}`}
              title={`${q.letter}: ${status || 'pendiente'}`}
            >
              {q.letter}
            </div>
          );
        })}
      </div>

      {/* Score HUD */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
          <span className="text-[10px] uppercase block text-emerald-600">Aciertos</span>
          <span className="text-lg font-black">{correctCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold">
          <span className="text-[10px] uppercase block text-rose-600">Fallos</span>
          <span className="text-lg font-black">{wrongCount}</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold">
          <span className="text-[10px] uppercase block text-blue-600">Restantes</span>
          <span className="text-lg font-black">
            {ROSCO_QUESTIONS.length - correctCount - wrongCount}
          </span>
        </div>
      </div>

      {/* Question Card or Final Summary */}
      {isFinished ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-slate-900">
            ¡Rosco Metabólico Completado!
          </h3>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Has logrado <span className="font-bold text-emerald-600">{correctCount}</span> respuestas correctas y <span className="font-bold text-rose-600">{wrongCount}</span> fallos en esta ronda de vocabulario clínico.
          </p>

          {!rewardClaimed ? (
            <button
              onClick={handleClaimReward}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all active:scale-95"
            >
              <Wallet className="w-4 h-4" />
              <span>Acreditar Recompensas de Guardia (+Presupuesto & XP)</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Recompensas sumadas a tu perfil con éxito!</span>
            </div>
          )}
        </div>
      ) : isPlaying && currentQ ? (
        <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                {currentQ.letter}
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                  Comienza por {currentQ.letter} • {currentQ.system}
                </span>
                <span className="text-xs text-slate-400">
                  Definición
                </span>
              </div>
            </div>

            <button
              onClick={handlePass}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 font-bold text-xs transition-colors cursor-pointer"
            >
              Pasapalabra ↷
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed font-medium">
            "{currentQ.definition}"
          </div>

          {/* Options Grid - Opciones barajadas aleatoriamente */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayedOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="p-3.5 rounded-xl bg-slate-800 hover:bg-indigo-600/80 border border-slate-700 hover:border-indigo-500 text-left text-xs font-bold text-slate-100 transition-all flex items-center justify-between group cursor-pointer"
              >
                <span>{opt}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            El Rosco consta de preguntas ordenadas de la A a la Z que evalúan los conceptos cardinales de bioquímica clínica: enzimas, marcadores de necrosis, pigmentos biliares y cofactores.
          </p>
          <button
            onClick={handleStartGame}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Comenzar Ronda (3 minutos)</span>
          </button>
        </div>
      )}
    </div>
  );
};
