import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        chat: 'Chat',
        weather: 'Weather',
        legal: 'Legal Info',
        safety: 'Safety',
        emergency: 'Emergency',
        settings: 'Settings',
      },
      
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Information',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
        online: 'Online',
        offline: 'Offline',
        connecting: 'Connecting...',
        reconnecting: 'Reconnecting...',
        connected: 'Connected',
        disconnected: 'Disconnected',
      },
      
      // Dashboard
      dashboard: {
        title: 'FisherMate Dashboard',
        welcome: 'Welcome to FisherMate',
        weatherSummary: 'Weather Summary',
        recentAlerts: 'Recent Alerts',
        quickActions: 'Quick Actions',
        stats: 'Statistics',
        notifications: 'Notifications',
      },
      
      // Chat
      chat: {
        title: 'Chat with FisherMate',
        placeholder: 'Type your message here...',
        send: 'Send',
        voiceInput: 'Voice Input',
        listening: 'Listening...',
        speaking: 'Speaking...',
        newConversation: 'New Conversation',
        clearChat: 'Clear Chat',
        examples: {
          weather: 'What\'s the weather like today?',
          legal: 'What are the fishing regulations?',
          safety: 'Emergency safety procedures',
        },
      },
      
      // Weather
      weather: {
        title: 'Weather Information',
        current: 'Current Weather',
        forecast: 'Weather Forecast',
        alerts: 'Weather Alerts',
        marine: 'Marine Conditions',
        temperature: 'Temperature',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        windDirection: 'Wind Direction',
        pressure: 'Pressure',
        visibility: 'Visibility',
        waveHeight: 'Wave Height',
        tideInfo: 'Tide Information',
        uvIndex: 'UV Index',
        precipitation: 'Precipitation',
        feelLike: 'Feels Like',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        moonPhase: 'Moon Phase',
        seaState: 'Sea State',
        safetyLevel: 'Safety Level',
        recommendations: 'Recommendations',
      },
      
      // Legal
      legal: {
        title: 'Legal Information',
        regulations: 'Fishing Regulations',
        licenses: 'Licenses & Permits',
        seasons: 'Fishing Seasons',
        restrictions: 'Restrictions',
        penalties: 'Penalties',
        contacts: 'Authority Contacts',
        documents: 'Required Documents',
        zones: 'Fishing Zones',
        species: 'Protected Species',
        gear: 'Gear Regulations',
        reporting: 'Catch Reporting',
        compliance: 'Compliance Guidelines',
      },
      
      // Safety
      safety: {
        title: 'Safety Guidelines',
        procedures: 'Emergency Procedures',
        equipment: 'Safety Equipment',
        training: 'Safety Training',
        protocols: 'Safety Protocols',
        checklist: 'Pre-departure Checklist',
        communication: 'Communication Procedures',
        firstAid: 'First Aid',
        rescue: 'Rescue Procedures',
        fireExtinguisher: 'Fire Safety',
        lifejacket: 'Life Jacket',
        radio: 'Radio Communication',
        navigation: 'Navigation Safety',
        medical: 'Medical Emergency',
        distress: 'Distress Signals',
        evacuation: 'Evacuation Procedures',
      },
      
      // Emergency
      emergency: {
        title: 'Emergency Services',
        sos: 'SOS',
        callNow: 'Call Now',
        sendAlert: 'Send Alert',
        location: 'Share Location',
        contacts: 'Emergency Contacts',
        coastGuard: 'Coast Guard',
        police: 'Police',
        medical: 'Medical',
        fire: 'Fire Department',
        instructions: 'Emergency Instructions',
        status: 'Emergency Status',
        cancel: 'Cancel Emergency',
        confirm: 'Confirm Emergency',
        help: 'Get Help',
        reporting: 'Report Emergency',
      },
      
      // Settings
      settings: {
        title: 'Settings',
        language: 'Language',
        theme: 'Theme',
        notifications: 'Notifications',
        location: 'Location',
        privacy: 'Privacy',
        about: 'About',
        version: 'Version',
        support: 'Support',
        feedback: 'Feedback',
        logout: 'Logout',
        account: 'Account',
        preferences: 'Preferences',
        security: 'Security',
        data: 'Data & Storage',
        permissions: 'Permissions',
        updates: 'Updates',
        help: 'Help',
      },
      
      // Notifications
      notifications: {
        weatherAlert: 'Weather Alert',
        safetyWarning: 'Safety Warning',
        legalUpdate: 'Legal Update',
        systemUpdate: 'System Update',
        emergencyAlert: 'Emergency Alert',
        messageReceived: 'Message Received',
        connectionLost: 'Connection Lost',
        connectionRestored: 'Connection Restored',
        locationUpdated: 'Location Updated',
        settingsSaved: 'Settings Saved',
      },
      
      // Errors
      errors: {
        network: 'Network connection error',
        server: 'Server error',
        location: 'Location access denied',
        microphone: 'Microphone access denied',
        camera: 'Camera access denied',
        storage: 'Storage access denied',
        invalidInput: 'Invalid input',
        sessionExpired: 'Session expired',
        unauthorized: 'Unauthorized access',
        notFound: 'Resource not found',
        timeout: 'Request timeout',
        offline: 'You are offline',
        unknown: 'Unknown error occurred',
      },
    },
  },
  
  hi: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'डैशबोर्ड',
        chat: 'चैट',
        weather: 'मौसम',
        legal: 'कानूनी जानकारी',
        safety: 'सुरक्षा',
        emergency: 'आपातकाल',
        settings: 'सेटिंग्स',
      },
      
      // Common
      common: {
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        warning: 'चेतावनी',
        info: 'जानकारी',
        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        save: 'सेव करें',
        delete: 'मिटाएं',
        edit: 'संपादित करें',
        close: 'बंद करें',
        back: 'वापस',
        next: 'आगे',
        previous: 'पिछला',
        search: 'खोजें',
        filter: 'फिल्टर',
        sort: 'क्रमबद्ध करें',
        refresh: 'रिफ्रेश करें',
        online: 'ऑनलाइन',
        offline: 'ऑफलाइन',
        connecting: 'कनेक्ट हो रहा है...',
        reconnecting: 'पुनः कनेक्ट हो रहा है...',
        connected: 'कनेक्टेड',
        disconnected: 'डिस्कनेक्टेड',
      },
      
      // Dashboard
      dashboard: {
        title: 'फिशरमेट डैशबोर्ड',
        welcome: 'फिशरमेट में आपका स्वागत है',
        weatherSummary: 'मौसम सारांश',
        recentAlerts: 'हाल की चेतावनियां',
        quickActions: 'त्वरित कार्य',
        stats: 'आंकड़े',
        notifications: 'सूचनाएं',
      },
      
      // Chat
      chat: {
        title: 'फिशरमेट के साथ चैट करें',
        placeholder: 'यहाँ अपना संदेश टाइप करें...',
        send: 'भेजें',
        voiceInput: 'आवाज़ इनपुट',
        listening: 'सुन रहा है...',
        speaking: 'बोल रहा है...',
        newConversation: 'नई बातचीत',
        clearChat: 'चैट साफ़ करें',
        examples: {
          weather: 'आज मौसम कैसा है?',
          legal: 'मछली पकड़ने के नियम क्या हैं?',
          safety: 'आपातकालीन सुरक्षा प्रक्रिया',
        },
      },
      
      // Weather
      weather: {
        title: 'मौसम की जानकारी',
        current: 'वर्तमान मौसम',
        forecast: 'मौसम का पूर्वानुमान',
        alerts: 'मौसम चेतावनी',
        marine: 'समुद्री स्थिति',
        temperature: 'तापमान',
        humidity: 'आर्द्रता',
        windSpeed: 'हवा की गति',
        windDirection: 'हवा की दिशा',
        pressure: 'दबाव',
        visibility: 'दृश्यता',
        waveHeight: 'लहर की ऊंचाई',
        tideInfo: 'ज्वार की जानकारी',
        uvIndex: 'यूवी सूचकांक',
        precipitation: 'वर्षा',
        feelLike: 'अनुभव',
        sunrise: 'सूर्योदय',
        sunset: 'सूर्यास्त',
        moonPhase: 'चंद्र चरण',
        seaState: 'समुद्र की स्थिति',
        safetyLevel: 'सुरक्षा स्तर',
        recommendations: 'सुझाव',
      },
      
      // Add more Hindi translations as needed...
    },
  },
  
  ta: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'டாஷ்போர்டு',
        chat: 'சாட்',
        weather: 'வானிலை',
        legal: 'சட்ட தகவல்',
        safety: 'பாதுகாப்பு',
        emergency: 'அவசரநிலை',
        settings: 'அமைப்புகள்',
      },
      
      // Common
      common: {
        loading: 'ஏற்றுகிறது...',
        error: 'பிழை',
        success: 'வெற்றி',
        warning: 'எச்சரிக்கை',
        info: 'தகவல்',
        cancel: 'ரத்து செய்',
        confirm: 'உறுதிப்படுத்து',
        save: 'சேமி',
        delete: 'நீக்கு',
        edit: 'திருத்து',
        close: 'மூடு',
        back: 'பின்',
        next: 'அடுத்து',
        previous: 'முந்தைய',
        search: 'தேடு',
        filter: 'வடிகட்டு',
        sort: 'வரிசைப்படுத்து',
        refresh: 'புதுப்பி',
        online: 'ஆன்லைன்',
        offline: 'ஆஃப்லைன்',
        connecting: 'இணைக்கிறது...',
        reconnecting: 'மீண்டும் இணைக்கிறது...',
        connected: 'இணைக்கப்பட்டது',
        disconnected: 'துண்டிக்கப்பட்டது',
      },
      
      // Dashboard
      dashboard: {
        title: 'பிஷர்மேட் டாஷ்போர்டு',
        welcome: 'பிஷர்மேட்டிற்கு வரவேற்கிறோம்',
        weatherSummary: 'வானிலை சுருக்கம்',
        recentAlerts: 'சமீபத்திய எச்சரிக்கைகள்',
        quickActions: 'விரைவான செயல்கள்',
        stats: 'புள்ளிவிவரங்கள்',
        notifications: 'அறிவிப்புகள்',
      },
      
      // Chat
      chat: {
        title: 'பிஷர்மேட்டுடன் சாட் செய்யுங்கள்',
        placeholder: 'உங்கள் செய்தியை இங்கே தட்டச்சு செய்யுங்கள்...',
        send: 'அனுப்பு',
        voiceInput: 'குரல் உள்ளீடு',
        listening: 'கேட்கிறது...',
        speaking: 'பேசுகிறது...',
        newConversation: 'புதிய உரையாடல்',
        clearChat: 'சாட்டை அழி',
        examples: {
          weather: 'இன்று வானிலை எப்படி இருக்கிறது?',
          legal: 'மீன்பிடி விதிமுறைகள் என்ன?',
          safety: 'அவசரகால பாதுகாப்பு நடைமுறைகள்',
        },
      },
      
      // Add more Tamil translations as needed...
    },
  },
  
  // Add more languages (Telugu, Malayalam, Kannada, Bengali, etc.)
};

const i18nConfig = {
  resources,
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
    lookupLocalStorage: 'fishermate_language',
    lookupFromPathIndex: 0,
    lookupFromSubdomainIndex: 0,
    convertDetectedLanguage: (lng) => {
      // Convert language codes to our supported languages
      const supportedLanguages = ['en', 'hi', 'ta', 'te', 'ml', 'kn', 'bn', 'gu', 'or', 'as', 'mr', 'pa', 'ur'];
      const detected = lng.split('-')[0];
      return supportedLanguages.includes(detected) ? detected : 'en';
    },
  },
  
  interpolation: {
    escapeValue: false,
    format: (value, format, lng) => {
      if (format === 'number') {
        return new Intl.NumberFormat(lng).format(value);
      }
      if (format === 'date') {
        return new Intl.DateTimeFormat(lng).format(value);
      }
      if (format === 'time') {
        return new Intl.DateTimeFormat(lng, {
          hour: '2-digit',
          minute: '2-digit',
        }).format(value);
      }
      if (format === 'currency') {
        return new Intl.NumberFormat(lng, {
          style: 'currency',
          currency: 'INR',
        }).format(value);
      }
      return value;
    },
  },
  
  react: {
    useSuspense: false,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'b', 'u', 'span'],
  },
  
  // Namespace support
  ns: ['translation'],
  defaultNS: 'translation',
  
  // Plural forms
  pluralSeparator: '_',
  contextSeparator: '_',
  
  // Key separator
  keySeparator: '.',
  nsSeparator: ':',
  
  // Support for right-to-left languages
  supportedLngs: ['en', 'hi', 'ta', 'te', 'ml', 'kn', 'bn', 'gu', 'or', 'as', 'mr', 'pa', 'ur'],
  
  // Load missing translations
  saveMissing: process.env.NODE_ENV === 'development',
  
  // Performance optimization
  preload: ['en', 'hi', 'ta'],
  
  // Cleanup
  cleanCode: true,
  
  // Backend options for dynamic loading
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/{{lng}}/{{ns}}.json',
    allowMultiLoading: false,
    crossDomain: false,
    withCredentials: false,
    overrideMimeType: false,
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig);

// Language utilities
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'or', name: 'Oriya', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

export const getRTLLanguages = () => ['ur', 'ar'];

export const isRTL = (language) => getRTLLanguages().includes(language);

export const changeLanguage = (language) => {
  i18n.changeLanguage(language);
  localStorage.setItem('fishermate_language', language);
  document.documentElement.lang = language;
  document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
  document.body.className = `lang-${language}`;
};

export const getCurrentLanguage = () => i18n.language;

export const getLanguageDirection = (language) => isRTL(language) ? 'rtl' : 'ltr';

export const formatMessage = (key, values = {}) => {
  return i18n.t(key, values);
};

export const hasTranslation = (key) => {
  return i18n.exists(key);
};

export default i18n;
