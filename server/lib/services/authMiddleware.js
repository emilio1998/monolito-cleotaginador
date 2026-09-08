import {SECRET_KEY} from '../config.js';
import Jwt from 'jsonwebtoken';
import { pool } from '../redis.js';
import { getRefreshToken } from './authMiddleware-services.js';

export const validateJWT = () => async (req, res, next) => {
  try {
    if (!req.headers.accesstoken) {
      return res.status(401).send("Para acceder a esta ruta necesitas un JWT");
    }

    let token = req.headers.accesstoken;

    const secretBytes = Buffer.from(SECRET_KEY, 'base64');

    try {
      const tokenInRedis = await pool.db1.get(`${token}:accessToken`);
      const tokenInRedisParsed = JSON.parse(tokenInRedis);

      if (!tokenInRedisParsed) {
        throw new Error("JWT no válido o expirado.");
      }
      const accessTokenObtained = tokenInRedisParsed.accessToken;
      let dataPayload= Jwt.verify(accessTokenObtained, secretBytes);
      req.idUser = dataPayload.id;
      req.dataPayload = dataPayload;
      // let elUsuario= await pool.query("SELECT * FROM USUARIOS WHERE TOKEN = ?", [token]);
      // if (elUsuario.length==0) {
      //   return res.status(401).send("JWT no válido.");
      // }
      next();
    } catch (errorJWT) {
      console.log("error token: ", errorJWT);

      const tokenInRedis = await pool.db1.get(`${token}:refreshToken`);
      const tokenInRedisParsed = JSON.parse(tokenInRedis);

      if (tokenInRedisParsed && tokenInRedisParsed.refreshToken) {
        const responseRefreshToken = await getRefreshToken(token, tokenInRedisParsed.refreshToken);

        if (responseRefreshToken && responseRefreshToken.accessToken) {
          const jwtData = Jwt.verify(responseRefreshToken.accessToken, secretBytes);
          req.idUser = jwtData.id;
          req.dataPayload = jwtData;

          next();
          return;
        }
      }

      return res.status(401).send("JWT no válido.");
    }
  } catch (err) {
    console.error("Error validando JWT: ", err);
    return res.status(401).send("Error al validar JWT");
  }
};