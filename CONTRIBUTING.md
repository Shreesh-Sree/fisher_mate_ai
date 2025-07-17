# FisherMate.AI - Contributing Guidelines

Thank you for your interest in contributing to FisherMate.AI! This project aims to support fisherfolk communities across India with a comprehensive multilingual chatbot system.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Process](#contributing-process)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Documentation](#documentation)
8. [Language Support](#language-support)
9. [Accessibility](#accessibility)
10. [Security](#security)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@fishermate.ai. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Git** (latest version)
- **Flutter** (v3.0 or higher) for mobile development
- **Visual Studio Code** (recommended)

### Quick Start

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/fishermate.ai.git
   cd fishermate.ai
   ```

3. Install dependencies:
   ```bash
   # Backend
   pip install -r requirements.txt
   
   # Frontend Web
   cd frontend/web
   npm install
   
   # Frontend Mobile
   cd ../mobile
   flutter pub get
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Start development servers:
   ```bash
   # Backend
   python backend/app.py
   
   # Frontend Web
   cd frontend/web
   npm start
   
   # Frontend Mobile
   cd frontend/mobile
   flutter run
   ```

## Development Setup

### Environment Configuration

Create a `.env` file in the project root:

```env
# API Keys
GEMINI_API_KEY=your_gemini_key
OPENWEATHER_API_KEY=your_openweather_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Database
DATABASE_URL=sqlite:///fishermate.db

# Development
DEBUG=True
LOG_LEVEL=DEBUG

# Language Services
GOOGLE_TRANSLATE_API_KEY=your_translate_key
```

### Database Setup

Initialize the database:

```bash
python backend/scripts/init_db.py
```

### Testing Setup

Install test dependencies:

```bash
# Backend tests
pip install pytest pytest-cov pytest-asyncio

# Frontend tests  
cd frontend/web
npm install --dev

# Mobile tests
cd ../mobile
flutter test
```

## Contributing Process

### 1. Issue Creation

Before starting work, create or comment on an issue to discuss:

- **Bug Reports**: Use the bug report template
- **Feature Requests**: Use the feature request template
- **Language Support**: Use the language support template
- **Documentation**: Use the documentation template

### 2. Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/**: Feature branches (`feature/weather-alerts`)
- **bugfix/**: Bug fix branches (`bugfix/voice-recognition`)
- **hotfix/**: Critical fixes (`hotfix/security-patch`)

### 3. Pull Request Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Follow coding standards and add tests

3. **Test Your Changes**:
   ```bash
   # Backend tests
   pytest backend/tests/
   
   # Frontend tests
   cd frontend/web && npm test
   
   # Mobile tests
   cd frontend/mobile && flutter test
   ```

4. **Commit Changes**:
   ```bash
   git add .
   git commit -m "feat: add weather alert system"
   ```

5. **Push and Create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

### 4. Review Process

- All PRs require at least 2 reviewers
- Code must pass all automated tests
- Documentation must be updated
- Security review for sensitive changes

## Coding Standards

### Python (Backend)

```python
# Use Black for formatting
black backend/

# Use flake8 for linting
flake8 backend/

# Use type hints
def get_weather(lat: float, lon: float) -> WeatherData:
    """Get weather data for given coordinates."""
    pass

# Use docstrings
def process_message(message: str, language: str) -> str:
    """
    Process user message and return response.
    
    Args:
        message: User input message
        language: Language code (e.g., 'en', 'hi')
    
    Returns:
        Processed response string
    """
    pass
```

### JavaScript/React (Frontend)

```javascript
// Use ESLint and Prettier
npm run lint
npm run format

// Use PropTypes or TypeScript
import PropTypes from 'prop-types';

const WeatherWidget = ({ location, temperature }) => {
  return (
    <div className="weather-widget">
      {/* Component content */}
    </div>
  );
};

WeatherWidget.propTypes = {
  location: PropTypes.string.isRequired,
  temperature: PropTypes.number.isRequired,
};

// Use hooks properly
const useWeatherData = (location) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch weather data
  }, [location]);
  
  return { weather, loading };
};
```

### Dart/Flutter (Mobile)

```dart
// Use dart format
dart format lib/

// Use proper naming conventions
class WeatherService {
  Future<WeatherData> fetchWeather(double lat, double lon) async {
    // Implementation
  }
}

// Use proper documentation
/// Fetches weather data for the given coordinates.
/// 
/// Returns a [WeatherData] object containing current conditions.
/// Throws [NetworkException] if the request fails.
Future<WeatherData> fetchWeather(double lat, double lon) async {
  // Implementation
}
```

### Common Standards

- **File Naming**: Use kebab-case for files (`weather-service.js`)
- **Function Naming**: Use camelCase (`getUserLocation`)
- **Class Naming**: Use PascalCase (`WeatherService`)
- **Constants**: Use UPPER_SNAKE_CASE (`API_BASE_URL`)

## Testing Guidelines

### Backend Testing

```python
# Test structure
def test_weather_service():
    """Test weather service functionality."""
    service = WeatherService()
    result = service.get_current_weather(19.0760, 72.8777)
    
    assert result is not None
    assert result.temperature > 0
    assert result.location == "Mumbai"

# Use fixtures
@pytest.fixture
def weather_service():
    return WeatherService(api_key="test_key")

# Test edge cases
def test_weather_service_invalid_coordinates():
    service = WeatherService()
    with pytest.raises(ValueError):
        service.get_current_weather(999, 999)
```

### Frontend Testing

```javascript
// Component testing
import { render, screen } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';

test('renders weather information', () => {
  render(
    <WeatherWidget 
      location="Mumbai" 
      temperature={28} 
    />
  );
  
  expect(screen.getByText('Mumbai')).toBeInTheDocument();
  expect(screen.getByText('28°C')).toBeInTheDocument();
});

// Hook testing
import { renderHook } from '@testing-library/react-hooks';
import { useWeatherData } from './hooks/useWeatherData';

test('fetches weather data', async () => {
  const { result, waitForNextUpdate } = renderHook(() => 
    useWeatherData({ lat: 19.0760, lon: 72.8777 })
  );
  
  await waitForNextUpdate();
  
  expect(result.current.weather).toBeDefined();
  expect(result.current.loading).toBe(false);
});
```

### Mobile Testing

```dart
// Widget testing
import 'package:flutter_test/flutter_test.dart';
import 'package:fishermate/widgets/weather_widget.dart';

void main() {
  testWidgets('WeatherWidget displays temperature', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: WeatherWidget(
          location: 'Mumbai',
          temperature: 28,
        ),
      ),
    );

    expect(find.text('Mumbai'), findsOneWidget);
    expect(find.text('28°C'), findsOneWidget);
  });
}

// Unit testing
import 'package:test/test.dart';
import 'package:fishermate/services/weather_service.dart';

void main() {
  group('WeatherService', () {
    test('fetches weather data successfully', () async {
      final service = WeatherService();
      final weather = await service.fetchWeather(19.0760, 72.8777);
      
      expect(weather.location, equals('Mumbai'));
      expect(weather.temperature, greaterThan(0));
    });
  });
}
```

## Documentation

### Code Documentation

- **Functions**: Document all public functions
- **Classes**: Document all public classes
- **APIs**: Document all API endpoints
- **Components**: Document all React components

### README Updates

When adding features, update:
- Feature list
- Installation instructions
- Usage examples
- Configuration options

### API Documentation

Update `docs/API.md` for:
- New endpoints
- Changed parameters
- Response format changes
- Authentication changes

## Language Support

### Adding New Languages

1. **Add Language Code**:
   ```javascript
   // frontend/web/src/locales/index.js
   export const SUPPORTED_LANGUAGES = {
     // ... existing languages
     'new_lang': 'New Language Name'
   };
   ```

2. **Create Translation Files**:
   ```json
   // frontend/web/src/locales/new_lang.json
   {
     "common": {
       "hello": "Hello in new language",
       "goodbye": "Goodbye in new language"
     },
     "weather": {
       "temperature": "Temperature in new language"
     }
   }
   ```

3. **Update Backend**:
   ```python
   # backend/modules/language_processor.py
   SUPPORTED_LANGUAGES = {
       # ... existing languages
       'new_lang': 'New Language Name'
   }
   ```

4. **Add Voice Support**:
   ```python
   # backend/modules/voice_handler.py
   TTS_VOICES = {
       # ... existing voices
       'new_lang': 'new-lang-voice-id'
   }
   ```

### Translation Guidelines

- Use gender-neutral terms where possible
- Consider cultural context and regional variations
- Test with native speakers
- Provide fallback to English for missing translations

## Accessibility

### Web Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation
- Test with screen readers
- Maintain proper color contrast

```javascript
// Good accessibility practices
<button 
  aria-label="Send message"
  onClick={handleSend}
  disabled={loading}
>
  {loading ? 'Sending...' : 'Send'}
</button>

<img 
  src="/weather-icon.png" 
  alt="Partly cloudy weather conditions"
/>
```

### Mobile Accessibility

- Use semantic widgets
- Provide screen reader support
- Test with TalkBack/VoiceOver
- Ensure touch targets are large enough

```dart
// Good accessibility practices
Semantics(
  label: 'Weather information',
  child: Card(
    child: WeatherWidget(weather: weather),
  ),
);
```

## Security

### Security Guidelines

- **Never commit secrets** to version control
- **Validate all user inputs** on both client and server
- **Use HTTPS** for all API communications
- **Implement rate limiting** for API endpoints
- **Sanitize user data** before processing

### Vulnerability Reporting

Report security vulnerabilities to security@fishermate.ai:

- **Private disclosure** first
- **Detailed description** of the issue
- **Steps to reproduce** the vulnerability
- **Proposed fix** if available

## Release Process

### Version Numbering

We use Semantic Versioning (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. **Code Review**: All changes reviewed and approved
2. **Testing**: All tests pass
3. **Documentation**: Updated documentation
4. **Changelog**: Updated CHANGELOG.md
5. **Version Bump**: Update version numbers
6. **Tag Release**: Create git tag
7. **Deploy**: Deploy to staging, then production

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Email**: team@fishermate.ai for direct contact
- **Discord**: [Community Server](https://discord.gg/fishermate) for real-time chat

### Recognition

Contributors are recognized in:
- **README.md**: Contributors section
- **CHANGELOG.md**: Release notes
- **GitHub**: Contributor insights
- **Website**: Community page

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Read the documentation
3. Ask in GitHub Discussions
4. Contact team.quarkverse@gmail.com

Thank you for contributing to FisherMate.AI! Your efforts help support fisherfolk communities across India. 🎣🌊

---

*This document is living and will be updated as the project evolves. Last updated: July 17, 2025*
