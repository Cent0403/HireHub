import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import JobDetailModal from '../../../components/JobDetailModal';

interface Job {
  id_trabajo: number;
  titulo: string;
  tipo_trabajo: string;
  ubicacion: string;
  salario_minimo?: number;
  salario_maximo?: number;
}

interface FavoriteJob {
  id_favorito: number;
  id_candidato: number;
  id_trabajo: number;
  fecha_guardado: string;
  trabajo?: Job;
}

export default function FavoriteJobs() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<FavoriteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const res = await fetch(`${apiBase}/trabajos_favoritos`);
      if (res.ok) {
        const data: FavoriteJob[] = await res.json();
        const userFavorites = data.filter(fav => fav.id_candidato === user?.id_usuario);

        // Fetch job details for each favorite
        const favoritesWithJobs = await Promise.all(
          userFavorites.map(async (fav) => {
            try {
              const jobRes = await fetch(`${apiBase}/trabajo/${fav.id_trabajo}`);
              if (jobRes.ok) {
                const job = await jobRes.json();
                return { ...fav, trabajo: job };
              }
              return fav;
            } catch {
              return fav;
            }
          })
        );

        setFavorites(favoritesWithJobs);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      toast.error('Error al cargar trabajos favoritos');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(id_trabajo: number) {
    try {
      const res = await fetch(`${apiBase}/trabajos_favoritos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_candidato: user?.id_usuario, id_trabajo }),
      });

      if (res.ok) {
        toast.success('Trabajo eliminado de favoritos');
        setFavorites(favorites.filter(fav => fav.id_trabajo !== id_trabajo));
      } else {
        toast.error('Error al eliminar favorito');
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Error al eliminar favorito');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <p className="text-gray-600 text-lg mb-2">No tienes trabajos guardados</p>
        <p className="text-gray-500 text-sm">Explora ofertas y guarda las que te interesen</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => {
        const job = favorite.trabajo;
        if (!job) return null;

        return (
          <div key={favorite.id_favorito} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div 
                className="flex-1 cursor-pointer" 
                onClick={() => {
                  setSelectedJobId(job.id_trabajo);
                  setIsModalOpen(true);
                }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.titulo}</h3>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
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
                
                {job.salario_minimo && job.salario_maximo && (
                  <p className="text-lg font-semibold text-blue-600">
                    ${job.salario_minimo.toLocaleString()} - ${job.salario_maximo.toLocaleString()}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleRemoveFavorite(job.id_trabajo)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar de favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      {selectedJobId && (
        <JobDetailModal
          jobId={selectedJobId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedJobId(null);
            fetchFavorites(); // Refresh to update favorite status
          }}
        />
      )}
    </div>
  );
}
