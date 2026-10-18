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
1. Entra en tu proyecto de **Supabase** (el mismo que usa el inicio de sesión de la plataforma).
2. **SQL Editor → New query**, pega el contenido de `supabase/encuesta_satisfaccion.sql`, cambia `tu_correo@ugr.es` por los correos del equipo de coordinación y pulsa **Run**.
3. Comprueba que la plataforma tiene configuradas las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (en *Project Settings → API* de Supabase). Sin ellas la plataforma usa un servidor ficticio y no se guarda nada.
4. Crea una cuenta en la plataforma (Iniciar sesión → Registrarse) con uno de los correos de coordinación.

Para añadir más coordinadores más tarde:
```sql
insert into public.coordinadores_encuesta (email) values ('otro_correo@ugr.es');
```

## Ver y exportar los resultados
- En la plataforma, inicia sesión con la cuenta de coordinación y abre **Ver métricas**: medias ± DE, % de respuestas ≥ 4, SUS, NPS, distribución por perfil y subgrupo, y comentarios.
- **Descargar respuestas (CSV para Excel)** exporta todas las respuestas para el análisis estadístico de la memoria.
- El alumnado puede enviar la encuesta, pero no puede ver las respuestas de los demás (lo impide la seguridad de Supabase, no solo la interfaz).

## Lo que no cubre
- El **pre-test / post-test** de razonamiento clínico se hace en PRADO.
- La **participación** (accesos y casos resueltos) se obtiene del registro de PRADO y del progreso que la plataforma guarda en `user_progress`.
