"use client";

import { useState, useEffect, useActionState, startTransition } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import Linkify from "linkify-react";
import {
  EraserIcon,
  MessageCircle,
  Minus,
  PencilIcon,
  Plus,
} from "lucide-react";
import Form from "next/form";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Comment } from "@/types/comment";
import CommentForm from "@/components/comment/comment-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserQuery } from "@/hooks/use-user-query";
import { useLoginDialog } from "@/components/auth/login-dialog-provider";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  updateComment,
  UpdateCommentAction,
} from "@/app/actions/update-comment";
import {
  removeComment,
  RemoveCommentAction,
} from "@/app/actions/remove-comment";

dayjs.extend(relativeTime);
dayjs.locale("ko");

const linkifyOptions = {
  attributes: {
    target: "_blank",
    rel: "noopener noreferrer nofollow",
  },
  className: "text-orange-700 underline underline-offset-2",
};

export default function CommentItem({
  comment,
  depth = 0,
}: {
  comment: Comment;
  depth?: number;
}) {
  const { data: user } = useUserQuery();
  const { openLogin } = useLoginDialog();

  const isAdmin = user?.app_metadata?.userrole === "admin";

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content ?? "");
  const queryClient = useQueryClient();

  const initials = (comment.profile.display_name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const [updateState, updateCommentAction] = useActionState(
    updateComment.bind(null, comment.id) as UpdateCommentAction,
    { ok: false, error: "" },
  );

  const [removeState, removeAction] = useActionState(
    removeComment.bind(null, comment.id) as RemoveCommentAction,
    { ok: false, error: "" },
  );

  useEffect(() => {
    startTransition(() => {
      setEditContent(comment.content ?? "");
    });
  }, [comment.content]);

  useEffect(() => {
    if (updateState?.ok) {
      startTransition(() => {
        setIsEditing(false);
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", comment.jargon_id],
      });
    }
  }, [updateState, queryClient, comment.jargon_id]);

  useEffect(() => {
    if (removeState?.ok) {
      queryClient.invalidateQueries({
        queryKey: ["comments", comment.jargon_id],
      });
    }
  }, [removeState, queryClient, comment.jargon_id]);

  if (
    comment.removed &&
    comment.author_id !== user?.id &&
    (!comment.replies || comment.replies.length === 0)
  ) {
    return null;
  }

  return (
    <div className="border-border relative ml-3 rounded-b-md border-l-2 transition-colors hover:border-orange-200 dark:hover:border-orange-400/30">
      <button
        onClick={() => setShowReplies((b) => !b)}
        aria-label="Close replies"
        className="absolute inset-y-0 left-0 w-1 cursor-pointer"
      />

      {comment.removed && comment.author_id !== user?.id ? (
        <div className="text-muted-foreground py-2 pl-3 text-sm italic">
          지워진 댓글
        </div>
      ) : (
        <>
          {/* Comment content */}
          <div className="pt-1 pb-2 pl-2.5">
            {/* Comment header */}
            <div className="mb-1 flex items-center gap-2">
              <Avatar className="size-5.5">
                {comment.profile.photo_url ? (
                  <AvatarImage
                    src={comment.profile.photo_url}
                    alt={comment.profile.display_name || ""}
                  />
                ) : null}
                <AvatarFallback className="text-[10px]">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-foreground flex items-center gap-1 text-sm">
                <span className="line-clamp-1 font-medium">
                  {comment.profile.display_name || ""}
                </span>
                {comment.translation?.name ? (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="shrink-0 font-medium text-orange-800">
                      {comment.translation.name}
                    </span>
                  </>
                ) : null}
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground shrink-0">
                    {dayjs(comment.created_at).fromNow()}
                  </span>
                </>
                {comment.removed && comment.author_id === user?.id ? (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <span className="shrink-0 text-red-600">지워짐</span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Comment content */}
            {isEditing ? (
              <Form
                action={updateCommentAction}
                className="mb-2 flex flex-col gap-1.5"
              >
                <Textarea
                  name="content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={depth > 0 ? 3 : 4}
                />
                {updateState?.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {updateState.error}
                  </p>
                )}
                <div className="flex justify-end gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content ?? "");
                    }}
                  >
                    닫기
                  </Button>
                  <Button type="submit" size="sm">
                    고치기
                  </Button>
                </div>
              </Form>
            ) : comment.removed ? (
              <div className="text-muted-foreground mb-2 text-sm whitespace-pre-wrap italic">
                <Linkify options={linkifyOptions}>{comment.content}</Linkify>
              </div>
            ) : (
              <div className="mb-2 text-sm whitespace-pre-wrap">
                <Linkify options={linkifyOptions}>{comment.content}</Linkify>
              </div>
            )}

            {/* Comment actions */}
            {!comment.removed && (
              <div className="text-muted-foreground flex items-center gap-3 text-xs">
                {comment.replies && comment.replies.length > 0 && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className="text-muted-foreground border-border bg-card -ml-5.5 flex size-5 items-center justify-center rounded-full border-2 transition-colors hover:cursor-pointer"
                  >
                    {showReplies ? (
                      <Minus className="size-2.5" />
                    ) : (
                      <Plus className="size-2.5" />
                    )}
                  </button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (!user) {
                      openLogin();
                    } else {
                      setShowReplyForm(!showReplyForm);
                    }
                  }}
                  className="flex h-6 w-15 items-center gap-1.5 text-xs"
                >
                  <MessageCircle className="size-3" />
                  답글
                </Button>
                {user &&
                  (user.id === comment.author_id || isAdmin) &&
                  !isEditing && (
                    <>
                      <Button
                        variant="ghost"
                        className="h-6 gap-1.5 px-2.5 text-xs"
                        onClick={() => setIsEditing(true)}
                      >
                        <PencilIcon className="size-3" />
                        고치기
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-6 gap-1.5 px-2.5 text-xs text-red-600 hover:text-red-700"
                          >
                            <EraserIcon className="size-3" />
                            지우기
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              정말로 댓글을 지울까요?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              이 작업은 되돌릴 수 없어요. 이미 답글이 달린
                              댓글은
                              {" '지워진 댓글'"}로 표시돼요.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          {removeState?.error && (
                            <span className="text-xs text-red-600">
                              {removeState.error}
                            </span>
                          )}
                          <AlertDialogFooter>
                            <AlertDialogCancel>닫기</AlertDialogCancel>
                            <Form action={removeAction}>
                              <AlertDialogAction
                                type="submit"
                                className="bg-red-600 hover:bg-red-700"
                              >
                                지우기
                              </AlertDialogAction>
                            </Form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
              </div>
            )}

            {/* Reply form */}
            {showReplyForm && (
              <div className="mt-1.5 ml-0.5">
                <CommentForm
                  jargonId={comment.jargon_id}
                  parentId={comment.id}
                  close={() => setShowReplyForm(false)}
                  placeholder="여러분의 생각은 어떤가요?"
                  submitLabel="답글 달기"
                />
              </div>
            )}
          </div>
        </>
      )}
      {/* Nested replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
