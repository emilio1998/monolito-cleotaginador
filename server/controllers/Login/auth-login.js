import { Redis } from 'ioredis';

const redis = new Redis();

export const verificarLogin = async (req, res) => {

    try {
        return res.status(200).json({ message: "OK" });
    } catch (err) {
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio del login",
            error: err.message,
        });
    }
}