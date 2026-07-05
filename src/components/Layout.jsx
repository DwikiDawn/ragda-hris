import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, Users, LogOut, LayoutDashboard, Clock, CalendarRange, Briefcase, FileSearch, UserCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, employees, switchUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleUserChange = (e) => {
    switchUser(e.target.value);
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, role: 'All' },
    { name: 'Kehadiran Harian', path: '/attendance', icon: Clock, role: 'All' },
    { name: 'Pengajuan Cuti / Izin', path: '/leaves', icon: CalendarRange, role: 'All' },
    { name: 'Perjalanan Dinas', path: '/travels', icon: Briefcase, role: 'All' },
    { name: 'Portal Approval HR', path: '/admin', icon: UserCheck, role: 'HR/Manager' },
    { name: 'Audit Log ISO 27001', path: '/audit-logs', icon: FileSearch, role: 'HR/Manager' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-slate-900 border-r border-slate-800 flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-amber-500 p-2 rounded-xl text-slate-950">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-md font-extrabold text-white tracking-tight leading-none">RAGDA-HRIS</h1>
              <p className="text-[10px] text-amber-500 font-bold uppercase mt-1 tracking-wider">Internal Portal</p>
            </div>
          </div>

          {/* User Profile Info */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Login Sebagai</p>
            <h3 className="font-bold text-white text-sm mt-1">{currentUser.name}</h3>
            <p className="text-xs text-amber-500/80 font-medium mt-0.5">{currentUser.position}</p>
            
            {/* Quick Profile Switch for QA */}
            <div className="mt-3 pt-3 border-t border-slate-800/80">
              <label className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Ganti Profil (Test QA)</label>
              <select
                value={currentUser.id}
                onChange={handleUserChange}
                className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item, idx) => {
              if (item.role !== 'All' && currentUser.role !== item.role) return null;
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive(item.path)
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800/60 text-center">
          <p className="text-[10px] text-slate-500 font-medium">&copy; {new Date().getFullYear()} PT Ragdalion</p>
          <p className="text-[9px] text-slate-600 mt-0.5">ISO 27001 ISMS Compliant</p>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="bg-amber-500 p-1.5 rounded-lg text-slate-950">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white leading-none">RAGDA-HRIS</h1>
            <p className="text-[9px] text-amber-500 font-bold mt-0.5 uppercase tracking-wider">Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={currentUser.id}
            onChange={handleUserChange}
            className="bg-slate-950 border border-slate-800 text-[10px] text-white rounded-lg px-2 py-1 focus:outline-none"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name.split(' ')[0]} ({emp.role})</option>
            ))}
          </select>
          <button className="text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Links */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 space-y-1 shadow-2xl flex flex-col">
            {menuItems.map((item, idx) => {
              if (item.role !== 'All' && currentUser.role !== item.role) return null;
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive(item.path)
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
