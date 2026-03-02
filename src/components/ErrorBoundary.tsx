'use client';

import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('UI error boundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 md:p-10 bg-white/5 border border-white/10 rounded-2xl text-white/60 text-sm">
          Something went wrong while rendering the report. Please try again.
        </div>
      );
    }
    return this.props.children;
  }
}
