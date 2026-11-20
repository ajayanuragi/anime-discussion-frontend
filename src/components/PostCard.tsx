import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/types/post";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "@/services/posts";
import { Heart } from "lucide-react";
import PostComments from "@/components/PostComments";
import CreateCommentForm from "@/components/CreateCommentForm";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => likePost(post.id),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      queryClient.setQueryData<Post[]>(["posts"], (old) =>
        old?.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likeCount: Math.max(
                  0,
                  p.likeCount + (p.likedByCurrentUser ? -1 : 1),
                ),
                likedByCurrentUser: !p.likedByCurrentUser,
              }
            : p,
        ),
      );

      return { previousPosts };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{post.content}</p>
        <Button
          variant="ghost"
          size="sm"
          disabled={likeMutation.isPending}
          onClick={() => {
            likeMutation.reset();
            likeMutation.mutate();
          }}
        >
          <Heart
            className={`size-4 ${
              post.likedByCurrentUser ? "fill-primary text-primary" : ""
            }`}
          />
          {post.likeCount} likes
        </Button>

        <CreateCommentForm postId={post.id} />
        <PostComments postId={post.id} />
        {likeMutation.isError && (
          <p role="alert" className="text-sm text-destructive">
            Failed to like post. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
