import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <header>
        <h2>Orders Manager</h2>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
