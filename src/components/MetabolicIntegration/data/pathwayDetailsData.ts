import { DetailedEnzyme, DetailedSubstrate } from '../types/metabolism';

export const DETAILED_ENZYMES: Record<string, DetailedEnzyme> = {
  glucoquinasa: {
    id: 'glucoquinasa',
    name: 'Glucoquinasa (Hexoquinasa IV)',
    abbreviation: 'GK',
    ecNumber: 'EC 2.7.1.2',
    pathway: 'Glucólisis & Sensor Glucémico Hepático',
    compartment: 'Citosol',
    reactionText: 'Glucosa + ATP ➔ Glucosa-6-Fosfato + ADP',
    substrates: ['Glucosa', 'ATP'],
    products: ['Glucosa-6-Fosfato', 'ADP'],
    coenzymes: ['Mg2+'],
    allostericActivators: ['Fructosa-1-Fosfato (libera de la proteína reguladora GKRP)', 'Glucosa alta'],
    allostericInhibitors: ['Fructosa-6-Fosfato (promueve secuestro nuclear por GKRP)'],
    covalentRegulation: 'Inducción transcripcional por Insulina; reprimida por Glucagón.',
    clinicalRelevance: 'Posee una Km elevada (~10 mM / 180 mg/dL) y no sufre inhibición por su producto (G6P), lo que permite al hígado captar glucosa en proporción directa a la glucemia portal. Mutaciones causan MODY-2 (hiperglucemia de inicio juvenil).'
  },

  pfk1: {
    id: 'pfk1',
    name: 'Fosfofructoquinasa-1',
    abbreviation: 'PFK-1',
    ecNumber: 'EC 2.7.1.11',
    pathway: 'Glucólisis (Paso Limitante Principal)',
    compartment: 'Citosol',
    reactionText: 'Fructosa-6-Fosfato + ATP ➔ Fructosa-1,6-Bisfosfato + ADP',
    substrates: ['Fructosa-6-Fosfato', 'ATP'],
    products: ['Fructosa-1,6-Bisfosfato', 'ADP'],
    coenzymes: ['Mg2+'],
    allostericActivators: ['Fructosa-2,6-Bisfosfato (el más potente)', 'AMP', 'ADP'],
    allostericInhibitors: ['ATP (a altas concentraciones)', 'Citrato', 'Protones (pH ácido)'],
    covalentRegulation: 'Regulada indirectamente a través de PFK-2/FBPasa-2 (desfosforilada por PP2A tras la señal de insulina = activa PFK-2 = sube F-2,6-BP).',
    clinicalRelevance: 'Paso irreversible que compromete la glucosa a la degradación glucolítica. En el músculo durante el ejercicio intenso, el aumento de AMP supera la inhibición por ATP acelerando la vía 100 veces.'
  },

  fbpase1: {
    id: 'fbpase1',
    name: 'Fructosa-1,6-Bisfosfatasa-1',
    abbreviation: 'FBPasa-1',
    ecNumber: 'EC 3.1.3.11',
    pathway: 'Gluconeogénesis (Paso Regulador)',
    compartment: 'Citosol',
    reactionText: 'Fructosa-1,6-Bisfosfato + H2O ➔ Fructosa-6-Fosfato + Pi',
    substrates: ['Fructosa-1,6-Bisfosfato', 'H2O'],
    products: ['Fructosa-6-Fosfato', 'Fosfato inorgánico (Pi)'],
    coenzymes: ['Mg2+'],
    allostericActivators: ['ATP', 'Citrato'],
    allostericInhibitors: ['Fructosa-2,6-Bisfosfato', 'AMP'],
    covalentRegulation: 'Inhibida en estado postprandial cuando la insulina eleva F-2,6-BP. Activa en ayunas cuando el glucagón destruye F-2,6-BP.',
    clinicalRelevance: 'Enzima clave para la producción endógena de glucosa. El déficit congénito causa hipoglucemia grave y acidosis láctica tras períodos breves de ayuno.'
  },

  piruvato_quinasa: {
    id: 'piruvato_quinasa',
    name: 'Piruvato Quinasa Hepática (PK-L)',
    abbreviation: 'PK',
    ecNumber: 'EC 2.7.1.40',
    pathway: 'Glucólisis',
    compartment: 'Citosol',
    reactionText: 'Fosfoenolpiruvato + ADP ➔ Piruvato + ATP',
    substrates: ['Fosfoenolpiruvato (PEP)', 'ADP'],
    products: ['Piruvato', 'ATP'],
    coenzymes: ['Mg2+', 'K+'],
    allostericActivators: ['Fructosa-1,6-Bisfosfato (feed-forward)'],
    allostericInhibitors: ['ATP', 'Acetil-CoA', 'Alanina'],
    covalentRegulation: 'Fosforilada e inactivada por PKA (Glucagón) para no competir con la gluconeogénesis; desfosforilada y activa por PP2A (Insulina).',
    clinicalRelevance: 'El control covalente previene el ciclo fútil entre fosfoenolpiruvato y piruvato durante el ayuno.'
  },

  pdh: {
    id: 'pdh',
    name: 'Complejo Piruvato Deshidrogenasa',
    abbreviation: 'PDH',
    ecNumber: 'EC 1.2.4.1 / Complejo',
    pathway: 'Conexión Glucólisis - Ciclo de Krebs',
    compartment: 'Mitocondria',
    reactionText: 'Piruvato + CoA-SH + NAD+ ➔ Acetil-CoA + CO2 + NADH + H+',
    substrates: ['Piruvato', 'Coenzima A', 'NAD+'],
    products: ['Acetil-CoA', 'CO2', 'NADH'],
    coenzymes: ['Pirofosfato de Tiamina (TPP/B1)', 'Lipoamida', 'FAD', 'NAD+', 'CoA-SH'],
    allostericActivators: ['Piruvato', 'ADP', 'Ca2+ (en músculo por contracción)', 'NAD+'],
    allostericInhibitors: ['Acetil-CoA', 'NADH', 'ATP'],
    covalentRegulation: 'Fosforilada e inactivada por PDH Quinasa (PDK); desfosforilada y activa por PDH Fosfatasa (estimulada por Insulina y Ca2+).',
    clinicalRelevance: 'Paso irreversible en humanos: la glucosa puede convertirse en grasa, pero los ácidos grasos (vía Acetil-CoA) no pueden convertirse netamente en glucosa. El déficit de tiamina (B1) bloquea la PDH causando Beriberi y encefalopatía de Wernicke.'
  },

  glucogeno_sintasa: {
    id: 'glucogeno_sintasa',
    name: 'Glucógeno Sintasa',
    abbreviation: 'GS',
    ecNumber: 'EC 2.4.1.11',
    pathway: 'Glucogenogénesis',
    compartment: 'Citosol',
    reactionText: 'UDP-Glucosa + Glucógeno (n) ➔ UDP + Glucógeno (n+1)',
    substrates: ['UDP-Glucosa', 'Glucógeno'],
    products: ['UDP', 'Glucógeno polimerizado en enlaces α-1,4'],
    coenzymes: [],
    allostericActivators: ['Glucosa-6-Fosfato (potente activador en músculo e hígado)'],
    allostericInhibitors: ['ATP bajo / Glucógeno saturado'],
    covalentRegulation: 'Desfosforilada a la forma GS-a (activa) por la Proteína Fosfatasa-1 (PP1, estimulada por Insulina); fosforilada a GS-b (inactiva) por GSK-3 y PKA.',
    clinicalRelevance: 'Enzima central de almacenamiento posprandial. En resistencia a la insulina, su activación en músculo esquelético se encuentra severamente mermada.'
  },

  glucogeno_fosforilasa: {
    id: 'glucogeno_fosforilasa',
    name: 'Glucógeno Fosforilasa Hepática',
    abbreviation: 'GP',
    ecNumber: 'EC 2.4.1.1',
    pathway: 'Glucogenólisis',
    compartment: 'Citosol',
    reactionText: 'Glucógeno (n) + Pi ➔ Glucógeno (n-1) + Glucosa-1-Fosfato',
    substrates: ['Glucógeno', 'Fosfato inorgánico (Pi)'],
    products: ['Glucosa-1-Fosfato'],
    coenzymes: ['Fosfato de Piridoxal (PLP / Vitamina B6)'],
    allostericActivators: ['AMP (en músculo)', 'Fosforilación covalente'],
    allostericInhibitors: ['Glucosa libre (en hígado, actúa como sensor)', 'ATP', 'Glucosa-6-P'],
    covalentRegulation: 'Fosforilada a GP-a (activa) por la Fosforilasa Quinasa (activada por Glucagón, Adrenalina y Ca2+); desfosforilada por PP1.',
    clinicalRelevance: 'Principal fuente de glucosa en las primeras horas postabsortivas (~50-60% tras una noche de ayuno de 12-14 h; el resto procede de la gluconeogénesis). En el hígado, la glucosa libre se une a GP-a forzando su inactivación inmediata.'
  },

  acc: {
    id: 'acc',
    name: 'Acetil-CoA Carboxilasa',
    abbreviation: 'ACC',
    ecNumber: 'EC 6.4.1.2',
    pathway: 'Lipogénesis de Novo (Paso Limitante)',
    compartment: 'Citosol',
    reactionText: 'Acetil-CoA + HCO3- + ATP ➔ Malonil-CoA + ADP + Pi',
    substrates: ['Acetil-CoA', 'HCO3-', 'ATP'],
    products: ['Malonil-CoA', 'ADP', 'Pi'],
    coenzymes: ['Biotina (Vitamina B7)'],
    allostericActivators: ['Citrato (promueve la polimerización en filamentos activos)'],
    allostericInhibitors: ['Palmitoil-CoA (producto final)', 'Acil-CoA de cadena larga'],
    covalentRegulation: 'Desfosforilada y activa por PP2A (Insulina); fosforilada e inactiva por AMPK y PKA (Glucagón/Adrenalina).',
    clinicalRelevance: 'Sintetiza Malonil-CoA, el cual no solo es el sustrato para la síntesis de ácidos grasos sino también el inhibidor maestro de la entrada mitocondrial de lípidos (CPT-1).'
  },

  cpt1: {
    id: 'cpt1',
    name: 'Carnitina Palmitoiltransferasa 1',
    abbreviation: 'CPT-1',
    ecNumber: 'EC 2.3.1.21',
    pathway: 'Beta-Oxidación (Paso Limitante)',
    compartment: 'Membrana Mitocondrial Externa',
    reactionText: 'Acil-CoA + Carnitina ➔ Acil-Carnitina + CoA-SH',
    substrates: ['Acil-CoA graso', 'L-Carnitina'],
    products: ['Acil-Carnitina', 'Coenzima A libre'],
    coenzymes: [],
    allostericActivators: ['Ausencia de Malonil-CoA'],
    allostericInhibitors: ['Malonil-CoA (inhibición alostérica hipersensible)'],
    covalentRegulation: 'Regulada alostéricamente por el nivel citosólico de Malonil-CoA determinado por la actividad de la ACC.',
    clinicalRelevance: 'Compuerta de entrada a la beta-oxidación. En la cetoacidosis diabética, la caída de malonil-CoA deja a CPT-1 abierta al 100%, inundando la mitocondria de ácidos grasos y disparando la cetogénesis.'
  },

  hmgcs_mitocondrial: {
    id: 'hmgcs_mitocondrial',
    name: 'HMG-CoA Sintasa Mitocondrial',
    abbreviation: 'mHMGCS',
    ecNumber: 'EC 2.3.3.10',
    pathway: 'Cetogénesis Hepática',
    compartment: 'Mitocondria',
    reactionText: 'Acetoacetil-CoA + Acetil-CoA + H2O ➔ HMG-CoA + CoA-SH',
    substrates: ['Acetoacetil-CoA', 'Acetil-CoA', 'H2O'],
    products: ['3-Hidroxi-3-Metilglutaril-CoA (HMG-CoA)', 'CoA-SH'],
    coenzymes: [],
    allostericActivators: ['Acumulación de Acetil-CoA mitocondrial'],
    allostericInhibitors: ['Succinil-CoA (succinilación inhibitoria)'],
    covalentRegulation: 'Desacetilada y activada por SIRT3 mitocondrial durante el ayuno.',
    clinicalRelevance: 'Enzima limitante de la cetogénesis, expresada casi exclusivamente en el hígado (también en el epitelio del colon). Provee cuerpos cetónicos para cerebro, corazón y músculo durante el ayuno prolongado.'
  },

  pepck: {
    id: 'pepck',
    name: 'Fosfoenolpiruvato Carboxiquinasa',
    abbreviation: 'PEPCK',
    ecNumber: 'EC 4.1.1.32',
    pathway: 'Gluconeogénesis',
    compartment: 'Citosol',
    reactionText: 'Oxaloacetato + GTP ➔ Fosfoenolpiruvato + GDP + CO2',
    substrates: ['Oxaloacetato', 'GTP'],
    products: ['Fosfoenolpiruvato (PEP)', 'GDP', 'CO2'],
    coenzymes: ['Mg2+'],
    allostericActivators: ['Control transcripcional primario'],
    allostericInhibitors: [],
    covalentRegulation: 'Inducción de su gen por Glucagón (vía AMPc/CREB) y Cortisol; represión por Insulina (vía FOXO1).',
    clinicalRelevance: 'En la resistencia hepática a la insulina, fracasa la represión de FOXO1, provocando sobreexpresión de PEPCK e hiperglucemia matutina en ayunas.'
  },

  hsl: {
    id: 'hsl',
    name: 'Lipasa Sensible a Hormonas',
    abbreviation: 'HSL',
    ecNumber: 'EC 3.1.1.79',
    pathway: 'Lipólisis Adipocitaria',
    compartment: 'Citosol / Gota Lipídica',
    reactionText: 'Diacilglicerol + H2O ➔ Monoacilglicerol + Ácido Graso Libre',
    substrates: ['Diacilglicerol (DAG)', 'Triglicéridos (secundario)'],
    products: ['Monoacilglicerol (MAG)', 'Ácido Graso Libre'],
    coenzymes: [],
    allostericActivators: ['Perilipina fosforilada'],
    allostericInhibitors: [],
    covalentRegulation: 'Fosforilada y activa por PKA (Glucagón y Adrenalina); desfosforilada e inactiva por PP1 y fosfodiesterasa inducidas por Insulina.',
    clinicalRelevance: 'Motor de la liberación de ácidos grasos hacia la sangre. En ayunas o ejercicio, sus productos (AGL y glicerol) alimentan la beta-oxidación muscular y la gluconeogénesis hepática.'
  }
};

export const DETAILED_SUBSTRATES: Record<string, DetailedSubstrate> = {
  glucosa: {
    id: 'glucosa',
    name: 'Glucosa',
    formula: 'C6H12O6',
    role: 'Monosacárido hexagonal universal y combustible primario del cerebro y eritrocitos.',
    compartment: 'Circulación Sanguínea',
    anabolicFate: 'Glucogenogénesis (hígado y músculo), Lipogénesis de novo (triglicéridos) y vía de las pentosas (ribosa y NADPH).',
    catabolicFate: 'Glucólisis completa a Piruvato -> Acetil-CoA -> Ciclo de Krebs (30-32 ATP) o fermentación a Lactato (2 ATP).',
    allostericRole: 'En el hepatocito se une alostéricamente a la Glucógeno Fosforilasa-a, forzando su desfosforilación para detener la glucogenólisis.',
    associatedEnzymes: ['Glucoquinasa', 'Hexoquinasa', 'SGLT1', 'GLUT2', 'GLUT4', 'Glucosa-6-Fosfatasa']
  },

  g6p: {
    id: 'g6p',
    name: 'Glucosa-6-Fosfato',
    formula: 'C6H13O9P (G6P)',
    role: 'Encrucijada metabólica intracelular: una vez fosforilada, la glucosa no puede abandonar la célula.',
    compartment: 'Citosol',
    anabolicFate: 'Glucogenogénesis (vía Glucosa-1-P -> UDP-Glucosa) o Vía de las Pentosas Fosfato (vía G6PD para NADPH).',
    catabolicFate: 'Glucólisis (vía Fosfoglucosa Isomerasa -> Fructosa-6-P).',
    allostericRole: 'Inhibe a la Hexoquinasa I-III por retroalimentación; activa alostéricamente a la Glucógeno Sintasa muscular.',
    associatedEnzymes: ['Hexoquinasa', 'Glucoquinasa', 'Glucosa-6-Fosfatasa', 'G6PD', 'Fosfoglucomutasa']
  },

  f26bp: {
    id: 'f26bp',
    name: 'Fructosa-2,6-Bisfosfato',
    formula: 'C6H14O12P2 (F-2,6-BP)',
    role: 'El regulador alostérico más potente del metabolismo de carbohidratos (no es un intermediario glucolítico directo).',
    compartment: 'Citosol',
    anabolicFate: 'Sintetizada a partir de Fructosa-6-P por la quinasa PFK-2 bajo estímulo de insulina.',
    catabolicFate: 'Degradada a Fructosa-6-P por la fosfatasa FBPasa-2 bajo estímulo de glucagón.',
    allostericRole: 'Activa potentemente a PFK-1 (glucólisis) e inhibe enérgicamente a FBPasa-1 (gluconeogénesis). Determina si el hígado quema o produce glucosa.',
    associatedEnzymes: ['PFK-2 / FBPasa-2 (enzima tándem bifuncional)', 'PFK-1', 'FBPasa-1']
  },

  piruvato: {
    id: 'piruvato',
    name: 'Piruvato',
    formula: 'C3H3O3- (α-cetoácido de 3C)',
    role: 'Punto de confluencia entre carbohidratos, aminoácidos y metabolismo mitocondrial.',
    compartment: 'Citosol',
    anabolicFate: 'Gluconeogénesis (carboxilado a oxaloacetato por Piruvato Carboxilasa) o Transaminación a Alanina (ALT).',
    catabolicFate: 'Descarboxilación oxidativa a Acetil-CoA (PDH para ciclo de Krebs) o Fermentación a Lactato (LDH).',
    allostericRole: 'Inhibe a la PDH Quinasa, manteniendo el complejo PDH activo cuando el piruvato abunda.',
    associatedEnzymes: ['Piruvato Quinasa', 'PDH', 'Piruvato Carboxilasa', 'LDH', 'Alanina Aminotransferasa']
  },

  lactato: {
    id: 'lactato',
    name: 'Lactato',
    formula: 'C3H5O3-',
    role: 'Moneda de intercambio redox interorgánico y producto terminal de la glucólisis anaeróbica.',
    compartment: 'Circulación Sanguínea',
    anabolicFate: 'Ciclo de Cori: transportado al hígado para regenerar glucosa consumiendo 6 ATP.',
    catabolicFate: 'Oxidado a piruvato en el miocardio y fibras musculares lentas para generar ATP aeróbico.',
    allostericRole: 'Intercambio rápido vía transportadores MCT1/MCT4 acoplados a protones.',
    associatedEnzymes: ['Lactato Deshidrogenasa (LDH-A / LDH-B)', 'MCT1', 'MCT4']
  },

  acetil_coa: {
    id: 'acetil_coa',
    name: 'Acetil-Coenzima A',
    formula: 'C23H38N7O17P3S (Acetil-CoA)',
    role: 'Centro neurálgico universal del catabolismo oxidativo y donante de grupos acetilo de 2 carbonos.',
    compartment: 'Mitocondria',
    anabolicFate: 'Lipogénesis de novo (tras salir al citosol como citrato) o Cetogénesis (acetoacetato y β-hidroxibutirato).',
    catabolicFate: 'Entrada al Ciclo de Krebs (se condensa con oxaloacetato para formar citrato).',
    allostericRole: 'Inhibidor alostérico de PDH; activador alostérico obligatorio de la Piruvato Carboxilasa.',
    associatedEnzymes: ['PDH', 'Citrato Sintasa', 'ACC', 'mHMG-CoA Sintasa', 'Tiolasa']
  },

  malonil_coa: {
    id: 'malonil_coa',
    name: 'Malonil-CoA',
    formula: 'C24H38N7O19P3S',
    role: 'Sensor de abundancia de carbohidratos y el interruptor recíproco entre síntesis y quema de grasas.',
    compartment: 'Citosol',
    anabolicFate: 'Sustrato de la Ácido Graso Sintasa (FAS) para la elongación de la cadena de palmitato.',
    catabolicFate: 'Descarboxilación a Acetil-CoA por malonil-CoA descarboxilasa.',
    allostericRole: 'Inhibe alostéricamente a CPT-1 a concentraciones micromolares, impidiendo que la célula queme grasas mientras sintetiza lípidos.',
    associatedEnzymes: ['Acetil-CoA Carboxilasa (ACC)', 'Ácido Graso Sintasa (FAS)', 'CPT-1']
  },

  oxaloacetato: {
    id: 'oxaloacetato',
    name: 'Oxaloacetato (OAA)',
    formula: 'C4H2O5(2-)',
    role: 'Aceptor de 4 carbonos en el Ciclo de Krebs y sustrato intermedio gluconeogénico.',
    compartment: 'Mitocondria',
    anabolicFate: 'Gluconeogénesis (transformado en fosfoenolpiruvato por PEPCK tras salir vía lanzadera de malato/aspartato).',
    catabolicFate: 'Condensación con Acetil-CoA para formar Citrato en el Ciclo de Krebs.',
    allostericRole: 'Cuando el oxaloacetato se desvía masivamente a la gluconeogénesis, el acetil-CoA se desvía obligatoriamente a cetogénesis.',
    associatedEnzymes: ['Citrato Sintasa', 'Piruvato Carboxilasa', 'Malato Deshidrogenasa', 'PEPCK']
  },

  beta_hidroxibutirato: {
    id: 'beta_hidroxibutirato',
    name: 'β-Hidroxibutirato',
    formula: 'C4H7O3- (Cuerpo cetónico principal)',
    role: 'Combustible soluble transportable sintetizado por el hígado para sostener el cerebro y corazón en el ayuno.',
    compartment: 'Circulación Sanguínea',
    anabolicFate: 'Ceto-adaptación neurológica: reemplaza hasta el 70% de la glucosa cerebral.',
    catabolicFate: 'Cetólisis en mitocondrias de tejidos extrahepáticos (convertido a Acetoacetato y luego a 2 Acetil-CoA).',
    allostericRole: 'Actúa también como molécula de señalización epigenética inhibiendo desacetilasas de histonas (HDACs).',
    associatedEnzymes: ['β-Hidroxibutirato Deshidrogenasa (BDH1)', 'Tioforasa (SCOT)', 'mHMG-CoA Sintasa']
  },

  citrato: {
    id: 'citrato',
    name: 'Citrato',
    formula: 'C6H5O7(3-)',
    role: 'Primer intermediario del ciclo de Krebs y lanzadera de unidades de 2 carbonos hacia el citosol.',
    compartment: 'Mitocondria',
    anabolicFate: 'Exportado al citosol vía transportador de tricarboxilatos y escindido por ATP Citrato Liasa en Acetil-CoA y Oxaloacetato para lipogénesis.',
    catabolicFate: 'Isomerizado a Isocitrato en el ciclo de Krebs (Aconitasa).',
    allostericRole: 'En el citosol, activa alostéricamente a la Acetil-CoA Carboxilasa (ACC) e inhibe alostéricamente a PFK-1.',
    associatedEnzymes: ['Citrato Sintasa', 'Aconitasa', 'ATP Citrato Liasa', 'ACC', 'PFK-1']
  }
};
