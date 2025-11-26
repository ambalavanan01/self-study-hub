import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { isConfigured } from './lib/supabase';
import {
  Login,
  Signup,
  ResetPassword,
  Dashboard,
  CGPA,
  Timetable,
  Files,
  Profile,
} from './pages';
import { ConfigurationError } from './pages/ConfigurationError';
import { DashboardLayout } from './components/layout/DashboardLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (session) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

function App() {
  // Check if Supabase is configured
  if (!isConfigured) {
    return <ConfigurationError />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Navigate to="/login" replace /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cgpa" element={<CGPA />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/files" element={<Files />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
