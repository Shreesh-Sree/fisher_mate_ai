# Test Suite

This directory contains comprehensive tests for the FisherMate.AI application.

## Test Structure

```
tests/
├── backend/
│   ├── unit/
│   │   ├── test_weather_service.py
│   │   ├── test_language_processor.py
│   │   ├── test_voice_handler.py
│   │   └── test_safety_guide.py
│   ├── integration/
│   │   ├── test_api_endpoints.py
│   │   ├── test_database.py
│   │   └── test_external_services.py
│   └── e2e/
│       ├── test_complete_workflow.py
│       └── test_emergency_scenarios.py
├── frontend/
│   ├── web/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   └── mobile/
│       ├── unit/
│       ├── widget/
│       └── integration/
├── fixtures/
│   ├── weather_data.json
│   ├── chat_responses.json
│   └── user_profiles.json
└── utils/
    ├── test_helpers.py
    ├── mock_services.py
    └── test_data.py
```

## Running Tests

### Backend Tests

```bash
# Run all backend tests
pytest tests/backend/

# Run specific test categories
pytest tests/backend/unit/
pytest tests/backend/integration/
pytest tests/backend/e2e/

# Run with coverage
pytest tests/backend/ --cov=backend --cov-report=html

# Run specific test file
pytest tests/backend/unit/test_weather_service.py

# Run with verbose output
pytest tests/backend/ -v
```

### Frontend Web Tests

```bash
# Navigate to web frontend
cd frontend/web

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/WeatherWidget.test.js

# Run e2e tests
npm run test:e2e
```

### Frontend Mobile Tests

```bash
# Navigate to mobile frontend
cd frontend/mobile

# Run all tests
flutter test

# Run specific test file
flutter test test/widgets/weather_widget_test.dart

# Run integration tests
flutter test integration_test/

# Run with coverage
flutter test --coverage
```

## Test Categories

### Unit Tests
- Test individual functions and classes
- Fast execution
- No external dependencies
- Mock external services

### Integration Tests
- Test interaction between components
- Test API endpoints
- Test database operations
- Test external service integration

### End-to-End Tests
- Test complete user workflows
- Test across multiple components
- Test real-world scenarios
- Test emergency procedures

## Test Data

### Weather Test Data
```json
{
  "mumbai_weather": {
    "temperature": 28,
    "humidity": 75,
    "wind_speed": 12,
    "weather_description": "Partly cloudy"
  },
  "storm_alert": {
    "severity": "high",
    "message": "Strong winds expected",
    "valid_until": "2025-07-18T06:00:00Z"
  }
}
```

### Chat Test Data
```json
{
  "weather_query": {
    "input": "What's the weather like today?",
    "expected_intent": "weather_query",
    "expected_response_type": "weather_info"
  },
  "emergency_query": {
    "input": "I need help!",
    "expected_intent": "emergency_request",
    "expected_response_type": "emergency_procedure"
  }
}
```

## Mock Services

### Weather Service Mock
```python
class MockWeatherService:
    def get_current_weather(self, lat, lon):
        return {
            'temperature': 28,
            'humidity': 75,
            'wind_speed': 12,
            'description': 'Partly cloudy'
        }
    
    def get_forecast(self, lat, lon, days=5):
        return [
            {'date': '2025-07-17', 'temp_max': 30, 'temp_min': 24},
            {'date': '2025-07-18', 'temp_max': 32, 'temp_min': 26}
        ]
```

### API Client Mock
```javascript
class MockApiClient {
  async sendMessage(message, language) {
    return {
      response: 'Mocked response',
      confidence: 0.95,
      intent: 'weather_query'
    };
  }
  
  async getWeather(lat, lon) {
    return {
      temperature: 28,
      humidity: 75,
      description: 'Partly cloudy'
    };
  }
}
```

## Test Scenarios

### Emergency Scenario Tests
```python
def test_emergency_alert_workflow():
    """Test complete emergency alert workflow"""
    # 1. User triggers emergency
    # 2. Location is captured
    # 3. Alert is sent to authorities
    # 4. Response is received
    # 5. User is notified
    pass

def test_emergency_without_location():
    """Test emergency alert without GPS"""
    # 1. User triggers emergency
    # 2. No location available
    # 3. Manual location input requested
    # 4. Alert sent with manual location
    pass
```

### Weather Scenario Tests
```python
def test_weather_alert_subscription():
    """Test weather alert subscription"""
    # 1. User subscribes to weather alerts
    # 2. Weather conditions change
    # 3. Alert is triggered
    # 4. User receives notification
    pass

def test_offline_weather_data():
    """Test weather data in offline mode"""
    # 1. App goes offline
    # 2. User requests weather
    # 3. Cached data is returned
    # 4. User is notified of offline status
    pass
```

### Voice Interaction Tests
```python
def test_voice_to_text_workflow():
    """Test voice to text conversion"""
    # 1. User speaks into microphone
    # 2. Audio is captured
    # 3. Speech is converted to text
    # 4. Text is processed
    pass

def test_multilingual_voice():
    """Test voice processing in multiple languages"""
    # 1. User switches language
    # 2. User speaks in selected language
    # 3. Correct language model is used
    # 4. Response is in same language
    pass
```

## Performance Tests

### Load Testing
```python
def test_api_under_load():
    """Test API performance under load"""
    # Simulate 100 concurrent users
    # Measure response times
    # Check for errors
    pass

def test_database_performance():
    """Test database performance"""
    # Insert large amounts of data
    # Measure query times
    # Check for bottlenecks
    pass
```

### Memory Tests
```python
def test_memory_usage():
    """Test memory usage patterns"""
    # Monitor memory during operation
    # Check for memory leaks
    # Verify garbage collection
    pass
```

## Accessibility Tests

### Screen Reader Tests
```javascript
describe('Screen Reader Support', () => {
  test('weather widget is accessible', () => {
    // Test with screen reader
    // Check ARIA labels
    // Verify keyboard navigation
  });
});
```

### Color Contrast Tests
```javascript
describe('Color Contrast', () => {
  test('meets WCAG guidelines', () => {
    // Check color contrast ratios
    // Verify text readability
    // Test with different themes
  });
});
```

## Security Tests

### Input Validation Tests
```python
def test_sql_injection_prevention():
    """Test SQL injection prevention"""
    # Send malicious SQL inputs
    # Verify they are blocked
    # Check for data leakage
    pass

def test_xss_prevention():
    """Test XSS prevention"""
    # Send malicious scripts
    # Verify they are sanitized
    # Check for script execution
    pass
```

### Authentication Tests
```python
def test_invalid_token():
    """Test invalid token handling"""
    # Send requests with invalid tokens
    # Verify proper error responses
    # Check for unauthorized access
    pass
```

## Continuous Integration

### GitHub Actions
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest tests/backend/ --cov=backend
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend/web && npm install
      - name: Run tests
        run: cd frontend/web && npm test
```

## Test Reporting

### Coverage Reports
- Backend: `htmlcov/index.html`
- Frontend: `frontend/web/coverage/lcov-report/index.html`

### Test Results
- JUnit XML format for CI/CD integration
- HTML reports for detailed analysis
- JSON reports for programmatic access

## Contributing Tests

### Writing New Tests
1. Follow naming conventions
2. Use descriptive test names
3. Include setup and teardown
4. Mock external dependencies
5. Test edge cases

### Test Review Checklist
- [ ] Test covers the intended functionality
- [ ] Test is properly isolated
- [ ] Test is deterministic
- [ ] Test has clear assertions
- [ ] Test handles edge cases

## Troubleshooting

### Common Issues
- **Import errors**: Check Python path and dependencies
- **Database connection**: Ensure test database is running
- **API timeouts**: Increase timeout values for slow networks
- **File permissions**: Check file access permissions

### Debug Mode
```bash
# Run tests with debug output
pytest tests/backend/ -s --log-cli-level=DEBUG

# Run frontend tests with debug
cd frontend/web && npm test -- --verbose
```

---

*Testing is crucial for maintaining code quality and ensuring reliability for fisherfolk who depend on our services. Every feature should have comprehensive test coverage.*
