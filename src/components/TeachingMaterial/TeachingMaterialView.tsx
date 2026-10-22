import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  ExternalLink, 
  BookmarkCheck, 
  ChevronRight, 
  Sparkles, 
  Award,
  Layers,
  Search,
  BookMarked,
  FlaskConical,
  RefreshCw,
  Droplets,
  Calendar,
  Dna,
  Network
} from 'lucide-react';
import { RandleCycleLab } from '../InteractiveLabs/RandleCycleLab';
import { JaundiceSimulatorLab } from '../InteractiveLabs/JaundiceSimulatorLab';
import { HemostasisLab } from '../InteractiveLabs/HemostasisLab';
import { CarnitineShuttleLab } from '../InteractiveLabs/CarnitineShuttleLab';
import { MetabolicIntegrationLab } from '../MetabolicIntegration/MetabolicIntegrationLab';
import { PracticasSeminariosView } from '../PracticasSeminarios/PracticasSeminariosView';
import { VademecumView } from './VademecumView';
import { ActiveModule } from '../../types';

export interface TeachingMaterialViewProps {
  initialTab?: 'temario' | 'vademecum' | 'practicas-seminarios' | 'simuladores' | 'autoevaluacion' | 'bibliografia' | 'guia';
  onNavigate?: (module: ActiveModule) => void;
}

interface SyllabusTopic {
  number: number;
  title: string;
  description: string;
}

const OFFICIAL_SYLLABUS: SyllabusTopic[] = [
  {
    number: 1,
    title: "Introducción a la Bioquímica Médica",
    description: "Homeostasis metabólica. Importancia en Medicina de la Bioquímica y la Bioquímica Clínica."
  },
  {
    number: 2,
    title: "Comunicación celular",
    description: "Principios generales de señalización celular. Receptores de membrana. Receptores acoplados a canal. Receptores tirosinquinasa. Otros receptores. Receptores intracelulares."
  },
  {
    number: 3,
    title: "Digestión, transporte y absorción de nutrientes",
    description: "Hidratos de carbono. Lípidos. Proteínas."
  },
  {
    number: 4,
    title: "Actividad física",
    description: "Bases moleculares de la contracción muscular. Recursos energéticos generales del músculo. Demanda energética muscular en función del tipo y nivel de esfuerzo."
  },
  {
    number: 5,
    title: "Características del metabolismo de hidratos de carbono en músculo esquelético",
    description: "Glucolisis. Regulación metabólica y hormonal."
  },
  {
    number: 6,
    title: "Control metabólico, hormonal y nervioso de la glucogenolisis y glucogenosíntesis muscular",
    description: "Mecanismos y cascadas de señalización en la regulación del glucógeno muscular."
  },
  {
    number: 7,
    title: "Características especiales del metabolismo aerobio muscular",
    description: "Regulación de la oxidación de hidratos de carbono y ácidos grasos. Bases bioquímicas de la fatiga muscular."
  },
  {
    number: 8,
    title: "Localización estratégica y papel funcional del hígado en relación con el metabolismo de la glucosa",
    description: "Panorama general de la utilización de hidratos de carbono en hígado. Características especiales. Regulación de la captación y liberación de glucosa. Control hormonal del metabolismo del glucógeno."
  },
  {
    number: 9,
    title: "Gluconeogénesis hepática",
    description: "Importancia fisiológica. Control metabólico y control hormonal. Hiperglucemia: Diabetes. Hipoglucemias."
  },
  {
    number: 10,
    title: "Metabolismo hepático de otros hidratos de carbono",
    description: "Galactosa y fructosa: Importancia clínica y errores congénitos del metabolismo. Metabolismo del etanol. Importancia clínica."
  },
  {
    number: 11,
    title: "Generalidades del metabolismo de los lípidos",
    description: "Visión general de los principales órganos implicados en el metabolismo lipídico (adiposo blanco y marrón, hígado y muscular). Funciones específicas de los lípidos e importancia fisiológica."
  },
  {
    number: 12,
    title: "Transporte de lípidos en medio acuoso. Lipoproteínas",
    description: "Clasificación, composición y estructura. Metabolismo de lipoproteínas. Dislipemias. Aterogénesis."
  },
  {
    number: 13,
    title: "Regulación del metabolismo esteroideo",
    description: "Regulación del metabolismo de eicosanoides."
  },
  {
    number: 14,
    title: "Lípidos endógenos: Movilización de los triglicéridos del tejido adiposo",
    description: "Regulación hormonal. Patología relacionada con la oxidación de ácidos grasos. Cuerpos cetónicos: regulación e importancia fisiológica y clínica."
  },
  {
    number: 15,
    title: "Lipogénesis",
    description: "Regulación de la síntesis de ácidos grasos. Regulación conjunta de lipogénesis/lipolisis. Ciclo de Randle."
  },
  {
    number: 16,
    title: "Metabolismo de los aminoácidos",
    description: "Reacciones generales. Transaminación. Desaminación oxidativa. Ciclo de la urea. Significación clínica."
  },
  {
    number: 17,
    title: "Destino del esqueleto carbonado de los aminoácidos",
    description: "Alteraciones del metabolismo de aminoácidos. Decarboxilación de aminoácidos. Aminas biógenas. Poliaminas."
  },
  {
    number: 18,
    title: "Metabolismo de neurotransmisores",
    description: "Síntesis y degradación. Receptores. Acetil-Colina. Neuropéptidos. Endocannabinoides. Otros."
  },
  {
    number: 19,
    title: "Metabolismo de Nucleótidos",
    description: "Síntesis, degradación y vías de recuperación de purinas y pirimidinas. Hiperuricemias. Síntesis de desoxirrbonucleótidos."
  },
  {
    number: 20,
    title: "La sangre",
    description: "Composición y características generales. Componentes orgánicos e inorgánicos. Proteínas plasmáticas. Enzimas en el plasma y su valor clínico."
  },
  {
    number: 21,
    title: "Metabolismo del hematíe",
    description: "Consideraciones especiales. Glucolisis y utilización del ATP en el transporte de iones. Derivación del 2,3-bisfosfoglicerato, Importancia fisiológica de la ruta del fosfogluconato. Papel del NADPH y del glutatión. Alteraciones del metabolismo del hematíe."
  },
  {
    number: 22,
    title: "La hemoglobina. Biosíntesis del hemo",
    description: "Alteraciones del metabolismo de las porfirinas. Porfirias. Hemoglobinas anormales: Talasemias y anemia falciforme."
  },
  {
    number: 23,
    title: "Degradación de la hemoglobina",
    description: "Formación, transporte, captación y excreción de bilirrubina. Hiperbilirrubinemias. Valor e importancia clínica."
  },
  {
    number: 24,
    title: "Metabolismo del hierro",
    description: "Requerimientos y pérdida de hierro. Absorción, transporte, almacenamiento, utilización y excreción. Mecanismos y control. Alteraciones del metabolismo del hierro. Hemosiderosis y Hemocromatosis. Bases moleculares de la anemia falciforme y otras anemias."
  },
  {
    number: 25,
    title: "Hemostasia y coagulación",
    description: "Bases moleculares de la agregación plaquetaria. Bioquímica de la coagulación."
  },
  {
    number: 26,
    title: "Fibrinólisis",
    description: "Bases bioquímicas de las alteraciones de la coagulación. Hemofilias. Valoración de la coagulación y anticoagulantes."
  },
  {
    number: 27,
    title: "Integración metabólica",
    description: "Adaptación a situaciones metabólicas especiales. Ayuno y ejercicio. Estrés."
  }
];

interface QuizItem {
  id: number;
  question: string;
  module: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

const QUIZ_QUESTIONS: QuizItem[] = [
  {
    id: 1,
    question: "En un paciente con dolor torácico opresivo de 1 hora de evolución, ¿cuál es la razón bioquímica por la cual la Troponina Ultrasensible (hs-cTn) es superior a la Mioglobina y a la CK-MB?",
    module: "Módulo I / IV",
    options: [
      "A) Porque la troponina es una enzima citosólica de bajo peso molecular que difunde rápidamente a través de la membrana sin ruptura celular.",
      "B) Porque la troponina cardioespecífica posee isoformas codificadas por genes exclusivos del miocito cardíaco con una sensibilidad analítica y especificidad de tejido casi absolutas.",
      "C) Porque la troponina sérica se sintetiza de novo en el endotelio coronario tras la isquemia aguda.",
      "D) Porque la semivida plasmática de la troponina es de apenas 15 minutos, normalizándose antes que la CK-MB."
    ],
    correctIndex: 1,
    rationale: "Las troponinas cardíacas I y T (cTnI y cTnT) presentan isoformas estructurales codificadas por genes exclusivos del cardiomiocito, lo que les confiere una especificidad cardíaca prácticamente del 100%, a diferencia de la mioglobina o la CK-MB que pueden elevarse por traumatismo muscular esquelético."
  },
  {
    id: 2,
    question: "¿Qué alteración enzimática explica la hiperbilirrubinemia indirecta leve y benigna observada en el Síndrome de Gilbert?",
    module: "Módulo IV",
    options: [
      "A) Mutación en el promotor del gen UGT1A1 (inserción TATAA) que reduce la transcripción y actividad de la UDP-glucuronosiltransferasa hepática.",
      "B) Deficiencia en el transportador canalicular de aniones orgánicos multiespecíficos MRP2.",
      "C) Déficit congénito de la biliverdina reductasa eritrocitaria.",
      "D) Bloqueo completo e irreversible de la secreción biliar con destrucción de canalículos."
    ],
    correctIndex: 0,
    rationale: "El Síndrome de Gilbert se debe principalmente a un polimorfismo en la región promotora TATA del gen UGT1A1 (alelo A(TA)7TAA en lugar de A(TA)6TAA), que reduce la expresión de la UDP-glucuronosiltransferasa a aproximadamente el 30% del nivel normal, produciendo hiperbilirrubinemia no conjugada fluctuante en situaciones de ayuno o estrés."
  },
  {
    id: 3,
    question: "En la cetoacidosis diabética no controlada, ¿cuál es el mecanismo bioquímico que dispara la síntesis hepática masiva de cuerpos cetónicos?",
    module: "Módulo II / III",
    options: [
      "A) Activación de la glucógeno sintasa por hiperinsulinemia relativa.",
      "B) Bloqueo de la lipólisis que acumula glicerol en el tejido adiposo.",
      "C) Déficit absoluto de insulina con aumento de glucagón, lipólisis desmedida que satura la beta-oxidación hepática con exceso de Acetil-CoA y agotamiento de oxalacetato desviado a gluconeogénesis.",
      "D) Inhibición irreversible de la enzima HMG-CoA sintasa mitocondrial."
    ],
    correctIndex: 2,
    rationale: "El déficit de insulina desinhibe a la lipasa sensible a hormonas (LSH), liberando toneladas de ácidos grasos hacia el hígado. La beta-oxidación masiva genera cantidades ingentes de Acetil-CoA. Dado que el oxalacetato está consumido en la gluconeogénesis, el exceso de Acetil-CoA entra en la vía de la cetogénesis a través de la HMG-CoA sintasa mitocondrial."
  },
  {
    id: 4,
    question: "¿Por qué el tratamiento profiláctico con Clopidogrel reduce la probabilidad de trombosis arterial en pacientes con síndrome coronario agudo?",
    module: "Módulo IV",
    options: [
      "A) Porque inhibe irreversiblemente al receptor plaquetario P2Y12 de ADP, impidiendo la inactivación de la adenilato ciclasa y manteniendo el freno del AMPc intracelular.",
      "B) Porque degrada proteolíticamente el Fibrinógeno circulante.",
      "C) Porque bloquea la síntesis hepática de protrombina dependiente de vitamina K.",
      "D) Porque actúa como ligando alostérico agonista de la GPIIb/IIIa."
    ],
    correctIndex: 0,
    rationale: "El clopidogrel es una tienopiridina cuyo metabolito activo antagoniza de forma irreversible al receptor purinérgico P2Y12 acoplado a Gi. Al impedir que el ADP inhiba la adenilato ciclasa, los niveles de AMPc se mantienen elevados, bloqueando la movilización de calcio y la activación conformacional de la integrina GPIIb/IIIa."
  }
];

export const TeachingMaterialView: React.FC<TeachingMaterialViewProps> = ({ initialTab = 'temario', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'temario' | 'vademecum' | 'practicas-seminarios' | 'simuladores' | 'autoevaluacion' | 'bibliografia' | 'guia'>(initialTab);
  const [selectedSimulator, setSelectedSimulator] = useState<'randle' | 'ictericias' | 'hemostasia' | 'carnitina' | 'integra'>('randle');
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [searchFilter, setSearchFilter] = useState('');

  const filteredTopics = OFFICIAL_SYLLABUS.filter((t) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      t.number.toString().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white rounded-2xl p-6 sm:p-8 border border-amber-800 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-900/60 text-amber-200 border border-amber-400/40 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              Portal Docente Oficial
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-amber-100 bg-amber-900/40 border border-amber-500/30">
              Departamento de Bioquímica y Biología Molecular III e Inmunología • Facultad de Medicina UGR
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Material Docente y Guía Académica de Bioquímica Médica</span>
          </h1>

          <p className="text-sm text-amber-50/90 leading-relaxed">
            Programa académico oficial, temario de 27 temas, calendario de prácticas de laboratorio y seminarios por subgrupos, simuladores moleculares y banco de autoevaluación test.
          </p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
        {[
          { id: 'temario', label: 'Temario Oficial', icon: BookOpen },
          { id: 'vademecum', label: 'Vademécum de Biomarcadores', icon: Droplets },
          { id: 'practicas-seminarios', label: 'Prácticas y Seminarios (Calendario & Organización)', icon: Calendar },
          { id: 'simuladores', label: 'Simuladores (Apoyo al Aprendizaje)', icon: FlaskConical },
          { id: 'autoevaluacion', label: 'Autoevaluación Test', icon: HelpCircle },
          { id: 'bibliografia', label: 'Bibliografía Recomendada', icon: BookMarked },
          { id: 'guia', label: 'Guía Docente & Evaluación', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-950 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TEMARIO */}
      {activeTab === 'temario' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950 text-emerald-400">
                    PROGRAMA TEÓRICO (7 créditos)
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Bioquímica Médica
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Temario
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Listado oficial de los 27 temas que componen el programa teórico de la asignatura.
                </p>
              </div>

              {/* Total count badge */}
              <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-right self-start sm:self-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Temas</span>
                <span className="text-lg font-black text-slate-900 font-mono">27 Temas</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="mt-5 bg-slate-50 rounded-2xl border border-slate-200 p-3 sm:p-4 flex items-center gap-3">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar en el temario por número, título o concepto..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 rounded-md bg-white border border-slate-200 cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* List of 27 Topics */}
          <div className="space-y-3">
            {filteredTopics.map((topic) => (
              <div
                key={topic.number}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-4 sm:p-5 shadow-xs transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 text-emerald-400 flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-2xs">
                    {topic.number}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 font-mono">
                        Tema {topic.number}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {topic.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No se han encontrado temas con el criterio de búsqueda "{searchFilter}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VADEMÉCUM DE BIOMARCADORES */}
      {activeTab === 'vademecum' && (
        <div className="animate-fadeIn">
          <VademecumView embedded={true} onNavigate={onNavigate} />
        </div>
      )}

      {/* TAB: SIMULADORES DE APOYO AL APRENDIZAJE (BIBLIOTECA) */}
      {activeTab === 'simuladores' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                  <FlaskConical className="w-3 h-3 text-blue-600" />
                  Biblioteca Médica · Apoyo al Aprendizaje
                </span>
                <span className="text-[11px] text-slate-500 font-medium">3 Modelos Fisiopatológicos</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Simuladores Interactivos de Fisiopatología Molecular
              </h2>
              <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                Herramientas docentes dinámicas integradas en la Biblioteca para afianzar el temario oficial del Departamento: 
                el Ciclo de Randle (competencia de sustratos), el diagnóstico diferencial de Ictericias y la Cascada de Coagulación.
              </p>
            </div>

            {/* Selector Buttons */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 shrink-0 gap-1">
              <button
                onClick={() => setSelectedSimulator('randle')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSimulator === 'randle'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ciclo de Randle</span>
              </button>

              <button
                onClick={() => setSelectedSimulator('ictericias')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSimulator === 'ictericias'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Simulador Ictericias</span>
              </button>

              <button
                onClick={() => setSelectedSimulator('hemostasia')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSimulator === 'hemostasia'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Hemostasia</span>
              </button>

              <button
                onClick={() => setSelectedSimulator('carnitina')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSimulator === 'carnitina'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50'
                }`}
              >
                <Dna className="w-3.5 h-3.5 text-indigo-300" />
                <span>Lanzadera Carnitina</span>
              </button>

              <button
                onClick={() => setSelectedSimulator('integra')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedSimulator === 'integra'
                    ? 'bg-teal-700 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-teal-900 hover:bg-teal-50'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-teal-400" />
                <span>Integración (Integra)</span>
              </button>
            </div>
          </div>

          {/* Render Active Simulator Component */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
            {selectedSimulator === 'randle' && <RandleCycleLab />}
            {selectedSimulator === 'ictericias' && <JaundiceSimulatorLab />}
            {selectedSimulator === 'hemostasia' && <HemostasisLab />}
            {selectedSimulator === 'carnitina' && <CarnitineShuttleLab />}
            {selectedSimulator === 'integra' && <MetabolicIntegrationLab hideExternalHeader={true} />}
          </div>
        </div>
      )}

      {/* TAB: PRÁCTICAS Y SEMINARIOS (CALENDARIO & ORGANIZACIÓN DOCENTE UGR) */}
      {activeTab === 'practicas-seminarios' && (
        <div className="space-y-6 animate-fadeIn">
          <PracticasSeminariosView embedded={true} />
        </div>
      )}

      {/* TAB 3: BANCO DE AUTOEVALUACIÓN TEST */}
      {activeTab === 'autoevaluacion' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-2">
            <h2 className="text-base font-bold text-slate-900">
              Banco de Preguntas Tipo Test Departamentales (Convocatorias Previas)
            </h2>
            <p className="text-xs text-slate-600">
              Ponga a prueba su razonamiento fisiopatológico con preguntas comentadas por el equipo docente.
            </p>
          </div>

          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Pregunta #{q.id} • {q.module}
                    </span>
                    {isAnswered && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                        isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                      }`}>
                        {isCorrect ? 'ACIERTO ✓' : 'FALLO ✕'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100";
                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          btnClass = "bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold";
                        } else if (optIdx === selectedOpt) {
                          btnClass = "bg-rose-50 border-rose-300 text-rose-950";
                        } else {
                          btnClass = "bg-white border-slate-100 text-slate-400 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          disabled={isAnswered}
                          className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className={`p-4 rounded-xl text-xs space-y-1 ${
                      isCorrect ? 'bg-emerald-50/70 text-emerald-950 border border-emerald-200' : 'bg-rose-50/70 text-rose-950 border border-rose-200'
                    }`}>
                      <span className="font-bold block uppercase text-[10px] tracking-wider">
                        Justificación Bioquímica Oficial:
                      </span>
                      <p className="leading-relaxed">
                        {q.rationale}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: BIBLIOGRAFÍA */}
      {activeTab === 'bibliografia' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {[
              {
                title: "Bioquímica Médica (6ª Edición)",
                authors: "John W. Baynes & Marek H. Dominiczak",
                publisher: "Elsevier",
                desc: "Texto recomendado principal del Departamento. Enfoque marcadamente clínico centrado en la patología molecular humana y la interpretación de analíticas.",
                tag: "Manual de Referencia Principal"
              },
              {
                title: "Bioquímica con Aplicaciones Clínicas (7ª Edición)",
                authors: "Thomas M. Devlin",
                publisher: "Editorial Reverté",
                desc: "Obra de referencia exhaustiva con correlaciones clínicas completas al final de cada capítulo para profundizar en mecanismos enzimáticos y moleculares.",
                tag: "Manual de Consulta Avanzada"
              },
              {
                title: "Lippincott Illustrated Reviews: Bioquímica (8ª Edición)",
                authors: "Denise R. Ferrier",
                publisher: "Wolters Kluwer",
                desc: "Excelente para el estudio esquemático de rutas metabólicas complejas y su integración recíproca en el ciclo ayuno-alimentación.",
                tag: "Atlas y Esquemas Visuales"
              },
              {
                title: "Bioquímica Clínica y Patología Molecular",
                authors: "Sociedad Española de Bioquímica Clínica y Patología Molecular (SEQC-ML)",
                publisher: "Monografías del Laboratorio Clínico",
                desc: "Valores de referencia estandarizados, guías de consenso sobre troponinas de alta sensibilidad y biomarcadores renales en el Sistema Nacional de Salud.",
                tag: "Normativa Profesional y Guías"
              }
            ].map((book, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  {book.tag}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {book.title}
                </h3>
                <div className="text-[11px] text-slate-500 font-medium">
                  <span>{book.authors}</span> • <span>{book.publisher}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {book.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GUÍA DOCENTE & EVALUACIÓN */}
      {activeTab === 'guia' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 text-xs animate-fadeIn">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Ficha Técnica Oficial de la Asignatura
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Bioquímica Médica • Grado en Medicina (Universidad de Granada)
            </h2>
            <p className="text-slate-500 text-[11px] mt-1">
              Código de Asignatura: 2271112 • Carácter: Formación Básica Obligatoria • 6 ECTS • Curso Académico 2026/2027 (26-27)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px]">Examen Final Teórico-Práctico (60%)</span>
              <p className="text-slate-600 leading-relaxed">
                Prueba objetiva de opción múltiple (preguntas tipo test de 4 alternativas con penalización de 0.33 por error) y resolución de casos clínicos de integración bioquímica.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px]">Simulador y Laboratorios (20%)</span>
              <p className="text-slate-600 leading-relaxed">
                Evaluación continua de casos clínicos resueltos en el simulador BIOMARK-SIM, retos diarios y prácticas con los laboratorios interactivos (Randle, Ictericias, Hemostasia).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px]">Seminarios y Talleres (20%)</span>
              <p className="text-slate-600 leading-relaxed">
                Asistencia participativa, resolución de problemas analíticos de laboratorio y defensa de casos en grupos reducidos de seminario.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed space-y-2">
            <span className="font-bold text-slate-900 block">Sede Docente:</span>
            <p>
              Facultad de Medicina, Universidad de Granada (UGR). Edificio Central, Avenida de la Investigación 11, Parque Tecnológico de la Salud (PTS), 18016 Granada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
