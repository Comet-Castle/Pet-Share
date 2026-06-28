"use client";

import { useEffect } from "react";
import { SystemMessage } from "@/components/features/system/system-message";

type SiteErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

/**
 * Renders a friendly segment error boundary without exposing technical details.
 */
export default function SiteError({ error, reset }: SiteErrorProps) {
  useEffect(() => {
    console.error("Public route render failed.", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <SystemMessage
      variant="error"
      eyebrow="Something slipped the leash"
      title="The page got distracted by a squeaky toy."
      message="Try again in a moment. If this keeps happening, the debug logs should have the non-secret details."
      primaryHref="#"
      primaryLabel="Try again"
      secondaryHref="/"
      secondaryLabel="Go home"
    />
  );
}
