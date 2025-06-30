import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import dataService from '@/lib/dataService';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Calendar from '@/pages/Calendar';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Files from '@/pages/Files';
import Layout from '@/components/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          const result = await dataService.getCurrentUser();
          if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error("Failed to check authentication", error);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    };

    checkAuth();
  }, []);
  
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    // User data is managed by the backend, no localStorage needed
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <DashboardProvider>
        <>
          <Helmet>
            <title>SocialSync - Social Media Scheduler</title>
            <meta name="description" content="Schedule and manage your social media posts across Facebook, Instagram, Twitter, and more platforms with SocialSync." />
          </Helmet>
          <Router>
            <div className="min-h-screen transition-colors duration-300">
              <Routes>
                <Route 
                  path="/login" 
                  element={
                    isAuthenticated ? 
                    <Navigate to="/dashboard" replace /> : 
                    <Login setIsAuthenticated={setIsAuthenticated} setUser={handleUserUpdate} />
                  } 
                />
                <Route 
                  path="/*" 
                  element={
                    isAuthenticated ? 
                    <Layout user={user} setUser={handleUserUpdate}>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard user={user} />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/files" element={<Files />} />
                        <Route path="/settings" element={<Settings user={user} setUser={handleUserUpdate} />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </Layout> : 
                    <Navigate to="/login" replace />
                  } 
                />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </>
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;