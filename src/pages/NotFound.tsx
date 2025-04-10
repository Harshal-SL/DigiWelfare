
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
          <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2"
          >
            <Home size={16} />
            Return to Home
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/schemes")}
          >
            View Schemes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
