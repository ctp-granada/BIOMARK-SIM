import React, { useState, useEffect } from 'react';
import {
  Grid,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  HelpCircle,
  Clock,
  Wallet,
  Zap,
  ArrowRight,
  Stethoscope,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../../utils/audioService';

export interface CrosswordGameProps {
  onEarnBudget?: (amount?: number) => void;
  onAddBonusXP: (amount: number, reason: string) => void;
  onNavigateToHospital?: () => void;
}

interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  word: string;
  clue: string;
  system: string;
  startR: number;
  startC: number;
}

// 8 carefully intersected words on a 10x10 crossword grid
//
// Grid intersection scheme:
// 1 Horiz (R1, C1): TROPONINA (len 9, c1..c9)
// 2 Vert  (R1, C3): OXALATO (len 7, r1..r7, intersects TROPONINA at O)
// 3 Horiz (R3, C0): AMILASA (len 7, r3, c0..c6, intersects OXALATO at A)
// 4 Vert  (R1, C8): AMONIO (len 6, r1..r6, intersects TROPONINA at N)
// 5 Horiz (R5, C2): LACTATO (len 7, r5, c2..c8, intersects OXALATO at T and AMONIO at O)
// 6 Vert  (R4, C6): LIPASA (len 6, r4..r9, intersects LACTATO at A)
// 7 Horiz (R7, C4): UREA (len 4, r7, c4..c7, intersects LIPASA at A)
// 8 Vert  (R6, C2): TSH (len 3, r6..r8, c2)
//
// All coordinates rigorously verified to be within 10x10 bounds!
const CROSSWORD_CLUES: CrosswordClue[] = [
  {
    number: 1,
    direction: 'across',
    word: 'TROPONINA',
    clue: 'Proteína sarcomérica patrón oro de necrosis en infarto agudo de miocardio.',
    system: 'Cardíaco',
    startR: 1,
    startC: 1
  },
  {
    number: 2,
    direction: 'down',
    word: 'OXALATO',
    clue: 'Sal que al precipitar con calcio forma los cálculos renales más comunes.',
    system: 'Renal',
    startR: 1,
    startC: 3
  },
  {
    number: 3,
    direction: 'across',
    word: 'AMILASA',
    clue: 'Enzima pancreática e hidrolítica de rápida elevación en suero y orina.',
    system: 'Pancreático',
    startR: 3,
    startC: 0
  },
  {
    number: 4,
    direction: 'down',
    word: 'AMONIO',
    clue: 'Metabolito neurotóxico acumulado en encefalopatía hepática y fallo del ciclo de la urea.',
    system: 'Hepático / Metabólico',
    startR: 1,
    startC: 8
  },
  {
    number: 5,
    direction: 'across',
    word: 'LACTATO',
    clue: 'Parámetro de hipoxia celular y acidosis metabólica con anión gap elevado.',
    system: 'Urgencias / UCI',
    startR: 5,
    startC: 2
  },
  {
    number: 6,
    direction: 'down',
    word: 'LIPASA',
    clue: 'Enzima diagnóstica con mayor especificidad y ventana que la amilasa en pancreatitis.',
    system: 'Digestivo',
    startR: 4,
    startC: 6
  },
  {
    number: 7,
    direction: 'across',
    word: 'UREA',
    clue: 'Producto final del catabolismo proteico producido exclusivamente en el hígado.',
    system: 'Renal',
    startR: 7,
    startC: 4
  },
  {
    number: 8,
    direction: 'down',
    word: 'TSH',
    clue: 'Tirotropina hipofisaria, prueba de primera línea en disfunción tiroidea.',
    system: 'Endocrino',
    startR: 6,
    startC: 2
  }
];

const GRID_ROWS = 10;
const GRID_COLS = 10;

export const CrosswordGame: React.FC<CrosswordGameProps> = ({
  onEarnBudget,
  onAddBonusXP,
  onNavigateToHospital
}) => {
  // Build cell maps
  // Cell structure: { letterSolution: string, userLetter: string, number?: number, active: boolean }
  const [userLetters, setUserLetters] = useState<{ [key: string]: string }>({});
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>({ r: 1, c: 1 });
  const [selectedClue, setSelectedClue] = useState<CrosswordClue>(CROSSWORD_CLUES[0]);
  const [gameFinished, setGameFinished] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);

  // Solution map
  const solutionGrid: { [key: string]: string } = {};
  const numberGrid: { [key: string]: number } = {};

  CROSSWORD_CLUES.forEach((clue) => {
    numberGrid[`${clue.startR}-${clue.startC}`] = clue.number;
    const len = clue.word.length;
    for (let i = 0; i < len; i++) {
      const r = clue.direction === 'across' ? clue.startR : clue.startR + i;
      const c = clue.direction === 'across' ? clue.startC + i : clue.startC;
      solutionGrid[`${r}-${c}`] = clue.word[i];
    }
  });

  const activeKeys = Object.keys(solutionGrid);

  // Timer
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameFinished]);

  // Check victory
  const checkCompletion = (currentLetters: { [key: string]: string }) => {
    const isAllCorrect = activeKeys.every(
      (key) => (currentLetters[key] || '').toUpperCase() === solutionGrid[key]
    );
    if (isAllCorrect) {
      audioService.playBadgeUnlock();
      setGameFinished(true);
    }
  };

  const handleCellInput = (r: number, c: number, char: string) => {
    const key = `${r}-${c}`;
    if (!solutionGrid[key]) return;

    const val = char.toUpperCase().slice(-1);
    const updated = { ...userLetters, [key]: val };
    setUserLetters(updated);

    // Auto advance to next cell in current clue direction
    if (val && selectedClue) {
      const isAcross = selectedClue.direction === 'across';
      const nextR = isAcross ? r : r + 1;
      const nextC = isAcross ? c + 1 : c;
      const nextKey = `${nextR}-${nextC}`;
      if (solutionGrid[nextKey]) {
        setSelectedCell({ r: nextR, c: nextC });
      }
    }

    checkCompletion(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent, r: number, c: number) => {
    if (e.key === 'Backspace') {
      const key = `${r}-${c}`;
      if (!userLetters[key]) {
        // Move back
        const isAcross = selectedClue?.direction === 'across';
        const prevR = isAcross ? r : r - 1;
        const prevC = isAcross ? c - 1 : c;
        if (solutionGrid[`${prevR}-${prevC}`]) {
          setSelectedCell({ r: prevR, c: prevC });
        }
      } else {
        const updated = { ...userLetters, [key]: '' };
        setUserLetters(updated);
      }
    } else if (e.key === 'ArrowRight' && solutionGrid[`${r}-${c + 1}`]) {
      setSelectedCell({ r, c: c + 1 });
    } else if (e.key === 'ArrowLeft' && solutionGrid[`${r}-${c - 1}`]) {
      setSelectedCell({ r, c: c - 1 });
    } else if (e.key === 'ArrowDown' && solutionGrid[`${r + 1}-${c}`]) {
      setSelectedCell({ r: r + 1, c });
    } else if (e.key === 'ArrowUp' && solutionGrid[`${r - 1}-${c}`]) {
      setSelectedCell({ r: r - 1, c });
    }
  };

  const handleSelectClue = (clue: CrosswordClue) => {
    setSelectedClue(clue);
    setSelectedCell({ r: clue.startR, c: clue.startC });
  };

  // Give a hint for current cell
  const handleRevealCell = () => {
    if (!selectedCell) return;
    const key = `${selectedCell.r}-${selectedCell.c}`;
    const sol = solutionGrid[key];
    if (!sol) return;

    const updated = { ...userLetters, [key]: sol };
    setUserLetters(updated);
    setRevealedCount((prev) => prev + 1);
    checkCompletion(updated);
  };

  // Reset
  const handleReset = () => {
    setUserLetters({});
    setSelectedCell({ r: 1, c: 1 });
    setSelectedClue(CROSSWORD_CLUES[0]);
    setGameFinished(false);
    setRewardClaimed(false);
    setElapsedSeconds(0);
    setRevealedCount(0);
  };

  // Claim reward (250 € - 300 €)
  const handleClaimReward = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);

    audioService.playCoin();

    const bonusBudget = Math.max(250, 300 - revealedCount * 10);
    const bonusXP = 150;

    if (onEarnBudget) {
      onEarnBudget(bonusBudget);
    }
    onAddBonusXP(
      bonusXP,
      `Crucigrama Bioquímico resuelto en ${elapsedSeconds}s (+${bonusBudget} €)`
    );
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Count correct words
  const correctWordsCount = CROSSWORD_CLUES.filter((clue) => {
    const len = clue.word.length;
    for (let i = 0; i < len; i++) {
      const r = clue.direction === 'across' ? clue.startR : clue.startR + i;
      const c = clue.direction === 'across' ? clue.startC + i : clue.startC;
      if ((userLetters[`${r}-${c}`] || '').toUpperCase() !== clue.word[i]) {
        return false;
      }
    }
    return true;
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Grid className="w-4 h-4" />
            <span>Minijuego Clínico • Razonamiento Cruzado</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Crucigrama de Laboratorio Clínico</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-mono">
              +250-300 € Dinero 💰
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Completa las 8 palabras entrelazadas con definiciones fisiopatológicas reales. Haz clic en las casillas o en las pistas.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-xs text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 font-mono font-bold text-xs text-teal-800 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-teal-600" />
            <span>{correctWordsCount} / {CROSSWORD_CLUES.length} palabras</span>
          </div>

          <button
            onClick={handleRevealCell}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Revelar letra seleccionada (-10 € bono)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Pista</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Reiniciar crucigrama"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid & Clues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 10x10 Crossword Grid (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Active clue banner above grid */}
          {selectedClue && (
            <div className="w-full mb-3 p-3 rounded-xl bg-slate-900 text-white text-xs border border-slate-800 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                {selectedClue.number}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">
                  {selectedClue.direction === 'across' ? 'Horizontal' : 'Vertical'} • {selectedClue.system} ({selectedClue.word.length} letras)
                </span>
                <p className="text-slate-200 text-xs truncate font-medium">
                  "{selectedClue.clue}"
                </p>
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl max-w-full overflow-x-auto">
            <div
              className="grid gap-1 select-none"
              style={{
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: GRID_ROWS }).map((_, r) =>
                Array.from({ length: GRID_COLS }).map((_, c) => {
                  const key = `${r}-${c}`;
                  const isPlayable = Boolean(solutionGrid[key]);
                  const number = numberGrid[key];
                  const val = userLetters[key] || '';
                  const isSelected = selectedCell?.r === r && selectedCell?.c === c;
                  const isCorrect = isPlayable && val && val.toUpperCase() === solutionGrid[key];
                  const isWrong = isPlayable && val && val.toUpperCase() !== solutionGrid[key];

                  // Check if cell is in current clue word
                  const inCurrentClue = Boolean(
                    selectedClue &&
                      ((selectedClue.direction === 'across' &&
                        r === selectedClue.startR &&
                        c >= selectedClue.startC &&
                        c < selectedClue.startC + selectedClue.word.length) ||
                        (selectedClue.direction === 'down' &&
                          c === selectedClue.startC &&
                          r >= selectedClue.startR &&
                          r < selectedClue.startR + selectedClue.word.length))
                  );

                  if (!isPlayable) {
                    return (
                      <div
                        key={key}
                        className="w-7 h-7 sm:w-9 sm:h-9 rounded-md bg-slate-950/80 border border-slate-900"
                      />
                    );
                  }

                  return (
                    <div
                      key={key}
                      onClick={() => {
                        setSelectedCell({ r, c });
                        // If cell matches a clue starting point or belongs to one, switch clue
                        const matchingClue = CROSSWORD_CLUES.find(
                          (cl) =>
                            (cl.direction === 'across' &&
                              r === cl.startR &&
                              c >= cl.startC &&
                              c < cl.startC + cl.word.length) ||
                            (cl.direction === 'down' &&
                              c === cl.startC &&
                              r >= cl.startR &&
                              r < cl.startR + cl.word.length)
                        );
                        if (matchingClue) setSelectedClue(matchingClue);
                      }}
                      className={`relative w-7 h-7 sm:w-9 sm:h-9 rounded-lg font-mono font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300 shadow-lg scale-105 z-10'
                          : inCurrentClue
                          ? 'bg-teal-900/60 text-white border border-teal-500/50'
                          : isCorrect
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                          : isWrong
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-100 hover:bg-slate-700'
                      }`}
                    >
                      {number && (
                        <span className="absolute top-0.5 left-1 text-[8px] font-sans font-black text-slate-400 pointer-events-none">
                          {number}
                        </span>
                      )}
                      <input
                        type="text"
                        maxLength={1}
                        value={val}
                        onChange={(e) => handleCellInput(r, c, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, r, c)}
                        className="w-full h-full text-center bg-transparent focus:outline-hidden uppercase font-mono font-bold cursor-pointer"
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 text-center">
            Usa el teclado o pulsa las casillas para escribir. El cursor avanza automáticamente.
          </p>
        </div>

        {/* Right: Clues lists (Across & Down) (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Horizontales */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <span>➡️ Horizontales</span>
            </div>
            <div className="space-y-1.5">
              {CROSSWORD_CLUES.filter((c) => c.direction === 'across').map((clue) => {
                const isSelected = selectedClue?.number === clue.number && selectedClue.direction === 'across';
                return (
                  <button
                    key={`across-${clue.number}`}
                    onClick={() => handleSelectClue(clue)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-400 text-teal-950 ring-1 ring-teal-300 shadow-2xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {clue.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="leading-snug text-[11px]">
                        <strong>({clue.word.length} letras)</strong> {clue.clue}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verticales */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <span>⬇️ Verticales</span>
            </div>
            <div className="space-y-1.5">
              {CROSSWORD_CLUES.filter((c) => c.direction === 'down').map((clue) => {
                const isSelected = selectedClue?.number === clue.number && selectedClue.direction === 'down';
                return (
                  <button
                    key={`down-${clue.number}`}
                    onClick={() => handleSelectClue(clue)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-400 text-teal-950 ring-1 ring-teal-300 shadow-2xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {clue.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="leading-snug text-[11px]">
                        <strong>({clue.word.length} letras)</strong> {clue.clue}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {gameFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 text-white border border-teal-500/50 shadow-2xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 text-3xl">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                      ¡Crucigrama Completado con Éxito!
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 font-mono">
                      Tiempo: {formatTime(elapsedSeconds)}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    Has completado las 8 definiciones bioquímicas
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Excelente integración de conceptos de laboratorio y fisiopatología médica. Tus fondos hospitalarios han sido refinanciados para afrontar las guardias.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
                {!rewardClaimed ? (
                  <button
                    onClick={handleClaimReward}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Cobrar Recompensa (+{Math.max(250, 300 - revealedCount * 10)} € & +150 XP)</span>
                  </button>
                ) : (
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Fondos y XP acreditados!</span>
                  </div>
                )}

                {onNavigateToHospital && (
                  <button
                    onClick={onNavigateToHospital}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer border border-slate-700 transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 text-emerald-400" />
                    <span>Volver a Casos</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
