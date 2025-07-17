<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# FisherMate.AI - Multilingual Fisherfolk Chatbot

This is a comprehensive multilingual, multimodal literacy chatbot system specifically designed for fisherfolk communities in India. The system provides education on fishing laws, safety practices, and delivers real-time weather alerts.

## Project Structure
- **Backend**: Python Flask/FastAPI with Google Gemini integration
- **Frontend**: Flutter mobile app, React web app
- **Communication**: WhatsApp/SMS integration via Twilio
- **APIs**: OpenWeatherMap, IMD (Indian Meteorological Department)
- **Languages**: Support for 25+ Indian languages
- **Voice**: Google TTS and VOSK for offline recognition

## Development Guidelines
- Prioritize accessibility and low-bandwidth optimization
- Focus on regional language support and cultural sensitivity
- Ensure offline functionality where possible
- Implement proper error handling for API failures
- Use voice-first design principles for low-literacy users
- Follow mobile-first responsive design
- Maintain clear separation between modules (legal, safety, weather)

## Key Features
- Multilingual conversational AI
- Real-time weather alerts and visualizations
- Legal information retrieval system
- Safety protocol guidance
- Voice input/output support
- Offline mode capabilities
- Emergency SOS functionality
