import { BookOpenText } from "lucide-react";
import CreateExampleDialog from "@/components/example/create-example-dialog";
import ExampleCard from "@/components/example/example-card";
import type { Example } from "@/types/example";

// 단어 상세 페이지에서 해당 용어와 연결된 예문만 간단히 노출한다.
export default function JargonExamplesSection({
  jargonId,
  jargonName,
  examples,
}: {
  jargonId: string;
  jargonName: string;
  examples: Example[];
}) {
  return (
    <section className="bg-card flex flex-col gap-3 rounded-lg p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <BookOpenText className="size-4" />
          쓰임 예문
        </h2>
        <CreateExampleDialog jargonId={jargonId} jargonName={jargonName} />
      </div>

      {examples.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {examples.map((example) => (
            <ExampleCard
              key={example.id}
              example={example}
              highlightTerms={[jargonName]}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-4 text-center text-sm">
          아직 연결된 예문이 없어요
        </p>
      )}
    </section>
  );
}
