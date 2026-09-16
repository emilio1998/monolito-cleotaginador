import { autenticar, desautenticar } from './auth-login-services.js';
import { pool } from '../../lib/redis.js'
import Jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../lib/config.js';

export const verificarLogin = async (req, res) => {

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const authResponse = await autenticar(username, password);

        const resp = authResponse.Respuesta
        const status = authResponse.status;

        //Obtener JWT
        const jwt = resp?.accessToken;
        const tokenInRedis = await pool.db1.get(`${jwt}:accessToken`);
        const tokenInRedisParsed = JSON.parse(tokenInRedis);

        if (!tokenInRedisParsed) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const secretBytes = Buffer.from(SECRET_KEY, 'base64');

        const accesstoken = tokenInRedisParsed?.accessToken;
        let dataPayload = Jwt.verify(accesstoken, secretBytes);

        const datosUsuario = {
            id: dataPayload.id,
            nickname: dataPayload.nickname,
            roles: dataPayload.roles,
            nombre1: dataPayload.nombre1,
            apellido1: dataPayload.apellido1,
            nombre2: dataPayload.nombre2,
            apellido2: dataPayload.apellido2,
            fechaNacimiento: dataPayload.fechaNacimiento
        }

        resp.data = datosUsuario;

        return res.status(status).json(resp);
    } catch (err) {

        if (!err.response) {
            return res.status(500).json({
                message: err.message,
                error: err.stack,
                status: 500
            });
        }

        const errorResponse = err.response.data;

        return res.status(err.status).json({
            message: err.message,
            error: errorResponse.Respuesta,
            status: err.status
        });
    }
}

export const cerrarSesion = async (req, res) => {
    try {
        const logoutResponse = await desautenticar();

        const resp = logoutResponse.Respuesta;
        const status = logoutResponse.status;

        return res.status(status).json(resp);
    } catch (err) {
        const errorResponse = err.response.data;

        return res.status(err.status).json({
            message: err.message,
            error: errorResponse.Respuesta,
            status: err.status
        });
    }
}