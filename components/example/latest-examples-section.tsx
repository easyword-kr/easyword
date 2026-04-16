import Link from "next/link";
import { BookOpenText, ArrowRight } from "lucide-react";
import ExampleCard from "@/components/example/example-card";
import { Button } from "@/components/ui/button";
import type { Example } from "@/types/example";

// 홈 화면에서 최신 예문 몇 개를 요약 카드로 보여준다.
export default function LatestExamplesSection({
  examples,
}: {
  examples: Example[];
}) {
  if (examples.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <BookOpenText className="size-5" />새 번역 예문
        </h2>
        <Button asChild variant="ghost" size="sm">
          <Link href="/examples">
            모두 보기
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {examples.map((example) => (
          <ExampleCard key={example.id} example={example} compact />
        ))}
      </div>
    </section>
  );
}
