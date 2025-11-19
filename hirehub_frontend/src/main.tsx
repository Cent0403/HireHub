import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home/Home';
import Jobs from './pages/Jobs/Jobs';
import EmployerDashboard from './pages/EmployerDashboard/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard/CandidateDashboard';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/jobs" element={<MainLayout><Jobs /></MainLayout>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/employer/dashboard" element={<PrivateRoute element={<EmployerDashboard />} />} />
          <Route path="/candidate/dashboard" element={<PrivateRoute element={<CandidateDashboard />} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);