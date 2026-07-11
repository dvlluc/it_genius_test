import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchUsers, searchUsers } from "@/entities/user/api/user-api";
import type { UserListParams } from "@/entities/user/model/types";

export const userInfiniteKeys = {
  all: ["users", "infinite"] as const,
  list: (params: Omit<UserListParams, "skip">) =>
    [...userInfiniteKeys.all, params] as const,
};

type UserInfiniteParams = Omit<UserListParams, "skip"> & {
  limit?: number;
};

export function useUsersInfiniteQuery(params: UserInfiniteParams) {
  const { limit = 20, ...rest } = params;

  return useInfiniteQuery({
    queryKey: userInfiniteKeys.list(rest),
    queryFn: ({ pageParam = 0 }) => {
      const baseParams = { ...rest, limit, skip: pageParam };
      if (rest.q) {
        return searchUsers(rest.q, baseParams);
      }
      return fetchUsers(baseParams);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.users.length, 0);
      return loaded < lastPage.total ? loaded : undefined;
    },
  });
}
