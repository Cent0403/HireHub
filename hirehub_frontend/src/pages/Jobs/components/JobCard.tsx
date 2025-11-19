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
}

interface JobCardProps {
  job: Job;
  onOpenModal: (jobId: number) => void;
}

export default function JobCard({ job, onOpenModal }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString();
  };

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

  return (
    <div 
      onClick={() => onOpenModal(job.id_trabajo)}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200 hover:border-blue-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.titulo}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
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
        <div className="text-right">
          <p className="text-sm text-gray-500">{formatDate(job.fecha_publicacion)}</p>
        </div>
      </div>
    </div>
  );
}
