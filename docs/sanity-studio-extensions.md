# Sanity Studio Extensions

This document captures the preferred pattern for extending Sanity Studio in Pet Share. Use it when adding custom field inputs, picker dialogs, visual selectors, previews, or other editor-facing UI.

The goal is to make Studio customizations feel native to Sanity, not like the public Pet Share website embedded inside the CMS.

## Core Rules

- Build custom Studio UI with Sanity Studio primitives first, especially `@sanity/ui`.
- Do not style Studio inputs with the public website's colors, radius, shadows, spacing, fonts, or Tailwind classes.
- Do not use Tailwind classes in Studio components. Studio UI should use Sanity UI props, Sanity UI components, and small scoped CSS where needed.
- Keep editor-facing inputs compact, scannable, keyboard accessible, and theme-aware.
- Prefer Sanity `Card`, `Box`, `Flex`, `Grid`, `Stack`, `Text`, `TextInput`, `Button`, `Dialog`, `LayerProvider`, and `DialogProvider` before writing custom layout chrome.
- Use plain CSS only for small layout details that Sanity UI does not directly cover, such as grid row sizing, square icon tiles, or a constrained scroll area.
- Keep custom inputs reusable and place them under `sanity/components/`.
- Keep data semantic. Custom inputs should improve editing UX, but the stored value should remain stable content data such as `tone`, `style`, or `icon`.

## When To Build A Custom Input

Use native Sanity fields when the default editor is clear enough:

- Simple text, number, boolean, date, URL, slug, image, file, or reference fields.
- Short option lists where the labels are self-explanatory.
- Fields that editors will understand without visual examples, contextual help, or custom selection behavior.

Build a custom input when it materially improves editor accuracy or speed:

- The value controls visible frontend output and editors need a preview of the difference.
- A plain string value is too abstract, such as `primary`, `host`, `owner`, or `PawPrint`.
- Editors need to search or browse a large list, such as icons.
- A field is reused often enough that a better editing surface prevents repeated confusion.
- The default Sanity UI makes valid content possible but not obvious.

Do not build a custom input only to make Studio match the public website. Studio should remain an editing tool with native Sanity behavior.

## Custom Input Checklist

Before treating a custom Studio input as reusable, confirm:

- It uses `@sanity/ui` primitives for structure, buttons, text, cards, inputs, dialogs, and layering.
- It respects light and dark Studio color schemes.
- It avoids Tailwind and public frontend design tokens.
- It stores semantic values only.
- It has accessible labels, names, and pressed/selected states where needed.
- It handles long values without text overflow.
- It has intentional empty, selected, and cleared states.
- Dialogs use `LayerProvider`, `DialogProvider`, and Sanity `Dialog`.
- Scrollable areas have constrained height and visible overflow behavior.
- The field still works inside nested objects, arrays, and collapsed/expanded page-builder sections.
- Reusable option metadata lives in `sanity/schemaTypes/objects/studio-options.ts` or another clearly named schema support file.
- The pattern is documented if it will be reused.

## Current Pattern

The first reusable examples live in:

```text
sanity/components/studio-string-inputs.tsx
```

Current inputs:

- `VisualStringOptionsInput`: renders string options as descriptive visual cards.
- `IconPickerInput`: opens a searchable Lucide icon picker and stores the selected icon export name as a string.

Supporting files:

```text
sanity/schemaTypes/objects/studio-options.ts
lib/icons/lucide-icons.ts
```

Use `studio-options.ts` for reusable option metadata. Use `lucide-icons.ts` for icon registry and icon-name resolution.

## File Organization

Use predictable names for future Studio extensions:

```text
sanity/components/
  studio-string-inputs.tsx
  <purpose>-input.tsx
  <purpose>-dialog.tsx
  <purpose>-grid.tsx

sanity/schemaTypes/objects/
  studio-options.ts
```

Guidance:

- Keep small related inputs together when they share option handling or helper functions.
- Split a custom input once it contains multiple meaningful parts, such as preview, dialog, search, and result grid.
- Keep schema option metadata out of component files when the same options could be reused.
- Keep frontend render helpers, such as icon registries, outside `sanity/components/` when they are also used by the public website.

Split a large input into smaller components when:

- The file becomes hard to scan.
- Dialog state, search/filtering, result rendering, and selected preview all live in one component.
- A sub-piece could reasonably be reused by another Studio field.
- Visual bugs are becoming hard to isolate.

The icon picker may eventually split into:

- `IconPickerInput`
- `IconPickerDialog`
- `IconGrid`
- `SelectedIconPreview`

## Dialog And Layering Pattern

When a custom Studio input needs a modal, picker, or overlay, follow this pattern:

```tsx
<LayerProvider zOffset={30000}>
  <DialogProvider position="fixed" zOffset={30000}>
    <Dialog
      __unstable_hideCloseButton
      id="example-dialog"
      onClose={close}
      onClickOutside={close}
      padding={0}
      position="fixed"
      width={4}
    >
      <Card padding={3} radius={2}>
        ...
      </Card>
    </Dialog>
  </DialogProvider>
</LayerProvider>
```

Reasons:

- `LayerProvider` and `DialogProvider` match Sanity's own internal layering pattern.
- A high `zOffset` prevents Studio pane headers, footers, and control bars from appearing over the custom dialog.
- `Dialog` should own the modal behavior; avoid hand-rolled fixed overlays.
- `Card` inside the dialog provides the visible Studio background and padding.
- Hiding Sanity's built-in close button can be appropriate when its reserved space disrupts compact custom layouts. In that case, render an accessible close button inside your own header row.

## Scrollable Dialog Content

Scrollable picker content must have a real constrained height. Do not rely on `Stack` alone for remaining-space scroll behavior.

Use a CSS grid shell when a dialog has a fixed header, fixed search/control row, and scrollable result area:

```tsx
<Card
  padding={3}
  radius={2}
  style={{
    display: "grid",
    gap: "0.75rem",
    gridTemplateRows: "auto auto minmax(0, 1fr)",
    height: "min(520px, calc(100vh - 5rem))",
    overflow: "hidden"
  }}
>
  <Header />
  <SearchControls />
  <div style={{ minHeight: 0, overflowY: "scroll", scrollbarGutter: "stable" }}>
    <ResultsGrid />
  </div>
</Card>
```

Key details:

- The scroll row must be `minmax(0, 1fr)`.
- The scroll container must have `minHeight: 0`.
- Use `overflowY: "scroll"` when the scrollbar should be visible.
- Use `scrollbarGutter: "stable"` to avoid layout shift when scrollbars appear.

## Icon Picker Lessons

The icon picker is the reference pattern for future picker-style Studio inputs.

What worked:

- Use `@sanity/ui` for the dialog, card, text input, typography, and close button.
- Use `LayerProvider` and `DialogProvider` together for reliable Studio layering.
- Render the icon grid as icon-only buttons with `aria-label` and `title`.
- Keep the visible grid compact, while using hover/focus tooltips from the browser title for exact icon names.
- Store only the selected icon name in Sanity, not presentation metadata.

What to avoid:

- Do not build custom fixed-position modal backdrops unless Sanity UI cannot solve the need.
- Do not use public website colors or custom glass/rounded marketing styling in Studio inputs.
- Do not place long icon labels inside every grid item; it makes the picker noisy and causes overflow.
- Do not rely on `z-index` alone without Sanity's layer providers.
- Do not rely on a normal flex/stack layout for scrollable picker results unless the scroll area has a constrained height.

## Visual QA Checklist

Before handing off a Studio UI change, quickly check the input in realistic Studio conditions:

- Dark mode.
- Light mode.
- Narrow laptop widths.
- A document pane with side panels or incoming references open.
- A nested object field.
- An array item inside the page builder.
- Long selected values and long option labels.
- Empty state, selected state, clear/reset state, and search-with-no-results state.
- Dialogs over pane headers, pane footers, publish controls, inspectors, and action menus.
- Keyboard access for opening, searching, selecting, clearing, and closing.

Use browser screenshots when the change affects layout, layering, or scroll behavior. Small copy-only schema description changes do not need visual QA.

## Adding A New Custom Input

Use this process:

1. Confirm the schema field still stores semantic content, not frontend layout details.
2. Add or reuse option metadata in `sanity/schemaTypes/objects/studio-options.ts` if the field has known options.
3. Add the custom input under `sanity/components/`.
4. Build the editor UI with `@sanity/ui` primitives.
5. For dialogs, use the layering and scroll patterns in this document.
6. Attach the input through the schema field's `components.input`.
7. Update the relevant docs when the input becomes a reusable pattern.
8. Run `pnpm typecheck` and `pnpm lint`.
9. If the schema shape changed, also run `pnpm typegen`.

## Accessibility Expectations

- Every button must have visible text or an `aria-label`.
- Search inputs need a visible label or nearby text label.
- Dialogs need a stable `id`, `onClose`, and `onClickOutside`.
- Icon-only choices should include `aria-label`, `aria-pressed` when selectable, and `title` for quick editor discovery.
- Preserve keyboard focus behavior by using Sanity `Dialog` and `Button` where possible.

## Dependency Notes

`@sanity/ui` is allowed for Studio-only custom components. It should not become the public frontend UI framework.

`@sanity/ui` components are not a reason to introduce Sanity styling into the public frontend. Public site components should continue to use the project frontend conventions and Tailwind-based styling.

If a future Studio extension needs a new dependency, document the reason in `docs/dependency-decision-log.md` and update `ATTRIBUTIONS.md` when required.
