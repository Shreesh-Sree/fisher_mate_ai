// Location tracking service for fishing borders
class LocationService {
  constructor() {
    this.watchId = null;
    this.currentLocation = null;
    this.locationCallbacks = [];
    this.isTracking = false;
    this.trackingOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000 // 30 seconds
    };
  }

  // Start location tracking
  startTracking() {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    if (this.isTracking) {
      console.log('Location tracking already started');
      return;
    }

    this.isTracking = true;

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.updateLocation(position);
      },
      (error) => {
        this.handleLocationError(error);
      },
      this.trackingOptions
    );

    // Start watching position changes
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.updateLocation(position);
      },
      (error) => {
        this.handleLocationError(error);
      },
      this.trackingOptions
    );

    console.log('Location tracking started');
  }

  // Stop location tracking
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    console.log('Location tracking stopped');
  }

  // Update current location and notify callbacks
  updateLocation(position) {
    const newLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed,
      heading: position.coords.heading,
      timestamp: position.timestamp
    };

    this.currentLocation = newLocation;
    
    // Notify all registered callbacks
    this.locationCallbacks.forEach(callback => {
      try {
        callback(newLocation);
      } catch (error) {
        console.error('Error in location callback:', error);
      }
    });
  }

  // Handle location errors
  handleLocationError(error) {
    let message;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "Location access denied by user";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information unavailable";
        break;
      case error.TIMEOUT:
        message = "Location request timed out";
        break;
      default:
        message = "Unknown location error";
        break;
    }
    
    console.error('Location error:', message);
    
    // Notify callbacks about error
    this.locationCallbacks.forEach(callback => {
      try {
        callback(null, error);
      } catch (err) {
        console.error('Error in location error callback:', err);
      }
    });
  }

  // Register callback for location updates
  onLocationUpdate(callback) {
    this.locationCallbacks.push(callback);
    
    // If we already have a location, call immediately
    if (this.currentLocation) {
      callback(this.currentLocation);
    }

    // Return unsubscribe function
    return () => {
      const index = this.locationCallbacks.indexOf(callback);
      if (index > -1) {
        this.locationCallbacks.splice(index, 1);
      }
    };
  }

  // Get current location (one-time)
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        this.trackingOptions
      );
    });
  }

  // Calculate distance between two points (in meters)
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  // Check if user is approaching a border (within specified distance)
  checkBorderProximity(userLocation, borderPoints, warningDistance = 1000) {
    if (!userLocation || !borderPoints) return null;

    let minDistance = Infinity;
    let closestPoint = null;

    borderPoints.forEach(point => {
      const distance = this.calculateDistance(
        userLocation.lat, userLocation.lng,
        point.lat, point.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    if (minDistance <= warningDistance) {
      return {
        distance: minDistance,
        closestPoint: closestPoint,
        isApproaching: true
      };
    }

    return null;
  }

  // Generate navigation instructions to avoid restricted zones
  generateNavInstructions(userLocation, restrictedZones, destination) {
    // This would integrate with a routing service
    // For now, return basic instructions
    return {
      message: "Navigate carefully to avoid restricted fishing zones",
      alternativeRoute: null,
      estimatedTime: null
    };
  }

  // Emergency location broadcast
  broadcastEmergencyLocation() {
    if (!this.currentLocation) {
      throw new Error('Current location not available');
    }

    const emergencyData = {
      location: this.currentLocation,
      timestamp: new Date().toISOString(),
      type: 'emergency',
      accuracy: this.currentLocation.accuracy
    };

    // This would send to emergency services
    console.log('Emergency location broadcast:', emergencyData);
    return emergencyData;
  }

  // Get location permission status
  async getPermissionStatus() {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state; // 'granted', 'denied', 'prompt'
      } catch (error) {
        console.error('Error checking permission:', error);
        return 'unknown';
      }
    }
    return 'unknown';
  }

  // Request location permission
  async requestPermission() {
    const status = await this.getPermissionStatus();
    
    if (status === 'denied') {
      throw new Error('Location permission denied. Please enable in browser settings.');
    }

    if (status === 'granted') {
      return true;
    }

    // For 'prompt' status, getCurrentPosition will trigger permission request
    try {
      await this.getCurrentLocation();
      return true;
    } catch (error) {
      throw new Error('Location permission request failed');
    }
  }

  // Get tracking status
  getTrackingStatus() {
    return {
      isTracking: this.isTracking,
      hasLocation: !!this.currentLocation,
      lastUpdate: this.currentLocation?.timestamp,
      accuracy: this.currentLocation?.accuracy
    };
  }
}

// Create singleton instance
const locationService = new LocationService();

export default locationService;
