import React, { createContext, useContext, useState } from 'react';
import Admin from '../pages/adminPanel';
import Auth from '../pages/Auth';
import Home from '../pages/Home';
import Place from '../pages/PlacePage';

export const WidgetContext = createContext();

export const WidgetManager = ({ children }) => {
  const [currentWidget, setCurrentWidget] = useState('home');
  const [widgetParams, setWidgetParams] = useState({});

  const showWidget = (widgetName, params = {}) => {
    setCurrentWidget(widgetName);
    setWidgetParams(params);
  };

  const renderWidget = () => {
    switch (currentWidget) {
      case 'home':
        return <Home />;
      case 'auth':
        return <Auth />;
      case 'admin':
        return <Admin />;
      case 'place':
        return <Place id={widgetParams.id} />;
      default:
        return <Home />;
    }
  };

  return (
    <WidgetContext.Provider value={{ showWidget }}>
      {children}
      {renderWidget()}
    </WidgetContext.Provider>
  );
}; 