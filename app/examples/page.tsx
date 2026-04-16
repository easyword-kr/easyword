import ExampleList from "@/components/example/example-list";
import { createClient } from "@/lib/supabase/server";
import { QUERIES } from "@/lib/supabase/repository";
import type { Example } from "@/types/example";

const INITIAL_LOAD_SIZE = 13;

export default async function ExamplesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jargon?: string }>;
}) {
  const { q: searchQueryParam, jargon: jargonQueryParam } = await searchParams;
  const searchQuery = searchQueryParam?.trim() ?? "";
  const jargonQuery = jargonQueryParam?.trim() ?? "";
  const supabase = await createClient();

  const { data, error } = await QUERIES.listExamples(
    supabase,
    searchQuery,
    jargonQuery,
    null,
    INITIAL_LOAD_SIZE,
    0,
  );

  if (error) throw error;

  return (
    <div className="mx-auto max-w-5xl">
      <ExampleList
        key={`${searchQuery}:${jargonQuery}`}
        searchQuery={searchQuery}
        jargonQuery={jargonQuery}
        initialData={data as Example[]}
      />
    </div>
  );
}
