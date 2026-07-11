import { Badge } from "@/shared/ui/badge";
import { LOW_STOCK_THRESHOLD } from "@/shared/config/constants";

type StockBadgeProps = {
  stock: number;
  lowLabel: string;
  inStockLabel: string;
};

export function StockBadge({ stock, lowLabel, inStockLabel }: StockBadgeProps) {
  const isLow = stock < LOW_STOCK_THRESHOLD;
  return (
    <Badge
      variant={isLow ? "destructive" : "secondary"}
      className="max-w-full truncate"
    >
      {isLow ? lowLabel : inStockLabel}: {stock}
    </Badge>
  );
}
