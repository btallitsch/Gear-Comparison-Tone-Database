import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuthContext } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { GearDatabase } from './pages/GearDatabase';
import { Compare } from './pages/Compare';
import styles from './App.module.css';

const AppRoutes = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingLogo}>🎸</div>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/database" element={<GearDatabase />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
