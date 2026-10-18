import React from 'react';

interface CourseLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const CourseLogo: React.FC<CourseLogoProps> = ({
  className = "w-10 h-10",
  size = 40,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Fallback & primary: image or vector emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-white shadow-2xs border border-amber-200/80 p-0.5 overflow-hidden group"
        style={{ width: size, height: size }}
      >
        <img 
          src="/course_logo.jpg" 
          alt="Bioquímica Médica UGR" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // If image fails, show SVG fallback
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Crisp vector fallback */}
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full absolute inset-0 p-1 pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Pomegranate (Granada) at top */}
          <circle cx="50" cy="14" r="9" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />
          {/* Calyx crown */}
          <path d="M46 6 L50 2 L54 6 Z" fill="#991b1b" />
          <path d="M43 7 L45 3 L47 7 Z" fill="#7f1d1d" />
          <path d="M53 7 L55 3 L57 7 Z" fill="#7f1d1d" />
          {/* Seeds inside */}
          <circle cx="48" cy="13" r="1.5" fill="#fca5a5" />
          <circle cx="52" cy="13" r="1.5" fill="#fca5a5" />
          <circle cx="50" cy="16" r="1.5" fill="#fecaca" />
          
          {/* Golden Staff (Vara de Esculapio / Caduceo) */}
          <line x1="50" y1="22" x2="50" y2="114" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="114" r="2.5" fill="#b45309" />
          
          {/* Golden DNA Double Helix rungs and strands */}
          {/* DNA Strand A */}
          <path
            d="M34 32 Q50 44 66 56 Q50 68 34 80 Q50 92 66 104"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* DNA Strand B */}
          <path
            d="M66 32 Q50 44 34 56 Q50 68 66 80 Q50 92 34 104"
            stroke="#d97706"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* DNA base pairs (golden horizontal rungs) */}
          <line x1="40" y1="36" x2="60" y2="36" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="43" y1="48" x2="57" y2="48" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="40" y1="60" x2="60" y2="60" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="43" y1="72" x2="57" y2="72" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="40" y1="84" x2="60" y2="84" stroke="#fbbf24" strokeWidth="1.8" />
          <line x1="43" y1="96" x2="57" y2="96" stroke="#fbbf24" strokeWidth="1.8" />

          {/* Crimson Snake (Serpiente Médica) intertwined */}
          <path
            d="M48 24 C40 28 32 36 40 45 C48 54 62 50 60 64 C58 76 38 72 40 85 C42 96 58 98 52 110"
            stroke="#991b1b"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Snake head */}
          <ellipse cx="49" cy="24" rx="3.5" ry="2.5" fill="#7f1d1d" />
          <circle cx="50" cy="23" r="0.8" fill="#fef08a" />
          {/* Snake tongue */}
          <path d="M52 24 L56 23 M52 24 L56 25" stroke="#dc2626" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-extrabold tracking-tight text-amber-950 text-sm leading-none">
            BIOQUÍMICA MÉDICA
          </span>
          <span className="text-[10px] text-amber-800 font-medium tracking-normal mt-0.5">
            Facultad de Medicina · UGR
          </span>
        </div>
      )}
    </div>
  );
};
export default CourseLogo;
