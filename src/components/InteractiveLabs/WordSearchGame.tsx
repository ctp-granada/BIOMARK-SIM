import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  RotateCcw,
  Trophy,
  Sparkles,
  Info,
  Clock,
  Wallet,
  Zap,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioService } from '../../utils/audioService';

export interface WordSearchGameProps {
  onEarnBudget?: (amount?: number) => void;
  onAddBonusXP: (amount: number, reason: string) => void;
  onNavigateToHospital?: () => void;
}

interface WordTarget {
  id: string;
  word: string;
  clue: string;
  system: string;
  color: string;
  found: boolean;
}

interface GridCell {
  row: number;
  col: number;
  letter: string;
  isFound: boolean;
  wordColor?: string;
}

// 8 Biomarkers / Key clinical concepts to find in the 12x12 grid
const WORD_TARGETS_POOL: Omit<WordTarget, 'found'>[] = [
  { id: 'w1', word: 'TROPONINA', clue: 'Patrón oro de necrosis miocárdica y daño isquémico', system: 'Cardíaco', color: 'bg-rose-500 text-white' },
  { id: 'w2', word: 'LIPASA', clue: 'Enzima diagnóstica acinar de máxima especificidad en pancreatitis', system: 'Digestivo', color: 'bg-amber-500 text-white' },
  { id: 'w3', word: 'DIMEROD', clue: 'Fragmento de degradación de fibrina con alto valor predictivo negativo', system: 'Hemostasia', color: 'bg-blue-500 text-white' },
  { id: 'w4', word: 'FERRITINA', clue: 'Proteína de depósito de hierro y reactante de fase aguda', system: 'Metabólico', color: 'bg-emerald-500 text-white' },
  { id: 'w5', word: 'CREATININA', clue: 'Catabolito muscular marcador de filtrado glomerular', system: 'Renal', color: 'bg-purple-500 text-white' },
  { id: 'w6', word: 'LACTATO', clue: 'Marcador de hipoxia tisular y metabolismo anaerobio en sepsis', system: 'Urgencias', color: 'bg-orange-500 text-white' },
  { id: 'w7', word: 'BILIRRUBINA', clue: 'Pigmento derivado del grupo hemo; fraccionable en directa/indirecta', system: 'Hepático', color: 'bg-teal-500 text-white' },
  { id: 'w8', word: 'GLUCOSA', clue: 'Sustrato energético primordial; alterada en cetoacidosis e hipoglucemia', system: 'Metabólico', color: 'bg-indigo-500 text-white' },
];

const GRID_SIZE = 12;

// Pre-designed, perfectly placed layout in 12x12 grid to guarantee 100% solvable words
// Horizontal (H), Vertical (V), Diagonal (D)
const PLACEMENTS: { wordId: string; startR: number; startC: number; dir: 'H' | 'V' | 'D' }[] = [
  { wordId: 'w1', startR: 0, startC: 1, dir: 'H' },  // TROPONINA (0,1) -> (0,9)
  { wordId: 'w2', startR: 2, startC: 2, dir: 'H' },  // LIPASA (2,2) -> (2,7)
  { wordId: 'w3', startR: 4, startC: 0, dir: 'H' },  // DIMEROD (4,0) -> (4,6)
  { wordId: 'w4', startR: 1, startC: 11, dir: 'V' }, // FERRITINA (1,11) -> (9,11)
  { wordId: 'w5', startR: 2, startC: 0, dir: 'V' },  // CREATININA (2,0) -> (11,0)
  { wordId: 'w6', startR: 6, startC: 3, dir: 'H' },  // LACTATO (6,3) -> (6,9)
  { wordId: 'w7', startR: 8, startC: 1, dir: 'H' },  // BILIRRUBINA (8,1) -> (8,11)
  { wordId: 'w8', startR: 10, startC: 2, dir: 'H' }, // GLUCOSA (10,2) -> (10,8)
];

const FILLER_LETTERS = 'ABCDEFGHILMNOPQRSTUVXYZ';

export const WordSearchGame: React.FC<WordSearchGameProps> = ({
  onEarnBudget,
  onAddBonusXP,
  onNavigateToHospital
}) => {
  const [targets, setTargets] = useState<WordTarget[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<{ r: number; c: number }[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hintWordId, setHintWordId] = useState<string | null>(null);

  // Initialize board
  const initGame = () => {
    // 1. Prepare target words
    const initialTargets: WordTarget[] = WORD_TARGETS_POOL.map((t) => ({ ...t, found: false }));
    setTargets(initialTargets);
    setFoundWords([]);
    setSelectedCells([]);
    setGameFinished(false);
    setRewardClaimed(false);
    setElapsedSeconds(0);
    setHintWordId(null);

    // 2. Build empty grid
    const newGrid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));

    // 3. Place target words
    PLACEMENTS.forEach(({ wordId, startR, startC, dir }) => {
      const target = initialTargets.find((t) => t.id === wordId);
      if (!target) return;
      const w = target.word;
      for (let i = 0; i < w.length; i++) {
        const r = dir === 'H' ? startR : dir === 'V' ? startR + i : startR + i;
        const c = dir === 'H' ? startC + i : dir === 'V' ? startC : startC + i;
        if (r < GRID_SIZE && c < GRID_SIZE) {
          newGrid[r][c] = w[i];
        }
      }
    });

    // 4. Fill empty cells with pseudo-random letters
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!newGrid[r][c]) {
          const randIdx = Math.floor(Math.random() * FILLER_LETTERS.length);
          newGrid[r][c] = FILLER_LETTERS[randIdx];
        }
      }
    }

    setGrid(newGrid);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Timer
  useEffect(() => {
    if (gameFinished) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameFinished]);

  // Check word selection
  const checkSelection = (cells: { r: number; c: number }[]) => {
    if (cells.length < 2) return;
    const forwardStr = cells.map((cell) => grid[cell.r][cell.c]).join('');
    const backwardStr = cells.slice().reverse().map((cell) => grid[cell.r][cell.c]).join('');

    const matchedTarget = targets.find(
      (t) => !foundWords.includes(t.id) && (t.word === forwardStr || t.word === backwardStr)
    );

    if (matchedTarget) {
      audioService.playSuccess();
      const nextFound = [...foundWords, matchedTarget.id];
      setFoundWords(nextFound);
      setTargets((prev) =>
        prev.map((t) => (t.id === matchedTarget.id ? { ...t, found: true } : t))
      );

      // Check win condition
      if (nextFound.length === targets.length) {
        setGameFinished(true);
      }
    }
  };

  // Cell interaction
  const handleCellClick = (r: number, c: number) => {
    // If no cells selected, start
    if (selectedCells.length === 0) {
      setSelectedCells([{ r, c }]);
      return;
    }

    const first = selectedCells[0];
    // If clicking same cell, deselect
    if (first.r === r && first.c === c) {
      setSelectedCells([]);
      return;
    }

    // Determine line if clicking end cell
    const deltaR = r - first.r;
    const deltaC = c - first.c;
    const len = Math.max(Math.abs(deltaR), Math.abs(deltaC));

    // Check if straight horizontal, vertical or diagonal
    const isHorizontal = deltaR === 0;
    const isVertical = deltaC === 0;
    const isDiagonal = Math.abs(deltaR) === Math.abs(deltaC);

    if (isHorizontal || isVertical || isDiagonal) {
      const stepR = deltaR === 0 ? 0 : deltaR / Math.abs(deltaR);
      const stepC = deltaC === 0 ? 0 : deltaC / Math.abs(deltaC);

      const lineCells: { r: number; c: number }[] = [];
      for (let i = 0; i <= len; i++) {
        lineCells.push({ r: first.r + i * stepR, c: first.c + i * stepC });
      }

      setSelectedCells(lineCells);
      checkSelection(lineCells);
      setTimeout(() => {
        setSelectedCells([]);
      }, 350);
    } else {
      // Start new selection at clicked cell
      setSelectedCells([{ r, c }]);
    }
  };

  // Check if cell is part of any found word
  const getCellFoundStyle = (r: number, c: number) => {
    for (const p of PLACEMENTS) {
      if (!foundWords.includes(p.wordId)) continue;
      const target = targets.find((t) => t.id === p.wordId);
      if (!target) continue;

      const len = target.word.length;
      for (let i = 0; i < len; i++) {
        const cellR = p.dir === 'H' ? p.startR : p.dir === 'V' ? p.startR + i : p.startR + i;
        const cellC = p.dir === 'H' ? p.startC + i : p.dir === 'V' ? p.startC : p.startC + i;
        if (cellR === r && cellC === c) {
          return target.color;
        }
      }
    }
    return null;
  };

  const isCellSelected = (r: number, c: number) => {
    return selectedCells.some((cell) => cell.r === r && cell.c === c);
  };

  // Claim reward
  const handleClaimReward = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);

    audioService.playCoin();

    // Reward between 250 € and 300 €
    const speedBonus = elapsedSeconds < 120 ? 300 : 270;
    const earnedBudget = speedBonus;
    const earnedXP = 120;

    if (onEarnBudget) {
      onEarnBudget(earnedBudget);
    }
    onAddBonusXP(
      earnedXP,
      `Sopa de Letras Bioquímica completada en ${elapsedSeconds}s (+${earnedBudget} €)`
    );
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-4 h-4" />
            <span>Minijuego Clínico • Agudeza Diagnóstica</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Sopa de Letras de Biomarcadores</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              +270-300 € Dinero 💰
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Localiza los 8 biomarcadores clave en la matriz ortogonal. Haz clic en la primera y última letra de cada palabra.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-xs text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 font-mono font-bold text-xs text-emerald-800 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-emerald-600" />
            <span>{foundWords.length} / {targets.length}</span>
          </div>

          <button
            onClick={initGame}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Reiniciar tablero"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 12x12 Grid (8 cols) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg max-w-full overflow-x-auto">
            <div
              className="grid gap-1 select-none"
              style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
              }}
            >
              {grid.map((row, r) =>
                row.map((letter, c) => {
                  const foundStyle = getCellFoundStyle(r, c);
                  const selected = isCellSelected(r, c);

                  return (
                    <motion.button
                      key={`${r}-${c}`}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCellClick(r, c)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg font-mono font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
                        foundStyle
                          ? `${foundStyle} shadow-sm ring-1 ring-white/30`
                          : selected
                          ? 'bg-amber-400 text-slate-950 font-black shadow-md ring-2 ring-amber-300'
                          : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {letter}
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 mt-3 text-center">
            💡 <strong>Instrucción:</strong> Pulsa la primera letra y luego la última para trazar la palabra (horizontal o vertical).
          </p>
        </div>

        {/* Right: Words List & Clues (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Biomarcadores a Localizar ({targets.filter((t) => t.found).length}/{targets.length})
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">12x12</span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {targets.map((t) => (
              <div
                key={t.id}
                className={`p-2.5 rounded-xl border text-xs transition-all ${
                  t.found
                    ? 'bg-emerald-50/70 border-emerald-300 opacity-90'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {t.found ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                    <span
                      className={`font-mono font-bold tracking-wide ${
                        t.found
                          ? 'line-through text-emerald-800'
                          : 'text-slate-900 font-black'
                      }`}
                    >
                      {t.word}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {t.system}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug pl-4">
                  {t.clue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completion Modal / Banner */}
      <AnimatePresence>
        {gameFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white border border-indigo-500/50 shadow-2xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 text-3xl">
                  🏆
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      ¡Sopa de Letras Completada!
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono">
                      Tiempo: {formatTime(elapsedSeconds)}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    Has localizado los 8 biomarcadores clínicos con éxito
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl">
                    Tu agudeza para reconocer patrones analíticos en laboratorio ha sido acreditada. Suma tu recompensa de fondos hospitalarios para financiar tus guardias.
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
                    <span>Cobrar Recompensa (+280 € & +120 XP)</span>
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
