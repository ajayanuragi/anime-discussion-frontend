
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReply } from "@/services/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CreateReplyFormProps {
  postId: number;
  parentId: number;
  onSuccess: () => void;
}

export default function CreateReplyForm({
  postId,
  parentId,
  onSuccess,
}: CreateReplyFormProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: () => createReply(parentId, content.trim(), postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
      onSuccess();
    },
  });

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Write a reply..."
        value={content}
        maxLength={255}
        onChange={(event) => setContent(event.target.value)}
      />
      <Button
        size="sm"
        disabled={!content.trim() || replyMutation.isPending}
        onClick={() => replyMutation.mutate()}
      >
        {replyMutation.isPending ? "Replying..." : "Post Reply"}
      </Button>
    </div>
  );
}
