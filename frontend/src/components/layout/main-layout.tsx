import { BottomNav } from "./bottom-nav";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pb-16">{<Outlet />}</main>
      <BottomNav />
    </div>
  );
}
