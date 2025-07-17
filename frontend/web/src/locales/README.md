# Localization Configuration

This directory contains translation files for the FisherMate.AI web application.

## Supported Languages

The application supports the following languages:

### Primary Languages
- **English** (`en`) - Default language
- **Hindi** (`hi`) - Hindi (हिंदी)
- **Tamil** (`ta`) - Tamil (தமிழ்)
- **Telugu** (`te`) - Telugu (తెలుగు)
- **Malayalam** (`ml`) - Malayalam (മലയാളം)
- **Kannada** (`kn`) - Kannada (ಕನ್ನಡ)
- **Bengali** (`bn`) - Bengali (বাংলা)
- **Gujarati** (`gu`) - Gujarati (ગુજરાતી)
- **Marathi** (`mr`) - Marathi (मराठी)
- **Punjabi** (`pa`) - Punjabi (ਪੰਜਾਬੀ)
- **Odia** (`or`) - Odia (ଓଡ଼ିଆ)
- **Assamese** (`as`) - Assamese (অসমীয়া)
- **Urdu** (`ur`) - Urdu (اردو)

### Regional Dialects
- **Konkani** (`gom`) - Konkani (कोंकणी)
- **Tulu** (`tcy`) - Tulu (ತುಳು)
- **Maithili** (`mai`) - Maithili (मैथिली)

## File Structure

```
locales/
├── en.json          # English (default)
├── hi.json          # Hindi
├── ta.json          # Tamil
├── te.json          # Telugu
├── ml.json          # Malayalam
├── kn.json          # Kannada
├── bn.json          # Bengali
├── gu.json          # Gujarati
├── mr.json          # Marathi
├── pa.json          # Punjabi
├── or.json          # Odia
├── as.json          # Assamese
├── ur.json          # Urdu
├── gom.json         # Konkani
├── tcy.json         # Tulu
├── mai.json         # Maithili
└── index.js         # Localization configuration
```

## Translation Keys

### Common Keys
- `common.hello` - Greeting
- `common.goodbye` - Farewell
- `common.yes` - Affirmative
- `common.no` - Negative
- `common.loading` - Loading message
- `common.error` - Error message
- `common.success` - Success message

### Navigation Keys
- `nav.dashboard` - Dashboard
- `nav.chat` - Chat
- `nav.weather` - Weather
- `nav.safety` - Safety
- `nav.legal` - Legal
- `nav.emergency` - Emergency
- `nav.settings` - Settings

### Weather Keys
- `weather.temperature` - Temperature
- `weather.humidity` - Humidity
- `weather.windSpeed` - Wind Speed
- `weather.pressure` - Pressure
- `weather.visibility` - Visibility
- `weather.forecast` - Forecast

### Safety Keys
- `safety.emergency` - Emergency
- `safety.help` - Help
- `safety.contact` - Contact
- `safety.guidelines` - Guidelines

## Adding New Languages

1. Create a new JSON file with the language code
2. Translate all keys from `en.json`
3. Add the language to `index.js`
4. Test the translations in the application

## Translation Guidelines

- Keep translations concise but clear
- Consider cultural context
- Use formal language for official information
- Test with native speakers
- Provide fallbacks for missing translations

## Testing Translations

Use the language switcher in the application header to test translations:

1. Switch to the target language
2. Navigate through all pages
3. Check for missing translations
4. Verify cultural appropriateness
5. Test with screen readers for accessibility

## Contribution

To contribute translations:

1. Fork the repository
2. Add/update translation files
3. Test the translations
4. Submit a pull request

For more details, see [CONTRIBUTING.md](../../../CONTRIBUTING.md).
