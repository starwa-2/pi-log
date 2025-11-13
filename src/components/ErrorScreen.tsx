import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorScreenProps {
  onRetry: () => void;
}

export function ErrorScreen({ onRetry }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl text-foreground">Backend Connection Failed</CardTitle>
          <CardDescription className="text-muted-foreground">
            Unable to connect to the Pi Log Manager API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Please ensure:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>The backend server is running (python manager.py)</li>
              <li>Port 8055 is accessible</li>
              <li>No firewall is blocking the connection</li>
            </ul>
          </div>

          <div className="bg-secondary/50 p-3 rounded-md">
            <p className="text-xs text-muted-foreground font-mono">
              Expected backend URL: http://localhost:8055
            </p>
          </div>

          <Button onClick={onRetry} className="w-full bg-primary hover:bg-primary/90">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
