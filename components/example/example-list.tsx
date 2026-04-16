"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenText, Search, X } from "lucide-react";
import equal from "fast-deep-equal";
import { useInfiniteQuery } from "@tanstack/react-query";
import ExampleCard from "@/components/example/example-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getClient } from "@/lib/supabase/client";
import { QUERIES } from "@/lib/supabase/repository";
import type { Example } from "@/types/example";

const PAGE_SIZE = 12;
// count RPC 없이 다음 페이지 여부를 알기 위해 한 개 더 요청한다.
const LOAD_SIZE = PAGE_SIZE + 1;

interface ExamplePage {
  items: Example[];
  nextOffset: number | null;
}

function buildExamplesUrl(searchQuery: string, jargonQuery: string) {
  const params = new URLSearchParams();
  if (searchQuery.trim()) params.set("q", searchQuery.trim());
  if (jargonQuery.trim()) params.set("jargon", jargonQuery.trim());
  const query = params.toString();
  return query ? `/examples?${query}` : "/examples";
}

function createPage(items: Example[], offset: number): ExamplePage {
  return {
    items: items.slice(0, PAGE_SIZE),
    nextOffset: items.length > PAGE_SIZE ? offset + PAGE_SIZE : null,
  };
}

// /examples 페이지의 검색, 용어 필터, 더보기 로딩을 담당한다.
export default function ExampleList({
  searchQuery,
  jargonQuery,
  initialData,
}: {
  searchQuery: string;
  jargonQuery: string;
  initialData: Example[];
}) {
  const router = useRouter();
  const supabase = getClient();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [jargonInput, setJargonInput] = useState(jargonQuery);

  const [initialQueryKey] = useState(() => [
    "examples",
    { q: searchQuery, jargon: jargonQuery },
  ]);

  const queryKey = ["examples", { q: searchQuery, jargon: jargonQuery }];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam, signal }) => {
      const { data, error } = await QUERIES.listExamples(
        supabase,
        searchQuery,
        jargonQuery,
        null,
        LOAD_SIZE,
        pageParam,
        { signal },
      );
      if (error) throw error;
      return createPage(data as Example[], pageParam);
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialData: equal(queryKey, initialQueryKey)
      ? {
          pages: [createPage(initialData, 0)],
          pageParams: [0],
        }
      : undefined,
  });

  const examples = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data?.pages],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.replace(buildExamplesUrl(searchInput, jargonInput));
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-600">예문을 불러오지 못했어요</p>
        <p className="text-muted-foreground text-sm">
          {(error as Error).message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <BookOpenText className="size-5" />
            번역 예문
          </h1>
          {(searchQuery || jargonQuery) && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/examples">
                <X className="size-4" />
                검색 지우기
              </Link>
            </Button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card grid gap-2 rounded-md p-3 md:grid-cols-[1fr_1fr_auto]"
        >
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="원문이나 번역문 검색"
            aria-label="원문이나 번역문 검색"
          />
          <Input
            value={jargonInput}
            onChange={(event) => setJargonInput(event.target.value)}
            placeholder="포함된 용어로 좁히기"
            aria-label="포함된 용어로 좁히기"
          />
          <Button type="submit" className="md:w-24">
            <Search className="size-4" />
            검색
          </Button>
        </form>
      </div>

      {isLoading && !data ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      ) : examples.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {examples.map((example) => (
              <ExampleCard
                key={example.id}
                example={example}
                highlightTerms={[searchQuery, jargonQuery]}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center py-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="lg"
              >
                {isFetchingNextPage ? "불러오는 중..." : "더보기"}
              </Button>
            </div>
          )}

          {!hasNextPage && (
            <div className="flex justify-center py-3">
              <span className="text-muted-foreground text-sm">
                모든 예문을 불러왔어요
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center py-12">
          <span className="text-muted-foreground">예문을 찾지 못했어요</span>
        </div>
      )}
    </div>
  );
}
