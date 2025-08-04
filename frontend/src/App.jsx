import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
import Admin from './pages/AdminDashboard';
import Forbidden from './pages/Forbidden';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
         <Route path="/register" element={<Register />} />
         <Route path="/unauthorized" element={<Unauthorized /> } />
         <Route path="/admin" element={<Admin /> } />
         <Route path="/forbidden" element={<Forbidden /> } />
      </Routes>
    </Router>
  );
}