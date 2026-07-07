"use client";

import Image from "next/image";
import type { PointerEvent, TouchEvent } from "react";
import { useRef, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { CarouselDots } from "@/components/ui/carousel-dots";
import { joinClassNames } from "@/lib/utils/class-names";

type PetGalleryImage = Readonly<{
  _key?: string | null;
  image?: {
    asset?: {
      url?: string | null;
      metadata?: {
        lqip?: string | null;
      } | null;
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
// Drag distance (px) separating a plain thumbnail tap from a rail drag. Below this
// the click fires and swaps the image; above it we treat the gesture as a drag.
const dragThreshold = 6;

function imageUrl(image: PetGalleryImage) {
  return image.image?.asset?.url ?? null;
}

function imageBlur(image: PetGalleryImage) {
  return image.image?.asset?.metadata?.lqip ?? undefined;
}

/**
 * Renders the pet detail gallery with a square carousel image and one-line position controls.
 */
export function PetImageGallery({ images, petName }: PetImageGalleryProps) {
  const validImages = images.filter((image) => imageUrl(image));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDraggingThumbnails, setIsDraggingThumbnails] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const thumbnailDrag = useRef<{ pointerId: number; startX: number; scrollLeft: number; distance: number; capturing: boolean } | null>(null);
  const thumbnailRailRef = useRef<HTMLDivElement>(null);
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

    // Do NOT capture the pointer on down: capturing here retargets the synthetic
    // click away from the thumbnail button, so a plain tap never fires its click
    // and the main image never swaps. Capture is deferred to pointermove once the
    // drag exceeds `dragThreshold`, so taps click normally.
    thumbnailDrag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: thumbnailRailRef.current.scrollLeft,
      distance: 0,
      capturing: false
    };
  }

  function handleThumbnailPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = thumbnailDrag.current;
    const rail = thumbnailRailRef.current;
    if (!drag || !rail) return;

    const deltaX = event.clientX - drag.startX;
    drag.distance = Math.max(drag.distance, Math.abs(deltaX));

    // Promote to a real drag only once movement passes the threshold. Capturing
    // now keeps the drag smooth while plain taps (which never cross the threshold)
    // still fire their click and swap the image.
    if (!drag.capturing && drag.distance > dragThreshold) {
      drag.capturing = true;
      setIsDraggingThumbnails(true);
      event.currentTarget.setPointerCapture(drag.pointerId);
    }

    if (drag.capturing) {
      rail.scrollLeft = drag.scrollLeft - deltaX;
    }
  }

  function finishThumbnailDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = thumbnailDrag.current;
    if (!drag) return;

    if (drag.capturing && event.currentTarget.hasPointerCapture(drag.pointerId)) {
      event.currentTarget.releasePointerCapture(drag.pointerId);
    }

    thumbnailDrag.current = null;
    setIsDraggingThumbnails(false);
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

        {validImages.length ? (
          // Stacked images cross-fade on swap: all stay mounted, only the active
          // one is opaque. Avoids the flash from unmounting the outgoing image.
          // The blur `lqip` placeholder shows while an un-cached image decodes.
          // Gated behind motion-reduce so reduced-motion users get an instant swap.
          validImages.map((image, index) => {
            const url = imageUrl(image);
            if (!url) return null;

            const blur = imageBlur(image);

            return (
              <Image
                key={image._key ?? url}
                src={url}
                alt={image.alt ?? `${petName} photo ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 55vw, 100vw"
                placeholder={blur ? "blur" : undefined}
                blurDataURL={blur}
                aria-hidden={index !== activeIndex}
                className={joinClassNames(
                  "object-cover transition-opacity duration-300 ease-out motion-reduce:transition-none",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
              />
            );
          })
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
              className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-soft backdrop-blur transition hover:-rotate-6 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
              aria-label="Show previous pet photo"
            >
              <ChevronLeft aria-hidden="true" size={22} />
            </button>
            <button
              type="button"
              onClick={showNextImage}
              className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-soft backdrop-blur transition hover:rotate-6 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
              aria-label="Show next pet photo"
            >
              <ChevronRight aria-hidden="true" size={22} />
            </button>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="mt-3 flex h-4 items-center justify-center">
          <CarouselDots
            count={validImages.length}
            activeIndex={activeIndex}
            onSelect={setActiveIndex}
            variant="bare"
            label={`${activeIndex + 1} of ${validImages.length}`}
            dotLabel={(index) => `Show pet photo ${index + 1}`}
          />
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
            const blur = imageBlur(image);

            return (
              <button
                key={image._key ?? url ?? `${petName}-thumbnail-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={joinClassNames(
                  "relative size-24 shrink-0 overflow-hidden rounded-2xl bg-pet-mint/25 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2 sm:size-28",
                  // Active thumbnail is branded orange to match the carousel dots.
                  index === activeIndex && "ring-2 ring-pet-coral ring-offset-2"
                )}
                aria-label={`Show ${petName} photo ${index + 1}`}
              >
                {url ? (
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="112px"
                    placeholder={blur ? "blur" : undefined}
                    blurDataURL={blur}
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
