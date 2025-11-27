// TypeScript interfaces for user data
export interface User {
  id: string;
  name: string;
  email: string;
  signupDate: string;
  plan: 'Free' | 'Client Plus' | 'Enterprise';
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
  uploadsCount: number;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    signupDate: '2024-01-15',
    plan: 'Client Plus',
    status: 'Active',
    lastActive: '2024-01-20',
    uploadsCount: 24
  },
  {
    id: 'user-002',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    signupDate: '2024-01-18',
    plan: 'Free',
    status: 'Active',
    lastActive: '2024-01-19',
    uploadsCount: 8
  },
  {
    id: 'user-003',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    signupDate: '2024-01-20',
    plan: 'Enterprise',
    status: 'Active',
    lastActive: '2024-01-21',
    uploadsCount: 156
  },
  {
    id: 'user-004',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    signupDate: '2024-01-12',
    plan: 'Free',
    status: 'Inactive',
    lastActive: '2024-01-15',
    uploadsCount: 3
  },
  {
    id: 'user-005',
    name: 'Eva Brown',
    email: 'eva.brown@example.com',
    signupDate: '2024-01-22',
    plan: 'Client Plus',
    status: 'Pending',
    lastActive: '2024-01-22',
    uploadsCount: 0
  }
];

/**
 * Mock API function to get users data
 * Simulates network delay with Promise-based async function
 */
export const getUsers = async (): Promise<User[]> => {
  return new Promise((resolve) => {
    // Simulate network delay (300-1200ms)
    const delay = Math.random() * 900 + 300;
    
    setTimeout(() => {
      resolve([...mockUsers]);
    }, delay);
  });
};
