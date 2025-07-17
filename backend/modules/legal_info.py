"""
Legal Information Service for FisherMate.AI
Handles fishing laws, regulations, and seasonal ban information
"""

import json
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

class LegalInfoService:
    def __init__(self):
        self.legal_data_file = os.path.join(os.path.dirname(__file__), '..', 'data', 'legal_info.json')
        self.legal_data = self.load_legal_data()
    
    def load_legal_data(self) -> Dict:
        """Load legal information from JSON file"""
        try:
            if os.path.exists(self.legal_data_file):
                with open(self.legal_data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                return self.get_default_legal_data()
        except Exception as e:
            logger.error(f"Error loading legal data: {str(e)}")
            return self.get_default_legal_data()
    
    def get_default_legal_data(self) -> Dict:
        """Return default legal information for Indian states"""
        return {
            "Tamil Nadu": {
                "seasonal_ban": {
                    "period": "April 15 - June 14",
                    "reason": "Fish breeding season protection",
                    "penalty": "₹5,000 - ₹25,000 fine and/or imprisonment up to 3 months"
                },
                "restricted_fishing": [
                    {
                        "method": "Bottom trawling",
                        "distance": "Within 3 nautical miles from shore",
                        "reason": "Protect marine ecosystem"
                    },
                    {
                        "method": "Purse seine nets",
                        "distance": "Within 5 nautical miles from shore",
                        "reason": "Prevent juvenile fish catching"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Must be registered with Department of Fisheries",
                    "fishing_license": "Required for commercial fishing",
                    "validity": "Annual renewal required",
                    "documents": ["Boat registration", "Engine certificate", "Safety equipment certificate"]
                },
                "safety_requirements": [
                    "Life jackets for all crew members",
                    "VHF radio communication",
                    "First aid kit",
                    "Emergency flares",
                    "GPS navigation system"
                ],
                "contact_info": {
                    "department": "Department of Fisheries, Tamil Nadu",
                    "helpline": "1800-425-1266",
                    "website": "https://www.tn.gov.in/fisheries"
                }
            },
            "Kerala": {
                "seasonal_ban": {
                    "period": "June 15 - July 31",
                    "reason": "Monsoon season and fish breeding",
                    "penalty": "₹10,000 - ₹50,000 fine and boat confiscation"
                },
                "restricted_fishing": [
                    {
                        "method": "Ring seines",
                        "distance": "Within 5 nautical miles from shore",
                        "reason": "Protect traditional fishing rights"
                    },
                    {
                        "method": "Trawling",
                        "time": "Between 6 PM - 6 AM",
                        "reason": "Prevent conflict with traditional fishers"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with Kerala Maritime Board",
                    "fishing_license": "Required for all fishing activities",
                    "validity": "5 years",
                    "documents": ["Boat ownership certificate", "Engine registration", "Crew list"]
                },
                "safety_requirements": [
                    "Life jackets (IS 14946 standard)",
                    "Marine radio equipment",
                    "Emergency beacon",
                    "First aid box",
                    "Fire extinguisher"
                ],
                "contact_info": {
                    "department": "Kerala State Fisheries Department",
                    "helpline": "1800-425-4030",
                    "website": "https://fisheries.kerala.gov.in"
                }
            },
            "Karnataka": {
                "seasonal_ban": {
                    "period": "June 1 - July 31",
                    "reason": "Monsoon season fishing ban",
                    "penalty": "₹7,500 - ₹30,000 fine and license suspension"
                },
                "restricted_fishing": [
                    {
                        "method": "Bottom trawling",
                        "distance": "Within 5 nautical miles from shore",
                        "reason": "Protect coastal marine life"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with Karnataka Fisheries Department",
                    "fishing_license": "Mandatory for commercial operations",
                    "validity": "3 years",
                    "documents": ["Boat registration", "Engine certificate", "Insurance certificate"]
                },
                "safety_requirements": [
                    "Life jackets for all crew",
                    "Communication equipment",
                    "Emergency supplies",
                    "Navigation lights"
                ],
                "contact_info": {
                    "department": "Karnataka Fisheries Department",
                    "helpline": "1800-425-8040",
                    "website": "https://fisheries.karnataka.gov.in"
                }
            },
            "Andhra Pradesh": {
                "seasonal_ban": {
                    "period": "April 15 - June 14",
                    "reason": "Fish breeding season",
                    "penalty": "₹5,000 - ₹20,000 fine and boat detention"
                },
                "restricted_fishing": [
                    {
                        "method": "Trawling",
                        "distance": "Within 3 nautical miles from shore",
                        "reason": "Protect artisanal fishing zones"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with AP Fisheries Department",
                    "fishing_license": "Required for mechanized boats",
                    "validity": "Annual",
                    "documents": ["Boat registration", "Engine registration", "Crew certification"]
                },
                "safety_requirements": [
                    "Life jackets (approved type)",
                    "VHF radio",
                    "First aid kit",
                    "Emergency flares"
                ],
                "contact_info": {
                    "department": "Andhra Pradesh Fisheries Department",
                    "helpline": "1800-425-1813",
                    "website": "https://fisheries.ap.gov.in"
                }
            },
            "West Bengal": {
                "seasonal_ban": {
                    "period": "April 15 - June 14 (Bay of Bengal)",
                    "reason": "Hilsa breeding season",
                    "penalty": "₹10,000 - ₹25,000 fine and imprisonment"
                },
                "restricted_fishing": [
                    {
                        "method": "Fixed bag nets",
                        "distance": "Within 5 nautical miles from shore",
                        "reason": "Protect juvenile fish"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with West Bengal Fisheries Department",
                    "fishing_license": "Required for all fishing boats",
                    "validity": "Annual",
                    "documents": ["Boat registration", "Engine certificate", "Crew list"]
                },
                "safety_requirements": [
                    "Life jackets for all crew",
                    "Marine radio",
                    "Emergency beacon",
                    "First aid supplies"
                ],
                "contact_info": {
                    "department": "West Bengal Fisheries Department",
                    "helpline": "1800-345-1313",
                    "website": "https://fisheries.wb.gov.in"
                }
            },
            "Odisha": {
                "seasonal_ban": {
                    "period": "April 15 - June 14",
                    "reason": "Fish breeding and spawning season",
                    "penalty": "₹5,000 - ₹25,000 fine and boat confiscation"
                },
                "restricted_fishing": [
                    {
                        "method": "Trawling",
                        "distance": "Within 3 nautical miles from shore",
                        "reason": "Protect traditional fishing areas"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with Odisha Fisheries Department",
                    "fishing_license": "Required for mechanized fishing",
                    "validity": "Annual",
                    "documents": ["Boat registration", "Engine certificate", "Safety certificate"]
                },
                "safety_requirements": [
                    "Life jackets (ISI marked)",
                    "VHF radio equipment",
                    "First aid box",
                    "Emergency flares"
                ],
                "contact_info": {
                    "department": "Odisha Fisheries Department",
                    "helpline": "1800-345-6770",
                    "website": "https://fisheries.odisha.gov.in"
                }
            },
            "Gujarat": {
                "seasonal_ban": {
                    "period": "June 1 - July 31 (Monsoon ban)",
                    "reason": "Monsoon season safety and fish breeding",
                    "penalty": "₹10,000 - ₹50,000 fine and license cancellation"
                },
                "restricted_fishing": [
                    {
                        "method": "Trawling",
                        "distance": "Within 5 nautical miles from shore",
                        "reason": "Protect coastal fishing zones"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with Gujarat Fisheries Department",
                    "fishing_license": "Mandatory for all fishing vessels",
                    "validity": "5 years",
                    "documents": ["Boat registration", "Engine certificate", "Insurance certificate"]
                },
                "safety_requirements": [
                    "Life jackets for all crew",
                    "Marine radio communication",
                    "Emergency beacon",
                    "First aid kit",
                    "Fire safety equipment"
                ],
                "contact_info": {
                    "department": "Gujarat Fisheries Department",
                    "helpline": "1800-233-4321",
                    "website": "https://fisheries.gujarat.gov.in"
                }
            },
            "Maharashtra": {
                "seasonal_ban": {
                    "period": "June 1 - July 31",
                    "reason": "Monsoon season fishing ban",
                    "penalty": "₹7,500 - ₹30,000 fine and boat seizure"
                },
                "restricted_fishing": [
                    {
                        "method": "Purse seine",
                        "distance": "Within 5 nautical miles from shore",
                        "reason": "Protect traditional fishing rights"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with Maharashtra Fisheries Department",
                    "fishing_license": "Required for commercial fishing",
                    "validity": "3 years",
                    "documents": ["Boat registration", "Engine certificate", "Crew certification"]
                },
                "safety_requirements": [
                    "Life jackets (approved standard)",
                    "VHF radio",
                    "First aid supplies",
                    "Emergency flares"
                ],
                "contact_info": {
                    "department": "Maharashtra Fisheries Department",
                    "helpline": "1800-220-2435",
                    "website": "https://fisheries.maharashtra.gov.in"
                }
            },
            "Goa": {
                "seasonal_ban": {
                    "period": "June 1 - July 31",
                    "reason": "Monsoon season ban",
                    "penalty": "₹10,000 - ₹25,000 fine and boat confiscation"
                },
                "restricted_fishing": [
                    {
                        "method": "Trawling",
                        "distance": "Within 5 nautical miles from shore",
                        "reason": "Protect artisanal fishing zones"
                    }
                ],
                "licensing": {
                    "motorized_boats": "Registration with Goa Fisheries Department",
                    "fishing_license": "Required for all fishing activities",
                    "validity": "Annual",
                    "documents": ["Boat registration", "Engine certificate", "Safety certificate"]
                },
                "safety_requirements": [
                    "Life jackets for all crew",
                    "Marine radio",
                    "First aid kit",
                    "Emergency beacon"
                ],
                "contact_info": {
                    "department": "Goa Fisheries Department",
                    "helpline": "1800-233-0018",
                    "website": "https://fisheries.goa.gov.in"
                }
            }
        }
    
    def get_legal_info(self, state: str, language: str = 'en') -> Dict:
        """Get legal information for a specific state"""
        try:
            state_info = self.legal_data.get(state, self.legal_data.get('general', {}))
            
            if not state_info:
                return {
                    'error': 'State information not available',
                    'available_states': list(self.legal_data.keys())
                }
            
            return {
                'state': state,
                'legal_info': state_info,
                'language': language,
                'last_updated': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Legal info retrieval error: {str(e)}")
            return {
                'error': 'Legal information service unavailable',
                'state': state,
                'language': language
            }
    
    def get_legal_response(self, message: str, language: str, location: Dict) -> Dict:
        """Generate legal information response for chatbot"""
        try:
            # Determine state from location or message
            state = self.determine_state(message, location)
            
            # Determine what type of legal info is requested
            legal_type = self.determine_legal_query_type(message)
            
            # Get relevant legal information
            legal_info = self.get_legal_info(state, language)
            
            if 'error' in legal_info:
                return {
                    'text': f"Legal information for {state} is not available. Available states: {', '.join(legal_info.get('available_states', []))}",
                    'type': 'error',
                    'language': language
                }
            
            # Format response based on query type
            response_text = self.format_legal_response(legal_info, legal_type, language)
            
            return {
                'text': response_text,
                'type': 'legal',
                'data': legal_info,
                'language': language,
                'query_type': legal_type
            }
            
        except Exception as e:
            logger.error(f"Legal response error: {str(e)}")
            return {
                'text': 'Legal information service is temporarily unavailable. Please try again later.',
                'type': 'error',
                'language': language
            }
    
    def determine_state(self, message: str, location: Dict) -> str:
        """Determine which state the query is about"""
        message_lower = message.lower()
        
        # Check for state names in message
        state_keywords = {
            'tamil nadu': ['tamil nadu', 'tn', 'chennai', 'madras', 'coimbatore'],
            'kerala': ['kerala', 'kochi', 'cochin', 'trivandrum', 'kozhikode'],
            'karnataka': ['karnataka', 'bangalore', 'mangalore', 'udupi'],
            'andhra pradesh': ['andhra pradesh', 'ap', 'hyderabad', 'visakhapatnam', 'vijayawada'],
            'west bengal': ['west bengal', 'wb', 'kolkata', 'calcutta', 'haldia'],
            'odisha': ['odisha', 'orissa', 'bhubaneswar', 'puri', 'cuttack'],
            'gujarat': ['gujarat', 'ahmedabad', 'surat', 'vadodara', 'rajkot'],
            'maharashtra': ['maharashtra', 'mumbai', 'bombay', 'pune', 'nagpur'],
            'goa': ['goa', 'panaji', 'margao', 'vasco']
        }
        
        for state, keywords in state_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                return state
        
        # Try to determine from location coordinates
        if location and 'lat' in location and 'lon' in location:
            return self.get_state_from_coordinates(location['lat'], location['lon'])
        
        # Default to Tamil Nadu (can be changed based on user base)
        return 'Tamil Nadu'
    
    def get_state_from_coordinates(self, lat: float, lon: float) -> str:
        """Determine state from coordinates (simplified mapping)"""
        # Simplified state boundary mapping
        if 8.0 <= lat <= 13.5 and 76.0 <= lon <= 80.5:
            return 'Tamil Nadu'
        elif 8.0 <= lat <= 12.8 and 74.0 <= lon <= 77.5:
            return 'Kerala'
        elif 11.5 <= lat <= 18.5 and 74.0 <= lon <= 78.5:
            return 'Karnataka'
        elif 12.5 <= lat <= 19.5 and 76.0 <= lon <= 84.5:
            return 'Andhra Pradesh'
        elif 20.0 <= lat <= 27.5 and 85.0 <= lon <= 89.5:
            return 'West Bengal'
        elif 17.5 <= lat <= 22.5 and 81.0 <= lon <= 87.5:
            return 'Odisha'
        elif 20.0 <= lat <= 24.5 and 68.0 <= lon <= 74.5:
            return 'Gujarat'
        elif 15.5 <= lat <= 22.0 and 72.5 <= lon <= 80.5:
            return 'Maharashtra'
        elif 15.0 <= lat <= 15.8 and 73.7 <= lon <= 74.3:
            return 'Goa'
        else:
            return 'Tamil Nadu'  # Default
    
    def determine_legal_query_type(self, message: str) -> str:
        """Determine what type of legal information is requested"""
        message_lower = message.lower()
        
        if any(keyword in message_lower for keyword in ['ban', 'season', 'closed', 'restriction']):
            return 'seasonal_ban'
        elif any(keyword in message_lower for keyword in ['license', 'permit', 'registration']):
            return 'licensing'
        elif any(keyword in message_lower for keyword in ['safety', 'equipment', 'requirement']):
            return 'safety_requirements'
        elif any(keyword in message_lower for keyword in ['contact', 'helpline', 'department']):
            return 'contact_info'
        elif any(keyword in message_lower for keyword in ['penalty', 'fine', 'punishment']):
            return 'penalties'
        else:
            return 'general'
    
    def format_legal_response(self, legal_info: Dict, query_type: str, language: str) -> str:
        """Format legal information response"""
        try:
            state = legal_info['state']
            info = legal_info['legal_info']
            
            if query_type == 'seasonal_ban':
                return self.format_seasonal_ban_response(info, state)
            elif query_type == 'licensing':
                return self.format_licensing_response(info, state)
            elif query_type == 'safety_requirements':
                return self.format_safety_requirements_response(info, state)
            elif query_type == 'contact_info':
                return self.format_contact_info_response(info, state)
            elif query_type == 'penalties':
                return self.format_penalties_response(info, state)
            else:
                return self.format_general_response(info, state)
            
        except Exception as e:
            logger.error(f"Response formatting error: {str(e)}")
            return f"Legal information for {legal_info.get('state', 'unknown state')} is currently unavailable."
    
    def format_seasonal_ban_response(self, info: Dict, state: str) -> str:
        """Format seasonal ban information"""
        ban_info = info.get('seasonal_ban', {})
        
        response = f"🚫 **Seasonal Fishing Ban - {state}**\n\n"
        response += f"📅 **Period:** {ban_info.get('period', 'Not specified')}\n"
        response += f"🎯 **Reason:** {ban_info.get('reason', 'Not specified')}\n"
        response += f"💰 **Penalty:** {ban_info.get('penalty', 'Not specified')}\n\n"
        
        # Check if current date falls within ban period
        current_status = self.check_current_ban_status(ban_info.get('period', ''))
        if current_status:
            response += f"⚠️ **Current Status:** {current_status}\n\n"
        
        response += "📋 **Important Notes:**\n"
        response += "• This ban applies to all mechanized fishing vessels\n"
        response += "• Traditional fishing methods may have different regulations\n"
        response += "• Check with local authorities for latest updates\n"
        
        return response
    
    def format_licensing_response(self, info: Dict, state: str) -> str:
        """Format licensing information"""
        licensing = info.get('licensing', {})
        
        response = f"📋 **Fishing License Requirements - {state}**\n\n"
        response += f"🚤 **Motorized Boats:** {licensing.get('motorized_boats', 'Not specified')}\n"
        response += f"🎣 **Fishing License:** {licensing.get('fishing_license', 'Not specified')}\n"
        response += f"⏰ **Validity:** {licensing.get('validity', 'Not specified')}\n\n"
        
        documents = licensing.get('documents', [])
        if documents:
            response += "📄 **Required Documents:**\n"
            for doc in documents:
                response += f"• {doc}\n"
        
        return response
    
    def format_safety_requirements_response(self, info: Dict, state: str) -> str:
        """Format safety requirements information"""
        safety_req = info.get('safety_requirements', [])
        
        response = f"🦺 **Safety Requirements - {state}**\n\n"
        response += "**Mandatory Safety Equipment:**\n"
        
        for req in safety_req:
            response += f"• {req}\n"
        
        response += "\n⚠️ **Important:** All safety equipment must be in working condition and easily accessible."
        
        return response
    
    def format_contact_info_response(self, info: Dict, state: str) -> str:
        """Format contact information"""
        contact = info.get('contact_info', {})
        
        response = f"📞 **Contact Information - {state}**\n\n"
        response += f"🏢 **Department:** {contact.get('department', 'Not available')}\n"
        response += f"📞 **Helpline:** {contact.get('helpline', 'Not available')}\n"
        response += f"🌐 **Website:** {contact.get('website', 'Not available')}\n"
        
        return response
    
    def format_penalties_response(self, info: Dict, state: str) -> str:
        """Format penalty information"""
        ban_info = info.get('seasonal_ban', {})
        penalty = ban_info.get('penalty', 'Not specified')
        
        response = f"⚖️ **Penalty Information - {state}**\n\n"
        response += f"💰 **Seasonal Ban Violation:** {penalty}\n\n"
        
        response += "📋 **Additional Penalties May Apply For:**\n"
        response += "• Fishing without valid license\n"
        response += "• Using prohibited fishing methods\n"
        response += "• Fishing in restricted areas\n"
        response += "• Not carrying required safety equipment\n"
        
        return response
    
    def format_general_response(self, info: Dict, state: str) -> str:
        """Format general legal information"""
        response = f"⚖️ **Fishing Laws Overview - {state}**\n\n"
        
        # Seasonal ban
        ban_info = info.get('seasonal_ban', {})
        response += f"🚫 **Seasonal Ban:** {ban_info.get('period', 'Not specified')}\n"
        
        # Licensing
        licensing = info.get('licensing', {})
        response += f"📋 **License Required:** {licensing.get('fishing_license', 'Not specified')}\n"
        
        # Contact
        contact = info.get('contact_info', {})
        response += f"📞 **Helpline:** {contact.get('helpline', 'Not available')}\n\n"
        
        response += "💡 **Tip:** Ask me specific questions about bans, licenses, safety requirements, or contact information for detailed answers."
        
        return response
    
    def check_current_ban_status(self, period_str: str) -> str:
        """Check if current date falls within ban period"""
        try:
            if not period_str or '-' not in period_str:
                return ""
            
            # Parse period string (e.g., "April 15 - June 14")
            parts = period_str.split(' - ')
            if len(parts) != 2:
                return ""
            
            start_str, end_str = parts
            current_year = datetime.now().year
            
            # Parse start and end dates
            start_date = datetime.strptime(f"{start_str} {current_year}", "%B %d %Y")
            end_date = datetime.strptime(f"{end_str} {current_year}", "%B %d %Y")
            
            # Handle year crossing (e.g., December to February)
            if end_date < start_date:
                if datetime.now().month <= 6:  # First half of year
                    start_date = start_date.replace(year=current_year - 1)
                else:  # Second half of year
                    end_date = end_date.replace(year=current_year + 1)
            
            current_date = datetime.now()
            
            if start_date <= current_date <= end_date:
                days_left = (end_date - current_date).days
                return f"🔴 ACTIVE BAN - {days_left} days remaining"
            elif current_date < start_date:
                days_until = (start_date - current_date).days
                return f"🟡 Ban starts in {days_until} days"
            else:
                return f"🟢 No active ban"
                
        except Exception as e:
            logger.error(f"Ban status check error: {str(e)}")
            return ""
    
    def get_faq_response(self, question: str, language: str) -> str:
        """Get FAQ response for common legal questions"""
        faqs = {
            'registration': "To register your fishing boat, visit your state fisheries department with required documents including boat ownership proof, engine certificate, and safety equipment certification.",
            'license_renewal': "Fishing licenses must be renewed annually or as per state regulations. Contact your local fisheries office before expiry date.",
            'safety_equipment': "All fishing vessels must carry life jackets, VHF radio, first aid kit, emergency flares, and navigation equipment as per state regulations.",
            'ban_period': "Seasonal fishing bans vary by state but typically occur during monsoon season (June-July) or fish breeding season (April-June).",
            'penalties': "Violations can result in fines ranging from ₹5,000 to ₹50,000, boat confiscation, and license suspension depending on the offense and state."
        }
        
        # Simple keyword matching for FAQ
        question_lower = question.lower()
        for key, answer in faqs.items():
            if key in question_lower:
                return answer
        
        return "For specific legal questions, please contact your state fisheries department helpline."
