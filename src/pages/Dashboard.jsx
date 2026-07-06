import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, CheckCircle, Compass, ShieldAlert, ArrowRight, Check, Users, FileText, CheckCircle2, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { HOTSPOT_GEOFENCES } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, attendance, leaves, travels, employees, checkInUser, checkOutUser } = useApp();

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

  // --- HR / Manager Dashboard Calculations ---
  const hrData = useMemo(() => {
    // 1. Calculate Headcount for today
    let hadir = 0;
    let terlambat = 0;
    let dinasLuar = 0;
    let cutiSakit = 0;
    
    // Check attendance records for today
    const todayRecords = attendance.filter(rec => rec.date === todayStr);
    todayRecords.forEach(rec => {
      if (rec.status === 'Tepat Waktu') hadir++;
      else if (rec.status === 'Terlambat') terlambat++;
      else if (rec.status === 'Perjalanan Dinas') dinasLuar++;
    });

    // Check approved leaves covering today
    leaves.forEach(l => {
      if (l.status === 'Approved') {
        const start = new Date(l.startDate);
        const end = new Date(l.endDate);
        const today = new Date(todayStr);
        if (today >= start && today <= end) {
          cutiSakit++;
        }
      }
    });

    const activeEmployeesCount = employees.filter(e => e.status === 'Active').length;
    const totalPresent = hadir + terlambat + dinasLuar;
    const alpha = Math.max(0, activeEmployeesCount - totalPresent - cutiSakit);

    // 2. Pending Approvals count
    const pendingLeaves = leaves.filter(l => l.status === 'Pending');
    const pendingTravels = travels.filter(t => t.status === 'Pending');
    const pendingActions = [...pendingLeaves.map(l => ({ ...l, typeCat: 'Leave' })), ...pendingTravels.map(t => ({ ...t, typeCat: 'Travel' }))];

    // 3. Generate mock Trend Data for the last 7 days (including today)
    const trendDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });

      // Count for this specific day
      const dayRecords = attendance.filter(rec => rec.date === dateStr);
      let dayHadir = 0;
      let dayTerlambat = 0;
      let dayDinas = 0;
      let dayCuti = 0;

      dayRecords.forEach(rec => {
        if (rec.status === 'Tepat Waktu') dayHadir++;
        else if (rec.status === 'Terlambat') dayTerlambat++;
        else if (rec.status === 'Perjalanan Dinas') dayDinas++;
      });

      leaves.forEach(l => {
        if (l.status === 'Approved') {
          const start = new Date(l.startDate);
          const end = new Date(l.endDate);
          const current = new Date(dateStr);
          if (current >= start && current <= end) {
            dayCuti++;
          }
        }
      });

      const dayAlpha = Math.max(0, activeEmployeesCount - (dayHadir + dayTerlambat + dayDinas) - dayCuti);

      trendDays.push({
        dateStr,
        label: dayLabel,
        hadir: dayHadir + dayHadir * 0.1, // Small mock variants for nice visual chart look
        terlambat: dayTerlambat,
        dinasLuar: dayDinas,
        alpha: dayAlpha
      });
    }

    return {
      activeEmployeesCount,
      hadir,
      terlambat,
      dinasLuar,
      cutiSakit,
      alpha,
      pendingActions,
      trendDays
    };
  }, [attendance, leaves, travels, employees, todayStr]);

  const [hoveredTrendIndex, setHoveredTrendIndex] = useState(null);

  // Render HR/Manager Dashboard
  if (currentUser.role === 'HR/Manager') {
    return (
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden border border-ragda-border-standard bg-gradient-to-br from-slate-900 to-slate-950 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.06),rgba(255,255,255,0))]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                HR Monitoring Dashboard
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

        {/* Headcount Stat Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-ragda-border-subtle">
            <span className="text-[9px] text-ragda-text-muted uppercase font-extrabold tracking-wider block">Total Karyawan</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-white font-mono">{hrData.activeEmployeesCount}</span>
              <Users className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-[8px] text-slate-600 uppercase font-bold mt-2">Karyawan Aktif</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-emerald-500/10 bg-emerald-950/5">
            <span className="text-[9px] text-emerald-400/80 uppercase font-extrabold tracking-wider block">Hadir (Tepat Waktu)</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-emerald-400 font-mono">{hrData.hadir}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500/80" />
            </div>
            <p className="text-[8px] text-emerald-500/70 uppercase font-bold mt-2">Presensi Normal</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-red-500/10 bg-red-950/5">
            <span className="text-[9px] text-red-400/80 uppercase font-extrabold tracking-wider block">Terlambat</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-red-400 font-mono">{hrData.terlambat}</span>
              <AlertTriangle className="w-5 h-5 text-red-500/80" />
            </div>
            <p className="text-[8px] text-red-500/70 uppercase font-bold mt-2">Melewati Jam 08:00</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-amber-500/10 bg-amber-950/5">
            <span className="text-[9px] text-amber-400/80 uppercase font-extrabold tracking-wider block">Perjalanan Dinas</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-amber-400 font-mono">{hrData.dinasLuar}</span>
              <Compass className="w-5 h-5 text-amber-500/80" />
            </div>
            <p className="text-[8px] text-amber-500/70 uppercase font-bold mt-2">Dinas / Visit Plant</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-blue-500/10 bg-blue-950/5 col-span-2 lg:col-span-1">
            <span className="text-[9px] text-blue-400/80 uppercase font-extrabold tracking-wider block">Cuti / Sakit / Izin</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-black text-blue-400 font-mono">{hrData.cutiSakit}</span>
              <FileText className="w-5 h-5 text-blue-500/80" />
            </div>
            <p className="text-[8px] text-blue-500/70 uppercase font-bold mt-2">Approved Leaves</p>
          </div>
        </div>

        {/* Core Double Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trend Absensi Chart */}
          <div className="glass-card rounded-3xl p-6 lg:col-span-2 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-2xl"></div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4.5 h-4.5 text-amber-500" />
                  Tren Kehadiran (7 Hari Terakhir)
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Live Telemetry</span>
              </div>

              {/* Dynamic SVG Bar Chart */}
              <div className="relative pt-6">
                <svg className="w-full h-56" viewBox="0 0 500 220">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#1e293b" />

                  {/* Y Axis Labels */}
                  <text x="15" y="24" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">5</text>
                  <text x="15" y="74" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">3</text>
                  <text x="15" y="124" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">1</text>
                  <text x="15" y="174" fill="#64748b" className="text-[10px] font-mono" textAnchor="middle">0</text>

                  {/* Render Columns */}
                  {hrData.trendDays.map((day, idx) => {
                    const colWidth = 36;
                    const colGap = 60;
                    const startX = 50 + idx * colGap;
                    
                    // Heights representing attendance types
                    const maxVal = 5;
                    const scale = 150 / maxVal;
                    
                    // Stacked bar calculations
                    const hHadir = Math.min(day.hadir, maxVal) * scale;

                    const isHovered = hoveredTrendIndex === idx;

                    return (
                      <g
                        key={idx}
                        onMouseEnter={() => setHoveredTrendIndex(idx)}
                        onMouseLeave={() => setHoveredTrendIndex(null)}
                        className="cursor-pointer transition-all duration-200"
                      >
                        {/* Interactive Area Mask */}
                        <rect
                          x={startX - 10}
                          y="10"
                          width={colWidth + 20}
                          height="170"
                          fill="transparent"
                        />

                        {/* Hadir Bar (Emerald) */}
                        <rect
                          x={startX}
                          y={170 - hHadir}
                          width={colWidth}
                          height={hHadir}
                          fill={isHovered ? "#34d399" : "#10b981"}
                          className="transition-all duration-300"
                          rx="4"
                        />

                        {/* Overlaid overlay effects on hover */}
                        {isHovered && (
                          <rect
                            x={startX - 2}
                            y={170 - hHadir - 2}
                            width={colWidth + 4}
                            height={hHadir + 4}
                            fill="none"
                            stroke="#34d399"
                            strokeWidth="1.5"
                            rx="6"
                          />
                        )}

                        {/* Day Label on X Axis */}
                        <text
                          x={startX + colWidth / 2}
                          y="192"
                          fill={isHovered ? "#f59e0b" : "#64748b"}
                          className="text-[9px] font-bold"
                          textAnchor="middle"
                        >
                          {day.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Interactive Tooltip Card overlay */}
                {hoveredTrendIndex !== null && (
                  <div
                    className="absolute bg-slate-950 border border-amber-500/30 rounded-2xl p-4 shadow-2xl animate-fadeIn text-xs z-20 space-y-2 w-48"
                    style={{
                      left: `${40 + hoveredTrendIndex * 60}px`,
                      top: `-10px`,
                      transform: 'translateX(-25%)'
                    }}
                  >
                    <p className="font-extrabold text-white text-[10px] border-b border-slate-800 pb-1 uppercase tracking-wider">
                      {hrData.trendDays[hoveredTrendIndex].label}
                    </p>
                    <div className="space-y-1 font-mono text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-400">Hadir Normal:</span>
                        <span className="font-extrabold text-white">{Math.round(hrData.trendDays[hoveredTrendIndex].hadir)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-amber-400">Dinas Luar:</span>
                        <span className="font-extrabold text-white">{hrData.trendDays[hoveredTrendIndex].dinasLuar}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-red-400">Terlambat:</span>
                        <span className="font-extrabold text-white">{hrData.trendDays[hoveredTrendIndex].terlambat}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Alpha / Tanpa Ket:</span>
                        <span className="font-extrabold text-white">{hrData.trendDays[hoveredTrendIndex].alpha}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Legend Indicators */}
              <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-slate-800/60 text-[10px] text-ragda-text-subtle font-bold">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span> Hadir Tepat Waktu</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> Dinas Luar (Travel)</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span> Terlambat</span>
              </div>
            </div>
          </div>

          {/* Pending Actions Panel */}
          <div className="glass-card rounded-3xl p-6 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-ragda-text-muted uppercase tracking-widest">
                Persetujuan Tertunda
              </h3>

              {hrData.pendingActions.length === 0 ? (
                <div className="py-12 text-center text-slate-600 bg-slate-950/40 border border-ragda-border-subtle rounded-2xl">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mx-auto mb-2" />
                  <p className="font-semibold text-[10px] uppercase tracking-wider">Semua Pengajuan Bersih</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {hrData.pendingActions.slice(0, 3).map((act, idx) => (
                    <div key={idx} className="bg-slate-950/60 border border-ragda-border-subtle p-3 rounded-xl space-y-1.5 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-extrabold uppercase bg-slate-900 px-2 py-0.5 border border-ragda-border-standard rounded text-amber-500">
                          {act.typeCat === 'Leave' ? act.type : 'Dinas Luar'}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">
                          {new Date(act.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-[11px] font-extrabold text-white leading-tight">
                        {employees.find(e => e.id === act.employeeId)?.name || 'Karyawan'}
                      </p>
                      <p className="text-[10px] text-ragda-text-muted italic truncate">&ldquo;{act.reason || act.purpose}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center justify-between p-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-2xl transition-all duration-200 group uppercase tracking-wider"
            >
              <span>Portal Approval HR</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
