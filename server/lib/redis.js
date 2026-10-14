import { createClient } from 'redis';
import { ENTORNO } from './config.js';

// Configuración de Redis con opciones de reconexión y keep-alive
const redisConfig = {
  socket: {
    // Keep-alive del socket cada 30 segundos para evitar desconexiones por timeout
    keepAlive: 30000,
    // Timeout de socket a 5 minutos (evita desconexiones prematuras)
    connectTimeout: 300000,
    // Reconnect strategy: intenta reconectar con backoff exponencial
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis: Se alcanzó el máximo de reintentos de reconexión');
        return new Error('Max reconnection attempts reached');
      }
      // Espera progresiva: 100ms, 200ms, 400ms... hasta 5 segundos
      return Math.min(retries * 100, 5000);
    }
  },
  // Timeout de comando
  commandsQueueBehaviour: 'auto'
};

const client0 = createClient({ 
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  ...redisConfig
});

const client1 = createClient({ 
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/1`,
  ...redisConfig
});

// Manejadores de eventos para ambos clientes
[client0, client1].forEach((client, index) => {
  const dbName = index === 0 ? 'db0' : 'db1';
  
  client.on('error', (err) => {
    console.error(`❌ Redis ${dbName} Error:`, err.message);
  });
  
  client.on('connect', () => {
    console.log(`✅ Redis ${dbName} conectado`);
  });
  
  client.on('reconnecting', () => {
    console.warn(`🔄 Redis ${dbName} intentando reconectar...`);
  });
  
  client.on('ready', () => {
    console.log(`✅ Redis ${dbName} listo para comandos`);
  });
});

export const pool = {
    db0: client0.createPool(),
    db1: client1.createPool()
};

// Función para conectar todos los pools al arrancar el monolito
export async function connectAllRedisPools() {
    await Promise.all(
        Object.values(pool).map(p => p.connect())
    );
    console.log('✅ Todos los pools de Redis conectados correctamente.');
}

try {
  await connectAllRedisPools();
  // Comprobamos si Redis responde antes de levantar el servidor HTTP
  const respuesta = await pool.db0.ping(); 
  console.log(`Conexión exitosa con Redis: ${respuesta}`); // Imprime: Conexión exitosa con Redis: PONG
  
  // Aquí levantarías tu servidor (Express, Fastify, etc.)
  // app.listen(3000);
} catch (error) {
  console.error("No se pudo conectar a Redis. Revisa la configuración:", error);
  if (ENTORNO === 'DEV') {
      console.error("Modo DEV: Continuando a pesar del fallo de Redis.");
  } else {
      process.exit(1); // Cerramos la app porque Redis es indispensable
  }
}