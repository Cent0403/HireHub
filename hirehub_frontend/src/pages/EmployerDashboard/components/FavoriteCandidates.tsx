import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface Candidate {
  id_usuario: number;
  usuario: string;
  nombre_completo: string;
  correo: string;
}

interface FavoriteCandidate {
  id_favorito: number;
  id_empresa: number;
  id_candidato: number;
  fecha_guardado: string;
  candidato?: Candidate;
}

export default function FavoriteCandidates() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<FavoriteCandidate[]>([]);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_URL as string;

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      const res = await fetch(`${apiBase}/candidatos_favoritos`);
      if (res.ok) {
        const data: FavoriteCandidate[] = await res.json();
        const userFavorites = data.filter(fav => fav.id_empresa === user?.id_usuario);

        // Fetch candidate details for each favorite
        const favoritesWithCandidates = await Promise.all(
          userFavorites.map(async (fav) => {
            try {
              const candidateRes = await fetch(`${apiBase}/usuarios/${fav.id_candidato}`);
              if (candidateRes.ok) {
                const candidate = await candidateRes.json();
                return { ...fav, candidato: candidate };
              }
              return fav;
            } catch {
              return fav;
            }
          })
        );

        setFavorites(favoritesWithCandidates);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
      toast.error('Error al cargar candidatos favoritos');
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFavorite(id_candidato: number) {
    try {
      const res = await fetch(`${apiBase}/candidatos_favoritos`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_empresa: user?.id_usuario, id_candidato }),
      });

      if (res.ok) {
        toast.success('Candidato eliminado de favoritos');
        setFavorites(favorites.filter(fav => fav.id_candidato !== id_candidato));
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <p className="text-gray-600 text-lg mb-2">No tienes candidatos guardados</p>
        <p className="text-gray-500 text-sm">Marca candidatos como favoritos desde las aplicaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => {
        const candidate = favorite.candidato;
        if (!candidate) return null;

        return (
          <div key={favorite.id_favorito} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {candidate.nombre_completo.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {candidate.nombre_completo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">@{candidate.usuario}</p>
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    {candidate.correo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveFavorite(candidate.id_usuario)}
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
    </div>
  );
}
