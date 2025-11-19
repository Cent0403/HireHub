import { useEffect, useState } from 'react';
import JobCard from './components/JobCard';
import JobDetailModal from '../../components/JobDetailModal';
import toast from 'react-hot-toast';

interface Job {
  id_trabajo: number;
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

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    tipo: '',
    ubicacion: '',
    search: ''
  });

  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await fetch(`${apiBase}/trabajo`);
      if (res.ok) {
        const data = await res.json();
        // Filtrar solo trabajos activos
        const activeJobs = data.filter((job: Job) => job.estado === 'ACTIVO');
        setJobs(activeJobs);
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

  const handleOpenModal = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  const filteredJobs = jobs.filter(job => {
    const matchSearch = !filter.search || 
      job.titulo.toLowerCase().includes(filter.search.toLowerCase()) ||
      job.descripcion.toLowerCase().includes(filter.search.toLowerCase());
    
    const matchTipo = !filter.tipo || job.tipo_trabajo === filter.tipo;
    const matchUbicacion = !filter.ubicacion || 
      job.ubicacion.toLowerCase().includes(filter.ubicacion.toLowerCase());

    return matchSearch && matchTipo && matchUbicacion;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trabajos Disponibles
          </h1>
          <p className="text-gray-600">
            Encontramos {filteredJobs.length} oportunidades para ti
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Título o descripción..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Trabajo
              </label>
              <select
                value={filter.tipo}
                onChange={(e) => setFilter({ ...filter, tipo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="VIRTUAL">Virtual</option>
                <option value="HIBRIDO">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                placeholder="Ciudad o país..."
                value={filter.ubicacion}
                onChange={(e) => setFilter({ ...filter, ubicacion: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {(filter.search || filter.tipo || filter.ubicacion) && (
            <button
              onClick={() => setFilter({ tipo: '', ubicacion: '', search: '' })}
              className="mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Lista de trabajos */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              No se encontraron trabajos que coincidan con tu búsqueda
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id_trabajo} job={job} onOpenModal={handleOpenModal} />
            ))}
          </div>
        )}
      </div>

      {selectedJobId && (
        <JobDetailModal 
          jobId={selectedJobId} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}
