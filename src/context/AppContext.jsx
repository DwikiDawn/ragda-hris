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
  // Theme state: 'dark' or 'light'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('hris-theme');
    return saved ? saved : 'dark';
  });

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('hris-auth-status') === 'true';
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('hris-employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  // Active User: defaults to Dwiki Darmawan (HR/Manager)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hris-active-user');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES[0];
  });

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

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('hris-theme', theme);
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('hris-auth-status', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('hris-employees', JSON.stringify(employees));
  }, [employees]);

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

  // Login action
  const login = (email, password) => {
    // Standard mock password checking (e.g. password = admin123 or matches email name)
    const found = employees.find(e => e.email === email);
    if (found && (password === 'admin123' || password === 'password' || password.toLowerCase() === found.name.split(' ')[0].toLowerCase())) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      addAuditLog('Login Sukses', `User ${found.name} login ke dalam sistem.`);
      return { success: true };
    }
    return { success: false, message: 'Email atau password salah.' };
  };

  // Logout action
  const logout = () => {
    addAuditLog('Logout Sukses', `User ${currentUser.name} keluar dari sistem.`);
    setIsAuthenticated(false);
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Update Employee Role (RBAC)
  const updateEmployeeRole = (empId, newRole) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === empId) {
        addAuditLog('Update Role Karyawan', `Mengubah role ${emp.name} menjadi ${newRole}`);
        // If updating currently logged in user
        if (currentUser.id === empId) {
          setCurrentUser(prevUser => ({ ...prevUser, role: newRole }));
        }
        return { ...emp, role: newRole };
      }
      return emp;
    }));
  };

  // Switch User Profile (for testing/demo convenience)
  const switchUser = (userId) => {
    const found = employees.find(e => e.id === userId);
    if (found) {
      setCurrentUser(found);
      addAuditLog('Simulasi Pindah Akun', `Profil dialihkan ke ${found.name}`);
    }
  };

  // Add Audit Log Entry
  const addAuditLog = (action, target) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentUser?.name || 'Sistem',
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
      theme,
      toggleTheme,
      isAuthenticated,
      login,
      logout,
      currentUser,
      employees,
      attendance,
      leaves,
      travels,
      auditLogs,
      switchUser,
      updateEmployeeRole,
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
