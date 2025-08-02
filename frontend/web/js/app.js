// FisherMate.AI - Modern Dashboard JavaScript with Analytics
class FisherMateApp {
    constructor() {
        this.analytics = this.initializeAnalytics();
        this.sessionStartTime = Date.now();
        this.interactionCount = 0;
        this.init();
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupAnimations();
        this.trackSessionStart();
    }

    // Initialize analytics tracking
    initializeAnalytics() {
        return {
            trackEvent: (eventName, properties = {}) => {
                // Track with Vercel Analytics if available
                if (window.va && window.va.track) {
                    window.va.track(eventName, properties);
                }
                
                // Track with Google Analytics if available
                if (window.gtag) {
                    window.gtag('event', eventName, {
                        custom_parameter: true,
                        ...properties
                    });
                }
                
                // Console log for development
                if (window.location.hostname === 'localhost') {
                    console.log('📊 Analytics Event:', eventName, properties);
                }
            },

            // Fishing-specific event tracking
            trackFishingEvent: {
                chatMessage: (message, language = 'en') => {
                    this.trackEvent('chat_message_sent', {
                        message_length: message.length,
                        language,
                        timestamp: new Date().toISOString()
                    });
                },

                weatherCheck: (location, type = 'current') => {
                    this.trackEvent('weather_check', {
                        location,
                        weather_type: type,
                        timestamp: new Date().toISOString()
                    });
                },

                priceCheck: (fishType, market = 'unknown') => {
                    this.trackEvent('price_check', {
                        fish_type: fishType,
                        market,
                        timestamp: new Date().toISOString()
                    });
                },

                borderCheck: (zoneName, action = 'view') => {
                    this.trackEvent('border_interaction', {
                        zone_name: zoneName,
                        action,
                        timestamp: new Date().toISOString()
                    });
                },

                sosActivated: (location, method = 'button') => {
                    this.trackEvent('sos_activated', {
                        location,
                        activation_method: method,
                        timestamp: new Date().toISOString(),
                        priority: 'high'
                    });
                },

                featureUsed: (featureName, duration = null) => {
                    this.trackEvent('feature_used', {
                        feature_name: featureName,
                        duration_seconds: duration,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        };
    }

    trackSessionStart() {
        this.analytics.trackEvent('session_start', {
            user_type: 'fisherman',
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${screen.width}x${screen.height}`
        });
    }

    trackSessionEnd() {
        const sessionDuration = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        this.analytics.trackEvent('session_end', {
            session_duration: sessionDuration,
            total_interactions: this.interactionCount,
            timestamp: new Date().toISOString()
        });
    }

    init() {
        // Initialize the application
        this.chatContainer = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.voiceBtn = document.getElementById('voice-btn');
        this.typingIndicator = document.getElementById('typing-indicator');
        
        // API endpoints
        this.API_BASE = '/api';
        this.isTyping = false;
        this.recognition = null;
        
        // Initialize features
        this.initializeWeatherWidget();
        this.initializePriceWidget();
        this.initializeNewsWidget();
        this.initializeVoiceRecognition();
        this.loadChatHistory();

        // Track page view
        this.analytics.trackEvent('page_view', {
            page_name: 'dashboard',
            timestamp: new Date().toISOString()
        });

        // Setup session end tracking
        window.addEventListener('beforeunload', () => this.trackSessionEnd());
    }

    setupEventListeners() {
        // Chat input events
        this.sendBtn.addEventListener('click', () => {
            this.analytics.trackFishingEvent.featureUsed('send_button');
            this.sendMessage();
        });
        
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analytics.trackFishingEvent.featureUsed('enter_key_send');
                this.sendMessage();
            }
        });

        // Voice input
        this.voiceBtn.addEventListener('click', () => {
            this.analytics.trackFishingEvent.featureUsed('voice_input');
            this.toggleVoiceInput();
        });

        // Suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.closest('.suggestion-btn').textContent.trim();
                this.analytics.trackFishingEvent.featureUsed('suggestion_button');
                this.analytics.trackEvent('suggestion_clicked', {
                    suggestion_text: question,
                    timestamp: new Date().toISOString()
                });
                this.userInput.value = question;
                this.sendMessage();
            });
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actionType = e.target.textContent.trim();
                this.analytics.trackFishingEvent.featureUsed('quick_action');
                this.analytics.trackEvent('quick_action_clicked', {
                    action_type: actionType,
                    timestamp: new Date().toISOString()
                });
            });
        });

        // Navigation effects
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                // Track navigation
                const page = item.textContent.trim();
                this.analytics.trackEvent('page_navigation', {
                    page_name: page,
                    timestamp: new Date().toISOString()
                });
            });
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.quick-action-btn').textContent.trim();
                this.analytics.trackEvent('quick_action_clicked', {
                    action_type: action,
                    timestamp: new Date().toISOString()
                });
                this.handleQuickAction(action);
            });
        });
    }
        });

        // Chat action buttons
        document.querySelectorAll('.chat-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.target.closest('.chat-action-btn').getAttribute('title');
                this.handleChatAction(title);
            });
        });
    }

    setupScrollEffects() {
        // Navbar scroll effect
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Add parallax effect to hero section
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                const scrolled = window.pageYOffset;
                heroSection.style.transform = `translateY(${scrolled * 0.1}px)`;
            }

            lastScrollY = window.scrollY;
        });
    }

    setupAnimations() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        }, observerOptions);

        // Observe animated elements
        document.querySelectorAll('.modern-card, .floating-card, .sidebar-section, .panel-section').forEach(el => {
            observer.observe(el);
        });

        // Counter animation for stats
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number, .metric-value');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/[^0-9]/g, ''));
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = counter.textContent.replace(/[0-9,]+/, Math.floor(current).toLocaleString());
            }, 20);
        });
    }

    async sendMessage() {
        const message = this.userInput.value.trim();
        if (!message) return;

        // Track message sent
        this.interactionCount++;
        this.analytics.trackFishingEvent.chatMessage(message);

        // Add user message to chat
        this.addMessage(message, 'user');
        this.userInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Simulate AI response (replace with actual API call)
            const response = await this.simulateAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();

            // Add AI response
            this.addMessage(response.response, 'ai');
            
            // Track AI response
            this.analytics.trackEvent('ai_response_received', {
                user_message_length: message.length,
                ai_response_length: response.response.length,
                response_type: response.type,
                timestamp: new Date().toISOString()
            });
            
            // Handle special responses
            if (response.type === 'weather') {
                this.updateWeatherWidget(response.weather);
            } else if (response.type === 'prices') {
                this.updatePricesWidget(response.prices);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai', true);
        }
    }

    async simulateAIResponse(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('weather')) {
            return {
                type: 'weather',
                response: 'Current weather conditions are favorable for fishing. Temperature: 28°C, Wind: 15 km/h, Wave height: 2m. Safe for small to medium boats.',
                weather: {
                    temperature: 28,
                    description: 'Partly Cloudy',
                    icon: 'sun',
                    wind_speed: 15,
                    humidity: 65,
                    wave_height: 2,
                    visibility: 10
                }
            };
        } else if (lowerMessage.includes('price')) {
            return {
                type: 'prices',
                response: 'Here are the current fish prices in the market:',
                prices: [
                    { name: 'Pomfret', price: 450, change: 8 },
                    { name: 'Tuna', price: 320, change: -3 },
                    { name: 'Mackerel', price: 180, change: 12 },
                    { name: 'Sardine', price: 120, change: 5 }
                ]
            };
        } else if (lowerMessage.includes('regulation') || lowerMessage.includes('law')) {
            return {
                type: 'legal',
                response: 'Key fishing regulations: 1) Valid fishing license required, 2) Seasonal restrictions apply for breeding seasons, 3) Minimum catch sizes enforced, 4) Protected species must be released immediately'
            };
        } else if (lowerMessage.includes('safety')) {
            return {
                type: 'safety',
                response: 'Safety tips for fishing: 1) Always check weather conditions before departure, 2) Carry proper safety equipment (life jackets, flares), 3) Inform someone of your fishing plans, 4) Have emergency communication devices'
            };
        } else if (lowerMessage.includes('report catch')) {
            return {
                type: 'report',
                response: 'To report your catch, please provide: 1) Fish species and quantity, 2) Location coordinates, 3) Time of catch, 4) Fishing method used. This helps maintain sustainable fishing records.'
            };
        } else if (lowerMessage.includes('emergency') || lowerMessage.includes('sos')) {
            return {
                type: 'emergency',
                response: 'Emergency SOS activated! 🚨 Please provide your location if possible. Emergency services will be contacted immediately.'
            };
        } else {
            return {
                type: 'general',
                response: 'I can help you with weather updates, fish prices, fishing regulations, safety information, and emergency assistance. What would you like to know?'
            };
        }
    }

    addMessage(message, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}${isError ? ' error' : ''}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = this.formatMessage(message);
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(timestamp);
        
        // Remove welcome message if it exists
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        
        // Add animation
        messageDiv.classList.add('animate__animated', 'animate__fadeInUp');
        
        // Save to chat history
        this.saveChatHistory();
    }

    formatMessage(message) {
        // Basic message formatting
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s]*)?/g, '<a href="$&" target="_blank">$&</a>');
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.isTyping = true;
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
        this.isTyping = false;
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.userInput.value = transcript;
                this.sendMessage();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                this.voiceBtn.classList.remove('listening');
            };

            this.recognition.onend = () => {
                this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                this.voiceBtn.classList.remove('listening');
            };
        }
    }

    toggleVoiceInput() {
        if (!this.recognition) {
            alert('Speech recognition not supported in this browser.');
            return;
        }

        if (this.voiceBtn.classList.contains('listening')) {
            this.recognition.stop();
            this.voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            this.voiceBtn.classList.remove('listening');
        } else {
            this.recognition.start();
            this.voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            this.voiceBtn.classList.add('listening');
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'Report Catch':
                this.userInput.value = 'I want to report my catch for today';
                this.sendMessage();
                break;
            case 'Check Prices':
                this.userInput.value = 'Show me current fish prices';
                this.sendMessage();
                break;
            case 'Emergency SOS':
                this.handleEmergency();
                break;
        }
    }

    handleChatAction(action) {
        switch (action) {
            case 'Clear Chat':
                this.clearChat();
                break;
            case 'Export Chat':
                this.exportChat();
                break;
            case 'Settings':
                this.openSettings();
                break;
        }
    }

    handleEmergency() {
        // Track emergency activation
        this.analytics.trackFishingEvent.sosActivated('unknown', 'emergency_button');
        
        // Emergency SOS functionality
        this.addMessage('🚨 Emergency SOS activated. Sending alert...', 'ai');
        
        // Get location if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                    this.addMessage(`📍 Location: ${coords}`, 'ai');
                    this.addMessage('Emergency services have been notified with your location.', 'ai');
                    
                    // Track emergency with location
                    this.analytics.trackFishingEvent.sosActivated(coords, 'emergency_button_with_location');
                },
                (error) => {
                    this.addMessage('Unable to get location. Please provide your location manually.', 'ai');
                    
                    // Track emergency without location
                    this.analytics.trackEvent('emergency_location_failed', {
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            );
        } else {
            this.addMessage('Location services not available. Please provide your location manually.', 'ai');
            
            // Track emergency without geolocation support
            this.analytics.trackEvent('emergency_no_geolocation', {
                timestamp: new Date().toISOString()
            });
        }
    }

    clearChat() {
        this.chatContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <h4>Welcome to FisherMate AI!</h4>
                <p>I'm here to help you with fishing information, market prices, weather updates, and legal guidance. Try asking me something!</p>
                <div class="suggested-questions">
                    <button class="suggestion-btn">
                        <i class="fas fa-cloud-rain"></i>
                        What's the weather forecast for fishing?
                    </button>
                    <button class="suggestion-btn">
                        <i class="fas fa-chart-line"></i>
                        Show me today's fish prices
                    </button>
                    <button class="suggestion-btn">
                        <i class="fas fa-balance-scale"></i>
                        What are the fishing regulations?
                    </button>
                    <button class="suggestion-btn">
                        <i class="fas fa-life-ring"></i>
                        Safety tips for deep-sea fishing
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners for suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.closest('.suggestion-btn').textContent.trim();
                this.userInput.value = question;
                this.sendMessage();
            });
        });
        
        // Clear chat history
        localStorage.removeItem('fishermate-chat-history');
    }

    exportChat() {
        const messages = document.querySelectorAll('.message');
        let chatData = 'FisherMate AI Chat Export\\n\\n';
        
        messages.forEach(msg => {
            const sender = msg.classList.contains('user') ? 'User' : 'AI';
            const content = msg.querySelector('.message-content').textContent;
            const timestamp = msg.querySelector('.message-timestamp').textContent;
            chatData += `[${timestamp}] ${sender}: ${content}\\n`;
        });
        
        const blob = new Blob([chatData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fishermate-chat-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    openSettings() {
        // Settings modal functionality
        alert('Settings panel coming soon!');
    }

    async initializeWeatherWidget() {
        // Initialize with sample data
        const sampleWeather = {
            temperature: 28,
            description: 'Sunny with light breeze',
            icon: 'sun',
            wind_speed: 15,
            humidity: 65,
            wave_height: 2,
            visibility: 10
        };
        
        this.updateWeatherWidget(sampleWeather);
    }

    updateWeatherWidget(data) {
        if (!data) return;
        
        const temp = document.querySelector('.weather-temp');
        const desc = document.querySelector('.weather-desc');
        const icon = document.querySelector('.weather-icon i');
        
        if (temp) temp.textContent = `${data.temperature}°C`;
        if (desc) desc.textContent = data.description;
        if (icon) icon.className = `fas fa-${data.icon}`;
        
        // Update weather details
        const details = document.querySelectorAll('.weather-item span');
        if (details.length >= 4) {
            details[0].textContent = `${data.wind_speed} km/h`;
            details[1].textContent = `${data.humidity}%`;
            details[2].textContent = `${data.wave_height}m`;
            details[3].textContent = `${data.visibility} km`;
        }
    }

    async initializePriceWidget() {
        // Initialize with sample data
        const samplePrices = [
            { name: 'Pomfret', price: 450, change: 8 },
            { name: 'Tuna', price: 320, change: -3 },
            { name: 'Mackerel', price: 180, change: 12 }
        ];
        
        this.updatePricesWidget(samplePrices);
    }

    updatePricesWidget(prices) {
        if (!prices) return;
        
        const priceItems = document.querySelectorAll('.price-item');
        prices.forEach((price, index) => {
            if (priceItems[index]) {
                const nameEl = priceItems[index].querySelector('.fish-name');
                const priceEl = priceItems[index].querySelector('.fish-price');
                const changeEl = priceItems[index].querySelector('.price-change');
                
                if (nameEl) nameEl.textContent = price.name;
                if (priceEl) priceEl.textContent = `₹${price.price}/kg`;
                if (changeEl) {
                    changeEl.innerHTML = `<i class="fas fa-arrow-${price.change >= 0 ? 'up' : 'down'}"></i> ${Math.abs(price.change)}%`;
                    changeEl.className = `price-change ${price.change >= 0 ? 'positive' : 'negative'}`;
                }
            }
        });
    }

    async initializeNewsWidget() {
        // Initialize with sample data
        const sampleNews = [
            {
                type: 'breaking',
                title: 'New Fishing Subsidy Announced',
                summary: 'Government announces ₹50,000 subsidy for modernizing fishing boats across coastal states.',
                time: '2 hours ago',
                link: '#'
            },
            {
                type: 'update',
                title: 'Weather Alert: Cyclone Warning',
                summary: 'Meteorological department issues cyclone warning for eastern coast. Fishing suspended.',
                time: '5 hours ago',
                link: '#'
            },
            {
                type: 'update',
                title: 'Export Market Opens',
                summary: 'New export opportunities to Southeast Asian markets approved by trade ministry.',
                time: '1 day ago',
                link: '#'
            }
        ];
        
        this.updateNewsWidget(sampleNews);
    }

    updateNewsWidget(news) {
        if (!news) return;
        
        const newsContainer = document.querySelector('.news-widget');
        if (!newsContainer) return;
        
        newsContainer.innerHTML = '';
        news.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-badge ${item.type}">${item.type}</div>
                <div class="news-title">${item.title}</div>
                <div class="news-summary">${item.summary}</div>
                <div class="news-meta">
                    <div class="news-time">${item.time}</div>
                    <a href="${item.link}" class="news-link">Read More</a>
                </div>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    loadChatHistory() {
        // Load chat history from localStorage
        const history = localStorage.getItem('fishermate-chat-history');
        if (history) {
            try {
                const messages = JSON.parse(history);
                messages.forEach(msg => {
                    this.addMessage(msg.content, msg.sender);
                });
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        }
    }

    saveChatHistory() {
        // Save chat history to localStorage
        const messages = Array.from(document.querySelectorAll('.message')).map(msg => ({
            content: msg.querySelector('.message-content').textContent,
            sender: msg.classList.contains('user') ? 'user' : 'ai',
            timestamp: msg.querySelector('.message-timestamp').textContent
        }));
        
        localStorage.setItem('fishermate-chat-history', JSON.stringify(messages));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FisherMateApp();
});

// Add CSS for new chat message styles
const chatStyles = `
    .message {
        display: flex;
        margin-bottom: 1rem;
        padding: 1rem;
        border-radius: 1rem;
        max-width: 80%;
        animation-duration: 0.3s;
    }
    
    .message.user {
        background: var(--gradient-sunset);
        color: white;
        margin-left: auto;
        flex-direction: row-reverse;
    }
    
    .message.ai {
        background: rgba(255,255,255,0.1);
        color: var(--pearl);
        margin-right: auto;
    }
    
    .message.error {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
    }
    
    .message-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 1rem;
        background: var(--gradient-glass);
        backdrop-filter: blur(10px);
    }
    
    .message-content {
        flex: 1;
        line-height: 1.5;
    }
    
    .message-timestamp {
        font-size: 0.75rem;
        opacity: 0.6;
        margin-top: 0.5rem;
    }
    
    .voiceBtn.listening {
        background: var(--coral);
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = chatStyles;
document.head.appendChild(styleSheet);
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const currentWeatherEl = document.getElementById('current-weather');
const forecastEl = document.getElementById('forecast');
const alertsList = document.getElementById('alerts-list');
let map;

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
  initializeChat();
  initializeMap();
  loadLocationWeather();
  loadAlertsAndNews();
});

// Chat functionality
function initializeChat() {
  chatSend.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChatMessage();
  });
}

function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = sender === 'You' ? 'chat-msg user' : 'chat-msg bot';
  msgDiv.textContent = `${sender}: ${text}`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  appendMessage('You', text);
  chatInput.value = '';
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, language: 'en' })
    });
    const data = await res.json();
    appendMessage('Bot', data.response || 'No response');
  } catch (err) {
    appendMessage('Bot', 'Error communicating with server');
    console.error(err);
  }
}

// Weather functionality
function initializeMap() {
  map = L.map('weather-map').setView([20, 77], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function loadLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      fetchCurrentWeather(latitude, longitude);
      fetchForecast(latitude, longitude);
      map.setView([latitude, longitude], 8);
    }, () => {
      // fallback coords
      fetchCurrentWeather(19.0760, 72.8777);
      fetchForecast(19.0760, 72.8777);
    });
  } else {
    fetchCurrentWeather(19.0760, 72.8777);
    fetchForecast(19.0760, 72.8777);
  }
}

async function fetchCurrentWeather(lat, lon) {
  currentWeatherEl.textContent = 'Loading...';
  try {
    const res = await fetch(`/api/weather/current?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    const cw = data.current;
    currentWeatherEl.innerHTML = `
      <strong>${data.location.name}, ${data.location.country}</strong><br>
      ${cw.weather.main} (${cw.weather.description})<br>
      Temp: ${cw.temperature}&deg;C, Humidity: ${cw.humidity}%<br>
      Wind: ${cw.wind.speed} km/h, ${cw.wind.direction_name}<br>
      Tide: High ${data.marine.tide.high}, Low ${data.marine.tide.low}
    `;
  } catch (err) {
    currentWeatherEl.textContent = 'Error loading weather';
    console.error(err);
  }
}

async function fetchForecast(lat, lon) {
  forecastEl.textContent = 'Loading...';
  try {
    const res = await fetch(`/api/weather/forecast?lat=${lat}&lon=${lon}&days=5`);
    const data = await res.json();
    forecastEl.innerHTML = data.forecast.map(day => `
      <div class="forecast-card">
        <strong>${day.date}</strong><br>
        ${day.weather.main}, ${day.weather.description}<br>
        Min: ${day.temperature.min}&deg;C, Max: ${day.temperature.max}&deg;C<br>
      </div>
    `).join('');
  } catch (err) {
    forecastEl.textContent = 'Error loading forecast';
    console.error(err);
  }
}

// Alerts & News
async function loadAlertsAndNews() {
  alertsList.innerHTML = '<li>Loading alerts...</li>';
  let lat = 19.0760, lon = 72.8777;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
      fetchAlerts(lat, lon);
    }, () => fetchAlerts(lat, lon));
  } else {
    fetchAlerts(lat, lon);
  }
  // News not yet available, placeholder
}

async function fetchAlerts(lat, lon) {
  try {
    const res = await fetch(`/api/weather/alerts?lat=${lat}&lon=${lon}`);
    const data = await res.json();
    if (data.alerts && data.alerts.length) {
      alertsList.innerHTML = data.alerts.map(a => `<li>
        <strong>${a.title}</strong>: ${a.description}
      </li>`).join('');
    } else {
      alertsList.innerHTML = '<li>No alerts</li>';
    }
  } catch (err) {
    alertsList.innerHTML = '<li>Error loading alerts</li>';
    console.error(err);
  }
}
