import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { trackFishingEvent, trackPageView, trackError } from './utils/analytics';
import ErrorBoundary from './components/ErrorBoundary';
import FishingDashboard from './components/FishingDashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    // Initialize the application
    const initializeApp = async () => {
      try {
        // Track session start
        trackFishingEvent.sessionStart('fisherman');
        trackPageView('app_launch', { timestamp: new Date().toISOString() });

        // Simulate initial loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsLoading(false);
      } catch (error) {
        trackError('app_initialization', error.message, 'App');
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    // Track session end on page unload
    const handleBeforeUnload = () => {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000);
      trackFishingEvent.sessionEnd(sessionDuration);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionStartTime]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    trackPageView(page, { previous_page: currentPage });
    trackFishingEvent.featureUsed(`page_${page}`);
  };

  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner message="Initializing FisherMate.AI..." />
        <Analytics />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="App">
        <Header onPageChange={handlePageChange} currentPage={currentPage} />
        
        <main className="app-main">
          <Sidebar />
          
          <div className="app-content">
            {currentPage === 'dashboard' && <FishingDashboard />}
            {currentPage === 'borders' && (
              <div className="borders-page">
                <h2>🗺️ Fishing Borders & Compliance</h2>
                <p>Real-time monitoring of fishing zones and regulatory compliance</p>
                <FishingDashboard showMap={true} />
              </div>
            )}
            {currentPage === 'weather' && (
              <div className="weather-page">
                <h2>🌊 Weather & Marine Conditions</h2>
                <p>Real-time weather updates and marine forecasts</p>
              </div>
            )}
            {currentPage === 'prices' && (
              <div className="prices-page">
                <h2>💰 Market Prices</h2>
                <p>Live fish market prices and trends</p>
              </div>
            )}
            {currentPage === 'news' && (
              <div className="news-page">
                <h2>📰 Fisheries News</h2>
                <p>Latest news and updates from the fishing industry</p>
              </div>
            )}
            {currentPage === 'info' && (
              <div className="info-page">
                <h2>🐟 Fish Information</h2>
                <p>Comprehensive fish species database and information</p>
              </div>
            )}
          </div>
        </main>

        {/* Vercel Analytics Integration */}
        <Analytics />
        
        {/* Development analytics indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: '#000',
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 9999
          }}>
            📊 Analytics Active
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
