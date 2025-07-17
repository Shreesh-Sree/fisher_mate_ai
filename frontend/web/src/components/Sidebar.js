import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiMessageCircle, 
  FiCloud, 
  FiFileText, 
  FiShield, 
  FiPhone, 
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiActivity,
  FiMap,
  FiBookOpen,
  FiHelpCircle,
  FiX
} from 'react-icons/fi';

const SidebarContainer = styled.aside`
  position: fixed;
  top: 64px;
  left: 0;
  height: calc(100vh - 64px);
  width: ${props => props.collapsed ? '60px' : props.theme.components.sidebar.width};
  background: ${props => props.theme.components.sidebar.backgroundColor};
  border-right: ${props => props.theme.components.sidebar.borderRight};
  box-shadow: ${props => props.theme.components.sidebar.boxShadow};
  z-index: ${props => props.theme.zIndices.docked};
  transition: ${props => props.theme.transitions.normal};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  ${props => props.theme.media.mobile} {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    width: ${props => props.theme.components.sidebar.width};
    z-index: ${props => props.theme.zIndices.overlay};
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.theme.space.md};
  border-bottom: 1px solid ${props => props.theme.colors.borderLight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 60px;
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.space.sm};
  border-radius: ${props => props.theme.radii.md};
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.light};
  }
  
  ${props => props.theme.media.mobile} {
    display: none;
  }
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  padding: ${props => props.theme.space.sm};
  border-radius: ${props => props.theme.radii.md};
  
  ${props => props.theme.media.mobile} {
    display: block;
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: ${props => props.theme.space.md} 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textMuted};
  }
`;

const NavSection = styled.div`
  margin-bottom: ${props => props.theme.space.lg};
  
  .section-title {
    font-size: ${props => props.theme.fontSizes.xs};
    font-weight: ${props => props.theme.fontWeights.semibold};
    color: ${props => props.theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 0 ${props => props.theme.space.md};
    margin-bottom: ${props => props.theme.space.sm};
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: ${props => props.theme.transitions.fast};
  }
`;

const NavItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  width: 100%;
  padding: ${props => props.theme.space.md};
  background: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.textLight : props.theme.colors.textPrimary};
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  text-align: left;
  font-size: ${props => props.theme.fontSizes.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  position: relative;
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.light};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: -2px;
  }
  
  .icon {
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .label {
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: ${props => props.theme.transitions.fast};
    white-space: nowrap;
    overflow: hidden;
  }
  
  .badge {
    background: ${props => props.theme.colors.danger};
    color: white;
    border-radius: ${props => props.theme.radii.full};
    padding: 2px 6px;
    font-size: ${props => props.theme.fontSizes.xs};
    font-weight: ${props => props.theme.fontWeights.bold};
    margin-left: auto;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: ${props => props.theme.transitions.fast};
  }
  
  ${props => props.collapsed && `
    justify-content: center;
    
    .label,
    .badge {
      display: none;
    }
  `}
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.space.md};
  border-top: 1px solid ${props => props.theme.colors.borderLight};
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.space.md};
  padding: ${props => props.theme.space.md};
  background: ${props => props.theme.colors.light};
  border-radius: ${props => props.theme.radii.lg};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.border};
  }
  
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${props => props.theme.fontWeights.bold};
    font-size: ${props => props.theme.fontSizes.sm};
  }
  
  .user-info {
    flex: 1;
    opacity: ${props => props.collapsed ? 0 : 1};
    transition: ${props => props.theme.transitions.fast};
    
    .name {
      font-weight: ${props => props.theme.fontWeights.medium};
      font-size: ${props => props.theme.fontSizes.sm};
      color: ${props => props.theme.colors.textPrimary};
    }
    
    .status {
      font-size: ${props => props.theme.fontSizes.xs};
      color: ${props => props.theme.colors.textMuted};
    }
  }
  
  ${props => props.collapsed && `
    justify-content: center;
    
    .user-info {
      display: none;
    }
  `}
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndices.overlay - 1};
  display: none;
  
  ${props => props.theme.media.mobile} {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const Sidebar = ({ 
  isOpen, 
  onClose, 
  notifications = [], 
  emergencyAlerts = [],
  user = null 
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationSections = [
    {
      title: t('nav.main'),
      items: [
        {
          path: '/',
          label: t('nav.dashboard'),
          icon: FiHome,
          badge: null,
        },
        {
          path: '/chat',
          label: t('nav.chat'),
          icon: FiMessageCircle,
          badge: null,
        },
        {
          path: '/weather',
          label: t('nav.weather'),
          icon: FiCloud,
          badge: null,
        },
        {
          path: '/map',
          label: t('nav.map'),
          icon: FiMap,
          badge: null,
        },
      ],
    },
    {
      title: t('nav.information'),
      items: [
        {
          path: '/legal',
          label: t('nav.legal'),
          icon: FiFileText,
          badge: null,
        },
        {
          path: '/safety',
          label: t('nav.safety'),
          icon: FiShield,
          badge: null,
        },
        {
          path: '/guide',
          label: t('nav.guide'),
          icon: FiBookOpen,
          badge: null,
        },
      ],
    },
    {
      title: t('nav.tools'),
      items: [
        {
          path: '/emergency',
          label: t('nav.emergency'),
          icon: FiPhone,
          badge: emergencyAlerts.length > 0 ? emergencyAlerts.length : null,
        },
        {
          path: '/activity',
          label: t('nav.activity'),
          icon: FiActivity,
          badge: null,
        },
      ],
    },
    {
      title: t('nav.account'),
      items: [
        {
          path: '/profile',
          label: t('nav.profile'),
          icon: FiUser,
          badge: null,
        },
        {
          path: '/settings',
          label: t('nav.settings'),
          icon: FiSettings,
          badge: null,
        },
        {
          path: '/help',
          label: t('nav.help'),
          icon: FiHelpCircle,
          badge: null,
        },
      ],
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fishermate_token');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      
      <SidebarContainer collapsed={collapsed} isOpen={isOpen}>
        <SidebarHeader>
          {!collapsed && (
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#007bff' 
            }}>
              FisherMate
            </span>
          )}
          <CollapseButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </CollapseButton>
          <CloseButton onClick={onClose}>
            <FiX size={18} />
          </CloseButton>
        </SidebarHeader>

        <SidebarNav>
          {navigationSections.map((section, sectionIndex) => (
            <NavSection key={sectionIndex} collapsed={collapsed}>
              <div className="section-title">{section.title}</div>
              {section.items.map((item) => (
                <NavItem
                  key={item.path}
                  active={location.pathname === item.path}
                  collapsed={collapsed}
                  onClick={() => handleNavigation(item.path)}
                >
                  <div className="icon">
                    <item.icon size={20} />
                  </div>
                  <span className="label">{item.label}</span>
                  {item.badge && (
                    <span className="badge">{item.badge}</span>
                  )}
                </NavItem>
              ))}
            </NavSection>
          ))}
        </SidebarNav>

        <SidebarFooter>
          <UserProfile 
            collapsed={collapsed}
            onClick={() => handleNavigation('/profile')}
          >
            <div className="avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt="User Avatar" />
              ) : (
                getInitials(user?.name || 'User')
              )}
            </div>
            <div className="user-info">
              <div className="name">{user?.name || 'Fisher User'}</div>
              <div className="status">
                {user?.status || t('common.online')}
              </div>
            </div>
          </UserProfile>
          
          {!collapsed && (
            <NavItem
              onClick={handleLogout}
              style={{ 
                marginTop: '12px', 
                color: '#dc3545',
                borderTop: '1px solid #f0f0f0',
                paddingTop: '12px'
              }}
            >
              <div className="icon">
                <FiLogOut size={20} />
              </div>
              <span className="label">{t('settings.logout')}</span>
            </NavItem>
          )}
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
