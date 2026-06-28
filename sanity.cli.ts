import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset
  },
  typegen: {
    enabled: true,
    path: "./{app,components,config,lib,sanity}/**/*.{ts,tsx}",
    schema: "./schema.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true
  }
});
