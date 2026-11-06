# BIOMARK-SIM · Bioquímica Médica (UGR)

Plataforma docente para la asignatura de Bioquímica Médica del Grado en Medicina de la Universidad de Granada. Se desarrolla dentro del Proyecto de Innovación Docente PID 26-158 del Departamento de Bioquímica y Biología Molecular III e Inmunología.

La idea es que el alumnado practique la interpretación de biomarcadores con casos clínicos, sabiendo que cada prueba que pide tiene un coste. Alrededor de los casos hay material de consulta, simuladores de fisiopatología y algunos juegos de repaso.

## Qué incluye

**Hospital (casos clínicos).** Unos treinta casos con anamnesis, exploración y pruebas iniciales. El alumno pide analíticas con un presupuesto limitado, justifica su orientación diagnóstica y recibe una corrección que distingue entre pruebas imprescindibles, aceptables y redundantes.

**Biblioteca.** Temario, vademécum con más de 40 biomarcadores (valores de referencia, cinética, sensibilidad y especificidad, falsos positivos y negativos) y el calendario de prácticas y seminarios de los 15 subgrupos, con exportación a PDF.

**Simuladores.** Lanzadera de carnitina y β-oxidación, ciclo de Randle, ictericias y metabolismo de la bilirrubina, hemostasia, y un atlas de integración metabólica en ayuno y posprandio.

**Parque (repaso).** Rosco de 26 letras con 90 segundos, sopa de letras, crucigrama, parejas y un clasificador rápido. Superarlos devuelve presupuesto para seguir con los casos. Hay también un reto diario.

**Progreso.** Puntuación, rachas, insignias y una clasificación por subgrupo sincronizada con Firestore.

**Encuesta de evaluación.** Cuestionario con consentimiento informado: escala SUS, autoeficacia antes y después (con d de Cohen), NPS y preguntas abiertas. El profesorado puede consultar los resultados y descargarlos en CSV anonimizado.

## Puesta en marcha

Hace falta Node.js 20 o superior.

```bash
git clone https://github.com/ctp-granada/BIOMARK-SIM.git
cd BIOMARK-SIM
npm install
cp .env.example .env
npm run dev          # http://localhost:3000
```

Para producción:

```bash
npm run build
npm start
```

Otros scripts: `npm run lint` (comprobación de tipos) y `npm run clean`.

La configuración de Firebase está en `firebase-config.json`. Las variables de `.env.example` solo son necesarias para el generador de casos (ver más abajo).

## Estructura

```text
server.ts                  Servidor Express (estáticos y Vite en desarrollo)
src/App.tsx                Vista principal y estado global
src/lib/                   Firebase y Supabase
src/data/                  Casos clínicos, biomarcadores, insignias, calendario
src/utils/                 Corrección de peticiones, gamificación, encuesta
src/components/
  CaseBank/                Banco de casos
  Challenge/               Guardia: petición de pruebas, presupuesto y corrección
  InteractiveLabs/         Simuladores y juegos del Parque
  MetabolicIntegration/    Atlas de integración metabólica
  TeachingMaterial/        Temario y vademécum
  PracticasSeminarios/     Calendario de prácticas
  Satisfaction/            Encuesta y panel de resultados
  Stats/                   Progreso, insignias y clasificación
public/assets/             Simuladores en HTML independiente
```

## Pendiente

El generador de casos (`AICaseGeneratorModal`) llama a `/api/generate-case`, pero ese endpoint no existe todavía en `server.ts`, así que de momento no funciona.

## Créditos

Departamento de Bioquímica y Biología Molecular III e Inmunología, Facultad de Medicina, Universidad de Granada. Proyecto de Innovación Docente PID 26-158.

## Licencia

Desarrollado con fines docentes y de investigación para la Universidad de Granada. Código bajo licencia MIT; los contenidos docentes y clínicos pertenecen a la Universidad de Granada.
