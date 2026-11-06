import React, { useEffect, useMemo, useState } from 'react';
import { X, Lock, ChevronDown, ChevronRight, Save, KeyRound, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ClinicalCase } from '../../types';
import { SYLLABUS_BLOCKS, topicsLabel } from '../../data/caseBlocks';
import {
  CaseAvailability,
  TeacherSession,
  getCaseBlockId,
  saveCaseAvailability,
  startTeacherSession,
} from '../../lib/caseAvailability';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cases: ClinicalCase[];
  availability: CaseAvailability;
}

type Status = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok'; text: string } | { kind: 'error'; text: string };

function describeError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  if (code.includes('permission-denied')) return 'La clave no es correcta.';
  return 'No se ha podido conectar con Firebase. Comprueba la conexión e inténtalo de nuevo.';
}

export const CaseAvailabilityModal: React.FC<Props> = ({ isOpen, onClose, cases, availability }) => {
  const [keyInput, setKeyInput] = useState('');
  const [teacherKey, setTeacherKey] = useState('');
  const [session, setSession] = useState<TeacherSession | null>(null);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const [activeBlocks, setActiveBlocks] = useState<string[]>([]);
  const [activeCases, setActiveCases] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  // Al abrir, el editor parte de lo que ve ahora mismo el alumnado.
  useEffect(() => {
    if (!isOpen || dirty) return;
    setActiveBlocks(availability.activeBlocks);
    setActiveCases(availability.activeCases);
    setOverrides(availability.blockOverrides);
  }, [isOpen, availability, dirty]);

  const draft: CaseAvailability = useMemo(
    () => ({ configured: true, activeBlocks, activeCases, blockOverrides: overrides }),
    [activeBlocks, activeCases, overrides]
  );

  const casesByBlock = useMemo(() => {
    const map: Record<string, ClinicalCase[]> = {};
    SYLLABUS_BLOCKS.forEach((b) => (map[b.id] = []));
    cases.forEach((c) => map[getCaseBlockId(c.id, draft)]?.push(c));
    return map;
  }, [cases, draft]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setStatus({ kind: 'busy' });
    try {
      const s = await startTeacherSession(keyInput);
      setSession(s);
      setTeacherKey(keyInput);
      setKeyInput('');
      setStatus({ kind: 'idle' });
    } catch (err) {
      setStatus({ kind: 'error', text: describeError(err) });
    }
  };

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const toggleBlock = (id: string) => {
    setActiveBlocks((prev) => toggle(prev, id));
    setDirty(true);
  };

  const toggleCase = (id: string) => {
    setActiveCases((prev) => toggle(prev, id));
    setDirty(true);
  };

  const moveCase = (caseId: string, blockId: string) => {
    setOverrides((prev) => ({ ...prev, [caseId]: blockId }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!session) return;
    setStatus({ kind: 'busy' });
    try {
      await saveCaseAvailability(session, teacherKey, {
        activeBlocks,
        activeCases,
        blockOverrides: overrides,
      });
      setDirty(false);
      setStatus({ kind: 'ok', text: 'Guardado. El alumnado ya ve los cambios.' });
    } catch (err) {
      setStatus({ kind: 'error', text: describeError(err) });
    }
  };

  const openCount = cases.filter((c) => activeCases.includes(c.id) || activeBlocks.includes(getCaseBlockId(c.id, draft))).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Casos disponibles para el alumnado</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Activa un bloque cuando se haya explicado su temario, o abre casos sueltos antes de tiempo.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" aria-label="Cerrar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!session ? (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <label htmlFor="teacher-key" className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <KeyRound className="w-4 h-4 text-amber-700" />
              Clave del profesorado
            </label>
            <input
              id="teacher-key"
              type="password"
              autoComplete="off"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Escribe la clave"
            />
            {status.kind === 'error' && (
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {status.text}
              </p>
            )}
            <button
              type="submit"
              disabled={status.kind === 'busy'}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-60"
            >
              {status.kind === 'busy' ? 'Comprobando…' : 'Entrar'}
            </button>
          </form>
        ) : (
          <>
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
              <span>
                <strong className="text-slate-900">{openCount}</strong> de {cases.length} casos abiertos
              </span>
              {!availability.configured && (
                <span className="text-amber-800">Aún no se ha guardado ninguna configuración: ahora mismo están todos abiertos.</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {SYLLABUS_BLOCKS.map((block) => {
                const blockCases = casesByBlock[block.id] ?? [];
                const blockActive = activeBlocks.includes(block.id);
                const isExpanded = expanded === block.id;
                return (
                  <div key={block.id}>
                    <div className="flex items-center gap-3 px-5 py-3">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : block.id)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500"
                        aria-label={isExpanded ? 'Ocultar casos' : 'Ver casos'}
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900">
                          Bloque {block.number}. {block.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {topicsLabel(block)} · {blockCases.length} {blockCases.length === 1 ? 'caso' : 'casos'}
                        </p>
                      </div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          id={`block-${block.id}`}
                          type="checkbox"
                          checked={blockActive}
                          onChange={() => toggleBlock(block.id)}
                          className="w-4 h-4 accent-emerald-700"
                        />
                        {blockActive ? 'Activo' : 'Cerrado'}
                      </label>
                    </div>

                    {isExpanded && (
                      <ul className="pb-3 px-5 pl-14 space-y-2">
                        {blockCases.length === 0 && <li className="text-xs text-slate-400">Sin casos en este bloque.</li>}
                        {blockCases.map((c) => {
                          const open = blockActive || activeCases.includes(c.id);
                          return (
                            <li key={c.id} className="flex flex-wrap items-center gap-2 text-xs">
                              <label className="flex items-center gap-2 flex-1 min-w-[12rem] cursor-pointer">
                                <input
                                  id={`case-${c.id}`}
                                  type="checkbox"
                                  checked={open}
                                  disabled={blockActive}
                                  onChange={() => toggleCase(c.id)}
                                  className="w-4 h-4 accent-emerald-700"
                                />
                                <span className={open ? 'text-slate-800' : 'text-slate-400'}>
                                  {!open && <Lock className="inline w-3 h-3 mr-1 -mt-0.5" />}
                                  {c.title}
                                </span>
                              </label>
                              <select
                                id={`move-${c.id}`}
                                value={getCaseBlockId(c.id, draft)}
                                onChange={(e) => moveCase(c.id, e.target.value)}
                                className="px-2 py-1 border border-slate-200 rounded-md bg-white text-slate-700"
                                aria-label="Mover a otro bloque"
                              >
                                {SYLLABUS_BLOCKS.map((b) => (
                                  <option key={b.id} value={b.id}>
                                    Bloque {b.number}
                                  </option>
                                ))}
                              </select>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs min-h-[1rem]">
                {status.kind === 'ok' && (
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {status.text}
                  </span>
                )}
                {status.kind === 'error' && (
                  <span className="text-red-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> {status.text}
                  </span>
                )}
                {status.kind !== 'ok' && status.kind !== 'error' && dirty && (
                  <span className="text-amber-800">Hay cambios sin guardar.</span>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={status.kind === 'busy' || !dirty}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {status.kind === 'busy' ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CaseAvailabilityModal;
