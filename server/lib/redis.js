import { createClientPool } from 'redis';
import { ENTORNO } from './config.js';

// Create a pool of connections
// export const pool = await createClientPool({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
// })
// .on('error', (err) => console.error('Redis Pool Error', err))
// .connect();

export const pool = {
    db0: createClientPool({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`
    }),
    db1: createClientPool({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/1`
    })
}

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