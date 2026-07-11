import { apiClient } from "@/shared/api/client";
import type { Post, PostsResponse } from "@/entities/post/model/types";

export async function fetchPosts(limit = 10): Promise<Post[]> {
  const { data } = await apiClient.get<PostsResponse>("/posts", {
    params: { limit },
  });
  return data.posts;
}
