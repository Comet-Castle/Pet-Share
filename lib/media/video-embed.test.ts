import { describe, expect, it } from "vitest";
import { parseVimeoId, parseYouTubeId, resolveVideoEmbed } from "./video-embed";

describe("parseYouTubeId", () => {
  it("parses watch, short, embed, and shorts URLs", () => {
    expect(parseYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for non-YouTube or malformed URLs", () => {
    expect(parseYouTubeId("https://vimeo.com/12345")).toBeNull();
    expect(parseYouTubeId("not a url")).toBeNull();
    expect(parseYouTubeId("https://www.youtube.com/watch?v=short")).toBeNull();
  });
});

describe("parseVimeoId", () => {
  it("parses standard and player URLs", () => {
    expect(parseVimeoId("https://vimeo.com/123456789")).toBe("123456789");
    expect(parseVimeoId("https://player.vimeo.com/video/123456789")).toBe("123456789");
  });

  it("returns null for non-Vimeo or malformed URLs", () => {
    expect(parseVimeoId("https://youtu.be/dQw4w9WgXcQ")).toBeNull();
    expect(parseVimeoId("https://vimeo.com/not-numeric")).toBeNull();
    expect(parseVimeoId("nope")).toBeNull();
  });
});

describe("resolveVideoEmbed", () => {
  it("builds a privacy-friendly YouTube embed", () => {
    expect(resolveVideoEmbed("youtube", "https://youtu.be/dQw4w9WgXcQ")).toEqual({
      kind: "iframe",
      src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"
    });
  });

  it("builds a Vimeo player embed", () => {
    expect(resolveVideoEmbed("vimeo", "https://vimeo.com/123456789")).toEqual({
      kind: "iframe",
      src: "https://player.vimeo.com/video/123456789"
    });
  });

  it("treats local assets as native files", () => {
    expect(resolveVideoEmbed("localAsset", "https://cdn.example.com/pet.mp4")).toEqual({
      kind: "file",
      src: "https://cdn.example.com/pet.mp4"
    });
  });

  it("falls back to a link for other providers or unparseable embed URLs", () => {
    expect(resolveVideoEmbed("other", "https://example.com/watch")).toEqual({
      kind: "link",
      src: "https://example.com/watch"
    });
    expect(resolveVideoEmbed("youtube", "https://example.com/nope")).toEqual({
      kind: "link",
      src: "https://example.com/nope"
    });
  });
});
