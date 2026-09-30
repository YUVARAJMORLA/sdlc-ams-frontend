'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  transitionAnimation: null, // 'meteor' | 'sunlight' | null
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [transitionAnimation, setTransitionAnimation] = useState(null);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('tcs_theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeState(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (_) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    if (transitionAnimation) return;

    if (theme === 'light') {
      // Light -> Dark: Trigger 3D Meteor Shower Animation
      setTransitionAnimation('meteor');

      setTimeout(() => {
        setThemeState('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('tcs_theme', 'dark'); } catch (_) {}
      }, 500);

      setTimeout(() => {
        setTransitionAnimation(null);
      }, 2200);
    } else {
      // Dark -> Light: Trigger 3D Sunlight / Solar Dawn Animation
      setTransitionAnimation('sunlight');

      setTimeout(() => {
        setThemeState('light');
        document.documentElement.setAttribute('data-theme', 'light');
        try { localStorage.setItem('tcs_theme', 'light'); } catch (_) {}
      }, 500);

      setTimeout(() => {
        setTransitionAnimation(null);
      }, 2200);
    }
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      try { localStorage.setItem('tcs_theme', newTheme); } catch (_) {}
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, transitionAnimation, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
