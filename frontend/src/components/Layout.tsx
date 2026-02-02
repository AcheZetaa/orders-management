import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <header>
        <h2>Orders Manager</h2>
        <nav>
          <Link to="/my-orders">My Orders</Link>
          {' | '}
          <Link to="/products">Products</Link>
        </nav>
      </header>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
