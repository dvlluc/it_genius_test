import { Badge } from "@/shared/ui/badge";
import type { UserStatus } from "@/entities/user/model/types";

const STATUS_VARIANT: Record<
  UserStatus,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  inactive: "secondary",
  pending: "outline",
};

type UserStatusBadgeProps = {
  status: UserStatus;
  label: string;
};

export function UserStatusBadge({ status, label }: UserStatusBadgeProps) {
  return <Badge variant={STATUS_VARIANT[status]}>{label}</Badge>;
}
