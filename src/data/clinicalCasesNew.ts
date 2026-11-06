import { ClinicalCase } from '../types';

// Casos añadidos en noviembre de 2026 a partir de los pacientes de Marks que aún no estaban en la plataforma.
// Los pacientes, edades y circunstancias son nuevos; la fisiopatología es la del caso original.

export const NEW_MARKS_CASES: ClinicalCase[] = [
  // BLOQUE 1 · Digestión
  {
    id: 'case_marks_lactosa_01',
    title: 'Rocío P. (21 años): Gases, hinchazón y diarrea después de los cafés con leche',
    system: 'pancreatic',
    difficulty: 'intermedio',
    studentSummary:
      'Rocío P., estudiante de Farmacia de 21 años, consulta porque desde hace unos meses, cada vez que toma un café con leche o un helado, a la media hora tiene la tripa hinchada, ruidos intestinales, gases y una diarrea acuosa. Con el pan, la carne o la fruta no le pasa. Su intestino ha dejado de fabricar suficiente lactasa, la enzima que rompe el azúcar de la leche.',
    clinicalGlossary: [
      { term: 'Lactasa', simpleDefinition: 'Enzima del borde en cepillo del intestino delgado que rompe la lactosa en glucosa y galactosa para poder absorberlas.' },
      { term: 'Diarrea osmótica', simpleDefinition: 'Diarrea que aparece porque un azúcar no absorbido retiene agua dentro del intestino. Desaparece con el ayuno.' },
      { term: 'Hidrógeno espirado', simpleDefinition: 'Gas que producen las bacterias del colon al fermentar azúcares no absorbidos; pasa a la sangre y se elimina con la respiración.' },
      { term: 'Hipolactasia del adulto', simpleDefinition: 'Descenso de la actividad de la lactasa que ocurre de forma programada genéticamente tras la infancia en gran parte de la población mundial.' }
    ],
    biochemicalConceptSimple:
      '1. La lactosa de la leche llega al intestino delgado -> 2. Falta lactasa y la lactosa no se hidroliza ni se absorbe -> 3. La lactosa retiene agua en la luz (diarrea osmótica) -> 4. En el colon las bacterias la fermentan a ácidos grasos de cadena corta, CO2 e H2 -> 5. Distensión, gases, dolor cólico y aumento del hidrógeno en el aliento.',
    clinicalHistory: {
      patientDemographics: { age: 21, gender: 'Femenino', occupation: 'Estudiante de Farmacia' },
      chiefComplaint: 'Distensión abdominal, flatulencia y diarrea acuosa entre 30 y 90 minutos después de tomar lácteos.',
      presentIllness:
        'Rocío P. lleva unos 6 meses con episodios de hinchazón abdominal, borborigmos, gases y 2-3 deposiciones líquidas que relaciona con el café con leche del desayuno, los batidos y los helados. Ha notado que con el queso curado apenas le ocurre. No ha perdido peso, no tiene sangre en las heces, no tiene fiebre ni se despierta por la noche con diarrea. Los síntomas desaparecen en unas horas y si pasa un día sin lácteos se encuentra perfectamente.',
      pastMedicalHistory: ['Sin enfermedades crónicas', 'Su madre y su abuela materna «no toleran la leche»'],
      medications: ['Anticonceptivo oral combinado'],
      lifestyle: 'Dieta variada con abundantes lácteos en el desayuno y la merienda. No fuma. Deporte tres veces por semana.'
    },
    physicalExam: {
      vitalSigns: { bp: '112/70 mmHg', hr: '72 lpm', rr: '14 rpm', temp: '36.5 °C', sao2: '99%' },
      findings: [
        { systemName: 'Estado general', description: 'Buen estado general y nutricional (IMC 21.8 kg/m²). Normohidratada.' },
        { systemName: 'Abdomen', description: 'Ligeramente distendido y timpánico, ruidos hidroaéreos aumentados. Blando, sin dolor a la palpación profunda ni masas.' }
      ]
    },
    initialLabWork: [
      { test: 'Hemograma completo', result: 'Hemoglobina 13.6 g/dL, VCM 88 fL, leucocitos 6.300 /µL', unit: '', referenceRange: 'Normal (sin anemia ni signos de inflamación)' },
      { test: 'Ferritina sérica', result: '42', unit: 'ng/mL', referenceRange: '15 - 150 (sin ferropenia que haga pensar en celiaquía)' },
      { test: 'Proteína C reactiva', result: '1.2', unit: 'mg/L', referenceRange: '< 5' },
      { test: 'Coprocultivo y parásitos en heces', result: 'Negativos', unit: '', referenceRange: 'Negativo' },
      { test: 'Test de hidrógeno espirado con sobrecarga de lactosa', result: '[NO SOLICITADO - Prueba funcional a pedir por el clínico]', unit: 'ppm', referenceRange: 'Aumento < 20 ppm sobre el basal' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Intolerancia a la lactosa por hipolactasia primaria del adulto',
        plausibilityRationale: 'Síntomas digestivos ligados de forma constante a la leche, sin datos de alarma, con analítica normal y antecedentes familiares; el queso curado, casi sin lactosa, se tolera.',
        isTargetDisease: true
      },
      {
        disease: 'Enfermedad celíaca',
        plausibilityRationale: 'Puede causar intolerancia secundaria a la lactosa, pero suele dar ferropenia, pérdida de peso y síntomas con el gluten; aquí la ferritina es normal y el pan se tolera.',
        isTargetDisease: false
      },
      {
        disease: 'Síndrome de intestino irritable',
        plausibilityRationale: 'Comparte distensión y cambios del ritmo intestinal, pero no tiene un desencadenante alimentario tan concreto ni se corrige por completo al retirar un solo alimento.',
        isTargetDisease: false
      },
      {
        disease: 'Gastroenteritis infecciosa',
        plausibilityRationale: 'Daría un cuadro agudo y autolimitado, a veces con fiebre; no episodios repetidos durante meses ligados a la ingesta de leche.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Intolerancia a la lactosa por hipolactasia primaria del adulto',
    biomarkerOptions: [
      {
        id: 'bm_opt_h2_lactosa_correct',
        biomarkerId: 'bm_hidrogeno_espirado_lactosa',
        biomarkerName: 'Test de hidrógeno espirado tras sobrecarga oral de lactosa',
        isCorrect: true,
        biochemicalRationale: 'Tras tomar 25-50 g de lactosa, la lactosa no hidrolizada llega al colon y las bacterias la fermentan liberando H2, que se absorbe y se elimina por el pulmón. Un aumento > 20 ppm sobre el valor basal, junto con síntomas durante la prueba, confirma la malabsorción.',
        whyOptimalOrSuboptimal: 'Prueba funcional sencilla, no invasiva y específica de la malabsorción de lactosa.'
      },
      {
        id: 'bm_opt_ttg_lactosa_distractor',
        biomarkerId: 'bm_ttg_iga',
        biomarkerName: 'Anticuerpos anti-transglutaminasa IgA',
        isCorrect: false,
        biochemicalRationale: 'Cribado serológico de la enfermedad celíaca.',
        whyOptimalOrSuboptimal: 'Útil si hubiera ferropenia o síntomas con el gluten; no confirma la deficiencia de lactasa.'
      },
      {
        id: 'bm_opt_elastasa_lactosa_distractor',
        biomarkerId: 'bm_elastasa_fecal',
        biomarkerName: 'Elastasa-1 fecal',
        isCorrect: false,
        biochemicalRationale: 'Mide la reserva exocrina del páncreas.',
        whyOptimalOrSuboptimal: 'La lactasa es una enzima del enterocito, no del páncreas; la elastasa será normal.'
      },
      {
        id: 'bm_opt_glucosa_lactosa_distractor',
        biomarkerId: 'bm_glucosa',
        biomarkerName: 'Glucemia basal aislada',
        isCorrect: false,
        biochemicalRationale: 'Concentración de glucosa en ayunas.',
        whyOptimalOrSuboptimal: 'En ayunas es normal; solo tendría valor medida en serie tras la sobrecarga de lactosa (ascenso < 20 mg/dL), prueba menos usada hoy.'
      }
    ],
    expertClinicalKey:
      'La persistencia de la lactasa en la edad adulta depende de una variante reguladora (-13910 C>T) en el gen MCM6, situado por delante del gen LCT. Sin ella, la expresión de lactasa cae tras el destete. El tratamiento no es eliminar todos los lácteos: la mayoría tolera hasta unos 12 g de lactosa al día repartidos con otras comidas, el queso curado y el yogur, o lactasa exógena antes de la ingesta. Retirar los lácteos sin necesidad compromete el aporte de calcio.',
    essentialBiomarkerIds: ['bm_hidrogeno_espirado_lactosa'],
    categoryDocente: 'Digestión de disacáridos en el borde en cepillo',
    molecularPathway: 'Lactosa -> [lactasa-florizina hidrolasa, BLOQUEO] -> lactosa intacta en la luz -> fermentación bacteriana en colon -> H2, CO2 y ácidos grasos de cadena corta',
    molecularAlteration: 'Descenso programado de la transcripción del gen LCT por ausencia de la variante de persistencia en MCM6'
  },
  {
    id: 'case_marks_trehalasa_01',
    title: 'Iñaki B. (31 años): Vómitos y diarrea explosiva tras una cena de setas que había identificado bien',
    system: 'pancreatic',
    difficulty: 'avanzado',
    studentSummary:
      'Iñaki B., guarda forestal de 31 años, llega a urgencias con náuseas, vómitos, gases y diarrea acuosa que empezaron una hora después de cenar setas silvestres que recogió él mismo. Todos temen una intoxicación por Amanita, pero él trae un ejemplar crudo y un micólogo confirma que es una especie comestible. Lo que falla no es la seta, sino una enzima de su intestino.',
    clinicalGlossary: [
      { term: 'Trehalosa', simpleDefinition: 'Disacárido formado por dos glucosas unidas por un enlace α-1,1. Abunda en setas, levaduras e insectos.' },
      { term: 'Trehalasa', simpleDefinition: 'Disacaridasa del borde en cepillo intestinal que hidroliza la trehalosa en dos moléculas de glucosa.' },
      { term: 'Periodo de latencia', simpleDefinition: 'Tiempo entre comer un alimento y la aparición de síntomas. En la intoxicación por Amanita phalloides supera las 6 horas; aquí fue de 1 hora.' },
      { term: 'Diarrea osmótica', simpleDefinition: 'Diarrea causada por un azúcar no absorbido que arrastra agua a la luz intestinal.' }
    ],
    biochemicalConceptSimple:
      '1. Las setas aportan una gran cantidad de trehalosa -> 2. Sin trehalasa, el disacárido no se hidroliza en el yeyuno -> 3. La trehalosa retiene agua en la luz intestinal -> 4. En el colon las bacterias la fermentan a gases y ácidos -> 5. Distensión, dolor, vómitos y diarrea acuosa a las pocas horas, sin daño hepático.',
    clinicalHistory: {
      patientDemographics: { age: 31, gender: 'Masculino', occupation: 'Guarda forestal' },
      chiefComplaint: 'Náuseas, vómitos, retortijones y diarrea acuosa abundante desde una hora después de cenar setas recogidas en el monte.',
      presentIllness:
        'Iñaki B. cenó a las 21:00 un revuelto con unos 300 g de setas que recogió esa tarde. A las 22:00 empezó con distensión abdominal, gases, náuseas y tres vómitos, seguidos de cinco deposiciones líquidas. Su pareja comió una ración pequeña y está asintomática. Iñaki es aficionado a la micología, asegura que distingue bien las especies y conserva un ejemplar crudo, que el micólogo de guardia identifica como un champiñón silvestre comestible. Recuerda que de niño los platos con setas «le sentaban fatal» y dejó de comerlos.',
      pastMedicalHistory: ['Sin enfermedades conocidas', 'Episodios similares de niño tras comer setas'],
      medications: ['Ninguno'],
      lifestyle: 'No fuma, bebe alcohol ocasionalmente. No toma infusiones ni productos de herbolario.'
    },
    physicalExam: {
      vitalSigns: { bp: '118/74 mmHg', hr: '96 lpm', rr: '16 rpm', temp: '36.7 °C', sao2: '98%' },
      findings: [
        { systemName: 'Estado general', description: 'Consciente y orientado, con mucosas algo secas. Sin ictericia.' },
        { systemName: 'Abdomen', description: 'Distendido y timpánico, ruidos hidroaéreos muy aumentados, molestia difusa a la palpación sin defensa. Hígado no palpable.' }
      ]
    },
    initialLabWork: [
      { test: 'Transaminasas (ALT / AST)', result: 'ALT 24 U/L, AST 21 U/L', unit: 'U/L', referenceRange: '< 40 (sin daño hepatocelular)' },
      { test: 'Tiempo de protrombina (INR)', result: '1.0', unit: '-', referenceRange: '0.8 - 1.2' },
      { test: 'Creatinina sérica', result: '1.0', unit: 'mg/dL', referenceRange: '0.7 - 1.3' },
      { test: 'Iones en sangre', result: 'Sodio 140 mEq/L, Potasio 3.8 mEq/L', unit: '', referenceRange: 'Normal' },
      { test: 'Prueba de sobrecarga oral de trehalosa con glucemias seriadas', result: '[NO SOLICITADO - Prueba funcional a pedir por el clínico]', unit: 'mg/dL', referenceRange: 'Ascenso de glucemia > 20 mg/dL' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Malabsorción de trehalosa por déficit de trehalasa intestinal',
        plausibilityRationale: 'Síntomas digestivos a la hora de comer setas comestibles identificadas, función hepática normal y antecedentes de mala tolerancia a las setas desde la infancia.',
        isTargetDisease: true
      },
      {
        disease: 'Intoxicación por Amanita phalloides (síndrome faloidiano)',
        plausibilityRationale: 'Debe descartarse siempre, pero tiene una latencia superior a 6 horas y evoluciona a daño hepático; aquí los síntomas empezaron a la hora y la seta está identificada.',
        isTargetDisease: false
      },
      {
        disease: 'Síndrome gastrointestinal por setas irritantes',
        plausibilityRationale: 'Da un cuadro precoz parecido, pero el ejemplar conservado es una especie comestible y la pareja que comió lo mismo está bien.',
        isTargetDisease: false
      },
      {
        disease: 'Toxiinfección alimentaria por Staphylococcus aureus',
        plausibilityRationale: 'Produce vómitos 1-6 horas tras la ingesta, pero suele afectar a todos los comensales y se asocia a alimentos manipulados y mal conservados.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Malabsorción de trehalosa por déficit de trehalasa intestinal',
    biomarkerOptions: [
      {
        id: 'bm_opt_trehalosa_correct',
        biomarkerId: 'bm_sobrecarga_trehalosa',
        biomarkerName: 'Sobrecarga oral de trehalosa con glucemias seriadas',
        isCorrect: true,
        biochemicalRationale: 'Si la trehalasa funciona, la trehalosa ingerida se hidroliza en dos glucosas y la glucemia sube más de 20 mg/dL. Una curva plana con reproducción de los síntomas demuestra que el disacárido no se digiere.',
        whyOptimalOrSuboptimal: 'Prueba funcional que demuestra el defecto enzimático y descarta, junto con la función hepática normal, la intoxicación.'
      },
      {
        id: 'bm_opt_amanitina_trehalosa_distractor',
        biomarkerId: 'bm_alfa_amanitina_orina',
        biomarkerName: 'Alfa-amanitina en orina',
        isCorrect: false,
        biochemicalRationale: 'Detecta la toxina de Amanita phalloides.',
        whyOptimalOrSuboptimal: 'Sería obligada ante una latencia larga o daño hepático; aquí la clínica precoz, la seta identificada y las transaminasas normales lo hacen innecesario.'
      },
      {
        id: 'bm_opt_lipasa_trehalosa_distractor',
        biomarkerId: 'bm_lipasa',
        biomarkerName: 'Lipasa sérica',
        isCorrect: false,
        biochemicalRationale: 'Marcador de pancreatitis aguda.',
        whyOptimalOrSuboptimal: 'Normal; el páncreas no interviene en la digestión de la trehalosa.'
      },
      {
        id: 'bm_opt_lactato_trehalosa_distractor',
        biomarkerId: 'bm_lactato',
        biomarkerName: 'Lactato plasmático',
        isCorrect: false,
        biochemicalRationale: 'Indicador de hipoperfusión o metabolismo anaerobio.',
        whyOptimalOrSuboptimal: 'Inespecífico; no orienta a la causa de la diarrea.'
      }
    ],
    expertClinicalKey:
      'La trehalasa es una disacaridasa anclada a la membrana del enterocito por glicosilfosfatidilinositol, distinta del complejo sacarasa-isomaltasa. Su déficit es raro en Europa pero frecuente en la población inuit. El caso enseña dos cosas: la latencia orienta mucho en una intoxicación por setas (menos de 6 horas suele ser benigna) y la misma lógica de la intolerancia a la lactosa sirve para cualquier disacárido no hidrolizado.',
    essentialBiomarkerIds: ['bm_sobrecarga_trehalosa'],
    categoryDocente: 'Digestión de disacáridos en el borde en cepillo',
    molecularPathway: 'Trehalosa (Glc α-1,1 Glc) -> [trehalasa del borde en cepillo, BLOQUEO] -> disacárido intacto en la luz -> retención osmótica de agua y fermentación en colon',
    molecularAlteration: 'Déficit de actividad de trehalasa (gen TREH) en el enterocito'
  },

  // BLOQUE 3 · Hígado e hidratos de carbono
  {
    id: 'case_marks_fructosa_01',
    title: 'Lidia F. (19 años): Mareos y vómitos cada vez que toma fruta o dulces desde que era pequeña',
    system: 'hepatic',
    difficulty: 'avanzado',
    studentSummary:
      'Lidia F., estudiante de 19 años, comparte piso por primera vez y sus compañeras le insisten en que coma fruta. Ella cuenta que desde niña la fruta, los zumos y los dulces le provocan náuseas, sudor frío, temblor y vómitos, y que por eso no los toma. Tiene una dentadura sin caries. Tras un batido de frutas en una fiesta llega a urgencias mareada y con la glucosa baja. Le falta la aldolasa B del hígado.',
    clinicalGlossary: [
      { term: 'Aldolasa B', simpleDefinition: 'Enzima hepática que rompe la fructosa-1-fosfato en dos triosas. Si falta, la fructosa-1-fosfato se acumula dentro del hepatocito.' },
      { term: 'Atrapamiento de fosfato', simpleDefinition: 'La fructoquinasa fosforila la fructosa sin freno y el fosfato queda retenido en la fructosa-1-fosfato; la célula se queda sin fosfato libre para fabricar ATP.' },
      { term: 'Hipoglucemia postprandial', simpleDefinition: 'Bajada de azúcar en sangre que aparece después de comer, en este caso alimentos con fructosa, sacarosa o sorbitol.' },
      { term: 'Aversión dietética', simpleDefinition: 'Rechazo aprendido hacia alimentos que causan malestar; muchos pacientes se protegen solos evitando el dulce desde niños.' }
    ],
    biochemicalConceptSimple:
      '1. La fructosa de la fruta llega al hígado y la fructoquinasa la convierte en fructosa-1-fosfato -> 2. Sin aldolasa B, la fructosa-1-fosfato se acumula -> 3. Se agota el fosfato libre y cae el ATP -> 4. La fructosa-1-fosfato inhibe la glucogenólisis y la gluconeogénesis -> 5. Hipoglucemia, vómitos y, si se repite, daño hepático y renal.',
    clinicalHistory: {
      patientDemographics: { age: 19, gender: 'Femenino', occupation: 'Estudiante de Bellas Artes' },
      chiefComplaint: 'Náuseas, sudor frío, temblor y vómitos una hora después de tomar un batido de frutas.',
      presentIllness:
        'Lidia F. acude a urgencias acompañada por una compañera de piso. En una fiesta tomó un batido de mango, plátano y zumo de manzana; a los 40 minutos empezó con sudoración, temblor, palpitaciones, sensación de mareo y dos vómitos. Cuenta que le pasa lo mismo desde que su madre introdujo la fruta en las papillas, y que por eso nunca toma fruta, zumos, refrescos ni dulces. Su familia lo consideraba «manías con la comida». Come verdura, carne, pescado, pan y lácteos sin problemas.',
      pastMedicalHistory: ['Vómitos y escasa ganancia de peso al empezar con las papillas de fruta a los 6 meses', 'Ninguna caries en la revisión dental'],
      medications: ['Ninguno'],
      lifestyle: 'Evita la fruta, los zumos, la miel, los refrescos y la bollería. No fuma ni bebe alcohol.'
    },
    physicalExam: {
      vitalSigns: { bp: '104/66 mmHg', hr: '108 lpm', rr: '18 rpm', temp: '36.4 °C', sao2: '99%' },
      findings: [
        { systemName: 'Estado general', description: 'Pálida, sudorosa y temblorosa, algo obnubilada. Mejora en minutos tras glucosa intravenosa.' },
        { systemName: 'Abdomen', description: 'Hígado palpable a 2 cm bajo el reborde costal, liso y no doloroso. Sin ascitis.' },
        { systemName: 'Boca', description: 'Dentadura completa sin caries ni empastes.' }
      ]
    },
    initialLabWork: [
      { test: 'Glucemia capilar a su llegada', result: '46', unit: 'mg/dL', referenceRange: '70 - 110 (hipoglucemia tras ingerir fructosa)' },
      { test: 'Fosfato sérico', result: '1.9', unit: 'mg/dL', referenceRange: '2.5 - 4.5 (hipofosfatemia por atrapamiento de fosfato)' },
      { test: 'Ácido úrico sérico', result: '8.1', unit: 'mg/dL', referenceRange: '2.4 - 6.0 (degradación de AMP por falta de fosfato)' },
      { test: 'Transaminasas (ALT / AST)', result: 'ALT 68 U/L, AST 55 U/L', unit: 'U/L', referenceRange: '< 40' },
      { test: 'Estudio genético del gen ALDOB', result: '[NO SOLICITADO - Prueba confirmatoria a pedir por el clínico]', unit: '-', referenceRange: 'Sin variantes patogénicas' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Intolerancia hereditaria a la fructosa (déficit de aldolasa B)',
        plausibilityRationale: 'Hipoglucemia y vómitos tras ingerir fructosa desde el destete, aversión espontánea al dulce, ausencia de caries, hepatomegalia, hipofosfatemia e hiperuricemia tras la sobrecarga.',
        isTargetDisease: true
      },
      {
        disease: 'Fructosuria esencial (déficit de fructoquinasa)',
        plausibilityRationale: 'También es un defecto del metabolismo de la fructosa, pero es benigno: la fructosa no se fosforila, se elimina por la orina y no causa hipoglucemia.',
        isTargetDisease: false
      },
      {
        disease: 'Malabsorción intestinal de fructosa (GLUT5)',
        plausibilityRationale: 'Causa gases y diarrea con la fruta, pero la fructosa no llega al hígado: no hay hipoglucemia, hepatomegalia ni alteraciones del fosfato y el ácido úrico.',
        isTargetDisease: false
      },
      {
        disease: 'Insulinoma',
        plausibilityRationale: 'Produce hipoglucemias, pero sobre todo en ayunas y sin relación con un azúcar concreto; no explica la hepatomegalia ni el rechazo al dulce desde la lactancia.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Intolerancia hereditaria a la fructosa (déficit de aldolasa B)',
    biomarkerOptions: [
      {
        id: 'bm_opt_aldob_correct',
        biomarkerId: 'bm_gen_aldob_mutaciones',
        biomarkerName: 'Estudio genético del gen ALDOB (aldolasa B)',
        isCorrect: true,
        biochemicalRationale: 'La identificación de dos variantes patogénicas en ALDOB (la más frecuente en Europa es p.Ala150Pro) confirma el diagnóstico sin necesidad de biopsia hepática ni de una sobrecarga de fructosa, que sería peligrosa.',
        whyOptimalOrSuboptimal: 'Prueba confirmatoria de elección: segura, definitiva y útil para estudiar a la familia.'
      },
      {
        id: 'bm_opt_peptido_c_fructosa_distractor',
        biomarkerId: 'bm_peptido_c',
        biomarkerName: 'Péptido C durante la hipoglucemia',
        isCorrect: false,
        biochemicalRationale: 'Mide la secreción endógena de insulina.',
        whyOptimalOrSuboptimal: 'Estará suprimido; descarta un insulinoma pero no identifica el defecto enzimático.'
      },
      {
        id: 'bm_opt_hba1c_fructosa_distractor',
        biomarkerId: 'bm_hba1c',
        biomarkerName: 'Hemoglobina glicada (HbA1c)',
        isCorrect: false,
        biochemicalRationale: 'Refleja la glucemia media de los últimos meses.',
        whyOptimalOrSuboptimal: 'Normal o baja; no aporta nada al diagnóstico de una hipoglucemia inducida por fructosa.'
      },
      {
        id: 'bm_opt_lipasa_fructosa_distractor',
        biomarkerId: 'bm_lipasa',
        biomarkerName: 'Lipasa sérica',
        isCorrect: false,
        biochemicalRationale: 'Marcador de daño pancreático.',
        whyOptimalOrSuboptimal: 'Sin relación con el metabolismo hepático de la fructosa.'
      }
    ],
    expertClinicalKey:
      'La fructosa entra en la glucólisis hepática saltándose la fosfofructoquinasa-1, su principal punto de control; por eso la fructoquinasa la fosforila sin freno y, si falta la aldolasa B, el fosfato queda atrapado. La caída de fosfato libre y de ATP activa la AMP desaminasa (más ácido úrico) y la fructosa-1-fosfato inhibe la glucógeno fosforilasa y la fructosa-1,6-bisfosfato aldolasa, de ahí la hipoglucemia. El tratamiento es retirar fructosa, sacarosa y sorbitol, también de jarabes y excipientes: una perfusión de sorbitol o fructosa puede ser mortal en estos pacientes.',
    essentialBiomarkerIds: ['bm_gen_aldob_mutaciones'],
    categoryDocente: 'Metabolismo hepático de la fructosa',
    molecularPathway: 'Fructosa -> [fructoquinasa] -> fructosa-1-fosfato -> [aldolasa B, BLOQUEO] -> acumulación de F1P, atrapamiento de Pi, caída de ATP, inhibición de glucogenólisis y gluconeogénesis',
    molecularAlteration: 'Variantes patogénicas bialélicas en el gen ALDOB'
  },
  {
    id: 'case_marks_dm2_01',
    title: 'Manuel O. (58 años): Glucemias altas después de comer pese a la dieta',
    system: 'metabolic',
    difficulty: 'intermedio',
    studentSummary:
      'Manuel O., taxista de 58 años con obesidad abdominal, lleva más de un año en seguimiento por glucemias elevadas y no consigue perder peso. En la consulta de control, dos horas después de comer, su glucemia capilar es de 228 mg/dL. Nunca ha tenido cetoacidosis. Sus tejidos responden mal a la insulina y su páncreas ya no consigue compensarlo.',
    clinicalGlossary: [
      { term: 'Diabetes mellitus tipo 2', simpleDefinition: 'Diabetes por resistencia a la insulina en los tejidos y fallo progresivo de la célula β, sin destrucción autoinmune del páncreas.' },
      { term: 'Hiperglucemia postprandial', simpleDefinition: 'Glucosa elevada en las horas siguientes a una comida, a menudo la primera alteración que aparece.' },
      { term: 'HbA1c', simpleDefinition: 'Hemoglobina a la que se ha unido glucosa de forma no enzimática; refleja la glucemia media de los últimos 2-3 meses.' },
      { term: 'Glucotoxicidad', simpleDefinition: 'Daño que la hiperglucemia mantenida causa a la propia célula β y a los vasos.' }
    ],
    biochemicalConceptSimple:
      '1. El exceso de grasa visceral libera ácidos grasos y citoquinas -> 2. Músculo e hígado responden peor a la insulina (menos GLUT4 en membrana, gluconeogénesis sin frenar) -> 3. El páncreas compensa secretando más insulina durante años -> 4. La célula β se agota y la glucosa sube, primero tras las comidas -> 5. La glucosa se une a la hemoglobina y a otras proteínas (glicación).',
    clinicalHistory: {
      patientDemographics: { age: 58, gender: 'Masculino', occupation: 'Taxista' },
      chiefComplaint: 'Control de glucemias elevadas; cansancio por las tardes y más sed de lo habitual.',
      presentIllness:
        'Manuel O. acude a su control mensual. Hace 14 meses le detectaron una glucemia basal de 132 mg/dL en un análisis de empresa y desde entonces sigue una dieta que reconoce cumplir a medias por los horarios del taxi. Pesa 101 kg y no ha conseguido adelgazar. Refiere cansancio después de comer, algo más de sed y que se levanta una vez por la noche a orinar. Nunca ha tenido vómitos, dolor abdominal ni respiración agitada. En la consulta, dos horas después de comer, la glucemia capilar es de 228 mg/dL.',
      pastMedicalHistory: ['Hipertensión arterial desde hace 6 años', 'Padre y hermana con diabetes tipo 2', 'Esteatosis hepática en una ecografía previa'],
      medications: ['Amlodipino 5 mg/día'],
      lifestyle: 'Sedentario, unas 10 horas diarias sentado. Come fuera de casa con frecuencia. Exfumador desde hace 3 años.'
    },
    physicalExam: {
      vitalSigns: { bp: '144/88 mmHg', hr: '78 lpm', rr: '15 rpm', temp: '36.5 °C', sao2: '97%' },
      findings: [
        { systemName: 'Antropometría', description: 'Peso 101 kg, talla 172 cm, IMC 34.1 kg/m². Perímetro de cintura 116 cm (obesidad abdominal).' },
        { systemName: 'Piel y pies', description: 'Acantosis nigricans leve en la nuca. Pulsos pedios presentes y sensibilidad con monofilamento conservada.' }
      ]
    },
    initialLabWork: [
      { test: 'Glucemia capilar 2 horas después de comer', result: '228', unit: 'mg/dL', referenceRange: '< 140' },
      { test: 'Glucemia basal en ayunas (analítica de la semana previa)', result: '141', unit: 'mg/dL', referenceRange: '70 - 99' },
      { test: 'Cuerpos cetónicos en orina', result: 'Negativos', unit: '', referenceRange: 'Negativo (descarta descompensación cetósica)' },
      { test: 'Cociente albúmina/creatinina en orina', result: '22', unit: 'mg/g', referenceRange: '< 30' },
      { test: 'Hemoglobina glicada (HbA1c)', result: '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', unit: '%', referenceRange: '< 5.7' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Diabetes mellitus tipo 2 con resistencia a la insulina',
        plausibilityRationale: 'Adulto con obesidad abdominal, hipertensión, esteatosis, acantosis y antecedentes familiares, con glucemia basal ≥ 126 mg/dL y glucemia postprandial elevada sin cetosis.',
        isTargetDisease: true
      },
      {
        disease: 'Diabetes autoinmune latente del adulto (LADA)',
        plausibilityRationale: 'Empieza en adultos y al principio no necesita insulina, pero suele darse en personas sin obesidad y con autoanticuerpos anti-GAD positivos.',
        isTargetDisease: false
      },
      {
        disease: 'Diabetes secundaria a síndrome de Cushing',
        plausibilityRationale: 'El exceso de cortisol causa hiperglucemia y obesidad central, pero se acompaña de estrías violáceas, cara de luna llena y debilidad muscular proximal, ausentes aquí.',
        isTargetDisease: false
      },
      {
        disease: 'Prediabetes (glucemia basal alterada)',
        plausibilityRationale: 'Fue su situación al principio, pero una glucemia basal ≥ 126 mg/dL repetida y la clínica de poliuria y polidipsia ya cumplen criterios de diabetes.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Diabetes mellitus tipo 2 con resistencia a la insulina',
    biomarkerOptions: [
      {
        id: 'bm_opt_hba1c_dm2_correct',
        biomarkerId: 'bm_hba1c',
        biomarkerName: 'Hemoglobina glicada (HbA1c)',
        isCorrect: true,
        biochemicalRationale: 'La glucosa se une de forma no enzimática a la valina N-terminal de la cadena β de la hemoglobina. Como el hematíe vive unos 120 días, la HbA1c integra la glucemia de los últimos 2-3 meses. Un valor ≥ 6.5% confirma la diabetes y marca el objetivo de control (habitualmente < 7%).',
        whyOptimalOrSuboptimal: 'Confirma el diagnóstico sin depender del ayuno y es el parámetro con el que se sigue el tratamiento.'
      },
      {
        id: 'bm_opt_bhb_dm2_distractor',
        biomarkerId: 'bm_beta_hidroxibutirato',
        biomarkerName: 'β-hidroxibutirato en sangre',
        isCorrect: false,
        biochemicalRationale: 'Principal cuerpo cetónico.',
        whyOptimalOrSuboptimal: 'Normal: la insulina que todavía secreta basta para frenar la cetogénesis, por eso la diabetes tipo 2 rara vez debuta con cetoacidosis.'
      },
      {
        id: 'bm_opt_lactato_dm2_distractor',
        biomarkerId: 'bm_lactato',
        biomarkerName: 'Lactato plasmático',
        isCorrect: false,
        biochemicalRationale: 'Producto de la glucólisis anaerobia.',
        whyOptimalOrSuboptimal: 'Sin utilidad diagnóstica aquí.'
      },
      {
        id: 'bm_opt_amilasa_dm2_distractor',
        biomarkerId: 'bm_amilasa',
        biomarkerName: 'Amilasa sérica',
        isCorrect: false,
        biochemicalRationale: 'Enzima del páncreas exocrino.',
        whyOptimalOrSuboptimal: 'Evalúa el páncreas exocrino, no la función endocrina ni la glucemia.'
      }
    ],
    expertClinicalKey:
      'En la diabetes tipo 2 la glucemia postprandial se eleva antes que la basal: el músculo es el principal destino de la glucosa tras comer y es el primero en hacerse resistente a la insulina. La metformina actúa sobre todo frenando la gluconeogénesis hepática, a través de la inhibición del complejo I mitocondrial y la activación de la AMPK. Con la HbA1c conviene recordar sus límites: da valores falsamente bajos si los hematíes viven menos (hemólisis, sangrado) y falsamente altos en la ferropenia.',
    essentialBiomarkerIds: ['bm_hba1c'],
    categoryDocente: 'Regulación hormonal de la glucemia',
    molecularPathway: 'Insulina -> receptor tirosina quinasa -> IRS-1 -> PI3K -> Akt -> translocación de GLUT4 [RESPUESTA DISMINUIDA] -> menor captación de glucosa y gluconeogénesis sin frenar',
    molecularAlteration: 'Resistencia periférica a la insulina por fosforilación en serina de IRS-1 (ácidos grasos, citoquinas) y fallo secretor progresivo de la célula β'
  },

  // BLOQUE 4 · Lípidos
  {
    id: 'case_marks_sindrome_metabolico_01',
    title: 'Rafael C. (54 años): Barriga, cansancio al subir escaleras y un hermano fallecido de infarto',
    system: 'metabolic',
    difficulty: 'intermedio',
    studentSummary:
      'Rafael C., gestor administrativo de 54 años con obesidad abdominal, vuelve a la consulta tras intentar sin éxito adelgazar. Está preocupado porque su hermano de 47 años acaba de morir de un infarto. Se cansa al subir un piso de escaleras, come mucho y no hace ejercicio. Hay que medir sus lípidos en sangre para valorar su riesgo cardiovascular y comprobar si tiene un síndrome metabólico.',
    clinicalGlossary: [
      { term: 'Síndrome metabólico', simpleDefinition: 'Conjunto de alteraciones (obesidad abdominal, triglicéridos altos, HDL bajo, presión arterial y glucosa elevadas) que multiplica el riesgo de infarto y de diabetes. Se diagnostica con tres de los cinco criterios.' },
      { term: 'LDL colesterol', simpleDefinition: 'Lipoproteína que transporta colesterol a los tejidos; cuando está alta se deposita en la pared de las arterias y forma placas de ateroma.' },
      { term: 'HDL colesterol', simpleDefinition: 'Lipoproteína que retira colesterol de los tejidos y lo lleva al hígado (transporte inverso); protege frente a la aterosclerosis.' },
      { term: 'Obesidad visceral', simpleDefinition: 'Grasa acumulada dentro del abdomen; es metabólicamente muy activa y libera ácidos grasos directamente al hígado por la vena porta.' }
    ],
    biochemicalConceptSimple:
      '1. Exceso de calorías y grasa visceral -> 2. Llegan muchos ácidos grasos al hígado por la vena porta -> 3. El hígado fabrica más VLDL ricas en triglicéridos -> 4. Las VLDL ceden triglicéridos a las HDL, que se degradan antes (HDL bajo), y se forman LDL pequeñas y densas muy aterogénicas -> 5. Sube el riesgo de placa de ateroma e infarto.',
    clinicalHistory: {
      patientDemographics: { age: 54, gender: 'Masculino', occupation: 'Gestor administrativo' },
      chiefComplaint: 'Revisión por obesidad; cansancio y falta de aire al subir escaleras.',
      presentIllness:
        'Rafael C. acude a consulta de seguimiento. Hace seis meses pesaba 116 kg y ahora pesa 118 kg pese a haber intentado dos dietas. Se ahoga un poco al subir un piso andando y se cansa por la tarde. Está muy afectado porque su hermano menor murió hace un mes de un infarto con 47 años. Su madre tenía «el colesterol alto». Calcula que come unas 4.000 kcal al día, con muchos fritos, embutido, pan y dos cervezas diarias, y no hace ningún ejercicio.',
      pastMedicalHistory: ['Obesidad desde los 35 años', 'Hermano fallecido de infarto a los 47 años', 'Madre con hipercolesterolemia'],
      medications: ['Ninguno'],
      lifestyle: 'Sedentario. Dieta hipercalórica rica en grasas saturadas y azúcares. Dos cervezas al día. No fuma.'
    },
    physicalExam: {
      vitalSigns: { bp: '158/96 mmHg', hr: '84 lpm', rr: '16 rpm', temp: '36.6 °C', sao2: '96%' },
      findings: [
        { systemName: 'Antropometría', description: 'Peso 118 kg, talla 176 cm, IMC 38.1 kg/m². Perímetro de cintura 120 cm (valor de referencia en varones < 102 cm).' },
        { systemName: 'Piel y ojos', description: 'Sin xantomas tendinosos ni arco corneal.' },
        { systemName: 'Cardiopulmonar', description: 'Tonos cardíacos rítmicos sin soplos. Murmullo vesicular conservado.' }
      ]
    },
    initialLabWork: [
      { test: 'Glucemia basal en ayunas', result: '112', unit: 'mg/dL', referenceRange: '70 - 99 (glucemia basal alterada)' },
      { test: 'Hemoglobina glicada (HbA1c)', result: '6.1', unit: '%', referenceRange: '< 5.7 (rango de prediabetes)' },
      { test: 'ALT', result: '58', unit: 'U/L', referenceRange: '< 40 (compatible con hígado graso)' },
      { test: 'Creatinina sérica', result: '0.98', unit: 'mg/dL', referenceRange: '0.7 - 1.3' },
      { test: 'Perfil lipídico completo en ayunas', result: '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', unit: 'mg/dL', referenceRange: 'LDL < 116, HDL > 40, TG < 150' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Síndrome metabólico con dislipemia aterogénica',
        plausibilityRationale: 'Cumple obesidad abdominal (cintura 120 cm), hipertensión y glucemia basal alterada; con el perfil lipídico se completarán los criterios y se calculará su riesgo cardiovascular.',
        isTargetDisease: true
      },
      {
        disease: 'Hipercolesterolemia familiar heterocigota',
        plausibilityRationale: 'Los antecedentes familiares obligan a considerarla, pero suele dar LDL > 190 mg/dL desde joven, xantomas tendinosos o arco corneal precoz, y no se asocia a obesidad abdominal.',
        isTargetDisease: false
      },
      {
        disease: 'Hipotiroidismo primario',
        plausibilityRationale: 'Causa aumento de peso, cansancio y colesterol alto, pero se acompaña de frío, piel seca, estreñimiento y bradicardia, que este paciente no tiene.',
        isTargetDisease: false
      },
      {
        disease: 'Insuficiencia cardíaca',
        plausibilityRationale: 'Explicaría la disnea de esfuerzo, pero no hay edemas, ingurgitación yugular ni crepitantes; la disnea se justifica por la obesidad y la falta de entrenamiento.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Síndrome metabólico con dislipemia aterogénica',
    biomarkerOptions: [
      {
        id: 'bm_opt_lipidos_sm_correct',
        biomarkerId: 'bm_perfil_lipidico_completo',
        biomarkerName: 'Perfil lipídico completo en ayunas (colesterol total, LDL, HDL y triglicéridos)',
        isCorrect: true,
        biochemicalRationale: 'Permite comprobar la tríada aterogénica típica de la resistencia a la insulina (triglicéridos > 150 mg/dL, HDL < 40 mg/dL, LDL pequeñas y densas), completar los criterios de síndrome metabólico y calcular el riesgo cardiovascular para decidir el tratamiento con estatinas.',
        whyOptimalOrSuboptimal: 'Es la prueba que cambia la decisión clínica en este paciente con un antecedente familiar de infarto precoz.'
      },
      {
        id: 'bm_opt_troponina_sm_distractor',
        biomarkerId: 'bm_troponin_c',
        biomarkerName: 'Troponina cardíaca ultrasensible',
        isCorrect: false,
        biochemicalRationale: 'Marcador de necrosis del miocardio.',
        whyOptimalOrSuboptimal: 'No tiene dolor torácico ni un cuadro agudo; la troponina no sirve para estimar el riesgo a largo plazo.'
      },
      {
        id: 'bm_opt_ck_sm_distractor',
        biomarkerId: 'bm_ck_total',
        biomarkerName: 'Creatina quinasa total',
        isCorrect: false,
        biochemicalRationale: 'Enzima del músculo esquelético.',
        whyOptimalOrSuboptimal: 'Solo interesaría como valor basal antes de empezar con estatinas, no para el diagnóstico.'
      },
      {
        id: 'bm_opt_amonio_sm_distractor',
        biomarkerId: 'bm_amonio_plasmatico',
        biomarkerName: 'Amonio plasmático',
        isCorrect: false,
        biochemicalRationale: 'Marcador de fallo del ciclo de la urea o encefalopatía hepática.',
        whyOptimalOrSuboptimal: 'Sin relación con el riesgo cardiovascular.'
      }
    ],
    expertClinicalKey:
      'La insulina inhibe la lipasa sensible a hormonas del adipocito; cuando hay resistencia, la lipólisis visceral queda sin freno y el flujo de ácidos grasos al hígado dispara la síntesis de VLDL. La proteína de transferencia de ésteres de colesterol (CETP) intercambia triglicéridos de las VLDL por colesterol de las HDL y LDL; las partículas enriquecidas en triglicéridos son hidrolizadas por la lipasa hepática y quedan HDL pequeñas que se eliminan rápido y LDL pequeñas y densas que entran con facilidad en la pared arterial. Perder un 5-10% del peso mejora todos los componentes a la vez.',
    essentialBiomarkerIds: ['bm_perfil_lipidico_completo'],
    categoryDocente: 'Lipoproteínas y riesgo cardiovascular',
    molecularPathway: 'Resistencia a la insulina -> lipólisis visceral sin freno -> ácidos grasos al hígado -> más VLDL -> intercambio por CETP -> HDL bajo y LDL pequeñas y densas',
    molecularAlteration: 'Resistencia a la insulina en adipocito, hígado y músculo asociada a obesidad visceral'
  },

  // BLOQUE 5 · Aminoácidos y nucleótidos
  {
    id: 'case_marks_amanitina_01',
    title: 'Teresa V. (63 años): Diarrea intensa al día siguiente de un guiso de setas y luego una falsa mejoría',
    system: 'hepatic',
    difficulty: 'experto',
    studentSummary:
      'Teresa V., jubilada de 63 años, preparó un guiso con setas que recogió en el pinar. Diez horas después empezó con vómitos y una diarrea muy intensa. Tras un día de sueros se encuentra mucho mejor y quiere irse a casa, pero sus transaminasas no paran de subir. La seta contenía α-amanitina, una toxina que bloquea la ARN polimerasa II y mata a los hepatocitos.',
    clinicalGlossary: [
      { term: 'α-amanitina', simpleDefinition: 'Octapéptido cíclico de Amanita phalloides muy estable: no se destruye al cocinar ni al congelar la seta.' },
      { term: 'ARN polimerasa II', simpleDefinition: 'Enzima del núcleo que transcribe los genes que codifican proteínas en ARN mensajero. Si se bloquea, la célula deja de fabricar proteínas y muere.' },
      { term: 'Fase de falsa mejoría', simpleDefinition: 'Periodo de 24-48 horas en que los síntomas digestivos ceden mientras el daño hepático avanza sin dar síntomas.' },
      { term: 'Insuficiencia hepática aguda', simpleDefinition: 'Pérdida brusca de la función del hígado con alteración de la coagulación (INR alto) y, en fases avanzadas, encefalopatía.' }
    ],
    biochemicalConceptSimple:
      '1. La α-amanitina se absorbe en el intestino y llega al hígado por la vena porta -> 2. Entra en el hepatocito por el transportador OATP1B3 -> 3. Se une a la ARN polimerasa II y bloquea la síntesis de ARN mensajero -> 4. El hepatocito deja de fabricar proteínas y muere (necrosis) -> 5. La toxina se excreta por la bilis, vuelve a absorberse (circulación enterohepática) y repite el daño.',
    clinicalHistory: {
      patientDemographics: { age: 63, gender: 'Femenino', occupation: 'Maestra jubilada' },
      chiefComplaint: 'Vómitos y diarrea acuosa muy abundante que empezaron unas 10 horas después de comer setas silvestres.',
      presentIllness:
        'Teresa V. comió a mediodía un guiso con setas que recogió ella misma en un pinar; no las conocía bien, pero «se parecían a las que compra en el mercado». A las 22:00 empezó con dolor abdominal cólico, vómitos repetidos y más de diez deposiciones líquidas. Ingresó deshidratada y tras 24 horas de sueroterapia se encuentra mucho mejor: ya no vomita, tolera líquidos y pide el alta. Su marido, que comió una ración más pequeña, empieza ahora con náuseas.',
      pastMedicalHistory: ['Hipotiroidismo en tratamiento', 'Sin enfermedad hepática conocida'],
      medications: ['Levotiroxina 75 µg/día'],
      lifestyle: 'No bebe alcohol. Sale a caminar por el monte a diario.'
    },
    physicalExam: {
      vitalSigns: { bp: '106/64 mmHg', hr: '98 lpm', rr: '18 rpm', temp: '36.8 °C', sao2: '97%' },
      findings: [
        { systemName: 'Estado general', description: 'Consciente, orientada y sin temblor aleteante. Subictericia conjuntival incipiente.' },
        { systemName: 'Abdomen', description: 'Molestia a la palpación en hipocondrio derecho. Hígado en el límite del reborde costal. Sin ascitis.' }
      ]
    },
    initialLabWork: [
      { test: 'ALT (a las 36 horas de la ingesta)', result: '1.840', unit: 'U/L', referenceRange: '< 40 (necrosis hepatocelular en aumento)' },
      { test: 'AST (a las 36 horas de la ingesta)', result: '1.520', unit: 'U/L', referenceRange: '< 40' },
      { test: 'Tiempo de protrombina (INR)', result: '1.9', unit: '-', referenceRange: '0.8 - 1.2 (fallo de síntesis de factores de coagulación)' },
      { test: 'Glucemia', result: '64', unit: 'mg/dL', referenceRange: '70 - 110' },
      { test: 'Alfa-amanitina en orina', result: '[NO SOLICITADO - Prueba confirmatoria a pedir por el clínico]', unit: 'ng/mL', referenceRange: 'No detectable' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Intoxicación por Amanita phalloides (síndrome faloidiano) con hepatitis tóxica aguda',
        plausibilityRationale: 'Cuadro digestivo con latencia superior a 6 horas tras comer setas no identificadas, seguido de falsa mejoría y ascenso progresivo de transaminasas e INR; otro comensal empieza con síntomas.',
        isTargetDisease: true
      },
      {
        disease: 'Síndrome gastrointestinal por setas irritantes',
        plausibilityRationale: 'Empieza en menos de 6 horas y no daña el hígado; aquí la latencia es larga y las transaminasas superan las 1.000 U/L.',
        isTargetDisease: false
      },
      {
        disease: 'Hepatitis aguda por virus de la hepatitis A',
        plausibilityRationale: 'Puede elevar mucho las transaminasas, pero empieza con fiebre y malestar días antes y no explica el cuadro digestivo explosivo tras las setas ni los síntomas del marido.',
        isTargetDisease: false
      },
      {
        disease: 'Hepatotoxicidad por paracetamol',
        plausibilityRationale: 'Da un patrón de necrosis muy parecido, pero la paciente no ha tomado paracetamol y la relación temporal con las setas es clara.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Intoxicación por Amanita phalloides (síndrome faloidiano) con hepatitis tóxica aguda',
    biomarkerOptions: [
      {
        id: 'bm_opt_amanitina_correct',
        biomarkerId: 'bm_alfa_amanitina_orina',
        biomarkerName: 'Alfa-amanitina en orina',
        isCorrect: true,
        biochemicalRationale: 'La amanitina se elimina por el riñón y se detecta en orina por inmunoensayo o espectrometría de masas en las primeras 72 horas, incluso cuando ya no está en sangre. Confirma la intoxicación y justifica el tratamiento específico (silibinina, carbón activado repetido) y el aviso precoz a la unidad de trasplante.',
        whyOptimalOrSuboptimal: 'Confirma la causa con rapidez; las transaminasas e INR miden la gravedad pero no la etiología.'
      },
      {
        id: 'bm_opt_alt_amanitina_distractor',
        biomarkerId: 'bm_alt',
        biomarkerName: 'ALT aislada',
        isCorrect: false,
        biochemicalRationale: 'Enzima citosólica del hepatocito.',
        whyOptimalOrSuboptimal: 'Ya sabemos que está muy elevada; indica necrosis pero no distingue la amanitina de otras hepatitis agudas.'
      },
      {
        id: 'bm_opt_lipasa_amanitina_distractor',
        biomarkerId: 'bm_lipasa',
        biomarkerName: 'Lipasa sérica',
        isCorrect: false,
        biochemicalRationale: 'Marcador de pancreatitis.',
        whyOptimalOrSuboptimal: 'El dolor y los vómitos no son de origen pancreático.'
      },
      {
        id: 'bm_opt_colinesterasa_amanitina_distractor',
        biomarkerId: 'bm_colinesterasa',
        biomarkerName: 'Colinesterasa sérica',
        isCorrect: false,
        biochemicalRationale: 'Marcador de intoxicación por organofosforados (y de síntesis hepática).',
        whyOptimalOrSuboptimal: 'Las setas faloidianas no inhiben la acetilcolinesterasa; no hay síndrome colinérgico.'
      }
    ],
    expertClinicalKey:
      'La α-amanitina se une a la subunidad grande de la ARN polimerasa II (RPB1) con una afinidad enorme y bloquea su translocación sobre el ADN; la ARN polimerasa I es insensible y la III solo se inhibe a concentraciones mucho mayores, lo que se aprovecha en el laboratorio para distinguirlas. El hígado se lleva el daño porque la toxina llega primero por la porta, entra activamente por OATP1B3 y recircula por la bilis. La silibinina compite con la amanitina por ese transportador. Toda ingesta de setas con latencia mayor de 6 horas debe tratarse como faloidiana hasta demostrar lo contrario.',
    essentialBiomarkerIds: ['bm_alfa_amanitina_orina'],
    categoryDocente: 'Transcripción y síntesis de ácidos nucleicos',
    molecularPathway: 'α-amanitina -> captación hepática por OATP1B3 -> unión a RPB1 de la ARN polimerasa II -> bloqueo de la síntesis de ARNm -> parada de la síntesis proteica -> necrosis centrolobulillar',
    molecularAlteration: 'Inhibición tóxica de la ARN polimerasa II'
  },

  // BLOQUE 6 · Sangre y hemoglobina
  {
    id: 'case_marks_talasemia_01',
    title: 'Aya M. (5 años): Palidez, cansancio y bazo grande con hierro normal',
    system: 'neuromuscular',
    difficulty: 'avanzado',
    studentSummary:
      'Aya M., una niña de 5 años de origen marroquí, está pálida y se cansa mucho jugando. Su pediatra le dio hierro durante tres meses sin ninguna mejoría. Tiene el bazo grande y los glóbulos rojos son muy pequeños, pero sus depósitos de hierro son normales. Su médula fabrica poca cadena β de la hemoglobina.',
    clinicalGlossary: [
      { term: 'Talasemia', simpleDefinition: 'Enfermedad hereditaria en la que se fabrica menos cantidad de una de las cadenas de la globina (α o β), aunque la cadena que se produce es normal.' },
      { term: 'Eritropoyesis ineficaz', simpleDefinition: 'La médula produce muchos precursores de glóbulos rojos, pero gran parte muere antes de salir a la sangre.' },
      { term: 'HbA2', simpleDefinition: 'Hemoglobina minoritaria del adulto formada por dos cadenas α y dos δ (α2δ2). Aumenta cuando escasea la cadena β.' },
      { term: 'Microcitosis', simpleDefinition: 'Glóbulos rojos más pequeños de lo normal (VCM < 80 fL), como ocurre en la ferropenia y en las talasemias.' }
    ],
    biochemicalConceptSimple:
      '1. Una mutación en el gen HBB reduce la síntesis de cadenas β -> 2. Las cadenas α sobrantes no encuentran pareja y precipitan dentro de los precursores -> 3. Los eritroblastos se dañan y muchos mueren en la médula (eritropoyesis ineficaz) -> 4. Los hematíes que salen son pequeños, pálidos y duran poco -> 5. Se compensa con más HbA2 (α2δ2) y HbF (α2γ2), y el bazo crece al retirar los hematíes dañados.',
    clinicalHistory: {
      patientDemographics: { age: 5, gender: 'Femenino', occupation: 'Escolar' },
      chiefComplaint: 'Palidez persistente, cansancio con el juego y abdomen abultado.',
      presentIllness:
        'Aya M. es derivada a hematología pediátrica. Desde los 3 años está pálida y se cansa antes que sus compañeros. Hace 4 meses le encontraron una hemoglobina de 8.6 g/dL con hematíes pequeños y su pediatra le pautó hierro oral durante 3 meses, que tomó bien, sin ninguna mejoría. Sus padres son primos segundos y proceden del norte de Marruecos. Al padre le han dicho alguna vez que tiene «los glóbulos pequeños» sin estar anémico.',
      pastMedicalHistory: ['Dos episodios de ictericia leve con infecciones víricas', 'Padres consanguíneos (primos segundos)', 'Padre con microcitosis sin anemia'],
      medications: ['Sulfato ferroso oral durante 3 meses (suspendido por falta de respuesta)'],
      lifestyle: 'Alimentación variada y adecuada para su edad.'
    },
    physicalExam: {
      vitalSigns: { bp: '94/58 mmHg', hr: '112 lpm', rr: '22 rpm', temp: '36.6 °C', sao2: '98%' },
      findings: [
        { systemName: 'Piel y mucosas', description: 'Palidez marcada con tinte subictérico en las conjuntivas.' },
        { systemName: 'Cara', description: 'Prominencia de los huesos frontales y malares por expansión de la médula ósea.' },
        { systemName: 'Abdomen', description: 'Esplenomegalia a 5 cm del reborde costal izquierdo y hepatomegalia a 2 cm.' }
      ]
    },
    initialLabWork: [
      { test: 'Hemoglobina', result: '8.2', unit: 'g/dL', referenceRange: '11.5 - 13.5' },
      { test: 'Volumen corpuscular medio (VCM)', result: '61', unit: 'fL', referenceRange: '75 - 87 (microcitosis intensa)' },
      { test: 'Recuento de hematíes', result: '4.9', unit: 'millones/µL', referenceRange: '3.9 - 5.3 (normal pese a la anemia, a diferencia de la ferropenia)' },
      { test: 'Ferritina sérica', result: '186', unit: 'ng/mL', referenceRange: '15 - 150 (sin ferropenia; tendencia a sobrecarga)' },
      { test: 'Frotis de sangre periférica', result: 'Hipocromía, dianocitos (células en diana), punteado basófilo y eritroblastos circulantes', unit: '', referenceRange: 'Normal' },
      { test: 'Cuantificación de HbA2 y HbF por HPLC', result: '[NO SOLICITADO - Prueba diagnóstica a pedir por el clínico]', unit: '%', referenceRange: 'HbA2 2.0 - 3.3, HbF < 1' }
    ],
    differentialDiagnoses: [
      {
        disease: 'β-talasemia intermedia',
        plausibilityRationale: 'Anemia microcítica moderada que no responde al hierro, ferritina normal-alta, hematíes normales o altos en número, dianocitos, esplenomegalia, cambios óseos faciales, padres consanguíneos y un padre con microcitosis sin anemia (portador).',
        isTargetDisease: true
      },
      {
        disease: 'Anemia ferropénica',
        plausibilityRationale: 'Es la causa más frecuente de microcitosis, pero aquí la ferritina está alta, el número de hematíes es normal y no hubo respuesta al hierro.',
        isTargetDisease: false
      },
      {
        disease: 'Anemia de células falciformes',
        plausibilityRationale: 'Es otra hemoglobinopatía, pero cualitativa: produce crisis de dolor vasooclusivas y drepanocitos en el frotis, y suele ser normocítica.',
        isTargetDisease: false
      },
      {
        disease: 'Esferocitosis hereditaria',
        plausibilityRationale: 'Cursa con anemia hemolítica, ictericia y esplenomegalia, pero los hematíes son esferocitos con VCM normal y CHCM alta, no microcitos con dianocitos.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'β-talasemia intermedia',
    biomarkerOptions: [
      {
        id: 'bm_opt_hplc_talasemia_correct',
        biomarkerId: 'bm_electroforesis_hb',
        biomarkerName: 'Cuantificación de hemoglobinas por HPLC (HbA, HbA2 y HbF)',
        isCorrect: true,
        biochemicalRationale: 'Al escasear la cadena β, las cadenas α sobrantes se unen a cadenas δ y γ: la HbA2 sube por encima del 3.5% y la HbF aumenta (en la talasemia intermedia, a menudo 10-50%). Este patrón confirma la β-talasemia y su gravedad orienta la necesidad de transfusiones.',
        whyOptimalOrSuboptimal: 'Confirma el tipo de hemoglobinopatía y se completa después con el estudio genético del gen HBB.'
      },
      {
        id: 'bm_opt_ldh_talasemia_distractor',
        biomarkerId: 'bm_ldh',
        biomarkerName: 'Lactato deshidrogenasa (LDH)',
        isCorrect: false,
        biochemicalRationale: 'Enzima que se libera al romperse las células.',
        whyOptimalOrSuboptimal: 'Estará elevada por la hemólisis y la eritropoyesis ineficaz, pero no indica qué hemoglobinopatía hay.'
      },
      {
        id: 'bm_opt_b12_talasemia_distractor',
        biomarkerId: 'bm_vitamina_b12',
        biomarkerName: 'Vitamina B12 sérica',
        isCorrect: false,
        biochemicalRationale: 'Su déficit causa anemia megaloblástica.',
        whyOptimalOrSuboptimal: 'La anemia es microcítica, no macrocítica; la B12 no tiene relación con este cuadro.'
      },
      {
        id: 'bm_opt_bilirrubina_talasemia_distractor',
        biomarkerId: 'bm_bilirrubina_total',
        biomarkerName: 'Bilirrubina total',
        isCorrect: false,
        biochemicalRationale: 'Producto de la degradación del hemo.',
        whyOptimalOrSuboptimal: 'Puede estar algo elevada (indirecta) por la hemólisis, pero es inespecífica.'
      }
    ],
    expertClinicalKey:
      'En la β-talasemia el problema no es solo la falta de cadena β: el exceso de cadenas α libres, que no forman tetrámeros estables, precipita en los eritroblastos, genera especies reactivas de oxígeno y provoca su apoptosis en la médula. Por eso los pacientes se benefician de todo lo que reduce ese desequilibrio, como heredar a la vez una α-talasemia o mantener la síntesis de cadenas γ (HbF), objetivo de la hidroxiurea y de las nuevas terapias génicas. La eritropoyesis ineficaz aumenta la eritroferrona, que suprime la hepcidina; el intestino absorbe más hierro y aparece sobrecarga férrica incluso sin transfusiones, de ahí que dar hierro sin comprobar la ferritina sea un error.',
    essentialBiomarkerIds: ['bm_electroforesis_hb'],
    categoryDocente: 'Hemoglobinopatías cuantitativas',
    molecularPathway: 'Gen HBB mutado -> menos cadenas β -> exceso de cadenas α libres -> precipitación y estrés oxidativo en eritroblastos -> eritropoyesis ineficaz -> más HbA2 (α2δ2) y HbF (α2γ2)',
    molecularAlteration: 'Variantes β+ en el gen HBB (cromosoma 11) que reducen, sin abolir, la síntesis de cadena β'
  },

  // BLOQUE 7 · Integración metabólica
  {
    id: 'case_marks_anorexia_01',
    title: 'Claudia S. (22 años): Amenorrea, agotamiento y un IMC de 14 aunque ella se ve gorda',
    system: 'metabolic',
    difficulty: 'avanzado',
    studentSummary:
      'Claudia S., dependienta de 22 años, lleva seis meses sin regla y se nota muy cansada. Mide 168 cm y pesa 40 kg, pero está convencida de que le sobra peso. Come unas 600 kcal al día y corre dos horas diarias. Su cuerpo lleva meses en ayuno: ha gastado el glucógeno, quema grasa y músculo y fabrica cuerpos cetónicos para alimentar al cerebro.',
    clinicalGlossary: [
      { term: 'Anorexia nerviosa', simpleDefinition: 'Trastorno de la conducta alimentaria con restricción de la ingesta, miedo intenso a ganar peso y distorsión de la imagen corporal.' },
      { term: 'Desnutrición calórica (marasmo)', simpleDefinition: 'Pérdida grave de grasa y músculo por déficit mantenido de energía, con proteínas plasmáticas relativamente conservadas.' },
      { term: 'Adaptación al ayuno prolongado', simpleDefinition: 'Tras días sin aporte suficiente, el hígado fabrica cuerpos cetónicos y el cerebro los usa como combustible para ahorrar proteínas musculares.' },
      { term: 'Síndrome de realimentación', simpleDefinition: 'Caída brusca de fosfato, potasio y magnesio al reintroducir los hidratos de carbono demasiado rápido en un paciente desnutrido; puede ser mortal.' }
    ],
    biochemicalConceptSimple:
      '1. Ingesta muy por debajo del gasto durante meses -> 2. Baja la insulina y sube el glucagón: se agota el glucógeno y se moviliza la grasa -> 3. El hígado convierte los ácidos grasos en cuerpos cetónicos, que usa el cerebro -> 4. El músculo cede aminoácidos para la gluconeogénesis (pérdida de masa muscular) -> 5. El hipotálamo frena el eje gonadal (amenorrea) y el tiroideo (T3 baja) para ahorrar energía.',
    clinicalHistory: {
      patientDemographics: { age: 22, gender: 'Femenino', occupation: 'Dependienta en una tienda de deportes' },
      chiefComplaint: 'Seis meses sin menstruación, cansancio intenso y sensación continua de frío.',
      presentIllness:
        'Claudia S. acude a la consulta de ginecología por amenorrea de 6 meses. Hace un año pesaba 52 kg; desde entonces sigue una dieta que ella misma calcula en unas 600 kcal diarias (sobre todo verdura, fruta y algo de yogur) y corre una hora por la mañana y otra por la noche. Aunque reconoce que está «delgada», dice que se nota tripa y muslos y que no quiere volver a engordar. Se marea al levantarse, tiene frío continuamente y le cuesta concentrarse en el trabajo. Ante el peso registrado en la consulta, la ginecóloga la deriva a urgencias.',
      pastMedicalHistory: ['Menarquia a los 12 años con reglas regulares hasta hace un año', 'Sin enfermedades conocidas'],
      medications: ['Ninguno'],
      lifestyle: 'Restricción calórica intensa y ejercicio aeróbico unas 2 horas diarias. No fuma ni bebe alcohol.'
    },
    physicalExam: {
      vitalSigns: { bp: '86/54 mmHg', hr: '46 lpm (bradicardia)', rr: '14 rpm', temp: '35.4 °C (hipotermia leve)', sao2: '98%' },
      findings: [
        { systemName: 'Antropometría', description: 'Peso 40 kg, talla 168 cm, IMC 14.2 kg/m² (desnutrición grave).' },
        { systemName: 'Aspecto general', description: 'Muy delgada, con pérdida de grasa subcutánea y de masa muscular en brazos y glúteos. Piel seca y vello fino (lanugo) en espalda y antebrazos.' },
        { systemName: 'Extremidades', description: 'Acrocianosis en manos y pies. Sin edemas.' }
      ]
    },
    initialLabWork: [
      { test: 'Glucemia en ayunas', result: '62', unit: 'mg/dL', referenceRange: '70 - 99' },
      { test: 'Hemoglobina', result: '10.9', unit: 'g/dL', referenceRange: '12.0 - 15.5' },
      { test: 'Fosfato sérico', result: '2.6', unit: 'mg/dL', referenceRange: '2.5 - 4.5 (en el límite: riesgo de realimentación)' },
      { test: 'Potasio sérico', result: '3.3', unit: 'mEq/L', referenceRange: '3.5 - 5.1' },
      { test: 'Albúmina sérica', result: '3.7', unit: 'g/dL', referenceRange: '3.5 - 5.0 (conservada, típico del marasmo)' },
      { test: 'β-hidroxibutirato en sangre', result: '[NO SOLICITADO - Parámetro a pedir por el clínico]', unit: 'mmol/L', referenceRange: '< 0.5' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Anorexia nerviosa restrictiva con desnutrición calórica grave (marasmo)',
        plausibilityRationale: 'Restricción voluntaria con ejercicio excesivo, miedo a ganar peso y distorsión de la imagen corporal, IMC 14.2, amenorrea, bradicardia, hipotermia, lanugo y albúmina conservada.',
        isTargetDisease: true
      },
      {
        disease: 'Hipertiroidismo',
        plausibilityRationale: 'Hace perder peso, pero con taquicardia, calor e intolerancia al calor; esta paciente tiene bradicardia, frío e hipotermia.',
        isTargetDisease: false
      },
      {
        disease: 'Diabetes mellitus tipo 1 de debut',
        plausibilityRationale: 'Causa adelgazamiento con cetosis, pero con hiperglucemia, poliuria y polidipsia; aquí la glucemia está baja.',
        isTargetDisease: false
      },
      {
        disease: 'Enfermedad celíaca o inflamatoria intestinal',
        plausibilityRationale: 'Pueden causar desnutrición, pero con diarrea, dolor abdominal o malabsorción; la pérdida de peso aquí se explica por la ingesta restringida y no hay síntomas digestivos.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Anorexia nerviosa restrictiva con desnutrición calórica grave (marasmo)',
    biomarkerOptions: [
      {
        id: 'bm_opt_bhb_anorexia_correct',
        biomarkerId: 'bm_beta_hidroxibutirato',
        biomarkerName: 'β-hidroxibutirato en sangre',
        isCorrect: true,
        biochemicalRationale: 'Con la insulina baja y el glucagón alto, el hígado oxida ácidos grasos y produce cuerpos cetónicos. Un β-hidroxibutirato de 2-4 mmol/L con glucemia baja-normal y sin acidosis importante confirma que el organismo funciona en modo de ayuno prolongado y cuantifica el grado de adaptación metabólica.',
        whyOptimalOrSuboptimal: 'Demuestra la cetosis de ayuno y la diferencia de la cetoacidosis diabética, en la que la glucemia está muy alta.'
      },
      {
        id: 'bm_opt_troponina_anorexia_distractor',
        biomarkerId: 'bm_troponin_c',
        biomarkerName: 'Troponina cardíaca ultrasensible',
        isCorrect: false,
        biochemicalRationale: 'Marcador de daño del miocardio.',
        whyOptimalOrSuboptimal: 'La bradicardia es una adaptación al ayuno, no un infarto; la troponina no aporta al diagnóstico.'
      },
      {
        id: 'bm_opt_lipasa_anorexia_distractor',
        biomarkerId: 'bm_lipasa',
        biomarkerName: 'Lipasa sérica',
        isCorrect: false,
        biochemicalRationale: 'Marcador de pancreatitis.',
        whyOptimalOrSuboptimal: 'Sin relación con la adaptación metabólica al ayuno.'
      },
      {
        id: 'bm_opt_ck_anorexia_distractor',
        biomarkerId: 'bm_ck_total',
        biomarkerName: 'Creatina quinasa total',
        isCorrect: false,
        biochemicalRationale: 'Enzima del músculo esquelético.',
        whyOptimalOrSuboptimal: 'Puede estar algo alta por el ejercicio, pero no refleja el estado metabólico global.'
      }
    ],
    expertClinicalKey:
      'En el ayuno prolongado el cerebro llega a obtener cerca de dos tercios de su energía de los cuerpos cetónicos, lo que reduce la necesidad de gluconeogénesis a partir de aminoácidos y frena la pérdida de músculo. La leptina cae con la masa grasa y el hipotálamo deja de secretar GnRH en pulsos: de ahí la amenorrea. La T3 baja (síndrome del eutiroideo enfermo) reduce el gasto energético. Al realimentar, la insulina mete glucosa, fosfato y potasio en las células de golpe; por eso se empieza con pocas calorías y se vigilan a diario el fosfato, el potasio y el magnesio, con tiamina antes de dar glucosa.',
    essentialBiomarkerIds: ['bm_beta_hidroxibutirato'],
    categoryDocente: 'Adaptación metabólica al ayuno',
    molecularPathway: 'Insulina baja / glucagón alto -> lipólisis -> β-oxidación hepática -> acetil-CoA -> HMG-CoA sintasa -> acetoacetato y β-hidroxibutirato -> combustible para el cerebro',
    molecularAlteration: 'Déficit energético crónico con adaptación hormonal (leptina, GnRH, T3) al ayuno'
  },
  {
    id: 'case_marks_desnutricion_01',
    title: 'Ernesto L. (66 años): Adelgazamiento y abandono tras quedarse viudo',
    system: 'metabolic',
    difficulty: 'intermedio',
    studentSummary:
      'Ernesto L., profesor jubilado de 66 años, enviudó hace diez meses. Desde entonces apenas sale, ha dejado de cocinar y come muy poco. Su hija lo encuentra desorientado y descuidado y lo trae al hospital: ha perdido 13 kg y tiene las piernas hinchadas. Además de energía, a su dieta le han faltado proteínas durante meses.',
    clinicalGlossary: [
      { term: 'Desnutrición proteico-energética', simpleDefinition: 'Déficit mantenido de energía y proteínas que lleva a pérdida de peso, de músculo y de proteínas plasmáticas.' },
      { term: 'Albúmina', simpleDefinition: 'Proteína más abundante del plasma, fabricada por el hígado; mantiene el agua dentro de los vasos (presión oncótica).' },
      { term: 'Prealbúmina (transtiretina)', simpleDefinition: 'Proteína hepática de vida media corta (2 días) que refleja cambios recientes en el estado nutricional.' },
      { term: 'Edema hipoalbuminémico', simpleDefinition: 'Hinchazón por salida de agua de los vasos al intersticio cuando la albúmina baja y cae la presión oncótica.' }
    ],
    biochemicalConceptSimple:
      '1. Ingesta escasa de energía y proteínas durante meses -> 2. El músculo se degrada para aportar aminoácidos al hígado -> 3. Sin suficientes aminoácidos, el hígado fabrica menos albúmina y otras proteínas -> 4. Baja la presión oncótica del plasma y el agua sale a los tejidos (edemas) -> 5. Faltan también vitaminas, hierro y zinc, y se debilitan la inmunidad y la cicatrización.',
    clinicalHistory: {
      patientDemographics: { age: 66, gender: 'Masculino', occupation: 'Profesor de instituto jubilado' },
      chiefComplaint: 'Pérdida de peso, decaimiento, confusión e hinchazón de piernas.',
      presentIllness:
        'Ernesto L. vive solo desde que falleció su mujer hace 10 meses. Su hija, que vive en otra ciudad, lo ha encontrado esta semana en pijama, sin asear, con la nevera casi vacía y algo desorientado. Él reconoce que no tiene ganas de nada, que duerme mal y que come «un café con leche y unas galletas» casi todos los días. Ha pasado de 74 a 61 kg en 10 meses. Desde hace unas semanas se le hinchan los tobillos y se cansa al andar.',
      pastMedicalHistory: ['Hipertensión arterial bien controlada', 'Sin enfermedad hepática, renal ni cardíaca conocida'],
      medications: ['Enalapril 10 mg/día (lo toma de forma irregular)'],
      lifestyle: 'Aislamiento social desde que enviudó. No bebe alcohol. Antes caminaba a diario; ahora apenas sale de casa.'
    },
    physicalExam: {
      vitalSigns: { bp: '108/66 mmHg', hr: '88 lpm', rr: '16 rpm', temp: '36.0 °C', sao2: '96%' },
      findings: [
        { systemName: 'Antropometría', description: 'Peso 61 kg, talla 179 cm, IMC 19.0 kg/m²; pérdida del 18% del peso en 10 meses.' },
        { systemName: 'Aspecto general', description: 'Pálido, apático, con atrofia de músculos temporales e interóseos. Piel seca y descamativa, pelo fino que se arranca con facilidad.' },
        { systemName: 'Extremidades', description: 'Edemas con fóvea en ambos tobillos. Sin ingurgitación yugular ni crepitantes pulmonares.' },
        { systemName: 'Esfera mental', description: 'Ánimo muy bajo, enlentecido; orientado en persona pero con dudas en la fecha.' }
      ]
    },
    initialLabWork: [
      { test: 'Hemoglobina', result: '10.4', unit: 'g/dL', referenceRange: '13.5 - 17.5' },
      { test: 'Linfocitos totales', result: '1.050', unit: '/µL', referenceRange: '1.500 - 4.000 (inmunidad disminuida por desnutrición)' },
      { test: 'Colesterol total', result: '128', unit: 'mg/dL', referenceRange: '< 200 (bajo por déficit de aporte)' },
      { test: 'Creatinina sérica', result: '0.62', unit: 'mg/dL', referenceRange: '0.7 - 1.3 (baja por pérdida de masa muscular)' },
      { test: 'Albúmina y prealbúmina séricas', result: '[NO SOLICITADO - Parámetro clave a pedir por el clínico]', unit: 'g/dL / mg/dL', referenceRange: 'Albúmina 3.5 - 5.0; prealbúmina 20 - 40' }
    ],
    differentialDiagnoses: [
      {
        disease: 'Desnutrición proteico-energética secundaria a depresión',
        plausibilityRationale: 'Pérdida de peso del 18% con ingesta casi nula durante meses en el contexto de un duelo y aislamiento, atrofia muscular, pelo y piel alterados, edemas sin causa cardíaca y linfopenia.',
        isTargetDisease: true
      },
      {
        disease: 'Insuficiencia cardíaca congestiva',
        plausibilityRationale: 'Explicaría los edemas y el cansancio, pero no hay ingurgitación yugular, crepitantes ni cardiomegalia, y no justifica la pérdida de peso y de músculo.',
        isTargetDisease: false
      },
      {
        disease: 'Neoplasia oculta',
        plausibilityRationale: 'Debe tenerse en cuenta ante una pérdida de peso a esta edad, pero aquí la caída de la ingesta tiene una causa clara; se reevaluará si no recupera peso al alimentarse.',
        isTargetDisease: false
      },
      {
        disease: 'Síndrome nefrótico',
        plausibilityRationale: 'Da edemas con albúmina baja, pero por pérdida de proteínas en la orina, con proteinuria intensa y colesterol muy alto, no bajo.',
        isTargetDisease: false
      }
    ],
    targetDisease: 'Desnutrición proteico-energética secundaria a depresión',
    biomarkerOptions: [
      {
        id: 'bm_opt_albumina_dpe_correct',
        biomarkerId: 'bm_albu_mina',
        biomarkerName: 'Albúmina y prealbúmina séricas',
        isCorrect: true,
        biochemicalRationale: 'Sin aporte suficiente de aminoácidos el hígado reduce la síntesis de proteínas de exportación. La albúmina (vida media unos 20 días) refleja la desnutrición mantenida y explica los edemas; la prealbúmina (unos 2 días) cae antes y sube antes, por lo que sirve para seguir la respuesta a la renutrición.',
        whyOptimalOrSuboptimal: 'Cuantifican el componente proteico de la desnutrición y permiten vigilar la recuperación.'
      },
      {
        id: 'bm_opt_nt_probnp_dpe_distractor',
        biomarkerId: 'bm_nt_probnp',
        biomarkerName: 'NT-proBNP',
        isCorrect: false,
        biochemicalRationale: 'Marcador de distensión ventricular.',
        whyOptimalOrSuboptimal: 'Ayudaría a descartar insuficiencia cardíaca, pero no explica la pérdida de peso ni la causa de los edemas.'
      },
      {
        id: 'bm_opt_lipasa_dpe_distractor',
        biomarkerId: 'bm_lipasa',
        biomarkerName: 'Lipasa sérica',
        isCorrect: false,
        biochemicalRationale: 'Marcador de pancreatitis.',
        whyOptimalOrSuboptimal: 'Sin relación con el estado nutricional.'
      },
      {
        id: 'bm_opt_acido_urico_dpe_distractor',
        biomarkerId: 'bm_acido_urico',
        biomarkerName: 'Ácido úrico sérico',
        isCorrect: false,
        biochemicalRationale: 'Producto final de las purinas.',
        whyOptimalOrSuboptimal: 'Inespecífico; no mide el grado de desnutrición.'
      }
    ],
    expertClinicalKey:
      'La albúmina es un mal marcador aislado de nutrición porque también baja en la inflamación (es un reactante de fase aguda negativo), en la insuficiencia hepática y en las pérdidas renales o digestivas; por eso se interpreta junto con la historia, la pérdida de peso, la exploración y la proteína C reactiva. En este paciente la causa del déficit es psicosocial y el tratamiento debe abordar a la vez la alimentación y la depresión. Al igual que en la anorexia, la renutrición tiene que ser progresiva para evitar el síndrome de realimentación.',
    essentialBiomarkerIds: ['bm_albu_mina'],
    categoryDocente: 'Adaptación metabólica al ayuno y estado nutricional',
    molecularPathway: 'Déficit de aminoácidos esenciales -> proteólisis muscular -> menor síntesis hepática de albúmina y transtiretina -> menor presión oncótica -> edemas',
    molecularAlteration: 'Déficit crónico de energía y proteínas en la dieta'
  }
];
