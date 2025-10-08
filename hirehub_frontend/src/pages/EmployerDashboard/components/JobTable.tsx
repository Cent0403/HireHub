import React from 'react';

export interface Job {
    id_trabajo: number;
    titulo: string;
    tipo_trabajo: 'PRESENCIAL' | 'VIRTUAL' | 'HIBRIDO';
    estado: 'ACTIVO' | 'DESACTIVADO'; 
    fecha_publicacion: string;

    title: string;
    type: string;  
    remaining: number;      
    status: 'Active' | 'Expire'; 
    applications: number;
}

interface JobTableProps {
    jobs: Job[];
    jobCount: number;
}

const JobTable: React.FC<JobTableProps> = ({ jobs }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            
            <div className="flex justify-end mb-4">
                <select className="border border-gray-300 rounded-md p-2 text-sm">
                    <option>All Jobs</option>
                    <option>Active</option>
                    <option>Expired</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr className="text-left text-xs font-semibold uppercase text-gray-500 bg-gray-50">
                            <th className="px-6 py-3">JOBS</th>
                            <th className="px-6 py-3">STATUS</th>
                            <th className="px-6 py-3 text-center">APPLICATIONS</th>
                            <th className="px-6 py-3 text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {jobs.map((job) => (
                            // 🔑 CAMBIO CLAVE: Usar job.id_trabajo en lugar de job.title para garantizar unicidad.
                            <tr key={job.id_trabajo} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {job.type} • {job.remaining} days remaining
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                        job.status === 'Active' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                                    {job.applications} Applications
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center items-center space-x-2">
                                    <button className="text-blue-600 font-medium px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                                        View Applications
                                    </button>
                                    
                                    <button className="text-gray-400 hover:text-gray-600 relative p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobTable;