
import posthog from 'posthog-js'

// Initialize PostHog with your public key and recommended defaults
posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
  defaults: '2025-05-24',                     // required default
  autocapture: true,                         // click/page events
  capture_pageview: true,                    // page views
  session_recording: { maskAllInputs: true },// safe defaults for session recording
  capture_exceptions: true,                  // enable Error Tracking
  debug: import.meta.env.MODE === 'development',
})

export default posthog
