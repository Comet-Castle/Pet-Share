import { CircleHelp, PawPrint } from "lucide-react";
import { createElement } from "react";
import { getLucideIcon } from "@/lib/icons/lucide-icons";
import { joinClassNames } from "@/lib/utils/class-names";

type IconBadgeProps = Readonly<{
  icon?: string | null;
  className?: string;
}>;

/**
 * Maps CMS icon values to Lucide icons while preserving legacy seed aliases.
 */
export function IconBadge({ icon, className }: IconBadgeProps) {
  const Icon = icon ? (getLucideIcon(icon) ?? CircleHelp) : PawPrint;

  return (
    <span
      className={joinClassNames(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pet-mint/35 text-pet-ink",
        className
      )}
    >
      {createElement(Icon, { "aria-hidden": true, size: 20 })}
    </span>
  );
}
