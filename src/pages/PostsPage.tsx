import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/services/posts";
import PostCard from "@/components/PostCard";
import CreatePostDialog from "@/components/CreatePostDialog";

export default function PostsPage() {
  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Anime Discussions</h1>
          <p className="text-muted-foreground">
            Explore and discuss your favorite anime.
          </p>
        </div>

        <CreatePostDialog />
      </div>

      {isLoading && <p>Loading posts...</p>}

      {isError && <p>Failed to load posts.</p>}

      {posts?.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h2 className="font-medium">No discussions yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Be the first to start an anime discussion.
          </p>
        </div>
      )}

      {posts && (
        <div className="grid gap-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
