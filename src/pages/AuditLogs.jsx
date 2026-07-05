import { useApp } from '../context/AppContext';
import { ShieldCheck, Calendar, Clock, User, Info } from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs } = useApp();

  const formatTimestamp = (isoStr) => {
    const d = new Date(isoStr);
    return d.toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white">ISO 27001 Audit Logs</h2>
          <p className="text-xs text-slate-500 mt-1">Audit Trail Kepatuhan Kemanan Informasi & Aktivitas Kehadiran/Persetujuan</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          ISMS Compliant
        </div>
      </div>

      {/* ISO Warning Alert */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-start gap-4 shadow-lg">
        <Info className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <h4 className="font-extrabold text-white text-sm mb-1">Pernyataan Kepatuhan ISO 27001:2022</h4>
          Semua tindakan mutasi data, presensi kehadiran, pengajuan perizinan, dan keputusan approval direkam secara real-time ke dalam sistem Audit Trail yang aman dan terenkripsi. Log audit ini bersifat *read-only* bagi pengguna umum dan tidak dapat direkayasa. Rekaman log ini digunakan sebagai bukti kepatuhan operasional internal (ISMS A.12.4.1 - Event Logging).
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-slate-800/80">
          <h3 className="font-extrabold text-white text-md">Event Log Audit Trail</h3>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="font-semibold text-sm">Tidak ada log aktivitas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold text-xs uppercase">
                  <th className="p-4 w-52">Waktu Kejadian (WIB)</th>
                  <th className="p-4 w-44">Aktor / Pelaku</th>
                  <th className="p-4 w-60">Tindakan / Action</th>
                  <th className="p-4">Detail Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/20 text-slate-300">
                    <td className="p-4 text-slate-500">{formatTimestamp(log.timestamp)}</td>
                    <td className="p-4 font-semibold text-slate-200">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        {log.actor}
                      </span>
                    </td>
                    <td className="p-4 text-amber-500 font-bold">{log.action}</td>
                    <td className="p-4 text-slate-400">{log.target}</td>
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
