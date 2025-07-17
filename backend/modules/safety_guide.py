"""
Safety Guide Service for FisherMate.AI
Provides safety protocols and emergency guidance for fisherfolk
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class SafetyGuideService:
    def __init__(self):
        self.safety_data = self.load_safety_data()
    
    def load_safety_data(self) -> Dict:
        """Load safety information and protocols"""
        return {
            "pre_fishing_checklist": {
                "weather_check": {
                    "title": "Weather Conditions",
                    "items": [
                        "Check weather forecast for next 24 hours",
                        "Verify wind speed and direction",
                        "Check for storm warnings",
                        "Monitor tide timings",
                        "Assess wave height predictions"
                    ],
                    "priority": "high"
                },
                "equipment_check": {
                    "title": "Safety Equipment",
                    "items": [
                        "Life jackets for all crew members",
                        "VHF radio with emergency channels",
                        "First aid kit with medicines",
                        "Emergency flares and signals",
                        "GPS navigation system",
                        "Emergency food and water",
                        "Fire extinguisher",
                        "Emergency beacon (EPIRB)"
                    ],
                    "priority": "high"
                },
                "boat_inspection": {
                    "title": "Boat Inspection",
                    "items": [
                        "Check engine oil and fuel levels",
                        "Inspect hull for damage or leaks",
                        "Test navigation lights",
                        "Verify steering system",
                        "Check bilge pump operation",
                        "Inspect fishing nets and equipment",
                        "Test communication equipment"
                    ],
                    "priority": "medium"
                },
                "crew_preparation": {
                    "title": "Crew Preparation",
                    "items": [
                        "Ensure all crew members can swim",
                        "Brief crew on emergency procedures",
                        "Assign roles and responsibilities",
                        "Check crew health conditions",
                        "Inform family about fishing plans",
                        "Carry identification documents"
                    ],
                    "priority": "medium"
                }
            },
            "at_sea_safety": {
                "communication": {
                    "title": "Communication Protocols",
                    "procedures": [
                        "Maintain regular contact with shore",
                        "Use VHF Channel 16 for emergencies",
                        "Report position every 2 hours",
                        "Share fishing location with other boats",
                        "Keep mobile phone in waterproof case"
                    ]
                },
                "navigation": {
                    "title": "Safe Navigation",
                    "procedures": [
                        "Always use GPS navigation system",
                        "Maintain safe distance from other vessels",
                        "Follow traffic separation schemes",
                        "Use navigation lights during poor visibility",
                        "Keep updated charts and tide tables"
                    ]
                },
                "weather_monitoring": {
                    "title": "Weather Monitoring",
                    "procedures": [
                        "Monitor weather conditions continuously",
                        "Watch for sudden weather changes",
                        "Return to shore if conditions deteriorate",
                        "Seek shelter in rough weather",
                        "Follow coast guard weather advisories"
                    ]
                },
                "emergency_protocols": {
                    "title": "Emergency Procedures",
                    "procedures": [
                        "Fire: Use extinguisher, alert crew, prepare to abandon",
                        "Man overboard: Throw life ring, mark position, alert crew",
                        "Engine failure: Drop anchor, signal for help, prepare for towing",
                        "Medical emergency: Provide first aid, call for help",
                        "Collision: Assess damage, provide assistance, report incident"
                    ]
                }
            },
            "emergency_contacts": {
                "national": {
                    "coast_guard": "1554",
                    "emergency": "112",
                    "marine_police": "100"
                },
                "state_specific": {
                    "Tamil Nadu": {
                        "coast_guard": "044-2461-2471",
                        "fisheries_dept": "1800-425-1266",
                        "marine_police": "044-2345-6789"
                    },
                    "Kerala": {
                        "coast_guard": "0484-266-6672",
                        "fisheries_dept": "1800-425-4030",
                        "marine_police": "0484-270-0100"
                    },
                    "Karnataka": {
                        "coast_guard": "0824-242-1948",
                        "fisheries_dept": "1800-425-8040",
                        "marine_police": "0824-242-0100"
                    }
                }
            },
            "safety_equipment_guide": {
                "life_jackets": {
                    "standard": "IS 14946:2001",
                    "types": [
                        "Type I: Offshore life jackets (24+ hours)",
                        "Type II: Near-shore vests (turning capability)",
                        "Type III: Flotation aids (calm water)",
                        "Type V: Special use (specific conditions)"
                    ],
                    "maintenance": [
                        "Check for tears or damage monthly",
                        "Test inflation mechanism",
                        "Store in dry, cool place",
                        "Replace after 5 years or damage"
                    ]
                },
                "communication_equipment": {
                    "vhf_radio": {
                        "channels": {
                            "16": "Emergency and calling",
                            "06": "Ship-to-ship safety",
                            "13": "Navigation safety",
                            "09": "Commercial fishing"
                        },
                        "emergency_procedure": [
                            "Switch to Channel 16",
                            "Press and hold transmit button",
                            "Say 'MAYDAY' three times",
                            "Give vessel name and position",
                            "State nature of emergency"
                        ]
                    },
                    "emergency_beacon": {
                        "types": [
                            "EPIRB: Emergency Position Indicating Radio Beacon",
                            "PLB: Personal Locator Beacon",
                            "SART: Search and Rescue Transponder"
                        ],
                        "activation": [
                            "Manual activation in emergency",
                            "Automatic activation when submerged",
                            "Transmits GPS position to rescue centers"
                        ]
                    }
                }
            },
            "weather_safety": {
                "wind_conditions": {
                    "safe": "Below 20 km/h - Normal fishing conditions",
                    "caution": "20-30 km/h - Stay alert, monitor conditions",
                    "dangerous": "Above 30 km/h - Return to shore immediately"
                },
                "wave_conditions": {
                    "safe": "Below 1.5m - Safe for most boats",
                    "caution": "1.5-2.5m - Experienced fishers only",
                    "dangerous": "Above 2.5m - Extremely dangerous"
                },
                "visibility": {
                    "safe": "Above 5 km - Normal operations",
                    "caution": "2-5 km - Reduced speed, use lights",
                    "dangerous": "Below 2 km - Avoid fishing"
                }
            },
            "first_aid_basics": {
                "drowning": [
                    "Remove from water immediately",
                    "Check for breathing and pulse",
                    "Start CPR if necessary",
                    "Call for medical help",
                    "Keep warm and monitor"
                ],
                "cuts_wounds": [
                    "Clean hands before treating",
                    "Apply direct pressure to bleeding",
                    "Clean wound with clean water",
                    "Apply antiseptic and bandage",
                    "Seek medical help if severe"
                ],
                "hypothermia": [
                    "Move to warm, dry place",
                    "Remove wet clothing",
                    "Wrap in blankets",
                    "Give warm drinks if conscious",
                    "Seek immediate medical help"
                ],
                "seasickness": [
                    "Stay on deck in fresh air",
                    "Look at horizon",
                    "Avoid fatty foods",
                    "Use anti-nausea medication",
                    "Stay hydrated"
                ]
            },
            "survival_techniques": {
                "abandon_ship": [
                    "Send distress signal immediately",
                    "Put on life jackets",
                    "Gather survival equipment",
                    "Launch life raft if available",
                    "Stay together as group"
                ],
                "survival_at_sea": [
                    "Conserve energy and body heat",
                    "Signal for help regularly",
                    "Ration food and water",
                    "Stay together if multiple people",
                    "Maintain hope and morale"
                ],
                "signaling": [
                    "Flares: Red for distress, orange for marking",
                    "Mirror: Reflect sunlight toward rescuers",
                    "Whistle: Three short blasts",
                    "Phone: Use emergency apps with GPS",
                    "Radio: Repeat MAYDAY on Channel 16"
                ]
            }
        }
    
    def get_safety_info(self, category: str, language: str = 'en') -> Dict:
        """Get safety information for a specific category"""
        try:
            if category in self.safety_data:
                return {
                    'category': category,
                    'info': self.safety_data[category],
                    'language': language,
                    'timestamp': datetime.now().isoformat()
                }
            else:
                return {
                    'error': 'Safety category not found',
                    'available_categories': list(self.safety_data.keys()),
                    'language': language
                }
        except Exception as e:
            logger.error(f"Safety info retrieval error: {str(e)}")
            return {
                'error': 'Safety information service unavailable',
                'category': category,
                'language': language
            }
    
    def get_safety_response(self, message: str, language: str) -> Dict:
        """Generate safety guidance response for chatbot"""
        try:
            # Determine what type of safety info is requested
            safety_type = self.determine_safety_query_type(message)
            
            # Get relevant safety information
            safety_info = self.get_safety_info(safety_type, language)
            
            if 'error' in safety_info:
                return {
                    'text': f"Safety information for '{safety_type}' is not available. Available categories: {', '.join(safety_info.get('available_categories', []))}",
                    'type': 'error',
                    'language': language
                }
            
            # Format response based on query type
            response_text = self.format_safety_response(safety_info, safety_type, language)
            
            return {
                'text': response_text,
                'type': 'safety',
                'data': safety_info,
                'language': language,
                'safety_category': safety_type
            }
            
        except Exception as e:
            logger.error(f"Safety response error: {str(e)}")
            return {
                'text': 'Safety information service is temporarily unavailable. Please try again later.',
                'type': 'error',
                'language': language
            }
    
    def determine_safety_query_type(self, message: str) -> str:
        """Determine what type of safety information is requested"""
        message_lower = message.lower()
        
        # Emergency keywords
        if any(keyword in message_lower for keyword in ['emergency', 'help', 'rescue', 'accident', 'mayday']):
            return 'emergency_contacts'
        
        # Equipment keywords
        elif any(keyword in message_lower for keyword in ['equipment', 'life jacket', 'radio', 'beacon']):
            return 'safety_equipment_guide'
        
        # Weather safety keywords
        elif any(keyword in message_lower for keyword in ['weather', 'storm', 'wind', 'wave', 'rough']):
            return 'weather_safety'
        
        # Pre-fishing keywords
        elif any(keyword in message_lower for keyword in ['checklist', 'preparation', 'before', 'inspect']):
            return 'pre_fishing_checklist'
        
        # At sea keywords
        elif any(keyword in message_lower for keyword in ['at sea', 'navigation', 'communication', 'fishing']):
            return 'at_sea_safety'
        
        # First aid keywords
        elif any(keyword in message_lower for keyword in ['first aid', 'injury', 'wound', 'drowning', 'medical']):
            return 'first_aid_basics'
        
        # Survival keywords
        elif any(keyword in message_lower for keyword in ['survival', 'abandon', 'life raft', 'signal']):
            return 'survival_techniques'
        
        else:
            return 'pre_fishing_checklist'  # Default
    
    def format_safety_response(self, safety_info: Dict, safety_type: str, language: str) -> str:
        """Format safety information response"""
        try:
            info = safety_info['info']
            
            if safety_type == 'emergency_contacts':
                return self.format_emergency_contacts(info)
            elif safety_type == 'safety_equipment_guide':
                return self.format_equipment_guide(info)
            elif safety_type == 'weather_safety':
                return self.format_weather_safety(info)
            elif safety_type == 'pre_fishing_checklist':
                return self.format_pre_fishing_checklist(info)
            elif safety_type == 'at_sea_safety':
                return self.format_at_sea_safety(info)
            elif safety_type == 'first_aid_basics':
                return self.format_first_aid_basics(info)
            elif safety_type == 'survival_techniques':
                return self.format_survival_techniques(info)
            else:
                return self.format_general_safety(info)
                
        except Exception as e:
            logger.error(f"Safety response formatting error: {str(e)}")
            return "Safety information is currently unavailable."
    
    def format_emergency_contacts(self, info: Dict) -> str:
        """Format emergency contact information"""
        response = "🚨 **EMERGENCY CONTACTS**\n\n"
        
        national = info.get('national', {})
        response += "🇮🇳 **National Emergency Numbers:**\n"
        response += f"🚁 Coast Guard: {national.get('coast_guard', '1554')}\n"
        response += f"🚨 Emergency: {national.get('emergency', '112')}\n"
        response += f"👮 Marine Police: {national.get('marine_police', '100')}\n\n"
        
        response += "📍 **State-Specific Numbers:**\n"
        state_specific = info.get('state_specific', {})
        for state, contacts in state_specific.items():
            response += f"\n**{state}:**\n"
            response += f"🚁 Coast Guard: {contacts.get('coast_guard', 'N/A')}\n"
            response += f"🐟 Fisheries Dept: {contacts.get('fisheries_dept', 'N/A')}\n"
            response += f"👮 Marine Police: {contacts.get('marine_police', 'N/A')}\n"
        
        response += "\n⚠️ **In Emergency:**\n"
        response += "1. Call Coast Guard (1554) immediately\n"
        response += "2. Give your exact location (GPS coordinates)\n"
        response += "3. Describe the emergency clearly\n"
        response += "4. Follow instructions from rescue personnel\n"
        
        return response
    
    def format_equipment_guide(self, info: Dict) -> str:
        """Format safety equipment guide"""
        response = "🦺 **SAFETY EQUIPMENT GUIDE**\n\n"
        
        # Life jackets
        life_jackets = info.get('life_jackets', {})
        response += "🛟 **Life Jackets:**\n"
        response += f"📏 Standard: {life_jackets.get('standard', 'IS 14946:2001')}\n\n"
        
        types = life_jackets.get('types', [])
        response += "**Types:**\n"
        for jacket_type in types:
            response += f"• {jacket_type}\n"
        
        response += "\n🔧 **Maintenance:**\n"
        maintenance = life_jackets.get('maintenance', [])
        for item in maintenance:
            response += f"• {item}\n"
        
        # Communication equipment
        comm_eq = info.get('communication_equipment', {})
        vhf = comm_eq.get('vhf_radio', {})
        
        response += "\n📻 **VHF Radio Channels:**\n"
        channels = vhf.get('channels', {})
        for channel, purpose in channels.items():
            response += f"• Ch {channel}: {purpose}\n"
        
        response += "\n🚨 **Emergency Radio Procedure:**\n"
        emergency_proc = vhf.get('emergency_procedure', [])
        for i, step in enumerate(emergency_proc, 1):
            response += f"{i}. {step}\n"
        
        return response
    
    def format_weather_safety(self, info: Dict) -> str:
        """Format weather safety information"""
        response = "🌦️ **WEATHER SAFETY GUIDELINES**\n\n"
        
        wind = info.get('wind_conditions', {})
        response += "💨 **Wind Conditions:**\n"
        response += f"✅ Safe: {wind.get('safe', 'Below 20 km/h')}\n"
        response += f"⚠️ Caution: {wind.get('caution', '20-30 km/h')}\n"
        response += f"❌ Dangerous: {wind.get('dangerous', 'Above 30 km/h')}\n\n"
        
        waves = info.get('wave_conditions', {})
        response += "🌊 **Wave Conditions:**\n"
        response += f"✅ Safe: {waves.get('safe', 'Below 1.5m')}\n"
        response += f"⚠️ Caution: {waves.get('caution', '1.5-2.5m')}\n"
        response += f"❌ Dangerous: {waves.get('dangerous', 'Above 2.5m')}\n\n"
        
        visibility = info.get('visibility', {})
        response += "👁️ **Visibility:**\n"
        response += f"✅ Safe: {visibility.get('safe', 'Above 5 km')}\n"
        response += f"⚠️ Caution: {visibility.get('caution', '2-5 km')}\n"
        response += f"❌ Dangerous: {visibility.get('dangerous', 'Below 2 km')}\n\n"
        
        response += "📋 **Remember:**\n"
        response += "• Always check weather before departing\n"
        response += "• Return to shore if conditions worsen\n"
        response += "• Stay informed about weather warnings\n"
        
        return response
    
    def format_pre_fishing_checklist(self, info: Dict) -> str:
        """Format pre-fishing checklist"""
        response = "📋 **PRE-FISHING SAFETY CHECKLIST**\n\n"
        
        for key, section in info.items():
            priority = section.get('priority', 'medium')
            priority_icon = '🔴' if priority == 'high' else '🟡' if priority == 'medium' else '🟢'
            
            response += f"{priority_icon} **{section.get('title', key.replace('_', ' ').title())}:**\n"
            
            items = section.get('items', [])
            for item in items:
                response += f"• {item}\n"
            
            response += "\n"
        
        response += "⚠️ **Important:** Complete ALL high-priority items before departure!"
        
        return response
    
    def format_at_sea_safety(self, info: Dict) -> str:
        """Format at-sea safety procedures"""
        response = "⚓ **AT-SEA SAFETY PROCEDURES**\n\n"
        
        for key, section in info.items():
            response += f"🔹 **{section.get('title', key.replace('_', ' ').title())}:**\n"
            
            procedures = section.get('procedures', [])
            for procedure in procedures:
                response += f"• {procedure}\n"
            
            response += "\n"
        
        return response
    
    def format_first_aid_basics(self, info: Dict) -> str:
        """Format first aid basics"""
        response = "🏥 **FIRST AID BASICS**\n\n"
        
        for condition, steps in info.items():
            response += f"🩹 **{condition.replace('_', ' ').title()}:**\n"
            
            for i, step in enumerate(steps, 1):
                response += f"{i}. {step}\n"
            
            response += "\n"
        
        response += "⚠️ **Remember:** First aid is temporary care. Seek professional medical help immediately!"
        
        return response
    
    def format_survival_techniques(self, info: Dict) -> str:
        """Format survival techniques"""
        response = "🆘 **SURVIVAL TECHNIQUES**\n\n"
        
        for technique, steps in info.items():
            response += f"🔹 **{technique.replace('_', ' ').title()}:**\n"
            
            for i, step in enumerate(steps, 1):
                response += f"{i}. {step}\n"
            
            response += "\n"
        
        response += "💡 **Key Points:**\n"
        response += "• Stay calm and think clearly\n"
        response += "• Conserve energy and resources\n"
        response += "• Signal for help continuously\n"
        response += "• Never give up hope\n"
        
        return response
    
    def format_general_safety(self, info: Dict) -> str:
        """Format general safety information"""
        response = "🛡️ **GENERAL SAFETY INFORMATION**\n\n"
        
        response += "⚠️ **Key Safety Principles:**\n"
        response += "• Always inform someone about your fishing plans\n"
        response += "• Check weather conditions before departure\n"
        response += "• Carry all required safety equipment\n"
        response += "• Maintain regular communication with shore\n"
        response += "• Never fish alone if possible\n"
        response += "• Know your limits and boat capabilities\n\n"
        
        response += "📞 **Emergency Contact: Coast Guard 1554**\n"
        response += "💡 **Ask me about specific safety topics for detailed guidance!**"
        
        return response
    
    def get_emergency_response(self, emergency_type: str, language: str = 'en') -> str:
        """Get immediate emergency response guidance"""
        emergency_responses = {
            'fire': """🔥 **BOAT FIRE EMERGENCY**
1. Alert all crew immediately
2. Use fire extinguisher on small fires
3. If fire spreads, prepare to abandon ship
4. Send MAYDAY on VHF Channel 16
5. Put on life jackets
6. Launch life raft if available
7. Stay together in water""",
            
            'man_overboard': """🚨 **MAN OVERBOARD**
1. Shout "MAN OVERBOARD" immediately
2. Throw life ring toward person
3. Keep eyes on person in water
4. Mark GPS position
5. Turn boat around carefully
6. Approach from downwind
7. Pull person aboard at stern""",
            
            'medical': """🏥 **MEDICAL EMERGENCY**
1. Assess condition and provide first aid
2. Call Coast Guard on VHF 16
3. Give GPS position
4. Describe patient's condition
5. Follow medical advice from shore
6. Prepare for helicopter evacuation
7. Keep patient warm and stable""",
            
            'engine_failure': """⚙️ **ENGINE FAILURE**
1. Drop anchor immediately
2. Check fuel and electrical systems
3. Try to restart engine
4. Send PAN-PAN on VHF 16
5. Give position and request tow
6. Display breakdown signals
7. Prepare for emergency if needed""",
            
            'collision': """💥 **COLLISION/DAMAGE**
1. Check for injuries first
2. Assess damage to hull
3. Start bilge pump if needed
4. Send MAYDAY if sinking
5. Assist other vessel if possible
6. Document incident
7. Report to authorities"""
        }
        
        return emergency_responses.get(emergency_type, 
            "🚨 **GENERAL EMERGENCY**: Call Coast Guard 1554 immediately and follow their instructions!")
    
    def get_safety_tips_by_weather(self, weather_conditions: Dict) -> List[str]:
        """Get safety tips based on current weather conditions"""
        tips = []
        
        wind_speed = weather_conditions.get('wind_speed', 0)
        wave_height = weather_conditions.get('wave_height', 0)
        visibility = weather_conditions.get('visibility', 10)
        
        if wind_speed > 25:
            tips.append("🌪️ Strong winds detected - consider returning to shore")
            tips.append("⚓ Secure all loose equipment")
        
        if wave_height > 2:
            tips.append("🌊 High waves - maintain slow speed and stay alert")
            tips.append("🛟 Ensure all crew wear life jackets")
        
        if visibility < 5:
            tips.append("🌫️ Poor visibility - use navigation lights")
            tips.append("📻 Maintain regular radio contact")
        
        if not tips:
            tips.append("✅ Weather conditions are favorable for fishing")
            tips.append("🦺 Always maintain basic safety protocols")
        
        return tips
