"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { getUserFullName, type User } from "@/entities/user/model/types";

type UserAvatarProps = {
  user: Pick<User, "firstName" | "lastName" | "image">;
  size?: "sm" | "md";
};

export function UserAvatar({ user, size = "sm" }: UserAvatarProps) {
  const name = getUserFullName(user as User);
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  return (
    <Avatar className={size === "sm" ? "size-8" : "size-10"}>
      <AvatarImage src={user.image} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
