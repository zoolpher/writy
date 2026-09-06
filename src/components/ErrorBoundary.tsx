"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Whiteboard crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-4">The whiteboard crashed!</h2>
            <p className="text-gray-600 mb-4">We hit a snag while rendering the board. This usually happens if the board's save data is corrupted or from an older version.</p>
            <div className="bg-red-50 text-red-800 p-4 rounded-lg font-mono text-sm text-left overflow-auto max-h-64 mb-6">
              {this.state.error?.message || "Unknown error"}
            </div>
            <button 
              onClick={() => window.location.href = "/dashboard"}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
