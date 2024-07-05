import React, { createContext, useState, useContext, useEffect } from 'react';

const TemperatureContext = createContext();

export const TemperatureProvider = ({ children }) => {
  const [isCelsius, setIsCelsius] = useState(() => {
    const saved = localStorage.getItem('temperatureUnit');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('temperatureUnit', JSON.stringify(isCelsius));
  }, [isCelsius]);

  const toggleTemperatureUnit = () => {
    setIsCelsius(prev => !prev);
  };

  return (
    <TemperatureContext.Provider value={{ isCelsius, toggleTemperatureUnit }}>
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperature = () => {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw new Error('useTemperature must be used within a TemperatureProvider');
  }
  return context;
};