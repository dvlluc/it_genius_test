import Image from "next/image";
import { cn } from "@/shared/lib/utils";

type ProductThumbnailProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ProductThumbnail({ src, alt, className }: ProductThumbnailProps) {
  return (
    <div
      className={cn(
        "relative size-12 overflow-hidden rounded-lg border bg-muted",
        className,
      )}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="48px" />
    </div>
  );
}
