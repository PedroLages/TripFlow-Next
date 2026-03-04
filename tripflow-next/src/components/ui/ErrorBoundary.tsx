"use client"

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import './ErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback">
          <div className="error-icon-container">
            <MapPin size={32} className="error-icon" />
            <AlertCircle size={16} className="error-badge" />
          </div>
          <h3>Map Temporarily Unavailable</h3>
          <p>We&apos;re having trouble loading the map view. The rest of your itinerary is fully functional.</p>
          <button
            className="error-retry-btn"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
