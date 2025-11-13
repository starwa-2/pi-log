import { Loader2, Server } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <Server className="h-16 w-16 text-primary" />
          <Loader2 className="h-8 w-8 text-primary animate-spin absolute -bottom-2 -right-2" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Connecting to Backend</h2>
          <p className="text-muted-foreground">Establishing connection to Pi Log Manager API...</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="animate-pulse">●</div>
          <div className="animate-pulse delay-100">●</div>
          <div className="animate-pulse delay-200">●</div>
        </div>
      </div>
    </div>
  );
}
