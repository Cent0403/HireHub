import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JobsHome() {
    const apiBase = (import.meta.env.VITE_API_URL as string);
    const [jobsCount, setJobsCount] = useState<number | null>(null);
    const [companiesCount, setCompaniesCount] = useState<number | null>(null);
    const [candidatesCount, setCandidatesCount] = useState<number | null>(null);
    const [newJobsCount, setNewJobsCount] = useState<number | null>(null);
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCounts() {
        try {
            const [cRes, eRes] = await Promise.all([
            fetch(`${apiBase}/usuarios/count/candidatos`),
            fetch(`${apiBase}/usuarios/count/empresas`),
            ]);
            const cData = cRes.ok ? await cRes.json().catch(() => ({})) : {};
            const eData = eRes.ok ? await eRes.json().catch(() => ({})) : {};
            setCandidatesCount(Number(cData.count ?? 3847154)); // fallback pretty number
            setCompaniesCount(Number(eData.count ?? 97354));
            setJobsCount(175324);
            setNewJobsCount(7532);
        } catch {
            setCandidatesCount(3847154);
            setCompaniesCount(97354);
            setJobsCount(175324);
            setNewJobsCount(7532);
        }
        }
        fetchCounts();
    }, [apiBase]);

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (location) params.set('location', location);
        navigate(`/search?${params.toString()}`);
    }

      
    return (
        <main className="w-full bg-gray-100 mx-auto px-60 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <section>
          <h1 className="text-4xl font-semibold mb-6">Find a job that suits your interest & skills.</h1>

          <div className="flex gap-4 mb-6">
            <div className="bg-white shadow rounded p-4 flex-1 text-center">
              <div className="text-2xl font-bold">{jobsCount?.toLocaleString() ?? '1,75,324'}</div>
              <div className="text-sm text-gray-500">Live Job</div>
            </div>
            <div className="bg-white shadow rounded p-4 flex-1 text-center">
              <div className="text-2xl font-bold">{companiesCount?.toLocaleString() ?? '97,354'}</div>
              <div className="text-sm text-gray-500">Companies</div>
            </div>
            <div className="bg-white shadow rounded p-4 flex-1 text-center">
              <div className="text-2xl font-bold">{candidatesCount?.toLocaleString() ?? '3,847,154'}</div>
              <div className="text-sm text-gray-500">Candidates</div>
            </div>
            <div className="bg-white shadow rounded p-4 flex-1 text-center">
              <div className="text-2xl font-bold">{newJobsCount?.toLocaleString() ?? '7,532'}</div>
              <div className="text-sm text-gray-500">New Jobs</div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button 
              onClick={() => navigate('/jobs')} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Trabajos Disponibles
            </button>
          </div>
        </section>

        <aside className="hidden md:flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s="
            alt="hero"
            className="rounded-lg shadow-lg w-full object-cover h-110"
          />
        </aside>
      </main>
    );
}