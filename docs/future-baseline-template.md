# Future Baseline Template Extraction

Goal:

- Once Pet Share's pages, content model, and conventions are fully built out, compress the project down into a reusable baseline/starter project.
- The baseline should outline all the steps, docs, and decisions made here so future projects can start from it instead of re-deriving the same conventions from scratch.

Status:

- Not scheduled. This is a future intent to keep in mind while building out the project now, not active work.
- Should be considered while marking up all the pages, since page structure, component conventions, and doc organization decided now are what the baseline will eventually be extracted from.

Why this matters now:

- Decisions made while implementing pages (component boundaries, doc structure, Sanity schema patterns, seeding workflow) are the raw material for the eventual baseline.
- Keeping conventions clean, documented, and free of Pet-Share-specific hacks makes the later extraction easier.

High-level future workflow (to be detailed later):

1. Start from the baseline/starter project.
2. Ingest the client's design, optionally copying it directly.
3. Mock the design up into flat HTML pages.
4. Once the flat HTML is approved, convert those HTML files into a structure Sanity can respect: define the elements and components as Sanity schema.
5. Push that content structure to Sanity and organize it (desk structure, document types, relationships).
6. Populate the organized structure with real data.

Open questions to resolve when this work is scheduled:

- Which parts are truly project-agnostic (routing conventions, component conventions, Sanity setup patterns, doc structure) versus Pet-Share-specific (pet marketplace content model, satirical copy, seed data)?
- Does the baseline ship as a separate template repo, a `create-*` scaffolding script, or a documented copy/trim process?
- Which docs in this repo (for example `docs/implementation-conventions.md`, `docs/architecture.md`) carry over largely as-is versus needing generalization?
- How should environment variables, dependency decisions, and seed workflows be generalized instead of hardcoded to Pet Share?

Acceptance notes:

- No action required until this work is explicitly scheduled.
- When it is scheduled, review this file alongside `docs/architecture.md`, `docs/implementation-conventions.md`, and `docs/dependency-decision-log.md` to decide what generalizes cleanly.
