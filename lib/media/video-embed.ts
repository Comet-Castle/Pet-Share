/**
 * Helpers for turning a Sanity `videoEmbed` value into something the frontend can
 * render. Providers come from the `videoEmbed` schema: `youtube`, `vimeo`,
 * `localAsset`, and `other`.
 */

export type VideoProvider = "youtube" | "vimeo" | "localAsset" | "other";

/**
 * How the frontend should render a given video value:
 * - `iframe`: an embeddable player URL (YouTube/Vimeo) is available.
 * - `file`: a direct media file that a native `<video>` element can play.
 * - `link`: no safe inline render, fall back to an external link.
 */
export type VideoEmbedKind = "iframe" | "file" | "link";

export type ResolvedVideoEmbed = Readonly<{
  kind: VideoEmbedKind;
  /** URL to feed the iframe/video element (embed URL for iframes, raw URL otherwise). */
  src: string;
}>;

const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;

/**
 * Extracts a YouTube video id from the common `watch`, `youtu.be`, `embed`, and
 * `shorts` URL shapes. Returns null when no 11-character id can be found.
 */
export function parseYouTubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0];
    return YOUTUBE_ID_PATTERN.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
    const watchId = parsed.searchParams.get("v");
    if (watchId && YOUTUBE_ID_PATTERN.test(watchId)) {
      return watchId;
    }

    // `/embed/<id>`, `/shorts/<id>`, `/v/<id>`
    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length >= 2 && ["embed", "shorts", "v"].includes(segments[0])) {
      return YOUTUBE_ID_PATTERN.test(segments[1]) ? segments[1] : null;
    }
  }

  return null;
}

/**
 * Extracts the numeric Vimeo id from a standard `vimeo.com/<id>` or
 * `player.vimeo.com/video/<id>` URL. Returns null when no id can be found.
 */
export function parseVimeoId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");
  if (host !== "vimeo.com" && host !== "player.vimeo.com") {
    return null;
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  // player.vimeo.com/video/<id> or vimeo.com/<id>
  const candidate = segments[0] === "video" ? segments[1] : segments[0];
  return candidate && /^\d+$/.test(candidate) ? candidate : null;
}

/**
 * Resolves a video value into a renderable form. Prefers a privacy-friendly
 * embed URL for YouTube/Vimeo, a native file for `localAsset`, and an external
 * link fallback when nothing else is safe to render inline.
 */
export function resolveVideoEmbed(provider: VideoProvider, url: string): ResolvedVideoEmbed {
  if (provider === "youtube") {
    const id = parseYouTubeId(url);
    if (id) {
      return { kind: "iframe", src: `https://www.youtube-nocookie.com/embed/${id}` };
    }
  }

  if (provider === "vimeo") {
    const id = parseVimeoId(url);
    if (id) {
      return { kind: "iframe", src: `https://player.vimeo.com/video/${id}` };
    }
  }

  if (provider === "localAsset") {
    return { kind: "file", src: url };
  }

  return { kind: "link", src: url };
}
