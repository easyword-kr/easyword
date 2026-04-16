"use server";

import { MUTATIONS } from "@/lib/supabase/repository";
import { createClient } from "@/lib/supabase/server";

export type CreateExampleState =
  | { ok: false; error: string }
  | { ok: true; error: null; exampleId: string };

export async function createExample(
  _prevState: CreateExampleState,
  formData: FormData,
): Promise<CreateExampleState> {
  const jargonId = (formData.get("jargonId") as string | null)?.trim();
  if (!jargonId) return { ok: false, error: "잘못된 요청이에요" };

  const sourceText = (formData.get("sourceText") as string | null)?.trim();
  if (!sourceText) return { ok: false, error: "예문 원문을 입력해 주세요" };

  const translation = (formData.get("translation") as string | null)?.trim();
  if (!translation) return { ok: false, error: "번역문을 입력해 주세요" };

  const supabase = await createClient();
  const { data, error } = await MUTATIONS.createExample(
    supabase,
    sourceText,
    translation,
    [jargonId],
  );

  if (error) {
    switch (error.code) {
      case "28000":
        return { ok: false, error: "로그인이 필요해요" };
      case "NO_JARGON":
        return { ok: false, error: "존재하지 않는 용어예요" };
      default:
        return {
          ok: false,
          error:
            `${error.message} (에러 코드: ${error.code})` ||
            `문제가 발생했어요 (에러 코드: ${error.code})`,
        };
    }
  }

  return { ok: true, error: null, exampleId: data };
}
