import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface Application {
  id_aplicacion: number;
  id_candidato: number;
  id_trabajo: number;
  estado: string;
  fecha_aplicacion: string;
  trabajo?: {
    titulo: string;
    tipo_trabajo: string;
    ubicacion: string;
    salario_minimo?: number;
    salario_maximo?: number;
  };
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const res = await fetch(`${apiBase}/aplicacion_trabajo`);
      if (res.ok) {
        const data = await res.json();
        // Filtrar solo las aplicaciones del candidato actual
        const myApplications = data.filter((app: Application) => app.id_candidato === user?.id_usuario);
        
        // Obtener detalles de cada trabajo
        const applicationsWithJobs = await Promise.all(
          myApplications.map(async (app: Application) => {
            try {
              const jobRes = await fetch(`${apiBase}/trabajo/${app.id_trabajo}`);
              if (jobRes.ok) {
                const jobData = await jobRes.json();
                return { ...app, trabajo: jobData };
              }
            } catch (err) {
              console.error('Error fetching job:', err);
            }
            return app;
          })
        );
        
        setApplications(applicationsWithJobs);
      } else {
        toast.error('Error al cargar las aplicaciones');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Aceptado':
        return 'bg-green-100 text-green-800';
      case 'Revisando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-blue-100 text-blue-800';
      case 'Denegado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes aplicaciones</h3>
        <p className="text-gray-600">Comienza a aplicar a trabajos para verlos aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id_aplicacion} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
          <div className="flex justify-between items-center gap-6">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {app.trabajo?.titulo || 'Trabajo no disponible'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.estado)}`}>
                  {app.estado}
                </span>
                {app.trabajo?.tipo_trabajo && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {app.trabajo.tipo_trabajo}
                  </span>
                )}
                {app.trabajo?.ubicacion && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {app.trabajo.ubicacion}
                  </span>
                )}
              </div>
              {app.trabajo?.salario_minimo && app.trabajo?.salario_maximo && (
                <p className="text-lg font-semibold text-blue-600 whitespace-nowrap">
                  ${app.trabajo.salario_minimo.toLocaleString()} - ${app.trabajo.salario_maximo.toLocaleString()}
                </p>
              )}
            </div>
            <div className="text-right text-sm text-gray-500">
              <p>Aplicado el</p>
              <p className="font-medium">{formatDate(app.fecha_aplicacion)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
