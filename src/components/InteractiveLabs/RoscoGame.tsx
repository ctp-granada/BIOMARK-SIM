import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  Send,
  CornerDownLeft,
  Volume2,
  Lightbulb,
  Coins,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../../utils/audioService';

export interface RoscoGameProps {
  currentBudget?: number;
  onDeductBudget?: (amount: number, reason?: string) => void;
  onEarnBudget?: (amount?: number) => void;
  onAddBonusXP: (amount: number, reason: string) => void;
}

export interface RoscoQuestion {
  letter: string;
  prefix: 'Empieza por' | 'Contiene la';
  word: string;
  acceptedAnswers: string[];
  definition: string;
  system: string;
}

const ROSCO_QUESTIONS: RoscoQuestion[] = [
  {
    letter: 'A',
    prefix: 'Empieza por',
    word: 'Amilasa',
    acceptedAnswers: ['amilasa', 'alfa amilasa', 'alfaamilasa', 'amilasas'],
    definition: 'Enzima hidrolítica producida por las células acinares del páncreas que se eleva precozmente en pancreatitis aguda, pero puede ser falsamente normal en lipemia extrema.',
    system: 'Pancreático'
  },
  {
    letter: 'B',
    prefix: 'Empieza por',
    word: 'Bilirrubina',
    acceptedAnswers: ['bilirrubina', 'bilirubina', 'pigmento biliar', 'bilirrubina directa', 'bilirrubina conjugada'],
    definition: 'Pigmento tetrapirrólico derivado de la degradación del grupo hemo; su fracción conjugada o directa se excreta en orina causando coluria en ictericias obstructivas.',
    system: 'Hepático'
  },
  {
    letter: 'C',
    prefix: 'Empieza por',
    word: 'CK-MB',
    acceptedAnswers: ['ck-mb', 'ckmb', 'ck mb', 'creatina quinasa mb', 'creatina kinasa mb', 'creatinquinasa mb', 'cpk mb', 'cpk-mb'],
    definition: 'Isoenzima híbrida de la creatina quinasa, esencial para diagnosticar reinfarto precoz a los 3-5 días gracias a su rápido aclaramiento en plasma.',
    system: 'Cardíaco'
  },
  {
    letter: 'D',
    prefix: 'Empieza por',
    word: 'Dímero D',
    acceptedAnswers: ['dimero d', 'dimerod', 'dimero-d', 'd-dimero', 'd dimero', 'pdf'],
    definition: 'Fragmento de degradación de la fibrina estabilizada por el factor XIIIa; su alto valor predictivo negativo descarta tromboembolismo pulmonar y TVP.',
    system: 'Hemostasia'
  },
  {
    letter: 'E',
    prefix: 'Empieza por',
    word: 'Elastasa-1',
    acceptedAnswers: ['elastasa 1', 'elastasa-1', 'elastasa1', 'elastasa', 'elastasa fecal', 'elastasa pancreatica'],
    definition: 'Enzima fecal que no se degrada en su tránsito intestinal; su concentración <200 µg/g es el estándar no invasivo de insuficiencia pancreática exocrina.',
    system: 'Pancreático'
  },
  {
    letter: 'F',
    prefix: 'Empieza por',
    word: 'Fosfatasa Alcalina',
    acceptedAnswers: ['fosfatasa alcalina', 'fa', 'alp', 'fosfatasa', 'fosfatasas alcalinas'],
    definition: 'Enzima canalicular unida a membrana cuya elevación marcada junto a la GGT confirma colestasis intrahepática o coledocolitiasis.',
    system: 'Hepático'
  },
  {
    letter: 'G',
    prefix: 'Empieza por',
    word: 'GGT',
    acceptedAnswers: ['ggt', 'gamma glutamil transferasa', 'gamma-glutamil transferasa', 'gammaglutamiltransferasa', 'gamma gt', 'gammagt'],
    definition: 'Gamma-glutamil transferasa microsomal canalicular; sirve como prueba confirmatoria de que la elevación de fosfatasa alcalina es de origen biliar y no óseo.',
    system: 'Hepático'
  },
  {
    letter: 'H',
    prefix: 'Empieza por',
    word: 'HbA1c',
    acceptedAnswers: ['hba1c', 'hb a1c', 'hemoglobina glicada', 'hemoglobina glicosilada', 'a1c', 'hemoglobina a1c'],
    definition: 'Hemoglobina con unión no enzimática irreversible a glucosa que refleja la media de la glucemia de los últimos 2-3 meses (vida media eritrocitaria).',
    system: 'Metabolismo'
  },
  {
    letter: 'I',
    prefix: 'Empieza por',
    word: 'Insulina',
    acceptedAnswers: ['insulina', 'insulin'],
    definition: 'Hormona anabólica pancreática secretada por células β que favorece la desfosforilación de enzimas y activa la síntesis de glucógeno y ácidos grasos.',
    system: 'Metabolismo'
  },
  {
    letter: 'J',
    prefix: 'Contiene la',
    word: 'Ictericia',
    acceptedAnswers: ['ictericia', 'jaundice', 'coluria'],
    definition: 'Coloración amarillenta de piel, escleras y mucosas producida por el depósito tisular de bilirrubina cuando su nivel sérico supera los 2-2.5 mg/dL.',
    system: 'Hepático'
  },
  {
    letter: 'L',
    prefix: 'Empieza por',
    word: 'Lipasa',
    acceptedAnswers: ['lipasa', 'lipasa pancreatica', 'lipasas'],
    definition: 'Marcador de elección para pancreatitis aguda por su mayor especificidad pancreática y ventana diagnóstica prolongada de 8 a 14 días.',
    system: 'Pancreático'
  },
  {
    letter: 'M',
    prefix: 'Empieza por',
    word: 'MCADD',
    acceptedAnswers: ['mcadd', 'mcad', 'deficit de mcad', 'deficit mcad', 'octanoilcarnitina'],
    definition: 'Error congénito de la β-oxidación mitocondrial que debuta con hipoglucemia hipocetósica severa y elevación plasmática de octanoilcarnitina (C8).',
    system: 'Metabolismo'
  },
  {
    letter: 'N',
    prefix: 'Empieza por',
    word: 'NT-proBNP',
    acceptedAnswers: ['nt-probnp', 'ntprobnp', 'nt pro bnp', 'probnp', 'bnp', 'peptido natriuretico', 'pro bnp'],
    definition: 'Péptido natriurético biológicamente inactivo de vida media prolongada (70-120 min), estándar para descartar o confirmar insuficiencia cardíaca aguda.',
    system: 'Cardíaco'
  },
  {
    letter: 'Ñ',
    prefix: 'Contiene la',
    word: 'Daño tisular',
    acceptedAnswers: ['dano tisular', 'dano', 'lesion tisular', 'necrosis', 'dano celular', 'lesion celular'],
    definition: 'Lesión celular o necrosis isquémica que provoca la rotura de membranas citoplasmáticas y el vertido masivo de enzimas y marcadores solubles al torrente sanguíneo.',
    system: 'Fisiopatología'
  },
  {
    letter: 'O',
    prefix: 'Empieza por',
    word: 'OTC',
    acceptedAnswers: ['otc', 'ornitina transcarbamilasa', 'ornitina transcarbamilasa', 'deficit otc', 'ornitina'],
    definition: 'Déficit de ornitina transcarbamilasa ligada al cromosoma X, causa más común de fallo en el ciclo de la urea con hiperamonemia neurotóxica masiva.',
    system: 'Renal / Urea'
  },
  {
    letter: 'P',
    prefix: 'Empieza por',
    word: 'PCR',
    acceptedAnswers: ['pcr', 'proteina c reactiva', 'crp', 'proteina c-reactiva'],
    definition: 'Proteína reactante de fase aguda sintetizada en el hepatocito bajo estímulo de IL-6 con cinética rápida de ascenso (6h) y descenso en inflamación.',
    system: 'Inmunología'
  },
  {
    letter: 'Q',
    prefix: 'Empieza por',
    word: 'Quilomicrón',
    acceptedAnswers: ['quilomicron', 'quilomicrones', 'chylomicron', 'chylomicrons'],
    definition: 'Lipoproteína de mayor tamaño y menor densidad encargada del transporte de triglicéridos exógenos desde el enterocito hacia los tejidos periféricos.',
    system: 'Lípidos'
  },
  {
    letter: 'R',
    prefix: 'Empieza por',
    word: 'Randle',
    acceptedAnswers: ['randle', 'ciclo de randle', 'ciclo randle', 'sustrato', 'ciclo glucosa acidos grasos'],
    definition: 'Ciclo metabólico de sustratos donde la oxidación acelerada de ácidos grasos libres inhibe la captación y utilización periférica de glucosa.',
    system: 'Metabolismo'
  },
  {
    letter: 'S',
    prefix: 'Empieza por',
    word: 'Sodio',
    acceptedAnswers: ['sodio', 'natrio', 'na', 'ion sodio'],
    definition: 'Principal catión del espacio extracelular y determinante primordial de la volemia y de la osmolaridad plasmática efectiva.',
    system: 'Electrolitos'
  },
  {
    letter: 'T',
    prefix: 'Empieza por',
    word: 'Troponina hs-cTn',
    acceptedAnswers: ['troponina', 'troponinas', 'troponina ultrasensible', 'troponina ctn', 'hs-ctn', 'hsctn', 'ctn', 'troponina i', 'troponina t'],
    definition: 'Estándar de oro indiscutible para el diagnóstico de necrosis miocárdica e infarto agudo de miocardio (SCASEST / IAMCEST).',
    system: 'Cardíaco'
  },
  {
    letter: 'U',
    prefix: 'Empieza por',
    word: 'Urea',
    acceptedAnswers: ['urea', 'bun', 'nitrogeno ureico'],
    definition: 'Compuesto no tóxico sintetizado en el hígado que elimina el exceso de grupos amino procedentes del catabolismo de aminoácidos.',
    system: 'Renal / Urea'
  },
  {
    letter: 'V',
    prefix: 'Empieza por',
    word: 'Vitamina B12',
    acceptedAnswers: ['vitamina b12', 'b12', 'cobalamina', 'cianocobalamina', 'vitamina b-12'],
    definition: 'Cofactor esencial cuya absorción ileal disminuye en hipoclorhidria gástrica provocada por el uso continuado de inhibidores de bomba de protones.',
    system: 'Digestivo'
  },
  {
    letter: 'X',
    prefix: 'Empieza por',
    word: 'Xantina',
    acceptedAnswers: ['xantina', 'xantina oxidasa', 'xantinas', 'hipoxantina'],
    definition: 'Base púrica intermediaria en el catabolismo de nucleótidos que se oxida a ácido úrico mediante la enzima xantina oxidasa (diana del alopurinol).',
    system: 'Metabolismo'
  },
  {
    letter: 'Y',
    prefix: 'Empieza por',
    word: 'Yodo',
    acceptedAnswers: ['yodo', 'iodo', 'yoduro', 'ioduro'],
    definition: 'Halógeno y oligoelemento indispensable para la síntesis folicular tiroidea de triyodotironina (T3) y tiroxina (T4).',
    system: 'Endocrino'
  },
  {
    letter: 'Z',
    prefix: 'Empieza por',
    word: 'Zinc',
    acceptedAnswers: ['zinc', 'cinc', 'zn'],
    definition: 'Oligoelemento esencial con función catalítica y estructural en más de 300 metaloenzimas, incluyendo la anhidrasa carbónica y fosfatasa alcalina.',
    system: 'Metabolismo'
  }
];

// ==========================================
// FUNCIÓN DE NORMALIZACIÓN DE CADENAS
// ==========================================
/**
 * Normaliza una cadena de texto para la validación permisiva de respuestas:
 * 1. Convierte a minúsculas (.toLowerCase())
 * 2. Elimina tildes, acentos y diéresis mediante descomposición Unicode NFD y filtrado del rango \u0300-\u036f
 * 3. Elimina caracteres no alfanuméricos (signos de puntuación, guiones, símbolos)
 * 4. Remueve espacios en blanco superfluos
 *
 * Ejemplo:
 * - "Dímero-D" -> "dimerod"
 * - "Quilomicrón" -> "quilomicron"
 * - "Daño tisular" -> "danotisular"
 * - "CK-MB" -> "ckmb"
 */
export function normalizeString(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD') // Descompone caracteres acentuados en letra base + marca diacrítica
    .replace(/[\u0300-\u036f]/g, '') // Elimina todas las marcas de tilde/acento
    .replace(/[^a-z0-9]/g, '') // Elimina signos ortográficos, espacios y símbolos
    .trim();
}

/**
 * Normalización alternativa que preserva un espacio simple entre palabras.
 * Útil para evaluar frases completas conservando la separación léxica.
 */
export function normalizeStringWithSpaces(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina tildes
    .replace(/[^a-z0-9\s]/g, '') // Conserva letras, números y espacios
    .replace(/\s+/g, ' ') // Colapsa múltiples espacios a uno solo
    .trim();
}

// Alias de retrocompatibilidad
export const normalizeText = normalizeString;

// Helper: Cálculo de distancia Levenshtein para tolerancia a pequeñas erratas tipográficas
function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix: number[][] = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;
  for (let j = 0; j <= bn; ++j) matrix[j][0] = j;

  for (let j = 1; j <= bn; ++j) {
    for (let i = 1; i <= an; ++i) {
      if (a[i - 1] === b[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i - 1] + 1, // sustitución
          matrix[j][i - 1] + 1,     // inserción
          matrix[j - 1][i] + 1      // eliminación
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Validación flexible de respuestas del alumno:
 * - Aplica normalizeString a la respuesta del usuario y a las respuestas aceptadas
 * - Compara tanto la forma compacta (sin espacios ni signos) como la forma con palabras separadas
 * - Aplica tolerancia a erratas leves (Levenshtein distance <= 1 o <= 2 según la longitud)
 */
export function checkFlexibleAnswer(userAnswer: string, question: RoscoQuestion): boolean {
  if (!userAnswer) return false;

  const normUserCompact = normalizeString(userAnswer);
  const normUserSpaces = normalizeStringWithSpaces(userAnswer);
  if (!normUserCompact) return false;

  const rawAnswers = [question.word, ...question.acceptedAnswers];
  const compactCandidates = rawAnswers.map(normalizeString);
  const spacedCandidates = rawAnswers.map(normalizeStringWithSpaces);

  // 1. Coincidencia directa normalizada (sin tildes, minúsculas, con o sin espacios)
  if (compactCandidates.includes(normUserCompact) || spacedCandidates.includes(normUserSpaces)) {
    return true;
  }

  // 2. Coincidencia difusa (tolerancia a erratas de 1 caracter para 4-6 letras, 2 caracteres para >= 7 letras)
  for (const candidate of compactCandidates) {
    const maxDist = candidate.length >= 7 ? 2 : candidate.length >= 4 ? 1 : 0;
    if (maxDist > 0 && Math.abs(candidate.length - normUserCompact.length) <= maxDist) {
      if (levenshtein(normUserCompact, candidate) <= maxDist) {
        return true;
      }
    }
  }

  // 3. Coincidencia difusa sobre la versión con espacios
  for (const candidate of spacedCandidates) {
    const maxDist = candidate.length >= 7 ? 2 : candidate.length >= 4 ? 1 : 0;
    if (maxDist > 0 && Math.abs(candidate.length - normUserSpaces.length) <= maxDist) {
      if (levenshtein(normUserSpaces, candidate) <= maxDist) {
        return true;
      }
    }
  }

  return false;
}

export const RoscoGame: React.FC<RoscoGameProps> = ({
  currentBudget = 5000,
  onDeductBudget,
  onEarnBudget,
  onAddBonusXP
}) => {
  const HINT_BUDGET_COST = 50;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answersStatus, setAnswersStatus] = useState<Record<number, 'correct' | 'wrong' | 'passed'>>({});
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);

  // Budget & Hint State
  const [localBudget, setLocalBudget] = useState<number>(currentBudget);
  const [hintsUsed, setHintsUsed] = useState<Record<number, boolean>>({});
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);

  useEffect(() => {
    if (currentBudget !== undefined) {
      setLocalBudget(currentBudget);
    }
  }, [currentBudget]);

  // Text input state for user answer
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; word: string; text: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on current question change
  useEffect(() => {
    if (isPlaying && !isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isPlaying, isFinished]);

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
    setAnswersStatus({});
    setCurrentIndex(0);
    setTimeLeft(180);
    setIsFinished(false);
    setRewardClaimed(false);
    setUserAnswer('');
    setLastFeedback(null);
    setHintsUsed({});
    setBudgetWarning(null);
    setIsPlaying(true);
  };

  // Solicitar Pista: Revela la 2ª letra a cambio de 50 € de presupuesto
  const handleRequestHint = () => {
    if (!isPlaying || isFinished) return;

    // Si ya está desbloqueada para la pregunta actual, solo reenfocamos
    if (hintsUsed[currentIndex]) {
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    // Comprobar si hay fondos suficientes
    if (localBudget < HINT_BUDGET_COST) {
      audioService.playError();
      setBudgetWarning(`Presupuesto insuficiente (${localBudget} € / requiere ${HINT_BUDGET_COST} €).`);
      setTimeout(() => setBudgetWarning(null), 3500);
      return;
    }

    const currentQ = ROSCO_QUESTIONS[currentIndex];

    // Descontar presupuesto
    if (onDeductBudget) {
      onDeductBudget(HINT_BUDGET_COST, `Pista en el Rosco (2ª letra de "${currentQ.word}")`);
    }
    setLocalBudget((prev) => Math.max(0, prev - HINT_BUDGET_COST));
    setHintsUsed((prev) => ({ ...prev, [currentIndex]: true }));
    setBudgetWarning(null);

    audioService.playClick();

    // Si el usuario no ha escrito nada o solo 1 letra, pre-rellenamos el prefijo (las 2 primeras letras)
    if (!userAnswer.trim() || userAnswer.trim().length <= 1) {
      const prefix2 = currentQ.word.slice(0, 2);
      setUserAnswer(prefix2);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isPlaying || isFinished) return;

    const trimmed = userAnswer.trim();
    if (!trimmed) {
      handlePass();
      return;
    }

    const currentQ = ROSCO_QUESTIONS[currentIndex];
    const isCorrect = checkFlexibleAnswer(trimmed, currentQ);

    if (isCorrect) {
      audioService.playSuccess();
      setLastFeedback({
        isCorrect: true,
        word: currentQ.word,
        text: `¡Correcto! Acertaste "${currentQ.word}"`
      });
    } else {
      audioService.playError();
      setLastFeedback({
        isCorrect: false,
        word: currentQ.word,
        text: `Incorrecto. La respuesta era "${currentQ.word}"`
      });
    }

    setAnswersStatus((prev) => ({
      ...prev,
      [currentIndex]: isCorrect ? 'correct' : 'wrong'
    }));

    setUserAnswer('');
    advanceToNext(currentIndex);
  };

  const handlePass = () => {
    if (!isPlaying || isFinished) return;
    setAnswersStatus((prev) => ({
      ...prev,
      [currentIndex]: 'passed'
    }));
    setUserAnswer('');
    setLastFeedback({
      isCorrect: false,
      word: '',
      text: 'Pasapalabra ↷ Continuarás en la siguiente vuelta'
    });
    advanceToNext(currentIndex);
  };

  const advanceToNext = (fromIndex: number) => {
    // Check if all are answered (not passed)
    const newCount = Object.keys(answersStatus).length + 1;
    if (newCount >= ROSCO_QUESTIONS.length) {
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

  const handleClaimReward = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);

    audioService.playCoin();

    const bonusXP = Math.max(50, correctCount * 12);
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-6">
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
            Escribe el concepto bioquímico para cada letra del abecedario. Se acepta flexibilidad ortográfica y abreviaturas médicas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-end">
          {/* Indicador de presupuesto disponible para pistas */}
          <div
            className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 font-mono font-bold text-xs text-amber-900 flex items-center gap-1.5 shadow-xs"
            title="Presupuesto disponible en tu guardia para pistas y peticiones"
          >
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>{localBudget} €</span>
          </div>

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

      {/* Score HUD */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
          <span className="text-[10px] uppercase block text-emerald-600">Aciertos</span>
          <span className="text-lg font-black">{correctCount}</span>
        </div>
        <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold">
          <span className="text-[10px] uppercase block text-rose-600">Fallos</span>
          <span className="text-lg font-black">{wrongCount}</span>
        </div>
        <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold">
          <span className="text-[10px] uppercase block text-blue-600">Restantes</span>
          <span className="text-lg font-black">
            {ROSCO_QUESTIONS.length - correctCount - wrongCount}
          </span>
        </div>
      </div>

      {/* Finished Summary View */}
      {isFinished ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-black text-slate-900">
            ¡Rosco Metabólico Completado!
          </h3>

          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Has logrado <span className="font-bold text-emerald-600">{correctCount}</span> aciertos y <span className="font-bold text-rose-600">{wrongCount}</span> fallos en esta ronda de vocabulario clínico de la A a la Z.
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
      ) : (
        /* The Circular Rosco (Wheel of Alphabet) */
        <div className="relative w-full max-w-[560px] aspect-square mx-auto my-2 flex items-center justify-center select-none">
          {/* Circular letters ring */}
          {ROSCO_QUESTIONS.map((q, idx) => {
            const total = ROSCO_QUESTIONS.length;
            const angleDeg = (idx / total) * 360 - 90;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radiusPercent = 43.5;
            const leftPercent = 50 + radiusPercent * Math.cos(angleRad);
            const topPercent = 50 + radiusPercent * Math.sin(angleRad);

            const status = answersStatus[idx];
            const isCurrent = idx === currentIndex && isPlaying && !isFinished;

            let btnStyle = 'bg-slate-100 text-slate-700 border-slate-300';
            if (status === 'correct') {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-sm';
            } else if (status === 'wrong') {
              btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-sm';
            } else if (status === 'passed') {
              btnStyle = 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
            } else if (isCurrent) {
              btnStyle = 'bg-blue-600 text-white border-cyan-400 ring-4 ring-cyan-400/50 scale-125 z-20 animate-pulse';
            }

            return (
              <div
                key={q.letter}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border transition-all duration-300 shadow-xs ${btnStyle}`}
                title={`${q.letter}: ${status || 'pendiente'}`}
              >
                {q.letter}
              </div>
            );
          })}

          {/* Central Question & Answer Card */}
          <div className="w-[72%] h-[72%] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center relative z-10 overflow-hidden">
            {isPlaying && currentQ ? (
              <>
                {/* Header: Letter badge & system */}
                <div className="w-full flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-sm">
                      {currentQ.letter}
                    </span>
                    <div className="text-left">
                      <span className="text-[10px] sm:text-xs font-bold tracking-wider text-cyan-400 block leading-tight">
                        {currentQ.prefix} {currentQ.letter} • {currentQ.system}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Definición
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold">
                    #{currentIndex + 1}
                  </span>
                </div>

                {/* Definition Clue Text */}
                <div className="w-full my-auto px-1 py-1 max-h-[110px] sm:max-h-[130px] overflow-y-auto">
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    "{currentQ.definition}"
                  </p>
                </div>

                {/* Last Result Toast */}
                {lastFeedback && (
                  <div
                    className={`w-full py-1 px-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                      lastFeedback.isCorrect
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {lastFeedback.text}
                  </div>
                )}

                {/* Clue/Hint Pill (2nd Letter Revealed) */}
                {hintsUsed[currentIndex] && (
                  <div className="w-full py-1.5 px-3 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-semibold flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">💡</span>
                      <span>
                        2ª letra revelada:{' '}
                        <strong className="text-white font-mono text-sm uppercase px-1.5 py-0.5 rounded bg-amber-500/40 border border-amber-400/60 shadow-xs">
                          {currentQ.word.length > 1 ? currentQ.word[1].toUpperCase() : ''}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono">
                      Prefijo: <strong className="text-white font-bold">{currentQ.word.slice(0, 2)}...</strong>
                    </span>
                  </div>
                )}

                {/* Insufficient Budget Alert */}
                {budgetWarning && (
                  <div className="w-full py-1 px-2.5 rounded-lg bg-rose-950/90 border border-rose-500/50 text-rose-300 text-[10px] sm:text-xs font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{budgetWarning}</span>
                  </div>
                )}

                {/* Answer Input Box & Action Buttons */}
                <form onSubmit={handleAnswerSubmit} className="w-full space-y-1.5 mt-1">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Tu respuesta (sin tildes ni mayúsculas)..."
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      className="w-full px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-950 border-2 border-cyan-500/60 focus:border-cyan-400 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-center font-semibold transition-all shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <button
                      type="submit"
                      disabled={!userAnswer.trim()}
                      className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Responder</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRequestHint}
                      disabled={Boolean(hintsUsed[currentIndex])}
                      className={`py-1.5 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        hintsUsed[currentIndex]
                          ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 cursor-default'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/40 text-amber-200 hover:text-white shadow-xs'
                      }`}
                      title={
                        hintsUsed[currentIndex]
                          ? `Pista activa: 2ª letra = "${currentQ.word.length > 1 ? currentQ.word[1].toUpperCase() : ''}"`
                          : `Revelar la 2ª letra de la respuesta por ${HINT_BUDGET_COST} € de presupuesto`
                      }
                    >
                      <Lightbulb
                        className={`w-3.5 h-3.5 shrink-0 ${
                          hintsUsed[currentIndex] ? 'text-amber-400 fill-amber-400' : 'text-amber-300'
                        }`}
                      />
                      <span className="truncate">
                        {hintsUsed[currentIndex]
                          ? `2ª: ${currentQ.word.length > 1 ? currentQ.word[1].toUpperCase() : ''}`
                          : `Pista (-${HINT_BUDGET_COST}€)`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePass}
                      className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="truncate">Pasapalabra ↷</span>
                    </button>
                  </div>

                  <p className="text-[9px] text-slate-400 text-center">
                    Validación permisiva: tildes, mayúsculas y erratas leves admitidas
                  </p>
                </form>
              </>
            ) : (
              /* Pre-game Welcome Screen Inside the Rosco */
              <div className="m-auto space-y-3 px-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-indigo-500/40">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-white">
                  Rosco de Bioquímica Clínica
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  25 letras con definiciones de laboratorio médico. Escribe tu respuesta en el cuadrito o usa el botón de Pista (-50 €) para revelar la 2ª letra.
                </p>
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Comenzar Rosco</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
