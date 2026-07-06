import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, CalendarRange, Clock, ShieldAlert, MessageSquare, Briefcase } from 'lucide-react';

export default function AdminApproval() {
  const { leaves, travels, processApproval, employees } = useApp();
  const [filterType, setFilterType] = useState('All'); // All, Leaves, Travels
  const [feedback, setFeedback] = useState({});

  const pendingLeaves = useMemo(() => leaves.filter(l => l.status === 'Pending'), [leaves]);
  const pendingTravels = useMemo(() => travels.filter(t => t.status === 'Pending'), [travels]);

  const handleApproveLeave = (id) => {
    processApproval('leave', id, 'Approved', feedback[id] || '');
    setFeedback(prev => ({ ...prev, [id]: '' }));
  };

  const handleRejectLeave = (id) => {
    processApproval('leave', id, 'Rejected', feedback[id] || '');
    setFeedback(prev => ({ ...prev, [id]: '' }));
  };

  const handleApproveTravel = (id) => {
    processApproval('travel', id, 'Approved', feedback[id] || '');
    setFeedback(prev => ({ ...prev, [id]: '' }));
  };

  const handleRejectTravel = (id) => {
    processApproval('travel', id, 'Rejected', feedback[id] || '');
    setFeedback(prev => ({ ...prev, [id]: '' }));
  };

  const handleFeedbackChange = (id, text) => {
    setFeedback(prev => ({ ...prev, [id]: text }));
  };

  // Combine items for a unified approval list
  const approvalItems = useMemo(() => {
    const items = [];
    if (filterType === 'All' || filterType === 'Leaves') {
      pendingLeaves.forEach(l => items.push({ ...l, category: 'Leave' }));
    }
    if (filterType === 'All' || filterType === 'Travels') {
      pendingTravels.forEach(t => items.push({ ...t, category: 'Travel' }));
    }
    // Sort by timestamp if available or just ID
    return items.sort((a, b) => b.id.localeCompare(a.id));
  }, [pendingLeaves, pendingTravels, filterType]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight heading-title">Portal Approval HR & Manager</h2>
          <p className="text-xs text-ragda-text-muted mt-1">Otorisasi dan persetujuan pengajuan perizinan/cuti serta dinas luar karyawan</p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider">Menunggu Persetujuan</span>
            <p className="text-2xl font-black text-white leading-none font-mono mt-2">{pendingLeaves.length + pendingTravels.length}</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider">Pengajuan Izin/Cuti</span>
            <p className="text-2xl font-black text-white leading-none font-mono mt-2">{pendingLeaves.length}</p>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
            <CalendarRange className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider">Pengajuan Dinas</span>
            <p className="text-2xl font-black text-white leading-none font-mono mt-2">{pendingTravels.length}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-ragda-border-subtle pb-4">
        {['All', 'Leaves', 'Travels'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === tab
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-ragda-text-muted hover:bg-ragda-surface-hover hover:text-white'
            }`}
          >
            {tab === 'All' ? 'Semua Pengajuan' : tab === 'Leaves' ? 'Izin & Cuti' : 'Perjalanan Dinas'}
          </button>
        ))}
      </div>

      {/* Main List */}
      <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-2xl"></div>

        <div className="space-y-6">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500 animate-pulse-slow" />
            Daftar Antrean Persetujuan
          </h3>

          {approvalItems.length === 0 ? (
            <div className="py-20 text-center text-ragda-text-muted">
              <CheckCircle2 className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="font-semibold text-xs">Semua pengajuan telah diproses. Bersih!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {approvalItems.map(item => (
                <div key={item.id} className="bg-slate-950/40 border border-ragda-border-subtle rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200 hover:border-ragda-border-standard">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-[10px] font-extrabold uppercase bg-slate-900 border border-ragda-border-standard px-2.5 py-1 rounded-md text-white">
                        {item.category === 'Leave' ? `Leave: ${item.type}` : 'Travel'}
                      </span>
                      <span className="text-xs text-white font-extrabold">
                        {employees.find(e => e.id === item.employeeId)?.name || 'Karyawan'}
                      </span>
                      <span className="text-[10px] text-ragda-text-muted">({item.employeeId})</span>
                    </div>

                    <div className="space-y-1">
                      {item.category === 'Leave' ? (
                        <p className="text-xs text-ragda-text-secondary leading-relaxed">
                          Mengajukan perizinan pada <strong>{new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                        </p>
                      ) : (
                        <p className="text-xs text-ragda-text-secondary leading-relaxed">
                          Mengajukan perjalanan dinas ke <strong>{item.destination}</strong> pada <strong>{new Date(item.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(item.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                        </p>
                      )}
                      <p className="text-xs text-ragda-text-muted italic">&ldquo;{item.reason || item.purpose}&rdquo;</p>
                    </div>

                    {/* Extra detail for Travels */}
                    {item.category === 'Travel' && (
                      <div className="flex gap-4 text-[10px] text-ragda-text-subtle font-bold bg-slate-900/60 p-2 rounded-lg border border-ragda-border-subtle w-fit">
                        <span>Transportasi: {item.transport}</span>
                        <span>Estimasi Budget: Rp {(item.budgetEstimate || 0).toLocaleString('id-ID')}</span>
                      </div>
                    )}

                    {/* Feedback input field */}
                    <div className="flex items-center gap-2 max-w-md">
                      <MessageSquare className="w-4 h-4 text-ragda-text-muted shrink-0" />
                      <input
                        type="text"
                        placeholder="Tambahkan catatan/feedback di sini..."
                        value={feedback[item.id] || ''}
                        onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-[11px] text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-row flex-col gap-2 shrink-0">
                    <button
                      onClick={() => item.category === 'Leave' ? handleRejectLeave(item.id) : handleRejectTravel(item.id)}
                      className="px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-extrabold text-xs transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      Tolak
                    </button>
                    <button
                      onClick={() => item.category === 'Leave' ? handleApproveLeave(item.id) : handleApproveTravel(item.id)}
                      className="px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-extrabold text-xs transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Setujui
                    </button>
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
