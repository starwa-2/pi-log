import { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

interface LogsPanelProps {
  logs: string[];
}

export function LogsPanel({ logs }: LogsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">Activity Log</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border border-border bg-secondary/30 p-4">
          <div ref={scrollRef} className="space-y-1 font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">No activity yet...</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="text-foreground">
                  {log}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
