import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Curricular database of studied biomarkers and clinical syllabus
const CURRICULUM_DATA = {
  cardiac: {
    systemName: "Cardíaco y Síndrome Coronario",
    allowedBiomarkers: [
      { id: "bm_troponin_c", name: "Troponina Cardíaca (hs-cTn)", indication: "Necrosis miocárdica aguda (SCASEST / IAMCEST), ventana 2-4h" },
      { id: "bm_ckmb", name: "Creatina Quinasa Isoenzima MB (CK-MB Masa)", indication: "Detección de reinfarto precoz a los 3-5 días" },
      { id: "bm_ck_total", name: "Creatina Quinasa Total (CK Total)", indication: "Daño muscular/miocárdico generalizado" },
      { id: "bm_nt_probnp", name: "NT-proBNP", indication: "Sobrecarga de pared e Insuficiencia Cardíaca congestiva / disnea" },
      { id: "bm_ldh", name: "Lactato Deshidrogenasa Total (LDH)", indication: "Marcador tardío (>48h) de baja especificidad" }
    ],
    scenarios: [
      "Dolor torácico opresivo de 2-4 horas de evolución con sospecha de SCASEST / IAM sin elevación persistente de ST.",
      "Sospecha de reinfarto agudo 4 días después de un evento coronario previo (evaluando el aclaramiento rápido de CK-MB frente a troponina residual).",
      "Disnea aguda en paciente hipertenso para discriminar origen cardiogénico hemodinámico (NT-proBNP) de broncoespasmo pulmonar."
    ]
  },
  hepatic: {
    systemName: "Hepático e Ictericias",
    allowedBiomarkers: [
      { id: "bm_bilirrubina_total", name: "Bilirrubina Total Sérica", indication: "Cribado global de síndromes ictéricos (>1.2 mg/dL)" },
      { id: "bm_bilirrubina_directa", name: "Bilirrubina Directa (Conjugada)", indication: "Ictericia Posthepática/Obstructiva y colestasis (con coluria y acolia)" },
      { id: "bm_ast", name: "Aspartato Aminotransferasa (AST / GOT)", indication: "Citólisis y hepatitis alcohólica (cociente AST/ALT > 2)" },
      { id: "bm_alt", name: "Alanina Aminotransferasa (ALT / GPT)", indication: "Marcador altamente específico de daño hepatocelular primario / necrosis viral o tóxica" },
      { id: "bm_ggt", name: "Gamma-Glutamil Transferasa (GGT)", indication: "Confirmación de origen biliar/canalicular de fosfatasa alcalina y colestasis" },
      { id: "bm_fosfatasa_alcalina", name: "Fosfatasa Alcalina Total (FA)", indication: "Colestasis, obstrucción biliar (coledocolitiasis) y patología infiltrativa" },
      { id: "bm_acidos_biliares", name: "Ácidos Biliares Séricos Totales", indication: "Prurito colestásico fino y colestasis intrahepática del embarazo" },
      { id: "bm_albumina", name: "Albúmina Sérica", indication: "Función de reserva de síntesis hepática crónica" }
    ],
    scenarios: [
      "Ictericia posthepática obstructiva (coledocolitiasis) con coluria, acolia, prurito y elevación franca de BD, FA y GGT.",
      "Ictericia prehepática hemolítica (anemia hemolítica autoinmune) con predominio de bilirrubina indirecta, orinas claras y deposiciones hipercólicas.",
      "Hepatitis aguda citolítica (viral o medicamentosa) con elevación masiva de transaminasas ALT/AST (>1000 U/L).",
      "Hepatopatía alcohólica aguda con cociente De Ritis (AST/ALT > 2) y GGT elevada."
    ]
  },
  metabolic: {
    systemName: "Metabolismo, β-Oxidación y Glúcidos",
    allowedBiomarkers: [
      { id: "bm_perfil_acilcarnitinas", name: "Perfil de Acilcarnitinas Plasmáticas (Octanoilcarnitina C8)", indication: "Diagnóstico definitivo de defecto en beta-oxidación (MCADD)" },
      { id: "bm_carnitina_libre", name: "Carnitina Libre Plasmática (C0)", indication: "Evaluación del transporte mitocondrial de acilos" },
      { id: "bm_relacion_acilcarnitina_carnitina", name: "Relación Acilcarnitina / Carnitina Libre", indication: "Índice funcional de bloqueo de beta-oxidación (≥0.4)" },
      { id: "bm_beta_hidroxibutirato", name: "β-Hidroxibutirato Sérico", indication: "Cuantificación de cetogénesis activa en Cetoacidosis vs Hipoglucemia Hipocetósica (<0.5 mmol/L)" },
      { id: "bm_glucosa", name: "Glucemia en Ayunas", indication: "Diagnóstico urgente de hipoglucemia o descompensación hiperglucémica" },
      { id: "bm_hba1c", name: "Hemoglobina Glicada (HbA1c)", indication: "Control glucémico retrospectivo de los últimos 3 meses" },
      { id: "bm_trigliceridos", name: "Triglicéridos Séricos", indication: "Dislipidemia aterogénica y riesgo de pancreatitis (>500-1000 mg/dL)" },
      { id: "bm_lactato", name: "Lactato Plasmático", indication: "Acidosis láctica e hipoperfusión celular" }
    ],
    scenarios: [
      "Lactante o niño pequeño con hipoglucemia severa, letargia y ausencia paradójica de cetonas en orina/sangre (hipocetósica) tras ayuno prolongado o cuadro febril (Deficiencia de MCADD).",
      "Cetoacidosis diabética en debut de Diabetes Mellitus con hiperglucemia, acidosis metabólica y elevación marcada de β-hidroxibutirato (>3.0 mmol/L).",
      "Síndrome metabólico con resistencia a la insulina, dislipidemia aterogénica (triglicéridos elevados, HDL bajo) y alteración de glucemia en ayunas."
    ]
  },
  renal: {
    systemName: "Renal, Ciclo de la Urea y Purinas",
    allowedBiomarkers: [
      { id: "bm_amonio_plasmatico", name: "Amonio Plasmático", indication: "Emergencia por fallo en Ciclo de la Urea (OTC) con encefalopatía (>50-150 µmol/L)" },
      { id: "bm_acido_urico", name: "Ácido Úrico Sérico", indication: "Artritis gotosa aguda y riesgo en síndrome de lisis tumoral" },
      { id: "bm_urea", name: "Urea Sérica", indication: "Filtrado glomerular y balance nitrogenado (baja en defectos del ciclo de la urea)" },
      { id: "bm_creatinina", name: "Creatinina Sérica", indication: "Estimación de la tasa de filtración glomerular e insuficiencia renal" },
      { id: "bm_egfr", name: "Tasa de Filtrado Glomerular Estimada (eGFR)", indication: "Estadificación de disfunción renal aguda o crónica" }
    ],
    scenarios: [
      "Recién nacido o adulto joven con descompensación neurológica aguda (letargia, confusión, alcalosis respiratoria) e hiperamonemia masiva por defecto del Ciclo de la Urea (déficit de Ornitina Transcarbamilasa - OTC).",
      "Monoartritis hiperaguda en primera articulación metatarsofalángica (podagra) en varón con hiperuricemia primaria (Gota aguda).",
      "Hiperuricemia secundaria masiva con elevación de ácido úrico, fósforo y potasio en paciente oncohematológico (Síndrome de Lisis Tumoral)."
    ]
  },
  pancreatic: {
    systemName: "Pancreático-Digestivo y Malabsorción",
    allowedBiomarkers: [
      { id: "bm_lipasa", name: "Lipasa Sérica", indication: "Estándar de oro para Pancreatitis Aguda (>3x LSN), ventana prolongada (8-14 días)" },
      { id: "bm_trigliceridos", name: "Triglicéridos Séricos en Ayunas (y Aspecto de Suero Lechoso)", indication: "Pancreatitis aguda hipertrigliceridémica (>1000 mg/dL) con interferencia analítica en amilasa" },
      { id: "bm_amilasa", name: "Amilasa Sérica Total", indication: "Diagnóstico precoz de pancreatitis aguda (falsa normalidad en lipemia extrema o toma tardía)" },
      { id: "bm_ttg_iga", name: "Anticuerpos Anti-Transglutaminasa Tisular IgA (tTG-IgA)", indication: "Marcador serológico de primera elección en Enfermedad Celíaca del adulto" },
      { id: "bm_vitamina_b12", name: "Vitamina B12 (Cobalamina) y Folato", indication: "Malabsorción por hipoclorhidria secundaria a uso crónico de Omeprazol/IBP" },
      { id: "bm_magnesio", name: "Magnesio Sérico y Calcio Sérico", indication: "Hipomagnesemia e hipocalcemia refractaria por inhibición de TRPM6/TRPM7 tras uso crónico de IBPs" },
      { id: "bm_elastasa_fecal", name: "Elastasa-1 Fecal", indication: "Insuficiencia Pancreática Exocrina en Pancreatitis Crónica (<200 µg/g)" },
      { id: "bm_gastrina", name: "Gastrina Sérica Basal", indication: "Hipergastrinemia reactiva por aclorhidria de IBPs o Gastrinoma" }
    ],
    scenarios: [
      "Dolor abdominal epigástrico en cinturón tras transgresión dietética con suero intensamente lechoso/lipémico y triglicéridos >1000 mg/dL (Pancreatitis Aguda por Hipertrigliceridemia, donde la amilasa puede ser falsamente normal por interferencia óptica).",
      "Paciente de 62 años polimedicado con Omeprazol 40 mg/día desde hace 5 años que presenta parestesias, espasmos musculares (signo de Trousseau) e hipocalcemia refractaria debida a hipomagnesemia profunda inducida por IBP.",
      "Mujer de 38 años con astenia crónica, anemia ferropénica refractaria a hierro oral, diarrea intermitente y distensión postprandial (Enfermedad Celíaca del adulto confirmada por tTG-IgA).",
      "Pancreatitis aguda biliar típica de 12 horas de evolución con elevación de Lipasa >3 veces el LSN."
    ]
  }
};

async function startServer() {
  const app = express();
  const portArgIdx = process.argv.indexOf("--port");
  const cliPort = portArgIdx !== -1 && process.argv[portArgIdx + 1] ? parseInt(process.argv[portArgIdx + 1], 10) : undefined;
  const PORT = Number(process.env.PORT) || cliPort || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "BioMarkDx Clinical Education Platform" });
  });

  // Gemini AI endpoint for generating dynamic clinical cases strictly aligned with the curriculum
  app.post("/api/generate-case", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "GEMINI_API_KEY no está configurada en las variables de entorno."
        });
      }

      const { system = "cardiac", difficulty = "intermedio", subtopic } = req.body;
      const sysKey = (system in CURRICULUM_DATA ? system : "cardiac") as keyof typeof CURRICULUM_DATA;
      const curriculum = CURRICULUM_DATA[sysKey];

      const ai = new GoogleGenAI({ apiKey });

      const biomarkerCatalogText = curriculum.allowedBiomarkers
        .map((b) => `- ID exacto: "${b.id}" | Nombre: "${b.name}" | Indicación clave: "${b.indication}"`)
        .join("\n");

      const prompt = `Eres el Catedrático de Bioquímica Clínica y Diagnóstico de Laboratorio. Tu misión es generar un caso clínico realista, riguroso y didáctico para estudiantes de medicina y residentes.

REQUISITO FUNDAMENTAL:
Debes ceñirte ESTRICTAMENTE a las patologías y biomarcadores del programa curricular que se detallan a continuación.
- Sistema objetivo: ${curriculum.systemName} (${sysKey}).
- Nivel de dificultad: ${difficulty}.
${subtopic ? `- Enfoque temático solicitado: "${subtopic}".` : `- Escenarios clínicos típicos del módulo:\n${curriculum.scenarios.map((s) => `  * ${s}`).join("\n")}`}

CATÁLOGO CERRADO DE BIOMARCADORES DISPONIBLES PARA ESTE SISTEMA:
${biomarkerCatalogText}

CALIBRACIÓN DE DIFICULTAD EXIGIDA:
1. "intermedio":
   - Cuadro clínico típico y paradigmático dentro de la ventana clásica de elevación.
   - El biomarcador correcto debe ser el de mayor especificidad directa para confirmar el diagnóstico diana.
2. "avanzado":
   - Paciente con comorbilidades (p. ej. diabetes + disfunción renal previa, polimedicación con IBP/estatinas).
   - Requiere razonar cinéticas enzimáticas diferenciales (ej. reinfarto, cociente de transaminasas, acilcarnitinas).
3. "experto":
   - Situaciones con interferencias de laboratorio (ej. lipemia extrema que falsea la amilasa, suero lechoso con triglicéridos >1000 mg/dL), ventanas temporales críticas hiperagudas (<2h) o afecciones congénitas complejas (déficit de OTC o MCADD).

ESTRUCTURA DE OPCIONES DE RESPUESTA:
- Debes incluir exactamente 4 opciones de biomarcadores (biomarkerOptions): 1 CORRECTA (isCorrect: true) y 3 INCORRECTAS/SUBÓPTIMAS (isCorrect: false).
- Cada opción DEBE utilizar el "biomarkerId" EXACTO del catálogo proporcionado arriba (por ejemplo: "${curriculum.allowedBiomarkers[0].id}").
- "biochemicalRationale": Explicación bioquímica profunda del mecanismo fisiopatológico y cinética de elevación/aclaramiento.
- "whyOptimalOrSuboptimal": Por qué es la prueba de elección o por qué resulta inadecuada/engañosa en este momento temporal concreto.

Genera la respuesta EXCLUSIVAMENTE como un objeto JSON válido con la siguiente estructura exacta:
{
  "title": "Título descriptivo del caso con edad, sexo y síntoma cardinal",
  "system": "${sysKey}",
  "difficulty": "${difficulty}",
  "clinicalHistory": {
    "patientDemographics": {
      "age": 45,
      "gender": "Masculino/Femenino",
      "occupation": "Profesión"
    },
    "chiefComplaint": "Motivo de consulta principal",
    "presentIllness": "Anamnesis detallada con tiempo exacto de evolución desde el inicio de los síntomas...",
    "pastMedicalHistory": ["Antecedente 1", "Antecedente 2"],
    "medications": ["Fármaco 1 con dosis"],
    "lifestyle": "Hábitos (alcohol, tabaco, dieta, ayuno)"
  },
  "physicalExam": {
    "vitalSigns": {
      "bp": "130/85 mmHg",
      "hr": "88 lpm",
      "rr": "18 rpm",
      "temp": "36.8 °C",
      "sao2": "97%"
    },
    "findings": [
      {
        "systemName": "Aparato Cardiorrespiratorio/Abdomen",
        "description": "Hallazgo exploratorio minucioso"
      }
    ]
  },
  "initialLabWork": [
    {
      "test": "Hemograma o Bioquímica básica inicial",
      "result": "Valor numérico o cualitativo",
      "unit": "mg/dL o unidad",
      "referenceRange": "Rango normal"
    }
  ],
  "differentialDiagnoses": [
    {
      "disease": "Patología sospechada principal (Diana)",
      "plausibilityRationale": "Por qué la clínica y antecedentes concuerdan...",
      "isTargetDisease": true
    },
    {
      "disease": "Diagnóstico diferencial alternativo A",
      "plausibilityRationale": "Por qué se debe considerar pero es menos probable...",
      "isTargetDisease": false
    },
    {
      "disease": "Diagnóstico diferencial alternativo B",
      "plausibilityRationale": "Motivo de descarte...",
      "isTargetDisease": false
    }
  ],
  "targetDisease": "Patología sospechada principal (Diana)",
  "biomarkerOptions": [
    {
      "id": "bm_opt_1",
      "biomarkerId": "${curriculum.allowedBiomarkers[0].id}",
      "biomarkerName": "${curriculum.allowedBiomarkers[0].name}",
      "isCorrect": true,
      "biochemicalRationale": "Fundamento bioquímico riguroso...",
      "whyOptimalOrSuboptimal": "Justificación clínica categórica dentro de la ventana del paciente..."
    },
    {
      "id": "bm_opt_2",
      "biomarkerId": "${curriculum.allowedBiomarkers[1]?.id || curriculum.allowedBiomarkers[0].id}",
      "biomarkerName": "${curriculum.allowedBiomarkers[1]?.name || 'Biomarcador 2'}",
      "isCorrect": false,
      "biochemicalRationale": "Explicación de por qué no es óptimo...",
      "whyOptimalOrSuboptimal": "Razón por la que es subóptimo o engañoso..."
    },
    {
      "id": "bm_opt_3",
      "biomarkerId": "${curriculum.allowedBiomarkers[2]?.id || curriculum.allowedBiomarkers[0].id}",
      "biomarkerName": "${curriculum.allowedBiomarkers[2]?.name || 'Biomarcador 3'}",
      "isCorrect": false,
      "biochemicalRationale": "Explicación de por qué no es óptimo...",
      "whyOptimalOrSuboptimal": "Razón por la que es subóptimo..."
    },
    {
      "id": "bm_opt_4",
      "biomarkerId": "${curriculum.allowedBiomarkers[3]?.id || curriculum.allowedBiomarkers[0].id}",
      "biomarkerName": "${curriculum.allowedBiomarkers[3]?.name || 'Biomarcador 4'}",
      "isCorrect": false,
      "biochemicalRationale": "Explicación de por qué no es óptimo...",
      "whyOptimalOrSuboptimal": "Razón por la que es subóptimo..."
    }
  ],
  "expertClinicalKey": "Perla clínica docente de cátedra que resume el principio fisiopatológico clave para la práctica médica."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });

      const responseText = response.text || "";
      let parsedData: any = null;

      try {
        parsedData = JSON.parse(responseText);
      } catch {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        }
      }

      if (!parsedData || !parsedData.title || !parsedData.biomarkerOptions) {
        return res.status(500).json({ error: "Respuesta no estructurada recibida del motor de IA." });
      }

      // Sanitize and ensure consistent system and difficulty
      parsedData.system = sysKey;
      parsedData.difficulty = difficulty;

      // Ensure each option has valid IDs and references
      if (Array.isArray(parsedData.biomarkerOptions)) {
        parsedData.biomarkerOptions = parsedData.biomarkerOptions.map((opt: any, index: number) => {
          // Verify if biomarkerId exists in curriculum, otherwise map to nearest valid
          const matched = curriculum.allowedBiomarkers.find(
            (b) => b.id === opt.biomarkerId || b.name.toLowerCase().includes(opt.biomarkerName?.toLowerCase() || "")
          );
          return {
            ...opt,
            id: opt.id || `bm_opt_${index + 1}`,
            biomarkerId: matched ? matched.id : opt.biomarkerId || curriculum.allowedBiomarkers[0].id,
            biomarkerName: matched ? matched.name : opt.biomarkerName || "Biomarcador Clínico",
            isCorrect: !!opt.isCorrect
          };
        });
      }

      return res.json({ case: parsedData });
    } catch (err: any) {
      console.error("Error generating case with Gemini:", err);
      return res.status(500).json({ error: err.message || "Error al generar caso con IA" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BioMarkDx] Servidor ejecutándose en http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[BioMarkDx] Error: El puerto ${PORT} ya está en uso. Reintentando o liberando proceso.`);
    } else {
      console.error("[BioMarkDx] Error en el servidor Express:", err);
    }
  });

  process.on("SIGTERM", () => {
    server.close(() => {
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    server.close(() => {
      process.exit(0);
    });
  });
}

startServer();

