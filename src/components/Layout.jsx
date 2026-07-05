import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, LayoutDashboard, Clock, CalendarRange, Briefcase, FileSearch, UserCheck, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, employees, switchUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, role: 'All' },
    { name: 'Kehadiran Harian', path: '/attendance', icon: Clock, role: 'All' },
    { name: 'Pengajuan Cuti / Izin', path: '/leaves', icon: CalendarRange, role: 'All' },
    { name: 'Perjalanan Dinas', path: '/travels', icon: Briefcase, role: 'All' },
    { name: 'Portal Approval HR', path: '/admin', icon: UserCheck, role: 'HR/Manager' },
    { name: 'Audit Log ISO 27001', path: '/audit-logs', icon: FileSearch, role: 'HR/Manager' },
  ];

  return (
    <div className="min-h-screen bg-ragda-primary flex flex-col md:flex-row text-ragda-text-primary selection:bg-amber-500/30 selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-ragda-secondary border-r border-ragda-border-subtle flex-col justify-between shrink-0 sticky top-0 h-screen z-30">
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            {/* Co-Branding Logo */}
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
              <div className="bg-amber-500/10 border border-amber-500/30 p-2 rounded-xl text-amber-500 relative group overflow-hidden">
                <div className="absolute inset-0 bg-amber-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Shield className="w-5 h-5 relative z-10" />
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight text-white leading-none">RAGDA-HRIS</h1>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Internal Portal</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {menuItems.map((item, idx) => {
                if (item.role !== 'All' && currentUser.role !== item.role) return null;
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      active
                        ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10'
                        : 'text-ragda-text-muted hover:bg-ragda-surface-hover hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-slate-950' : 'text-slate-500'}`} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Settings & Account Panel */}
          <div>
            <div className="glass-card rounded-2xl p-4 relative overflow-hidden mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] text-ragda-text-muted uppercase font-bold tracking-wider">Aktif Profile</span>
                  <h3 className="font-extrabold text-white text-xs mt-1 leading-tight">{currentUser.name}</h3>
                  <p className="text-[10px] text-amber-500/90 font-semibold mt-0.5">{currentUser.position}</p>
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 text-ragda-text-muted hover:text-white transition-colors"
                >
                  <Settings className={`w-4 h-4 ${showSettings ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Panel Switch QA */}
              {showSettings && (
                <div className="mt-3 pt-3 border-t border-ragda-border-subtle animate-fadeIn">
                  <label className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Ganti Profil (QA Test)</label>
                  <select
                    value={currentUser.id}
                    onChange={(e) => { switchUser(e.target.value); navigate('/'); }}
                    className="w-full bg-slate-900 border border-slate-700 text-[10px] text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-[9px] text-ragda-text-subtle font-medium">&copy; {new Date().getFullYear()} PT Ragdalion</p>
              <p className="text-[8px] text-slate-700 mt-0.5 tracking-wider uppercase">ISO 27001 ISMS Compliant</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden bg-ragda-secondary border-b border-ragda-border-subtle p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="bg-amber-500/10 border border-amber-500/30 p-1.5 rounded-lg text-amber-500">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-black text-white leading-none tracking-tight">RAGDA-HRIS</h1>
            <p className="text-[8px] text-slate-500 mt-0.5 uppercase tracking-widest">Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={currentUser.id}
            onChange={(e) => { switchUser(e.target.value); navigate('/'); }}
            className="bg-slate-900 border border-slate-800 text-[9px] text-white rounded-lg px-2 py-1 focus:outline-none"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name.split(' ')[0]} ({emp.role})</option>
            ))}
          </select>
          <button className="text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Links */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-ragda-secondary border-b border-ragda-border-subtle p-4 space-y-1 shadow-2xl flex flex-col">
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
                      : 'text-ragda-text-muted hover:bg-ragda-surface-hover'
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
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
