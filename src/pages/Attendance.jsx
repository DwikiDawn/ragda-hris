import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, MapPin, Printer } from 'lucide-react';

export default function Attendance() {
  const { currentUser, attendance } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Indon month names
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const userAttendance = useMemo(() => {
    return attendance.filter(rec => {
      const recDate = new Date(rec.date);
      return rec.employeeId === currentUser.id && recDate.getMonth() === selectedMonth;
    });
  }, [attendance, currentUser.id, selectedMonth]);

  const stats = useMemo(() => {
    let onTime = 0;
    let late = 0;
    let businessTravel = 0;

    userAttendance.forEach(rec => {
      if (rec.status === 'Tepat Waktu') onTime++;
      else if (rec.status === 'Terlambat') late++;
      else if (rec.status === 'Perjalanan Dinas') businessTravel++;
    });

    return { onTime, late, businessTravel, total: userAttendance.length };
  }, [userAttendance]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Tepat Waktu':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Terlambat':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight heading-title">Log Kehadiran Bulanan</h2>
          <p className="text-xs text-ragda-text-muted mt-1">Rekam jejak kehadiran harian, waktu check-in, dan log lokasi verifikasi</p>
        </div>

        {/* Print Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-ragda-border-standard bg-slate-950/60 hover:bg-slate-900 text-xs font-bold text-white transition-colors"
          >
            <Printer className="w-4 h-4 text-ragda-text-muted" />
            Cetak Log
          </button>
        </div>
      </div>

      {/* Month Filter Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-thin">
        {months.map((m, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedMonth(idx)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedMonth === idx
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-ragda-text-muted hover:bg-ragda-surface-hover hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider">Total Hari Kerja</span>
            <p className="text-2xl font-black text-white leading-none font-mono mt-2">{stats.total}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider">Tepat Waktu</span>
            <p className="text-2xl font-black text-emerald-400 leading-none font-mono mt-2">{stats.onTime}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider">Terlambat</span>
            <p className="text-2xl font-black text-red-400 leading-none font-mono mt-2">{stats.late}</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider">Dinas Luar (Visit)</span>
            <p className="text-2xl font-black text-amber-500 leading-none font-mono mt-2">{stats.businessTravel}</p>
          </div>
        </div>
      </div>

      {/* Attendance Log Table */}
      <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-2xl"></div>

        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-amber-500" />
            Riwayat Presensi {months[selectedMonth]} {new Date().getFullYear()}
          </h3>

          {userAttendance.length === 0 ? (
            <div className="py-20 text-center text-ragda-text-muted">
              <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="font-semibold text-xs">Belum ada riwayat presensi di bulan ini</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {userAttendance.map(rec => (
                <div key={rec.id} className="bg-slate-950/40 border border-ragda-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-extrabold font-mono">
                        {new Date(rec.date).toLocaleDateString('id-ID', { day: 'numeric', weekday: 'short' })}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">|</span>
                      <span className="text-xs text-ragda-text-secondary font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {rec.location}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 text-[10px] text-ragda-text-subtle font-bold">
                      <span>Check In: <strong className="text-white font-mono">{rec.checkIn}</strong></span>
                      <span>Check Out: <strong className="text-white font-mono">{rec.checkOut || '-- : --'}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusStyle(rec.status)}`}>
                      {rec.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
