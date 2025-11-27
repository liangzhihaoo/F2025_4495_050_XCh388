import type { PageRequest, PageResponse } from "../lib/pagination";
import * as adminApi from "../lib/adminApi";

// Fetch billing metrics (MRR, ARR, ARPU, Active Subscribers, Churn Rate)
export async function fetchBillingMetrics() {
  try {
    return await adminApi.fetchBillingMetrics();
  } catch (error) {
    console.error("Error fetching billing metrics:", error);
    throw error;
  }
}

// Fetch plan distribution (Free, Client Plus, Enterprise)
export async function fetchPlanDistribution() {
  try {
    return await adminApi.fetchPlanDistribution();
  } catch (error) {
    console.error("Error fetching plan distribution:", error);
    throw error;
  }
}

// Fetch failed payments with pagination and filters
export async function fetchFailedPayments({
  page,
  pageSize,
  filters,
}: PageRequest): Promise<PageResponse<adminApi.FailedPayment>> {
  try {
    // Map filters to API format
    const apiFilters: Record<string, any> = {};

    if (filters?.plan && filters.plan !== "all") {
      apiFilters.plan = filters.plan;
    }

    if (filters?.status && filters.status !== "all") {
      apiFilters.status = filters.status;
    }

    if (filters?.q) {
      apiFilters.userEmail = filters.q;
    }

    return await adminApi.fetchFailedPayments({
      page,
      pageSize,
      filters: apiFilters,
    });
  } catch (error) {
    console.error("Error fetching failed payments:", error);
    throw error;
  }
}
