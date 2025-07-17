import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiCloud, 
  FiMapPin, 
  FiAlertTriangle, 
  FiMessageCircle, 
  FiShield,
  FiPhone,
  FiTrendingUp,
  FiUsers,
  FiActivity,
  FiSun,
  FiCloudRain,
  FiWind,
  FiThermometer,
  FiDroplet,
  FiEye,
  FiNavigation,
  FiCalendar,
  FiClock,
  FiStar,
  FiBookOpen,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';
import { weatherApi, chatApi, emergencyApi } from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatMessage } from '../services/i18nService';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.space.lg};
  max-width: 1200px;
  margin: 0 auto;
  
  ${props => props.theme.media.mobile} {
    padding: ${props => props.theme.space.md};
  }
`;

const WelcomeSection = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.wave} 100%);
  color: white;
  padding: ${props => props.theme.space.xl};
  border-radius: ${props => props.theme.radii.xl};
  margin-bottom: ${props => props.theme.space.lg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: url('/waves-pattern.svg') no-repeat center right;
    background-size: cover;
    opacity: 0.1;
  }
  
  .welcome-content {
    position: relative;
    z-index: 1;
  }
  
  h1 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-bottom: ${props => props.theme.space.md};
    
    ${props => props.theme.media.mobile} {
      font-size: ${props => props.theme.fontSizes['2xl']};
    }
  }
  
  p {
    font-size: ${props => props.theme.fontSizes.lg};
    opacity: 0.9;
    margin-bottom: ${props => props.theme.space.lg};
  }
  
  .quick-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: ${props => props.theme.space.md};
    margin-top: ${props => props.theme.space.lg};
  }
  
  .stat-item {
    text-align: center;
    
    .stat-value {
      font-size: ${props => props.theme.fontSizes['2xl']};
      font-weight: ${props => props.theme.fontWeights.bold};
      display: block;
    }
    
    .stat-label {
      font-size: ${props => props.theme.fontSizes.sm};
      opacity: 0.8;
      margin-top: ${props => props.theme.space.xs};
    }
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${props => props.theme.space.lg};
  margin-bottom: ${props => props.theme.space.xl};
  
  ${props => props.theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.radii.xl};
  padding: ${props => props.theme.space.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.borderLight};
  cursor: pointer;
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.space.md};
    margin-bottom: ${props => props.theme.space.md};
    
    .icon {
      width: 48px;
      height: 48px;
      border-radius: ${props => props.theme.radii.lg};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: white;
    }
    
    .card-title {
      font-size: ${props => props.theme.fontSizes.lg};
      font-weight: ${props => props.theme.fontWeights.semibold};
      color: ${props => props.theme.colors.textPrimary};
    }
  }
  
  .card-content {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
  
  .card-action {
    margin-top: ${props => props.theme.space.md};
    padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
    background: ${props => props.theme.colors.light};
    border-radius: ${props => props.theme.radii.lg};
    font-size: ${props => props.theme.fontSizes.sm};
    font-weight: ${props => props.theme.fontWeights.medium};
    color: ${props => props.theme.colors.primary};
    text-align: center;
  }
`;

const WeatherWidget = styled.div`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.radii.xl};
  padding: ${props => props.theme.space.lg};
  box-shadow: ${props => props.theme.shadows.md};
  border: 1px solid ${props => props.theme.colors.borderLight};
  
  .weather-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${props => props.theme.space.lg};
    
    h3 {
      font-size: ${props => props.theme.fontSizes.lg};
      font-weight: ${props => props.theme.fontWeights.semibold};
      color: ${props => props.theme.colors.textPrimary};
    }
    
    .refresh-button {
      background: none;
      border: none;
      color: ${props => props.theme.colors.textSecondary};
      cursor: pointer;
      padding: ${props => props.theme.space.sm};
      border-radius: ${props => props.theme.radii.md};
      
      &:hover {
        background: ${props => props.theme.colors.light};
      }
    }
  }
  
  .weather-current {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: ${props => props.theme.space.lg};
    margin-bottom: ${props => props.theme.space.lg};
    
    .temperature {
      font-size: ${props => props.theme.fontSizes['4xl']};
      font-weight: ${props => props.theme.fontWeights.bold};
      color: ${props => props.theme.colors.textPrimary};
      text-align: center;
    }
    
    .weather-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: ${props => props.theme.space.md};
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: ${props => props.theme.space.sm};
        
        .icon {
          color: ${props => props.theme.colors.textSecondary};
        }
        
        .value {
          font-weight: ${props => props.theme.fontWeights.medium};
          color: ${props => props.theme.colors.textPrimary};
        }
        
        .label {
          font-size: ${props => props.theme.fontSizes.sm};
          color: ${props => props.theme.colors.textSecondary};
        }
      }
    }
  }
  
  .weather-forecast {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: ${props => props.theme.space.md};
    
    .forecast-item {
      text-align: center;
      padding: ${props => props.theme.space.md};
      background: ${props => props.theme.colors.light};
      border-radius: ${props => props.theme.radii.lg};
      
      .day {
        font-size: ${props => props.theme.fontSizes.sm};
        color: ${props => props.theme.colors.textSecondary};
        margin-bottom: ${props => props.theme.space.sm};
      }
      
      .icon {
        font-size: ${props => props.theme.fontSizes.xl};
        margin-bottom: ${props => props.theme.space.sm};
      }
      
      .temp {
        font-weight: ${props => props.theme.fontWeights.medium};
        color: ${props => props.theme.colors.textPrimary};
      }
    }
  }
`;

const AlertsSection = styled.div`
  margin-bottom: ${props => props.theme.space.xl};
  
  h2 {
    font-size: ${props => props.theme.fontSizes.xl};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: ${props => props.theme.space.lg};
    display: flex;
    align-items: center;
    gap: ${props => props.theme.space.sm};
  }
  
  .alerts-grid {
    display: grid;
    gap: ${props => props.theme.space.md};
  }
`;

const AlertItem = styled.div`
  background: ${props => {
    if (props.severity === 'high') return props.theme.colors.danger + '15';
    if (props.severity === 'medium') return props.theme.colors.warning + '15';
    return props.theme.colors.info + '15';
  }};
  border-left: 4px solid ${props => {
    if (props.severity === 'high') return props.theme.colors.danger;
    if (props.severity === 'medium') return props.theme.colors.warning;
    return props.theme.colors.info;
  }};
  padding: ${props => props.theme.space.md};
  border-radius: ${props => props.theme.radii.lg};
  
  .alert-header {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.space.sm};
    margin-bottom: ${props => props.theme.space.sm};
    
    .alert-icon {
      color: ${props => {
        if (props.severity === 'high') return props.theme.colors.danger;
        if (props.severity === 'medium') return props.theme.colors.warning;
        return props.theme.colors.info;
      }};
    }
    
    .alert-title {
      font-weight: ${props => props.theme.fontWeights.semibold};
      color: ${props => props.theme.colors.textPrimary};
    }
    
    .alert-time {
      margin-left: auto;
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.textSecondary};
    }
  }
  
  .alert-message {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
`;

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalChats: 0,
    weatherChecks: 0,
    safetyTips: 0,
    emergencyContacts: 0
  });
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadWeatherData(),
        loadAlerts(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherData = async () => {
    try {
      // Get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lon: longitude });
            
            const weatherData = await weatherApi.getCurrentWeather(latitude, longitude);
            setWeather(weatherData);
          },
          (error) => {
            console.error('Error getting location:', error);
            // Use default location (Mumbai)
            loadDefaultWeather();
          }
        );
      } else {
        loadDefaultWeather();
      }
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  };

  const loadDefaultWeather = async () => {
    try {
      const weatherData = await weatherApi.getCurrentWeather(19.0760, 72.8777); // Mumbai
      setWeather(weatherData);
    } catch (error) {
      console.error('Error loading default weather:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const alertsData = await weatherApi.getAlerts(19.0760, 72.8777);
      setAlerts(alertsData.alerts || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  const loadStats = async () => {
    try {
      // Load user statistics from local storage or API
      const savedStats = localStorage.getItem('fishermate_stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const refreshWeather = async () => {
    if (location) {
      try {
        const weatherData = await weatherApi.getCurrentWeather(location.lat, location.lon);
        setWeather(weatherData);
      } catch (error) {
        console.error('Error refreshing weather:', error);
      }
    }
  };

  const quickActions = [
    {
      title: t('nav.chat'),
      description: t('chat.description'),
      icon: FiMessageCircle,
      iconColor: '#007bff',
      action: () => navigate('/chat'),
      actionText: t('chat.startChat')
    },
    {
      title: t('nav.weather'),
      description: t('weather.description'),
      icon: FiCloud,
      iconColor: '#17a2b8',
      action: () => navigate('/weather'),
      actionText: t('weather.viewForecast')
    },
    {
      title: t('nav.safety'),
      description: t('safety.description'),
      icon: FiShield,
      iconColor: '#28a745',
      action: () => navigate('/safety'),
      actionText: t('safety.viewGuidelines')
    },
    {
      title: t('nav.emergency'),
      description: t('emergency.description'),
      icon: FiPhone,
      iconColor: '#dc3545',
      action: () => navigate('/emergency'),
      actionText: t('emergency.getHelp')
    }
  ];

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <FiSun />;
      case 'rain':
      case 'drizzle':
        return <FiCloudRain />;
      case 'wind':
        return <FiWind />;
      default:
        return <FiCloud />;
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], { weekday: 'short' });
  };

  if (loading) {
    return <LoadingSpinner type="fish" text={t('common.loading')} />;
  }

  return (
    <DashboardContainer>
      <WelcomeSection>
        <div className="welcome-content">
          <h1>{t('dashboard.welcome')}</h1>
          <p>{formatMessage('dashboard.welcomeMessage', { name: 'Fisher' })}</p>
          
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.totalChats}</span>
              <span className="stat-label">{t('dashboard.totalChats')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.weatherChecks}</span>
              <span className="stat-label">{t('dashboard.weatherChecks')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.safetyTips}</span>
              <span className="stat-label">{t('dashboard.safetyTips')}</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.emergencyContacts}</span>
              <span className="stat-label">{t('dashboard.emergencyContacts')}</span>
            </div>
          </div>
        </div>
      </WelcomeSection>

      <QuickActions>
        {quickActions.map((action, index) => (
          <ActionCard key={index} onClick={action.action}>
            <div className="card-header">
              <div className="icon" style={{ backgroundColor: action.iconColor }}>
                <action.icon />
              </div>
              <div className="card-title">{action.title}</div>
            </div>
            <div className="card-content">{action.description}</div>
            <div className="card-action">{action.actionText}</div>
          </ActionCard>
        ))}
      </QuickActions>

      {weather && (
        <WeatherWidget>
          <div className="weather-header">
            <h3>{t('weather.current')}</h3>
            <button className="refresh-button" onClick={refreshWeather}>
              <FiRefreshCw size={18} />
            </button>
          </div>
          
          <div className="weather-current">
            <div className="temperature">
              {Math.round(weather.main?.temp || 0)}°C
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <FiDroplet className="icon" />
                <div>
                  <div className="value">{weather.main?.humidity || 0}%</div>
                  <div className="label">{t('weather.humidity')}</div>
                </div>
              </div>
              <div className="detail-item">
                <FiWind className="icon" />
                <div>
                  <div className="value">{weather.wind?.speed || 0} km/h</div>
                  <div className="label">{t('weather.windSpeed')}</div>
                </div>
              </div>
              <div className="detail-item">
                <FiEye className="icon" />
                <div>
                  <div className="value">{weather.visibility || 0} km</div>
                  <div className="label">{t('weather.visibility')}</div>
                </div>
              </div>
              <div className="detail-item">
                <FiNavigation className="icon" />
                <div>
                  <div className="value">{weather.main?.pressure || 0} hPa</div>
                  <div className="label">{t('weather.pressure')}</div>
                </div>
              </div>
            </div>
          </div>
          
          {weather.forecast && (
            <div className="weather-forecast">
              {weather.forecast.slice(0, 5).map((day, index) => (
                <div key={index} className="forecast-item">
                  <div className="day">{formatDate(day.dt * 1000)}</div>
                  <div className="icon">{getWeatherIcon(day.weather[0]?.main)}</div>
                  <div className="temp">{Math.round(day.main.temp)}°</div>
                </div>
              ))}
            </div>
          )}
        </WeatherWidget>
      )}

      {alerts.length > 0 && (
        <AlertsSection>
          <h2>
            <FiAlertTriangle />
            {t('dashboard.recentAlerts')}
          </h2>
          <div className="alerts-grid">
            {alerts.map((alert, index) => (
              <AlertItem key={index} severity={alert.severity}>
                <div className="alert-header">
                  <FiAlertTriangle className="alert-icon" />
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-time">{formatTime(alert.timestamp)}</div>
                </div>
                <div className="alert-message">{alert.message}</div>
              </AlertItem>
            ))}
          </div>
        </AlertsSection>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
