import { ImageResponse } from "next/og";
import { buildOwnerOgCardData, OpenGraphCard } from "@/lib/content/open-graph-card";
import { loadOwnerBySlug } from "@/sanity/lib/loaders";

export const runtime = "nodejs";

type RouteContext = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const owner = await loadOwnerBySlug(slug).catch(() => null);

  return new ImageResponse(<OpenGraphCard data={buildOwnerOgCardData(owner)} />, {
    width: 1200,
    height: 630,
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
