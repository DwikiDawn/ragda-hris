import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Calendar, Clock, CheckCircle, AlertCircle, Compass, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { HOTSPOT_GEOFENCES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, attendance, checkInUser, checkOutUser } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('Head Office Cikarang');
  const [isWithinOffice, setIsWithinOffice] = useState(true);

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = currentTime.toISOString().split('T')[0];
  const todayRecord = attendance.find(rec => rec.employeeId === currentUser.id && rec.date === todayStr);

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  const handleLocationSelect = (locName) => {
    setSelectedLocation(locName);
    setIsWithinOffice(locName === 'Head Office Cikarang');
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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden border border-ragda-border-standard bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.06),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              Portal Kehadiran
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-4 display-title tracking-tight">
              Selamat datang, {currentUser.name}
            </h2>
            <p className="text-ragda-text-muted text-xs mt-1.5 font-medium">
              {currentUser.position} &middot; Divisi {currentUser.division}
            </p>
          </div>

          <div className="flex gap-3 text-xs text-ragda-text-secondary bg-slate-950/60 p-1.5 rounded-2xl border border-ragda-border-subtle shrink-0">
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-ragda-border-subtle">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-ragda-border-subtle font-mono font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Presensi Check-In Card */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-amber-500" />
              Pencatatan Presensi
            </h3>

            {/* GPS Simulation List instead of Dropdown */}
            {!todayRecord ? (
              <div className="space-y-3">
                <span className="text-[10px] text-ragda-text-muted uppercase font-extrabold tracking-wider block">
                  Verifikasi GPS & Lokasi Kerja
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleLocationSelect('Head Office Cikarang')}
                    className={`flex items-center justify-between text-left p-3.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                      selectedLocation === 'Head Office Cikarang'
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                        : 'bg-slate-950/60 border-ragda-border-subtle text-ragda-text-muted hover:border-ragda-border-standard hover:text-white'
                    }`}
                  >
                    <span>📍 Head Office Cikarang</span>
                    {selectedLocation === 'Head Office Cikarang' && <Check className="w-4 h-4" />}
                  </button>
                  {HOTSPOT_GEOFENCES.map(hs => (
                    <button
                      key={hs.id}
                      onClick={() => handleLocationSelect(hs.name)}
                      className={`flex items-center justify-between text-left p-3.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                        selectedLocation === hs.name
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                          : 'bg-slate-950/60 border-ragda-border-subtle text-ragda-text-muted hover:border-ragda-border-standard hover:text-white'
                      }`}
                    >
                      <span className="truncate">🏢 {hs.name}</span>
                      {selectedLocation === hs.name && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/40 border border-ragda-border-subtle text-[10px] text-ragda-text-muted">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Sistem memvalidasi lokasi GPS Anda. Status saat ini: <strong>{isWithinOffice ? 'Di dalam perimeter Kantor' : 'Perjalanan Dinas'}</strong>.</span>
                </div>
              </div>
            ) : (
              // Status Done Screen
              <div className="bg-slate-950/40 border border-ragda-border-subtle rounded-2xl p-6 text-center">
                <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-3 animate-pulse-slow">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-white text-sm">Presensi Ter-record dengan Sukses</h4>
                <p className="text-[11px] text-ragda-text-muted mt-1">Presensi diverifikasi di {todayRecord.location}</p>

                <div className="grid grid-cols-2 gap-4 mt-6 max-w-xs mx-auto text-xs">
                  <div className="bg-slate-900 border border-ragda-border-subtle p-3.5 rounded-xl">
                    <p className="text-[9px] text-ragda-text-muted font-bold uppercase tracking-wider">Check In</p>
                    <p className="text-white font-extrabold font-mono text-sm mt-1.5">{todayRecord.checkIn}</p>
                  </div>
                  <div className="bg-slate-900 border border-ragda-border-subtle p-3.5 rounded-xl">
                    <p className="text-[9px] text-ragda-text-muted font-bold uppercase tracking-wider">Check Out</p>
                    <p className="text-white font-extrabold font-mono text-sm mt-1.5">{todayRecord.checkOut || '-- : --'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 relative z-10 flex gap-4">
            {!todayRecord ? (
              <button
                onClick={handleCheckIn}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/15 uppercase tracking-wider"
              >
                CHECK-IN MASUK PRESENSI
              </button>
            ) : (
              <button
                onClick={handleCheckOut}
                disabled={!!todayRecord.checkOut}
                className="flex-1 bg-slate-800 border border-ragda-border-standard hover:bg-slate-700 text-white font-extrabold text-xs py-4 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {todayRecord.checkOut ? 'Check-Out Selesai' : 'CHECK-OUT PULANG'}
              </button>
            )}
          </div>
        </div>

        {/* Right Column Grid (Shortcuts & Security) */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Quick Actions Shortcuts */}
          <div className="glass-card rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-[10px] font-extrabold text-ragda-text-muted uppercase tracking-widest">
              Aktivitas Lainnya
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/leaves')}
                className="w-full flex items-center justify-between p-4 bg-slate-950/60 hover:bg-ragda-surface-hover rounded-2xl border border-ragda-border-subtle text-left transition-all duration-200 group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">Ajukan Cuti / Sakit</h4>
                  <p className="text-[10px] text-ragda-text-muted mt-1">Sakit, cuti tahunan, urusan penting</p>
                </div>
                <ArrowRight className="w-4 h-4 text-ragda-text-muted group-hover:text-amber-500 transition-colors" />
              </button>

              <button
                onClick={() => navigate('/travels')}
                className="w-full flex items-center justify-between p-4 bg-slate-950/60 hover:bg-ragda-surface-hover rounded-2xl border border-ragda-border-subtle text-left transition-all duration-200 group"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">Perjalanan Dinas</h4>
                  <p className="text-[10px] text-ragda-text-muted mt-1">Visit plant customer atau dinas</p>
                </div>
                <ArrowRight className="w-4 h-4 text-ragda-text-muted group-hover:text-amber-500 transition-colors" />
              </button>
            </div>
          </div>

          {/* Compliance & ISMS Card */}
          <div className="glass-card rounded-3xl p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px]"></div>
            <h3 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <ShieldAlert className="w-4 h-4" />
              ISMS ISO 27001
            </h3>
            <p className="text-[11px] text-ragda-text-muted leading-relaxed">
              Semua tindakan presensi diverifikasi berdasarkan koordinasi log geografis (GPS) dan audit trail tersimpan permanen demi kepatuhan operasional internal yang handal.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
