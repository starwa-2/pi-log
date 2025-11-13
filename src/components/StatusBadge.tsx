import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Circle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "idle" | "active" | "complete" | "error";
  text?: string;
}

export function StatusBadge({ status, text }: StatusBadgeProps) {
  const config = {
    idle: {
      icon: Circle,
      className: "bg-muted text-muted-foreground",
      label: text || "Idle",
      animate: false,
    },
    active: {
      icon: Loader2,
      className: "bg-primary/20 text-primary animate-pulse",
      label: text || "Active",
      animate: true,
    },
    complete: {
      icon: CheckCircle2,
      className: "bg-success text-success-foreground",
      label: text || "Complete",
      animate: false,
    },
    error: {
      icon: AlertCircle,
      className: "bg-destructive text-destructive-foreground",
      label: text || "Error",
      animate: false,
    },
  };

  const { icon: Icon, className, label, animate } = config[status];

  return (
    <Badge className={className}>
      <Icon className={`mr-1 h-3 w-3 ${animate ? "animate-spin" : ""}`} />
      {label}
    </Badge>
  );
}
