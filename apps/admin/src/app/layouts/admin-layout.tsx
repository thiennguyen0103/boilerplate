import { Link, Outlet } from '@tanstack/react-router';

export function AdminLayout() {
  return (
    <main>
      <aside>
        <strong>Admin Starter</strong>
        <nav>
          <Link to="/">Overview</Link>
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </main>
  );
}
