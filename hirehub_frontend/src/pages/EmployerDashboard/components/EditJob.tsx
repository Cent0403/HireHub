import { useState } from 'react';
import toast from 'react-hot-toast';

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

interface EditJobProps {
  job: Job;
  onJobUpdated: () => void;
  onCancel: () => void;
}

export default function EditJob({ job, onJobUpdated, onCancel }: EditJobProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: job.titulo,
    descripcion: job.descripcion || '',
    salario_minimo: job.salario_minimo?.toString() || '',
    salario_maximo: job.salario_maximo?.toString() || '',
    tipo_trabajo: job.tipo_trabajo,
    ubicacion: job.ubicacion,
    experiencia_requerida: job.experiencia_requerida || '',
    tags: job.tags ? job.tags.join(', ') : '',
    estado: job.estado,
  });

  const apiBase = import.meta.env.VITE_API_URL as string;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const jobData = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      salario_minimo: formData.salario_minimo ? parseInt(formData.salario_minimo) : null,
      salario_maximo: formData.salario_maximo ? parseInt(formData.salario_maximo) : null,
      tipo_trabajo: formData.tipo_trabajo,
      ubicacion: formData.ubicacion,
      experiencia_requerida: formData.experiencia_requerida || null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
      estado: formData.estado,
    };

    try {
      const res = await fetch(`${apiBase}/trabajo/${job.id_trabajo}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (res.ok) {
        toast.success('Trabajo actualizado correctamente');
        onJobUpdated();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || 'Error al actualizar el trabajo');
      }
    } catch (err) {
      toast.error('No se pudo conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={onCancel}
        className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Volver
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Trabajo</h2>
        
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
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
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
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onCancel}
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
