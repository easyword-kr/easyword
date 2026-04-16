import Link from "next/link";
import { ArrowRight, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExampleHighlightedText from "@/components/example/example-highlighted-text";
import type { Example } from "@/types/example";
import { cn } from "@/lib/utils";

// 예문 원문, 번역문, 연결 용어를 같은 카드 레이아웃으로 보여준다.
export default function ExampleCard({
  example,
  highlightTerms = [],
  compact = false,
  className,
}: {
  example: Example;
  highlightTerms?: string[];
  compact?: boolean;
  className?: string;
}) {
  const visibleTranslations = compact
    ? example.translations.slice(0, 1)
    : example.translations;

  return (
    <article
      className={cn(
        "bg-card text-card-foreground flex h-full flex-col gap-3 rounded-md p-3",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-base leading-7 font-semibold">
          <ExampleHighlightedText
            text={example.source_text}
            terms={highlightTerms}
          />
        </p>

        {visibleTranslations.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {visibleTranslations.map((translation) => (
              <p
                key={translation.id}
                className="text-muted-foreground flex gap-2 text-sm leading-6"
              >
                <Languages className="mt-1 size-3.5 shrink-0" />
                <span>{translation.translated_text}</span>
              </p>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">아직 번역문이 없어요</p>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        {example.jargons.length > 0 && (
          <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
            {example.jargons.map((jargon) => (
              <Badge key={jargon.id} variant="outline" asChild>
                <Link href={`/jargon/${jargon.slug}`}>{jargon.name}</Link>
              </Badge>
            ))}
          </div>
        )}

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="ml-auto h-8 self-end px-2"
        >
          <Link href={`/examples/${example.id}`}>
            자세히
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
