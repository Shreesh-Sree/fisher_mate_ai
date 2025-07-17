import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#007bff',
    primaryHover: '#0056b3',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    white: '#ffffff',
    black: '#000000',
    
    // Ocean/Marine themed colors
    ocean: '#006994',
    wave: '#4a90e2',
    sand: '#f5e6d3',
    coral: '#ff6b6b',
    seaweed: '#2d5a27',
    
    // Background colors
    background: '#f5f5f5',
    cardBackground: '#ffffff',
    headerBackground: '#007bff',
    
    // Text colors
    textPrimary: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    textLight: '#ffffff',
    
    // Border colors
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    
    // Status colors
    online: '#28a745',
    offline: '#dc3545',
    away: '#ffc107',
    
    // Emergency colors
    emergency: '#dc3545',
    emergencyHover: '#c82333',
    
    // Weather colors
    sunny: '#ffc107',
    cloudy: '#6c757d',
    rainy: '#17a2b8',
    stormy: '#dc3545',
    windy: '#20c997',
  },
  
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    hindi: '"Noto Sans Devanagari", sans-serif',
    tamil: '"Noto Sans Tamil", sans-serif',
    telugu: '"Noto Sans Telugu", sans-serif',
    kannada: '"Noto Sans Kannada", sans-serif',
    malayalam: '"Noto Sans Malayalam", sans-serif',
    bengali: '"Noto Sans Bengali", sans-serif',
    gujarati: '"Noto Sans Gujarati", sans-serif',
    oriya: '"Noto Sans Oriya", sans-serif',
    assamese: '"Noto Sans Assamese", sans-serif',
    monospace: '"Fira Code", "Consolas", "Monaco", monospace',
  },
  
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  space: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
    '4xl': '6rem',   // 96px
    '5xl': '8rem',   // 128px
  },
  
  radii: {
    none: '0',
    sm: '0.125rem',  // 2px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  breakpoints: {
    xs: '320px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  transitions: {
    fast: '0.15s ease-out',
    normal: '0.3s ease-out',
    slow: '0.5s ease-out',
  },
  
  // Media queries for responsive design
  media: {
    mobile: `@media (max-width: 767px)`,
    tablet: `@media (min-width: 768px) and (max-width: 1023px)`,
    desktop: `@media (min-width: 1024px)`,
    largeDesktop: `@media (min-width: 1280px)`,
  },
  
  // Components specific styling
  components: {
    button: {
      height: '44px',
      minWidth: '44px',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    },
    
    input: {
      height: '44px',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '16px',
      border: '1px solid #e0e0e0',
      backgroundColor: '#ffffff',
    },
    
    card: {
      padding: '24px',
      borderRadius: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f0f0f0',
    },
    
    header: {
      height: '64px',
      padding: '0 24px',
      backgroundColor: '#007bff',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    
    sidebar: {
      width: '280px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #f0f0f0',
      boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
    },
    
    chatBubble: {
      maxWidth: '70%',
      padding: '12px 16px',
      borderRadius: '18px',
      margin: '4px 0',
      fontSize: '16px',
      lineHeight: '1.4',
    },
    
    weatherCard: {
      padding: '20px',
      borderRadius: '16px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f0f0f0',
    },
    
    emergencyButton: {
      minHeight: '60px',
      minWidth: '60px',
      padding: '20px',
      borderRadius: '50px',
      fontSize: '18px',
      fontWeight: '700',
      backgroundColor: '#dc3545',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 4px 8px rgba(220, 53, 69, 0.3)',
      transition: 'all 0.3s ease',
    },
  },
};

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textPrimary};
    line-height: ${props => props.theme.lineHeights.normal};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Language-specific font families */
  .lang-hi, .lang-mr, .lang-ne {
    font-family: ${props => props.theme.fonts.hindi};
  }

  .lang-ta {
    font-family: ${props => props.theme.fonts.tamil};
  }

  .lang-te {
    font-family: ${props => props.theme.fonts.telugu};
  }

  .lang-kn {
    font-family: ${props => props.theme.fonts.kannada};
  }

  .lang-ml {
    font-family: ${props => props.theme.fonts.malayalam};
  }

  .lang-bn {
    font-family: ${props => props.theme.fonts.bengali};
  }

  .lang-gu {
    font-family: ${props => props.theme.fonts.gujarati};
  }

  .lang-or {
    font-family: ${props => props.theme.fonts.oriya};
  }

  .lang-as {
    font-family: ${props => props.theme.fonts.assamese};
  }

  /* RTL Support */
  body[dir="rtl"] {
    direction: rtl;
    text-align: right;
  }

  body[dir="ltr"] {
    direction: ltr;
    text-align: left;
  }

  /* Accessibility */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Focus styles */
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Responsive images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    body {
      background-color: ${props => props.theme.colors.white};
      color: ${props => props.theme.colors.black};
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: ${props => props.theme.colors.dark};
      color: ${props => props.theme.colors.light};
    }
  }
`;

export default theme;
