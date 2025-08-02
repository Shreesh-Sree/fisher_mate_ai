// Border alert and compliance service
import locationService from './locationService';

class BorderAlertService {
  constructor() {
    this.alerts = [];
    this.alertCallbacks = [];
    this.fishingZones = null;
    this.currentZone = null;
    this.alertHistory = [];
    this.complianceStatus = {
      isCompliant: true,
      violations: [],
      warnings: []
    };
  }

  // Initialize the service
  async initialize() {
    try {
      // Load fishing zones data
      const response = await fetch('/borders/fishing_zones.geojson');
      this.fishingZones = await response.json();
      
      // Start location monitoring
      locationService.onLocationUpdate((location, error) => {
        if (location) {
          this.checkLocationCompliance(location);
        }
      });
      
      console.log('Border Alert Service initialized');
    } catch (error) {
      console.error('Error initializing Border Alert Service:', error);
    }
  }

  // Check user location against fishing zones and generate alerts
  checkLocationCompliance(userLocation) {
    if (!this.fishingZones || !userLocation) return;

    const alerts = [];
    let currentZone = null;
    const violations = [];
    const warnings = [];

    this.fishingZones.features.forEach(feature => {
      if (this.isPointInPolygon([userLocation.lng, userLocation.lat], feature.geometry)) {
        currentZone = feature.properties;
        
        // Check if fishing is allowed
        if (!feature.properties.allowed_fishing) {
          const violation = {
            type: 'FISHING_PROHIBITED',
            zone: feature.properties.name,
            severity: 'HIGH',
            message: `You are in a restricted zone: ${feature.properties.name}`,
            penalty: feature.properties.penalty,
            action: 'Exit immediately',
            timestamp: new Date().toISOString(),
            location: userLocation
          };
          
          violations.push(violation);
          alerts.push({
            id: Date.now(),
            type: 'danger',
            title: '🚨 RESTRICTED ZONE VIOLATION',
            message: violation.message,
            action: violation.action,
            penalty: violation.penalty,
            zone: feature.properties,
            timestamp: violation.timestamp,
            persistent: true
          });
        }

        // Check restriction level warnings
        if (feature.properties.restriction_level === 'high' && feature.properties.allowed_fishing) {
          warnings.push({
            type: 'HIGH_RESTRICTION',
            zone: feature.properties.name,
            message: 'High restriction zone - special permits required',
            timestamp: new Date().toISOString()
          });

          alerts.push({
            id: Date.now() + 1,
            type: 'warning',
            title: '⚠️ HIGH RESTRICTION ZONE',
            message: `Special permits required in ${feature.properties.name}`,
            action: 'Verify documentation',
            contact: feature.properties.contact_authority,
            zone: feature.properties,
            timestamp: new Date().toISOString()
          });
        }

        // Check seasonal restrictions
        if (this.checkSeasonalRestrictions(feature.properties)) {
          const seasonalAlert = this.generateSeasonalAlert(feature.properties);
          alerts.push(seasonalAlert);
          warnings.push({
            type: 'SEASONAL_RESTRICTION',
            zone: feature.properties.name,
            message: seasonalAlert.message,
            timestamp: new Date().toISOString()
          });
        }

        // Check boat size compliance
        if (this.checkBoatSizeCompliance(feature.properties)) {
          const boatAlert = this.generateBoatSizeAlert(feature.properties);
          alerts.push(boatAlert);
          warnings.push({
            type: 'BOAT_SIZE_VIOLATION',
            zone: feature.properties.name,
            message: boatAlert.message,
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    // Update compliance status
    this.complianceStatus = {
      isCompliant: violations.length === 0,
      violations: violations,
      warnings: warnings,
      lastChecked: new Date().toISOString(),
      currentZone: currentZone
    };

    // Update current zone
    this.currentZone = currentZone;

    // Process new alerts
    if (alerts.length > 0) {
      this.processAlerts(alerts);
    }

    // Log compliance check
    this.logComplianceCheck(userLocation, currentZone, violations, warnings);
  }

  // Check if point is in polygon (using ray casting algorithm)
  isPointInPolygon(point, polygon) {
    const [lng, lat] = point;
    const coords = polygon.coordinates[0];
    let inside = false;
    
    for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
      const [xi, yi] = coords[i];
      const [xj, yj] = coords[j];
      
      if (((yi > lat) !== (yj > lat)) && 
          (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }

  // Check seasonal restrictions
  checkSeasonalRestrictions(zoneProperties) {
    if (!zoneProperties.seasonal_restrictions || 
        zoneProperties.seasonal_restrictions === 'None') {
      return false;
    }

    const now = new Date();
    const month = now.getMonth() + 1; // 1-12

    // Simple seasonal check (this could be more sophisticated)
    const restrictions = zoneProperties.seasonal_restrictions.toLowerCase();
    
    if (restrictions.includes('june-july') && (month === 6 || month === 7)) {
      return true;
    }
    if (restrictions.includes('october-december') && (month >= 10 && month <= 12)) {
      return true;
    }
    if (restrictions.includes('april-may') && (month === 4 || month === 5)) {
      return true;
    }

    return false;
  }

  // Generate seasonal restriction alert
  generateSeasonalAlert(zoneProperties) {
    return {
      id: Date.now() + 2,
      type: 'warning',
      title: '📅 SEASONAL RESTRICTION',
      message: `Current seasonal restrictions apply in ${zoneProperties.name}`,
      details: zoneProperties.seasonal_restrictions,
      zone: zoneProperties,
      timestamp: new Date().toISOString()
    };
  }

  // Check boat size compliance (placeholder - would need user's boat info)
  checkBoatSizeCompliance(zoneProperties) {
    // This would check against user's registered boat size
    // For now, return false (no violation)
    return false;
  }

  // Generate boat size alert
  generateBoatSizeAlert(zoneProperties) {
    return {
      id: Date.now() + 3,
      type: 'warning',
      title: '🚢 BOAT SIZE RESTRICTION',
      message: `Maximum boat size for ${zoneProperties.name}: ${zoneProperties.max_boat_size}`,
      zone: zoneProperties,
      timestamp: new Date().toISOString()
    };
  }

  // Process and notify about new alerts
  processAlerts(newAlerts) {
    newAlerts.forEach(alert => {
      // Check if this is a duplicate alert
      const isDuplicate = this.alerts.some(existingAlert => 
        existingAlert.type === alert.type && 
        existingAlert.zone?.name === alert.zone?.name &&
        (Date.now() - new Date(existingAlert.timestamp).getTime()) < 60000 // Within 1 minute
      );

      if (!isDuplicate) {
        this.alerts.push(alert);
        this.notifyCallbacks(alert);
        
        // Store in history
        this.alertHistory.push({
          ...alert,
          resolved: false
        });

        // Auto-resolve non-persistent alerts after 30 seconds
        if (!alert.persistent) {
          setTimeout(() => {
            this.resolveAlert(alert.id);
          }, 30000);
        }
      }
    });
  }

  // Notify registered callbacks about new alerts
  notifyCallbacks(alert) {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert, this.complianceStatus);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    });
  }

  // Register callback for alert notifications
  onAlert(callback) {
    this.alertCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  // Resolve an alert
  resolveAlert(alertId) {
    const index = this.alerts.findIndex(alert => alert.id === alertId);
    if (index > -1) {
      this.alerts.splice(index, 1);
      
      // Mark as resolved in history
      const historyItem = this.alertHistory.find(item => item.id === alertId);
      if (historyItem) {
        historyItem.resolved = true;
        historyItem.resolvedAt = new Date().toISOString();
      }
    }
  }

  // Get current alerts
  getCurrentAlerts() {
    return [...this.alerts];
  }

  // Get compliance status
  getComplianceStatus() {
    return { ...this.complianceStatus };
  }

  // Get alert history
  getAlertHistory(limit = 50) {
    return this.alertHistory
      .slice(-limit)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Generate compliance report
  generateComplianceReport() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentAlerts = this.alertHistory.filter(alert => 
      new Date(alert.timestamp) > last24Hours
    );

    const violations = recentAlerts.filter(alert => alert.type === 'danger');
    const warnings = recentAlerts.filter(alert => alert.type === 'warning');

    return {
      timestamp: now.toISOString(),
      period: '24 hours',
      summary: {
        totalAlerts: recentAlerts.length,
        violations: violations.length,
        warnings: warnings.length,
        complianceScore: violations.length === 0 ? 100 : Math.max(0, 100 - (violations.length * 20))
      },
      currentStatus: this.complianceStatus,
      currentZone: this.currentZone,
      alerts: recentAlerts
    };
  }

  // Log compliance check
  logComplianceCheck(location, zone, violations, warnings) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      location: {
        lat: location.lat,
        lng: location.lng,
        accuracy: location.accuracy
      },
      zone: zone ? zone.name : 'Open Waters',
      violationCount: violations.length,
      warningCount: warnings.length,
      isCompliant: violations.length === 0
    };

    // Store log entry (you might want to send this to backend)
    console.log('Compliance check:', logEntry);
  }

  // Emergency broadcast with location and compliance status
  emergencyBroadcast() {
    const location = locationService.currentLocation;
    if (!location) {
      throw new Error('Current location not available for emergency broadcast');
    }

    const emergencyData = {
      timestamp: new Date().toISOString(),
      location: location,
      currentZone: this.currentZone,
      complianceStatus: this.complianceStatus,
      activeAlerts: this.getCurrentAlerts(),
      emergencyType: 'SOS',
      userInfo: {
        // Add user/vessel information here
      }
    };

    // This would send to emergency services and coast guard
    console.log('Emergency broadcast with compliance data:', emergencyData);
    return emergencyData;
  }
}

// Create singleton instance
const borderAlertService = new BorderAlertService();

export default borderAlertService;
