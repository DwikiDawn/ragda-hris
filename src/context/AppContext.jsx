import { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_TRAVELS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Active User: defaults to Dwiki Darmawan (HR/Manager)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hris-active-user');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES[0];
  });

  const [employees] = useState(INITIAL_EMPLOYEES);

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('hris-attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('hris-leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [travels, setTravels] = useState(() => {
    const saved = localStorage.getItem('hris-travels');
    return saved ? JSON.parse(saved) : INITIAL_TRAVELS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('hris-audit-logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  useEffect(() => {
    localStorage.setItem('hris-active-user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('hris-attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('hris-leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('hris-travels', JSON.stringify(travels));
  }, [travels]);

  useEffect(() => {
    localStorage.setItem('hris-audit-logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Switch User Profile
  const switchUser = (userId) => {
    const found = employees.find(e => e.id === userId);
    if (found) setCurrentUser(found);
  };

  // Add Audit Log Entry
  const addAuditLog = (action, target) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      action,
      target
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Check In
  const checkInUser = (locationName, dateStr, timeStr, status) => {
    const newRecord = {
      id: `att-${Date.now()}`,
      employeeId: currentUser.id,
      date: dateStr,
      checkIn: timeStr,
      checkOut: '',
      status: status,
      location: locationName
    };
    setAttendance(prev => [newRecord, ...prev]);
    addAuditLog('Check-In Kehadiran', `Lokasi: ${locationName} (${status})`);
  };

  // Check Out
  const checkOutUser = (dateStr, timeStr) => {
    setAttendance(prev => prev.map(rec => {
      if (rec.employeeId === currentUser.id && rec.date === dateStr && !rec.checkOut) {
        addAuditLog('Check-Out Kehadiran', `Log keluar pada jam ${timeStr}`);
        return { ...rec, checkOut: timeStr };
      }
      return rec;
    }));
  };

  // Submit Leave Request
  const submitLeave = (leaveData) => {
    const newLeave = {
      id: `lv-${Date.now()}`,
      employeeId: currentUser.id,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      approvedBy: '',
      feedback: '',
      ...leaveData
    };
    setLeaves(prev => [newLeave, ...prev]);
    addAuditLog('Mengajukan Cuti/Izin/Sakit', `Kategori: ${leaveData.type}, Durasi: ${leaveData.totalDays} hari`);
  };

  // Submit Business Travel Request
  const submitTravel = (travelData) => {
    const newTravel = {
      id: `tr-${Date.now()}`,
      employeeId: currentUser.id,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      approvedBy: '',
      feedback: '',
      ...travelData
    };
    setTravels(prev => [newTravel, ...prev]);
    addAuditLog('Mengajukan Perjalanan Dinas', `Tujuan: ${travelData.destination}`);
  };

  // Process Approval (HR/Manager Only)
  const processApproval = (type, requestId, action, notes) => {
    if (currentUser.role !== 'HR/Manager') return;

    if (type === 'leave') {
      setLeaves(prev => prev.map(item => {
        if (item.id === requestId) {
          const emp = employees.find(e => e.id === item.employeeId);
          addAuditLog(`${action} Pengajuan Cuti/Izin`, `${emp?.name} - ${item.type}`);
          return { ...item, status: action, approvedBy: currentUser.name, feedback: notes };
        }
        return item;
      }));
    } else if (type === 'travel') {
      setTravels(prev => prev.map(item => {
        if (item.id === requestId) {
          const emp = employees.find(e => e.id === item.employeeId);
          addAuditLog(`${action} Perjalanan Dinas`, `${emp?.name} - Tujuan: ${item.destination}`);
          return { ...item, status: action, approvedBy: currentUser.name, feedback: notes };
        }
        return item;
      }));
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      employees,
      attendance,
      leaves,
      travels,
      auditLogs,
      switchUser,
      checkInUser,
      checkOutUser,
      submitLeave,
      submitTravel,
      processApproval
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
