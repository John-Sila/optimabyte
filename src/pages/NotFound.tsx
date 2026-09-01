import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageShell from "@/components/layout/PageShell";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageShell>
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm font-medium text-primary mb-3">404</p>
          <h1 className="text-3xl font-semibold text-foreground mb-4">Page not found</h1>
          <p className="text-muted-foreground mb-6">
            The page you are looking for does not exist or has moved.
          </p>
          <Link to="/" className="text-primary font-medium hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    </PageShell>
  );
};

export default NotFound;
