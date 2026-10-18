export type GlossaryCategory =
  | 'glucidos'
  | 'lipidos'
  | 'nitrogeno_ciclos'
  | 'regulacion_hormonas'
  | 'clinica_patologia';

export interface GlossaryTerm {
  id: string;
  name: string;
  nameEn?: string;
  acronym?: string;
  category: GlossaryCategory;
  categoryLabel: string;
  shortDefinition: string;
  detailedExplanation: string;
  cellularLocation: string; // ej. Citosol, Matriz mitocondrial
  tissueLocation: string; // ej. Hígado (90%), Corteza renal (10%)
  keyEnzyme: string; // ej. Glucógeno fosforilasa
  keyEnzymeDetails?: string;
  energyBalance?: string; // ej. Consume 4 ATP + 2 GTP por glucosa sintetizada
  hormonalControl: {
    stimulatedBy: string[];
    inhibitedBy: string[];
    mechanismSummary: string;
  };
  clinicalRelevance: string;
  relatedTermIds: string[];
  keyMolecules?: string[];
  examTip?: string; // Consejo mnemotécnico o perla para exámenes
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory; label: string; iconColor: string }[] = [
  { id: 'glucidos', label: 'Metabolismo de Glúcidos', iconColor: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'lipidos', label: 'Lípidos & Cetonas', iconColor: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'nitrogeno_ciclos', label: 'Ciclos & Nitrógeno', iconColor: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'regulacion_hormonas', label: 'Regulación & Señales', iconColor: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'clinica_patologia', label: 'Correlación Clínica', iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
];

export const BIOCHEMISTRY_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'glucogenolisis',
    name: 'Glucogenólisis',
    nameEn: 'Glycogenolysis',
    category: 'glucidos',
    categoryLabel: 'Metabolismo de Glúcidos',
    shortDefinition: 'Ruptura fosforolítica del glucógeno para liberar glucosa-1-fosfato (G1P), manteniendo la glucemia en ayuno temprano (hígado) o generando ATP para la contracción muscular.',
    detailedExplanation: 'Proceso catabólico que no consume ATP sino que utiliza fosfato inorgánico (Pi) mediante fosforólisis, catalizado por la glucógeno fosforilasa. Rompe enlaces α(1➔4) glucosídicos hasta quedar 4 residuos antes de un punto de ramificación α(1➔6). La enzima desramificante traslada 3 residuos de glucosa y corta el enlace α(1➔6) liberando un ~10% como glucosa libre no fosforilada.',
    cellularLocation: 'Citosol celular',
    tissueLocation: 'Hígado (para exportar glucosa libre a sangre mediante G6Pasa) y Músculo esquelético (consumo local para glucólisis anaerobia/aerobia, carece de G6Pasa)',
    keyEnzyme: 'Glucógeno Fosforilasa (fosforilasa a / b)',
    keyEnzymeDetails: 'Activa en su forma fosforilada (fosforilasa a), inducida por la Fosforilasa Quinasa mediante señal de AMPc/PKA y Ca2+ citosólico.',
    energyBalance: 'Termodinámicamente ventajoso: ahorra 1 ATP al generar Glucosa-1-P directamente sin gasto de hexoquinasa.',
    hormonalControl: {
      stimulatedBy: ['Glucagón (hígado)', 'Adrenalina / Epinefrina (hígado y músculo)', 'AMP intracelular y Ca2+ (músculo)'],
      inhibitedBy: ['Insulina (activa Proteína Fosfatasa 1 - PP1)', 'Glucosa alta (hígado)', 'ATP y G6P altos'],
      mechanismSummary: 'Fosforilación en cascada dependiente de PKA que activa a la fosforilasa quinasa, pasando la fosforilasa de la forma inactiva "b" a la forma activa "a".'
    },
    clinicalRelevance: 'Enfermedades de almacenamiento de glucógeno (Glucogenosis): Tipo I (Von Gierke, déficit de G6Pasa) causa hepatomegalia e hipoglucemia de ayuno grave; Tipo V (McArdle, déficit de miofosforilasa) causa calambres musculares y mioglobinuria con ejercicio intenso.',
    relatedTermIds: ['gluconeogenesis', 'glucogenogenesis', 'glucolisis'],
    keyMolecules: ['Glucógeno', 'Glucosa-1-Fosfato', 'Glucosa-6-Fosfatasa', 'Glucagón'],
    examTip: '¡Pregunta típica de examen! El músculo NO puede liberar glucosa a la sangre porque carece de la enzima Glucosa-6-Fosfatasa.'
  },
  {
    id: 'gluconeogenesis',
    name: 'Gluconeogénesis',
    nameEn: 'Gluconeogenesis',
    acronym: 'GNG',
    category: 'glucidos',
    categoryLabel: 'Metabolismo de Glúcidos',
    shortDefinition: 'Ruta anabólica de síntesis de glucosa a partir de precursores no glucídicos (lactato, glicerol, alanina y aminoácidos glucogénicos) para mantener la glucemia en ayuno prolongado.',
    detailedExplanation: 'Comienza a ser la fuente dominante de glucosa plasmática tras 16-24 horas de ayuno, cuando las reservas de glucógeno hepático se han depletado en más del 80%. No es la simple reversión de la glucólisis: sortea los 3 pasos termodinámicamente irreversibles usando 4 enzimas exclusivas: Piruvato Carboxilasa (mitocondrial), Fosfoenolpiruvato Carboxiquinasa (PEPCK), Fructosa-1,6-Bisfosfatasa-1 (FBPasa-1) y Glucosa-6-Fosfatasa (retículo endoplásmico).',
    cellularLocation: 'Compartimentada: Matriz mitocondrial (Piruvato carboxilasa), Citosol (PEPCK, FBPasa-1) y Lumen del Retículo Endoplásmico (G6Pasa)',
    tissueLocation: 'Hígado (~90% en ayuno temprano a tardío) y Corteza Renal (~10% en ayuno corto, sube hasta 40% en inanición prolongada o acidosis metabólica crónica)',
    keyEnzyme: 'Fructosa-1,6-Bisfosfatasa-1 (FBPasa-1) y Piruvato Carboxilasa',
    keyEnzymeDetails: 'Piruvato Carboxilasa requiere biotina como grupo prostético y es activada alostéricamente de forma obligada por Acetil-CoA de la β-oxidación.',
    energyBalance: 'Costosa: Requiere 6 equivalentes de alta energía: 4 ATP + 2 GTP + 2 NADH por cada molécula de glucosa sintetizada.',
    hormonalControl: {
      stimulatedBy: ['Glucagón (vía PKA e inducción génica de PEPCK)', 'Cortisol (estimula proteólisis y transcripción de enzimas gluconeogénicas)', 'Adrenalina'],
      inhibitedBy: ['Insulina (suprime expresión de PEPCK y G6Pasa, eleva F-2,6-BP)', 'Fructosa-2,6-Bisfosfato', 'AMP alto'],
      mechanismSummary: 'El glucagón fosforila la enzima bifuncional PFK-2/FBPasa-2, activando la fosfatasa y destruyendo la F-2,6-BP, lo que desinhibe por completo a la FBPasa-1.'
    },
    clinicalRelevance: 'En cetoacidosis diabética o ayuno extremo, la gluconeogénesis funciona a ritmo máximo sin freno de insulina, acelerando el desgaste muscular por consumo de aminoácidos y contribuyendo a la hiperglucemia persistente.',
    relatedTermIds: ['glucogenolisis', 'cetogenesis', 'fructosa_2_6_bisfosfato', 'ciclo_cori', 'ciclo_alanina'],
    keyMolecules: ['Lactato', 'Glicerol', 'Alanina', 'Piruvato Carboxilasa', 'PEPCK', 'FBPasa-1'],
    examTip: 'Los ácidos grasos pares NO son sustrato neto para la gluconeogénesis humana porque el piruvato deshidrogenasa es irreversible y la Acetil-CoA pierde 2 carbonos como CO2 en el ciclo de Krebs.'
  },
  {
    id: 'cetogenesis',
    name: 'Cetogénesis',
    nameEn: 'Ketogenesis',
    category: 'lipidos',
    categoryLabel: 'Lípidos & Cetonas',
    shortDefinition: 'Ruta hepática mitocondrial de condensación del exceso de Acetil-CoA derivado de la β-oxidación para sintetizar cuerpos cetónicos (acetoacetato, β-hidroxibutirato y acetona).',
    detailedExplanation: 'Durante el ayuno prolongado o en diabetes descompensada, la lipólisis adipocitaria inunda el hígado con ácidos grasos libres. La β-oxidación masiva genera un exceso enorme de Acetil-CoA y NADH. Simultáneamente, el oxalacetato del ciclo de Krebs es desviado hacia la gluconeogénesis. La escasez de oxalacetato libre impide que la Acetil-CoA entre al ciclo de Krebs, desviándose a la cetogénesis mitocondrial para reciclar Coenzima A libre.',
    cellularLocation: 'Matriz mitocondrial de los hepatocitos exclusivamente',
    tissueLocation: 'Hígado (órgano productor único; no puede consumirlos porque carece de la enzima transferasa Tioforasa/SCOT)',
    keyEnzyme: 'HMG-CoA Sintasa Mitocondrial (3-hidroxi-3-metilglutaril-CoA sintasa 2)',
    keyEnzymeDetails: 'Paso limitante e irreversible. Condensa acetoacetil-CoA con una tercera molécula de Acetil-CoA. Inducida fuertemente en ayuno.',
    energyBalance: 'Proceso exportador: Permite convertir el poder calorífico de las grasas en un combustible hidrosoluble que no requiere albúmina y atraviesa la barrera hematoencefálica.',
    hormonalControl: {
      stimulatedBy: ['Glucagón alto (cociente I/G muy bajo)', 'Adrenalina', 'Nivel elevado de ácidos grasos libres plasmáticos'],
      inhibitedBy: ['Insulina (bloquea la lipólisis adipocitaria vía fosfodiesterasa y eleva Malonil-CoA inhibiendo CPT-1)'],
      mechanismSummary: 'Baja insulina desinhibe CPT-1 (al caer el Malonil-CoA), permitiendo la entrada masiva de acil-CoA a la mitocondria y saturando la capacidad oxidativa del ciclo de Krebs.'
    },
    clinicalRelevance: 'En diabetes mellitus tipo 1 sin insulina, la cetogénesis descontrolada conduce a Cetoacidosis Diabética (CAD), con acidosis metabólica de anión gap elevado, respiración de Kussmaul y aliento cetónico a manzanas podridas/fruta.',
    relatedTermIds: ['cetolisis', 'beta_oxidacion', 'lipolisis', 'cuerpos_cetonicos', 'cetoacidosis_diabetica'],
    keyMolecules: ['Acetoacetato', 'Beta-Hidroxibutirato', 'Acetil-CoA', 'HMG-CoA Sintasa'],
    examTip: '¡Clave de examen! El hígado fabrica cuerpos cetónicos pero NO puede usarlos como combustible porque no tiene Tioforasa (SCOT).'
  },
  {
    id: 'cetolisis',
    name: 'Cetólisis',
    nameEn: 'Ketolysis',
    category: 'lipidos',
    categoryLabel: 'Lípidos & Cetonas',
    shortDefinition: 'Oxidación y activación periférica de cuerpos cetónicos en tejidos extrahepáticos para reconvertirlos en Acetil-CoA e ingresar al ciclo de Krebs.',
    detailedExplanation: 'El β-hidroxibutirato circulante se oxida en el citosol/mitocondria a acetoacetato mediante la β-hidroxibutirato deshidrogenasa, produciendo NADH. Luego, la enzima transferasa mitocondrial succinil-CoA:3-cetoácido CoA transferasa (Tioforasa o SCOT) transfiere CoA desde succinil-CoA al acetoacetato para formar acetoacetil-CoA, el cual la tiolasa escinde en 2 moléculas de Acetil-CoA.',
    cellularLocation: 'Matriz mitocondrial de células diana extrahepáticas',
    tissueLocation: 'Cerebro (ayuno >48h), Músculo cardíaco (miocardio), Músculo esquelético y Corteza Renal. Ausente en Hígado y Eritrocitos.',
    keyEnzyme: 'Tioforasa / SCOT (Succinil-CoA:3-cetoácido CoA transferasa)',
    keyEnzymeDetails: 'Ausente selectivamente en los hepatocitos para evitar un ciclo fútil de síntesis y degradación simultánea.',
    energyBalance: 'Altamente energética: la oxidación completa de 1 mol de β-hidroxibutirato rinde ~21.5 moles de ATP.',
    hormonalControl: {
      stimulatedBy: ['Disponibilidad del sustrato (niveles crecientes de acetoacetato y β-hidroxibutirato en sangre)'],
      inhibitedBy: ['Hiperglucemia e hiperinsulinemia (que reducen la producción hepática de cetonas)'],
      mechanismSummary: 'Controlada primariamente por la concentración plasmática de cuerpos cetónicos y la expresión de transportadores MCT1/MCT2 en la barrera hematoencefálica.'
    },
    clinicalRelevance: 'La adaptación del cerebro a la cetólisis durante la inanición le permite cubrir ~60-70% de su energía con cetonas (su consumo de glucosa baja de ~120 a ~40 g/día), protegiendo las proteínas musculares de una proteólisis fatal.',
    relatedTermIds: ['cetogenesis', 'cuerpos_cetonicos', 'ciclo_krebs'],
    keyMolecules: ['Tioforasa (SCOT)', 'Beta-Hidroxibutirato', 'Acetoacetato', 'Acetil-CoA'],
    examTip: 'Los eritrocitos no pueden realizar cetólisis porque carecen de mitocondrias y dependen exclusivamente de la glucólisis anaerobia.'
  },
  {
    id: 'glucolisis',
    name: 'Glucólisis (Vía de Embden-Meyerhof)',
    nameEn: 'Glycolysis',
    category: 'glucidos',
    categoryLabel: 'Metabolismo de Glúcidos',
    shortDefinition: 'Ruta citosólica universal de degradación de 1 molécula de glucosa a 2 moléculas de piruvato, generando ATP por fosforilación a nivel de sustrato y poder reductor (NADH).',
    detailedExplanation: 'Consta de 10 reacciones divididas en 2 fases: la fase preparatoria o de inversión (gasta 2 ATP fosforilando glucosa a fructosa-1,6-bisfosfato) y la fase de beneficio o rendimiento (genera 4 ATP y 2 NADH al oxidar dos triosas fosfato). Tres pasos son irreversibles: Hexoquinasa/Glucoquinasa (paso 1), Fosfofructoquinasa-1 (paso 3, limitante) y Piruvato Quinasa (paso 10).',
    cellularLocation: 'Citosol celular en todas las células del organismo humano',
    tissueLocation: 'Universal: todos los tejidos. Esencial y obligatoria en eritrocitos (única fuente de ATP) y médula renal.',
    keyEnzyme: 'Fosfofructoquinasa-1 (PFK-1)',
    keyEnzymeDetails: 'Enzima alostérica tetramérica; activada por AMP, ADP y Fructosa-2,6-bisfosfato; inhibida por ATP y citrato.',
    energyBalance: 'Rendimiento neto: 2 ATP + 2 NADH + 2 Piruvato por cada molécula de glucosa degradada.',
    hormonalControl: {
      stimulatedBy: ['Insulina (activa PFK-2 aumentando F-2,6-BP; desfosforila piruvato quinasa e induce transcripción de glucoquinasa)'],
      inhibitedBy: ['Glucagón (hígado: fosforila piruvato quinasa L y destruye F-2,6-BP)'],
      mechanismSummary: 'La insulina estimula la glucólisis hepática mediante regulación alostérica positiva y modificación covalente (desfosforilación).'
    },
    clinicalRelevance: 'En hipoxia o en eritrocitos, el piruvato se reduce a lactato por LDH para regenerar NAD+, permitiendo continuar la glucólisis pero con riesgo de acidosis láctica si se acumula.',
    relatedTermIds: ['gluconeogenesis', 'fructosa_2_6_bisfosfato', 'ciclo_cori'],
    keyMolecules: ['Glucosa', 'Glucosa-6-P', 'PFK-1', 'Piruvato', 'NADH', 'Lactato'],
    examTip: 'La PFK-1 es el principal punto de control de flujo de toda la glucólisis; su activador alostérico fisiológico más potente es la Fructosa-2,6-Bisfosfato.'
  },
  {
    id: 'glucogenogenesis',
    name: 'Glucogénesis / Glucogenogénesis',
    nameEn: 'Glycogenesis',
    category: 'glucidos',
    categoryLabel: 'Metabolismo de Glúcidos',
    shortDefinition: 'Ruta anabólica de síntesis de glucógeno a partir de glucosa activada con UTP (UDP-glucosa) en respuesta al estado postprandial e hiperinsulinemia.',
    detailedExplanation: 'La glucosa se fosforila a G6P y se isomeriza a G1P. La UDP-glucosa pirofosforilasa une G1P con UTP para sintetizar UDP-glucosa. La proteína cebadora glucogenina se autoglucosila en una tirosina y forma un oligosacárido iniciador (~8 residuos de glucosa). La Glucógeno Sintasa alarga las cadenas creando enlaces α(1➔4). La enzima ramificante (amilo-α(1,4➔1,6)-transglucosidasa) corta segmentos de 6-8 residuos y forma ramificaciones α(1➔6) aumentando la solubilidad.',
    cellularLocation: 'Citosol celular',
    tissueLocation: 'Hígado (reserva para amortiguar la glucemia de todo el cuerpo) y Músculo esquelético (reserva energética propia para contracción muscular rápida)',
    keyEnzyme: 'Glucógeno Sintasa (GS)',
    keyEnzymeDetails: 'Activa en forma desfosforilada (sintasa a); inactivada por fosforilación por GSK-3 (Glucógeno Sintasa Quinasa-3) y PKA.',
    energyBalance: 'Consume 1 enlace de alta energía (UTP) por cada residuo de glucosa incorporado.',
    hormonalControl: {
      stimulatedBy: ['Insulina (inactiva a GSK-3 e induce a la Proteína Fosfatasa-1 PP1)', 'Glucosa-6-Fosfato (activador alostérico directo)'],
      inhibitedBy: ['Glucagón (hígado)', 'Adrenalina (hígado y músculo)'],
      mechanismSummary: 'La insulina activa la fosfatasa PP1, retirando fosfatos de la glucógeno sintasa y volviéndola constitutivamente activa.'
    },
    clinicalRelevance: 'Enfermedad de Andersen (Glucogenosis tipo IV, déficit de enzima ramificante) produce moléculas de glucógeno anómalas poco ramificadas con cadenas lineales largas insolubles (cuerpos de poliglucosano) que causan cirrosis hepática infantil.',
    relatedTermIds: ['glucogenolisis', 'glucolisis'],
    keyMolecules: ['UDP-Glucosa', 'Glucogenina', 'Glucógeno Sintasa', 'Insulina'],
    examTip: 'La síntesis y degradación de glucógeno están reguladas de forma recíproca por la misma fosfatasa (PP1) y quinasa (PKA) para evitar un ciclo fútil.'
  },
  {
    id: 'beta_oxidacion',
    name: 'Beta-Oxidación de Ácidos Grasos',
    nameEn: 'Fatty Acid Beta-Oxidation',
    category: 'lipidos',
    categoryLabel: 'Lípidos & Cetonas',
    shortDefinition: 'Ruta catabólica aerobia cíclica en la matriz mitocondrial que escinde sucesivamente fragmentos de 2 carbonos en forma de Acetil-CoA a partir de un acil-CoA graso.',
    detailedExplanation: 'Los ácidos grasos se activan en el citosol a Acil-CoA. La lanzadera de carnitina (CPT-1, translocasa y CPT-2) los introduce a la mitocondria. Cada ciclo de 4 pasos (Espiral de Lynen: deshidrogenación dependiente de FAD, hidratación, deshidrogenación dependiente de NAD+, y tiólisis por CoA) produce 1 FADH2, 1 NADH y 1 Acetil-CoA, acortando la cadena en 2 carbonos.',
    cellularLocation: 'Matriz mitocondrial (peroxisomas para ácidos grasos de cadena muy larga >22C)',
    tissueLocation: 'Músculo cardíaco (su principal fuente de ATP), Músculo esquelético, Hígado, Riñón. Ausente en Eritrocitos y escasa en Neuronas.',
    keyEnzyme: 'Carnitina Palmitoiltransferasa-1 (CPT-1 o CAT-1)',
    keyEnzymeDetails: 'Ubicada en la membrana mitocondrial externa. Punto de control limitante de entrada de ácidos grasos.',
    energyBalance: 'Rendimiento energético masivo: la oxidación de 1 mol de palmitato (16C) rinde 106 ATP netos tras descontar los 2 enlaces gastados en la activación.',
    hormonalControl: {
      stimulatedBy: ['Glucagón', 'Adrenalina', 'AMPK (fosforila e inactiva a la Acetil-CoA carboxilasa, reduciendo el malonil-CoA)'],
      inhibitedBy: ['Insulina (estimula la lipogénesis y eleva Malonil-CoA)', 'Malonil-CoA (inhibidor alostérico fisiológico potente de CPT-1)'],
      mechanismSummary: 'El malonil-CoA es el sensor recíproco que impide la oxidación de ácidos grasos mientras se está sintetizando grasa nueva.'
    },
    clinicalRelevance: 'Déficit de MCAD (Acil-CoA Deshidrogenasa de Cadena Media): causa hipoglucemia hipocetósica grave y muerte súbita del lactante durante periodos de ayuno o gastroenteritis.',
    relatedTermIds: ['cetogenesis', 'lipolisis', 'lipogenesis'],
    keyMolecules: ['Acil-CoA', 'Carnitina', 'CPT-1', 'Malonil-CoA', 'FADH2', 'NADH'],
    examTip: 'Ante un paciente con hipoglucemia en ayunas SIN cuerpos cetónicos (hipocetósica), sospecha inmediatamente un defecto en la β-oxidación o en la lanzadera de carnitina.'
  },
  {
    id: 'lipolisis',
    name: 'Lipólisis Adipocitaria',
    nameEn: 'Adipose Lipolysis',
    category: 'lipidos',
    categoryLabel: 'Lípidos & Cetonas',
    shortDefinition: 'Hidrólisis enzimática de los triglicéridos almacenados en la gota lipídica de los adipocitos para liberar ácidos grasos libres (AGL) y glicerol a la sangre.',
    detailedExplanation: 'Cascada secuencial de tres hidrolasas: 1) ATGL (Triacilglicerol lipasa adiposa) hidroliza el primer éster a DAG; 2) HSL (Lipasa sensible a hormonas) hidroliza DAG a MAG; 3) MGL (Monoacilglicerol lipasa) libera el último ácido graso y el glicerol libre. Los AGL viajan unidos a la albúmina hacia músculo, corazón e hígado; el glicerol viaja libre al hígado para servir de sustrato gluconeogénico.',
    cellularLocation: 'Citosol y superficie de la gota lipídica de los adipocitos blancos',
    tissueLocation: 'Tejido adiposo blanco subcutáneo y visceral',
    keyEnzyme: 'Lipasa Sensible a Hormonas (HSL) y ATGL',
    keyEnzymeDetails: 'La HSL es fosforilada y activada por PKA, trasladándose desde el citosol hasta la superficie de la gota lipídica junto a la fosforilación de perilipinas.',
    energyBalance: 'Libera 3 equivalentes de ácidos grasos (fuente de ATP vía β-oxidación) y 1 glicerol (sustrato gluconeogénico).',
    hormonalControl: {
      stimulatedBy: ['Adrenalina / Noradrenalina (receptores β-adrenérgicos, elevando AMPc y PKA)', 'Glucagón', 'Cortisol y Hormona del Crecimiento (GH)'],
      inhibitedBy: ['Insulina (acción anticatabólica más potente: activa la fosfodiesterasa PDE3B, degradando AMPc y desfosforilando HSL)'],
      mechanismSummary: 'Incluso concentraciones mínimas basales de insulina bastan para inhibir fuertemente la HSL, bloqueando la liberación de ácidos grasos.'
    },
    clinicalRelevance: 'En diabetes tipo 1 no tratada, la falta absoluta de insulina desencadena una lipólisis masiva descontrolada que inunda el hígado con ácidos grasos, disparando la cetogénesis y provocando cetoacidosis.',
    relatedTermIds: ['beta_oxidacion', 'cetogenesis', 'gluconeogenesis'],
    keyMolecules: ['Triglicéridos', 'HSL', 'ATGL', 'Perilipina', 'Albúmina', 'Glicerol'],
    examTip: 'El tejido adiposo no puede fosforilar el glicerol liberado porque carece de glicerol quinasa; todo el glicerol debe viajar al hígado para usarse.'
  },
  {
    id: 'lipogenesis',
    name: 'Lipogénesis de Novo (Síntesis de Ácidos Grasos)',
    nameEn: 'De Novo Lipogenesis',
    category: 'lipidos',
    categoryLabel: 'Lípidos & Cetonas',
    shortDefinition: 'Ruta anabólica de síntesis de ácidos grasos (palmitato 16:0) a partir de exceso de carbohidratos y Acetil-CoA en periodos postprandiales de superávit calórico.',
    detailedExplanation: 'El exceso de glucosa genera Acetil-CoA mitocondrial. Como no cabe en el ciclo de Krebs saciado, se condensa con oxalacetato para formar citrato, que sale al citosol vía lanzadera de citrato. La ATP-citrato liasa rompe el citrato citosólico regenerando Acetil-CoA. La Acetil-CoA Carboxilasa (ACC) carboxila Acetil-CoA a Malonil-CoA con gasto de ATP y biotina. El complejo multifuncional Ácido Graso Sintasa (FAS) ensambla la cadena de 16C usando NADPH.',
    cellularLocation: 'Citosol celular',
    tissueLocation: 'Hígado (principal sitio en humanos, exportando VLDL) y Tejido adiposo',
    keyEnzyme: 'Acetil-CoA Carboxilasa (ACC)',
    keyEnzymeDetails: 'Paso limitante irreversible. Activada por polimerización inducida por Citrato y desfosforilación por Insulina; inhibida por fosforilación por AMPK y Glucagón.',
    energyBalance: 'Consume 7 ATP, 8 Acetil-CoA y 14 NADPH para sintetizar 1 molécula de palmitato.',
    hormonalControl: {
      stimulatedBy: ['Insulina (activa fosfatasa PP2A desfosforilando ACC; induce expresión génica de SREBP-1c)', 'Citrato citosólico alto'],
      inhibitedBy: ['Glucagón y Adrenalina (activan PKA)', 'AMPK (sensor de baja energía)', 'Palmitoil-CoA (retroinhibición por producto)'],
      mechanismSummary: 'La insulina estimula simultáneamente el aporte de citrato y la activación alostérica y covalente de la ACC.'
    },
    clinicalRelevance: 'La lipogénesis de novo hepática, favorecida por el consumo elevado de fructosa y azúcares refinados y por la hiperinsulinemia, aporta ~25% de los triglicéridos hepáticos en la enfermedad hepática esteatósica asociada a disfunción metabólica (MASLD); la principal fuente (~60%) son los AGL del tejido adiposo.',
    relatedTermIds: ['beta_oxidacion', 'via_pentosas_fosfato'],
    keyMolecules: ['Citrato', 'Malonil-CoA', 'Acetil-CoA Carboxilasa', 'FAS', 'NADPH', 'Palmitato'],
    examTip: 'El Malonil-CoA formado durante la lipogénesis actúa inhibiendo a CPT-1, impidiendo que el hígado degrade los ácidos grasos que apenas está sintetizando.'
  },
  {
    id: 'ciclo_krebs',
    name: 'Ciclo de Krebs (Ciclo del Ácido Cítrico / TCA)',
    nameEn: 'Citric Acid Cycle (Krebs Cycle)',
    acronym: 'TCA',
    category: 'nitrogeno_ciclos',
    categoryLabel: 'Ciclos & Nitrógeno',
    shortDefinition: 'Ruta metabólica aerobia central y anfibólica que oxida el grupo acetilo de Acetil-CoA a dos moléculas de CO2, capturando electrones en NADH y FADH2 para la cadena respiratoria.',
    detailedExplanation: 'Comienza con la condensación de Acetil-CoA (2C) y Oxalacetato (4C) por la Citrato Sintasa para generar Citrato (6C). Tras 8 reacciones cíclicas enzimáticas, se regenera el oxalacetato. Pasos reguladores irreversibles: Citrato Sintasa, Isocitrato Deshidrogenasa (marcapasos) y el Complejo α-Cetoglutarato Deshidrogenasa. Además de generar energía, provee precursores biosintéticos (anaplerosis/cataplerosis).',
    cellularLocation: 'Matriz mitocondrial en todas las células con mitocondrias',
    tissueLocation: 'Universal en tejidos aerobios. Ausente en eritrocitos.',
    keyEnzyme: 'Isocitrato Deshidrogenasa (IDH)',
    keyEnzymeDetails: 'Enzima alostérica estimulada por ADP y Ca2+; inhibida potentemente por NADH y ATP.',
    energyBalance: 'Por cada vuelta (1 Acetil-CoA): 3 NADH (➔ ~7.5 ATP) + 1 FADH2 (➔ ~1.5 ATP) + 1 GTP/ATP = ~10 ATP equivalentes.',
    hormonalControl: {
      stimulatedBy: ['Estado de baja carga energética celular (alta relación ADP/ATP y NAD+/NADH)', 'Ca2+ intramitocondrial en contracción muscular activa'],
      inhibitedBy: ['Estado de alta carga energética (alto ATP y alto NADH)', 'Acumulación de succinil-CoA'],
      mechanismSummary: 'Regulado intrínsecamente a nivel alostérico por la disponibilidad de sustrato y el cociente de óxido-reducción celular.'
    },
    clinicalRelevance: 'En el ayuno prolongado, el oxalacetato es drenado masivamente del ciclo de Krebs para sostener la gluconeogénesis hepática, lo que enlentece el ciclo y fuerza el desvío de la Acetil-CoA hacia la cetogénesis.',
    relatedTermIds: ['cetogenesis', 'gluconeogenesis', 'fosforilacion_oxidativa'],
    keyMolecules: ['Oxalacetato', 'Acetil-CoA', 'Citrato', 'Isocitrato Deshidrogenasa', 'Alfa-Cetoglutarato', 'NADH'],
    examTip: 'El ciclo de Krebs requiere oxígeno de forma indirecta: aunque ninguna enzima del ciclo usa O2 molecular, sin oxígeno la cadena respiratoria se detiene, el NADH no se oxida a NAD+ y el ciclo se bloquea por falta de cofactores oxidados.'
  },
  {
    id: 'ciclo_cori',
    name: 'Ciclo de Cori (Lactato - Glucosa)',
    nameEn: 'Cori Cycle (Lactic Acid Cycle)',
    category: 'nitrogeno_ciclos',
    categoryLabel: 'Ciclos & Nitrógeno',
    shortDefinition: 'Ciclo metabólico interorgánico entre tejidos anaerobios (músculo en contracción vigorosa o eritrocitos) y el hígado para reciclar lactato en glucosa.',
    detailedExplanation: 'En el músculo o eritrocito, la glucólisis anaerobia genera piruvato, que se reduce a lactato por la Lactato Deshidrogenasa (LDH muscular) para regenerar NAD+. El lactato se vierte a sangre y es captado por el hígado. En el hepatocito, la LDH hepática reoxida el lactato a piruvato, y la gluconeogénesis lo convierte nuevamente en glucosa libre gastando 6 ATP. La glucosa es vertida al torrente sanguíneo cerrando el ciclo.',
    cellularLocation: 'Citosol muscular/eritrocitario + Matriz mitocondrial y citosol hepáticos',
    tissueLocation: 'Interacción interorgánica: Músculo esquelético / Glóbulos rojos ➔ Sangre ➔ Hígado',
    keyEnzyme: 'Lactato Deshidrogenasa (LDH-M y LDH-H) y Enzimas Gluconeogénicas Hepáticas',
    keyEnzymeDetails: 'Isoenzimas distintas: en músculo favorece la reducción a lactato; en hígado favorece la oxidación a piruvato.',
    energyBalance: 'Coste neto de 4 enlaces de alta energía para el organismo: el músculo gana 2 ATP, pero el hígado gasta 6 equivalentes de ATP en la gluconeogénesis.',
    hormonalControl: {
      stimulatedBy: ['Hipoxia tisular local o ejercicio anaerobio intenso', 'Adrenalina'],
      inhibitedBy: ['Reposo postprandial y disponibilidad suficiente de oxígeno'],
      mechanismSummary: 'Permite reciclar el lactato producido por músculo y eritrocitos, transfiriendo al hígado el coste energético de regenerar la glucosa. Tras el ejercicio, la mayor parte del lactato se oxida directamente (corazón, fibras oxidativas) y el ciclo de Cori recicla una fracción.'
    },
    clinicalRelevance: 'Evita la acidosis láctica metabólica severa. Si el hígado falla (cirrosis o insuficiencia hepática aguda) o hay hipoperfusión grave (shock séptico), el aclaramiento del lactato colapsa y sobreviene acidosis láctica letal.',
    relatedTermIds: ['gluconeogenesis', 'glucolisis', 'ciclo_alanina'],
    keyMolecules: ['Lactato', 'Piruvato', 'Glucosa', 'Lactato Deshidrogenasa (LDH)', 'NAD+/NADH'],
    examTip: 'Balance del ciclo de Cori: el músculo gana 2 ATP por glucosa y el hígado gasta 6; el coste neto para el organismo es de 4 ATP, que el hígado paga con la β-oxidación.'
  },
  {
    id: 'ciclo_alanina',
    name: 'Ciclo Glucosa-Alanina (Ciclo de Cahill)',
    nameEn: 'Glucose-Alanine Cycle (Cahill Cycle)',
    category: 'nitrogeno_ciclos',
    categoryLabel: 'Ciclos & Nitrógeno',
    shortDefinition: 'Ruta interorgánica que transporta nitrógeno amino tóxico desde el músculo al hígado en forma del aminoácido no tóxico alanina, devolviendo glucosa al músculo.',
    detailedExplanation: 'Durante el ayuno o ejercicio intenso, el músculo degrada aminoácidos ramificados (BCAA) para energía. Los grupos amino se transfieren al glutamato y luego al piruvato mediante la Alanina Aminotransferasa (ALT/GPT), formando alanina. La alanina viaja por sangre al hígado, donde la ALT hepática revierte la reacción: el nitrógeno se canaliza hacia el ciclo de la urea y el piruvato se convierte en glucosa mediante gluconeogénesis.',
    cellularLocation: 'Citosol de miocitos y hepatocitos',
    tissueLocation: 'Músculo esquelético ➔ Sangre ➔ Hígado',
    keyEnzyme: 'Alanina Aminotransferasa (ALT / GPT)',
    keyEnzymeDetails: 'Requiere Piridoxal Fosfato (Vitamina B6 / PLP) como cofactor obligatorio para la transferencia del grupo amino.',
    energyBalance: 'El hígado gasta 6 ATP en gluconeogénesis y ATP adicional en sintetizar urea para excretar el amoníaco.',
    hormonalControl: {
      stimulatedBy: ['Cortisol (promueve proteólisis muscular y movilización de aminoácidos)', 'Glucagón', 'Ayuno o estrés'],
      inhibitedBy: ['Insulina (potente inhibidor de la proteólisis muscular y promotora de la síntesis proteica)'],
      mechanismSummary: 'Sincroniza la proteólisis muscular en ayuno con la gluconeogénesis hepática para proveer combustible al cerebro.'
    },
    clinicalRelevance: 'Mantiene la glucemia durante el ayuno prolongado a expensas de la masa muscular. Los niveles séricos de ALT se usan como marcador primario de lesión hepatocelular en clínica.',
    relatedTermIds: ['ciclo_cori', 'ciclo_urea', 'gluconeogenesis'],
    keyMolecules: ['Alanina', 'Piruvato', 'Glutamato', 'ALT / GPT', 'Vitamina B6 (PLP)'],
    examTip: 'La principal diferencia entre el Ciclo de Cori y el Ciclo de Cahill es que el de Cahill transporta nitrógeno (para síntesis de urea) además de carbonos.'
  },
  {
    id: 'ciclo_urea',
    name: 'Ciclo de la Urea (Ciclo de Krebs-Henseleit)',
    nameEn: 'Urea Cycle',
    category: 'nitrogeno_ciclos',
    categoryLabel: 'Ciclos & Nitrógeno',
    shortDefinition: 'Ruta metabólica hepática que detoxifica el ion amonio neurotóxico (NH4+) libre generado por la desaminación de aminoácidos, convirtiéndolo en urea neutra para excreción renal.',
    detailedExplanation: 'Consta de 5 reacciones enzimáticas secuenciales. Las 2 primeras ocurren en la matriz mitocondrial: condensación de NH4+ y HCO3- por la Carbamoil Fosfato Sintetasa I (CPS-1, limitante) y formación de citrulina por la Ornitina Transcarbamilasa (OTC). La citrulina sale al citosol para unirse con aspartato (aporta el 2º átomo de nitrógeno) formando argininosuccinato, que se escinde en fumarato y arginina. La arginasa hidroliza la arginina liberando urea y regenerando ornitina.',
    cellularLocation: 'Compartimentada: Matriz mitocondrial (CPS-1 y OTC) y Citosol (ASS, ASL, Arginasa-1)',
    tissueLocation: 'Hígado exclusivamente (es el único órgano que posee el juego completo de las 5 enzimas, destacando la arginasa hepática)',
    keyEnzyme: 'Carbamoil Fosfato Sintetasa I (CPS-1)',
    keyEnzymeDetails: 'Requiere obligatoriamente N-acetilglutamato (NAG) como activador alostérico esencial.',
    energyBalance: 'Consume 3 moléculas de ATP (4 enlaces de alta energía) por cada molécula de urea sintetizada.',
    hormonalControl: {
      stimulatedBy: ['Dieta hiperproteica prolongada', 'Ayuno severo con proteólisis activa', 'Arginina (activa la NAG-sintasa, sintetizando NAG para encender CPS-1)'],
      inhibitedBy: ['Dieta baja en proteínas', 'Insuficiencia hepática'],
      mechanismSummary: 'Regulada a corto plazo por el nivel de N-acetilglutamato y a largo plazo por inducción de la síntesis de las 5 enzimas del ciclo.'
    },
    clinicalRelevance: 'La deficiencia de enzimas del ciclo de la urea (la más común: OTC ligada al cromosoma X) produce hiperamonemia neonatal grave, con encefalopatía, edema cerebral, letargia, coma y alcalosis respiratoria.',
    relatedTermIds: ['ciclo_alanina', 'ciclo_krebs'],
    keyMolecules: ['Amonio (NH4+)', 'Carbamoil Fosfato', 'Citrulina', 'Ornitina', 'Aspartato', 'Urea', 'N-Acetilglutamato (NAG)'],
    examTip: '¡Perla clínica de examen! La CPS-1 mitocondrial participa en el ciclo de la urea y usa amonio libre; la CPS-2 citosólica participa en la síntesis de novo de pirimidinas y usa glutamina.'
  },
  {
    id: 'via_pentosas_fosfato',
    name: 'Vía de las Pentosas Fosfato (Vía del Fosfogluconato)',
    nameEn: 'Pentose Phosphate Pathway',
    acronym: 'PPP / VPF',
    category: 'glucidos',
    categoryLabel: 'Metabolismo de Glúcidos',
    shortDefinition: 'Ruta citosólica divergente de la glucólisis que genera NADPH para defensas antioxidantes y biosíntesis reductoras, y Ribosa-5-Fosfato para la síntesis de nucleótidos.',
    detailedExplanation: 'Comprende 2 fases: 1) Fase oxidativa (irreversible): la Glucosa-6-Fosfato Deshidrogenasa (G6PDH) oxida G6P generando el primer NADPH; tras la lactonasa, la 6-fosfogluconato deshidrogenasa genera el segundo NADPH y Ribulosa-5-fosfato con desprendimiento de CO2. 2) Fase no oxidativa (reversible): isomerizaciones y transferencias de fragmentos de 2 y 3 carbonos por transcetolasas (requieren pirofosfato de tiamina, TPP / Vit B1) y transaldolasas, interconectando con la glucólisis mediante fructosa-6-P y gliceraldehído-3-P.',
    cellularLocation: 'Citosol celular',
    tissueLocation: 'Eritrocitos (crucial para mantener glutatión reducido contra estrés oxidativo), Hígado, Glándula mamaria lactante, Corteza suprarrenal y Tejido adiposo',
    keyEnzyme: 'Glucosa-6-Fosfato Deshidrogenasa (G6PDH / G6PD)',
    keyEnzymeDetails: 'Paso marcapasos irreversible; fuertemente inhibida por altos niveles de NADPH (retroalimentación por producto).',
    energyBalance: 'No genera ni consume ATP; transforma la energía química de la glucosa en poder reductor (NADPH).',
    hormonalControl: {
      stimulatedBy: ['Insulina (induce la síntesis de G6PDH para soportar la lipogénesis)', 'Aumento de la relación NADP+/NADPH (estrés oxidativo)'],
      inhibitedBy: ['Relación elevada de NADPH/NADP+'],
      mechanismSummary: 'Controlada primordialmente por la demanda citosólica de equivalentes reductores de NADPH.'
    },
    clinicalRelevance: 'Déficit de G6PDH (enzimopatía más frecuente del mundo, ligada al cromosoma X): los eritrocitos no pueden regenerar glutatión reducido frente a estrés oxidativo (habas/favismo, fármacos oxidantes como primaquina o sulfamidas), provocando hemólisis aguda, cuerpos de Heinz y células mordidas.',
    relatedTermIds: ['glucolisis', 'lipogenesis'],
    keyMolecules: ['Glucosa-6-Fosfato', 'G6PDH', 'NADPH', 'Glutatión Reducido (GSH)', 'Ribosa-5-Fosfato', 'Tiamina (TPP)'],
    examTip: 'El NADPH es para síntesis reductoras y protección antioxidante; el NADH es para generar ATP en la cadena respiratoria.'
  },
  {
    id: 'fructosa_2_6_bisfosfato',
    name: 'Fructosa-2,6-Bisfosfato (F-2,6-BP)',
    nameEn: 'Fructose-2,6-Bisphosphate',
    acronym: 'F-2,6-BP',
    category: 'regulacion_hormonas',
    categoryLabel: 'Regulación & Señales',
    shortDefinition: 'Regulador alostérico maestro recíproco de la glucólisis y la gluconeogénesis hepática, sintetizado y degradado por la enzima bifuncional tándem PFK-2/FBPasa-2.',
    detailedExplanation: 'No es un intermediario metabólico de degradación, sino una molécula señal puramente reguladora. Es el activador alostérico más potente de la PFK-1 (acelera la glucólisis incluso con altos niveles de ATP) y simultáneamente el inhibidor alostérico más potente de la FBPasa-1 (apaga la gluconeogénesis). Su concentración intracelular está gobernada por el estado de fosforilación de la enzima bifuncional.',
    cellularLocation: 'Citosol de los hepatocitos',
    tissueLocation: 'Hígado (control sistémico) y Músculo cardíaco',
    keyEnzyme: 'Enzima Bifuncional PFK-2 / FBPasa-2',
    keyEnzymeDetails: 'Un único polipéptido con dos dominios catalíticos opuestos gobernados por un solo residuo de serina fosforilable.',
    energyBalance: 'Modulador alostérico catalítico: previene ciclos fútiles de gasto estéril de ATP entre PFK-1 y FBPasa-1.',
    hormonalControl: {
      stimulatedBy: ['Insulina (activa fosfoproteína fosfatasa, desfosforilando la enzima bifuncional: enciende PFK-2 y eleva F-2,6-BP)'],
      inhibitedBy: ['Glucagón (activa PKA, fosforilando la enzima: inactiva PFK-2 y enciende FBPasa-2, destruyendo F-2,6-BP)'],
      mechanismSummary: 'Glucagón = Enzima fosforilada = PFK-2 apagada = FBPasa-2 encendida = Cae F-2,6-BP = Apaga Glucólisis y Enciende Gluconeogénesis.'
    },
    clinicalRelevance: 'En diabetes descompensada sin insulina, el glucagón predomina manteniendo la F-2,6-BP en niveles basales casi nulos, lo que desinhibe masivamente la gluconeogénesis hepática provocando hiperglucemia intratable.',
    relatedTermIds: ['glucolisis', 'gluconeogenesis', 'insulina_glucagon'],
    keyMolecules: ['PFK-1', 'FBPasa-1', 'PFK-2 / FBPasa-2', 'AMPc', 'PKA', 'Insulina', 'Glucagón'],
    examTip: 'Mnemotecnia clásica: "Fosforilada en ayuno por Glucagón = FBPasa-2 gana, destruye F-2,6-BP y el hígado produce glucosa".'
  },
  {
    id: 'insulina_glucagon',
    name: 'Cociente Insulina / Glucagón (Eje Endocrino Pancreático)',
    nameEn: 'Insulin-to-Glucagon Ratio',
    category: 'regulacion_hormonas',
    categoryLabel: 'Regulación & Señales',
    shortDefinition: 'Interruptor hormonal endocrino maestro que dicta a todos los órganos si el organismo se encuentra en estado anabólico de almacenamiento o catabólico de movilización de combustibles.',
    detailedExplanation: 'Secretadas por los islotes de Langerhans (células β = insulina; células α = glucagón). No importa tanto la concentración absoluta individual como la relación relativa entre ambas. Tras comer carbohidratos, el cociente molar sube (> 10; puede superar 50), activando fosfatasas que desfosforilan enzimas diana (vías de síntesis y almacenamiento). En ayuno, el cociente cae (~2 tras el ayuno nocturno; < 0,5 en el ayuno prolongado), predominando la señal de PKA mediada por AMPc que fosforila enzimas clave (vías de lisis y exportación).',
    cellularLocation: 'Receptores de membrana: Receptor tirosina quinasa (RTK para insulina) vs Receptor acoplado a proteína Gs (GPCR para glucagón)',
    tissueLocation: 'Páncreas endocrino ➔ Vena porta hepática (el hígado recibe la mayor concentración) ➔ Circulación sistémica',
    keyEnzyme: 'Proteína Fosfatasa-1 (PP1, activada por insulina) vs Proteína Quinasa A (PKA, activada por glucagón)',
    keyEnzymeDetails: 'Mecanismo recíproco de fosforilación/desfosforilación reversible sobre serinas y treoninas diana.',
    energyBalance: 'Mantiene la homeostasis glucémica en el estrecho rango fisiológico de 70-100 mg/dL.',
    hormonalControl: {
      stimulatedBy: ['Glucemia elevada y aminoácidos (elevan insulina y reducen glucagón)'],
      inhibitedBy: ['Hipoglucemia, ayuno prolongado y estrés simpático (adrenalina suprime insulina y dispara glucagón)'],
      mechanismSummary: 'La glucosa entra a las células beta (por GLUT1 en humanos; GLUT2 en roedores), genera ATP cerrando canales de K+ dependientes de ATP, despolariza la membrana y dispara exocitosis de insulina por entrada de Ca2+.'
    },
    clinicalRelevance: 'La destrucción autoinmune de células beta en Diabetes Tipo 1 deja un cociente insulina/glucagón permanentemente cercano a cero, induciendo un estado fisiológico de inanición aparente en medio de hiperglucemia severa.',
    relatedTermIds: ['glucogenolisis', 'gluconeogenesis', 'cetogenesis', 'fructosa_2_6_bisfosfato'],
    keyMolecules: ['Insulina', 'Glucagón', 'Células Beta', 'Células Alfa', 'PKA', 'PP1'],
    examTip: 'El glucagón NO tiene receptores funcionales en el músculo esquelético. En el músculo, la señal catabólica equivalente es transmitida por la Adrenalina.'
  },
  {
    id: 'ampk',
    name: 'Proteína Quinasa Activada por AMP (AMPK)',
    nameEn: 'AMP-Activated Protein Kinase',
    acronym: 'AMPK',
    category: 'regulacion_hormonas',
    categoryLabel: 'Regulación & Señales',
    shortDefinition: 'Sensor celular maestro del estado de carga energética que detecta aumentos en la relación AMP/ATP, apagando procesos anabólicos y encendiendo vías generadoras de ATP.',
    detailedExplanation: 'Actúa como el termostato de combustible celular. Cuando la célula consume ATP, la adenilato quinasa convierte 2 ADP en 1 ATP + 1 AMP. Un pequeño descenso de ATP causa un aumento porcentual mucho mayor de AMP. El AMP se une a la subunidad γ de AMPK, provocando un cambio conformacional que permite su fosforilación activadora por LKB1. AMPK fosforila e inactiva a la Acetil-CoA carboxilasa (apaga lipogénesis) y a la HMG-CoA reductasa (apaga colesterol), mientras estimula la translocación de GLUT4 al sarcolema muscular.',
    cellularLocation: 'Citosol y núcleo en todos los tejidos',
    tissueLocation: 'Universal; de máxima relevancia en músculo esquelético, hígado, miocardio y neuronas hipotalámicas',
    keyEnzyme: 'AMPK (Heterotrímero α, β, γ)',
    keyEnzymeDetails: 'Fosforilada en Thr172 por la quinasa corriente arriba LKB1 o CaMKKβ.',
    energyBalance: 'Preserva la supervivencia celular protegiendo a la célula del agotamiento letal de ATP.',
    hormonalControl: {
      stimulatedBy: ['Aumento de AMP y ADP (ejercicio físico, ayuno, hipoxia, estrés mitocondrial)', 'Metformina (fármaco antidiabético)', 'Adiponectina'],
      inhibitedBy: ['Altas concentraciones de ATP', 'Insulina (a través de Akt)'],
      mechanismSummary: 'Apaga vías anabólicas que gastan ATP y activa vías catabólicas que sintetizan ATP.'
    },
    clinicalRelevance: 'La metformina, fármaco de primera línea para la diabetes tipo 2, activa indirectamente a la AMPK al inhibir levemente el complejo I mitocondrial, reduciendo la gluconeogénesis hepática patológica.',
    relatedTermIds: ['beta_oxidacion', 'lipogenesis', 'transportadores_glut'],
    keyMolecules: ['AMP', 'ATP', 'LKB1', 'Metformina', 'GLUT4', 'ACC'],
    examTip: 'El ejercicio activa la translocación de GLUT4 al sarcolema muscular de forma INDEPENDIENTE de la insulina gracias a la activación de la AMPK.'
  },
  {
    id: 'fosforilacion_oxidativa',
    name: 'Fosforilación Oxidativa & Cadena de Transporte de Electrones',
    nameEn: 'Oxidative Phosphorylation & ETC',
    acronym: 'OXPHOS',
    category: 'nitrogeno_ciclos',
    categoryLabel: 'Ciclos & Nitrógeno',
    shortDefinition: 'Proceso mitocondrial donde la transferencia exergónica de electrones desde NADH y FADH2 hacia el O2 bombea protones creando un gradiente que sintetiza la gran mayoría del ATP celular.',
    detailedExplanation: 'Consta de 4 complejos respiratorios multienzimáticos fijos en la membrana mitocondrial interna más 2 transportadores móviles (Coenzima Q / Ubiquinona y Citocromo c). Los complejos I, III y IV bombean protones (H+) desde la matriz hacia el espacio intermembrana, generando un gradiente electroquímico de protones (fuerza protón-motriz). El complejo V (ATP Sintasa F0F1) permite el reingreso de los protones a la matriz, impulsando la síntesis rotacional de ATP a partir de ADP y Pi.',
    cellularLocation: 'Membrana mitocondrial interna (cristas mitocondriales)',
    tissueLocation: 'Todas las células con mitocondrias funcionales. Ausente en eritrocitos.',
    keyEnzyme: 'ATP Sintasa (Complejo V) y Complejos I-IV',
    keyEnzymeDetails: 'Complejo IV (Citocromo c oxidasa) es el aceptor final de electrones donde se reduce el O2 molecular a 2 H2O.',
    energyBalance: 'Cada NADH oxidado bombea 10 H+ produciendo ~2.5 ATP; cada FADH2 entra al complejo II y bombea 6 H+ produciendo ~1.5 ATP.',
    hormonalControl: {
      stimulatedBy: ['Aumento de ADP ("control respiratorio" por aceptor)', 'Hormonas tiroideas (T3/T4 inducen síntesis de componentes mitocondriales)'],
      inhibitedBy: ['Inhibidores de la cadena (Rotenona, Cianuro, Monóxido de Carbono, Azida)', 'Inhibidor de ATP sintasa (Oligomicina)'],
      mechanismSummary: 'Acoplamiento quimiosmótico de Mitchell: el flujo de electrones depende de la disipación del gradiente por la ATP sintasa.'
    },
    clinicalRelevance: 'La intoxicación por cianuro o monóxido de carbono bloquea el complejo IV (citocromo oxidasa), deteniendo el consumo de O2, colapsando el gradiente y causando muerte rápida por asfixia celular metabólica.',
    relatedTermIds: ['ciclo_krebs', 'beta_oxidacion'],
    keyMolecules: ['Complejo I (NADH DH)', 'Ubiquinona (CoQ)', 'Citocromo c', 'Complejo IV', 'ATP Sintasa', 'Oxígeno'],
    examTip: 'Los desacoplantes (como DNP o la termogenina UCP-1 en grasa parda) disipan el gradiente de protones generando calor sin producir ATP.'
  },
  {
    id: 'cuerpos_cetonicos',
    name: 'Cuerpos Cetónicos (Acetoacetato, β-Hidroxibutirato y Acetona)',
    nameEn: 'Ketone Bodies',
    category: 'lipidos',
    categoryLabel: 'Lípidos & Cetonas',
    shortDefinition: 'Tres moléculas hidrosolubles sintetizadas en el hígado que sirven como combustible energético alternativo a la glucosa para tejidos periféricos durante el ayuno.',
    detailedExplanation: 'A diferencia de los ácidos grasos, los cuerpos cetónicos son hidrosolubles y no necesitan ser transportados por la albúmina ni por lipoproteínas, y pueden cruzar fácilmente la barrera hematoencefálica a través de transportadores monocarboxilato (MCT1 y MCT2). El acetoacetato y el β-hidroxibutirato son energéticamente útiles; la acetona es un subproducto volátil que se elimina en gran parte por el aliento y la orina (una fracción se metaboliza).',
    cellularLocation: 'Mitocondria hepática (origen) ➔ Sangre ➔ Mitocondrias periféricas (consumo)',
    tissueLocation: 'Producidos por el hígado. Consumidos por corazón, cerebro, riñón y músculo esquelético.',
    keyEnzyme: 'HMG-CoA Liasa y β-Hidroxibutirato Deshidrogenasa',
    keyEnzymeDetails: 'La relación β-hidroxibutirato / acetoacetato refleja directamente el cociente redox mitocondrial NADH / NAD+.',
    energyBalance: 'Aportan más moles de ATP por gramo de oxígeno consumido que los ácidos grasos de cadena larga.',
    hormonalControl: {
      stimulatedBy: ['Glucagón alto y cortisol en ayuno prolongado (>24-48 horas)'],
      inhibitedBy: ['Insulina (suprime la cetogénesis a concentraciones nanomolares muy bajas)'],
      mechanismSummary: 'Su nivel plasmático pasa de <0.1 mM en estado saciado hasta 3-5 mM en ayuno de varios días y >15-25 mM en cetoacidosis patológica.'
    },
    clinicalRelevance: 'En cetoacidosis diabética, el acetoacetato se descarboxila espontáneamente a acetona volátil, originando el aliento dulce característico a frutas maduras / manzana podrida.',
    relatedTermIds: ['cetogenesis', 'cetolisis', 'cetoacidosis_diabetica'],
    keyMolecules: ['Acetoacetato', 'Beta-Hidroxibutirato', 'Acetona', 'MCT1/MCT2'],
    examTip: 'El β-hidroxibutirato no posee técnicamente un grupo cetona (tiene un hidroxilo), pero se clasifica como cuerpo cetónico por su origen y destino metabólico.'
  },
  {
    id: 'cetoacidosis_diabetica',
    name: 'Cetoacidosis Diabética (CAD)',
    nameEn: 'Diabetic Ketoacidosis',
    acronym: 'CAD / DKA',
    category: 'clinica_patologia',
    categoryLabel: 'Correlación Clínica',
    shortDefinition: 'Emergencia médica endocrina aguda causada por la deficiencia absoluta o relativa severa de insulina y exceso de hormonas contrarreguladoras.',
    detailedExplanation: 'La ausencia de insulina impide la entrada de glucosa a músculo y grasa, activando una lipólisis adipocitaria masiva y gluconeogénesis hepática desenfrenada. El hígado se satura de ácidos grasos y produce cantidades masivas de acetoacetato y β-hidroxibutirato. Como son ácidos orgánicos con pKa ~3.6 (acetoacetato) y ~4.7 (β-hidroxibutirato), a pH 7.4 están casi totalmente disociados en la sangre liberando protones (H+), agotando la reserva de bicarbonato (HCO3-) y causando acidosis metabólica grave.',
    cellularLocation: 'Patología sistémica multi-órgano',
    tissueLocation: 'Páncreas (déficit de secreción), Adipocitos (lipólisis extrema), Hígado (hipercetogénesis) y Riñón (glucosuria osmótica)',
    keyEnzyme: 'Desrepresión de Lipasa Sensible a Hormonas (HSL) y HMG-CoA Sintasa',
    keyEnzymeDetails: 'Colapso total del freno de la insulina.',
    energyBalance: 'Grave desbalance con pérdida masiva de electrolitos (K+, Na+) y agua por diuresis osmótica inducida por glucosuria.',
    hormonalControl: {
      stimulatedBy: ['Estrés infeccioso agudo, infarto o abandono de insulinoterapia en pacientes con DM1'],
      inhibitedBy: ['Administración inmediata de insulina intravenosa, hidratación salina y reposición de potasio'],
      mechanismSummary: 'Insulina nula + Glucagón, Adrenalina y Cortisol sumamente elevados.'
    },
    clinicalRelevance: 'Tríada diagnóstica: Hiperglucemia (>250 mg/dL), Cetonemia positiva (o cetonuria) y Acidosis metabólica con anión gap elevado (pH < 7.30, HCO3- < 18 mEq/L). Presenta respiración de Kussmaul (hiperventilación compensatoria para barrer CO2).',
    relatedTermIds: ['cetogenesis', 'cuerpos_cetonicos', 'lipolisis', 'gluconeogenesis'],
    keyMolecules: ['Glucosa', 'Beta-Hidroxibutirato', 'Bicarbonato', 'Insulina', 'Potasio'],
    examTip: '¡Cuidado con el potasio sérico! Aunque el potasio en sangre parezca normal o elevado por la acidosis, el potasio corporal total está severamente deplecionado.'
  },
  {
    id: 'transportadores_glut',
    name: 'Transportadores de Glucosa (Familia GLUT)',
    nameEn: 'Glucose Transporters (GLUT Family)',
    acronym: 'GLUT',
    category: 'regulacion_hormonas',
    categoryLabel: 'Regulación & Señales',
    shortDefinition: 'Familia de proteínas integrales transmembrana de difusión facilitada que median el transporte pasivo de glucosa a través de las membranas celulares a favor de gradiente.',
    detailedExplanation: 'Cada isoforma tiene cinética (Km) y distribución tisular adaptada a su función fisiológica: GLUT1 (barrera hematoencefálica y eritrocitos, Km baja ~3 mM, captación basal); GLUT2 (hepatocitos, células β pancreáticas, epitelio intestinal y túbulo renal, Km muy alta ~15-20 mM, actúa como sensor de glucosa); GLUT3 (neuronas, Km muy baja ~1.5 mM, máxima afinidad); GLUT4 (músculo estriado y tejido adiposo, el ÚNICO dependiente de insulina para su translocación a membrana).',
    cellularLocation: 'Membrana plasmática y vesículas intracelulares (GLUT4 en reposo)',
    tissueLocation: 'Diferencial según isoforma (GLUT1: eritrocitos/SNC; GLUT2: hígado/páncreas; GLUT3: neuronas; GLUT4: músculo y grasa)',
    keyEnzyme: 'GLUT1 a GLUT4 (transportadores facilitadores uniporte)',
    keyEnzymeDetails: 'No consumen ATP directamente; transporte pasivo bidireccional a favor del gradiente de concentración de glucosa.',
    energyBalance: 'Difusión facilitada energéticamente pasiva.',
    hormonalControl: {
      stimulatedBy: ['Insulina (estimula la vía PI3K/Akt provocando la exocitosis de vesículas con GLUT4 a la membrana celular)', 'Contracción muscular y AMPK (translocan GLUT4 sin necesidad de insulina)'],
      inhibitedBy: ['Endocitosis basal en ausencia de señal de insulina'],
      mechanismSummary: 'En reposo e hipoinsulinemia, el 90% de los transportadores GLUT4 permanecen secuestrados en vesículas intracelulares.'
    },
    clinicalRelevance: 'La resistencia a la insulina en Diabetes Tipo 2 se manifiesta como un fallo en la señalización que impide la movilización de GLUT4 a la membrana, causando hiperglucemia postprandial.',
    relatedTermIds: ['insulina_glucagon', 'ampk', 'glucolisis'],
    keyMolecules: ['GLUT1', 'GLUT2', 'GLUT3', 'GLUT4', 'Akt / PKB', 'Vesículas GSVs'],
    examTip: 'Recuerda: GLUT4 es el ÚNICO transportador de glucosa dependiente de insulina. El cerebro (GLUT1/GLUT3) y el hígado (GLUT2) captan glucosa de forma independiente de insulina.'
  },
  {
    id: 'lanzaderas_mitocondriales',
    name: 'Lanzaderas Mitocondriales (Malato-Aspartato y Glicerol-3-P)',
    nameEn: 'Mitochondrial Shuttles',
    category: 'nitrogeno_ciclos',
    categoryLabel: 'Ciclos & Nitrógeno',
    shortDefinition: 'Sistemas enzimáticos y de transporte que transfieren los electrones del NADH citosólico generado en la glucólisis hacia la matriz mitocondrial para alimentar la cadena respiratoria.',
    detailedExplanation: 'La membrana mitocondrial interna es totalmente impermeable al NADH y NAD+. Por ello se usan lanzaderas: 1) Lanzadera de Malato-Aspartato: el oxalacetato citosólico se reduce a malato consumiendo NADH citosólico; el malato entra por un transportador y se reoxida a oxalacetato generando NADH mitocondrial (rinde ~2.5 ATP). Predomina en hígado, riñón y corazón. 2) Lanzadera de Glicerol-3-Fosfato: la dihidroxiacetona-fosfato citosólica se reduce a glicerol-3-P consumiendo NADH; la glicerol-3-P deshidrogenasa mitocondrial transfiere los electrones a FAD formando FADH2 (rinde ~1.5 ATP). Rápida, predomina en músculo esquelético y cerebro.',
    cellularLocation: 'Citosol + Membrana mitocondrial interna + Matriz mitocondrial',
    tissueLocation: 'Malato-Aspartato en Hígado, Corazón y Riñón; Glicerol-3-P en Músculo esquelético y Cerebro',
    keyEnzyme: 'Malato Deshidrogenasa (Citosólica y Mitocondrial) y Glicerol-3-Fosfato Deshidrogenasa',
    keyEnzymeDetails: 'La lanzadera de malato-aspartato es reversible y altamente eficiente; la de glicerol-3-P es irreversible.',
    energyBalance: 'Determina si la oxidación completa de una molécula de glucosa rinde 32 ATP (vía malato-aspartato) o 30 ATP (vía glicerol-3-P).',
    hormonalControl: {
      stimulatedBy: ['Flujo glucolítico activo y demanda aerobia de ATP'],
      inhibitedBy: ['Ausencia de sustratos intermediarios o hipoxia'],
      mechanismSummary: 'Garantiza la reoxidación del NADH citosólico a NAD+ para no detener la glucólisis.'
    },
    clinicalRelevance: 'Si la lanzadera se bloquea o hay falta de oxígeno, el NADH citosólico solo puede reoxidarse reduciendo piruvato a lactato mediante la LDH, conduciendo a acidosis láctica.',
    relatedTermIds: ['glucolisis', 'fosforilacion_oxidativa', 'ciclo_krebs'],
    keyMolecules: ['Malato', 'Aspartato', 'Oxalacetato', 'Glicerol-3-Fosfato', 'FADH2', 'NADH'],
    examTip: 'La lanzadera de malato-aspartato conserva todo el potencial reductor (NADH ➔ NADH); la de glicerol-3-P pierde parte del potencial (NADH ➔ FADH2).'
  },
  {
    id: 'resistencia_insulina',
    name: 'Resistencia a la Insulina',
    nameEn: 'Insulin Resistance',
    category: 'clinica_patologia',
    categoryLabel: 'Correlación Clínica',
    shortDefinition: 'Disminución de la sensibilidad y respuesta biológica tisular (músculo, hígado y tejido adiposo) a las concentraciones circulantes de insulina.',
    detailedExplanation: 'Fisiopatológicamente se origina por sobrecarga lipídica ectópica (diacilgliceroles y ceramidas en miocitos y hepatocitos) e inflamación subclínica mediada por macrófagos M1 en tejido adiposo. Esto activa quinasas de estrés (JNK, PKCθ, IKKβ) que fosforilan residuos inhibitorios de serina/treonina en el sustrato del receptor de insulina (IRS-1/IRS-2), bloqueando la cascada PI3K/Akt. Como consecuencia, GLUT4 no se trasloca en músculo y la gluconeogénesis no se frena en hígado.',
    cellularLocation: 'Vía de señalización intracelular post-receptor (IRS / PI3K / Akt)',
    tissueLocation: 'Músculo esquelético (70-80% de la captación de glucosa estimulada por insulina en el clamp), Hígado y Tejido adiposo',
    keyEnzyme: 'Fosforilación anómala en serinas de IRS-1 y represión de la cascada Akt',
    keyEnzymeDetails: 'El páncreas responde inicialmente con hiperinsulinemia compensatoria para mantener la euglucemia.',
    energyBalance: 'El organismo permanece en un estado anómalo donde coexisten hiperinsulinemia, hipertrigliceridemia y tendencia a la hiperglucemia.',
    hormonalControl: {
      stimulatedBy: ['Obesidad visceral, sedentarismo, exceso de ácidos grasos saturados y citoquinas inflamatorias (TNF-α, IL-6)'],
      inhibitedBy: ['Ejercicio físico (activa captación de glucosa por AMPK sin requerir insulina), pérdida de peso y fármacos sensibilizadores'],
      mechanismSummary: 'El defecto no suele ser la ausencia de receptores de insulina, sino una alteración en la fosforilación de los intermediarios intracelulares post-receptor.'
    },
    clinicalRelevance: 'Pilar etiopatogénico del Síndrome Metabólico, Diabetes Mellitus Tipo 2, Esteatosis Hepática Metabólica (MASLD) y Síndrome de Ovario Poliquístico (SOP). En la piel se manifiesta clínicamente como Acantosis Nigricans en pliegues.',
    relatedTermIds: ['transportadores_glut', 'insulina_glucagon', 'ampk', 'lipogenesis'],
    keyMolecules: ['Receptor de Insulina', 'IRS-1', 'Akt / PKB', 'GLUT4', 'Ceramidas', 'TNF-alfa'],
    examTip: 'El ejercicio físico revierte agudamente la resistencia a la glucosa muscular porque la AMPK estimula la translocación de GLUT4 por una vía alternativa independiente de IRS-1/Akt.'
  },
  {
    id: 'niveles_regulacion',
    name: 'Niveles de Regulación Metabólica (Escalas Temporales)',
    nameEn: 'Levels of Metabolic Control',
    category: 'regulacion_hormonas',
    categoryLabel: 'Regulación & Señales',
    shortDefinition: 'El flujo de una ruta se controla a tres velocidades: por disponibilidad de sustrato y efectores alostéricos (milisegundos a segundos), por modificación covalente reversible (minutos) y por cambios en la expresión génica (horas a días).',
    detailedExplanation: 'La regulación intracelular combina el efecto de masa de acción (la velocidad depende de la concentración de sustrato) y la modulación alostérica por la carga energética (AMP, ATP, citrato, F-2,6-BP). La regulación intercelular, mediada por hormonas, actúa en dos niveles: la fosforilación y desfosforilación de enzimas clave (cascadas de AMPc/PKA frente a fosfatasas activadas por insulina), en minutos, y la inducción o represión transcripcional de enzimas (PEPCK, glucoquinasa, glucosa-6-fosfatasa, enzimas lipogénicas), que reconfigura la capacidad metabólica en horas o días.',
    cellularLocation: 'Citosol, mitocondria y núcleo (factores de transcripción)',
    tissueLocation: 'Todos los tejidos; especialmente relevante en hígado, músculo y tejido adiposo',
    keyEnzyme: 'PKA, fosfatasas PP1/PP2A, factores de transcripción (CREB, FoxO1, SREBP-1c, ChREBP, receptor de glucocorticoides)',
    keyEnzymeDetails: 'Una misma enzima puede regularse en los tres niveles: la PFK-1 alostéricamente (AMP, ATP, citrato, F-2,6-BP), la PFK-2 covalentemente y la glucoquinasa por inducción génica.',
    hormonalControl: {
      stimulatedBy: ['Insulina (desfosforilación y genes anabólicos)', 'Glucagón y catecolaminas (fosforilación por PKA)', 'Cortisol (inducción génica lenta)'],
      inhibitedBy: ['La señal contraria en cada caso'],
      mechanismSummary: 'Alostérica: ms-s · Covalente: minutos · Genómica: horas-días.'
    },
    clinicalRelevance: 'Explica por qué la respuesta a una comida es inmediata (alostérica y covalente) mientras que la adaptación al ayuno prolongado o a una dieta mantenida requiere días (inducción enzimática).',
    relatedTermIds: ['insulina_glucagon', 'fructosa_2_6_bisfosfato', 'ampk'],
    examTip: 'Si la pregunta habla de "inducción" o "represión" de una enzima, se refiere al nivel genómico; si habla de la forma "a" o "b", al covalente.'
  },
  {
    id: 'amoniogenesis_renal',
    name: 'Amoniogénesis Renal',
    nameEn: 'Renal Ammoniagenesis',
    category: 'nitrogeno_ciclos',
    categoryLabel: 'Ciclos & Nitrógeno',
    shortDefinition: 'Producción de NH4+ a partir de glutamina en el túbulo renal para excretar protones en la orina y regenerar bicarbonato, acoplada a la gluconeogénesis renal.',
    detailedExplanation: 'Ante una carga ácida (cetosis del ayuno prolongado, cetoacidosis, acidosis metabólica crónica), el riñón capta glutamina plasmática. La glutaminasa renal la hidroliza a glutamato y NH4+; la glutamato deshidrogenasa convierte el glutamato en α-cetoglutarato liberando un segundo NH4+. El α-cetoglutarato entra en la gluconeogénesis, proceso que consume protones y genera bicarbonato, que vuelve a la sangre. El NH4+ se secreta a la luz tubular por el intercambiador Na+/H+ (NHE3) y se elimina en la orina.',
    cellularLocation: 'Mitocondria (glutaminasa, glutamato deshidrogenasa) y citosol (PEPCK) del túbulo proximal',
    tissueLocation: 'Riñón (sobre todo túbulo proximal de la corteza)',
    keyEnzyme: 'Glutaminasa renal y glutamato deshidrogenasa',
    keyEnzymeDetails: 'La acidosis induce la glutaminasa y la PEPCK renales.',
    hormonalControl: {
      stimulatedBy: ['Acidosis metabólica', 'Ayuno prolongado', 'Cortisol'],
      inhibitedBy: ['Alcalosis'],
      mechanismSummary: 'Elimina protones sin recargar el ciclo de la urea hepático y aporta glucosa en el ayuno prolongado.'
    },
    clinicalRelevance: 'En la inanición, el riñón llega a aportar hasta el 40-50% de la glucosa y amortigua la carga ácida de los cuerpos cetónicos mediante la excreción de NH4+.',
    relatedTermIds: ['gluconeogenesis', 'ciclo_urea', 'cuerpos_cetonicos'],
    examTip: 'Cada glutamina rinde 2 NH4+ y, al completar la gluconeogénesis, 2 HCO3- nuevos para la sangre.'
  },
  {
    id: 'metabolismo_etanol',
    name: 'Metabolismo Hepático del Etanol',
    nameEn: 'Hepatic Ethanol Metabolism',
    category: 'clinica_patologia',
    categoryLabel: 'Correlación Clínica',
    shortDefinition: 'Oxidación del etanol en el hígado a acetaldehído y acetato, que genera un exceso de NADH y altera el estado redox de la célula.',
    detailedExplanation: 'La alcohol deshidrogenasa (citosólica) oxida el etanol a acetaldehído y la acetaldehído deshidrogenasa (mitocondrial) lo oxida a acetato; ambas reducen NAD+ a NADH. El aumento del cociente NADH/NAD+ desplaza el piruvato hacia lactato y el oxalacetato hacia malato, retirando sustratos de la gluconeogénesis, e inhibe la β-oxidación (3-hidroxiacil-CoA deshidrogenasa) y el ciclo de Krebs. Los ácidos grasos que no se oxidan se reesterifican a triacilgliceroles.',
    cellularLocation: 'Citosol (alcohol deshidrogenasa) y mitocondria (acetaldehído deshidrogenasa)',
    tissueLocation: 'Hígado (sitio principal de oxidación del etanol)',
    keyEnzyme: 'Alcohol deshidrogenasa y acetaldehído deshidrogenasa',
    energyBalance: 'Cada etanol oxidado a acetato produce 2 NADH.',
    hormonalControl: {
      stimulatedBy: ['Consumo de etanol (efecto de masa de acción)'],
      inhibitedBy: ['Disulfiram (inhibe la acetaldehído deshidrogenasa)'],
      mechanismSummary: 'Exceso de NADH → menos gluconeogénesis y β-oxidación → hipoglucemia, acidosis láctica y esteatosis.'
    },
    clinicalRelevance: 'La ingesta de alcohol en ayunas causa hipoglucemia grave al bloquear la gluconeogénesis; el consumo crónico produce esteatosis hepática e hipertrigliceridemia.',
    relatedTermIds: ['gluconeogenesis', 'beta_oxidacion', 'lanzaderas_mitocondriales'],
    examTip: 'Hipoglucemia + lactato alto + esteatosis tras beber en ayunas: piensa en el cociente NADH/NAD+.'
  },
  {
    id: 'cetosis_vs_cad',
    name: 'Cetosis de Ayuno vs. Cetoacidosis Diabética',
    nameEn: 'Starvation Ketosis vs. Diabetic Ketoacidosis',
    category: 'clinica_patologia',
    categoryLabel: 'Correlación Clínica',
    shortDefinition: 'La cetosis del ayuno es una adaptación con cetonemia estable de 4-5 mM y pH normal; la cetoacidosis diabética es una emergencia con cetonemia > 15-20 mM y acidosis grave.',
    detailedExplanation: 'En el ayuno prolongado la insulina residual mantiene un freno parcial sobre la lipólisis y ajusta la cetogénesis al consumo de los tejidos: hacia el décimo día los cuerpos cetónicos alcanzan 4-5 mM, una concentración molar similar a la de la glucosa, y el pH se mantiene ≥ 7.35. En la cetoacidosis diabética la falta absoluta de insulina, con exceso de hormonas contrarreguladoras, deja la lipólisis y la cetogénesis sin control: los cuerpos cetónicos superan 15-20 mM, se agota el bicarbonato (< 15 mEq/L) y el pH cae por debajo de 7.20, con anión gap elevado.',
    cellularLocation: 'Mitocondria hepática (producción) y sangre (acumulación)',
    tissueLocation: 'Tejido adiposo (lipólisis), hígado (cetogénesis) y riñón (excreción)',
    keyEnzyme: 'Lipasa sensible a hormonas y HMG-CoA sintasa mitocondrial',
    hormonalControl: {
      stimulatedBy: ['Cociente insulina/glucagón bajo (ayuno) o nulo (CAD)'],
      inhibitedBy: ['Insulina'],
      mechanismSummary: 'La diferencia la marca la insulina residual: freno parcial (ayuno) frente a ausencia total (CAD).'
    },
    clinicalRelevance: 'Ante una cetonuria intensa, la glucemia, el pH y el bicarbonato distinguen una adaptación fisiológica de una emergencia que requiere fluidos, insulina y potasio.',
    relatedTermIds: ['cetogenesis', 'cuerpos_cetonicos', 'cetoacidosis_diabetica'],
    examTip: 'Cetosis ≠ cetoacidosis: con pH normal y glucemia baja, es ayuno; con pH < 7.30 y glucemia alta, es CAD.'
  },
  {
    id: 'indice_glucemico',
    name: 'Índice Glucémico vs. Densidad Calórica',
    nameEn: 'Glycemic Index vs. Energy Density',
    category: 'clinica_patologia',
    categoryLabel: 'Correlación Clínica',
    shortDefinition: 'El índice glucémico mide cuánto y qué tan rápido sube la glucemia tras un alimento con carbohidratos; la densidad calórica mide cuánta energía aporta cada gramo de alimento.',
    detailedExplanation: 'El índice glucémico (IG) compara el área bajo la curva de glucemia de las 2 horas posteriores a ingerir una cantidad fija de carbohidratos digestibles de un alimento con la que produce la misma cantidad de glucosa pura (IG = 100). Los alimentos de IG alto (≥ 70: arroz hervido, patata, copos de maíz, pan blanco) generan picos rápidos de glucemia e insulina; los de IG bajo (< 50: legumbres) liberan la glucosa de forma progresiva por su fibra soluble y su almidón de lenta digestión. La densidad calórica (kcal/g) es otra magnitud: la mantequilla tiene un IG próximo a 0 porque carece de carbohidratos, pero una densidad calórica muy alta (~7 kcal/g).',
    cellularLocation: 'Concepto nutricional (absorción intestinal y respuesta insulínica)',
    tissueLocation: 'Intestino delgado, hígado y páncreas endocrino',
    keyEnzyme: 'Amilasas, disacaridasas y transportadores SGLT1/GLUT2',
    hormonalControl: {
      stimulatedBy: ['Alimentos de IG alto (elevan la insulina de forma brusca)'],
      inhibitedBy: ['Fibra soluble, grasa y proteína de la comida (enlentecen el vaciado gástrico y la absorción)'],
      mechanismSummary: 'IG = AUC de glucemia del alimento / AUC de glucosa pura × 100.'
    },
    clinicalRelevance: 'El IG es útil para controlar la respuesta insulínica en la diabetes; la densidad calórica determina el balance energético y el control del peso.',
    relatedTermIds: ['insulina_glucagon', 'transportadores_glut', 'glucolisis'],
    examTip: 'Un alimento puede tener IG 0 y ser muy calórico (aceite, mantequilla): no confundas ambos conceptos.'
  }
];
