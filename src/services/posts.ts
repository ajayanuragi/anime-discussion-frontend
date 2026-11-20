import { api } from "@/lib/api";
import type { Post } from "@/types/post";
import type { CreatePostFormValues } from "@/lib/validations/post";

export const createPost = async (data: CreatePostFormValues): Promise<Post> => {
  const response = await api.post<Post>("/api/posts", data);
  return response.data;
};

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>("/api/posts");
  return response.data;
};
