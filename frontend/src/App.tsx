import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MyOrders from './pages/MyOrders';
import AddOrder from './pages/AddOrder';
import EditOrder from './pages/EditOrder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/my-orders" replace />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="edit-order/:id" element={<EditOrder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
