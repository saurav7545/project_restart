import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import PageErrorBoundary from './components/PageErrorBoundary';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Planner = lazy(() => import('./pages/Planner'));
const Study = lazy(() => import('./pages/Study'));
const Projects = lazy(() => import('./pages/Projects'));
const Expenses = lazy(() => import('./pages/Expenses'));
const Fitness = lazy(() => import('./pages/Fitness'));
const Habits = lazy(() => import('./pages/Habits'));
const Recovery = lazy(() => import('./pages/Recovery'));
const Goals = lazy(() => import('./pages/Goals'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AICoach = lazy(() => import('./pages/AICoach'));
const Notifications = lazy(() => import('./pages/Notifications'));

const loadingStyle = {
  minHeight: '100vh',
  background: '#0a0a0f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const loadingIconStyle = {
  fontSize: '2.5rem',
  animation: 'float 3s ease-in-out infinite',
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loadingIconStyle}>🔄</div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={loadingStyle}>
        <div style={loadingIconStyle}>🔄</div>
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/planner" element={<ProtectedRoute><MainLayout><Planner /></MainLayout></ProtectedRoute>} />
      <Route path="/study" element={<ProtectedRoute><MainLayout><Study /></MainLayout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><MainLayout><Projects /></MainLayout></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><MainLayout><Expenses /></MainLayout></ProtectedRoute>} />
      <Route path="/fitness" element={<ProtectedRoute><MainLayout><Fitness /></MainLayout></ProtectedRoute>} />
      <Route path="/habits" element={<ProtectedRoute><MainLayout><Habits /></MainLayout></ProtectedRoute>} />
      <Route path="/recovery" element={<ProtectedRoute><MainLayout><Recovery /></MainLayout></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><MainLayout><Goals /></MainLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><MainLayout><Analytics /></MainLayout></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><MainLayout><AICoach /></MainLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><MainLayout><Notifications /></MainLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <PageErrorBoundary>
          <Suspense fallback={<div style={loadingStyle}><div style={loadingIconStyle}>Loading...</div></div>}>
            <AppRoutes />
          </Suspense>
        </PageErrorBoundary>
      </AuthProvider>
    </Router>
  );
}
