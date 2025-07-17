// Web Vitals measurement utility
const getCLS = (onPerfEntry) => {
  import('web-vitals').then(({ getCLS }) => {
    getCLS(onPerfEntry);
  });
};

const getFID = (onPerfEntry) => {
  import('web-vitals').then(({ getFID }) => {
    getFID(onPerfEntry);
  });
};

const getFCP = (onPerfEntry) => {
  import('web-vitals').then(({ getFCP }) => {
    getFCP(onPerfEntry);
  });
};

const getLCP = (onPerfEntry) => {
  import('web-vitals').then(({ getLCP }) => {
    getLCP(onPerfEntry);
  });
};

const getTTFB = (onPerfEntry) => {
  import('web-vitals').then(({ getTTFB }) => {
    getTTFB(onPerfEntry);
  });
};

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};

// Custom performance tracking
export const performanceUtils = {
  // Track navigation timing
  trackNavigation: () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          domParse: navigation.domContentLoadedEventEnd - navigation.responseEnd,
          domReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          load: navigation.loadEventEnd - navigation.navigationStart,
        };
        
        console.log('Navigation Timing:', metrics);
        return metrics;
      }
    }
    return null;
  },

  // Track resource loading
  trackResources: () => {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource');
      const resourceMetrics = resources.map(resource => ({
        name: resource.name,
        duration: resource.duration,
        size: resource.transferSize,
        type: resource.initiatorType,
      }));
      
      console.log('Resource Loading:', resourceMetrics);
      return resourceMetrics;
    }
    return [];
  },

  // Track custom metrics
  trackCustomMetric: (name, value, unit = 'ms') => {
    if ('performance' in window && performance.mark) {
      performance.mark(`${name}-start`);
      // Simulate work or actual measurement
      setTimeout(() => {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        const measure = performance.getEntriesByName(name)[0];
        console.log(`${name}: ${measure.duration}${unit}`);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', 'timing_complete', {
            name: name,
            value: Math.round(measure.duration),
          });
        }
      }, value);
    }
  },

  // Track user interactions
  trackUserInteraction: (element, action) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`${action} on ${element}: ${duration}ms`);
      
      // Send to analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'user_interaction', {
          event_category: 'UX',
          event_label: `${element}_${action}`,
          value: Math.round(duration),
        });
      }
    };
  },

  // Track memory usage
  trackMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = performance.memory;
      const memoryMetrics = {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
      
      console.log('Memory Usage:', memoryMetrics);
      return memoryMetrics;
    }
    return null;
  },

  // Track network information
  trackNetworkInfo: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      const networkInfo = {
        type: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
      
      console.log('Network Info:', networkInfo);
      return networkInfo;
    }
    return null;
  },

  // Track device information
  trackDeviceInfo: () => {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio,
      },
    };
    
    console.log('Device Info:', deviceInfo);
    return deviceInfo;
  },

  // Track error metrics
  trackError: (error, errorInfo) => {
    const errorMetrics = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };
    
    console.error('Error Tracked:', errorMetrics);
    
    // Send to error tracking service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
    
    return errorMetrics;
  },

  // Track bundle size
  trackBundleSize: () => {
    if ('performance' in window) {
      const entries = performance.getEntriesByType('resource');
      const jsFiles = entries.filter(entry => entry.name.endsWith('.js'));
      const cssFiles = entries.filter(entry => entry.name.endsWith('.css'));
      
      const bundleMetrics = {
        totalJS: jsFiles.reduce((sum, file) => sum + file.transferSize, 0),
        totalCSS: cssFiles.reduce((sum, file) => sum + file.transferSize, 0),
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
      };
      
      console.log('Bundle Size:', bundleMetrics);
      return bundleMetrics;
    }
    return null;
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Initialize performance monitoring
  initializeMonitoring: () => {
    // Track page load metrics
    window.addEventListener('load', () => {
      performanceUtils.trackNavigation();
      performanceUtils.trackResources();
      performanceUtils.trackMemoryUsage();
      performanceUtils.trackNetworkInfo();
      performanceUtils.trackDeviceInfo();
      performanceUtils.trackBundleSize();
    });

    // Track unload metrics
    window.addEventListener('beforeunload', () => {
      performanceUtils.trackMemoryUsage();
    });

    // Track visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Page hidden');
      } else {
        console.log('Page visible');
      }
    });

    // Track online/offline status
    window.addEventListener('online', () => {
      console.log('Connection restored');
    });

    window.addEventListener('offline', () => {
      console.log('Connection lost');
    });
  },
};

export default reportWebVitals;
