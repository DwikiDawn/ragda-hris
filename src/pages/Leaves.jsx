import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Plus, FileText, CheckCircle, Clock, XCircle, ShieldCheck } from 'lucide-react';

export default function Leaves() {
  const { currentUser, leaves, addLeave } = useApp();
  const [leaveType, setLeaveType] = useState('Cuti');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized user specific leaves list
  const userLeaves = useMemo(() => {
    return leaves.filter(l => l.employeeId === currentUser.id);
  }, [leaves, currentUser.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addLeave(leaveType, startDate, endDate, reason);
      setStartDate('');
      setEndDate('');
      setReason('');
      setIsSubmitting(false);
    }, 400);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/10 border border-red-500/20 text-red-400">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight heading-title">Pengajuan Cuti & Izin</h2>
          <p className="text-xs text-ragda-text-muted mt-1">Formulir pengajuan ketidakhadiran, cuti tahunan, dan perizinan sakit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Request */}
        <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px]"></div>
          
          <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Plus className="w-4 h-4 text-amber-500" />
            Formulir Izin / Cuti
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                Kategori Pengajuan
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Cuti', 'Sakit', 'Izin'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setLeaveType(type)}
                    className={`p-3.5 rounded-xl border text-xs font-bold transition-all ${
                      leaveType === type
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                        : 'bg-slate-950/60 border-ragda-border-subtle text-ragda-text-muted hover:border-ragda-border-standard hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full glass-input rounded-xl text-xs text-white p-3.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full glass-input rounded-xl text-xs text-white p-3.5 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                Keterangan & Alasan
              </label>
              <textarea
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tulis alasan pengajuan secara jelas..."
                rows="4"
                className="w-full glass-input rounded-xl text-xs text-white p-3.5 focus:outline-none resize-none"
              ></textarea>
            </div>

            {leaveType === 'Sakit' && (
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-ragda-border-subtle text-[10px] text-ragda-text-muted leading-relaxed flex gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Aturan ISO 27001 / HRD:</strong> Surat keterangan dokter wajib diserahkan ke bagian HRD dalam 2x24 jam sejak pengajuan dikirimkan.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </form>
        </div>

        {/* Request History Tracker */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-amber-500" />
              Tracker Status Pengajuan
            </h3>

            {userLeaves.length === 0 ? (
              <div className="py-16 text-center text-ragda-text-muted">
                <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="font-semibold text-xs">Belum ada pengajuan izin atau cuti</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {userLeaves.map(leave => (
                  <div key={leave.id} className="bg-slate-950/40 border border-ragda-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase bg-slate-900 border border-ragda-border-standard px-2.5 py-1 rounded-md text-white">
                          {leave.type}
                        </span>
                        <span className="text-xs text-white font-bold">
                          {new Date(leave.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(leave.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-ragda-text-muted italic">&ldquo;{leave.reason}&rdquo;</p>
                      {leave.approvedBy && (
                        <p className="text-[10px] text-ragda-text-subtle font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                          Approved by {leave.approvedBy} {leave.feedback && `(${leave.feedback})`}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(leave.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
