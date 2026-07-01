import Image from "next/image";
import { PawPrint } from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

export type SanityImageValue = Readonly<{
  image: {
    asset: {
      url: string;
      metadata: {
        lqip: string | null;
        dimensions: {
          width: number;
          height: number;
          aspectRatio: number;
        } | null;
      } | null;
    } | null;
  };
  alt: string;
  caption: string | null;
}> | null;

type SanityImageProps = Readonly<{
  image: SanityImageValue;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes: string;
}>;

/**
 * Renders a Sanity image through Next image optimization with a stable fallback.
 */
export function SanityImage({ image, className, imageClassName, priority = false, sizes }: SanityImageProps) {
  const asset = image?.image?.asset;

  return (
    <figure className={joinClassNames("relative overflow-hidden bg-pet-mint/25", className)}>
      {asset?.url ? (
        <Image
          src={asset.url}
          alt={image?.alt ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={asset.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={asset.metadata?.lqip ?? undefined}
          className={joinClassNames("object-cover", imageClassName)}
        />
      ) : (
        <div className="flex h-full min-h-64 items-center justify-center text-pet-muted">
          <PawPrint aria-hidden="true" size={48} />
        </div>
      )}
      {image?.caption ? (
        <figcaption className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/80 px-3 py-2 text-xs font-bold text-pet-muted backdrop-blur">
          {image.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
