import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type User } from "../../lib/mock";
import UserFilters from "../../components/users/UserFilters";
import UsersTable from "../../components/users/UsersTable";
import UserDetailDrawer from "../../components/users/UserDetailDrawer";
import Paginator from "../../components/ui/Paginator";
import { fetchUsers } from "../../services/users";
import { trackPagination } from "../../lib/posthog";

const paginationOn = import.meta.env.VITE_FEATURE_PAGINATION !== "false";

export default function UsersList() {
  const [params, setParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const [plan, setPlan] = useState(params.get("plan") ?? "");
  const [status, setStatus] = useState(params.get("status") ?? "");
  const [selected, setSelected] = useState<User | null>(null);
  const [page, setPage] = useState(Number(params.get("page") ?? 1));
  const [pageSize, setPageSize] = useState(Number(params.get("pageSize") ?? 20));

  // Sync URL params
  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("page", String(page));
    next.set("pageSize", String(pageSize));
    if (search) next.set("search", search);
    else next.delete("search");
    if (plan) next.set("plan", plan);
    else next.delete("plan");
    if (status) next.set("status", status);
    else next.delete("status");
    setParams(next, { replace: true });
  }, [page, pageSize, search, plan, status, params, setParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (page !== 1) setPage(1);
  }, [search, plan, status]);

  // Fetch users with React Query
  const { data, isFetching } = useQuery({
    queryKey: ["users", { page, pageSize, filters: { search, plan, status } }],
    queryFn: () => fetchUsers({ page, pageSize, filters: { search, plan, status } }),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  const handlePlanChange = async (userId: string, newPlan: User["plan"]) => {
    // Optimistically update the cache
    queryClient.setQueryData(["users", { page, pageSize, filters: { search, plan, status } }], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((u: User) =>
          u.id === userId ? { ...u, plan: newPlan } : u
        ),
      };
    });
    if (selected?.id === userId) {
      setSelected((prev) => (prev ? { ...prev, plan: newPlan } : null));
    }
  };

  const handleDeactivate = (userId: string) => {
    queryClient.setQueryData(["users", { page, pageSize, filters: { search, plan, status } }], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((u: User) =>
          u.id === userId ? { ...u, is_active: false } : u
        ),
      };
    });
    if (selected?.id === userId) {
      setSelected((prev) =>
        prev ? { ...prev, is_active: false } : null
      );
    }
  };

  const handleReactivate = (userId: string) => {
    queryClient.setQueryData(["users", { page, pageSize, filters: { search, plan, status } }], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((u: User) =>
          u.id === userId ? { ...u, is_active: true } : u
        ),
      };
    });
    if (selected?.id === userId) {
      setSelected((prev) =>
        prev ? { ...prev, is_active: true } : null
      );
    }
  };

  const handleDelete = (userId: string) => {
    queryClient.setQueryData(["users", { page, pageSize, filters: { search, plan, status } }], (old: any) => {
      if (!old) return old;
      const newItems = old.items.filter((u: User) => u.id !== userId);
      return {
        ...old,
        items: newItems,
        total: Math.max(0, old.total - 1),
      };
    });
    if (selected?.id === userId) {
      setSelected(null);
    }
  };

  if (!paginationOn) {
    // Legacy behavior (fallback) - can be removed later
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Users</h1>
        <UserFilters
          search={search}
          onSearch={setSearch}
          plan={plan}
          onPlan={setPlan}
          status={status}
          onStatus={setStatus}
        />
        <UsersTable
          users={users}
          onView={setSelected}
          onPlanChange={handlePlanChange}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
          onDelete={handleDelete}
        />
        <UserDetailDrawer
          user={selected}
          onClose={() => setSelected(null)}
          onPlanChange={handlePlanChange}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
          onDelete={handleDelete}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 min-h-[60vh]">
      <h1 className="text-xl font-semibold">Users</h1>
      <UserFilters
        search={search}
        onSearch={setSearch}
        plan={plan}
        onPlan={setPlan}
        status={status}
        onStatus={setStatus}
      />
      <UsersTable
        users={users}
        onView={setSelected}
        onPlanChange={handlePlanChange}
        onDeactivate={handleDeactivate}
        onReactivate={handleReactivate}
        onDelete={handleDelete}
      />
      <Paginator
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => {
          setPage(p);
          trackPagination("users", "navigate", { page: p, pageSize });
        }}
        onPageSizeChange={(ps) => {
          setPage(1);
          setPageSize(ps);
          trackPagination("users", "change_page_size", { pageSize: ps });
        }}
        isLoading={isFetching}
      />
      <UserDetailDrawer
        user={selected}
        onClose={() => setSelected(null)}
        onPlanChange={handlePlanChange}
        onDeactivate={handleDeactivate}
        onReactivate={handleReactivate}
        onDelete={handleDelete}
      />
    </div>
  );
}