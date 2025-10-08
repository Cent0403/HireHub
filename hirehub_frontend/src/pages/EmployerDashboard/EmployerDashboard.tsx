import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, User, Settings, FileText, Heart, Plus } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from './components/Sidebar'; 
import JobTable from './components/JobTable'; 
import type { Job } from './components/JobTable';


interface JobCount {
    total: number;
    activo: number;
    desactivado: number;
}

const calculateDaysRemaining = (publishDateString: string, daysToExpire = 30): number => {
    const publishDate = new Date(publishDateString);
    const today = new Date();
    
    const timeDiffMs = today.getTime() - publishDate.getTime();
    
    const daysSincePublished = Math.floor(timeDiffMs / (1000 * 60 * 60 * 24));
    
    const remaining = daysToExpire - daysSincePublished;

    return Math.max(0, remaining); 
};


const navItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/employer/overview' },
    { name: 'Employers Profile', icon: User, path: '/employer/profile' },
    { name: 'Post a Job', icon: Briefcase, path: '/employer/post-job' },
    { name: 'My Jobs', icon: FileText, path: '/employer/my-jobs', current: true },
    { name: 'Saved Candidate', icon: Heart, path: '/employer/saved-candidates' },
    { name: 'Plans & Billing', icon: FileText, path: '/employer/billing' },
    { name: 'All Companies', icon: Briefcase, path: '/employer/all-companies' },
    { name: 'Settings', icon: Settings, path: '/employer/settings' },
];


export default function EmployerDashboard() {
    const { logout } = useContext(AuthContext);
    const [jobs, setJobs] = useState<Job[]>([]); 
    const [jobCount, setJobCount] = useState<JobCount>({ total: 0, activo: 0, desactivado: 0 });
    const [loading, setLoading] = useState(true);

    const apiBase = import.meta.env.VITE_API_URL as string;
    
    const getEmpresaId = () => {
        try {
            const userString = localStorage.getItem('user');
            if (userString) {
                const user = JSON.parse(userString);
                return user.id; 
            }
        } catch (e) {
            console.error("No se pudo obtener el ID del usuario de localStorage", e);
        }
        return null;
    };
    const idEmpresa = getEmpresaId();

    useEffect(() => {
        if (!idEmpresa) {
            setLoading(false);
            return;
        }

        async function fetchJobsData() {
            setLoading(true);
            try {
                const countRes = await fetch(`${apiBase}/trabajo/empresa/count/${idEmpresa}`);
                if (countRes.ok) {
                    const countData = await countRes.json();
                    setJobCount(countData);
                }

                const jobsRes = await fetch(`${apiBase}/trabajo/empresa/${idEmpresa}`);
                if (jobsRes.ok) {
                    const jobsData: Job[] = await jobsRes.json();
                    setJobs(jobsData);
                }

            } catch (err) {
                console.error("Error al cargar datos del dashboard:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchJobsData();
    }, [apiBase, idEmpresa]);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('user'); 
    };

    const dashboardJobs: Job[] = jobs.map(job => ({
        id_trabajo: job.id_trabajo,
        titulo: job.titulo,
        tipo_trabajo: job.tipo_trabajo,
        estado: job.estado,
        fecha_publicacion: job.fecha_publicacion,

        title: job.titulo, 
        type: job.tipo_trabajo, 
        
        remaining: job.estado === 'ACTIVO' ? calculateDaysRemaining(job.fecha_publicacion) : 0,
        
        status: job.estado === 'ACTIVO' ? 'Active' : 'Expire', 
        
        applications: Math.floor(Math.random() * 1000), 
    }));


    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando trabajos...</div>;
    }


    return (
        <div className="flex min-h-screen bg-gray-50">
            
            <Sidebar 
                navItems={navItems} 
                onLogout={handleLogout} 
            />
            
            <main className="flex-1 p-6">
                
                <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">My Jobs ({jobCount.total})</h1>
                    <div className="flex items-center space-x-4">
                        <Link to="/employer/post-job" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center shadow-md hover:bg-blue-700 transition-colors">
                            <Plus className="w-4 h-4 mr-1" /> Post A Job
                        </Link>
                    </div>
                </header>
                
                <JobTable 
                    jobs={dashboardJobs} 
                    jobCount={jobCount.total} 
                />
                
            </main>
        </div>
    );
}

