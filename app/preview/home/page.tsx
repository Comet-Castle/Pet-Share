import { redirect } from "next/navigation";

/**
 * Sends the home singleton preview to the draft-aware public homepage.
 */
export default function HomePreviewPage() {
  redirect("/");
}
