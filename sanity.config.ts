import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { resolve } from "./sanity/presentation/resolve";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const mediaLibraryId = process.env.SANITY_STUDIO_MEDIA_LIBRARY_ID;
const previewAllowOrigins = Array.from(
  new Set([
    previewOrigin,
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ])
);

export default defineConfig({
  name: "default",
  title: "Pet Share",
  basePath: "/studio",
  projectId,
  dataset,
  mediaLibrary: {
    enabled: true,
    ...(mediaLibraryId ? { libraryId: mediaLibraryId } : {})
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      allowOrigins: previewAllowOrigins,
      resolve,
      previewUrl: {
        initial: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable"
        }
      }
    }),
    visionTool()
  ],
  schema: {
    types: schemaTypes
  }
});
