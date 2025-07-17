"""
SMS Handler Module for FisherMate.AI
Handles SMS integration via Twilio API for low-bandwidth users
"""

import os
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from flask import request

logger = logging.getLogger(__name__)

class SMSHandler:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.sms_number = os.getenv('TWILIO_SMS_NUMBER')
        
        # Initialize Twilio client
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            logger.warning("Twilio credentials not found. SMS functionality will be limited.")
        
        # User session management (simplified for SMS)
        self.user_sessions = {}
        
        # SMS command shortcuts
        self.sms_commands = {
            'W': 'weather',
            'L': 'legal',
            'S': 'safety',
            'E': 'emergency',
            'H': 'help',
            'M': 'menu',
            'EN': 'english',
            'HI': 'hindi',
            'TA': 'tamil'
        }
        
        # Quick response templates for SMS (character-limited)
        self.quick_responses = {
            'en': {
                'welcome': "FisherMate SMS\nW-Weather L-Legal S-Safety E-Emergency H-Help\nSend city name for weather.",
                'help': "Commands:\nW-Weather L-Legal S-Safety E-Emergency\nEN-English HI-Hindi TA-Tamil\nSend location for weather.",
                'menu': "Menu:\nW-Weather L-Legal S-Safety E-Emergency H-Help\nOr send your question.",
                'weather_help': "Weather: Send 'W Chennai' or 'W Mumbai'\nOr share location for local weather.",
                'legal_help': "Legal: Send 'L Tamil Nadu' or 'L Kerala'\nFor fishing laws in your state.",
                'safety_help': "Safety: Send 'S checklist' or 'S emergency'\nFor safety guidelines.",
                'emergency': "EMERGENCY: Coast Guard 1554\nEmergency: 112\nMarine Police: 100\nVHF Ch 16: MAYDAY"
            },
            'hi': {
                'welcome': "फिशरमेट SMS\nW-मौसम L-कानून S-सुरक्षा E-आपातकाल H-मदद\nमौसम के लिए शहर का नाम भेजें।",
                'help': "कमांड:\nW-मौसम L-कानून S-सुरक्षा E-आपातकाल\nEN-English HI-Hindi TA-Tamil\nमौसम के लिए स्थान भेजें।",
                'menu': "मेनू:\nW-मौसम L-कानून S-सुरक्षा E-आपातकाल H-मदद\nया अपना प्रश्न भेजें।",
                'weather_help': "मौसम: 'W Chennai' या 'W Mumbai' भेजें\nया स्थानीय मौसम के लिए स्थान साझा करें।",
                'legal_help': "कानून: 'L Tamil Nadu' या 'L Kerala' भेजें\nअपने राज्य के मछली पकड़ने के नियमों के लिए।",
                'safety_help': "सुरक्षा: 'S checklist' या 'S emergency' भेजें\nसुरक्षा दिशा-निर्देशों के लिए।",
                'emergency': "आपातकाल: कोस्ट गार्ड 1554\nआपातकाल: 112\nसमुद्री पुलिस: 100\nVHF Ch 16: MAYDAY"
            },
            'ta': {
                'welcome': "ஃபிஷர்மேட் SMS\nW-வானிலை L-சட்டம் S-பாதுகாப்பு E-அவசரம் H-உதவி\nவானிலைக்கு நகரத்தின் பெயரை அனுப்பவும்।",
                'help': "கட்டளைகள்:\nW-வானிலை L-சட்டம் S-பாதுகாப்பு E-அவசரம்\nEN-English HI-Hindi TA-Tamil\nவானிலைக்கு இடத்தை அனுப்பவும்।",
                'menu': "மெனு:\nW-வானிலை L-சட்டம் S-பாதுகாப்பு E-அவசரம் H-உதவி\nஅல்லது உங்கள் கேள்வியை அனுப்பவும்।",
                'weather_help': "வானிலை: 'W Chennai' அல்லது 'W Mumbai' அனுப்பவும்\nஅல்லது உள்ளூர் வானிலைக்கு இடத்தை பகிர்ந்து கொள்ளுங்கள்.",
                'legal_help': "சட்டம்: 'L Tamil Nadu' அல்லது 'L Kerala' அனுப்பவும்\nஉங்கள் மாநிலத்தில் மீன்பிடி சட்டங்களுக்கு.",
                'safety_help': "பாதுகாப்பு: 'S checklist' அல்லது 'S emergency' அனுப்பவும்\nபாதுகாப்பு வழிகாட்டுதல்களுக்கு.",
                'emergency': "அவசரம்: கடலோர காவல்படை 1554\nஅவசரம்: 112\nகடல் காவல்துறை: 100\nVHF Ch 16: MAYDAY"
            }
        }
    
    def handle_message(self, request) -> Any:
        """Handle incoming SMS messages"""
        try:
            # Get message data
            from_number = request.form.get('From', '')
            to_number = request.form.get('To', '')
            message_body = request.form.get('Body', '').strip()
            
            logger.info(f"SMS message from {from_number}: {message_body}")
            
            # Get or create user session
            user_session = self.get_user_session(from_number)
            
            # Process message
            response_text = self.process_sms_message(message_body, user_session)
            
            # Send response
            return self.send_sms_response(response_text)
            
        except Exception as e:
            logger.error(f"SMS message handling error: {str(e)}")
            return self.send_error_response()
    
    def get_user_session(self, phone_number: str) -> Dict:
        """Get or create user session for SMS"""
        if phone_number not in self.user_sessions:
            self.user_sessions[phone_number] = {
                'phone': phone_number,
                'language': 'en',
                'last_activity': datetime.now(),
                'message_count': 0
            }
        
        # Update last activity and message count
        self.user_sessions[phone_number]['last_activity'] = datetime.now()
        self.user_sessions[phone_number]['message_count'] += 1
        
        return self.user_sessions[phone_number]
    
    def process_sms_message(self, message: str, user_session: Dict) -> str:
        """Process SMS message and generate response"""
        try:
            message_upper = message.upper().strip()
            language = user_session['language']
            
            # Handle language change
            if message_upper in ['EN', 'ENGLISH']:
                user_session['language'] = 'en'
                return self.quick_responses['en']['welcome']
            elif message_upper in ['HI', 'HINDI']:
                user_session['language'] = 'hi'
                return self.quick_responses['hi']['welcome']
            elif message_upper in ['TA', 'TAMIL']:
                user_session['language'] = 'ta'
                return self.quick_responses['ta']['welcome']
            
            # Handle command shortcuts
            if message_upper in self.sms_commands:
                command = self.sms_commands[message_upper]
                return self.handle_sms_command(command, user_session)
            
            # Handle commands with parameters
            if len(message_upper) > 2 and message_upper[1] == ' ':
                command = message_upper[0]
                param = message[2:].strip()
                
                if command == 'W':
                    return self.get_weather_sms(param, user_session)
                elif command == 'L':
                    return self.get_legal_sms(param, user_session)
                elif command == 'S':
                    return self.get_safety_sms(param, user_session)
            
            # Handle full text queries
            return self.handle_text_query(message, user_session)
            
        except Exception as e:
            logger.error(f"SMS processing error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def handle_sms_command(self, command: str, user_session: Dict) -> str:
        """Handle SMS commands"""
        language = user_session['language']
        responses = self.quick_responses[language]
        
        if command == 'help':
            return responses['help']
        elif command == 'menu':
            return responses['menu']
        elif command == 'weather':
            return responses['weather_help']
        elif command == 'legal':
            return responses['legal_help']
        elif command == 'safety':
            return responses['safety_help']
        elif command == 'emergency':
            return responses['emergency']
        else:
            return responses['help']
    
    def get_weather_sms(self, location: str, user_session: Dict) -> str:
        """Get weather information for SMS"""
        try:
            language = user_session['language']
            
            # This would integrate with the weather service
            # For now, return a mock response
            if language == 'hi':
                return f"{location} मौसम:\n25°C, हल्की हवा\n💨 15 km/h\n💧 60% नमी\n✅ मछली पकड़ने के लिए अच्छा\n\nविस्तार: W {location} detail"
            elif language == 'ta':
                return f"{location} வானிலை:\n25°C, லேசான காற்று\n💨 15 km/h\n💧 60% ஈரப்பதம்\n✅ மீன்பிடிக்க நல்லது\n\nविவரம்: W {location} detail"
            else:
                return f"{location} Weather:\n25°C, Light wind\n💨 15 km/h\n💧 60% humidity\n✅ Good for fishing\n\nDetails: W {location} detail"
                
        except Exception as e:
            logger.error(f"Weather SMS error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def get_legal_sms(self, state: str, user_session: Dict) -> str:
        """Get legal information for SMS"""
        try:
            language = user_session['language']
            
            # This would integrate with the legal service
            # For now, return a mock response
            if language == 'hi':
                return f"{state} मछली पकड़ने के नियम:\n🚫 प्रतिबंध: अप्रैल 15 - जून 14\n📋 लाइसेंस: आवश्यक\n💰 जुर्माना: ₹5000-25000\n📞 हेल्पलाइन: 1800-xxx-xxxx"
            elif language == 'ta':
                return f"{state} மீன்பிடி விதிகள்:\n🚫 தடை: ஏப்ரல் 15 - ஜून் 14\n📋 உரிமம்: தேவை\n💰 அபராधம்: ₹5000-25000\n📞 உதவி எண்: 1800-xxx-xxxx"
            else:
                return f"{state} Fishing Rules:\n🚫 Ban: April 15 - June 14\n📋 License: Required\n💰 Fine: ₹5000-25000\n📞 Helpline: 1800-xxx-xxxx"
                
        except Exception as e:
            logger.error(f"Legal SMS error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def get_safety_sms(self, topic: str, user_session: Dict) -> str:
        """Get safety information for SMS"""
        try:
            language = user_session['language']
            topic_lower = topic.lower()
            
            if 'checklist' in topic_lower:
                if language == 'hi':
                    return "सुरक्षा चेकलिस्ट:\n✅ लाइफ जैकेट\n✅ रेडियो\n✅ मौसम चेक\n✅ फर्स्ट एड\n✅ इमरजेंसी फ्लेयर\n✅ GPS\n\nविस्तार: S equipment"
                elif language == 'ta':
                    return "பாதுகாப்பு பட்டியல்:\n✅ உயிர்காக்கும் ஜாக்கெட்\n✅ ரேடியோ\n✅ வானிலை சரிபார்ப்பு\n✅ முதலுதவி\n✅ அவசர ஃப்ளேர்\n✅ GPS\n\nविवरण: S equipment"
                else:
                    return "Safety Checklist:\n✅ Life jacket\n✅ Radio\n✅ Weather check\n✅ First aid\n✅ Emergency flare\n✅ GPS\n\nDetails: S equipment"
            
            elif 'emergency' in topic_lower:
                return self.quick_responses[language]['emergency']
            
            else:
                return self.quick_responses[language]['safety_help']
                
        except Exception as e:
            logger.error(f"Safety SMS error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def handle_text_query(self, message: str, user_session: Dict) -> str:
        """Handle free text queries"""
        try:
            language = user_session['language']
            message_lower = message.lower()
            
            # Basic keyword matching
            if any(word in message_lower for word in ['weather', 'mausam', 'vanilai']):
                return self.quick_responses[language]['weather_help']
            elif any(word in message_lower for word in ['law', 'legal', 'ban', 'kanoon', 'sattam']):
                return self.quick_responses[language]['legal_help']
            elif any(word in message_lower for word in ['safety', 'suraksha', 'padhukaapu']):
                return self.quick_responses[language]['safety_help']
            elif any(word in message_lower for word in ['emergency', 'help', 'madad', 'udavi']):
                return self.quick_responses[language]['emergency']
            elif any(word in message_lower for word in ['hello', 'hi', 'start', 'namaste']):
                return self.quick_responses[language]['welcome']
            else:
                return self.quick_responses[language]['help']
                
        except Exception as e:
            logger.error(f"Text query error: {str(e)}")
            return self.get_error_message(user_session['language'])
    
    def get_error_message(self, language: str) -> str:
        """Get error message for SMS"""
        if language == 'hi':
            return "कुछ गलत हुआ। H भेजें मदद के लिए।"
        elif language == 'ta':
            return "ஏதோ தவறு. உதவிக்கு H அனுப்பவும்."
        else:
            return "Something went wrong. Send H for help."
    
    def send_sms_response(self, message: str) -> Any:
        """Send SMS response"""
        try:
            response = MessagingResponse()
            
            # Split long messages into multiple SMS
            max_length = 160
            if len(message) > max_length:
                # Split message into chunks
                chunks = self.split_message(message, max_length)
                for i, chunk in enumerate(chunks):
                    if i < len(chunks) - 1:
                        chunk += f" ({i+1}/{len(chunks)})"
                    response.message(chunk)
            else:
                response.message(message)
            
            return str(response)
            
        except Exception as e:
            logger.error(f"SMS response error: {str(e)}")
            return str(MessagingResponse())
    
    def split_message(self, message: str, max_length: int) -> list:
        """Split long message into SMS-sized chunks"""
        chunks = []
        words = message.split()
        current_chunk = ""
        
        for word in words:
            if len(current_chunk) + len(word) + 1 <= max_length:
                current_chunk += word + " "
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = word + " "
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    def send_error_response(self) -> Any:
        """Send error response"""
        response = MessagingResponse()
        response.message("Error. Send H for help.")
        return str(response)
    
    def send_sms_message(self, to_number: str, message: str) -> bool:
        """Send SMS message programmatically"""
        try:
            if not self.client:
                logger.error("Twilio client not initialized")
                return False
            
            # Split long messages
            max_length = 160
            if len(message) > max_length:
                chunks = self.split_message(message, max_length)
                for i, chunk in enumerate(chunks):
                    if len(chunks) > 1:
                        chunk += f" ({i+1}/{len(chunks)})"
                    
                    message_obj = self.client.messages.create(
                        body=chunk,
                        from_=self.sms_number,
                        to=to_number
                    )
                    logger.info(f"SMS chunk {i+1} sent: {message_obj.sid}")
            else:
                message_obj = self.client.messages.create(
                    body=message,
                    from_=self.sms_number,
                    to=to_number
                )
                logger.info(f"SMS sent: {message_obj.sid}")
            
            return True
            
        except Exception as e:
            logger.error(f"SMS sending error: {str(e)}")
            return False
    
    def broadcast_sms(self, numbers: list, message: str) -> Dict:
        """Broadcast SMS to multiple numbers"""
        try:
            results = {
                'success': [],
                'failed': [],
                'total': len(numbers)
            }
            
            for number in numbers:
                if self.send_sms_message(number, message):
                    results['success'].append(number)
                else:
                    results['failed'].append(number)
            
            return results
            
        except Exception as e:
            logger.error(f"SMS broadcast error: {str(e)}")
            return {
                'success': [],
                'failed': numbers,
                'total': len(numbers),
                'error': str(e)
            }
    
    def send_weather_alert(self, numbers: list, weather_data: Dict) -> Dict:
        """Send weather alert SMS"""
        try:
            # Format weather alert message
            alert_message = self.format_weather_alert(weather_data)
            
            return self.broadcast_sms(numbers, alert_message)
            
        except Exception as e:
            logger.error(f"Weather alert SMS error: {str(e)}")
            return {
                'success': [],
                'failed': numbers,
                'total': len(numbers),
                'error': str(e)
            }
    
    def format_weather_alert(self, weather_data: Dict) -> str:
        """Format weather alert for SMS"""
        try:
            alert_level = weather_data.get('safety_level', 'unknown')
            wind_speed = weather_data.get('wind_speed', 0)
            description = weather_data.get('description', 'Weather update')
            
            if alert_level == 'dangerous':
                return f"🚨 WEATHER ALERT\n{description}\n💨 Wind: {wind_speed} km/h\n❌ DO NOT FISH\nCoast Guard: 1554"
            elif alert_level == 'caution':
                return f"⚠️ WEATHER CAUTION\n{description}\n💨 Wind: {wind_speed} km/h\n⚠️ STAY ALERT\nCoast Guard: 1554"
            else:
                return f"🌤️ WEATHER UPDATE\n{description}\n💨 Wind: {wind_speed} km/h\n✅ Safe conditions"
                
        except Exception as e:
            logger.error(f"Weather alert formatting error: {str(e)}")
            return "Weather alert service unavailable"
    
    def get_sms_stats(self) -> Dict:
        """Get SMS usage statistics"""
        try:
            stats = {
                'total_users': len(self.user_sessions),
                'active_users': 0,
                'languages': {},
                'total_messages': 0,
                'average_messages_per_user': 0
            }
            
            total_messages = 0
            
            for session in self.user_sessions.values():
                # Count active users (activity within last 24 hours)
                if (datetime.now() - session['last_activity']).total_seconds() < 86400:
                    stats['active_users'] += 1
                
                # Language distribution
                lang = session['language']
                stats['languages'][lang] = stats['languages'].get(lang, 0) + 1
                
                # Message count
                total_messages += session['message_count']
            
            stats['total_messages'] = total_messages
            if len(self.user_sessions) > 0:
                stats['average_messages_per_user'] = total_messages / len(self.user_sessions)
            
            return stats
            
        except Exception as e:
            logger.error(f"SMS stats error: {str(e)}")
            return {
                'error': str(e),
                'total_users': 0,
                'active_users': 0
            }
    
    def cleanup_old_sessions(self, max_age_hours: int = 168):  # 1 week
        """Clean up old SMS sessions"""
        try:
            current_time = datetime.now()
            sessions_to_remove = []
            
            for phone, session in self.user_sessions.items():
                age_hours = (current_time - session['last_activity']).total_seconds() / 3600
                if age_hours > max_age_hours:
                    sessions_to_remove.append(phone)
            
            for phone in sessions_to_remove:
                del self.user_sessions[phone]
                logger.info(f"Cleaned up old SMS session for {phone}")
                
        except Exception as e:
            logger.error(f"SMS session cleanup error: {str(e)}")
    
    def get_command_help(self, language: str = 'en') -> str:
        """Get command help for SMS"""
        if language == 'hi':
            return """SMS कमांड:
W - मौसम (W Chennai)
L - कानून (L Tamil Nadu)
S - सुरक्षा (S checklist)
E - आपातकाल
H - मदद
M - मेनू
EN/HI/TA - भाषा बदलें"""
        elif language == 'ta':
            return """SMS கட்டளைகள்:
W - வானிலை (W Chennai)
L - சட்டம் (L Tamil Nadu)
S - பாதுகாப்பு (S checklist)
E - அவசரம்
H - உதவி
M - மெனு
EN/HI/TA - மொழி மாற்று"""
        else:
            return """SMS Commands:
W - Weather (W Chennai)
L - Legal (L Tamil Nadu)
S - Safety (S checklist)
E - Emergency
H - Help
M - Menu
EN/HI/TA - Change language"""
    
    def validate_phone_number(self, phone: str) -> bool:
        """Validate phone number format"""
        try:
            # Simple validation - should be enhanced
            phone_clean = phone.replace('+', '').replace('-', '').replace(' ', '')
            return phone_clean.isdigit() and len(phone_clean) >= 10
        except:
            return False
