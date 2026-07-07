"use client";

import { ChevronLeft, ChevronRight, Info, PawPrint } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CarouselDots } from "@/components/ui/carousel-dots";
import { SanityImage } from "@/components/ui/sanity-image";
import type { SanityImageValue } from "@/components/ui/sanity-image";
import { joinClassNames } from "@/lib/utils/class-names";

export type HomeHeroSlide = Readonly<{
  _key?: string | null;
  headline: string;
  body?: string | null;
  image?: SanityImageValue;
  cta?: {
    label: string;
    link?: {
      path?: string | null;
      url?: string | null;
    } | null;
  } | null;
}>;

type HomeHeroCarouselProps = Readonly<{
  slides: HomeHeroSlide[];
}>;

function getWrappedIndex(index: number, total: number) {
  return (index + total) % total;
}

function getCtaHref(slide: HomeHeroSlide) {
  return slide.cta?.link?.path ?? slide.cta?.link?.url ?? "/pets";
}

/**
 * Renders the homepage hero as a controlled carousel with buttons, dots, and swipe navigation.
 */
export function HomeHeroCarousel({ slides }: HomeHeroCarouselProps) {
  const safeSlides = useMemo(() => slides.filter((slide) => slide.headline), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activeSlide = safeSlides[activeIndex] ?? safeSlides[0];
  const hasMultipleSlides = safeSlides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => getWrappedIndex(current + 1, safeSlides.length));
    }, 7000);

    return () => window.clearInterval(interval);
  }, [hasMultipleSlides, isPaused, safeSlides.length]);

  if (!activeSlide) {
    return null;
  }

  function goToSlide(index: number) {
    setActiveIndex(getWrappedIndex(index, safeSlides.length));
    setIsPaused(true);
  }

  function handleTouchEnd(touchEndX: number) {
    if (touchStartX === null) {
      return;
    }

    const distance = touchStartX - touchEndX;
    const minimumSwipeDistance = 48;

    if (Math.abs(distance) >= minimumSwipeDistance) {
      goToSlide(activeIndex + (distance > 0 ? 1 : -1));
    }

    setTouchStartX(null);
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] min-w-0 px-5 pb-12 pt-0 sm:px-8 lg:px-10">
      {/* The banner spans the full content width. Once the viewport is wide enough
          to clear the banner's 1440px cap plus room for a 44px control on each side
          (~1560px), the arrows sit in the outer gutters *outside* the banner. Below
          that they collapse onto the image so they never overrun the page edge.
          `relative` (not overflow-hidden) so the outside arrows are not clipped —
          the inner media wrapper keeps its own overflow-hidden for the image. */}
      <div className="relative">
        {hasMultipleSlides ? (
          <div className="absolute left-0 top-1/2 z-30 hidden -translate-x-[calc(100%+0.75rem)] -translate-y-1/2 min-[1560px]:block">
            <HeroArrow direction="prev" onClick={() => goToSlide(activeIndex - 1)} />
          </div>
        ) : null}
        {hasMultipleSlides ? (
          <div className="absolute right-0 top-1/2 z-30 hidden translate-x-[calc(100%+0.75rem)] -translate-y-1/2 min-[1560px]:block">
            <HeroArrow direction="next" onClick={() => goToSlide(activeIndex + 1)} />
          </div>
        ) : null}

        <div
          className="relative isolate min-w-0 overflow-hidden rounded-[2rem] bg-pet-cream shadow-soft"
          aria-roledescription="carousel"
          aria-label="Pet Share highlights"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
        >
          {/* Stacked background images cross-fade between slides. All slide images
              stay mounted absolutely; only the active one is opaque. Gated behind
              motion-reduce so reduced-motion users get an instant swap. */}
          <div className="absolute inset-0 z-0">
            {safeSlides.map((slide, index) => (
              <div
                key={slide._key ?? `hero-bg-${index}`}
                aria-hidden={index !== activeIndex}
                className={joinClassNames(
                  "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
              >
                <SanityImage
                  image={slide.image ?? null}
                  sizes="(min-width: 1024px) 1440px, 100vw"
                  priority={index === 0}
                  className="size-full bg-pet-mint/20"
                  imageClassName="object-[62%_50%] sm:object-[68%_50%]"
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/92 via-white/70 to-white/18 sm:bg-gradient-to-r sm:from-white/96 sm:via-white/74 sm:to-white/0" />
          <article
            key={activeSlide._key ?? activeIndex}
            className="relative z-20 grid min-h-[520px] min-w-0 animate-pet-hero-content-swap items-center gap-8 p-7 text-center sm:min-h-[560px] sm:p-14 sm:text-left lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:p-16"
          >
            <div className="mx-auto min-w-0 max-w-5xl sm:mx-0">
              <h1 className="animate-pet-hero-title text-wrap font-display text-4xl font-bold leading-[1.05] text-pet-ink sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
                {activeSlide.headline}
              </h1>
              {activeSlide.body ? (
                <p className="mx-auto mt-6 max-w-3xl animate-pet-hero-body text-lg leading-8 text-pet-muted sm:mx-0">
                  {activeSlide.body}
                </p>
              ) : null}
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <span className="animate-pet-hero-cta-primary">
                  <Button href={getCtaHref(activeSlide)} icon={<PawPrint aria-hidden="true" size={20} />}>
                    {activeSlide.cta?.label ?? "Find a temporary pet"}
                  </Button>
                </span>
                <span className="animate-pet-hero-cta-secondary">
                  <Button href="/process" variant="secondary" icon={<Info aria-hidden="true" size={20} />}>
                    Lend your pet
                  </Button>
                </span>
              </div>
            </div>

            <div aria-hidden="true" />
          </article>

          {/* Below the outside-arrow breakpoint the arrows live on the media frame. */}
          {hasMultipleSlides ? (
            <>
              <div className="absolute left-3 top-1/2 z-30 -translate-y-1/2 min-[1560px]:hidden">
                <HeroArrow direction="prev" onClick={() => goToSlide(activeIndex - 1)} />
              </div>
              <div className="absolute right-3 top-1/2 z-30 -translate-y-1/2 min-[1560px]:hidden">
                <HeroArrow direction="next" onClick={() => goToSlide(activeIndex + 1)} />
              </div>
              <CarouselDots
                count={safeSlides.length}
                activeIndex={activeIndex}
                onSelect={goToSlide}
                variant="pill"
                label="Hero slide navigation"
                dotLabel={(index) => `Show hero slide ${index + 1}`}
                className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2"
              />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

type HeroArrowProps = Readonly<{
  direction: "prev" | "next";
  onClick: () => void;
}>;

/**
 * Orange prev/next control for the hero carousel. Visible on all viewports;
 * placed in side gutters on lg+ and inside the media frame below lg.
 */
function HeroArrow({ direction, onClick }: HeroArrowProps) {
  const isPrev = direction === "prev";

  return (
    <button
      type="button"
      onClick={onClick}
      className={joinClassNames(
        "inline-flex size-11 items-center justify-center rounded-full bg-pet-coral text-white shadow-soft transition hover:bg-[#f37f61] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2",
        isPrev ? "hover:-rotate-6" : "hover:rotate-6"
      )}
      aria-label={isPrev ? "Show previous hero slide" : "Show next hero slide"}
    >
      {isPrev ? <ChevronLeft aria-hidden="true" size={24} /> : <ChevronRight aria-hidden="true" size={24} />}
    </button>
  );
}
