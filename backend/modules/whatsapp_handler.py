"""
WhatsApp Handler Module for FisherMate.AI
Handles WhatsApp integration via Twilio API
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from flask import request, jsonify

logger = logging.getLogger(__name__)

class WhatsAppHandler:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.whatsapp_number = os.getenv('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')
        
        # Initialize Twilio client
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            logger.warning("Twilio credentials not found. WhatsApp functionality will be limited.")
        
        # User session management
        self.user_sessions = {}
        
        # Quick reply templates
        self.quick_replies = {
            'en': {
                'main_menu': [
                    '🌦️ Weather',
                    '⚖️ Legal Info',
                    '🦺 Safety',
                    '🆘 Emergency',
                    '🏠 Main Menu'
                ],
                'weather_menu': [
                    '🌤️ Current Weather',
                    '📅 3-Day Forecast',
                    '🌊 Marine Conditions',
                    '⚠️ Weather Alerts',
                    '🔙 Back'
                ],
                'legal_menu': [
                    '🚫 Seasonal Bans',
                    '📋 License Info',
                    '🦺 Safety Rules',
                    '📞 Contact Dept',
                    '🔙 Back'
                ],
                'safety_menu': [
                    '✅ Pre-fishing Checklist',
                    '⚓ At-Sea Safety',
                    '🚨 Emergency Procedures',
                    '🏥 First Aid',
                    '🔙 Back'
                ]
            },
            'hi': {
                'main_menu': [
                    '🌦️ मौसम',
                    '⚖️ कानूनी जानकारी',
                    '🦺 सुरक्षा',
                    '🆘 आपातकाल',
                    '🏠 मुख्य मेनू'
                ],
                'weather_menu': [
                    '🌤️ वर्तमान मौसम',
                    '📅 3-दिन का पूर्वानुमान',
                    '🌊 समुद्री स्थितियां',
                    '⚠️ मौसम चेतावनी',
                    '🔙 वापस'
                ],
                'legal_menu': [
                    '🚫 मौसमी प्रतिबंध',
                    '📋 लाइसेंस जानकारी',
                    '🦺 सुरक्षा नियम',
                    '📞 विभाग संपर्क',
                    '🔙 वापस'
                ],
                'safety_menu': [
                    '✅ मछली पकड़ने से पहले जांच',
                    '⚓ समुद्र में सुरक्षा',
                    '🚨 आपातकालीन प्रक्रिया',
                    '🏥 प्राथमिक चिकित्सा',
                    '🔙 वापस'
                ]
            },
            'ta': {
                'main_menu': [
                    '🌦️ வானிலை',
                    '⚖️ சட்ட தகவல்',
                    '🦺 பாதுகாப்பு',
                    '🆘 அவசரம்',
                    '🏠 முதன்மை மெனு'
                ],
                'weather_menu': [
                    '🌤️ தற்போதைய வானிலை',
                    '📅 3-நாள் முன்னறிவிப்பு',
                    '🌊 கடல் நிலைமைகள்',
                    '⚠️ வானிலை எச்சரிக்கைகள்',
                    '🔙 பின்னே'
                ],
                'legal_menu': [
                    '🚫 பருவகால தடைகள்',
                    '📋 உரிமம் தகவல்',
                    '🦺 பாதுகாப்பு விதிகள்',
                    '📞 துறை தொடர்பு',
                    '🔙 பின்னே'
                ],
                'safety_menu': [
                    '✅ மீன்பிடி முன் சரிபார்ப்பு',
                    '⚓ கடலில் பாதுகாப்பு',
                    '🚨 அவசர நடைமுறைகள்',
                    '🏥 முதலுதவி',
                    '🔙 பின்னே'
                ]
            }
        }
    
    def handle_message(self, request) -> Any:
        """Handle incoming WhatsApp messages"""
        try:
            # Get message data
            from_number = request.form.get('From', '')
            to_number = request.form.get('To', '')
            message_body = request.form.get('Body', '')
            media_url = request.form.get('MediaUrl0', '')
            
            logger.info(f"WhatsApp message from {from_number}: {message_body}")
            
            # Get or create user session
            user_session = self.get_user_session(from_number)
            
            # Process message
            response_text = self.process_message(message_body, user_session, media_url)
            
            # Send response
            return self.send_response(response_text, user_session)
            
        except Exception as e:
            logger.error(f"WhatsApp message handling error: {str(e)}")
            return self.send_error_response()
    
    def get_user_session(self, phone_number: str) -> Dict:
        """Get or create user session"""
        if phone_number not in self.user_sessions:
            self.user_sessions[phone_number] = {
                'phone': phone_number,
                'language': 'en',
                'current_menu': 'main',
                'context': {},
                'last_activity': datetime.now(),
                'conversation_history': []
            }
        
        # Update last activity
        self.user_sessions[phone_number]['last_activity'] = datetime.now()
        
        return self.user_sessions[phone_number]
    
    def process_message(self, message: str, user_session: Dict, media_url: str = '') -> str:
        """Process incoming message and generate response"""
        try:
            # Add to conversation history
            user_session['conversation_history'].append({
                'type': 'user',
                'message': message,
                'timestamp': datetime.now(),
                'media_url': media_url
            })
            
            # Handle media messages
            if media_url:
                return self.handle_media_message(media_url, user_session)
            
            # Handle text messages
            return self.handle_text_message(message, user_session)
            
        except Exception as e:
            logger.error(f"Message processing error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def handle_text_message(self, message: str, user_session: Dict) -> str:
        """Handle text messages"""
        message_lower = message.lower().strip()
        language = user_session['language']
        
        # Handle language change
        if self.is_language_change_request(message_lower):
            return self.handle_language_change(message_lower, user_session)
        
        # Handle menu navigation
        if self.is_menu_navigation(message_lower):
            return self.handle_menu_navigation(message_lower, user_session)
        
        # Handle quick replies
        if self.is_quick_reply(message, user_session):
            return self.handle_quick_reply(message, user_session)
        
        # Handle specific commands
        if message_lower.startswith('/'):
            return self.handle_command(message_lower, user_session)
        
        # Handle conversational queries
        return self.handle_conversational_query(message, user_session)
    
    def handle_media_message(self, media_url: str, user_session: Dict) -> str:
        """Handle media messages (images, audio, etc.)"""
        try:
            # For now, acknowledge media and provide instructions
            language = user_session['language']
            
            if language == 'hi':
                return "📸 मीडिया प्राप्त हुआ! अभी के लिए, कृपया टेक्स्ट संदेश भेजें। जल्द ही इमेज और वॉइस सपोर्ट आएगा।"
            elif language == 'ta':
                return "📸 मीडिया கிடைத்தது! தற்போது, தயவுசெய்து டெக்ஸ்ட் செய்திகளை அனுப்பவும். படம் மற்றும் குரல் ஆதரவு விரைவில் வரும்."
            else:
                return "📸 Media received! For now, please send text messages. Image and voice support coming soon."
                
        except Exception as e:
            logger.error(f"Media handling error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def is_language_change_request(self, message: str) -> bool:
        """Check if message is a language change request"""
        language_keywords = [
            'hindi', 'हिंदी', 'tamil', 'தமிழ்', 'english', 'language',
            'भाषा', 'மொழி', 'change language', 'भाषा बदलें', 'மொழி மாற்று'
        ]
        
        return any(keyword in message for keyword in language_keywords)
    
    def handle_language_change(self, message: str, user_session: Dict) -> str:
        """Handle language change requests"""
        if 'hindi' in message or 'हिंदी' in message:
            user_session['language'] = 'hi'
            return "✅ भाषा हिंदी में बदल गई है। मैं फिशरमेट हूं, आपका मछली पकड़ने का सहायक। मैं आपकी कैसे मदद कर सकता हूं?"
        elif 'tamil' in message or 'தமிழ்' in message:
            user_session['language'] = 'ta'
            return "✅ மொழி தமிழில் மாற்றப்பட்டது। நான் ஃபிஷர்மேட், உங்கள் மீன்பிடித் துணை. நான் உங்களுக்கு எப்படி உதவ முடியும்?"
        else:
            user_session['language'] = 'en'
            return "✅ Language changed to English. I'm FisherMate, your fishing assistant. How can I help you?"
    
    def is_menu_navigation(self, message: str) -> bool:
        """Check if message is menu navigation"""
        nav_keywords = ['menu', 'मेनू', 'மெனு', 'back', 'वापस', 'பின்னே', 'home', 'घर', 'வீடு']
        return any(keyword in message for keyword in nav_keywords)
    
    def handle_menu_navigation(self, message: str, user_session: Dict) -> str:
        """Handle menu navigation"""
        if 'back' in message or 'वापस' in message or 'பின்னே' in message:
            user_session['current_menu'] = 'main'
            return self.get_main_menu(user_session['language'])
        else:
            return self.get_main_menu(user_session['language'])
    
    def is_quick_reply(self, message: str, user_session: Dict) -> bool:
        """Check if message is a quick reply"""
        language = user_session['language']
        current_menu = user_session['current_menu']
        
        if current_menu in self.quick_replies.get(language, {}):
            quick_replies = self.quick_replies[language][current_menu]
            return any(reply in message for reply in quick_replies)
        
        return False
    
    def handle_quick_reply(self, message: str, user_session: Dict) -> str:
        """Handle quick reply selections"""
        language = user_session['language']
        
        # Weather quick replies
        if '🌦️' in message or '🌤️' in message:
            user_session['current_menu'] = 'weather'
            return self.get_weather_menu(language)
        elif '📅' in message:
            return self.get_weather_forecast(user_session)
        elif '🌊' in message:
            return self.get_marine_conditions(user_session)
        
        # Legal quick replies
        elif '⚖️' in message or '🚫' in message:
            user_session['current_menu'] = 'legal'
            return self.get_legal_menu(language)
        elif '📋' in message:
            return self.get_license_info(user_session)
        
        # Safety quick replies
        elif '🦺' in message or '✅' in message:
            user_session['current_menu'] = 'safety'
            return self.get_safety_menu(language)
        elif '⚓' in message:
            return self.get_safety_info(user_session)
        
        # Emergency
        elif '🆘' in message:
            return self.get_emergency_info(user_session)
        
        # Back/Home
        elif '🔙' in message or '🏠' in message:
            user_session['current_menu'] = 'main'
            return self.get_main_menu(language)
        
        else:
            return self.handle_conversational_query(message, user_session)
    
    def handle_command(self, command: str, user_session: Dict) -> str:
        """Handle slash commands"""
        language = user_session['language']
        
        if command == '/start':
            return self.get_welcome_message(language)
        elif command == '/help':
            return self.get_help_message(language)
        elif command == '/weather':
            return self.get_weather_info(user_session)
        elif command == '/legal':
            return self.get_legal_info(user_session)
        elif command == '/safety':
            return self.get_safety_info(user_session)
        elif command == '/emergency':
            return self.get_emergency_info(user_session)
        else:
            return self.get_unknown_command_message(language)
    
    def handle_conversational_query(self, message: str, user_session: Dict) -> str:
        """Handle conversational queries using the main chatbot logic"""
        try:
            # This would integrate with the main chatbot logic
            # For now, provide a simple response
            language = user_session['language']
            
            # Basic keyword matching
            if any(word in message.lower() for word in ['weather', 'mausam', 'vanilai']):
                return self.get_weather_info(user_session)
            elif any(word in message.lower() for word in ['law', 'legal', 'kanoon', 'sattam']):
                return self.get_legal_info(user_session)
            elif any(word in message.lower() for word in ['safety', 'suraksha', 'padhukaapu']):
                return self.get_safety_info(user_session)
            elif any(word in message.lower() for word in ['emergency', 'help', 'madad', 'udavi']):
                return self.get_emergency_info(user_session)
            else:
                return self.get_default_response(language)
                
        except Exception as e:
            logger.error(f"Conversational query error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def get_main_menu(self, language: str) -> str:
        """Get main menu"""
        if language == 'hi':
            return """🐟 **फिशरमेट - मुख्य मेनू**

मैं आपकी कैसे मदद कर सकता हूं?

🌦️ मौसम - मौसम की जानकारी
⚖️ कानूनी जानकारी - मछली पकड़ने के नियम
🦺 सुरक्षा - सुरक्षा दिशा-निर्देश
🆘 आपातकाल - आपातकालीन संपर्क

बस बटन दबाएं या टाइप करें!"""
        elif language == 'ta':
            return """🐟 **ஃபிஷர்மேட் - முதன்மை மெனு**

நான் உங்களுக்கு எப்படி உதவ முடியும்?

🌦️ வானிலை - வானிலை தகவல்
⚖️ சட்ட தகவல் - மீன்பிடி விதிகள்
🦺 பாதுகாப்பு - பாதுகாப்பு வழிகாட்டுதல்
🆘 அவசரம் - அவசர தொடர்பு

பொத்தானை அழுத்தவும் அல்லது தட்டச்சு செய்யவும்!"""
        else:
            return """🐟 **FisherMate - Main Menu**

How can I help you today?

🌦️ Weather - Weather information
⚖️ Legal Info - Fishing regulations
🦺 Safety - Safety guidelines
🆘 Emergency - Emergency contacts

Just tap a button or type your question!"""
    
    def get_weather_menu(self, language: str) -> str:
        """Get weather submenu"""
        if language == 'hi':
            return """🌦️ **मौसम जानकारी**

🌤️ वर्तमान मौसम
📅 3-दिन का पूर्वानुमान
🌊 समुद्री स्थितियां
⚠️ मौसम चेतावनी
🔙 वापस"""
        elif language == 'ta':
            return """🌦️ **வானிலை தகவல்**

🌤️ தற்போதைய வானிலை
📅 3-நாள் முன்னறிவிப்பு
🌊 கடல் நிலைமைகள்
⚠️ வானிலை எச்சரிக்கைகள்
🔙 பின்னே"""
        else:
            return """🌦️ **Weather Information**

🌤️ Current Weather
📅 3-Day Forecast
🌊 Marine Conditions
⚠️ Weather Alerts
🔙 Back"""
    
    def get_legal_menu(self, language: str) -> str:
        """Get legal submenu"""
        if language == 'hi':
            return """⚖️ **कानूनी जानकारी**

🚫 मौसमी प्रतिबंध
📋 लाइसेंस जानकारी
🦺 सुरक्षा नियम
📞 विभाग संपर्क
🔙 वापस"""
        elif language == 'ta':
            return """⚖️ **சட்ட தகவல்**

🚫 பருவகால தடைகள்
📋 உரிமம் தகவல்
🦺 பாதுகாப்பு விதிகள்
📞 துறை தொடர்பு
🔙 பின்னே"""
        else:
            return """⚖️ **Legal Information**

🚫 Seasonal Bans
📋 License Info
🦺 Safety Rules
📞 Contact Dept
🔙 Back"""
    
    def get_safety_menu(self, language: str) -> str:
        """Get safety submenu"""
        if language == 'hi':
            return """🦺 **सुरक्षा दिशा-निर्देश**

✅ मछली पकड़ने से पहले जांच
⚓ समुद्र में सुरक्षा
🚨 आपातकालीन प्रक्रिया
🏥 प्राथमिक चिकित्सा
🔙 वापस"""
        elif language == 'ta':
            return """🦺 **பாதுகாப்பு வழிகாட்டுதல்**

✅ மீன்பிடி முன் சரிபார்ப்பு
⚓ கடலில் பாதுகாப்பு
🚨 அவசர நடைமுறைகள்
🏥 முதலுதவி
🔙 பின்னே"""
        else:
            return """🦺 **Safety Guidelines**

✅ Pre-fishing Checklist
⚓ At-Sea Safety
🚨 Emergency Procedures
🏥 First Aid
🔙 Back"""
    
    def get_welcome_message(self, language: str) -> str:
        """Get welcome message"""
        if language == 'hi':
            return """🐟 **फिशरमेट में आपका स्वागत है!**

मैं आपका मछली पकड़ने का सहायक हूं। मैं आपकी मदद कर सकता हूं:

• मौसम की जानकारी
• मछली पकड़ने के नियम
• सुरक्षा दिशा-निर्देश
• आपातकालीन संपर्क

भाषा बदलने के लिए लिखें: "Hindi", "English", या "Tamil"

मुख्य मेनू के लिए "Menu" लिखें।"""
        elif language == 'ta':
            return """🐟 **ஃபிஷர்மேட்டில் உங்களை வரவேற்கிறோம்!**

நான் உங்கள் மீன்பிடித் துணை. நான் உங்களுக்கு உதவ முடியும்:

• வானிலை தகவல்
• மீன்பிடி விதிகள்
• பாதுகாப்பு வழிகாட்டுதல்
• அவசர தொடர்பு

மொழி மாற்ற: "Hindi", "English", அல்லது "Tamil" என்று எழுதுங்கள்

முதன்மை மெனுவிற்கு "Menu" என்று எழுதுங்கள்."""
        else:
            return """🐟 **Welcome to FisherMate!**

I'm your fishing assistant. I can help you with:

• Weather information
• Fishing regulations
• Safety guidelines
• Emergency contacts

To change language, type: "Hindi", "English", or "Tamil"

Type "Menu" for main menu."""
    
    def get_weather_info(self, user_session: Dict) -> str:
        """Get weather information"""
        language = user_session['language']
        
        if language == 'hi':
            return """🌦️ **मौसम जानकारी**

वर्तमान मौसम जानकारी के लिए कृपया अपना स्थान साझा करें या शहर का नाम भेजें।

उदाहरण: "Chennai weather" या "मुंबई का मौसम"

या मुख्य मेनू के लिए "Menu" लिखें।"""
        elif language == 'ta':
            return """🌦️ **வானிலை தகவல்**

தற்போதைய வானிலை தகவலுக்கு தயவுசெய்து உங்கள் இடத்தை பகிர்ந்து கொள்ளுங்கள் அல்லது நகரத்தின் பெயரை அனுப்பவும்.

உதாரணம்: "Chennai weather" அல்லது "கொச்சியின் வானிலை"

அல்லது முதன்மை மெனுவிற்கு "Menu" என்று எழுதுங்கள்."""
        else:
            return """🌦️ **Weather Information**

Please share your location or send city name for current weather information.

Example: "Chennai weather" or "Mumbai weather"

Or type "Menu" for main menu."""
    
    def get_legal_info(self, user_session: Dict) -> str:
        """Get legal information"""
        language = user_session['language']
        
        if language == 'hi':
            return """⚖️ **कानूनी जानकारी**

मछली पकड़ने के नियमों के लिए कृपया अपना राज्य बताएं।

उदाहरण: "तमिलनाडु के नियम" या "Kerala fishing laws"

या मुख्य मेनू के लिए "Menu" लिखें।"""
        elif language == 'ta':
            return """⚖️ **சட்ட தகவல்**

மீன்பிடி விதிகளுக்கு தயவுசெய்து உங்கள் மாநிலத்தை குறிப்பிடவும்.

உதாரணம்: "தமிழ்நாடு விதிகள்" அல்லது "Kerala fishing laws"

அல்லது முதன்மை மெனுவிற்கு "Menu" என்று எழுதுங்கள்."""
        else:
            return """⚖️ **Legal Information**

Please specify your state for fishing regulations.

Example: "Tamil Nadu rules" or "Kerala fishing laws"

Or type "Menu" for main menu."""
    
    def get_safety_info(self, user_session: Dict) -> str:
        """Get safety information"""
        language = user_session['language']
        
        if language == 'hi':
            return """🦺 **सुरक्षा दिशा-निर्देश**

🚨 **आपातकालीन संपर्क:** कोस्ट गार्ड 1554

**मुख्य सुरक्षा नियम:**
• हमेशा लाइफ जैकेट पहनें
• मौसम की जांच करें
• रेडियो साथ रखें
• दूसरों को अपनी योजना बताएं

विस्तृत जानकारी के लिए "Safety checklist" लिखें।"""
        elif language == 'ta':
            return """🦺 **பாதுகாப்பு வழிகாட்டுதல்**

🚨 **அவசர தொடர்பு:** கடலோர காவல்படை 1554

**முக்கிய பாதுகாப்பு விதிகள்:**
• எப்போதும் உயிர்காக்கும் ஜாக்கெட் அணியுங்கள்
• வானிலையை சரிபார்க்கவும்
• ரேடியோ வைத்திருங்கள்
• உங்கள் திட்டத்தை மற்றவர்களுக்குச் சொல்லுங்கள்

விரிவான தகவலுக்கு "Safety checklist" என்று எழுதுங்கள்."""
        else:
            return """🦺 **Safety Guidelines**

🚨 **Emergency Contact:** Coast Guard 1554

**Key Safety Rules:**
• Always wear life jackets
• Check weather conditions
• Carry radio equipment
• Inform others of your plans

Type "Safety checklist" for detailed information."""
    
    def get_emergency_info(self, user_session: Dict) -> str:
        """Get emergency information"""
        language = user_session['language']
        
        if language == 'hi':
            return """🆘 **आपातकालीन संपर्क**

🚨 **तत्काल सहायता:**
• कोस्ट गार्ड: 1554
• आपातकाल: 112
• मरीन पुलिस: 100

**VHF रेडियो:** चैनल 16 पर MAYDAY

**आपातकाल में क्या करें:**
1. तुरंत सहायता के लिए कॉल करें
2. अपनी सटीक स्थिति बताएं
3. समस्या को स्पष्ट रूप से बताएं
4. निर्देशों का पालन करें"""
        elif language == 'ta':
            return """🆘 **அவசர தொடர்பு**

🚨 **உடனடி உதவி:**
• கடலோர காவல்படை: 1554
• அவசரம்: 112
• கடல் காவல்துறை: 100

**VHF ரேடியோ:** சேனல் 16 இல் MAYDAY

**அவசரத்தில் என்ன செய்வது:**
1. உடனடியாக உதவிக்கு அழைக்கவும்
2. உங்கள் சரியான இடத்தை சொல்லுங்கள்
3. பிரச்சனையை தெளிவாக விளக்கவும்
4. அறிவுரைகளை பின்பற்றவும்"""
        else:
            return """🆘 **Emergency Contacts**

🚨 **Immediate Help:**
• Coast Guard: 1554
• Emergency: 112
• Marine Police: 100

**VHF Radio:** MAYDAY on Channel 16

**What to do in Emergency:**
1. Call for help immediately
2. Give your exact location
3. Describe the problem clearly
4. Follow instructions"""
    
    def get_error_message(self, language: str) -> str:
        """Get error message"""
        if language == 'hi':
            return "😔 क्षमा करें, कुछ गलत हुआ है। कृपया फिर से कोशिश करें या 'Menu' लिखें।"
        elif language == 'ta':
            return "😔 மன்னிக்கவும், ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும் அல்லது 'Menu' என்று எழுதுங்கள்."
        else:
            return "😔 Sorry, something went wrong. Please try again or type 'Menu'."
    
    def get_default_response(self, language: str) -> str:
        """Get default response for unrecognized messages"""
        if language == 'hi':
            return "🤔 मैं समझ नहीं पाया। कृपया 'Menu' लिखें या अपना प्रश्न दूसरे तरीके से पूछें।"
        elif language == 'ta':
            return "🤔 என்னால் புரிந்து கொள்ள முடியவில்லை. தயவுசெய்து 'Menu' என்று எழுதுங்கள் அல்லது உங்கள் கேள்வியை வேறுவிதமாக கேளுங்கள்."
        else:
            return "🤔 I didn't understand that. Please type 'Menu' or ask your question differently."
    
    def send_response(self, message: str, user_session: Dict) -> Any:
        """Send response message"""
        try:
            response = MessagingResponse()
            response.message(message)
            
            # Add to conversation history
            user_session['conversation_history'].append({
                'type': 'bot',
                'message': message,
                'timestamp': datetime.now()
            })
            
            return str(response)
            
        except Exception as e:
            logger.error(f"Response sending error: {str(e)}")
            return str(MessagingResponse())
    
    def send_error_response(self) -> Any:
        """Send error response"""
        response = MessagingResponse()
        response.message("Sorry, I'm having trouble right now. Please try again later.")
        return str(response)
    
    def send_whatsapp_message(self, to_number: str, message: str) -> bool:
        """Send WhatsApp message programmatically"""
        try:
            if not self.client:
                logger.error("Twilio client not initialized")
                return False
            
            message = self.client.messages.create(
                body=message,
                from_=self.whatsapp_number,
                to=f"whatsapp:{to_number}"
            )
            
            logger.info(f"WhatsApp message sent: {message.sid}")
            return True
            
        except Exception as e:
            logger.error(f"WhatsApp message sending error: {str(e)}")
            return False
    
    def get_user_stats(self) -> Dict:
        """Get user statistics"""
        try:
            stats = {
                'total_users': len(self.user_sessions),
                'active_users': 0,
                'languages': {},
                'menu_usage': {},
                'conversation_counts': {}
            }
            
            for session in self.user_sessions.values():
                # Count active users (activity within last hour)
                if (datetime.now() - session['last_activity']).total_seconds() < 3600:
                    stats['active_users'] += 1
                
                # Language distribution
                lang = session['language']
                stats['languages'][lang] = stats['languages'].get(lang, 0) + 1
                
                # Menu usage
                menu = session['current_menu']
                stats['menu_usage'][menu] = stats['menu_usage'].get(menu, 0) + 1
                
                # Conversation counts
                conv_count = len(session['conversation_history'])
                stats['conversation_counts'][session['phone']] = conv_count
            
            return stats
            
        except Exception as e:
            logger.error(f"User stats error: {str(e)}")
            return {
                'error': str(e),
                'total_users': 0,
                'active_users': 0
            }
    
    def cleanup_old_sessions(self, max_age_hours: int = 24):
        """Clean up old user sessions"""
        try:
            current_time = datetime.now()
            sessions_to_remove = []
            
            for phone, session in self.user_sessions.items():
                age_hours = (current_time - session['last_activity']).total_seconds() / 3600
                if age_hours > max_age_hours:
                    sessions_to_remove.append(phone)
            
            for phone in sessions_to_remove:
                del self.user_sessions[phone]
                logger.info(f"Cleaned up old session for {phone}")
                
        except Exception as e:
            logger.error(f"Session cleanup error: {str(e)}")
