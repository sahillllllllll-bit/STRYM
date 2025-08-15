// src/context/ThemeContext.js
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState(() => {
    return localStorage.getItem('themeColor') || 'blue';
  });



  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeColor);
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);



  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor}}>
      {children}
    </ThemeContext.Provider>
  );
};
