import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Productos from './pages/Productos';
import Pedidos from './pages/Pedidos';
import Inventario from './pages/Inventario';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/productos" element={<Productos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/inventario" element={<Inventario />} />
      </Routes>
    </Router>
  );
}
