import {
  CircleCheck,
  Clock,
  Info,
  MessageSquare,
  TrendingUp,
  Trophy,
} from "lucide-react";

export const typeMeta = {
  bid: { icon: CircleCheck, box: "bg-success-soft text-success" },
  outbid: { icon: TrendingUp, box: "bg-warning-soft text-warning" },
  ending: { icon: Clock, box: "bg-danger-soft text-danger" },
  won: { icon: Trophy, box: "bg-primary-soft text-primary" },
  support: { icon: MessageSquare, box: "bg-primary-soft text-primary" },
  system: { icon: Info, box: "bg-line text-muted" },
};
