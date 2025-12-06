
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  Menu, 
  X, 
  LogOut, 
  Bell,
  Search,
  Settings
} from 'lucide-react';
import { DashboardTab, AppSettings, User, UserRole } from '../types';
import DashboardViews from './DashboardViews';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for customization - Default Black & Gold
  const [appSettings, setAppSettings] = useState<AppSettings>({
    clinicName: 'Clínica do Futuro',
    logoUrl: 'https://i.imgur.com/393Jk3S.png',
    primaryColor: '#d4af37' // Gold
  });

  // Apply primary color to CSS variable for dynamic theming
  React.useEffect(() => {
    document.documentElement.style.setProperty('--color-brand-600', appSettings.primaryColor);
  }, [appSettings.primaryColor]);

  // Define navigation based on User Role
  const allNavItems = [
    { id: DashboardTab.OVERVIEW, label: 'Visão Geral', icon: <LayoutDashboard className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.DENTIST, UserRole.SECRETARY] },
    { id: DashboardTab.SCHEDULE, label: 'Agenda', icon: <Calendar className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.DENTIST, UserRole.SECRETARY] },
    { id: DashboardTab.PATIENTS, label: 'Pacientes', icon: <Users className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.DENTIST, UserRole.SECRETARY] },
    { id: DashboardTab.ANAMNESIS, label: 'Prontuários', icon: <FileText className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.DENTIST, UserRole.SECRETARY] },
    { id: DashboardTab.FINANCIAL, label: 'Financeiro', icon: <DollarSign className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.SECRETARY] }, // Admin and Secretary
    { id: DashboardTab.SETTINGS, label: 'Configurações', icon: <Settings className="w-5 h-5" />, roles: [UserRole.ADMIN, UserRole.SECRETARY] }, // Admin and Secretary (limited)
  ];

  const visibleNavItems = allNavItems.filter(item => item.roles.includes(currentUser.role));

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex marble-bg">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar - Themed Black/Gold */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col shadow-2xl`}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between h-20 bg-slate-950">
           <div className="flex items-center space-x-2 overflow-hidden">
              {appSettings.logoUrl ? (
                <img 
                  src={appSettings.logoUrl} 
                  alt={appSettings.clinicName} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-brand-400 font-bold text-lg truncate">{appSettings.clinicName}</span>
              )}
           </div>
           <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
             <X className="w-6 h-6" />
           </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                closeSidebar();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-900/50'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-brand-400'
              }`}
            >
              <span className={activeTab === item.id ? 'text-white' : ''}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
           {/* User Profile Snippet in Sidebar */}
           <div className="flex items-center space-x-3 mb-4 px-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
              <img src={currentUser.avatarUrl} alt="User" className="w-8 h-8 rounded-full bg-slate-800 border border-brand-700" />
              <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-brand-50 truncate">{currentUser.name}</p>
                 <p className="text-xs text-brand-500 truncate">
                   {currentUser.role === UserRole.ADMIN ? 'Administrador' : currentUser.role === UserRole.DENTIST ? currentUser.specialty : 'Secretaria'}
                 </p>
              </div>
           </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 truncate flex items-center">
              <span className="w-2 h-6 bg-brand-500 rounded-full mr-3 hidden sm:block"></span>
              {visibleNavItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
             <div className="relative hidden md:block group">
               <input 
                 type="text" 
                 placeholder="Buscar pacientes..." 
                 className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 transition-all group-hover:w-72"
               />
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
             </div>
             <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <DashboardViews 
            activeTab={activeTab} 
            appSettings={appSettings} 
            setAppSettings={setAppSettings}
            currentUser={currentUser}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;