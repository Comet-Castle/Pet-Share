import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Disables Draft Mode and returns editors to the current page or homepage.
 */
export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";
  redirect(redirectTo.startsWith("/") ? redirectTo : "/");
}
