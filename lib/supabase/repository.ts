import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";

export const QUERIES = {
  searchJargons: function (
    supabase: SupabaseClient<Database>,
    searchQuery: string,
    limitCount: number,
    offsetCount: number,
    sortOption: string,
    categoryAcronyms: string[] | null,
  ) {
    return supabase.rpc("search_jargons", {
      search_query: searchQuery,
      limit_count: limitCount,
      offset_count: offsetCount,
      sort_option: sortOption,
      category_acronyms: categoryAcronyms ?? undefined,
    });
  },

  listFeaturedJargons: function (
    supabase: SupabaseClient<Database>,
    limitCount: number,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase.rpc("list_featured_jargons", {
      limit_count: limitCount,
    });
    if (options?.signal) query = query.abortSignal(options.signal);
    return query;
  },

  listExamples: function (
    supabase: SupabaseClient<Database>,
    searchQuery: string,
    jargonQuery: string,
    jargonId: string | null,
    limitCount: number,
    offsetCount: number,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase.rpc("list_examples", {
      search_query: searchQuery,
      jargon_query: jargonQuery,
      p_jargon_id: jargonId ?? undefined,
      limit_count: limitCount,
      offset_count: offsetCount,
    });
    if (options?.signal) query = query.abortSignal(options.signal);
    return query;
  },

  getExample: function (supabase: SupabaseClient<Database>, exampleId: string) {
    return supabase.rpc("get_example", { example_id: exampleId }).maybeSingle();
  },

  countJargons: function (
    supabase: SupabaseClient<Database>,
    searchQuery: string,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase.rpc("count_search_jargons", {
      search_query: searchQuery,
    });
    if (options?.signal) query = query.abortSignal(options.signal);
    return query;
  },

  getJargonBySlug: function (supabase: SupabaseClient<Database>, slug: string) {
    return supabase
      .from("jargon")
      .select(
        "id, name, slug, created_at, author_id, translations:translation(id, name, author_id, created_at, llm_rank, featured), categories:jargon_category(category:category(id, name, acronym))",
      )
      .eq("slug", slug)
      .limit(1)
      .single();
  },

  listComments: function (
    supabase: SupabaseClient<Database>,
    jargonId: string,
  ) {
    return supabase
      .from("comment_safe")
      .select(
        `
          *,
          profile:author_id(display_name, photo_url),
          translation(name)
        `,
      )
      .eq("jargon_id", jargonId)
      .order("created_at", { ascending: true });
  },

  getComment: function (supabase: SupabaseClient<Database>, commentId: string) {
    return supabase
      .from("comment_safe")
      .select("*")
      .eq("id", commentId)
      .maybeSingle();
  },

  listCategories: function (
    supabase: SupabaseClient<Database>,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase
      .from("category")
      .select("id, name, acronym")
      .order("acronym", { ascending: true });
    if (options?.signal) query = query.abortSignal(options.signal);
    return query;
  },

  searchJargonNames: function (
    supabase: SupabaseClient<Database>,
    searchQuery: string,
    limitCount: number,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase
      .from("jargon")
      .select("id, name, slug")
      .ilike("name", `%${searchQuery}%`)
      .limit(limitCount);
    if (options?.signal) query = query.abortSignal(options.signal);
    return query;
  },

  searchTranslationsByName: function (
    supabase: SupabaseClient<Database>,
    searchQuery: string,
    limitCount: number,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase
      .from("translation")
      .select(
        `
          id,
          name,
          jargon_id,
          jargon:jargon_id(id, name, slug)
        `,
      )
      .ilike("name", `%${searchQuery}%`)
      .limit(limitCount);
    if (options?.signal) query = query.abortSignal(options.signal);
    return query;
  },

  getNameAndPhoto: function (
    supabase: SupabaseClient<Database>,
    userId: string,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase
      .from("profile")
      .select("display_name, photo_url, created_at")
      .eq("id", userId);
    if (options?.signal) query = query.abortSignal(options.signal);
    return query.maybeSingle();
  },

  getName: function (
    supabase: SupabaseClient<Database>,
    userId: string,
    options?: { signal?: AbortSignal },
  ) {
    let query = supabase
      .from("profile")
      .select("display_name")
      .eq("id", userId);
    if (options?.signal) query = query.abortSignal(options.signal);
    return query.maybeSingle();
  },

  listAllFeaturedTranslations: function (supabase: SupabaseClient<Database>) {
    return supabase
      .from("translation")
      .select(
        `
          id,
          name,
          featured,
          jargon:jargon_id(id, name, slug)
        `,
      )
      .not("featured", "is", null)
      .order("featured", { ascending: true });
  },
};

export const MUTATIONS = {
  suggestJargon: function (
    supabase: SupabaseClient<Database>,
    jargon: string,
    noTranslation: boolean,
    translation: string,
    comment: string,
    categoryIds: number[],
  ) {
    return supabase
      .rpc("suggest_jargon", {
        p_name: jargon,
        p_translation: noTranslation ? "" : translation,
        p_comment: comment,
        p_category_ids: categoryIds,
      })
      .single();
  },

  suggestTranslation: function (
    supabase: SupabaseClient<Database>,
    jargonId: string,
    translation: string,
    comment: string,
  ) {
    return supabase
      .rpc("suggest_translation", {
        p_jargon_id: jargonId,
        p_translation: translation,
        p_comment: comment,
      })
      .single();
  },

  createExample: function (
    supabase: SupabaseClient<Database>,
    sourceText: string,
    translation: string,
    jargonIds: string[],
  ) {
    return supabase.rpc("create_example", {
      p_source_text: sourceText,
      p_translation: translation,
      p_jargon_ids: jargonIds,
    });
  },

  createComment: function (
    supabase: SupabaseClient<Database>,
    jargonId: string,
    parentId: string | null,
    content: string,
  ) {
    return supabase.rpc("create_comment", {
      p_jargon_id: jargonId,
      p_parent_id: parentId ?? undefined,
      p_content: content,
    });
  },

  updateComment: function (
    supabase: SupabaseClient<Database>,
    commentId: string,
    content: string,
  ) {
    return supabase.rpc("update_comment", {
      p_comment_id: commentId,
      p_content: content,
    });
  },

  removeComment: function (
    supabase: SupabaseClient<Database>,
    commentId: string,
  ) {
    return supabase.rpc("remove_comment", { p_comment_id: commentId });
  },

  updateJargon: function (
    supabase: SupabaseClient<Database>,
    jargonId: string,
    name: string,
  ) {
    return supabase
      .rpc("update_jargon", {
        p_jargon_id: jargonId,
        p_name: name,
      })
      .single();
  },

  removeJargon: function (
    supabase: SupabaseClient<Database>,
    jargonId: string,
  ) {
    return supabase.rpc("remove_jargon", { p_jargon_id: jargonId });
  },

  updateTranslation: function (
    supabase: SupabaseClient<Database>,
    translationId: string,
    name: string,
  ) {
    return supabase.rpc("update_translation", {
      p_translation_id: translationId,
      p_name: name,
    });
  },

  removeTranslation: function (
    supabase: SupabaseClient<Database>,
    translationId: string,
  ) {
    return supabase.rpc("remove_translation", {
      p_translation_id: translationId,
    });
  },

  updateJargonCategories: function (
    supabase: SupabaseClient<Database>,
    jargonId: string,
    categoryIds: number[],
  ) {
    return supabase.rpc("update_jargon_categories", {
      p_jargon_id: jargonId,
      p_category_ids: categoryIds,
    });
  },

  updateFeaturedOrder: function (
    supabase: SupabaseClient<Database>,
    translationId: string,
    featuredRank: number,
  ) {
    return supabase.rpc("admin_update_featured_order", {
      p_translation_id: translationId,
      p_featured_rank: featuredRank,
    });
  },

  removeFeatured: function (
    supabase: SupabaseClient<Database>,
    translationId: string,
  ) {
    return supabase.rpc("admin_remove_featured", {
      p_translation_id: translationId,
    });
  },
};
