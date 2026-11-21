import type { Comment } from "@/types/comment";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import CreateReplyForm from "@/components/CreateReplyForm";

interface CommentItemProps {
  comment: Comment;
  comments: Comment[];
  onLike: (commentId: number) => void;
  likingCommentId?: number;
  onReply: (commentId: number) => void;
  replyingToId: number | null;
  postId: number;
  onReplySuccess: () => void;
}

export default function CommentItem({
  comment,
  comments,
  onLike,
  likingCommentId,
  onReply,
  replyingToId,
  postId,
  onReplySuccess,
}: CommentItemProps) {
  const replies = comments.filter((reply) => reply.parentId === comment.id);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">@{comment.username}</p>
      <p className="text-sm text-muted-foreground">{comment.content}</p>
      <Button
        variant="ghost"
        size="sm"
        disabled={likingCommentId === comment.id}
        onClick={() => onLike(comment.id)}
      >
        <Heart
          className={`size-4 ${
            comment.likedByCurrentUser ? "fill-primary text-primary" : ""
          }`}
        />
        {comment.likeCount}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onReply(comment.id)}>
        <MessageCircle className="size-4" />
        Reply
      </Button>
      {replyingToId === comment.id && (
        <CreateReplyForm
          postId={postId}
          parentId={comment.id}
          onSuccess={onReplySuccess}
        />
      )}

      {replies.length > 0 && (
        <div className="ml-4 space-y-3 border-l pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              comments={comments}
              onLike={onLike}
              likingCommentId={likingCommentId}
              onReply={onReply}
              replyingToId={replyingToId}
              postId={postId}
              onReplySuccess={onReplySuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}
