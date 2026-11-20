export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  likeCount: number;
  likedByCurrentUser: boolean;
}
