import React, { useEffect, useState, useCallback } from 'react';

// Utility function to check if a point is inside a polygon (simplified version)
const isPointInPolygon = (point, polygon) => {
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
};

const FishingBordersMap = ({ map, userLocation, onBorderAlert }) => {
  const [fishingZones, setFishingZones] = useState(null);
  const [currentZone, setCurrentZone] = useState(null);
  const [borderWarnings, setBorderWarnings] = useState([]);

  // Load fishing zone boundaries
  useEffect(() => {
    const loadFishingZones = async () => {
      try {
        const response = await fetch('/borders/fishing_zones.geojson');
        const data = await response.json();
        setFishingZones(data);
      } catch (error) {
        console.error('Error loading fishing zones:', error);
      }
    };

    loadFishingZones();
  }, []);

  // Display borders on map
  useEffect(() => {
    if (map && fishingZones) {
      // Clear existing data
      map.data.forEach(feature => {
        map.data.remove(feature);
      });

      // Load GeoJSON data
      fishingZones.features.forEach(feature => {
        map.data.addGeoJson({ type: 'Feature', ...feature });
      });

      // Style the borders based on restriction level
      map.data.setStyle((feature) => {
        const restrictionLevel = feature.getProperty('restriction_level');
        const allowedFishing = feature.getProperty('allowed_fishing');
        
        let fillColor, strokeColor;
        
        switch (restrictionLevel) {
          case 'high':
            fillColor = allowedFishing ? 'rgba(255, 193, 7, 0.3)' : 'rgba(220, 53, 69, 0.3)';
            strokeColor = allowedFishing ? '#FFC107' : '#DC3545';
            break;
          case 'medium':
            fillColor = 'rgba(255, 152, 0, 0.2)';
            strokeColor = '#FF9800';
            break;
          case 'low':
          default:
            fillColor = 'rgba(76, 175, 80, 0.2)';
            strokeColor = '#4CAF50';
            break;
        }

        return {
          fillColor,
          strokeColor,
          strokeWeight: 2,
          fillOpacity: 0.3,
          strokeOpacity: 0.8,
        };
      });

      // Add click listeners for zone information
      map.data.addListener('click', (event) => {
        const feature = event.feature;
        const properties = {};
        
        feature.forEachProperty((value, key) => {
          properties[key] = value;
        });

        showZoneInfo(properties, event.latLng);
      });
    }
  }, [map, fishingZones]);

  // Check user location against fishing zones
  useEffect(() => {
    if (userLocation && fishingZones) {
      checkLocationAgainstZones(userLocation);
    }
  }, [userLocation, fishingZones]);

  const checkLocationAgainstZones = useCallback((location) => {
    if (!fishingZones) return;

    const userPoint = [location.lng, location.lat];
    let foundZone = null;
    const warnings = [];

    fishingZones.features.forEach(feature => {
      if (isPointInPolygon(userPoint, feature.geometry)) {
        foundZone = feature.properties;
        
        // Generate warnings based on zone properties
        if (!feature.properties.allowed_fishing) {
          warnings.push({
            type: 'danger',
            title: 'RESTRICTED ZONE',
            message: `You are in ${feature.properties.name}. Fishing is prohibited here.`,
            action: 'Exit this zone immediately',
            penalty: feature.properties.penalty
          });
        } else if (feature.properties.restriction_level === 'high') {
          warnings.push({
            type: 'warning',
            title: 'HIGH RESTRICTION ZONE',
            message: `Special permits required in ${feature.properties.name}`,
            action: 'Ensure you have proper documentation',
            contact: feature.properties.contact_authority
          });
        }

        // Check seasonal restrictions
        if (feature.properties.seasonal_restrictions && 
            feature.properties.seasonal_restrictions !== 'None') {
          warnings.push({
            type: 'info',
            title: 'SEASONAL RESTRICTIONS',
            message: feature.properties.seasonal_restrictions,
            zone: feature.properties.name
          });
        }
      }
    });

    setCurrentZone(foundZone);
    setBorderWarnings(warnings);
    
    // Notify parent component
    if (onBorderAlert && warnings.length > 0) {
      onBorderAlert(warnings, foundZone);
    }
  }, [fishingZones, onBorderAlert]);

  const showZoneInfo = (properties, latLng) => {
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="max-width: 300px; font-family: Arial, sans-serif;">
          <h3 style="color: #1976d2; margin-bottom: 10px;">${properties.name}</h3>
          <div style="margin-bottom: 8px;">
            <strong>Zone Type:</strong> ${properties.zone_type.replace('_', ' ').toUpperCase()}
          </div>
          <div style="margin-bottom: 8px;">
            <strong>Fishing Allowed:</strong> 
            <span style="color: ${properties.allowed_fishing ? '#4CAF50' : '#F44336'};">
              ${properties.allowed_fishing ? 'Yes' : 'No'}
            </span>
          </div>
          <div style="margin-bottom: 8px;">
            <strong>Depth Range:</strong> ${properties.depth_range}
          </div>
          <div style="margin-bottom: 8px;">
            <strong>Max Boat Size:</strong> ${properties.max_boat_size}
          </div>
          <div style="margin-bottom: 8px;">
            <strong>Restrictions:</strong> ${properties.seasonal_restrictions}
          </div>
          <div style="margin-bottom: 8px;">
            <strong>Authority:</strong> ${properties.contact_authority}
          </div>
          ${properties.penalty ? `
            <div style="margin-top: 10px; padding: 8px; background: #ffebee; border-left: 4px solid #f44336; font-size: 12px;">
              <strong>Penalty:</strong> ${properties.penalty}
            </div>
          ` : ''}
        </div>
      `,
      position: latLng
    });

    infoWindow.open(map);
  };

  // Render border warnings (you can style this as needed)
  const renderWarnings = () => {
    if (borderWarnings.length === 0) return null;

    return (
      <div className="border-warnings" style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '350px'
      }}>
        {borderWarnings.map((warning, index) => (
          <div
            key={index}
            className={`alert alert-${warning.type}`}
            style={{
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px',
              backgroundColor: warning.type === 'danger' ? '#f8d7da' : 
                             warning.type === 'warning' ? '#fff3cd' : '#d1ecf1',
              border: `1px solid ${warning.type === 'danger' ? '#f5c6cb' : 
                                 warning.type === 'warning' ? '#ffeaa7' : '#bee5eb'}`,
              color: warning.type === 'danger' ? '#721c24' : 
                     warning.type === 'warning' ? '#856404' : '#0c5460',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
              {warning.title}
            </h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
              {warning.message}
            </p>
            {warning.action && (
              <p style={{ margin: '0', fontSize: '12px', fontStyle: 'italic' }}>
                <strong>Action:</strong> {warning.action}
              </p>
            )}
            {warning.penalty && (
              <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#d32f2f' }}>
                <strong>⚠️ Penalty:</strong> {warning.penalty}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Current zone status display
  const renderZoneStatus = () => {
    if (!currentZone) return null;

    return (
      <div className="current-zone-status" style={{
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
        <h4 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>Current Zone</h4>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{currentZone.name}</p>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
          Fishing: <span style={{ color: currentZone.allowed_fishing ? '#4CAF50' : '#F44336' }}>
            {currentZone.allowed_fishing ? 'Allowed' : 'Prohibited'}
          </span>
        </p>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
          Restriction Level: {currentZone.restriction_level.toUpperCase()}
        </p>
      </div>
    );
  };

  return (
    <>
      {renderWarnings()}
      {renderZoneStatus()}
    </>
  );
};

export default FishingBordersMap;
