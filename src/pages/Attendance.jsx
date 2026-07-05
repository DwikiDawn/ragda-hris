import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Calendar, MapPin, CheckCircle, AlertCircle, FileSpreadsheet, Printer } from 'lucide-react';

export default function Attendance() {
  const { currentUser, attendance } = useApp();
  const [filterMonth, setFilterMonth] = useState('07'); // Default to July

  // Filter user attendance for the selected month
  const userLogs = useMemo(() => {
    return attendance
      .filter(rec => rec.employeeId === currentUser.id && rec.date.split('-')[1] === filterMonth)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [attendance, currentUser.id, filterMonth]);

  const stats = useMemo(() => {
    let onTime = 0;
    let late = 0;
    let businessTravel = 0;

    userLogs.forEach(log => {
      if (log.status === 'Tepat Waktu') onTime++;
      else if (log.status === 'Terlambat') late++;
      else if (log.status === 'Perjalanan Dinas') businessTravel++;
    });

    return { onTime, late, businessTravel, total: userLogs.length };
  }, [userLogs]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Tepat Waktu':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Terlambat':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      case 'Perjalanan Dinas':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/25';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white">Log Kehadiran Harian</h2>
          <p className="text-xs text-slate-500 mt-1">Daftar presensi harian karyawan PT Ragdalion</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
          >
            <option value="07">Juli 2026</option>
            <option value="06">Juni 2026</option>
            <option value="05">Mei 2026</option>
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak PDF
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Kehadiran', value: stats.total, color: 'text-white' },
          { label: 'Tepat Waktu', value: stats.onTime, color: 'text-emerald-400' },
          { label: 'Terlambat', value: stats.late, color: 'text-rose-400' },
          { label: 'Dinas / Genba', value: stats.businessTravel, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800/80">
          <h3 className="font-extrabold text-white text-md">Riwayat Log Absensi</h3>
        </div>

        {userLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-700" />
            <p className="font-semibold text-sm">Tidak ada catatan kehadiran</p>
            <p className="text-xs text-slate-600 mt-1">Belum ada absensi pada bulan terpilih.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold text-xs uppercase">
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">Jam Masuk</th>
                  <th className="p-4">Jam Keluar</th>
                  <th className="p-4">Lokasi</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/20 text-slate-300">
                    <td className="p-4 font-semibold text-xs">{log.date}</td>
                    <td className="p-4 font-mono">{log.checkIn}</td>
                    <td className="p-4 font-mono">{log.checkOut || '--:--'}</td>
                    <td className="p-4 text-xs flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {log.location}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
