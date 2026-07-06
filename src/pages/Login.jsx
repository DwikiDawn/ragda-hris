import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Mail, Lock, ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-ragda-primary dark:bg-slate-900 flex items-center justify-center p-4 selection:bg-ragda-accent/20 selection:text-ragda-accent">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-ragda-border-subtle p-8 space-y-6 relative overflow-hidden transition-all duration-300">
        
        {/* Branding */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="bg-ragda-accent/10 dark:bg-sky-500/10 border border-ragda-accent/20 dark:border-sky-500/20 p-4 rounded-3xl text-ragda-accent dark:text-sky-400">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">RAGDA-HRIS</h2>
            <p className="text-[10px] text-ragda-text-muted uppercase font-bold tracking-widest mt-1">PT Ragdalion Revolusi Industri</p>
          </div>
        </div>

        {/* Credentials hints */}
        <div className="p-4 bg-ragda-surface-hover rounded-2xl border border-ragda-border-subtle text-[11px] text-ragda-text-secondary space-y-1">
          <p className="font-extrabold uppercase text-[9px] text-ragda-accent dark:text-sky-400">Pemberitahuan Demo Akses (RBAC & Login):</p>
          <p>🔑 <strong>HR/Manager:</strong> <code>dwiky.ragda@gmail.com</code> (pass: <code>admin123</code>)</p>
          <p>🔑 <strong>Karyawan:</strong> <code>erlangga@ragdalion.com</code> (pass: <code>admin123</code>)</p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block">
              Email Karyawan
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ragda-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@ragdalion.com"
                className="w-full glass-input rounded-xl text-xs text-slate-900 dark:text-white pl-12 pr-4 py-3.5 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-ragda-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl text-xs text-slate-900 dark:text-white pl-12 pr-4 py-3.5 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ragda-accent hover:bg-ragda-accent-hover text-white font-extrabold text-xs py-4 rounded-2xl transition-all duration-200 uppercase tracking-widest shadow-lg shadow-ragda-accent/15 disabled:opacity-50"
          >
            {loading ? 'Memvalidasi...' : 'Masuk Ke Portal'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-[9px] text-ragda-text-subtle font-bold uppercase">ISO 27001 ISMS Secure Session</p>
        </div>

      </div>
    </div>
  );
}
