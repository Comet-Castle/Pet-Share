import { ImageResponse } from "next/og";
import { buildPetOgCardData, OpenGraphCard } from "@/lib/content/open-graph-card";
import { loadPetBySlug } from "@/sanity/lib/loaders";

export const runtime = "nodejs";

type RouteContext = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const pet = await loadPetBySlug(slug).catch(() => null);

  return new ImageResponse(<OpenGraphCard data={buildPetOgCardData(pet)} />, {
    width: 1200,
    height: 630,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
