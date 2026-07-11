import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAllUsers, fetchUsers, searchUsers } from "@/entities/user/api/user-api";
import type { UserListParams } from "@/entities/user/model/types";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  allUsers: (limit: number) => [...userKeys.all, "all", limit] as const,
};

export function useUsersQuery(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () =>
      params.q ? searchUsers(params.q, params) : fetchUsers(params),
    placeholderData: keepPreviousData,
  });
}

export function useAllUsersQuery(limit = 100) {
  return useQuery({
    queryKey: userKeys.allUsers(limit),
    queryFn: () => fetchAllUsers(limit),
  });
}
