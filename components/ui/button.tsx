import Link from "next/link";
import type { ReactNode } from "react";
import { joinClassNames } from "@/lib/utils/class-names";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = Readonly<{
  children: ReactNode;
  href: string;
  icon?: ReactNode;
  variant?: ButtonVariant;
}>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-pet-coral text-white shadow-soft hover:-rotate-1 hover:bg-[#f37f61]",
  secondary:
    "bg-white/75 text-pet-ink shadow-soft backdrop-blur hover:rotate-1 hover:bg-white"
};

/**
 * Renders a reusable link-styled button with Pet Share motion and focus states.
 */
export function Button({ children, href, icon, variant = "primary" }: ButtonProps) {
  return (
    <Link
      href={href}
      className={joinClassNames(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-pet-blue focus:ring-offset-2",
        variantClasses[variant]
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
