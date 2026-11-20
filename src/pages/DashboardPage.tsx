import LogoutButton from "@/components/LogoutButton";
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
