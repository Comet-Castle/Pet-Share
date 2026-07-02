import { redirect } from "next/navigation";

/**
 * Sends the pet index singleton preview to the draft-aware public listing page.
 */
export default function PetIndexPreviewPage() {
  redirect("/pets");
}
