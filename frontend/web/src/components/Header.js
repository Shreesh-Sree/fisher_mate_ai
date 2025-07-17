import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiMenu, 
  FiX, 
  FiGlobe, 
  FiSettings, 
  FiUser, 
  FiWifi, 
  FiWifiOff,
  FiBell,
  FiSearch,
  FiMic,
  FiMicOff,
  FiSun,
  FiMoon,
  FiPhone
} from 'react-icons/fi';
import { supportedLanguages, changeLanguage, getCurrentLanguage } from '../services/i18nService';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${props => props.theme.components.header.height};
  background: ${props => props.theme.components.header.backgroundColor};
  color: ${props => props.theme.components.header.color};
  padding: ${props => props.theme.components.header.padding};
  box-shadow: ${props => props.theme.components.header.boxShadow};
  z-index: ${props => props.theme.zIndices.sticky};
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  
  ${props => props.theme.media.mobile} {
    padding: 0 ${props => props.theme.space.md};
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: ${props => props.theme.fontWeights.bold};
  cursor: pointer;
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: ${props => props.theme.colors.wave};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }
  
  .logo-text {
    ${props => props.theme.media.mobile} {
      display: none;
    }
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  
  ${props => props.theme.media.mobile} {
    display: none;
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
  border-radius: ${props => props.theme.radii.lg};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  opacity: ${props => props.active ? 1 : 0.8};
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.sm};
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.xs};
  font-size: ${props => props.theme.fontSizes.sm};
  color: ${props => props.online ? props.theme.colors.online : props.theme.colors.offline};
  
  ${props => props.theme.media.mobile} {
    display: none;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textLight};
  padding: ${props => props.theme.space.sm};
  border-radius: ${props => props.theme.radii.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background: ${props => props.theme.colors.danger};
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
`;

const LanguageDropdown = styled.div`
  position: relative;
  
  .dropdown-content {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: ${props => props.theme.radii.lg};
    box-shadow: ${props => props.theme.shadows.lg};
    min-width: 200px;
    z-index: ${props => props.theme.zIndices.dropdown};
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid ${props => props.theme.colors.border};
    
    ${props => props.theme.media.mobile} {
      right: -20px;
      min-width: 160px;
    }
  }
  
  .language-option {
    display: flex;
    align-items: center;
    gap: ${props => props.theme.space.sm};
    padding: ${props => props.theme.space.sm} ${props => props.theme.space.md};
    cursor: pointer;
    color: ${props => props.theme.colors.textPrimary};
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-size: ${props => props.theme.fontSizes.sm};
    
    &:hover {
      background: ${props => props.theme.colors.light};
    }
    
    &.active {
      background: ${props => props.theme.colors.primary};
      color: white;
    }
    
    .flag {
      width: 20px;
      height: 15px;
      border-radius: 2px;
      background: ${props => props.theme.colors.border};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textLight};
  padding: ${props => props.theme.space.sm};
  cursor: pointer;
  
  ${props => props.theme.media.mobile} {
    display: block;
  }
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.theme.radii.full};
  padding: ${props => props.theme.space.xs} ${props => props.theme.space.md};
  min-width: 250px;
  
  ${props => props.theme.media.mobile} {
    display: none;
  }
  
  input {
    background: none;
    border: none;
    color: ${props => props.theme.colors.textLight};
    font-size: ${props => props.theme.fontSizes.sm};
    width: 100%;
    outline: none;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
  }
`;

const VoiceButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textLight};
  cursor: pointer;
  margin-left: ${props => props.theme.space.sm};
  
  &.recording {
    color: ${props => props.theme.colors.danger};
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const EmergencyIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: ${props => props.theme.colors.emergency};
  animation: emergency-pulse 1s infinite;
  
  @keyframes emergency-pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const Header = ({ 
  isOnline, 
  onMenuToggle, 
  onSearch, 
  onVoiceToggle, 
  isVoiceRecording, 
  notifications = [],
  emergencyMode = false,
  isDarkMode = false,
  onThemeToggle
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());

  useEffect(() => {
    setCurrentLanguage(getCurrentLanguage());
  }, []);

  const navigationItems = [
    { path: '/', label: t('nav.dashboard'), icon: null },
    { path: '/chat', label: t('nav.chat'), icon: null },
    { path: '/weather', label: t('nav.weather'), icon: null },
    { path: '/legal', label: t('nav.legal'), icon: null },
    { path: '/safety', label: t('nav.safety'), icon: null },
  ];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setShowLanguageDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch && onSearch(searchQuery);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const getCurrentLanguageData = () => {
    return supportedLanguages.find(lang => lang.code === currentLanguage) || supportedLanguages[0];
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const navItem = navigationItems.find(item => item.path === currentPath);
    return navItem ? navItem.label : t('nav.dashboard');
  };

  return (
    <HeaderContainer>
      {emergencyMode && <EmergencyIndicator />}
      
      <Logo onClick={handleLogoClick}>
        <div className="logo-icon">🐟</div>
        <span className="logo-text">FisherMate</span>
      </Logo>

      <Navigation>
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </NavLink>
        ))}
      </Navigation>

      <SearchBar>
        <FiSearch size={16} />
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <VoiceButton 
          className={isVoiceRecording ? 'recording' : ''}
          onClick={onVoiceToggle}
          title={isVoiceRecording ? t('chat.listening') : t('chat.voiceInput')}
        >
          {isVoiceRecording ? <FiMicOff size={16} /> : <FiMic size={16} />}
        </VoiceButton>
      </SearchBar>

      <HeaderActions>
        <StatusIndicator online={isOnline}>
          {isOnline ? <FiWifi size={16} /> : <FiWifiOff size={16} />}
          <span>{isOnline ? t('common.online') : t('common.offline')}</span>
        </StatusIndicator>

        <ActionButton 
          onClick={() => navigate('/emergency')}
          title={t('emergency.title')}
        >
          <FiPhone size={18} />
        </ActionButton>

        <ActionButton 
          onClick={() => navigate('/notifications')}
          title={t('notifications.title')}
        >
          <FiBell size={18} />
          {notifications.length > 0 && (
            <NotificationBadge>{notifications.length}</NotificationBadge>
          )}
        </ActionButton>

        <ActionButton 
          onClick={onThemeToggle}
          title={isDarkMode ? t('common.lightMode') : t('common.darkMode')}
        >
          {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </ActionButton>

        <LanguageDropdown>
          <ActionButton 
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            title={t('settings.language')}
          >
            <FiGlobe size={18} />
          </ActionButton>
          
          {showLanguageDropdown && (
            <div className="dropdown-content">
              {supportedLanguages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="flag">
                    {language.code.toUpperCase()}
                  </span>
                  <span>{language.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </LanguageDropdown>

        <ActionButton 
          onClick={() => navigate('/settings')}
          title={t('settings.title')}
        >
          <FiSettings size={18} />
        </ActionButton>

        <MobileMenuButton onClick={onMenuToggle}>
          <FiMenu size={24} />
        </MobileMenuButton>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
