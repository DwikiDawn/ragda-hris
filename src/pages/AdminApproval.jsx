import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, FileText, Briefcase, Users, CalendarRange, Clock, Search } from 'lucide-react';

export default function AdminApproval() {
  const { currentUser, employees, leaves, travels, processApproval } = useApp();
  const [activeTab, setActiveTab] = useState('leaves'); // leaves or travels
  const [feedbackNote, setFeedbackNote] = useState('');
  const [activeRequestId, setActiveRequestId] = useState(null);

  const pendingLeaves = useMemo(() => {
    return leaves
      .filter(l => l.status === 'Pending')
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [leaves]);

  const pendingTravels = useMemo(() => {
    return travels
      .filter(t => t.status === 'Pending')
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [travels]);

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.name} (${emp.position})` : id;
  };

  const handleAction = (type, requestId, action) => {
    processApproval(type, requestId, action, feedbackNote);
    setFeedbackNote('');
    setActiveRequestId(null);
  };

  const formatRupiah = (val) => {
    if (!val) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(val);
  };

  if (currentUser.role !== 'HR/Manager') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        <Users className="w-16 h-16 text-rose-500/20 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-white">Akses Ditolak</h3>
        <p className="text-xs text-slate-500 mt-1">Halaman ini hanya dapat diakses oleh peran HRD atau Manager (seperti Dwiki Darmawan).</p>
        <p className="text-[10px] text-amber-500 font-semibold mt-4">Pilih profile 'Dwiki Darmawan' di menu kiri untuk mencoba portal approval ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white">Portal Approval HRD & Manager</h2>
        <p className="text-xs text-slate-500 mt-1">Kelola dan setujui pengajuan cuti, sakit, izin, dan dinas luar kota karyawan Ragdalion</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => { setActiveTab('leaves'); setActiveRequestId(null); }}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'leaves'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <CalendarRange className="w-4 h-4" />
          Pengajuan Cuti / Izin ({pendingLeaves.length})
        </button>
        <button
          onClick={() => { setActiveTab('travels'); setActiveRequestId(null); }}
          className={`flex items-center gap-2 px-6 py-3 font-semibold text-sm border-b-2 transition-all ${
            activeTab === 'travels'
              ? 'border-amber-500 text-amber-500'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Perjalanan Dinas ({pendingTravels.length})
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
        {activeTab === 'leaves' ? (
          <div>
            <h3 className="font-extrabold text-white text-md mb-4">Persetujuan Cuti, Sakit & Izin</h3>

            {pendingLeaves.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-3" />
                <p className="font-semibold text-sm">Semua pengajuan cuti sudah diproses!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingLeaves.map(leave => (
                  <div key={leave.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 px-2 py-0.5 rounded-full">{leave.type}</span>
                      <h4 className="font-bold text-white text-sm mt-2">{getEmployeeName(leave.employeeId)}</h4>
                      <p className="text-xs text-slate-400 mt-1">Alasan: {leave.reason}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">Durasi: {leave.startDate} s/d {leave.endDate} ({leave.totalDays} hari)</p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {activeRequestId === leave.id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Tulis catatan feedback..."
                            value={feedbackNote}
                            onChange={e => setFeedbackNote(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction('leave', leave.id, 'Approved')}
                              className="flex-1 bg-emerald-500 text-slate-950 font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction('leave', leave.id, 'Rejected')}
                              className="flex-1 bg-rose-500 text-white font-bold text-xs py-1.5 px-3 rounded-lg hover:bg-rose-600 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => setActiveRequestId(null)}
                              className="bg-slate-800 text-slate-400 text-xs py-1.5 px-2.5 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveRequestId(leave.id)}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-all"
                        >
                          Proses Pengajuan
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="font-extrabold text-white text-md mb-4">Persetujuan Perjalanan Dinas</h3>

            {pendingTravels.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-3" />
                <p className="font-semibold text-sm">Semua pengajuan dinas sudah diproses!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTravels.map(travel => (
                  <div key={travel.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{getEmployeeName(travel.employeeId)}</h4>
                      <p className="text-xs text-slate-400 mt-1">Destinasi: <strong className="text-white">{travel.destination}</strong></p>
                      <p className="text-xs text-slate-400 mt-0.5">Tujuan: {travel.purpose}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-slate-500">
                        <span>Tanggal: {travel.startDate} s/d {travel.endDate}</span>
                        <span>Transport: {travel.transport}</span>
                        <span className="text-amber-500 font-bold">Estimasi Budget: {formatRupiah(travel.budgetEstimate)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => processApproval('travel', travel.id, 'Approved')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs py-2 px-4 rounded-xl transition-all"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => processApproval('travel', travel.id, 'Rejected')}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
