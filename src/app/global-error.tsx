"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log critical error to monitoring service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-4 text-4xl font-bold">Critical Error</h1>
            <p className="mb-6 text-muted-foreground">
              A critical error occurred. Please refresh the page to continue.
            </p>
            {error.digest && (
              <p className="mb-6 text-sm text-muted-foreground">Error ID: {error.digest}</p>
            )}
            <button
              onClick={reset}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
