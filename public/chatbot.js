class PetCareChatbot {
    constructor() {
        this.isOpen = false;
        this.conversationHistory = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.addWelcomeMessage();
    }

    createChatWidget() {
        const chatHTML = `
            <div id="chatbot-container" class="chatbot-container">
                <div id="chat-button" class="chat-button">
                    <span class="chat-icon">💬</span>
                    <span class="chat-text">¿Necesitas ayuda?</span>
                </div>
                
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <span class="chat-avatar">🐾</span>
                            <div>
                                <h4>Asistente PetCare</h4>
                                <span class="status">En línea</span>
                            </div>
                        </div>
                        <button class="close-chat" id="close-chat">✕</button>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages"></div>
                    
                    <div class="quick-actions" id="quick-actions">
                        <button class="quick-btn" data-action="agendar">📅 Agendar Cita</button>
                        <button class="quick-btn" data-action="servicios">🏥 Servicios</button>
                        <button class="quick-btn" data-action="horarios">⏰ Horarios</button>
                        <button class="quick-btn" data-action="emergencia">🚨 Emergencia</button>
                    </div>
                    
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Escribe tu mensaje..." />
                        <button id="send-message">➤</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.getElementById('chat-button').addEventListener('click', () => this.toggleChat());
        document.getElementById('close-chat').addEventListener('click', () => this.toggleChat());
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');
        
        if (this.isOpen) {
            chatWindow.classList.add('active');
            chatButton.style.display = 'none';
        } else {
            chatWindow.classList.remove('active');
            chatButton.style.display = 'flex';
        }
    }

    addWelcomeMessage() {
        this.addBotMessage('¡Hola! 👋 Soy el asistente virtual de PetCare. ¿En qué puedo ayudarte hoy?');
    }

    addBotMessage(text, delay = 0) {
        setTimeout(() => {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message bot-message';
            messageDiv.innerHTML = `
                <div class="message-avatar">🐾</div>
                <div class="message-content">${text}</div>
            `;
            document.getElementById('chat-messages').appendChild(messageDiv);
            this.scrollToBottom();
        }, delay);
    }

    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
        `;
        document.getElementById('chat-messages').appendChild(messageDiv);
        this.scrollToBottom();
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addUserMessage(message);
        input.value = '';
        
        // Mostrar indicador de escritura
        this.showTypingIndicator();
        
        // Enviar mensaje a la IA
        this.sendToAI(message);
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">🐾</div>
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        document.getElementById('chat-messages').appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async sendToAI(message) {
        try {
            const response = await fetch('/api/chatbot/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory
                })
            });

            const data = await response.json();
            
            this.removeTypingIndicator();
            
            if (data.success) {
                this.addBotMessage(data.response);
                
                // Guardar en historial
                this.conversationHistory.push(
                    { role: 'user', content: message },
                    { role: 'assistant', content: data.response }
                );
                
                // Limitar historial a últimos 10 mensajes
                if (this.conversationHistory.length > 10) {
                    this.conversationHistory = this.conversationHistory.slice(-10);
                }
            } else {
                this.addBotMessage('Lo siento, hubo un error. ¿Puedes intentar de nuevo?');
            }
        } catch (error) {
            console.error('Error:', error);
            this.removeTypingIndicator();
            this.addBotMessage('Lo siento, no pude procesar tu mensaje. Por favor intenta de nuevo.');
        }
    }

    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('turno')) {
            this.addBotMessage('¡Perfecto! Para agendar una cita, haz clic en el botón "Agendar Cita" en la parte superior de la página o puedo guiarte paso a paso. ¿Qué prefieres?');
        } else if (lowerMessage.includes('servicio') || lowerMessage.includes('que hacen')) {
            this.addBotMessage('Ofrecemos los siguientes servicios:<br><br>🏥 Consultas generales<br>💉 Vacunación<br>🔬 Laboratorio<br>⚕️ Cirugías<br>🦷 Odontología<br>🚨 Emergencias 24/7<br><br>¿Sobre cuál te gustaría saber más?');
        } else if (lowerMessage.includes('horario') || lowerMessage.includes('hora') || lowerMessage.includes('cuando')) {
            this.addBotMessage('Nuestros horarios son:<br><br>📅 Lunes a Sábado: 8:00 AM - 8:00 PM<br>🚨 Emergencias: 24/7 todos los días<br><br>¿Necesitas agendar una cita?');
        } else if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
            this.addBotMessage('Los precios varían según el servicio. Te recomiendo agendar una cita para una evaluación personalizada. ¿Te gustaría agendar ahora?');
        } else if (lowerMessage.includes('emergencia') || lowerMessage.includes('urgente') || lowerMessage.includes('urgencia')) {
            this.addBotMessage('🚨 Para emergencias, llámanos inmediatamente al:<br><br>📞 +1 (555) 123-4567<br><br>Estamos disponibles 24/7. Si es una emergencia grave, acude directamente a nuestra clínica.');
        } else if (lowerMessage.includes('ubicacion') || lowerMessage.includes('direccion') || lowerMessage.includes('donde')) {
            this.addBotMessage('📍 Nos encontramos en:<br>Av. Principal 123, Ciudad<br><br>📞 Teléfono: +1 (555) 123-4567<br>📧 Email: contacto@petcare.com');
        } else if (lowerMessage.includes('vacuna') || lowerMessage.includes('vacunacion')) {
            this.addBotMessage('Ofrecemos programas completos de vacunación para perros, gatos y otras mascotas. Incluye:<br><br>• Vacunas básicas<br>• Refuerzos anuales<br>• Desparasitación<br>• Certificados oficiales<br><br>¿Quieres agendar una cita de vacunación?');
        } else if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
            this.addBotMessage('¡De nada! 😊 Estoy aquí para ayudarte. Si tienes más preguntas, no dudes en escribirme.');
        } else if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
            this.addBotMessage('¡Hola! 👋 ¿En qué puedo ayudarte hoy? Puedo darte información sobre servicios, horarios, o ayudarte a agendar una cita.');
        } else {
            this.addBotMessage('Entiendo tu consulta. Para ayudarte mejor, puedes:<br><br>📅 Agendar una cita<br>📞 Llamarnos al +1 (555) 123-4567<br>📧 Escribirnos a contacto@petcare.com<br><br>¿Hay algo específico en lo que pueda ayudarte?');
        }
    }

    handleQuickAction(action) {
        switch(action) {
            case 'agendar':
                this.addUserMessage('Quiero agendar una cita');
                this.sendToAI('Quiero agendar una cita para mi mascota');
                break;
            case 'servicios':
                this.addUserMessage('¿Qué servicios ofrecen?');
                this.sendToAI('¿Qué servicios veterinarios ofrecen?');
                break;
            case 'horarios':
                this.addUserMessage('¿Cuáles son los horarios?');
                this.sendToAI('¿Cuáles son los horarios de atención?');
                break;
            case 'emergencia':
                this.addUserMessage('Tengo una emergencia');
                this.sendToAI('Tengo una emergencia con mi mascota, ¿qué debo hacer?');
                break;
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Inicializar el chatbot cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    new PetCareChatbot();
});
