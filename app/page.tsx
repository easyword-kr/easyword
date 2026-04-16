import { createClient } from "@/lib/supabase/server";
import HomePageClient, { SortOption } from "@/components/home/home-page-client";
import FeaturedJargonCarousel from "@/components/home/featured-jargon-carousel";
import LatestExamplesSection from "@/components/example/latest-examples-section";
import { QUERIES } from "@/lib/supabase/repository";
import type { Json } from "@/lib/supabase/types";
import type { Example } from "@/types/example";

const INITIAL_LOAD_SIZE = 32;
const FEATURED_LOAD_SIZE = 100;
const LATEST_EXAMPLE_LOAD_SIZE = 4;

function isJsonObject(value: Json): value is Record<string, Json> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractStringArray(value: Json, key: string) {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (isJsonObject(v) && typeof v[key] === "string" ? v[key] : null))
    .filter((v): v is string => v !== null);
}

function extractCommentCount(value: Json) {
  if (!Array.isArray(value)) return 0;
  const first = value[0];
  if (!isJsonObject(first)) return 0;
  const count = first.count;
  if (typeof count === "number") return count;
  if (typeof count === "string") {
    const n = Number(count);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; categories?: string }>;
}) {
  const {
    q: searchQueryParam,
    sort: sortParam,
    categories: categoriesParam,
  } = await searchParams;
  const searchQuery = searchQueryParam?.trim() ?? "";
  const sort = sortParam ?? "recent";
  const categories = categoriesParam?.split(",") ?? null;

  const supabase = await createClient();

  const [countResult, jargonResults, featuredResults, exampleResults] =
    await Promise.all([
      QUERIES.countJargons(supabase, searchQuery),
      QUERIES.searchJargons(
        supabase,
        searchQuery,
        INITIAL_LOAD_SIZE,
        0,
        sort,
        categories,
      ),
      QUERIES.listFeaturedJargons(supabase, FEATURED_LOAD_SIZE),
      QUERIES.listExamples(supabase, "", "", null, LATEST_EXAMPLE_LOAD_SIZE, 0),
    ]);

  if (jargonResults.error) throw jargonResults.error;
  if (countResult.error) throw countResult.error;
  if (featuredResults.error) throw featuredResults.error;
  if (exampleResults.error) throw exampleResults.error;

  const initialData = jargonResults.data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    updated_at: item.updated_at,
    translations: extractStringArray(item.translations, "name"),
    categories: extractStringArray(item.categories, "acronym"),
    comment_count: extractCommentCount(item.comments),
  }));
  const initialTotalCount = countResult.data;

  const featuredJargons = (featuredResults.data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    updated_at: item.updated_at,
    translation: item.translation ?? "",
    categories: extractStringArray(item.categories, "acronym"),
    comment_count: extractCommentCount(item.comments),
  }));
  const latestExamples = (exampleResults.data ?? []) as Example[];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <FeaturedJargonCarousel featuredJargons={featuredJargons} />
      <LatestExamplesSection examples={latestExamples} />
      <HomePageClient
        searchQuery={searchQuery}
        initialData={initialData}
        initialTotalCount={initialTotalCount}
        initialSortCategories={{
          sort: sort as SortOption,
          categories,
        }}
      />
    </div>
  );
}
