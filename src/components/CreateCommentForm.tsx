import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/services/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CreateCommentFormProps {
  postId: number;
}

export default function CreateCommentForm({ postId }: CreateCommentFormProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim()) return;

    mutation.mutate({
      content: content.trim(),
      post: postId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="Write a comment..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={255}
        required
      />
      <p className="text-right text-xs text-muted-foreground">
        {content.length}/255
      </p>

      {mutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          Failed to post comment. Please try again.
        </p>
      )}

      <Button type="submit" disabled={mutation.isPending || !content.trim()}>
        {mutation.isPending ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}
