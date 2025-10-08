import React, { useState, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
export default function Login() {
  const [username, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useContext(AuthContext); 

  const apiBase = (import.meta.env.VITE_API_URL as string);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !contrasena) {
      alert('Rellena todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: username, contrasena_hash: contrasena }),
      });

      const data: { token?: string, user?: any, message?: string } = await res.json().catch(() => ({}));

      if (res.ok && data.token) {
        login(data.token);
        try {
          localStorage.setItem('token', data.token);
        } catch (err) {
        }

        let user = data.user;
        if (!user) {
          try {
            const parts = data.token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
              user = payload.user || payload;
            }
          } catch (err) {
          }
        }

        if (user) {
          try {
            localStorage.setItem('user', JSON.stringify(user));
          } catch (err) {
          }
        }

        navigate('/register'); 
      } else {
        alert(data?.message || 'Credenciales incorrectas.');
      }
    } catch (err) {
      alert('No se pudo conectar al servidor. Revisa que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold mb-6 text-center">Inicia Sesión</h1>
        
        <input 
          value={username} 
          onChange={(e) => setUsuario(e.target.value)} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4" 
          placeholder="Usuario" 
          type="text"
        />
        <input 
          value={contrasena} 
          onChange={(e) => setContrasena(e.target.value)} 
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-6" 
          placeholder="Contraseña" 
          type="password" 
        />
        
        <button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Login'}
        </button>
      </form>
    </div>
  );
}