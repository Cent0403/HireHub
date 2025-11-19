import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

interface Job {
  id_trabajo: number;
  id_empresa: number;
  titulo: string;
  descripcion: string;
  salario_minimo?: number;
  salario_maximo?: number;
  tipo_trabajo: string;
  ubicacion: string;
  experiencia_requerida?: string;
  tags?: string[];
  fecha_publicacion: string;
  estado: string;
}

interface JobDetailModalProps {
  jobId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobDetailModal({ jobId, isOpen, onClose }: JobDetailModalProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && jobId) {
      fetchJobDetail();
    }
  }, [isOpen, jobId]);

  async function fetchJobDetail() {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/trabajo/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
      } else {
        toast.error('Error al cargar los detalles del trabajo');
        onClose();
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salario a convenir';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `Desde $${min.toLocaleString()}`;
    if (max) return `Hasta $${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  async function handleApplyJob() {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para aplicar a este trabajo');
      onClose();
      navigate('/login');
      return;
    }

    if (user?.tipo !== 'CANDIDATO') {
      toast.error('Solo los candidatos pueden aplicar a trabajos');
      return;
    }

    setApplying(true);
    try {
      const payload = {
        id_candidato: Number(user.id_usuario),
        id_trabajo: Number(jobId),
        estado: 'Pendiente'
      };
      console.log('Enviando solicitud:', payload);
      
      const res = await fetch(`${apiBase}/aplicacion_trabajo`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success('¡Solicitud enviada exitosamente!');
        onClose();
      } else if (res.status === 409) {
        toast.error('Ya has aplicado a este trabajo anteriormente');
      } else if (res.status === 400) {
        console.error('Error de validación:', data);
        toast.error(data?.message || data?.error || 'Error de validación en los datos enviados');
      } else {
        toast.error(data?.error || 'Error al enviar la solicitud');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setApplying(false);
    }
  }

  const getTipoTrabajoColor = (tipo: string) => {
    switch (tipo) {
      case 'VIRTUAL':
        return 'bg-green-100 text-green-800';
      case 'PRESENCIAL':
        return 'bg-blue-100 text-blue-800';
      case 'HIBRIDO':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : job ? (
          <>
            {/* Header del modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {job.titulo}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoTrabajoColor(job.tipo_trabajo)}`}>
                    {job.tipo_trabajo}
                  </span>
                  {job.ubicacion && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {job.ubicacion}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="px-6 py-6 space-y-6">
              {/* Salario y Experiencia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Salario</h3>
                  <p className="text-xl font-semibold text-blue-600">
                    {formatSalary(job.salario_minimo, job.salario_maximo)}
                  </p>
                </div>
                {job.experiencia_requerida && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Experiencia Requerida</h3>
                    <p className="text-xl font-semibold text-purple-600">
                      {job.experiencia_requerida} años
                    </p>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción del puesto</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {job.descripcion}
                </p>
              </div>

              {/* Tags */}
              {job.tags && job.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Habilidades y requisitos</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Fecha de publicación */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Publicado el {formatDate(job.fecha_publicacion)}
                </p>
              </div>

              {/* Botón de aplicar */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                <button
                  onClick={handleApplyJob}
                  disabled={applying}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {applying ? 'Enviando...' : 'Aplicar a este trabajo'}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
