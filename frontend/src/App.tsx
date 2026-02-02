import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MyOrders from './pages/MyOrders';
import AddOrder from './pages/AddOrder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/my-orders" replace />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="add-order" element={<AddOrder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
