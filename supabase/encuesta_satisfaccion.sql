-- =============================================================================
-- BIOMARK-SIM · Encuesta de satisfacción y usabilidad del alumnado
-- Ejecutar una sola vez en Supabase: SQL Editor → New query → pegar → Run
-- =============================================================================

-- 1. Respuestas (anónimas: no se guarda el usuario ni el correo)
create table if not exists public.encuestas_satisfaccion (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  perfil text not null,
  subgrupo text,
  -- Ítems del proyecto (Likert 1-5)
  navegacion smallint not null check (navegacion between 1 and 5),
  claridad_feedback smallint not null check (claridad_feedback between 1 and 5),
  atractivo_visual smallint not null check (atractivo_visual between 1 and 5),
  utilidad_aprendizaje smallint not null check (utilidad_aprendizaje between 1 and 5),
  valoracion_global smallint not null check (valoracion_global between 1 and 5),
  -- Ítems complementarios (Likert 1-5)
  simuladores smallint not null check (simuladores between 1 and 5),
  gamificacion smallint not null check (gamificacion between 1 and 5),
  -- System Usability Scale (1-5) y puntuación 0-100
  sus_1 smallint not null check (sus_1 between 1 and 5),
  sus_2 smallint not null check (sus_2 between 1 and 5),
  sus_3 smallint not null check (sus_3 between 1 and 5),
  sus_4 smallint not null check (sus_4 between 1 and 5),
  sus_5 smallint not null check (sus_5 between 1 and 5),
  sus_6 smallint not null check (sus_6 between 1 and 5),
  sus_7 smallint not null check (sus_7 between 1 and 5),
  sus_8 smallint not null check (sus_8 between 1 and 5),
  sus_9 smallint not null check (sus_9 between 1 and 5),
  sus_10 smallint not null check (sus_10 between 1 and 5),
  sus_puntuacion numeric(5,1) not null check (sus_puntuacion between 0 and 100),
  nps smallint not null check (nps between 0 and 10),
  mejor_aspecto text check (char_length(mejor_aspecto) <= 2000),
  sugerencias text check (char_length(sugerencias) <= 2000),
  modulo_favorito text
);

-- 2. Cuentas de coordinación que pueden ver los resultados
create table if not exists public.coordinadores_encuesta (
  email text primary key
);

-- Sustituye por los correos reales del equipo (los de la cuenta con la que se inicia sesión en la app)
insert into public.coordinadores_encuesta (email) values
  ('tu_correo@ugr.es')
on conflict do nothing;

-- 3. ¿La sesión actual es de coordinación?
create or replace function public.es_coordinador_encuesta()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.coordinadores_encuesta
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 4. Seguridad: cualquiera puede ENVIAR una respuesta; solo la coordinación puede LEERLAS
alter table public.encuestas_satisfaccion enable row level security;
alter table public.coordinadores_encuesta enable row level security;

drop policy if exists "enviar_encuesta" on public.encuestas_satisfaccion;
create policy "enviar_encuesta" on public.encuestas_satisfaccion
  for insert to anon, authenticated with check (true);

drop policy if exists "leer_encuestas_coordinacion" on public.encuestas_satisfaccion;
create policy "leer_encuestas_coordinacion" on public.encuestas_satisfaccion
  for select to authenticated using (public.es_coordinador_encuesta());

-- Nadie puede modificar ni borrar respuestas desde la app
-- (no se crean políticas de update/delete; desde el panel de Supabase sí se puede)

grant insert on public.encuestas_satisfaccion to anon, authenticated;
grant select on public.encuestas_satisfaccion to authenticated;
grant execute on function public.es_coordinador_encuesta() to authenticated;
