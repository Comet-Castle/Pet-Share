import type { PresentationPluginOptions } from "sanity/presentation";
import { defineDocuments, defineLocations } from "sanity/presentation";

type SlugValue = Readonly<{
  current?: string | null;
}>;

function previewPathForDocument(type: "page" | "pet" | "owner", id: string | null | undefined) {
  return id ? `/preview/${type}/${encodeURIComponent(id)}` : "/";
}

function slugOrPreviewPath(
  slug: SlugValue | string | null | undefined,
  publicPrefix: string,
  previewType: "page" | "pet" | "owner",
  id: string | null | undefined
) {
  const currentSlug = typeof slug === "string" ? slug : slug?.current;

  return currentSlug ? `${publicPrefix}${currentSlug}` : previewPathForDocument(previewType, id);
}

export const mainDocuments = defineDocuments([
  {
    route: "/",
    filter: `_id == "homePage"`
  },
  {
    route: "/pets",
    filter: `_id == "petIndexPage"`
  },
  {
    route: "/preview/home",
    filter: `_id == "homePage"`
  },
  {
    route: "/preview/pets",
    filter: `_id == "petIndexPage"`
  },
  {
    route: "/preview/system/:pageType",
    filter: `_type == "systemPage" && pageType == $pageType`,
    params: ({ params }) => ({ pageType: params.pageType })
  },
  {
    route: "/preview/page/:documentId",
    filter: `_type == "marketingPage" && _id == $documentId`,
    params: ({ params }) => ({ documentId: params.documentId })
  },
  {
    route: "/preview/pet/:documentId",
    filter: `_type == "pet" && _id == $documentId`,
    params: ({ params }) => ({ documentId: params.documentId })
  },
  {
    route: "/preview/owner/:documentId",
    filter: `_type == "owner" && _id == $documentId`,
    params: ({ params }) => ({ documentId: params.documentId })
  },
  {
    route: "/pets/:slug",
    filter: `_type == "pet" && slug.current == $slug`,
    params: ({ params }) => ({ slug: params.slug })
  },
  {
    route: "/owners/:slug",
    filter: `_type == "owner" && slug.current == $slug`,
    params: ({ params }) => ({ slug: params.slug })
  },
  {
    route: "/:slug",
    filter: `_type == "marketingPage" && slug.current == $slug`,
    params: ({ params }) => ({ slug: params.slug })
  }
]);

export const locations = {
  homePage: defineLocations({
    locations: [{ title: "Home page", href: "/" }]
  }),
  petIndexPage: defineLocations({
    locations: [{ title: "Pet index", href: "/pets" }]
  }),
  systemPage: defineLocations({
    select: {
      title: "title",
      pageType: "pageType"
    },
    resolve: (value) => ({
      locations: [
        {
          title: value?.title || "System page",
          href: value?.pageType ? `/preview/system/${value.pageType}` : "/preview/system/genericError"
        }
      ]
    })
  }),
  marketingPage: defineLocations({
    select: {
      id: "_id",
      title: "title",
      slug: "slug"
    },
    resolve: (value) => ({
      locations: [
        {
          title: value?.title || "Standard page",
          href: slugOrPreviewPath(value?.slug, "/", "page", value?.id)
        }
      ]
    })
  }),
  pet: defineLocations({
    select: {
      id: "_id",
      title: "name",
      slug: "slug"
    },
    resolve: (value) => ({
      locations: [
        {
          title: value?.title || "Pet listing",
          href: slugOrPreviewPath(value?.slug, "/pets/", "pet", value?.id)
        }
      ]
    })
  }),
  owner: defineLocations({
    select: {
      id: "_id",
      title: "name",
      slug: "slug"
    },
    resolve: (value) => ({
      locations: [
        {
          title: value?.title || "Owner profile",
          href: slugOrPreviewPath(value?.slug, "/owners/", "owner", value?.id)
        }
      ]
    })
  })
};

/**
 * Resolves both URL-to-document and document-to-URL mappings for Presentation.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments,
  locations
};
