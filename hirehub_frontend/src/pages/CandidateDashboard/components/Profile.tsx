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
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
  });
  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetchProfile();
    fetchCvInfo();
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

  async function fetchCvInfo() {
    try {
      const res = await fetch(`${apiBase}/detalles_candidato/${user?.id_usuario}`);
      if (res.ok) {
        const data = await res.json();
        setCvUrl(data.cv_url || null);
      }
    } catch (err) {
      console.error('Error al cargar información del CV:', err);
      setCvUrl(null);
    }
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no debe superar los 5MB');
      return;
    }

    setUploadingCv(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const res = await fetch(`${apiBase}/detalles_candidato/${user?.id_usuario}/cv`, {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setCvUrl(data.cv_url);
        toast.success('CV subido exitosamente');
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || 'Error al subir el CV');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setUploadingCv(false);
    }
  }

  async function handleDeleteCv() {
    if (!confirm('¿Estás seguro de que quieres eliminar tu CV?')) return;

    try {
      const res = await fetch(`${apiBase}/detalles_candidato/${user?.id_usuario}/cv`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setCvUrl(null);
        toast.success('CV eliminado exitosamente');
      } else {
        toast.error('Error al eliminar el CV');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    }
  }

  function handleDownloadCv() {
    window.open(`${apiBase}/detalles_candidato/${user?.id_usuario}/cv`, '_blank');
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
          <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
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
                Nombre Completo
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
                Nombre Completo
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

      {/* Sección de CV */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Curriculum Vitae (CV)</h2>
        
        {cvUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <div className="flex-1">
                <p className="font-medium text-gray-900">CV Disponible</p>
                <p className="text-sm text-gray-600">Tu CV está listo para que las empresas lo vean</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownloadCv}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar CV
              </button>
              <button
                onClick={handleDeleteCv}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <p className="text-gray-700 font-medium mb-2">No has subido tu CV</p>
              <p className="text-gray-500 text-sm mb-4">Sube tu CV en formato PDF para que las empresas puedan verlo</p>
              
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {uploadingCv ? 'Subiendo...' : 'Subir CV (PDF)'}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCvUpload}
                  disabled={uploadingCv}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-3">Máximo 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
