import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface UserProfile {
  nombre_completo: string;
  usuario: string;
  correo: string;
  tipo: string;
}

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
  });
  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch(`${apiBase}/usuarios/${user?.id_usuario}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({
          nombre_completo: data.nombre_completo || '',
          correo: data.correo || '',
        });
      } else {
        toast.error('Error al cargar el perfil');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${apiBase}/usuarios/${user?.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success('Perfil actualizado correctamente');
        setEditing(false);
        fetchProfile();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || 'Error al actualizar el perfil');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Información de la Empresa</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Perfil
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={formData.nombre_completo}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={profile?.usuario || ''}
                disabled
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
              />
              <p className="text-xs text-gray-500 mt-1">El nombre de usuario no se puede modificar</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData({
                    nombre_completo: profile?.nombre_completo || '',
                    correo: profile?.correo || '',
                  });
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Nombre de la Empresa
              </label>
              <p className="text-lg text-gray-900">{profile?.nombre_completo || 'No especificado'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Usuario
              </label>
              <p className="text-lg text-gray-900">{profile?.usuario}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Correo Electrónico
              </label>
              <p className="text-lg text-gray-900">{profile?.correo}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Tipo de Cuenta
              </label>
              <p className="text-lg text-gray-900">{profile?.tipo}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
