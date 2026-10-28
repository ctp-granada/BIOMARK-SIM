# 🏥 Bioquímica Médica UGR — Simulador Clínico, Gamificación y Laboratorios Virtuales

[![Universidad de Granada](https://img.shields.io/badge/UGR-Facultad%20de%20Medicina-002f6c.svg?style=flat-square)](https://medicina.ugr.es/)
[![Proyecto de Innovación Docente](https://img.shields.io/badge/Innovaci%C3%B3n%20Docente-PID%2026--158-b45309.svg?style=flat-square)](https://calidad.ugr.es/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.3-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Firestore-ffca28.svg?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Google Gemini API](https://img.shields.io/badge/Google%20Gemini-API%20%40google%2Fgenai-8e24aa.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![Recharts](https://img.shields.io/badge/Visualizaci%C3%B3n-Recharts%20%26%20Chart.js-22c55e.svg?style=flat-square)](https://recharts.org/)

Plataforma docente interactiva desarrollada para los estudiantes del **Grado en Medicina** de la **Facultad de Medicina de la Universidad de Granada** (Parque Tecnológico de la Salud, PTS). El proyecto integra simulación clínica de casos reales, gestión de presupuesto diagnóstico (*Medicina Basada en Valor*), laboratorios virtuales de fisiopatología molecular, dinámicas lúdicas de gamificación médica y un sistema de investigación de impacto docente con persistencia en tiempo real en la nube.

---

## 📋 Índice

- [🌟 Aspectos Destacados](#-aspectos-destacados)
- [🔬 Módulos Principales](#-módulos-principales)
  - [1. Simulador de Guardia & Casos Clínicos](#1-simulador-de-guardia--casos-clínicos)
  - [2. Generador Inteligente de Casos Clínicos (Gemini API)](#2-generador-inteligente-de-casos-clínicos-gemini-api)
  - [3. Laboratorios Virtuales de Fisiopatología Molecular](#3-laboratorios-virtuales-de-fisiopatología-molecular)
  - [4. Gamificación Médica & El Rosco Metabólico](#4-gamificación-médica--el-rosco-metabólico)
  - [5. Ranking en Tiempo Real & Evolución del Alumno](#5-ranking-en-tiempo-real--evolución-del-alumno)
  - [6. Encuesta de Satisfacción Docente & Analítica Científica](#6-encuesta-de-satisfacción-docente--analítica-científica)
  - [7. Coordinación Docente, Calendario de Prácticas & Vademécum](#7-coordinación-docente-calendario-de-prácticas--vademécum)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
  - [Requisitos Previos](#requisitos-previos)
  - [Pasos de Configuración](#pasos-de-configuración)
  - [Variables de Entorno](#variables-de-entorno)
- [📦 Scripts Disponibles](#-scripts-disponibles)
- [🏛️ Arquitectura del Proyecto](#️-arquitectura-del-proyecto)
- [📊 Recopilación de Datos para Investigación Docente](#-recopilación-de-datos-para-investigación-docente)
- [👥 Créditos e Institución](#-créditos-e-institución)
- [📄 Licencia](#-licencia)

---

## 🌟 Aspectos Destacados

- **Población Diana Académica**: Grado en Medicina (1º a 6º curso, estructurado en los 15 subgrupos oficiales de prácticas de laboratorio y seminarios).
- **Medicina Basada en Valor**: Cada estudiante dispone de un presupuesto clínico limitado por guardia; solicitar pruebas de laboratorio innecesarias consume recursos, fomentando el criterio clínico riguroso antes que el cribado indiscriminado.
- **Persistencia en la Nube con Firestore**: Registro en tiempo real de puntuaciones, XP, diagnósticos correctos, rachas de estudio y respuestas anónimas a la encuesta de evaluación docente.
- **Analítica Gráfica con Recharts**: Gráfico de evolución temporal del rendimiento del estudiante a lo largo de las sesiones formativas.
- **Investigación Docente Convalida**: Batería psicométrica que incluye la escala estandarizada **SUS (System Usability Scale)**, ganancia de autoeficacia diagnóstica (pre vs. post con cálculo automático de *d de Cohen*), NPS y exportación a CSV para publicaciones científicas.

---

## 🔬 Módulos Principales

### 1. Simulador de Guardia & Casos Clínicos
- Casos clínicos reales con triaje, anamnesis, constantes vitales y sospecha etiológica.
- **Panel de Biomarcadores Multiparámetro**: Hemograma completo, bioquímica básica, gasometría arterial, ionograma, perfil hepático, perfil lipídico, biomarcadores de necrosis miocárdica (troponinas, CK-MB), cinética de hierro, coagulación y orina.
- Razonamiento inductivo: justificación de cada petición diagnóstica, interpretación fisiopatológica del fallo y emisión de juicio clínico definitivo.

### 2. Generador Inteligente de Casos Clínicos (Gemini API)
- Integración mediante el SDK `@google/genai` ejecutado en proxy seguro de servidor (`/api/generate-case`).
- Generación de historias clínicas originales ajustadas al currículo oficial (metabolismo hidrocarbonado, lipídico, nitrogenado, hemostasia, errores congénitos del metabolismo y equilibrio ácido-base).

### 3. Laboratorios Virtuales de Fisiopatología Molecular
- **Lanzadera de Carnitina & $\beta$-Oxidación**: Regulación alostérica por Malonil-CoA y CPT-1/CPT-2 en hepatocito y cardiomiocito.
- **Ciclo de Glucosa-Ácidos Grasos de Randle**: Competición metabólica entre oxidación de glucosa y lípidos en condiciones fisiológicas y de resistencia a la insulina.
- **Simulador de Ictericias & Metabolismo de la Bilirrubina**: Diagnóstico diferencial entre ictericias prehepáticas (hemólisis), hepatocelulares (hepatitis, toxicidad) y posthepáticas (obstrucción biliar litiásica/tumoral).
- **Laboratorio de Hemostasia & Cascada de la Coagulación**: Ensayo virtual de vías intrínseca, extrínseca y común, con simulación de alteraciones en TP, TTPa, fibrinógeno y plaquetas.
- **Atlas de Integración Metabólica**: Representación interactiva de órganos diana (hígado, músculo, tejido adiposo, encéfalo, riñón) en estado posprandial vs. ayuno prolongado.

### 4. Gamificación Médica & El Rosco Metabólico
- **El Rosco de Bioquímica**: Dinámica contrarreloj de 26 letras con **temporizador de cuenta atrás de 90 segundos**.
  - Si el temporizador llega a cero, se aplica una penalización presupuestaria y se reinicia la partida.
  - Respuestas pasadas (*Pasapalabra*), aciertos con recompensa de XP y feedback educativo tras cada fallo.
- **Sopa de Letras & Crucigrama de Biomarcadores**: Actividades de fijación terminológica para afianzar conceptos clave.
- **Retos Diarios (Daily Challenges)**: Casos de guardia exprés actualizados cada 24 horas para fomentar el hábito de repaso constante.

### 5. Ranking en Tiempo Real & Evolución del Alumno
- **Clasificación en Tiempo Real**: Sincronización instantánea mediante `onSnapshot` de Firebase Firestore.
  - Filtro por los **15 subgrupos de prácticas** del Grado en Medicina.
  - Pódium de honor (#1, #2, #3), cálculo de porcentaje de aciertos (*accuracy*) y rachas de guardia activa.
  - Personalización de alias y subgrupo por parte del alumno.
- **Evolución Gráfica con Recharts**: Vista de gráfico de líneas en `UserStatsView` que traza la curva histórica de puntuación acumulada y casos resueltos en el tiempo.

### 6. Encuesta de Satisfacción Docente & Analítica Científica
- Marco del **Proyecto de Innovación Docente PID 26-158**.
- **Dimensiones Evaluadas**:
  1. *Razonamiento Clínico & Bioquímica Aplicada*: Relevancia formativa, integración fisiopatológica y criterio analítico.
  2. *Gamificación & Medicina Basada en Valor*: Impacto de la limitación presupuestaria y del feedback formativo inmediato.
  3. *Escala SUS (System Usability Scale)*: 10 ítems balanceados con cálculo exacto de percentil, adjetivo de usabilidad y grado SUS.
  4. *Ganancia de Autoeficacia (Pre vs. Post)*: Medición de autoconfianza previa y posterior a las prácticas, calculando el tamaño del efecto ($d$ de Cohen).
  5. *Preguntas Cualitativas*: Codificación temática de fortalezas, propuestas de mejora y patologías deseadas.
- **Panel del Profesor**: Tableros estadísticos con medias, desviaciones típicas, medianas y exportación con un clic a archivo `.csv` anonimizado para publicaciones científicas de educación médica.

### 7. Coordinación Docente, Calendario de Prácticas & Vademécum
- Calendario mensual y tabla matricial interactiva para las sesiones de prácticas de laboratorio y seminarios clínicos de los 15 subgrupos.
- **Vademécum de Bioquímica Clínica**: Catálogo con más de 40 fichas técnicas de biomarcadores con rangos de referencia, sensibilidad, especificidad y relevancia diagnóstica.
- Opciones de exportación e impresión a formato PDF con membrete institucional.

---

## 🛠️ Stack Tecnológico

| Capa / Dominio | Tecnología | Descripción |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Componentes funcionales, hooks personalizados y tipado estricto |
| **Build & Tooling** | [Vite 8](https://vitejs.dev/) | Bundling de alto rendimiento y servidor de desarrollo |
| **Estilos & Diseño** | [Tailwind CSS v4](https://tailwindcss.com/) | Maquetación moderna, accesible y diseño adaptativo (*Mobile-First*) |
| **Animaciones & FX** | [Motion](https://motion.dev/) & [Canvas Confetti](https://github.com/catdad/canvas-confetti) | Microinteracciones fluidas y celebraciones de logros |
| **Visualización Gráfica** | [Recharts](https://recharts.org/) & [Chart.js](https://www.chartjs.org/) | Gráficos de evolución de progreso y curvas cinéticas |
| **Backend & Proxy** | [Node.js](https://nodejs.org/) + [Express 4](https://expressjs.com/) | Servidor API para llamadas proxy seguras y SSR de assets |
| **Base de Datos** | [Google Firebase Firestore](https://firebase.google.com/) | Persistencia en la nube para ranking y encuestas docentes |
| **Inteligencia Artificial** | [@google/genai SDK](https://www.npmjs.com/package/@google/genai) | Generación dinámica de casos clínicos con modelos Gemini |
| **Iconografía** | [Lucide React](https://lucide.dev/) | Iconos clínicos y de interfaz limpios y coherentes |

---

## 🚀 Instalación y Puesta en Marcha

### Requisitos Previos

- **Node.js**: versión 18.x o superior (recomendada v20.x o v22.x LTS).
- **npm**: versión 9.x o superior (incluido con Node.js).
- Conexión a Internet para la sincronización con Firebase Firestore.

### Pasos de Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/ctp-granada/BIOMARK-SIM.git
   cd BIOMARK-SIM
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno**:
   Copia el archivo de plantilla `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Ver detalles en la siguiente sección).*

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará accesible en: `http://localhost:3000`

5. **Compilar para producción**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente configuración:

```env
# Puerto del servidor (Por defecto 3000)
PORT=3000

# Google Gemini API Key (Requerida para el generador de casos con IA)
# Consigue tu clave en https://aistudio.google.com/
GEMINI_API_KEY=tu_api_key_de_gemini_aqui

# Configuración de Firebase (Opcional si se utiliza la configuración preconfigurada)
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_PROJECT_ID=...
```

> **Nota de Seguridad**: Nunca incluyas claves de API privadas en el control de versiones. El archivo `.gitignore` ya está configurado para omitir los archivos `.env` y `.env.local`.

---

## 📦 Scripts Disponibles

En el archivo `package.json` encontrarás los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo con `tsx server.ts` en el puerto 3000.
- `npm run build`: Compila la aplicación cliente con Vite y empaqueta el servidor Node con esbuild en `dist/server.cjs`.
- `npm run start`: Ejecuta el servidor compilado de producción (`node dist/server.cjs`).
- `npm run lint`: Ejecuta la verificación estricta de tipos de TypeScript (`tsc --noEmit`).
- `npm run clean`: Limpia el directorio de distribución compilado `dist/`.

---

## 🏛️ Arquitectura del Proyecto

```text
├── index.html                   # Entrada principal HTML5 con metadatos institucionales
├── server.ts                    # Servidor Express con proxy seguro para Gemini API
├── vite.config.ts               # Configuración de Vite con plugins de React y Tailwind
├── package.json                 # Dependencias y scripts de ejecución
├── src/
│   ├── App.tsx                  # Componente raíz con orquestación de vistas y estado global
│   ├── main.tsx                 # Entrada de montaje de React 19
│   ├── index.css                # Estilos globales (@import "tailwindcss";)
│   ├── lib/
│   │   └── firebase.ts          # Inicialización de Firebase, queries y listeners en tiempo real
│   ├── types/
│   │   └── index.ts             # Definiciones TypeScript de casos, progreso, biomarcadores y retos
│   ├── data/
│   │   └── clinicalCases.ts     # Banco exhaustivo de casos clínicos de Bioquímica Médica
│   ├── utils/
│   │   ├── satisfactionService.ts # Algoritmos de psicometría: SUS, d de Cohen, Likert, NPS y CSV
│   │   └── aiCaseService.ts     # Cliente de comunicación con el endpoint de IA
│   └── components/
│       ├── CaseBank/            # Tarjetas, buscador y visor detallado de casos clínicos
│       ├── Challenge/           # Modo guardia, HUD de presupuesto y panel de biomarcadores
│       ├── InteractiveLabs/     # Simuladores: Carnitina, Randle, Ictericias, Hemostasia, Rosco
│       ├── MetabolicIntegration/# Atlas corporal interactivo y mapas de integración metabólica
│       ├── Satisfaction/        # Encuesta detallada (SUS), bloqueo de acceso y panel de métricas
│       ├── Stats/               # Gráficos Recharts, escalafón de alumnos e insignias
│       ├── PracticasSeminarios/ # Calendario y matriz de prácticas para los 15 subgrupos
│       └── TeachingMaterial/    # Vademécum de biomarcadores y guías docentes oficiales
```

---

## 📊 Recopilación de Datos para Investigación Docente

La plataforma está diseñada como instrumento de recogida de datos para **Proyectos de Innovación y Mejora Docente (PIMED / PID)** y publicaciones en revistas indexadas en Educación Médica (*Medical Teacher*, *BMC Medical Education*, *Revista de Educación Médica*, etc.):

- **Consentimiento Informado Digital**: Conforme al Reglamento General de Protección de Datos (RGPD) y los principios éticos de la Declaración de Helsinki.
- **Anonimización Estricta**: No se registran identificadores personales sensibles; los registros se asocian a un código de participante, curso (1º a 6º) y subgrupo de prácticas (1 al 15).
- **Métricas Psicométricas Calculadas**:
  - **Usabilidad del Sistema (SUS Score)**: Puntuación estandarizada 0–100 según el algoritmo de John Brooke (1996).
  - **Tamaño del Efecto ($d$ de Cohen)**: Cuantificación del impacto de la intervención en la autoeficacia diagnóstica del estudiante:
    $$d = \frac{\bar{X}_{\text{post}} - \bar{X}_{\text{pre}}}{s_{\text{pooled}}}$$
  - **Net Promoter Score (NPS)**: Lealtad y recomendación del alumnado.
  - **Exportación con un clic**: Generación de archivo `.csv` codificado en UTF-8 con escape para análisis directo en software estadístico (SPSS, R, Jamovi o Stata).

---

## 👥 Créditos e Institución

- **Proyecto**: Proyecto de Innovación Docente **PID 26-158**.
- **Entidad**: [Departamento de Bioquímica y Biología Molecular III e Inmunología](https://bioquimica3.ugr.es/).
- **Centro**: [Facultad de Medicina](https://medicina.ugr.es/), Campus Parque Tecnológico de la Salud (PTS).
- **Universidad**: [Universidad de Granada (UGR)](https://www.ugr.es/), España.

---

## 📄 Licencia

Este proyecto ha sido desarrollado con fines docentes y de investigación académica para la Universidad de Granada.  
Distribuido bajo la licencia [MIT](LICENSE). Todos los derechos de contenidos docentes y clínicos pertenecen a la Universidad de Granada.
