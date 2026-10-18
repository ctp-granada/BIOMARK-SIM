import React, { useMemo, useRef, useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';

// ---------------------------------------------------------------------------
// Escala de tiempo: logarítmica de 0 h a 40 días (permite ver a la vez las
// primeras horas tras la comida y las semanas de inanición).
// ---------------------------------------------------------------------------
const H_MAX = 960; // 40 días
const L_MAX = Math.log1p(H_MAX);
const hoursToFrac = (h: number) => Math.log1p(Math.max(0, h)) / L_MAX;
const fracToHours = (f: number) => Math.expm1(Math.min(1, Math.max(0, f)) * L_MAX);

const PHASES = [
  { id: 'I', from: 0, to: 4, name: 'Fase I', range: '0 - 4 h', title: 'Absortiva', text: 'Glucosa exógena absorbida en el intestino. Casi todos los tejidos oxidan glucosa. Insulina alta, glucagón bajo.' },
  { id: 'II', from: 4, to: 16, name: 'Fase II', range: '4 - 16 h', title: 'Glucogenólisis', text: 'Glucogenólisis hepática como principal fuente de glucosa, con gluconeogénesis creciente. El músculo transita a ácidos grasos.' },
  { id: 'III', from: 16, to: 48, name: 'Fase III', range: '16 - 48 h', title: 'Gluconeogénesis', text: 'Glucógeno prácticamente agotado. La gluconeogénesis (hepática y, en menor medida, renal) es la fuente de glucosa. Proteólisis muscular en su pico (~75 g/día).' },
  { id: 'IV', from: 48, to: 576, name: 'Fase IV', range: '2 - 24 días', title: 'Ceto-adaptación', text: 'El cerebro capta cada vez más β-hidroxibutirato y acetoacetato. La proteólisis muscular disminuye y la urea cae.' },
  { id: 'V', from: 576, to: H_MAX, name: 'Fase V', range: '> 24 días', title: 'Inanición', text: 'El riñón aporta hasta el 40% de la glucosa. Ahorro proteico máximo hasta que se agota la grasa.' },
];

interface Metrics { glucose: number; insulin: number; glucagon: number; ffa: number; ketones: number; nitrogen: number; }

// Valores plasmáticos aproximados (datos clásicos de Cahill y Owen), sin redondear
const metricsAt = (hours: number): Metrics => {
  if (hours <= 4) {
    const t = hours / 4;
    return { glucose: 145 - t * 50, insulin: 90 - t * 75, glucagon: 15 + t * 40, ffa: 0.15 + t * 0.25, ketones: 0.05 + t * 0.05, nitrogen: 14 - t };
  }
  if (hours <= 16) {
    const t = (hours - 4) / 12;
    return { glucose: 95 - t * 15, insulin: 15 - t * 8, glucagon: 55 + t * 45, ffa: 0.4 + t * 0.4, ketones: 0.1 + t * 0.3, nitrogen: 13 };
  }
  if (hours <= 48) {
    const t = (hours - 16) / 32;
    return { glucose: 80 - t * 10, insulin: 7 - t * 3, glucagon: 100 + t * 50, ffa: 0.8 + t * 0.6, ketones: 0.4 + t * 1.4, nitrogen: 13 + t * 2 };
  }
  if (hours <= 576) {
    const t = (hours - 48) / 528;
    const e = 1 - Math.pow(1 - t, 2.2); // aproximación más suave hacia la meseta
    return { glucose: 70 - e * 5, insulin: 4 - e * 2, glucagon: 150 - e * 50, ffa: 1.4 + e * 0.4, ketones: 1.8 + e * 5.2, nitrogen: 15 - e * 11 };
  }
  return { glucose: 65, insulin: 2, glucagon: 100, ffa: 1.8, ketones: 7.0, nitrogen: 4 };
};

const phaseAt = (h: number) => PHASES.find((p) => h <= p.to) || PHASES[PHASES.length - 1];

interface SeriesDef {
  key: keyof Metrics;
  label: string;
  unit: string;
  color: string;
  min: number;
  max: number;
  ticks: number[];
  decimals: number;
  status: (v: number) => string;
}

const SERIES: SeriesDef[] = [
  { key: 'glucose', label: 'Glucemia', unit: 'mg/dL', color: '#0284c7', min: 50, max: 150, ticks: [60, 100, 140], decimals: 0,
    status: (v) => (v >= 100 ? 'Posprandial' : v >= 70 ? 'Normoglucemia' : 'Estable reducida') },
  { key: 'insulin', label: 'Insulina', unit: 'μU/mL', color: '#059669', min: 0, max: 100, ticks: [0, 50, 100], decimals: 0,
    status: (v) => (v > 40 ? 'Pico posprandial' : v > 5 ? 'Nivel basal' : 'Mínima') },
  { key: 'glucagon', label: 'Glucagón', unit: 'pg/mL', color: '#c2410c', min: 0, max: 200, ticks: [0, 100, 200], decimals: 0,
    status: (v) => (v >= 130 ? 'Máximo estímulo' : v >= 45 ? 'Elevado (ayuno)' : 'Suprimido') },
  { key: 'ffa', label: 'Ácidos grasos libres', unit: 'mM', color: '#d97706', min: 0, max: 2, ticks: [0, 1, 2], decimals: 2,
    status: (v) => (v > 1 ? 'Lipólisis plena' : v >= 0.3 ? 'Lipólisis activa' : 'Lipólisis suprimida') },
  { key: 'ketones', label: 'Cuerpos cetónicos', unit: 'mM', color: '#e11d48', min: 0, max: 8, ticks: [0, 4, 8], decimals: 2,
    status: (v) => (v > 3 ? 'Cetonemia adaptativa' : v >= 0.5 ? 'Cetosis en aumento' : 'Trazas') },
  { key: 'nitrogen', label: 'N urinario', unit: 'g N/día', color: '#7c3aed', min: 0, max: 16, ticks: [0, 8, 16], decimals: 0,
    status: (v) => (v < 6 ? 'Ahorro proteico' : 'Proteólisis activa') },
];

const X_TICKS = [
  { h: 0, label: '0' }, { h: 4, label: '4 h' }, { h: 16, label: '16 h' }, { h: 48, label: '2 d' },
  { h: 168, label: '7 d' }, { h: 576, label: '24 d' }, { h: 960, label: '40 d' },
];

// Geometría de cada gráfica (coordenadas del viewBox)
const W = 400, H = 150, ML = 34, MR = 10, MT = 20, MB = 22;
const PW = W - ML - MR, PH = H - MT - MB;
const xOf = (h: number) => ML + hoursToFrac(h) * PW;

// Curva suave (Catmull-Rom convertida a Bézier)
const smoothPath = (pts: [number, number][]) => {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  return d;
};

const formatHours = (h: number) => {
  if (h < 1) return `${Math.round(h * 60)} min`;
  if (h < 48) return `${Math.round(h)} h`;
  return `${Math.round(h / 24)} días`;
};

interface PanelProps {
  def: SeriesDef;
  hours: number;
  onScrub: (h: number) => void;
}

const CurvePanel: React.FC<PanelProps> = ({ def, hours, onScrub }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const gradId = `grad-${def.key}`;
  const yOf = (v: number) => MT + PH - ((Math.min(def.max, Math.max(def.min, v)) - def.min) / (def.max - def.min)) * PH;

  const { line, area } = useMemo(() => {
    const pts: [number, number][] = [];
    const N = 140;
    for (let i = 0; i <= N; i++) {
      const h = fracToHours(i / N);
      pts.push([ML + (i / N) * PW, yOf(metricsAt(h)[def.key])]);
    }
    const l = smoothPath(pts);
    return { line: l, area: `${l} L ${ML + PW} ${MT + PH} L ${ML} ${MT + PH} Z` };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.key]);

  const value = metricsAt(hours)[def.key];
  const cx = xOf(hours), cy = yOf(value);
  const labelText = value.toFixed(def.decimals);
  const labelW = 10 + labelText.length * 6.2;
  const lx = Math.min(ML + PW - labelW / 2, Math.max(ML + labelW / 2, cx));
  const ly = cy - 14 < MT ? cy + 16 : cy - 12;

  const scrubFromEvent = (e: React.PointerEvent) => {
    const el = svgRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    onScrub(fracToHours((x - ML) / PW));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3">
      <div className="flex items-baseline justify-between gap-2 px-1">
        <span className="text-xs font-bold text-slate-800">{def.label}</span>
        <span className="text-[11px] text-slate-500">
          <strong className="font-mono text-sm tabular-nums" style={{ color: def.color }}>{labelText}</strong> {def.unit}
        </span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none touch-none cursor-ew-resize mt-1"
        role="img"
        aria-label={`${def.label} a lo largo del ayuno`}
        onPointerDown={(e) => { dragging.current = true; (e.target as Element).setPointerCapture?.(e.pointerId); scrubFromEvent(e); }}
        onPointerMove={(e) => { if (dragging.current) scrubFromEvent(e); }}
        onPointerUp={() => { dragging.current = false; }}
        onPointerCancel={() => { dragging.current = false; }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={def.color} stopOpacity="0.22" />
            <stop offset="1" stopColor={def.color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Bandas de las fases de Cahill */}
        {PHASES.map((p, i) => {
          const x0 = xOf(p.from), x1 = xOf(p.to);
          const active = hours >= p.from && hours <= p.to;
          return (
            <g key={p.id}>
              <rect x={x0} y={MT} width={x1 - x0} height={PH} fill={active ? '#ccfbf1' : i % 2 ? '#f8fafc' : '#f1f5f9'} opacity={active ? 0.55 : 1} />
              <text x={(x0 + x1) / 2} y={MT - 6} textAnchor="middle" fontSize="9" fontWeight="700" fill={active ? '#0f766e' : '#94a3b8'}>{p.id}</text>
            </g>
          );
        })}

        {/* Cuadrícula y eje Y */}
        {def.ticks.map((t) => (
          <g key={t}>
            <line x1={ML} x2={ML + PW} y1={yOf(t)} y2={yOf(t)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={ML - 5} y={yOf(t) + 3} textAnchor="end" fontSize="9" fill="#64748b" style={{ fontVariantNumeric: 'tabular-nums' }}>{t}</text>
          </g>
        ))}

        {/* Eje X */}
        {X_TICKS.filter((t) => t.h < H_MAX).map((t) => (
          <text key={t.h} x={xOf(t.h)} y={H - 6} textAnchor={t.h === 0 ? 'start' : t.h === H_MAX ? 'end' : 'middle'} fontSize="9" fill="#64748b">{t.label}</text>
        ))}

        {/* Curva */}
        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={def.color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Cursor sincronizado */}
        <line x1={cx} x2={cx} y1={MT} y2={MT + PH} stroke="#0f766e" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx={cx} cy={cy} r="4.5" fill={def.color} stroke="#ffffff" strokeWidth="2" />
        <g transform={`translate(${lx}, ${ly})`}>
          <rect x={-labelW / 2} y={-9} width={labelW} height={15} rx="4" fill="#0f172a" opacity="0.85" />
          <text x="0" y="2" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#ffffff" style={{ fontVariantNumeric: 'tabular-nums' }}>{labelText}</text>
        </g>
      </svg>
      <p className="text-[10.5px] text-slate-500 px-1">{def.status(value)}</p>
    </div>
  );
};

export const TimelineCurveView: React.FC = () => {
  const [hours, setHours] = useState<number>(12);
  const phase = phaseAt(hours);
  const sliderPos = Math.round(hoursToFrac(hours) * 1000);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 space-y-5">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-700" />
            <span>Curvas Temporales & Evolución Secuencial del Ayuno</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Las 5 fases de adaptación desde la comida hasta la inanición de semanas (datos clásicos de Cahill y Owen).
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-600">Tiempo de ayuno:</span>
          <span className="font-mono font-bold text-teal-800 text-sm tabular-nums">{formatHours(hours)}</span>
        </div>
      </div>

      {/* Control de tiempo */}
      <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-2 text-xs">
          <label htmlFor="fasting-time" className="font-bold text-slate-800">Arrastra para avanzar en el tiempo (o arrastra sobre cualquier gráfica):</label>
          <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {phase.name}: {phase.title} ({phase.range})
          </span>
        </div>
        <input
          id="fasting-time"
          type="range"
          min="0"
          max="1000"
          step="1"
          value={sliderPos}
          onChange={(e) => setHours(fracToHours(Number(e.target.value) / 1000))}
          className="w-full accent-teal-700 cursor-pointer"
        />
        <div className="relative h-4 text-[10px] text-slate-400 font-mono mt-1">
          {X_TICKS.map((t) => (
            <span
              key={t.h}
              className="absolute whitespace-nowrap -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${hoursToFrac(t.h) * 100}%` }}
            >
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Gráficas pequeñas alineadas en el tiempo */}
      <div>
        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs mb-3">
          <TrendingUp className="w-4 h-4 text-teal-700" />
          <span>Cinética plasmática (escala de tiempo logarítmica, 0 h a 40 días)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {SERIES.map((def) => (
            <CurvePanel key={def.key} def={def} hours={hours} onScrub={setHours} />
          ))}
        </div>
      </div>

      {/* Fases de Cahill */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
        {PHASES.map((p) => {
          const active = p.id === phase.id;
          return (
            <button
              key={p.id}
              onClick={() => setHours(p.id === 'I' ? 2 : Math.sqrt(Math.max(1, p.from) * p.to))}
              className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                active ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 border-slate-200 hover:border-teal-300'
              }`}
            >
              <span className={`font-bold block mb-1 ${active ? 'text-teal-900' : 'text-slate-800'}`}>{p.name} ({p.range})</span>
              <span className="text-[11px] font-semibold text-teal-700 block mb-1">{p.title}</span>
              <span className="text-[11px] text-slate-600 leading-snug block">{p.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
