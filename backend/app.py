"""
FisherMate.AI Backend - Main Flask Application
Multilingual Fisherfolk Chatbot System
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import logging
from dotenv import load_dotenv
from datetime import datetime
import json

# Import custom modules
from modules.language_processor import LanguageProcessor
from modules.weather_service import WeatherService
from modules.legal_info import LegalInfoService
from modules.safety_guide import SafetyGuideService
from modules.voice_handler import VoiceHandler
from modules.whatsapp_handler import WhatsAppHandler
from modules.sms_handler import SMSHandler

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure Google Gemini
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

# Initialize services
language_processor = LanguageProcessor()
weather_service = WeatherService()
legal_info_service = LegalInfoService()
safety_guide_service = SafetyGuideService()
voice_handler = VoiceHandler()
whatsapp_handler = WhatsAppHandler()
sms_handler = SMSHandler()

@app.route('/')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'FisherMate.AI Backend',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint for processing user queries"""
    try:
        data = request.json
        user_message = data.get('message', '')
        user_language = data.get('language', 'en')
        user_location = data.get('location', {})
        message_type = data.get('type', 'text')  # text, voice, image
        
        logger.info(f"Received message: {user_message[:50]}... Language: {user_language}")
        
        # Detect language if not provided
        if user_language == 'auto':
            user_language = language_processor.detect_language(user_message)
        
        # Process voice input if needed
        if message_type == 'voice':
            audio_data = data.get('audio_data')
            user_message = voice_handler.speech_to_text(audio_data, user_language)
        
        # Determine intent/category
        intent = determine_intent(user_message, user_language)
        
        # Generate response based on intent
        response = generate_response(user_message, intent, user_language, user_location)
        
        # Convert to voice if requested
        if data.get('voice_response', False):
            response['audio_url'] = voice_handler.text_to_speech(
                response['text'], user_language
            )
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': 'कुछ गलत हुआ है। कृपया फिर से कोशिश करें।'
        }), 500

def determine_intent(message, language):
    """Determine the intent/category of the user message"""
    # Keywords for different categories in multiple languages
    weather_keywords = {
        'en': ['weather', 'rain', 'storm', 'wind', 'temperature', 'forecast'],
        'hi': ['मौसम', 'बारिश', 'तूफान', 'हवा', 'तापमान'],
        'ta': ['வானிலை', 'மழை', 'புயல்', 'காற்று', 'வெப்பநிலை'],
        'te': ['వాతావరణం', 'వర్షం', 'తుఫాను', 'గాలి', 'ఉష్ణోగ్రత'],
        'bn': ['আবহাওয়া', 'বৃষ্টি', 'ঝড়', 'বাতাস', 'তাপমাত্রা']
    }
    
    legal_keywords = {
        'en': ['law', 'legal', 'ban', 'license', 'permit', 'regulation'],
        'hi': ['कानून', 'नियम', 'प्रतिबंध', 'लाइसेंस', 'अनुमति'],
        'ta': ['சட்டம்', 'விதி', 'தடை', 'உரிமம்', 'அனுமதி'],
        'te': ['చట్టం', 'నియమం', 'నిషేధం', 'లైసెన్స్', 'అనుమతి'],
        'bn': ['আইন', 'নিয়ম', 'নিষেধাজ্ঞা', 'লাইসেন্স', 'অনুমতি']
    }
    
    safety_keywords = {
        'en': ['safety', 'emergency', 'help', 'danger', 'rescue'],
        'hi': ['सुरक्षा', 'आपातकाल', 'मदद', 'खतरा', 'बचाव'],
        'ta': ['பாதுகாப்பு', 'அவசரம்', 'உதவி', 'ஆபத்து', 'மீட்பு'],
        'te': ['భద్రత', 'అత్యవసర', 'సహాయం', 'ప్రమాదం', 'రక్షణ'],
        'bn': ['নিরাপত্তা', 'জরুরি', 'সাহায্য', 'বিপদ', 'উদ্ধার']
    }
    
    message_lower = message.lower()
    
    # Check for weather keywords
    if any(keyword in message_lower for keyword in weather_keywords.get(language, [])):
        return 'weather'
    
    # Check for legal keywords
    if any(keyword in message_lower for keyword in legal_keywords.get(language, [])):
        return 'legal'
    
    # Check for safety keywords
    if any(keyword in message_lower for keyword in safety_keywords.get(language, [])):
        return 'safety'
    
    # Default to general chat
    return 'general'

def generate_response(message, intent, language, location):
    """Generate appropriate response based on intent"""
    try:
        if intent == 'weather':
            return weather_service.get_weather_response(message, language, location)
        elif intent == 'legal':
            return legal_info_service.get_legal_response(message, language, location)
        elif intent == 'safety':
            return safety_guide_service.get_safety_response(message, language)
        else:
            return generate_general_response(message, language)
            
    except Exception as e:
        logger.error(f"Response generation error: {str(e)}")
        return {
            'text': language_processor.translate_text(
                "I'm sorry, I couldn't process your request. Please try again.",
                'en', language
            ),
            'type': 'error'
        }

def generate_general_response(message, language):
    """Generate general conversational response using Gemini"""
    try:
        # Create a prompt for Gemini with context about fisherfolk
        context = f"""
        You are FisherMate, a helpful assistant for fisherfolk communities in India.
        User language: {language}
        
        Please respond in {language} and help with:
        - Fishing-related queries
        - General information about fishing practices
        - Community support
        
        User message: {message}
        
        Provide a helpful, culturally sensitive response in {language}.
        """
        
        response = model.generate_content(context)
        
        return {
            'text': response.text,
            'type': 'general',
            'language': language
        }
        
    except Exception as e:
        logger.error(f"Gemini response error: {str(e)}")
        return {
            'text': language_processor.translate_text(
                "I'm here to help with your fishing-related questions. Please ask me about weather, safety, or fishing laws.",
                'en', language
            ),
            'type': 'general'
        }

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather information for a specific location"""
    try:
        lat = request.args.get('lat')
        lon = request.args.get('lon')
        language = request.args.get('language', 'en')
        
        if not lat or not lon:
            return jsonify({'error': 'Location coordinates required'}), 400
        
        weather_data = weather_service.get_current_weather(float(lat), float(lon))
        
        # Translate weather data to requested language
        if language != 'en':
            weather_data = language_processor.translate_weather_data(weather_data, language)
        
        return jsonify(weather_data)
        
    except Exception as e:
        logger.error(f"Weather API error: {str(e)}")
        return jsonify({'error': 'Weather service unavailable'}), 500

@app.route('/api/legal', methods=['GET'])
def get_legal_info():
    """Get legal information for fishing"""
    try:
        state = request.args.get('state', 'general')
        language = request.args.get('language', 'en')
        
        legal_data = legal_info_service.get_legal_info(state, language)
        
        return jsonify(legal_data)
        
    except Exception as e:
        logger.error(f"Legal info error: {str(e)}")
        return jsonify({'error': 'Legal information service unavailable'}), 500

@app.route('/api/safety', methods=['GET'])
def get_safety_info():
    """Get safety guidelines"""
    try:
        category = request.args.get('category', 'general')
        language = request.args.get('language', 'en')
        
        safety_data = safety_guide_service.get_safety_info(category, language)
        
        return jsonify(safety_data)
        
    except Exception as e:
        logger.error(f"Safety info error: {str(e)}")
        return jsonify({'error': 'Safety information service unavailable'}), 500

@app.route('/api/whatsapp', methods=['POST'])
def whatsapp_webhook():
    """Handle WhatsApp messages"""
    try:
        return whatsapp_handler.handle_message(request)
    except Exception as e:
        logger.error(f"WhatsApp webhook error: {str(e)}")
        return jsonify({'error': 'WhatsApp service error'}), 500

@app.route('/api/sms', methods=['POST'])
def sms_webhook():
    """Handle SMS messages"""
    try:
        return sms_handler.handle_message(request)
    except Exception as e:
        logger.error(f"SMS webhook error: {str(e)}")
        return jsonify({'error': 'SMS service error'}), 500

@app.route('/api/voice/tts', methods=['POST'])
def text_to_speech():
    """Convert text to speech"""
    try:
        data = request.json
        text = data.get('text', '')
        language = data.get('language', 'en')
        
        audio_url = voice_handler.text_to_speech(text, language)
        
        return jsonify({
            'audio_url': audio_url,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"TTS error: {str(e)}")
        return jsonify({'error': 'Text-to-speech service error'}), 500

@app.route('/api/voice/stt', methods=['POST'])
def speech_to_text():
    """Convert speech to text"""
    try:
        # Handle audio file upload
        audio_file = request.files.get('audio')
        language = request.form.get('language', 'en')
        
        if not audio_file:
            return jsonify({'error': 'Audio file required'}), 400
        
        text = voice_handler.speech_to_text(audio_file, language)
        
        return jsonify({
            'text': text,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"STT error: {str(e)}")
        return jsonify({'error': 'Speech-to-text service error'}), 500

if __name__ == '__main__':
    # Check for required environment variables
    required_env_vars = ['GOOGLE_API_KEY', 'OPENWEATHER_API_KEY']
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {missing_vars}")
        print(f"Please set the following environment variables: {', '.join(missing_vars)}")
    else:
        logger.info("Starting FisherMate.AI Backend Server...")
        app.run(debug=True, host='0.0.0.0', port=5000)
