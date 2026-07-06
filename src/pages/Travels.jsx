import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Plus, FileText, CheckCircle, Clock, XCircle, ShieldCheck, History } from 'lucide-react';
import { HOTSPOT_GEOFENCES } from '../data/mockData';

export default function Travels() {
  const { currentUser, travels, submitTravel } = useApp();
  const [destination, setDestination] = useState('HO Jababeka Cikarang');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [transport, setTransport] = useState('Kendaraan Operasional');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoized user specific travels (Pending & Finished)
  const pendingTravels = useMemo(() => {
    return travels.filter(t => t.employeeId === currentUser.id && t.status === 'Pending');
  }, [travels, currentUser.id]);

  const historyTravels = useMemo(() => {
    return travels.filter(t => t.employeeId === currentUser.id && t.status !== 'Pending');
  }, [travels, currentUser.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !purpose) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitTravel({
        destination,
        startDate,
        endDate,
        purpose,
        transport,
        budgetEstimate: budget ? parseFloat(budget) : 0
      });
      setStartDate('');
      setEndDate('');
      setPurpose('');
      setBudget('');
      setIsSubmitting(false);
    }, 400);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight heading-title">Perjalanan Dinas (Business Travel)</h2>
          <p className="text-xs text-ragda-text-muted mt-1">Formulir pengajuan tugas luar kota, kunjungan plant customer, dan akomodasi perjalanan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Request */}
        <div className="glass-card bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden h-fit">
          
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Plus className="w-4 h-4 text-ragda-accent dark:text-sky-400" />
            Formulir Dinas Luar
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                Destinasi / Customer Plant
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full glass-input rounded-xl text-xs p-3.5 focus:outline-none dark:bg-slate-900"
              >
                <option value="HO Jababeka Cikarang">Jababeka Cikarang (Head Office)</option>
                {HOTSPOT_GEOFENCES.map(hs => (
                  <option key={hs.id} value={hs.name}>{hs.name}</option>
                ))}
                <option value="Lainnya">Lainnya / Luar Kota</option>
              </select>
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
                  className="w-full glass-input rounded-xl text-xs p-3.5 focus:outline-none dark:bg-slate-900"
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
                  className="w-full glass-input rounded-xl text-xs p-3.5 focus:outline-none dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                  Moda Transportasi
                </label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full glass-input rounded-xl text-xs p-3.5 focus:outline-none dark:bg-slate-900"
                >
                  <option value="Kendaraan Operasional">Mobil Operasional Ragdalion</option>
                  <option value="Umum / Kereta">Transportasi Umum (KRL/Kereta)</option>
                  <option value="Pesawat Terbang">Pesawat Terbang (Luar Pulau)</option>
                  <option value="Kendaraan Pribadi">Kendaraan Pribadi (Claim Bensin)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                  Estimasi Budget (Rp)
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 500000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full glass-input rounded-xl text-xs p-3.5 focus:outline-none dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                Tujuan / Agenda Dinas
              </label>
              <textarea
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Tulis detail agenda meeting, instalasi, audit IoT, atau kunjungan..."
                rows="3"
                className="w-full glass-input rounded-xl text-xs p-3.5 focus:outline-none resize-none dark:bg-slate-900"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-ragda-accent hover:bg-ragda-accent-hover text-white font-extrabold text-xs py-4 rounded-xl transition-all duration-300 shadow-lg shadow-ragda-accent/10 uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </form>
        </div>

        {/* History Tracker */}
        <div className="glass-card bg-white dark:bg-slate-800 rounded-3xl p-6 lg:col-span-2 shadow-xl relative overflow-hidden flex flex-col justify-between">
          
          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-ragda-accent dark:text-sky-400" />
              Tracker Status Perjalanan Dinas
            </h3>

            {pendingTravels.length === 0 && historyTravels.length === 0 ? (
              <div className="py-16 text-center text-ragda-text-muted">
                <Compass className="w-12 h-12 text-slate-400 dark:text-slate-705 mx-auto mb-3" />
                <p className="font-semibold text-xs">Belum ada pengajuan perjalanan dinas</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[480px] overflow-y-auto pr-1">
                {/* Active Pending Section */}
                {pendingTravels.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] text-ragda-text-muted font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Pengajuan Aktif (Pending)
                    </h4>
                    <div className="space-y-2">
                      {pendingTravels.map(travel => (
                        <div key={travel.id} className="bg-slate-50 dark:bg-slate-950/40 border border-ragda-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase bg-white dark:bg-slate-900 border border-ragda-border-standard px-2.5 py-1 rounded-md text-slate-800 dark:text-slate-200">
                                {travel.destination}
                              </span>
                              <span className="text-xs font-bold">
                                {new Date(travel.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(travel.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-xs text-ragda-text-muted italic">&ldquo;{travel.purpose}&rdquo;</p>
                            <div className="flex gap-4 text-[9px] text-ragda-text-subtle font-bold">
                              <span>Transport: {travel.transport}</span>
                              {travel.budgetEstimate > 0 && <span>Budget: Rp {travel.budgetEstimate.toLocaleString('id-ID')}</span>}
                            </div>
                          </div>
                          <div className="shrink-0">
                            {getStatusBadge(travel.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* History Finished Section */}
                {historyTravels.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-ragda-border-subtle">
                    <h4 className="text-[10px] text-ragda-text-muted font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5 text-ragda-accent" /> Riwayat Selesai
                    </h4>
                    <div className="space-y-2">
                      {historyTravels.map(travel => (
                        <div key={travel.id} className="bg-slate-50/60 dark:bg-slate-950/20 border border-ragda-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 opacity-85">
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase bg-white dark:bg-slate-900 border border-ragda-border-standard px-2.5 py-1 rounded-md text-slate-800 dark:text-slate-200">
                                {travel.destination}
                              </span>
                              <span className="text-xs font-bold">
                                {new Date(travel.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(travel.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-xs text-ragda-text-muted italic">&ldquo;{travel.purpose}&rdquo;</p>
                            {travel.approvedBy && (
                              <p className="text-[10px] text-ragda-text-subtle font-semibold flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                                Diproses oleh {travel.approvedBy} {travel.feedback && `(${travel.feedback})`}
                              </p>
                            )}
                          </div>
                          <div className="shrink-0">
                            {getStatusBadge(travel.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
