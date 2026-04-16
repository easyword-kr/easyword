"use client";

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { SquarePlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getClient } from "@/lib/supabase/client";
import { useLoginDialog } from "@/components/auth/login-dialog-provider";
import {
  createExample,
  type CreateExampleState,
} from "@/app/actions/create-example";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "등록 중..." : "등록하기"}
    </Button>
  );
}

// 단어 상세 페이지에서 현재 용어에 연결된 예문을 바로 추가한다.
export default function CreateExampleDialog({
  jargonId,
  jargonName,
}: {
  jargonId: string;
  jargonName: string;
}) {
  const router = useRouter();
  const supabase = getClient();
  const { openLogin } = useLoginDialog();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [result, createExampleAction] = useActionState(createExample, {
    ok: false,
    error: "",
  } satisfies CreateExampleState);

  const handleOpenChange = useCallback(
    async (nextOpen: boolean) => {
      if (nextOpen) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          openLogin();
          return;
        }
      }
      setOpen(nextOpen);
    },
    [openLogin, supabase],
  );

  const resetForm = () => {
    formRef.current?.reset();
  };

  useEffect(() => {
    if (result.ok) {
      queryClient.invalidateQueries({ queryKey: ["examples"] });
      startTransition(() => {
        setOpen(false);
      });
      resetForm();
      router.refresh();
    }
  }, [result, queryClient, router]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <SquarePlus className="size-4" />
          예문 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="-translate-y-[calc(25dvh)]">
        <DialogHeader>
          <DialogTitle>예문 추가하기</DialogTitle>
          <DialogDescription>
            {jargonName}이 쓰인 원문과 번역문을 함께 등록해 주세요
          </DialogDescription>
        </DialogHeader>

        <Form
          ref={formRef}
          action={createExampleAction}
          className="flex flex-col gap-3"
        >
          <input type="hidden" name="jargonId" value={jargonId} />

          <div className="flex flex-col gap-1">
            <Label htmlFor="sourceText" className="text-sm font-medium">
              원문
            </Label>
            <Textarea
              id="sourceText"
              name="sourceText"
              placeholder="The cache invalidation policy is hard to reason about."
              rows={3}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="translation" className="text-sm font-medium">
              번역문
            </Label>
            <Textarea
              id="translation"
              name="translation"
              placeholder="캐시 무효화 정책은 이해하기 어렵다."
              rows={3}
              required
            />
          </div>

          {result && !result.ok ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              닫기
            </Button>
            <Submit />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
