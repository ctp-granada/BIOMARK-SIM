import {
  MetabolicState,
  MetabolicStateId,
  OrganId,
  BiochemicalPathwayModel,
  ClinicalCaseQuestion
} from '../types/metabolism';

export const METABOLIC_STATES: Record<MetabolicStateId, MetabolicState> = {
  "postprandial": {
    "id": "postprandial",
    "title": "Estado Postprandial (Absortivo)",
    "subtitle": "0 a 4 horas tras la ingesta equilibrada de nutrientes",
    "category": "Fisiológico Normal",
    "timeframe": "0 - 4 horas",
    "summary": "Predominio anabólico inducido por hiperinsulinemia e inhibición de glucagón. Almacenamiento activo de glucosa en forma de glucógeno (hígado y músculo) y síntesis de triglicéridos en tejido adiposo y hepático (VLDL).",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "muy_elevado",
        "valueText": "80 - 120 μU/mL",
        "percent": 92,
        "color": "#059669",
        "sourceOrgan": "Células β de islotes pancreáticos",
        "primaryAction": "Activa fosfatasas (PP1), transloca GLUT4 en músculo y adipocitos, induce glucoquinasa y enzimas lipogénicas."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "bajo",
        "valueText": "30 - 50 pg/mL",
        "percent": 20,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas",
        "primaryAction": "Inhibido por la hiperglucemia e insulina paracrina (los aminoácidos de una comida mixta limitan su descenso); cascada de AMPc/PKA silenciada."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "bajo",
        "valueText": "Basal (< 50 pg/mL)",
        "percent": 10,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal",
        "primaryAction": "Sin estímulo adrenérgico en reposo posprandial."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "normal",
        "valueText": "Nivel circadiano normal (~8-12 μg/dL)",
        "percent": 25,
        "color": "#6366f1",
        "sourceOrgan": "Corteza suprarrenal",
        "primaryAction": "Rol permisivo no inductor de catabolismo."
      },
      "ampkActivity": {
        "status": "baja",
        "description": "La abundancia de ATP intracelular mantiene la AMPK inactiva.",
        "percent": 10
      },
      "igRatio": {
        "ratio": 50,
        "text": "Muy elevado (~50, molar)",
        "state": "muy_alto"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "135 - 150 mg/dL",
        "normalRange": "70 - 99 mg/dL (ayuno)",
        "status": "elevado",
        "unit": "mg/dL",
        "description": "Absorción masiva intestinal que supera el aclaramiento hepático inicial."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "0.10 - 0.25 mM",
        "normalRange": "0.3 - 0.6 mM",
        "status": "muy_disminuido",
        "unit": "mM",
        "description": "Lipólisis fuertemente suprimida en el tejido adiposo por la insulina."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos",
        "valueText": "< 0.05 mM (Trazas)",
        "normalRange": "< 0.2 mM",
        "status": "muy_disminuido",
        "unit": "mM",
        "description": "Cetogénesis totalmente apagada por malonil-CoA que bloquea CPT-1."
      },
      {
        "id": "lactate",
        "name": "Lactato",
        "valueText": "1.0 - 1.2 mM",
        "normalRange": "0.5 - 1.5 mM",
        "status": "normal",
        "unit": "mM",
        "description": "Producción basal constante por eritrocitos y médula renal."
      },
      {
        "id": "vldl_chylomicrons",
        "name": "Quilomicrones y VLDL",
        "valueText": "Elevados en circulación",
        "normalRange": "Triglicéridos < 150 mg/dL",
        "status": "muy_elevado",
        "unit": "mg/dL",
        "description": "Quilomicrones transportan grasas de la dieta; el hígado sintetiza y exporta VLDL."
      },
      {
        "id": "amino_acids",
        "name": "Aminoácidos Circulantes",
        "valueText": "Elevados (BCAA y glutamina)",
        "normalRange": "Normal",
        "status": "elevado",
        "unit": "μmol/L",
        "description": "Captados por hígado (desaminación/síntesis proteica) y músculo (BCAA vía mTOR)."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Digestión y absorción masiva de nutrientes; secreción de incretinas.",
        "primaryFuelUsed": "Glutamina y glucosa luminal",
        "fuelProducedOrExported": "Glucosa (SGLT1/GLUT2), Aminoácidos, Quilomicrones (linfa)",
        "keyEnzymes": [
          {
            "name": "SGLT1 / GLUT2",
            "abbreviation": "SGLT1/GLUT2",
            "pathway": "Transporte de Carbohidratos",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "Transporte activo secundario con Na+ (SGLT1) y difusión facilitada a sangre (GLUT2)."
          },
          {
            "name": "ApoB-48 Microsomal TG Transfer Protein",
            "abbreviation": "MTP / ApoB48",
            "pathway": "Empaquetamiento Lipídico",
            "cellularLocation": "Retículo Endoplásmico",
            "status": "muy_activa",
            "mechanism": "Ensambla triglicéridos exógenos en quilomicrones hacia los quilíferos linfáticos."
          }
        ],
        "activePathways": [
          "Absorción de monosacáridos",
          "Ensamblaje de quilomicrones",
          "Secreción de GLP-1 y GIP"
        ],
        "inhibitedPathways": [
          "Autofagia intestinal"
        ],
        "transportersActive": [
          "SGLT1",
          "GLUT2",
          "GLUT5",
          "Pept1"
        ],
        "physiologicalNote": "Las incretinas (GLP-1 y GIP) aumentan la secreción de insulina antes de que la glucemia alcance su pico.",
        "atpGenerationStrategy": "Metabolismo parcial de glutamina y glucosa de la luz intestinal."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Hub central de distribución y amortiguador metabólico posprandial.",
        "primaryFuelUsed": "Exceso de Glucosa y Aminoácidos",
        "fuelProducedOrExported": "VLDL (triglicéridos endógenos), Proteínas plasmáticas (Albúmina)",
        "keyEnzymes": [
          {
            "name": "Glucoquinasa (Hexoquinasa IV)",
            "abbreviation": "GK",
            "pathway": "Glucólisis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Alta Km (baja afinidad, no se satura a 150 mg/dL); translocada desde el núcleo por la fructosa-1-P e insulina.",
            "allostericModulators": {
              "activators": [
                "Insulina",
                "Glucosa"
              ],
              "inhibitors": [
                "GKRP"
              ]
            }
          },
          {
            "name": "Fosfofructoquinasa-2 / Fructosa-2,6-Bisfosfatasa",
            "abbreviation": "PFK-2",
            "pathway": "Regulación Glucolítica",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Desfosforilada por PP2A -> activa la quinasa -> sintetiza F-2,6-BP (el activador alostérico más potente de PFK-1)."
          },
          {
            "name": "Glucógeno Sintasa",
            "abbreviation": "GS",
            "pathway": "Glucogenogénesis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Desfosforilada a la forma GS-a (activa) por la proteína fosfatasa-1 (PP1)."
          },
          {
            "name": "Acetil-CoA Carboxilasa",
            "abbreviation": "ACC",
            "pathway": "Lipogénesis de Novo",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Desfosforilada y polimerizada activamente por citrato e insulina. Produce Malonil-CoA."
          },
          {
            "name": "Carnitina Palmitoiltransferasa 1",
            "abbreviation": "CPT-1",
            "pathway": "Beta-Oxidación",
            "cellularLocation": "Mitocondria",
            "status": "inhibida",
            "mechanism": "Bloqueada por el Malonil-CoA citosólico producido por la ACC. Impide la entrada de ácidos grasos a la mitocondria."
          }
        ],
        "activePathways": [
          "Glucogenogénesis",
          "Glucólisis",
          "Lipogénesis de novo (DNL)",
          "Vía de las Pentosas Fosfato (NADPH)",
          "Síntesis de VLDL"
        ],
        "inhibitedPathways": [
          "Gluconeogénesis",
          "Glucogenólisis",
          "Beta-oxidación",
          "Cetogénesis"
        ],
        "transportersActive": [
          "GLUT2 (bidireccional, alta capacidad)"
        ],
        "physiologicalNote": "En posprandio la producción hepática de glucosa se suprime casi por completo y el hígado capta alrededor de un tercio de la glucosa ingerida.",
        "atpGenerationStrategy": "Glucólisis aeróbica completa y oxidación de aminoácidos excedentes."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético",
        "emoji": "💪",
        "roleSummary": "Principal consumidor periférico de glucosa (≈80% de la captación estimulada por insulina en el clamp; tras una comida mixta, ~1/3 de la glucosa ingerida).",
        "primaryFuelUsed": "Glucosa",
        "fuelProducedOrExported": "Retiene todo para sí (no tiene Glucosa-6-Fosfatasa)",
        "keyEnzymes": [
          {
            "name": "GLUT4",
            "abbreviation": "GLUT4",
            "pathway": "Captación de Glucosa",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "Translocación masiva desde vesículas intracelulares inducida por la cascada IRS-1 -> PI3K -> Akt."
          },
          {
            "name": "Hexoquinasa II",
            "abbreviation": "HK II",
            "pathway": "Glucólisis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Fosforila glucosa a G6P; inhibida por G6P pero el flujo a glucógeno evita su acumulación."
          },
          {
            "name": "Glucógeno Sintasa Muscular",
            "abbreviation": "GS-M",
            "pathway": "Glucogenogénesis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Activada por desfosforilación inducida por insulina y activada alostéricamente por Glucosa-6-P."
          }
        ],
        "activePathways": [
          "Captación de glucosa vía GLUT4",
          "Glucogenogénesis muscular",
          "Glucólisis",
          "Síntesis de proteínas (mTORC1)"
        ],
        "inhibitedPathways": [
          "Proteólisis (vía ubiquitina-proteasoma reprimida)",
          "Beta-oxidación"
        ],
        "transportersActive": [
          "GLUT4",
          "LAT1 (transportador de aminoácidos ramificados)"
        ],
        "physiologicalNote": "Almacena ~400 g de glucógeno (más en personas entrenadas) para uso propio en contracción futura.",
        "atpGenerationStrategy": "Oxidación de glucosa."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo",
        "emoji": "🧬",
        "roleSummary": "Almacén primario de triglicéridos y amortiguador lipídico.",
        "primaryFuelUsed": "Glucosa (para sintetizar glicerol-3-fosfato)",
        "fuelProducedOrExported": "Almacena triglicéridos en gota lipídica unilocular",
        "keyEnzymes": [
          {
            "name": "Lipoproteína Lipasa Endotelial",
            "abbreviation": "LPL",
            "pathway": "Hidrólisis de Lipoproteínas",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "Inducida por insulina en capilares adiposos; hidroliza quilomicrones y VLDL para liberar ácidos grasos."
          },
          {
            "name": "Lipasa Sensible a Hormonas",
            "abbreviation": "HSL",
            "pathway": "Lipólisis",
            "cellularLocation": "Citosol",
            "status": "inhibida",
            "mechanism": "Desfosforilada e inactivada por fosfodiesterasas y PP1 inducidas por insulina."
          }
        ],
        "activePathways": [
          "Captación de glucosa (GLUT4)",
          "Síntesis de glicerol-3-P",
          "Captación de ácidos grasos (LPL)",
          "Esterificación a triglicéridos"
        ],
        "inhibitedPathways": [
          "Lipólisis (HSL y ATGL inhibidas)"
        ],
        "transportersActive": [
          "GLUT4",
          "FATP1",
          "CD36"
        ],
        "physiologicalNote": "La falta de glicerol quinasa en adipocitos obliga a usar glucólisis para generar glicerol-3-fosfato.",
        "atpGenerationStrategy": "Glucólisis moderada."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Consumo continuo e ineludible de glucosa para mantener potenciales de acción.",
        "primaryFuelUsed": "Glucosa (100%)",
        "fuelProducedOrExported": "Ninguno (consumidor terminal)",
        "keyEnzymes": [
          {
            "name": "GLUT1 & GLUT3",
            "abbreviation": "GLUT1/3",
            "pathway": "Captación de Glucosa",
            "cellularLocation": "Membrana Plasmática",
            "status": "activa",
            "mechanism": "Transportadores constitutivos independientes de insulina con muy baja Km (~1-2 mM)."
          },
          {
            "name": "Hexoquinasa I",
            "abbreviation": "HK I",
            "pathway": "Glucólisis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Saturada a glucemias normales; alta afinidad constante."
          }
        ],
        "activePathways": [
          "Glucólisis aeróbica completa",
          "Ciclo de Krebs y fosforilación oxidativa"
        ],
        "inhibitedPathways": [
          "Cetólisis (ausencia de cuerpos cetónicos plasmáticos)",
          "Oxidación de ácidos grasos (cruzan la BHE, pero las neuronas apenas los β-oxidan)"
        ],
        "transportersActive": [
          "GLUT1 (endotelio BHE)",
          "GLUT3 (neuronas)"
        ],
        "physiologicalNote": "Consume ~120 gramos de glucosa al día (~5 g/h) de manera ininterrumpida.",
        "atpGenerationStrategy": "Fosforilación oxidativa dependiente de piruvato/glucosa."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Filtración y reabsorción completa de glucosa.",
        "primaryFuelUsed": "Glucosa (médula) y ácidos grasos (corteza)",
        "fuelProducedOrExported": "Reabsorbe el 100% de glucosa filtrada",
        "keyEnzymes": [
          {
            "name": "SGLT2 / SGLT1",
            "abbreviation": "SGLT2",
            "pathway": "Reabsorción Tubular",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "Reabsorbe el 90% de la glucosa filtrada en el túbulo contorneado proximal."
          }
        ],
        "activePathways": [
          "Reabsorción tubular completa",
          "Glucólisis medular"
        ],
        "inhibitedPathways": [
          "Gluconeogénesis renal (reprimida por insulina)"
        ],
        "transportersActive": [
          "SGLT2",
          "GLUT2"
        ],
        "physiologicalNote": "No existe glucosuria fisiológica (< 180 mg/dL de umbral renal).",
        "atpGenerationStrategy": "Fosforilación oxidativa en corteza renal."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Bomba continua de alta demanda que incrementa captación de glucosa vía GLUT4.",
        "primaryFuelUsed": "Glucosa y lactato (en posprandio incrementa consumo de glucosa)",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Complejo Piruvato Deshidrogenasa (PDH cardíaca)",
            "abbreviation": "PDH",
            "pathway": "Oxidación de Piruvato y Glucosa",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Desfosforilada y activada por PDH fosfatasa en respuesta a insulina y aumento de piruvato; permite que el corazón oxide glucosa y lactato hasta el 40-50% de su gasto energético posprandial."
          },
          {
            "name": "Fosfofructoquinasa-2 Cardíaca (PFKFB2)",
            "abbreviation": "PFKFB2 / PFK-2 cardíaca",
            "pathway": "Glucólisis Miocárdica",
            "cellularLocation": "Citosol",
            "status": "activa",
            "mechanism": "A diferencia de la isoforma hepática, la PFK-2 cardíaca es fosforilada y activada por insulina y Akt, aumentando los niveles de Fructosa-2,6-bisfosfato y estimulando la glucólisis."
          },
          {
            "name": "Carnitina Palmitoiltransferasa 1B (CPT-1B cardíaca)",
            "abbreviation": "CPT-1B",
            "pathway": "Beta-Oxidación Mitocondrial",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "inhibida",
            "mechanism": "Frenada alostéricamente por el Malonil-CoA sintetizado por la ACC2 mitocondrial ante la abundancia de glucosa e insulina (competencia del Ciclo de Randle)."
          },
          {
            "name": "Creatina Quinasa Cardíaca (CK-MB / CK-MM)",
            "abbreviation": "CK-MB / CK-MM",
            "pathway": "Lanzadera de Fosfocreatina",
            "cellularLocation": "Espacio Intermembrana Mitocondrial y Citosol",
            "status": "muy_activa",
            "mechanism": "Transfiere grupos fosfato de alta energía desde el ATP mitocondrial hacia la fosfocreatina para alimentar instantáneamente los puentes de actina-miosina."
          }
        ],
        "activePathways": [
          "Glucólisis",
          "Oxidación de carbohidratos"
        ],
        "inhibitedPathways": [
          "Beta-oxidación reducida frente al ayuno"
        ],
        "transportersActive": [
          "GLUT4",
          "GLUT1",
          "CD36"
        ],
        "physiologicalNote": "Aunque el corazón normalmente prefiere ácidos grasos, en posprandio incrementa su oxidación de glucosa hasta un 50%.",
        "atpGenerationStrategy": "Fosforilación oxidativa ininterrumpida."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Sensor glucémico primario del organismo.",
        "primaryFuelUsed": "Glucosa (metabolismo sensor)",
        "fuelProducedOrExported": "Insulina secretada a vena porta",
        "keyEnzymes": [
          {
            "name": "Glucoquinasa Pancreática & Canal K-ATP",
            "abbreviation": "GK / K-ATP",
            "pathway": "Secreción de Insulina",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "Aumento del cociente ATP/ADP cierra canales K-ATP, despolariza la membrana, abre canales Ca2+ y libera insulina."
          }
        ],
        "activePathways": [
          "Secreción de Insulina",
          "Inhibición de Glucagón por efecto somatostatina/insulina"
        ],
        "inhibitedPathways": [
          "Secreción de glucagón"
        ],
        "transportersActive": [
          "GLUT2 / GLUT1"
        ],
        "physiologicalNote": "La vena porta recibe concentraciones de insulina 2 a 3 veces mayores que la circulación periférica.",
        "atpGenerationStrategy": "Sensor metabólico acoplado a despolarización."
      }
    },
    "fluxes": [
      {
        "id": "gut-to-liver-glucose",
        "sourceOrgan": "gut",
        "targetOrgan": "liver",
        "substrate": "glucose",
        "substrateName": "Glucosa Portal",
        "rate": "masivo",
        "directionDescription": "Intestino -> Vena Porta -> Hígado",
        "biochemicalPurpose": "Carga masiva de carbohidratos para amortiguación y glucogenogénesis",
        "pathwayInvolved": "Transporte facilitado GLUT2"
      },
      {
        "id": "liver-to-blood-vldl",
        "sourceOrgan": "liver",
        "targetOrgan": "adipose",
        "substrate": "vldl_chylomicrons",
        "substrateName": "VLDL (Triglicéridos endógenos)",
        "rate": "alto",
        "directionDescription": "Hígado -> Sangre -> Tejido Adiposo",
        "biochemicalPurpose": "Distribución de triglicéridos sintetizados por Lipogénesis de Novo",
        "pathwayInvolved": "Lipólisis por LPL endotelial"
      },
      {
        "id": "blood-to-muscle-glucose",
        "sourceOrgan": "gut",
        "targetOrgan": "muscle",
        "substrate": "glucose",
        "substrateName": "Glucosa Plasmática",
        "rate": "masivo",
        "directionDescription": "Circulación sistémica -> Músculo",
        "biochemicalPurpose": "Principal destino periférico de la glucosa para recarga de glucógeno y glucólisis",
        "pathwayInvolved": "Translocación GLUT4 inducida por Insulina"
      },
      {
        "id": "blood-to-adipose-glucose",
        "sourceOrgan": "gut",
        "targetOrgan": "adipose",
        "substrate": "glucose",
        "substrateName": "Glucosa Plasmática",
        "rate": "moderado",
        "directionDescription": "Circulación -> Tejido Adiposo",
        "biochemicalPurpose": "Síntesis de glicerol-3-P para esterificar triglicéridos",
        "pathwayInvolved": "Translocación GLUT4"
      },
      {
        "id": "blood-to-brain-glucose",
        "sourceOrgan": "gut",
        "targetOrgan": "brain",
        "substrate": "glucose",
        "substrateName": "Glucosa",
        "rate": "moderado",
        "directionDescription": "Circulación -> Barrera Hematoencefálica",
        "biochemicalPurpose": "Suministro constante obligatorio (~5 g/h)",
        "pathwayInvolved": "GLUT1 endotelial y GLUT3 neuronal"
      }
    ],
    "hallmarkFeatures": [
      "Cociente molar Insulina / Glucagón muy alto (> 10; ~50 tras una comida rica en hidratos): máxima señal anabólica",
      "Desfosforilación generalizada de enzimas clave por fosfatasas activadas por insulina (PP1 sobre la Glucógeno Sintasa; PP2A sobre la Acetil-CoA Carboxilasa y la PFK-2)",
      "Malonil-CoA elevado bloquea CPT-1, extinguiendo la beta-oxidación y cetogénesis",
      "Translocación masiva de GLUT4 en músculo y grasa"
    ],
    "clinicalOrPhysiologicalContext": "Fase de recarga energética. En un individuo sano, la glucemia retorna a valores basales en < 2 horas gracias a la alta sensibilidad insulínica.",
    "keyRegulatorySwitch": {
      "title": "Interruptor PFK-2 / F-2,6-BP y CPT-1",
      "description": "La insulina activa fosfatasas (PP2A), desfosforilando PFK-2 (que sintetiza Fructosa-2,6-bisfosfato, disparando la PFK-1). Simultáneamente, la Acetil-CoA Carboxilasa desfosforilada produce Malonil-CoA, que inhibe alostéricamente a CPT-1 bloqueando la entrada de ácidos grasos a la mitocondria.",
      "enzyme": "F-2,6-BPasa / PFK-2 & ACC",
      "allostericOrCovalent": "Regulación covalente (desfosforilación) + alostérica (Malonil-CoA sobre CPT-1)"
    }
  },
  "early_fasting": {
    "id": "early_fasting",
    "title": "Ayuno Temprano (Postabsortivo)",
    "subtitle": "4 a 16 horas sin ingesta (p. ej., durante el sueño nocturno)",
    "category": "Ayuno & Inanición",
    "timeframe": "4 - 16 horas",
    "summary": "Transición catabólica. Caída de insulina y aumento de glucagón. La glucogenólisis hepática es el motor principal para mantener la normoglucemia. El tejido adiposo inicia la lipólisis liberando ácidos grasos que el músculo comienza a oxidar.",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "bajo",
        "valueText": "5 - 12 μU/mL (Nivel basal)",
        "percent": 15,
        "color": "#059669",
        "sourceOrgan": "Células β pancreáticas",
        "primaryAction": "Baja secreción basal por cese del estímulo luminal de glucosa e incretinas."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "elevado",
        "valueText": "80 - 110 pg/mL",
        "percent": 65,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas",
        "primaryAction": "Unión a GPCR hepático -> Gs -> Adenilato Ciclasa -> AMPc -> Proteína Quinasa A (PKA)."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "normal",
        "valueText": "Basal baja",
        "percent": 15,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal",
        "primaryAction": "Rol modesto; el glucagón lidera la respuesta en esta fase."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "normal",
        "valueText": "Ritmo matutino normal",
        "percent": 35,
        "color": "#6366f1",
        "sourceOrgan": "Corteza suprarrenal",
        "primaryAction": "Mantiene transcripción basal de enzimas gluconeogénicas (PEPCK)."
      },
      "ampkActivity": {
        "status": "moderada",
        "description": "Ligera activación en músculo e hígado para promover oxidación lipídica.",
        "percent": 30
      },
      "igRatio": {
        "ratio": 2,
        "text": "Moderado (~2, molar)",
        "state": "equilibrado"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "80 - 90 mg/dL",
        "normalRange": "70 - 99 mg/dL",
        "status": "normal",
        "unit": "mg/dL",
        "description": "Mantenida con precisión homeostática por la exportación hepática de glucosa."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "0.40 - 0.65 mM",
        "normalRange": "0.3 - 0.6 mM (ayuno nocturno)",
        "status": "normal",
        "unit": "mM",
        "description": "En el rango de referencia del ayuno nocturno (muy por encima del valor posprandial); aumentan progresivamente al desreprimirse la lipasa adipocitaria (HSL/ATGL)."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos",
        "valueText": "0.10 - 0.30 mM",
        "normalRange": "< 0.2 mM",
        "status": "normal",
        "unit": "mM",
        "description": "Comienzo de producción basal; aún no es cuantitativamente significativa."
      },
      {
        "id": "lactate",
        "name": "Lactato",
        "valueText": "0.8 - 1.0 mM",
        "normalRange": "0.5 - 1.5 mM",
        "status": "normal",
        "unit": "mM",
        "description": "Sustrato para el ciclo de Cori en hígado."
      },
      {
        "id": "glycerol",
        "name": "Glicerol Plasmático",
        "valueText": "0.05 - 0.10 mM",
        "normalRange": "0.05 - 0.1 mM (ayuno nocturno)",
        "status": "normal",
        "unit": "mM",
        "description": "Liberado por el tejido adiposo al hidrolizar triglicéridos."
      },
      {
        "id": "alanine",
        "name": "Alanina Plasmática",
        "valueText": "Moderada",
        "normalRange": "Normal",
        "status": "normal",
        "unit": "μM",
        "description": "Transportador de nitrógeno y carbono desde el músculo al hígado."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Reposo absortivo; absorción nutricional agotada.",
        "primaryFuelUsed": "Glutamina arterial",
        "fuelProducedOrExported": "Ninguno hacia la porta",
        "keyEnzymes": [
          {
            "name": "Glutaminasa Enterocítica (GLS intestinal)",
            "abbreviation": "GLS",
            "pathway": "Oxidación de Glutamina Arterial",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "En ausencia de glucosa luminal, los enterocitos consumen glutamina arterial como sustrato oxidativo primario para mantener el epitelio."
          },
          {
            "name": "SGLT1 / GLUT2 apical",
            "abbreviation": "SGLT1/GLUT2",
            "pathway": "Absorción de Carbohidratos",
            "cellularLocation": "Membrana Apical",
            "status": "inhibida",
            "mechanism": "Retirados o inactivos por el vaciamiento gástrico y agotamiento de nutrientes en la luz intestinal."
          }
        ],
        "activePathways": [
          "Oxidación de glutamina arterial",
          "Mantenimiento de la barrera mucosa epitelial"
        ],
        "inhibitedPathways": [
          "Absorción de macronutrientes luminales",
          "Ensamblaje y secreción de quilomicrones"
        ],
        "transportersActive": [
          "ASCT2 (transportador basolateral de glutamina)",
          "GLUT2 basolateral"
        ],
        "physiologicalNote": "No hay flujo exógeno de glucosa hacia la vena porta.",
        "atpGenerationStrategy": "Oxidación de glutamina y cuerpos cetónicos mínimos."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Generador y exportador neto de glucosa para mantener la glucemia cerebral.",
        "primaryFuelUsed": "Beta-oxidación de Ácidos Grasos Libres",
        "fuelProducedOrExported": "Glucosa libre (GLUT2) vía Glucogenólisis (~50-60%) y Gluconeogénesis (~40-50%) tras una noche de ayuno",
        "keyEnzymes": [
          {
            "name": "Glucógeno Fosforilasa Hepática",
            "abbreviation": "GP-a",
            "pathway": "Glucogenólisis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Fosforilada por Fosforilasa Quinasa (vía Glucagón -> AMPc -> PKA). Rompe enlaces α-1,4 liberando G1P.",
            "allostericModulators": {
              "activators": [
                "AMPc / PKA"
              ],
              "inhibitors": [
                "Glucosa libre",
                "ATP"
              ]
            }
          },
          {
            "name": "Glucosa-6-Fosfatasa",
            "abbreviation": "G6Pasa",
            "pathway": "Exportación de Glucosa",
            "cellularLocation": "Retículo Endoplásmico",
            "status": "muy_activa",
            "mechanism": "Desfosforila G6P a glucosa libre permitiendo su salida a la sangre por GLUT2."
          },
          {
            "name": "Fructosa-1,6-Bisfosfatasa-1",
            "abbreviation": "FBPasa-1",
            "pathway": "Gluconeogénesis",
            "cellularLocation": "Citosol",
            "status": "activa",
            "mechanism": "Desinhibida al desplomarse los niveles de Fructosa-2,6-bisfosfato."
          },
          {
            "name": "Glucógeno Sintasa",
            "abbreviation": "GS-b",
            "pathway": "Glucogenogénesis",
            "cellularLocation": "Citosol",
            "status": "inactiva",
            "mechanism": "Fosforilada e inactivada por PKA y GSK3."
          }
        ],
        "activePathways": [
          "Glucogenólisis hepática (principal)",
          "Gluconeogénesis temprana",
          "Beta-oxidación de ácidos grasos"
        ],
        "inhibitedPathways": [
          "Glucogenogénesis",
          "Glucólisis",
          "Lipogénesis de novo"
        ],
        "transportersActive": [
          "GLUT2 (ahora en dirección de eflujo hacia la circulación sistémica)"
        ],
        "physiologicalNote": "Las reservas de glucógeno hepático (~100 g) descienden a la mitad hacia las 12 horas de ayuno.",
        "atpGenerationStrategy": "Beta-oxidación mitocondrial de ácidos grasos libres que llegan del adipocito."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético",
        "emoji": "💪",
        "roleSummary": "Ahorro de glucosa para el cerebro; inicio de transición a grasas.",
        "primaryFuelUsed": "Ácidos Grasos Libres (AGL)",
        "fuelProducedOrExported": "Lactato y Alanina (hacia el hígado)",
        "keyEnzymes": [
          {
            "name": "GLUT4",
            "abbreviation": "GLUT4",
            "pathway": "Captación de Glucosa",
            "cellularLocation": "Citosol (Vesículas)",
            "status": "inactiva",
            "mechanism": "Internalizado en vesículas por ausencia de estímulo insulínico."
          },
          {
            "name": "Piruvato Deshidrogenasa (PDH)",
            "abbreviation": "PDH",
            "pathway": "Oxidación de Glucosa",
            "cellularLocation": "Mitocondria",
            "status": "inhibida",
            "mechanism": "Fosforilada e inactivada por PDH Quinasa, estimulada por el aumento de Acetil-CoA y NADH de la beta-oxidación (Efecto Randle)."
          }
        ],
        "activePathways": [
          "Beta-oxidación de ácidos grasos",
          "Ciclo Glucosa-Alanina (exportación de aminoácidos)",
          "Ahorro de glucosa"
        ],
        "inhibitedPathways": [
          "Captación de glucosa",
          "Glucólisis activa",
          "Síntesis de glucógeno"
        ],
        "transportersActive": [
          "CD36 (captación de AGL)"
        ],
        "physiologicalNote": "Conserva su glucógeno propio intacto, ya que solo se activa ante contracción muscular intensa.",
        "atpGenerationStrategy": "Beta-oxidación aeróbica de AGL."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo",
        "emoji": "🧬",
        "roleSummary": "Suministrador calórico sistémico mediante lipólisis.",
        "primaryFuelUsed": "Ácidos grasos propios",
        "fuelProducedOrExported": "Ácidos Grasos Libres (AGL unidos a albúmina) y Glicerol libre",
        "keyEnzymes": [
          {
            "name": "Lipasa de Triglicéridos Adipocitaria & HSL",
            "abbreviation": "ATGL / HSL",
            "pathway": "Lipólisis",
            "cellularLocation": "Gota Lipídica",
            "status": "muy_activa",
            "mechanism": "La baja insulina y el aumento de señal adrenérgica basal fosforilan la perilipina y HSL, permitiendo el acceso a la gota lipídica."
          }
        ],
        "activePathways": [
          "Lipólisis de triglicéridos a AGL + Glicerol"
        ],
        "inhibitedPathways": [
          "Lipogénesis",
          "Captación de glucosa vía GLUT4",
          "LPL endotelial"
        ],
        "transportersActive": [
          "Canales de eflujo de AGL y AQP7 (eflujo de glicerol)"
        ],
        "physiologicalNote": "El glicerol liberado no puede reutilizarse en el adipocito por falta de glicerol quinasa; viaja al hígado como sustrato gluconeogénico.",
        "atpGenerationStrategy": "Oxidación residual de ácidos grasos."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Dependencia inalterada de glucosa circulante.",
        "primaryFuelUsed": "Glucosa (100% de su energía)",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "GLUT1 & GLUT3",
            "abbreviation": "GLUT1/3",
            "pathway": "Captación de Glucosa",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "Independientes de insulina; captan glucosa a 85 mg/dL con idéntica afinidad."
          }
        ],
        "activePathways": [
          "Glucólisis aeróbica completa",
          "Ciclo de Krebs"
        ],
        "inhibitedPathways": [
          "Consumo de cetonas (aún en niveles submínimos < 0.3 mM)"
        ],
        "transportersActive": [
          "GLUT1",
          "GLUT3"
        ],
        "physiologicalNote": "El cerebro no se percata del ayuno gracias al rescate glucémico hepático.",
        "atpGenerationStrategy": "Oxidación completa de glucosa."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Reabsorción tubular y modesta contribución gluconeogénica inicial (~10%).",
        "primaryFuelUsed": "Ácidos grasos libres",
        "fuelProducedOrExported": "Reabsorción de glucosa",
        "keyEnzymes": [
          {
            "name": "Fosfoenolpiruvato Carboxiquinasa Renal (PEPCK)",
            "abbreviation": "PEPCK renal",
            "pathway": "Gluconeogénesis Cortical",
            "cellularLocation": "Citosol",
            "status": "activa",
            "mechanism": "Inducción transcripcional en túbulo contorneado proximal; aporta ~10% de la gluconeogénesis sistémica inicial."
          },
          {
            "name": "Cotransportador Na+/Glucosa 2 (SGLT2)",
            "abbreviation": "SGLT2",
            "pathway": "Reabsorción Tubular de Glucosa",
            "cellularLocation": "Membrana Apical Tubular Proximal",
            "status": "muy_activa",
            "mechanism": "Reabsorbe el 100% de la carga filtrada de glucosa para impedir cualquier pérdida energética calórica en la orina."
          }
        ],
        "activePathways": [
          "Reabsorción tubular completa de glucosa",
          "Gluconeogénesis renal incipiente",
          "Beta-oxidación en corteza renal"
        ],
        "inhibitedPathways": [
          "Glucólisis cortical"
        ],
        "transportersActive": [
          "SGLT2",
          "SGLT1",
          "GLUT2"
        ],
        "physiologicalNote": "Empieza a expresar PEPCK en corteza renal.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Transición inmediata a oxidación de ácidos grasos.",
        "primaryFuelUsed": "Ácidos grasos libres (~80%)",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Carnitina Palmitoiltransferasa 1B (CPT-1B cardíaca)",
            "abbreviation": "CPT-1B",
            "pathway": "Beta-Oxidación Mitocondrial",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "muy_activa",
            "mechanism": "Desinhibida drásticamente por el descenso de Malonil-CoA al caer la insulina; introduce masivamente acil-CoA graso a la mitocondria para cubrir >80% del ATP cardíaco."
          },
          {
            "name": "Piruvato Deshidrogenasa Quinasa 4 (PDK4)",
            "abbreviation": "PDK4",
            "pathway": "Ahorro de Glucosa",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Sobreexpresada e hiperactivada por los altos niveles de Acetil-CoA y NADH de la beta-oxidación; fosforila e inactiva a la PDH para frenar el consumo de glucosa miocárdica."
          },
          {
            "name": "Lipoproteína Lipasa Miocárdica (LPL)",
            "abbreviation": "LPL",
            "pathway": "Captación de Ácidos Grasos Circulantes",
            "cellularLocation": "Endotelio Capilar Coronario",
            "status": "muy_activa",
            "mechanism": "Hidroliza activamente quilomicrones residuales y VLDL plasmáticas, canalizando ácidos grasos libres hacia el miocito cardíaco."
          }
        ],
        "activePathways": [
          "Beta-oxidación miocárdica"
        ],
        "inhibitedPathways": [
          "Glucólisis (inhibida por citrato y acetil-CoA)"
        ],
        "transportersActive": [
          "CD36",
          "FATP"
        ],
        "physiologicalNote": "El corazón ahorra glucosa para el cerebro quemando ácidos grasos liberados por el adipocito.",
        "atpGenerationStrategy": "Fosforilación oxidativa lipídica."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Báscula hormonal que eleva glucagón y deprime insulina.",
        "primaryFuelUsed": "Metabolismo basal",
        "fuelProducedOrExported": "Glucagón hacia la vena porta",
        "keyEnzymes": [
          {
            "name": "Canales de K+ Sensibles a ATP (Kir6.2 / SUR1)",
            "abbreviation": "Canal K-ATP",
            "pathway": "Sensor de Células Beta",
            "cellularLocation": "Membrana Plasmática",
            "status": "activa",
            "mechanism": "El descenso del cociente ATP/ADP mantiene los canales abiertos, lo que hiperpolariza la membrana e impide la entrada de Ca2+ y la exocitosis de insulina."
          },
          {
            "name": "Prohormona Convertasa 2 (PC2 en Células Alfa)",
            "abbreviation": "PC2",
            "pathway": "Secreción de Glucagón",
            "cellularLocation": "Gránulos Secretores de Células Alfa",
            "status": "muy_activa",
            "mechanism": "Procesa proglucagón para secretar glucagón maduro hacia la vena porta en respuesta al descenso de glucemia."
          }
        ],
        "activePathways": [
          "Secreción de glucagón por células alfa",
          "Hiperpolarización protectora de células beta (canales K-ATP abiertos)"
        ],
        "inhibitedPathways": [
          "Exocitosis de insulina dependiente de glucosa",
          "Glucólisis sensora en células beta"
        ],
        "transportersActive": [
          "GLUT2 (células beta y alfa)",
          "Canales K-ATP"
        ],
        "physiologicalNote": "La ausencia de hiperglucemia desbloquea la secreción de glucagón.",
        "atpGenerationStrategy": "Metabolismo basal."
      }
    },
    "fluxes": [
      {
        "id": "liver-to-brain-glucose",
        "sourceOrgan": "liver",
        "targetOrgan": "brain",
        "substrate": "glucose",
        "substrateName": "Glucosa Hepática",
        "rate": "alto",
        "directionDescription": "Hígado -> Circulación Sistémica -> Cerebro",
        "biochemicalPurpose": "Mantener metabolismo oxidativo cerebral (~5 g/hora)",
        "pathwayInvolved": "Glucogenólisis hepática (degradación de glucógeno vía fosforilasa)"
      },
      {
        "id": "adipose-to-muscle-ffa",
        "sourceOrgan": "adipose",
        "targetOrgan": "muscle",
        "substrate": "free_fatty_acids",
        "substrateName": "Ácidos Grasos Libres",
        "rate": "alto",
        "directionDescription": "Tejido Adiposo -> Sangre -> Músculo Esquelético",
        "biochemicalPurpose": "Combustible primario muscular para ahorrar glucosa",
        "pathwayInvolved": "Lipólisis de triglicéridos por HSL / ATGL"
      },
      {
        "id": "adipose-to-liver-glycerol",
        "sourceOrgan": "adipose",
        "targetOrgan": "liver",
        "substrate": "glycerol",
        "substrateName": "Glicerol",
        "rate": "moderado",
        "directionDescription": "Tejido Adiposo -> Hígado",
        "biochemicalPurpose": "Sustrato para la gluconeogénesis hepática (DHAP)",
        "pathwayInvolved": "Glicerol quinasa hepática y glicerol-3-P deshidrogenasa"
      },
      {
        "id": "muscle-to-liver-alanine",
        "sourceOrgan": "muscle",
        "targetOrgan": "liver",
        "substrate": "alanine",
        "substrateName": "Alanina",
        "rate": "moderado",
        "directionDescription": "Músculo -> Hígado (Ciclo Glucosa-Alanina)",
        "biochemicalPurpose": "Transporte de nitrógeno y esqueleto carbonado para glucosa",
        "pathwayInvolved": "Alanina aminotransferasa (ALT)"
      }
    ],
    "hallmarkFeatures": [
      "Cociente molar Insulina / Glucagón cae a ~2 (frente a > 10 tras comer): predomina la señal glucagón / AMPc / PKA en el hígado",
      "La glucogenólisis hepática aporta ~50-60% de la glucosa tras una noche de ayuno; la gluconeogénesis, el resto (y su peso aumenta con las horas)",
      "El músculo ahorra glucosa gracias a la inhibición de PDH por beta-oxidación (Ciclo de Randle)",
      "Lipólisis adipocitaria activada provee AGL para músculo, corazón e hígado"
    ],
    "clinicalOrPhysiologicalContext": "Estado fisiológico cotidiano que experimentamos cada noche. Al despertar en ayunas, la glucemia normal de 80-90 mg/dL depende críticamente del glucógeno hepático.",
    "keyRegulatorySwitch": {
      "title": "Glucógeno Fosforilasa Hepática vs Glucógeno Sintasa",
      "description": "El glucagón, a través del receptor GPCR y AMPc, activa la PKA. La PKA fosforila a la Fosforilasa Quinasa, que a su vez fosforila a la Glucógeno Fosforilasa convirtiéndola en su forma activa \"a\". Al mismo tiempo, fosforila a la Glucógeno Sintasa a su forma inactiva \"b\", apagando la síntesis y activando la lisis.",
      "enzyme": "Glucógeno Fosforilasa (GP-a)",
      "allostericOrCovalent": "Cascada de fosforilación covalente mediada por PKA"
    }
  },
  "late_fasting": {
    "id": "late_fasting",
    "title": "Ayuno Tardío / Prolongado",
    "subtitle": "24 a 72 horas de ayuno (depleción de glucógeno)",
    "category": "Ayuno & Inanición",
    "timeframe": "24 - 72 horas",
    "summary": "Agotamiento prácticamente completo del glucógeno hepático. La Gluconeogénesis (hepática y renal) asume casi el 100% de la producción de glucosa a partir de lactato, glicerol y aminoácidos (proteólisis muscular activa). La masiva beta-oxidación genera un exceso de Acetil-CoA que sobrepasa el ciclo de Krebs, iniciando la Cetogénesis.",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "muy_bajo",
        "valueText": "< 4 μU/mL",
        "percent": 5,
        "color": "#059669",
        "sourceOrgan": "Células β pancreáticas",
        "primaryAction": "Mínima expresión basal necesaria para evitar cetoacidosis descontrolada."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "muy_elevado",
        "valueText": "130 - 180 pg/mL",
        "percent": 90,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas",
        "primaryAction": "Inducción transcripcional de PEPCK y Glucosa-6-Fosfatasa; activación continua de HMG-CoA Sintasa."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "elevado",
        "valueText": "Moderadamente elevada",
        "percent": 45,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal",
        "primaryAction": "Potencia la lipólisis adipocitaria."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "elevado",
        "valueText": "18 - 25 μg/dL",
        "percent": 75,
        "color": "#6366f1",
        "sourceOrgan": "Corteza suprarrenal",
        "primaryAction": "Estimula la proteólisis muscular y la transcripción de enzimas gluconeogénicas hepáticas."
      },
      "ampkActivity": {
        "status": "alta",
        "description": "Activa en múltiples tejidos para apagar vías anabólicas.",
        "percent": 70
      },
      "igRatio": {
        "ratio": 0.4,
        "text": "Muy bajo (< 0,5, molar)",
        "state": "muy_bajo"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "65 - 75 mg/dL",
        "normalRange": "70 - 99 mg/dL",
        "status": "disminuido",
        "unit": "mg/dL",
        "description": "Reducida pero estable gracias a la gluconeogénesis continua."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "1.2 - 1.6 mM",
        "normalRange": "0.3 - 0.6 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Lipólisis vigorosa y sostenida."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos (AcAc + β-OHB)",
        "valueText": "~0.3 mM (24 h) → 1 - 2 mM (48 h) → 2 - 3 mM (72 h)",
        "normalRange": "< 0.2 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Cetonemia fisiológica creciente. β-hidroxibutirato y acetoacetato en ratio ~3:1."
      },
      {
        "id": "urea",
        "name": "Urea Urinaria y Plasmática",
        "valueText": "Elevada (Ureogénesis alta)",
        "normalRange": "Normal",
        "status": "muy_elevado",
        "unit": "g/24h",
        "description": "Pico de excreción de urea debido a la desaminación de aminoácidos musculares."
      },
      {
        "id": "glycerol",
        "name": "Glicerol",
        "valueText": "0.35 - 0.50 mM",
        "normalRange": "0.05 - 0.1 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Suministro constante desde el adipocito."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Inactivo metabólicamente.",
        "primaryFuelUsed": "Cuerpos cetónicos",
        "fuelProducedOrExported": "Ninguno",
        "keyEnzymes": [
          {
            "name": "Glutaminasa Enterocítica y Glutamato Deshidrogenasa",
            "abbreviation": "GLS / GDH",
            "pathway": "Combustible Enterocítico de Ayuno",
            "cellularLocation": "Mitocondria",
            "status": "activa",
            "mechanism": "Degrada glutamina liberada por el músculo esquelético, generando amonio, glutamato y alanina que se vierten a la vena porta."
          },
          {
            "name": "Tioforasa Intestinal (SCOT)",
            "abbreviation": "SCOT intestinal",
            "pathway": "Cetólisis Mucosa",
            "cellularLocation": "Mitocondria",
            "status": "activa",
            "mechanism": "Capta acetoacetato de la circulación arterial para suministrar energía a los enterocitos en ayuno."
          }
        ],
        "activePathways": [
          "Cetólisis enterocítica",
          "Autofagia y recambio celular mucoso",
          "Oxidación de glutamina"
        ],
        "inhibitedPathways": [
          "Absorción luminal",
          "Secreción de incretinas (GLP-1 y GIP)"
        ],
        "transportersActive": [
          "MCT1 (captación basolateral de cuerpos cetónicos)",
          "ASCT2"
        ],
        "physiologicalNote": "Usa cuerpos cetónicos circulantes.",
        "atpGenerationStrategy": "Cetólisis."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Centro gluconeogénico y fábrica cetogénica exclusiva del cuerpo humano.",
        "primaryFuelUsed": "Beta-oxidación completa de ácidos grasos",
        "fuelProducedOrExported": "Glucosa (Gluconeogénesis) y Cuerpos Cetónicos (Acetoacetato y β-hidroxibutirato)",
        "keyEnzymes": [
          {
            "name": "Fosfoenolpiruvato Carboxiquinasa",
            "abbreviation": "PEPCK",
            "pathway": "Gluconeogénesis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Inducción génica masiva por Glucagón, AMPc y Cortisol. Convierte oxaloacetato a fosfoenolpiruvato."
          },
          {
            "name": "Piruvato Carboxilasa",
            "abbreviation": "PC",
            "pathway": "Gluconeogénesis",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "Activada alostéricamente de forma obligatoria por el exceso de Acetil-CoA de la beta-oxidación."
          },
          {
            "name": "HMG-CoA Sintasa Mitocondrial",
            "abbreviation": "mHMGCS",
            "pathway": "Cetogénesis",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "Enzima limitante de la cetogénesis. Condensa Acetil-CoA con Acetoacetil-CoA para formar HMG-CoA."
          },
          {
            "name": "β-Cetoacil-CoA Transferasa (Tioforasa)",
            "abbreviation": "SCOT / Tioforasa",
            "pathway": "Cetólisis",
            "cellularLocation": "Mitocondria",
            "status": "inactiva",
            "mechanism": "AUSENTE en el hígado. Esto impide que el hígado consuma sus propios cuerpos cetónicos (ciclo fútil)."
          }
        ],
        "activePathways": [
          "Gluconeogénesis (máxima)",
          "Cetogénesis (masiva)",
          "Beta-oxidación mitocondrial",
          "Ciclo de la Urea (alta tasa)"
        ],
        "inhibitedPathways": [
          "Glucogenólisis (reservas agotadas)",
          "Glucólisis",
          "Lipogénesis"
        ],
        "transportersActive": [
          "GLUT2 (eflujo de glucosa)",
          "MCT (eflujo de cuerpos cetónicos)"
        ],
        "physiologicalNote": "El oxaloacetato se desvía intensamente hacia la gluconeogénesis, lo que reduce su disponibilidad para el ciclo de Krebs; esto fuerza al Acetil-CoA hacia la cetogénesis.",
        "atpGenerationStrategy": "Beta-oxidación lipídica masiva."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético",
        "emoji": "💪",
        "roleSummary": "Proteólisis adaptativa para suministrar aminoácidos gluconeogénicos (alanina, glutamina).",
        "primaryFuelUsed": "Ácidos Grasos Libres y Cuerpos Cetónicos",
        "fuelProducedOrExported": "Alanina, Glutamina, Lactato",
        "keyEnzymes": [
          {
            "name": "Vía Ubiquitina-Proteasoma",
            "abbreviation": "UPS",
            "pathway": "Proteólisis Muscular",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Activada por cortisol y baja insulina (desrepresión de factores FOXO). Degrada proteínas miofibrilares."
          },
          {
            "name": "β-Cetoacil-CoA Transferasa (Tioforasa)",
            "abbreviation": "SCOT",
            "pathway": "Cetólisis",
            "cellularLocation": "Mitocondria",
            "status": "activa",
            "mechanism": "Permite al músculo utilizar acetoacetato convirtiéndolo en acetoacetil-CoA para entrar al ciclo de Krebs."
          }
        ],
        "activePathways": [
          "Proteólisis muscular",
          "Cetólisis muscular",
          "Beta-oxidación"
        ],
        "inhibitedPathways": [
          "Síntesis de proteínas",
          "Captación de glucosa"
        ],
        "transportersActive": [
          "MCT1",
          "CD36"
        ],
        "physiologicalNote": "Se pierden ~75g de proteína muscular al día en esta fase inicial para alimentar la gluconeogénesis.",
        "atpGenerationStrategy": "Beta-oxidación y cetólisis."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo",
        "emoji": "🧬",
        "roleSummary": "Lipólisis a velocidad máxima.",
        "primaryFuelUsed": "AGL propios",
        "fuelProducedOrExported": "Flujo torrencial de AGL hacia hígado y músculo; Glicerol hacia hígado",
        "keyEnzymes": [
          {
            "name": "HSL / ATGL",
            "abbreviation": "HSL/ATGL",
            "pathway": "Lipólisis",
            "cellularLocation": "Gota Lipídica",
            "status": "muy_activa",
            "mechanism": "Completamente fosforiladas por PKA; perilipina dispersa."
          }
        ],
        "activePathways": [
          "Lipólisis máxima"
        ],
        "inhibitedPathways": [
          "Cualquier síntesis o almacenamiento"
        ],
        "transportersActive": [
          "CD36",
          "Aquaporina-7"
        ],
        "physiologicalNote": "El tejido adiposo sostiene el 80-90% de los requerimientos calóricos corporales.",
        "atpGenerationStrategy": "Oxidación residual."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Inicio de ceto-adaptación; comienza a captar cuerpos cetónicos vía transportadores MCT1/MCT2.",
        "primaryFuelUsed": "Glucosa (~75%) y Cuerpos Cetónicos (~25%, creciente)",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Transportadores de Monocarboxilato",
            "abbreviation": "MCT1 / MCT2",
            "pathway": "Captación de Cuerpos Cetónicos",
            "cellularLocation": "Membrana BHE y Neuronal",
            "status": "activa",
            "mechanism": "Inducción paulatina en endotelio cerebral al superar la cetonemia los 2 mM."
          },
          {
            "name": "Tioforasa Cerebral (SCOT)",
            "abbreviation": "SCOT",
            "pathway": "Cetólisis Neuronal",
            "cellularLocation": "Mitocondria",
            "status": "activa",
            "mechanism": "Activa el acetoacetato a acetoacetil-CoA (cediéndole el CoA del succinil-CoA); la tiolasa lo escinde en 2 Acetil-CoA."
          }
        ],
        "activePathways": [
          "Cetólisis incipiente",
          "Glucólisis con glucosa gluconeogénica"
        ],
        "inhibitedPathways": [
          "Lipólisis"
        ],
        "transportersActive": [
          "GLUT1",
          "GLUT3",
          "MCT1",
          "MCT2"
        ],
        "physiologicalNote": "Este cambio a cuerpos cetónicos comienza a reducir la necesidad absoluta de glucosa cerebral, aliviando la proteólisis.",
        "atpGenerationStrategy": "Oxidación combinada glucosa + cuerpos cetónicos."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Aumento progresivo de la gluconeogénesis renal (~20-25% del total corporal).",
        "primaryFuelUsed": "Ácidos grasos y glutamina",
        "fuelProducedOrExported": "Glucosa libre a la circulación",
        "keyEnzymes": [
          {
            "name": "Glutaminasa Renal & PEPCK",
            "abbreviation": "GLS / PEPCK",
            "pathway": "Gluconeogénesis & Amoniogénesis",
            "cellularLocation": "Mitocondria / Citosol",
            "status": "muy_activa",
            "mechanism": "La glutaminasa libera NH4+ y glutamato; la glutamato deshidrogenasa genera un segundo NH4+ y α-cetoglutarato, sustrato de la gluconeogénesis. El NH4+ excretado elimina protones en la orina."
          }
        ],
        "activePathways": [
          "Gluconeogénesis renal",
          "Excreción de amonio"
        ],
        "inhibitedPathways": [
          "Glucólisis cortical",
          "Lipogénesis"
        ],
        "transportersActive": [
          "GLUT2"
        ],
        "physiologicalNote": "El riñón ayuda al hígado en la producción de glucosa y compensa la carga ácida de los cuerpos cetónicos.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Quema masiva de cuerpos cetónicos y ácidos grasos.",
        "primaryFuelUsed": "Cuerpos cetónicos y AGL",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Succinil-CoA:3-Cetoácido CoA Transferasa (SCOT / Tioforasa)",
            "abbreviation": "SCOT / OXCT1",
            "pathway": "Cetólisis Miocárdica",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Enzima limitante de la cetólisis: transfiere la coenzima A del succinil-CoA al acetoacetato para formar acetoacetil-CoA y succinato. El corazón posee la mayor concentración de SCOT del cuerpo (el hígado carece de ella)."
          },
          {
            "name": "Beta-Hidroxibutirato Deshidrogenasa 1 (BDH1)",
            "abbreviation": "BDH1",
            "pathway": "Activación de Cuerpos Cetónicos",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Oxida el D-beta-hidroxibutirato sanguíneo a acetoacetato generando NADH intramitocondrial para la cadena respiratoria."
          },
          {
            "name": "Acetoacetil-CoA Tiolasa Mitocondrial (ACAT1 / T2)",
            "abbreviation": "ACAT1 / Tiolasa",
            "pathway": "Generación de Acetil-CoA para Krebs",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Escinde acetoacetil-CoA en 2 moléculas de Acetil-CoA que entran directamente al ciclo del ácido cítrico miocárdico."
          },
          {
            "name": "Carnitina Palmitoiltransferasa 1B (CPT-1B cardíaca)",
            "abbreviation": "CPT-1B",
            "pathway": "Beta-Oxidación de Ácidos Grasos",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "muy_activa",
            "mechanism": "Mantiene una entrada constante de AGL mitocondriales en paralelo al consumo de cuerpos cetónicos."
          }
        ],
        "activePathways": [
          "Cetólisis miocárdica",
          "Beta-oxidación"
        ],
        "inhibitedPathways": [
          "Glucólisis"
        ],
        "transportersActive": [
          "MCT1",
          "CD36"
        ],
        "physiologicalNote": "El corazón es uno de los consumidores más eficientes de acetoacetato del organismo.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Glucagón marcadamente elevado.",
        "primaryFuelUsed": "Basal",
        "fuelProducedOrExported": "Glucagón",
        "keyEnzymes": [
          {
            "name": "Canales K-ATP de Células Beta",
            "abbreviation": "Canal K-ATP",
            "pathway": "Regulación del Tono Basal",
            "cellularLocation": "Membrana Plasmática",
            "status": "activa",
            "mechanism": "Mantiene la secreción de insulina en su mínimo basal fisiológico indispensable para evitar una cetogénesis descontrolada."
          },
          {
            "name": "Proconvertasa 2 (PC2 en Células Alfa)",
            "abbreviation": "PC2",
            "pathway": "Secreción de Glucagón",
            "cellularLocation": "Células Alfa",
            "status": "muy_activa",
            "mechanism": "Mantiene una elevación tónica de glucagón portal para sostener la gluconeogénesis hepática y la lipólisis adiposa."
          }
        ],
        "activePathways": [
          "Secreción tónica de glucagón",
          "Mantenimiento del tono basal de insulina de seguridad"
        ],
        "inhibitedPathways": [
          "Biosíntesis y secreción de insulina estimulada por nutrientes"
        ],
        "transportersActive": [
          "GLUT2",
          "Canales K-ATP"
        ],
        "physiologicalNote": "Mantiene una minúscula secreción de insulina basal que previene cetoacidosis descontrolada.",
        "atpGenerationStrategy": "Basal."
      }
    },
    "fluxes": [
      {
        "id": "liver-to-blood-ketones",
        "sourceOrgan": "liver",
        "targetOrgan": "brain",
        "substrate": "ketone_bodies",
        "substrateName": "Cuerpos Cetónicos",
        "rate": "alto",
        "directionDescription": "Hígado -> Circulación -> Cerebro y Músculo",
        "biochemicalPurpose": "Combustible soluble sustituto de glucosa sintetizado en mitocondria hepática",
        "pathwayInvolved": "Cetogénesis hepática (mHMGCS)"
      },
      {
        "id": "muscle-to-liver-aminoacids",
        "sourceOrgan": "muscle",
        "targetOrgan": "liver",
        "substrate": "amino_acids",
        "substrateName": "Alanina y Glutamina",
        "rate": "alto",
        "directionDescription": "Músculo Esquelético -> Hígado",
        "biochemicalPurpose": "Suministro de esqueletos carbonados para gluconeogénesis hepática",
        "pathwayInvolved": "Proteólisis muscular mediada por ubiquitina-proteasoma"
      },
      {
        "id": "adipose-to-liver-ffa-massive",
        "sourceOrgan": "adipose",
        "targetOrgan": "liver",
        "substrate": "free_fatty_acids",
        "substrateName": "Ácidos Grasos Libres",
        "rate": "masivo",
        "directionDescription": "Tejido Adiposo -> Hígado",
        "biochemicalPurpose": "Sustrato para beta-oxidación y generación de Acetil-CoA para cetogénesis",
        "pathwayInvolved": "Lipólisis por HSL activa"
      },
      {
        "id": "liver-to-kidney-urea",
        "sourceOrgan": "liver",
        "targetOrgan": "kidney",
        "substrate": "urea",
        "substrateName": "Urea",
        "rate": "alto",
        "directionDescription": "Hígado -> Sangre -> Riñón",
        "biochemicalPurpose": "Eliminación del nitrógeno amínico proveniente de la degradación muscular",
        "pathwayInvolved": "Ciclo de la Urea mitocondrial/citosólico"
      }
    ],
    "hallmarkFeatures": [
      "Glucógeno hepático prácticamente agotado (hacia las 24-36 horas)",
      "Gluconeogénesis hepática y renal mantienen la glucemia exclusiva",
      "Pico de catabolismo proteico muscular (~75 g/día) y de excreción urinaria de urea",
      "Cetogénesis hepática creciente: de ~0.3 mM a las 24 h a 2-3 mM a las 72 h"
    ],
    "clinicalOrPhysiologicalContext": "Situación observada en ayunos voluntarios prolongados o huelgas de hambre tempranas. Es la fase con mayor pérdida de masa magra antes de que el organismo monte la adaptación de ahorro proteico.",
    "keyRegulatorySwitch": {
      "title": "Desvío de Oxaloacetato a Gluconeogénesis y Activación de Cetogénesis",
      "description": "La elevada actividad de PEPCK consume oxaloacetato citosólico (vía lanzadera malato), disminuyendo el oxaloacetato mitocondrial. El Acetil-CoA masivo producido por la beta-oxidación ya no puede condensarse eficientemente con oxaloacetato para entrar al ciclo de Krebs. El exceso de Acetil-CoA activa alostéricamente a la Piruvato Carboxilasa y se desvía a la HMG-CoA Sintasa mitocondrial para formar cuerpos cetónicos.",
      "enzyme": "HMG-CoA Sintasa Mitocondrial & Piruvato Carboxilasa",
      "allostericOrCovalent": "Alosterismo por Acetil-CoA + Inducción transcripcional de PEPCK"
    }
  },
  "starvation": {
    "id": "starvation",
    "title": "Inanición Extrema (Ceto-Adaptación)",
    "subtitle": "> 72 horas hasta varias semanas sin ingesta calórica",
    "category": "Ayuno & Inanición",
    "timeframe": "> 3 días a semanas",
    "summary": "Adaptación metabólica de supervivencia con ahorro proteico. El cerebro se ceto-adapta y cubre hasta el 65-70% de sus requerimientos oxidando β-hidroxibutirato y acetoacetato. La proteólisis muscular disminuye drásticamente (de 75g a ~20g/día) para preservar la masa magra vital (diafragma y corazón). El tejido adiposo sostiene casi todo el gasto calórico restante.",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "muy_bajo",
        "valueText": "Mínima (< 2 μU/mL)",
        "percent": 2,
        "color": "#059669",
        "sourceOrgan": "Células β pancreáticas",
        "primaryAction": "Nivel mínimo suficiente para frenar una cetogénesis infinita."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "elevado",
        "valueText": "Moderadamente elevado (~90 - 110 pg/mL; desciende tras el pico del día 3)",
        "percent": 60,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas",
        "primaryAction": "Mantiene activa la transcripción gluconeogénica; el muy bajo nivel de insulina pesa más que el glucagón en esta fase."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "elevado",
        "valueText": "Elevada",
        "percent": 50,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal",
        "primaryAction": "Estímulo de lipólisis periférica sostenida."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "normal",
        "valueText": "Disminuido respecto al día 2",
        "percent": 40,
        "color": "#6366f1",
        "sourceOrgan": "Corteza suprarrenal",
        "primaryAction": "Su menor nivel relativo ayuda a frenar la destrucción acelerada de masa muscular."
      },
      "ampkActivity": {
        "status": "máxima",
        "description": "Máxima activación global de supervivencia celular y autofagia.",
        "percent": 90
      },
      "igRatio": {
        "ratio": 0.3,
        "text": "Muy bajo (~0,3, molar)",
        "state": "muy_bajo"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "60 - 68 mg/dL",
        "normalRange": "70 - 99 mg/dL",
        "status": "disminuido",
        "unit": "mg/dL",
        "description": "Mantenida en meseta mínima segura."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos Plasmáticos",
        "valueText": "6.0 - 8.0 mM",
        "normalRange": "< 0.2 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Cetonemia de inanición fisiológica (β-hidroxibutirato predominante)."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "1.5 - 2.0 mM",
        "normalRange": "0.3 - 0.6 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Saturación de los sitios de unión de la albúmina sérica."
      },
      {
        "id": "urea",
        "name": "Urea Urinaria (Excreción de Nitrógeno)",
        "valueText": "Muy Reducida (~5 g urea/24h; el NH4+ urinario gana peso)",
        "normalRange": "15 - 30 g/24h",
        "status": "muy_disminuido",
        "unit": "g/24h",
        "description": "Caída drástica respecto al ayuno temprano, reflejando el ahorro proteico muscular."
      },
      {
        "id": "glycerol",
        "name": "Glicerol",
        "valueText": "0.40 - 0.60 mM",
        "normalRange": "0.05 - 0.1 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Principal donante de carbono gluconeogénico libre de nitrógeno."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Atrofia mucosa por falta de nutrientes luminales.",
        "primaryFuelUsed": "Cuerpos cetónicos",
        "fuelProducedOrExported": "Ninguno",
        "keyEnzymes": [
          {
            "name": "Succinil-CoA Transferasa Enterocítica (SCOT)",
            "abbreviation": "SCOT",
            "pathway": "Cetólisis de Inanición",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "Oxida cuerpos cetónicos plasmáticos como sustrato energético primordial ante la ausencia absoluta de nutrientes luminales."
          },
          {
            "name": "Sistema de Autofagia y Lisosomas (LC3 / Atg)",
            "abbreviation": "Autofagia epitelial",
            "pathway": "Reciclaje Macromolecular",
            "cellularLocation": "Citosol / Lisosoma",
            "status": "muy_activa",
            "mechanism": "Degrada componentes celulares no esenciales para mantener la viabilidad de la barrera intestinal frente a la translocación bacteriana."
          }
        ],
        "activePathways": [
          "Cetólisis enterocítica máxima",
          "Autofagia protectora de la barrera epitelial",
          "Oxidación de glutamina residual"
        ],
        "inhibitedPathways": [
          "Absorción y digestión luminal",
          "Secreción de moco hipertrófico"
        ],
        "transportersActive": [
          "MCT1",
          "ASCT2"
        ],
        "physiologicalNote": "Usa cuerpos cetónicos como combustible para sobrevivir.",
        "atpGenerationStrategy": "Cetólisis."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Cetogénesis máxima continua; gluconeogénesis ajustada con menor uso de aminoácidos.",
        "primaryFuelUsed": "Beta-oxidación lipídica",
        "fuelProducedOrExported": "Cuerpos Cetónicos masivos y Glucosa sintetizada desde glicerol, lactato/piruvato reciclados y una cantidad reducida de aminoácidos",
        "keyEnzymes": [
          {
            "name": "HMG-CoA Sintasa Mitocondrial",
            "abbreviation": "mHMGCS",
            "pathway": "Cetogénesis",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "Expresión máxima continua."
          },
          {
            "name": "Glicerol Quinasa",
            "abbreviation": "GK",
            "pathway": "Gluconeogénesis desde Glicerol",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Fosforila glicerol adipocitario a glicerol-3-P para formar DHAP (ahorra aminoácidos musculares)."
          }
        ],
        "activePathways": [
          "Cetogénesis extrema",
          "Gluconeogénesis selectiva desde glicerol y lactato",
          "Beta-oxidación"
        ],
        "inhibitedPathways": [
          "Ciclo de la urea a alta tasa (ahorro de nitrógeno)"
        ],
        "transportersActive": [
          "MCT",
          "GLUT2"
        ],
        "physiologicalNote": "El hígado produce hasta 150g de cuerpos cetónicos al día.",
        "atpGenerationStrategy": "Beta-oxidación."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético",
        "emoji": "💪",
        "roleSummary": "Ahorro proteico de supervivencia: la proteólisis se frena drásticamente.",
        "primaryFuelUsed": "Ácidos Grasos Libres casi exclusivamente (reduce el uso de cetonas)",
        "fuelProducedOrExported": "Baja liberación de alanina (~20g/día)",
        "keyEnzymes": [
          {
            "name": "Vía Ubiquitina-Proteasoma",
            "abbreviation": "UPS",
            "pathway": "Proteólisis",
            "cellularLocation": "Citosol",
            "status": "inhibida",
            "mechanism": "Reducción adaptativa de su actividad (proteólisis de ~75 a ~20 g/día), que retrasa el fallo de la musculatura respiratoria."
          }
        ],
        "activePathways": [
          "Beta-oxidación de AGL",
          "Ahorro proteico"
        ],
        "inhibitedPathways": [
          "Cetólisis muscular reducida (deja más cuerpos cetónicos disponibles para el cerebro)"
        ],
        "transportersActive": [
          "CD36"
        ],
        "physiologicalNote": "Tras unas semanas el músculo reduce mucho su consumo de cuerpos cetónicos, lo que contribuye a que su concentración plasmática suba y el cerebro los capte en mayor proporción.",
        "atpGenerationStrategy": "Beta-oxidación de AGL."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo",
        "emoji": "🧬",
        "roleSummary": "Única gran reserva calórica remanente; se consume hasta la caquexia.",
        "primaryFuelUsed": "AGL propios",
        "fuelProducedOrExported": "AGL y Glicerol continuos",
        "keyEnzymes": [
          {
            "name": "Lipasa de Triglicéridos Adipocitaria (ATGL)",
            "abbreviation": "ATGL",
            "pathway": "Lipólisis de Inanición",
            "cellularLocation": "Superficie de Gota Lipídica",
            "status": "muy_activa",
            "mechanism": "Realiza el paso inicial limitante hidrolizando triglicéridos a diglicéridos en respuesta a la ausencia prolongada de insulina."
          },
          {
            "name": "Lipasa Sensible a Hormonas (HSL)",
            "abbreviation": "HSL",
            "pathway": "Lipólisis de Inanición",
            "cellularLocation": "Gota Lipídica",
            "status": "muy_activa",
            "mechanism": "Fosforilada y activada por PKA; hidroliza diglicéridos a monoglicéridos liberando AGL al torrente circulatorio."
          },
          {
            "name": "Glicerol Quinasa Adipocitaria",
            "abbreviation": "GK adiposa",
            "pathway": "Reciclaje de Glicerol",
            "cellularLocation": "Citosol",
            "status": "inhibida",
            "mechanism": "Constitutivamente ausente en tejido adiposo blanco; obliga a exportar el 100% del glicerol liberado al hígado para gluconeogénesis."
          }
        ],
        "activePathways": [
          "Lipólisis máxima sostenida (ATGL, HSL, MGL)",
          "Exportación continua de AGL y glicerol"
        ],
        "inhibitedPathways": [
          "Lipogénesis de novo",
          "Reesterificación de triglicéridos"
        ],
        "transportersActive": [
          "FATP (flujo eferente)",
          "Acuaporina-7 (canal de salida de glicerol)"
        ],
        "physiologicalNote": "Un individuo de 70kg con 15kg de grasa posee ~135,000 kcal en tejido adiposo, suficientes para 60-90 días de supervivencia.",
        "atpGenerationStrategy": "Oxidación residual."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Ceto-adaptación completa: oxida β-hidroxibutirato y acetoacetato para el ~65-70% de su energía.",
        "primaryFuelUsed": "Cuerpos Cetónicos (~65-70%) y Glucosa (~30-35%)",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Transportador MCT1 / MCT2",
            "abbreviation": "MCT1/2",
            "pathway": "Transporte de Cetonas BHE",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "Máximo aumento de expresión en la barrera hematoencefálica inducido por la cetonemia crónica."
          },
          {
            "name": "β-Hidroxibutirato Deshidrogenasa & Tioforasa",
            "abbreviation": "BDH1 / SCOT",
            "pathway": "Cetólisis Cerebral",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "Convierte β-hidroxibutirato en acetoacetato, y luego en dos Acetil-CoA para el ciclo de Krebs."
          }
        ],
        "activePathways": [
          "Cetólisis cerebral predominante",
          "Glucólisis reducida al mínimo indispensable"
        ],
        "inhibitedPathways": [
          "Consumo exclusivo de glucosa (las cetonas cubren >60-70% del ATP cerebral)"
        ],
        "transportersActive": [
          "MCT1",
          "MCT2",
          "GLUT1",
          "GLUT3"
        ],
        "physiologicalNote": "El consumo cerebral de glucosa cae de 120g/día a solo ~40g/día. Esta reducción es lo que permite que el organismo no tenga que destruir sus propios músculos.",
        "atpGenerationStrategy": "Oxidación de cuerpos cetónicos y glucosa en ciclo de Krebs."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Genera hasta el 40-50% de la glucosa circulante total mediante gluconeogénesis.",
        "primaryFuelUsed": "Ácidos grasos y glutamina",
        "fuelProducedOrExported": "Glucosa libre producida en corteza renal",
        "keyEnzymes": [
          {
            "name": "Glutaminasa & PEPCK Renal",
            "abbreviation": "GLS / PEPCK",
            "pathway": "Gluconeogénesis & Amoniogénesis",
            "cellularLocation": "Citosol / Mitocondria",
            "status": "muy_activa",
            "mechanism": "Excreta NH4+ urinario para amortiguar cetoácidos mientras genera glucosa."
          }
        ],
        "activePathways": [
          "Gluconeogénesis renal máxima",
          "Amortiguación ácida con NH4+"
        ],
        "inhibitedPathways": [
          "Glucólisis cortical",
          "Lipogénesis"
        ],
        "transportersActive": [
          "GLUT2"
        ],
        "physiologicalNote": "La corteza renal rivaliza con el hígado en producción de glucosa durante la inanición prolongada.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Consume preferentemente ácidos grasos y cetonas; preservación estricta de proteínas contráctiles.",
        "primaryFuelUsed": "AGL y Cuerpos Cetónicos",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Succinil-CoA:3-Cetoácido CoA Transferasa (SCOT / Tioforasa)",
            "abbreviation": "SCOT / OXCT1",
            "pathway": "Cetólisis de Inanición",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Mantiene la cetólisis como combustible preferencial ahorrador de ácidos grasos y reservas tisulares de aminoácidos."
          },
          {
            "name": "Carnitina Palmitoiltransferasa 1B (CPT-1B cardíaca)",
            "abbreviation": "CPT-1B",
            "pathway": "Beta-Oxidación de Supervivencia",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "muy_activa",
            "mechanism": "Oxidación continua de los ácidos grasos libres movilizados desde el tejido adiposo residual."
          },
          {
            "name": "AMPK Miocárdica (AMP-Activated Protein Kinase)",
            "abbreviation": "AMPK",
            "pathway": "Mantenimiento del Balance Energético",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Censa el cociente AMP/ATP para sostener la captación de sustratos y reprimir rutas anabólicas dispensables."
          },
          {
            "name": "Sistema Ubiquitina-Proteasoma Miocárdico",
            "abbreviation": "Proteasoma Cardíaco",
            "pathway": "Proteólisis Estructural",
            "cellularLocation": "Citosol",
            "status": "inhibida",
            "mechanism": "El corazón resiste la degradación de sus proteínas sarcoméricas (actina/miosina); su catabolismo solo se desencadena en la fase terminal irreversible de la inanición."
          }
        ],
        "activePathways": [
          "Beta-oxidación y Cetólisis"
        ],
        "inhibitedPathways": [
          "Glucólisis"
        ],
        "transportersActive": [
          "CD36",
          "MCT1"
        ],
        "physiologicalNote": "La muerte por inanición extrema suele sobrevenir cuando se agota la grasa y se catabolizan las proteínas cardíacas (arritmia / fallo de bomba).",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Mínima secreción insulínica de salvaguarda.",
        "primaryFuelUsed": "Basal",
        "fuelProducedOrExported": "Glucagón",
        "keyEnzymes": [
          {
            "name": "Canales K-ATP de Células Beta",
            "abbreviation": "Canal K-ATP",
            "pathway": "Freno Antilipolítico Basal de Salvaguarda",
            "cellularLocation": "Membrana Plasmática",
            "status": "activa",
            "mechanism": "Mantiene un pulso mínimo de insulina basal (2-4 uU/mL) que evita la lipólisis fulminante incontrolada, diferenciando el ayuno fisiológico de la cetoacidosis."
          },
          {
            "name": "Proconvertasa 2 (PC2 en Células Alfa)",
            "abbreviation": "PC2",
            "pathway": "Secreción de Glucagón",
            "cellularLocation": "Células Alfa",
            "status": "muy_activa",
            "mechanism": "Glucagón plasmático persistentemente elevado para sostener la cetogénesis hepática."
          }
        ],
        "activePathways": [
          "Secreción de glucagón",
          "Mantenimiento del tono basal mínimo antilipolítico de insulina"
        ],
        "inhibitedPathways": [
          "Biosíntesis de proinsulina estimulada por nutrientes"
        ],
        "transportersActive": [
          "GLUT2",
          "Canales K-ATP"
        ],
        "physiologicalNote": "Evita el colapso acidótico manteniendo un mínimo freno lipolítico.",
        "atpGenerationStrategy": "Basal."
      }
    },
    "fluxes": [
      {
        "id": "liver-to-brain-ketones-massive",
        "sourceOrgan": "liver",
        "targetOrgan": "brain",
        "substrate": "ketone_bodies",
        "substrateName": "β-Hidroxibutirato y Acetoacetato",
        "rate": "masivo",
        "directionDescription": "Hígado -> Barrera Hematoencefálica (MCT1) -> Neuronas",
        "biochemicalPurpose": "Cubre el 65-70% del metabolismo oxidativo del SNC, salvando la masa proteica del cuerpo",
        "pathwayInvolved": "Aumento de MCT1/MCT2 y cetólisis vía SCOT"
      },
      {
        "id": "adipose-to-liver-glycerol-starv",
        "sourceOrgan": "adipose",
        "targetOrgan": "liver",
        "substrate": "glycerol",
        "substrateName": "Glicerol Adipocitario",
        "rate": "alto",
        "directionDescription": "Tejido Adiposo -> Hígado y Riñón",
        "biochemicalPurpose": "Donante neto de carbono para glucosa que no requiere proteólisis muscular",
        "pathwayInvolved": "Gluconeogénesis vía Glicerol-3-P y DHAP"
      },
      {
        "id": "kidney-to-blood-glucose-starv",
        "sourceOrgan": "kidney",
        "targetOrgan": "brain",
        "substrate": "glucose",
        "substrateName": "Glucosa Renal",
        "rate": "moderado",
        "directionDescription": "Corteza Renal -> Sangre -> SNC y Eritrocitos",
        "biochemicalPurpose": "Aporte de hasta el 40% de la glucosa circulante total",
        "pathwayInvolved": "Gluconeogénesis renal acoplada a excreción de NH4+"
      }
    ],
    "hallmarkFeatures": [
      "Ceto-adaptación cerebral completa (~70% de energía proviene de cuerpos cetónicos)",
      "Ahorro proteico muscular vital (la excreción de urea cae a ~5 g/día)",
      "La gluconeogénesis renal aporta hasta el 40% de la glucosa restante",
      "El glicerol adipocitario gana peso como sustrato gluconeogénico neto (comparable al de los aminoácidos), reduciendo la dependencia de la proteólisis"
    ],
    "clinicalOrPhysiologicalContext": "Maravilla adaptativa evolutiva humana que permite sobrevivir hasta 2 meses sin alimento siempre que haya agua y electrolitos. El fin de la supervivencia ocurre cuando el tejido adiposo desciende a < 5%, forzando una proteólisis terminal destructiva.",
    "keyRegulatorySwitch": {
      "title": "Inducción de Transportadores MCT y Represión de Proteólisis por FOXO",
      "description": "El cerebro sobreexpresa transportadores MCT1 y MCT2 en la BHE y enzimas cetolíticas (SCOT y β-hidroxibutirato deshidrogenasa). En el músculo, la caída del cortisol y la preservación basal insulínica atenúan la transcripción de las ligasas de ubiquitina MuRF1 y MAFbx, reduciendo la proteólisis.",
      "enzyme": "MCT1/2 en BHE & E3 Ubiquitina Ligasas Musculares",
      "allostericOrCovalent": "Inducción y represión transcripcional adaptativa"
    }
  },
  "insulin_resistance": {
    "id": "insulin_resistance",
    "title": "Resistencia a la Insulina & Síndrome Metabólico",
    "subtitle": "Fallo de transducción de señal del receptor de insulina (IRS-1 / Akt)",
    "category": "Patología Clínica",
    "timeframe": "Estado Crónico",
    "summary": "Defecto post-receptor en la cascada IRS-1 / PI3K / Akt provocado por lipotoxicidad (ceramidas, diacilgliceroles) y citoquinas inflamatorias. Provoca un fallo en la translocación de GLUT4 en músculo y falta de supresión de la gluconeogénesis hepática (hiperglucemia en ayunas). Paradójicamente, la vía lipogénica hepática (SREBP-1c) permanece activa bajo hiperinsulinemia compensatoria, causando esteatosis hepática e hipertrigliceridemia.",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "muy_elevado",
        "valueText": "Hiperinsulinemia: 15 - 40 μU/mL en ayunas; > 100 μU/mL posprandial",
        "percent": 95,
        "color": "#7c3aed",
        "sourceOrgan": "Células β pancreáticas hipersecretoras",
        "primaryAction": "Resistencia en vías metabólicas (Akt), pero sensibilidad conservada en vías mitogénicas (MAPK/ERK)."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "elevado",
        "valueText": "Inadecuadamente elevado (90 - 130 pg/mL)",
        "percent": 70,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas resistentes a insulina",
        "primaryAction": "Las células alfa pancreáticas resistentes a la insulina no sufren la inhibición paracrina normal, sobreproduciendo glucagón."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "normal",
        "valueText": "Basal o ligeramente elevada",
        "percent": 25,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal",
        "primaryAction": "Tono simpático elevado en síndrome metabólico."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "normal",
        "valueText": "Normal / Hiperactividad 11β-HSD1 visceral",
        "percent": 45,
        "color": "#6366f1",
        "sourceOrgan": "Tejido adiposo visceral y suprarrenales",
        "primaryAction": "Conversión local de cortisona a cortisol activo en grasa visceral."
      },
      "ampkActivity": {
        "status": "baja",
        "description": "Reprimida en hígado y músculo por sobrecarga de nutrientes y sedentarismo.",
        "percent": 15
      },
      "igRatio": {
        "ratio": 5,
        "text": "Alto en ayunas (~5, molar) pero ineficaz por resistencia tisular",
        "state": "alto"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "100 - 125 mg/dL en ayunas / 140 - 199 mg/dL a las 2 h de una SOG",
        "normalRange": "70 - 99 mg/dL",
        "status": "elevado",
        "unit": "mg/dL",
        "description": "Glucemia basal alterada (100-125 mg/dL) o intolerancia a la glucosa (140-199 mg/dL a las 2 h); ≥ 126 en ayunas ya es diabetes."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "0.8 - 1.2 mM",
        "normalRange": "0.3 - 0.6 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Lipólisis no suprimida en tejido adiposo visceral."
      },
      {
        "id": "vldl_chylomicrons",
        "name": "Triglicéridos Plasmáticos (VLDL)",
        "valueText": "200 - 380 mg/dL",
        "normalRange": "< 150 mg/dL",
        "status": "muy_elevado",
        "unit": "mg/dL",
        "description": "Hipertrigliceridemia por sobreproducción hepática de VLDL y menor aclaramiento."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos",
        "valueText": "< 0.2 mM (Normales)",
        "normalRange": "< 0.2 mM",
        "status": "normal",
        "unit": "mM",
        "description": "La hiperinsulinemia compensatoria es suficiente para bloquear la cetogénesis (no hay cetoacidosis)."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Absorción rápida de carbohidratos y alteración del eje de incretinas.",
        "primaryFuelUsed": "Glucosa",
        "fuelProducedOrExported": "Quilomicrones ricos en apoB48",
        "keyEnzymes": [
          {
            "name": "Dipeptidil Peptidasa-4 (DPP-4 de Borde en Cepillo)",
            "abbreviation": "DPP-4",
            "pathway": "Inactivación de Incretinas",
            "cellularLocation": "Membrana de Enterocitos",
            "status": "muy_activa",
            "mechanism": "Degrada rápidamente al GLP-1 y GIP biológicamente activos, amortiguando el efecto incretina fisiológico."
          },
          {
            "name": "Proteína Microsomal de Transferencia de Triglicéridos (MTP)",
            "abbreviation": "MTP",
            "pathway": "Secreción Lipídica Intestinal",
            "cellularLocation": "Retículo Endoplásmico",
            "status": "muy_activa",
            "mechanism": "Sobreproducción masiva y empaquetamiento acelerado de quilomicrones ricos en apoB-48 tras la ingesta hipercalórica."
          },
          {
            "name": "Cotransportador Na+/Glucosa 1 (SGLT1)",
            "abbreviation": "SGLT1",
            "pathway": "Absorción Acelerada de Glucosa",
            "cellularLocation": "Borde en Cepillo Apical",
            "status": "muy_activa",
            "mechanism": "Sobreexpresado crónicamente por la dieta rica en azúcares refinados, acelerando los picos de glucemia posprandial."
          }
        ],
        "activePathways": [
          "Hiperabsorción de monosacáridos (SGLT1/GLUT2)",
          "Sobreproducción de quilomicrones aterogénicos",
          "Inactivación rápida de incretinas por DPP-4"
        ],
        "inhibitedPathways": [
          "Sensibilidad fisiológica a las señales de saciedad mediadas por incretinas"
        ],
        "transportersActive": [
          "SGLT1",
          "GLUT2",
          "GLUT5",
          "Pept1"
        ],
        "physiologicalNote": "La disfunción del eje enteroinsular agrava la hiperglucemia posprandial.",
        "atpGenerationStrategy": "Glucólisis."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Paradoja metabólica hepática: resistencia para gluconeogénesis, pero sensibilidad para lipogénesis.",
        "primaryFuelUsed": "Glucosa y AGL",
        "fuelProducedOrExported": "Glucosa continua (gluconeogénesis no suprimida) y VLDL masivo (esteatosis hepática)",
        "keyEnzymes": [
          {
            "name": "PEPCK y Glucosa-6-Fosfatasa",
            "abbreviation": "PEPCK / G6Pasa",
            "pathway": "Gluconeogénesis",
            "cellularLocation": "Citosol / RE",
            "status": "activa",
            "mechanism": "Fallo en la fosforilación de FOXO1 por Akt; FOXO1 entra al núcleo y transcribe enzimas gluconeogénicas a pesar de la hiperinsulinemia."
          },
          {
            "name": "SREBP-1c / ACC",
            "abbreviation": "SREBP-1c",
            "pathway": "Lipogénesis de Novo (DNL)",
            "cellularLocation": "Citosol / RE",
            "status": "muy_activa",
            "mechanism": "PARADOJA: La señal de mTORC1 estimulada por hiperinsulinemia activa SREBP-1c, generando esteatosis hepática (MASLD)."
          }
        ],
        "activePathways": [
          "Gluconeogénesis aberrante en ayunas",
          "Lipogénesis de novo sostenida",
          "Secreción masiva de VLDL"
        ],
        "inhibitedPathways": [
          "Almacenamiento eficiente de glucógeno"
        ],
        "transportersActive": [
          "GLUT2"
        ],
        "physiologicalNote": "Es el motor dual de la hiperglucemia basal y la dislipidemia aterogénica.",
        "atpGenerationStrategy": "Oxidación de grasas y glucosa."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético",
        "emoji": "💪",
        "roleSummary": "Defecto grave en la captación de glucosa mediada por GLUT4 (~80% de déficit periférico).",
        "primaryFuelUsed": "Ácidos Grasos Libres con flexibilidad metabólica perdida",
        "fuelProducedOrExported": "Retiene poco glucógeno",
        "keyEnzymes": [
          {
            "name": "IRS-1 (Fosforilación en Serina)",
            "abbreviation": "IRS-1 Ser-P",
            "pathway": "Señalización Insulínica",
            "cellularLocation": "Citosol",
            "status": "inhibida",
            "mechanism": "Ceramidas, DAG y quinasas inflamatorias (JNK, IKKβ, PKC-θ en músculo; PKC-ε en hígado) fosforilan a IRS-1 en residuos de serina en vez de tirosina, bloqueando la activación de PI3K y Akt."
          },
          {
            "name": "GLUT4",
            "abbreviation": "GLUT4",
            "pathway": "Translocación",
            "cellularLocation": "Vesículas intracelulares",
            "status": "inactiva",
            "mechanism": "Sin Akt activa no se fosforila AS160 (TBC1D4), cuyo dominio GAP sigue frenando la fusión de las vesículas de GLUT4 con la membrana."
          }
        ],
        "activePathways": [
          "Oxidación incompleta de AGL (lipotoxicidad intramiocelular)"
        ],
        "inhibitedPathways": [
          "Captación de glucosa GLUT4 mediada por insulina",
          "Glucogenogénesis muscular"
        ],
        "transportersActive": [
          "CD36"
        ],
        "physiologicalNote": "El ejercicio físico revierte esto porque activa GLUT4 a través de la vía alternativa de AMPK / CaMK, sorteando el receptor defectuoso.",
        "atpGenerationStrategy": "Beta-oxidación lipídica alterada."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo (Visceral)",
        "emoji": "🧬",
        "roleSummary": "Tejido hipertrófico e inflamado que libera continuamente AGL y citoquinas tóxicas.",
        "primaryFuelUsed": "Grasas",
        "fuelProducedOrExported": "AGL no suprimidos, TNF-α, IL-6, Leptina alta, Adiponectina baja",
        "keyEnzymes": [
          {
            "name": "HSL / ATGL Adipocitaria",
            "abbreviation": "HSL/ATGL",
            "pathway": "Lipólisis",
            "cellularLocation": "Gota Lipídica",
            "status": "activa",
            "mechanism": "Resistencia a la acción antilipolítica de la insulina; no se frena la hidrólisis de triglicéridos posprandial."
          }
        ],
        "activePathways": [
          "Lipólisis ininterrumpida",
          "Secreción de adipocinas proinflamatorias"
        ],
        "inhibitedPathways": [
          "Captación de glucosa vía GLUT4"
        ],
        "transportersActive": [
          "CD36"
        ],
        "physiologicalNote": "La grasa visceral drena a la vena porta y aporta al hígado una fracción de sus AGL (≈5-20 %, más en la obesidad visceral); la mayor parte procede del tejido adiposo subcutáneo.",
        "atpGenerationStrategy": "Oxidación lipídica."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Resistencia central a la insulina en el hipotálamo con alteración del control del apetito.",
        "primaryFuelUsed": "Glucosa",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Hexoquinasa 1 Cerebral (HK1)",
            "abbreviation": "HK1",
            "pathway": "Glucólisis Neuronal Independiente de Insulina",
            "cellularLocation": "Membrana Mitocondrial Externa Neuronal",
            "status": "muy_activa",
            "mechanism": "Capta y fosforila glucosa normalmente a través de GLUT1 y GLUT3; la glucólisis basal cortical permanece preservada."
          },
          {
            "name": "Receptor de Insulina Hipotalámico / IRS-2",
            "abbreviation": "IR-Hipotalámico",
            "pathway": "Señalización Central de Saciedad",
            "cellularLocation": "Núcleos Arcuato y Paraventricular",
            "status": "inhibida",
            "mechanism": "Resistencia central a la insulina; la insulina no logra inhibir a las neuronas orexigénicas NPY/AgRP ni activar a POMC, perpetuando el apetito y la ganancia ponderal."
          }
        ],
        "activePathways": [
          "Glucólisis aeróbica neuronal normal (GLUT1/GLUT3)",
          "Señalización orexigénica hipotalámica desinhibida (NPY/AgRP activos)"
        ],
        "inhibitedPathways": [
          "Señalización anorexigénica dependiente de insulina (eje POMC/CART reprimido)"
        ],
        "transportersActive": [
          "GLUT1 (BHE)",
          "GLUT3 (neuronas)"
        ],
        "physiologicalNote": "La resistencia central impide que la insulina señalice saciedad en los núcleos arcuato y paraventricular.",
        "atpGenerationStrategy": "Glucólisis aeróbica."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Hiperfiltración y mayor reabsorción de glucosa (aumento de SGLT2).",
        "primaryFuelUsed": "Grasas y glucosa",
        "fuelProducedOrExported": "Reabsorción aumentada",
        "keyEnzymes": [
          {
            "name": "SGLT2 Renal",
            "abbreviation": "SGLT2",
            "pathway": "Reabsorción Tubular",
            "cellularLocation": "Túbulo Contorneado Proximal",
            "status": "muy_activa",
            "mechanism": "Expresión aumentada que retiene más glucosa en sangre en vez de excretarla."
          }
        ],
        "activePathways": [
          "Hiperreabsorción tubular de glucosa y sodio (hipertensión)"
        ],
        "inhibitedPathways": [
          "Excreción fisiológica de glucosa (umbral de glucosuria elevado)"
        ],
        "transportersActive": [
          "SGLT2"
        ],
        "physiologicalNote": "Los fármacos inhibidores de SGLT2 (gliflozinas) actúan directamente bloqueando esta reabsorción excesiva.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Lipotoxicidad miocárdica e inflexibilidad metabólica.",
        "primaryFuelUsed": "AGL en exceso",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Carnitina Palmitoiltransferasa 1B (CPT-1B cardíaca)",
            "abbreviation": "CPT-1B",
            "pathway": "Sobrecarga de Beta-Oxidación",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "muy_activa",
            "mechanism": "Entrada continua y desregulada de AGL plasmáticos elevados; la sobrecarga oxidativa satura la cadena respiratoria y genera desacoplamiento mitocondrial y especies reactivas de oxígeno (ROS)."
          },
          {
            "name": "Piruvato Deshidrogenasa Quinasa 4 / PDH (PDK4)",
            "abbreviation": "PDK4 / PDH",
            "pathway": "Inflexibilidad Metabólica Cardíaca",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "inhibida",
            "mechanism": "Inactivación constitutiva de la PDH inducida por sobreexpresión de PDK4; el miocardio pierde la plasticidad para alternar entre glucosa y ácidos grasos tras la ingesta."
          },
          {
            "name": "Acetil-CoA Carboxilasa 2 Cardíaca (ACC2)",
            "abbreviation": "ACC2",
            "pathway": "Control de Malonil-CoA Mitocondrial",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "inhibida",
            "mechanism": "Inhibida funcionalmente por la resistencia a la insulina y estrés metabólico, perdiendo el freno de Malonil-CoA que normalmente modularía la CPT-1B."
          }
        ],
        "activePathways": [
          "Beta-oxidación con desacoplamiento mitocondrial"
        ],
        "inhibitedPathways": [
          "Oxidación de glucosa"
        ],
        "transportersActive": [
          "CD36"
        ],
        "physiologicalNote": "Predispone a miocardiopatía diabética temprana y disfunción diastólica.",
        "atpGenerationStrategy": "Oxidación lipídica ineficiente."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Hiperplasia e hipertrofia de células beta en fase compensatoria con estrés de retículo.",
        "primaryFuelUsed": "Metabolismo sensor forzado",
        "fuelProducedOrExported": "Altos pulsos de Insulina para vencer la resistencia tisular",
        "keyEnzymes": [
          {
            "name": "Glucoquinasa Pancreática & Canales K-ATP",
            "abbreviation": "GK / K-ATP",
            "pathway": "Metabolismo Sensor Forzado",
            "cellularLocation": "Células Beta",
            "status": "muy_activa",
            "mechanism": "Hiperglucemia persistente mantiene alta tasa de fosforilación y cierre constante de canales K-ATP con despolarización mantenida."
          },
          {
            "name": "Chaperonas BiP/GRP78 y Quinasa PERK (Estrés de Retículo)",
            "abbreviation": "BiP / PERK (UPR)",
            "pathway": "Respuesta a Proteínas Mal Plegadas",
            "cellularLocation": "Retículo Endoplásmico",
            "status": "muy_activa",
            "mechanism": "Activada crónicamente por la sobreproducción masiva de proinsulina; si la resistencia persiste, desencadena apoptosis de células beta."
          }
        ],
        "activePathways": [
          "Hipersecreción compensatoria masiva de insulina",
          "Estrés de retículo endoplásmico (UPR)",
          "Hiperplasia e hipertrofia de islotes beta"
        ],
        "inhibitedPathways": [
          "Freno paracrino normal sobre células alfa (hiperglucagonemia paradójica)"
        ],
        "transportersActive": [
          "GLUT2",
          "Canales Ca2+ dependientes de voltaje"
        ],
        "physiologicalNote": "Si la resistencia persiste durante años, el estrés de retículo y la lipotoxicidad provocan apoptosis de células beta, evolucionando a Diabetes Tipo 2 franca.",
        "atpGenerationStrategy": "Metabolismo celular hiperactivo."
      }
    },
    "fluxes": [
      {
        "id": "visceral-fat-to-liver-ffa",
        "sourceOrgan": "adipose",
        "targetOrgan": "liver",
        "substrate": "free_fatty_acids",
        "substrateName": "Ácidos Grasos Viscerales (Flujo Portal)",
        "rate": "alto",
        "directionDescription": "Grasa Visceral -> Vena Porta -> Hígado",
        "biochemicalPurpose": "Bombardeo lipotóxico que satura la capacidad oxidativa hepática e induce esteatosis",
        "pathwayInvolved": "Lipólisis desinhibida (la insulina no logra frenar la HSL/ATGL)"
      },
      {
        "id": "liver-to-blood-vldl-high",
        "sourceOrgan": "liver",
        "targetOrgan": "adipose",
        "substrate": "vldl_chylomicrons",
        "substrateName": "VLDL Ricas en Triglicéridos",
        "rate": "masivo",
        "directionDescription": "Hígado -> Sangre -> Vasos Periféricos",
        "biochemicalPurpose": "Dislipidemia aterogénica secundaria a lipogénesis de novo hiperactiva",
        "pathwayInvolved": "Inducción de SREBP-1c por hiperinsulinemia"
      },
      {
        "id": "liver-to-blood-glucose-unsuppressed",
        "sourceOrgan": "liver",
        "targetOrgan": "muscle",
        "substrate": "glucose",
        "substrateName": "Glucosa Gluconeogénica",
        "rate": "alto",
        "directionDescription": "Hígado -> Circulación Sistémica",
        "biochemicalPurpose": "Falta de supresión de la producción hepática de glucosa en ayunas (fallo de la exclusión nuclear de FOXO1)",
        "pathwayInvolved": "Transcripción aberrante de PEPCK y G6Pasa"
      }
    ],
    "hallmarkFeatures": [
      "Bloqueo de la cascada de señalización IRS-1/PI3K/Akt por fosforilación en serina mediada por ceramidas/DAG",
      "Fallo de translocación de GLUT4 en músculo esquelético",
      "Paradoja hepática: Resistencia para frenar la gluconeogénesis, pero sensibilidad para activar lipogénesis (esteatosis, MASLD)",
      "Lipólisis visceral desinhibida que inunda el hígado de ácidos grasos libres"
    ],
    "clinicalOrPhysiologicalContext": "Base fisiopatológica de la obesidad visceral, síndrome metabólico, enfermedad hepática esteatósica asociada a disfunción metabólica (MASLD) y su forma inflamatoria (MASH) y Diabetes Mellitus Tipo 2. El ejercicio regular es la intervención más eficaz porque sortea este defecto activando la captación de glucosa vía AMPK.",
    "keyRegulatorySwitch": {
      "title": "Fosforilación Inhibitoria de IRS-1 en Serina vs Tirosina & Bifurcación FOXO1 / SREBP-1c",
      "description": "La acumulación de intermediarios lipídicos activa isoformas de PKC y quinasas de estrés que fosforilan a IRS-1 en Ser307 en lugar de tirosina, destruyendo la señalización hacia Akt. En el hígado, la pérdida de Akt impide fosforilar a FOXO1 (el cual permanece en el núcleo activando PEPCK/G6Pasa), pero una vía alternativa dependiente de nutrientes sobreestimula a SREBP-1c provocando esteatosis.",
      "enzyme": "IRS-1 / Akt / FOXO1 & SREBP-1c",
      "allostericOrCovalent": "Fosforilación anómala en serina + desacoplamiento de factores transcripcionales"
    }
  },
  "diabetes_t1_dka": {
    "id": "diabetes_t1_dka",
    "title": "Diabetes Descompensada (Cetoacidosis Diabética - CAD)",
    "subtitle": "Ausencia absoluta de insulina por destrucción autoinmune de células β",
    "category": "Patología Clínica",
    "timeframe": "Emergencia Médica Aguda",
    "summary": "El estado patológico del \"hambre en medio de la abundancia\". Cociente Insulina / Glucagón virtualmente nulo. El organismo percibe una inanición extrema a pesar de tener una hiperglucemia masiva (> 350-500 mg/dL). La falta total de insulina desinhibe la lipólisis al 100%, liberando un torrente incontrolable de AGL al hígado. La ausencia de Malonil-CoA deja a CPT-1 desinhibida al máximo, forzando una Cetogénesis desbocada que genera acidosis metabólica severa con anión gap elevado, diuresis osmótica y deshidratación grave.",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "muy_bajo",
        "valueText": "Indetectable (péptido C ausente)",
        "percent": 0,
        "color": "#dc2626",
        "sourceOrgan": "Células β destruidas (autoinmunidad)",
        "primaryAction": "Nula."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "muy_elevado",
        "valueText": "Extremadamente elevado (> 300 pg/mL)",
        "percent": 100,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas sin freno paracrino",
        "primaryAction": "Activa al máximo PKA, gluconeogénesis, glucogenólisis y cetogénesis."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "muy_elevado",
        "valueText": "Elevación de estrés de choque",
        "percent": 90,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal",
        "primaryAction": "Dispara al máximo la lipólisis en tejido adiposo."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "muy_elevado",
        "valueText": "Respuesta máxima de estrés (> 35 μg/dL)",
        "percent": 95,
        "color": "#6366f1",
        "sourceOrgan": "Corteza suprarrenal",
        "primaryAction": "Promueve proteólisis acelerada."
      },
      "ampkActivity": {
        "status": "alta",
        "description": "Activada por estrés energético celular.",
        "percent": 85
      },
      "igRatio": {
        "ratio": 0,
        "text": "CERO (Ausencia de Insulina)",
        "state": "cero"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "350 - 650 mg/dL (Hiperglucemia Extrema)",
        "normalRange": "70 - 99 mg/dL",
        "status": "muy_elevado",
        "unit": "mg/dL",
        "description": "Imposibilidad de captación en músculo/grasa + producción hepática descontrolada."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos Plasmáticos",
        "valueText": "10 - 25 mM (Cetoacidosis Severa)",
        "normalRange": "< 0.2 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Acetoacetato y β-hidroxibutirato desbocados; descienden el pH arterial a < 7.20 (respiración de Kussmaul)."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "> 2.5 mM (Surge Masivo)",
        "normalRange": "0.3 - 0.6 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Lipólisis al 100% por falta total del freno insulínico sobre HSL."
      },
      {
        "id": "lactate",
        "name": "pH Arterial / Bicarbonato",
        "valueText": "pH 7.05 - 7.18 | HCO3- < 12 mEq/L",
        "normalRange": "pH 7.35 - 7.45 | HCO3- 22 - 26 mEq/L",
        "status": "muy_disminuido",
        "unit": "pH / mEq/L",
        "description": "Acidosis metabólica de anión gap elevado con consumo del tampón bicarbonato."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Náuseas, vómitos y dolor abdominal secundario a la acidosis y cetonemia.",
        "primaryFuelUsed": "Cetonas",
        "fuelProducedOrExported": "Ninguno",
        "keyEnzymes": [
          {
            "name": "Acuaporinas Epiteliales y Bombas Iónicas",
            "abbreviation": "AQP / Bombas Mucosas",
            "pathway": "Tránsito y Motilidad Intestinal",
            "cellularLocation": "Epitelio Intestinal",
            "status": "inhibida",
            "mechanism": "La acidosis metabólica grave y la hiperosmolaridad paralizan la motilidad intestinal (íleo metabólico) causando náuseas, vómitos y dolor abdominal."
          }
        ],
        "activePathways": [
          "Cetólisis basal mínima",
          "Deshidratación mucosa pasiva"
        ],
        "inhibitedPathways": [
          "Motilidad intestinal peristáltica (íleo adinámico por acidosis)",
          "Absorción normal de electrolitos"
        ],
        "transportersActive": [
          "MCT1"
        ],
        "physiologicalNote": "El dolor abdominal agudo en la CAD simula con frecuencia un abdomen agudo quirúrgico.",
        "atpGenerationStrategy": "Metabolismo alterado."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Hiperproducción desbocada de glucosa y cetogénesis masiva descontrolada.",
        "primaryFuelUsed": "Beta-oxidación masiva",
        "fuelProducedOrExported": "Glucosa gluconeogénica incesante + Torrente de Acetoacetato y β-hidroxibutirato",
        "keyEnzymes": [
          {
            "name": "Carnitina Palmitoiltransferasa 1",
            "abbreviation": "CPT-1",
            "pathway": "Beta-Oxidación",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "Completamente desinhibida debido a la ausencia absoluta de Malonil-CoA (la ACC está 100% inactiva)."
          },
          {
            "name": "HMG-CoA Sintasa Mitocondrial",
            "abbreviation": "mHMGCS",
            "pathway": "Cetogénesis",
            "cellularLocation": "Mitocondria",
            "status": "muy_activa",
            "mechanism": "Hiperactiva sin freno alguno. Produce cantidades letales de cetoácidos."
          },
          {
            "name": "PEPCK y G6Pasa",
            "abbreviation": "PEPCK / G6Pasa",
            "pathway": "Gluconeogénesis",
            "cellularLocation": "Citosol / RE",
            "status": "muy_activa",
            "mechanism": "Sobreexpresión máxima inducida por glucagón y cortisol ininterrumpidos."
          }
        ],
        "activePathways": [
          "Cetogénesis descontrolada",
          "Gluconeogénesis máxima",
          "Beta-oxidación ilimitada"
        ],
        "inhibitedPathways": [
          "Glucólisis",
          "Lipogénesis",
          "Glucogenogénesis"
        ],
        "transportersActive": [
          "GLUT2 (bombea glucosa a sangre ya hiperglucémica)",
          "MCT"
        ],
        "physiologicalNote": "El hígado no puede detectar que la sangre tiene 500 mg/dL de glucosa porque carece de la señal insulínica.",
        "atpGenerationStrategy": "Beta-oxidación extrema."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético",
        "emoji": "💪",
        "roleSummary": "Incapaz de captar glucosa por falta de GLUT4; proteólisis masiva caquectizante.",
        "primaryFuelUsed": "AGL y Cetonas (hasta que la acidosis inhibe el metabolismo)",
        "fuelProducedOrExported": "Aminoácidos hacia el hígado",
        "keyEnzymes": [
          {
            "name": "GLUT4",
            "abbreviation": "GLUT4",
            "pathway": "Captación de Glucosa",
            "cellularLocation": "Vesículas Intracelulares",
            "status": "inactiva",
            "mechanism": "Atrapado al 100% en el interior celular por falta absoluta de insulina. La glucosa sanguínea no puede entrar al miocito."
          }
        ],
        "activePathways": [
          "Proteólisis masiva",
          "Beta-oxidación"
        ],
        "inhibitedPathways": [
          "Captación de glucosa",
          "Síntesis proteica"
        ],
        "transportersActive": [
          "CD36"
        ],
        "physiologicalNote": "El músculo sufre hambre intracelular rodeado de una piscina de glucosa que no puede utilizar.",
        "atpGenerationStrategy": "Oxidación lipídica."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo",
        "emoji": "🧬",
        "roleSummary": "Lipólisis al 100% sin freno biológico; bomba de suministro de AGL hacia el hígado.",
        "primaryFuelUsed": "AGL propios",
        "fuelProducedOrExported": "Flujo torrencial incontrolado de AGL y Glicerol",
        "keyEnzymes": [
          {
            "name": "HSL y ATGL",
            "abbreviation": "HSL/ATGL",
            "pathway": "Lipólisis",
            "cellularLocation": "Gota Lipídica",
            "status": "muy_activa",
            "mechanism": "Máxima fosforilación por PKA inducida por catecolaminas y glucagón, sin ningún contraflujo de PP1."
          }
        ],
        "activePathways": [
          "Lipólisis máxima sostenida"
        ],
        "inhibitedPathways": [
          "Esterificación",
          "Captación de glucosa"
        ],
        "transportersActive": [
          "CD36",
          "AQP7"
        ],
        "physiologicalNote": "La fuente originaria de la cetoacidosis no es el hígado, sino el tejido adiposo que no deja de enviarle ácidos grasos al hígado.",
        "atpGenerationStrategy": "Oxidación lipídica."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Deshidratación celular e hiperosmolaridad con alteración del sensorio / coma.",
        "primaryFuelUsed": "Glucosa (aún captada por GLUT1/GLUT3) y Cetonas",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Hexoquinasa 1 Cerebral (HK1)",
            "abbreviation": "HK1",
            "pathway": "Glucólisis Neuronal Independiente de Insulina",
            "cellularLocation": "Citosol Neuronal",
            "status": "muy_activa",
            "mechanism": "Fosforila glucosa normalmente vía GLUT1/GLUT3 a pesar del colapso periférico de insulina."
          },
          {
            "name": "Succinil-CoA Transferasa Cerebral (SCOT) y BDH1",
            "abbreviation": "SCOT / BDH1",
            "pathway": "Cetólisis de Emergencia",
            "cellularLocation": "Mitocondria Neuronal",
            "status": "activa",
            "mechanism": "Oxida acetoacetato y beta-hidroxibutirato que penetran la BHE en concentraciones masivas vía transportadores MCT1."
          },
          {
            "name": "Bomba Na+/K+-ATPasa Neuronal",
            "abbreviation": "Bomba Na+/K+",
            "pathway": "Mantenimiento del Potencial Neuronal",
            "cellularLocation": "Membrana Neuronal",
            "status": "muy_activa",
            "mechanism": "Gasto máximo de ATP intentando preservar el volumen celular y la excitabilidad frente a la severa deshidratación hiperosmolar plasmática."
          }
        ],
        "activePathways": [
          "Glucólisis aeróbica neuronal",
          "Cetólisis cerebral",
          "Osmorregulación celular frente a hipertonicidad"
        ],
        "inhibitedPathways": [
          "Consumo exclusivo de glucosa"
        ],
        "transportersActive": [
          "GLUT1 (BHE)",
          "GLUT3 (neuronas)",
          "MCT1 (transporte de cetonas)"
        ],
        "physiologicalNote": "La hiperosmolaridad plasmática deshidrata las neuronas por gradiente osmótico; la somnolencia y el estupor se correlacionan con la osmolaridad efectiva (sobre todo si supera ~320 mOsm/kg).",
        "atpGenerationStrategy": "Glucólisis y ciclo de Krebs."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Diuresis osmótica masiva, glucosuria extrema, cetonuria y deshidratación hipovolémica con pérdida de potasio.",
        "primaryFuelUsed": "Grasas",
        "fuelProducedOrExported": "Glucosuria y Cetonuria masivas",
        "keyEnzymes": [
          {
            "name": "SGLT2 / SGLT1",
            "abbreviation": "SGLT2",
            "pathway": "Reabsorción de Glucosa",
            "cellularLocation": "Túbulo Proximal",
            "status": "muy_activa",
            "mechanism": "Completamente saturados (umbral renal de 180 mg/dL ampliamente superado). La glucosa no reabsorbida actúa como diurético osmótico arrastrando 5 a 8 litros de agua y electrolitos."
          }
        ],
        "activePathways": [
          "Diuresis osmótica",
          "Excreción ácida forzada",
          "Pérdida masiva de K+, Na+ y agua"
        ],
        "inhibitedPathways": [
          "Capacidad de reabsorción de glucosa (saturada al 100%, glucosuria masiva)",
          "Concentración urinaria (diuresis osmótica incoercible)"
        ],
        "transportersActive": [
          "SGLT2 saturado"
        ],
        "physiologicalNote": "El paciente puede perder el 10% de su peso corporal en agua en 24 horas, conduciendo a shock hipovolémico e insuficiencia renal prerrenal.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Vulnerable a arritmias graves por desbalances de potasio y acidosis severa.",
        "primaryFuelUsed": "AGL y Cetonas",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Succinil-CoA:3-Cetoácido CoA Transferasa (SCOT / Tioforasa)",
            "abbreviation": "SCOT / OXCT1",
            "pathway": "Cetólisis en Saturación",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Capacidad cetolítica al límite por la concentración desbordada de cuerpos cetónicos (>15-20 mM); oxida acetoacetato activamente mientras exista disponibilidad de succinil-CoA."
          },
          {
            "name": "Carnitina Palmitoiltransferasa 1B (CPT-1B cardíaca)",
            "abbreviation": "CPT-1B",
            "pathway": "Oxidación Lipídica Extrema",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "muy_activa",
            "mechanism": "Desinhibición máxima y ausencia total de Malonil-CoA por colapso absoluto de la señal insulínica; entrada descontrolada de AGL a la matriz mitocondrial."
          },
          {
            "name": "Na+/K+-ATPasa Sarcolémica",
            "abbreviation": "Bomba Na+/K+",
            "pathway": "Homeostasis Iónica y Excitabilidad Cardíaca",
            "cellularLocation": "Sarcolema Miocárdico",
            "status": "inhibida",
            "mechanism": "Comprometida por la acidosis metabólica grave (pH < 7.15) y shifts transcelulares de potasio, elevando exponencialmente el riesgo de arritmias ventriculares y parada cardíaca."
          }
        ],
        "activePathways": [
          "Oxidación lipídica"
        ],
        "inhibitedPathways": [
          "Oxidación de glucosa",
          "Glucólisis miocárdica"
        ],
        "transportersActive": [
          "CD36"
        ],
        "physiologicalNote": "El potasio sérico puede estar falsamente normal o elevado por la acidosis, pero el potasio intracelular total está severamente deplecionado.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Insulitis y destrucción autoinmune selectiva de islotes β mediada por células T.",
        "primaryFuelUsed": "Basal",
        "fuelProducedOrExported": "Glucagón alto sin oposición",
        "keyEnzymes": [
          {
            "name": "Proconvertasa 1/3 (PC1/3 de Células Beta)",
            "abbreviation": "PC1/3",
            "pathway": "Procesamiento de Proinsulina",
            "cellularLocation": "Islotes Pancreáticos",
            "status": "inhibida",
            "mechanism": "Abolida por la destrucción autoinmune selectiva de células beta mediada por linfocitos T autorreactivos."
          },
          {
            "name": "Proconvertasa 2 (PC2 en Células Alfa)",
            "abbreviation": "PC2",
            "pathway": "Secreción Desbocada de Glucagón",
            "cellularLocation": "Células Alfa",
            "status": "muy_activa",
            "mechanism": "Las células alfa hipersecretan glucagón al no existir ningún freno paracrino de insulina ni somatostatina, catalizando la cetogénesis hepática masiva."
          }
        ],
        "activePathways": [
          "Secreción desinhibida y masiva de glucagón por células alfa"
        ],
        "inhibitedPathways": [
          "Biosíntesis, maduración y exocitosis de insulina (0% de producción endógena)"
        ],
        "transportersActive": [
          "GLUT2 (células alfa)"
        ],
        "physiologicalNote": "Ausencia de péptido C en plasma (marcador inequívoco de falta de secreción endógena de insulina).",
        "atpGenerationStrategy": "Basal."
      }
    },
    "fluxes": [
      {
        "id": "dka-adipose-to-liver-massive-ffa",
        "sourceOrgan": "adipose",
        "targetOrgan": "liver",
        "substrate": "free_fatty_acids",
        "substrateName": "Ácidos Grasos Libres Desbocados",
        "rate": "masivo",
        "directionDescription": "Tejido Adiposo -> Vena Porta y Circulación -> Hígado",
        "biochemicalPurpose": "Suministro tóxico incontrolado de sustrato para CPT-1 desinhibida",
        "pathwayInvolved": "Lipólisis al 100% por ausencia de insulina"
      },
      {
        "id": "dka-liver-to-blood-ketones-acid",
        "sourceOrgan": "liver",
        "targetOrgan": "kidney",
        "substrate": "ketone_bodies",
        "substrateName": "Cetoácidos (AcAc y β-OHB)",
        "rate": "masivo",
        "directionDescription": "Hígado -> Sangre Sistémica -> Riñones y Pulmones",
        "biochemicalPurpose": "Producción letal que supera el aclaramiento periférico, colapsando el pH y produciendo respiración de Kussmaul y aliento a manzanas (acetona)",
        "pathwayInvolved": "Cetogénesis mitocondrial desinhibida (CPT-1 desreprimida por falta de malonil-CoA)"
      },
      {
        "id": "dka-liver-to-blood-glucose-extreme",
        "sourceOrgan": "liver",
        "targetOrgan": "kidney",
        "substrate": "glucose",
        "substrateName": "Glucosa Excedente (> 400 mg/dL)",
        "rate": "masivo",
        "directionDescription": "Hígado -> Sangre -> Filtración Renal",
        "biochemicalPurpose": "Sobrepasa el umbral de reabsorción tubular provocando diuresis osmótica",
        "pathwayInvolved": "Gluconeogénesis aberrante continua"
      }
    ],
    "hallmarkFeatures": [
      "Cociente Insulina / Glucagón = 0 (ausencia absoluta de insulina)",
      "Ausencia de Malonil-CoA deja a CPT-1 permanentemente abierta hacia la mitocondria",
      "Cetogénesis masiva desbocada con acidosis metabólica severa (anión gap elevado > 16-20 mEq/L)",
      "Glucosuria masiva con diuresis osmótica y deshidratación grave de 5 a 8 litros",
      "Incapacidad muscular y adiposa para captar glucosa por retención intracelular de GLUT4"
    ],
    "clinicalOrPhysiologicalContext": "Urgencia médica que requiere reanimación intensiva con fluidos intravenosos, insulina soluble en infusión continua y reposición estricta de potasio. El tratamiento restituye el Malonil-CoA cerrando la CPT-1 y extinguiendo la cetogénesis.",
    "keyRegulatorySwitch": {
      "title": "Ausencia de Malonil-CoA y Desinhibición Total de CPT-1",
      "description": "Al no haber insulina, la Acetil-CoA Carboxilasa (ACC) está 100% inactiva, reduciendo la concentración citosólica de Malonil-CoA a cero. CPT-1 queda completamente desinhibida, transportando todo ácido graso que entra al hepatocito directamente hacia la beta-oxidación mitocondrial sin restricción alguna, alimentando una cetogénesis desbordada.",
      "enzyme": "CPT-1 (Carnitina Palmitoiltransferasa 1)",
      "allostericOrCovalent": "Pérdida absoluta de inhibición alostérica por Malonil-CoA"
    }
  },
  "exercise_moderate": {
    "id": "exercise_moderate",
    "title": "Ejercicio Físico Moderado (Aeróbico Sostenido)",
    "subtitle": "Actividad aeróbica al 50 - 65% del VO2 máx (trote suave, ciclismo de fondo)",
    "category": "Gasto Energético & Ejercicio",
    "timeframe": "Minutos a Horas de duración",
    "summary": "Aumento del gasto metabólico de 5 a 10 veces sobre el nivel basal. Descenso de insulina y elevación moderada de adrenalina y glucagón. El músculo esquelético utiliza predominantemente Ácidos Grasos Libres como combustible oxidativo (~50-60% de la energía), ahorrando glucógeno muscular. El hígado equilibra con precisión la producción de glucosa (glucogenólisis y gluconeogénesis) para mantener la euglucemia perfecta.",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "bajo",
        "valueText": "Baja (Suprimida por simpático)",
        "percent": 15,
        "color": "#059669",
        "sourceOrgan": "Células β pancreáticas",
        "primaryAction": "Suprimida por estimulación de receptores α2-adrenérgicos pancreáticos por noradrenalina."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "elevado",
        "valueText": "Moderadamente elevado",
        "percent": 60,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas",
        "primaryAction": "Mantiene la producción hepática de glucosa para equiparar el consumo muscular."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "elevado",
        "valueText": "Elevada (150 - 300 pg/mL)",
        "percent": 65,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal",
        "primaryAction": "Estimula la lipólisis en tejido adiposo y la glucogenólisis muscular."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "elevado",
        "valueText": "Ligera elevación adaptativa",
        "percent": 45,
        "color": "#6366f1",
        "sourceOrgan": "Corteza suprarrenal",
        "primaryAction": "Soporte lipolítico y gluconeogénico."
      },
      "ampkActivity": {
        "status": "moderada",
        "description": "Activación sostenida en músculo activo para promover la biogénesis mitocondrial y captación de sustratos.",
        "percent": 50
      },
      "igRatio": {
        "ratio": 1,
        "text": "Bajo (~1, molar) · dominancia adrenérgica",
        "state": "bajo"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "85 - 95 mg/dL (Estable)",
        "normalRange": "70 - 99 mg/dL",
        "status": "normal",
        "unit": "mg/dL",
        "description": "La tasa de producción hepática iguala con exactitud la tasa de captación muscular (euglucemia)."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "0.8 - 1.2 mM",
        "normalRange": "0.3 - 0.6 mM",
        "status": "elevado",
        "unit": "mM",
        "description": "Liberación acelerada desde el tejido adiposo para abastecer a los músculos que trabajan."
      },
      {
        "id": "lactate",
        "name": "Lactato Sanguíneo",
        "valueText": "1.2 - 2.0 mM (Por debajo del umbral anaeróbico)",
        "normalRange": "0.5 - 1.5 mM",
        "status": "normal",
        "unit": "mM",
        "description": "La producción muscular de piruvato no supera la capacidad oxidativa mitocondrial."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos",
        "valueText": "0.2 - 0.5 mM",
        "normalRange": "< 0.2 mM",
        "status": "normal",
        "unit": "mM",
        "description": "Ligero aumento post-ejercicio si el esfuerzo se prolonga por más de 90 minutos."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Vasoconstricción esplácnica simpática para redistribuir el flujo hacia el músculo esquelético.",
        "primaryFuelUsed": "Glutamina",
        "fuelProducedOrExported": "Ninguno",
        "keyEnzymes": [
          {
            "name": "Glutaminasa Enterocítica",
            "abbreviation": "GLS",
            "pathway": "Oxidación Basal de Glutamina",
            "cellularLocation": "Mitocondria",
            "status": "activa",
            "mechanism": "Mantiene la viabilidad epitelial bajo la vasoconstricción simpática esplácnica de redistribución."
          }
        ],
        "activePathways": [
          "Vasoconstricción esplácnica refleja (redistribución de flujo hacia músculo activo)",
          "Metabolismo oxidativo de glutamina"
        ],
        "inhibitedPathways": [
          "Absorción y digestión activa",
          "Motilidad propulsiva gastrointestinal"
        ],
        "transportersActive": [
          "ASCT2"
        ],
        "physiologicalNote": "El flujo sanguíneo esplácnico cae hasta un 50-70% durante el ejercicio para abastecer a las extremidades.",
        "atpGenerationStrategy": "Metabolismo basal."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Regulador homeostático que incrementa la producción de glucosa para evitar la hipoglucemia.",
        "primaryFuelUsed": "AGL",
        "fuelProducedOrExported": "Glucosa hacia el torrente sanguíneo",
        "keyEnzymes": [
          {
            "name": "Glucógeno Fosforilasa Hepática",
            "abbreviation": "GP-a",
            "pathway": "Glucogenólisis",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Estimulada por adrenalina (vía receptores β2 y α1) y glucagón."
          },
          {
            "name": "Gluconeogénesis Hepática",
            "abbreviation": "PEPCK / G6Pasa",
            "pathway": "Gluconeogénesis",
            "cellularLocation": "Citosol / RE",
            "status": "activa",
            "mechanism": "Aumenta a medida que el ejercicio se prolonga, utilizando glicerol y lactato."
          }
        ],
        "activePathways": [
          "Glucogenólisis hepática",
          "Gluconeogénesis sostenida",
          "Beta-oxidación"
        ],
        "inhibitedPathways": [
          "Glucogenogénesis",
          "Lipogénesis"
        ],
        "transportersActive": [
          "GLUT2 (eflujo)"
        ],
        "physiologicalNote": "Aumenta su producción de glucosa de 1.8 mg/kg/min a más de 4-6 mg/kg/min para abastecer al músculo.",
        "atpGenerationStrategy": "Beta-oxidación."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético",
        "emoji": "💪",
        "roleSummary": "Motor oxidativo aeróbico: consumo preferente de AGL con ahorro de glucógeno.",
        "primaryFuelUsed": "Ácidos Grasos Libres (~60%) y Glucógeno muscular/glucosa (~40%)",
        "fuelProducedOrExported": "Retiene glucosa; oxida todo a CO2 y H2O",
        "keyEnzymes": [
          {
            "name": "AMPK Muscular",
            "abbreviation": "AMPK",
            "pathway": "Sensor Energético",
            "cellularLocation": "Citosol / Núcleo",
            "status": "activa",
            "mechanism": "Activada por aumento del cociente AMP/ATP; fosforila ACC inactivándola (baja Malonil-CoA) y activa CPT-1 para oxidar grasas."
          },
          {
            "name": "Translocación GLUT4 No dependiente de Insulina",
            "abbreviation": "GLUT4 contracción",
            "pathway": "Captación de Glucosa",
            "cellularLocation": "Membrana Plasmática",
            "status": "muy_activa",
            "mechanism": "La contracción muscular, el aumento de Ca2+ citosólico y la AMPK mueven GLUT4 a la membrana SIN necesidad de insulina."
          },
          {
            "name": "Lipasa de Triglicéridos Intramiocelulares",
            "abbreviation": "ATGL / HSL muscular",
            "pathway": "Lipólisis Intramiocelular",
            "cellularLocation": "Gota Lipídica Miocito",
            "status": "activa",
            "mechanism": "Hidroliza gotas lipídicas intramusculares adyacentes a las mitocondrias."
          }
        ],
        "activePathways": [
          "Beta-oxidación aeróbica mitocondrial",
          "Ciclo de Krebs completo",
          "Fosforilación oxidativa",
          "Translocación de GLUT4 por contracción"
        ],
        "inhibitedPathways": [
          "Glucólisis anaeróbica masiva (no se sobrepasa el umbral)"
        ],
        "transportersActive": [
          "CD36",
          "FATP1",
          "GLUT4 translocado"
        ],
        "physiologicalNote": "Este fenómeno de captación de glucosa sin insulina es la razón por la cual el ejercicio es la mejor medicina en la resistencia a la insulina.",
        "atpGenerationStrategy": "Fosforilación oxidativa aeróbica completa."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo",
        "emoji": "🧬",
        "roleSummary": "Suministro continuo de ácidos grasos estimulado por catecolaminas.",
        "primaryFuelUsed": "AGL propios",
        "fuelProducedOrExported": "AGL y Glicerol hacia el músculo y corazón",
        "keyEnzymes": [
          {
            "name": "HSL y ATGL",
            "abbreviation": "HSL/ATGL",
            "pathway": "Lipólisis Adrenérgica",
            "cellularLocation": "Gota Lipídica",
            "status": "muy_activa",
            "mechanism": "Adrenalina y noradrenalina estimulan receptores β1 y β2 adrenérgicos -> AMPc -> PKA -> fosforilación de HSL."
          }
        ],
        "activePathways": [
          "Lipólisis estimulada por ejercicio"
        ],
        "inhibitedPathways": [
          "Esterificación"
        ],
        "transportersActive": [
          "CD36",
          "AQP7"
        ],
        "physiologicalNote": "El flujo sanguíneo al tejido adiposo aumenta durante el ejercicio moderado para favorecer el aclaramiento de AGL hacia la sangre.",
        "atpGenerationStrategy": "Oxidación lipídica."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Atención, reclutamiento de unidades motoras y tono simpático.",
        "primaryFuelUsed": "Glucosa",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Hexoquinasa 1 Cerebral (HK1)",
            "abbreviation": "HK1",
            "pathway": "Glucólisis Neuronal de Alta Demanda",
            "cellularLocation": "Citosol Neuronal",
            "status": "muy_activa",
            "mechanism": "Fosforila glucosa para sostener la actividad eléctrica de la corteza motora, ganglios basales y cerebelo."
          },
          {
            "name": "Lactato Deshidrogenasa Neuronal (LDH-1)",
            "abbreviation": "LDH-H4",
            "pathway": "Consumo de Lactato Arterial",
            "cellularLocation": "Citosol",
            "status": "activa",
            "mechanism": "Capta lactato arterial a través de transportadores MCT2 y lo oxida a piruvato para energía neuronal complementaria."
          }
        ],
        "activePathways": [
          "Glucólisis aeróbica neuronal máxima",
          "Captación de lactato arterial vía MCT2",
          "Descarga simpática eferente central"
        ],
        "inhibitedPathways": [
          "Cetólisis (cuerpos cetónicos basales)"
        ],
        "transportersActive": [
          "GLUT1",
          "GLUT3",
          "MCT2"
        ],
        "physiologicalNote": "La euglucemia mantenida por el hígado evita la fatiga central hipoglucémica.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Ahorro hídrico y reabsorción tubular bajo influjo de ADH y aldosterona.",
        "primaryFuelUsed": "Ácidos grasos",
        "fuelProducedOrExported": "Reabsorción de agua y sodio",
        "keyEnzymes": [
          {
            "name": "Anhidrasa Carbónica II y IV (CA-II / CA-IV)",
            "abbreviation": "CA-II/IV",
            "pathway": "Reabsorción Tubular de Bicarbonato",
            "cellularLocation": "Borde en Cepillo y Citosol Proximal",
            "status": "muy_activa",
            "mechanism": "Reabsorbe ávidamente bicarbonato filtrado para mantener la reserva alcalina plasmática."
          },
          {
            "name": "Intercambiador Na+/H+ Tipo 3 (NHE3)",
            "abbreviation": "NHE3",
            "pathway": "Secreción Tubular de Protones",
            "cellularLocation": "Membrana Apical Proximal",
            "status": "muy_activa",
            "mechanism": "Elimina protones hacia la luz tubular, estimulado por la angiotensina II y el tono simpático renal."
          }
        ],
        "activePathways": [
          "Reabsorción máxima de bicarbonato y sodio",
          "Ahorro hídrico estimulado por vasopresina (ADH)"
        ],
        "inhibitedPathways": [
          "Flujo plasmático renal (reducido ~30-40% por vasoconstricción de la arteriola aferente)"
        ],
        "transportersActive": [
          "NHE3",
          "SGLT2",
          "Acuaporina-2"
        ],
        "physiologicalNote": "El flujo plasmático renal disminuye moderadamente para favorecer a los músculos activos.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Gasto cardíaco multiplicado por 3 a 4; consume predominantemente ácidos grasos y lactato.",
        "primaryFuelUsed": "Ácidos grasos libres y lactato sanguíneo",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Lactato Deshidrogenasa Cardíaca (LDH-1)",
            "abbreviation": "LDH-H4",
            "pathway": "Aclaramiento y Oxidación de Lactato",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Oxida eficientemente el lactato arterial a piruvato con altísima afinidad y sin inhibición por sustrato; el miocardio es el principal depurador del lactato muscular."
          },
          {
            "name": "Complejo Piruvato Deshidrogenasa (PDH cardíaca)",
            "abbreviation": "PDH",
            "pathway": "Oxidación de Piruvato/Lactato",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Activada alostéricamente por el influjo de Ca2+ intramitocondrial durante el aumento de frecuencia e inotropismo cardíaco; oxida rápidamente el piruvato derivado del lactato."
          },
          {
            "name": "Carnitina Palmitoiltransferasa 1B (CPT-1B cardíaca)",
            "abbreviation": "CPT-1B",
            "pathway": "Beta-Oxidación de Sustrato Principal",
            "cellularLocation": "Membrana Mitocondrial Externa",
            "status": "muy_activa",
            "mechanism": "Suministro ininterrumpido de ATP mitocondrial quemando ácidos grasos plasmáticos movilizados por catecolaminas."
          },
          {
            "name": "Creatina Quinasa Cardíaca (CK-MB / CK-MM)",
            "abbreviation": "CK-MB",
            "pathway": "Lanzadera de Fosfocreatina",
            "cellularLocation": "Espacio Intermembrana y Miofibrillas",
            "status": "muy_activa",
            "mechanism": "Regeneración inmediata de ATP a pie de sarcómero para mantener el ciclo continuo de contracción-relajación ventricular."
          }
        ],
        "activePathways": [
          "Beta-oxidación miocárdica acelerada",
          "Consumo de lactato"
        ],
        "inhibitedPathways": [
          "Glucogenogénesis",
          "Lipogénesis"
        ],
        "transportersActive": [
          "CD36",
          "MCT1"
        ],
        "physiologicalNote": "El corazón es un ávido consumidor del lactato producido por los músculos.",
        "atpGenerationStrategy": "Fosforilación oxidativa máxima."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Freno simpático a la insulina e inducción de glucagón.",
        "primaryFuelUsed": "Basal",
        "fuelProducedOrExported": "Glucagón",
        "keyEnzymes": [
          {
            "name": "Receptores Alfa-2 Adrenérgicos de Células Beta",
            "abbreviation": "Alfa-2 Adrenérgico",
            "pathway": "Freno Simpático de la Insulina",
            "cellularLocation": "Membrana de Células Beta",
            "status": "muy_activa",
            "mechanism": "Activados por noradrenalina simpática; acoplados a Gi, inhiben adenilato ciclasa y bloquean la secreción de insulina para evitar hipoglucemia."
          },
          {
            "name": "Receptores Beta-2 Adrenérgicos en Células Alfa",
            "abbreviation": "Beta-2 Adrenérgico",
            "pathway": "Estimulación Simpática de Glucagón",
            "cellularLocation": "Membrana de Células Alfa",
            "status": "muy_activa",
            "mechanism": "Estimulan la secreción de glucagón para movilizar glucógeno y glucosa hepática hacia el músculo en ejercicio."
          }
        ],
        "activePathways": [
          "Inhibición simpática de secreción de insulina",
          "Secreción simpática de glucagón"
        ],
        "inhibitedPathways": [
          "Secreción de insulina dependiente de glucosa"
        ],
        "transportersActive": [
          "GLUT2",
          "Canales K-ATP"
        ],
        "physiologicalNote": "Evita la hipoglucemia que ocurriría si se secretara insulina mientras el músculo consume glucosa masivamente.",
        "atpGenerationStrategy": "Basal."
      }
    },
    "fluxes": [
      {
        "id": "ex-mod-adipose-to-muscle-ffa",
        "sourceOrgan": "adipose",
        "targetOrgan": "muscle",
        "substrate": "free_fatty_acids",
        "substrateName": "Ácidos Grasos Libres",
        "rate": "masivo",
        "directionDescription": "Tejido Adiposo -> Sangre -> Fibras Musculares Tipo I y IIa",
        "biochemicalPurpose": "Combustible predominante (~60%) para contracción sostenida y ahorro de glucógeno",
        "pathwayInvolved": "Beta-oxidación mitocondrial estimulada por AMPK y caída de malonil-CoA"
      },
      {
        "id": "ex-mod-liver-to-muscle-glucose",
        "sourceOrgan": "liver",
        "targetOrgan": "muscle",
        "substrate": "glucose",
        "substrateName": "Glucosa Hepática",
        "rate": "alto",
        "directionDescription": "Hígado -> Sangre -> Músculo en Ejercicio",
        "biochemicalPurpose": "Mantiene la glucemia constante mientras el músculo capta glucosa vía GLUT4 independiente de insulina",
        "pathwayInvolved": "Glucogenólisis y gluconeogénesis hepáticas coordinadas"
      },
      {
        "id": "ex-mod-muscle-to-heart-lactate",
        "sourceOrgan": "muscle",
        "targetOrgan": "heart",
        "substrate": "lactate",
        "substrateName": "Lactato Basal/Moderado",
        "rate": "moderado",
        "directionDescription": "Músculo -> Sangre -> Miocardio",
        "biochemicalPurpose": "Oxidación cardíaca de lactato como sustrato energético de alta eficiencia",
        "pathwayInvolved": "LDH-1 cardiaca (Lactato -> Piruvato -> Ciclo de Krebs)"
      }
    ],
    "hallmarkFeatures": [
      "Los ácidos grasos (plasmáticos e intramusculares) aportan ~50-60% de la energía oxidativa total",
      "La producción hepática de glucosa equipara con precisión el aclaramiento muscular (euglucemia)",
      "Translocación de GLUT4 inducida por contracción muscular y AMPK (independiente de insulina)",
      "Lactato sanguíneo bajo el umbral anaeróbico (< 2 mM)"
    ],
    "clinicalOrPhysiologicalContext": "Zona metabólica óptima para la salud cardiovascular, biogénesis mitocondrial y tratamiento de la resistencia a la insulina. Permite preservar el glucógeno para esfuerzos finales.",
    "keyRegulatorySwitch": {
      "title": "Regulación de CPT-1 por AMPK y Activación de la PDH por Contracción",
      "description": "La contracción sostenida eleva ligeramente el AMP, activando a la AMPK muscular. La AMPK fosforila e inactiva a la Acetil-CoA Carboxilasa (ACC-2), reduciendo el Malonil-CoA muscular. Esto desinhibe a la CPT-1 muscular, permitiendo una entrada masiva de ácidos grasos a la mitocondria. A diferencia del reposo (efecto Randle), durante la contracción la PDH muscular se activa (el Ca2+ estimula la PDH fosfatasa y el piruvato inhibe a la PDK), de modo que grasas y glucosa se oxidan a la vez; la abundancia de AGL modera, pero no anula, la oxidación de glucosa.",
      "enzyme": "AMPK / ACC-2 / CPT-1 muscular",
      "allostericOrCovalent": "Fosforilación por AMPK + Desinhibición de CPT-1"
    }
  },
  "exercise_intense": {
    "id": "exercise_intense",
    "title": "Ejercicio Físico de Alta Intensidad (Anaeróbico / Esprint)",
    "subtitle": "Intensidad > 85% del VO2 máx (esprints, HIIT, esfuerzos supramáximos)",
    "category": "Gasto Energético & Ejercicio",
    "timeframe": "Segundos a pocos minutos",
    "summary": "Demanda explosiva de regeneración de ATP. La tasa de glucólisis supera ampliamente la capacidad oxidativa mitocondrial. Consumo masivo de fosfocreatina y activación de la Glucógeno Fosforilasa y la PFK-1 por AMP y Ca2+. Fermentación láctica masiva que genera eflujo de lactato a la sangre. Ese lactato se oxida en su mayor parte en corazón y fibras oxidativas; una fracción viaja al hígado y alimenta el Ciclo de Cori (regeneración de glucosa con gasto de 6 ATP por glucosa).",
    "hormones": {
      "insulin": {
        "name": "Insulina",
        "symbol": "INS",
        "level": "muy_bajo",
        "valueText": "Marcadamente suprimida",
        "percent": 8,
        "color": "#059669",
        "sourceOrgan": "Células β pancreáticas",
        "primaryAction": "Suprimida por potente descarga simpática α2."
      },
      "glucagon": {
        "name": "Glucagón",
        "symbol": "GLU",
        "level": "elevado",
        "valueText": "Elevado",
        "percent": 70,
        "color": "#d97706",
        "sourceOrgan": "Células α pancreáticas",
        "primaryAction": "Estimula la producción hepática de glucosa."
      },
      "epinephrine": {
        "name": "Adrenalina",
        "symbol": "EPI",
        "level": "muy_elevado",
        "valueText": "Disparo masivo (> 600 - 1500 pg/mL)",
        "percent": 98,
        "color": "#dc2626",
        "sourceOrgan": "Médula suprarrenal y terminaciones simpáticas",
        "primaryAction": "Desencadena glucogenólisis masiva en músculo e hígado; vasodilatación muscular."
      },
      "cortisol": {
        "name": "Cortisol",
        "symbol": "CORT",
        "level": "elevado",
        "valueText": "Elevación aguda de estrés",
        "percent": 65,
        "color": "#6366f1",
        "sourceOrgan": "Corteza suprarrenal",
        "primaryAction": "Respuesta al esfuerzo exhaustivo."
      },
      "ampkActivity": {
        "status": "máxima",
        "description": "Activación explosiva por el aumento de AMP y ADP (la AMP desaminasa convierte parte del AMP en IMP, lo que limita su acumulación).",
        "percent": 100
      },
      "igRatio": {
        "ratio": 0.5,
        "text": "Muy bajo (~0,5, molar) · tormenta catecolaminérgica",
        "state": "muy_bajo"
      }
    },
    "bloodSubstrates": [
      {
        "id": "glucose",
        "name": "Glucosa Plasmática",
        "valueText": "110 - 140 mg/dL (Hiperglucemia reactiva)",
        "normalRange": "70 - 99 mg/dL",
        "status": "elevado",
        "unit": "mg/dL",
        "description": "La producción hepática inducida por la adrenalina puede superar temporalmente la captación muscular."
      },
      {
        "id": "lactate",
        "name": "Lactato Sanguíneo",
        "valueText": "8.0 - 16.0 mM (Acidosis láctica transitoria)",
        "normalRange": "0.5 - 1.5 mM",
        "status": "muy_elevado",
        "unit": "mM",
        "description": "Eflujo masivo desde las fibras glucolíticas tipo IIx; amortiguado por bicarbonato."
      },
      {
        "id": "free_fatty_acids",
        "name": "Ácidos Grasos Libres (AGL)",
        "valueText": "0.3 - 0.5 mM (Disminuidos durante el esfuerzo)",
        "normalRange": "0.3 - 0.6 mM",
        "status": "normal",
        "unit": "mM",
        "description": "La vasoconstricción del tejido adiposo y la alta tasa de lactato suprimen el eflujo de AGL durante el esprint."
      },
      {
        "id": "ketone_bodies",
        "name": "Cuerpos Cetónicos",
        "valueText": "< 0.2 mM (Indetectables)",
        "normalRange": "< 0.2 mM",
        "status": "normal",
        "unit": "mM",
        "description": "Cetogénesis apagada por el flujo glucolítico."
      }
    ],
    "organProfiles": {
      "gut": {
        "organId": "gut",
        "organName": "Intestino Delgado",
        "emoji": "🥦",
        "roleSummary": "Isquemia esplácnica transitoria por máxima redistribución vascular hacia el músculo activo.",
        "primaryFuelUsed": "Basal",
        "fuelProducedOrExported": "Ninguno",
        "keyEnzymes": [
          {
            "name": "Glutaminasa Enterocítica",
            "abbreviation": "GLS",
            "pathway": "Oxidación Basal de Glutamina",
            "cellularLocation": "Mitocondria",
            "status": "activa",
            "mechanism": "Sustrato de supervivencia enterocítica durante la isquemia esplácnica funcional transitoria."
          }
        ],
        "activePathways": [
          "Vasoconstricción esplácnica máxima (flujo mesentérico reducido >75%)"
        ],
        "inhibitedPathways": [
          "Absorción de macronutrientes luminales",
          "Peristaltismo intestinal activo"
        ],
        "transportersActive": [
          "ASCT2"
        ],
        "physiologicalNote": "El flujo sanguíneo al lecho digestivo cae más del 80%.",
        "atpGenerationStrategy": "Basal."
      },
      "liver": {
        "organId": "liver",
        "organName": "Hígado",
        "emoji": "🏛️",
        "roleSummary": "Receptor central del lactato para el Ciclo de Cori y bombeador masivo de glucosa.",
        "primaryFuelUsed": "Beta-oxidación",
        "fuelProducedOrExported": "Glucosa regenerada a partir de Lactato (Ciclo de Cori) y glucógeno",
        "keyEnzymes": [
          {
            "name": "Lactato Deshidrogenasa Hepática (LDH-5)",
            "abbreviation": "LDH-M4",
            "pathway": "Ciclo de Cori",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Oxida lactato entrante a piruvato reduciendo NAD+ a NADH."
          },
          {
            "name": "Gluconeogénesis Hepática (PC / PEPCK)",
            "abbreviation": "PC / PEPCK",
            "pathway": "Ciclo de Cori",
            "cellularLocation": "Mitocondria / Citosol",
            "status": "muy_activa",
            "mechanism": "Convierte piruvato de vuelta a glucosa consumiendo 6 moléculas de ATP equivalentes por cada glucosa sintetizada."
          },
          {
            "name": "Glucógeno Fosforilasa Hepática",
            "abbreviation": "GP-a",
            "pathway": "Glucogenólisis de Emergencia",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Máxima activación por descarga adrenérgica."
          }
        ],
        "activePathways": [
          "Ciclo de Cori (conversión de lactato a glucosa)",
          "Glucogenólisis hepática masiva"
        ],
        "inhibitedPathways": [
          "Glucólisis",
          "Lipogénesis"
        ],
        "transportersActive": [
          "MCT1/MCT2 (captación masiva de lactato)",
          "GLUT2 (eflujo de glucosa)"
        ],
        "physiologicalNote": "El ciclo de Cori traslada al hígado parte del coste de reciclar el lactato muscular, sobre todo en la recuperación, cuando se restablece el flujo sanguíneo hepático.",
        "atpGenerationStrategy": "Beta-oxidación lipídica que provee los 6 ATP necesarios para sintetizar cada glucosa a partir de lactato."
      },
      "muscle": {
        "organId": "muscle",
        "organName": "Músculo Esquelético (Fibras Tipo IIx)",
        "emoji": "💪",
        "roleSummary": "Explosión anaeróbica: consumo relámpago de fosfocreatina y glucógeno con fermentación láctica.",
        "primaryFuelUsed": "Fosfocreatina (primeros 5-10s) y Glucógeno Muscular vía Glucólisis Anaeróbica (>85%)",
        "fuelProducedOrExported": "Lactato y protones (H+) que se vierten masivamente a la sangre",
        "keyEnzymes": [
          {
            "name": "Creatina Quinasa",
            "abbreviation": "CK",
            "pathway": "Sistema de Fosfágenos",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Transfiere fosfato de fosfocreatina a ADP para generar ATP inmediato sin oxígeno (primeros segundos)."
          },
          {
            "name": "Glucógeno Fosforilasa Muscular",
            "abbreviation": "GP-M",
            "pathway": "Glucogenólisis Muscular Rápida",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Activación alostérica instantánea por AMP (sin esperar fosforilación) y activación covalente por Ca2+/Calmodulina y PKA."
          },
          {
            "name": "Fosfofructoquinasa-1",
            "abbreviation": "PFK-1",
            "pathway": "Glucólisis Rápida",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Desinhibida de forma explosiva por el alto AMP citosólico; la velocidad glucolítica se multiplica por 100 veces."
          },
          {
            "name": "Lactato Deshidrogenasa Muscular",
            "abbreviation": "LDH-A",
            "pathway": "Fermentación Láctica",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Reduce piruvato a lactato regenerando NAD+ citosólico para que la glucólisis no se detenga."
          }
        ],
        "activePathways": [
          "Glucólisis anaeróbica explosiva",
          "Lisis de fosfocreatina",
          "Glucogenólisis muscular máxima",
          "Eflujo de lactato vía MCT4"
        ],
        "inhibitedPathways": [
          "Beta-oxidación (los ácidos grasos no pueden aportar ATP con la rapidez requerida)"
        ],
        "transportersActive": [
          "MCT4 (transportador especializado de alta capacidad para expulsar lactato y H+)"
        ],
        "physiologicalNote": "La acumulación de protones (acidosis intracelular) y fosfato inorgánico libre provoca la fatiga muscular que detiene el esfuerzo a los 30-90 segundos.",
        "atpGenerationStrategy": "Fosfocreatina y fosforilación a nivel de sustrato en la glucólisis anaeróbica (3 ATP netos por residuo de glucosa procedente del glucógeno; 2 ATP si procede de glucosa sanguínea)."
      },
      "adipose": {
        "organId": "adipose",
        "organName": "Tejido Adiposo",
        "emoji": "🧬",
        "roleSummary": "Flujo sanguíneo reducido por vasoconstricción adrenérgica; eflujo lipídico temporalmente bloqueado.",
        "primaryFuelUsed": "Grasas",
        "fuelProducedOrExported": "Retención de ácidos grasos (atrapamiento por lactato y vasoconstricción)",
        "keyEnzymes": [
          {
            "name": "Lipasa Sensible a Hormonas (HSL)",
            "abbreviation": "HSL",
            "pathway": "Lipólisis Estimulada por Catecolaminas",
            "cellularLocation": "Gota Lipídica",
            "status": "activa",
            "mechanism": "Fosforilada por PKA estimulada por altas catecolaminas plasmáticas."
          },
          {
            "name": "Receptor Alfa-1 Adrenérgico Vascular Adiposo",
            "abbreviation": "Alfa-1 Vascular",
            "pathway": "Atrapamiento Lipídico por Isquemia Funcional",
            "cellularLocation": "Lecho Capilar Adiposo",
            "status": "muy_activa",
            "mechanism": "Intensa vasoconstricción local que colapsa el lecho capilar adiposo; los ácidos grasos hidrolizados quedan atrapados y se reesterifican localmente."
          },
          {
            "name": "Receptor de Lactato Adipocitario (GPR81 / HCA1)",
            "abbreviation": "GPR81",
            "pathway": "Freno Antilipolítico por Acidosis Láctica",
            "cellularLocation": "Membrana del Adipocito",
            "status": "muy_activa",
            "mechanism": "El torrente de lactato arterial activa GPR81 acoplado a Gi, disminuyendo el AMPc y frenando la lipólisis en esfuerzo anaeróbico máximo."
          }
        ],
        "activePathways": [
          "Hidrólisis intracelular de triglicéridos",
          "Reesterificación local de AGL atrapados"
        ],
        "inhibitedPathways": [
          "Liberación y eflujo sistémico de AGL (atrapamiento lipídico)",
          "Lipogénesis"
        ],
        "transportersActive": [
          "Acuaporina-7"
        ],
        "physiologicalNote": "A pesar del alto nivel de adrenalina, los AGL no aumentan en sangre durante el esprint debido a la vasoconstricción del lecho adiposo.",
        "atpGenerationStrategy": "Oxidación residual."
      },
      "brain": {
        "organId": "brain",
        "organName": "Cerebro / SNC",
        "emoji": "🧠",
        "roleSummary": "Reclutamiento motor máximo y corteza motora en hiperactividad.",
        "primaryFuelUsed": "Glucosa (también puede captar parte del lactato circulante)",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Hexoquinasa 1 Cerebral (HK1)",
            "abbreviation": "HK1",
            "pathway": "Glucólisis Neuronal de Máxima Excitabilidad",
            "cellularLocation": "Citosol Neuronal",
            "status": "muy_activa",
            "mechanism": "Gasto máximo de glucosa por hiperactivación de la corteza motora y vías corticoespinales (frecuencia de disparo neuronal máxima)."
          },
          {
            "name": "Lactato Deshidrogenasa Neuronal (LDH-1 / LDH-5 ANLS)",
            "abbreviation": "LDH ANLS",
            "pathway": "Lanzadera Astrocito-Neurona de Lactato",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Capta ávidamente el lactato arterial masivo (>12-15 mM) vía MCT2 y lo oxida a piruvato para obtener ATP aeróbico en neuronas motoras."
          }
        ],
        "activePathways": [
          "Glucólisis aeróbica neuronal máxima",
          "Consumo masivo de lactato circulante vía MCT2",
          "Comando central simpático supremo"
        ],
        "inhibitedPathways": [
          "Cetólisis"
        ],
        "transportersActive": [
          "GLUT1",
          "GLUT3",
          "MCT2 (alta afinidad por lactato)"
        ],
        "physiologicalNote": "Durante el ejercicio intenso el cerebro capta y oxida parte del lactato sanguíneo.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "kidney": {
        "organId": "kidney",
        "organName": "Riñón",
        "emoji": "💧",
        "roleSummary": "Amortiguación de la carga ácida aguda y aclaramiento parcial de lactato.",
        "primaryFuelUsed": "Grasas",
        "fuelProducedOrExported": "Amoniogénesis y reabsorción de bicarbonato",
        "keyEnzymes": [
          {
            "name": "Glutaminasa Renal (GLS) & Glutamato Deshidrogenasa (GDH)",
            "abbreviation": "GLS / GDH",
            "pathway": "Amoniogénesis Renal de Emergencia",
            "cellularLocation": "Mitocondria Tubular Proximal",
            "status": "muy_activa",
            "mechanism": "Desamina glutamina generando NH4+ que se excreta activamente en la orina, amortiguando los protones de la acidosis láctica aguda."
          },
          {
            "name": "Intercambiador Na+/H+ 3 (NHE3) & Anhidrasa Carbónica",
            "abbreviation": "NHE3 / CA-II",
            "pathway": "Eliminación Máxima de Protones",
            "cellularLocation": "Túbulo Proximal",
            "status": "muy_activa",
            "mechanism": "Bombea protones al filtrado y reabsorbe todo el bicarbonato disponible para proteger contra la acidemia severa."
          }
        ],
        "activePathways": [
          "Amoniogénesis tubular máxima para atrapar protones urinarios",
          "Reabsorción del 100% del bicarbonato filtrado",
          "Ahorro hídrico extremo"
        ],
        "inhibitedPathways": [
          "Tasa de filtración glomerular normal (reducida temporalmente por vasoconstricción simpática de arteriolas aferentes)"
        ],
        "transportersActive": [
          "NHE3",
          "Acuaporina-2",
          "SGLT2"
        ],
        "physiologicalNote": "Compensa la acidosis metabólica láctica aguda.",
        "atpGenerationStrategy": "Fosforilación oxidativa."
      },
      "heart": {
        "organId": "heart",
        "organName": "Miocardio",
        "emoji": "❤️",
        "roleSummary": "Frecuencia cardíaca máxima (170-190 lpm); capta vorazmente el lactato producido por los músculos.",
        "primaryFuelUsed": "Lactato sanguíneo (> 60% de su energía en alta intensidad)",
        "fuelProducedOrExported": "Consumidor",
        "keyEnzymes": [
          {
            "name": "Lactato Deshidrogenasa Cardíaca (LDH-1)",
            "abbreviation": "LDH-H4",
            "pathway": "Aclaramiento y Combustión de Lactato",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Aclara vorazmente el torrente de lactato arterial que supera los 10-15 mM; oxida el lactato aportando más del 60% de todo el ATP miocárdico en ejercicio extenuante."
          },
          {
            "name": "AMPK Miocárdica (AMP-Activated Protein Kinase)",
            "abbreviation": "AMPK cardíaca",
            "pathway": "Sensor Energético de Emergencia",
            "cellularLocation": "Citosol",
            "status": "muy_activa",
            "mechanism": "Activada al máximo por la depleción transitoria de ATP y la intensa estimulación beta-adrenérgica; estimula la captación de glucosa por GLUT4 y moviliza CD36."
          },
          {
            "name": "Complejo Piruvato Deshidrogenasa (PDH cardíaca)",
            "abbreviation": "PDH",
            "pathway": "Descarboxilación Oxidativa de Piruvato",
            "cellularLocation": "Matriz Mitocondrial",
            "status": "muy_activa",
            "mechanism": "Hiperactivada por las elevadas concentraciones de calcio mitocondrial a frecuencias cardíacas extremas (170-190 lpm), procesando todo el piruvato derivado del lactato hacia Krebs."
          },
          {
            "name": "Creatina Quinasa Cardíaca (CK-MB / CK-MM)",
            "abbreviation": "CK-MB",
            "pathway": "Amortiguación Inmediata de ATP Contráctil",
            "cellularLocation": "Miofilamentos y Mitocondria",
            "status": "muy_activa",
            "mechanism": "Descarga instantánea de fosfocreatina para sostener el inotropismo máximo sin colapso de la reserva celular de nucleótidos de adenina."
          }
        ],
        "activePathways": [
          "Oxidación masiva de lactato",
          "Fosforilación oxidativa máxima"
        ],
        "inhibitedPathways": [
          "Glucogenogénesis",
          "Lipogénesis"
        ],
        "transportersActive": [
          "MCT1"
        ],
        "physiologicalNote": "El corazón protege al cuerpo de la acidosis convirtiendo el lactato en energía contráctil.",
        "atpGenerationStrategy": "Fosforilación oxidativa a partir de lactato."
      },
      "pancreas": {
        "organId": "pancreas",
        "organName": "Páncreas Endocrino",
        "emoji": "🧪",
        "roleSummary": "Inhibición simpática extrema de células beta.",
        "primaryFuelUsed": "Basal",
        "fuelProducedOrExported": "Glucagón",
        "keyEnzymes": [
          {
            "name": "Receptores Alfa-2 Adrenérgicos de Células Beta",
            "abbreviation": "Alfa-2 Adrenérgico",
            "pathway": "Freno Simpático Extremo de Insulina",
            "cellularLocation": "Células Beta",
            "status": "muy_activa",
            "mechanism": "La descarga simpática masiva y catecolaminas suprarrenales bloquean por completo la secreción de insulina a través de Gi."
          },
          {
            "name": "Receptores Beta-2 Adrenérgicos en Células Alfa",
            "abbreviation": "Beta-2 Adrenérgico",
            "pathway": "Secreción Simpática Máxima de Glucagón",
            "cellularLocation": "Células Alfa",
            "status": "muy_activa",
            "mechanism": "Disparo máximo de glucagón para forzar la glucogenólisis hepática y mantener la glucemia en esfuerzo anaeróbico extremo."
          }
        ],
        "activePathways": [
          "Inhibición simpática extrema de células beta",
          "Estimulación adrenérgica de secreción de glucagón"
        ],
        "inhibitedPathways": [
          "Secreción de insulina dependiente de nutrientes"
        ],
        "transportersActive": [
          "Canales K-ATP (abiertos)",
          "GLUT2"
        ],
        "physiologicalNote": "Garantiza que la glucosa se mantenga libre para las neuronas y el músculo en choque.",
        "atpGenerationStrategy": "Basal."
      }
    },
    "fluxes": [
      {
        "id": "cori-muscle-to-liver-lactate",
        "sourceOrgan": "muscle",
        "targetOrgan": "liver",
        "substrate": "lactate",
        "substrateName": "Lactato Sanguíneo Masivo (Ciclo de Cori)",
        "rate": "masivo",
        "directionDescription": "Músculo Glucolítico (MCT4) -> Sangre -> Hígado (MCT1)",
        "biochemicalPurpose": "Remoción del metabolito ácido muscular y reutilización del esqueleto carbonado",
        "pathwayInvolved": "Lactato Deshidrogenasa y Gluconeogénesis Hepática"
      },
      {
        "id": "cori-liver-to-muscle-glucose",
        "sourceOrgan": "liver",
        "targetOrgan": "muscle",
        "substrate": "glucose",
        "substrateName": "Glucosa Regenerada (Ciclo de Cori)",
        "rate": "alto",
        "directionDescription": "Hígado (GLUT2) -> Sangre -> Músculo en Recuperación",
        "biochemicalPurpose": "Cierra el Ciclo de Cori, devolviendo glucosa al músculo al costo de 6 ATP hepáticos",
        "pathwayInvolved": "Ciclo de Cori completo (Músculo genera 2 ATP, Hígado gasta 6 ATP; costo neto = 4 ATP)"
      },
      {
        "id": "intense-muscle-to-heart-lactate",
        "sourceOrgan": "muscle",
        "targetOrgan": "heart",
        "substrate": "lactate",
        "substrateName": "Lactato Muscular hacia Corazón",
        "rate": "masivo",
        "directionDescription": "Músculo Esquelético -> Torrente Sanguíneo -> Miocardio",
        "biochemicalPurpose": "El corazón consume el lactato como su combustible preferido en alta intensidad",
        "pathwayInvolved": "Oxidación por LDH-1 cardíaca (citosólica) y PDH mitocondrial"
      }
    ],
    "hallmarkFeatures": [
      "Glucólisis anaeróbica acelerada hasta 100 veces por desinhibición alostérica de PFK-1 por AMP",
      "Producción masiva de lactato (> 10-15 mM) y protones intracelulares",
      "Ciclo de Cori activo (sobre todo en la recuperación): el hígado regenera glucosa a expensas de 6 ATP por glucosa",
      "El corazón aclara ávidamente el lactato como combustible primario miocárdico",
      "Translocación masiva de GLUT4 independiente de insulina mediada por AMPK y Ca2+"
    ],
    "clinicalOrPhysiologicalContext": "Representa el límite extremo del rendimiento anaeróbico humano (esprints de 400m, series de intervalos de alta intensidad, levantamiento olímpico). Tras el esfuerzo, el exceso de consumo de oxígeno post-ejercicio (EPOC) refleja la resíntesis de fosfocreatina y ATP, la reposición del O2 de la mioglobina, el aumento de temperatura y catecolaminas, y la eliminación del lactato, que en su mayor parte (~60-75 %) se oxida; solo una fracción vuelve a glucosa por el Ciclo de Cori.",
    "keyRegulatorySwitch": {
      "title": "Activación Alostérica de PFK-1 y Glucógeno Fosforilasa por AMP y Calcio",
      "description": "Durante la contracción violenta, la hidrólisis acelerada de ATP dispara la concentración de AMP y ADP. El AMP es el activador alostérico más potente de la PFK-1 (superando la inhibición del ATP) y de la Glucógeno Fosforilasa muscular. Simultáneamente, el Ca2+ liberado del retículo sarcoplásmico se une a la calmodulina y activa la Fosforilasa Quinasa, disparando la glucogenólisis sin requerir hormonas.",
      "enzyme": "PFK-1 & Glucógeno Fosforilasa Muscular",
      "allostericOrCovalent": "Alosterismo instantáneo por AMP + activación covalente por Ca2+/Calmodulina"
    }
  }
};

export const PATHWAY_MODELS: Record<string, BiochemicalPathwayModel> = {
  "glycolysis_gluconeogenesis": {
    "id": "glycolysis_gluconeogenesis",
    "name": "Glucólisis vs Gluconeogénesis Hepática",
    "organ": "Hígado",
    "description": "El interruptor recíproco maestro entre la oxidación de carbohidratos (posprandio) y la síntesis endógena de glucosa (ayuno). Los tres pasos irreversibles regulados por enzimas distintas evitan ciclos fútiles.",
    "mainSubstrates": [
      "Glucosa",
      "Piruvato",
      "Lactato",
      "Glicerol",
      "Alanina"
    ],
    "mainProducts": [
      "Piruvato / Acetil-CoA (Glucólisis) o Glucosa libre (Gluconeogénesis)"
    ],
    "masterSwitch": "Fructosa-2,6-bisfosfato (F-2,6-BP) sintetizada/degradada por la enzima bifuncional PFK-2 / FBPasa-2.",
    "clinicalRelevance": "En diabetes y resistencia a la insulina, la gluconeogénesis no se apaga tras las comidas, causando hiperglucemia en ayunas.",
    "reactions": [
      {
        "id": "rx-gk-g6pase",
        "from": "Glucosa",
        "to": "Glucosa-6-Fosfato",
        "enzyme": "Glucoquinasa (Glucólisis) vs Glucosa-6-Fosfatasa (Gluconeogénesis)",
        "coenzymes": "ATP -> ADP vs H2O -> Pi",
        "isRateLimiting": false,
        "activityInCurrentState": "activa",
        "regulationNote": "GK inducida por insulina; G6Pasa expresada en retículo endoplásmico hepático y renal inducida por glucagón."
      },
      {
        "id": "rx-pfk1-fbpase1",
        "from": "Fructosa-6-Fosfato",
        "to": "Fructosa-1,6-Bisfosfato",
        "enzyme": "PFK-1 (Glucólisis) vs FBPasa-1 (Gluconeogénesis)",
        "coenzymes": "ATP -> ADP vs H2O -> Pi",
        "isRateLimiting": true,
        "activityInCurrentState": "muy_activa",
        "regulationNote": "Paso limitante maestro. F-2,6-BP activa fuertemente a PFK-1 e inhibe a FBPasa-1. El ATP y Citrato inhiben PFK-1; el AMP la activa."
      },
      {
        "id": "rx-pk-pepck",
        "from": "Fosfoenolpiruvato (PEP)",
        "to": "Piruvato",
        "enzyme": "Piruvato Quinasa (Glucólisis) vs Piruvato Carboxilasa + PEPCK (Gluconeogénesis)",
        "coenzymes": "ADP -> ATP vs ATP + GTP + CO2",
        "isRateLimiting": true,
        "activityInCurrentState": "activa",
        "regulationNote": "La Piruvato Carboxilasa mitocondrial requiere Acetil-CoA obligatorio. La PEPCK citosólica es inducida por glucagón y cortisol."
      }
    ]
  },
  "glycogen_metabolism": {
    "id": "glycogen_metabolism",
    "name": "Glucogenogénesis vs Glucogenólisis Hepática",
    "organ": "Hígado",
    "description": "Almacenamiento y liberación rápida de glucosa. El glucógeno hepático amortigua la glucemia en el ayuno temprano y queda prácticamente agotado hacia las 24-36 horas.",
    "mainSubstrates": [
      "Glucosa-1-Fosfato / UDP-Glucosa",
      "Glucógeno"
    ],
    "mainProducts": [
      "Glucógeno polimerizado o Glucosa libre"
    ],
    "masterSwitch": "Fosforilación coordinada por la cascada Glucagón/AMPc/PKA vs Desfosforilación por Insulina/PP1.",
    "clinicalRelevance": "Enfermedades de almacenamiento de glucógeno (Von Gierke, Cori, McArdle) causan hipoglucemias o intolerancia al ejercicio.",
    "reactions": [
      {
        "id": "rx-gs-gp",
        "from": "UDP-Glucosa / Glucógeno (n)",
        "to": "Glucógeno (n+1) / Glucosa-1-P",
        "enzyme": "Glucógeno Sintasa (GS) vs Glucógeno Fosforilasa (GP)",
        "coenzymes": "UDP vs Pi",
        "isRateLimiting": true,
        "activityInCurrentState": "muy_activa",
        "regulationNote": "Regulación covalente recíproca: Fosforilada = GP activa (lisis) y GS inactiva. Desfosforilada = GS activa (síntesis) y GP inactiva."
      }
    ]
  },
  "lipid_oxidation_lipogenesis": {
    "id": "lipid_oxidation_lipogenesis",
    "name": "Lipogénesis de Novo vs Beta-Oxidación & CPT-1",
    "organ": "Hígado y Tejido Adiposo",
    "description": "El control del flujo de ácidos grasos. Cuando hay exceso de carbohidratos, se sintetizan grasas y se bloquea su quema. En el ayuno, se desbloquea su entrada a la mitocondria.",
    "mainSubstrates": [
      "Acetil-CoA",
      "Malonil-CoA",
      "Acil-CoA graso"
    ],
    "mainProducts": [
      "Palmitato / Triglicéridos o Acetil-CoA mitocondrial"
    ],
    "masterSwitch": "Malonil-CoA: producto de la ACC e inhibidor alostérico de la Carnitina Palmitoiltransferasa 1 (CPT-1).",
    "clinicalRelevance": "En cetoacidosis diabética, la ausencia de malonil-CoA deja a CPT-1 abierta al 100%, desatando la cetogénesis masiva.",
    "reactions": [
      {
        "id": "rx-acc-cpt1",
        "from": "Acetil-CoA citosólico",
        "to": "Malonil-CoA -> Acil-Carnitina mitocondrial",
        "enzyme": "Acetil-CoA Carboxilasa (ACC) y CPT-1",
        "coenzymes": "ATP + HCO3- + Biotina",
        "isRateLimiting": true,
        "activityInCurrentState": "activa",
        "regulationNote": "La ACC es activada por citrato e insulina (desfosforilada) e inhibida por palmitoil-CoA y glucagón/AMPK (fosforilada). El Malonil-CoA cierra la CPT-1."
      }
    ]
  },
  "ketogenesis_ketolysis": {
    "id": "ketogenesis_ketolysis",
    "name": "Cetogénesis Hepática & Cetólisis Extrahepática",
    "organ": "Hígado (síntesis) vs Cerebro, Corazón, Músculo (consumo)",
    "description": "Síntesis de combustibles solubles en agua a partir de grasas que pueden cruzar la barrera hematoencefálica.",
    "mainSubstrates": [
      "Acetil-CoA mitocondrial excedente"
    ],
    "mainProducts": [
      "Acetoacetato, β-Hidroxibutirato y Acetona"
    ],
    "masterSwitch": "Exceso de Acetil-CoA mitocondrial relativo al Oxaloacetato disponible + Inducción de HMG-CoA Sintasa.",
    "clinicalRelevance": "La cetosis fisiológica del ayuno prolongado salva la masa muscular; la cetoacidosis diabética es letal por falta de insulina.",
    "reactions": [
      {
        "id": "rx-hmgcs-scot",
        "from": "3 Acetil-CoA -> Acetoacetil-CoA -> HMG-CoA",
        "to": "Acetoacetato -> β-Hidroxibutirato",
        "enzyme": "mHMG-CoA Sintasa (Hígado) vs Tioforasa / SCOT (Tejidos periféricos)",
        "coenzymes": "NADH <-> NAD+",
        "isRateLimiting": true,
        "activityInCurrentState": "activa",
        "regulationNote": "La tiolasa une 2 acetil-CoA (acetoacetil-CoA) y la mHMG-CoA sintasa añade un tercero; la HMG-CoA liasa libera después un acetil-CoA (balance neto: 2 acetil-CoA por acetoacetato). El hígado carece de la enzima Tioforasa (SCOT), impidiendo que consuma sus propias cetonas."
      }
    ]
  },
  "cori_and_cahill_cycles": {
    "id": "cori_and_cahill_cycles",
    "name": "Ciclo de Cori (Lactato) & Ciclo de Cahill (Alanina)",
    "organ": "Músculo Esquelético <-> Hígado",
    "description": "Circuitos interorgánicos que reciclan lactato y transportan nitrógeno tóxico de aminoácidos musculares hacia el hígado para síntesis de glucosa.",
    "mainSubstrates": [
      "Lactato muscular",
      "Alanina muscular"
    ],
    "mainProducts": [
      "Glucosa hepática regenerada + Urea"
    ],
    "masterSwitch": "Demanda glucolítica anaeróbica muscular y proteólisis.",
    "clinicalRelevance": "En ejercicio intenso o shock con hipoperfusión, el ciclo de Cori traslada la deuda energética al hígado.",
    "reactions": [
      {
        "id": "rx-cori",
        "from": "Lactato muscular (LDH-A)",
        "to": "Glucosa hepática (LDH-5 / LDH-A + Gluconeogénesis)",
        "enzyme": "Lactato Deshidrogenasa muscular y hepática",
        "coenzymes": "NADH / NAD+ y 6 ATP en hígado",
        "isRateLimiting": false,
        "activityInCurrentState": "muy_activa",
        "regulationNote": "El músculo obtiene 2 ATP netos; el hígado invierte 6 ATP para resintetizar glucosa. Costo neto sistémico = 4 ATP."
      }
    ]
  }
};

export const CLINICAL_CASES: ClinicalCaseQuestion[] = [
  {
    "id": "case-1-dka-vs-starvation",
    "patientScenario": "Mujer de 21 años es traída a urgencias con deshidratación grave, náuseas, respiración profunda y rápida (respiración de Kussmaul) y un peculiar aliento afrutado similar a manzanas podridas. Antecedente de infección respiratoria hace 3 días.",
    "symptoms": [
      "Respiración rápida y profunda (Kussmaul)",
      "Deshidratación severa con mucosas secas y taquicardia",
      "Dolor abdominal difuso y náuseas",
      "Aliento a acetona"
    ],
    "labValues": [
      {
        "parameter": "Glucosa plasmática",
        "value": "480 mg/dL",
        "reference": "70 - 99 mg/dL"
      },
      {
        "parameter": "pH arterial",
        "value": "7.12",
        "reference": "7.35 - 7.45"
      },
      {
        "parameter": "Bicarbonato (HCO3-)",
        "value": "8 mEq/L",
        "reference": "22 - 26 mEq/L"
      },
      {
        "parameter": "Cuerpos cetónicos en orina",
        "value": "++++ (Muy positivo)",
        "reference": "Negativo"
      },
      {
        "parameter": "Anión Gap",
        "value": "26 mEq/L",
        "reference": "8 - 12 mEq/L"
      }
    ],
    "question": "¿Cuál es el defecto bioquímico molecular primario responsable de la producción masiva de cuerpos cetónicos en esta paciente?",
    "options": [
      {
        "id": "opt-a",
        "text": "Ausencia de insulina que reduce el Malonil-CoA a cero, dejando a la CPT-1 permanentemente desinhibida.",
        "isCorrect": true,
        "feedback": "¡Exacto! Sin insulina, la Acetil-CoA Carboxilasa (ACC) se apaga, desaparece el Malonil-CoA y la CPT-1 queda abierta al 100%, transportando un flujo torrencial de ácidos grasos a la mitocondria hepática para una cetogénesis descontrolada."
      },
      {
        "id": "opt-b",
        "text": "Inhibición de la enzima Carnitina Palmitoiltransferasa 1 (CPT-1) por el exceso de glucosa.",
        "isCorrect": false,
        "feedback": "Incorrecto. La CPT-1 no está inhibida, sino activada al máximo. Si estuviera inhibida, no habría entrada de ácidos grasos a la mitocondria ni cetogénesis."
      },
      {
        "id": "opt-c",
        "text": "Exceso de captación de glucosa por GLUT4 en músculo esquelético.",
        "isCorrect": false,
        "feedback": "Incorrecto. Al no haber insulina, GLUT4 se encuentra secuestrado en el interior celular y no capta glucosa."
      },
      {
        "id": "opt-d",
        "text": "Agotamiento del glucógeno muscular por falta de aporte calórico.",
        "isCorrect": false,
        "feedback": "Incorrecto. La paciente tiene una glucemia masiva (480 mg/dL). No es un problema de falta de glucosa en sangre, sino de falta absoluta de la señal insulínica."
      }
    ],
    "biochemicalExplanation": "En la Cetoacidosis Diabética (CAD), la ausencia de insulina impide activar a la fosfatasa PP2A y mantiene a la Acetil-CoA Carboxilasa (ACC) fosforilada e inactiva. Al caer el Malonil-CoA a cero, la CPT-1 queda completamente desinhibida. Sumado a una lipólisis adipocitaria desbocada que envía un aluvión de ácidos grasos al hígado, la mitocondria se satura de Acetil-CoA que sobrepasa el ciclo de Krebs y se desvía masivamente a la HMG-CoA Sintasa mitocondrial, produciendo acetoacetato y β-hidroxibutirato que agotan el tampón bicarbonato.",
    "keyTakeaway": "El Malonil-CoA es el guardián de la puerta mitocondrial: sin insulina, no hay Malonil-CoA y la CPT-1 permanece abierta sin restricción.",
    "relatedStateId": "diabetes_t1_dka"
  },
  {
    "id": "case-2-marathon-the-wall",
    "patientScenario": "Un corredor de maratón en el kilómetro 33 experimenta una fatiga súbita y abrumadora, sensación de pesadez extrema en las piernas y enlentecimiento forzado del ritmo, fenómeno conocido popularmente como \"chocar contra el muro\".",
    "symptoms": [
      "Incapacidad para mantener el ritmo de carrera",
      "Sensación de pesadez muscular profunda",
      "Confusión leve y mareo"
    ],
    "labValues": [
      {
        "parameter": "Glucemia en campo",
        "value": "62 mg/dL",
        "reference": "70 - 99 mg/dL"
      },
      {
        "parameter": "Lactato sanguíneo",
        "value": "1.8 mM",
        "reference": "0.5 - 1.5 mM"
      },
      {
        "parameter": "Ácidos grasos libres",
        "value": "1.8 mM",
        "reference": "0.3 - 0.6 mM"
      }
    ],
    "question": "Desde el punto de vista de la integración de rutas metabólicas, ¿qué evento bioquímico explica este colapso?",
    "options": [
      {
        "id": "opt-a",
        "text": "Acumulación tóxica masiva de ácido láctico que inhibe la contracción.",
        "isCorrect": false,
        "feedback": "Incorrecto. El lactato está en 1.8 mM (por debajo del umbral anaeróbico). El corredor no está en acidosis láctica, sino en un esfuerzo aeróbico prolongado."
      },
      {
        "id": "opt-b",
        "text": "Agotamiento completo del glucógeno muscular y hepático, obligando al músculo a depender casi exclusivamente de la beta-oxidación de ácidos grasos, cuya tasa máxima de síntesis de ATP es ~50% menor.",
        "isCorrect": true,
        "feedback": "¡Correcto! El glucógeno muscular y hepático se agota tras ~2 horas de carrera continua. Aunque hay abundantes ácidos grasos, su velocidad de oxidación mitocondrial por unidad de tiempo es más lenta que la del glucógeno, forzando a reducir la velocidad a la mitad."
      },
      {
        "id": "opt-c",
        "text": "Fallo súbito de los receptores de insulina en la membrana muscular.",
        "isCorrect": false,
        "feedback": "Incorrecto. Durante el ejercicio, la captación de glucosa depende de AMPK y contracción, no de insulina."
      },
      {
        "id": "opt-d",
        "text": "Bloqueo completo de la enzima carnitina palmitoiltransferasa 1 (CPT-1).",
        "isCorrect": false,
        "feedback": "Incorrecto. CPT-1 está altamente activa quemando ácidos grasos libres."
      }
    ],
    "biochemicalExplanation": "El cuerpo humano solo puede almacenar unas 2,000 kcal en forma de glucógeno (~400 g en músculo y ~100 g en hígado). A los ~32-35 km de una maratón, estas reservas se extinguen. El músculo se ve obligado a obtener casi el 100% de su energía de la beta-oxidación de ácidos grasos libres. Sin embargo, la tasa de transferencia de electrones y rendimiento de ATP por segundo a partir de ácidos grasos requiere más oxígeno y es un 50% más lenta que a partir de glucosa. El corredor no puede mantener el ritmo anterior y debe frenar.",
    "keyTakeaway": "Las grasas ofrecen una reserva de energía casi infinita en calorías, pero su potencia oxidativa (ATP/segundo) es significativamente menor que la de los carbohidratos.",
    "relatedStateId": "exercise_moderate"
  },
  {
    "id": "case-3-insulin-resistance-nafld",
    "patientScenario": "Hombre de 48 años con obesidad abdominal (perímetro de cintura 106 cm), acantosis nigricans en cuello y axilas, y ecografía abdominal que revela esteatosis hepática moderada (MASLD, antes llamada hígado graso no alcohólico).",
    "symptoms": [
      "Astenia posprandial",
      "Acantosis nigricans en pliegues cutáneos",
      "Obesidad centrípeta"
    ],
    "labValues": [
      {
        "parameter": "Glucosa en ayunas",
        "value": "118 mg/dL",
        "reference": "70 - 99 mg/dL"
      },
      {
        "parameter": "Insulina en ayunas",
        "value": "28 μU/mL",
        "reference": "2 - 15 μU/mL"
      },
      {
        "parameter": "HOMA-IR",
        "value": "8.1",
        "reference": "< 2.5"
      },
      {
        "parameter": "Triglicéridos",
        "value": "260 mg/dL",
        "reference": "< 150 mg/dL"
      },
      {
        "parameter": "HDL-Colesterol",
        "value": "34 mg/dL",
        "reference": "> 40 mg/dL"
      }
    ],
    "question": "¿Cómo se explica la paradoja de que este paciente tenga hiperglucemia en ayunas pero simultáneamente sufra de acumulación masiva de grasa en el hígado (esteatosis)?",
    "options": [
      {
        "id": "opt-a",
        "text": "El hígado es resistente a la insulina para frenar la gluconeogénesis (vía FOXO1), pero conserva sensibilidad insulínica para activar la lipogénesis de novo (vía SREBP-1c bajo hiperinsulinemia).",
        "isCorrect": true,
        "feedback": "¡Excelente razonamiento! Esta es la clásica paradoja de la resistencia selectiva hepática: la vía de supresión de gluconeogénesis mediada por Akt/FOXO1 fracasa (hiperglucemia), pero la vía lipogénica de SREBP-1c es sobreestimulada por la elevada insulina circulante."
      },
      {
        "id": "opt-b",
        "text": "El hígado no tiene receptores de insulina y solo responde a glucagón.",
        "isCorrect": false,
        "feedback": "Incorrecto. El hígado posee una densidad altísima de receptores de insulina."
      },
      {
        "id": "opt-c",
        "text": "Toda la grasa del hígado proviene directamente de la comida ingerida sin participación metabólica endógena.",
        "isCorrect": false,
        "feedback": "Incorrecto. La mayor parte procede de los AGL liberados por el tejido adiposo resistente a la insulina (~60%), seguida de la lipogénesis de novo hepática (~25%); la dieta aporta una fracción menor."
      },
      {
        "id": "opt-d",
        "text": "La enzima Acetil-CoA Carboxilasa (ACC) se encuentra mutada y destruida.",
        "isCorrect": false,
        "feedback": "Incorrecto. La ACC está hiperactiva en este paciente debido a la hiperinsulinemia y sobreexpresión de SREBP-1c."
      }
    ],
    "biochemicalExplanation": "En el síndrome metabólico, la transducción de la señal insulínica se bifurca en el hepatocito. La rama que controla la supresión de la gluconeogénesis (IRS-1 -> Akt -> fosforilación de FOXO1 para excluirlo del núcleo) sufre resistencia tisular; por tanto, FOXO1 transcribe continuamente PEPCK y G6Pasa, produciendo glucosa en ayunas. Sin embargo, la rama lipogénica (mediada en parte por mTORC1) sigue respondiendo a la hiperinsulinemia compensatoria activando a SREBP-1c, estimulando la síntesis de novo de ácidos grasos y triglicéridos (esteatosis hepática y VLDL alta).",
    "keyTakeaway": "La resistencia a la insulina no es un apagón total en todos los órganos ni en todas las vías: es selectiva y heterogénea.",
    "relatedStateId": "insulin_resistance"
  },
  {
    "id": "case-4-starvation-brain-ketones",
    "patientScenario": "Durante una expedición en el Ártico, un explorador queda incomunicado sin provisiones y sobrevive 21 días bebiendo agua de deshielo con sales minerales antes de ser rescatado. En la evaluación inicial se encuentra consciente, lúcido, con extrema emaciación pero sin daño neurológico permanente.",
    "symptoms": [
      "Pérdida de peso de ~10 kg",
      "Marcada reducción del panículo adiposo",
      "Funciones cognitivas y memoria preservadas"
    ],
    "labValues": [
      {
        "parameter": "Glucosa plasmática",
        "value": "64 mg/dL",
        "reference": "70 - 99 mg/dL"
      },
      {
        "parameter": "Cuerpos cetónicos",
        "value": "7.2 mM",
        "reference": "< 0.2 mM"
      },
      {
        "parameter": "Excreción urinaria de urea",
        "value": "4 g/24h",
        "reference": "15 - 30 g/24h"
      }
    ],
    "question": "¿Qué mecanismo fisiológico y bioquímico permitió que este individuo conservara sus facultades neurológicas y sobreviviera sin agotar su masa muscular vital?",
    "options": [
      {
        "id": "opt-a",
        "text": "La inducción de transportadores MCT1/MCT2 en la barrera hematoencefálica permitió al cerebro cubrir el ~70% de su energía con cuerpos cetónicos, reduciendo el consumo cerebral de glucosa a solo ~40 g/día y frenando la proteólisis muscular.",
        "isCorrect": true,
        "feedback": "¡Perfecto! La ceto-adaptación cerebral reduce la demanda obligada de glucosa de 120g/día a ~40g/día. Al necesitar menos glucosa, el hígado no tiene que desaminar aminoácidos musculares aceleradamente, ahorrando proteínas vitales como el diafragma y corazón."
      },
      {
        "id": "opt-b",
        "text": "El cerebro comenzó a oxidar directamente triglicéridos enteros procedentes de la sangre.",
        "isCorrect": false,
        "feedback": "Incorrecto. Los triglicéridos no atraviesan la barrera hematoencefálica y, aunque los ácidos grasos sí la cruzan, el cerebro apenas los oxida (baja capacidad de β-oxidación neuronal)."
      },
      {
        "id": "opt-c",
        "text": "El músculo esquelético se transformó en tejido productor de glucosa libre mediante activación de G6Pasa.",
        "isCorrect": false,
        "feedback": "Incorrecto. El músculo esquelético jamás puede exportar glucosa libre porque carece constitutivamente de Glucosa-6-Fosfatasa."
      },
      {
        "id": "opt-d",
        "text": "La tasa metabólica basal aumentó al triple para generar calor y quemar agua.",
        "isCorrect": false,
        "feedback": "Incorrecto. En inanición, la tasa metabólica basal disminuye de forma adaptativa para prolongar la supervivencia."
      }
    ],
    "biochemicalExplanation": "Si el cerebro dependiera obligatoriamente de 120g de glucosa al día durante la inanición, el organismo tendría que degradar unos 150-200 g diarios de proteína (se necesitan ~1,7 g de aminoácidos por gramo de glucosa) para proveer sustratos gluconeogénicos, agotando la proteína movilizable en pocas semanas y causando la muerte por fallo de la musculatura respiratoria. La adaptación a cuerpos cetónicos eleva la expresión de transportadores de monocarboxilatos (MCT1 y MCT2) en la BHE y enzimas cetolíticas cerebrales (SCOT / β-hidroxibutirato deshidrogenasa). Al sustituir las 2/3 partes del requerimiento por cetonas, el consumo de glucosa cae a ~40g/día, volumen que el hígado y riñón pueden suministrar cómodamente a partir de glicerol del tejido adiposo y proteólisis mínima (~20g/día).",
    "keyTakeaway": "Los cuerpos cetónicos no son un subproducto tóxico accidental: son la moneda de supervivencia que salvó a la especie humana durante las hambrunas evolutivas.",
    "relatedStateId": "starvation"
  },
  {
    "id": "case-5-sprint-cori-cycle",
    "patientScenario": "Un atleta de pista completa una carrera de 400 metros planos a máxima velocidad (44.5 segundos). Al cruzar la línea de meta, cae al suelo hiperventilando intensamente con dolor urente extremo en cuádriceps y glúteos.",
    "symptoms": [
      "Hiperventilación compensatoria inmediata",
      "Dolor muscular isquémico urente bilateral",
      "Incapacidad temporal para levantarse"
    ],
    "labValues": [
      {
        "parameter": "Lactato capilar post-carrera",
        "value": "14.8 mM",
        "reference": "0.5 - 1.5 mM"
      },
      {
        "parameter": "pH capilar",
        "value": "7.18",
        "reference": "7.35 - 7.45"
      },
      {
        "parameter": "Glucemia inmediata",
        "value": "125 mg/dL",
        "reference": "70 - 99 mg/dL"
      }
    ],
    "question": "Durante los 30 minutos posteriores a la carrera, ¿qué vía metabólica interorgánica se encarga de procesar este lactato masivo y cuál es su balance neto de ATP?",
    "options": [
      {
        "id": "opt-a",
        "text": "El Ciclo de Cori: el lactato viaja al hígado, donde es reconvertido a glucosa consumiendo 6 ATP por cada molécula de glucosa producida.",
        "isCorrect": true,
        "feedback": "¡Exacto! El músculo generó 2 ATP netos por glucosa anaeróbica; el hígado en el Ciclo de Cori debe invertir 6 ATP (en las reacciones de Piruvato Carboxilasa, PEPCK y Fosfoglicerato Quinasa) para regenerar esa glucosa. El balance neto sistémico es un déficit de 4 ATP, que el hígado cubre con la beta-oxidación. Matiz: en la recuperación, la mayor parte del lactato (~60-75 %) se oxida directamente en corazón y fibras oxidativas; el ciclo de Cori recicla una fracción menor."
      },
      {
        "id": "opt-b",
        "text": "La respiración mitocondrial del músculo convierte todo el lactato a glucógeno in situ sin gastar energía.",
        "isCorrect": false,
        "feedback": "Incorrecto. La gluconeogénesis no ocurre en el músculo; el lactato debe viajar por la sangre al hígado (o ser oxidado en corazón/fibras lentas)."
      },
      {
        "id": "opt-c",
        "text": "El riñón excreta el 100% del lactato en orina sin reutilizarlo metabólicamente.",
        "isCorrect": false,
        "feedback": "Incorrecto. El lactato es un valioso sustrato de 3 carbonos y el organismo lo recicla casi en su totalidad."
      },
      {
        "id": "opt-d",
        "text": "El tejido adiposo absorbe el lactato para sintetizar triglicéridos mediante lipogénesis.",
        "isCorrect": false,
        "feedback": "Incorrecto. El tejido adiposo no utiliza el lactato como sustrato lipogénico primario."
      }
    ],
    "biochemicalExplanation": "En el esprint de 400m, la demanda de ATP supera ampliamente la velocidad máxima de la fosforilación oxidativa mitocondrial (aun así, alrededor del 35-45 % de la energía total de un 400 m es aeróbica). La glucólisis anaeróbica genera lactato para regenerar NAD+ y mantener la PFK-1 activa. Una vez finalizado el esfuerzo, el lactato acumulado se expulsa por transportadores MCT4 a la sangre. El hígado capta este lactato vía MCT1 y, mediante la LDH hepática (LDH-5, isoenzima M4), lo oxida a piruvato para alimentar la gluconeogénesis (Ciclo de Cori). La síntesis hepática de una glucosa a partir de dos lactatos consume 2 ATP en Piruvato Carboxilasa, 2 GTP en PEPCK y 2 ATP en Fosfoglicerato Quinasa (total: 6 ATP equivalentes).",
    "keyTakeaway": "El Ciclo de Cori es un préstamo metabólico: el músculo toma prestada energía rápida generando 2 ATP y deuda de lactato, y el hígado paga la deuda en la recuperación invirtiendo 6 ATP.",
    "relatedStateId": "exercise_intense"
  },
  {
    "id": "case-6-fasting-ketosis-vs-dka",
    "patientScenario": "Dos pacientes llegan el mismo día con cetonuria intensa. A: mujer de 34 años sin antecedentes que lleva 10 días en un ayuno voluntario solo con agua y electrolitos; está lúcida y estable. B: varón de 19 años con diabetes tipo 1 que dejó de administrarse insulina hace 2 días; está somnoliento, vomita y tiene respiración de Kussmaul.",
    "symptoms": [
      "A: ceto-adaptación sin síntomas graves",
      "B: deshidratación, vómitos y respiración profunda y rápida",
      "Ambos: aliento cetónico"
    ],
    "labValues": [
      {
        "parameter": "Cuerpos cetónicos (A / B)",
        "value": "4.5 mM / 18 mM",
        "reference": "< 0.2 mM"
      },
      {
        "parameter": "Glucemia (A / B)",
        "value": "66 mg/dL / 520 mg/dL",
        "reference": "70 - 99 mg/dL"
      },
      {
        "parameter": "pH arterial (A / B)",
        "value": "7.36 / 7.08",
        "reference": "7.35 - 7.45"
      },
      {
        "parameter": "Bicarbonato (A / B)",
        "value": "21 / 9 mEq/L",
        "reference": "22 - 26 mEq/L"
      }
    ],
    "question": "¿Qué diferencia bioquímica explica que la paciente A mantenga el pH casi normal mientras el paciente B entra en cetoacidosis grave?",
    "options": [
      {
        "id": "opt-a",
        "text": "En el ayuno persiste una secreción basal de insulina que frena la lipólisis y limita la cetogénesis a ~4-5 mM; en la CAD la ausencia absoluta de insulina deja la lipólisis y la cetogénesis sin freno.",
        "isCorrect": true,
        "feedback": "¡Correcto! La insulina residual del ayuno actúa como freno lipolítico: la cetonemia se estabiliza en torno a 4-5 mM, el bicarbonato amortigua los cetoácidos y el pH se mantiene ≥ 7.35. Sin insulina, la HSL queda sin freno, la cetonemia supera los 15-20 mM y se agota el bicarbonato."
      },
      {
        "id": "opt-b",
        "text": "En el ayuno el hígado deja de producir cuerpos cetónicos a partir del décimo día.",
        "isCorrect": false,
        "feedback": "Incorrecto. Al décimo día de ayuno la cetogénesis está plenamente activa; precisamente el cerebro obtiene entonces buena parte de su energía de los cuerpos cetónicos."
      },
      {
        "id": "opt-c",
        "text": "En la CAD los cuerpos cetónicos son distintos: se forma ácido láctico en lugar de β-hidroxibutirato.",
        "isCorrect": false,
        "feedback": "Incorrecto. Los cuerpos cetónicos son los mismos (acetoacetato y β-hidroxibutirato); cambia la cantidad, no el tipo."
      },
      {
        "id": "opt-d",
        "text": "La hiperglucemia del paciente B es, por sí sola, la causa de la acidosis.",
        "isCorrect": false,
        "feedback": "Incorrecto. La hiperglucemia produce diuresis osmótica y deshidratación, pero la acidosis se debe a la acumulación de cetoácidos."
      }
    ],
    "biochemicalExplanation": "En el ayuno prolongado, el cociente insulina/glucagón es muy bajo pero no nulo: la insulina residual mantiene un freno parcial sobre la lipasa sensible a hormonas, de modo que el flujo de ácidos grasos al hígado y la cetogénesis se ajustan al consumo periférico (cerebro, corazón, músculo). La cetonemia se estabiliza en 4-5 mM, un nivel que el bicarbonato y la excreción renal de NH4+ compensan, con pH ≥ 7.35. En la CAD, la ausencia absoluta de insulina, junto con el exceso de glucagón, catecolaminas y cortisol, libera la lipólisis de todo control: la β-oxidación hepática desinhibida (malonil-CoA nulo, CPT-1 abierta) produce cuerpos cetónicos por encima de 15-20 mM, que superan la capacidad tampón y causan acidosis metabólica con anión gap elevado (pH < 7.20, HCO3- < 15 mEq/L).",
    "keyTakeaway": "Cetosis no es cetoacidosis: lo que separa la adaptación del ayuno de la emergencia diabética es la presencia de una insulina residual que frena la lipólisis.",
    "relatedStateId": "starvation"
  },
  {
    "id": "case-7-ethanol-redox",
    "patientScenario": "Varón de 52 años con consumo elevado de alcohol que, tras un fin de semana bebiendo sin apenas comer, acude con sudoración, temblor y confusión. La ecografía muestra un hígado graso.",
    "symptoms": [
      "Confusión y sudoración fría",
      "Temblor",
      "Hepatomegalia por esteatosis"
    ],
    "labValues": [
      {
        "parameter": "Glucemia",
        "value": "48 mg/dL",
        "reference": "70 - 99 mg/dL"
      },
      {
        "parameter": "Lactato",
        "value": "3.8 mM",
        "reference": "0.5 - 1.5 mM"
      },
      {
        "parameter": "Triglicéridos",
        "value": "310 mg/dL",
        "reference": "< 150 mg/dL"
      },
      {
        "parameter": "Etanol en sangre",
        "value": "1.9 g/L",
        "reference": "0 g/L"
      }
    ],
    "question": "¿Qué alteración bioquímica hepática explica a la vez la hipoglucemia, el lactato elevado y la esteatosis?",
    "options": [
      {
        "id": "opt-a",
        "text": "La oxidación del etanol (alcohol deshidrogenasa y acetaldehído deshidrogenasa) eleva el cociente NADH/NAD+, que desplaza el piruvato a lactato y el oxalacetato a malato, frena la gluconeogénesis y la β-oxidación y favorece la reesterificación de ácidos grasos.",
        "isCorrect": true,
        "feedback": "¡Correcto! Con el glucógeno agotado por el ayuno, la glucemia depende de la gluconeogénesis, que queda bloqueada por falta de piruvato y oxalacetato. El mismo exceso de NADH inhibe la β-oxidación, y los ácidos grasos no oxidados se acumulan como triacilgliceroles."
      },
      {
        "id": "opt-b",
        "text": "El etanol estimula directamente la secreción de insulina por las células β.",
        "isCorrect": false,
        "feedback": "Incorrecto. La hipoglucemia alcohólica se produce con insulina baja: el problema es que el hígado no puede fabricar glucosa."
      },
      {
        "id": "opt-c",
        "text": "El acetaldehído activa la glucosa-6-fosfatasa y vacía la glucosa hepática.",
        "isCorrect": false,
        "feedback": "Incorrecto. La glucosa-6-fosfatasa sigue siendo funcional; lo que falta es sustrato gluconeogénico disponible."
      },
      {
        "id": "opt-d",
        "text": "El lactato procede de una hipoxia muscular causada por el temblor.",
        "isCorrect": false,
        "feedback": "Incorrecto. El lactato se acumula porque el hígado, con exceso de NADH, convierte piruvato en lactato y deja de captarlo para la gluconeogénesis."
      }
    ],
    "biochemicalExplanation": "El hígado oxida el etanol a acetaldehído (alcohol deshidrogenasa, citosólica) y a acetato (acetaldehído deshidrogenasa, mitocondrial); ambas reacciones reducen NAD+ a NADH. El aumento del cociente NADH/NAD+ desplaza los equilibrios de la lactato deshidrogenasa (piruvato → lactato) y de la malato deshidrogenasa (oxalacetato → malato), retirando los sustratos de la gluconeogénesis. Si el glucógeno hepático ya está agotado por el ayuno, aparece una hipoglucemia grave. El exceso de NADH inhibe además la 3-hidroxiacil-CoA deshidrogenasa de la β-oxidación y el ciclo de Krebs; los ácidos grasos que no se oxidan se reesterifican a triacilgliceroles, causando esteatosis e hipertrigliceridemia.",
    "keyTakeaway": "El etanol no es tóxico solo por el acetaldehído: el exceso de NADH que genera reprograma el hígado hacia lactato, malato y grasa.",
    "relatedStateId": "late_fasting"
  }
];

export const MUSCLE_BIOENERGETICS_CHRONOLOGY = [
  {
    "phase": "Fase Inmediata de Fosfágenos (0 - 4 segundos)",
    "duration": "0 - 4 s",
    "system": "Hidrólisis de ATP libre intracelular",
    "enzyme": "Miosín-ATPasa",
    "rateOfATP": "Extremadamente rápida (inmediata)",
    "limitingFactor": "El ATP muscular (~5 mM) solo sostendría ~2 s de contracción máxima, pero nunca se agota (cae ≤30-40 %): la fosfocreatina lo regenera desde la primera contracción y los sistemas se solapan",
    "examples": "Saque de tenis, remate en fútbol, repetición máxima de halterofilia"
  },
  {
    "phase": "Sistema de Fosfocreatina (4 - 10 segundos)",
    "duration": "4 - 10 s",
    "system": "Transferencia de fosfato de alta energía (PCr + ADP ⇄ Cr + ATP)",
    "enzyme": "Creatina Quinasa (CK)",
    "rateOfATP": "Ultrarrápida (sin requerir O2)",
    "limitingFactor": "Depleción de las reservas de fosfocreatina miocítica (~20-25 mM)",
    "examples": "Fase explosiva inicial de 100m lisos, esprint de escape"
  },
  {
    "phase": "Glucólisis Anaeróbica / Nivel de Sustrato (10 s - 2 minutos)",
    "duration": "10 s - 2 min",
    "system": "Glucógeno muscular a G1P ➔ Glucólisis ➔ Piruvato a Lactato",
    "enzyme": "PFK-1 (activada por AMP) & Lactato Deshidrogenasa (LDH)",
    "rateOfATP": "Rápida (máximo rendimiento a los 5-10s)",
    "limitingFactor": "Acumulación de protones (H+), fosfato inorgánico y acidificación",
    "examples": "Carrera de 200m a 400m lisos, prueba de natación de 100m"
  },
  {
    "phase": "Fosforilación Oxidativa Aeróbica (contribuye desde el inicio; predomina a partir de ~1-2 min)",
    "duration": "Desde el inicio; predomina > 1-2 min",
    "system": "Descarboxilación oxidativa del piruvato + Beta-oxidación de AGL",
    "enzyme": "Ciclo de Krebs & Cadena Transportadora de Electrones",
    "rateOfATP": "Lenta pero casi ilimitada",
    "limitingFactor": "Disponibilidad de O2, densidad mitocondrial y transporte de AGL",
    "examples": "Carreras de fondo, maratón (>42km), ciclismo de ruta"
  }
];

export const AMPK_REGULATORY_DETAILS = {
  "molecularArchitecture": "Complejo heterotrimérico (α, β, γ). Ubicado en el citosol en proximidad física a las partículas de glucógeno.",
  "energyChargeFormula": "Carga Energética = (ATP + 0.5 ADP) / (ATP + ADP + AMP)",
  "sensorMechanism": "La adenilato quinasa (2 ADP ⇄ ATP + AMP) amplifica una caída del 10% de ATP en un aumento del 100-500% de AMP libre. El AMP se une a la subunidad γ (sitios CBS) induciendo un cambio conformacional que expone la Thr-172 en la subunidad α catalítica para su fosforilación por LKB1 (o CaMKKβ por Ca2+).",
  "glycogenBrake": "La subunidad β posee un dominio CBM que se une a ramificaciones de glucógeno; cuando el glucógeno está saturado ejerce un freno estérico directo impidiendo la fosforilación por LKB1. Al depletarse el glucógeno, el freno se elimina.",
  "phosphocreatineInhibition": "Se propuso que la fosfocreatina inhibía alostéricamente a la AMPK, pero los estudios con enzima purificada no lo confirmaron (Suter et al., 2006); la AMPK responde al AMP/ADP y al glucógeno.",
  "tissueEffects": [
    {
      "organ": "Hígado",
      "action": "Fosforila e inactiva a la Acetil-CoA Carboxilasa (ACC1), abatiendo el Malonil-CoA y desinhibiendo a CPT-1 para acelerar la beta-oxidación. Inactiva a la HMG-CoA Reductasa (bloquea síntesis de colesterol) y suprime factores lipogénicos (SREBP-1c, ChREBP)."
    },
    {
      "organ": "Músculo Esquelético",
      "action": "Estimula la translocación de GLUT4 a la membrana por fosforilación de TBC1D1/TBC1D4 de forma INDEPENDIENTE de insulina. Inactiva ACC2 muscular aumentando la beta-oxidación mitocondrial."
    },
    {
      "organ": "Miocardio",
      "action": "Fosforila la isozima cardíaca de PFK-2 (en Ser-466) aumentando su actividad quinasa y disparando la Fructosa-2,6-bisfosfato para acelerar la glucólisis y sostener el gasto contráctil."
    },
    {
      "organ": "Tejido Adiposo",
      "action": "Fosforila la HSL en el residuo Ser-565, impidiendo su fosforilación activadora por PKA (en Ser-563) para frenar una lipólisis desmedida y ahorrar oxígeno en estados de hipoxia."
    },
    {
      "organ": "Páncreas Endocrino",
      "action": "Inhibe canales de calcio dependientes de voltaje en células β, bloqueando la secreción de insulina para evitar la remoción de glucosa en estados de estrés bioenergético."
    },
    {
      "organ": "Tejido Adiposo (almacenamiento)",
      "action": "Fosforila e inactiva la glicerol-3-fosfato aciltransferasa (GPAT), primer paso de la síntesis de triacilgliceroles: frena el almacenamiento de grasa mientras falta energía."
    },
    {
      "organ": "Hígado y Músculo (glucógeno)",
      "action": "Fosforila e inactiva la glucógeno sintasa, de modo que la glucosa no se almacena mientras la célula necesita ATP."
    },
    {
      "organ": "Hígado (expresión génica)",
      "action": "Fosforila factores de transcripción (SREBP-1c, ChREBP y HNF-4α) y reprime genes lipogénicos y gluconeogénicos (PEPCK, glucosa-6-fosfatasa)."
    },
    {
      "organ": "Todos los tejidos (síntesis proteica)",
      "action": "Inhibe mTORC1 (vía TSC2 y raptor) y la elongación de la traducción (vía la quinasa de eEF2): detiene la síntesis de proteínas, uno de los procesos que más ATP consume."
    },
    {
      "organ": "Músculo (adaptación crónica)",
      "action": "Activa a PGC-1α, que induce la biogénesis mitocondrial: base molecular de la mejora de la capacidad oxidativa con el entrenamiento de resistencia."
    }
  ]
};
