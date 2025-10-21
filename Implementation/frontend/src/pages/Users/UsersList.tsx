import { useEffect, useMemo, useState } from "react";
import { type User } from "../../lib/mock";
import UserFilters from "../../components/users/UserFilters";
import UsersTable from "../../components/users/UsersTable";
import UserDetailDrawer from "../../components/users/UserDetailDrawer";
import supabase from "../../lib/supabaseClient";

export default function UsersList() {
  const [search, setSearch] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Initialize users from Supabase on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      // Use column aliases to map snake_case to the existing User type
      const { data, error } = await supabase
        .from("users")
        .select(
          `
          id,
          name,
          email,
          plan,
          status,
          createdAt:created_at,
          lastActive:last_active,
          uploads,
          onboarding
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        // Minimal handling: log and keep empty list
        console.error("Failed to fetch users:", error.message);
        return;
      }

      if (isMounted && data) {
        setUsers(data as unknown as User[]);
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle user operations
  const handlePlanChange = (userId: string, newPlan: User["plan"]) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, plan: newPlan } : user
      )
    );
    if (selected?.id === userId) {
      setSelected((prev) => (prev ? { ...prev, plan: newPlan } : null));
    }
  };

  const handleDeactivate = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: "Suspended" as const } : user
      )
    );
    if (selected?.id === userId) {
      setSelected((prev) =>
        prev ? { ...prev, status: "Suspended" as const } : null
      );
    }
  };

  const handleDelete = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    if (selected?.id === userId) {
      setSelected(null);
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchesPlan = plan === "" || u.plan === (plan as any);
      const matchesStatus = status === "" || u.status === (status as any);
      return matchesQuery && matchesPlan && matchesStatus;
    });
  }, [users, search, plan, status]);

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
        users={filtered}
        onView={setSelected}
        onPlanChange={handlePlanChange}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />
      <UserDetailDrawer
        user={selected}
        onClose={() => setSelected(null)}
        onPlanChange={handlePlanChange}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />
    </div>
  );
}
