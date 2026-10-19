# Encuesta de satisfacción y usabilidad del alumnado

La encuesta mide el criterio de **usabilidad y calidad del entorno virtual** del proyecto (objetivo: valoración media ≥ 4/5).

## Qué se pregunta
1. **Ítems del proyecto (Likert 1-5):** facilidad de navegación, claridad de las respuestas analíticas (feedback), atractivo visual, utilidad para el aprendizaje y valoración global.
2. **Ítems complementarios (1-5):** simuladores interactivos y gamificación.
3. **SUS (System Usability Scale, 10 ítems):** se calcula la puntuación 0-100 (≥ 68 = usabilidad aceptable).
4. **Recomendación (0-10)** para el NPS.
5. **Preguntas abiertas** (opcionales): módulo más útil, lo que más ayudó a aprender y lo que se cambiaría.

Perfil (Medicina / Enfermería / Otro) obligatorio; subgrupo opcional.

## Garantías
- **Anónima:** no se guarda el usuario, el correo ni ningún identificador.
- **Sin valores por defecto:** todas las preguntas empiezan sin marcar y son obligatorias (salvo las abiertas). Nada se rellena automáticamente.
- **Sin datos de ejemplo:** las métricas solo muestran respuestas reales.
- La recompensa del juego (+150 XP, +100 €) se da una vez por dispositivo y no depende de las respuestas.
- Si la base de datos no está configurada, la encuesta lo avisa y no finge que la respuesta se ha guardado.

## Puesta en marcha (una sola vez)
La encuesta usa **Firebase (Firestore)**. Antes de esta rama, la conexión con Firebase de la plataforma era solo una simulación (la «prueba de conexión» respondía siempre que sí y la carga de datos no escribía nada); ahora la encuesta se conecta de verdad.

1. **Consola de Firebase → tu proyecto → Configuración del proyecto → Tus apps.** Si no hay una app web, créala (icono `</>`). Copia los valores de «Configuración del SDK».
2. Añádelos como variables de entorno de la plataforma (en AI Studio, en *Secrets*; en local, en un fichero `.env`):
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
   No son secretos: identifican el proyecto. La seguridad la dan las reglas.
3. **Firestore Database:** créala si no existe (modo producción, región europea, p. ej. `eur3`).
4. **Reglas:** publica el contenido de `firestore.rules` (Firestore → Reglas → pegar → Publicar, o `firebase deploy --only firestore:rules`).
5. **Authentication → Método de acceso → Google:** actívalo. En *Dominios autorizados* añade el dominio donde se publica la plataforma.
6. **Coordinación:** en Firestore, crea la colección `coordinadores_encuesta` y, dentro, un documento por cada persona autorizada cuyo **ID sea su correo** exacto (p. ej. `nombre@ugr.es`). No hace falta ningún campo.

## Ver y exportar los resultados
- En la plataforma, abre **Ver métricas** y pulsa **Entrar con Google (cuenta UGR)** con un correo autorizado: medias ± DE, % de respuestas ≥ 4 y objetivo del proyecto, SUS, NPS, distribución por perfil y subgrupo, y comentarios.
- **Descargar respuestas (CSV para Excel)** exporta todas las respuestas para el análisis estadístico.
- El alumnado puede enviar la encuesta sin iniciar sesión, pero no puede leer las respuestas (lo impiden las reglas de Firestore, no solo la interfaz). Las respuestas no se pueden modificar ni borrar desde la app.

## Lo que no cubre
- El **pre-test / post-test** de razonamiento clínico se hace en PRADO.
- La **participación** (accesos y casos resueltos) se obtiene del registro de PRADO; el progreso de cada alumno todavía no se guarda en Firebase.
