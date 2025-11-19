import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import EditJob from './EditJob';

interface Job {
  id_trabajo: number;
  titulo: string;
  descripcion?: string;
  tipo_trabajo: string;
  ubicacion: string;
  estado: string;
  fecha_publicacion: string;
  salario_minimo?: number;
  salario_maximo?: number;
  experiencia_requerida?: string;
  tags?: string[];
}

interface Application {
  id_aplicacion: number;
  id_candidato: number;
  id_trabajo: number;
  estado: string;
  fecha_aplicacion: string;
  candidato?: {
    nombre_completo: string;
    correo: string;
    usuario: string;
  };
}

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [favoriteCandidates, setFavoriteCandidates] = useState<number[]>([]);
  const { user } = useContext(AuthContext);
  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch(`${apiBase}/trabajo/empresa/${user?.id_usuario}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      } else {
        toast.error('Error al cargar los trabajos');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchApplications(jobId: number) {
    setLoadingApplications(true);
    try {
      // Cargar favoritos
      const favRes = await fetch(`${apiBase}/candidatos_favoritos`);
      if (favRes.ok) {
        const favData = await favRes.json();
        const favIds = favData
          .filter((fav: { id_empresa: number; id_candidato: number }) => fav.id_empresa === user?.id_usuario)
          .map((fav: { id_candidato: number }) => fav.id_candidato);
        setFavoriteCandidates(favIds);
      }

      const res = await fetch(`${apiBase}/aplicacion_trabajo`);
      if (res.ok) {
        const data = await res.json();
        const jobApplications = data.filter((app: Application) => app.id_trabajo === jobId);
        
        // Obtener detalles de cada candidato
        const applicationsWithCandidates = await Promise.all(
          jobApplications.map(async (app: Application) => {
            try {
              const candidateRes = await fetch(`${apiBase}/usuarios/${app.id_candidato}`);
              if (candidateRes.ok) {
                const candidateData = await candidateRes.json();
                return { ...app, candidato: candidateData };
              }
            } catch (err) {
              console.error('Error fetching candidate:', err);
            }
            return app;
          })
        );
        
        setApplications(applicationsWithCandidates);
      }
    } catch (err) {
      toast.error('Error al cargar las aplicaciones');
      console.error(err);
    } finally {
      setLoadingApplications(false);
    }
  }

  async function handleViewApplications(job: Job) {
    setSelectedJob(job);
    await fetchApplications(job.id_trabajo);
  }

  async function handleEditJob(job: Job) {
    // Primero obtenemos los detalles completos del trabajo
    try {
      const res = await fetch(`${apiBase}/trabajo/${job.id_trabajo}`);
      if (res.ok) {
        const fullJob = await res.json();
        setEditingJob(fullJob);
      } else {
        toast.error('Error al cargar los detalles del trabajo');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    }
  }

  function handleJobUpdated() {
    setEditingJob(null);
    fetchJobs();
  }

  async function handleUpdateApplicationStatus(appId: number, newStatus: 'Revisando' | 'Aceptado' | 'Denegado') {
    try {
      const res = await fetch(`${apiBase}/aplicacion_trabajo/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: newStatus })
      });

      if (res.ok) {
        toast.success(`Aplicación ${newStatus.toLowerCase()}`);
        if (selectedJob) {
          await fetchApplications(selectedJob.id_trabajo);
        }
      } else {
        toast.error('Error al actualizar la aplicación');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    }
  }

  async function handleToggleFavoriteCandidate(id_candidato: number) {
    try {
      const alreadyFavorite = favoriteCandidates.includes(id_candidato);

      if (alreadyFavorite) {
        // Remove from favorites
        const res = await fetch(`${apiBase}/candidatos_favoritos`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_empresa: user?.id_usuario, id_candidato }),
        });

        if (res.ok) {
          setFavoriteCandidates(prev => prev.filter(id => id !== id_candidato));
          toast.success('Candidato eliminado de favoritos');
        } else {
          toast.error('Error al eliminar favorito');
        }
      } else {
        // Add to favorites
        const res = await fetch(`${apiBase}/candidatos_favoritos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_empresa: user?.id_usuario, id_candidato }),
        });

        if (res.ok) {
          setFavoriteCandidates(prev => [...prev, id_candidato]);
          toast.success('Candidato guardado en favoritos');
        } else if (res.status === 409) {
          toast.error('Este candidato ya está en favoritos');
        } else {
          toast.error('Error al guardar favorito');
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toast.error('Error al actualizar favoritos');
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

  if (editingJob) {
    return (
      <EditJob 
        job={editingJob} 
        onJobUpdated={handleJobUpdated}
        onCancel={() => setEditingJob(null)}
      />
    );
  }

  if (selectedJob) {
    return (
      <div>
        <button
          onClick={() => setSelectedJob(null)}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Volver a mis trabajos
        </button>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.titulo}</h2>
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {selectedJob.tipo_trabajo}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {selectedJob.ubicacion}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Aplicaciones ({applications.length})
        </h3>

        {loadingApplications ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No hay aplicaciones para este trabajo</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id_aplicacion} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {app.candidato?.nombre_completo || app.candidato?.usuario || 'Candidato'}
                    </h4>
                    <p className="text-sm text-gray-600">{app.candidato?.correo}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Aplicado el {formatDate(app.fecha_aplicacion)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.estado)}`}>
                    {app.estado}
                  </span>
                </div>

                <div className="flex gap-3 flex-wrap">
                  {app.estado === 'Pendiente' && (
                    <button
                      onClick={() => handleUpdateApplicationStatus(app.id_aplicacion, 'Revisando')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                      Marcar como Revisando
                    </button>
                  )}
                  {(app.estado === 'Pendiente' || app.estado === 'Revisando') && (
                    <>
                      <button
                        onClick={() => handleUpdateApplicationStatus(app.id_aplicacion, 'Aceptado')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleUpdateApplicationStatus(app.id_aplicacion, 'Denegado')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleToggleFavoriteCandidate(app.id_candidato)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                      favoriteCandidates.includes(app.id_candidato)
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-transparent text-blue-700 border-2 border-blue-600 hover:bg-blue-50'
                    }`}
                    title={favoriteCandidates.includes(app.id_candidato) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={favoriteCandidates.includes(app.id_candidato) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                    {favoriteCandidates.includes(app.id_candidato) ? 'Guardado' : 'Guardar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes trabajos publicados</h3>
          <p className="text-gray-600">Comienza publicando tu primer trabajo</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id_trabajo} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.titulo}</h3>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {job.estado}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.tipo_trabajo}
                    </span>
                    {job.ubicacion && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {job.ubicacion}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleViewApplications(job)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Ver Aplicaciones
                  </button>
                </div>
              </div>
              {job.salario_minimo && job.salario_maximo && (
                <p className="text-lg font-semibold text-blue-600 mt-3">
                  ${job.salario_minimo.toLocaleString()} - ${job.salario_maximo.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Publicado el {formatDate(job.fecha_publicacion)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
