import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { color, loadLocalEnv, printSeedEnvironmentReport, validateMediaGenerationEnvironment } from "./seed-env.mjs";

const rootDir = process.cwd();
const promptManifestPath = join(rootDir, "sanity", "seed", "generated", "preview", "media-prompts.json");
const args = parseArgs(process.argv.slice(2));
const supportedModes = new Set(["preview", "inline"]);

loadLocalEnv(rootDir);

class ExpectedSeedMediaError extends Error {
  constructor(message) {
    super(message);
    this.name = "ExpectedSeedMediaError";
  }
}

async function main() {
  if (!supportedModes.has(args.mode)) {
    console.log(color.error(`Unsupported media generation mode: ${args.mode}`));
    console.log(`Use ${color.path("--mode preview")} for a small sample or ${color.path("--mode inline")} for the selected prompt set.`);
    process.exitCode = 1;
    return;
  }

  if (!existsSync(promptManifestPath)) {
    console.log(color.error("Media prompt manifest is missing."));
    console.log(`Run ${color.path("pnpm seed:wizard")} and generate the data preview before media generation.`);
    process.exitCode = 1;
    return;
  }

  const prompts = flattenImagePrompts(JSON.parse(readFileSync(promptManifestPath, "utf8")));
  const selectedPrompts = selectPrompts(prompts).map((prompt, index) => ({
    ...prompt,
    key: buildPromptKey(prompt, index)
  }));

  console.log(`${color.heading("Media generation plan")}: ${color.success(String(selectedPrompts.length))} image prompts selected.`);
  console.log(`Provider: ${color.path(args.provider)}`);
  console.log(`Model: ${color.path(args.model)}`);
  console.log(`Mode: ${color.path(args.mode)}`);
  console.log(`Size hint: ${color.path(args.size)}`);

  if (selectedPrompts.length === 0) {
    console.log(color.warning("No prompts matched the current selection."));
    return;
  }

  if (!args.confirm) {
    console.log(color.warning("No provider calls were made. Re-run with --confirm when a human is ready to generate media."));
    return;
  }

  if (args.provider !== "gemini") {
    console.log(color.error(`Unsupported provider: ${args.provider}`));
    process.exitCode = 1;
    return;
  }

  const environment = validateMediaGenerationEnvironment();
  if (!environment.ok) {
    printSeedEnvironmentReport(environment);
    console.log(`\n${color.error("Set GEMINI_API_KEY in .env.local before running confirmed media generation.")}`);
    process.exitCode = 1;
    return;
  }

  await generateWithGemini(selectedPrompts);
}

function parseArgs(rawArgs) {
  const parsed = {
    mode: "preview",
    provider: "gemini",
    model: "gemini-2.5-flash-image",
    count: null,
    size: "1024x1024",
    pet: null,
    confirm: false
  };

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (arg === "--confirm") parsed.confirm = true;
    else if (arg === "--mode") parsed.mode = rawArgs[++index] ?? parsed.mode;
    else if (arg === "--provider") parsed.provider = rawArgs[++index] ?? parsed.provider;
    else if (arg === "--model") parsed.model = rawArgs[++index] ?? parsed.model;
    else if (arg === "--count") parsed.count = Number(rawArgs[++index]);
    else if (arg === "--size") parsed.size = rawArgs[++index] ?? parsed.size;
    else if (arg === "--pet") parsed.pet = rawArgs[++index] ?? parsed.pet;
  }

  return parsed;
}

function flattenImagePrompts(manifest) {
  return [
    ...manifest.pets.flatMap((pet) =>
      pet.imagePrompts.map((imagePrompt) => ({
        ownerType: "pet",
        ownerSlug: pet.slug,
        ownerName: pet.name,
        breed: pet.breed,
        outputDirectory: pet.outputDirectory,
        fileName: imagePrompt.fileName,
        prompt: withSizeHint(imagePrompt.prompt)
      }))
    ),
    ...manifest.owners.flatMap((owner) =>
      owner.imagePrompts.map((imagePrompt) => ({
        ownerType: "owner",
        ownerSlug: owner.slug,
        ownerName: owner.name,
        outputDirectory: owner.outputDirectory,
        fileName: imagePrompt.fileName,
        prompt: withSizeHint(imagePrompt.prompt)
      }))
    ),
    ...manifest.pages.flatMap((page) =>
      page.imagePrompts.map((imagePrompt) => ({
        ownerType: "page",
        ownerSlug: page.seedKey,
        ownerName: page.title,
        outputDirectory: page.outputDirectory,
        fileName: imagePrompt.fileName,
        prompt: withSizeHint(imagePrompt.prompt)
      }))
    )
  ];
}

function withSizeHint(prompt) {
  return `${prompt} Preferred output size/aspect: ${args.size}.`;
}

function selectPrompts(prompts) {
  const filtered = args.pet ? prompts.filter((prompt) => prompt.ownerType === "pet" && prompt.ownerSlug === args.pet) : prompts;
  const limit = args.count ?? (args.mode === "preview" ? 2 : filtered.length);
  return filtered.slice(0, limit);
}

async function generateWithGemini(prompts) {
  const progress = createProgress("Media generation", prompts.length);

  for (const prompt of prompts) {
    progress.note(`Starting ${prompt.ownerType} media for ${prompt.ownerName}: ${prompt.fileName}`);
    const requestStartedAt = Date.now();
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt.prompt }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] }
      })
    });
    progress.note(`Provider returned HTTP ${response.status} for ${prompt.ownerName} after ${formatElapsed(requestStartedAt)}`);

    const bodyStartedAt = Date.now();
    const body = await response.text();
    progress.note(`Read provider response for ${prompt.ownerName}: ${formatBytes(Buffer.byteLength(body))} after ${formatElapsed(bodyStartedAt)}`);

    if (!response.ok) {
      throw new ExpectedSeedMediaError(formatGeminiFailure(prompt, response.status, body));
    }

    const parseStartedAt = Date.now();
    const payload = parseJson(body);
    if (!payload) {
      throw new ExpectedSeedMediaError(`Gemini returned invalid JSON for ${prompt.ownerName}. HTTP status: ${response.status}`);
    }
    progress.note(`Parsed provider response for ${prompt.ownerName} after ${formatElapsed(parseStartedAt)}`);

    const imagePart = payload.candidates?.[0]?.content?.parts?.find((part) => part.inlineData?.data);
    if (!imagePart) {
      throw new ExpectedSeedMediaError(`Gemini did not return image data for ${prompt.ownerName}. Try a one-image preview with a different prompt, model, or size before running a larger inline generation pass.`);
    }

    const outputPath = resolveOutputPath(prompt, imagePart.inlineData.mimeType);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, "base64"));
    progress.tick(`Generated ${prompt.ownerType} media for ${prompt.ownerName}: ${outputPath}`);
  }
}

function formatGeminiFailure(prompt, status, body) {
  const parsed = parseJson(body);
  const providerMessage = parsed?.error?.message ?? body;
  const retryDelay = parsed?.error?.details?.find((detail) => detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo")?.retryDelay;
  const quotaViolations = parsed?.error?.details?.find((detail) => detail["@type"] === "type.googleapis.com/google.rpc.QuotaFailure")?.violations ?? [];
  const quotaSummary = quotaViolations
    .map((violation) => {
      const model = violation.quotaDimensions?.model ? ` for ${violation.quotaDimensions.model}` : "";
      return `- ${violation.quotaId ?? violation.quotaMetric}${model}`;
    })
    .join("\n");

  return [
    color.error(`Gemini image generation failed for ${prompt.ownerName}.`),
    `HTTP status: ${status}`,
    `Model: ${args.model}`,
    retryDelay ? `Retry hint: wait about ${retryDelay} before trying this model again.` : null,
    quotaSummary ? `Quota details:\n${quotaSummary}` : null,
    "",
    "What to do next:",
    "- Check whether this Gemini project has image-generation quota or billing enabled.",
    "- Try again later if the provider returned a retry delay.",
    "- Run a one-image preview before another inline generation pass.",
    "- Try a different configured image model if this model has no free-tier quota.",
    "",
    `Provider message: ${providerMessage}`
  ]
    .filter(Boolean)
    .join("\n");
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function resolveOutputPath(prompt, mimeType) {
  const existingExtension = extname(prompt.fileName);
  const extension = (extensionFromMimeType(mimeType) ?? existingExtension) || ".png";
  const baseName = existingExtension ? prompt.fileName.slice(0, -existingExtension.length) : prompt.fileName;
  return join(rootDir, prompt.outputDirectory, `${baseName}${extension}`);
}

function buildPromptKey(prompt, index) {
  const baseName = prompt.fileName.replace(extname(prompt.fileName), "");
  return `${prompt.ownerType}-${prompt.ownerSlug}-${baseName}-${index + 1}`.replace(/[^a-zA-Z0-9_-]+/g, "-");
}

function extensionFromMimeType(mimeType) {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/webp") return ".webp";
  return null;
}

function createProgress(label, total) {
  let processed = 0;

  return {
    note(message) {
      const remaining = Math.max(total - processed, 0);
      console.log(`${color.heading(label)}: ${color.success(String(processed))}/${total} processed, ${color.warning(String(remaining))} remaining - ${message}`);
    },
    tick(message) {
      processed += 1;
      const remaining = Math.max(total - processed, 0);
      console.log(`${color.heading(label)}: ${color.success(String(processed))}/${total} processed, ${color.warning(String(remaining))} remaining - ${message}`);
    }
  };
}

function formatElapsed(startedAt) {
  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs < 1000) return `${elapsedMs}ms`;
  return `${(elapsedMs / 1000).toFixed(1)}s`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

main().catch((error) => {
  if (error instanceof ExpectedSeedMediaError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
