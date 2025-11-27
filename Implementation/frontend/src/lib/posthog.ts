import posthog from 'posthog-js';

let initialized = false;

export function initPostHog() {
  if (initialized) return;
  
  const apiKey = import.meta.env.VITE_POSTHOG_API_KEY;
  const host = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';
  
  if (apiKey) {
    posthog.init(apiKey, {
      api_host: host,
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          console.log('PostHog initialized');
        }
      }
    });
    initialized = true;
  } else if (import.meta.env.DEV) {
    console.warn('PostHog API key not found. Analytics will be disabled.');
  }
}

export function trackPagination(listName: string, event: 'navigate' | 'change_page_size', data: { page?: number; pageSize: number }) {
  if (!initialized) return;
  
  const eventName = event === 'navigate' ? 'pagination_navigate' : 'pagination_change_page_size';
  posthog.capture(eventName, {
    list: listName,
    ...data
  });
}

// Export posthog instance for direct use if needed
export default posthog;
