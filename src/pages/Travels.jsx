import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Briefcase, Plus, FileText, CheckCircle, Clock, MapPin, DollarSign } from 'lucide-react';

export default function Travels() {
  const { currentUser, travels, submitTravel } = useApp();

  const [form, setForm] = useState({
    destination: 'PT Toyota Motor Manufacturing Cikarang',
    purpose: '',
    startDate: '',
    endDate: '',
    transport: 'Mobil Dinas',
    budgetEstimate: '',
  });

  const [message, setMessage] = useState('');

  // Filter current user's travels
  const userTravels = useMemo(() => {
    return travels
      .filter(t => t.employeeId === currentUser.id)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [travels, currentUser.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'Rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    }
  };

  const formatRupiah = (val) => {
    if (!val) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.purpose || !form.startDate || !form.endDate || !form.budgetEstimate) {
      setMessage('Lengkapi semua data form!');
      return;
    }

    submitTravel({
      destination: form.destination,
      purpose: form.purpose,
      startDate: form.startDate,
      endDate: form.endDate,
      transport: form.transport,
      budgetEstimate: parseFloat(form.budgetEstimate) || 0,
    });

    setForm({
      destination: 'PT Toyota Motor Manufacturing Cikarang',
      purpose: '',
      startDate: '',
      endDate: '',
      transport: 'Mobil Dinas',
      budgetEstimate: '',
    });
    setMessage('Pengajuan dinas sukses dikirim!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white">Perjalanan Dinas / Visit Plant</h2>
        <p className="text-xs text-slate-500 mt-1">Formulir digital pengajuan perjalanan dinas luar kota dan visit customer PT Ragdalion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg lg:col-span-1">
          <h3 className="font-extrabold text-white text-md mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            Pengajuan Dinas Baru
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Destinasi Customer</label>
              <select
                value={form.destination}
                onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500"
              >
                <option value="PT Toyota Motor Manufacturing Cikarang">PT Toyota Motor Manufacturing Cikarang</option>
                <option value="PT Sugity Creatives Bekasi">PT Sugity Creatives Bekasi</option>
                <option value="PT Indonesia Koito Karawang">PT Indonesia Koito Karawang</option>
                <option value="Wisma 78 Sudirman Jakarta">Wisma 78 Sudirman Jakarta</option>
                <option value="Lainnya">Lainnya / Luar Kota</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Berangkat</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Kembali</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Tujuan & Agenda Kerja</label>
              <textarea
                value={form.purpose}
                onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}
                rows={3}
                placeholder="Tuliskan tujuan dan agenda kerja di plant/customer..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Transportasi</label>
                <select
                  value={form.transport}
                  onChange={e => setForm(f => ({ ...f, transport: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="Mobil Dinas">🚗 Mobil Dinas</option>
                  <option value="Grab / Taksi">🚖 Grab / Taksi</option>
                  <option value="Kereta Api">🚄 Kereta Api</option>
                  <option value="Kendaraan Pribadi">🏍️ Kendaraan Pribadi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold mb-1">Estimasi Budget (Rp)</label>
                <input
                  type="number"
                  value={form.budgetEstimate}
                  onChange={e => setForm(f => ({ ...f, budgetEstimate: e.target.value }))}
                  placeholder="Bensin/Tol/Makan"
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {message && (
              <p className={`text-xs font-bold text-center ${message.includes('sukses') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 rounded-xl transition-all shadow-lg"
            >
              Kirim Pengajuan Dinas
            </button>
          </form>
        </div>

        {/* Requests List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg lg:col-span-2">
          <h3 className="font-extrabold text-white text-md mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Daftar Perjalanan Dinas Anda
          </h3>

          {userTravels.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p className="font-semibold text-sm">Belum ada riwayat perjalanan dinas</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {userTravels.map(travel => (
                <div key={travel.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        {travel.destination}
                      </h4>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${getStatusColor(travel.status)}`}>
                        {travel.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">Agenda: {travel.purpose}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-slate-500">
                      <span>Tanggal: {travel.startDate} s/d {travel.endDate}</span>
                      <span>Transport: {travel.transport}</span>
                      <span className="text-amber-500 font-bold">Budget: {formatRupiah(travel.budgetEstimate)}</span>
                    </div>
                    {travel.approvedBy && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        Disetujui oleh: {travel.approvedBy}
                      </p>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-600 font-mono">{new Date(travel.submittedAt).toLocaleDateString('id-ID')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
