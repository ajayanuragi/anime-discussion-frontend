import { useQuery } from "@tanstack/react-query";
import { getCommentsByPost } from "@/services/comments";

interface PostCommentsProps {
  postId: number;
}

export default function PostComments({ postId }: PostCommentsProps) {
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
        </div>
      ))}
    </div>
  );
}
