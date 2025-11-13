import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, Circle, Usb } from "lucide-react";

interface PiStatus {
  ip: string | null;
  done: boolean;
  log_id: string | null;
  name: string;
  usb_connected?: boolean;
}

interface PiStatusGridProps {
  pis: Record<string, PiStatus>;
}

export function PiStatusGrid({ pis }: PiStatusGridProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Raspberry Pi Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(pis).map(([mac, pi]) => (
            <div
              key={mac}
              className="relative rounded-lg border border-border bg-secondary/50 p-4 transition-all hover:bg-secondary/70"
            >
              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                {pi.done ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : pi.ip ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Pi Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{pi.name}</h3>
                  {pi.usb_connected && (
                    <span className="inline-flex" title="USB Connected">
                      <Usb className="h-4 w-4 text-success" />
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MAC:</span>
                    <span className="font-mono text-foreground text-xs">{mac}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP:</span>
                    <span className="font-mono text-foreground text-xs">
                      {pi.ip || "Not connected"}
                    </span>
                  </div>

                  {pi.log_id && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Log ID:</span>
                      <span className="font-mono text-foreground text-xs">{pi.log_id}</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="pt-2">
                  <Badge
                    variant={pi.done ? "default" : pi.ip ? "secondary" : "outline"}
                    className={
                      pi.done
                        ? "bg-success text-success-foreground"
                        : pi.ip
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {pi.done ? "Complete" : pi.ip ? "Logging" : "Offline"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
