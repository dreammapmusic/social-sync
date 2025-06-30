import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Always use dark theme since light mode is removed
  const theme = 'dark';

  useEffect(() => {
    // Always set dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  }, []);

  const value = {
    theme: 'dark',
    toggleTheme: () => {}, // No-op since we only have dark mode
    isDark: true,
    isLight: false
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext; 