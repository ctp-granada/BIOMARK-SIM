import { Biomarker } from '../types';

export const BIOMARKERS_DATABASE: Biomarker[] = [
  // Cardíaco
  {
    id: 'bm_troponin_c',
    name: 'Troponina Cardíaca de Alta Sensibilidad (hs-cTn)',
    abbreviation: 'hs-cTnI / hs-cTnT',
    system: 'cardiac',
    referenceValues: { conventional: '< 14 ng/L (mujeres), < 26 ng/L (hombres)', si: '< 0.014 µg/L' },
    temporalWindow: { elevationStart: '2-4 horas', peak: '12-24 horas', normalizationWindow: '7-14 días', halfLife: '2 horas' },
    diagnosticParams: { sensitivity: '98%', specificity: '92%', optimalCutoff: '> 52 ng/L' },
    clinicalRelevance: 'Biomarcador de elección para necrosis miocárdica (IAMCEST y SCASEST).',
    diagnosticIndication: 'Sospecha de Síndrome Coronario Agudo, miocarditis aguda o contusión miocárdica.',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia renal crónica (aclaramiento reducido)', 'Embolismo pulmonar masivo', 'Sepsis / Shock'],
      falseNegatives: ['Toma hiperprecoz (< 1h tras inicio del dolor)']
    },
    discriminatoryContexts: ['Distingue necrosis miocárdica de dolor osteomuscular o esofágico.'],
    cost: 35
  },
  {
    id: 'bm_ckmb',
    name: 'Creatina Quinasa fracción MB (CK-MB masa)',
    abbreviation: 'CK-MB',
    system: 'cardiac',
    referenceValues: { conventional: '< 5 ng/mL (o < 6% de CK total)', si: '< 5 µg/L' },
    temporalWindow: { elevationStart: '4-6 horas', peak: '18-24 horas', normalizationWindow: '48-72 horas' },
    diagnosticParams: { sensitivity: '90%', specificity: '88%', optimalCutoff: '> 6.0 ng/mL' },
    clinicalRelevance: 'Útil para la detección de reinfarto precoz gracias a su rápida normalización.',
    diagnosticIndication: 'Sospecha de reinfarto agudo dentro de los primeros 7 días del evento índice.',
    falsePositivesNegatives: {
      falsePositives: ['Traumatismo muscular masivo', 'Cirugía cardíaca reciente'],
      falseNegatives: ['Determinación tardía (> 72h tras el episodio)']
    },
    discriminatoryContexts: ['Elevación tras infarto previo estabilizado indica nuevo evento isquémico.'],
    cost: 25
  },
  {
    id: 'bm_nt_probnp',
    name: 'Fracción N-terminal del pro-péptido natriurético tipo B (NT-proBNP)',
    abbreviation: 'NT-proBNP',
    system: 'cardiac',
    referenceValues: { conventional: '< 125 pg/mL (< 75 años: < 300 pg/mL)', si: '< 14.8 pmol/L' },
    temporalWindow: { elevationStart: 'Inmediata ante sobrecarga', peak: 'Variable', normalizationWindow: 'Días tras estabilización' },
    diagnosticParams: { sensitivity: '99%', specificity: '85%', optimalCutoff: '> 300 pg/mL' },
    clinicalRelevance: 'Marcador de estrés biomecánico parietal ventricular en insuficiencia cardíaca.',
    diagnosticIndication: 'Descarte y estratificación de Insuficiencia Cardíaca aguda y crónica.',
    falsePositivesNegatives: {
      falsePositives: ['Fibrilación auricular', 'Insuficiencia renal', 'Edad avanzada'],
      falseNegatives: ['Obesidad mórbida']
    },
    discriminatoryContexts: ['Distingue disnea de origen cardíaco de disnea pulmonar pura (EPOC, asma).'],
    cost: 40
  },
  {
    id: 'bm_ldh',
    name: 'Lactato Deshidrogenasa Total',
    abbreviation: 'LDH',
    system: 'cardiac',
    referenceValues: { conventional: '140 - 280 U/L', si: '2.3 - 4.7 µkat/L' },
    temporalWindow: { elevationStart: '12-24 horas', peak: '48-72 horas', normalizationWindow: '8-14 días' },
    diagnosticParams: { sensitivity: '85%', specificity: '60%', optimalCutoff: '> 350 U/L' },
    clinicalRelevance: 'Marcador citosólico inespecífico de lisis tisular celular masiva o hemólisis.',
    diagnosticIndication: 'Estudio de anemias hemolíticas, lisis tumoral y daño tisular.',
    falsePositivesNegatives: {
      falsePositives: ['Hemólisis in vitro del tubo', 'Infarto renal o pulmonar'],
      falseNegatives: ['Fase hiperprecoz']
    },
    discriminatoryContexts: ['Marcada elevación con haptoglobina indetectable confirma anemia hemolítica.'],
    cost: 15
  },

  // Hepático
  {
    id: 'bm_alt',
    name: 'Alanina Aminotransferasa (ALT / GPT)',
    abbreviation: 'ALT',
    system: 'hepatic',
    referenceValues: { conventional: '7 - 56 U/L', si: '0.12 - 0.93 µkat/L' },
    temporalWindow: { elevationStart: '6-12 horas', peak: '24-48 horas', normalizationWindow: '1-3 semanas' },
    diagnosticParams: { sensitivity: '94%', specificity: '90%', optimalCutoff: '> 300 U/L en necrosis aguda' },
    clinicalRelevance: 'Enzima citosólica de gran especificidad para citólisis hepatocelular.',
    diagnosticIndication: 'Sospecha de hepatitis aguda, toxicidad farmacológica o isquemia hepática.',
    falsePositivesNegatives: {
      falsePositives: ['Rabdomiólisis severa'],
      falseNegatives: ['Cirrosis terminal con depleción del parénquima']
    },
    discriminatoryContexts: ['Cociente AST/ALT < 1 orienta a hepatitis vírica/esteatosis.'],
    cost: 15
  },
  {
    id: 'bm_ast',
    name: 'Aspartato Aminotransferasa (AST / GOT)',
    abbreviation: 'AST',
    system: 'hepatic',
    referenceValues: { conventional: '10 - 40 U/L', si: '0.17 - 0.67 µkat/L' },
    temporalWindow: { elevationStart: '6-8 horas', peak: '24-36 horas', normalizationWindow: '4-6 días' },
    diagnosticParams: { sensitivity: '88%', specificity: '78%', optimalCutoff: '> 200 U/L' },
    clinicalRelevance: 'Enzima mitocondrial y citosólica presente en hígado, corazón y músculo.',
    diagnosticIndication: 'Evaluación de daño hepatocelular profundo y hepatitis alcohólica.',
    falsePositivesNegatives: {
      falsePositives: ['Hemólisis in vitro', 'Necrosis miocárdica'],
      falseNegatives: ['Déficit de vitamina B6']
    },
    discriminatoryContexts: ['AST/ALT > 2 sugiere fuertemente daño hepático inducido por alcohol.'],
    cost: 15
  },
  {
    id: 'bm_bilirrubina_total',
    name: 'Bilirrubina Total',
    abbreviation: 'BT',
    system: 'hepatic',
    referenceValues: { conventional: '0.2 - 1.2 mg/dL', si: '3.4 - 20.5 µmol/L' },
    temporalWindow: { elevationStart: 'Horas', peak: 'Variable', normalizationWindow: 'Días a semanas' },
    diagnosticParams: { sensitivity: '90%', specificity: '85%', optimalCutoff: '> 2.5 mg/dL da ictericia clínica' },
    clinicalRelevance: 'Pigmento biliar derivado del catabolismo del grupo hemo.',
    diagnosticIndication: 'Estudio de ictericia, colestasis o hemólisis.',
    falsePositivesNegatives: {
      falsePositives: ['Síndrome de Gilbert en ayuno'],
      falseNegatives: ['Exposición de la muestra a la luz']
    },
    discriminatoryContexts: ['Fraccionamiento permite clasificar ictericia en directa o indirecta.'],
    cost: 15
  },
  {
    id: 'bm_bilirrubina_directa',
    name: 'Bilirrubina Directa / Conjugada',
    abbreviation: 'BD',
    system: 'hepatic',
    referenceValues: { conventional: '0.0 - 0.3 mg/dL', si: '0.0 - 5.1 µmol/L' },
    temporalWindow: { elevationStart: 'Horas', peak: 'Variable', normalizationWindow: 'Días tras resolución' },
    diagnosticParams: { sensitivity: '92%', specificity: '91%', optimalCutoff: '> 50% de la bilirrubina total' },
    clinicalRelevance: 'Indica afectación excretora canalicular biliar o colestasis mecánica.',
    diagnosticIndication: 'Sospecha de litiasis biliar, colangitis o neoplasia de vía biliar.',
    falsePositivesNegatives: {
      falsePositives: ['Fármacos colestásicos'],
      falseNegatives: ['Degradación fotolítica']
    },
    discriminatoryContexts: ['BD elevada con acolia y coluria confirma colestasis.'],
    cost: 18
  },
  {
    id: 'bm_fosfatasa_alcalina',
    name: 'Fosfatasa Alcalina',
    abbreviation: 'FA',
    system: 'hepatic',
    referenceValues: { conventional: '44 - 147 U/L', si: '0.7 - 2.5 µkat/L' },
    temporalWindow: { elevationStart: '12-24 horas post-obstrucción', peak: '3-5 días', normalizationWindow: '2-4 semanas' },
    diagnosticParams: { sensitivity: '95%', specificity: '91%', optimalCutoff: '> 2x LSN' },
    clinicalRelevance: 'Enzima de la membrana canalicular hepatobiliar y del tejido óseo.',
    diagnosticIndication: 'Sospecha de obstrucción biliar, colestasis o patología ósea.',
    falsePositivesNegatives: {
      falsePositives: ['Embarazo', 'Crecimiento infantil'],
      falseNegatives: ['Colestasis hiperaguda precoz']
    },
    discriminatoryContexts: ['Confirmación con GGT distingue origen biliar de origen óseo.'],
    cost: 20
  },
  {
    id: 'bm_ggt',
    name: 'Gamma-Glutamil Transferasa',
    abbreviation: 'GGT',
    system: 'hepatic',
    referenceValues: { conventional: '9 - 48 U/L', si: '0.15 - 0.80 µkat/L' },
    temporalWindow: { elevationStart: '12 horas', peak: 'Días', normalizationWindow: '2-4 semanas' },
    diagnosticParams: { sensitivity: '96%', specificity: '82%', optimalCutoff: '> 80 U/L' },
    clinicalRelevance: 'Marcador altamente sensible de colestasis e inducción enzimática por alcohol.',
    diagnosticIndication: 'Confirmación de origen biliar de una FA elevada y despistaje de enolismo.',
    falsePositivesNegatives: {
      falsePositives: ['Fármacos inductores (fenitoína, barbitúricos)'],
      falseNegatives: ['Casos iniciales leves']
    },
    discriminatoryContexts: ['FA alta + GGT alta = biliar; FA alta + GGT normal = óseo.'],
    cost: 18
  },

  // Metabólico
  {
    id: 'bm_glucosa',
    name: 'Glucosa Plasmática en Ayunas / Urgente',
    abbreviation: 'Gluc',
    system: 'metabolic',
    referenceValues: { conventional: '70 - 100 mg/dL', si: '3.9 - 5.6 mmol/L' },
    temporalWindow: { elevationStart: 'Inmediata', peak: 'Horas', normalizationWindow: 'Horas' },
    diagnosticParams: { sensitivity: '99%', specificity: '98%', optimalCutoff: '> 126 mg/dL ayuno, > 200 urgente' },
    clinicalRelevance: 'Monosacárido central en el metabolismo energético de carbohidratos.',
    diagnosticIndication: 'Diagnóstico de cetoacidosis diabética, coma hiperosmolar o hipoglucemia.',
    falsePositivesNegatives: {
      falsePositives: ['Estrés agudo, infusión previa de sueros glucosados'],
      falseNegatives: ['Glucólisis in vitro por retardo en centrifugación sin tubo de fluoruro']
    },
    discriminatoryContexts: ['Glucosa > 250 mg/dL con acidosis define cetoacidosis diabética.'],
    cost: 10
  },
  {
    id: 'bm_beta_hidroxibutirato',
    name: 'Beta-Hidroxibutirato en Sangre (Cuerpo Cetónico Cuantitativo)',
    abbreviation: 'B-OHB',
    system: 'metabolic',
    referenceValues: { conventional: '< 0.5 mmol/L', si: '< 0.5 mmol/L' },
    temporalWindow: { elevationStart: 'Horas en ayuno o déficit de insulina', peak: 'Durante crisis', normalizationWindow: 'Horas con insulina' },
    diagnosticParams: { sensitivity: '99%', specificity: '98%', optimalCutoff: '> 3.0 mmol/L confirma CAD' },
    clinicalRelevance: 'Cuerpo cetónico predominante en sangre durante la cetoacidosis.',
    diagnosticIndication: 'Diagnóstico urgente de cetoacidosis diabética e hipoglucemias cetósicas.',
    falsePositivesNegatives: {
      falsePositives: ['Cetoacidosis de ayuno o alcohólica'],
      falseNegatives: ['Tiras reactivas de orina que solo detectan acetoacetato']
    },
    discriminatoryContexts: ['B-OHB > 3.0 mmol/L con pH bajo confirma CAD.'],
    cost: 25
  },
  {
    id: 'bm_perfil_acilcarnitinas',
    name: 'Perfil de Acilcarnitinas Plasmáticas (Tandem MS)',
    abbreviation: 'Acilcarnitinas',
    system: 'metabolic',
    referenceValues: { conventional: 'C0 libre: 25-54 µmol/L | C16: < 3.0 µmol/L | C8: < 0.3 µmol/L', si: 'µmol/L' },
    temporalWindow: { elevationStart: 'Constitutivo / Agudizado en ayuno', peak: 'En crisis', normalizationWindow: 'Tratamiento' },
    diagnosticParams: { sensitivity: '98%', specificity: '99%', optimalCutoff: 'C0 < 5 (OCTN2) o C16 alto (CPT2)' },
    clinicalRelevance: 'Diagnóstico de los defectos de la lanzadera de carnitina y de la B-oxidación mitocondrial.',
    diagnosticIndication: 'Hipoglucemia hipocetósica, rabdomiólisis tras ejercicio o miocardiopatía.',
    falsePositivesNegatives: {
      falsePositives: ['Tratamiento con ácido valproico'],
      falseNegatives: ['Administración previa de carnitina exógena']
    },
    discriminatoryContexts: ['C0 colapsada = OCTN2; C16 y C18 altas = CPT2; C8 alta = MCAD.'],
    cost: 180
  },
  {
    id: 'bm_relacion_acilcarnitina_carnitina',
    name: 'Ratio Acilcarnitinas / Carnitina Libre',
    abbreviation: '(C16+C18:1)/C0',
    system: 'metabolic',
    referenceValues: { conventional: '< 0.05', si: '< 0.05' },
    temporalWindow: { elevationStart: 'En crisis', peak: 'Crisis', normalizationWindow: 'Tratamiento' },
    diagnosticParams: { sensitivity: '95%', specificity: '98%', optimalCutoff: '> 0.10 confirma CPT2/CACT' },
    clinicalRelevance: 'Índice de saturación o bloqueo de la translocación de acilcarnitinas intramitocondrial.',
    diagnosticIndication: 'Diferenciación entre defectos de CPT1A (ratio bajo) y CPT2 (ratio alto).',
    falsePositivesNegatives: {
      falsePositives: ['Ayuno muy prolongado en sujetos sanos'],
      falseNegatives: ['Sobrecarga con carnitina libre']
    },
    discriminatoryContexts: ['Ratio > 0.10 orienta fuertemente a deficiencia de CPT2.'],
    cost: 95
  },
  {
    id: 'bm_trigliceridos',
    name: 'Triglicéridos Séricos',
    abbreviation: 'TG',
    system: 'metabolic',
    referenceValues: { conventional: '< 150 mg/dL', si: '< 1.7 mmol/L' },
    temporalWindow: { elevationStart: 'Horas postprandiales', peak: '4-6 horas tras grasa', normalizationWindow: '12h ayuno' },
    diagnosticParams: { sensitivity: '90%', specificity: '90%', optimalCutoff: '> 1000 mg/dL riesgo de pancreatitis' },
    clinicalRelevance: 'Lípidos de reserva transportados en quilomicrones y VLDL.',
    diagnosticIndication: 'Cribado de dislipemias, pancreatitis aguda inducida por hipertrigliceridemia.',
    falsePositivesNegatives: {
      falsePositives: ['Muestra sin ayuno de 12 horas previo', 'Alcohol reciente'],
      falseNegatives: ['Dieta hipograsa estricta previa']
    },
    discriminatoryContexts: ['TG > 1000 mg/dL causan pancreatitis aguda por toxicidad de ácidos grasos libres.'],
    cost: 15
  },
  {
    id: 'bm_fasting_insulin',
    name: 'Insulina Plasmática en Ayunas e Índice HOMA-IR',
    abbreviation: 'Insulina / HOMA',
    system: 'metabolic',
    referenceValues: { conventional: '2.6 - 24.9 µIU/mL | HOMA-IR: < 2.5', si: '18 - 173 pmol/L' },
    temporalWindow: { elevationStart: 'Minutos', peak: '30-60 min postprandial', normalizationWindow: 'Ayuno' },
    diagnosticParams: { sensitivity: '90%', specificity: '88%', optimalCutoff: 'HOMA-IR > 3.8 resistencia severa' },
    clinicalRelevance: 'Hormona anabólica central sintetizada por células beta de los islotes pancreáticos.',
    diagnosticIndication: 'Diagnóstico de insulinoma, síndrome metabólico o resistencia a insulina.',
    falsePositivesNegatives: {
      falsePositives: ['Obesidad severa', 'Tratamiento con sulfonilureas'],
      falseNegatives: ['Déficit secretor tardío']
    },
    discriminatoryContexts: ['Insulina inapropiadamente alta durante hipoglucemia confirma insulinoma.'],
    cost: 45
  },

  // Pancreático
  {
    id: 'bm_lipasa',
    name: 'Lipasa Sérica de Alta Especificidad',
    abbreviation: 'Lipasa',
    system: 'pancreatic',
    referenceValues: { conventional: '10 - 140 U/L', si: '0.17 - 2.33 µkat/L' },
    temporalWindow: { elevationStart: '4-8 horas', peak: '24 horas', normalizationWindow: '8-14 días' },
    diagnosticParams: { sensitivity: '98%', specificity: '97%', optimalCutoff: '> 3x LSN (> 420 U/L)' },
    clinicalRelevance: 'Biomarcador de elección para el diagnóstico de Pancreatitis Aguda.',
    diagnosticIndication: 'Dolor abdominal agudo epigástrico irradiado en cinturón a la espalda.',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia renal avanzada', 'Colecistitis o perforación intestinal'],
      falseNegatives: ['Hipertrigliceridemia grave que interfiere con la prueba óptica']
    },
    discriminatoryContexts: ['Lipasa > 3x LSN cumple criterio de pancreatitis de Atlanta.'],
    cost: 25
  },
  {
    id: 'bm_amilasa',
    name: 'Amilasa Sérica Total',
    abbreviation: 'Amilasa',
    system: 'pancreatic',
    referenceValues: { conventional: '28 - 100 U/L', si: '0.47 - 1.67 µkat/L' },
    temporalWindow: { elevationStart: '2-12 horas', peak: '12-24 horas', normalizationWindow: '3-5 días' },
    diagnosticParams: { sensitivity: '80%', specificity: '75%', optimalCutoff: '> 3x LSN' },
    clinicalRelevance: 'Enzima que hidroliza almidón y glucógeno, producida en páncreas y glándulas salivales.',
    diagnosticIndication: 'Sospecha de patología pancreática o salival (parotiditis).',
    falsePositivesNegatives: {
      falsePositives: ['Parotiditis', 'Macroamilasemia', 'Embarazo ectópico'],
      falseNegatives: ['Consulta tardía (> 4 días tras el inicio del dolor)']
    },
    discriminatoryContexts: ['La lipasa tiene mayor sensibilidad y ventana diagnóstica que la amilasa.'],
    cost: 15
  },
  {
    id: 'bm_elastasa_fecal',
    name: 'Elastasa Fecal-1 Pancreática',
    abbreviation: 'FE-1',
    system: 'pancreatic',
    referenceValues: { conventional: '> 200 µg/g de heces (grave: < 100)', si: '> 200 µg/g' },
    temporalWindow: { elevationStart: 'Crónico', peak: 'Estable', normalizationWindow: 'Irreversible' },
    diagnosticParams: { sensitivity: '95%', specificity: '93%', optimalCutoff: '< 200 µg/g' },
    clinicalRelevance: 'Biomarcador no invasivo para Insuficiencia Pancreática Exocrina.',
    diagnosticIndication: 'Sospecha de pancreatitis crónica, diarrea con esteatorrea, pérdida ponderal.',
    falsePositivesNegatives: {
      falsePositives: ['Diarrea líquida profusa por dilución de la muestra'],
      falseNegatives: ['Insuficiencia exocrina leve']
    },
    discriminatoryContexts: ['Distingue esteatorrea pancreática de enfermedad celíaca.'],
    cost: 95
  },
  {
    id: 'bm_ttg_iga',
    name: 'Anticuerpos Anti-Transglutaminasa Tisular IgA (tTG-IgA)',
    abbreviation: 'tTG-IgA',
    system: 'pancreatic',
    referenceValues: { conventional: '< 10 U/mL (negativo)', si: '< 10 U/mL' },
    temporalWindow: { elevationStart: 'Crónico', peak: 'Con gluten', normalizationWindow: 'Meses sin gluten' },
    diagnosticParams: { sensitivity: '98%', specificity: '98%', optimalCutoff: '> 10x LSN (> 100 U/mL)' },
    clinicalRelevance: 'Pilar serológico para el diagnóstico de Enfermedad Celíaca.',
    diagnosticIndication: 'Diarrea crónica, malabsorción, ferropenia refractaria o esteatorrea.',
    falsePositivesNegatives: {
      falsePositives: ['Hepatopatías autoinmunes graves'],
      falseNegatives: ['Déficit selectivo de IgA (requiere cuantificar IgA total)']
    },
    discriminatoryContexts: ['Positividad > 10x con anti-endomisio positivos confirma celíaca.'],
    cost: 65
  },
  {
    id: 'bm_vitamina_b12',
    name: 'Vitamina B12 (Cobalamina) Plasmática',
    abbreviation: 'Vit B12',
    system: 'pancreatic',
    referenceValues: { conventional: '200 - 900 pg/mL', si: '148 - 664 pmol/L' },
    temporalWindow: { elevationStart: 'Meses a años (depósitos hepáticos)', peak: 'Variable', normalizationWindow: 'Semanas tras suplemento' },
    diagnosticParams: { sensitivity: '90%', specificity: '85%', optimalCutoff: '< 200 pg/mL' },
    clinicalRelevance: 'Vitamina hidrosoluble esencial para la síntesis de ADN y mielina.',
    diagnosticIndication: 'Anemia macrocítica, pancitopenia o síntomas neuropsiquiátricos.',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia renal o síndrome mieloproliferativo'],
      falseNegatives: ['Falso déficit por déficit de transcobalamina']
    },
    discriminatoryContexts: ['Déficit con gastritis atrófica orienta a anemia perniciosa.'],
    cost: 30
  },
  {
    id: 'bm_magnesio',
    name: 'Magnesio Sérico',
    abbreviation: 'Mg',
    system: 'pancreatic',
    referenceValues: { conventional: '1.7 - 2.2 mg/dL', si: '0.70 - 0.90 mmol/L' },
    temporalWindow: { elevationStart: 'Días', peak: 'Variable', normalizationWindow: 'Horas' },
    diagnosticParams: { sensitivity: '85%', specificity: '90%', optimalCutoff: '< 1.5 mg/dL' },
    clinicalRelevance: 'Cofactor de más de 300 enzimas que utilizan ATP.',
    diagnosticIndication: 'Malabsorción intestinal, diarrea crónica o arritmias ventriculares.',
    falsePositivesNegatives: {
      falsePositives: ['Hemólisis in vitro'],
      falseNegatives: ['Déficit intracelular con magnesio sérico normal']
    },
    discriminatoryContexts: ['Hipomagnesemia refractaria causa hipocalcemia e hipopotasemia secundarias.'],
    cost: 15
  },

  // Renal
  {
    id: 'bm_creatinina',
    name: 'Creatinina Sérica',
    abbreviation: 'Cr',
    system: 'renal',
    referenceValues: { conventional: '0.6 - 1.2 mg/dL', si: '53 - 106 µmol/L' },
    temporalWindow: { elevationStart: '12-24 horas tras daño', peak: '24-48 horas', normalizationWindow: 'Días a semanas' },
    diagnosticParams: { sensitivity: '85%', specificity: '90%', optimalCutoff: 'Aumento > 0.3 mg/dL en 48h' },
    clinicalRelevance: 'Marcador clásico de filtración glomerular renal.',
    diagnosticIndication: 'Insuficiencia renal aguda o crónica, monitorización de nefrotóxicos.',
    falsePositivesNegatives: {
      falsePositives: ['Masa muscular elevada, ingesta de carne cocida'],
      falseNegatives: ['Ancianos caquécticos o cirróticos']
    },
    discriminatoryContexts: ['Permite estimar el filtrado glomerular (CKD-EPI).'],
    cost: 12
  },
  {
    id: 'bm_urea',
    name: 'Urea Plasmática',
    abbreviation: 'Urea',
    system: 'renal',
    referenceValues: { conventional: '15 - 45 mg/dL', si: '2.5 - 7.5 mmol/L' },
    temporalWindow: { elevationStart: '12 horas', peak: '24 horas', normalizationWindow: 'Días' },
    diagnosticParams: { sensitivity: '80%', specificity: '82%', optimalCutoff: '> 50 mg/dL' },
    clinicalRelevance: 'Producto final del catabolismo de aminoácidos en el ciclo de la urea.',
    diagnosticIndication: 'Evaluación de hidratación, función renal y catabolismo proteico.',
    falsePositivesNegatives: {
      falsePositives: ['Sangrado digestivo alto, catabolismo hiperproteico'],
      falseNegatives: ['Dieta hipoproteica severa, insuficiencia hepática']
    },
    discriminatoryContexts: ['Ratio Urea/Creatinina > 40 orienta a causa prerrenal por deshidratación.'],
    cost: 10
  },
  {
    id: 'bm_amonio_plasmatico',
    name: 'Amonio Plasmático (NH4+)',
    abbreviation: 'Amonio',
    system: 'renal',
    referenceValues: { conventional: '15 - 45 µg/dL', si: '11 - 32 µmol/L' },
    temporalWindow: { elevationStart: 'Horas', peak: 'Crisis', normalizationWindow: 'Horas tras depuración' },
    diagnosticParams: { sensitivity: '95%', specificity: '90%', optimalCutoff: '> 80 µmol/L en encefalopatía' },
    clinicalRelevance: 'Metabolito neurotóxico aclarado por el ciclo de la urea hepático.',
    diagnosticIndication: 'Encefalopatía hepática aguda, defectos congénitos del ciclo de la urea.',
    falsePositivesNegatives: {
      falsePositives: ['Torniquete prolongado, retraso en enviar muestra en hielo'],
      falseNegatives: ['Determinación tardía']
    },
    discriminatoryContexts: ['Hiperamonemia con alcalosis respiratoria orienta a defecto del ciclo de la urea.'],
    cost: 35
  },
  {
    id: 'bm_acido_urico',
    name: 'Ácido Úrico Sérico',
    abbreviation: 'AU',
    system: 'renal',
    referenceValues: { conventional: '3.5 - 7.2 mg/dL', si: '208 - 428 µmol/L' },
    temporalWindow: { elevationStart: 'Crónico / Rápido en lisis tumoral', peak: 'Variable', normalizationWindow: 'Días con hipouricemiantes' },
    diagnosticParams: { sensitivity: '85%', specificity: '85%', optimalCutoff: '> 6.8 mg/dL punto de saturación' },
    clinicalRelevance: 'Producto final del catabolismo de las purinas en el ser humano.',
    diagnosticIndication: 'Sospecha de gota, litiasis renal úrica o síndrome de lisis tumoral.',
    falsePositivesNegatives: {
      falsePositives: ['Uso de tiazidas, insuficiencia renal'],
      falseNegatives: ['Crisis gotosa hiperaguda (puede normalizarse transitoriamente)']
    },
    discriminatoryContexts: ['Hiperuricemia > 6.8 mg/dL predispone a la precipitación de urato monosódico.'],
    cost: 15
  },
  {
    id: 'bm_cristales_liquido_sinovial',
    name: 'Cristales en Líquido Sinovial (Luz Polarizada Compensada)',
    abbreviation: 'Cristales Sinoviales',
    system: 'renal',
    referenceValues: { conventional: 'Ausentes', si: 'Negativo' },
    temporalWindow: { elevationStart: 'Durante la crisis inflamatoria articular', peak: 'Agudo', normalizationWindow: 'Persisten en el tofo' },
    diagnosticParams: { sensitivity: '99%', specificity: '100%', optimalCutoff: 'Presencia de microcristales birrefringentes' },
    clinicalRelevance: 'Estándar de oro indiscutible para el diagnóstico de artropatías microcristalinas.',
    diagnosticIndication: 'Monoartritis aguda (podagra o rodilla caliente).',
    falsePositivesNegatives: {
      falsePositives: ['Artefactos de cristal de talco'],
      falseNegatives: ['Artrocentesis seca o muestra escasa']
    },
    discriminatoryContexts: ['Cristales en aguja con birrefringencia negativa fuerte confirman gota.'],
    cost: 50
  },

  // Neuromuscular
  {
    id: 'bm_achr_ab',
    name: 'Anticuerpos Anti-Receptor de Acetilcolina (anti-AChR)',
    abbreviation: 'Anti-AChR',
    system: 'neuromuscular',
    referenceValues: { conventional: '< 0.40 nmol/L (negativo)', si: '< 0.40 nmol/L' },
    temporalWindow: { elevationStart: 'Crónico', peak: 'Fluctuante con crisis', normalizationWindow: 'Disminuye con terapia' },
    diagnosticParams: { sensitivity: '85% en forma generalizada', specificity: '99%', optimalCutoff: '> 0.50 nmol/L' },
    clinicalRelevance: 'Marcador patognomónico de Miastenia Gravis autoinmune postsináptica.',
    diagnosticIndication: 'Ptosis palpebral, diplopía y fatigabilidad muscular de predominio vespertino.',
    falsePositivesNegatives: {
      falsePositives: ['Excepcional'],
      falseNegatives: ['Formas oculares puras (hasta 50% seronegativos)']
    },
    discriminatoryContexts: ['Positividad confirma mecanismo autoinmune postsináptico.'],
    cost: 95
  },
  {
    id: 'bm_ck_total',
    name: 'Creatina Quinasa Total (CK)',
    abbreviation: 'CPK',
    system: 'neuromuscular',
    referenceValues: { conventional: '30 - 200 U/L', si: '0.5 - 3.4 µkat/L' },
    temporalWindow: { elevationStart: '2-12 horas', peak: '24-72 horas', normalizationWindow: '5-10 días' },
    diagnosticParams: { sensitivity: '99%', specificity: '90%', optimalCutoff: '> 1000 U/L' },
    clinicalRelevance: 'Marcador central de necrosis del sarcolema muscular en rabdomiólisis y distrofias.',
    diagnosticIndication: 'Mialgias intensas, debilidad muscular o sospecha de miopatía.',
    falsePositivesNegatives: {
      falsePositives: ['Inyecciones intramusculares, ejercicio físico extremo'],
      falseNegatives: ['Fase tardía de resolución']
    },
    discriminatoryContexts: ['CPK > 10.000 U/L alerta de riesgo de daño renal agudo pigmentario.'],
    cost: 15
  },

  // Miscelánea / Casos Específicos
  {
    id: 'bm_metanephrines_plasma',
    name: 'Metanefrinas Libres en Plasma Fraccionadas',
    abbreviation: 'Metanefrinas',
    system: 'cardiac',
    referenceValues: { conventional: 'Normetanefrina: < 145 pg/mL | Metanefrina: < 90 pg/mL', si: 'pmol/L' },
    temporalWindow: { elevationStart: 'Paroxístico en crisis', peak: 'Durante paroxismo', normalizationWindow: 'Variable' },
    diagnosticParams: { sensitivity: '97%', specificity: '95%', optimalCutoff: '> 3x LSN' },
    clinicalRelevance: 'Metabolitos extraneuronales continuos de la degradación de adrenalina y noradrenalina.',
    diagnosticIndication: 'Sospecha de feocromocitoma o paraganglioma.',
    falsePositivesNegatives: {
      falsePositives: ['Estrés severo, labetalol, antidepresivos tricíclicos'],
      falseNegatives: ['Toma fuera de crisis en tumores silentes']
    },
    discriminatoryContexts: ['Prueba de cribado de primera línea para feocromocitoma.'],
    cost: 180
  },
  {
    id: 'bm_colinesterasa',
    name: 'Colinesterasa Sérica y Eritrocitaria',
    abbreviation: 'Pseudocolinesterasa',
    system: 'neuromuscular',
    referenceValues: { conventional: '5.300 - 12.900 U/L', si: '88 - 215 µkat/L' },
    temporalWindow: { elevationStart: 'Descenso inmediato', peak: 'Horas', normalizationWindow: 'Semanas' },
    diagnosticParams: { sensitivity: '95%', specificity: '92%', optimalCutoff: '< 50% de actividad basal' },
    clinicalRelevance: 'Enzima inhibida covalentemente por organofosforados y carbamatos.',
    diagnosticIndication: 'Sospecha de intoxicación por insecticidas o pesticidas organofosforados.',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia hepática severa, malnutrición'],
      falseNegatives: ['Determinación tardía']
    },
    discriminatoryContexts: ['Inhibición > 50% con síndrome colinérgico confirma intoxicación.'],
    cost: 35
  },
  {
    id: 'bm_cloruro_sudor',
    name: 'Test del Sudor: Cloruro por Iontoforesis con Pilocarpina',
    abbreviation: 'Cl- Sudor',
    system: 'pancreatic',
    referenceValues: { conventional: '< 30 mmol/L (normal), ≥ 60 mmol/L (confirmatorio FQ)', si: 'mmol/L' },
    temporalWindow: { elevationStart: 'Constitutivo genético', peak: 'Constante', normalizationWindow: 'Permanente' },
    diagnosticParams: { sensitivity: '98%', specificity: '99%', optimalCutoff: '≥ 60 mmol/L' },
    clinicalRelevance: 'Marcador patognomónico de disfunción del canal CFTR en Fibrosis Quística.',
    diagnosticIndication: 'Sospecha de fibrosis quística, bronquiectasias de repetición o esteatorrea.',
    falsePositivesNegatives: {
      falsePositives: ['Dermatitis atópica, desnutrición severa'],
      falseNegatives: ['Mutaciones raras con función parcial del canal']
    },
    discriminatoryContexts: ['Cl- en sudor ≥ 60 mmol/L confirma Fibrosis Quística.'],
    cost: 95
  },
  {
    id: 'bm_electroforesis_hb',
    name: 'Electroforesis de Hemoglobina en Sangre',
    abbreviation: 'Hb Electroforesis',
    system: 'cardiac',
    referenceValues: { conventional: 'HbA: 95-98%, HbA2: 1.5-3.5%, HbF: < 1%', si: '%' },
    temporalWindow: { elevationStart: 'Congénito', peak: 'Constante', normalizationWindow: 'Permanente' },
    diagnosticParams: { sensitivity: '99%', specificity: '100%', optimalCutoff: 'Presencia de banda HbS' },
    clinicalRelevance: 'Detección de hemoglobinopatías estructurales (anemia de células falciformes).',
    diagnosticIndication: 'Crisis vasooclusivas dolorosas, infartos esplénicos en anemia hemolítica.',
    falsePositivesNegatives: {
      falsePositives: ['Ninguno'],
      falseNegatives: ['Transfusión sanguínea masiva reciente']
    },
    discriminatoryContexts: ['Presencia de HbS confirma anemia drepanocítica.'],
    cost: 180
  },
  {
    id: 'bm_peptido_c',
    name: 'Péptido C Plasmático en Ayunas',
    abbreviation: 'Péptido C',
    system: 'metabolic',
    referenceValues: { conventional: '0.8 - 3.1 ng/mL', si: '0.26 - 1.03 nmol/L' },
    temporalWindow: { elevationStart: 'Equimolar con insulina', peak: '30-60 min postprandial', normalizationWindow: 'Ayuno' },
    diagnosticParams: { sensitivity: '95%', specificity: '98%', optimalCutoff: '> 0.6 ng/mL en hipoglucemia confirma endógeno' },
    clinicalRelevance: 'Fragmento de la proinsulina liberado de forma equimolar con la insulina endógena.',
    diagnosticIndication: 'Diferenciación entre hipoglucemia facticia por insulina exógena e insulinoma.',
    falsePositivesNegatives: {
      falsePositives: ['Insuficiencia renal (aclaramiento renal reducido)'],
      falseNegatives: ['Insulina exógena suprime péptido C']
    },
    discriminatoryContexts: ['Péptido C elevado con hipoglucemia confirma secreción endógena (insulinoma).'],
    cost: 45
  },
  {
    id: 'bm_lactato',
    name: 'Lactato Plasmático',
    abbreviation: 'Lactato',
    system: 'metabolic',
    referenceValues: { conventional: '0.5 - 2.2 mmol/L', si: '0.5 - 2.2 mmol/L' },
    temporalWindow: { elevationStart: 'Minutos', peak: 'Minutos a horas', normalizationWindow: 'Horas tras perfusión' },
    diagnosticParams: { sensitivity: '95%', specificity: '85%', optimalCutoff: '> 4.0 mmol/L acidosis láctica grave' },
    clinicalRelevance: 'Producto final de la glucólisis anaerobia; biomarcador de hipoperfusión tisular o disfunción mitocondrial.',
    diagnosticIndication: 'Shock séptico, isquemia mesentérica, intoxicaciones mitocondriales.',
    falsePositivesNegatives: {
      falsePositives: ['Torniquete prolongado, muestra sin tubo de fluoruro en hielo'],
      falseNegatives: ['Aclaramiento hepático rápido']
    },
    discriminatoryContexts: ['Lactato > 4 mmol/L con anión gap aumentado define acidosis láctica tipo A o B.'],
    cost: 15
  },
  {
    id: 'bm_acidos_grasos_libres',
    name: 'Ácidos Grasos Libres (AGL / NEFA)',
    abbreviation: 'AGL',
    system: 'metabolic',
    referenceValues: { conventional: '0.1 - 0.6 mmol/L', si: '0.1 - 0.6 mmol/L' },
    temporalWindow: { elevationStart: 'Horas de ayuno o lipólisis', peak: 'Ayuno', normalizationWindow: 'Postprandial' },
    diagnosticParams: { sensitivity: '85%', specificity: '80%', optimalCutoff: '> 1.0 mmol/L' },
    clinicalRelevance: 'Sustrato primario liberado por el tejido adiposo para la B-oxidación.',
    diagnosticIndication: 'Estudio de defectos de la B-oxidación y resistencia a la insulina.',
    falsePositivesNegatives: {
      falsePositives: ['Estrés adrenérgico, ayuno'],
      falseNegatives: ['Ingesta reciente de carbohidratos']
    },
    discriminatoryContexts: ['AGL muy altos con cuerpos cetónicos ausentes = defecto de B-oxidación mitocondrial.'],
    cost: 30
  },
  {
    id: 'bm_hba1c',
    name: 'Hemoglobina Glicada (HbA1c)',
    abbreviation: 'HbA1c',
    system: 'metabolic',
    referenceValues: { conventional: '< 5.7% (normal), ≥ 6.5% (diabetes)', si: '< 39 mmol/mol' },
    temporalWindow: { elevationStart: 'Semanas', peak: '2-3 meses', normalizationWindow: '2-3 meses' },
    diagnosticParams: { sensitivity: '90%', specificity: '98%', optimalCutoff: '≥ 6.5%' },
    clinicalRelevance: 'Biomarcador retrospectivo del control glucémico medio durante los últimos 90-120 días.',
    diagnosticIndication: 'Diagnóstico y monitorización del tratamiento de la Diabetes Mellitus.',
    falsePositivesNegatives: {
      falsePositives: ['Anemia ferropénica, esplenectomía'],
      falseNegatives: ['Anemias hemolíticas, hemoglobinopatías, transfusiones recientes']
    },
    discriminatoryContexts: ['Refleja el promedio glucémico crónico independiente de la glucemia puntual de urgencias.'],
    cost: 20
  },
  {
    id: 'bm_albu_mina',
    name: 'Albúmina Sérica',
    abbreviation: 'Albúmina',
    system: 'hepatic',
    referenceValues: { conventional: '3.5 - 5.0 g/dL', si: '35 - 50 g/L' },
    temporalWindow: { elevationStart: 'Días a semanas (vida media 20 días)', peak: 'Lenta', normalizationWindow: 'Semanas' },
    diagnosticParams: { sensitivity: '85%', specificity: '80%', optimalCutoff: '< 3.0 g/dL hipoalbuminemia' },
    clinicalRelevance: 'Proteína plasmática más abundante, responsable del 80% de la presión oncótica coloidosmótica.',
    diagnosticIndication: 'Evaluación de síntesis hepática, nutrición y síndrome nefrótico.',
    falsePositivesNegatives: {
      falsePositives: ['Deshidratación severa (hemoconcentración)'],
      falseNegatives: ['Enfermedades inflamatorias agudas (reactante de fase aguda negativo)']
    },
    discriminatoryContexts: ['Albúmina < 2.5 g/dL con proteinuria > 3.5 g/24h confirma síndrome nefrótico.'],
    cost: 12
  }
];

export const BIOMARKERS = BIOMARKERS_DATABASE;
