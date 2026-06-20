"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { PencilIcon } from "lucide-react";
import Form from "next/form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";
import {
  updateDisplayName,
  UpdateDisplayNameState,
} from "@/app/actions/update-display-name";

export default function DisplayNameForm({
  userId,
  initialName,
}: {
  userId: string;
  initialName: string;
}) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [state, formAction, pending] = useActionState<
    UpdateDisplayNameState,
    FormData
  >(updateDisplayName, { ok: false, error: "" });

  useEffect(() => {
    if (state?.ok) {
      startTransition(() => {
        setIsEditing(false);
      });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    }
  }, [state, queryClient, userId]);

  if (!isEditing) {
    return (
      <div className="flex items-center gap-1">
        <CardTitle className="text-xl">
          {initialName || "이름 없는 사용자"}
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="이름 바꾸기"
          onClick={() => setIsEditing(true)}
        >
          <PencilIcon className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <Form action={formAction} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Input
          name="displayName"
          defaultValue={initialName}
          maxLength={50}
          aria-label="이름"
          className="h-8 w-48"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "바꾸는 중..." : "저장"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(false)}
        >
          닫기
        </Button>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
    </Form>
  );
}
