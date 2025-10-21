// TypeScript interfaces for funnel data
export interface FunnelStep {
  id: string;
  name: string;
  entered: number;
  converted: number;
  dropOff: number;
  conversionRate: number;
  dropOffRate: number;
}

// Mock data for onboarding funnel steps
const mockFunnelSteps: FunnelStep[] = [
  {
    id: 'signup-started',
    name: 'Sign Up Started',
    entered: 1000,
    converted: 850,
    dropOff: 150,
    conversionRate: 85.0,
    dropOffRate: 15.0
  },
  {
    id: 'signup-completed',
    name: 'Sign Up Completed',
    entered: 850,
    converted: 720,
    dropOff: 130,
    conversionRate: 84.7,
    dropOffRate: 15.3
  },
  {
    id: 'email-verified',
    name: 'Email Verified',
    entered: 720,
    converted: 680,
    dropOff: 40,
    conversionRate: 94.4,
    dropOffRate: 5.6
  },
  {
    id: 'first-upload',
    name: 'First Upload',
    entered: 680,
    converted: 520,
    dropOff: 160,
    conversionRate: 76.5,
    dropOffRate: 23.5
  },
  {
    id: 'profile-completed',
    name: 'Profile Completed',
    entered: 520,
    converted: 480,
    dropOff: 40,
    conversionRate: 92.3,
    dropOffRate: 7.7
  }
];

/**
 * Mock API function to get onboarding funnel data
 * Simulates network delay with Promise-based async function
 */
export const getOnboardingFunnelData = async (): Promise<FunnelStep[]> => {
  return new Promise((resolve) => {
    // Simulate network delay (500-1500ms)
    const delay = Math.random() * 1000 + 500;
    
    setTimeout(() => {
      resolve([...mockFunnelSteps]);
    }, delay);
  });
};
