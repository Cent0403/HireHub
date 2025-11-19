import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Post {
  id_publicacion: number;
  id_usuario: number;
  titulo: string;
  contenido: string;
  categoria: string;
  fecha_creacion: string;
  editado: boolean;
  nombre_completo: string;
  usuario: string;
  tipo_usuario: string;
  total_comentarios: number;
}

interface Comment {
  id_comentario: number;
  id_publicacion: number;
  id_usuario: number;
  contenido: string;
  fecha_creacion: string;
  nombre_completo: string;
  usuario: string;
  tipo_usuario: string;
}

export default function Forum() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  
  const [newPost, setNewPost] = useState({
    titulo: '',
    contenido: '',
    categoria: 'GENERAL'
  });

  const apiBase = import.meta.env.VITE_API_URL as string;

  const categories = [
    { value: 'TODOS', label: 'Todas', icon: '🌐' },
    { value: 'GENERAL', label: 'General', icon: '💬' },
    { value: 'VIRTUAL', label: 'Trabajo Remoto', icon: '💻' },
    { value: 'PRESENCIAL', label: 'Trabajo Presencial', icon: '🏢' },
    { value: 'HIBRIDO', label: 'Trabajo Híbrido', icon: '🔄' },
    { value: 'CONSEJOS', label: 'Consejos', icon: '💡' },
    { value: 'NETWORKING', label: 'Networking', icon: '🤝' }
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  async function fetchPosts() {
    try {
      const url = selectedCategory === 'TODOS' 
        ? `${apiBase}/foro`
        : `${apiBase}/foro?categoria=${selectedCategory}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
      toast.error('Error al cargar publicaciones');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreatePost() {
    if (!newPost.titulo.trim() || !newPost.contenido.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/foro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user?.id_usuario,
          ...newPost
        })
      });

      if (res.ok) {
        toast.success('Publicación creada exitosamente');
        setShowCreateModal(false);
        setNewPost({ titulo: '', contenido: '', categoria: 'GENERAL' });
        fetchPosts();
      } else {
        toast.error('Error al crear publicación');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al crear publicación');
    }
  }

  async function toggleComments(postId: number) {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      if (!comments[postId]) {
        await fetchComments(postId);
      }
    }
  }

  async function fetchComments(postId: number) {
    try {
      const res = await fetch(`${apiBase}/foro/${postId}/comentarios`);
      if (res.ok) {
        const data = await res.json();
        setComments(prev => ({ ...prev, [postId]: data }));
      }
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
    }
  }

  async function handleAddComment(postId: number) {
    const content = newComment[postId]?.trim();
    if (!content) {
      toast.error('El comentario no puede estar vacío');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/foro/${postId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user?.id_usuario,
          contenido: content
        })
      });

      if (res.ok) {
        toast.success('Comentario agregado');
        setNewComment(prev => ({ ...prev, [postId]: '' }));
        await fetchComments(postId);
        // Actualizar contador de comentarios
        setPosts(posts.map(p => 
          p.id_publicacion === postId 
            ? { ...p, total_comentarios: p.total_comentarios + 1 }
            : p
        ));
      } else {
        toast.error('Error al agregar comentario');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al agregar comentario');
    }
  }

  async function handleDeleteComment(postId: number, commentId: number) {
    try {
      const res = await fetch(`${apiBase}/foro/${postId}/comentarios/${commentId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: user?.id_usuario })
      });

      if (res.ok) {
        toast.success('Comentario eliminado');
        await fetchComments(postId);
        setPosts(posts.map(p => 
          p.id_publicacion === postId 
            ? { ...p, total_comentarios: Math.max(0, p.total_comentarios - 1) }
            : p
        ));
      } else {
        toast.error('Error al eliminar comentario');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al eliminar comentario');
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    } else if (days > 0) {
      return `hace ${days}d`;
    } else if (hours > 0) {
      return `hace ${hours}h`;
    } else if (minutes > 0) {
      return `hace ${minutes}m`;
    } else {
      return 'ahora';
    }
  }

  const getCategoryBadge = (categoria: string) => {
    const cat = categories.find(c => c.value === categoria);
    return cat ? `${cat.icon} ${cat.label}` : categoria;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Foro de Discusión</h1>
              <p className="text-gray-600">Comparte experiencias, consejos y conecta con otros profesionales</p>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nueva Publicación
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 text-lg">No hay publicaciones en esta categoría</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id_publicacion} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                {/* Post Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {post.nombre_completo.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-gray-900">{post.nombre_completo}</span>
                        <span className="text-gray-500 text-sm">@{post.usuario}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          post.tipo_usuario === 'CANDIDATO' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {post.tipo_usuario === 'CANDIDATO' ? 'Candidato' : 'Empresa'}
                        </span>
                        <span className="text-gray-400 text-sm">· {formatDate(post.fecha_creacion)}</span>
                        {post.editado && <span className="text-gray-400 text-xs">(editado)</span>}
                      </div>
                      
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-3">
                        {getCategoryBadge(post.categoria)}
                      </span>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.titulo}</h2>
                      <p className="text-gray-700 whitespace-pre-wrap">{post.contenido}</p>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => toggleComments(post.id_publicacion)}
                      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span className="font-medium">{post.total_comentarios}</span>
                      <span className="text-sm">Comentarios</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {expandedPost === post.id_publicacion && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    {/* Add Comment */}
                    {isAuthenticated && (
                      <div className="mb-6">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {user?.nombre_completo?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={newComment[post.id_publicacion] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id_publicacion]: e.target.value }))}
                              placeholder="Escribe un comentario..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
                            />
                            <button
                              onClick={() => handleAddComment(post.id_publicacion)}
                              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                            >
                              Comentar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments[post.id_publicacion]?.map(comment => (
                        <div key={comment.id_comentario} className="flex gap-3 bg-white p-4 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {comment.nombre_completo.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 text-sm">{comment.nombre_completo}</span>
                              <span className="text-gray-500 text-xs">@{comment.usuario}</span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                comment.tipo_usuario === 'CANDIDATO' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {comment.tipo_usuario === 'CANDIDATO' ? 'Candidato' : 'Empresa'}
                              </span>
                              <span className="text-gray-400 text-xs">· {formatDate(comment.fecha_creacion)}</span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.contenido}</p>
                            
                            {user?.id_usuario === comment.id_usuario && (
                              <button
                                onClick={() => handleDeleteComment(post.id_publicacion, comment.id_comentario)}
                                className="mt-2 text-red-600 hover:text-red-700 text-xs font-medium"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nueva Publicación</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={newPost.categoria}
                  onChange={(e) => setNewPost({ ...newPost, categoria: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.filter(c => c.value !== 'TODOS').map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  value={newPost.titulo}
                  onChange={(e) => setNewPost({ ...newPost, titulo: e.target.value })}
                  placeholder="Escribe un título descriptivo..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={255}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contenido</label>
                <textarea
                  value={newPost.contenido}
                  onChange={(e) => setNewPost({ ...newPost, contenido: e.target.value })}
                  placeholder="Comparte tu experiencia, pregunta o consejo..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCreatePost}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Publicar
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
