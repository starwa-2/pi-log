import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard on mount
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return <Dashboard />;
};

export default Index;
