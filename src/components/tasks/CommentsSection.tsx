"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { commentSchema, type CommentInput } from "@/schemas/comment";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useDeleteCommentMutation,
} from "@/store/api/tasksApi";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateTime } from "@/lib/utils";

export function CommentsSection({ taskId }: { taskId: string }) {
  const { data: session } = useSession();
  const { data: comments, isLoading } = useGetCommentsQuery(taskId);
  const [addComment, { isLoading: adding }] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: "" },
  });

  async function onSubmit(data: CommentInput) {
    try {
      await addComment({ taskId, body: data.body }).unwrap();
      reset();
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to add comment",
      );
    }
  }

  async function remove(id: string) {
    try {
      await deleteComment(id).unwrap();
    } catch (err) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ??
          "Failed to delete comment",
      );
    }
  }

  return (
    <div className="space-y-3">
      <Typography variant="label">Comments</Typography>

      {isLoading ? (
        <Spinner className="h-5 w-5 text-gray-400" />
      ) : comments?.length ? (
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Avatar name={c.author.name} src={c.author.avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Typography variant="small" className="font-medium">
                    {c.author.name}
                  </Typography>
                  <Typography variant="caption">
                    {formatDateTime(c.created_at)}
                  </Typography>
                  {c.author.id === session?.user?.id && (
                    <button
                      onClick={() => remove(c.id)}
                      className="ml-auto rounded p-1 text-gray-400 hover:text-red-600"
                      aria-label="Delete comment"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Typography variant="small" className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {c.body}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Typography variant="muted">No comments yet.</Typography>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2">
        <div className="flex-1">
          <textarea
            rows={2}
            placeholder="Write a comment..."
            className="w-full rounded-(--radius-btn) border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
            {...register("body")}
          />
          {errors.body && (
            <Typography variant="caption" color="danger">
              {errors.body.message}
            </Typography>
          )}
        </div>
        <Button type="submit" size="sm" loading={adding}>
          Post
        </Button>
      </form>
    </div>
  );
}
