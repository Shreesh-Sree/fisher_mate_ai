"""
Weather Service Module for FisherMate.AI
Handles weather data from OpenWeatherMap and IMD APIs
"""

import requests
import json
import os
from datetime import datetime, timedelta
import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        self.openweather_api_key = os.getenv('OPENWEATHER_API_KEY')
        self.openweather_base_url = 'https://api.openweathermap.org/data/2.5'
        self.openweather_onecall_url = 'https://api.openweathermap.org/data/3.0/onecall'
        self.imd_base_url = 'https://mausam.imd.gov.in/imd_latest'
        
        # Weather thresholds for fishing safety
        self.safety_thresholds = {
            'wind_speed': 25,  # km/h
            'wave_height': 2.5,  # meters
            'visibility': 5,  # km
            'temperature_min': 10,  # celsius
            'temperature_max': 45,  # celsius
            'rainfall': 50  # mm
        }
        
        # Coastal warning keywords
        self.warning_keywords = [
            'cyclone', 'storm', 'heavy rain', 'high tide', 'tsunami',
            'depression', 'low pressure', 'rough sea', 'very rough sea'
        ]
    
    def get_current_weather(self, lat: float, lon: float) -> Dict:
        """Get current weather conditions for given coordinates"""
        try:
            # Get current weather
            current_url = f"{self.openweather_base_url}/weather"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.openweather_api_key,
                'units': 'metric'
            }
            
            response = requests.get(current_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Process weather data
            weather_info = {
                'location': {
                    'name': data.get('name', 'Unknown'),
                    'country': data.get('sys', {}).get('country', 'IN'),
                    'coordinates': {'lat': lat, 'lon': lon}
                },
                'current': {
                    'temperature': data['main']['temp'],
                    'feels_like': data['main']['feels_like'],
                    'humidity': data['main']['humidity'],
                    'pressure': data['main']['pressure'],
                    'description': data['weather'][0]['description'],
                    'icon': data['weather'][0]['icon'],
                    'wind_speed': data.get('wind', {}).get('speed', 0) * 3.6,  # Convert m/s to km/h
                    'wind_direction': data.get('wind', {}).get('deg', 0),
                    'visibility': data.get('visibility', 10000) / 1000,  # Convert to km
                    'sunrise': datetime.fromtimestamp(data['sys']['sunrise']),
                    'sunset': datetime.fromtimestamp(data['sys']['sunset'])
                },
                'safety_assessment': self.assess_fishing_safety(data),
                'timestamp': datetime.now()
            }
            
            return weather_info
            
        except requests.RequestException as e:
            logger.error(f"OpenWeatherMap API error: {str(e)}")
            return self.get_fallback_weather()
        except Exception as e:
            logger.error(f"Weather processing error: {str(e)}")
            return self.get_fallback_weather()
    
    def get_forecast(self, lat: float, lon: float, days: int = 7) -> Dict:
        """Get weather forecast for given coordinates"""
        try:
            # Get forecast data
            forecast_url = f"{self.openweather_base_url}/forecast"
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.openweather_api_key,
                'units': 'metric',
                'cnt': days * 8  # 8 forecasts per day (3-hour intervals)
            }
            
            response = requests.get(forecast_url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Process forecast data
            forecast_info = {
                'location': {
                    'name': data['city']['name'],
                    'country': data['city']['country'],
                    'coordinates': {'lat': lat, 'lon': lon}
                },
                'forecast': [],
                'daily_summary': []
            }
            
            # Group forecasts by day
            daily_forecasts = {}
            for item in data['list']:
                date = datetime.fromtimestamp(item['dt']).date()
                if date not in daily_forecasts:
                    daily_forecasts[date] = []
                daily_forecasts[date].append(item)
            
            # Create daily summaries
            for date, forecasts in daily_forecasts.items():
                daily_summary = self.create_daily_summary(forecasts, date)
                forecast_info['daily_summary'].append(daily_summary)
            
            # Add detailed forecast
            for item in data['list']:
                forecast_item = {
                    'datetime': datetime.fromtimestamp(item['dt']),
                    'temperature': item['main']['temp'],
                    'humidity': item['main']['humidity'],
                    'pressure': item['main']['pressure'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'wind_speed': item.get('wind', {}).get('speed', 0) * 3.6,
                    'wind_direction': item.get('wind', {}).get('deg', 0),
                    'precipitation': item.get('rain', {}).get('3h', 0),
                    'safety_level': self.assess_forecast_safety(item)
                }
                forecast_info['forecast'].append(forecast_item)
            
            return forecast_info
            
        except requests.RequestException as e:
            logger.error(f"Forecast API error: {str(e)}")
            return self.get_fallback_forecast()
        except Exception as e:
            logger.error(f"Forecast processing error: {str(e)}")
            return self.get_fallback_forecast()
    
    def get_marine_conditions(self, lat: float, lon: float) -> Dict:
        """Get marine-specific weather conditions"""
        try:
            # This would typically call a marine weather API
            # For now, we'll enhance regular weather data with marine calculations
            weather = self.get_current_weather(lat, lon)
            
            # Calculate marine conditions
            marine_conditions = {
                'sea_state': self.calculate_sea_state(weather['current']['wind_speed']),
                'wave_height': self.estimate_wave_height(weather['current']['wind_speed']),
                'tidal_info': self.get_tidal_information(lat, lon),
                'fishing_zones': self.get_fishing_zone_status(lat, lon),
                'marine_warnings': self.get_marine_warnings(lat, lon)
            }
            
            weather['marine'] = marine_conditions
            return weather
            
        except Exception as e:
            logger.error(f"Marine conditions error: {str(e)}")
            return self.get_fallback_weather()
    
    def get_weather_response(self, message: str, language: str, location: Dict) -> Dict:
        """Generate weather response for chatbot"""
        try:
            lat = location.get('lat', 13.0827)  # Default to Chennai
            lon = location.get('lon', 80.2707)
            
            # Determine what type of weather info is requested
            if 'forecast' in message.lower() or 'tomorrow' in message.lower():
                weather_data = self.get_forecast(lat, lon, 3)
                response_text = self.format_forecast_response(weather_data, language)
            elif 'marine' in message.lower() or 'sea' in message.lower():
                weather_data = self.get_marine_conditions(lat, lon)
                response_text = self.format_marine_response(weather_data, language)
            else:
                weather_data = self.get_current_weather(lat, lon)
                response_text = self.format_current_weather_response(weather_data, language)
            
            return {
                'text': response_text,
                'type': 'weather',
                'data': weather_data,
                'language': language,
                'safety_level': weather_data.get('safety_assessment', {}).get('level', 'unknown')
            }
            
        except Exception as e:
            logger.error(f"Weather response error: {str(e)}")
            return {
                'text': 'Weather information temporarily unavailable. Please try again later.',
                'type': 'error',
                'language': language
            }
    
    def assess_fishing_safety(self, weather_data: Dict) -> Dict:
        """Assess fishing safety based on weather conditions"""
        try:
            wind_speed = weather_data.get('wind', {}).get('speed', 0) * 3.6  # Convert to km/h
            visibility = weather_data.get('visibility', 10000) / 1000  # Convert to km
            
            # Determine safety level
            safety_issues = []
            
            if wind_speed > self.safety_thresholds['wind_speed']:
                safety_issues.append('high_wind')
            
            if visibility < self.safety_thresholds['visibility']:
                safety_issues.append('low_visibility')
            
            if weather_data.get('rain', {}).get('1h', 0) > 10:
                safety_issues.append('heavy_rain')
            
            # Check weather description for dangerous conditions
            description = weather_data['weather'][0]['description'].lower()
            for keyword in self.warning_keywords:
                if keyword in description:
                    safety_issues.append('weather_warning')
                    break
            
            # Determine overall safety level
            if len(safety_issues) == 0:
                safety_level = 'safe'
            elif len(safety_issues) <= 2:
                safety_level = 'caution'
            else:
                safety_level = 'dangerous'
            
            return {
                'level': safety_level,
                'issues': safety_issues,
                'recommendations': self.get_safety_recommendations(safety_level, safety_issues)
            }
            
        except Exception as e:
            logger.error(f"Safety assessment error: {str(e)}")
            return {
                'level': 'unknown',
                'issues': [],
                'recommendations': ['Please check weather conditions before fishing']
            }
    
    def get_safety_recommendations(self, safety_level: str, issues: List[str]) -> List[str]:
        """Get safety recommendations based on conditions"""
        recommendations = []
        
        if safety_level == 'safe':
            recommendations.append('Conditions are favorable for fishing')
            recommendations.append('Always wear life jackets')
            recommendations.append('Keep emergency communication devices')
        
        elif safety_level == 'caution':
            recommendations.append('Exercise caution while fishing')
            recommendations.append('Stay close to shore')
            recommendations.append('Monitor weather conditions closely')
            
            if 'high_wind' in issues:
                recommendations.append('Secure all equipment due to strong winds')
            if 'low_visibility' in issues:
                recommendations.append('Use navigation lights and sound signals')
            if 'heavy_rain' in issues:
                recommendations.append('Ensure proper drainage in boat')
        
        elif safety_level == 'dangerous':
            recommendations.append('Avoid fishing in current conditions')
            recommendations.append('Return to shore immediately if already at sea')
            recommendations.append('Wait for weather to improve')
            recommendations.append('Monitor official weather warnings')
        
        return recommendations
    
    def calculate_sea_state(self, wind_speed: float) -> Dict:
        """Calculate sea state based on wind speed (Beaufort scale)"""
        if wind_speed < 1:
            return {'code': 0, 'description': 'Calm (glassy)', 'wave_height': '0m'}
        elif wind_speed < 5:
            return {'code': 1, 'description': 'Light air (ripples)', 'wave_height': '0-0.1m'}
        elif wind_speed < 11:
            return {'code': 2, 'description': 'Light breeze (small wavelets)', 'wave_height': '0.1-0.5m'}
        elif wind_speed < 19:
            return {'code': 3, 'description': 'Gentle breeze (large wavelets)', 'wave_height': '0.5-1.25m'}
        elif wind_speed < 28:
            return {'code': 4, 'description': 'Moderate breeze (small waves)', 'wave_height': '1.25-2.5m'}
        elif wind_speed < 38:
            return {'code': 5, 'description': 'Fresh breeze (moderate waves)', 'wave_height': '2.5-4m'}
        elif wind_speed < 49:
            return {'code': 6, 'description': 'Strong breeze (large waves)', 'wave_height': '4-6m'}
        elif wind_speed < 61:
            return {'code': 7, 'description': 'Near gale (very large waves)', 'wave_height': '6-9m'}
        elif wind_speed < 74:
            return {'code': 8, 'description': 'Gale (huge waves)', 'wave_height': '9-14m'}
        else:
            return {'code': 9, 'description': 'Storm (very high waves)', 'wave_height': '14m+'}
    
    def estimate_wave_height(self, wind_speed: float) -> float:
        """Estimate wave height based on wind speed"""
        # Simplified wave height estimation
        if wind_speed < 10:
            return 0.5
        elif wind_speed < 20:
            return 1.0
        elif wind_speed < 30:
            return 2.0
        elif wind_speed < 40:
            return 3.5
        else:
            return 5.0
    
    def get_tidal_information(self, lat: float, lon: float) -> Dict:
        """Get tidal information (placeholder - would need tide API)"""
        return {
            'next_high_tide': datetime.now() + timedelta(hours=6),
            'next_low_tide': datetime.now() + timedelta(hours=12),
            'tide_level': 'medium'
        }
    
    def get_fishing_zone_status(self, lat: float, lon: float) -> Dict:
        """Get fishing zone status (placeholder - would need maritime API)"""
        return {
            'zone_type': 'permitted',
            'restrictions': [],
            'seasonal_ban': False
        }
    
    def get_marine_warnings(self, lat: float, lon: float) -> List[Dict]:
        """Get marine warnings from IMD or coast guard"""
        try:
            # This would typically fetch from IMD API or coast guard warnings
            # For now, return placeholder
            return [
                {
                    'type': 'info',
                    'message': 'No active marine warnings',
                    'issued_at': datetime.now()
                }
            ]
        except Exception as e:
            logger.error(f"Marine warnings error: {str(e)}")
            return []
    
    def format_current_weather_response(self, weather_data: Dict, language: str) -> str:
        """Format current weather response for chatbot"""
        try:
            current = weather_data['current']
            safety = weather_data['safety_assessment']
            
            # Base response
            response = f"Current weather in {weather_data['location']['name']}:\n"
            response += f"🌡️ Temperature: {current['temperature']:.1f}°C (feels like {current['feels_like']:.1f}°C)\n"
            response += f"💨 Wind: {current['wind_speed']:.1f} km/h\n"
            response += f"💧 Humidity: {current['humidity']}%\n"
            response += f"🌊 Conditions: {current['description']}\n"
            response += f"👁️ Visibility: {current['visibility']:.1f} km\n\n"
            
            # Safety assessment
            if safety['level'] == 'safe':
                response += "✅ Fishing conditions: SAFE\n"
            elif safety['level'] == 'caution':
                response += "⚠️ Fishing conditions: CAUTION\n"
            else:
                response += "❌ Fishing conditions: DANGEROUS\n"
            
            # Add recommendations
            response += "\n📋 Recommendations:\n"
            for rec in safety['recommendations'][:3]:  # Limit to 3 recommendations
                response += f"• {rec}\n"
            
            return response
            
        except Exception as e:
            logger.error(f"Response formatting error: {str(e)}")
            return "Weather information is currently unavailable."
    
    def format_marine_response(self, weather_data: Dict, language: str) -> str:
        """Format marine conditions response"""
        try:
            marine = weather_data.get('marine', {})
            sea_state = marine.get('sea_state', {})
            
            response = f"Marine conditions:\n"
            response += f"🌊 Sea State: {sea_state.get('description', 'Unknown')}\n"
            response += f"📏 Wave Height: {sea_state.get('wave_height', 'Unknown')}\n"
            response += f"🌀 Estimated Wave Height: {marine.get('wave_height', 'Unknown'):.1f}m\n"
            
            return response
            
        except Exception as e:
            logger.error(f"Marine response formatting error: {str(e)}")
            return "Marine conditions information is currently unavailable."
    
    def format_forecast_response(self, forecast_data: Dict, language: str) -> str:
        """Format forecast response"""
        try:
            response = f"Weather forecast for {forecast_data['location']['name']}:\n\n"
            
            for day in forecast_data['daily_summary'][:3]:  # Show 3 days
                response += f"📅 {day['date'].strftime('%A, %B %d')}:\n"
                response += f"🌡️ {day['temp_min']:.1f}°C - {day['temp_max']:.1f}°C\n"
                response += f"🌤️ {day['description']}\n"
                response += f"💨 Wind: {day['wind_speed']:.1f} km/h\n"
                response += f"🔒 Fishing: {'✅ Safe' if day['safety_level'] == 'safe' else '⚠️ Caution' if day['safety_level'] == 'caution' else '❌ Dangerous'}\n\n"
            
            return response
            
        except Exception as e:
            logger.error(f"Forecast response formatting error: {str(e)}")
            return "Weather forecast is currently unavailable."
    
    def create_daily_summary(self, forecasts: List[Dict], date) -> Dict:
        """Create daily weather summary from hourly forecasts"""
        try:
            temps = [f['main']['temp'] for f in forecasts]
            wind_speeds = [f.get('wind', {}).get('speed', 0) * 3.6 for f in forecasts]
            
            return {
                'date': date,
                'temp_min': min(temps),
                'temp_max': max(temps),
                'description': forecasts[0]['weather'][0]['description'],
                'wind_speed': max(wind_speeds),
                'safety_level': self.assess_forecast_safety(forecasts[0])
            }
            
        except Exception as e:
            logger.error(f"Daily summary error: {str(e)}")
            return {
                'date': date,
                'temp_min': 0,
                'temp_max': 0,
                'description': 'Unknown',
                'wind_speed': 0,
                'safety_level': 'unknown'
            }
    
    def assess_forecast_safety(self, forecast_item: Dict) -> str:
        """Assess safety level for a forecast item"""
        try:
            wind_speed = forecast_item.get('wind', {}).get('speed', 0) * 3.6
            precipitation = forecast_item.get('rain', {}).get('3h', 0)
            
            if wind_speed > 30 or precipitation > 20:
                return 'dangerous'
            elif wind_speed > 20 or precipitation > 10:
                return 'caution'
            else:
                return 'safe'
                
        except Exception as e:
            logger.error(f"Forecast safety assessment error: {str(e)}")
            return 'unknown'
    
    def get_fallback_weather(self) -> Dict:
        """Return fallback weather data when API is unavailable"""
        return {
            'location': {
                'name': 'Unknown Location',
                'country': 'IN',
                'coordinates': {'lat': 0, 'lon': 0}
            },
            'current': {
                'temperature': 25,
                'feels_like': 25,
                'humidity': 60,
                'pressure': 1013,
                'description': 'Weather data unavailable',
                'wind_speed': 10,
                'wind_direction': 180,
                'visibility': 10
            },
            'safety_assessment': {
                'level': 'unknown',
                'issues': ['weather_data_unavailable'],
                'recommendations': ['Check local weather conditions before fishing']
            },
            'timestamp': datetime.now()
        }
    
    def get_fallback_forecast(self) -> Dict:
        """Return fallback forecast data when API is unavailable"""
        return {
            'location': {
                'name': 'Unknown Location',
                'country': 'IN',
                'coordinates': {'lat': 0, 'lon': 0}
            },
            'daily_summary': [
                {
                    'date': datetime.now().date(),
                    'temp_min': 20,
                    'temp_max': 30,
                    'description': 'Forecast unavailable',
                    'wind_speed': 15,
                    'safety_level': 'unknown'
                }
            ],
            'forecast': []
        }
