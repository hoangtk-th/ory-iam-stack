import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Architecture } from './pages/Architecture';
import { LoginDemo } from './pages/LoginDemo';
import { AccessControl } from './pages/AccessControl';
import { Identities } from './pages/Identities';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'architecture': return <Architecture />;
      case 'login-demo': return <LoginDemo />;
      case 'access': return <AccessControl />;
      case 'identities': return <Identities />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shrink-0">
            <span className="font-bold text-white">Ory IAM</span>
            <button 
                onClick={() => setSidebarOpen(true)}
                className="text-slate-400 hover:text-white"
            >
                <Menu size={24} />
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
             {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;