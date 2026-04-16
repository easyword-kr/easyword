import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { QUERIES } from "@/lib/supabase/repository";
import type { Example } from "@/types/example";

export default async function ExampleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await QUERIES.getExample(supabase, id);

  if (error) throw error;
  if (!data) notFound();

  const example = data as Example;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <Button asChild variant="ghost" size="sm" className="w-fit px-2">
        <Link href="/examples">
          <ArrowLeft className="size-4" />
          예문 목록
        </Link>
      </Button>

      <article className="bg-card flex flex-col gap-5 rounded-lg p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl leading-8 font-bold">{example.source_text}</h1>
          {example.jargons.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {example.jargons.map((jargon) => (
                <Badge key={jargon.id} variant="outline" asChild>
                  <Link href={`/jargon/${jargon.slug}`}>{jargon.name}</Link>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Languages className="size-4" />
            번역문
          </h2>
          {example.translations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {example.translations.map((translation) => (
                <p
                  key={translation.id}
                  className="bg-background rounded-md p-3 leading-7"
                >
                  {translation.translated_text}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              아직 번역문이 없어요
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
