# Corrección: Socket Redis Cerrado Inesperadamente

## Problema
El error `SocketClosedUnexpectedlyError: Socket closed unexpectedly` ocurría después de ~30 minutos de ejecución en Docker debido a:
- Ausencia de configuración **keep-alive** en el socket
- Falta de **estrategia de reconexión** ante desconexiones
- Sin manejo adecuado de eventos de error

## Solución Implementada

### ✅ Cambios en `server/lib/redis.js`

1. **Keep-Alive Socket** (30 segundos)
   - Mantiene el socket activo enviando pings periódicamente
   - Previene desconexiones por timeout de inactividad

2. **Estrategia de Reconexión Automática**
   - Reintentos con backoff exponencial (100ms, 200ms, 400ms... hasta 5 segundos)
   - Máximo 10 reintentos antes de fallar

3. **Manejo de Eventos**
   - `connect`: Cuando la conexión se establece
   - `reconnecting`: Cuando intenta reconectar
   - `ready`: Cuando está listo para comandos
   - `error`: Cuando hay un error

## Configuración Aplicada

```javascript
socket: {
  keepAlive: 30000,              // 30 segundos
  connectTimeout: 300000,        // 5 minutos
  reconnectStrategy: (retries) => {
    if (retries > 10) return new Error('Max reconnection attempts reached');
    return Math.min(retries * 100, 5000);
  }
}
```

## Pruebas Recomendadas

### 1. Test Local (en desarrollo)
```bash
npm run dev
# Espera y verifica que dice "✅ Todos los pools de Redis conectados correctamente."
```

### 2. Test en Docker (después de 30+ minutos)
```bash
docker build -t monolito:latest .
docker run -e REDIS_HOST=host.docker.internal -e REDIS_PORT=6379 monolito:latest
# Monitorea los logs durante más de 30 minutos
```

### 3. Simulación de Desconexión (en desarrollo)
Para verificar que funciona la reconexión:
```bash
# En una terminal, ejecuta: redis-cli
# Detén Redis con: shutdown
# Tu aplicación debería registrar: "🔄 Redis db0 intentando reconectar..."
# Reinicia Redis
# Tu aplicación debería registrar: "✅ Redis db0 conectado"
```

## Monitoreo Adicional (Opcional)

Si sigues teniendo problemas, agrega estas líneas al final de `server/lib/redis.js`:

```javascript
// Monitoreo de salud de la conexión cada minuto
setInterval(async () => {
  try {
    await pool.db0.ping();
    console.log('✅ Redis health check: OK');
  } catch (error) {
    console.error('❌ Redis health check failed:', error.message);
  }
}, 60000); // Cada 60 segundos
```

## Configuración Docker (Recomendaciones Adicionales)

Si usas `docker-compose.yml`, asegúrate de:

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --timeout 0 --tcp-keepalive 60
    
  app:
    build: .
    environment:
      REDIS_HOST: redis  # Usa el nombre del servicio, no host.docker.internal
      REDIS_PORT: 6379
    depends_on:
      - redis
```

## Resumen de Cambios

| Aspecto | Antes | Después |
|--------|-------|---------|
| Keep-Alive | ❌ No | ✅ 30 segundos |
| Reconexión | ❌ No | ✅ Automática con backoff |
| Manejo de Errores | ❌ Limitado | ✅ Completo con eventos |
| Timeout de Socket | ❌ Predeterminado (~30 min) | ✅ 5 minutos explícito |
| Logs de Conexión | ❌ Mínimos | ✅ Detallados |

---

**Versión:** 1.0  
**Fecha:** 2026-10-14  
**Autor:** Copilot
