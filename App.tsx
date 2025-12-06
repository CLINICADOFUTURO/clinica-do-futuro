
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { AppView, User, UserRole } from './types';
import { ShieldCheck, User as UserIcon, Calendar, ArrowRight } from 'lucide-react';

// Mock Users for Auth Simulation
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Roberto (Admin)', role: UserRole.ADMIN, specialty: 'Implantodontia', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 'u2', name: 'Dra. Ana (Dentista)', role: UserRole.DENTIST, specialty: 'Ortodontia', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 'u3', name: 'Mariana (Secretária)', role: UserRole.SECRETARY, avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b' },
];

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLandingLoginClick = () => {
    // Skip to "Auth Screen"
    setCurrentView(AppView.DASHBOARD); 
    // Note: In this simplified flow, we are using the absence of currentUser to show the login selection
  };

  const handleLoginAs = (user: User) => {
    setCurrentUser(user);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(AppView.LANDING);
  };

  // Render Login Selection Screen if in Dashboard view but no user selected
  if (currentView === AppView.DASHBOARD && !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Acessar Sistema</h2>
            <p className="text-slate-500">Selecione um perfil para simular o acesso:</p>
          </div>
          
          <div className="space-y-3">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLoginAs(user)}
                className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition group bg-white"
              >
                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4 bg-slate-200" />
                <div className="flex-1 text-left">
                  <p className="font-bold text-slate-800 group-hover:text-brand-700">{user.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    {user.role === UserRole.ADMIN && 'Administrador'}
                    {user.role === UserRole.SECRETARY && 'Secretaria'}
                    {user.role === UserRole.DENTIST && user.specialty}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-brand-500" />
              </button>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-slate-600 underline">
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === AppView.LANDING ? (
        <LandingPage onLogin={handleLandingLoginClick} />
      ) : (
        <Dashboard 
          currentUser={currentUser!} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
}

export default App;
