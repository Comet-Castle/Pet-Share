import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { spawnSync } from "node:child_process";
import { color, loadLocalEnv, printSeedEnvironmentReport, validateSeedEnvironment } from "./seed-env.mjs";

const rootDir = process.cwd();
const seedDir = join(rootDir, "sanity", "seed");
const generatedDir = join(seedDir, "generated");
const previewDir = join(generatedDir, "preview");
const approvalsDir = join(generatedDir, "approvals");
const mediaDir = join(generatedDir, "media");
const DEFAULT_PET_COUNT = 50;
const DEFAULT_OWNER_COUNT = 12;
const DEFAULT_TESTIMONIAL_COUNT = 18;
const runModes = {
  quickContent: "quick-content",
  quickApprovedMedia: "quick-approved-media",
  stepWizard: "step-wizard",
  startFresh: "start-fresh"
};

const rl = createInterface({ input, output });

async function main() {
  loadLocalEnv(rootDir);
  mkdirSync(approvalsDir, { recursive: true });

  console.log(color.heading("Pet Share seed wizard"));
  console.log("Choose a quick replace path for normal reseeding, or use the step wizard for media generation and detailed approvals.");
  console.log('Answer "q" at a prompt to quit.');

  const environment = validateSeedEnvironment({ includeOptional: true });
  printSeedEnvironmentReport(environment);

  if (environment.missingRequired.length > 0) {
    console.log(`\n${color.error("Fix the missing required values in .env.local, then rerun pnpm seed:wizard.")}`);
    return;
  }

  printStatus();
  const runMode = await askRunMode();

  if (runMode === runModes.quickContent) {
    await runQuickReplace({ includeApprovedMedia: false });
  } else if (runMode === runModes.quickApprovedMedia) {
    await runQuickReplace({ includeApprovedMedia: true });
  } else if (runMode === runModes.startFresh) {
    await runStartFreshReset();
  } else {
    await runStepWizard();
  }

  printStatus();
  console.log(`\n${color.success("Seed wizard complete.")}`);
}

async function runQuickReplace({ includeApprovedMedia }) {
  const petCount = await askPetCount();
  const ownerCount = await askOwnerCount();
  const testimonialCount = await askTestimonialCount();
  const mediaScope = includeApprovedMedia ? "all" : "pets";

  console.log(`\n${color.heading("Quick replace plan")}`);
  console.log(`- Pet count: ${color.success(String(petCount))}`);
  console.log(`- Owner count: ${color.success(String(ownerCount))}`);
  console.log(`- Generated testimonial count: ${color.success(String(testimonialCount))}`);
  console.log(`- Media: ${includeApprovedMedia ? "use approved local media from sanity/seed/media/ when available" : "skip media approval and local media upload"}`);
  console.log("- Sanity write: purge existing seeded documents, then write fresh seed content");

  if (!(await askYesNo("Generate, approve, purge, and replace the website with this plan?"))) {
    console.log(color.warning("Quick replace cancelled."));
    return;
  }

  generateDataPreview({ petCount, ownerCount, testimonialCount, mediaScope });
  approveLatestDataPreview({ reason: includeApprovedMedia ? "quick-approved-media" : "quick-content" });

  if (includeApprovedMedia) {
    approveExistingMediaIfAvailable();
  }

  await populateSanity({
    purgeFirst: true,
    petCount,
    ownerCount,
    testimonialCount,
    requireImageApproval: includeApprovedMedia,
    skipMediaUpload: !includeApprovedMedia
  });
}

async function runStartFreshReset() {
  console.log(`\n${color.heading("Start fresh reset plan")}`);
  console.log("- Sanity: purge seeded documents only, leaving the website without seeded content.");
  console.log("- Local generated workspace: remove sanity/seed/generated/ including previews, approvals, runbooks, and unreviewed media.");
  console.log("- Local approved media: remove sanity/seed/media/ so future media approval starts clean.");
  console.log("- Preserved source data: keep sanity/seed/data/ because it is the committed seed template source.");

  if (!(await askYesNo("Continue to the final reset confirmation?"))) {
    console.log(color.warning("Start fresh reset cancelled."));
    return;
  }

  if (!(await askPhrase("Type RESET to purge seeded Sanity content and clear local generated/approved media.", "RESET"))) {
    console.log(color.warning("Start fresh reset cancelled."));
    return;
  }

  const purgeSucceeded = await purgeSanityOnly();
  if (purgeSucceeded) {
    clearLocalSeedWorkspace();
  }
}

async function runStepWizard() {
  console.log('Answer "y" to run a step, "n" to skip it, or "q" to quit.');
  const petCount = await askPetCount();
  const ownerCount = await askOwnerCount();
  const testimonialCount = await askTestimonialCount();
  const mediaScope = await askYesNo("Prepare pet image prompts only and skip owner/page/marketing media?") ? "pets" : "all";
  console.log(`${color.heading("Media scope")}: ${mediaScope === "pets" ? "pet images only" : "all media prompts"}`);

  const state = {
    dataPreviewReady: existsSync(join(previewDir, "documents.json")),
    dataPreviewApproved: Boolean(readApproval("data-preview")),
    mediaPackagePrepared: false,
    mediaGenerated: false,
    mediaBranchSkipReason: null
  };

  await runPreviewSteps({ petCount, ownerCount, testimonialCount, mediaScope, state });
  await runMediaSteps({ petCount, mediaScope, state });
  await runSanityWriteStep({ petCount, ownerCount, testimonialCount });
}

async function runPreviewSteps({ petCount, ownerCount, testimonialCount, mediaScope, state }) {
  if (await askYesNo("\nStep 1: Generate or refresh full data preview files?")) {
    generateDataPreview({ petCount, ownerCount, testimonialCount, mediaScope });
    state.dataPreviewReady = true;
    state.dataPreviewApproved = false;
  }

  if (state.dataPreviewReady) {
    if (state.dataPreviewApproved) {
      skipStep("Step 2", "the content preview is already approved.");
    } else if (await askYesNo("\nStep 2: Review and approve the full content preview now?")) {
      state.dataPreviewApproved = await approveDataPreview();
    } else {
      skipStep("Steps 3, 4, 5, and 6", "the content preview was not approved.");
    }
  } else {
    skipStep("Step 2", "there is no data preview to approve.");
  }
}

async function runMediaSteps({ petCount, mediaScope, state }) {
  if (state.dataPreviewApproved) {
    if (await askYesNo("\nStep 3: Prepare the media generation package?")) {
      state.mediaPackagePrepared = await prepareImageGenerationPackage({ petCount, mediaScope });
    } else {
      state.mediaBranchSkipReason = "media package preparation was skipped.";
    }
  } else {
    state.mediaBranchSkipReason = "the content preview has not been approved in this run or a previous run.";
    skipStep("Step 3", state.mediaBranchSkipReason);
  }

  if (state.mediaPackagePrepared) {
    if (await askYesNo("\nStep 4: Generate media from the prepared prompt package now?")) {
      const mediaResult = await generateMedia();
      state.mediaGenerated = mediaResult === "preview" || mediaResult === "inline";
    } else {
      skipStep("Step 5", "media generation was skipped.");
    }
  } else {
    skipStep("Steps 4 and 5", state.mediaBranchSkipReason ?? "the media generation package was not prepared.");
  }

  if (state.mediaGenerated) {
    if (await askYesNo("\nStep 5: Approve reviewed media currently in sanity/seed/media/?")) {
      await approveImages();
    }
  } else if (state.mediaPackagePrepared) {
    skipStep("Step 5", "no media files were generated in this wizard run.");
  }
}

async function runSanityWriteStep({ petCount, ownerCount, testimonialCount }) {
  if (await askYesNo("\nStep 6: Populate Sanity from approved seed content and approved local media?")) {
    const purgeFirst = await askYesNo("Purge existing seeded Sanity documents before writing fresh seed data?");
    await populateSanity({ purgeFirst, petCount, ownerCount, testimonialCount });
  }
}

async function purgeSanityOnly() {
  const environment = validateSeedEnvironment({ requireWriteToken: true });
  if (!environment.ok) {
    printSeedEnvironmentReport(environment, { requireWriteToken: true });
    console.log(`\n${color.error("Fix the missing values in .env.local, then rerun pnpm seed:wizard.")}`);
    return false;
  }

  const result = spawnSync(process.execPath, [join(rootDir, "scripts", "seed-sanity.mjs"), "--confirm", "--purge-only"], {
    cwd: rootDir,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error("Sanity purge-only reset failed. Local seed workspace was not cleared.");
  }

  return true;
}

function clearLocalSeedWorkspace() {
  const pathsToClear = [
    { label: "generated workspace", path: generatedDir },
    { label: "approved media", path: join(seedDir, "media") }
  ];

  pathsToClear.forEach((target) => {
    if (!existsSync(target.path)) {
      console.log(color.warning(`No ${target.label} directory found at ${relativePath(target.path)}.`));
      return;
    }

    rmSync(target.path, { recursive: true, force: true });
    console.log(color.success(`Cleared ${target.label}: ${relativePath(target.path)}`));
  });

  mkdirSync(approvalsDir, { recursive: true });
  mkdirSync(mediaDir, { recursive: true });
  console.log(color.success("Local seed workspace reset complete."));
}

function printStatus() {
  console.log(`\n${color.heading("Current status:")}`);
  console.log(`- Data preview: ${statusLabel(existsSync(join(previewDir, "documents.json")), "ready", "missing")}`);
  console.log(`- Data approval: ${statusLabel(Boolean(readApproval("data-preview")), "approved", "not approved")}`);
  console.log(`- Image package: ${statusLabel(existsSync(join(generatedDir, "image-generation-runbook.md")), "ready", "missing")}`);
  console.log(`- Image approval: ${statusLabel(Boolean(readApproval("images")), "approved", "not approved")}`);
}

function generateDataPreview({ petCount, ownerCount = DEFAULT_OWNER_COUNT, testimonialCount = DEFAULT_TESTIMONIAL_COUNT, mediaScope = "all" }) {
  const result = spawnSync(process.execPath, [join(rootDir, "scripts", "seed-sanity.mjs"), "--preview", "--pet-count", String(petCount), "--owner-count", String(ownerCount), "--testimonial-count", String(testimonialCount), "--media-scope", mediaScope], {
    cwd: rootDir,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error("Data preview generation failed.");
  }
}

async function approveDataPreview() {
  const summaryPath = join(previewDir, "summary.json");
  const documentsPath = join(previewDir, "documents.json");

  if (!existsSync(summaryPath) || !existsSync(documentsPath)) {
    console.log(color.warning("Generate data preview files before approving them."));
    return false;
  }

  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  console.log(`Preview contains ${color.success(String(summary.totalDocuments))} documents.`);
  console.log(`Preview pet count: ${color.success(String(summary.actualPetCount ?? summary.documentsByType?.pet ?? 0))}`);
  console.log(JSON.stringify(summary.documentsByType, null, 2));

  if (!(await askYesNo("Approve this full content preview?"))) {
    console.log(color.warning("Data preview was not approved."));
    return false;
  }

  approveLatestDataPreview({ reason: "step-wizard" });
  console.log(color.success("Data preview approved."));
  return true;
}

function approveLatestDataPreview({ reason }) {
  const summaryPath = join(previewDir, "summary.json");
  const documentsPath = join(previewDir, "documents.json");

  if (!existsSync(summaryPath) || !existsSync(documentsPath)) {
    throw new Error("Generate data preview files before approving them.");
  }

  const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
  writeApproval("data-preview", {
    approvalMode: reason,
    totalDocuments: summary.totalDocuments,
    requestedPetCount: summary.requestedPetCount,
    actualPetCount: summary.actualPetCount,
    mediaScope: summary.mediaScope ?? "all",
    documentsByType: summary.documentsByType,
    previewPath: relativePath(documentsPath)
  });
  console.log(color.success(`Data preview approved via ${reason}.`));
}

async function prepareImageGenerationPackage({ petCount, mediaScope = "all" } = {}) {
  if (!readApproval("data-preview")) {
    console.log(color.warning("Approve the data preview before preparing media generation."));
    return false;
  }

  const mediaPromptsPath = join(previewDir, "media-prompts.json");
  if (!existsSync(mediaPromptsPath)) {
    console.log(color.warning("Generate data preview files first. The media prompt manifest is missing."));
    return false;
  }
  const mediaPrompts = JSON.parse(readFileSync(mediaPromptsPath, "utf8"));
  const currentScope = mediaPrompts.mediaScope ?? "all";

  if (currentScope !== mediaScope) {
    console.log(color.warning(`The current media prompt manifest uses "${currentScope}" scope, but this wizard run selected "${mediaScope}".`));
    if (!(await askYesNo("Refresh the preview manifest with the selected media scope now?"))) {
      console.log(color.warning("Media package preparation cancelled so the scope does not drift from your selection."));
      return false;
    }

    generateDataPreview({ petCount, mediaScope });
  }

  const scopedMediaPrompts = JSON.parse(readFileSync(mediaPromptsPath, "utf8"));
  const promptCount =
    scopedMediaPrompts.pets.reduce((count, pet) => count + pet.imagePrompts.length, 0) +
    scopedMediaPrompts.owners.reduce((count, owner) => count + owner.imagePrompts.length, 0) +
    scopedMediaPrompts.pages.reduce((count, page) => count + page.imagePrompts.length, 0);
  const videoConceptCount = scopedMediaPrompts.pets.reduce((count, pet) => count + (pet.videoPrompt ? 1 : 0), 0);

  const runbookPath = join(generatedDir, "image-generation-runbook.md");
  const runbook = [
    "# Pet Share Image Generation Runbook",
    "",
    "This package was prepared by the seed wizard.",
    "",
    "Prompt manifest:",
    "",
    `- \`${relativePath(mediaPromptsPath)}\``,
    `- Media scope: \`${scopedMediaPrompts.mediaScope ?? "all"}\``,
    `- Image prompts: \`${promptCount}\``,
    `- Future video concepts: \`${videoConceptCount}\``,
    "",
    "Human approval rules:",
    "",
    "- AI agents must not run paid, metered, or quota-limited image generation commands.",
    "- Generate a small sample first, review it, then generate the larger inline prompt set.",
    "- Bulk media generation should print processed and remaining counts while it runs.",
    "- Pet prompts must preserve the selected breed, species, or variety so generated images match the structured pet data.",
    "- Keep unreviewed media under `sanity/seed/generated/media/`.",
    "- Copy approved media into `sanity/seed/media/` before committing or uploading to Sanity.",
    "",
    "Current implementation note:",
    "",
    "The wizard can run `seed:media` after this package is prepared. Use preview mode first, review generated files under `sanity/seed/generated/media/`, then run inline mode only after the sample direction is approved.",
    "",
    "Inline mode calls the provider one prompt at a time, writes each generated file immediately, and prints processed/remaining counts plus request, response, parse, and write status while it runs.",
    ""
  ].join("\n");

  mkdirSync(mediaDir, { recursive: true });
  writeFileSync(runbookPath, runbook);

  console.log(`Image generation package written to ${color.path(runbookPath)}`);
  console.log(`${color.heading("Media prompt package")}: ${color.success(String(promptCount))} image prompts prepared, ${color.warning("0")} provider calls made.`);
  console.log(`${color.heading("Future video concepts")}: ${color.success(String(videoConceptCount))} prompts documented only.`);
  console.log(color.success("No AI provider was called."));
  return true;
}

async function generateMedia() {
  const mediaPromptsPath = join(previewDir, "media-prompts.json");
  if (!existsSync(mediaPromptsPath)) {
    console.log(color.warning("Prepare the media generation package before generating media."));
    return null;
  }

  const previewMode = await askYesNo("Generate a small preview sample? Choose no for inline generation of the selected prompt set.");
  const mode = previewMode ? "preview" : "inline";
  const defaultCount = previewMode ? "2" : "";
  const countAnswer = await rl.question(`${color.heading(`Optional image limit for ${mode} mode`)} ${color.muted(defaultCount ? `(default ${defaultCount}):` : "(blank for all):")} `);
  const selectedPet = await rl.question(`${color.heading("Optional pet slug to limit generation")} ${color.muted("(blank for all):")} `);
  const selectedModel = await rl.question(`${color.heading("Optional Gemini image model override")} ${color.muted("(blank for default):")} `);
  const selectedSize = await rl.question(`${color.heading("Optional image size hint")} ${color.muted("(default 1024x1024):")} `);

  if (mode === "inline" && !(await askYesNo("Inline generation can call the provider many times. Continue?"))) {
    console.log(color.warning("Media generation cancelled."));
    return null;
  }

  const args = [join(rootDir, "scripts", "seed-media.mjs"), "--mode", mode, "--confirm"];
  if (countAnswer.trim()) args.push("--count", countAnswer.trim());
  if (selectedPet.trim()) args.push("--pet", selectedPet.trim());
  if (selectedModel.trim()) args.push("--model", selectedModel.trim());
  if (selectedSize.trim()) args.push("--size", selectedSize.trim());

  const result = spawnSync(process.execPath, args, {
    cwd: rootDir,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    console.log(color.error("Media generation failed. No approval was recorded."));
    console.log(color.warning("You can rerun Step 4 after quota, model, billing, or prompt settings are corrected."));
    return null;
  }

  return mode;
}

async function approveImages() {
  const approvedMediaDir = join(seedDir, "media");
  const generatedMediaDir = join(generatedDir, "media");

  if (existsSync(generatedMediaDir) && await askYesNo("Copy reviewed generated media into sanity/seed/media/ before approval?")) {
    cpSync(generatedMediaDir, approvedMediaDir, { recursive: true });
    console.log(color.success("Reviewed generated media copied into sanity/seed/media/."));
  }

  if (!existsSync(approvedMediaDir)) {
    console.log(color.warning("No approved media directory exists yet."));
    return;
  }

  const mediaFileCount = countFiles(approvedMediaDir);
  console.log(`Approved media directory currently contains ${color.success(String(mediaFileCount))} files.`);

  if (!(await askYesNo("Approve these reviewed media files for Sanity upload?"))) {
    console.log(color.warning("Images were not approved."));
    return;
  }

  writeApproval("images", {
    approvalMode: "step-wizard",
    approvedMediaPath: relativePath(approvedMediaDir),
    approvedMediaFileCount: mediaFileCount
  });
  console.log(color.success("Images approved for Sanity upload."));
}

function approveExistingMediaIfAvailable() {
  const approvedMediaDir = join(seedDir, "media");

  if (!existsSync(approvedMediaDir)) {
    console.log(color.warning("No sanity/seed/media/ directory exists. Quick media mode will ask whether to continue with placeholders."));
    return false;
  }

  const mediaFileCount = countFiles(approvedMediaDir);
  writeApproval("images", {
    approvalMode: "quick-approved-media",
    approvedMediaPath: relativePath(approvedMediaDir),
    approvedMediaFileCount: mediaFileCount
  });
  console.log(color.success(`Approved existing local media for Sanity upload (${mediaFileCount} files).`));
  return true;
}

async function populateSanity({ purgeFirst = false, petCount = DEFAULT_PET_COUNT, ownerCount = DEFAULT_OWNER_COUNT, testimonialCount = DEFAULT_TESTIMONIAL_COUNT, requireImageApproval = true, skipMediaUpload = false } = {}) {
  const environment = validateSeedEnvironment({ requireWriteToken: true });
  if (!environment.ok) {
    printSeedEnvironmentReport(environment, { requireWriteToken: true });
    console.log(`\n${color.error("Fix the missing values in .env.local, then rerun pnpm seed:wizard.")}`);
    return;
  }

  if (!readApproval("data-preview")) {
    console.log(color.warning("Approve the data preview before writing to Sanity."));
    return;
  }

  const dataApproval = readApproval("data-preview");
  const approvedPetCount = dataApproval?.details?.actualPetCount;
  if (approvedPetCount && approvedPetCount !== petCount) {
    console.log(color.warning(`The approved preview used ${approvedPetCount} pets, but this wizard run is set to ${petCount} pets.`));
    if (!(await askYesNo("Continue and write using the current wizard pet count?"))) {
      console.log(color.warning("Sanity write cancelled."));
      return;
    }
  }

  if (requireImageApproval && !readApproval("images")) {
    if (!(await askYesNo("Images are not approved. Continue with placeholders or currently available media?"))) {
      console.log(color.warning("Sanity write cancelled."));
      return;
    }
  }

  if (!(await askYesNo("This writes to Sanity. Continue?"))) {
    console.log(color.warning("Sanity write cancelled."));
    return;
  }

  const args = [join(rootDir, "scripts", "seed-sanity.mjs"), "--confirm", "--pet-count", String(petCount), "--owner-count", String(ownerCount), "--testimonial-count", String(testimonialCount)];
  if (purgeFirst) args.push("--purge");
  if (skipMediaUpload) args.push("--skip-media-upload");

  const result = spawnSync(process.execPath, args, {
    cwd: rootDir,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    throw new Error("Sanity seed write failed.");
  }
}

async function askRunMode() {
  console.log(`\n${color.heading("Choose a seed workflow:")}`);
  console.log(`1. ${color.success("Quickly replace the website without media")} ${color.muted("- generate X pets/content, approve preview, purge seeded docs, write to Sanity")}`);
  console.log(`2. ${color.success("Quickly replace the website with approved local media")} ${color.muted("- same as option 1, plus approve files already in sanity/seed/media/")}`);
  console.log(`3. ${color.success("Wizard steps")} ${color.muted("- review each step, media prompts, inline generation, approvals, and final write")}`);
  console.log(`4. ${color.warning("Start fresh reset")} ${color.muted("- purge seeded Sanity docs and clear local generated/approved media")}`);

  while (true) {
    const answer = (await rl.question(`${color.heading("Workflow choice")} ${color.muted("(1/2/3/4, default 3):")} `)).trim().toLowerCase();
    if (!answer || answer === "3" || answer === "wizard" || answer === "steps") return runModes.stepWizard;
    if (answer === "1" || answer === "content" || answer === "quick-content" || answer === "without media") return runModes.quickContent;
    if (answer === "2" || answer === "media" || answer === "quick-media" || answer === "with media") return runModes.quickApprovedMedia;
    if (answer === "4" || answer === "reset" || answer === "start fresh" || answer === "start-fresh") return runModes.startFresh;
    if (answer === "q" || answer === "quit" || answer === "exit") {
      console.log(color.warning("Seed wizard stopped."));
      process.exit(0);
    }
    console.log(color.warning("Choose 1, 2, 3, 4, or q."));
  }
}

async function askPetCount() {
  while (true) {
    const answer = (await rl.question(`${color.heading("Pet count for generated seed data")} ${color.muted(`(default ${DEFAULT_PET_COUNT}):`)} `)).trim();
    if (!answer) return DEFAULT_PET_COUNT;

    const count = Number(answer);
    if (Number.isInteger(count) && count > 0) return count;

    console.log(color.warning("Enter a positive whole number, or leave blank for the default."));
  }
}

async function askOwnerCount() {
  while (true) {
    const answer = (await rl.question(`${color.heading("Owner count")} ${color.muted(`(default ${DEFAULT_OWNER_COUNT}, max ${DEFAULT_OWNER_COUNT} from the fixed owner list):`)} `)).trim();
    if (!answer) return DEFAULT_OWNER_COUNT;

    const count = Number(answer);
    if (Number.isInteger(count) && count > 0) return count;

    console.log(color.warning("Enter a positive whole number, or leave blank for the default."));
  }
}

async function askTestimonialCount() {
  while (true) {
    const answer = (await rl.question(`${color.heading("Generated testimonial count")} ${color.muted(`(default ${DEFAULT_TESTIMONIAL_COUNT}, authored testimonials are always included in full):`)} `)).trim();
    if (!answer) return DEFAULT_TESTIMONIAL_COUNT;

    const count = Number(answer);
    if (Number.isInteger(count) && count > 0) return count;

    console.log(color.warning("Enter a positive whole number, or leave blank for the default."));
  }
}

function writeApproval(name, details) {
  writeJson(join(approvalsDir, `${name}.json`), {
    approvedAt: new Date().toISOString(),
    details
  });
}

async function askYesNo(question) {
  while (true) {
    const answer = (await rl.question(`${color.heading(question)} ${color.muted("(y/N):")} `)).trim().toLowerCase();
    if (!answer || answer === "n" || answer === "no") return false;
    if (answer === "y" || answer === "yes") return true;
    if (answer === "q" || answer === "quit" || answer === "exit") {
      console.log(color.warning("Seed wizard stopped."));
      process.exit(0);
    }
    console.log(color.warning('Please answer "y", "n", or "q".'));
  }
}

async function askPhrase(question, expectedPhrase) {
  const answer = (await rl.question(`${color.heading(question)} `)).trim();
  return answer === expectedPhrase;
}

function readApproval(name) {
  const filePath = join(approvalsDir, `${name}.json`);
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function countFiles(dir) {
  if (!existsSync(dir)) return 0;

  return readdirSync(dir).reduce((count, entry) => {
    const entryPath = join(dir, entry);
    const stats = statSync(entryPath);
    return count + (stats.isDirectory() ? countFiles(entryPath) : 1);
  }, 0);
}

function relativePath(filePath) {
  return filePath.replace(`${rootDir}\\`, "").replaceAll("\\", "/");
}

function statusLabel(isReady, readyLabel, missingLabel) {
  return isReady ? color.success(readyLabel) : color.warning(missingLabel);
}

function skipStep(stepLabel, reason) {
  console.log(color.warning(`${stepLabel} skipped: ${reason}`));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
