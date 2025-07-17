"""
Voice Handler Module for FisherMate.AI
Handles text-to-speech and speech-to-text functionality
"""

import os
import io
import json
import logging
from typing import Optional, Dict, Any
from gtts import gTTS
import speech_recognition as sr
from pydub import AudioSegment
import tempfile
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

class VoiceHandler:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.supported_languages = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'ml': 'ml-IN',
            'kn': 'kn-IN',
            'bn': 'bn-IN',
            'gu': 'gu-IN',
            'mr': 'mr-IN',
            'or': 'or-IN',
            'pa': 'pa-IN',
            'as': 'as-IN',
            'ur': 'ur-IN'
        }
        
        # Language mapping for gTTS
        self.gtts_languages = {
            'en': 'en',
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
            'as': 'as',
            'ur': 'ur',
            'ne': 'ne',
            'si': 'si'
        }
        
        # Audio storage directory
        self.audio_dir = os.path.join(os.path.dirname(__file__), '..', 'audio')
        os.makedirs(self.audio_dir, exist_ok=True)
        
        # Initialize VOSK for offline recognition (if available)
        self.vosk_models = {}
        self.init_vosk_models()
    
    def init_vosk_models(self):
        """Initialize VOSK models for offline speech recognition"""
        try:
            import vosk
            
            # Define model paths (would need to be downloaded)
            model_paths = {
                'en': 'models/vosk-model-en-us-0.22',
                'hi': 'models/vosk-model-hi-0.22',
                'ta': 'models/vosk-model-ta-0.22'
            }
            
            for lang, path in model_paths.items():
                if os.path.exists(path):
                    try:
                        self.vosk_models[lang] = vosk.Model(path)
                        logger.info(f"Loaded VOSK model for {lang}")
                    except Exception as e:
                        logger.warning(f"Failed to load VOSK model for {lang}: {str(e)}")
        
        except ImportError:
            logger.warning("VOSK not available. Using online speech recognition only.")
        except Exception as e:
            logger.error(f"VOSK initialization error: {str(e)}")
    
    def text_to_speech(self, text: str, language: str = 'en', slow: bool = False) -> str:
        """Convert text to speech and return audio file path"""
        try:
            # Map language code to gTTS supported language
            gtts_lang = self.gtts_languages.get(language, 'en')
            
            # Create TTS object
            tts = gTTS(text=text, lang=gtts_lang, slow=slow)
            
            # Generate unique filename
            filename = f"tts_{uuid.uuid4().hex}_{language}.mp3"
            filepath = os.path.join(self.audio_dir, filename)
            
            # Save audio file
            tts.save(filepath)
            
            logger.info(f"Generated TTS audio: {filepath}")
            
            # Return relative path for web serving
            return f"/audio/{filename}"
            
        except Exception as e:
            logger.error(f"TTS error: {str(e)}")
            return self.generate_fallback_audio(text, language)
    
    def speech_to_text(self, audio_data: Any, language: str = 'en') -> str:
        """Convert speech to text"""
        try:
            # Try offline recognition first (VOSK)
            if language in self.vosk_models:
                text = self.vosk_speech_to_text(audio_data, language)
                if text:
                    return text
            
            # Fall back to online recognition
            return self.online_speech_to_text(audio_data, language)
            
        except Exception as e:
            logger.error(f"STT error: {str(e)}")
            return ""
    
    def vosk_speech_to_text(self, audio_data: Any, language: str) -> str:
        """Offline speech recognition using VOSK"""
        try:
            import vosk
            
            if language not in self.vosk_models:
                return ""
            
            model = self.vosk_models[language]
            rec = vosk.KaldiRecognizer(model, 16000)
            
            # Process audio data
            if hasattr(audio_data, 'read'):
                # File-like object
                audio_bytes = audio_data.read()
            else:
                # Bytes data
                audio_bytes = audio_data
            
            # Convert to required format (16kHz, mono, 16-bit)
            audio_segment = AudioSegment.from_file(io.BytesIO(audio_bytes))
            audio_segment = audio_segment.set_frame_rate(16000).set_channels(1)
            
            # Convert to raw audio data
            raw_audio = audio_segment.raw_data
            
            # Recognize speech
            if rec.AcceptWaveform(raw_audio):
                result = json.loads(rec.Result())
                return result.get('text', '')
            else:
                partial_result = json.loads(rec.PartialResult())
                return partial_result.get('partial', '')
                
        except Exception as e:
            logger.error(f"VOSK STT error: {str(e)}")
            return ""
    
    def online_speech_to_text(self, audio_data: Any, language: str) -> str:
        """Online speech recognition using Google Speech Recognition"""
        try:
            # Map language to speech recognition format
            sr_language = self.supported_languages.get(language, 'en-US')
            
            # Process audio data
            if hasattr(audio_data, 'read'):
                # File-like object
                audio_bytes = audio_data.read()
            else:
                # Bytes data
                audio_bytes = audio_data
            
            # Create AudioSegment from bytes
            audio_segment = AudioSegment.from_file(io.BytesIO(audio_bytes))
            
            # Convert to WAV format
            wav_io = io.BytesIO()
            audio_segment.export(wav_io, format='wav')
            wav_io.seek(0)
            
            # Use speech recognition
            with sr.AudioFile(wav_io) as source:
                audio = self.recognizer.record(source)
            
            # Recognize speech
            text = self.recognizer.recognize_google(audio, language=sr_language)
            
            logger.info(f"Recognized text: {text}")
            return text
            
        except sr.UnknownValueError:
            logger.warning("Could not understand audio")
            return ""
        except sr.RequestError as e:
            logger.error(f"Google Speech Recognition error: {str(e)}")
            return ""
        except Exception as e:
            logger.error(f"Online STT error: {str(e)}")
            return ""
    
    def generate_fallback_audio(self, text: str, language: str) -> str:
        """Generate fallback audio when TTS fails"""
        try:
            # Try with English if original language failed
            if language != 'en':
                tts = gTTS(text=text, lang='en')
                filename = f"fallback_{uuid.uuid4().hex}.mp3"
                filepath = os.path.join(self.audio_dir, filename)
                tts.save(filepath)
                return f"/audio/{filename}"
            else:
                # Return empty string if fallback also fails
                return ""
                
        except Exception as e:
            logger.error(f"Fallback audio generation error: {str(e)}")
            return ""
    
    def process_audio_file(self, audio_file, language: str = 'en') -> str:
        """Process uploaded audio file for speech recognition"""
        try:
            # Save uploaded file temporarily
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.audio')
            audio_file.save(temp_file.name)
            
            # Read file and process
            with open(temp_file.name, 'rb') as f:
                text = self.speech_to_text(f, language)
            
            # Clean up temporary file
            os.unlink(temp_file.name)
            
            return text
            
        except Exception as e:
            logger.error(f"Audio file processing error: {str(e)}")
            return ""
    
    def get_supported_languages(self) -> Dict[str, str]:
        """Get list of supported languages"""
        return {
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
            'ur': 'Urdu'
        }
    
    def is_language_supported(self, language: str) -> bool:
        """Check if language is supported for voice operations"""
        return language in self.supported_languages
    
    def generate_audio_response(self, text: str, language: str, voice_settings: Optional[Dict] = None) -> Dict:
        """Generate audio response with metadata"""
        try:
            # Apply voice settings
            slow = False
            if voice_settings:
                slow = voice_settings.get('slow', False)
            
            # Generate audio
            audio_url = self.text_to_speech(text, language, slow)
            
            # Return response with metadata
            return {
                'audio_url': audio_url,
                'text': text,
                'language': language,
                'duration_estimate': len(text.split()) * 0.6,  # Rough estimate
                'generated_at': datetime.now().isoformat(),
                'success': bool(audio_url)
            }
            
        except Exception as e:
            logger.error(f"Audio response generation error: {str(e)}")
            return {
                'audio_url': '',
                'text': text,
                'language': language,
                'error': str(e),
                'success': False
            }
    
    def batch_text_to_speech(self, texts: list, language: str = 'en') -> list:
        """Convert multiple texts to speech"""
        results = []
        
        for text in texts:
            result = self.generate_audio_response(text, language)
            results.append(result)
        
        return results
    
    def convert_audio_format(self, input_path: str, output_format: str = 'mp3') -> str:
        """Convert audio file to different format"""
        try:
            audio = AudioSegment.from_file(input_path)
            
            # Generate output filename
            base_name = os.path.splitext(os.path.basename(input_path))[0]
            output_filename = f"{base_name}.{output_format}"
            output_path = os.path.join(self.audio_dir, output_filename)
            
            # Export in new format
            audio.export(output_path, format=output_format)
            
            logger.info(f"Converted audio to {output_format}: {output_path}")
            return output_path
            
        except Exception as e:
            logger.error(f"Audio format conversion error: {str(e)}")
            return ""
    
    def get_audio_duration(self, audio_path: str) -> float:
        """Get duration of audio file in seconds"""
        try:
            audio = AudioSegment.from_file(audio_path)
            return len(audio) / 1000.0  # Convert milliseconds to seconds
        except Exception as e:
            logger.error(f"Audio duration error: {str(e)}")
            return 0.0
    
    def cleanup_old_audio_files(self, max_age_hours: int = 24):
        """Clean up old audio files"""
        try:
            current_time = datetime.now()
            
            for filename in os.listdir(self.audio_dir):
                filepath = os.path.join(self.audio_dir, filename)
                
                # Check file age
                file_time = datetime.fromtimestamp(os.path.getctime(filepath))
                age_hours = (current_time - file_time).total_seconds() / 3600
                
                if age_hours > max_age_hours:
                    os.remove(filepath)
                    logger.info(f"Removed old audio file: {filename}")
                    
        except Exception as e:
            logger.error(f"Audio cleanup error: {str(e)}")
    
    def get_voice_settings_for_language(self, language: str) -> Dict:
        """Get recommended voice settings for specific language"""
        settings = {
            'slow': False,
            'pitch': 'normal',
            'speed': 'normal'
        }
        
        # Adjust settings for specific languages
        if language in ['hi', 'ta', 'te', 'ml', 'kn', 'bn', 'gu', 'mr', 'or', 'pa', 'ur']:
            # Slightly slower for Indian languages for better clarity
            settings['slow'] = True
        
        return settings
    
    def create_audio_playlist(self, texts: list, language: str) -> Dict:
        """Create audio playlist from multiple texts"""
        try:
            playlist = {
                'id': str(uuid.uuid4()),
                'language': language,
                'created_at': datetime.now().isoformat(),
                'tracks': []
            }
            
            for i, text in enumerate(texts):
                audio_response = self.generate_audio_response(text, language)
                
                track = {
                    'index': i,
                    'text': text,
                    'audio_url': audio_response['audio_url'],
                    'duration': audio_response.get('duration_estimate', 0),
                    'success': audio_response['success']
                }
                
                playlist['tracks'].append(track)
            
            # Calculate total duration
            playlist['total_duration'] = sum(track['duration'] for track in playlist['tracks'])
            
            return playlist
            
        except Exception as e:
            logger.error(f"Audio playlist creation error: {str(e)}")
            return {
                'id': '',
                'error': str(e),
                'tracks': []
            }
    
    def get_audio_stats(self) -> Dict:
        """Get audio generation statistics"""
        try:
            stats = {
                'total_files': 0,
                'total_size_mb': 0,
                'languages_used': set(),
                'oldest_file': None,
                'newest_file': None
            }
            
            if not os.path.exists(self.audio_dir):
                return stats
            
            for filename in os.listdir(self.audio_dir):
                filepath = os.path.join(self.audio_dir, filename)
                
                if os.path.isfile(filepath):
                    stats['total_files'] += 1
                    stats['total_size_mb'] += os.path.getsize(filepath) / (1024 * 1024)
                    
                    # Extract language from filename
                    if '_' in filename:
                        parts = filename.split('_')
                        if len(parts) >= 3:
                            lang = parts[2].split('.')[0]
                            stats['languages_used'].add(lang)
                    
                    # Track file timestamps
                    file_time = datetime.fromtimestamp(os.path.getctime(filepath))
                    if stats['oldest_file'] is None or file_time < stats['oldest_file']:
                        stats['oldest_file'] = file_time
                    if stats['newest_file'] is None or file_time > stats['newest_file']:
                        stats['newest_file'] = file_time
            
            stats['languages_used'] = list(stats['languages_used'])
            
            return stats
            
        except Exception as e:
            logger.error(f"Audio stats error: {str(e)}")
            return {
                'error': str(e),
                'total_files': 0,
                'total_size_mb': 0
            }
