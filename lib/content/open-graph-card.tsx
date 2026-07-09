/* eslint-disable @next/next/no-img-element -- ImageResponse/Satori renders remote and public images via raw <img>, not next/image. */
import type { ReactElement } from "react";
import { publicEnv } from "@/config/env";

const MAX_ATTRIBUTES = 3;
const LOGO_PATH = "/email/logo-badge.png";

type SanityImageLike = Readonly<{
  image?: {
    asset?: {
      url?: string | null;
    } | null;
  } | null;
}> | null | undefined;

type PetOgInput = Readonly<{
  name?: string | null;
  breed?: string | null;
  listingHeadline?: string | null;
  listingSummary?: string | null;
  petType?: {
    name?: string | null;
  } | null;
  owner?: {
    location?: string | null;
  } | null;
  cardMedia?: {
    image?: SanityImageLike;
  } | null;
  heroImages?: SanityImageLike[] | null;
}>;

type OwnerOgInput = Readonly<{
  name?: string | null;
  tagline?: string | null;
  location?: string | null;
  memberSince?: string | null;
  portrait?: SanityImageLike;
}>;

export type OpenGraphCardData = Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  attributes: string[];
  imageUrl?: string;
}>;

function compact(values: Array<string | null | undefined>): string[] {
  return values.map((value) => value?.trim()).filter((value): value is string => Boolean(value));
}

function imageUrl(image: SanityImageLike): string | undefined {
  return image?.image?.asset?.url ?? undefined;
}

function logoUrl(): string {
  return new URL(LOGO_PATH, publicEnv.siteUrl).toString();
}

/** Builds the pure data contract used to render pet detail Open Graph cards. */
export function buildPetOgCardData(pet: PetOgInput | null | undefined): OpenGraphCardData {
  const heroImageUrl = pet?.heroImages?.map(imageUrl).find(Boolean);
  const cardImageUrl = imageUrl(pet?.cardMedia?.image);

  return {
    eyebrow: "Pet Share listing",
    title: pet?.name?.trim() || "Pet Share pet",
    description:
      pet?.listingHeadline?.trim() ||
      pet?.listingSummary?.trim() ||
      "Meet a temporary pet with a very specific personality and extremely negotiable availability.",
    attributes: compact([pet?.petType?.name, pet?.breed, pet?.owner?.location]).slice(0, MAX_ATTRIBUTES),
    imageUrl: heroImageUrl ?? cardImageUrl
  };
}

/** Builds the pure data contract used to render owner profile Open Graph cards. */
export function buildOwnerOgCardData(owner: OwnerOgInput | null | undefined): OpenGraphCardData {
  return {
    eyebrow: "Pet Share owner",
    title: owner?.name?.trim() || "Pet Share owner",
    description:
      owner?.tagline?.trim() ||
      "Meet a Pet Share owner looking for a little temporary relief and a lot of oddly specific trust.",
    attributes: compact([owner?.location, owner?.memberSince ? `Member since ${owner.memberSince}` : null]).slice(
      0,
      MAX_ATTRIBUTES
    ),
    imageUrl: imageUrl(owner?.portrait)
  };
}

/** Shared 1200×630 card template for dynamic Open Graph image routes. */
export function OpenGraphCard({ data }: { data: OpenGraphCardData }): ReactElement {
  const fallbackImage = new URL("/og-default.png", publicEnv.siteUrl).toString();
  const backgroundImage = data.imageUrl ?? fallbackImage;

  return (
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        background: "#fff7ed",
        color: "#2b2118",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div style={{ width: "520px", height: "630px", display: "flex", overflow: "hidden" }}>
        <img
          src={backgroundImage}
          alt=""
          width={520}
          height={630}
          style={{ width: "520px", height: "630px", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          width: "680px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <img src={logoUrl()} alt="" width={64} height={64} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {data.eyebrow}
            </div>
            <div style={{ fontSize: "24px", color: "#7c5f46" }}>Pet Share</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ fontSize: "74px", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.05em" }}>{data.title}</div>
          <div style={{ fontSize: "34px", lineHeight: 1.22, color: "#5f4a37" }}>{data.description}</div>
        </div>

        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {data.attributes.length > 0 ? (
            data.attributes.map((attribute) => (
              <div
                key={attribute}
                style={{
                  display: "flex",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  background: "#ffffffcc",
                  color: "#3f3023",
                  fontSize: "23px",
                  fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(63, 48, 35, 0.12)"
                }}
              >
                {attribute}
              </div>
            ))
          ) : (
            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: "999px",
                background: "#ffffffcc",
                color: "#3f3023",
                fontSize: "23px",
                fontWeight: 700
              }}
            >
              Temporary pet relief
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
