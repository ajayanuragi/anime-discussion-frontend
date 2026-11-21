export interface Comment {
  id: number;
  content: string;
  user: number;
  post: number;
  likeCount: number;
  username: string;
  likedByCurrentUser: boolean;
  parentId: number | null;
}
