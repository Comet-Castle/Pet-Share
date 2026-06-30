import {
  AlertTriangle,
  BadgeDollarSign,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  CircleHelp,
  HeartHandshake,
  Home,
  type LucideIcon,
  Mail,
  MessageCircle,
  PackageCheck,
  PawPrint,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Star,
  UserPlus,
  Video
} from "lucide-react";
import { joinClassNames } from "@/lib/utils/class-names";

type IconBadgeProps = Readonly<{
  icon?: string | null;
  className?: string;
}>;

const iconMap: Record<string, LucideIcon> = {
  alert: AlertTriangle,
  calendarCheck: CalendarCheck,
  check: CheckCircle2,
  clipboardList: ClipboardList,
  contact: Mail,
  cta: Sparkles,
  heart: HeartHandshake,
  home: Home,
  money: BadgeDollarSign,
  messageCircle: MessageCircle,
  packageCheck: PackageCheck,
  paw: PawPrint,
  price: BadgeDollarSign,
  rotateCcw: RotateCcw,
  search: Search,
  send: Send,
  shield: ShieldAlert,
  star: Star,
  userPlus: UserPlus,
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
