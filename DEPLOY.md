# Guía de Despliegue en Vercel

## Estado Actual
✅ Todo el sistema usa MongoDB Atlas (persistencia permanente)
✅ No hay referencias a localhost
✅ Todos los controladores convertidos a MongoDB

## Variables de Entorno Requeridas en Vercel

Asegúrate de tener estas 3 variables configuradas en Vercel:

1. **MONGODB_URI**
   - Tu connection string de MongoDB Atlas
   - Formato: `mongodb+srv://usuario:password@cluster.mongodb.net/database`

2. **AI_PROVIDER**
   - Valor: `groq`

3. **GROQ_API_KEY**
   - Tu API key de Groq (obtener en https://console.groq.com)

## Cómo Configurar Variables en Vercel

1. Ve a https://vercel.com
2. Selecciona tu proyecto "petcare-system"
3. Click en "Settings"
4. Click en "Environment Variables"
5. Agrega cada variable con los valores de arriba
6. Selecciona: Production, Preview, Development
7. Click "Save"

## Desplegar Cambios

```bash
cd pet-appointment-system
git add .
git commit -m "Convert all controllers to MongoDB"
git push
```

Vercel automáticamente redesplega en 1-2 minutos.

## Verificar Despliegue

1. Abre: https://petcare-system-lordjuliosalas-projects.vercel.app
2. Prueba crear una cita
3. Verifica que los datos persistan después de recargar la página

## Usuarios de Prueba

Los usuarios se crean automáticamente en MongoDB la primera vez:

- **Admin**: admin / admin123
- **Recepcionista**: recepcion1 / recep123
- **Asistente**: asistente1 / asist123
- **Veterinario 1**: vet1 / vet123
- **Veterinario 2**: vet2 / vet123

## Estructura de Base de Datos

### Colecciones en MongoDB:
- `pets` - Mascotas
- `appointments` - Citas
- `users` - Usuarios del sistema
- `sessions` - Sesiones de login (expiran en 24h)
- `medicalrecords` - Historias clínicas
- `vitalsigns` - Signos vitales

## Solución de Problemas

### Error 500 en /api/pets
- Verifica que MONGODB_URI esté configurado en Vercel
- Revisa los logs en Vercel > Deployments > [último deploy] > Runtime Logs

### Datos no persisten
- Confirma que la conexión a MongoDB sea exitosa
- Revisa los logs del servidor para errores de conexión

### Chatbot no responde
- Verifica que GROQ_API_KEY esté configurado
- El chatbot tiene respuestas predefinidas como fallback

## Próximos Pasos

- [ ] Implementar dashboard de recepcionista
- [ ] Implementar dashboard de asistente veterinario
- [ ] Implementar dashboard de veterinario
- [ ] Agregar dominio personalizado .com
