"""
Language Processing Module for FisherMate.AI
Handles language detection, translation, and multilingual support
"""

import google.generativeai as genai
from googletrans import Translator
from langdetect import detect
import json
import os
import logging

logger = logging.getLogger(__name__)

class LanguageProcessor:
    def __init__(self):
        self.translator = Translator()
        self.supported_languages = {
            'en': 'English',
            'hi': 'Hindi',
            'ta': 'Tamil',
            'te': 'Telugu',
            'ml': 'Malayalam',
            'kn': 'Kannada',
            'bn': 'Bengali',
            'gu': 'Gujarati',
            'mr': 'Marathi',
            'or': 'Oriya',
            'pa': 'Punjabi',
            'as': 'Assamese',
            'ur': 'Urdu',
            'ne': 'Nepali',
            'si': 'Sinhala',
            'my': 'Myanmar',
            'th': 'Thai',
            'vi': 'Vietnamese',
            'id': 'Indonesian',
            'ms': 'Malay',
            'tl': 'Filipino',
            'ko': 'Korean',
            'ja': 'Japanese',
            'zh': 'Chinese',
            'es': 'Spanish'
        }
        
        # Load common phrases in different languages
        self.load_common_phrases()
    
    def load_common_phrases(self):
        """Load common phrases and responses in different languages"""
        self.common_phrases = {
            'greeting': {
                'en': 'Hello! I am FisherMate, your fishing assistant.',
                'hi': 'नमस्ते! मैं फिशरमेट हूं, आपका मछली पकड़ने का सहायक।',
                'ta': 'வணக்கம்! நான் ஃபிஷர்மேட், உங்கள் மீன்பிடித் துணை.',
                'te': 'నమస్తే! నేను ఫిషర్మేట్, మీ చేపల వేట సహాయకుడు.',
                'ml': 'നമസ്തേ! ഞാൻ ഫിഷർമേറ്റ്, നിങ്ങളുടെ മത്സ്യബന്ധന സഹായി.',
                'kn': 'ನಮಸ್ತೆ! ನಾನು ಫಿಶರ್ಮೇಟ್, ನಿಮ್ಮ ಮೀನುಗಾರಿಕೆ ಸಹಾಯಕ.',
                'bn': 'নমস্কার! আমি ফিশারমেট, আপনার মাছ ধরার সহায়ক।',
                'gu': 'નમસ્તે! હું ફિશરમેટ છું, તમારો માછલી પકડવાનો સહાયક.',
                'mr': 'नमस्कार! मी फिशरमेट आहे, तुमचा मासेमारी सहाय्यक.',
                'or': 'ନମସ୍କାର! ମୁଁ ଫିସରମେଟ, ତୁମର ମାଛ ଧରିବା ସହାୟକ।',
                'pa': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਫਿਸ਼ਰਮੇਟ ਹਾਂ, ਤੁਹਾਡਾ ਮੱਛੀ ਫੜਨ ਦਾ ਸਹਾਇਕ।',
                'ur': 'السلام علیکم! میں فشرمیٹ ہوں، آپ کا ماہی گیری کا مددگار۔'
            },
            'weather_alert': {
                'en': 'Weather Alert: Strong winds expected. Please stay safe.',
                'hi': 'मौसम चेतावनी: तेज हवाओं की संभावना। कृपया सुरक्षित रहें।',
                'ta': 'வானிலை எச்சரிக்கை: பலமான காற்று எதிர்பார்க்கப்படுகிறது. பாதுகாப்பாக இருங்கள்.',
                'te': 'వాతావరణ హెచ్చరిక: బలమైన గాలులు అనుకున్నాయి. దయచేసి సురక్షితంగా ఉండండి.',
                'ml': 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്: ശക്തമായ കാറ്റ് പ്രതീക്ഷിക്കുന്നു. ദയവായി സുരക്ഷിതരായിരിക്കുക.',
                'kn': 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ: ಬಲವಾದ ಗಾಳಿ ನಿರೀಕ್ಷೆ. ದಯವಿಟ್ಟು ಸುರಕ್ಷಿತವಾಗಿರಿ.',
                'bn': 'আবহাওয়া সতর্কতা: প্রবল বাতাস প্রত্যাশিত। অনুগ্রহ করে নিরাপদ থাকুন।',
                'gu': 'હવામાન ચેતવણી: તીવ્ર પવનની અપેક્ષા. કૃપા કરીને સુરક્ષિત રહો.',
                'mr': 'हवामान सावधानता: जोरदार वारे अपेक्षित. कृपया सुरक्षित रहा.',
                'or': 'ପାଣିପାଗ ଚେତାବନୀ: ଶକ୍ତିଶାଳୀ ପବନ ଆଶା କରାଯାଇଛି। ଦୟାକରି ସୁରକ୍ଷିତ ରୁହନ୍ତୁ।',
                'pa': 'ਮੌਸਮ ਚੇਤਾਵਨੀ: ਤੇਜ਼ ਹਵਾਵਾਂ ਦੀ ਸੰਭਾਵਨਾ। ਕਿਰਪਾ ਕਰਕੇ ਸੁਰੱਖਿਅਤ ਰਹੋ।',
                'ur': 'موسمی انتباہ: تیز ہوائیں متوقع ہیں۔ براہ کرم محفوظ رہیں۔'
            },
            'safety_reminder': {
                'en': 'Safety Reminder: Always wear life jackets while fishing.',
                'hi': 'सुरक्षा अनुस्मारक: मछली पकड़ते समय हमेशा लाइफ जैकेट पहनें।',
                'ta': 'பாதுகாப்பு நினைவூட்டல்: மீன்பிடிக்கும் போது எப்போதும் உயிர்காக்கும் ஜாக்கெட் அணியுங்கள்.',
                'te': 'భద్రతా గుర్తింపు: చేపలు పట్టేటప్పుడు ఎల్లప్పుడూ లైఫ్ జాకెట్‌లు ధరించండి.',
                'ml': 'സുരക്ഷാ ഓർമ്മപ്പെടുത്തൽ: മത്സ്യബന്ധനത്തിന് പോകുമ്പോൾ എപ്പോഴും ലൈഫ് ജാക്കറ്റ് ധരിക്കുക.',
                'kn': 'ಸುರಕ್ಷತಾ ಜ್ಞಾಪನೆ: ಮೀನುಗಾರಿಕೆ ಮಾಡುವಾಗ ಯಾವಾಗಲೂ ಲೈಫ್ ಜಾಕೆಟ್ ಧರಿಸಿ.',
                'bn': 'নিরাপত্তা স্মরণীয়: মাছ ধরার সময় সর্বদা লাইফ জ্যাকেট পরুন।',
                'gu': 'સુરક્ષા યાદ: માછલી પકડતી વખતે હંમેશા લાઈફ જેકેટ પહેરો.',
                'mr': 'सुरक्षा आठवण: मासेमारी करताना नेहमी लाइफ जॅकेट घाला.',
                'or': 'ସୁରକ୍ଷା ସ୍ମାରକ: ମାଛ ଧରିବା ସମୟରେ ସର୍ବଦା ଲାଇଫ୍ ଜ୍ୟାକେଟ୍ ପିନ୍ଧନ୍ତୁ।',
                'pa': 'ਸੁਰੱਖਿਆ ਯਾਦ: ਮੱਛੀ ਫੜਦੇ ਸਮੇਂ ਹਮੇਸ਼ਾ ਲਾਇਫ ਜੈਕਟ ਪਹਿਨੋ।',
                'ur': 'حفاظتی یاد دہانی: مچھلی پکڑتے وقت ہمیشہ لائف جیکٹ پہنیں۔'
            }
        }
    
    def detect_language(self, text):
        """Detect the language of the input text"""
        try:
            detected_lang = detect(text)
            if detected_lang in self.supported_languages:
                return detected_lang
            else:
                # Try to map common language codes
                mapping = {
                    'hi': 'hi',
                    'ta': 'ta',
                    'te': 'te',
                    'ml': 'ml',
                    'kn': 'kn',
                    'bn': 'bn',
                    'gu': 'gu',
                    'mr': 'mr',
                    'or': 'or',
                    'pa': 'pa',
                    'ur': 'ur'
                }
                return mapping.get(detected_lang, 'en')
        except Exception as e:
            logger.error(f"Language detection error: {str(e)}")
            return 'en'  # Default to English
    
    def translate_text(self, text, source_lang, target_lang):
        """Translate text from source language to target language"""
        try:
            if source_lang == target_lang:
                return text
            
            # Use Google Translate for translation
            result = self.translator.translate(text, src=source_lang, dest=target_lang)
            return result.text
            
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            # Fallback to original text if translation fails
            return text
    
    def get_common_phrase(self, phrase_type, language):
        """Get a common phrase in the specified language"""
        try:
            phrases = self.common_phrases.get(phrase_type, {})
            return phrases.get(language, phrases.get('en', ''))
        except Exception as e:
            logger.error(f"Common phrase error: {str(e)}")
            return ''
    
    def translate_weather_data(self, weather_data, target_language):
        """Translate weather-related data to target language"""
        try:
            # Translate weather description
            if 'description' in weather_data:
                weather_data['description'] = self.translate_text(
                    weather_data['description'], 'en', target_language
                )
            
            # Translate weather conditions
            if 'conditions' in weather_data:
                for condition in weather_data['conditions']:
                    if 'description' in condition:
                        condition['description'] = self.translate_text(
                            condition['description'], 'en', target_language
                        )
            
            # Translate alerts
            if 'alerts' in weather_data:
                for alert in weather_data['alerts']:
                    if 'description' in alert:
                        alert['description'] = self.translate_text(
                            alert['description'], 'en', target_language
                        )
            
            return weather_data
            
        except Exception as e:
            logger.error(f"Weather translation error: {str(e)}")
            return weather_data
    
    def get_language_name(self, language_code):
        """Get the full name of a language from its code"""
        return self.supported_languages.get(language_code, 'Unknown')
    
    def is_supported_language(self, language_code):
        """Check if a language is supported"""
        return language_code in self.supported_languages
    
    def get_regional_number_format(self, number, language):
        """Format numbers according to regional preferences"""
        try:
            # Indian number system for Indian languages
            if language in ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'gu', 'mr', 'or', 'pa']:
                # Convert to Indian number format (lakhs, crores)
                if number >= 10000000:  # 1 crore
                    return f"{number/10000000:.1f} करोड़" if language == 'hi' else f"{number/10000000:.1f} crore"
                elif number >= 100000:  # 1 lakh
                    return f"{number/100000:.1f} लाख" if language == 'hi' else f"{number/100000:.1f} lakh"
                else:
                    return f"{number:,}"
            else:
                return f"{number:,}"
        except Exception as e:
            logger.error(f"Number formatting error: {str(e)}")
            return str(number)
    
    def get_time_format(self, datetime_obj, language):
        """Format time according to regional preferences"""
        try:
            if language in ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'gu', 'mr', 'or', 'pa']:
                # 12-hour format is preferred in India
                return datetime_obj.strftime('%I:%M %p')
            else:
                # 24-hour format for other languages
                return datetime_obj.strftime('%H:%M')
        except Exception as e:
            logger.error(f"Time formatting error: {str(e)}")
            return str(datetime_obj)
    
    def process_fishing_terms(self, text, language):
        """Process and translate fishing-specific terminology"""
        fishing_terms = {
            'en': {
                'trawling': 'trawling',
                'net': 'net',
                'boat': 'boat',
                'catch': 'catch',
                'fish': 'fish',
                'sea': 'sea',
                'harbor': 'harbor',
                'tide': 'tide',
                'wave': 'wave',
                'storm': 'storm'
            },
            'hi': {
                'trawling': 'ट्रॉलिंग',
                'net': 'जाल',
                'boat': 'नाव',
                'catch': 'पकड़',
                'fish': 'मछली',
                'sea': 'समुद्र',
                'harbor': 'बंदरगाह',
                'tide': 'ज्वार',
                'wave': 'लहर',
                'storm': 'तूफान'
            },
            'ta': {
                'trawling': 'இழுவலை',
                'net': 'வலை',
                'boat': 'படகு',
                'catch': 'பிடிப்பு',
                'fish': 'மீன்',
                'sea': 'கடல்',
                'harbor': 'துறைமுகம்',
                'tide': 'அலை',
                'wave': 'அலை',
                'storm': 'புயல்'
            }
        }
        
        try:
            terms = fishing_terms.get(language, fishing_terms['en'])
            # Replace fishing terms in the text
            processed_text = text
            for en_term, local_term in terms.items():
                processed_text = processed_text.replace(en_term, local_term)
            
            return processed_text
        except Exception as e:
            logger.error(f"Fishing terms processing error: {str(e)}")
            return text
