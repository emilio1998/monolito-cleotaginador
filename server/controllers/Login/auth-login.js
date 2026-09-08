import { autenticar } from './auth-login-services.js';

export const verificarLogin = async (req, res) => {

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const authResponse = await autenticar(username, password);

        const resp = authResponse.Respuesta
        const status = authResponse.status;

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