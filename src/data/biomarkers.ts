import { Biomarker } from '../types';

export const BIOMARKERS_DATABASE: Biomarker[] = [
  // ==========================================
  // MARCADORES CARDÍACOS
  // ==========================================
  {
    id: 'bm_troponin_c',
    name: 'Troponina Cardíaca (hs-cTn)',
    abbreviation: 'cTn',
    isoforms: 'Subunidad I/T de troponina miocárdica',
    system: 'cardiac',
    referenceValues: {
      conventional: '< 50 ng/L',
      si: '< 50 ng/L',
      genderAgeVariations: 'Valores de corte por percentil 99 sexo-específicos.'
    },
    temporalWindow: {
      elevationStart: '2 - 4 horas post-isquemia',
      peakWindow: '12 - 24 horas',
      normalizationWindow: '7 - 14 días',
      halfLife: '90 minutos (desintegración proteolítica lenta miofibrilar)'
    },
    diagnosticParams: {
      sensitivity: '97% a las 3 horas del dolor precordial',
      specificity: '95% para necrosis miocárdica aguda',
      optimalCutoff: '> 50 ng/L con delta de cambio > 20%'
    },
    clinicalRelevance: 'Componente del complejo miofibrilar cardíaco. En la necrosis de miocitos por interrupción del flujo coronario, se libera del pool citosólico y del complejo estructural.',
    diagnosticIndication: 'Diagnóstico diferencial de Síndrome Coronario Agudo (IAMCEST, SCASEST) frente a Angina Inestable.',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia renal crónica', 'Embolia pulmonar', 'Miocarditis', 'Crisis hipertensiva'],
      falseNegatives: ['Toma de muestra en fase hiperaguda (< 1 hora)']
    },
    discriminatoryContexts: [
      'Discrimina Infarto Agudo de Miocardio con necrosis frente a Angina Inestable (sin necrosis).'
    ]
  },
  {
    id: 'bm_ckmb',
    name: 'Creatina Quinasa Isoenzima MB',
    abbreviation: 'CK-MB',
    isoforms: 'Dímero MB (citosólico miocárdico)',
    system: 'cardiac',
    referenceValues: {
      conventional: '< 5 ng/mL',
      si: '< 5 μg/L',
      genderAgeVariations: 'Índice relativo CK-MB/CK total: 2.5 - 5.0%'
    },
    temporalWindow: {
      elevationStart: '4 - 6 horas',
      peakWindow: '18 - 24 horas',
      normalizationWindow: '48 - 72 horas',
      halfLife: '12 horas'
    },
    diagnosticParams: {
      sensitivity: '88% a las 6 horas post-evento',
      specificity: '89% con índice relativo > 3%',
      optimalCutoff: '> 5 ng/mL'
    },
    clinicalRelevance: 'Enzima citosólica que cataliza la fosforilación reversible de la creatina. Presente en miocardio (15-20%) y en menor proporción en músculo esquelético.',
    diagnosticIndication: 'Detección de reinfarto agudo en fase subaguda tras 3-7 días de un primer evento (por su rápida normalización a las 48-72h).',
    falsePositivesNegatives: {
      falsePositives: ['Trauma muscular esquelético / Rabdomiolisis', 'Ejercicio extremo'],
      falseNegatives: ['Infartos de muy pequeña masa muscular']
    },
    discriminatoryContexts: [
      'Discrimina reinfarto precoz cuando la troponina se mantiene elevada residualmente por el evento inicial.'
    ]
  },
  {
    id: 'bm_ck_total',
    name: 'Creatina Quinasa Total (CK Total)',
    abbreviation: 'CK Total',
    isoforms: 'Isoenzimas MM, MB, BB',
    system: 'cardiac',
    referenceValues: {
      conventional: 'H: 24–195 U/L; M: 24–170 U/L',
      si: 'H: 24–195 U/L; M: 24–170 U/L',
      genderAgeVariations: 'Mayor masa muscular en varones condiciona límites superiores mayores.'
    },
    temporalWindow: {
      elevationStart: '4 - 8 horas',
      peakWindow: '24 horas',
      normalizationWindow: '3 - 4 días',
      halfLife: '15 horas'
    },
    diagnosticParams: {
      sensitivity: '80% en patología muscular/cardíaca',
      specificity: '60% (ubiquidad esquelética)',
      optimalCutoff: '> 195 U/L (Varones) / > 170 U/L (Mujeres)'
    },
    clinicalRelevance: 'Cataliza la transferencia del grupo fosfato de la fosfocreatina al ADP para regenerar ATP en tejidos de alta demanda energética.',
    diagnosticIndication: 'Orientación de miopatías, rabdomiolisis y coadyuvante en necrosis miocárdica.',
    falsePositivesNegatives: {
      falsePositives: ['Traumatismos musculares', 'Inyecciones intramusculares', 'Uso de estatinas'],
      falseNegatives: ['Reposo prolongado o baja masa muscular']
    },
    discriminatoryContexts: [
      'Permite calcular el índice relativo CK-MB/CK total para confirmar origen cardíaco.'
    ]
  },
  {
    id: 'bm_ldh',
    name: 'Lactato Deshidrogenasa Total',
    abbreviation: 'LDH',
    isoforms: 'Tetrámeros LDH-1 a LDH-5',
    system: 'cardiac',
    referenceValues: {
      conventional: '140–280 U/L',
      si: '140–280 U/L',
      genderAgeVariations: 'Aumenta en recién nacidos e infantes.'
    },
    temporalWindow: {
      elevationStart: '12 - 24 horas',
      peakWindow: '48 - 72 horas',
      normalizationWindow: '8 - 14 días',
      halfLife: '50 horas (isoforma LDH-1)'
    },
    diagnosticParams: {
      sensitivity: '85% en fases tardías (> 48h)',
      specificity: '55% (muy baja por distribución tisular)',
      optimalCutoff: '> 280 U/L'
    },
    clinicalRelevance: 'Enzima citosólica que cataliza la interconversión de piruvato y lactato. Elevada en necrosis celular generalizada, hemólisis y daño tisular severo.',
    diagnosticIndication: 'Marcador tardío de necrosis, hemólisis intravascular (ictericia prehepática) y lisis tumoral.',
    falsePositivesNegatives: {
      falsePositives: ['Hemólisis in vitro de la muestra', 'Ejercicio intenso', 'Infarcto renal/pulmonar'],
      falseNegatives: ['Fase hiperaguda (< 12 horas)']
    },
    discriminatoryContexts: [
      'Confirmación de hemólisis intravascular en ictericia prehepática y marcador tardío de daño tisular.'
    ]
  },
  {
    id: 'bm_nt_probnp',
    name: 'NT-proBNP (Fragmento N-Terminal del Propéptido Natriurético B)',
    abbreviation: 'NT-proBNP',
    isoforms: 'Péptido inactivo de 76 aminoácidos',
    system: 'cardiac',
    referenceValues: {
      conventional: '< 125 pg/mL',
      si: '< 14.7 pmol/L',
      genderAgeVariations: 'Punto de corte excluyente en disnea aguda: < 300 pg/mL.'
    },
    temporalWindow: {
      elevationStart: '2 - 4 horas tras estiramiento miocárdico',
      peakWindow: '24 horas',
      normalizationWindow: 'Varía según resolución del estrés de pared',
      halfLife: '120 minutos'
    },
    diagnosticParams: {
      sensitivity: '97% para descarte de Insuficiencia Cardíaca',
      specificity: '85% ajustado por edad',
      optimalCutoff: '> 125 pg/mL (> 300 pg/mL en cuadro agudo)'
    },
    clinicalRelevance: 'Sintetizado por los miocitos ventriculares en respuesta a sobrecarga de volumen o tensión telediastólica de la pared.',
    diagnosticIndication: 'Diagnóstico diferencial de disnea aguda (origen cardíaco hemodinámico vs respiratorio/EPOC).',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia renal', 'Fibrilación auricular', 'Edad avanzada'],
      falseNegatives: ['Obesidad mórbida (falsa reducción)']
    },
    discriminatoryContexts: [
      'Discrimina disnea cardiogénica por falla ventricular de disnea primaria pulmonar.'
    ]
  },

  // ==========================================
  // MARCADORES HEPÁTICOS Y DE COLESTASIS (ICTERICIAS)
  // ==========================================
  {
    id: 'bm_bilirrubina_total',
    name: 'Bilirrubina Total Sérica',
    abbreviation: 'BT',
    isoforms: 'Suma de fracción conjugada (directa) e incalculada no conjugada (indirecta)',
    system: 'hepatic',
    referenceValues: {
      conventional: '0,3–1,2 mg/dL',
      si: '5.1–20.5 μmol/L',
      genderAgeVariations: 'Ligeramente superior en hombres.'
    },
    temporalWindow: {
      elevationStart: 'Inmediata al fallo de depuración biliar o hipercatabolismo hemático',
      peakWindow: 'Dependiente de la persistencia de la causa',
      normalizationWindow: 'Días a semanas tras resolución',
      halfLife: '4 horas (libre) / 18 días (delta-bilirrubina ligada a albúmina)'
    },
    diagnosticParams: {
      sensitivity: '90% para detección de ictericia clíno-bioquímica',
      specificity: 'Depende del fraccionamiento en directa/indirecta',
      optimalCutoff: '> 1.2 mg/dL (ictericia clínica manifiesta cuando > 2.5 mg/dL)'
    },
    clinicalRelevance: 'Catabolito del grupo hemo del eritrocito. Su elevación genera ictericia y requiere fraccionamiento para clasificar la causa en prehepática, hepática o posthepática.',
    diagnosticIndication: 'Evaluación y clasificación fisiopatológica de síndromes ictericos.',
    falsePositivesNegatives: {
      falsePositives: ['Ayuno prolongado (Síndrome de Gilbert)', 'Hemólisis en muestra'],
      falseNegatives: ['Exposición de la muestra de sangre a la luz solar (fotodegradación)']
    },
    discriminatoryContexts: [
      'Punto de partida obligado para el enfoque diferencial de ictericias.'
    ]
  },
  {
    id: 'bm_bilirrubina_directa',
    name: 'Bilirrubina Directa (Conjugada)',
    abbreviation: 'BD',
    isoforms: 'Diglucurónido y monoglucurónido de bilirrubina (hidrosoluble)',
    system: 'hepatic',
    referenceValues: {
      conventional: '< 0,3 mg/dL',
      si: '< 5.1 μmol/L',
      genderAgeVariations: 'No varía significativamente con sexo.'
    },
    temporalWindow: {
      elevationStart: 'Horas tras obstrucción biliar extrahepática o colestasis',
      peakWindow: 'Según grado de estasis biliar',
      normalizationWindow: '1 - 2 semanas tras desobstrucción',
      halfLife: '4 horas'
    },
    diagnosticParams: {
      sensitivity: '95% para colestasis e ictericia posthepática',
      specificity: '92% para diferenciar patrón colestásico/posthepático de hemolítico/prehepático',
      optimalCutoff: '> 0.3 mg/dL (o > 30% de la Bilirrubina Total)'
    },
    clinicalRelevance: 'Conjugada en el hepatocito por la UDP-glucuronosiltransferasa. Al ser hidrosoluble, su exceso en sangre se filtra renalmente produciendo coluria y traduce obstrucción biliar (posthepática) o colestasis intrahepática con acolia/hipocolia.',
    diagnosticIndication: 'Diferenciación crucial de Ictericia Posthepática/Obstructiva frente a Prehepática/Hemolítica.',
    falsePositivesNegatives: {
      falsePositives: ['Síndrome de Dubin-Johnson / Rotor'],
      falseNegatives: ['Muestra expuesta a luz ambiente intensa']
    },
    discriminatoryContexts: [
      'Dominancia de BD con acolia, coluria, GGT y FA elevadas confirma Ictericia Posthepática / Obstructiva.'
    ]
  },
  {
    id: 'bm_ast',
    name: 'Aspartato Aminotransferasa (AST / GOT)',
    abbreviation: 'AST',
    isoforms: 'Isoforma citosólica (40%) y mitocondrial (60%)',
    system: 'hepatic',
    referenceValues: {
      conventional: '< 40 U/L',
      si: '< 0.68 μkat/L',
      genderAgeVariations: 'Ligeramente superior en hombres.'
    },
    temporalWindow: {
      elevationStart: '6 - 8 horas',
      peakWindow: '24 - 36 horas',
      normalizationWindow: '4 - 6 días',
      halfLife: '17 horas'
    },
    diagnosticParams: {
      sensitivity: '88% en necrosis hepatocitaria aguda',
      specificity: '78% (presente también en músculo y eritrocitos)',
      optimalCutoff: '> 40 U/L (Cociente AST/ALT > 2 en hepatitis alcohólica)'
    },
    clinicalRelevance: 'Enzima bilocular. El etanol causa daño mitocondrial directo liberando la fracción mitocondrial de AST y depletando piridoxal-fosfato (necesario para ALT).',
    diagnosticIndication: 'Identificación de citólisis hepática, daño miocárdico o muscular y hepatitis alcohólica.',
    falsePositivesNegatives: {
      falsePositives: ['Hemólisis in vitro', 'Ejercicio extenuante', 'Traumatismo muscular'],
      falseNegatives: ['Deficiencia de piridoxal-5-fosfato (Vitamina B6)']
    },
    discriminatoryContexts: [
      'Cociente De Ritis (AST/ALT > 2) orienta a patología alcohólica o daño mitocondrial.'
    ]
  },
  {
    id: 'bm_alt',
    name: 'Alanina Aminotransferasa (ALT / GPT)',
    abbreviation: 'ALT',
    isoforms: 'Citosólica predominantemente hepatocitaria',
    system: 'hepatic',
    referenceValues: {
      conventional: '< 40 U/L',
      si: '< 0.68 μkat/L',
      genderAgeVariations: 'Ligeramente superior en varones.'
    },
    temporalWindow: {
      elevationStart: '6 - 12 horas',
      peakWindow: '24 - 48 horas',
      normalizationWindow: '2 - 3 semanas',
      halfLife: '47 horas'
    },
    diagnosticParams: {
      sensitivity: '92% para daño hepatocelular primario',
      specificity: '95% (alta especificidad de tejido hepático)',
      optimalCutoff: '> 40 U/L (> 1000 U/L en necrosis tóxica o viral)'
    },
    clinicalRelevance: 'Enzima citosólica altamente concentrada en los hepatocitos. Su liberación en picos altos (> 1000 U/L) refleja necrosis o citólisis masiva por toxinas (ej. paracetamol) o virus.',
    diagnosticIndication: 'Diagnóstico de hepatitis aguda viral, isquémica o tóxica e ictericia hepática parenquimatosa.',
    falsePositivesNegatives: {
      falsePositives: ['Esteatohepatitis no alcohólica severa', 'Trauma muscular masivo'],
      falseNegatives: ['Cirrosis terminal por pérdida masiva de hepatocitos funcionales']
    },
    discriminatoryContexts: [
      'Elevación extrema (> 1000 U/L) confirma Ictericia Hepática / Citolítica frente a ictericia puramente destructiva de vía biliar o hemolítica.'
    ]
  },
  {
    id: 'bm_ggt',
    name: 'Gamma-Glutamil Transferasa',
    abbreviation: 'GGT',
    isoforms: 'Enzima de membrana en polo biliar y epitelio canalicular',
    system: 'hepatic',
    referenceValues: {
      conventional: 'H < 60 U/L; M < 40 U/L',
      si: 'H < 1.0 μkat/L; M < 0.67 μkat/L',
      genderAgeVariations: 'Mayor en hombres e inducida por fármacos/alcohol.'
    },
    temporalWindow: {
      elevationStart: '12 - 24 horas en colestasis biliar',
      peakWindow: 'Según obstrucción',
      normalizationWindow: '2 - 4 semanas',
      halfLife: '7 - 10 días'
    },
    diagnosticParams: {
      sensitivity: '95% para colestasis e inducción microsomal',
      specificity: '68% (frecuentes elevaciones por inductores enzimáticos)',
      optimalCutoff: '> 60 U/L (H) / > 40 U/L (M)'
    },
    clinicalRelevance: 'Ubicada en la membrana canalicular biliar. Las sales biliares acumuladas estimulan su síntesis y liberación. Confirma que una fosfatasa alcalina elevada proviene del árbol biliar y no del hueso.',
    diagnosticIndication: 'Confirmación de origen biliar/hepático de la fosfatasa alcalina y detección de colestasis.',
    falsePositivesNegatives: {
      falsePositives: ['Inducción por alcohol, fenitoína, barbitúricos', 'Esteatosis hepática'],
      falseNegatives: ['Colestasis intrahepática familiar benigna con GGT normal']
    },
    discriminatoryContexts: [
      'GGT elevada junto a Fosfatasa Alcalina elevada confirma ictericia colestásica/posthepática biliar.'
    ]
  },
  {
    id: 'bm_fosfatasa_alcalina',
    name: 'Fosfatasa Alcalina Total',
    abbreviation: 'FA',
    isoforms: 'Isoformas hepática (canalicular), ósea y placentaria',
    system: 'hepatic',
    referenceValues: {
      conventional: '40–130 U/L',
      si: '0.67–2.17 μkat/L',
      genderAgeVariations: 'Aumentada fisiológicamente en niños en crecimiento y embarazo (tercer trimestre).'
    },
    temporalWindow: {
      elevationStart: '24 - 48 horas en obstrucción biliar',
      peakWindow: 'Días a semanas',
      normalizationWindow: '1 - 3 semanas tras desobstrucción',
      halfLife: '7 días'
    },
    diagnosticParams: {
      sensitivity: '90% en patrón obstructivo/colestásico',
      specificity: '75% (requiere GGT para descartar origen óseo)',
      optimalCutoff: '> 130 U/L (> 3 veces LSN en patología obstructiva)'
    },
    clinicalRelevance: 'Anclada al polo canalicular de la membrana hepatocitaria. La obstrucción biliar o estasis induce su transcripción y liberación a sangre.',
    diagnosticIndication: 'Diagnóstico de colestasis, coledocolitiasis y patología infiltrativa hepática.',
    falsePositivesNegatives: {
      falsePositives: ['Crecimiento óseo activo', 'Remodelado óseo', 'Embarazo'],
      falseNegatives: ['Deficiencia de zinc o magnesio (cofactores de la enzima)']
    },
    discriminatoryContexts: [
      'Marcador cardinal de Ictericia Posthepática / Obstructiva.'
    ]
  },
  {
    id: 'bm_acidos_biliares',
    name: 'Ácidos Biliares Séricos Totales',
    abbreviation: 'ABS',
    isoforms: 'Ácido cólico, desoxicólico y chenodesoxicólico conjugados',
    system: 'hepatic',
    referenceValues: {
      conventional: '< 10 µmol/L',
      si: '< 10 µmol/L',
      genderAgeVariations: 'Aumenta significativamente en el periodo posprandial.'
    },
    temporalWindow: {
      elevationStart: 'Inmediato tras colestasis o fallo de recaptación enterohepática',
      peakWindow: 'Variable',
      normalizationWindow: 'Rápida tras restauración del flujo biliar',
      halfLife: 'Minutos a horas'
    },
    diagnosticParams: {
      sensitivity: '98% para colestasis intrahepática del embarazo y colestasis leve',
      specificity: '93% para fallo del transporte biliar',
      optimalCutoff: '> 10 µmol/L (> 40 µmol/L indica colestasis severa con riesgo fetal)'
    },
    clinicalRelevance: 'Sintetizados en el hígado a partir del colesterol. En la colestasis, su depuración biliar falla, acumulándose en sangre y provocando prurito intenso.',
    diagnosticIndication: 'Diagnóstico de Colestasis Intrahepática del Embarazo y hepatopatías con estasis biliar fina.',
    falsePositivesNegatives: {
      falsePositives: ['Toma de muestra posprandial (requiere ayuno estricto)'],
      falseNegatives: ['Síndrome de malabsorción ileal (pérdida de la circulación enterohepática)']
    },
    discriminatoryContexts: [
      'Marcador ultrasensible de alteración del flujo biliar y prurito colestásico.'
    ]
  },
  {
    id: 'bm_albumina',
    name: 'Albúmina Sérica',
    abbreviation: 'Alb',
    isoforms: 'Proteína monomérica sintetizada en hígado',
    system: 'hepatic',
    referenceValues: {
      conventional: '3,5–5,0 g/dL',
      si: '35–50 g/L',
      genderAgeVariations: 'Disminuye en ancianos e inflamación crónica.'
    },
    temporalWindow: {
      elevationStart: 'Lenta (refleja daño hepático crónico)',
      peakWindow: 'No aplica',
      normalizationWindow: 'Semanas a meses',
      halfLife: '20 días'
    },
    diagnosticParams: {
      sensitivity: '85% para insuficiencia de síntesis hepática crónica',
      specificity: '70% (afectada por pérdidas renales o intestinales)',
      optimalCutoff: '< 3.5 g/dL'
    },
    clinicalRelevance: 'Principal proteína plasmática sintetizada exclusivamente por los hepatocitos. Mantiene la presión oncótica coloidosmótica.',
    diagnosticIndication: 'Evaluación de la función de reserva de síntesis hepática en cirrosis y desnutrición.',
    falsePositivesNegatives: {
      falsePositives: ['Deshidratación / Hemoconcentración'],
      falseNegatives: ['Síndrome nefrótico', 'Enteropatía pierdeproteínas', 'Inflamación aguda (reactante de fase negativa)']
    },
    discriminatoryContexts: [
      'Diferencia la falla hepática crónica de cuadros agudos citolíticos puros.'
    ]
  },
  {
    id: 'bm_proteinas_totales',
    name: 'Proteínas Totales Plasmáticas',
    abbreviation: 'PT',
    isoforms: 'Suma de albúmina y globulinas',
    system: 'hepatic',
    referenceValues: {
      conventional: '6,0–8,3 g/dL',
      si: '60–83 g/L',
      genderAgeVariations: 'Estables en adultos.'
    },
    temporalWindow: {
      elevationStart: 'Crónica',
      peakWindow: 'No aplica',
      normalizationWindow: 'Varía según etiología',
      halfLife: 'Variable (albúmina 20d, inmunoglobulinas 21d)'
    },
    diagnosticParams: {
      sensitivity: '75%',
      specificity: '65%',
      optimalCutoff: '< 6.0 g/dL (Hipoproteinemia) / > 8.3 g/dL (Hyperproteinemia/Mieloma)'
    },
    clinicalRelevance: 'Refleja el estado nutricional, la capacidad de síntesis del hígado y la presencia de gammaglopatías o pérdidas proteicas.',
    diagnosticIndication: 'Cribado nutricional, hepático e inmunitario.',
    falsePositivesNegatives: {
      falsePositives: ['Hemoconcentración', 'Mieloma múltiple / Gammaglobulinopatía monoclonal'],
      falseNegatives: ['Sobrecarga hídrica / Dilución']
    },
    discriminatoryContexts: [
      'Útil en la evaluación global de síntesis proteica hepática.'
    ]
  },

  // ==========================================
  // METABOLISMO GLUCÍDICO, LÍPIDOS Y BETA-OXIDACIÓN
  // ==========================================
  {
    id: 'bm_glucosa',
    name: 'Glucemia en Ayunas',
    abbreviation: 'Glucosa',
    isoforms: 'D-Glucosa libre circulante',
    system: 'metabolic',
    referenceValues: {
      conventional: '70–109 mg/dL',
      si: '3.9–6.0 mmol/L',
      genderAgeVariations: 'Nivel en ayunas estricto de 8 horas.'
    },
    temporalWindow: {
      elevationStart: 'Inmediata tras ingesta o descompensación metabólica',
      peakWindow: 'Posprandial (1 - 2 horas)',
      normalizationWindow: '2 - 3 horas en sujetos sanos',
      halfLife: 'Minutos'
    },
    diagnosticParams: {
      sensitivity: '90% para diabetes descompensada e hipoglucemia',
      specificity: '95% en ayunas estricto de 8 horas',
      optimalCutoff: '< 70 mg/dL (Hipoglucemia) / ≥ 126 mg/dL (Criterio de Diabetes Mellitus)'
    },
    clinicalRelevance: 'Sustrato metabólico energético primario del sistema nervioso central. Su regulación precisa involucra insulina y hormonas contrarreguladoras (glucagón, adrenalina, cortisol, GH).',
    diagnosticIndication: 'Diagnóstico y seguimiento de Diabetes Mellitus, Resistencia a la Insulina e Hipoglucemia.',
    falsePositivesNegatives: {
      falsePositives: ['Estrés agudo (liberación de catecolaminas)', 'Uso de corticoides'],
      falseNegatives: ['Glucólisis in vitro por retardo en la separación del suero (sin tubo con fluoruro de sodio)']
    },
    discriminatoryContexts: [
      'Pivote en la detección de estados diabéticos, resistencia a la insulina e hipoglucemias.'
    ]
  },
  {
    id: 'bm_hba1c',
    name: 'Hemoglobina Glicada (HbA1c)',
    abbreviation: 'HbA1c',
    isoforms: 'Aducto glucosilado N-terminal de la cadena beta de hemoglobina',
    system: 'metabolic',
    referenceValues: {
      conventional: '< 5,7 %',
      si: '< 39 mmol/mol',
      genderAgeVariations: 'Normal: < 5.7%; Prediabetes: 5.7 - 6.4%; Diabetes: ≥ 6.5%'
    },
    temporalWindow: {
      elevationStart: 'Semanas de hiperglucemia sostenida',
      peakWindow: 'Promedio ponderado de los últimos 90 - 120 días',
      normalizationWindow: '2 - 3 meses (vida media del eritrocito)',
      halfLife: '120 días (vida media eritrocutaria)'
    },
    diagnosticParams: {
      sensitivity: '88% para control glucémico retrospectivo a largo plazo',
      specificity: '96% para diagnóstico formal de Diabetes Mellitus',
      optimalCutoff: '≥ 6.5 %'
    },
    clinicalRelevance: 'Resultado de la glicación no enzimática irreversible de la hemoglobina proporcional a los niveles de glucemia media durante los 2-3 meses previos.',
    diagnosticIndication: 'Diagnóstico de Diabetes Mellitus y evaluación del control glucémico crónico.',
    falsePositivesNegatives: {
      falsePositives: ['Anemia ferropénica (aumento compensador por vida media eritrocitaria mayor)', 'Esplenectomía'],
      falseNegatives: ['Anemias hemolíticas (vida media eritrocitaria reducida)', 'Hemoglobinopatías (HbS, HbC)']
    },
    discriminatoryContexts: [
      'Diferencia la hiperglucemia por estrés agudo transitorio del verdadero descontrol crónico de la Diabetes Mellitus.'
    ]
  },
  {
    id: 'bm_lactato',
    name: 'Lactato Plasmático',
    abbreviation: 'Lactato',
    isoforms: 'Anión L-Lactato de la glucólisis anaerobia',
    system: 'metabolic',
    referenceValues: {
      conventional: '0,5–2,0 mmol/L',
      si: '0.5–2.0 mmol/L',
      genderAgeVariations: 'Ligero aumento tras ejercicio.'
    },
    temporalWindow: {
      elevationStart: 'Minutos tras hipoxia tisular o glucólisis acelerada',
      peakWindow: 'Inmediata en shock/hipoperfusión',
      normalizationWindow: 'Horas tras restauración de la perfusión',
      halfLife: '20 minutos'
    },
    diagnosticParams: {
      sensitivity: '92% para hipoxia tisular e hipoperfusión celular',
      specificity: '85% para Acidosis Láctica / Sepsis grave',
      optimalCutoff: '> 2.0 mmol/L (> 4.0 mmol/L indica sepsis grave con shock)'
    },
    clinicalRelevance: 'Producto final de la glucólisis anaerobia cuando la fosforilación oxidativa mitocondrial se interrumpe por falta de oxígeno o fallo enzimático.',
    diagnosticIndication: 'Evaluación de hipoxia tisular en shock, sepsis, cetoacidosis e isquemia intestinal.',
    falsePositivesNegatives: {
      falsePositives: ['Torniquete venoso prolongado durante la extracción', 'Muestra no conservada en hielo'],
      falseNegatives: ['Depuración hepática acelerada compensadora']
    },
    discriminatoryContexts: [
      'Evalúa la gravedad del compromiso hemodinámico y metabolismo anaerobio en descompensaciones agudas.'
    ]
  },
  {
    id: 'bm_piruvato',
    name: 'Piruvato Plasmático',
    abbreviation: 'Piruvato',
    isoforms: 'Alfa-cetoácido intermediario de la glucólisis',
    system: 'metabolic',
    referenceValues: {
      conventional: '0,03–0,10 mmol/L',
      si: '0.03–0.10 mmol/L',
      genderAgeVariations: 'Sensible al estado metabólico.'
    },
    temporalWindow: {
      elevationStart: 'Inmediato tras alteración metabólica glucolítica o mitocondrial',
      peakWindow: 'Variable',
      normalizationWindow: 'Horas',
      halfLife: 'Minutos'
    },
    diagnosticParams: {
      sensitivity: '80% para citopatías mitocondriales',
      specificity: '88% cuando se analiza junto al cociente Lactato/Piruvato',
      optimalCutoff: 'Cociente Lactato/Piruvato > 20 indica defecto en la cadena respiratoria mitocondrial'
    },
    clinicalRelevance: 'Punto de encrucijada del metabolismo: puede convertirse en acetil-CoA (vía PDH mitocondrial), lactato (vía LDH) u oxaloacetato.',
    diagnosticIndication: 'Diagnóstico de deficiencias del complejo piruvato deshidrogenasa y citopatías mitocondriales.',
    falsePositivesNegatives: {
      falsePositives: ['Muestra inestable por retardo en la desproteinización inmediata'],
      falseNegatives: ['Consumo in vitro']
    },
    discriminatoryContexts: [
      'El cociente Lactato/Piruvato discrimina defectos del complejo piruvato deshidrogenasa de defectos de la cadena respiratoria.'
    ]
  },
  {
    id: 'bm_acidos_grasos_libres',
    name: 'Ácidos Grasos Libres Séricos (AGL)',
    abbreviation: 'AGL',
    isoforms: 'Ácidos grasos no esterificados unidos a albúmina',
    system: 'metabolic',
    referenceValues: {
      conventional: '0,2–0,8 mmol/L',
      si: '0.2–0.8 mmol/L',
      genderAgeVariations: 'Aumenta significativamente con el ayuno.'
    },
    temporalWindow: {
      elevationStart: 'Horas tras inicio de ayuno por lipólisis en tejido adiposo',
      peakWindow: '12 - 24 horas de ayuno',
      normalizationWindow: 'Rápida tras la ingesta de carbohidratos (supresión por insulina)',
      halfLife: '30 minutos'
    },
    diagnosticParams: {
      sensitivity: '92% para evaluación de lipólisis e hipoglucemias cetósicas vs hipocetósicas',
      specificity: '90% para defectos de la beta-oxidación de ácidos grasos',
      optimalCutoff: '> 0.8 mmol/L en ayuno prolongado (AGL muy elevados con β-hidroxibutirato bajo = defecto de beta-oxidación)'
    },
    clinicalRelevance: 'Liberados del tejido adiposo por la lipasa sensible a hormonas durante el ayuno para servir como sustrato a la beta-oxidación hepática y muscular.',
    diagnosticIndication: 'Diagnóstico de Defectos en la Beta-Oxidación de Ácidos Grasos y caracterización metabólica de hipoglucemias.',
    falsePositivesNegatives: {
      falsePositives: ['Estrés con descarga adrenérgica intensa (lipólisis estimulada)', 'Toma posprandial inmediata'],
      falseNegatives: ['Inhibición por hiperinsulinemia']
    },
    discriminatoryContexts: [
      'AGL elevados con β-hidroxibutirato anormalmente bajo (<0.5 mmol/L) confirman el diagnóstico de Defecto de la Beta-Oxidación de Ácidos Grasos (Hipoglucemia Hipocetósica).'
    ]
  },
  {
    id: 'bm_carnitina_libre',
    name: 'Carnitina Libre Plasmática (C0)',
    abbreviation: 'C0',
    isoforms: 'L-Carnitina no acilada libre',
    system: 'metabolic',
    referenceValues: {
      conventional: '20–50 µmol/L',
      si: '20–50 µmol/L',
      genderAgeVariations: 'Ligeramente menor en mujeres y niños.'
    },
    temporalWindow: {
      elevationStart: 'Refleja las reservas corporales y el flujo de la lanzadera de carnitina',
      peakWindow: 'No aplica',
      normalizationWindow: 'Semanas tras suplementación',
      halfLife: 'Días'
    },
    diagnosticParams: {
      sensitivity: '95% para deficiencias primarias y secundarias de carnitina',
      specificity: '94% en el perfil metabólico de beta-oxidación',
      optimalCutoff: '< 20 µmol/L (Deficiencia de carnitina)'
    },
    clinicalRelevance: 'Cofactor indispensable para el transporte de ácidos grasos de cadena larga a través de la membrana mitocondrial interna mediante la lanzadera de carnitina (CPT-1, CACT, CPT-2).',
    diagnosticIndication: 'Diagnóstico de deficiencia primaria de carnitina y defectos secundarios de la beta-oxidación.',
    falsePositivesNegatives: {
      falsePositives: ['Tratamiento con ácido valproico o antibióticos pivalados'],
      falseNegatives: ['Suplementación dietética reciente']
    },
    discriminatoryContexts: [
      'Discriminatorio en errores congénitos de la beta-oxidación e hipoglucemia hipocetósica.'
    ]
  },
  {
    id: 'bm_carnitina_total',
    name: 'Carnitina Total Plasmática',
    abbreviation: 'Carnitina Total',
    isoforms: 'Suma de Carnitina Libre (C0) y Acilcarnitinas',
    system: 'metabolic',
    referenceValues: {
      conventional: '25–60 µmol/L',
      si: '25–60 µmol/L',
      genderAgeVariations: 'Estable en adultos en ayunas.'
    },
    temporalWindow: {
      elevationStart: 'Refleja el reservorio tisular y vascular',
      peakWindow: 'No aplica',
      normalizationWindow: 'Semanas',
      halfLife: 'Días'
    },
    diagnosticParams: {
      sensitivity: '90%',
      specificity: '90%',
      optimalCutoff: '< 25 µmol/L'
    },
    clinicalRelevance: 'Representa el pool total de carnitina utilizable para la esterificación y transporte mitocondrial de acilos.',
    diagnosticIndication: 'Cribado de trastornos del transporte y almacenamiento de ácidos grasos.',
    falsePositivesNegatives: {
      falsePositives: ['Consumo de dietas vegetarianas estrictas (baja ingesta)'],
      falseNegatives: ['Muestra no conservada']
    },
    discriminatoryContexts: [
      'Permite calcular la relación acilcarnitina/carnitina libre.'
    ]
  },
  {
    id: 'bm_relacion_acilcarnitina_carnitina',
    name: 'Relación Acilcarnitina / Carnitina Libre',
    abbreviation: 'Relación Acil/C0',
    isoforms: 'Índice calculado: (Carnitina Total - Carnitina Libre) / Carnitina Libre',
    system: 'metabolic',
    referenceValues: {
      conventional: '< 0,4',
      si: '< 0,4',
      genderAgeVariations: 'Independiente del sexo.'
    },
    temporalWindow: {
      elevationStart: 'Aguda durante descompensación metabólica o ayuno',
      peakWindow: 'En crisis metabólica',
      normalizationWindow: 'Tras recuperación metabólica',
      halfLife: 'No aplica (índice funcional)'
    },
    diagnosticParams: {
      sensitivity: '96% para detectar bloqueos de la beta-oxidación de ácidos grasos',
      specificity: '95% para acidemias orgánicas y defectos de beta-oxidación',
      optimalCutoff: '≥ 0,4 (Sugerente de defecto de beta-oxidación o acumulo de acil-CoA)'
    },
    clinicalRelevance: 'Cuando existe un bloqueo en la beta-oxidación mitocondrial (ej. MCADD, VLCADD), los acil-CoA acumulados se esterifican con carnitina para su excreción, elevando las acilcarnitinas y agotando la carnitina libre.',
    diagnosticIndication: 'Estándar de oro en cribado e identificación de Defectos en la Beta-Oxidación de Ácidos Grasos y Acidemias Orgánicas.',
    falsePositivesNegatives: {
      falsePositives: ['Nutrición parenteral total', 'Deficiencia secundaria de carnitina'],
      falseNegatives: ['Muestra tomada en estado posprandial bien alimentado']
    },
    discriminatoryContexts: [
      'Marcador patognomónico de alteración en la beta-oxidación mitocondrial en pacientes con hipoglucemia hipocetósica.'
    ]
  },
  {
    id: 'bm_perfil_acilcarnitinas',
    name: 'Perfil de Acilcarnitinas Plasmáticas',
    abbreviation: 'Perfil Acilcarnitinas',
    isoforms: 'Especies C2 a C18 por espectrometría de masas en tándem (MS/MS)',
    system: 'metabolic',
    referenceValues: {
      conventional: 'Dependiente de especie (Específico por longitud de cadena)',
      si: 'Específico por especie',
      genderAgeVariations: 'Valores de corte por grupos de edad pediátrica.'
    },
    temporalWindow: {
      elevationStart: 'Sostenida en descompensación',
      peakWindow: 'Durante ayuno o estrés metabólico',
      normalizationWindow: 'Tras estabilización',
      halfLife: 'Horas'
    },
    diagnosticParams: {
      sensitivity: '98% para tipificación específica del enzima defectuoso en beta-oxidación',
      specificity: '99% por MS/MS',
      optimalCutoff: 'Elevación selectiva de C8 (Octanoilcarnitina) en MCADD'
    },
    clinicalRelevance: 'Identifica exactamente qué longitud de cadena de ácido graso no puede metabolizarse (cadena corta, media MCADD, larga VLCADD o muy larga), permitiendo el diagnóstico enzimático preciso.',
    diagnosticIndication: 'Diagnóstico definitivo de Defectos en la Beta-Oxidación de Ácidos Grasos (p. ej., C8 elevado en MCADD).',
    falsePositivesNegatives: {
      falsePositives: ['Uso de fórmulas infantiles enriquecidas con MCT'],
      falseNegatives: ['Estado normoglucémico posprandial con supresión de la lipólisis']
    },
    discriminatoryContexts: [
      'Define con precisión la enzima mutada en el defecto de la beta-oxidación.'
    ]
  },
  {
    id: 'bm_beta_hidroxibutirato',
    name: 'β-Hidroxibutirato Sérico',
    abbreviation: 'β-OHB',
    isoforms: 'Cuerpo cetónico cuantitativo predominante',
    system: 'metabolic',
    referenceValues: {
      conventional: '< 0,5 mmol/L',
      si: '< 0.5 mmol/L',
      genderAgeVariations: 'Aumenta fisiológicamente a 1.0 - 3.0 mmol/L tras ayuno de 24 horas.'
    },
    temporalWindow: {
      elevationStart: '4 - 8 horas de ayuno o deficiencia insulinica',
      peakWindow: 'En Cetoacidosis Diabética (> 3.0 mmol/L)',
      normalizationWindow: 'Horas tras infusión de insulina o carbohidratos',
      halfLife: '1 - 2 horas'
    },
    diagnosticParams: {
      sensitivity: '98% para Cetoacidosis Diabética e Hipoglucemia Cetósica',
      specificity: '96% para cetogénesis activa',
      optimalCutoff: '> 3.0 mmol/L (Cetoacidosis Diabética) / < 0.5 mmol/L en hipoglucemia (Defecto de Beta-Oxidación)'
    },
    clinicalRelevance: 'Sintetizado en el hígado a partir de acetil-CoA proveniente de la beta-oxidación. Su presencia confirma cetogénesis activa. Su ausencia en hipoglucemia del ayuno indica fallo de la beta-oxidación o hiperinsulinismo.',
    diagnosticIndication: 'Diagnóstico de Cetoacidosis Diabética y clasificación de Hipoglucemias (Cetósica vs Hipocetósica).',
    falsePositivesNegatives: {
      falsePositives: ['Dieta cetogénica estricta', 'Consumo excesivo de alcohol'],
      falseNegatives: ['Cetoacidosis por acetoacetato con relación de óxido-reducción alterada']
    },
    discriminatoryContexts: [
      'Su ausencia (<0.5 mmol/L) durante una hipoglucemia por ayuno confirma un Defecto en la Beta-Oxidación de Ácidos Grasos o Hiperinsulinismo.'
    ]
  },
  {
    id: 'bm_acetoacetato',
    name: 'Acetoacetato Plasmático',
    abbreviation: 'AcAc',
    isoforms: 'Cuerpo cetónico cetoácido',
    system: 'metabolic',
    referenceValues: {
      conventional: 'Trazas',
      si: 'Trazas',
      genderAgeVariations: 'Proporcional al β-OHB.'
    },
    temporalWindow: {
      elevationStart: 'Horas',
      peakWindow: 'En cetoacidosis',
      normalizationWindow: 'Horas',
      halfLife: '1 hora'
    },
    diagnosticParams: {
      sensitivity: '80% en tira reactiva de orina',
      specificity: '85%',
      optimalCutoff: '> 0.5 mmol/L'
    },
    clinicalRelevance: 'Cuerpo cetónico intermediario interconvertible con el β-hidroxibutirato por la β-hidroxibutirato deshidrogenasa.',
    diagnosticIndication: 'Evaluación cualitativa/semicuantitativa de cetosis.',
    falsePositivesNegatives: {
      falsePositives: ['Fármacos con grupos sulfhidrilo (captopril) en tiras reactivas'],
      falseNegatives: ['Muestras antiguas por descarboxilación espontánea a acetona']
    },
    discriminatoryContexts: [
      'Componente del perfil cetónico global.'
    ]
  },
  {
    id: 'bm_trigliceridos',
    name: 'Triglicéridos Séricos en Ayunas (y Aspecto del Suero)',
    abbreviation: 'TG',
    isoforms: 'Triacilgliceroles en VLDL y Quilomicrones (exógenos)',
    system: 'metabolic',
    referenceValues: {
      conventional: '< 150 mg/dL (Deseable); > 500 mg/dL (Riesgo alto); > 1000 mg/dL (Riesgo crítico de Pancreatitis)',
      si: '< 1.70 mmol/L',
      genderAgeVariations: 'Aumenta en Síndrome Metabólico, Resistencia a la Insulina, consumo de alcohol y diabetes descompensada.'
    },
    temporalWindow: {
      elevationStart: 'Posprandial o mantenida en hiperlipidemias primarias y crisis metabólicas',
      peakWindow: '4 - 6 horas posprandial o permanente en descompensación',
      normalizationWindow: '12 horas de ayuno estricto (días tras infusión de insulina/heparina o plasmaféresis)',
      halfLife: 'Horas (quilomicrones) a días'
    },
    diagnosticParams: {
      sensitivity: '95% para etiología hipertrigliceridémica de pancreatitis (>1000 mg/dL) y 90% para dislipidemia metabólica',
      specificity: '98% cuando los triglicéridos superan los 1000 mg/dL en ayunas',
      optimalCutoff: '> 150 mg/dL (Hipertrigliceridemia/Síndrome Metabólico); > 1000 mg/dL (Umbral crítico de autodigestión pancreática)'
    },
    clinicalRelevance: 'Forma primaria de almacenamiento de lípidos. La hiperinsulinemia en la Resistencia a la Insulina estimula la síntesis hepática de VLDL rica en triglicéridos. A concentraciones masivas (>1000 mg/dL), saturan la lipoproteinlipasa (LPL), acumulando quilomicrones en la microcirculación pancreática. La lipasa acinar hidroliza estos triglicéridos liberando altas concentraciones de Ácidos Grasos Libres (AGL) citotóxicos que causan daño capilar, acidosis, agregación plaquetaria e isquemia, desencadenando pancreatitis necrotizante. Además, la lipemia extrema (suero lechoso) interfiere espectrofotométricamente dando falsos negativos en la amilasa sérica.',
    diagnosticIndication: 'Diagnóstico de Resistencia a la Insulina, Síndrome Metabólico, evaluación de suero lactescente y diagnóstico etiológico de Pancreatitis Aguda hipertrigliceridémica.',
    falsePositivesNegatives: {
      falsePositives: ['Toma de muestra postprandial rica en grasas (< 12 h de ayuno)', 'Consumo reciente de alcohol'],
      falseNegatives: ['Descenso rápido tras 24-48 horas de ayuno estricto o infusión venosa']
    },
    discriminatoryContexts: [
      'Elevados (>150 mg/dL) junto a HDL bajo e hiperglucemia definen el perfil lipídico de la Resistencia a la Insulina y Síndrome Metabólico.',
      'Valores masivos (>1000 mg/dL) en presencia de dolor epigástrico irradiado en cinturón y suero lechoso identifican la pancreatitis aguda hipertrigliceridémica.'
    ]
  },

  // ==========================================
  // RENAL, CICLO DE LA UREA E HIPERURICEMIAS
  // ==========================================
  {
    id: 'bm_amonio_plasmatico',
    name: 'Amonio Plasmático',
    abbreviation: 'NH4+',
    isoforms: 'Gas amoníaco (NH3) / Ion amonio (NH4+)',
    system: 'renal',
    referenceValues: {
      conventional: '< 50 µmol/L',
      si: '< 50 µmol/L',
      genderAgeVariations: 'Mayor en neonatos (< 80 µmol/L).'
    },
    temporalWindow: {
      elevationStart: 'Inmediata tras bloqueo del ciclo de la urea o ingesta proteica',
      peakWindow: 'En crisis de hiperamonemia',
      normalizationWindow: 'Horas tras hemodiálisis o quelantes de nitrógeno',
      halfLife: 'Minutos'
    },
    diagnosticParams: {
      sensitivity: '98% para Defectos del Ciclo de la Urea y encefalopatía hiperamonémica',
      specificity: '95% con procesamiento inmediato en frío',
      optimalCutoff: '> 50 µmol/L (> 150 µmol/L indica emergencia neurotóxica grave)'
    },
    clinicalRelevance: 'Producto neurotóxico del catabolismo de aminoácidos. Debe convertirse en urea en el hígado mediante el Ciclo de la Urea (CPS1, OTC, ASS, ASL, ARG1). Un bloqueo enzimático causa acumulo masivo de amonio con encefalopatía y edema cerebral.',
    diagnosticIndication: 'Diagnóstico urgente de Defectos del Ciclo de la Urea (p. ej., Deficiencia de OTC) y encefalopatía hepática.',
    falsePositivesNegatives: {
      falsePositives: ['Torniquete apretado durante la venopunción', 'Retardo en la centrifugación/enfriamiento de la muestra (desaminación in vitro)'],
      falseNegatives: ['Muestra congelada incorrectamente']
    },
    discriminatoryContexts: [
      'Amonio plasmático severamente elevado (>150 µmol/L) con Urea anormalmente baja o normal confirma Defecto del Ciclo de la Urea.'
    ]
  },
  {
    id: 'bm_acido_urico',
    name: 'Ácido Úrico Sérico',
    abbreviation: 'Ácido Úrico',
    isoforms: 'Urato monosódico en solución',
    system: 'renal',
    referenceValues: {
      conventional: 'H: 3,5–7,0 mg/dL; M: 2,5–6,0 mg/dL',
      si: 'H: 208–416 µmol/L; M: 148–357 µmol/L',
      genderAgeVariations: 'Aumenta en mujeres tras la menopausia por pérdida del efecto uricosúrico de los estrógenos.'
    },
    temporalWindow: {
      elevationStart: 'Horas a días tras sobrecarga de purinas o lisis celular',
      peakWindow: 'En crisis de lisis tumoral o precipitación gotosa',
      normalizationWindow: 'Días con alopurinol / rasburicasa',
      halfLife: '24 horas (excreción renal 70% e intestinal 30%)'
    },
    diagnosticParams: {
      sensitivity: '88% para hiperuricemia primaria/secundaria y gota',
      specificity: '82% para artropatía por cristales de urato',
      optimalCutoff: '> 7.0 mg/dL (Hombres) / > 6.0 mg/dL (Mujeres)'
    },
    clinicalRelevance: 'Producto final de la degradación de las bases púrinicas (adenina y guanina) catalizado por la xantina oxidasa. La hiperuricemia primaria se debe a hiperproducción o hipoexcreción renal. La secundaria responde a lisis tumoral, fármacos (diuréticos) o insuficiencia renal.',
    diagnosticIndication: 'Diagnóstico de Hiperuricemia Primaria (Gota) y Secundaria (Síndrome de Lisis Tumoral, uso de diuréticos, nefropatía por uratos).',
    falsePositivesNegatives: {
      falsePositives: ['Consumo de alcohol (lactato inhibe la secreción tubular de urato)', 'Uso de tiazidas/furosemida'],
      falseNegatives: ['Ataque agudo de gota (el urato puede descender transitoriamente al precipitar en la articulación)']
    },
    discriminatoryContexts: [
      'Discrimina la Hiperuricemia Primaria (gota articular) de la Secundaria a Síndrome de Lisis Tumoral (acompañada de LDH, Fósforo y Potasio muy altos con LRA).'
    ]
  },
  {
    id: 'bm_urea',
    name: 'Urea Sérica',
    abbreviation: 'Urea',
    isoforms: 'Diamida del ácido carbónico (producto final del ciclo de la urea)',
    system: 'renal',
    referenceValues: {
      conventional: '20–50 mg/dL',
      si: '3.3–8.3 mmol/L (BUN = Urea / 2.14)',
      genderAgeVariations: 'Aumenta con dietas hiperproteicas y en ancianos.'
    },
    temporalWindow: {
      elevationStart: '12 - 24 horas tras disminución del filtrado o catabolismo proteico',
      peakWindow: 'Dependiente de la función renal',
      normalizationWindow: '1 - 3 días',
      halfLife: '8 - 12 horas'
    },
    diagnosticParams: {
      sensitivity: '80% para evaluación de función renal y balance nitrogenado',
      specificity: '70% (afectada por ingesta proteica y catabolismo)',
      optimalCutoff: '> 50 mg/dL (Uremia)'
    },
    clinicalRelevance: 'Sintetizada en el hígado a partir del amonio en el ciclo de la urea. Se filtra libremente en el glomérulo y se reabsorbe parcialmente en los tubulos. En defectos del ciclo de la urea se encuentra reducida o en el límite inferior.',
    diagnosticIndication: 'Evaluación del estado de función renal, deshidratación prerrenal y filtrado proteico.',
    falsePositivesNegatives: {
      falsePositives: ['Hemorragia digestiva alta (digestión de hemoglobina)', 'Tratamiento con corticoides', 'Dieta hiperproteica'],
      falseNegatives: ['Insuficiencia hepática grave', 'Defecto del ciclo de la urea (fallo en la síntesis)']
    },
    discriminatoryContexts: [
      'Elevada en falla renal o hipovolemia prerrenal; reducida (<20 mg/dL) en Defectos del Ciclo de la Urea.'
    ]
  },
  {
    id: 'bm_creatinina',
    name: 'Creatinina Sérica',
    abbreviation: 'Creatinina',
    isoforms: 'Producto de degradación no enzimática de la fosfocreatina muscular',
    system: 'renal',
    referenceValues: {
      conventional: 'H: 0,7–1,3 mg/dL; M: 0,5–1,1 mg/dL',
      si: 'H: 62–115 µmol/L; M: 44–97 µmol/L',
      genderAgeVariations: 'Directamente proporcional a la masa muscular esquelética.'
    },
    temporalWindow: {
      elevationStart: '24 - 48 horas tras pérdida del 50% de la función glomerular',
      peakWindow: '48 - 72 horas tras lesión renal aguda',
      normalizationWindow: 'Días tras recuperación de la TFG',
      halfLife: '4 horas'
    },
    diagnosticParams: {
      sensitivity: '75% para disfunción renal aguda (ciega a pérdidas <50% de TFG)',
      specificity: '92% para fallo de filtración glomerular',
      optimalCutoff: '> 1.3 mg/dL (H) / > 1.1 mg/dL (M)'
    },
    clinicalRelevance: 'Metabolito muscular producido a tasa constante. Se filtra libremente por el glomérulo con mínima secreción tubular. Es el indicador estándar para calcular la TFG (eGFR).',
    diagnosticIndication: 'Evaluación y clasificación de Lesión Renal Aguda y Enfermedad Renal Crónica.',
    falsePositivesNegatives: {
      falsePositives: ['Ingesta de carne cocida abundante', 'Suplementación con creatina', 'Atletas de masa muscular extrema'],
      falseNegatives: ['Amputaciones', 'Atrofia muscular severa / Cirrosis (falsa TFG normal)']
    },
    discriminatoryContexts: [
      'Permite estimar la TFG e identificar falla renal aguda o crónica.'
    ]
  },
  {
    id: 'bm_egfr',
    name: 'Tasa de Filtrado Glomerular Estimada (eGFR)',
    abbreviation: 'eGFR',
    isoforms: 'Ecuación CKD-EPI / MDRD',
    system: 'renal',
    referenceValues: {
      conventional: '> 90 mL/min/1,73m²',
      si: '> 90 mL/min/1,73m²',
      genderAgeVariations: 'Fisiológicamente desciende ~1 mL/min/año a partir de los 40 años.'
    },
    temporalWindow: {
      elevationStart: 'Inmediato cálculo matematico',
      peakWindow: 'No aplica',
      normalizationWindow: 'Según función renal',
      halfLife: 'No aplica'
    },
    diagnosticParams: {
      sensitivity: '95% para estadificación de enfermedad renal crónica',
      specificity: '90%',
      optimalCutoff: '< 60 mL/min/1.73m² durante > 3 meses indica Enfermedad Renal Crónica'
    },
    clinicalRelevance: 'Mejor índice global del número de nefronas funcionales y de la capacidad de filtrado renal.',
    diagnosticIndication: 'Estadificación de Enfermedad Renal Crónica y dosificación de fármacos.',
    falsePositivesNegatives: {
      falsePositives: ['Extremos de masa muscular desajustados en la fórmula'],
      falseNegatives: ['Estado hiperfiltrante en fases tempranas de la Diabetes']
    },
    discriminatoryContexts: [
      'Estándar para graduar la severidad del compromiso renal.'
    ]
  },

  // ==========================================
  // MARCADORES PANCREÁTICOS
  // ==========================================
  {
    id: 'bm_lipasa',
    name: 'Lipasa Sérica',
    abbreviation: 'Lipasa',
    isoforms: 'Triacilglicerol acilhidrolasa acinar pancreática',
    system: 'pancreatic',
    referenceValues: {
      conventional: '10–140 U/L',
      si: '0.17–2.33 μkat/L',
      genderAgeVariations: 'Estable en adultos.'
    },
    temporalWindow: {
      elevationStart: '4 - 8 horas post-inicio de autodigestión pancreática',
      peakWindow: '24 - 48 horas',
      normalizationWindow: '8 - 14 días (permanece elevada más tiempo que la amilasa)',
      halfLife: '7 - 14 horas'
    },
    diagnosticParams: {
      sensitivity: '96% para Pancreatitis Aguda',
      specificity: '97% para origen pancreático específico',
      optimalCutoff: '> 3 veces el Límite Superior Normal (> 420 U/L)'
    },
    clinicalRelevance: 'Enzima exocrina secretada por los acinos pancreáticos para la digestión de grasas en el duodeno. En la Pancreatitis Aguda, el bloqueo de la secreción y autodigestión acinar la libera masivamente al torrente circulatorio.',
    diagnosticIndication: 'Marcador de elecciónEstándar de Oro para el diagnóstico de Pancreatitis Aguda.',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia renal (aclaramiento reducido)', 'Isquemia intestinal / Obstrucción en asa cerrada'],
      falseNegatives: ['Pancreatitis crónica terminal con destrucción acinar masiva']
    },
    discriminatoryContexts: [
      'Lipasa > 3 veces LSN (junto a dolor en cinturón) confirma Pancreatitis Aguda frente a colecistitis u úlcera péptica perforada.'
    ]
  },
  {
    id: 'bm_amilasa',
    name: 'Amilasa Sérica Total',
    abbreviation: 'Amilasa',
    isoforms: 'Isoenzima P (Pancreática) y S (Salival)',
    system: 'pancreatic',
    referenceValues: {
      conventional: '13–53 U/L',
      si: '0.22–0.88 μkat/L',
      genderAgeVariations: 'Sin diferencias por sexo.'
    },
    temporalWindow: {
      elevationStart: '2 - 12 horas',
      peakWindow: '12 - 24 horas',
      normalizationWindow: '3 - 5 días (depuración renal rápida)',
      halfLife: '10 horas'
    },
    diagnosticParams: {
      sensitivity: '85% para Pancreatitis Aguda en las primeras 24h',
      specificity: '82% (menor que la lipasa por fuentes parotídeas y tubáricas)',
      optimalCutoff: '> 3 veces el LSN (> 160 U/L)'
    },
    clinicalRelevance: 'Enzima que hidroliza enlaces glucosídicos alfa-1,4 del almidón. Su rápida excreción renal provoca que sus niveles se normalicen precozmente a los 3-5 días.',
    diagnosticIndication: 'Diagnóstico precoz de Pancreatitis Aguda.',
    falsePositivesNegatives: {
      falsePositives: ['Parotiditis', 'Embarazo ectópico roto', 'Cetoacidosis diabética', 'Macroamilasemia'],
      falseNegatives: ['Toma tardía (> 4 días del dolor)', 'Pancreatitis aguda hipertrigliceridémica (interferencia analítica)']
    },
    discriminatoryContexts: [
      'Utilizada en la fase precoz de la Pancreatitis Aguda.'
    ]
  },
  {
    id: 'bm_elastasa_fecal',
    name: 'Elastasa-1 Fecal',
    abbreviation: 'Elastasa Fecal',
    isoforms: 'Endopeptidasa pancreática estable al tránsito intestinal',
    system: 'pancreatic',
    referenceValues: {
      conventional: '> 200 µg/g de heces',
      si: '> 200 µg/g',
      genderAgeVariations: 'Estable independientemente de la edad en adultos.'
    },
    temporalWindow: {
      elevationStart: 'Refleja la capacidad secretora exocrina de reserva permanente',
      peakWindow: 'No aplica',
      normalizationWindow: 'No aplica',
      halfLife: 'Inalterada en tránsito intestinal'
    },
    diagnosticParams: {
      sensitivity: '95% para Insuficiencia Pancreática Exocrina moderada-severa',
      specificity: '93% para patología pancreática exocrina estracutural',
      optimalCutoff: '< 200 µg/g (Insuficiencia Pancreática Exocrina); < 100 µg/g (Insuficiencia Severa)'
    },
    clinicalRelevance: 'Sintetizada por los acinos pancreáticos y no degradada durante el tránsito por el tubo digestivo. Su concentración en heces refleja directamente la capacidad de síntesis y secreción exocrina del páncreas.',
    diagnosticIndication: 'Diagnóstico de Insuficiencia Pancreática Exocrina en Pancreatitis Crónica, Fibrosis Quística y síndrome de malabsorción.',
    falsePositivesNegatives: {
      falsePositives: ['Diarrea acuosa profusa (dilución fecal, causa falso bajo)'],
      falseNegatives: ['Fases muy tempranas de afectación exocrina leve']
    },
    discriminatoryContexts: [
      'Discrimina la esteatorrea por Insuficiencia Pancreática Exocrina (Pancreatitis Crónica) de causas mucosas de malabsorción como la Enfermedad Celíaca.'
    ]
  },
  {
    id: 'bm_ttg_iga',
    name: 'Anticuerpos Anti-Transglutaminasa Tisular IgA (tTG-IgA)',
    abbreviation: 'tTG-IgA',
    isoforms: 'Autoanticuerpos IgA dirigidos contra transglutaminasa 2 (tTG2)',
    system: 'pancreatic',
    referenceValues: {
      conventional: '< 10 U/mL (Negativo); > 15 U/mL (Positivo)',
      si: '< 10 U/mL',
      genderAgeVariations: 'Requiere verificar niveles de IgA total para descartar déficit selectivo de IgA.'
    },
    temporalWindow: {
      elevationStart: 'Persistente mientras exista ingesta de gluten',
      peakWindow: 'Sostenido en exposición activa al gluten',
      normalizationWindow: '6 - 12 meses tras Dieta Sin Gluten (DSG)',
      halfLife: 'Semanas a meses'
    },
    diagnosticParams: {
      sensitivity: '98% para Enfermedad Celíaca activa',
      specificity: '98% para enteropatía por gluten',
      optimalCutoff: '> 10 veces el Límite Superior Normal (> 100 U/mL) tiene valor predictivo positivo >99%'
    },
    clinicalRelevance: 'Marcador serológico de primera elección para el diagnóstico de Enfermedad Celíaca. La interacción de los péptidos de gliadina con la transglutaminasa tisular genera autoanticuerpos que desencadenan inflamación y atrofia de las vellosidades duodeno-yeyunales, impidiendo la absorción de hierro, calcio y vitaminas.',
    diagnosticIndication: 'Sospecha de Enfermedad Celíaca, anemia ferropénica refractaria, diarrea crónica, distensión abdominal postprandial y osteopenia precoz.',
    falsePositivesNegatives: {
      falsePositives: ['Otras patologías autoinmunes (Diabetes Tipo 1, Tiroiditis de Hashimoto)'],
      falseNegatives: ['Déficit selectivo de IgA (falso negativo por ausencia de IgA total)', 'Dieta estricta sin gluten previa a la prueba']
    },
    discriminatoryContexts: [
      'Confirma compromiso mucoso duodenal celíaco frente a insuficiencia pancreática exocrina (Elastasa-1 fecal baja con tTG-IgA normal).'
    ]
  },
  {
    id: 'bm_gastrina',
    name: 'Gastrina Sérica Basal',
    abbreviation: 'Gastrina',
    isoforms: 'G-34 (forma mayoritaria circulante) y G-17 (forma antral)',
    system: 'pancreatic',
    referenceValues: {
      conventional: '0–100 pg/mL',
      si: '0–48 pmol/L',
      genderAgeVariations: 'Aumenta fisiológicamente con la edad por disminución de la masa parietal.'
    },
    temporalWindow: {
      elevationStart: 'Días tras inicio de supresión ácida o aclorhidria gástrica',
      peakWindow: 'Sostenido durante la terapia continua con IBP',
      normalizationWindow: '1 - 2 semanas tras suspensión de IBP',
      halfLife: '5 - 10 minutos'
    },
    diagnosticParams: {
      sensitivity: '95% para hipergastrinemia reactiva / gastrinoma',
      specificity: '90%',
      optimalCutoff: '> 1000 pg/mL (patognomónico de Gastrinoma / Síndrome de Zollinger-Ellison)'
    },
    clinicalRelevance: 'Hormona peptídica antral responsable de estimular la secreción ácida por las células parietales. La aclorhidria secundaria al uso crónico de Inhibidores de la Bomba de Protones (Omeprazol) desinhibe la retroalimentación gástrica, generando hipergastrinemia secundaria. Esta falta de acidez dificulta la solubilización del hierro no hemo y la disociación de la vitamina B12.',
    diagnosticIndication: 'Evaluación de aclorhidria/hipoclorhidria iatrogénica por IBP, gastritis atrófica y diagnóstico de Gastrinoma.',
    falsePositivesNegatives: {
      falsePositives: ['Tratamiento continuado con IBP / anti-H2', 'Gastritis atrófica autoinmune (Anemia Perniciosa)', 'Insuficiencia renal'],
      falseNegatives: ['Toma de muestra no realizada en ayunas o bajo carga de supresión incompleta']
    },
    discriminatoryContexts: [
      'Valora el impacto de la aclorhidria gástrica sobre la malabsorción de B12, hierro y calcio.'
    ]
  },
  {
    id: 'bm_vitamina_b12',
    name: 'Vitamina B12 (Cobalamina) y Folato',
    abbreviation: 'Vitamina B12',
    isoforms: 'Holo-transcobalamina (forma activa) y Cobalamina total',
    system: 'pancreatic',
    referenceValues: {
      conventional: '200–900 pg/mL',
      si: '148–664 pmol/L',
      genderAgeVariations: 'Disminuye en ancianos por atrofia gástrica.'
    },
    temporalWindow: {
      elevationStart: 'Deficiencia clínica progresiva tras 2-5 años de depleción',
      peakWindow: 'Mantenido bajo sin suplementación',
      normalizationWindow: 'Días tras administración parenteral/alta dosis oral',
      halfLife: 'Depósitos hepáticos de 3 a 5 años'
    },
    diagnosticParams: {
      sensitivity: '90% para deficiencia de cobalamina',
      specificity: '92% (asociado a Ácido Metilmalónico elevado)',
      optimalCutoff: '< 200 pg/mL (Deficiencia Severa)'
    },
    clinicalRelevance: 'Cofactor fundamental en la síntesis de ADN y mielinización. La aclorhidria por uso crónico de Omeprazol o la atrofia mucosal impiden la escisión proteica gástrica necesaria para unir la B12 al Factor Intrínseco, desencadenando anemia megaloblástica macrocítica y neuropatía sensitiva.',
    diagnosticIndication: 'Estudio de anemia macrocítica, parestesias, neuropatía periférica y uso prolongado de IBP o cirugía gástrica/ileal.',
    falsePositivesNegatives: {
      falsePositives: ['SDR / Síndromes Mieloproliferativos (falsa B12 normal por transcobalamina I alta)'],
      falseNegatives: ['Embarazo', 'Déficit de Folato grave concomitante']
    },
    discriminatoryContexts: [
      'Identifica la causa de la anemia macrocítica en pacientes polimedicados con IBP o enfermedad celíaca.'
    ]
  },
  {
    id: 'bm_magnesio',
    name: 'Magnesio Sérico y Calcio Sérico',
    abbreviation: 'Magnesio',
    isoforms: 'Magnesio iónico libre y magnesio unido a albúmina',
    system: 'pancreatic',
    referenceValues: {
      conventional: '1,7–2,2 mg/dL (Magnesio); 8,5–10,5 mg/dL (Calcio)',
      si: '0,70–1,10 mmol/L',
      genderAgeVariations: 'Estable en adultos.'
    },
    temporalWindow: {
      elevationStart: 'Hipomagnesemia tras >1 año de terapia continua con IBP',
      peakWindow: 'Crónica mientras continúe la exposición al IBP',
      normalizationWindow: '4 - 7 días tras suspender IBP y reponer Mg',
      halfLife: 'Depósitos óseos lentos'
    },
    diagnosticParams: {
      sensitivity: '92% para hipomagnesemia secundaria a IBP',
      specificity: '95%',
      optimalCutoff: '< 1.4 mg/dL (Hipomagnesemia sintomática)'
    },
    clinicalRelevance: 'Catión regulador clave de canales iónicos. Los IBP inhiben el transporte activo intestinal de magnesio mediado por los canales TRPM6/TRPM7. La hipomagnesemia severa resultante bloquea la secreción de Paratohormona (PTH) y produce resistencia ósea a la PTH, induciendo hipocalcemia secundaria sintomática con tetania y parestesias.',
    diagnosticIndication: 'Sospecha de hipocalcemia refractaria, espasmos musculares, parestesias o uso a largo plazo de Omeprazol.',
    falsePositivesNegatives: {
      falsePositives: ['Hipoalbuminemia (falso magnesio/calcio total bajo con fracción iónica normal)'],
      falseNegatives: ['Magnesio celular bajo con concentración plasmática transitoriamente preservada']
    },
    discriminatoryContexts: [
      'Explica la hipocalcemia e hipoexcitabilidad neuromuscular refractarias en consumidores crónicos de IBP.'
    ]
  },
  // ==========================================
  // MARCADORES NEUROMUSCULARES Y SEÑALIZACIÓN CELULAR
  // ==========================================
  {
    id: 'bm_achr_ab',
    name: 'Anticuerpos Anti-Receptor de Acetilcolina (AChR-Ab)',
    abbreviation: 'Anti-AChR',
    isoforms: 'Inmunoglobulinas IgG policlonales (IgG1/IgG3) dirigidas contra la región inmunogénica principal (MIR) de las subunidades alfa (α1) del receptor nicotínico postsináptico',
    system: 'neuromuscular',
    referenceValues: {
      conventional: '< 0.40 nmol/L (Negativo)',
      si: '< 0.40 nmol/L',
      genderAgeVariations: 'Negativo: < 0.40 nmol/L; Indeterminado: 0.40 - 0.50 nmol/L; Positivo: > 0.50 nmol/L (Ensayo RIA con 125I-alfa-bungarotoxina).'
    },
    temporalWindow: {
      elevationStart: 'Detectable desde la instauración clínica de los síntomas',
      peakWindow: 'Títulos estables; suelen correlacionar con exacerbaciones clínicas y crisis miasténicas',
      normalizationWindow: 'Persisten detectables de forma crónica; descienden gradualmente tras timectomía, recambio plasmático o inmunosupresión sostenida',
      halfLife: '21 días (vida media típica de IgG sérica)'
    },
    diagnosticParams: {
      sensitivity: '85% en Miastenia Gravis generalizada; 50-70% en Miastenia Gravis ocular pura',
      specificity: '> 99% para Miastenia Gravis autoinmune',
      optimalCutoff: '> 0.50 nmol/L'
    },
    clinicalRelevance: 'Vía molecular de señalización y canales iónicos: La acetilcolina liberada por la motoneurona se une a los receptores nicotínicos (canales iónicos regulados por ligando), desencadenando la apertura del poro, el influjo de Na+ y la despolarización de la placa motora. Los autoanticuerpos anti-AChR inducen lisis de los pliegues postsinápticos mediada por complemento, internalización acelerada del receptor (modulación antigénica) y bloqueo estérico directo, reduciendo la densidad de canales funcionales por debajo del umbral de disparo muscular.',
    diagnosticIndication: 'Sospecha de Miastenia Gravis ante ptosis palpebral, diplopía fluctuante, fatiga muscular inducible con el esfuerzo repetido y debilidad bulbar o proximal.',
    falsePositivesNegatives: {
      falsePositives: ['Extremadamente raros (< 0.1%); ocasionalmente en ELA tratada con D-penicilamina o timoma sin clínica miasténica manifiesta'],
      falseNegatives: ['15% de casos de miastenia generalizada y 30-50% de formas oculares (formas seronegativas, candidatas a estudio de Anti-MuSK y Anti-LRP4)']
    },
    discriminatoryContexts: [
      'Confirma de forma concluyente la Miastenia Gravis autoinmune y la diferencia del Síndrome de Lambert-Eaton (Anti-VGCC) y miopatías mitocondriales o inflamatorias.'
    ]
  },
  {
    id: 'bm_anti_vgcc',
    name: 'Anticuerpos Anti-Canales de Calcio Dependientes de Voltaje tipo P/Q (Anti-VGCC)',
    abbreviation: 'Anti-VGCC',
    isoforms: 'Autoanticuerpos IgG dirigidos contra la subunidad alfa-1A de los canales Cav2.1 presinápticos',
    system: 'neuromuscular',
    referenceValues: {
      conventional: '< 20 pmol/L (Negativo)',
      si: '< 20 pmol/L',
      genderAgeVariations: 'Normal: < 20 pmol/L; Límite: 20 - 30 pmol/L; Positivo: > 30 pmol/L.'
    },
    temporalWindow: {
      elevationStart: 'Presente desde fases precoces del síndrome',
      peakWindow: 'Títulos elevados y estables (asociados en 50-60% a carcinoma microcítico de pulmón)',
      normalizationWindow: 'Disminución con tratamiento oncológico o inmunosupresor',
      halfLife: '21 días'
    },
    diagnosticParams: {
      sensitivity: '85-95% para Síndrome Miasténico de Lambert-Eaton',
      specificity: '> 98%',
      optimalCutoff: '> 30 pmol/L'
    },
    clinicalRelevance: 'Mecanismo molecular presináptico: Los canales de calcio dependientes de voltaje en el botón presináptico permiten la entrada de Ca2+ necesaria para la fusión vesicular y la exocitosis cuántica de acetilcolina. Los anticuerpos anti-VGCC reducen el influjo de calcio, disminuyendo la liberación de neurotransmisor.',
    diagnosticIndication: 'Diagnóstico de Síndrome de Lambert-Eaton ante debilidad de cinturas que mejora transitoriamente con el ejercicio, arreflexia y disautonomía.',
    falsePositivesNegatives: {
      falsePositives: ['Ocasional en carcinoma microcítico de pulmón sin clínica miasténica evidente'],
      falseNegatives: ['Formas seronegativas raras de Lambert-Eaton']
    },
    discriminatoryContexts: [
      'Discrimina el defecto presináptico de Lambert-Eaton frente al defecto postsináptico de la Miastenia Gravis.'
    ]
  },
  {
    id: 'bm_metanephrines_plasma',
    name: 'Metanefrinas Libres Fraccionadas en Plasma',
    abbreviation: 'Metanefrinas Libres',
    isoforms: 'Normetanefrina libre (derivada de noradrenalina) y Metanefrina libre (derivada de adrenalina) metabolizadas por COMT intratumoral',
    system: 'cardiac',
    referenceValues: {
      conventional: 'Normetanefrina: < 0.90 nmol/L (< 165 pg/mL); Metanefrina: < 0.50 nmol/L (< 99 pg/mL)',
      si: 'Normetanefrina: < 0.90 nmol/L; Metanefrina: < 0.50 nmol/L',
      genderAgeVariations: 'Ligeros incrementos con la edad y en decúbito no estricto durante la venopunción.'
    },
    temporalWindow: {
      elevationStart: 'Elevación persistente continua debido a la metabolización intratumoral permanente dentro de las células cromafines',
      peakWindow: 'Picos extremos (> 3 a 5 veces el límite superior) durante o inmediatamente tras paroxismos hipertensivos',
      normalizationWindow: 'Normalización completa a las 24-48 horas tras resección quirúrgica tumoral',
      halfLife: '30 - 60 minutos'
    },
    diagnosticParams: {
      sensitivity: '97 - 99% para feocromocitoma y paraganglioma',
      specificity: '93 - 96% (valores > 3-4x LSN confieren especificidad > 99%)',
      optimalCutoff: 'Normetanefrina > 0.90 nmol/L o Metanefrina > 0.50 nmol/L'
    },
    clinicalRelevance: 'Mecanismo molecular de señalización neuroendocrina: Las catecolaminas liberadas en exceso por el feocromocitoma activan dos cascadas principales de receptores acoplados a proteínas G (GPCR): 1) Receptores α1-adrenérgicos en músculo liso vascular acoplados a Gq → activación de PLC-β → escisión de PIP2 en IP3 y DAG → liberación de Ca2+ intracelular del retículo sarcoplásmico mediada por IP3 y activación de la quinasa de cadena ligera de miosina (MLCK) → vasoconstricción periférica intensa con hipertensión crítica; 2) Receptores β1-adrenérgicos miocárdicos acoplados a Gs → activación de adenilato ciclasa → AMPc → PKA → aumento de entrada de Ca2+ vía canales tipo L → cronotropismo e inotropismo positivos extremos (taquicardia y palpitaciones). Las metanefrinas libres plasmáticas son el biomarcador diagnóstico de referencia porque se originan por la acción continua de la catecol-O-metiltransferasa (COMT) dentro del tejido tumoral, independientemente de que la secreción de catecolaminas activas sea episódica.',
    diagnosticIndication: 'Triada clásica paroxística de cefalea pulsátil, sudoración profusa y palpitaciones taquicárdicas con hipertensión arterial severa o refractaria.',
    falsePositivesNegatives: {
      falsePositives: ['Estrés fisiológico agudo o dolor severo', 'Fármacos simpaticomiméticos, descongestionantes, antidepresivos tricíclicos, IMAO o betabloqueantes'],
      falseNegatives: ['Tumores secretores exclusivamente de dopamina (extremadamente infrecuentes)']
    },
    discriminatoryContexts: [
      'Biomarcador óptimo de primera línea para confirmar feocromocitoma frente a hipertensión esencial, crisis de angustia/pánico o tormenta tiroidea.'
    ]
  },
  {
    id: 'bm_fasting_insulin',
    name: 'Insulina Basal en Ayunas e Índice HOMA-IR',
    abbreviation: 'Insulina / HOMA-IR',
    isoforms: 'Insulina plasmática monomérica biológicamente activa (cadenas A y B unidas por puentes disulfuro) y Péptido C equimolar',
    system: 'metabolic',
    referenceValues: {
      conventional: 'Insulina en ayunas: 2.6 – 24.9 µUI/mL; HOMA-IR: < 2.5 (Normal); > 3.8 (Resistencia severa)',
      si: 'Insulina: 18 – 173 pmol/L; HOMA-IR: < 2.5',
      genderAgeVariations: 'Aumenta en la pubertad y con el incremento de adiposidad visceral.'
    },
    temporalWindow: {
      elevationStart: 'Elevación crónica continua en estados de resistencia a la insulina',
      peakWindow: 'Niveles marcadamente desproporcionados (> 100 - 300 µUI/mL) en síndromes monogénicos de resistencia extrema',
      normalizationWindow: 'Crónica; no remite sin intervención genética/sensibilizadora específica',
      halfLife: '4 - 6 minutos (rápido aclaramiento hepático)'
    },
    diagnosticParams: {
      sensitivity: '95% en síndromes de resistencia severa a la insulina',
      specificity: '92% para disfunción del receptor INSR frente a diabetes autoinmune',
      optimalCutoff: 'Insulina basal > 50 µUI/mL con HOMA-IR > 8.0 en ausencia de obesidad mórbida'
    },
    clinicalRelevance: 'Mecanismo molecular de señalización por Receptor Tirosina Quinasa (RTK): La insulina se une a los dominios extracelulares alfa del receptor de insulina (INSR), induciendo un cambio conformacional que activa la actividad tirosina quinasa intrínseca de las subunidades beta citoplasmáticas. Las subunidades beta se autofosforilan en residuos de tirosina y reclutan a proteínas adaptadoras como IRS-1 e IRS-2. IRS fosforilado activa la Fosfoinositol 3-Quinasa (PI3K), que genera fosfatidilinositol-3,4,5-trifosfato (PIP3) en la membrana interna. PIP3 recluta y activa a PDK1 y Akt/PKB, que promueve la exocitosis de vesículas intracelulares que contienen transportadores de glucosa GLUT4 hacia la membrana en músculo y tejido adiposo. En los Síndromes de Resistencia a la Insulina Tipo A (mutaciones en INSR), esta cascada tirosina quinasa está rota, impidiendo la señalización de Akt y la captación de glucosa mediada por GLUT4, lo que genera hiperinsulinismo masivo compensatorio (>100 µUI/mL) con acantosis nigricans por estimulación cruzada de receptores de IGF-1.',
    diagnosticIndication: 'Evaluación de hiperinsulinemia extrema con acantosis nigricans florida, oligomenorrea/hiperandrogenismo y sospecha de mutación en receptor tirosina quinasa.',
    falsePositivesNegatives: {
      falsePositives: ['Presencia de anticuerpos anti-insulina circulantes', 'Insulinoma (aunque cursa con hipoglucemia sintomática, no con hiperglucemia o resistencia)'],
      falseNegatives: ['Agotamiento tardío de células beta con pérdida de la reserva secretora de insulina']
    },
    discriminatoryContexts: [
      'Discrimina la resistencia a la insulina por defecto del receptor RTK frente a la deficiencia de insulina (Diabetes Mellitus Tipo 1) y frente al insulinoma.'
    ]
  },
  {
    id: 'bm_cholera_toxin',
    name: 'Detección de Enterotoxina Colérica y Cultivo Selectivo TCBS',
    abbreviation: 'Toxina Colérica / TCBS',
    isoforms: 'Enterotoxina colérica (holotoxina AB5: subunidad catalítica A1 + pentámero de unión B a gangliósido GM1)',
    system: 'metabolic',
    referenceValues: {
      conventional: 'Negativo / No detectable',
      si: 'Negativo',
      genderAgeVariations: 'Patógeno no colonizador habitual en individuos sanos.'
    },
    temporalWindow: {
      elevationStart: 'Primeras horas del inicio de las heces acuosas en agua de arroz',
      peakWindow: '24 - 48 horas tras el contagio fecal-oral',
      normalizationWindow: 'Negativización tras aclaramiento del patógeno y antibioterapia adecuada',
      halfLife: 'Persiste mientras dure la colonización enterocítica'
    },
    diagnosticParams: {
      sensitivity: '95% para Vibrio cholerae toxigénico O1/O139',
      specificity: '98% mediante cultivo selectivo TCBS y confirmación por PCR o inmunoensayo',
      optimalCutoff: 'Aislamiento de colonias sacarosa-positivas (amarillas) en TCBS con aglutinación serológica'
    },
    clinicalRelevance: 'Mecanismo molecular de señalización y transporte epitelial: La subunidad B de la toxina colérica se une específicamente al gangliósido GM1 en la superficie apical del enterocito, permitiendo la endocitosis y translocación retrógrada de la subunidad activa A1 hacia el citosol. Allí, la subunidad A1 utiliza NAD+ intracelular para catalizar la ADP-ribosilación irreversible de un residuo de arginina en la subunidad Gαs acoplada a la adenilato ciclasa. Esta modificación química bloquea de forma irreversible la actividad GTPasa intrínseca de Gαs, impidiendo la hidrólisis de GTP a GDP. En consecuencia, Gαs permanece constitutivamente "encendida", estimulando sin freno a la adenilato ciclasa. La elevación exponencial de AMPc intracelular hiperactiva a la Protein Quinasa A (PKA), la cual fosforila el dominio R del canal de cloruro CFTR y el cotransportador apical Na+/H+ (NHE3). La apertura masiva y sostenida de los canales CFTR bombea cloruro y bicarbonato hacia el lumen intestinal, arrastrando masivamente sodio y agua por gradiente osmótico (hasta 1 litro por hora de pérdidas hidroelectrolíticas mortales si no se repone).',
    diagnosticIndication: 'Diarrea acuosa profusa en "agua de arroz", sin sangre ni leucocitos fecales, acompañada de deshidratación hipovolémica severa y acidosis metabólica tras viajes o áreas endémicas.',
    falsePositivesNegatives: {
      falsePositives: ['Reactividad cruzada serológica con la enterotoxina termolábil (LT) de Escherichia coli enterotoxigénica (ETEC)'],
      falseNegatives: ['Toma de muestra rectal tardía tras inicio de doxiciclina o ciprofloxacino']
    },
    discriminatoryContexts: [
      'Identifica de forma inequívoca el cólera epidémico mediado por la vía Gs-AMPc frente a diarreas invasivas (Shigella, Salmonella) o diarreas osmóticas.'
    ]
  },
  {
    id: 'bm_colinesterasa',
    name: 'Actividad de Acetilcolinesterasa Eritrocitaria (AChE) y Pseudocolinesterasa',
    abbreviation: 'AChE / Colinesterasa',
    isoforms: 'Acetilcolinesterasa eritrocitaria (verdadera, anclada a membrana celular) y Butirilcolinesterasa plasmática (pseudocolinesterasa hepática)',
    system: 'neuromuscular',
    referenceValues: {
      conventional: 'AChE eritrocitaria: 30–40 U/g Hb; Butirilcolinesterasa: 5.300–12.900 U/L',
      si: 'AChE: 30–40 U/g Hb; BChE: 5.3–12.9 kU/L',
      genderAgeVariations: 'Estable en adultos; disminuye fisiológicamente en el tercer trimestre de gestación.'
    },
    temporalWindow: {
      elevationStart: 'Inhibición inmediata (< 30 min tras absorción del tóxico)',
      peakWindow: 'Fase aguda de intoxicación colinérgica',
      normalizationWindow: 'Butirilcolinesterasa: 15–30 días (regeneración hepática); AChE: 90–120 días (requiere recambio eritrocitario si ocurre aging)',
      halfLife: 'AChE ligada a supervivencia del hematíe'
    },
    diagnosticParams: {
      sensitivity: '98% para intoxicación aguda por insecticidas organofosforados o carbamatos',
      specificity: '96% (descenso > 50% confirma toxicidad colinérgica moderada-grave)',
      optimalCutoff: 'Inhibición enzimática > 50% respecto al valor de referencia basal'
    },
    clinicalRelevance: 'Mecanismo molecular de inhibición enzimática covalente: La acetilcolinesterasa es una serina-hidrolasa especializada que finaliza la neurotransmisión en la hendidura sináptica desdoblando la acetilcolina en colina y acetato. Los organofosforados, tras su bioactivación oxidativa a derivados oxón por el citocromo P450, fosforilan covalentemente el residuo de serina catalítica en el centro activo de la AChE. Esta unión impide la degradación de acetilcolina, provocando su sobreacumulación tóxica en los receptores muscarínicos (bradicardia, miosis, sialorrea, broncorrea) y nicotínicos (fasciculaciones, espasmos y parálisis muscular). Si no se administra precozmente una oxima nucleófila como la pralidoxima (2-PAM), se produce el "envejecimiento" o aging de la enzima (desalquilación del grupo fosforilo), transformando la inhibición en irreversible.',
    diagnosticIndication: 'Diagnóstico urgente de intoxicación por plaguicidas organofosforados o carbamatos ante síndrome colinérgico con fasciculaciones y fallo respiratorio.',
    falsePositivesNegatives: {
      falsePositives: ['Variantes genéticas de pseudocolinesterasa atípica', 'Hepatopatía crónica severa con fallo de síntesis proteica'],
      falseNegatives: ['Toma de muestra muy tardía tras recambio globular o terapia intensiva previa con oximas']
    },
    discriminatoryContexts: [
      'Biomarcador enzimático cuantitativo patognomónico que confirma la inhibición covalente de la colinesterasa y guía el uso urgente de oximas y atropina.'
    ]
  },
  {
    id: 'bm_cristales_liquido_sinovial',
    name: 'Microscopía de Luz Polarizada en Líquido Sinovial (Cristales de UMS)',
    abbreviation: 'Cristales UMS Sinovial',
    isoforms: 'Cristales de monourato sódico (UMS) intra y extracelulares con birrefringencia negativa compensada',
    system: 'renal',
    referenceValues: {
      conventional: 'Ausencia de cristales birrefringentes',
      si: 'Negativo',
      genderAgeVariations: 'Estándar en ambos sexos.'
    },
    temporalWindow: {
      elevationStart: 'Presente desde el inicio agudo del ataque inflamatorio gotoso (podagra)',
      peakWindow: 'Primeras 6 a 24 horas del dolor e inflamación articular',
      normalizationWindow: 'Pueden persistir cristales extracelulares intercríticos asintomáticos si la uricemia permanece sobresaturada',
      halfLife: 'No aplica'
    },
    diagnosticParams: {
      sensitivity: '96% durante el brote agudo de podagra',
      specificity: '100% (patognomónico de Gota articular)',
      optimalCutoff: 'Presencia inequívoca de agujas birrefringentes intracelulares con birrefringencia negativa fuerte'
    },
    clinicalRelevance: 'Fundamento biofísico y fisiopatológico: A pH fisiológico de 7.4 (con pKa del ácido úrico de 5.4), el urato se encuentra ionizado. Cuando los niveles plasmáticos o del líquido articular superan el límite de solubilidad físico-química (~6.8 mg/dL a 37 °C, disminuyendo en extremidades distales frías como la primera articulación metatarsofalángica), precipita formando cristales de monourato sódico (UMS). Los leucocitos polimorfonucleares (neutrófilos) fagocitan los cristales; las hidrolasas ácidas lisosómicas no pueden degradarlos y se produce la rotura de la membrana lisosómica con activación masiva del inflamasoma NLRP3, liberación de IL-1β y leucotrieno B4, reclutando más neutrófilos y perpetuando la sinovitis destructiva aguda.',
    diagnosticIndication: 'Diagnóstico confirmatorio de certeza (Gold Standard) ante monoartritis aguda severa en primera articulación metatarsofalángica o rodilla.',
    falsePositivesNegatives: {
      falsePositives: ['Ninguno ante operador experimentado en microscopía de luz polarizada con compensador rojo de primer orden'],
      falseNegatives: ['Artrocentesis fallida con aspiración de volumen insuficiente o lavado articular previo']
    },
    discriminatoryContexts: [
      'Diferencia categóricamente la Gota (agujas con birrefringencia negativa intensa) de la Pseudogota (cristales romboidales de pirofosfato cálcico dihidratado con birrefringencia positiva débil) y de la Artritis Séptica.'
    ]
  },
  {
    id: 'bm_cloruro_sudor',
    name: 'Test de Cloruro en Sudor (Iontoforesis con Pilocarpina)',
    abbreviation: 'Cloro Sudor',
    isoforms: 'Ión cloruro secretado en glándulas sudoríparas ecrinas',
    system: 'pancreatic',
    referenceValues: {
      conventional: '< 30 mmol/L (Normal), 30-59 mmol/L (Dudoso), ≥ 60 mmol/L (Positivo)',
      si: '< 30 mmol/L',
      genderAgeVariations: 'Válido desde las 48 horas de vida con peso > 2 kg.'
    },
    temporalWindow: {
      elevationStart: 'Presente desde el nacimiento (congénito)',
      peakWindow: 'Constante a lo largo de la vida del paciente',
      normalizationWindow: 'No normaliza sin moduladores genéticos de CFTR',
      halfLife: 'No aplica'
    },
    diagnosticParams: {
      sensitivity: '98% para Fibrosis Quística clásica',
      specificity: '> 99% ante técnica estandarizada de Gibson y Cooke',
      optimalCutoff: 'Cloro ≥ 60 mmol/L en dos determinaciones independientes'
    },
    clinicalRelevance: 'El canal CFTR es un canal de cloruro dependiente de AMPc. En el conducto sudoríparo ecrino reabsorbe cloruro de la luz. Su disfunción impide la reabsorción de cloruro y sodio, generando un sudor patológicamente hiperconcentrado en sal (sabor salado al besar la piel).',
    diagnosticIndication: 'Diagnóstico de confirmación definitivo (Gold Standard) de Fibrosis Quística (Mucoviscidosis).',
    falsePositivesNegatives: {
      falsePositives: ['Malnutrición severa', 'Insuficiencia suprarrenal no tratada', 'Hipotiroidismo congénito'],
      falseNegatives: ['Muestra de sudor insuficiente (< 75 mg en papel de filtro)']
    },
    discriminatoryContexts: [
      'Diferencia la esteatorrea y bronquiectasias de la Fibrosis Quística de la celiaquía y asma refractario infantil.'
    ]
  },
  {
    id: 'bm_electroforesis_hb',
    name: 'Electroforesis de Hemoglobinas en Gel / HPLC (Detección de HbS)',
    abbreviation: 'HbS Electroforesis',
    isoforms: 'Variante estructural HbS (mutación Glu6Val en cadena beta)',
    system: 'neuromuscular',
    referenceValues: {
      conventional: 'HbA > 95%, HbA2 1.5 - 3.5%, HbF < 1%, HbS 0%',
      si: 'HbS 0%',
      genderAgeVariations: 'En neonatos predomina fisiológicamente HbF.'
    },
    temporalWindow: {
      elevationStart: 'Presente desde el nacimiento; síntomas tras caída de HbF (3-6 meses)',
      peakWindow: 'Constante genéticamente',
      normalizationWindow: 'Permanente',
      halfLife: 'Eritrocitos falciformes duran 10-20 días (frente a 120 días normales)'
    },
    diagnosticParams: {
      sensitivity: '100% para hemoglobinopatías S homocigotas o heterocigotas',
      specificity: '100% mediante cromatografía líquida de alta resolución (HPLC)',
      optimalCutoff: 'Banda prominente de HbS > 80% en drepanocitosis homocigota'
    },
    clinicalRelevance: 'La sustitución de ácido glutámico por valina hidrófoba en la posición 6 de la globina beta crea un parche hidrofóbico. En situaciones de hipoxia o deshidratación, la desoxirretina polimeriza formando fibras rígidas que deforman el eritrocito en hoz (drepanocito), ocluyendo la microvasculatura e induciendo hemólisis intravascular masiva.',
    diagnosticIndication: 'Diagnóstico categórico de Anemia de Células Falciformes (Drepanocitosis) y rasgo falciforme.',
    falsePositivesNegatives: {
      falsePositives: ['Transfusiones recientes masivas (pueden enmascarar el porcentaje relativo)'],
      falseNegatives: ['Ninguno ante HPLC cuantitativo']
    },
    discriminatoryContexts: [
      'Distingue crisis vasooclusivas de anemia falciforme frente a osteomielitis o abdomen agudo quirúrgico.'
    ]
  },
  {
    id: 'bm_peptido_c',
    name: 'Péptido C y Ratio Insulina/Péptido C en Ayunas',
    abbreviation: 'Péptido C',
    isoforms: 'Cadena conectora C de la proinsulina (31 aminoácidos)',
    system: 'metabolic',
    referenceValues: {
      conventional: '0.8 - 3.1 ng/mL (en normoglucemia); durante hipoglucemia severa debe suprimirse a < 0.2 ng/mL',
      si: '0.26 - 1.03 nmol/L',
      genderAgeVariations: 'Equimolar con insulina endógena.'
    },
    temporalWindow: {
      elevationStart: 'Permanece inadecuadamente elevado o normal durante la hipoglucemia inducida por insulinoma',
      peakWindow: 'Monitorización seriada en test de ayuno de 72 horas',
      normalizationWindow: 'Se normaliza tras resección del adenoma neuroendocrino',
      halfLife: '20 - 30 minutos (mucho más larga que la insulina, 5 min)'
    },
    diagnosticParams: {
      sensitivity: '95% en hipoglucemia hiperinsulinémica endógena',
      specificity: '98% para distinguir hipersecreción endógena de administración exógena subrepticia de insulina',
      optimalCutoff: 'Péptido C ≥ 0.6 ng/mL en presencia de glucemia < 55 mg/dL'
    },
    clinicalRelevance: 'Las células beta pancreáticas escinden la proinsulina en insulina y péptido C en relación 1:1. La insulina comercial exógena carece de péptido C. Un paciente con hipoglucemia grave y péptido C no suprimido (o elevado) tiene una fuente endógena de insulina (como un insulinoma o sulfonilureas).',
    diagnosticIndication: 'Diagnóstico diferencial de hipoglucemias en ayunas y confirmación de insulinoma.',
    falsePositivesNegatives: {
      falsePositives: ['Consumo encubierto de sulfonilureas (estimuladores de secreción; requiere screening urinario)'],
      falseNegatives: ['Insuficiencia renal avanzada (acumulación pasiva de péptido C por aclaramiento reducido)']
    },
    discriminatoryContexts: [
      'Discrimina categóricamente el Insulinoma y la hipoglucemia por sulfonilureas de la hipoglucemia fáctica por inyección de insulina comercial.'
    ]
  },
  {
    id: 'bm_trab_tsh',
    name: 'Anticuerpos Estimulantes del Receptor de TSH (TRAb / TSI)',
    abbreviation: 'TRAb / TSI',
    isoforms: 'Inmunoglobulinas IgG agonistas frente al dominio extracelular del receptor TSHR',
    system: 'metabolic',
    referenceValues: {
      conventional: '< 1.75 UI/L (Negativo)',
      si: '< 1.75 UI/L',
      genderAgeVariations: 'Traspasan la barrera placentaria (vigilancia en gestantes).'
    },
    temporalWindow: {
      elevationStart: 'Presentes en fases activas del hipertiroidismo de Graves',
      peakWindow: 'Crisis tirotóxica y debut con oftalmopatía infiltrativa',
      normalizationWindow: 'Disminuyen lentamente tras 12-18 meses de antitiroideos de síntesis',
      halfLife: '21 días (vida media de IgG)'
    },
    diagnosticParams: {
      sensitivity: '97% para Enfermedad de Graves-Basedow',
      specificity: '99% frente a tiroiditis subaguda o bocio multinodular tóxico',
      optimalCutoff: '> 1.75 UI/L'
    },
    clinicalRelevance: 'Los TRAb se unen al receptor de TSH acoplado a proteína Gs en los tirocitos, activando constitutivamente la adenilato ciclasa y la síntesis descontrolada de T3 y T4, con hipertrofia celular (bocio difuso) y activación de fibroblastos retrooculares (oftalmopatía).',
    diagnosticIndication: 'Confirmación etiológica de Enfermedad de Graves-Basedow frente a otras causas de tirotoxicosis.',
    falsePositivesNegatives: {
      falsePositives: ['Fase inicial de tiroiditis de Hashimoto (forma Hashitoxicosis por anticuerpos mixtos)'],
      falseNegatives: ['Títulos muy bajos en formas leves exclusivamente oculares']
    },
    discriminatoryContexts: [
      'Diferencia el hipertiroidismo autoinmune de Graves de la tiroiditis destructiva de De Quervain y el adenoma tóxico autónomo.'
    ]
  },
  {
    id: 'bm_cistina_orina',
    name: 'Cuantificación de Cistina en Orina de 24h y Test de Cianuro-Nitroprusiato',
    abbreviation: 'Cistina Orina',
    isoforms: 'Dímero de cisteína unido por puente disulfuro (Cys-S-S-Cys)',
    system: 'renal',
    referenceValues: {
      conventional: '< 30 mg/24h (< 100 µmol/g creatinina)',
      si: '< 130 µmol/día',
      genderAgeVariations: 'Normal en ambos sexos.'
    },
    temporalWindow: {
      elevationStart: 'Defecto genético permanente en transportador tubular COLA (rBAT/b0,+AT)',
      peakWindow: 'Crisis de litiasis renoureteral aguda',
      normalizationWindow: 'Requiere alcalinización urinaria (pH > 7.5) y quelantes de tiol',
      halfLife: 'No aplica'
    },
    diagnosticParams: {
      sensitivity: '98% para Cistinuria homocigota',
      specificity: '99% ante cromatografía de aminoácidos en orina',
      optimalCutoff: 'Excreción urinaria de cistina > 250 mg/24h'
    },
    clinicalRelevance: 'La mutación en los genes SLC3A1 o SLC7A9 anula la reabsorción tubular proximal de aminoácidos dibásicos (Cistina, Ornitina, Lisina y Arginina - COLA). La cistina es extraordinariamente insoluble a pH ácido (< 7.0), precipitando y formando cálculos renales hexagonales recurrentes de gran dureza.',
    diagnosticIndication: 'Diagnóstico etiológico de nefrolitiasis juvenil bilateral o cálculos radiopacos recidivantes.',
    falsePositivesNegatives: {
      falsePositives: ['Presencia de fármacos con grupos tiol libres como captopril o penicilamina en el test de Brand'],
      falseNegatives: ['Orina extremadamente diluida sin recogida de 24 horas completa']
    },
    discriminatoryContexts: [
      'Diferencia cálculos de cistina de las litiasis habituales de oxalato cálcico o ácido úrico.'
    ]
  },
  {
    id: 'bm_acido_orotico_orina',
    name: 'Cuantificación de Ácido Orótico en Orina',
    abbreviation: 'Ácido Orótico',
    isoforms: 'Intermediario de la síntesis de novo de nucleótidos de pirimidina',
    system: 'renal',
    referenceValues: {
      conventional: '< 2.5 µmol/mmol creatinina (< 3 mg/día)',
      si: '< 2.5 µmol/mmol creatinina',
      genderAgeVariations: 'Ligeramente superior en lactantes.'
    },
    temporalWindow: {
      elevationStart: 'Presente desde los primeros meses de vida',
      peakWindow: 'Empeora en crisis de descompensación metabólica',
      normalizationWindow: 'Se normaliza espectacularmente tras suplementación oral con Uridina',
      halfLife: 'Aclaramiento renal rápido'
    },
    diagnosticParams: {
      sensitivity: '100% para Aciduria Orótica Hereditaria (déficit de UMP sintasa)',
      specificity: 'Distingue déficit de UMP sintasa de déficit de OTC (este último cursa con hiperamonemia severa)',
      optimalCutoff: '> 50 µmol/mmol creatinina con amonio sérico normal'
    },
    clinicalRelevance: 'La enzima bifuncional UMP Sintasa cataliza los pasos finales de la vía de pirimidinas. Su bloqueo causa acumulación masiva de ácido orótico (que precipita formando cristales urinarios) y carencia de UDP/UTP, provocando anemia megaloblástica rebelde a B12/folato y fallo de medro.',
    diagnosticIndication: 'Diagnóstico de Aciduria Orótica Hereditaria y diagnóstico diferencial de anemias megaloblásticas refractarias.',
    falsePositivesNegatives: {
      falsePositives: ['Déficit de Ornitina Transcarbamilasa (OTC) del ciclo de la urea (presenta amonio > 200 µmol/L)'],
      falseNegatives: ['Tratamiento previo con uridina antes de la toma de muestra']
    },
    discriminatoryContexts: [
      'Discrimina la Aciduria Orótica Hereditaria (amonio normal) del Déficit de OTC del Ciclo de la Urea (hiperamonemia neurotóxica).'
    ]
  },
  {
    id: 'bm_galt_eritrocitaria',
    name: 'Actividad Enzimática de Galactosa-1-Fosfato Uridiltransferasa (GALT)',
    abbreviation: 'Actividad GALT',
    isoforms: 'Enzima citosólica de la vía de Leloir',
    system: 'hepatic',
    referenceValues: {
      conventional: '18.5 - 28.5 µmol/h/g Hb en eritrocitos',
      si: '18.5 - 28.5 µmol/h/g Hb',
      genderAgeVariations: 'Estable desde el nacimiento.'
    },
    temporalWindow: {
      elevationStart: 'Déficit congénito (actividad casi nula < 1% en forma clásica)',
      peakWindow: 'Crisis tóxica aguda neonatal tras iniciar lactancia',
      normalizationWindow: 'La actividad enzimática nunca se recupera; la galactosemia plasmática se normaliza con fórmula sin galactosa',
      halfLife: 'No aplica'
    },
    diagnosticParams: {
      sensitivity: '99% para Galactosemia Clásica',
      specificity: '100% ante ensayo fluorométrico cuantitativo de Beutler',
      optimalCutoff: 'Actividad < 10% del control normal'
    },
    clinicalRelevance: 'El déficit de GALT provoca la acumulación masiva de galactosa-1-fosfato, que atrapa fosfato inorgánico e inhibe la glucógeno fosforilasa y fosfoglucomutasa (hipoglucemia y daño hepatocelular fulminante). La galactosa libre se reduce a galactitol por la aldosa reductasa, causando cataratas osmóticas bilaterales en gota de aceite.',
    diagnosticIndication: 'Diagnóstico urgente de Galactosemia Clásica en recién nacidos con ictericia, vómitos y cataratas.',
    falsePositivesNegatives: {
      falsePositives: ['Transfusión de concentrado de hematíes previa al análisis (aporta hematíes normales de donante con GALT)'],
      falseNegatives: ['Variantes genéticas leves tipo Duarte (actividad residual 25-50%)']
    },
    discriminatoryContexts: [
      'Diferencia la galactosemia clásica de la atresia biliar y la sepsis neonatal con ictericia.'
    ]
  },
  {
    id: 'bm_hexosaminidasa_a',
    name: 'Actividad de Beta-Hexosaminidasa A en Leucocitos y Suero',
    abbreviation: 'Hexosaminidasa A',
    isoforms: 'Heterodímero alfa-beta lisosómico (codificado por gen HEXA)',
    system: 'metabolic',
    referenceValues: {
      conventional: '55% - 75% de la hexosaminidasa total (forma A termolábil)',
      si: '55% - 75%',
      genderAgeVariations: 'Disminución relativa fisiológica en el embarazo.'
    },
    temporalWindow: {
      elevationStart: 'Déficit absoluto de por vida',
      peakWindow: 'Deterioro neurodegenerativo acelerado entre 6 y 18 meses de vida',
      normalizationWindow: 'Irreversible',
      halfLife: 'No aplica'
    },
    diagnosticParams: {
      sensitivity: '100% para Enfermedad de Tay-Sachs clásica infantil',
      specificity: '99% mediante ensayo con 4-MUG fluorogénico y termoinactivación',
      optimalCutoff: 'Actividad de isoenzima A < 5% de la total'
    },
    clinicalRelevance: 'La Hexosaminidasa A es indispensable para hidrolizar el residuo de N-acetilgalactosamina terminal del gangliósido GM2 en los lisosomas de las neuronas. Su ausencia genera acumulación patológica de GM2 con balonamiento neuronal masivo, apoptosis en la corteza y retina (mancha rojo cereza retiniana) y ceguera progresiva.',
    diagnosticIndication: 'Confirmación diagnóstica de Enfermedad de Tay-Sachs y cribado de portadores.',
    falsePositivesNegatives: {
      falsePositives: ['Pseudodeficiencia benigna (requiere sustrato natural sulfatado 4-MUGS)'],
      falseNegatives: ['Enfermedad de Sandhoff (están bajas TANTO la Hex A como la Hex B)']
    },
    discriminatoryContexts: [
      'Diferencia Tay-Sachs (déficit selectivo de Hex A) de la Enfermedad de Sandhoff (déficit global de Hex A y Hex B).'
    ]
  },
  {
    id: 'bm_tiamina_transcetolasa',
    name: 'Actividad de Transcetolasa Eritrocitaria y Coeficiente de Activación por TPP',
    abbreviation: 'Efecto TPP Transcetolasa',
    isoforms: 'Enzima citosólica de la vía de las pentosas fosfato dependiente de pirofosfato de tiamina',
    system: 'metabolic',
    referenceValues: {
      conventional: 'Efecto TPP < 15% (Estado adecuado de vitamina B1); 15-25% (Deficiencia marginal); > 25% (Deficiencia franca)',
      si: 'Efecto TPP < 15%',
      genderAgeVariations: 'Idéntico en ambos sexos.'
    },
    temporalWindow: {
      elevationStart: 'Depleción tisular tras 2-3 semanas de ingesta inadecuada o malnutrición alcohólica',
      peakWindow: 'Crisis aguda de Encefalopatía de Wernicke (tríada ataxia, oftalmoplejía, confusión)',
      normalizationWindow: 'Revierte rápidamente tras administración parenteral de tiamina (100-500 mg IV)',
      halfLife: '9 - 18 días en reservas corporales totales'
    },
    diagnosticParams: {
      sensitivity: '92% para déficit funcional grave de Vitamina B1',
      specificity: '96% como marcador funcional intracelular de tiamina activa',
      optimalCutoff: 'Incremento de actividad > 25% tras añadir TPP in vitro'
    },
    clinicalRelevance: 'El pirofosfato de tiamina (TPP) es cofactor esencial de la Transcetolasa, del complejo Piruvato Deshidrogenasa (PDH) y Alfa-Cetoglutarato Deshidrogenasa en el ciclo de Krebs. Si se administra glucosa intravenosa sin tiamina, se acelera la glucólisis pero el piruvato no puede entrar a Krebs, desviándose a lactato y precipitando daño neuronal letal en cuerpos mamilares.',
    diagnosticIndication: 'Confirmación de deficiencia funcional de Vitamina B1 (Encefalopatía de Wernicke / Beriberi).',
    falsePositivesNegatives: {
      falsePositives: ['Muestras hemolizadas o congeladas incorrectamente'],
      falseNegatives: ['Administración de complejos vitamínicos previa a la extracción']
    },
    discriminatoryContexts: [
      'Confirma la Encefalopatía de Wernicke y justifica la administración inmediata de Tiamina antes de cualquier infusión de glucosa.'
    ]
  }
];
