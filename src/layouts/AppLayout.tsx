import LogoutButton from "@/components/LogoutButton";
import { NavLink, Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-xl font-semibold"> Anime Discussion</h1>
        <nav>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground"
                : "rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }
          >
            Dashboard
          </NavLink>
        </nav>
        <LogoutButton />
      </header>
      <main className="mx-auto max-w-7xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
