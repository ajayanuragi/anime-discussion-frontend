import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  type CreatePostFormValues,
} from "@/lib/validations/post";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/services/posts";

import { useState } from "react";

export default function CreatePostDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      reset();
      setOpen(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = (data: CreatePostFormValues) => {
    createPostMutation.mutate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);

        if (!isOpen) {
          createPostMutation.reset();
        }
      }}
    >
      <DialogTrigger render={<Button />}>Create Post</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Discussion</DialogTitle>
          <DialogDescription>
            Start a new discussion about your favorite anime.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter discussion title"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="What would you like to discuss?"
              rows={5}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          {createPostMutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              Failed to publish post. Please try again.
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={createPostMutation.isPending}
          >
            {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
