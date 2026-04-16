-- 번역 예문 본문.
-- 예문 자체는 하나의 원문을 가지고, 번역문과 연결 용어는 별도 테이블로 확장한다.
CREATE TABLE public.example (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text text NOT NULL CHECK (trim(source_text) <> ''),
  author_id uuid NOT NULL REFERENCES public.profile(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 하나의 예문에 여러 번역 제안을 붙일 수 있다.
CREATE TABLE public.example_translation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  example_id uuid NOT NULL REFERENCES public.example(id) ON DELETE CASCADE,
  translated_text text NOT NULL CHECK (trim(translated_text) <> ''),
  author_id uuid NOT NULL REFERENCES public.profile(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 예문과 전문용어의 다대다 연결 테이블.
CREATE TABLE public.example_jargon (
  example_id uuid NOT NULL REFERENCES public.example(id) ON DELETE CASCADE,
  jargon_id uuid NOT NULL REFERENCES public.jargon(id) ON DELETE CASCADE,
  PRIMARY KEY (example_id, jargon_id)
);

-- 목록은 최신순으로 자주 읽고, 번역문/용어 연결은 example_id 또는 jargon_id로 조인한다.
CREATE INDEX ON public.example (created_at DESC);
CREATE INDEX ON public.example_translation (example_id);
CREATE INDEX ON public.example_jargon (jargon_id);

-- 기존 테이블과 같은 updated_at 자동 갱신 트리거를 붙인다.
CREATE OR REPLACE TRIGGER set_public_example_updated_at
BEFORE UPDATE ON public.example
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE TRIGGER set_public_example_translation_updated_at
BEFORE UPDATE ON public.example_translation
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 읽기는 공개하고, 쓰기는 아래 SECURITY DEFINER RPC를 통해 권한을 검사한다.
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.example_translation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.example_jargon ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view examples"
ON public.example
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view example translations"
ON public.example_translation
FOR SELECT
USING (true);

CREATE POLICY "Anyone can view example jargons"
ON public.example_jargon
FOR SELECT
USING (true);

-- 예문 목록 조회용 단일 RPC.
-- 홈 최신 예문은 필터 없이 limit만 작게 주고, 용어별 예문은 p_jargon_id를 넣어 재사용한다.
CREATE OR REPLACE FUNCTION public.list_examples(
  search_query text DEFAULT NULL,
  jargon_query text DEFAULT NULL,
  p_jargon_id uuid DEFAULT NULL,
  limit_count integer DEFAULT 12,
  offset_count integer DEFAULT 0
) RETURNS TABLE(
  id uuid,
  source_text text,
  created_at timestamptz,
  updated_at timestamptz,
  author json,
  translations json,
  jargons json
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    e.id,
    e.source_text,
    e.created_at,
    e.updated_at,
    json_build_object(
      'display_name', p.display_name,
      'photo_url', p.photo_url
    ) AS author,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', et.id,
            'translated_text', et.translated_text,
            'created_at', et.created_at,
            'author', json_build_object(
              'display_name', tp.display_name,
              'photo_url', tp.photo_url
            )
          )
          ORDER BY et.created_at ASC, et.id ASC
        )
        FROM public.example_translation et
        LEFT JOIN public.profile tp ON tp.id = et.author_id
        WHERE et.example_id = e.id
      ),
      '[]'::json
    ) AS translations,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', j.id,
            'name', j.name,
            'slug', j.slug
          )
          ORDER BY j.name ASC, j.id ASC
        )
        FROM public.example_jargon ej
        JOIN public.jargon j ON j.id = ej.jargon_id
        WHERE ej.example_id = e.id
      ),
      '[]'::json
    ) AS jargons
  FROM public.example e
  LEFT JOIN public.profile p ON p.id = e.author_id
  WHERE (
      search_query IS NULL
      OR trim(search_query) = ''
      OR e.source_text ILIKE '%' || trim(search_query) || '%'
      OR EXISTS (
        SELECT 1
        FROM public.example_translation et
        WHERE et.example_id = e.id
          AND et.translated_text ILIKE '%' || trim(search_query) || '%'
      )
    )
    AND (
      jargon_query IS NULL
      OR trim(jargon_query) = ''
      OR EXISTS (
        SELECT 1
        FROM public.example_jargon ej
        JOIN public.jargon j ON j.id = ej.jargon_id
        WHERE ej.example_id = e.id
          AND (
            j.name ILIKE '%' || trim(jargon_query) || '%'
            OR j.slug ILIKE '%' || trim(jargon_query) || '%'
          )
      )
    )
    AND (
      p_jargon_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM public.example_jargon ej
        WHERE ej.example_id = e.id
          AND ej.jargon_id = p_jargon_id
      )
    )
  ORDER BY e.created_at DESC, e.id DESC
  LIMIT greatest(limit_count, 0)
  OFFSET greatest(offset_count, 0);
$$;

-- 예문 상세 조회.
CREATE OR REPLACE FUNCTION public.get_example(
  example_id uuid
) RETURNS TABLE(
  id uuid,
  source_text text,
  created_at timestamptz,
  updated_at timestamptz,
  author json,
  translations json,
  jargons json
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    e.id,
    e.source_text,
    e.created_at,
    e.updated_at,
    json_build_object(
      'display_name', p.display_name,
      'photo_url', p.photo_url
    ) AS author,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', et.id,
            'translated_text', et.translated_text,
            'created_at', et.created_at,
            'author', json_build_object(
              'display_name', tp.display_name,
              'photo_url', tp.photo_url
            )
          )
          ORDER BY et.created_at ASC, et.id ASC
        )
        FROM public.example_translation et
        LEFT JOIN public.profile tp ON tp.id = et.author_id
        WHERE et.example_id = e.id
      ),
      '[]'::json
    ) AS translations,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', j.id,
            'name', j.name,
            'slug', j.slug
          )
          ORDER BY j.name ASC, j.id ASC
        )
        FROM public.example_jargon ej
        JOIN public.jargon j ON j.id = ej.jargon_id
        WHERE ej.example_id = e.id
      ),
      '[]'::json
    ) AS jargons
  FROM public.example e
  LEFT JOIN public.profile p ON p.id = e.author_id
  WHERE e.id = get_example.example_id;
$$;

-- 예문 생성.
-- 최초 생성 시 번역문은 하나만 받으며, 이후 추가 번역은 add_example_translation으로 처리한다.
CREATE OR REPLACE FUNCTION public.create_example(
  p_source_text text,
  p_translation text,
  p_jargon_ids uuid[] DEFAULT '{}'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor_id uuid := auth.uid();
  v_example_id uuid;
  v_jargon_id uuid;
begin
  -- Auth check
  if v_actor_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Input validation
  if p_source_text is null or trim(p_source_text) = '' then
    raise exception 'Source text is required' using errcode = '22023';
  end if;

  if p_translation is null or trim(p_translation) = '' then
    raise exception 'Translation is required' using errcode = '22023';
  end if;

  -- Insert example
  insert into public.example (source_text, author_id)
  values (trim(p_source_text), v_actor_id)
  returning id into v_example_id;

  -- Insert linked jargons
  foreach v_jargon_id in array coalesce(p_jargon_ids, '{}') loop
    if not exists (
      select 1 from public.jargon j where j.id = v_jargon_id
    ) then
      raise exception 'Jargon not found' using errcode = 'NO_JARGON';
    end if;

    insert into public.example_jargon (example_id, jargon_id)
    values (v_example_id, v_jargon_id)
    on conflict do nothing;
  end loop;

  -- Insert initial translation
  insert into public.example_translation (
    example_id,
    translated_text,
    author_id
  )
  values (v_example_id, trim(p_translation), v_actor_id);

  return v_example_id;
end;
$$;

-- 예문 원문 수정: 작성자 또는 관리자만 가능.
CREATE OR REPLACE FUNCTION public.update_example(
  p_example_id uuid,
  p_source_text text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor_id uuid := auth.uid();
  v_author_id uuid;
  v_is_admin boolean := coalesce(get_my_claim('userrole')::text, '') = '"admin"';
begin
  -- Auth check
  if v_actor_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Input validation
  if p_example_id is null then
    raise exception 'Example ID is required' using errcode = '22023';
  end if;

  if p_source_text is null or trim(p_source_text) = '' then
    raise exception 'Source text is required' using errcode = '22023';
  end if;

  -- Load author
  select author_id
  into v_author_id
  from public.example
  where id = p_example_id;

  if not found then
    raise exception 'Example not found' using errcode = 'NO_EXAMPLE';
  end if;

  -- Authorization: author or admin
  if v_actor_id <> v_author_id and not v_is_admin then
    raise exception 'Not authorized to update this example' using errcode = '42501';
  end if;

  -- Perform the update
  update public.example
  set source_text = trim(p_source_text)
  where id = p_example_id;

  return true;
end;
$$;

-- 예문 삭제: 작성자 또는 관리자만 가능.
CREATE OR REPLACE FUNCTION public.delete_example(
  p_example_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor_id uuid := auth.uid();
  v_author_id uuid;
  v_is_admin boolean := coalesce(get_my_claim('userrole')::text, '') = '"admin"';
begin
  -- Auth check
  if v_actor_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Input validation
  if p_example_id is null then
    raise exception 'Example ID is required' using errcode = '22023';
  end if;

  -- Load author
  select author_id
  into v_author_id
  from public.example
  where id = p_example_id;

  if not found then
    raise exception 'Example not found' using errcode = 'NO_EXAMPLE';
  end if;

  -- Authorization: author or admin
  if v_actor_id <> v_author_id and not v_is_admin then
    raise exception 'Not authorized to remove this example' using errcode = '42501';
  end if;

  -- Perform the delete
  delete from public.example
  where id = p_example_id;

  return true;
end;
$$;

-- 예문-용어 연결 추가: 로그인 사용자라면 누구나 연결을 제안/추가할 수 있다.
CREATE OR REPLACE FUNCTION public.upsert_example_jargon(
  p_example_id uuid,
  p_jargon_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor_id uuid := auth.uid();
begin
  -- Auth check (any authenticated user can update)
  if v_actor_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Input validation
  if p_example_id is null then
    raise exception 'Example ID is required' using errcode = '22023';
  end if;

  if p_jargon_id is null then
    raise exception 'Jargon ID is required' using errcode = '22023';
  end if;

  -- Ensure targets exist for clearer error reporting
  if not exists (
    select 1 from public.example e where e.id = p_example_id
  ) then
    raise exception 'Example not found' using errcode = 'NO_EXAMPLE';
  end if;

  if not exists (
    select 1 from public.jargon j where j.id = p_jargon_id
  ) then
    raise exception 'Jargon not found' using errcode = 'NO_JARGON';
  end if;

  -- Insert mapping
  insert into public.example_jargon (example_id, jargon_id)
  values (p_example_id, p_jargon_id)
  on conflict do nothing;

  return true;
end;
$$;

-- 번역문 추가: 로그인 사용자라면 누구나 가능.
CREATE OR REPLACE FUNCTION public.add_example_translation(
  p_example_id uuid,
  p_translated_text text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor_id uuid := auth.uid();
  v_translation_id uuid;
begin
  -- Auth check
  if v_actor_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Input validation
  if p_example_id is null then
    raise exception 'Example ID is required' using errcode = '22023';
  end if;

  if p_translated_text is null or trim(p_translated_text) = '' then
    raise exception 'Translated text is required' using errcode = '22023';
  end if;

  -- Ensure target example exists
  if not exists (
    select 1 from public.example e where e.id = p_example_id
  ) then
    raise exception 'Example not found' using errcode = 'NO_EXAMPLE';
  end if;

  -- Insert translation
  insert into public.example_translation (
    example_id,
    translated_text,
    author_id
  )
  values (p_example_id, trim(p_translated_text), v_actor_id)
  returning id into v_translation_id;

  return v_translation_id;
end;
$$;

-- 번역문 수정: 번역 작성자 또는 관리자만 가능.
CREATE OR REPLACE FUNCTION public.update_example_translation(
  p_example_translation_id uuid,
  p_translated_text text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor_id uuid := auth.uid();
  v_author_id uuid;
  v_is_admin boolean := coalesce(get_my_claim('userrole')::text, '') = '"admin"';
begin
  -- Auth check
  if v_actor_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Input validation
  if p_example_translation_id is null then
    raise exception 'Example translation ID is required' using errcode = '22023';
  end if;

  if p_translated_text is null or trim(p_translated_text) = '' then
    raise exception 'Translated text is required' using errcode = '22023';
  end if;

  -- Load author
  select author_id
  into v_author_id
  from public.example_translation
  where id = p_example_translation_id;

  if not found then
    raise exception 'Example translation not found' using errcode = 'NO_EXAMPLE_TRANSLATION';
  end if;

  -- Authorization: author or admin
  if v_actor_id <> v_author_id and not v_is_admin then
    raise exception 'Not authorized to update this example translation' using errcode = '42501';
  end if;

  -- Perform the update
  update public.example_translation
  set translated_text = trim(p_translated_text)
  where id = p_example_translation_id;

  return true;
end;
$$;

-- 번역문 삭제: 번역 작성자 또는 관리자만 가능.
CREATE OR REPLACE FUNCTION public.delete_example_translation(
  p_example_translation_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
declare
  v_actor_id uuid := auth.uid();
  v_author_id uuid;
  v_is_admin boolean := coalesce(get_my_claim('userrole')::text, '') = '"admin"';
begin
  -- Auth check
  if v_actor_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  -- Input validation
  if p_example_translation_id is null then
    raise exception 'Example translation ID is required' using errcode = '22023';
  end if;

  -- Load author
  select author_id
  into v_author_id
  from public.example_translation
  where id = p_example_translation_id;

  if not found then
    raise exception 'Example translation not found' using errcode = 'NO_EXAMPLE_TRANSLATION';
  end if;

  -- Authorization: author or admin
  if v_actor_id <> v_author_id and not v_is_admin then
    raise exception 'Not authorized to remove this example translation' using errcode = '42501';
  end if;

  -- Perform the delete
  delete from public.example_translation
  where id = p_example_translation_id;

  return true;
end;
$$;

NOTIFY pgrst, 'reload schema';
