# API Documentation

FisherMate.AI provides a comprehensive REST API for multilingual chatbot functionality, weather data, legal information, and emergency services.

## Base URL

```
Production: https://api.fishermate.ai
Development: http://localhost:5000
```

## Authentication

All API requests require authentication using Bearer tokens:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Rate Limiting

- **Standard**: 1000 requests per hour
- **Emergency**: Unlimited
- **Voice**: 100 requests per hour

## Content Types

- **Request**: `application/json`
- **Response**: `application/json`
- **Voice**: `multipart/form-data`

## Common Headers

```http
Content-Type: application/json
Accept-Language: en,hi,ta,te,ml,kn,bn,gu,or,as,mr,pa,ur
X-Client-Version: 1.0.0
```

## Error Handling

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details",
    "timestamp": "2025-07-17T10:30:00Z"
  }
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error
- `503` - Service Unavailable

---

# Chat API

## Send Message

Send a message to the AI chatbot and receive a response.

### Request

```http
POST /api/chat
```

```json
{
  "message": "What's the weather like today?",
  "language": "en",
  "context": {
    "location": {
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "user_id": "user123"
  }
}
```

### Response

```json
{
  "response": "Based on current weather data, Mumbai is experiencing partly cloudy skies with a temperature of 28°C. Winds are light at 10 km/h from the west. Good conditions for fishing today!",
  "language": "en",
  "translated_response": {
    "hi": "वर्तमान मौसम डेटा के आधार पर, मुंबई में आंशिक रूप से बादल छाए हुए हैं...",
    "ta": "தற்போதைய வானிலை தகவல்களின் அடிப்படையில், மும்பையில் பகுதி மேகமூட்டம்..."
  },
  "confidence": 0.95,
  "intent": "weather_query",
  "entities": {
    "location": "Mumbai",
    "weather_type": "current"
  },
  "suggestions": [
    "Check 7-day weather forecast",
    "View marine conditions",
    "Get safety recommendations"
  ]
}
```

## Get Chat History

Retrieve conversation history for a user.

### Request

```http
GET /api/chat/history?limit=50&offset=0
```

### Response

```json
{
  "messages": [
    {
      "id": "msg_123",
      "message": "What's the weather like today?",
      "response": "Based on current weather data...",
      "timestamp": "2025-07-17T10:30:00Z",
      "language": "en"
    }
  ],
  "total": 150,
  "has_more": true
}
```

---

# Weather API

## Current Weather

Get current weather conditions for a location.

### Request

```http
GET /api/weather?lat=19.0760&lon=72.8777
```

### Response

```json
{
  "location": {
    "name": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  },
  "current": {
    "temperature": 28,
    "feels_like": 32,
    "humidity": 78,
    "pressure": 1013,
    "visibility": 10,
    "uv_index": 6,
    "wind": {
      "speed": 10,
      "direction": 270,
      "direction_name": "West"
    },
    "weather": {
      "main": "Clouds",
      "description": "Partly cloudy",
      "icon": "02d"
    }
  },
  "marine": {
    "wave_height": 1.2,
    "wave_direction": 225,
    "tide": {
      "high": "14:30",
      "low": "20:45"
    },
    "sea_state": "Slight",
    "safety_level": "safe"
  },
  "sun": {
    "sunrise": "06:15",
    "sunset": "18:45"
  },
  "moon": {
    "phase": "Waxing Gibbous",
    "illumination": 0.73
  }
}
```

## Weather Forecast

Get weather forecast for up to 7 days.

### Request

```http
GET /api/weather/forecast?lat=19.0760&lon=72.8777&days=5
```

### Response

```json
{
  "location": {
    "name": "Mumbai",
    "state": "Maharashtra"
  },
  "forecast": [
    {
      "date": "2025-07-17",
      "temperature": {
        "min": 24,
        "max": 30
      },
      "weather": {
        "main": "Rain",
        "description": "Light rain"
      },
      "wind": {
        "speed": 15,
        "direction": 225
      },
      "marine": {
        "wave_height": 1.5,
        "safety_level": "caution"
      }
    }
  ]
}
```

## Weather Alerts

Get weather alerts and warnings.

### Request

```http
GET /api/weather/alerts?lat=19.0760&lon=72.8777
```

### Response

```json
{
  "alerts": [
    {
      "id": "alert_123",
      "title": "Strong Wind Warning",
      "description": "Strong winds expected. Avoid venturing into deep waters.",
      "severity": "moderate",
      "urgency": "immediate",
      "certainty": "likely",
      "effective": "2025-07-17T12:00:00Z",
      "expires": "2025-07-18T06:00:00Z",
      "areas": ["Mumbai", "Thane", "Navi Mumbai"],
      "instructions": [
        "Stay close to shore",
        "Check equipment before departure",
        "Monitor weather updates"
      ]
    }
  ]
}
```

---

# Legal API

## Get Legal Information

Retrieve fishing regulations and legal information.

### Request

```http
GET /api/legal/info?state=Maharashtra&category=fishing_season
```

### Response

```json
{
  "state": "Maharashtra",
  "category": "fishing_season",
  "regulations": {
    "fishing_ban": {
      "start_date": "2025-06-01",
      "end_date": "2025-07-31",
      "duration": "61 days",
      "reason": "Monsoon fishing ban for conservation"
    },
    "permitted_areas": [
      "Coastal waters within 12 nautical miles",
      "Licensed fishing zones"
    ],
    "restrictions": [
      "No trawling during ban period",
      "Traditional fishing with small nets allowed",
      "Deep sea fishing requires special permit"
    ],
    "penalties": {
      "violation_fine": "₹10,000 - ₹50,000",
      "repeat_offense": "License suspension",
      "equipment_seizure": "Possible for violations"
    }
  },
  "authorities": {
    "fisheries_department": {
      "contact": "+91-22-2618-4411",
      "email": "fisheries.mah@gov.in"
    },
    "coast_guard": {
      "emergency": "1554",
      "contact": "+91-22-2636-5010"
    }
  },
  "documents_required": [
    "Fishing license",
    "Boat registration",
    "Insurance certificate"
  ]
}
```

## Search Legal Information

Search through legal information database.

### Request

```http
GET /api/legal/search?query=fishing license&state=Maharashtra
```

### Response

```json
{
  "query": "fishing license",
  "results": [
    {
      "title": "Fishing License Requirements",
      "description": "All fishing vessels must have valid licenses",
      "category": "licenses",
      "state": "Maharashtra",
      "relevance": 0.95
    }
  ],
  "total": 15,
  "suggestions": [
    "fishing permit",
    "boat registration",
    "marine insurance"
  ]
}
```

---

# Safety API

## Get Safety Guidelines

Retrieve safety guidelines and procedures.

### Request

```http
GET /api/safety/guide?category=emergency_procedures
```

### Response

```json
{
  "category": "emergency_procedures",
  "guidelines": {
    "general_emergency": {
      "steps": [
        "Stay calm and assess the situation",
        "Ensure everyone is wearing life jackets",
        "Send distress signal immediately",
        "Provide location coordinates",
        "Stay with the vessel if possible"
      ],
      "equipment_needed": [
        "Life jackets",
        "Emergency flares",
        "Radio communication device",
        "First aid kit"
      ]
    },
    "distress_signals": {
      "radio": "Mayday, Mayday, Mayday on Channel 16",
      "visual": "Red flares, mirror signals, waving arms",
      "sound": "Horn blasts, whistle signals"
    },
    "emergency_contacts": {
      "coast_guard": "1554",
      "marine_police": "100",
      "emergency_services": "108"
    }
  }
}
```

## Get Safety Checklist

Get pre-departure safety checklist.

### Request

```http
GET /api/safety/checklist?type=pre_departure
```

### Response

```json
{
  "type": "pre_departure",
  "checklist": [
    {
      "item": "Check weather forecast",
      "description": "Verify weather conditions for next 6-8 hours",
      "critical": true
    },
    {
      "item": "Inspect life jackets",
      "description": "Ensure all crew members have working life jackets",
      "critical": true
    },
    {
      "item": "Test communication equipment",
      "description": "Check radio, mobile phone, GPS devices",
      "critical": true
    },
    {
      "item": "Fuel and engine check",
      "description": "Sufficient fuel, engine oil, spare parts",
      "critical": true
    },
    {
      "item": "Emergency supplies",
      "description": "First aid kit, flares, emergency food and water",
      "critical": false
    }
  ]
}
```

---

# Emergency API

## Send Emergency Alert

Send emergency alert to authorities.

### Request

```http
POST /api/emergency/alert
```

```json
{
  "type": "distress",
  "location": {
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "message": "Engine failure, need immediate assistance",
  "vessel_info": {
    "name": "Fisher's Pride",
    "registration": "MH-01-2023",
    "crew_count": 4
  },
  "contact": {
    "phone": "+91-9876543210",
    "radio_channel": "16"
  }
}
```

### Response

```json
{
  "alert_id": "EMG_123456",
  "status": "sent",
  "authorities_notified": [
    "Coast Guard Mumbai",
    "Marine Police",
    "Local Port Authority"
  ],
  "estimated_response_time": "15-30 minutes",
  "reference_number": "CG-MUM-2025-0717-001",
  "instructions": [
    "Stay calm and keep radio on Channel 16",
    "Fire flares if you see rescue vessels",
    "Keep all crew members together"
  ]
}
```

## Get Emergency Contacts

Retrieve emergency contact information.

### Request

```http
GET /api/emergency/contacts?state=Maharashtra
```

### Response

```json
{
  "state": "Maharashtra",
  "contacts": {
    "coast_guard": {
      "emergency": "1554",
      "office": "+91-22-2636-5010",
      "email": "mumbai@indiancoastguard.gov.in"
    },
    "marine_police": {
      "emergency": "100",
      "office": "+91-22-2261-1212"
    },
    "port_authority": {
      "office": "+91-22-2575-6666",
      "email": "mumbaiport@gov.in"
    },
    "hospitals": [
      {
        "name": "KEM Hospital",
        "phone": "+91-22-2417-3333",
        "emergency": "108"
      }
    ]
  }
}
```

---

# Voice API

## Speech to Text

Convert voice recording to text.

### Request

```http
POST /api/voice/to-text
Content-Type: multipart/form-data
```

```
audio: [audio file]
language: hi
```

### Response

```json
{
  "text": "आज मौसम कैसा है?",
  "language": "hi",
  "confidence": 0.92,
  "alternative_texts": [
    "आज का मौसम कैसा है?",
    "आज मौसम कैसा रहेगा?"
  ],
  "duration": 2.5
}
```

## Text to Speech

Convert text to speech.

### Request

```http
POST /api/voice/to-speech
```

```json
{
  "text": "आज मौसम बहुत अच्छा है",
  "language": "hi",
  "voice": "female",
  "speed": 1.0
}
```

### Response

```
Content-Type: audio/mp3
[Audio file binary data]
```

---

# WebSocket API

## Real-time Updates

Connect to WebSocket for real-time weather and emergency updates.

### Connection

```javascript
const ws = new WebSocket('wss://api.fishermate.ai/ws');
```

### Messages

```json
{
  "type": "weather_alert",
  "data": {
    "severity": "high",
    "message": "Strong winds expected",
    "location": "Mumbai"
  }
}
```

```json
{
  "type": "emergency_update",
  "data": {
    "alert_id": "EMG_123456",
    "status": "responded",
    "eta": "10 minutes"
  }
}
```

---

# SDKs and Libraries

## JavaScript SDK

```javascript
import FisherMate from '@fishermate/sdk';

const client = new FisherMate({
  apiKey: 'your-api-key',
  language: 'en'
});

// Send chat message
const response = await client.chat.send('What is the weather today?');

// Get weather data
const weather = await client.weather.getCurrent(19.0760, 72.8777);
```

## Python SDK

```python
from fishermate import FisherMateClient

client = FisherMateClient(
    api_key='your-api-key',
    language='en'
)

# Send chat message
response = client.chat.send('What is the weather today?')

# Get weather data
weather = client.weather.get_current(19.0760, 72.8777)
```

---

# Rate Limits

| Endpoint | Rate Limit | Notes |
|----------|------------|-------|
| `/api/chat` | 100/hour | Per user |
| `/api/weather` | 1000/hour | Per API key |
| `/api/voice/*` | 100/hour | Per user |
| `/api/emergency/*` | Unlimited | Critical service |

---

# Changelog

## v1.0.0 (2025-07-17)
- Initial API release
- Chat, Weather, Legal, Safety, Emergency endpoints
- Voice processing capabilities
- WebSocket support for real-time updates
- Multi-language support for 13 Indian languages

---

*For more information, visit our [developer portal](https://developers.fishermate.ai) or contact support@fishermate.ai*
