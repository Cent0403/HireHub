import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

interface CreateJobProps {
  onJobCreated: () => void;
}

export default function CreateJob({ onJobCreated }: CreateJobProps) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    salario_minimo: '',
    salario_maximo: '',
    tipo_trabajo: 'PRESENCIAL',
    ubicacion: '',
    experiencia_requerida: '',
    tags: '',
  });

  const apiBase = import.meta.env.VITE_API_URL as string;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const jobData = {
      id_empresa: user?.id_usuario,
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      salario_minimo: formData.salario_minimo ? parseInt(formData.salario_minimo) : null,
      salario_maximo: formData.salario_maximo ? parseInt(formData.salario_maximo) : null,
      tipo_trabajo: formData.tipo_trabajo,
      ubicacion: formData.ubicacion,
      experiencia_requerida: formData.experiencia_requerida || null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
      estado: 'ACTIVO',
    };

    try {
      const res = await fetch(`${apiBase}/trabajo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (res.ok) {
        toast.success('Trabajo publicado correctamente');
        setFormData({
          titulo: '',
          descripcion: '',
          salario_minimo: '',
          salario_maximo: '',
          tipo_trabajo: 'PRESENCIAL',
          ubicacion: '',
          experiencia_requerida: '',
          tags: '',
        });
        onJobCreated();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || 'Error al publicar el trabajo');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Trabajo *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="ej. Desarrollador Full Stack"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[150px]"
              required
              placeholder="Describe el puesto, responsabilidades y requisitos..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salario Mínimo
              </label>
              <input
                type="number"
                value={formData.salario_minimo}
                onChange={(e) => setFormData({ ...formData, salario_minimo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salario Máximo
              </label>
              <input
                type="number"
                value={formData.salario_maximo}
                onChange={(e) => setFormData({ ...formData, salario_maximo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Trabajo *
              </label>
              <select
                value={formData.tipo_trabajo}
                onChange={(e) => setFormData({ ...formData, tipo_trabajo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="PRESENCIAL">Presencial</option>
                <option value="VIRTUAL">Virtual</option>
                <option value="HIBRIDO">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="ej. San Salvador, El Salvador"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiencia Requerida (años)
            </label>
            <input
              type="number"
              min="0"
              value={formData.experiencia_requerida}
              onChange={(e) => setFormData({ ...formData, experiencia_requerida: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0 = Sin experiencia requerida"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ej. React, Node.js, MongoDB"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Publicando...' : 'Publicar Trabajo'}
            </button>
            <button
              type="button"
              onClick={onJobCreated}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
