import { StarIcon } from "lucide-react";
import { formatRating } from "@/shared/lib/formatters";

type ProductRatingProps = {
  value: number;
};

export function ProductRating({ value }: ProductRatingProps) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <StarIcon className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
      {formatRating(value)}
    </span>
  );
}
