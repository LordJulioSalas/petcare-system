# Configuración del Chatbot con IA

El chatbot puede funcionar con IA real usando APIs gratuitas o con respuestas predefinidas.

## Opción 1: Groq (Recomendado - Rápido y Gratuito)

1. Crea una cuenta en https://console.groq.com
2. Ve a "API Keys" y crea una nueva key
3. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edita `.env` y agrega tu API key:
   ```
   AI_PROVIDER=groq
   GROQ_API_KEY=tu_api_key_aqui
   ```

**Ventajas:**
- Muy rápido (respuestas en 1-2 segundos)
- Gratuito con límites generosos
- Modelo Llama 3.1 70B (muy potente)

## Opción 2: Hugging Face (Alternativa Gratuita)

1. Crea una cuenta en https://huggingface.co
2. Ve a Settings > Access Tokens
3. Crea un token de tipo "Read"
4. Edita `.env`:
   ```
   AI_PROVIDER=huggingface
   HF_API_KEY=tu_api_key_aqui
   ```

**Ventajas:**
- Completamente gratuito
- Múltiples modelos disponibles
- Sin límites estrictos

## Opción 3: Sin API Key (Fallback)

Si no configuras ninguna API key, el chatbot funcionará con respuestas predefinidas inteligentes.

## Instalación

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Reinicia el servidor:
   ```bash
   npm start
   ```

## Uso

El chatbot aparecerá en la esquina inferior derecha de la página principal. Puede responder preguntas sobre:

- Servicios veterinarios
- Horarios de atención
- Agendar citas
- Emergencias
- Precios
- Ubicación
- Cuidado de mascotas
- Y mucho más...

## Características

- Conversación natural con IA
- Memoria de conversación (últimos 10 mensajes)
- Respuestas contextuales
- Botones de acción rápida
- Indicador de escritura
- Diseño responsive

## Modelos Disponibles

### Groq:
- llama-3.1-70b-versatile (Recomendado)
- mixtral-8x7b-32768
- gemma-7b-it

### Hugging Face:
- mistralai/Mistral-7B-Instruct-v0.2
- meta-llama/Llama-2-7b-chat-hf
- google/flan-t5-xxl

## Personalización

Puedes modificar el `SYSTEM_PROMPT` en `src/controllers/chatbotController.js` para cambiar el comportamiento del chatbot.
