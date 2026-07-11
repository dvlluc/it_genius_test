import { memo } from "react";
import type { CartProduct } from "@/entities/order/model/types";

type OrderItemsListProps = {
  products: CartProduct[];
  maxVisible?: number;
};

export const OrderItemsList = memo(function OrderItemsList({
  products,
  maxVisible = 2,
}: OrderItemsListProps) {
  const visible = products.slice(0, maxVisible);
  const rest = products.length - visible.length;

  return (
    <div className="min-w-0 space-y-0.5 text-sm">
      {visible.map((product, index) => (
        <p key={`${product.id}-${index}`} className="truncate" title={product.title}>
          {product.title} × {product.quantity}
        </p>
      ))}
      {rest > 0 ? (
        <p className="truncate text-muted-foreground">+{rest} more</p>
      ) : null}
    </div>
  );
});
