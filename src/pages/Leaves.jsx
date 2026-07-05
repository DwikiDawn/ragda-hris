import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Plus, FileText, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';

export default function Leaves() {
  const { currentUser, leaves, submitLeave } = useApp();
  
  const [form, setForm] = useState({
    type: 'Cuti Tahunan',
    startDate: '',
    endDate: '',
    reason: '',
    notes: '',
  });

  const [message, setMessage] = useState('');

  // Filter current user's leaves
  const userLeaves = useMemo(() => {
    return leaves
      .filter(l => l.employeeId === currentUser.id)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [leaves, currentUser.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason) {
      setMessage('Lengkapi semua data form!');
      return;
    }
    const days = calculateDays(form.startDate, form.endDate);
    submitLeave({
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      totalDays: days,
      reason: form.reason,
      notes: form.type === 'Sakit' ? 'Surat Dokter Terlampir' : ''
    });

    setForm({
      type: 'Cuti Tahunan',
      startDate: '',
      endDate: '',
      reason: '',
      notes: '',
    });
    setMessage('Pengajuan sukses dikirim!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Pengajuan Cuti / Izin / Sakit</h2>
        <p className="text-xs text-slate-500 mt-1">Formulir digital pengajuan perizinan karyawan PT Ragdalion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg lg:col-span-1">
          <h3 className="font-extrabold text-white text-md mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Buat Pengajuan
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Kategori Izin</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500"
              >
                <option value="Cuti Tahunan">📅 Cuti Tahunan</option>
                <option value="Sakit">🤢 Sakit (Butuh Surat Keterangan)</option>
                <option value="Izin Penting">🚨 Izin Khusus / Penting</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Mulai</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Selesai</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Alasan Pengajuan</label>
              <textarea
                value={form.reason}
                onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                rows={3}
                placeholder="Tulis alasan detail pengajuan..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {form.type === 'Sakit' && (
              <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl">
                <span className="text-[10px] text-amber-500 font-extrabold uppercase block mb-1">Info Kepatuhan ISO</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Pengajuan Sakit wajib menyertakan surat keterangan medis yang di-upload atau diserahkan fisik ke HRD paling lambat 2x24 jam.
                </p>
              </div>
            )}

            {message && (
              <p className={`text-xs font-bold text-center ${message.includes('sukses') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl transition-all shadow-lg"
            >
              Kirim Pengajuan
            </button>
          </form>
        </div>

        {/* Requests List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg lg:col-span-2">
          <h3 className="font-extrabold text-white text-md mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Daftar Pengajuan Anda
          </h3>

          {userLeaves.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p className="font-semibold text-sm">Belum ada riwayat pengajuan</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {userLeaves.map(leave => (
                <div key={leave.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white text-sm">{leave.type}</h4>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Alasan: {leave.reason}</p>
                    <p className="text-[10px] text-slate-500 mt-1">Tanggal: {leave.startDate} s/d {leave.endDate} ({leave.totalDays} hari)</p>
                    {leave.approvedBy && (
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Disetujui oleh: {leave.approvedBy} {leave.notes && `(${leave.notes})`}
                      </p>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">{new Date(leave.submittedAt).toLocaleDateString('id-ID')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
