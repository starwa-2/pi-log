import { Wifi, WifiOff } from "lucide-react";

interface ConnectionIndicatorProps {
  connected: boolean;
  size?: "sm" | "md" | "lg";
}

export function ConnectionIndicator({ connected, size = "md" }: ConnectionIndicatorProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="relative inline-flex items-center">
      {connected ? (
        <>
          <Wifi className={`${sizeClasses[size]} text-success`} />
          <span className="absolute -right-1 -top-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
          </span>
        </>
      ) : (
        <WifiOff className={`${sizeClasses[size]} text-muted-foreground`} />
      )}
    </div>
  );
}
