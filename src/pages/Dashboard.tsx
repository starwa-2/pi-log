import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Square, Activity, CheckCircle2, XCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PiStatusGrid } from "@/components/PiStatusGrid";
import { LogsPanel } from "@/components/LogsPanel";
import { ConnectionIndicator } from "@/components/ConnectionIndicator";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorScreen } from "@/components/ErrorScreen";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8055";

interface PiStatus {
  ip: string | null;
  done: boolean;
  log_id: string | null;
  name: string;
  usb_connected?: boolean;
}

interface StatusResponse {
  batchid: string | null;
  pis: Record<string, PiStatus>;
}

export default function Dashboard() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { toast } = useToast();

  const appendLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${time}] ${msg}`].slice(-100));
  };

  const fetchStatus = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch(`${API_BASE}/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        setConnectionError(false);
        if (manual) {
          appendLog("🔄 Status refreshed manually");
          toast({
            title: "Status Updated",
            description: "Retrieved latest status from all Pis",
          });
        }
      } else {
        throw new Error("Backend responded with error");
      }
    } catch (error) {
      console.error("Status fetch error:", error);
      setConnectionError(true);
      if (manual) {
        appendLog("❌ Failed to refresh status");
        toast({
          title: "Refresh Failed",
          description: "Could not connect to backend",
          variant: "destructive",
        });
      }
    } finally {
      if (manual) setRefreshing(false);
      setInitializing(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => fetchStatus(), 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    setInitializing(true);
    setConnectionError(false);
    fetchStatus();
  };

  if (initializing && !status) {
    return <LoadingScreen />;
  }

  if (connectionError && !status) {
    return <ErrorScreen onRetry={handleRetry} />;
  }

  const handleStart = async () => {
    setLoading(true);
    setActiveAction("start");
    appendLog("🚀 Initiating START command...");

    try {
      const res = await fetch(`${API_BASE}/start`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        appendLog(`✅ Start initiated - Batch ID: ${data.batch_id}`);
        toast({
          title: "Logging Started",
          description: `Batch ${data.batch_id} is now collecting logs from connected Pis.`,
        });
        await fetchStatus();
      } else {
        throw new Error(data.detail || "Start failed");
      }
    } catch (error: any) {
      appendLog(`❌ Start failed: ${error.message}`);
      toast({
        title: "Start Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    setActiveAction("stop");
    appendLog("🛑 Initiating STOP command...");

    try {
      const res = await fetch(`${API_BASE}/stop`, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        appendLog(`✅ Stop completed - Batch ${data.batch_id}`);
        toast({
          title: "Logging Stopped",
          description: "All logs transferred and processing complete.",
        });
        await fetchStatus();
      } else {
        throw new Error(data.detail || "Stop failed");
      }
    } catch (error: any) {
      appendLog(`❌ Stop failed: ${error.message}`);
      toast({
        title: "Stop Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setActiveAction(null);
    }
  };

  const connectedCount = status
    ? Object.values(status.pis).filter((pi) => pi.ip !== null).length
    : 0;
  const totalPis = status ? Object.keys(status.pis).length : 0;
  const completedCount = status
    ? Object.values(status.pis).filter((pi) => pi.done).length
    : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Pi Log Manager</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and log collection from Raspberry Pi devices
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchStatus(true)}
              disabled={refreshing}
              className="border-border hover:bg-secondary"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
            <div className="flex items-center gap-2">
              <ConnectionIndicator connected={connectedCount > 0} />
              <span className="text-sm text-muted-foreground">Live Status</span>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Batch ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {status?.batchid || "No active batch"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Connected Pis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {connectedCount > 0 ? (
                  <Wifi className="h-5 w-5 text-success" />
                ) : (
                  <WifiOff className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-2xl font-bold text-foreground">
                  {connectedCount}/{totalPis}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold text-foreground">
                  {completedCount}/{totalPis}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={status?.batchid ? "default" : "secondary"}
                className="text-sm font-semibold"
              >
                {status?.batchid ? "Active" : "Idle"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Control Panel</CardTitle>
            <CardDescription className="text-muted-foreground">
              Start or stop log collection from connected Raspberry Pis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              onClick={handleStart}
              disabled={loading || !!status?.batchid}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {activeAction === "start" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Logging
                </>
              )}
            </Button>

            <Button
              onClick={handleStop}
              disabled={loading || !status?.batchid}
              size="lg"
              variant="destructive"
            >
              {activeAction === "stop" ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Stopping...
                </>
              ) : (
                <>
                  <Square className="mr-2 h-5 w-5" />
                  Stop & Transfer
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Pi Status Grid */}
        {status && <PiStatusGrid pis={status.pis} />}

        {/* Logs Panel */}
        <LogsPanel logs={logs} />
      </div>
    </div>
  );
}
