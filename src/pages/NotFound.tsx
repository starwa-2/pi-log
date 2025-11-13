import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="max-w-md w-full bg-card border-border">
        <CardHeader className="text-center">
          <div className="text-6xl font-bold text-primary mb-4">404</div>
          <CardTitle className="text-2xl text-foreground">Page Not Found</CardTitle>
          <CardDescription className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Link to="/dashboard">
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="w-full border-border">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <div className="mt-4 text-xs text-center text-muted-foreground font-mono">
            Attempted path: {location.pathname}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
