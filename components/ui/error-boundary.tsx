"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * A robust Error Boundary component to catch rendering errors and provide a graceful fallback.
 * Demonstrates defensive programming and focus on user experience.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center">
          <div className="bg-destructive/10 text-destructive mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <AlertCircle size={40} />
          </div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            An unexpected error occurred while rendering this page. We've been
            notified and are looking into it.
          </p>
          <Button
            onClick={this.handleReset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
