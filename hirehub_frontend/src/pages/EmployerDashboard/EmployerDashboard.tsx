import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MyJobs from './components/MyJobs';
import Profile from './components/Profile';
import CreateJob from './components/CreateJob';
import FavoriteCandidates from './components/FavoriteCandidates';

type ActiveView = 'jobs' | 'profile' | 'create-job' | 'favorite-candidates';


export default function EmployerDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('jobs');

  const getTitle = () => {
    switch (activeView) {
      case 'jobs':
        return 'Mis Trabajos';
      case 'create-job':
        return 'Publicar Trabajo';
      case 'favorite-candidates':
        return 'Candidatos Favoritos';
      case 'profile':
        return 'Mi Perfil';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {getTitle()}
          </h1>
        </header>

        <main className="p-8">
          {activeView === 'jobs' && <MyJobs />}
          {activeView === 'create-job' && <CreateJob onJobCreated={() => setActiveView('jobs')} />}
          {activeView === 'favorite-candidates' && <FavoriteCandidates />}
          {activeView === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}

