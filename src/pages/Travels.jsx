import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Plus, FileText, CheckCircle, Clock, MapPin, DollarSign, XCircle, ShieldCheck } from 'lucide-react';
import { HOTSPOT_GEOFENCES } from '../data/mockData';

export default function Travels() {
  const { currentUser, travels, addTravel } = useApp();
  const [destination, setDestination] = useState('PT Sugity Creatives Bekasi');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [transport, setTransport] = useState('Mobil Dinas');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTravels = useMemo(() => {
    return travels.filter(t => t.employeeId === currentUser.id);
  }, [travels, currentUser.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !purpose || !estimatedBudget) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addTravel(destination, startDate, endDate, purpose, transport, Number(estimatedBudget));
      setStartDate('');
      setEndDate('');
      setPurpose('');
      setEstimatedBudget('');
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
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight heading-title">Perjalanan Dinas & Visit Plant</h2>
        <p className="text-xs text-ragda-text-muted mt-1">Formulir pengajuan perjalanan luar kota, visit customer, dan penugasan lapangan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Request */}
        <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px]"></div>

          <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2 mb-6">
            <Plus className="w-4 h-4 text-amber-500" />
            Formulir Dinas
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                Plant Tujuan (Client)
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full glass-input rounded-xl text-xs text-white p-3.5 focus:outline-none bg-slate-950"
              >
                {HOTSPOT_GEOFENCES.map(hs => (
                  <option key={hs.id} value={hs.name}>{hs.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                  Tanggal Berangkat
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
                  Tanggal Pulang
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
                Tujuan Penugasan / Agenda
              </label>
              <textarea
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Tulis detail agenda visit (misal: Genba PLC di plant, Meeting PRD IT...)"
                rows="3"
                className="w-full glass-input rounded-xl text-xs text-white p-3.5 focus:outline-none resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                  Moda Transportasi
                </label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full glass-input rounded-xl text-xs text-white p-3.5 focus:outline-none bg-slate-950"
                >
                  {['Mobil Dinas', 'Grab / Taksi', 'Kereta / Commuter', 'Kendaraan Pribadi'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block mb-1.5">
                  Estimasi Budget (Rp)
                </label>
                <input
                  type="number"
                  required
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  placeholder="Misal: 300000"
                  className="w-full glass-input rounded-xl text-xs text-white p-3.5 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/10 uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan Perjalanan Dinas'}
            </button>
          </form>
        </div>

        {/* Request History Tracker */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800/10 rounded-full blur-2xl"></div>

          <div className="space-y-6">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-amber-500" />
              Daftar Pengajuan Dinas Anda
            </h3>

            {userTravels.length === 0 ? (
              <div className="py-16 text-center text-ragda-text-muted">
                <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="font-semibold text-xs">Belum ada pengajuan perjalanan dinas</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {userTravels.map(travel => (
                  <div key={travel.id} className="bg-slate-950/40 border border-ragda-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase bg-slate-900 border border-ragda-border-standard px-2.5 py-1 rounded-md text-white flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          {travel.destination.split(' ')[0]} {travel.destination.split(' ')[1] || ''}
                        </span>
                        <span className="text-xs text-white font-bold">
                          {new Date(travel.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(travel.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-ragda-text-muted italic">&ldquo;{travel.purpose}&rdquo;</p>
                      <div className="flex gap-4 text-[10px] text-ragda-text-subtle font-bold">
                        <span>Transport: {travel.transport}</span>
                        <span className="flex items-center gap-0.5 text-amber-500">
                          <DollarSign className="w-3.5 h-3.5" />
                          {travel.estimatedBudget.toLocaleString('id-ID')}
                        </span>
                      </div>
                      {travel.approvedBy && (
                        <p className="text-[10px] text-ragda-text-subtle font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                          Approved by {travel.approvedBy} {travel.feedback && `(${travel.feedback})`}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {getStatusBadge(travel.status)}
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
