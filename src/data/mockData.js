// HRIS Initial Data & Mock Models for PT Ragdalion

export const INITIAL_EMPLOYEES = [
  { id: 'RAGDA-001', name: 'Dwiki Darmawan', role: 'HR/Manager', email: 'dwiky.ragda@gmail.com', division: 'Sales & Marketing', position: 'Manager Marketing & Sales', status: 'Active' },
  { id: 'RAGDA-002', name: 'Erlangga Mahardhika', role: 'Karyawan', email: 'erlangga@ragdalion.com', division: 'IT Dev', position: 'Senior Software Engineer', status: 'Active' },
  { id: 'RAGDA-003', name: 'Fadli Hamsani', role: 'Karyawan', email: 'fadli@ragdalion.com', division: 'OT Engineering', position: 'Lead SCADA Engineer', status: 'Active' },
  { id: 'RAGDA-004', name: 'Luthfi Gusman M.', role: 'Karyawan', email: 'luthfi@ragdalion.com', division: 'OT Engineering', position: 'Automation Specialist', status: 'Active' },
  { id: 'RAGDA-005', name: 'Aditya Pratama', role: 'Karyawan', email: 'aditya@ragdalion.com', division: 'IT Dev', position: 'Frontend Developer', status: 'Active' },
];

export const OFFICE_GEOFENCE = {
  name: 'Head Office PT Ragdalion Cikarang',
  latitude: -6.2858,
  longitude: 107.1698,
  radiusMeter: 100,
};

export const HOTSPOT_GEOFENCES = [
  { id: 'hs-1', name: 'PT Toyota Motor Manufacturing Cikarang', latitude: -6.2941, longitude: 107.1512 },
  { id: 'hs-2', name: 'PT Sugity Creatives Bekasi', latitude: -6.2730, longitude: 107.1420 },
  { id: 'hs-3', name: 'PT Indonesia Koito', latitude: -6.3115, longitude: 107.1850 },
  { id: 'hs-4', name: 'Wisma 78 Sudirman Jakarta', latitude: -6.2144, longitude: 106.8188 },
];

export const INITIAL_ATTENDANCE = [
  { id: 'att-1', employeeId: 'RAGDA-002', date: '2026-07-01', checkIn: '07:55', checkOut: '17:02', status: 'Tepat Waktu', location: 'Head Office Cikarang' },
  { id: 'att-2', employeeId: 'RAGDA-003', date: '2026-07-01', checkIn: '08:15', checkOut: '17:30', status: 'Terlambat', location: 'Head Office Cikarang' },
  { id: 'att-3', employeeId: 'RAGDA-004', date: '2026-07-01', checkIn: '07:45', checkOut: '18:15', status: 'Perjalanan Dinas', location: 'PT Toyota Cikarang' },
  { id: 'att-4', employeeId: 'RAGDA-002', date: '2026-07-02', checkIn: '07:50', checkOut: '17:05', status: 'Tepat Waktu', location: 'Head Office Cikarang' },
  { id: 'att-5', employeeId: 'RAGDA-003', date: '2026-07-02', checkIn: '07:58', checkOut: '17:00', status: 'Tepat Waktu', location: 'Head Office Cikarang' },
];

export const INITIAL_LEAVES = [
  { id: 'lv-1', employeeId: 'RAGDA-002', type: 'Cuti Tahunan', startDate: '2026-07-10', endDate: '2026-07-12', totalDays: 3, reason: 'Acara keluarga di Bandung', status: 'Pending', notes: '', submittedAt: '2026-07-03T10:00:00Z', approvedBy: '' },
  { id: 'lv-2', employeeId: 'RAGDA-003', type: 'Sakit', startDate: '2026-07-03', endDate: '2026-07-04', totalDays: 2, reason: 'Demam tinggi & flu', status: 'Approved', notes: 'Surat dokter terlampir', submittedAt: '2026-07-03T08:30:00Z', approvedBy: 'Dwiki Darmawan' },
  { id: 'lv-3', employeeId: 'RAGDA-004', type: 'Izin Penting', startDate: '2026-07-05', endDate: '2026-07-05', totalDays: 1, reason: 'Mengurus dokumen pernikahan', status: 'Approved', notes: 'Disetujui', submittedAt: '2026-07-04T15:20:00Z', approvedBy: 'Dwiki Darmawan' },
];

export const INITIAL_TRAVELS = [
  { id: 'tr-1', employeeId: 'RAGDA-004', destination: 'PT Toyota Motor Manufacturing', purpose: 'Genba assessment PLC & HMI line produksi', startDate: '2026-07-01', endDate: '2026-07-01', transport: 'Mobil Dinas', budgetEstimate: 350000, status: 'Approved', submittedAt: '2026-06-29T10:00:00Z', approvedBy: 'Dwiki Darmawan' },
  { id: 'tr-2', employeeId: 'RAGDA-003', destination: 'PT Indonesia Koito', purpose: 'Commissioning SCADA & OPC-UA Integration', startDate: '2026-07-07', endDate: '2026-07-09', transport: 'Mobil Dinas', budgetEstimate: 750000, status: 'Pending', submittedAt: '2026-07-04T09:00:00Z', approvedBy: '' },
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'log-1', timestamp: '2026-07-03T08:35:00Z', actor: 'Dwiki Darmawan', action: 'Approve Pengajuan Sakit', target: 'Fadli Hamsani (RAGDA-003)' },
  { id: 'log-2', timestamp: '2026-07-04T15:30:00Z', actor: 'Dwiki Darmawan', action: 'Approve Pengajuan Izin Penting', target: 'Luthfi Gusman M. (RAGDA-004)' },
];
