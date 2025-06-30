import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle = ({ variant = 'default', size = 'default' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const toggleVariants = {
    light: { x: 0 },
    dark: { x: 24 }
  };

  if (variant === 'switch') {
    return (
      <motion.button
        onClick={toggleTheme}
        className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center"
          variants={toggleVariants}
          animate={theme}
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
        >
          {isDark ? (
            <Moon className="w-2.5 h-2.5 text-gray-800" />
          ) : (
            <Sun className="w-2.5 h-2.5 text-yellow-600" />
          )}
        </motion.div>
      </motion.button>
    );
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={toggleTheme}
        className="relative overflow-hidden"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 text-blue-400" />
          )}
        </motion.div>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={toggleTheme}
      className="flex items-center gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 transition-all duration-300"
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0.8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-blue-400" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </motion.div>
      <span className="text-sm font-medium">
        {isDark ? 'Dark' : 'Light'} Mode
      </span>
    </Button>
  );
};

export const ThemeSelector = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => !isDark && toggleTheme()}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          !isDark
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Sun className="h-4 w-4" />
        Light
      </button>
      <button
        onClick={() => isDark && toggleTheme()}
        className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          isDark
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Moon className="h-4 w-4" />
        Dark
      </button>
    </div>
  );
};

export default ThemeToggle; 