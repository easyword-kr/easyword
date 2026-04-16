import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QUERIES } from "@/lib/supabase/repository";
import CommentThread from "@/components/comment/comment-thread";
import SuggestTranslationDialog from "@/components/dialogs/suggest-translation-dialog";
import ShareButton from "@/components/share-button";
import { Comment } from "@/types/comment";
import JargonTranslationsSection from "@/components/jargon/jargon-translations-section";
import UpdateJargonCategoriesDialog from "@/components/jargon/update-jargon-categories-dialog";
import JargonExamplesSection from "@/components/example/jargon-examples-section";
import type { Example } from "@/types/example";

const JARGON_EXAMPLE_LOAD_SIZE = 4;

export default async function JargonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: jargon } = await QUERIES.getJargonBySlug(supabase, slug);

  if (!jargon) {
    return (
      <div className="bg-background flex min-h-[50dvh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">용어를 찾을 수 없습니다</h1>
          <Link href="/" className="hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const [commentResults, exampleResults] = await Promise.all([
    QUERIES.listComments(supabase, jargon.id),
    QUERIES.listExamples(
      supabase,
      "",
      "",
      jargon.id,
      JARGON_EXAMPLE_LOAD_SIZE,
      0,
    ),
  ]);

  if (commentResults.error) throw commentResults.error;
  if (exampleResults.error) throw exampleResults.error;

  const examples = (exampleResults.data ?? []) as Example[];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      {/* Jargon details */}
      <div className="bg-card rounded-lg p-3">
        <div className="flex flex-col gap-2">
          {/* categories */}
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {jargon.categories.map((cat) => (
                  <span
                    key={cat.category.acronym}
                    className="bg-background text-foreground border-accent inline-block rounded-full border px-1 py-0.5 font-mono text-sm"
                  >
                    {cat.category.acronym}
                  </span>
                ))}
              </div>
              <UpdateJargonCategoriesDialog
                jargonId={jargon.id}
                initialCategoryIds={jargon.categories.map((c) => c.category.id)}
              />
            </div>
            <ShareButton label="공유" />
          </div>
          {/* translations */}
          <JargonTranslationsSection
            jargonId={jargon.id}
            authorId={jargon.author_id}
            name={jargon.name}
            translations={jargon.translations}
          />
          <SuggestTranslationDialog jargonId={jargon.id} />
        </div>
      </div>

      <JargonExamplesSection
        jargonId={jargon.id}
        jargonName={jargon.name}
        examples={examples}
      />

      {/* comments */}
      <div className="bg-card rounded-lg p-3">
        <CommentThread
          jargonId={jargon.id}
          initialComments={commentResults.data as Omit<Comment, "replies">[]}
        />
      </div>
    </div>
  );
}
