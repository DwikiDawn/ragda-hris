import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Clock, CheckCircle, AlertCircle, Compass, ShieldAlert, ArrowRight } from 'lucide-react';
import { OFFICE_GEOFENCE, HOTSPOT_GEOFENCES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, attendance, checkInUser, checkOutUser } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('Head Office Cikarang');
  const [isWithinOffice, setIsWithinOffice] = useState(true);

  // Auto-updating clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = currentTime.toISOString().split('T')[0];

  // Find today's attendance record
  const todayRecord = attendance.find(rec => rec.employeeId === currentUser.id && rec.date === todayStr);

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setSelectedLocation(val);
    setIsWithinOffice(val === 'Head Office Cikarang');
  };

  const handleCheckIn = () => {
    const checkInTime = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const isLate = currentTime.getHours() > 8 || (currentTime.getHours() === 8 && currentTime.getMinutes() > 0);
    
    let status = 'Tepat Waktu';
    if (!isWithinOffice) {
      status = 'Perjalanan Dinas';
    } else if (isLate) {
      status = 'Terlambat';
    }

    checkInUser(selectedLocation, todayStr, checkInTime, status);
  };

  const handleCheckOut = () => {
    const checkOutTime = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    checkOutUser(todayStr, checkOutTime);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] -mr-8 -mt-8"></div>
        <div className="relative z-10">
          <p className="text-amber-500 text-xs font-bold uppercase tracking-wider">Ragdalion HRIS Portal</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-1">Halo, {currentUser.name}!</h2>
          <p className="text-slate-400 text-sm mt-1">{currentUser.position} &middot; Divisi {currentUser.division}</p>
          
          <div className="flex flex-wrap gap-4 mt-6 text-xs md:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-amber-500" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-full">
              <Clock className="w-4 h-4 text-amber-500" /> {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="font-extrabold text-white text-lg mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-500" />
              Presensi Harian
            </h3>

            {/* Check-In Location Selector */}
            {!todayRecord && (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 mb-6">
                <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Pilih Lokasi Kerja (Simulasi GPS)</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Head Office Cikarang">📍 Head Office Cikarang (Kantor Pusat)</option>
                    {HOTSPOT_GEOFENCES.map(hs => (
                      <option key={hs.id} value={hs.name}>🏢 {hs.name}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    {isWithinOffice ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Geofence OK (Kantor)
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Luar Kantor (Dinas)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Status Display */}
            {todayRecord ? (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-center mb-6">
                <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full mb-3">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="font-extrabold text-white text-md">Anda sudah Check-In hari ini</h4>
                <p className="text-xs text-slate-500 mt-1">Presensi di-record pada {todayRecord.location}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-6 max-w-sm mx-auto text-sm">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Masuk</p>
                    <p className="text-white font-extrabold mt-1">{todayRecord.checkIn}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Keluar</p>
                    <p className="text-white font-extrabold mt-1">{todayRecord.checkOut || '-- : --'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-center mb-6 text-slate-400">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Belum melakukan Check-In untuk tanggal hari ini</p>
                <p className="text-xs text-slate-500 mt-0.5">Silakan pilih lokasi dan lakukan check-in di bawah.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {!todayRecord ? (
              <button
                onClick={handleCheckIn}
                className="flex-1 bg-amber-500 text-slate-950 font-extrabold py-3.5 rounded-xl hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20"
              >
                CHECK-IN MASUK
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                disabled={!!todayRecord.checkOut}
                className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 font-extrabold py-3.5 rounded-xl hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {todayRecord.checkOut ? 'CHECK-OUT SELESAI' : 'CHECK-OUT PULANG'}
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats & Navigation Shortcuts */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
            <h3 className="font-extrabold text-white text-md mb-4 uppercase tracking-wider text-slate-400 text-xs">Akses Cepat</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/leaves')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-slate-800 rounded-xl border border-slate-800/80 text-left transition-all group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">Ajukan Cuti / Izin</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Sakit, cuti tahunan, urusan keluarga</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
              </button>
              <button
                onClick={() => navigate('/travels')}
                className="w-full flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-slate-800 rounded-xl border border-slate-800/80 text-left transition-all group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">Mulai Perjalanan Dinas</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Visit plant customer atau operasional</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* Quick ISO Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[40px] -mr-6 -mt-6"></div>
            <h3 className="font-extrabold text-white text-md mb-3 flex items-center gap-2 text-blue-400">
              <ShieldAlert className="w-4 h-4" />
              ISO 27001 ISMS Compliance
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Semua pencatatan absensi, pengajuan cuti, dan perjalanan dinas diaudit secara ketat oleh sistem. Data dienkripsi secara aman.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
