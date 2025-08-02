# FisherMate.AI Analytics Integration

This document explains the analytics integration implemented in FisherMate.AI using Vercel Analytics and custom event tracking.

## 🚀 Quick Setup

### 1. Install Dependencies

The analytics dependencies are already included in `package.json`:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.3.1"
  }
}
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and configure your analytics:

```bash
cp .env.example .env.local
```

### 3. Deploy to Vercel

Analytics will automatically be enabled when deployed to Vercel. No additional configuration needed!

## 📊 Analytics Features

### Core Analytics Events

1. **Session Tracking**
   - Session start/end
   - Session duration
   - User interactions count

2. **Chat Analytics**
   - Message sent/received
   - AI response times
   - Chat errors and failures

3. **Feature Usage**
   - Page navigation
   - Feature interactions
   - Quick actions usage

4. **Emergency Events**
   - SOS activations
   - Location sharing
   - Emergency response times

5. **Fishing-Specific Events**
   - Border zone interactions
   - Weather checks
   - Price queries
   - Compliance monitoring

### Custom Events for Fishing Industry

```javascript
// Track fishing-specific events
trackFishingEvent.weatherCheck('Kochi', 'forecast');
trackFishingEvent.priceCheck('Pomfret', 'Kochi Market');
trackFishingEvent.borderCheck('Kerala Coastal Zone', 'entry');
trackFishingEvent.sosActivated('10.8505,76.2711', 'emergency_button');
```

## 🔧 Implementation Details

### React Components with Analytics

```jsx
import { Analytics } from '@vercel/analytics/react';
import { trackFishingEvent } from './utils/analytics';

function App() {
  return (
    <div>
      {/* Your app content */}
      <Analytics />
    </div>
  );
}
```

### Vanilla JavaScript Integration

```javascript
// Direct Vercel Analytics tracking
if (window.va) {
  window.va('track', 'custom_event', {
    property: 'value',
    timestamp: new Date().toISOString()
  });
}
```

### Event Tracking Functions

Located in `/src/utils/analytics.js`:

- `trackEvent(eventName, properties)` - General event tracking
- `trackFishingEvent.*` - Fishing-specific events
- `trackPageView(pageName, data)` - Page navigation
- `trackError(type, message, component)` - Error tracking
- `trackPerformance(metric, value, unit)` - Performance metrics

## 📈 Analytics Dashboard

### Vercel Analytics Dashboard

1. Go to your Vercel project dashboard
2. Click on "Analytics" tab
3. View real-time and historical data

### Custom Events Monitoring

All custom events are tracked and can be viewed in:
- Vercel Analytics dashboard
- Google Analytics (if configured)
- Custom analytics API (if implemented)

## 🎯 Key Metrics Tracked

### User Engagement
- Daily/monthly active users
- Session duration
- Feature adoption rates
- User retention

### Fishing Operations
- Weather query frequency
- Price check patterns
- Border compliance interactions
- Emergency usage statistics

### Technical Performance
- Page load times
- API response times
- Error rates
- Feature usage patterns

## 🔒 Privacy & Compliance

### Data Collection
- No personally identifiable information (PII) collected
- Location data only collected with user consent
- All data anonymized and aggregated

### GDPR Compliance
- Analytics can be disabled by users
- Data retention policies followed
- Cookie consent implemented

## 🛠️ Development

### Local Testing

Analytics events are logged to console in development:

```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('📊 Analytics Event:', eventName, properties);
}
```

### Debug Mode

Enable debug mode in `.env.local`:

```
NEXT_PUBLIC_ANALYTICS_DEBUG=true
```

### Custom Analytics API

Implement your own analytics endpoint:

```javascript
// Send to custom API
fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ event: eventName, properties })
});
```

## 📋 Event Categories

### Navigation Events
- `page_view` - Page navigation
- `page_navigation` - Menu interactions
- `session_start` / `session_end` - User sessions

### Chat Events
- `chat_message_sent` - User messages
- `ai_response_received` - AI responses
- `suggestion_clicked` - Quick suggestions

### Feature Events
- `feature_used` - Feature interactions
- `quick_action_clicked` - Quick action buttons
- `voice_input` - Voice interactions

### Fishing Events
- `weather_check` - Weather queries
- `price_check` - Market price queries
- `border_interaction` - Fishing zone interactions
- `sos_activated` - Emergency activations

### Technical Events
- `error_occurred` - Application errors
- `performance_metric` - Performance data
- `api_call` - Backend interactions

## 🚀 Production Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Analytics will be automatically enabled
3. View analytics in Vercel dashboard

### Environment Variables
Set in Vercel dashboard:
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
- `NEXT_PUBLIC_ENABLE_ANALYTICS=true`

### Performance Impact
- Minimal bundle size increase (~2KB)
- Asynchronous event tracking
- No impact on user experience

## 🔍 Monitoring & Alerts

### Key Metrics to Monitor
- Emergency SOS activation rates
- Weather query spikes during storms
- Feature adoption for new fishermen
- Error rates and technical issues

### Setting Up Alerts
1. High emergency activation rates
2. Unusual error patterns
3. Performance degradation
4. Feature usage anomalies

## 📚 Resources

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Google Analytics for React](https://developers.google.com/analytics)
- [Custom Analytics Implementation](https://web.dev/custom-metrics/)

---

**Note**: This analytics system is designed specifically for the fishing industry with privacy and user safety as top priorities. All fishing-related events help improve the service for fisherfolk communities.
