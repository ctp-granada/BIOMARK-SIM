import React, { useState, useEffect } from 'react';
import { OrganId, MetabolicStateId } from './types/metabolism';
import {
  METABOLIC_STATES,
  MUSCLE_BIOENERGETICS_CHRONOLOGY,
  AMPK_REGULATORY_DETAILS
} from './data/metabolicData';
import { DetailedEnzyme, DetailedSubstrate } from './types/metabolism';
import { BiochemicalInspectorModal } from './BiochemicalInspectorModal';
import {
  SunMedium,
  Moon,
  Flame,
  Compass,
  AlertTriangle,
  Zap,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Dna,
  X,
  Database,
  Timer,
  Activity,
  Target,
  Droplet,
  TrendingUp,
  LayoutGrid,
  Eye,
  Info,
  BookOpen,
  FileDown,
  Check,
  Scale,
  Columns2,
  ArrowLeftRight,
  ArrowLeft
} from 'lucide-react';
import { generateOrganPdf } from './utils/generateOrganPdf';
import { HormoneRatioVisualizer } from './HormoneRatioVisualizer';
import { BodyMetabolicMap } from './BodyMetabolicMap';
import { MetabolicPathwaysView } from './MetabolicPathwaysView';
import { SubstrateComparisonCharts } from './SubstrateComparisonCharts';
import type { ReferenceTool } from './Header';

interface CentralHumanBodyAtlasProps {
  selectedStateId: MetabolicStateId;
  onSelectState: (stateId: MetabolicStateId) => void;
  selectedOrganId: OrganId;
  onSelectOrgan: (organId: OrganId) => void;
  onOpenGlossary?: (termId?: string) => void;
  activeTool?: ReferenceTool | null;
  onCloseTool?: () => void;
  onOpenTool?: (tool: ReferenceTool) => void;
  situationChosen: boolean;
  onChangeSituation: () => void;
}

const matchGlossaryTermId = (text: string): string | null => {
  const lower = text.toLowerCase();
  if (lower.includes('glucogenólisis') || lower.includes('glucogenolisis')) return 'glucogenolisis';
  if (lower.includes('gluconeogénesis') || lower.includes('gluconeogenesis')) return 'gluconeogenesis';
  if (lower.includes('cetogénesis') || lower.includes('cetogenesis')) return 'cetogenesis';
  if (lower.includes('cetólisis') || lower.includes('cetolisis')) return 'cetolisis';
  if (lower.includes('glucólisis') || lower.includes('glucolisis')) return 'glucolisis';
  if (lower.includes('glucogénesis') || lower.includes('glucogenogénesis')) return 'glucogenogenesis';
  if (lower.includes('beta-oxidación') || lower.includes('beta oxidación') || lower.includes('β-oxidación')) return 'beta_oxidacion';
  if (lower.includes('lipólisis') || lower.includes('lipolisis')) return 'lipolisis';
  if (lower.includes('lipogénesis') || lower.includes('lipogenesis')) return 'lipogenesis';
  if (lower.includes('urea')) return 'ciclo_urea';
  if (lower.includes('cori')) return 'ciclo_cori';
  if (lower.includes('alanina') || lower.includes('cahill')) return 'ciclo_alanina';
  if (lower.includes('krebs') || lower.includes('ácido cítrico') || lower.includes('tca')) return 'ciclo_krebs';
  if (lower.includes('pentosas')) return 'via_pentosas_fosfato';
  if (lower.includes('fosforilación oxidativa') || lower.includes('cadena respiratoria')) return 'fosforilacion_oxidativa';
  if (lower.includes('resistencia a la insulina')) return 'resistencia_insulina';
  if (lower.includes('cetoacidosis')) return 'cetoacidosis_diabetica';
  return null;
};

export const CentralHumanBodyAtlas: React.FC<CentralHumanBodyAtlasProps> = ({
  selectedStateId,
  onSelectState,
  selectedOrganId,
  onSelectOrgan,
  onOpenGlossary,
  activeTool,
  onCloseTool,
  onOpenTool,
  situationChosen,
  onChangeSituation
}) => {
  const [inspectedItem, setInspectedItem] = useState<
    { type: 'enzyme'; data: DetailedEnzyme } | { type: 'substrate'; data: DetailedSubstrate } | null
  >(null);

  const [activeTab, setActiveTab] = useState<'resumen' | 'combustibles' | 'enzimas' | 'puntos_clave'>('resumen');
  // Las herramientas de consulta se abren desde el menú superior (App controla cuál está abierta)
  const activeReferenceModal: 'none' | 'muscle_bioenergetics' | 'ampk_sensor' =
    activeTool === 'muscle_bioenergetics' || activeTool === 'ampk_sensor' ? activeTool : 'none';
  const setActiveReferenceModal = (_m: 'none') => onCloseTool?.();
  const showHormoneComparison = activeTool === 'hormones';

  const currentState = METABOLIC_STATES[selectedStateId];
  const activeOrganProfile = currentState.organProfiles[selectedOrganId];

  // The 8 metabolic states divided symmetrically into Left (Physiological & Fasting) and Right (Clinical & Exercise)
  // Situaciones fisiológicas (izquierda) y patológicas (derecha) alrededor del cuerpo
  const leftStates: { id: MetabolicStateId; label: string; time: string; badge: string; icon: React.ReactNode }[] = [
    { id: 'postprandial', label: 'Postprandial', time: '0 - 4h (Absortivo)', badge: 'Insulina alta · Anabolismo', icon: <SunMedium className="w-4 h-4 text-emerald-600" /> },
    { id: 'early_fasting', label: 'Ayuno', time: '4 - 16h (Nocturno)', badge: 'Glucogenólisis hepática', icon: <Moon className="w-4 h-4 text-amber-600" /> },
    { id: 'exercise_moderate', label: 'Ejercicio Moderado', time: 'Aeróbico (Sostenido)', badge: 'Beta-oxidación de AGL dominante', icon: <Sparkles className="w-4 h-4 text-blue-600" /> },
    { id: 'exercise_intense', label: 'Ejercicio Intenso', time: 'Anaeróbico (Potencia)', badge: 'Glucogenólisis & Ciclo de Cori', icon: <Zap className="w-4 h-4 text-indigo-600" /> }
  ];

  const rightStates: { id: MetabolicStateId; label: string; time: string; badge: string; icon: React.ReactNode }[] = [
    { id: 'late_fasting', label: 'Ayuno Tardío', time: '24 - 72h (Sin glucógeno)', badge: 'Gluconeogénesis & Cetonas', icon: <Flame className="w-4 h-4 text-orange-600" /> },
    { id: 'starvation', label: 'Inanición Extrema', time: '> 3 días (Ceto-adaptado)', badge: 'Ahorro proteico máximo', icon: <Compass className="w-4 h-4 text-rose-600" /> },
    { id: 'insulin_resistance', label: 'Resistencia a Insulina', time: 'Síndrome Metabólico', badge: 'Hiperinsulinemia compensatoria', icon: <AlertTriangle className="w-4 h-4 text-purple-600" /> },
    { id: 'diabetes_t1_dka', label: 'Diabetes (CAD)', time: 'Cetoacidosis Diabética', badge: 'Déficit absoluto de insulina', icon: <AlertTriangle className="w-4 h-4 text-red-600" /> }
  ];

  // Real-time behavior summary for each organ in the currently active state
  const getOrganStateBadge = (organId: OrganId, stateId: MetabolicStateId): { text: string; status: 'anabolic' | 'catabolic' | 'pathologic' | 'active' } => {
    switch (stateId) {
      case 'postprandial':
        switch (organId) {
          case 'liver': return { text: 'Glucogenogénesis ↑ · Lipogénesis de novo (DNL) ↑', status: 'anabolic' };
          case 'muscle': return { text: 'Captación GLUT4 ↑ · Síntesis de Glucógeno muscular', status: 'anabolic' };
          case 'adipose': return { text: 'Captación GLUT4 ↑ · Esterificación TAG (LPL activa)', status: 'anabolic' };
          case 'pancreas': return { text: 'Células β: Insulina ↑↑ · Células α: Glucagón ↓', status: 'anabolic' };
          case 'brain': return { text: 'Uso de Glucosa al 100% (GLUT3 y Hexoquinasa I)', status: 'active' };
          case 'heart': return { text: 'Oxidación de AGL (LPL activa) y Glucosa', status: 'active' };
          case 'kidney': return { text: 'Reabsorción tubular activa de Glucosa (SGLT2)', status: 'active' };
          case 'gut': return { text: 'Digestión & Absorción · Quilomicrones (ApoB-48) ↑', status: 'anabolic' };
          case 'erythrocyte': return { text: 'Glucólisis anaerobia pura → Vierte Lactato continuo', status: 'active' };
          case 'hypothalamus': return { text: 'Saciedad activa (POMC/CART) por Leptina e Insulina', status: 'anabolic' };
        }
        break;
      case 'early_fasting':
        switch (organId) {
          case 'liver': return { text: 'Glucogenólisis activa (1ª línea de defensa de glucemia)', status: 'catabolic' };
          case 'adipose': return { text: 'Lipólisis basal ↑ (Comienza liberación de AGL)', status: 'catabolic' };
          case 'muscle': return { text: 'Cae captación de glucosa · Empieza a usar AGL', status: 'catabolic' };
          case 'pancreas': return { text: 'Glucagón ↑ · Insulina en rango basal', status: 'catabolic' };
          case 'brain': return { text: 'Glucosa plasmática prioritaria (100%)', status: 'active' };
          case 'heart': return { text: 'Oxidación preferente de AGL circulantes', status: 'active' };
          case 'kidney': return { text: 'Beta-oxidación de AGL en la corteza renal', status: 'active' };
          case 'gut': return { text: 'En reposo absortivo interdigestivo', status: 'active' };
          case 'erythrocyte': return { text: 'Mantiene producción de Lactato para Ciclo de Cori', status: 'active' };
          case 'hypothalamus': return { text: 'Estímulo orexígeno inicial por Grelina estomacal', status: 'catabolic' };
        }
        break;
      case 'late_fasting':
        switch (organId) {
          case 'liver': return { text: 'Gluconeogénesis dominante (PEPCK ↑) · Inicio Cetogénesis', status: 'catabolic' };
          case 'adipose': return { text: 'Lipólisis intensa (HSL activa por PKA) · Exporta AGL y glicerol', status: 'catabolic' };
          case 'muscle': return { text: 'Proteólisis neta (exporta Alanina y Glutamina)', status: 'catabolic' };
          case 'pancreas': return { text: 'Ratio I/G muy bajo · Glucagón sostenido', status: 'catabolic' };
          case 'brain': return { text: 'Ahorro de glucosa · Inicia captación de cetonas (~25%)', status: 'active' };
          case 'heart': return { text: 'Quema AGL y Acetoacetato', status: 'active' };
          case 'kidney': return { text: 'Gluconeogénesis renal activa (~20% del aporte total)', status: 'catabolic' };
          case 'gut': return { text: 'Metabolismo basal de mantenimiento epitelial', status: 'active' };
          case 'erythrocyte': return { text: 'Consume glucosa fabricada por gluconeogénesis', status: 'active' };
          case 'hypothalamus': return { text: 'Hambre marcada: neuronas NPY/AgRP activadas', status: 'catabolic' };
        }
        break;
      case 'starvation':
        switch (organId) {
          case 'liver': return { text: 'Cetogénesis máxima ↑↑ · Freno gluconeogénico proteico', status: 'catabolic' };
          case 'adipose': return { text: 'Vaciado masivo de depósitos de TAG · Suministro continuo AGL', status: 'catabolic' };
          case 'muscle': return { text: 'Freno de proteólisis para preservar masa vital diafragmática', status: 'active' };
          case 'pancreas': return { text: 'Insulina en mínimo basal permisivo', status: 'catabolic' };
          case 'brain': return { text: 'Cuerpos Cetónicos (β-OHB y AcAc) cubren ~60-70% de la energía cerebral', status: 'active' };
          case 'heart': return { text: 'Combustible casi exclusivo: AGL (reduce el uso de cetonas)', status: 'active' };
          case 'kidney': return { text: 'Amoniogénesis renal ↑ (Excreta H+ como NH4+ amortiguado)', status: 'catabolic' };
          case 'gut': return { text: 'Gasto calórico reducido a la mínima expresión', status: 'active' };
          case 'erythrocyte': return { text: 'Consume el flujo residual obligatorio de glucosa', status: 'active' };
          case 'hypothalamus': return { text: 'Respuesta adaptativa a niveles casi nulos de leptina', status: 'catabolic' };
        }
        break;
      case 'insulin_resistance':
        switch (organId) {
          case 'liver': return { text: 'Paradoja: DNL activa (esteatosis) + Gluconeogénesis no se frena', status: 'pathologic' };
          case 'adipose': return { text: 'Lipólisis desinhibida → AGL elevados crónicos en sangre', status: 'pathologic' };
          case 'muscle': return { text: 'Fallo en translocación de GLUT4 → Captación defectuosa de glucosa', status: 'pathologic' };
          case 'pancreas': return { text: 'Hiperinsulinemia compensatoria · Fatiga progresiva de células β', status: 'pathologic' };
          case 'brain': return { text: 'Resistencia a insulina y leptina · Saciedad deficiente', status: 'pathologic' };
          case 'heart': return { text: 'Sobrecarga lipídica · Lipotoxicidad miocárdica', status: 'pathologic' };
          case 'kidney': return { text: 'Hiperfiltración glomerular temprana por hiperglucemia', status: 'pathologic' };
          case 'gut': return { text: 'Disbiosis y alteración del eje de incretinas (GLP-1)', status: 'pathologic' };
          case 'erythrocyte': return { text: 'Glicación no enzimática acelerada (HbA1c elevada)', status: 'pathologic' };
          case 'hypothalamus': return { text: 'Resistencia central a leptina perpetúa el apetito elevado', status: 'pathologic' };
        }
        break;
      case 'diabetes_t1_dka':
        switch (organId) {
          case 'liver': return { text: 'Cetogénesis desbocada · Malonil-CoA nulo (CPT-1 desinhibida)', status: 'pathologic' };
          case 'adipose': return { text: 'Lipólisis extrema incontrolada por ausencia total de insulina', status: 'pathologic' };
          case 'muscle': return { text: 'Proteólisis acelerada · Incapacidad total de captar glucosa', status: 'pathologic' };
          case 'pancreas': return { text: 'Destrucción autoinmune de células β (Insulina indetectable)', status: 'pathologic' };
          case 'brain': return { text: 'Vulnerable a hiperosmolaridad y edema en corrección rápida', status: 'pathologic' };
          case 'heart': return { text: 'Riesgo de arritmias por acidosis grave y desbalance de potasio', status: 'pathologic' };
          case 'kidney': return { text: 'Glucosuria + Cetonuria masiva → Diuresis osmótica y deshidratación', status: 'pathologic' };
          case 'gut': return { text: 'Dolor abdominal y vómitos inducidos por cetoacidosis', status: 'pathologic' };
          case 'erythrocyte': return { text: 'Alteración de 2,3-BPG y acidosis metabólica profunda (pH < 7.2)', status: 'pathologic' };
          case 'hypothalamus': return { text: 'Polifagia paradójica ante inanición a nivel celular', status: 'pathologic' };
        }
        break;
      case 'exercise_moderate':
        switch (organId) {
          case 'liver': return { text: 'Glucogenólisis y gluconeogénesis equiparadas al consumo', status: 'active' };
          case 'muscle': return { text: 'Beta-oxidación de AGL (~50-60%) + Glucosa aeróbica', status: 'active' };
          case 'adipose': return { text: 'Lipólisis estimulada por Catecolaminas (Adrenalina)', status: 'catabolic' };
          case 'heart': return { text: 'Gasto cardíaco multiplicado · Consume AGL y Lactato', status: 'active' };
          case 'pancreas': return { text: 'Insulina suprimida por receptores α2-adrenérgicos', status: 'catabolic' };
          case 'brain': return { text: 'Flujo sanguíneo preservado y aporte de glucosa óptimo', status: 'active' };
          case 'kidney': return { text: 'Vasoconstricción compensatoria para derivar flujo al músculo', status: 'active' };
          case 'gut': return { text: 'Reducción del flujo esplácnico para favorecer el lecho motor', status: 'active' };
          case 'erythrocyte': return { text: 'Efecto Bohr en capilares musculares (cede O2 fácilmente)', status: 'active' };
          case 'hypothalamus': return { text: 'Termorregulación y activación del sistema simpático', status: 'active' };
        }
        break;
      case 'exercise_intense':
        switch (organId) {
          case 'muscle': return { text: 'AMPK activa ↑ · Glucogenólisis masiva → Vierte Lactato ↑↑ (Cori)', status: 'active' };
          case 'liver': return { text: 'Reciclaje activo de Lactato a Glucosa (Ciclo de Cori hepático)', status: 'active' };
          case 'heart': return { text: 'Captación miocárdica prioritaria de Lactato como combustible', status: 'active' };
          case 'adipose': return { text: 'Flujo sanguíneo visceral muy restringido hacia extremidades', status: 'active' };
          case 'pancreas': return { text: 'Bloqueo adrenérgico total de la secreción de insulina', status: 'catabolic' };
          case 'brain': return { text: 'Captación de lactato arterial como combustible alternativo', status: 'active' };
          case 'kidney': return { text: 'Excreción activa de protones H+ para compensar la acidosis', status: 'active' };
          case 'gut': return { text: 'Derivación circulatoria máxima hacia la musculatura activa', status: 'active' };
          case 'erythrocyte': return { text: 'Transporte acelerado de CO2 y protones vía anhidrasa carbónica', status: 'active' };
          case 'hypothalamus': return { text: 'Descarga masiva de adrenalina, noradrenalina y cortisol', status: 'active' };
        }
        break;
    }
    return { text: 'Adaptación funcional coordinada', status: 'active' };
  };

  // Dedicated specialized synthesis from biochemistry syllabus
  const getOrganSpecializedSynthesis = (organId: OrganId) => {
    switch (organId) {
      case 'liver':
        return {
          title: 'Hígado: Central Glucostática, Ureogénesis y Lipogénesis',
          keyFeatures: [
            'Produce el 90% de la glucosa endógena por gluconeogénesis a partir de lactato, alanina y glicerol.',
            'Único órgano capaz de realizar cetogénesis cuantitativamente significativa (vía HMG-CoA sintasa mitocondrial).',
            'Único tejido especializado en síntesis de urea a partir de amonio libre tóxico (Ciclo de la Urea).',
            'Expresa Glucoquinasa (Km ~ 10 mM, sin inhibición por producto G6P) y Glucosa-6-fosfatasa microsomal.',
            'Vesícula Biliar: Almacena y concentra los ácidos y sales biliares sintetizados a partir del colesterol para emulsificar los lípidos en el duodeno.',
            'Metabolismo de Etanol: El exceso de NADH bloquea la gluconeogénesis al desviar piruvato a lactato y oxalacetato a malato, e inhibe la β-oxidación favoreciendo la esteatosis.',
            'Ácidos biliares: la 7-α-hidroxilasa (enzima limitante) convierte el colesterol en ácidos biliares primarios, que se conjugan con glicina o taurina.',
            'Detoxificación: conjuga fármacos y compuestos hidrófobos endógenos con ácido glucurónico (reacciones de fase 2).',
            'Catabolismo de purinas: la xantina oxidasa convierte hipoxantina y xantina en ácido úrico, que se excreta por el riñón.',
            'Fructosa: la fructoquinasa hepática fosforila la fructosa de la dieta a fructosa-1-P, que entra en la glucólisis sin pasar por la PFK-1.',
            'Síntesis de proteínas plasmáticas (albúmina, factores de coagulación, apolipoproteínas) y exportación de VLDL y HDL.'
          ]
        };
      case 'muscle':
        return {
          title: 'Músculo Esquelético: Trabajo Mecánico y Reserva Proteica',
          keyFeatures: [
            '¡CRÍTICO!: Carece funcionalmente de receptores de glucagón (su glucogenólisis sólo responde a Adrenalina vía β2 y a Ca2+/AMP intracelular).',
            'Alberga la mayor reserva proteica corporal (~6 kg de proteínas miofibrilares en 70 kg).',
            'Fibras Tipo IIx (rápidas; en humanos apenas hay IIb): Glucólisis anaerobia veloz generando lactato (LDH) para el Ciclo de Cori.',
            'Fibras Tipo I (lentas): Altas mitocondrias y mioglobina; beta-oxidación de ácidos grasos y fosforilación oxidativa.',
            'Exportación de alanina hacia el hígado en el Ciclo Glucosa-Alanina (Cahill).'
          ]
        };
      case 'heart':
        return {
          title: 'Músculo Cardíaco & Aorta: Bomba Aeróbica Continua No Fatigable',
          keyFeatures: [
            'Oxida preferentemente ácidos grasos libres (60-80%), suplementado con lactato, cuerpos cetónicos y glucosa.',
            'Expresa constitutivamente en su lecho capilar la Lipoproteína Lipasa (LPL) con alta afinidad.',
            'Isoforma Cardíaca de PFK-2: Fosforilada por AMPK (Ser-466) activando la quinasa, elevando F-2,6-BP y acelerando la glucólisis para sostener la contracción.',
            'Aorta y Grandes Vasos: Conducen el volumen sistólico pulsátil distribuyendo nutrientes y hormonas a la circulación sistémica.'
          ]
        };
      case 'adipose':
        return {
          title: 'Tejido Adiposo (Visceral y Subcutáneo): Reserva Energética Mayoritaria',
          keyFeatures: [
            'Almacena ~15 kg de triacilgliceroles en un adulto de 70 kg (~135,000 kcal de combustible concentrado anhidro).',
            'Tejido Adiposo Visceral (Mesentérico): Altamente lipolítico y sensible a catecolaminas; vierte ácidos grasos libres directamente a la vena porta hepática.',
            'Tejido Adiposo Subcutáneo: Mayor masa total, tasa de recambio basal más estable y función de aislamiento térmico.',
            'Carece de Glicerol Quinasa funcional: Requiere captar glucosa vía GLUT4 para generar dihidroxiacetona fosfato y reducirla a glicerol-3-P para poder esterificar.',
            'Control Lipolítico: LPL endotelial inducible por insulina; Lipasa sensible a hormonas (HSL) y ATGL activadas por PKA en ayuno.'
          ]
        };
      case 'erythrocyte':
        return {
          title: 'Eritrocitos & Lecho Arterial: Transporte de O2 y Glucólisis Anaerobia Obligada',
          keyFeatures: [
            'Carecen de mitocondrias y núcleo; producen ATP exclusivamente por glucólisis anaerobia (Embden-Meyerhof) vertiendo lactato continuo al Ciclo de Cori.',
            'Pared Arterial: Endotelio y túnica muscular lisa que responden a óxido nítrico y endotelina para regular la resistencia vascular periférica.',
            'Derivan ~10% de glucosa-6-P a la vía de las pentosas fosfato (G6PD) para generar NADPH.',
            'El NADPH mantiene el glutatión reducido (GSH vía glutatión reductasa), neutralizando especies reactivas de oxígeno (ERO) y evitando la hemólisis.'
          ]
        };
      case 'pancreas':
        return {
          title: 'Páncreas Endocrino: Islotes de Langerhans & Sensores de Glucemia',
          keyFeatures: [
            'Células β: GLUT1 en humanos (GLUT2 en roedores) + Glucoquinasa como sensor glucostático. El aumento de ATP cierra canales K_ATP, despolariza la membrana y desata la exocitosis de Insulina.',
            'Células α: Secretan Glucagón cuando la glucosa plasmática desciende de 70 mg/dL.',
            'Interruptores moleculares: La Insulina activa la Proteína Fosfatasa 1 (PP1 - desfosforilación); el Glucagón activa la Proteína Quinasa A (PKA - fosforilación).'
          ]
        };
      case 'gut':
        return {
          title: 'Estómago & Intestinos: Digestión, Absorción de Macronutrientes e Incretinas',
          keyFeatures: [
            'Estómago: Desnaturalización ácida y digestión peptídica por pepsina; secreta Grelina en ayuno para estimular neuronas orexígenas hipotalámicas.',
            'Intestino Delgado: Absorción de glucosa y galactosa vía SGLT1 (simporte Na+) y GLUT2 basolateral; absorción de fructosa vía GLUT5.',
            'Lípidos: Reesterificación en enterocitos y secreción de Quilomicrones con ApoB-48 hacia la linfa mesentérica.',
            'Células enteroendocrinas L y K: Secretan GLP-1 y GIP estimuladas por nutrientes, potenciando de forma anticipada la secreción de insulina.'
          ]
        };
      case 'kidney':
        return {
          title: 'Riñón: Compartimentación Corteza vs Médula y Amoniogénesis',
          keyFeatures: [
            'Corteza Renal: Muy aeróbica; beta-oxidación activa de ácidos grasos y lactato; gluconeogénesis activa (PEPCK, G6Pasa); aporta hasta 45-50% de la glucosa en ayuno prolongado.',
            'Médula Renal: Vasos rectos en horquilla con baja pO2; glucólisis anaerobia obligada estricta.',
            'Amoniogénesis Renal: la glutaminasa hidroliza glutamina a glutamato + NH4+, y la glutamato deshidrogenasa libera otro NH4+ y α-cetoglutarato (para gluconeogénesis, consumiendo H+ y generando HCO3-); NH4+ se secreta por NHE3 eliminando protones sin recargar la urea hepática.'
          ]
        };
      case 'brain':
        return {
          title: 'Cerebro / SNC: Consumo de Oxígeno (20%) y Potenciales de Membrana',
          keyFeatures: [
            'Representa el 2% del peso pero consume ~20% del O2 basal (mantenimiento de gradientes iónicos por la Na+/K+-ATPasa).',
            'Transportadores GLUT1 (barrera hematoencefálica) y GLUT3 neuronal de muy alta afinidad (Km ~1.5 mM); Hexoquinasa I (Km ~ 0.05 mM).',
            'Impermeable a lipoproteínas plasmáticas. Los ácidos grasos sí cruzan la BHE, pero el cerebro apenas los oxida (baja capacidad de β-oxidación neuronal).',
            'En ayuno prolongado aumenta la captación de cuerpos cetónicos (MCT1) y cubre ~60-70% de su gasto con β-hidroxibutirato y acetoacetato.',
            'Carece de reservas significativas de glucógeno: depende del aporte continuo de glucosa sanguínea.',
            'Alta actividad de descarboxilasas de aminoácidos para sintetizar neurotransmisores (GABA a partir de glutamato, dopamina a partir de tirosina).',
            'Excepción del desarrollo: el cerebro neonatal e infantil importa activamente ácidos grasos poliinsaturados de cadena larga (DHA) para construir las membranas neuronales.'
          ]
        };
      case 'hypothalamus':
        return {
          title: 'Hipotálamo (Núcleo Arcuato ARC): Control Neuroendocrino del Apetito',
          keyFeatures: [
            'Circuito Orexígeno (Hambre): Grelina estomacal en ayuno activa neuronas NPY/AgRP; el AgRP actúa como antagonista competitivo de MC4R estimulando la ingesta.',
            'Circuito Anorexígeno (Saciedad): Leptina (adipocito) e Insulina (páncreas) activan neuronas POMC/CART, que liberan α-MSH sobre MC4R induciendo saciedad; el PYY (íleon) inhibe las neuronas NPY/AgRP vía receptores Y2.',
            'En obesidad y resistencia a la insulina, la resistencia central a leptina bloquea la señal de saciedad.'
          ]
        };
      default:
        return {
          title: 'Tejido Metabólico Integrado',
          keyFeatures: ['Coordinación funcional regulada por señalización endocrina y carga energética celular.']
        };
    }
  };

  const organSpecialized = getOrganSpecializedSynthesis(selectedOrganId);
  const currentOrganBadge = getOrganStateBadge(selectedOrganId, selectedStateId);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloadedNotice, setPdfDownloadedNotice] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await new Promise(resolve => setTimeout(resolve, 60));
      generateOrganPdf({
        organSpecialized,
        activeOrganProfile,
        currentState,
        organStateBadgeText: currentOrganBadge.text,
      });
      setPdfDownloadedNotice(true);
      setTimeout(() => setPdfDownloadedNotice(false), 4000);
    } catch (err) {
      console.error('Error al generar PDF de ideas clave:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Standalone organs ordered list
  const organsList: { id: OrganId; name: string; category: string }[] = [
    { id: 'liver', name: 'Hígado & Vesícula', category: 'Central Metabólica' },
    { id: 'heart', name: 'Corazón & Aorta', category: 'Circulación Sistémica' },
    { id: 'pancreas', name: 'Páncreas Endocrino', category: 'Regulador Insulina / Glucagón' },
    { id: 'adipose', name: 'Tejido Adiposo', category: 'Visceral y Subcutáneo' },
    { id: 'muscle', name: 'Músculo Esquelético', category: 'Trabajo & Reserva Proteica' },
    { id: 'kidney', name: 'Riñón', category: 'Gluconeogénesis & pH' },
    { id: 'gut', name: 'Estómago & Intestinos', category: 'Digestión & Incretinas' },
    { id: 'erythrocyte', name: 'Eritrocitos & Vasos', category: 'Glucólisis Anaerobia / Cori' },
    { id: 'brain', name: 'Cerebro (SNC)', category: 'Metabolismo Cerebral' },
    { id: 'hypothalamus', name: 'Hipotálamo (ARC)', category: 'Control Apetito / Saciedad' }
  ];

  const [organPanelOpen, setOrganPanelOpen] = useState(false);
  const [situationView, setSituationView] = useState<'organs' | 'pathways' | 'substrates'>('organs');
  const handleOrganClick = (organId: OrganId) => {
    onSelectOrgan(organId);
    setActiveTab('resumen');
    setOrganPanelOpen(true);
  };
  useEffect(() => {
    if (!organPanelOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !inspectedItem) setOrganPanelOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [organPanelOpen, inspectedItem]);

  return (
    <div className="space-y-6">
      {/* Balance insulina / glucagón de la situación activa (se abre desde el menú superior) */}
      {showHormoneComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" onClick={() => onCloseTool?.()}>
          <div className="max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
            <HormoneRatioVisualizer currentState={currentState} onClose={() => onCloseTool?.()} />
          </div>
        </div>
      )}

      {!situationChosen ? (
        /* PASO 1: ELEGIR LA SITUACIÓN */
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900">Elige una situación metabólica</h1>
            <p className="text-sm text-slate-600">
              Dentro de cada situación verás la adaptación de los órganos, las rutas con sus interruptores y los sustratos en sangre comparados con las demás situaciones, y podrás estudiar el balance insulina/glucagón, la bioenergética muscular y la AMPK.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { title: 'Situaciones fisiológicas', subtitle: 'Comida, ayuno nocturno y ejercicio', states: leftStates, accent: 'emerald' },
              { title: 'Situaciones patológicas', subtitle: 'Ayuno prolongado, inanición y alteraciones de la insulina', states: rightStates, accent: 'rose' },
            ].map((group) => (
              <section key={group.title} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                <div>
                  <h2 className={`text-sm font-extrabold uppercase tracking-wider ${group.accent === 'emerald' ? 'text-emerald-700' : 'text-rose-700'}`}>{group.title}</h2>
                  <p className="text-xs text-slate-500">{group.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.states.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => onSelectState(st.id)}
                      className="p-4 rounded-2xl border border-slate-200 bg-white text-left hover:border-teal-400 hover:shadow-md transition-all flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-teal-100 transition-colors shrink-0">{st.icon}</div>
                        <div className="min-w-0">
                          <span className="text-sm font-bold text-slate-900 block leading-tight">{st.label}</span>
                          <span className="text-[11px] text-slate-500">{st.time}</span>
                        </div>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-snug line-clamp-3">{METABOLIC_STATES[st.id].summary}</p>
                      <span className="text-[11px] font-bold text-teal-700 flex items-center gap-1 mt-auto">
                        Entrar <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : (
        /* PASO 2: DENTRO DE LA SITUACIÓN */
        <div className="space-y-4">
          {(() => {
            const all = [...leftStates, ...rightStates];
            const st = all.find((x) => x.id === selectedStateId)!;
            const isPatho = rightStates.some((x) => x.id === selectedStateId);
            return (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 shrink-0">{st.icon}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-extrabold text-slate-900">{currentState.title}</h1>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${isPatho ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                          {isPatho ? 'Patológica' : 'Fisiológica'}
                        </span>
                        <span className="text-[11px] text-slate-500">{st.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">{currentState.summary}</p>
                    </div>
                  </div>
                  <button
                    onClick={onChangeSituation}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 shrink-0 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Cambiar de situación</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mr-1">Estudiar en esta situación:</span>
                  {[
                    { id: 'hormones' as ReferenceTool, label: 'Insulina vs. glucagón', icon: <Scale className="w-4 h-4" /> },
                    { id: 'muscle_bioenergetics' as ReferenceTool, label: 'Bioenergética muscular', icon: <Timer className="w-4 h-4" /> },
                    { id: 'ampk_sensor' as ReferenceTool, label: 'Sensor AMPK', icon: <Zap className="w-4 h-4" /> },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onOpenTool?.(t.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors cursor-pointer"
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 sm:p-5 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
              <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                {([
                  { id: 'organs', label: 'Adaptación de los órganos', icon: <LayoutGrid className="w-4 h-4" /> },
                  { id: 'pathways', label: 'Rutas e interruptores', icon: <ArrowLeftRight className="w-4 h-4" /> },
                  { id: 'substrates', label: 'Sustratos en sangre', icon: <Droplet className="w-4 h-4" /> },
                ] as const).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSituationView(v.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      situationView === v.id ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {v.icon}
                    <span>{v.label}</span>
                  </button>
                ))}
              </div>
              {situationView === 'organs' && (
                <span className="text-[11px] text-slate-500">Pulsa un órgano para ver sus enzimas y vías en detalle.</span>
              )}
            </div>
            {situationView === 'organs' ? (
              <BodyMetabolicMap
                stateId={selectedStateId}
                getOrganStateBadge={getOrganStateBadge}
                selectedOrganId={selectedOrganId}
                onOrganClick={handleOrganClick}
              />
            ) : situationView === 'pathways' ? (
              <MetabolicPathwaysView stateId={selectedStateId} />
            ) : (
              <SubstrateComparisonCharts stateId={selectedStateId} onSelectState={onSelectState} />
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ORDERED, CLEAN & STRUCTURED ORGAN INFORMATION PANEL (PROGRESSIVE DISCLOSURE)
         ========================================================================= */}
      {organPanelOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs" onClick={() => setOrganPanelOpen(false)}>
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6 space-y-5 max-w-5xl w-full max-h-[88vh] overflow-y-auto custom-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex justify-end -mt-2 -mb-3 pointer-events-none">
          <button
            onClick={() => setOrganPanelOpen(false)}
            className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Header of Inspector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-extrabold text-slate-900">
                {organSpecialized.title}
              </h3>
              <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100 border border-teal-200 px-2.5 py-0.5 rounded-full">
                Situación: {currentState.title}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              {activeOrganProfile?.roleSummary}
            </p>
          </div>

          {/* Action & Navigation Bar */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 shadow-2xs hover:shadow-xs transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Descargar ideas clave y resumen en PDF para apuntes"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-teal-800 border-t-transparent rounded-full animate-spin" />
                  <span>Generando...</span>
                </>
              ) : pdfDownloadedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¡PDF Guardado!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-teal-700" />
                  <span>Descargar PDF</span>
                </>
              )}
            </button>

            {/* Clean Navigation Tabs for the Organ Panel (Orderly, not overloaded) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs shrink-0">
              <button
                onClick={() => setActiveTab('resumen')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'resumen'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. Resumen
              </button>
              <button
                onClick={() => setActiveTab('combustibles')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'combustibles'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. Combustibles
              </button>
              <button
                onClick={() => setActiveTab('enzimas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'enzimas'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3. Enzimas Clave
              </button>
              <button
                onClick={() => setActiveTab('puntos_clave')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeTab === 'puntos_clave'
                    ? 'bg-white text-teal-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4. Puntos Críticos
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: RESUMEN Y ESPECIALIZACIÓN */}
        {activeTab === 'resumen' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Real-time Flux Summary Badge */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold text-teal-900 uppercase tracking-wider block">
                  Comportamiento Bioquímico en {currentState.title}:
                </span>
                <span className="text-sm font-extrabold text-teal-950 mt-0.5 block">
                  {currentOrganBadge.text}
                </span>
              </div>
              <div className="text-xs text-teal-800 bg-white px-3 py-1.5 rounded-xl border border-teal-200 font-semibold shadow-2xs">
                Estrategia ATP: <strong>{activeOrganProfile?.atpGenerationStrategy}</strong>
              </div>
            </div>

            {/* 2 Clean Cards: Vías Activas vs Vías Reprimidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Vías Metabólicas Activas / Promovidas:</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {activeOrganProfile?.activePathways.map((pathway, idx) => {
                    const termId = matchGlossaryTermId(pathway);
                    return (
                      <li key={idx} className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-slate-200/80">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span className="font-medium">{pathway}</span>
                        </div>
                        {termId && onOpenGlossary && (
                          <button
                            onClick={() => onOpenGlossary(termId)}
                            className="text-[10px] font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                            title="Ver definición y mecanismo en Glosario Bioquímico"
                          >
                            <BookOpen className="w-3 h-3 text-teal-700" />
                            <span>Glosario</span>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-extrabold text-rose-800 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Vías Metabólicas Reprimidas / Inhibidas:</span>
                </span>
                {activeOrganProfile?.inhibitedPathways && activeOrganProfile.inhibitedPathways.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeOrganProfile.inhibitedPathways.map((pathway, idx) => {
                      const termId = matchGlossaryTermId(pathway);
                      return (
                        <li key={idx} className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-slate-200/80">
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                            <span className="font-medium">{pathway}</span>
                          </div>
                          {termId && onOpenGlossary && (
                            <button
                              onClick={() => onOpenGlossary(termId)}
                              className="text-[10px] font-bold text-teal-800 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                              title="Ver definición y mecanismo en Glosario Bioquímico"
                            >
                              <BookOpen className="w-3 h-3 text-teal-700" />
                              <span>Glosario</span>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-500">
                    No hay vías críticas reprimidas cuantitativamente en este estado.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMBUSTIBLES (ENTRADAS VS SALIDAS) */}
        {activeTab === 'combustibles' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Entradas */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider">
                    Combustible Captado del Torrente Sanguíneo
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-200/80 text-sm font-bold text-slate-900">
                  {activeOrganProfile?.primaryFuelUsed}
                </div>
                <p className="text-xs text-slate-600">
                  Extraído del lecho capilar en función del balance hormonal y la densidad de transportadores membranales.
                </p>
                <div className="pt-2 border-t border-blue-200/60 flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Transportadores Activos:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeOrganProfile?.transportersActive.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salidas / Exportación */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                    Sustratos Producidos o Exportados a la Circulación
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200/80 text-sm font-bold text-slate-900">
                  {activeOrganProfile?.fuelProducedOrExported}
                </div>
                <p className="text-xs text-slate-600">
                  Permite alimentar a tejidos periféricos dependientes o eliminar subproductos del catabolismo (urea, CO2, lactato).
                </p>
                <div className="pt-2 border-t border-amber-200/60 text-xs text-slate-600">
                  <strong>Estrategia Energética:</strong> {activeOrganProfile?.atpGenerationStrategy}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENZIMAS E INTERRUPTORES BIOQUÍMICOS */}
        {activeTab === 'enzimas' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                Enzimas Reguladoras Clave & Interruptores Alostéricos en {activeOrganProfile?.organName}:
              </span>
              <span className="text-[11px] text-slate-500">
                Haz clic en cualquier enzima para ver su ficha molecular
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeOrganProfile?.keyEnzymes.map((enz, idx) => {
                const isAct = enz.status === 'activa' || enz.status === 'muy_activa';
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl text-xs space-y-2 transition-colors cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm group-hover:text-teal-800">
                          {enz.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] font-bold">
                          {enz.abbreviation}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isAct
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {enz.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>📍 {enz.cellularLocation}</span>
                      <span>·</span>
                      <span>🧬 {enz.pathway}</span>
                    </div>

                    <p className="text-[11.5px] text-slate-700 leading-snug bg-white p-2.5 rounded-xl border border-slate-200/70">
                      {enz.mechanism}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PUNTOS CRÍTICOS & RIGOR DE EXAMEN */}
        {activeTab === 'puntos_clave' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-teal-950 uppercase tracking-wider block">
                  Ideas clave de este órgano:
                </span>
                <p className="text-xs text-slate-700">
                  Puntos de integración y conceptos fundamentales de su función metabólica para examen y estudio:
                </p>
              </div>

              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-teal-800 hover:bg-teal-900 text-white shadow-xs hover:shadow transition-all active:scale-95 shrink-0 disabled:opacity-60 cursor-pointer"
                title="Generar y descargar archivo PDF de apuntes con las ideas clave"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generando PDF...</span>
                  </>
                ) : pdfDownloadedNotice ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>¡PDF Guardado con Éxito!</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-teal-200" />
                    <span>Descargar Ideas Clave (PDF)</span>
                  </>
                )}
              </button>
            </div>

            {pdfDownloadedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  El resumen en PDF de <strong>{organSpecialized.title}</strong> se ha descargado correctamente en tu dispositivo para tus apuntes.
                </span>
              </div>
            )}

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              {organSpecialized.keyFeatures.map((feat, idx) => (
                <li key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5 hover:bg-white hover:border-teal-200 transition-colors">
                  <span className="text-teal-700 font-bold text-sm shrink-0">✦</span>
                  <span className="leading-relaxed font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </div>
      )}

      {/* =========================================================================
          REFERENCE MODALS (RESERVES, BIOENERGETICS, AMPK, HYPOTHALAMUS)
         ========================================================================= */}

      {activeReferenceModal === 'muscle_bioenergetics' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-6 relative">
            <div className="sticky top-0 z-10 flex justify-end -mt-2 mb-1 pointer-events-none">
              <button
                onClick={() => setActiveReferenceModal('none')}
                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-extrabold text-slate-900">
                Bioenergética Cronológica de la Contracción Muscular (0s a &gt;3min)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              Durante la actividad muscular, el miocito activa de forma secuencial cuatro sistemas energéticos:
            </p>
            <div className="space-y-3">
              {MUSCLE_BIOENERGETICS_CHRONOLOGY.map((mb, i) => (
                <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{mb.phase}</span>
                    <span className="font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {mb.duration}
                    </span>
                  </div>
                  <div className="text-slate-700">
                    <strong>Sistema:</strong> {mb.system} · <strong>Enzima:</strong> {mb.enzyme}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    <strong>Velocidad:</strong> {mb.rateOfATP} | <strong>Factor Limitante:</strong> {mb.limitingFactor}
                  </div>
                  <div className="text-teal-900 text-[11px] pt-1 border-t border-slate-200/60">
                    <strong>Ejemplos:</strong> {mb.examples}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeReferenceModal === 'ampk_sensor' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar p-6 relative">
            <div className="sticky top-0 z-10 flex justify-end -mt-2 mb-1 pointer-events-none">
              <button
                onClick={() => setActiveReferenceModal('none')}
                className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-bold shadow-md hover:bg-slate-700 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-teal-700" />
              <h3 className="text-base font-extrabold text-slate-900">
                La Proteína Quinasa Activada por AMP (AMPK): Sensor Maestro Energético
              </h3>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1">
                <span className="font-bold text-teal-950 block">Mecanismo Molecular:</span>
                <p className="leading-relaxed text-[11px]">{AMPK_REGULATORY_DETAILS.sensorMechanism}</p>
                <div className="font-mono font-bold text-teal-900 text-[11px] mt-1">
                  {AMPK_REGULATORY_DETAILS.energyChargeFormula}
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="font-bold text-slate-900 block">Freno Estérico por Glucógeno & Fosfocreatina:</span>
                <p className="leading-relaxed text-[11px]">{AMPK_REGULATORY_DETAILS.glycogenBrake}</p>
                <p className="leading-relaxed text-[11px] text-slate-500">{AMPK_REGULATORY_DETAILS.phosphocreatineInhibition}</p>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 block">Efectos Específicos por Tejido:</span>
                {AMPK_REGULATORY_DETAILS.tissueEffects.map((eff, i) => (
                  <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-xl text-[11px]">
                    <strong className="text-teal-800">{eff.organ}:</strong> {eff.action}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modal Inspector for clicked Enzyme or Substrate */}
      <BiochemicalInspectorModal
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
      />
    </div>
  );
};
