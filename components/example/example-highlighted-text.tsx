import { cn } from "@/lib/utils";

// 사용자 입력을 안전하게 정규식 검색어로 바꾼다.
function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// MVP용 UI 하이라이트로, 자동 연결 로직과는 분리된 단순 문자열 매칭이다.
export default function ExampleHighlightedText({
  text,
  terms,
  className,
}: {
  text: string;
  terms: string[];
  className?: string;
}) {
  const normalizedTerms = terms
    .map((term) => term.trim())
    .filter((term) => term.length > 0)
    .sort((a, b) => b.length - a.length);

  if (normalizedTerms.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const pattern = new RegExp(
    `(${normalizedTerms.map(escapeRegExp).join("|")})`,
    "gi",
  );
  const parts = text.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const isMatch = normalizedTerms.some(
          (term) => term.toLowerCase() === part.toLowerCase(),
        );

        return isMatch ? (
          <mark
            key={`${part}-${index}`}
            className={cn(
              "bg-amber-200 px-0.5 text-amber-950 dark:bg-amber-300/25 dark:text-amber-100",
            )}
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </span>
  );
}
