import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Weather from './pages/Weather';
import Legal from './pages/Legal';
import Safety from './pages/Safety';
import Emergency from './pages/Emergency';
import Settings from './pages/Settings';

// Services
import { initializeI18n } from './services/i18nService';
import { detectUserLocation } from './services/locationService';
import { getDeviceInfo } from './services/deviceService';

// Styles
import GlobalStyles from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';
import { AppContainer, MainContent, ContentArea } from './styles/AppStyles';

// Utils
import { SUPPORTED_LANGUAGES } from './utils/constants';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('online');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);

      // Initialize i18n
      await initializeI18n();

      // Get user location
      const location = await detectUserLocation();
      setUserLocation(location);

      // Get device info
      const device = getDeviceInfo();
      setDeviceInfo(device);

      // Load user preferences
      loadUserPreferences();

      // Setup connection monitoring
      setupConnectionMonitoring();

      setIsLoading(false);
    } catch (error) {
      console.error('App initialization error:', error);
      setIsLoading(false);
    }
  };

  const loadUserPreferences = () => {
    try {
      const savedLanguage = localStorage.getItem('fishermate_language') || 'en';
      const savedTheme = localStorage.getItem('fishermate_theme') || 'light';
      
      if (SUPPORTED_LANGUAGES.includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      }
      
      setTheme(savedTheme);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const setupConnectionMonitoring = () => {
    const updateConnectionStatus = () => {
      setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    return () => {
      window.removeEventListener('online', updateConnectionStatus);
      window.removeEventListener('offline', updateConnectionStatus);
    };
  };

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('fishermate_language', language);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('fishermate_theme', newTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ErrorBoundary>
      <ThemeProvider theme={currentTheme}>
        <GlobalStyles />
        <Router>
          <AppContainer>
            <Header 
              onMenuClick={toggleSidebar}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
              theme={theme}
              onThemeChange={handleThemeChange}
              connectionStatus={connectionStatus}
            />
            
            <MainContent>
              <Sidebar 
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                currentLanguage={currentLanguage}
              />
              
              <ContentArea sidebarOpen={sidebarOpen}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={
                    <Dashboard 
                      userLocation={userLocation}
                      deviceInfo={deviceInfo}
                      currentLanguage={currentLanguage}
                    />
                  } />
                  <Route path="/chat" element={
                    <Chat 
                      userLocation={userLocation}
                      currentLanguage={currentLanguage}
                      connectionStatus={connectionStatus}
                    />
                  } />
                  <Route path="/weather" element={
                    <Weather 
                      userLocation={userLocation}
                      currentLanguage={currentLanguage}
                    />
                  } />
                  <Route path="/legal" element={
                    <Legal 
                      userLocation={userLocation}
                      currentLanguage={currentLanguage}
                    />
                  } />
                  <Route path="/safety" element={
                    <Safety 
                      currentLanguage={currentLanguage}
                    />
                  } />
                  <Route path="/emergency" element={
                    <Emergency 
                      userLocation={userLocation}
                      currentLanguage={currentLanguage}
                    />
                  } />
                  <Route path="/settings" element={
                    <Settings 
                      currentLanguage={currentLanguage}
                      onLanguageChange={handleLanguageChange}
                      theme={theme}
                      onThemeChange={handleThemeChange}
                    />
                  } />
                </Routes>
              </ContentArea>
            </MainContent>
          </AppContainer>
        </Router>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
