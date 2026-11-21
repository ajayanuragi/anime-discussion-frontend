import { useQuery } from "@tanstack/react-query";
import { getCommentsByPost } from "@/services/comments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeComment } from "@/services/comments";
import type { Comment } from "@/types/comment";
import CommentItem from "@/components/CommentItem";
import { useState } from "react";

interface PostCommentsProps {
  postId: number;
}

export default function PostComments({ postId }: PostCommentsProps) {
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
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
  const topLevelComments = comments.filter(
    (comment) => comment.parentId === null,
  );

  return (
    <div className="space-y-3">
      {topLevelComments.map((comment) => (
        <div key={comment.id} className="rounded-md border p-3">
          <CommentItem
            comment={comment}
            comments={comments}
            onLike={(commentId) => likeMutation.mutate(commentId)}
            replyingToId={replyingToId}
            postId={postId}
            onReplySuccess={() => setReplyingToId(null)}
            likingCommentId={
              likeMutation.isPending ? likeMutation.variables : undefined
            }
            onReply={(commentId) =>
              setReplyingToId((current) =>
                current === commentId ? null : commentId,
              )
            }
          />
        </div>
      ))}
    </div>
  );
}
