import { useQuery } from "@tanstack/react-query";
import { getCommentsByPost } from "@/services/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { likeComment } from "@/services/comments";
import type { Comment } from "@/types/comment";

interface PostCommentsProps {
  postId: number;
}

export default function PostComments({ postId }: PostCommentsProps) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: likeComment,

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments",
        postId,
      ]);

      queryClient.setQueryData<Comment[]>(["comments", postId], (old) =>
        old?.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likeCount:
                  comment.likeCount + (comment.likedByCurrentUser ? -1 : 1),
                likedByCurrentUser: !comment.likedByCurrentUser,
              }
            : comment,
        ),
      );

      return { previousComments };
    },

    onError: (_error, _commentId, context) => {
      queryClient.setQueryData(["comments", postId], context?.previousComments);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPost(postId),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading comments...</p>;
  }

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load comments.</p>;
  }

  if (!comments?.length) {
    return <p className="text-sm text-muted-foreground">No comments yet.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-1 rounded-md border p-3">
          <p className="text-sm font-medium">@{comment.username}</p>

          <p className="text-sm text-muted-foreground">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            disabled={
              likeMutation.isPending && likeMutation.variables === comment.id
            }
            onClick={() => likeMutation.mutate(comment.id)}
          >
            <Heart
              className={`size-4 ${
                comment.likedByCurrentUser ? "fill-primary text-primary" : ""
              }`}
            />
            {comment.likeCount}
          </Button>
        </div>
      ))}
    </div>
  );
}
