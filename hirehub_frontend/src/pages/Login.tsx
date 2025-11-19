import { useState, useContext, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [username, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidatosCount, setCandidatosCount] = useState<number | null>(null);
  const [empresasCount, setEmpresasCount] = useState<number | null>(null);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const apiBase = (import.meta.env.VITE_API_URL as string);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [cRes, eRes] = await Promise.all([
          fetch(`${apiBase}/usuarios/count/candidatos`),
          fetch(`${apiBase}/usuarios/count/empresas`),
        ]);
        if (cRes.ok) {
          const cData = await cRes.json().catch(() => ({}));
          setCandidatosCount(Number(cData.count ?? 0));
        } else {
          setCandidatosCount(0);
        }
        if (eRes.ok) {
          const eData = await eRes.json().catch(() => ({}));
          setEmpresasCount(Number(eData.count ?? 0));
        } else {
          setEmpresasCount(0);
        }
      } catch (err) {
        setCandidatosCount(0);
        setEmpresasCount(0);
      }
    }
    fetchCounts();
  }, [apiBase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !contrasena) {
      toast.error('Rellena todos los campos.');
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
    try { localStorage.setItem('token', data.token); } catch {}
    let user = data.user;
    
    if (!user) {
      try {
        const parts = data.token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          user = { ...payload, tipo: payload.tipo }; 
        }
      } catch {}
    }
    if (user) {
      try { 
        localStorage.setItem('user', JSON.stringify(user)); 
        toast.success(`¡Bienvenido, ${user.usuario}!`);
        
        if (user.tipo === 'EMPRESA') {
          navigate('/employer/dashboard'); 
        } else if (user.tipo === 'CANDIDATO') {
          navigate('/candidate/dashboard');
        } else {
          navigate('/'); 
        }
        
        } catch {}
      } else {
          navigate('/'); 
      }
    } else {
        toast.error(data?.message || 'Credenciales incorrectas.');
      }
    } catch (err) {
      toast.error('No se pudo conectar al servidor. Revisa que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - form */}
      <div className="w-full md:w-1/2 bg-white p-8 md:px-30 md:py-20 flex flex-col justify-center">
        <header className="mb-6">
          <div className="text-blue-600 font-bold text-xl">HireHub</div>
        </header>

        <main className="max-w-xl w-full">
          <h1 className="text-2xl font-semibold mb-1">Log In</h1>
          <p className="text-sm text-gray-500 mb-6">
            Don't have account? <Link to="/register" className="text-blue-600">Create Account</Link>
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              value={username}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              placeholder="Usuario"
              type="text"
            />

            <input
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              placeholder="Contraseña"
              type="password"
            />


            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium"
            >
              {loading ? 'Ingresando...' : 'Sign In'}
            </button>
          </form>
        </main>
      </div>

      <aside
        className="hidden md:flex w-1/2 items-end justify-start bg-cover bg-center p-12"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(7,11,21,0.6), rgba(7,11,21,0.6)), url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=')",
        }}
      >
        <div className="max-w-lg text-white w-full">
          <h2 className="text-3xl font-semibold mb-6 leading-tight">Over {candidatosCount ?? '175,324'} candidates waiting for good employees.</h2>

          <div className="flex gap-4">
            <div className="bg-white/5 p-4 rounded-lg text-center min-w-[100px]">
              <div className="font-bold text-lg">10,000</div>
              <div className="text-sm text-white/80">Live Job</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center min-w-[100px]">
              <div className="font-bold text-lg">{empresasCount ?? '97,354'}</div>
              <div className="text-sm text-white/80">Companies</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg text-center min-w-[100px]">
              <div className="font-bold text-lg">7,532</div>
              <div className="text-sm text-white/80">New Jobs</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}