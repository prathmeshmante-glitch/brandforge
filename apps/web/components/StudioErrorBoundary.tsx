'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  stageName?: string;
  onRetry?: () => void;
  onPreviousStage?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class StudioErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Studio Stage Render Error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  public render() {
    if (this.state.hasError) {
      const stage = this.props.stageName || 'Current Stage';
      return (
        <div
          style={{
            padding: '48px 32px',
            background: 'linear-gradient(135deg, rgba(255, 107, 94, 0.08), rgba(18, 19, 25, 0.95))',
            border: '1px solid rgba(255, 107, 94, 0.3)',
            borderRadius: '16px',
            margin: '20px 0',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(255, 107, 94, 0.15)',
              color: 'var(--coral)',
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(255, 107, 94, 0.3)',
            }}
          >
            <AlertTriangle size={24} />
          </div>

          <div>
            <span
              style={{
                font: '10px monospace',
                letterSpacing: '0.14em',
                color: 'var(--coral)',
                fontWeight: 700,
                display: 'block',
                marginBottom: '6px',
              }}
            >
              STAGE ERROR
            </span>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: '#fff', margin: '0 0 8px' }}>
              The {stage} could not complete rendering this stage.
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
              The studio encountered incomplete or unformatted stage data. You can retry rendering this stage or return to the previous stage.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            {this.props.onPreviousStage && (
              <button
                type="button"
                onClick={this.props.onPreviousStage}
                className="button button-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} /> Back to previous stage
              </button>
            )}

            <button
              type="button"
              onClick={this.handleRetry}
              className="button button-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={14} /> Retry stage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
