"use server";

import { revalidatePath } from "next/cache";
import { MUTATIONS } from "@/lib/supabase/repository";
import { createClient } from "@/lib/supabase/server";

const MAX_DISPLAY_NAME_LENGTH = 20;

export type UpdateDisplayNameState =
  | { ok: false; error: string }
  | { ok: true; error: null };

export type UpdateDisplayNameAction = (
  prevState: UpdateDisplayNameState,
  formData: FormData,
) => Promise<UpdateDisplayNameState>;

export async function updateDisplayName(
  _prevState: UpdateDisplayNameState,
  formData: FormData,
): Promise<UpdateDisplayNameState> {
  const displayName = (formData.get("displayName") as string | null)?.trim();
  if (!displayName) return { ok: false, error: "이름을 입력해주세요" };
  if (displayName.length > MAX_DISPLAY_NAME_LENGTH)
    return {
      ok: false,
      error: `이름은 ${MAX_DISPLAY_NAME_LENGTH}자까지 쓸 수 있어요`,
    };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  const { error } = await MUTATIONS.updateDisplayName(
    supabase,
    user.id,
    displayName,
  );

  if (error) {
    console.error(error);
    return { ok: false, error: "이름을 바꾸는 중 문제가 생겼어요" };
  }
  console.info("updateDisplayName", user.id, displayName);

  revalidatePath("/profile");
  return { ok: true, error: null };
}
