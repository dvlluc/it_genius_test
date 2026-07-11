import { Badge } from "@/shared/ui/badge";
import type { OrderStatus } from "@/entities/order/model/types";

const VARIANT: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  pending: "outline",
  processing: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
  label: string;
};

export function OrderStatusBadge({ status, label }: OrderStatusBadgeProps) {
  return <Badge variant={VARIANT[status]}>{label}</Badge>;
}
