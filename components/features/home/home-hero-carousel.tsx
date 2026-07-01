"use client";

import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
      <div
        className="relative isolate overflow-hidden rounded-[2rem] bg-pet-cream shadow-soft"
        aria-roledescription="carousel"
        aria-label="Pet Share highlights"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
      >
        <div className="absolute inset-0 z-0">
          <SanityImage
            image={activeSlide.image ?? null}
            sizes="(min-width: 1024px) 1440px, 100vw"
            priority={activeIndex === 0}
            className="size-full bg-pet-mint/20"
            imageClassName="object-[62%_50%] sm:object-[68%_50%]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-white/92 via-white/70 to-white/18 sm:bg-gradient-to-r sm:from-white/96 sm:via-white/74 sm:to-white/0" />
        <article
          key={activeSlide._key ?? activeIndex}
          className="relative z-20 grid min-h-[520px] min-w-0 animate-pet-hero-slide items-center gap-8 p-7 sm:min-h-[560px] sm:p-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:p-16"
        >
          <div className="min-w-0 max-w-5xl">
            <h1 className="text-wrap font-display text-4xl font-bold leading-[1.05] text-pet-ink sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              {activeSlide.headline}
            </h1>
            {activeSlide.body ? <p className="mt-6 max-w-3xl text-lg leading-8 text-pet-muted">{activeSlide.body}</p> : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={getCtaHref(activeSlide)} icon={<PawPrint aria-hidden="true" size={20} />}>
                {activeSlide.cta?.label ?? "Find a temporary pet"}
              </Button>
              <Button href="/process" variant="secondary">
                Lend your pet
              </Button>
            </div>
          </div>

          <div aria-hidden="true" />
        </article>

        {hasMultipleSlides ? (
          <>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              className="absolute left-3 top-1/2 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-pet-ink shadow-soft backdrop-blur transition hover:-rotate-6 hover:bg-white focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2 md:inline-flex"
              aria-label="Show previous hero slide"
            >
              <ChevronLeft aria-hidden="true" size={24} />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              className="absolute right-3 top-1/2 z-30 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-pet-ink shadow-soft backdrop-blur transition hover:rotate-6 hover:bg-white focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2 md:inline-flex"
              aria-label="Show next hero slide"
            >
              <ChevronRight aria-hidden="true" size={24} />
            </button>
            <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-full bg-white/75 px-3 py-2 shadow-soft backdrop-blur" aria-label="Hero slide navigation">
              {safeSlides.map((slide, index) => (
                <button
                  key={slide._key ?? `hero-dot-${index}`}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={joinClassNames(
                    "size-3 rounded-full transition focus:outline-none focus:ring-2 focus:ring-pet-coral focus:ring-offset-2",
                    index === activeIndex ? "bg-pet-coral" : "bg-pet-ink/25 hover:bg-pet-ink/45"
                  )}
                  aria-label={`Show hero slide ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
