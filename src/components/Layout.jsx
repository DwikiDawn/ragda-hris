import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Shield, LayoutDashboard, Clock, CalendarRange, Briefcase, FileSearch, UserCheck, Menu, X, Settings, Sun, Moon, LogOut, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, employees, switchUser, theme, toggleTheme, logout, updateEmployeeRole } = useApp();
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
    <div className="min-h-screen bg-ragda-primary dark:bg-slate-900 flex flex-col md:flex-row text-ragda-text-primary dark:text-slate-100 selection:bg-ragda-accent/20 selection:text-ragda-accent transition-colors duration-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-ragda-secondary dark:bg-slate-950 border-r border-ragda-border-subtle flex-col justify-between shrink-0 sticky top-0 h-screen z-30">
        <div className="p-6 flex flex-col h-full justify-between">
          <div>
            {/* Co-Branding Logo */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="bg-ragda-accent/10 border border-ragda-accent/30 p-2 rounded-xl text-ragda-accent relative group overflow-hidden">
                  <div className="absolute inset-0 bg-ragda-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Shield className="w-5 h-5 relative z-10" />
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight leading-none text-slate-900 dark:text-white">RAGDA-HRIS</h1>
                  <p className="text-[9px] text-ragda-text-muted font-bold uppercase mt-1 tracking-widest">Internal Portal</p>
                </div>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-ragda-surface-hover hover:text-ragda-accent text-ragda-text-muted transition-all"
                title={theme === 'dark' ? 'Aktifkan Light Mode' : 'Aktifkan Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
              </button>
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-ragda-accent text-white shadow-lg shadow-ragda-accent/25'
                        : 'text-ragda-text-muted hover:bg-ragda-surface-hover hover:text-slate-900 dark:hover:text-white dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-ragda-text-muted'}`} />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Settings & Account Panel */}
          <div>
            <div className="glass-card bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 relative overflow-hidden mb-4">
              <div className="flex justify-between items-start">
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-ragda-text-muted uppercase font-bold tracking-wider">Aktif Profile</span>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs mt-1 leading-tight truncate">{currentUser.name}</h3>
                  <p className="text-[10px] text-ragda-accent font-extrabold mt-0.5">{currentUser.role === 'HR/Manager' ? 'HR / Administrator' : 'Staff Karyawan'}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-1 text-ragda-text-muted hover:text-ragda-accent transition-colors"
                    title="Developer & RBAC Settings"
                  >
                    <Settings className={`w-4 h-4 ${showSettings ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={logout}
                    className="p-1 text-ragda-text-muted hover:text-red-500 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Panel Switch QA & RBAC management */}
              {showSettings && (
                <div className="mt-3 pt-3 border-t border-ragda-border-subtle animate-fadeIn space-y-3">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Ganti Akun (Simulasi Login)</label>
                    <select
                      value={currentUser.id}
                      onChange={(e) => { switchUser(e.target.value); navigate('/'); }}
                      className="w-full bg-white dark:bg-slate-850 border border-ragda-border-standard text-[10px] text-slate-800 dark:text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-ragda-accent"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Manajemen RBAC (Standard)</label>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateEmployeeRole(currentUser.id, 'HR/Manager')}
                        disabled={currentUser.role === 'HR/Manager'}
                        className="flex-1 bg-ragda-accent hover:bg-ragda-accent-hover text-white disabled:opacity-40 disabled:hover:bg-ragda-accent font-extrabold text-[8px] py-1 px-1.5 rounded uppercase"
                      >
                        Set HR/Admin
                      </button>
                      <button
                        onClick={() => updateEmployeeRole(currentUser.id, 'Karyawan')}
                        disabled={currentUser.role === 'Karyawan'}
                        className="flex-1 bg-slate-650 hover:bg-slate-700 text-slate-900 dark:text-white disabled:opacity-40 font-extrabold text-[8px] py-1 px-1.5 rounded uppercase border border-ragda-border-standard"
                      >
                        Set Karyawan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <p className="text-[9px] text-ragda-text-subtle font-bold">&copy; {new Date().getFullYear()} PT Ragdalion</p>
              <div className="inline-flex items-center gap-1 text-[8px] text-slate-500 dark:text-slate-600 uppercase tracking-widest font-extrabold">
                <ShieldAlert className="w-2.5 h-2.5" /> ISO 27001 ISMS Compliant
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden bg-ragda-secondary dark:bg-slate-950 border-b border-ragda-border-subtle p-4 sticky top-0 z-50 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="bg-ragda-accent/10 border border-ragda-accent/30 p-1.5 rounded-lg text-ragda-accent">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-black text-slate-900 dark:text-white leading-none tracking-tight">RAGDA-HRIS</h1>
            <p className="text-[8px] text-ragda-text-muted mt-0.5 uppercase tracking-widest font-bold">Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-ragda-surface-hover text-ragda-text-muted transition-all mr-1"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-450" /> : <Moon className="w-3.5 h-3.5 text-blue-600" />}
          </button>
          
          <select
            value={currentUser.id}
            onChange={(e) => { switchUser(e.target.value); navigate('/'); }}
            className="bg-white dark:bg-slate-900 border border-ragda-border-standard text-[9px] text-slate-800 dark:text-white rounded-lg px-2 py-1 focus:outline-none"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name.split(' ')[0]} ({emp.role})</option>
            ))}
          </select>
          
          <button className="text-slate-800 dark:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Links */}
        {mobileOpen && (
          <div className="absolute top-full left-0 right-0 bg-ragda-secondary dark:bg-slate-950 border-b border-ragda-border-subtle p-4 space-y-1 shadow-2xl flex flex-col animate-fadeIn">
            {menuItems.map((item, idx) => {
              if (item.role !== 'All' && currentUser.role !== item.role) return null;
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive(item.path)
                      ? 'bg-ragda-accent text-white'
                      : 'text-ragda-text-muted hover:bg-ragda-surface-hover dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </button>
              );
            })}
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Keluar Sesi (Logout)
            </button>
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
