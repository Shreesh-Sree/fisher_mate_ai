import React, { useState, useEffect, useRef } from 'react';
import FishingBordersMap from './FishingBordersMap';
import locationService from '../services/locationService';
import borderAlertService from '../services/borderAlertService';

const FishingDashboard = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [borderAlerts, setBorderAlerts] = useState([]);
  const [complianceStatus, setComplianceStatus] = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  // Initialize map
  useEffect(() => {
    if (window.google && mapRef.current && !map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        zoom: 8,
        center: { lat: 10.8505, lng: 76.2711 }, // Kerala coast center
        mapTypeId: 'hybrid',
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#193a5a' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#2c3e50' }]
          }
        ]
      });
      setMap(googleMap);
    }
  }, [map]);

  // Initialize services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize border alert service
        await borderAlertService.initialize();
        
        // Check location permission
        const permission = await locationService.getPermissionStatus();
        setPermissionStatus(permission);
        
        // Set up alert listener
        const unsubscribeAlerts = borderAlertService.onAlert((alert, compliance) => {
          setBorderAlerts(prev => [...prev, alert]);
          setComplianceStatus(compliance);
          
          // Show browser notification for critical alerts
          if (alert.type === 'danger' && 'Notification' in window) {
            if (Notification.permission === 'granted') {
              new Notification(alert.title, {
                body: alert.message,
                icon: '/icons/alert.png',
                badge: '/icons/badge.png'
              });
            }
          }
        });

        // Set up location listener
        const unsubscribeLocation = locationService.onLocationUpdate((location, error) => {
          if (location) {
            setUserLocation(location);
            setLocationError(null);
            
            // Update map center
            if (map) {
              map.setCenter({ lat: location.lat, lng: location.lng });
            }
          } else if (error) {
            setLocationError(error);
          }
        });

        return () => {
          unsubscribeAlerts();
          unsubscribeLocation();
        };
      } catch (error) {
        console.error('Error initializing services:', error);
        setLocationError(error);
      }
    };

    initializeServices();
  }, [map]);

  // Handle location permission request
  const requestLocationPermission = async () => {
    try {
      await locationService.requestPermission();
      const permission = await locationService.getPermissionStatus();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        startTracking();
      }
    } catch (error) {
      setLocationError(error);
    }
  };

  // Start location tracking
  const startTracking = () => {
    try {
      locationService.startTracking();
      setIsTracking(true);
      setLocationError(null);
    } catch (error) {
      setLocationError(error);
    }
  };

  // Stop location tracking
  const stopTracking = () => {
    locationService.stopTracking();
    setIsTracking(false);
  };

  // Handle border alerts
  const handleBorderAlert = (alerts, zone) => {
    setCurrentZone(zone);
    
    // Process alerts for UI display
    alerts.forEach(alert => {
      // You can add custom processing here
      console.log('Border alert:', alert);
    });
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setBorderAlerts(prev => prev.filter(alert => alert.id !== alertId));
    borderAlertService.resolveAlert(alertId);
  };

  // Emergency SOS
  const handleEmergencySOS = () => {
    try {
      const emergencyData = borderAlertService.emergencyBroadcast();
      
      // Show confirmation
      alert(`Emergency SOS sent!\nLocation: ${emergencyData.location.lat}, ${emergencyData.location.lng}\nZone: ${emergencyData.currentZone?.name || 'Open Waters'}`);
      
      // You would integrate with actual emergency services here
    } catch (error) {
      alert('Failed to send emergency SOS: ' + error.message);
    }
  };

  // Generate compliance report
  const generateReport = () => {
    const report = borderAlertService.generateComplianceReport();
    
    // Create and download report
    const reportData = JSON.stringify(report, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fishing-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fishing-dashboard">
      {/* Map Container */}
      <div className="map-container" style={{ width: '100%', height: '500px', position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        
        {/* Map Controls */}
        <div className="map-controls" style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {permissionStatus !== 'granted' ? (
            <button
              onClick={requestLocationPermission}
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Enable Location
            </button>
          ) : (
            <>
              <button
                onClick={isTracking ? stopTracking : startTracking}
                style={{
                  padding: '10px 15px',
                  backgroundColor: isTracking ? '#f44336' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </button>
              
              <button
                onClick={handleEmergencySOS}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#FF5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🚨 Emergency SOS
              </button>
              
              <button
                onClick={generateReport}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                📊 Generate Report
              </button>
            </>
          )}
        </div>

        {/* Location Status */}
        {userLocation && (
          <div className="location-status" style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            <div><strong>Lat:</strong> {userLocation.lat.toFixed(6)}</div>
            <div><strong>Lng:</strong> {userLocation.lng.toFixed(6)}</div>
            <div><strong>Accuracy:</strong> {userLocation.accuracy}m</div>
            {userLocation.speed && (
              <div><strong>Speed:</strong> {(userLocation.speed * 3.6).toFixed(1)} km/h</div>
            )}
          </div>
        )}

        {/* Compliance Status */}
        {complianceStatus && (
          <div className="compliance-status" style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            zIndex: 1000,
            backgroundColor: complianceStatus.isCompliant ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {complianceStatus.isCompliant ? '✅ Compliant' : '⚠️ Violations Detected'}
            {complianceStatus.violations.length > 0 && (
              <div style={{ fontSize: '12px', marginTop: '5px' }}>
                {complianceStatus.violations.length} violation(s)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Border Alerts */}
      {borderAlerts.length > 0 && (
        <div className="border-alerts" style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 2000,
          maxWidth: '350px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {borderAlerts.slice(-5).map((alert) => (
            <div
              key={alert.id}
              className={`alert alert-${alert.type}`}
              style={{
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                backgroundColor: alert.type === 'danger' ? '#f8d7da' : 
                               alert.type === 'warning' ? '#fff3cd' : '#d1ecf1',
                border: `1px solid ${alert.type === 'danger' ? '#f5c6cb' : 
                                   alert.type === 'warning' ? '#ffeaa7' : '#bee5eb'}`,
                color: alert.type === 'danger' ? '#721c24' : 
                       alert.type === 'warning' ? '#856404' : '#0c5460',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              <button
                onClick={() => dismissAlert(alert.id)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  cursor: 'pointer',
                  color: 'inherit'
                }}
              >
                ×
              </button>
              
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                {alert.title}
              </h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                {alert.message}
              </p>
              {alert.action && (
                <p style={{ margin: '0', fontSize: '12px', fontStyle: 'italic' }}>
                  <strong>Action:</strong> {alert.action}
                </p>
              )}
              {alert.penalty && (
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#d32f2f' }}>
                  <strong>⚠️ Penalty:</strong> {alert.penalty}
                </p>
              )}
              {alert.contact && (
                <p style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                  <strong>Contact:</strong> {alert.contact}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current Zone Info */}
      {currentZone && (
        <div className="current-zone-info" style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '15px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '300px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>Current Fishing Zone</h4>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{currentZone.name}</p>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
            <strong>Type:</strong> {currentZone.zone_type.replace('_', ' ').toUpperCase()}
          </p>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
            <strong>Fishing:</strong> 
            <span style={{ color: currentZone.allowed_fishing ? '#4CAF50' : '#F44336', marginLeft: '5px' }}>
              {currentZone.allowed_fishing ? 'Allowed' : 'Prohibited'}
            </span>
          </p>
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>
            <strong>Restriction Level:</strong> {currentZone.restriction_level.toUpperCase()}
          </p>
          <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
            <strong>Max Boat Size:</strong> {currentZone.max_boat_size}
          </p>
        </div>
      )}

      {/* Error Display */}
      {locationError && (
        <div className="location-error" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2000,
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #f5c6cb',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h4>Location Error</h4>
          <p>{locationError.message}</p>
          <button
            onClick={() => setLocationError(null)}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Fishing Borders Map Component */}
      {map && (
        <FishingBordersMap
          map={map}
          userLocation={userLocation}
          onBorderAlert={handleBorderAlert}
        />
      )}
    </div>
  );
};

export default FishingDashboard;
