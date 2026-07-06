import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Travels from './pages/Travels';
import AdminApproval from './pages/AdminApproval';
import AuditLogs from './pages/AuditLogs';
import Login from './pages/Login';

// Protected Route for Authentication
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Protected Route for HR/Manager role only
function ManagerRoute({ children }) {
  const { isAuthenticated, currentUser } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return currentUser.role === 'HR/Manager' ? children : <Navigate to="/" replace />;
}

function AppContent() {
  const { isAuthenticated } = useApp();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        {/* Portal Pages inside Layout wrapper */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/leaves" element={<Leaves />} />
                  <Route path="/travels" element={<Travels />} />
                  
                  {/* HR / Manager Specific RBAC Routes */}
                  <Route path="/admin" element={
                    <ManagerRoute>
                      <AdminApproval />
                    </ManagerRoute>
                  } />
                  <Route path="/audit-logs" element={
                    <ManagerRoute>
                      <AuditLogs />
                    </ManagerRoute>
                  } />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
