import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './contexts/ThemeContext';
import { DashboardProvider } from './contexts/DashboardContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Calendar from './pages/Calendar';
import Files from './pages/Files';
import Settings from './pages/Settings';

// Import components
import Layout from './components/Layout';
import apiService from './lib/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('No auth token found');
        setLoading(false);
        return;
      }

      // Verify token with backend
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      console.log('✅ User authenticated:', userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <DashboardProvider>
        <Router>
          <div className="App">
            {!isAuthenticated ? (
              <Login 
                setIsAuthenticated={setIsAuthenticated} 
                setUser={setUser}
              />
            ) : (
              <Layout user={user} onLogout={logout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/files" element={<Files />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            )}
            <Toaster />
          </div>
        </Router>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;