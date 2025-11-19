import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Applications from './components/Applications';
import Profile from './components/Profile';
import FavoriteJobs from './components/FavoriteJobs';

type ActiveView = 'applications' | 'favorites' | 'profile';

export default function CandidateDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('applications');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {activeView === 'applications' && 'Mis Aplicaciones'}
            {activeView === 'favorites' && 'Trabajos Favoritos'}
            {activeView === 'profile' && 'Mi Perfil'}
          </h1>
        </header>

        <main className="p-8">
          {activeView === 'applications' && <Applications />}
          {activeView === 'favorites' && <FavoriteJobs />}
          {activeView === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}
