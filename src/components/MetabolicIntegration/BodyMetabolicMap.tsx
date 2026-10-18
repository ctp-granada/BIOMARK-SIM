import React, { useLayoutEffect, useRef, useState } from 'react';
import { MetabolicStateId, OrganId } from './types/metabolism';
import { METABOLIC_STATES } from './data/metabolicData';

import { brainImg, heartImg, liverImg, pancreasImg, kidneyImg, gutImg, adiposeImg, muscleImg, erythrocytesImg, bodyImg } from './assets/organImages';

type BadgeStatus = 'anabolic' | 'catabolic' | 'pathologic' | 'active';

interface BodyMetabolicMapProps {
  stateId: MetabolicStateId;
  getOrganStateBadge: (organId: OrganId, stateId: MetabolicStateId) => { text: string; status: BadgeStatus };
  selectedOrganId: OrganId;
  secondaryOrganId?: OrganId | null;
  onOrganClick: (organId: OrganId) => void;
}

interface OrganPlacement {
  id: OrganId;
  name: string;
  img: string | null;
  side: 'left' | 'right';
  // posición del centro del órgano dentro del cuerpo (porcentaje del ancho y del alto)
  x: number;
  y: number;
  w: number; // ancho en porcentaje del ancho del cuerpo (solo para imágenes superpuestas)
  overlay: boolean; // true: se dibuja su imagen sobre el cuerpo; false: el órgano ya está en la ilustración y se marca con un punto
}

// Disposición anatómica sobre la ilustración del cuerpo (vista frontal: el lado izquierdo
// de la pantalla es el lado derecho del paciente). Coordenadas en % del ancho y del alto de la ilustración.
const ORGANS: OrganPlacement[] = [
  { id: 'brain', name: 'Cerebro', img: brainImg, side: 'left', x: 47.2, y: 5.9, w: 0, overlay: false },
  { id: 'erythrocyte', name: 'Eritrocitos', img: erythrocytesImg, side: 'left', x: 13.8, y: 47.6, w: 15, overlay: true },
  { id: 'liver', name: 'Hígado', img: liverImg, side: 'left', x: 41.1, y: 59.2, w: 0, overlay: false },
  { id: 'kidney', name: 'Riñones', img: kidneyImg, side: 'left', x: 32.5, y: 67.9, w: 0, overlay: false },
  { id: 'adipose', name: 'Tejido adiposo', img: adiposeImg, side: 'left', x: 32.7, y: 95.2, w: 0, overlay: false },
  { id: 'hypothalamus', name: 'Hipotálamo', img: null, side: 'right', x: 52.5, y: 11, w: 0, overlay: false },
  { id: 'heart', name: 'Corazón', img: heartImg, side: 'right', x: 53.5, y: 45.1, w: 0, overlay: false },
  { id: 'muscle', name: 'Músculo esquelético', img: muscleImg, side: 'right', x: 89.7, y: 61.6, w: 0, overlay: false },
  { id: 'pancreas', name: 'Páncreas', img: pancreasImg, side: 'right', x: 54.7, y: 67.3, w: 0, overlay: false },
  { id: 'gut', name: 'Intestino', img: gutImg, side: 'right', x: 50.4, y: 78.2, w: 0, overlay: false },
];

const STATUS_STYLE: Record<BadgeStatus, { label: string; chip: string; dot: string; line: string; glow: string }> = {
  anabolic: { label: 'Anabólico', chip: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', line: '#059669', glow: 'rgba(5,150,105,0.55)' },
  catabolic: { label: 'Catabólico', chip: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500', line: '#d97706', glow: 'rgba(217,119,6,0.55)' },
  active: { label: 'Adaptativo', chip: 'bg-sky-50 text-sky-800 border-sky-200', dot: 'bg-sky-500', line: '#0284c7', glow: 'rgba(2,132,199,0.5)' },
  pathologic: { label: 'Patológico', chip: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-500', line: '#e11d48', glow: 'rgba(225,29,72,0.55)' },
};

const shorten = (s: string) => s.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

interface Line { id: OrganId; d: string; x2: number; y2: number; color: string; }

export const BodyMetabolicMap: React.FC<BodyMetabolicMapProps> = ({
  stateId,
  getOrganStateBadge,
  selectedOrganId,
  secondaryOrganId,
  onOrganClick,
}) => {
  const state = METABOLIC_STATES[stateId];
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Partial<Record<OrganId, HTMLButtonElement | null>>>({});
  const anchorRefs = useRef<Partial<Record<OrganId, HTMLElement | null>>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const c = el.getBoundingClientRect();
      setBox({ w: c.width, h: c.height });
      if (c.width < 700 || !window.matchMedia('(min-width: 1280px)').matches) { setLines([]); return; }
      const next: Line[] = [];
      for (const o of ORGANS) {
        const card = cardRefs.current[o.id];
        const anchor = anchorRefs.current[o.id];
        if (!card || !anchor) continue;
        const r = card.getBoundingClientRect();
        const a = anchor.getBoundingClientRect();
        const x1 = (o.side === 'left' ? r.right : r.left) - c.left;
        const y1 = r.top + r.height / 2 - c.top;
        const x2 = (o.overlay ? (o.side === 'left' ? a.left + a.width * 0.12 : a.right - a.width * 0.12) : a.left + a.width / 2) - c.left;
        const y2 = a.top + a.height / 2 - c.top;
        const mx = (x1 + x2) / 2;
        const color = STATUS_STYLE[getOrganStateBadge(o.id, stateId).status].line;
        next.push({ id: o.id, d: `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, x2, y2, color });
      }
      setLines(next);
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener('resize', compute);
    const t = window.setTimeout(compute, 400);
    return () => { ro.disconnect(); window.removeEventListener('resize', compute); window.clearTimeout(t); };
  }, [stateId, getOrganStateBadge]);

  const renderCard = (o: OrganPlacement) => {
    const badge = getOrganStateBadge(o.id, stateId);
    const st = STATUS_STYLE[badge.status];
    const profile = state.organProfiles[o.id];
    const up = (profile?.activePathways || []).slice(0, 2).map(shorten);
    const down = (profile?.inhibitedPathways || []).slice(0, 2).map(shorten);
    const isA = selectedOrganId === o.id;
    const isB = secondaryOrganId === o.id;
    return (
      <button
        key={o.id}
        ref={(n) => { cardRefs.current[o.id] = n; }}
        onClick={() => onOrganClick(o.id)}
        className={`w-full text-left bg-white rounded-2xl border p-2.5 transition-all duration-200 cursor-pointer hover:border-teal-400 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-teal-600 ${
          isA ? 'border-teal-600 ring-2 ring-teal-500/30' : isB ? 'border-indigo-600 ring-2 ring-indigo-500/30' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {o.img ? (
            <img src={o.img} alt="" className="w-7 h-7 object-contain shrink-0" />
          ) : (
            <span className="w-7 h-7 rounded-full bg-violet-100 border border-violet-300 text-violet-800 text-[9px] font-extrabold flex items-center justify-center shrink-0">ARC</span>
          )}
          <span className="text-xs font-extrabold text-slate-900 flex-1 min-w-0 truncate">{o.name}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border shrink-0 ${st.chip}`}>{st.label}</span>
        </div>
        <div key={stateId} className="metabolix-fade">
          <p className="text-[11px] font-semibold text-slate-800 leading-snug mt-1.5">{badge.text}</p>
          {(up.length > 0 || down.length > 0) && (
            <ul className="mt-1.5 space-y-0.5 text-[10.5px] leading-snug">
              {up.map((t) => (
                <li key={'u' + t} className="flex gap-1 text-emerald-800" title={t}>
                  <span className="font-bold shrink-0" aria-label="activa">↑</span>
                  <span className="truncate">{t}</span>
                </li>
              ))}
              {down.map((t) => (
                <li key={'d' + t} className="flex gap-1 text-rose-700" title={t}>
                  <span className="font-bold shrink-0" aria-label="inhibida">↓</span>
                  <span className="truncate">{t}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </button>
    );
  };

  const left = ORGANS.filter((o) => o.side === 'left');
  const right = ORGANS.filter((o) => o.side === 'right');

  return (
    <div className="space-y-3">
      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600">
        {(Object.keys(STATUS_STYLE) as BadgeStatus[]).map((k) => (
          <span key={k} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLE[k].dot}`} />
            {STATUS_STYLE[k].label}
          </span>
        ))}
        <span className="flex items-center gap-1.5"><span className="font-bold text-emerald-700">↑</span> vía activa</span>
        <span className="flex items-center gap-1.5"><span className="font-bold text-rose-700">↓</span> vía inhibida</span>
      </div>

      <div ref={containerRef} className="relative grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(250px,330px)_minmax(0,1fr)] gap-4 items-center">
        {/* Columna de fichas izquierda */}
        <div className="flex flex-col gap-2.5 order-2 xl:order-1 min-w-0">{left.map(renderCard)}</div>

        {/* Cuerpo humano */}
        <div className="order-1 xl:order-2 mx-auto w-full max-w-[330px]">
          <div className="relative w-full" style={{ aspectRatio: '591 / 948' }}>
            <img
              src={bodyImg}
              alt="Cuerpo humano con sus órganos"
              className="absolute left-0 w-full select-none pointer-events-none"
              style={{ top: 0, height: '100%' }}
              draggable={false}
            />

            {ORGANS.map((o) => {
              const badge = getOrganStateBadge(o.id, stateId);
              const st = STATUS_STYLE[badge.status];
              const isSel = selectedOrganId === o.id || secondaryOrganId === o.id;
              if (!o.overlay) {
                // Órgano ya dibujado en la ilustración: marcador con el color de su adaptación
                return (
                  <button
                    key={o.id}
                    ref={(n) => { anchorRefs.current[o.id] = n; }}
                    onClick={() => onOrganClick(o.id)}
                    title={o.name}
                    aria-label={o.name}
                    className="absolute cursor-pointer group"
                    style={{ left: `${o.x}%`, top: `${o.y}%`, transform: 'translate(-50%,-50%)' }}
                  >
                    {isSel && (
                      <span className="absolute inset-0 rounded-full animate-ping" style={{ background: st.glow }} />
                    )}
                    <span
                      className="relative block w-4 h-4 rounded-full border-2 border-white transition-transform duration-200 group-hover:scale-125"
                      style={{ background: st.line, boxShadow: `0 0 0 ${isSel ? 5 : 3}px ${st.glow}` }}
                    />
                  </button>
                );
              }
              return (
                <button
                  key={o.id}
                  ref={(n) => { anchorRefs.current[o.id] = n; }}
                  onClick={() => onOrganClick(o.id)}
                  title={o.name}
                  aria-label={o.name}
                  className={`absolute cursor-pointer transition-transform duration-200 hover:scale-110 ${isSel ? 'scale-110' : ''}`}
                  style={{ left: `${o.x}%`, top: `${o.y}%`, width: `${o.w}%`, transform: 'translate(-50%,-50%)' }}
                >
                  <img
                    src={o.img || undefined}
                    alt=""
                    className="w-full h-auto block"
                    style={{ filter: `drop-shadow(0 0 ${isSel ? 7 : 4}px ${st.glow})`, transition: 'filter 300ms' }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna de fichas derecha */}
        <div className="flex flex-col gap-2.5 order-3 min-w-0">{right.map(renderCard)}</div>

        {/* Líneas de conexión ficha → órgano (solo en pantallas anchas) */}
        {lines.length > 0 && (
          <svg className="absolute inset-0 pointer-events-none hidden xl:block" width={box.w} height={box.h} aria-hidden="true">
            {lines.map((l) => (
              <g key={l.id} opacity={selectedOrganId === l.id || secondaryOrganId === l.id ? 0.95 : 0.55}>
                <path d={l.d} fill="none" stroke={l.color} strokeWidth={selectedOrganId === l.id ? 2 : 1.25} strokeDasharray="4 3" />
                <circle cx={l.x2} cy={l.y2} r="3" fill={l.color} />
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};
