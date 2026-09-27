/**
 * BrandForge Product Analytics (Lightweight & Privacy-Preserving)
 * Tracks user journey milestones without exposing private startup ideas or credentials.
 */

export type AnalyticsEvent =
  | 'landing_view'
  | 'signup_started'
  | 'signup_completed'
  | 'email_verified'
  | 'login_completed'
  | 'project_created'
  | 'workflow_started'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'stage_selected'
  | 'revision_requested'
  | 'brand_kit_generated'
  | 'brand_kit_exported'
  | 'share_created';

export interface AnalyticsProps {
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(eventName: AnalyticsEvent, properties?: AnalyticsProps): void {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const payload = {
      event: eventName,
      timestamp: new Date().toISOString(),
      properties: properties || {},
    };

    if (!isProd) {
      console.log(`[Analytics Event]: ${eventName}`, properties || {});
    }

    // Extensible hook for production analytics providers (e.g. PostHog, Plausible, or custom endpoint)
    if (typeof window !== 'undefined') {
      const win = window as any;
      if (typeof win.posthog?.capture === 'function') {
        win.posthog.capture(eventName, properties);
      } else if (typeof win.plausible === 'function') {
        win.plausible(eventName, { props: properties });
      }
    }
  } catch (err) {
    // Analytics should never break user interactions
    console.debug('Analytics dispatch error:', err);
  }
}
