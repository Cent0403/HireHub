import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home/Home';
import EmployerDashboard from './pages/EmployerDashboard/EmployerDashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer/dashboard" element={<PrivateRoute element={<EmployerDashboard />} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);