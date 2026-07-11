import { apiClient } from "@/shared/api/client";
import type { User, UserListParams, UsersResponse } from "@/entities/user/model/types";

export async function fetchUsers(params: UserListParams = {}): Promise<UsersResponse> {
  const { data } = await apiClient.get<UsersResponse>("/users", {
    params: {
      limit: params.limit ?? 10,
      skip: params.skip ?? 0,
      q: params.q || undefined,
      sortBy: params.sortBy,
      order: params.order,
    },
  });
  return data;
}

export async function searchUsers(
  q: string,
  params: Omit<UserListParams, "q"> = {},
): Promise<UsersResponse> {
  const { data } = await apiClient.get<UsersResponse>("/users/search", {
    params: {
      q,
      limit: params.limit ?? 10,
      skip: params.skip ?? 0,
      sortBy: params.sortBy,
      order: params.order,
    },
  });
  return data;
}

export async function fetchAllUsers(limit = 100): Promise<User[]> {
  const { data } = await apiClient.get<UsersResponse>("/users", {
    params: { limit },
  });
  return data.users;
}

export async function fetchUserById(id: number): Promise<User> {
  const { data } = await apiClient.get<User>(`/users/${id}`);
  return data;
}
