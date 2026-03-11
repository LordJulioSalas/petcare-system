# 🚀 Guía de Despliegue en Vercel

## Paso 1: Configurar MongoDB Atlas (5 minutos)

1. Ve a https://www.mongodb.com/cloud/atlas/register
2. Crea una cuenta gratis
3. Crea un nuevo proyecto
4. Crea un cluster M0 (gratis)
5. En "Security" → "Database Access":
   - Crea un usuario con contraseña
   - Guarda el usuario y contraseña
6. En "Security" → "Network Access":
   - Haz clic en "Add IP Address"
   - Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
7. En "Deployment" → "Database":
   - Haz clic en "Connect"
   - Selecciona "Connect your application"
   - Copia la connection string
   - Reemplaza `<password>` con tu contraseña

Tu connection string se verá así:
```
mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/petcare?retryWrites=true&w=majority
```

## Paso 2: Subir a GitHub (3 minutos)

1. Crea un repositorio en GitHub (https://github.com/new)
2. En tu terminal, ejecuta:

```bash
cd pet-appointment-system
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

## Paso 3: Desplegar en Vercel (2 minutos)

1. Ve a https://vercel.com/signup
2. Inicia sesión con GitHub
3. Haz clic en "Add New Project"
4. Importa tu repositorio de GitHub
5. En "Environment Variables", agrega:
   - `MONGODB_URI`: Tu connection string de MongoDB
   - `GROQ_API_KEY`: Tu API key de Groq (opcional)
   - `AI_PROVIDER`: groq
6. Haz clic en "Deploy"

¡Listo! Tu sitio estará en: `https://tu-proyecto.vercel.app`

## Paso 4: Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto
2. Settings → Domains
3. Agrega tu dominio personalizado

## Actualizar el Proyecto

Cada vez que hagas cambios y los subas a GitHub:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Vercel automáticamente desplegará los cambios.

## Variables de Entorno en Vercel

Asegúrate de configurar estas variables en Vercel:

- `MONGODB_URI`: Connection string de MongoDB Atlas
- `GROQ_API_KEY`: API key de Groq (opcional)
- `AI_PROVIDER`: groq o huggingface
- `NODE_ENV`: production

## Solución de Problemas

### Error de conexión a MongoDB
- Verifica que la IP 0.0.0.0/0 esté permitida en Network Access
- Verifica que el usuario y contraseña sean correctos
- Verifica que el connection string esté completo

### El chatbot no responde
- Verifica que GROQ_API_KEY esté configurada
- El chatbot funcionará con respuestas predefinidas si no hay API key

### Cambios no se reflejan
- Espera 1-2 minutos después del deploy
- Limpia el caché del navegador (Ctrl + Shift + R)
