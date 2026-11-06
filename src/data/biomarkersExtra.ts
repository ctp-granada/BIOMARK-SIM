import { Biomarker } from '../types';

// Pruebas que algunos casos dan como respuesta correcta y que faltaban en el catálogo del laboratorio.
// Sin ellas, esos casos no se podían resolver en el modo de petición múltiple.

export const EXTRA_BIOMARKERS: Biomarker[] = [
  {
    id: 'bm_cholera_toxin',
    name: 'Toxina colérica y cultivo en agar TCBS',
    abbreviation: 'Toxina CT / TCBS',
    system: 'metabolic',
    referenceValues: { conventional: 'Negativo', si: 'Negativo' },
    temporalWindow: { elevationStart: 'Desde el inicio de la diarrea', peak: 'Primeras 24-48 h', normalizationWindow: 'Tras el tratamiento antibiótico' },
    diagnosticParams: { sensitivity: '90-95% (cultivo)', specificity: '> 99%', optimalCutoff: 'Aislamiento de V. cholerae O1/O139 toxigénico' },
    clinicalRelevance: 'Identifica Vibrio cholerae productor de toxina, que ADP-ribosila la proteína Gαs y dispara el AMPc del enterocito.',
    diagnosticIndication: 'Diarrea acuosa masiva «en agua de arroz» con antecedente epidemiológico.',
    falsePositivesNegatives: {
      falsePositives: ['Vibrios no toxigénicos (no O1/O139)'],
      falseNegatives: ['Muestra tomada tras iniciar antibióticos', 'Retraso en la siembra']
    },
    discriminatoryContexts: ['Diarrea secretora sin leucocitos ni sangre en heces.'],
    cost: 95
  },
  {
    id: 'bm_galt_eritrocitaria',
    name: 'Actividad de GALT en hematíes',
    abbreviation: 'GALT',
    system: 'hepatic',
    referenceValues: { conventional: '18.5 - 28.5 µmol/h/g Hb', si: '18.5 - 28.5 µmol/h/g Hb' },
    temporalWindow: { elevationStart: 'Congénita', peak: 'No aplica', normalizationWindow: 'No se normaliza' },
    diagnosticParams: { sensitivity: '> 99%', specificity: '> 99%', optimalCutoff: '< 5% de la actividad normal en la galactosemia clásica' },
    clinicalRelevance: 'Mide la galactosa-1-fosfato uridiltransferasa, enzima de la vía de Leloir.',
    diagnosticIndication: 'Neonato con ictericia, hepatomegalia, cataratas o hipoglucemia tras iniciar la leche.',
    falsePositivesNegatives: {
      falsePositives: ['Muestra deteriorada por calor'],
      falseNegatives: ['Transfusión de hematíes en los 3 meses previos']
    },
    discriminatoryContexts: ['Distingue la galactosemia clásica de otras causas de colestasis neonatal.'],
    cost: 95
  },
  {
    id: 'bm_trab_tsh',
    name: 'Anticuerpos estimulantes del receptor de TSH (TRAb / TSI)',
    abbreviation: 'TRAb',
    system: 'metabolic',
    referenceValues: { conventional: '< 1.75 UI/L', si: '< 1.75 UI/L' },
    temporalWindow: { elevationStart: 'Al inicio de la enfermedad', peak: 'Fase activa', normalizationWindow: 'Meses de tratamiento' },
    diagnosticParams: { sensitivity: '> 97%', specificity: '> 99%', optimalCutoff: '> 1.75 UI/L' },
    clinicalRelevance: 'Autoanticuerpos que activan el receptor de TSH (acoplado a Gs) y estimulan el tiroides sin control.',
    diagnosticIndication: 'Hipertiroidismo con bocio difuso u oftalmopatía.',
    falsePositivesNegatives: {
      falsePositives: ['Tiroiditis de Hashimoto con anticuerpos bloqueantes'],
      falseNegatives: ['Formas leves o de inicio muy reciente']
    },
    discriminatoryContexts: ['Confirma la enfermedad de Graves frente a bocio nodular tóxico o tiroiditis.'],
    cost: 180
  },
  {
    id: 'bm_cistina_orina',
    name: 'Cistina en orina de 24 h y test de cianuro-nitroprusiato',
    abbreviation: 'Cistina orina',
    system: 'renal',
    referenceValues: { conventional: '< 30 mg/24 h', si: '< 125 µmol/24 h' },
    temporalWindow: { elevationStart: 'Congénita', peak: 'No aplica', normalizationWindow: 'No se normaliza' },
    diagnosticParams: { sensitivity: '> 95%', specificity: '> 95%', optimalCutoff: '> 250 mg/24 h' },
    clinicalRelevance: 'Demuestra la pérdida urinaria de cistina por fallo del transportador tubular rBAT/b0,+AT.',
    diagnosticIndication: 'Litiasis renal recidivante en jóvenes o cálculos amarillentos.',
    falsePositivesNegatives: {
      falsePositives: ['Fármacos con grupos tiol (captopril, penicilamina) en el test cualitativo'],
      falseNegatives: ['Orina muy diluida']
    },
    discriminatoryContexts: ['Cristales hexagonales en el sedimento urinario.'],
    cost: 95
  },
  {
    id: 'bm_acido_orotico_orina',
    name: 'Ácido orótico en orina',
    abbreviation: 'Ác. orótico',
    system: 'renal',
    referenceValues: { conventional: '< 2.5 µmol/mmol creatinina', si: '< 2.5 µmol/mmol creatinina' },
    temporalWindow: { elevationStart: 'Congénita', peak: 'No aplica', normalizationWindow: 'Con tratamiento con uridina' },
    diagnosticParams: { sensitivity: '> 95%', specificity: '90%', optimalCutoff: 'Elevación marcada con amonio normal' },
    clinicalRelevance: 'Se acumula cuando falla la UMP sintasa (síntesis de pirimidinas) o, con hiperamonemia, en defectos del ciclo de la urea.',
    diagnosticIndication: 'Anemia megaloblástica resistente a B12 y folato, o hiperamonemia neonatal.',
    falsePositivesNegatives: {
      falsePositives: ['Tratamiento con alopurinol', 'Dietas muy ricas en proteínas'],
      falseNegatives: ['Muestra muy diluida']
    },
    discriminatoryContexts: ['Con amonio normal orienta a aciduria orótica; con amonio alto, a déficit de OTC.'],
    cost: 95
  },
  {
    id: 'bm_hexosaminidasa_a',
    name: 'Actividad de β-hexosaminidasa A en leucocitos o suero',
    abbreviation: 'Hex A',
    system: 'metabolic',
    referenceValues: { conventional: '55 - 75% de la hexosaminidasa total', si: '55 - 75%' },
    temporalWindow: { elevationStart: 'Congénita', peak: 'No aplica', normalizationWindow: 'No se normaliza' },
    diagnosticParams: { sensitivity: '> 99%', specificity: '> 98%', optimalCutoff: '< 10% en la forma infantil' },
    clinicalRelevance: 'Enzima lisosómica que degrada el gangliósido GM2; su déficit causa la enfermedad de Tay-Sachs.',
    diagnosticIndication: 'Regresión del desarrollo, hiperacusia y mancha rojo cereza macular sin visceromegalias.',
    falsePositivesNegatives: {
      falsePositives: ['Alelos de seudodeficiencia', 'Embarazo o anticonceptivos en el ensayo en suero'],
      falseNegatives: ['Variante AB (activador GM2)']
    },
    discriminatoryContexts: ['La ausencia de hepatoesplenomegalia la distingue de Niemann-Pick y Gaucher.'],
    cost: 180
  },
  {
    id: 'bm_tiamina_transcetolasa',
    name: 'Transcetolasa eritrocitaria con efecto TPP',
    abbreviation: 'Efecto TPP',
    system: 'metabolic',
    referenceValues: { conventional: 'Efecto TPP < 15%', si: '< 15%' },
    temporalWindow: { elevationStart: 'Tras semanas de déficit', peak: 'Fase aguda', normalizationWindow: 'Días tras reponer tiamina' },
    diagnosticParams: { sensitivity: '85%', specificity: '90%', optimalCutoff: '> 25% indica déficit grave' },
    clinicalRelevance: 'Mide la reserva funcional de tiamina, coenzima de la transcetolasa, la piruvato deshidrogenasa y la α-cetoglutarato deshidrogenasa.',
    diagnosticIndication: 'Confusión, ataxia u oftalmoplejía en alcoholismo o desnutrición.',
    falsePositivesNegatives: {
      falsePositives: ['Anemias con hematíes jóvenes'],
      falseNegatives: ['Muestra extraída después de administrar tiamina']
    },
    discriminatoryContexts: ['No debe retrasar el tratamiento: la tiamina se administra antes de la glucosa.'],
    cost: 95
  },
  {
    id: 'bm_hidrogeno_espirado_lactosa',
    name: 'Test de hidrógeno espirado con sobrecarga de lactosa',
    abbreviation: 'H2 espirado',
    system: 'pancreatic',
    referenceValues: { conventional: 'Aumento < 20 ppm sobre el basal', si: '< 20 ppm' },
    temporalWindow: { elevationStart: '60-90 min tras la sobrecarga', peak: '2-3 h', normalizationWindow: 'Horas' },
    diagnosticParams: { sensitivity: '80-90%', specificity: '90%', optimalCutoff: 'Aumento ≥ 20 ppm' },
    clinicalRelevance: 'Detecta la fermentación colónica de la lactosa no digerida por falta de lactasa.',
    diagnosticIndication: 'Gases, distensión o diarrea relacionados con la ingesta de leche.',
    falsePositivesNegatives: {
      falsePositives: ['Sobrecrecimiento bacteriano intestinal'],
      falseNegatives: ['Antibióticos recientes', 'Flora no productora de hidrógeno']
    },
    discriminatoryContexts: ['Prueba funcional no invasiva; la clínica durante la prueba aumenta su valor.'],
    cost: 45
  },
  {
    id: 'bm_sobrecarga_trehalosa',
    name: 'Sobrecarga oral de trehalosa con glucemias seriadas',
    abbreviation: 'Sobrecarga trehalosa',
    system: 'pancreatic',
    referenceValues: { conventional: 'Ascenso de glucemia > 20 mg/dL', si: '> 1.1 mmol/L' },
    temporalWindow: { elevationStart: '30 min tras la sobrecarga', peak: '60 min', normalizationWindow: '2 h' },
    diagnosticParams: { sensitivity: '85%', specificity: '90%', optimalCutoff: 'Curva plana con síntomas' },
    clinicalRelevance: 'Comprueba si la trehalasa intestinal hidroliza la trehalosa en dos glucosas.',
    diagnosticIndication: 'Síntomas digestivos tras comer setas comestibles.',
    falsePositivesNegatives: {
      falsePositives: ['Vaciamiento gástrico lento'],
      falseNegatives: ['Diabetes mal controlada']
    },
    discriminatoryContexts: ['Con función hepática normal y latencia corta descarta la intoxicación faloidiana.'],
    cost: 45
  },
  {
    id: 'bm_gen_aldob_mutaciones',
    name: 'Estudio genético del gen ALDOB (aldolasa B)',
    abbreviation: 'ALDOB',
    system: 'hepatic',
    referenceValues: { conventional: 'Sin variantes patogénicas', si: 'Sin variantes patogénicas' },
    temporalWindow: { elevationStart: 'Congénita', peak: 'No aplica', normalizationWindow: 'No aplica' },
    diagnosticParams: { sensitivity: '> 95%', specificity: '> 99%', optimalCutoff: 'Dos variantes patogénicas (p. ej. p.Ala150Pro)' },
    clinicalRelevance: 'Confirma la intolerancia hereditaria a la fructosa sin necesidad de una sobrecarga, que sería peligrosa.',
    diagnosticIndication: 'Hipoglucemia y vómitos tras ingerir fructosa, sacarosa o sorbitol.',
    falsePositivesNegatives: {
      falsePositives: ['Variantes de significado incierto'],
      falseNegatives: ['Variantes raras no incluidas en el panel']
    },
    discriminatoryContexts: ['Distingue la intolerancia hereditaria de la malabsorción intestinal de fructosa.'],
    cost: 180
  },
  {
    id: 'bm_perfil_lipidico_completo',
    name: 'Perfil lipídico completo (colesterol total, LDL, HDL, triglicéridos)',
    abbreviation: 'Perfil lipídico',
    system: 'metabolic',
    referenceValues: { conventional: 'LDL < 116 mg/dL, HDL > 40 mg/dL (H) / > 50 (M), TG < 150 mg/dL', si: 'LDL < 3.0 mmol/L, TG < 1.7 mmol/L' },
    temporalWindow: { elevationStart: 'Crónico', peak: 'No aplica', normalizationWindow: 'Semanas de tratamiento' },
    diagnosticParams: { sensitivity: 'No aplica', specificity: 'No aplica', optimalCutoff: 'Según riesgo cardiovascular' },
    clinicalRelevance: 'Caracteriza la dislipemia y permite calcular el riesgo cardiovascular.',
    diagnosticIndication: 'Obesidad, síndrome metabólico, diabetes o antecedentes familiares de enfermedad coronaria.',
    falsePositivesNegatives: {
      falsePositives: ['Muestra sin ayuno (triglicéridos)'],
      falseNegatives: ['Fase aguda de un infarto o de una infección']
    },
    discriminatoryContexts: ['LDL > 190 mg/dL con xantomas orienta a hipercolesterolemia familiar.'],
    cost: 45
  },
  {
    id: 'bm_alfa_amanitina_orina',
    name: 'Alfa-amanitina en orina',
    abbreviation: 'α-amanitina',
    system: 'hepatic',
    referenceValues: { conventional: 'No detectable', si: 'No detectable' },
    temporalWindow: { elevationStart: 'Pocas horas tras la ingesta', peak: '24 h', normalizationWindow: '72-96 h' },
    diagnosticParams: { sensitivity: '> 90% en las primeras 48 h', specificity: '> 98%', optimalCutoff: '> 1.5 ng/mL' },
    clinicalRelevance: 'Toxina de Amanita phalloides que inhibe la ARN polimerasa II del hepatocito.',
    diagnosticIndication: 'Cuadro digestivo con latencia superior a 6 h tras comer setas silvestres.',
    falsePositivesNegatives: {
      falsePositives: ['Reacción cruzada con faloidinas en algunos inmunoensayos'],
      falseNegatives: ['Muestra recogida después de 96 h']
    },
    discriminatoryContexts: ['Confirma la causa; la gravedad se valora con transaminasas e INR.'],
    cost: 180
  }
];
