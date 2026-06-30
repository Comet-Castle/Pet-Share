import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const colorEnabled = process.env.NO_COLOR === undefined && process.stdout.isTTY !== false;

export const color = {
  heading: (value) => colorize(value, "36;1"),
  success: (value) => colorize(value, "32"),
  warning: (value) => colorize(value, "33"),
  error: (value) => colorize(value, "31;1"),
  muted: (value) => colorize(value, "90"),
  path: (value) => colorize(value, "36")
};

const requiredSeedVariables = [
  {
    name: "NEXT_PUBLIC_SANITY_PROJECT_ID",
    purpose: "Sanity project ID used by Studio, queries, and seed writes.",
    instructions: [
      "Open https://www.sanity.io/manage and select the Pet Share project.",
      "Copy the project ID from the project dashboard.",
      "Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local."
    ]
  },
  {
    name: "NEXT_PUBLIC_SANITY_DATASET",
    purpose: "Sanity dataset name that receives seed content.",
    instructions: [
      "Open the project in https://www.sanity.io/manage.",
      "Use the dataset name from the Datasets section. For this project the expected default is production.",
      "Set NEXT_PUBLIC_SANITY_DATASET in .env.local."
    ]
  },
  {
    name: "NEXT_PUBLIC_SANITY_API_VERSION",
    purpose: "Pinned Sanity API version date.",
    instructions: [
      "Use the date already documented in .env.example unless we intentionally upgrade it.",
      "Set NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19 in .env.local."
    ]
  }
];

const conditionalSeedVariables = [
  {
    name: "SANITY_API_WRITE_TOKEN",
    purpose: "Server-only Sanity token required when the wizard writes seed content or uploads approved media to Sanity.",
    instructions: [
      "Open https://www.sanity.io/manage and select the Pet Share project.",
      "Go to API > Tokens.",
      "Create a token with write access for local seed scripts.",
      "Set SANITY_API_WRITE_TOKEN in .env.local. Do not commit it."
    ]
  }
];

const optionalSeedVariables = [
  {
    name: "GEMINI_API_KEY",
    purpose: "Required only for the human-confirmed media generation step. Normal seed preview and Sanity writes do not call Gemini.",
    instructions: [
      "Create a Gemini API key through Google AI Studio only when you are ready to run provider-backed media generation.",
      "Set GEMINI_API_KEY in .env.local for local human-run generation.",
      "Do not add this key to Vercel unless a later workflow explicitly needs it."
    ]
  }
];

export function loadLocalEnv(rootDir) {
  for (const fileName of [".env.local", ".env"]) {
    const envPath = join(rootDir, fileName);
    if (!existsSync(envPath)) continue;

    for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

export function validateSeedEnvironment({ requireWriteToken = false, includeOptional = false } = {}) {
  const missingRequired = requiredSeedVariables.filter((variable) => !hasValue(variable.name));
  const missingConditional = conditionalSeedVariables.filter((variable) => !hasValue(variable.name));
  const missingOptional = includeOptional ? optionalSeedVariables.filter((variable) => !hasValue(variable.name)) : [];
  const hasBlockingMissing = missingRequired.length > 0 || (requireWriteToken && missingConditional.length > 0);

  return {
    ok: !hasBlockingMissing,
    missingRequired,
    missingConditional,
    missingOptional
  };
}

export function validateMediaGenerationEnvironment() {
  const missingGeminiKey = optionalSeedVariables.filter((variable) => variable.name === "GEMINI_API_KEY" && !hasValue(variable.name));

  return {
    ok: missingGeminiKey.length === 0,
    missingRequired: [],
    missingConditional: [],
    missingOptional: missingGeminiKey
  };
}

export function printSeedEnvironmentReport(result, { requireWriteToken = false } = {}) {
  console.log(`\n${color.heading("Environment validation:")}`);

  if (result.missingRequired.length === 0) {
    console.log(`- Required Sanity config: ${color.success("ready")}`);
  } else {
    console.log(`- Required Sanity config: ${color.error("missing values")}`);
    printVariableInstructions(result.missingRequired);
  }

  if (result.missingConditional.length === 0) {
    console.log(`- Sanity write token: ${color.success("ready")}`);
  } else {
    const label = requireWriteToken ? "missing required value" : "missing; final Sanity write will be unavailable until set";
    console.log(`- Sanity write token: ${requireWriteToken ? color.error(label) : color.warning(label)}`);
    printVariableInstructions(result.missingConditional);
  }

  if (result.missingOptional.length > 0) {
    console.log(`- Optional future media generation values: ${color.warning("not set")}`);
    printVariableInstructions(result.missingOptional);
  }
}

export function printBlockingSeedEnvironmentError(result) {
  console.log(`\n${color.error("Seed environment validation failed.")}`);
  printSeedEnvironmentReport(result, { requireWriteToken: result.missingConditional.length > 0 });
  console.log("\nCopy .env.example to .env.local if you have not already, then fill the missing values.");
}

function hasValue(name) {
  return Boolean(process.env[name]?.trim());
}

function printVariableInstructions(variables) {
  for (const variable of variables) {
    console.log(`\n  ${color.warning(variable.name)}`);
    console.log(`  ${color.muted("Purpose:")} ${variable.purpose}`);
    for (const instruction of variable.instructions) {
      console.log(`  - ${instruction}`);
    }
  }
}

function colorize(value, code) {
  if (!colorEnabled) return value;
  return `\u001b[${code}m${value}\u001b[0m`;
}
