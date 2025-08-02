/**
 * Analytics utilities for FisherMate.AI
 * Includes Vercel Analytics and custom event tracking
 */

import { Analytics } from '@vercel/analytics/react';

// Custom analytics events for FisherMate.AI
export const trackEvent = (eventName, properties = {}) => {
  // Track custom events
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      custom_parameter: true,
      ...properties
    });
  }
  
  // Console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
};

// Fishing-specific analytics events
export const trackFishingEvent = {
  // User interactions
  chatMessage: (message, language = 'en') => {
    trackEvent('chat_message_sent', {
      message_length: message.length,
      language,
      timestamp: new Date().toISOString()
    });
  },

  // Weather queries
  weatherCheck: (location, type = 'current') => {
    trackEvent('weather_check', {
      location,
      weather_type: type,
      timestamp: new Date().toISOString()
    });
  },

  // Market price queries
  priceCheck: (fishType, market = 'unknown') => {
    trackEvent('price_check', {
      fish_type: fishType,
      market,
      timestamp: new Date().toISOString()
    });
  },

  // Border/zone interactions
  borderCheck: (zoneName, action = 'view') => {
    trackEvent('border_interaction', {
      zone_name: zoneName,
      action,
      timestamp: new Date().toISOString()
    });
  },

  // Emergency features
  sosActivated: (location, method = 'button') => {
    trackEvent('sos_activated', {
      location,
      activation_method: method,
      timestamp: new Date().toISOString(),
      priority: 'high'
    });
  },

  // Language switching
  languageChange: (fromLang, toLang) => {
    trackEvent('language_changed', {
      from_language: fromLang,
      to_language: toLang,
      timestamp: new Date().toISOString()
    });
  },

  // Feature usage
  featureUsed: (featureName, duration = null) => {
    trackEvent('feature_used', {
      feature_name: featureName,
      duration_seconds: duration,
      timestamp: new Date().toISOString()
    });
  },

  // User engagement
  sessionStart: (userType = 'fisherman') => {
    trackEvent('session_start', {
      user_type: userType,
      timestamp: new Date().toISOString()
    });
  },

  sessionEnd: (duration, interactions = 0) => {
    trackEvent('session_end', {
      session_duration: duration,
      total_interactions: interactions,
      timestamp: new Date().toISOString()
    });
  }
};

// Page view tracking
export const trackPageView = (pageName, additionalData = {}) => {
  trackEvent('page_view', {
    page_name: pageName,
    ...additionalData,
    timestamp: new Date().toISOString()
  });
};

// Error tracking
export const trackError = (errorType, errorMessage, component = 'unknown') => {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    component,
    timestamp: new Date().toISOString()
  });
};

// Performance tracking
export const trackPerformance = (metric, value, unit = 'ms') => {
  trackEvent('performance_metric', {
    metric_name: metric,
    value,
    unit,
    timestamp: new Date().toISOString()
  });
};

// Export the Analytics component for easy integration
export { Analytics };

// Default export for the analytics utilities
export default {
  trackEvent,
  trackFishingEvent,
  trackPageView,
  trackError,
  trackPerformance
};
