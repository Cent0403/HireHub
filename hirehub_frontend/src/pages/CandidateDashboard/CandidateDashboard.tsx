import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Applications from './components/Applications';
import Profile from './components/Profile';

type ActiveView = 'applications' | 'profile';

export default function CandidateDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('applications');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 ml-64">
        <header className="bg-white shadow-sm px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {activeView === 'applications' ? 'Mis Aplicaciones' : 'Mi Perfil'}
          </h1>
        </header>

        <main className="p-8">
          {activeView === 'applications' && <Applications />}
          {activeView === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
}
