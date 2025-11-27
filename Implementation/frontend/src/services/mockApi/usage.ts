// TypeScript interfaces for usage data
export interface UsageRecord {
  id: string;
  date: string;
  cpuUsage: number; // CPU usage in percentage
  storageUsage: number; // Storage usage in GB
  requestCount: number; // Number of API requests
  activeUsers: number; // Number of active users
  uploadsCount: number; // Number of uploads
  bandwidthUsage: number; // Bandwidth usage in MB
}

// Mock data for usage statistics
const mockUsageRecords: UsageRecord[] = [
  {
    id: 'usage-001',
    date: '2024-01-20',
    cpuUsage: 45.2,
    storageUsage: 125.8,
    requestCount: 15420,
    activeUsers: 89,
    uploadsCount: 234,
    bandwidthUsage: 1024.5
  },
  {
    id: 'usage-002',
    date: '2024-01-19',
    cpuUsage: 52.1,
    storageUsage: 118.3,
    requestCount: 14230,
    activeUsers: 76,
    uploadsCount: 198,
    bandwidthUsage: 987.2
  },
  {
    id: 'usage-003',
    date: '2024-01-18',
    cpuUsage: 38.7,
    storageUsage: 112.5,
    requestCount: 12890,
    activeUsers: 65,
    uploadsCount: 156,
    bandwidthUsage: 756.8
  },
  {
    id: 'usage-004',
    date: '2024-01-17',
    cpuUsage: 41.3,
    storageUsage: 108.9,
    requestCount: 13560,
    activeUsers: 72,
    uploadsCount: 187,
    bandwidthUsage: 892.1
  },
  {
    id: 'usage-005',
    date: '2024-01-16',
    cpuUsage: 48.9,
    storageUsage: 115.2,
    requestCount: 16120,
    activeUsers: 84,
    uploadsCount: 267,
    bandwidthUsage: 1156.3
  }
];

/**
 * Mock API function to get usage statistics
 * Simulates network delay with Promise-based async function
 */
export const getUsageStats = async (): Promise<UsageRecord[]> => {
  return new Promise((resolve) => {
    // Simulate network delay (400-1000ms)
    const delay = Math.random() * 600 + 400;
    
    setTimeout(() => {
      resolve([...mockUsageRecords]);
    }, delay);
  });
};
