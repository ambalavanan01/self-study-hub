import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import {
  Landing,
  Login,
  Signup,
  ResetPassword,
  Dashboard,
  CGPA,
  Timetable,
  Files,
  Tasks,
  StudySessions,
  Profile,
} from './pages';
import { DashboardLayout } from './components/layout/DashboardLayout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/study-sessions" element={<StudySessions />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
