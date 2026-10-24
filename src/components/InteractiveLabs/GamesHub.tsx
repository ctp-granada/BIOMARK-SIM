import React, { useState, useEffect } from 'react';
import { UserProgress, OrganSystem, ActiveModule } from '../../types';
import { RoscoGame } from './RoscoGame';
import { WordSearchGame } from './WordSearchGame';
import { CrosswordGame } from './CrosswordGame';
import {
  Heart,
  Zap,
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  Timer,
  RefreshCw,
  Play,
  RotateCcw,
  Flame,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
  Award,
  Layers,
  HelpCircle,
  ArrowRight,
  Clock,
  Sparkle,
  Coins,
  Wallet,
  Search,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../../utils/audioService';

interface GamesHubProps {
  userProgress: UserProgress;
  initialTab?: MinigameTab;
  onEarnBudget?: (amount?: number) => void;
  onDeductBudget?: (amount: number, reason?: string) => void;
  onRechargeLife?: (amount?: number) => void;
  onAddBonusXP: (amount: number, reason: string) => void;
  onNavigate: (module: ActiveModule) => void;
}

type MinigameTab = 'trivia' | 'memoria' | 'rosco' | 'clasificador' | 'sopa' | 'crucigrama';

// 1. DATA: Emergency Quick Questions
interface EmergencyQuestion {
  id: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  clinicalSystem: string;
}

const EMERGENCY_TRIVIA_POOL: EmergencyQuestion[] = [
  {
    id: 't-1',
    scenario: 'Paciente de 62 años acude a urgencias con dolor precordial opresivo iniciado hace 90 minutos.',
    question: '¿Qué biomarcador es el patrón oro para confirmar o descartar necrosis miocárdica en este intervalo temporal?',
    options: [
      'Troponina I o T de alta sensibilidad (hs-cTn)',
      'Lactato Deshidrogenasa (LDH-1)',
      'CK total sérica',
      'Mioglobina aislada sin troponina'
    ],
    correctIndex: 0,
    explanation: 'Las troponinas ultrasensibles (hs-cTnI y hs-cTnT) son el estándar indiscutible por su elevada sensibilidad analítica desde la hora 1 a 3 del inicio de la isquemia miocárdica.',
    clinicalSystem: 'Cardiovascular'
  },
  {
    id: 't-2',
    scenario: 'Paciente diabético tipo 1 con vómitos, respiración de Kussmaul y glucemia de 380 mg/dL.',
    question: 'En la cetoacidosis diabética, ¿cuál es el principal cuerpo cetónico en sangre cuya cuantificación sérica es preferible al acetoacetato urinario?',
    options: [
      'Beta-hidroxibutirato',
      'Acetona volátil',
      'Ácido acetoacético',
      'Ácido pirúvico'
    ],
    correctIndex: 0,
    explanation: 'El beta-hidroxibutirato es el cuerpo cetónico predominante en plasma durante la acidosis metabólica por descompensación cetósica y refleja fidedignamente la respuesta al tratamiento.',
    clinicalSystem: 'Metabolismo'
  },
  {
    id: 't-3',
    scenario: 'Varón de 45 años con dolor epigástrico irradiado en cinturón y amilasa sérica x4 veces su límite.',
    question: '¿Por qué la determinación de Lipasa sérica es superior a la Amilasa en el diagnóstico de Pancreatitis Aguda?',
    options: [
      'Mayor especificidad pancreática y ventana de detección más prolongada (8-14 días)',
      'Porque la amilasa nunca se eleva en colelitiasis',
      'Porque la lipasa solo se produce en el estómago',
      'Porque la lipasa no requiere reactivos analíticos'
    ],
    correctIndex: 0,
    explanation: 'La lipasa es altamente específica del páncreas (la amilasa puede elevarse por glándulas salivales o perforaciones) y permanece elevada hasta 14 días frente a 3-5 días de la amilasa.',
    clinicalSystem: 'Pancreático'
  },
  {
    id: 't-4',
    scenario: 'Mujer de 34 años con ictericia cutaneomucosa intensa, coluria (orina oscura) y acolia (heces claras).',
    question: '¿Qué tipo de bilirrubina estará marcadamente elevada en su perfil analítico?',
    options: [
      'Bilirrubina Conjugada (Directa) por colestasis u obstrucción biliar',
      'Bilirrubina No Conjugada (Indirecta) exclusivamente',
      'Bilirrubina libre unida a heparina',
      'Hemoglobina plasmática libre'
    ],
    correctIndex: 0,
    explanation: 'En las ictericias posthepáticas obstructivas se retiene la bilirrubina conjugada ya glucuronizada en el hepatocito, la cual refluye a la sangre y se filtra en el glomérulo produciendo coluria.',
    clinicalSystem: 'Hepato-Biliar'
  },
  {
    id: 't-5',
    scenario: 'Varón inmovilizado tras cirugía traumatológica con disnea súbita y taquicardia.',
    question: '¿Cuál es el valor clínico principal del Dímero D en la sospecha de tromboembolismo pulmonar (TEP)?',
    options: [
      'Elevado Valor Predictivo Negativo (VPN): un resultado normal descarta TEP con alta fiabilidad',
      'Valor predictivo positivo absoluto para diagnosticar infarto',
      'Mide la formación primaria de plaquetas en médula ósea',
      'Indica deficiencia congénita de albúmina'
    ],
    correctIndex: 0,
    explanation: 'El Dímero D es un producto de degradación de la fibrina cruzada. Su gran utilidad clínica radica en su alto VPN en pacientes con probabilidad clínica baja/intermedia.',
    clinicalSystem: 'Hemostasia'
  },
  {
    id: 't-6',
    scenario: 'Paciente ingresado en UCI con shock séptico y oliguria progresiva.',
    question: '¿Qué marcador endógeno de filtrado glomerular se eleva de forma más precoz que la creatinina y no depende de la masa muscular?',
    options: [
      'Cistatina C sérica',
      'Urea plasmática total',
      'Ácido úrico',
      'Mioglobina urinaria'
    ],
    correctIndex: 0,
    explanation: 'La Cistatina C es una proteína de bajo peso molecular producida de forma constante por todas las células nucleadas; detecta el fracaso renal agudo 24-48 horas antes que la creatinina.',
    clinicalSystem: 'Renal'
  },
  {
    id: 't-7',
    scenario: 'En estado postprandial con abundancia de glucosa e insulina en plasma.',
    question: '¿Qué intermediario metabólico bloquea la enzima CPT-1 en el ciclo de Randle, inhibiendo la beta-oxidación mitocondrial de ácidos grasos?',
    options: [
      'Malonil-CoA',
      'Oxalacetato',
      'Succinil-CoA',
      'Lactato deshidrogenasa'
    ],
    correctIndex: 0,
    explanation: 'El Malonil-CoA (sintetizado por la Acetil-CoA Carboxilasa cuando la glucólisis está activa) es el regulador alostérico negativo de la Carnitina Palmitoil Transferasa 1 (CPT-1).',
    clinicalSystem: 'Metabolismo'
  },
  {
    id: 't-8',
    scenario: 'Intoxicación aguda por sobredosis voluntaria de Paracetamol (Acetaminofén).',
    question: '¿Cuál es la base bioquímica del tratamiento urgente con N-Acetilcisteína (NAC)?',
    options: [
      'Restaura las reservas hepáticas de Glutatión reducido (GSH) para neutralizar el metabolito tóxico NAPQI',
      'Inhibe directamente la secreción renal de urea',
      'Bloquea la fosforilación oxidativa en el músculo',
      'Aumenta la absorción intestinal del fármaco'
    ],
    correctIndex: 0,
    explanation: 'La NAC aporta cisteína para sintetizar GSH, lo que permite conjugar y desactivar de inmediato la N-acetil-p-benzoquinoneimina (NAPQI), evitando la necrosis hepatocelular masiva.',
    clinicalSystem: 'Hepático'
  }
];

// 2. DATA: Classifier Biomarkers
interface ClassifierBiomarker {
  name: string;
  abbreviation: string;
  targetSystem: 'cardiac' | 'hepatic' | 'metabolic' | 'renal' | 'hemostasis' | 'pancreatic';
  hint: string;
}

const CLASSIFIER_ITEMS: ClassifierBiomarker[] = [
  { name: 'Troponina I Ultrasensible', abbreviation: 'hs-cTnI', targetSystem: 'cardiac', hint: 'Necrosis miocárdica aguda' },
  { name: 'Lipasa Específica', abbreviation: 'Lipasa', targetSystem: 'pancreatic', hint: 'Citólisis acinar pancreática' },
  { name: 'Alanina Aminotransferasa', abbreviation: 'ALT / GPT', targetSystem: 'hepatic', hint: 'Daño hepatocelular específico' },
  { name: 'Dímero D de Fibrina', abbreviation: 'D-Dímero', targetSystem: 'hemostasis', hint: 'Degradación de fibrina polimerizada' },
  { name: 'Cistatina C', abbreviation: 'CysC', targetSystem: 'renal', hint: 'Filtrado glomerular independiente de masa' },
  { name: 'Péptido Natriurético tipo B', abbreviation: 'NT-proBNP', targetSystem: 'cardiac', hint: 'Estrés parietal ventricular cardíaco' },
  { name: 'Gamma Glutamil Transferasa', abbreviation: 'GGT', targetSystem: 'hepatic', hint: 'Colestasis e inducción enzimática' },
  { name: 'Creatinina Sérica', abbreviation: 'Creatinina', targetSystem: 'renal', hint: 'Aclaramiento y función renal' },
  { name: 'Fibrinógeno Plasmático', abbreviation: 'Factor I', targetSystem: 'hemostasis', hint: 'Sustrato de la coagulación' },
  { name: 'Hemoglobina Glicada', abbreviation: 'HbA1c', targetSystem: 'metabolic', hint: 'Memoria glucémica trimestral' },
  { name: 'Beta-Hidroxibutirato', abbreviation: 'β-OHB', targetSystem: 'metabolic', hint: 'Cuerpo cetónico de acidosis' },
  { name: 'Amilasa Pancreática', abbreviation: 'p-Amilasa', targetSystem: 'pancreatic', hint: 'Isoenzima digestiva' },
  { name: 'CK-MB Masa', abbreviation: 'CK-MBm', targetSystem: 'cardiac', hint: 'Cinética de reinfarto temprano' },
  { name: 'Bilirrubina Fraccionada', abbreviation: 'BT / BD', targetSystem: 'hepatic', hint: 'Capacidad de conjugación y excreción' },
  { name: 'Tiempo de Protrombina / INR', abbreviation: 'TP / INR', targetSystem: 'hemostasis', hint: 'Vía extrínseca y función de síntesis hepática' }
];

// 3. DATA: Memory Match Cards (6 clinical pairs = 12 cards)
interface MemoryPair {
  pairId: string;
  itemA: { text: string; subtext: string; category: string };
  itemB: { text: string; subtext: string; category: string };
}

const MEMORY_PAIRS: MemoryPair[] = [
  {
    pairId: 'pair-1',
    itemA: { text: 'hs-cTnI / Troponina I', subtext: 'Biomarcador analítico', category: 'Cardíaco' },
    itemB: { text: 'Necrosis Miocárdica (IAM)', subtext: 'Diagnóstico de referencia', category: 'Patología' }
  },
  {
    pairId: 'pair-2',
    itemA: { text: 'Lipasa sérica', subtext: 'Enzima acinar', category: 'Digestivo' },
    itemB: { text: 'Pancreatitis Aguda', subtext: 'Alta especificidad y ventana 14d', category: 'Patología' }
  },
  {
    pairId: 'pair-3',
    itemA: { text: 'Malonil-CoA', subtext: 'Intermediario lipogénico', category: 'Metabolismo' },
    itemB: { text: 'Inhibidor de CPT-1', subtext: 'Regulación del Ciclo de Randle', category: 'Mecanismo' }
  },
  {
    pairId: 'pair-4',
    itemA: { text: 'Dímero D', subtext: 'Producto de lisis fibrina', category: 'Hemostasia' },
    itemB: { text: 'Descarte de TEP / TVP', subtext: 'Alto Valor Predictivo Negativo', category: 'Patología' }
  },
  {
    pairId: 'pair-5',
    itemA: { text: 'Bilirrubina No Conjugada', subtext: 'Liposoluble / indirecta', category: 'Hepático' },
    itemB: { text: 'Ictericia Hemolítica (Prehepática)', subtext: 'Sin coluria en orina', category: 'Patología' }
  },
  {
    pairId: 'pair-6',
    itemA: { text: 'Hemoglobina A1c', subtext: 'Glicosilación no enzimática', category: 'Metabolismo' },
    itemB: { text: 'Control Glucémico Crónico', subtext: 'Media ponderada 90-120 días', category: 'Seguimiento' }
  }
];

export const GamesHub: React.FC<GamesHubProps> = ({
  userProgress,
  initialTab,
  onEarnBudget,
  onDeductBudget,
  onRechargeLife,
  onAddBonusXP,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<MinigameTab>(initialTab || 'rosco');
  const [celebrationToast, setCelebrationToast] = useState<{
    show: boolean;
    title: string;
    description: string;
    budgetGained: number;
    xpGained: number;
  }>({
    show: false,
    title: '',
    description: '',
    budgetGained: 0,
    xpGained: 0
  });

  const triggerReward = (budgetAmount: number, xp: number, title: string, description: string) => {
    if (budgetAmount > 0) {
      audioService.playCoin();
      if (onEarnBudget) {
        onEarnBudget(budgetAmount);
      } else if (onRechargeLife) {
        onRechargeLife(1);
      }
    }
    if (xp > 0) {
      onAddBonusXP(xp, title);
    }
    setCelebrationToast({
      show: true,
      title,
      description,
      budgetGained: budgetAmount,
      xpGained: xp
    });

    setTimeout(() => {
      setCelebrationToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  // -------------------------------------------------------------
  // GAME 1: REANIMADOR BIOQUÍMICO (TRIVIA)
  // -------------------------------------------------------------
  const [triviaQuestions, setTriviaQuestions] = useState<EmergencyQuestion[]>([]);
  const [triviaIdx, setTriviaIdx] = useState<number>(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaRevealed, setTriviaRevealed] = useState<boolean>(false);
  const [triviaCorrectCount, setTriviaCorrectCount] = useState<number>(0);
  const [triviaFinished, setTriviaFinished] = useState<boolean>(false);

  const initTriviaGame = () => {
    // Shuffle and pick 3 questions
    const shuffled = [...EMERGENCY_TRIVIA_POOL].sort(() => 0.5 - Math.random()).slice(0, 3);
    setTriviaQuestions(shuffled);
    setTriviaIdx(0);
    setSelectedTriviaOption(null);
    setTriviaRevealed(false);
    setTriviaCorrectCount(0);
    setTriviaFinished(false);
  };

  useEffect(() => {
    if (triviaQuestions.length === 0) {
      initTriviaGame();
    }
  }, []);

  const handleSelectTriviaOption = (optionIndex: number) => {
    if (triviaRevealed || triviaFinished) return;
    setSelectedTriviaOption(optionIndex);
    setTriviaRevealed(true);

    const currentQ = triviaQuestions[triviaIdx];
    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      setTriviaCorrectCount((prev) => prev + 1);
      audioService.playSuccess();
    } else {
      audioService.playError();
    }
  };

  const handleNextTrivia = () => {
    if (triviaIdx + 1 < triviaQuestions.length) {
      setTriviaIdx((prev) => prev + 1);
      setSelectedTriviaOption(null);
      setTriviaRevealed(false);
    } else {
      // Completed round
      setTriviaFinished(true);
      const totalCorrect = triviaCorrectCount + (selectedTriviaOption === triviaQuestions[triviaIdx].correctIndex ? 0 : 0);
      if (totalCorrect >= 2) {
        // Success reward: +260-300 € budget + 60-80 XP
        triggerReward(
          totalCorrect === 3 ? 300 : 260,
          totalCorrect === 3 ? 80 : 60,
          '¡Reanimación Exitosa!',
          `Has respondido correctamente ${totalCorrect}/3 casos de urgencia bioquímica. ¡+${totalCorrect === 3 ? 300 : 260} € de Presupuesto Hospitalario 💰 y +${totalCorrect === 3 ? 80 : 60} XP acreditados!`
        );
      }
    }
  };

  // -------------------------------------------------------------
  // GAME 2: CLASIFICADOR FLASH DE BIOMARCADORES (30s)
  // -------------------------------------------------------------
  const [classifierActive, setClassifierActive] = useState<boolean>(false);
  const [classifierTimeLeft, setClassifierTimeLeft] = useState<number>(30);
  const [classifierQueue, setClassifierQueue] = useState<ClassifierBiomarker[]>([]);
  const [classifierCurrentIdx, setClassifierCurrentIdx] = useState<number>(0);
  const [classifierScore, setClassifierScore] = useState<number>(0);
  const [classifierStreak, setClassifierStreak] = useState<number>(0);
  const [classifierLastResult, setClassifierLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [classifierFinished, setClassifierFinished] = useState<boolean>(false);

  const startClassifierGame = () => {
    const shuffled = [...CLASSIFIER_ITEMS].sort(() => 0.5 - Math.random());
    setClassifierQueue(shuffled);
    setClassifierCurrentIdx(0);
    setClassifierScore(0);
    setClassifierStreak(0);
    setClassifierTimeLeft(30);
    setClassifierLastResult(null);
    setClassifierFinished(false);
    setClassifierActive(true);
  };

  useEffect(() => {
    let interval: number | null = null;
    if (classifierActive && classifierTimeLeft > 0) {
      interval = window.setInterval(() => {
        setClassifierTimeLeft((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            setTimeout(() => {
              setClassifierActive(false);
              setClassifierFinished(true);
            }, 0);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [classifierActive, classifierTimeLeft]);

  // Evaluate final score when classifier finishes
  useEffect(() => {
    if (classifierFinished && classifierScore >= 4) {
      const bonusXP = classifierScore * 15;
      const bonusBudget = Math.min(300, 250 + (classifierScore - 4) * 10);
      triggerReward(
        bonusBudget,
        bonusXP,
        '¡Triage Analítico Completado!',
        `Has clasificado ${classifierScore} biomarcadores correctamente bajo presión temporal. ¡+${bonusBudget} € de Fondos Sanitarios 💰 y +${bonusXP} XP conseguidos!`
      );
    }
  }, [classifierFinished]);

  const handleClassifyChoice = (systemChoice: 'cardiac' | 'hepatic' | 'metabolic' | 'renal' | 'hemostasis' | 'pancreatic') => {
    if (!classifierActive || classifierCurrentIdx >= classifierQueue.length) return;
    const currentItem = classifierQueue[classifierCurrentIdx];
    const isCorrect = currentItem.targetSystem === systemChoice;

    if (isCorrect) {
      setClassifierScore((prev) => prev + 1);
      setClassifierStreak((prev) => prev + 1);
      setClassifierLastResult('correct');
      audioService.playSuccess();
    } else {
      setClassifierStreak(0);
      setClassifierLastResult('wrong');
      audioService.playError();
    }

    setTimeout(() => {
      setClassifierLastResult(null);
      if (classifierCurrentIdx + 1 < classifierQueue.length) {
        setClassifierCurrentIdx((prev) => prev + 1);
      } else {
        // Loop back with newly shuffled queue
        setClassifierQueue((prev) => [...prev].sort(() => 0.5 - Math.random()));
        setClassifierCurrentIdx(0);
      }
    }, 250);
  };

  // -------------------------------------------------------------
  // GAME 3: MEMORIA DE ENZIMAS & DIAGNÓSTICO (PAREJAS)
  // -------------------------------------------------------------
  interface CardItem {
    cardId: string;
    pairId: string;
    text: string;
    subtext: string;
    category: string;
    isFlipped: boolean;
    isMatched: boolean;
  }

  const [memoryCards, setMemoryCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);
  const [memoryMatchesCount, setMemoryMatchesCount] = useState<number>(0);
  const [memoryFinished, setMemoryFinished] = useState<boolean>(false);

  const initMemoryGame = () => {
    // Generate cards from 4 random pairs (8 cards total for quick engaging mobile-ready sessions)
    const selectedPairs = [...MEMORY_PAIRS].sort(() => 0.5 - Math.random()).slice(0, 4);
    const cards: CardItem[] = [];

    selectedPairs.forEach((pair) => {
      cards.push({
        cardId: `${pair.pairId}-A`,
        pairId: pair.pairId,
        text: pair.itemA.text,
        subtext: pair.itemA.subtext,
        category: pair.itemA.category,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        cardId: `${pair.pairId}-B`,
        pairId: pair.pairId,
        text: pair.itemB.text,
        subtext: pair.itemB.subtext,
        category: pair.itemB.category,
        isFlipped: false,
        isMatched: false
      });
    });

    setMemoryCards(cards.sort(() => 0.5 - Math.random()));
    setSelectedCards([]);
    setMemoryMoves(0);
    setMemoryMatchesCount(0);
    setMemoryFinished(false);
  };

  useEffect(() => {
    if (activeTab === 'memoria' && memoryCards.length === 0) {
      initMemoryGame();
    }
  }, [activeTab]);

  const handleCardClick = (clickedCard: CardItem) => {
    if (clickedCard.isFlipped || clickedCard.isMatched || selectedCards.length === 2) return;

    // Flip card
    const updatedCards = memoryCards.map((c) =>
      c.cardId === clickedCard.cardId ? { ...c, isFlipped: true } : c
    );
    setMemoryCards(updatedCards);

    const newSelected = [...selectedCards, clickedCard];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMemoryMoves((prev) => prev + 1);
      const [first, second] = newSelected;
      if (first.pairId === second.pairId) {
        // MATCH!
        audioService.playSuccess();
        setTimeout(() => {
          setMemoryCards((prevCards) =>
            prevCards.map((c) =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          const nextMatches = memoryMatchesCount + 1;
          setMemoryMatchesCount(nextMatches);
          if (nextMatches >= 4) {
            setMemoryFinished(true);
            setTimeout(() => {
              triggerReward(
                280,
                80,
                '¡Memoria Diagnóstica Perfecta!',
                'Has emparejado todos los biomarcadores con sus dianas clínicas. ¡+280 € Presupuesto de Guardia 💰 y +80 XP conseguidos!'
              );
            }, 100);
          }
        }, 500);
      } else {
        // NO MATCH -> flip back
        audioService.playError();
        setTimeout(() => {
          setMemoryCards((prevCards) =>
            prevCards.map((c) =>
              c.cardId === first.cardId || c.cardId === second.cardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setSelectedCards([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* CELEBRATION TOAST / REWARD BANNER */}
      <AnimatePresence>
        {celebrationToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-950 text-white border border-emerald-500/50 shadow-xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Coins className="w-6 h-6 text-amber-400 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    {celebrationToast.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    +{celebrationToast.budgetGained} € Dinero 💰
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                    +{celebrationToast.xpGained} XP
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 font-medium leading-relaxed">
                  {celebrationToast.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('casos')}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer transition-all"
            >
              <span>Ir al Hospital</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER: CLINICAL RECOVERY STATION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Zona Lúdica del Parque Biomédico
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Kiosco de Financiación de Guardia
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Minijuegos & Ganancia de Dinero</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-200">
                +Fondos Sanitarios 💰 & XP
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Supera pequeños retos bioquímicos para ganar más dinero y fondos hospitalarios (<strong className="text-slate-900 font-mono">presupuesto de guardia</strong>) y sumar puntos extra (<strong className="text-slate-900 font-mono">XP</strong>) a tu expediente facultativo.
            </p>
          </div>

          {/* STATUS CARDS: BUDGET & XP */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Budget status card */}
            <div className={`p-3.5 rounded-xl border flex-1 lg:flex-initial flex items-center gap-3 transition-all ${
              userProgress.budget < 1000 
                ? 'bg-rose-50 border-rose-200 ring-2 ring-rose-500/10' 
                : 'bg-amber-50/70 border-amber-200'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-2xs">
                <Coins className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Fondos Hospitalarios
                </span>
                <span className={`text-xs font-black font-mono ${userProgress.budget < 1000 ? 'text-rose-700' : 'text-slate-900'}`}>
                  {userProgress.budget.toLocaleString('es-ES')} € Disponibles
                </span>
              </div>
            </div>

            {/* Total XP Score card */}
            <div className="p-3.5 rounded-xl bg-slate-950 text-white border border-slate-800 flex-1 lg:flex-initial flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                XP
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Puntos Totales
                </span>
                <span className="text-xs font-extrabold text-emerald-400 font-mono">
                  {userProgress.xp || userProgress.score} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BUDGET NOTICE BANNER */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Coins className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                ¡Gana más dinero jugando en el Parque! Cada minijuego superado añade entre <strong className="text-emerald-950 font-bold">+250 € y +300 € de Fondos de Presupuesto (💰)</strong> para financiar las analíticas de los pacientes en el hospital.
              </span>
            </span>
          </div>

          <button
            onClick={() => onNavigate('casos')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Volver al Hospital / Casos</span>
          </button>
        </div>
      </div>

      {/* MINIGAME TABS NAVIGATION: 6 MINIGAMES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* Tab 1: PASAPALABRA */}
        <button
          onClick={() => setActiveTab('rosco')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'rosco'
              ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
              ⭕
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              +300 € • +250 XP
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1">
            <span>1. Pasapalabra</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-100 text-amber-900 font-extrabold uppercase">
              ¡Top!
            </span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Rosco de 25 letras clínico.
          </p>
          {activeTab === 'rosco' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
          )}
        </button>

        {/* Tab 2: SOPA DE LETRAS (NUEVO) */}
        <button
          onClick={() => setActiveTab('sopa')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'sopa'
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              🔍
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              +300 € • +120 XP
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1">
            <span>2. Sopa de Letras</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 font-extrabold uppercase">
              ¡Nuevo!
            </span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Matriz 12x12 de biomarcadores.
          </p>
          {activeTab === 'sopa' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600" />
          )}
        </button>

        {/* Tab 3: CRUCIGRAMA (NUEVO) */}
        <button
          onClick={() => setActiveTab('crucigrama')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'crucigrama'
              ? 'bg-white border-teal-600 ring-2 ring-teal-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              🧩
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              +300 € • +150 XP
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1">
            <span>3. Crucigrama</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-teal-100 text-teal-800 font-extrabold uppercase">
              ¡Nuevo!
            </span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            8 definiciones cruzadas reales.
          </p>
          {activeTab === 'crucigrama' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600" />
          )}
        </button>

        {/* Tab 4: PREGUNTAS (REANIMADOR) */}
        <button
          onClick={() => setActiveTab('trivia')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'trivia'
              ? 'bg-white border-rose-500 ring-2 ring-rose-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              ⚡
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              +260 € • +80 XP
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900">4. Reanimador</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Preguntas rápidas de urgencias.
          </p>
          {activeTab === 'trivia' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-600" />
          )}
        </button>

        {/* Tab 5: PAREJAS (MEMORIA CLÍNICA) */}
        <button
          onClick={() => setActiveTab('memoria')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'memoria'
              ? 'bg-white border-blue-500 ring-2 ring-blue-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              🧬
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              +280 € • +80 XP
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900">5. Parejas Clínicas</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Empareja dianas y patologías.
          </p>
          {activeTab === 'memoria' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
          )}
        </button>

        {/* Tab 6: CLASIFICADOR FLASH */}
        <button
          onClick={() => setActiveTab('clasificador')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'clasificador'
              ? 'bg-white border-purple-600 ring-2 ring-purple-500/20 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              ⏱️
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              +300 € • +100 XP
            </span>
          </div>
          <h3 className="font-bold text-xs text-slate-900">6. Clasificador (30s)</h3>
          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
            Triage analítico contrarreloj.
          </p>
          {activeTab === 'clasificador' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* 0. EL ROSCO METABÓLICO (PASAPALABRA) */}
      {/* ========================================================= */}
      {activeTab === 'rosco' && (
        <RoscoGame
          currentBudget={userProgress.budget}
          onDeductBudget={onDeductBudget}
          onEarnBudget={onEarnBudget}
          onAddBonusXP={onAddBonusXP}
        />
      )}

      {/* ========================================================= */}
      {/* SOPA DE LETRAS DE BIOMARCADORES */}
      {/* ========================================================= */}
      {activeTab === 'sopa' && (
        <WordSearchGame
          onEarnBudget={onEarnBudget}
          onAddBonusXP={onAddBonusXP}
          onNavigateToHospital={() => onNavigate('casos')}
        />
      )}

      {/* ========================================================= */}
      {/* CRUCIGRAMA DE LABORATORIO CLÍNICO */}
      {/* ========================================================= */}
      {activeTab === 'crucigrama' && (
        <CrosswordGame
          onEarnBudget={onEarnBudget}
          onAddBonusXP={onAddBonusXP}
          onNavigateToHospital={() => onNavigate('casos')}
        />
      )}

      {/* ========================================================= */}
      {/* 1. TRIVIA REANIMADOR */}
      {/* ========================================================= */}
      {activeTab === 'trivia' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                Urgencias Clínicas & Soporte Vital Bioquímico
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Reanimador Bioquímico Flash
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Pregunta {triviaIdx + 1} de {triviaQuestions.length}
              </span>
              <button
                onClick={initTriviaGame}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Reiniciar ronda con nuevas preguntas"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!triviaFinished && triviaQuestions.length > 0 ? (
            <div className="space-y-5">
              {/* Question Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Escenario: {triviaQuestions[triviaIdx].clinicalSystem}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic">
                  "{triviaQuestions[triviaIdx].scenario}"
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-900 pt-1">
                  {triviaQuestions[triviaIdx].question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {triviaQuestions[triviaIdx].options.map((opt, i) => {
                  const isSelected = selectedTriviaOption === i;
                  const isCorrect = i === triviaQuestions[triviaIdx].correctIndex;

                  let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800';
                  if (triviaRevealed) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={triviaRevealed}
                      onClick={() => handleSelectTriviaOption(i)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {triviaRevealed && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {triviaRevealed && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and next button */}
              {triviaRevealed && (
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-emerald-400">💡 Fundamentación Bioquímica:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {triviaQuestions[triviaIdx].explanation}
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleNextTrivia}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{triviaIdx + 1 < triviaQuestions.length ? 'Siguiente Caso' : 'Finalizar Ronda'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                🏆
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                ¡Ronda de Urgencias Finalizada!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Has acertado <strong className="text-slate-900 font-bold">{triviaCorrectCount} de {triviaQuestions.length}</strong> casos clínicos en esta ronda.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={initTriviaGame}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                  <span>Jugar otra Ronda (+Dinero 💰 / XP)</span>
                </button>
                <button
                  onClick={() => onNavigate('casos')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Volver al Hospital con mis Fondos</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CLASIFICADOR FLASH (30s) */}
      {/* ========================================================= */}
      {activeTab === 'clasificador' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                Agilidad & Clasificación Analítica
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Clasificador Flash de Biomarcadores
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-xs text-slate-800">
                <Timer className={`w-4 h-4 ${classifierTimeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
                <span>{classifierTimeLeft}s</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 font-mono font-bold text-xs text-emerald-800">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Racha: {classifierStreak}</span>
              </div>
            </div>
          </div>

          {!classifierActive && !classifierFinished ? (
            <div className="text-center py-10 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl shadow-xs">
                ⏱️
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Reto de Triage Analítico en 30 Segundos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aparecerán biomarcadores clínicos en pantalla. Tu misión como facultativo es asociar cada analítica con su sistema fisiológico correspondiente lo más rápido posible.
              </p>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium text-left">
                🎯 <strong>Objetivo de Fondos:</strong> Acierta al menos 4 biomarcadores antes de que acabe el tiempo para <strong className="text-emerald-950 font-bold">ganar hasta +260 € de Fondos 💰 y puntos extra de XP</strong>.
              </div>
              <button
                onClick={startClassifierGame}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Comenzar Reto de 30 Segundos</span>
              </button>
            </div>
          ) : classifierActive ? (
            <div className="space-y-6">
              {/* Current Biomarker Presentation Card */}
              {classifierQueue[classifierCurrentIdx] && (
                <div className={`p-6 rounded-2xl border text-center transition-all relative overflow-hidden ${
                  classifierLastResult === 'correct'
                    ? 'bg-emerald-50 border-emerald-400'
                    : classifierLastResult === 'wrong'
                    ? 'bg-rose-50 border-rose-400'
                    : 'bg-slate-950 text-white border-slate-800'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    Biomarcador a Clasificar ({classifierCurrentIdx + 1})
                  </span>
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    {classifierQueue[classifierCurrentIdx].name}
                  </h3>
                  <p className="text-sm font-mono text-emerald-300 font-bold mt-1">
                    [{classifierQueue[classifierCurrentIdx].abbreviation}]
                  </p>
                  <p className="text-xs text-slate-300 mt-2 italic">
                    Pista clínica: {classifierQueue[classifierCurrentIdx].hint}
                  </p>
                </div>
              )}

              {/* 5 Systems Clickable Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleClassifyChoice('cardiac')}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:bg-rose-50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-rose-600 font-bold text-xs mb-1">
                    <span>🫀</span>
                    <span>Cardiovascular</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Troponinas, BNP, CK-MB</span>
                </button>

                <button
                  onClick={() => handleClassifyChoice('hepatic')}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-1">
                    <span>🧪</span>
                    <span>Hepato-Biliar</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Transaminasas, GGT, Bilirrubina</span>
                </button>

                <button
                  onClick={() => handleClassifyChoice('pancreatic')}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-cyan-700 font-bold text-xs mb-1">
                    <span>🔬</span>
                    <span>Pancreático</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Lipasa, Amilasa sérica</span>
                </button>

                <button
                  onClick={() => handleClassifyChoice('renal')}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
                    <span>💧</span>
                    <span>Renal / Filtrado</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Creatinina, Cistatina C, Urea</span>
                </button>

                <button
                  onClick={() => handleClassifyChoice('hemostasis')}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-purple-700 font-bold text-xs mb-1">
                    <span>🩸</span>
                    <span>Hemostasia</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Dímero D, TP/INR, Fibrinógeno</span>
                </button>

                <button
                  onClick={() => handleClassifyChoice('metabolic')}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                    <span>⚡</span>
                    <span>Metabólico</span>
                  </div>
                  <span className="text-[11px] text-slate-500">HbA1c, Cuerpos cetónicos</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                {classifierScore >= 4 ? '🎉' : '⏳'}
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                ¡Tiempo Finalizado!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Has clasificado correctamente <strong className="text-slate-900 font-bold">{classifierScore} biomarcadores</strong> en 30 segundos.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={startClassifierGame}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jugar de Nuevo (+Dinero 💰 / XP)</span>
                </button>
                <button
                  onClick={() => onNavigate('casos')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Volver a Casos / Guardia</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. PAREJAS DE DIAGNÓSTICO (MEMORY) */}
      {/* ========================================================= */}
      {activeTab === 'memoria' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                Memoria & Integración Clínica
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Parejas Diagnósticas Bioquímicas
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">
                Movimientos: <strong className="text-slate-900 font-mono">{memoryMoves}</strong>
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Parejas: {memoryMatchesCount}/4
              </span>
              <button
                onClick={initMemoryGame}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Reiniciar tablero"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!memoryFinished ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {memoryCards.map((card) => {
                const isShown = card.isFlipped || card.isMatched;
                return (
                  <button
                    key={card.cardId}
                    disabled={isShown}
                    onClick={() => handleCardClick(card)}
                    className={`h-32 sm:h-36 p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden select-none ${
                      card.isMatched
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold shadow-xs'
                        : isShown
                        ? 'bg-slate-900 border-slate-800 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-400'
                    }`}
                  >
                    {isShown ? (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">
                          {card.category}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-white leading-tight">
                          {card.text}
                        </h4>
                        <p className="text-[10px] text-slate-300 leading-tight">
                          {card.subtext}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <Layers className="w-6 h-6 text-slate-300" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          UGR Bioq
                        </span>
                      </div>
                    )}
                    {card.isMatched && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
                🧬
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                ¡Tablero Diagnóstico Resuelto!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Has emparejado todas las dianas en <strong className="text-slate-900 font-bold">{memoryMoves} intentos</strong>. ¡+280 € Fondos 💰 y +80 XP asignados a tu expediente!
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={initMemoryGame}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Jugar con Nuevas Parejas</span>
                </button>
                <button
                  onClick={() => onNavigate('casos')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>Volver a Casos / Guardia</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
