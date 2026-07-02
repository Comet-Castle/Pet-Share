"use client";

import { useRouter } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing";

/**
 * Mounts Sanity Visual Editing with a soft refresh handler.
 *
 * The built-in default refresh is a hard `location.reload()`, which reloads the
 * whole page and discards scroll position and browser state on every content
 * mutation. Routing mutations through `router.refresh()` re-renders server
 * components in place, giving editors the smooth in-place editing experience
 * they expect in Presentation. This is the recommended next-sanity setup.
 */
export function VisualEditingClient() {
  const router = useRouter();

  return (
    <VisualEditing
      refresh={async () => {
        router.refresh();
      }}
    />
  );
}
