import React, { useState } from 'react';
import { ClinicalCase, OrganSystem, DifficultyLevel, UserProgress, ActiveModule } from '../../types';
import { CaseCard } from './CaseCard';
import { 
  Stethoscope, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Coins, 
  Gamepad2, 
  BookOpen, 
  Search, 
  Filter, 
  Heart, 
  HelpCircle,
  FolderOpen,
  GraduationCap,
  Lock
} from 'lucide-react';
import { HospitalDoctorWelcomeModal } from './HospitalDoctorWelcomeModal';
import { satisfactionService } from '../../utils/satisfactionService';

interface CaseListProps {
  cases: ClinicalCase[];
  onSelectCase: (c: ClinicalCase) => void;
  onStartChallenge: (c: ClinicalCase) => void;
  onOpenAICaseModal?: () => void;
  userProgress?: UserProgress;
  onNavigate?: (module: ActiveModule) => void;
}

interface ThematicBlock {
  id: OrganSystem;
  blockNumber: number;
  title: string;
  shortName: string;
  iconEmoji: string;
  gradient: string;
  badgeBg: string;
  borderHover: string;
  accentText: string;
  description: string;
  curriculumTopics: string;
  keyBiomarkers: string[];
}

const THEMATIC_BLOCKS: ThematicBlock[] = [
  {
    id: 'cardiac',
    blockNumber: 1,
    title: 'Patología Cardiovascular & Necrosis Miocárdica',
    shortName: 'Cardiovascular',
    iconEmoji: '🫀',
    gradient: 'from-rose-500/10 via-red-500/5 to-transparent',
    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    borderHover: 'hover:border-rose-400 group-hover:shadow-rose-500/10',
    accentText: 'text-rose-700',
    description: 'Diagnóstico precoz de Síndromes Coronarios Agudos, infarto agudo de miocardio (IAMCEST/SCASEST), insuficiencia cardíaca congestiva descompensada y crisis hipertensivas.',
    curriculumTopics: 'Cinética de necrosis miocárdica • Ventanas temporales • Péptidos natriuréticos',
    keyBiomarkers: ['Troponina hs-cTn', 'NT-proBNP', 'CK-MB', 'Mioglobina', 'LDH-1']
  },
  {
    id: 'hepatic',
    blockNumber: 2,
    title: 'Patología Hepática, Citólisis e Ictericias',
    shortName: 'Hepático / Ictericias',
    iconEmoji: '🧪',
    gradient: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
    borderHover: 'hover:border-amber-400 group-hover:shadow-amber-500/10',
    accentText: 'text-amber-800',
    description: 'Enzimología del daño hepatocelular agudo y crónico, obstrucción biliar posthepática (coledocolitiasis), cirrosis descompensada y errores innatos de la galactosa.',
    curriculumTopics: 'Enzimas de escape celular • Colestasis • Fraccionamiento de bilirrubina (Directa vs Indirecta)',
    keyBiomarkers: ['ALT / GPT', 'AST / GOT', 'Bilirrubina Directa / Indirecta', 'Fosfatasa Alcalina', 'GGT', 'GALT']
  },
  {
    id: 'metabolic',
    blockNumber: 3,
    title: 'Metabolismo Energético, Glúcidos y Cetoacidosis',
    shortName: 'Metabolismo / Glúcidos',
    iconEmoji: '⚡',
    gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    borderHover: 'hover:border-emerald-400 group-hover:shadow-emerald-500/10',
    accentText: 'text-emerald-800',
    description: 'Regulación de la glucemia por insulina y glucagón, cetoacidosis diabética, hipoglucemias en ayunas (insulinoma y péptido C), beta-oxidación mitocondrial (MCAD), hipertiroidismo de Graves y déficit vitamínico (tiamina).',
    curriculumTopics: 'Glucólisis y Gluconeogénesis • Cetogénesis • Tríada de Whipple • Vía de pentosas y TPP',
    keyBiomarkers: ['Glucosa', 'Beta-Hidroxibutirato', 'Péptido C', 'Insulina', 'TRAb / TSI', 'Tiamina (Efecto TPP)']
  },
  {
    id: 'renal',
    blockNumber: 4,
    title: 'Función Renal, Purinas (Gota) y Metabolismo Nitrogenado',
    shortName: 'Renal / Purinas / Urea',
    iconEmoji: '💧',
    gradient: 'from-blue-500/10 via-sky-500/5 to-transparent',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
    borderHover: 'hover:border-blue-400 group-hover:shadow-blue-500/10',
    accentText: 'text-blue-800',
    description: 'Filtrado glomerular y daño tubular renal, artritis gotosa aguda por cristales de monourato sódico (podagra), litiasis juvenil por transportador COLA (cistinuria) y síntesis de pirimidinas (aciduria orótica).',
    curriculumTopics: 'Aclaramiento de creatinina • Solubilidad del ácido úrico • Reabsorción tubular de aminoácidos',
    keyBiomarkers: ['Ácido Úrico', 'Cristales UMS Sinovial', 'Cistina en Orina', 'Ácido Orótico', 'Creatinina', 'Urea']
  },
  {
    id: 'pancreatic',
    blockNumber: 5,
    title: 'Páncreas Exocrino y Patología Digestiva',
    shortName: 'Páncreas / Digestivo',
    iconEmoji: '🩺',
    gradient: 'from-purple-500/10 via-violet-500/5 to-transparent',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
    borderHover: 'hover:border-purple-400 group-hover:shadow-purple-500/10',
    accentText: 'text-purple-800',
    description: 'Necrosis e inflamación del parénquima pancreático (pancreatitis aguda litiásica y alcohólica), insuficiencia exocrina pancreática y mucoviscidosis (fibrosis quística por disfunción del canal CFTR).',
    curriculumTopics: 'Activación de cimógenos • Enzimas acinares • Regulación del canal de cloruro CFTR',
    keyBiomarkers: ['Lipasa Sérica', 'Amilasa', 'Test de Cloruro en Sudor (CFTR)', 'Elastasa Fecal']
  },
  {
    id: 'neuromuscular',
    blockNumber: 6,
    title: 'Trastornos Neuromusculares, Toxicología y Hemoglobina',
    shortName: 'Neuromuscular / Tóxicos',
    iconEmoji: '🧠',
    gradient: 'from-indigo-500/10 via-cyan-500/5 to-transparent',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    borderHover: 'hover:border-indigo-400 group-hover:shadow-indigo-500/10',
    accentText: 'text-indigo-800',
    description: 'Fisiopatología de la placa motora (miastenia gravis autoinmune), inhibición irreversible de la acetilcolinesterasa por insecticidas organofosforados y hemoglobinopatías estructurales moleculares (anemia falciforme / HbS).',
    curriculumTopics: 'Neurotransmisión colinérgica • Envejecimiento enzimático • Polimerización de hemoglobinas',
    keyBiomarkers: ['Anticuerpos Anti-AChR', 'Colinesterasa Sérica (AChE)', 'Electroforesis HbS', 'CK Total']
  }
];

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  onSelectCase,
  onStartChallenge,
  onOpenAICaseModal,
  userProgress,
  onNavigate
}) => {
  // Block-first architecture: null = thematic blocks overview, OrganSystem = inside block
  const [selectedBlock, setSelectedBlock] = useState<OrganSystem | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDoctorModal, setShowDoctorModal] = useState<boolean>(() => {
    return localStorage.getItem('ugr_hospital_welcome_dismissed') !== 'true';
  });

  const currentBudget = userProgress?.budget && userProgress.budget >= 1000 ? userProgress.budget : 5000;
  const currentLives = userProgress ? userProgress.lives : 3;

  // Filter cases when inside a selected block
  const activeBlockConfig = THEMATIC_BLOCKS.find((b) => b.id === selectedBlock);

  const blockCases = selectedBlock ? cases.filter((c) => c.system === selectedBlock) : [];

  const filteredCasesInBlock = blockCases.filter((c) => {
    if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchTarget = c.targetDisease.toLowerCase().includes(q);
      const matchComplaint = c.clinicalHistory.chiefComplaint.toLowerCase().includes(q);
      const matchDemographics = c.clinicalHistory.patientDemographics.occupation.toLowerCase().includes(q);
      if (!matchTitle && !matchTarget && !matchComplaint && !matchDemographics) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Modal: Full Guided Orientation by the Tutor */}
      <HospitalDoctorWelcomeModal
        isOpen={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        userProgress={userProgress}
        onNavigate={onNavigate}
      />

      {/* Hospital Entrance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white">
              Hospital Universitario
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              PID 26-158
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Campus Salud PTS • Universidad de Granada
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            <span>Banco de Casos Clínicos Departamental</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Estratificación curricular de Bioquímica Médica con simulador analítico interactivo.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowDoctorModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="text-sm">👨‍⚕️</span>
            <span>Guía del Tutor Clínico</span>
          </button>
        </div>
      </div>

      {/* Notice Banner when user has completed >= 4 cases and hasn't answered */}
      {userProgress && !satisfactionService.hasUserCompletedSurvey() && userProgress.casesAttempted >= 4 && (
        <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white rounded-3xl p-5 border border-amber-500/60 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-950 px-2 py-0.5 rounded text-amber-200 border border-amber-400/30">
                  ¡Danos tu opinión!
                </span>
                <span className="text-xs font-bold text-amber-200">
                  ¡Has resuelto tus primeros 4 casos clínicos!
                </span>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed max-w-2xl">
                Para poder continuar resolviendo casos en el Hospital y acceder al Parque Biomédico, ¡danos tu opinión sobre la plataforma (~90 seg)! Ganarás +150 XP y +100 € para tus guardias. La Biblioteca y los Simuladores siguen siempre disponibles para tu estudio.
              </p>
            </div>
          </div>

          <button
            onClick={() => onStartChallenge(cases[0])}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 shrink-0 group"
          >
            <Sparkles className="w-4 h-4 text-amber-900 group-hover:rotate-12 transition-transform" />
            <span>¡Danos tu opinión! (+150 XP y +100 €)</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DOCTOR WELCOME BANNER: EXPLAINING CASE BANK & HOSPITAL BUDGET (REQUEST 5)  */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-teal-600/10 via-emerald-600/10 to-cyan-600/10 border border-teal-200 rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
          {/* Doctor Vector Artwork Drawing */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-1 shadow-md shadow-emerald-700/20">
              <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center">
                {/* Custom Doctor Drawing in SVG */}
                <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="80" cy="80" r="76" fill="#F0FDFA" />
                  <circle cx="80" cy="80" r="64" fill="#CCFBF1" />
                  <path d="M72 35H88V125H72V35Z" fill="#99F6E4" opacity="0.4" />
                  <path d="M35 72H125V88H35V72Z" fill="#99F6E4" opacity="0.4" />
                  <path d="M30 160C30 126 50 110 80 110C110 110 130 126 130 160H30Z" fill="#0D9488" />
                  <path d="M40 160L52 114L80 142L108 114L120 160H40Z" fill="#FFFFFF" />
                  <path d="M52 114L80 138V160H74V142L48 116L52 114Z" fill="#F1F5F9" />
                  <path d="M108 114L80 138V160H86V142L112 116L108 114Z" fill="#E2E8F0" />
                  <path d="M68 110L80 124L92 110H68Z" fill="#0F766E" />
                  <rect x="94" y="128" width="16" height="20" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
                  <rect x="96" y="130" width="12" height="6" rx="1" fill="#0284C7" />
                  <line x1="96" y1="139" x2="108" y2="139" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="96" y1="143" x2="105" y2="143" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M58 112C58 132 68 140 76 140C80 140 84 135 84 130C84 125 78 123 78 123" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M102 112C102 128 94 136 86 138" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
                  <circle cx="77" cy="141" r="5" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
                  <rect x="71" y="94" width="18" height="20" rx="6" fill="#FDBA74" opacity="0.4" />
                  <circle cx="80" cy="72" r="26" fill="#FED7AA" />
                  <path d="M72 82C74 86 86 86 88 82" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="68" cy="78" r="3.5" fill="#F43F5E" opacity="0.25" />
                  <circle cx="92" cy="78" r="3.5" fill="#F43F5E" opacity="0.25" />
                  <circle cx="70" cy="69" r="3" fill="#1E293B" />
                  <circle cx="71" cy="68" r="1" fill="#FFFFFF" />
                  <circle cx="90" cy="69" r="3" fill="#1E293B" />
                  <circle cx="91" cy="68" r="1" fill="#FFFFFF" />
                  <path d="M66 63C68 61 74 62 75 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M94 63C92 61 86 62 85 64" stroke="#78350F" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M79 72L78 76H82" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M54 70C53 52 64 42 80 42C96 42 107 52 106 70C106 72 104 64 100 60C96 56 89 54 80 54C71 54 64 56 60 60C56 64 54 72 54 70Z" fill="#78350F" />
                </svg>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-white items-center justify-center text-[10px] text-white font-black">✓</span>
            </span>
          </div>

          {/* Doctor Speech & Economic Explanation */}
          <div className="flex-1 space-y-2.5 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">Dr. Carlos Morales</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Tutor Clínico UGR • Servicio de Urgencias
                </span>
              </div>

              {/* Real-time HUD Metrics */}
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
                  currentBudget < 1000 ? 'bg-rose-50 text-rose-800 border-rose-300' : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                }`}>
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Presupuesto de Guardia: <strong>{currentBudget.toLocaleString('es-ES')} €</strong></span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border bg-rose-50 text-rose-800 border-rose-200">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{currentLives}/3</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
              «¡Bienvenido al hospital! En el <strong className="text-slate-900">Banco de Casos</strong> entrenarás como médico de urgencias. Los pacientes están agrupados por <strong className="text-teal-900 font-bold">bloques temáticos</strong> para que estudies ordenadamente y no te distraigas con temas que aún no has visto en clase. Recuerda la regla de oro: partes con una partida inicial de <strong className="text-emerald-800 font-bold">5.000 € de fondos sanitarios</strong>. Cada analítica consume entre <strong className="text-amber-900 font-bold">60 € y 300 €</strong> de tu dinero de guardia. Si pides pruebas a ciegas te quedarás sin fondos. Pide solo los biomarcadores discriminatorios clave. ¿Y si necesitas liquidez? ¡Pasa por la <strong className="text-emerald-700 font-bold">Zona Lúdica del Parque</strong> a ganar dinero respondiendo minijuegos (+150 € a +300 € 💰)!»
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setShowDoctorModal(true)}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                <span>¿Cómo funciona el dinero y las analíticas? (Ver guía completa)</span>
              </button>

              {onNavigate && (
                <button
                  onClick={() => onNavigate('juegos')}
                  className="text-xs font-bold text-amber-900 hover:text-amber-950 inline-flex items-center gap-1.5 bg-amber-100/90 hover:bg-amber-200/90 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors cursor-pointer shadow-2xs"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ir al Parque a ganar Dinero (+150 € a +300 € 💰)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: THEMATIC BLOCKS FIRST (REQUEST 6)                                 */}
      {/* ========================================================================= */}
      {selectedBlock === null ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-slate-700" />
                <span>Bloques Temáticos de la Asignatura</span>
              </h2>
              <p className="text-xs text-slate-500">
                Selecciona el bloque que estás cursando. Cada bloque contiene únicamente los casos clínicos de ese ámbito médico.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
              Total Catálogo: {cases.length} casos clínicos
            </span>
          </div>

          {/* Grid of the 6 Thematic Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {THEMATIC_BLOCKS.map((block) => {
              const casesCount = cases.filter((c) => c.system === block.id).length;
              return (
                <div
                  key={block.id}
                  onClick={() => {
                    setSelectedBlock(block.id);
                    setSelectedDifficulty('all');
                    setSearchQuery('');
                  }}
                  className={`group bg-white rounded-3xl border border-slate-200 p-5 shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 ${block.borderHover}`}
                >
                  <div className="space-y-3.5">
                    {/* Block Header Badges */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
                        BLOQUE {block.blockNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${block.badgeBg}`}>
                        {casesCount} {casesCount === 1 ? 'caso' : 'casos'}
                      </span>
                    </div>

                    {/* Title with Emoji */}
                    <div>
                      <div className="text-2xl mb-1">{block.iconEmoji}</div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-teal-900 transition-colors">
                        {block.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5 block">
                        {block.curriculumTopics}
                      </span>
                    </div>

                    {/* Summary Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {block.description}
                    </p>

                    {/* Biomarkers Tags */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Biomarcadores evaluados:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {block.keyBiomarkers.map((bm, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                          >
                            {bm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    <span>Acceder a los Casos del Bloque {block.blockNumber}</span>
                    <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW 2: CASES OF THE SELECTED BLOCK (REQUEST 6)                           */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Back Navigation Button to All Blocks */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => {
                setSelectedBlock(null);
                setSearchQuery('');
                setSelectedDifficulty('all');
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:-translate-x-0.5"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>← Volver a Todos los Bloques Temáticos</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">
                Estás en: <strong className="text-slate-900">{activeBlockConfig?.title}</strong>
              </span>
            </div>
          </div>

          {/* Active Block Header Banner */}
          {activeBlockConfig && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeBlockConfig.iconEmoji}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-900 text-white">
                    BLOQUE {activeBlockConfig.blockNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${activeBlockConfig.badgeBg}`}>
                    {blockCases.length} casos registrados
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {activeBlockConfig.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeBlockConfig.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{activeBlockConfig.curriculumTopics}</span>
                </div>
              </div>

              {/* Quick Filter & Search inside the block */}
              <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2.5 w-full md:w-auto">
                {/* Search in this block */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar paciente o patología..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>

                {/* Difficulty selector */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | 'all')}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs cursor-pointer"
                >
                  <option value="all">Todas las dificultades</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                  <option value="experto">Experto</option>
                </select>
              </div>
            </div>
          )}

          {/* Cases Grid inside Selected Block */}
          {filteredCasesInBlock.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <p className="text-slate-500 font-medium text-xs">
                No se encontraron casos clínicos que coincidan con la búsqueda dentro de este bloque temático.
              </p>
              <button
                onClick={() => {
                  setSelectedDifficulty('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Limpiar filtros de búsqueda
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCasesInBlock.map((c) => (
                <CaseCard
                  key={c.id}
                  caseData={c}
                  onSelectCase={onSelectCase}
                  onStartChallenge={onStartChallenge}
                />
              ))}
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setSelectedBlock(null);
                setSearchQuery('');
                setSelectedDifficulty('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ver Otros Bloques Temáticos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
