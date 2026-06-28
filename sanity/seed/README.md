# Pet Share Seed Data

This directory contains representative seed data for Milestone 1.

The files under `data/` define the saved JSON shape that future Sanity schemas, seed scripts, queries, and frontend types should align with. This is a small sample set, not the final 50-pet demo seed.

Media rules:

- `media-manifest.json` records the planned and approved media assets referenced by seed data.
- Milestone 1 manifest entries may use `status: "planned"` before actual image files exist.
- Approved generated files should eventually live under `sanity/seed/media/`.
- Unreviewed generated files belong under `sanity/seed/generated/`, which is ignored by Git.
- Normal seed replay must not call AI generation providers.
