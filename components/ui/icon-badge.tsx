import {
  AlertTriangle,
  BadgeDollarSign,
  CheckCircle2,
  CircleHelp,
  HeartHandshake,
  type LucideIcon,
  Mail,
  PawPrint,
  ShieldAlert,
  Sparkles,
  Star,
  Video
} from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

type IconBadgeProps = Readonly<{
  icon?: string | null;
  className?: string;
}>;

const iconMap: Record<string, LucideIcon> = {
  alert: AlertTriangle,
  check: CheckCircle2,
  contact: Mail,
  cta: Sparkles,
  heart: HeartHandshake,
  money: BadgeDollarSign,
  paw: PawPrint,
  price: BadgeDollarSign,
  shield: ShieldAlert,
  star: Star,
  video: Video,
  warning: ShieldAlert
};

/**
 * Maps CMS icon labels to the local Lucide icon set.
 */
export function IconBadge({ icon, className }: IconBadgeProps) {
  const Icon = icon ? (iconMap[icon] ?? CircleHelp) : PawPrint;

  return (
    <span
      className={joinClassNames(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pet-mint/35 text-pet-ink",
        className
      )}
    >
      <Icon aria-hidden="true" size={20} />
    </span>
  );
}
