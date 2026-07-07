"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { stegaClean } from "@sanity/client/stega";
import { resolveVideoEmbed, type VideoProvider } from "@/lib/media/video-embed";
import { joinClassNames } from "@/lib/utils/class-names";

type PetVideoValue = Readonly<{
  _key?: string | null;
  provider: string;
  url: string;
  title: string;
  description?: string | null;
  posterImage?: {
    image?: {
      asset?: {
        url?: string | null;
        metadata?: {
          lqip?: string | null;
        } | null;
      } | null;
    } | null;
    alt?: string | null;
  } | null;
}>;

type PetVideoProps = Readonly<{
  video: PetVideoValue;
  petName: string;
}>;

/**
 * Renders the pet detail video with a poster + click-to-play affordance so the
 * heavier iframe/native player is only mounted after user intent. Handles
 * YouTube/Vimeo embeds, a native `localAsset` file, and an external-link
 * fallback for anything that cannot render inline.
 */
export function PetVideo({ video, petName }: PetVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const provider = (stegaClean(video.provider) ?? "other") as VideoProvider;
  const url = stegaClean(video.url) ?? "";
  const { kind, src } = resolveVideoEmbed(provider, url);

  const posterUrl = video.posterImage?.image?.asset?.url ?? null;
  const posterLqip = video.posterImage?.image?.asset?.metadata?.lqip ?? null;
  const posterAlt = video.posterImage?.alt ?? `Video preview of ${petName}`;
  const title = video.title || `${petName} in motion`;

  // Non-embeddable providers cannot render inline safely; send viewers to the source.
  if (kind === "link") {
    return (
      <VideoShell title={title} description={video.description}>
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-[1.5rem] bg-pet-mint/25 p-6 text-center">
          <span className="inline-flex size-14 items-center justify-center rounded-full bg-white/80 text-pet-ink shadow-sm">
            <Play aria-hidden="true" size={24} />
          </span>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-pet-ink px-5 py-2.5 text-sm font-bold text-white transition hover:-rotate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
          >
            Watch {petName}
            <ExternalLink aria-hidden="true" size={16} />
          </a>
        </div>
      </VideoShell>
    );
  }

  return (
    <VideoShell title={title} description={video.description}>
      <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-pet-ink/5">
        {isPlaying ? (
          kind === "file" ? (
            <video
              src={src}
              controls
              autoPlay
              playsInline
              poster={posterUrl ?? undefined}
              className="h-full w-full bg-black object-contain"
            >
              {title}
            </video>
          ) : (
            <iframe
              src={`${src}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          )
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="group relative block h-full w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pet-coral focus-visible:ring-offset-2"
            aria-label={`Play video: ${title}`}
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={posterAlt}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                placeholder={posterLqip ? "blur" : "empty"}
                blurDataURL={posterLqip ?? undefined}
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-pet-mint/25" />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-pet-ink/15 transition group-hover:bg-pet-ink/25">
              <span
                className={joinClassNames(
                  "inline-flex size-16 items-center justify-center rounded-full bg-white/90 text-pet-ink shadow-lg",
                  "transition duration-300 motion-safe:group-hover:scale-110"
                )}
              >
                <Play aria-hidden="true" size={28} className="translate-x-0.5 fill-current" />
              </span>
            </span>
          </button>
        )}
      </div>
    </VideoShell>
  );
}

type VideoShellProps = Readonly<{
  title: string;
  description?: string | null;
  children: React.ReactNode;
}>;

function VideoShell({ title, description, children }: VideoShellProps) {
  return (
    <section id="video" className="scroll-mt-8 rounded-[2rem] bg-white/70 p-6 shadow-soft backdrop-blur sm:p-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-pet-coral/16 text-pet-coral">
          <Play aria-hidden="true" size={18} />
        </span>
        <h2 className="font-display text-3xl font-bold text-pet-ink">{title}</h2>
      </div>
      {children}
      {description ? <p className="mt-4 max-w-3xl text-sm leading-6 text-pet-muted">{description}</p> : null}
    </section>
  );
}
