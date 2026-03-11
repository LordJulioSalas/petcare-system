// Controlador del chatbot con IA

// Configuración - Puedes usar Groq (más rápido) o Hugging Face
const AI_PROVIDER = process.env.AI_PROVIDER || 'groq';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const HF_API_KEY = process.env.HF_API_KEY || '';

// Intentar importar node-fetch solo si está disponible
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  console.log('node-fetch no disponible, usando modo fallback');
}

const SYSTEM_PROMPT = `Eres un asistente virtual profesional de PetCare, una clínica veterinaria de excelencia. Tu objetivo es ayudar a los clientes con información sobre servicios, agendar citas y responder preguntas sobre el cuidado de mascotas.

INFORMACIÓN DE LA CLÍNICA:
- Nombre: PetCare Clínica Veterinaria
- Experiencia: Más de 15 años
- Horario: Lunes a Sábado de 8:00 AM a 8:00 PM
- Emergencias: 24/7 todos los días
- Teléfono: +1 (555) 123-4567
- Email: contacto@petcare.com
- Dirección: Av. Principal 123, Ciudad

SERVICIOS:
1. Consultas Generales - Exámenes completos y diagnósticos
2. Vacunación - Programas personalizados
3. Laboratorio - Análisis clínicos rápidos
4. Cirugías - Procedimientos con equipamiento moderno
5. Odontología - Limpieza dental y tratamientos
6. Emergencias 24/7 - Atención de urgencias

INSTRUCCIONES:
- Sé amable, profesional y empático
- Responde en español de forma clara y concisa
- Si te preguntan sobre agendar citas, menciona que pueden hacerlo en la página
- Para emergencias, indica que llamen al teléfono inmediatamente
- Proporciona información precisa sobre servicios y horarios
- Si no sabes algo, sé honesto y sugiere contactar directamente
- Usa emojis ocasionalmente para ser más amigable (🐾, 🏥, 💉, etc.)
- Mantén respuestas cortas (máximo 3-4 líneas)`;

async function chatWithGroq(message, conversationHistory = []) {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Modelo rápido y potente
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return data.choices[0].message.content;
    }
    
    throw new Error('No response from Groq');
  } catch (error) {
    console.error('Groq API Error:', error);
    throw error;
  }
}

async function chatWithHuggingFace(message) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `${SYSTEM_PROMPT}\n\nUsuario: ${message}\nAsistente:`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    const data = await response.json();
    
    if (data[0] && data[0].generated_text) {
      return data[0].generated_text.trim();
    }
    
    throw new Error('No response from Hugging Face');
  } catch (error) {
    console.error('Hugging Face API Error:', error);
    throw error;
  }
}

// Fallback con respuestas predefinidas mejoradas
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Respuestas sobre salud de mascotas
  if (lowerMessage.includes('fiebre') || lowerMessage.includes('temperatura')) {
    return 'Para saber si tu perro tiene fiebre: 🌡️\n\n1. Temperatura normal: 38-39°C\n2. Síntomas: nariz seca y caliente, letargo, pérdida de apetito\n3. Usa un termómetro rectal\n4. Si supera 39.5°C, es urgente\n\n¿Necesitas agendar una consulta de emergencia?';
  }
  
  if (lowerMessage.includes('vomit') || lowerMessage.includes('vómito')) {
    return 'El vómito puede ser por varias razones: 🤢\n\n• Cambio de dieta\n• Comer muy rápido\n• Parásitos\n• Enfermedad\n\nSi vomita más de 2 veces o hay sangre, es urgente. ¿Quieres agendar una cita?';
  }
  
  if (lowerMessage.includes('vacuna') || lowerMessage.includes('vacunación')) {
    return 'Calendario de vacunación: 💉\n\nCachorros:\n• 6-8 semanas: Primera dosis\n• 10-12 semanas: Segunda dosis\n• 14-16 semanas: Tercera dosis\n• Refuerzo anual\n\n¿Quieres agendar vacunación?';
  }
  
  if (lowerMessage.includes('come') || lowerMessage.includes('apetito') || lowerMessage.includes('comer')) {
    return 'Pérdida de apetito puede indicar: 🍽️\n\n• Estrés o ansiedad\n• Problemas dentales\n• Enfermedad\n• Cambio de ambiente\n\nSi dura más de 24 horas, agenda una consulta. ¿Te ayudo?';
  }
  
  if (lowerMessage.includes('pulga') || lowerMessage.includes('garrapata') || lowerMessage.includes('parásito')) {
    return 'Prevención de parásitos: 🐛\n\n• Desparasitación cada 3 meses\n• Pipetas o collares antipulgas\n• Limpieza regular del hogar\n• Revisión mensual\n\nOfrecemos tratamientos preventivos. ¿Agendamos?';
  }
  
  if (lowerMessage.includes('cachorro') || lowerMessage.includes('bebe')) {
    return 'Cuidados para cachorros: 🐕\n\n• Alimentación 3-4 veces al día\n• Vacunación completa\n• Socialización temprana\n• Visitas veterinarias regulares\n\n¿Necesitas una consulta para tu cachorro?';
  }
  
  if (lowerMessage.includes('emergencia') || lowerMessage.includes('urgente') || lowerMessage.includes('urgencia')) {
    return '🚨 Para emergencias, llama inmediatamente:\n\n📞 +1 (555) 123-4567\n\nEstamos disponibles 24/7. Si es grave, acude directamente a nuestra clínica en Av. Principal 123.';
  }
  
  if (lowerMessage.includes('cita') || lowerMessage.includes('agendar') || lowerMessage.includes('turno')) {
    return '¡Perfecto! Para agendar una cita: 📅\n\n1. Haz clic en "Agendar Cita"\n2. Completa los datos de tu mascota\n3. Selecciona fecha y hora\n\n¿Te abro el formulario?';
  }
  
  if (lowerMessage.includes('servicio') || lowerMessage.includes('que hacen')) {
    return 'Nuestros servicios: 🏥\n\n• Consultas generales\n• Vacunación\n• Laboratorio\n• Cirugías\n• Odontología\n• Emergencias 24/7\n\n¿Sobre cuál quieres saber más?';
  }
  
  if (lowerMessage.includes('horario') || lowerMessage.includes('hora') || lowerMessage.includes('cuando')) {
    return 'Horarios de atención: ⏰\n\n📅 Lunes a Sábado: 8:00 AM - 8:00 PM\n🚨 Emergencias: 24/7\n\n¿Necesitas agendar una cita?';
  }
  
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
    return 'Los precios varían según el servicio: 💰\n\nConsulta general: Desde $30\nVacunación: Desde $25\nCirugías: Consultar\n\nAgenda una evaluación para un presupuesto exacto.';
  }
  
  if (lowerMessage.includes('ubicacion') || lowerMessage.includes('direccion') || lowerMessage.includes('donde')) {
    return '📍 Ubicación:\n\nAv. Principal 123, Ciudad\n📞 +1 (555) 123-4567\n📧 contacto@petcare.com\n\nEstamos cerca del centro. ¿Necesitas indicaciones?';
  }
  
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thank')) {
    return '¡De nada! 😊 Estoy aquí para ayudarte. Si tienes más preguntas sobre el cuidado de tu mascota, no dudes en escribirme.';
  }
  
  if (lowerMessage.includes('hola') || lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
    return '¡Hola! 👋 Soy el asistente de PetCare. Puedo ayudarte con:\n\n• Información sobre servicios\n• Agendar citas\n• Consejos de salud\n• Horarios y ubicación\n\n¿En qué te ayudo?';
  }

  // Respuesta por defecto
  return 'Entiendo tu consulta. 🐾\n\nPuedo ayudarte con:\n• Agendar citas\n• Información de servicios\n• Consejos de salud\n• Emergencias\n\n¿Qué necesitas saber?';
}

const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mensaje requerido' 
      });
    }

    let response;

    // Intentar usar IA si hay API key configurada y fetch disponible
    if (fetch && AI_PROVIDER === 'groq' && GROQ_API_KEY) {
      try {
        response = await chatWithGroq(message, history);
      } catch (error) {
        console.log('Groq failed, using fallback:', error.message);
        response = getFallbackResponse(message);
      }
    } else if (fetch && AI_PROVIDER === 'huggingface' && HF_API_KEY) {
      try {
        response = await chatWithHuggingFace(message);
      } catch (error) {
        console.log('Hugging Face failed, using fallback:', error.message);
        response = getFallbackResponse(message);
      }
    } else {
      // Sin API key o sin fetch, usar respuestas predefinidas mejoradas
      response = getFallbackResponse(message);
    }

    res.json({ 
      success: true, 
      response: response,
      provider: (fetch && (GROQ_API_KEY || HF_API_KEY)) ? AI_PROVIDER : 'fallback'
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al procesar el mensaje',
      response: getFallbackResponse(req.body.message || '')
    });
  }
};

module.exports = {
  chat
};
