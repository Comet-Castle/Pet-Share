"use client";

import Image from "next/image";
import type { MouseEvent, PointerEvent, TouchEvent } from "react";
import { useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

type PetGalleryImage = Readonly<{
  _key?: string | null;
  image?: {
    asset?: {
      url?: string | null;
    } | null;
  } | null;
  alt?: string | null;
}>;

type PetImageGalleryProps = Readonly<{
  images: PetGalleryImage[];
  petName: string;
}>;

const swipeThreshold = 44;
const verticalTolerance = 32;

function imageUrl(image: PetGalleryImage) {
  return image.image?.asset?.url ?? null;
}

/**
 * Renders the pet detail gallery with a square carousel image and one-line position controls.
 */
export function PetImageGallery({ images, petName }: PetImageGalleryProps) {
  const validImages = images.filter((image) => imageUrl(image));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDraggingThumbnails, setIsDraggingThumbnails] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const thumbnailDrag = useRef<{ pointerId: number; startX: number; scrollLeft: number; distance: number } | null>(null);
  const suppressThumbnailClick = useRef(false);
  const thumbnailRailRef = useRef<HTMLDivElement>(null);
  const activeImage = validImages[activeIndex];
  const activeUrl = activeImage ? imageUrl(activeImage) : null;
  const hasMultipleImages = validImages.length > 1;

  function showPreviousImage() {
    setActiveIndex((current) => (current === 0 ? validImages.length - 1 : current - 1));
  }

  function showNextImage() {
    setActiveIndex((current) => (current + 1) % validImages.length);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (!hasMultipleImages) return;

    const touch = event.touches[0];
    if (!touch) return;

    swipeStart.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;

    swipeStart.current = null;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (Math.abs(deltaY) > verticalTolerance || Math.abs(deltaX) < swipeThreshold) return;

    if (deltaX > 0) {
      showPreviousImage();
    } else {
      showNextImage();
    }
  }

  function handleTouchCancel() {
    swipeStart.current = null;
  }

  function handleThumbnailPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || !thumbnailRailRef.current) return;

    thumbnailDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: thumbnailRailRef.current.scrollLeft,
      distance: 0
    };
    setIsDraggingThumbnails(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleThumbnailPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = thumbnailDrag.current;
    const rail = thumbnailRailRef.current;
    if (!drag || !rail) return;

    const deltaX = event.clientX - drag.startX;
    drag.distance = Math.max(drag.distance, Math.abs(deltaX));
    rail.scrollLeft = drag.scrollLeft - deltaX;
  }

  function finishThumbnailDrag(event: PointerEvent<HTMLDivElement>) {
    if (!thumbnailDrag.current) return;

    suppressThumbnailClick.current = thumbnailDrag.current.distance > 6;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    thumbnailDrag.current = null;
    setIsDraggingThumbnails(false);
  }

  function handleThumbnailClick(index: number, event: MouseEvent<HTMLButtonElement>) {
    if (suppressThumbnailClick.current) {
      event.preventDefault();
      suppressThumbnailClick.current = false;
      return;
    }

    setActiveIndex(index);
  }

  return (
    <section className="min-w-0 max-w-full" aria-label={`${petName} photos`}>
      <div
        className="relative aspect-square w-full max-w-full overflow-hidden rounded-[2rem] bg-pet-mint/25 shadow-soft"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        style={{ touchAction: "pan-y" }}
      >
        {validImages.length ? (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-pet-ink shadow-sm backdrop-blur">
            <Camera aria-hidden="true" size={13} />
            {activeIndex + 1} of {validImages.length}
          </span>
        ) : null}

        {activeUrl ? (
          <Image
            key={activeUrl}
            src={activeUrl}
            alt={activeImage?.alt ?? `${petName} photo ${activeIndex + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover motion-safe:animate-[pet-gallery-image-enter_120ms_ease-out]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-pet-muted">
            <PawPrint aria-hidden="true" size={64} />
          </div>
        )}

        {hasMultipleImages ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-soft backdrop-blur transition hover:-rotate-6 hover:bg-white focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              aria-label="Show previous pet photo"
            >
              <ChevronLeft aria-hidden="true" size={22} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-soft backdrop-blur transition hover:rotate-6 hover:bg-white focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2"
              aria-label="Show next pet photo"
            >
              <ChevronRight aria-hidden="true" size={22} />
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div
          className="mt-3 flex h-4 items-center justify-center gap-2"
          aria-label={`${activeIndex + 1} of ${validImages.length}`}
        >
          {validImages.map((image, index) => (
            <button
              key={image._key ?? imageUrl(image) ?? `${petName}-indicator-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={joinClassNames(
                "size-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2",
                index === activeIndex ? "w-6 bg-pet-ink" : "bg-pet-muted/35 hover:bg-pet-muted"
              )}
              aria-label={`Show pet photo ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      ) : null}

      {validImages.length ? (
        <div
          ref={thumbnailRailRef}
          className={joinClassNames(
            "mt-2 flex max-w-full gap-3 overflow-x-auto overscroll-x-contain scroll-smooth p-1 pb-3 [scrollbar-width:thin] sm:mt-3",
            isDraggingThumbnails ? "cursor-grabbing select-none" : "cursor-grab"
          )}
          aria-label={`${petName} individual photos`}
          onPointerDown={handleThumbnailPointerDown}
          onPointerMove={handleThumbnailPointerMove}
          onPointerUp={finishThumbnailDrag}
          onPointerCancel={finishThumbnailDrag}
          onPointerLeave={finishThumbnailDrag}
          style={{ touchAction: "pan-x" }}
        >
          {validImages.map((image, index) => {
            const url = imageUrl(image);

            return (
              <button
                key={image._key ?? url ?? `${petName}-thumbnail-${index}`}
                type="button"
                onClick={(event) => handleThumbnailClick(index, event)}
                className={joinClassNames(
                  "relative size-24 shrink-0 overflow-hidden rounded-2xl bg-pet-mint/25 transition focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2 sm:size-28",
                  index === activeIndex && "ring-2 ring-pet-ink"
                )}
                aria-label={`Show ${petName} photo ${index + 1}`}
              >
                {url ? (
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
