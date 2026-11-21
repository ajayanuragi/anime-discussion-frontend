import { api } from "@/lib/api";
import type { Comment } from "@/types/comment";
export interface CreateCommentRequest {
  content: string;
  post: number;
}

export const getCommentsByPost = async (
  postId: number,
): Promise<Comment[]> => {
  const response = await api.get<Comment[]>(
    `/api/comments/post/${postId}`,
  );

  return response.data;
};

export const createComment = async (
  data: CreateCommentRequest,
): Promise<number> => {
  const response = await api.post<number>("/api/comments", data);
  return response.data;
};

export const likeComment = async (commentId: number): Promise<number> => {
  const response = await api.post<number>(
    `/api/likes/comment/${commentId}`
  );

  return response.data;
};