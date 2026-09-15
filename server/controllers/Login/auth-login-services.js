import axios from "axios";
import { API_URL_LOGIN } from "../../lib/services/serviciosURL.js";

const httpClient = axios.create({
    baseURL: API_URL_LOGIN,
    timeout: 120000 // 2 minutos
})

async function requestWithRetry(requestFn, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await requestFn();
        } catch (error) {
            const isRetryable =
                error?.code === "ECONNRESET" ||
                error?.code === "ETIMEDOUT" ||
                error?.message?.includes("socket hang up");

            if (!isRetryable || attempt === retries) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        }
    }
}

export async function autenticar(username, password) {
    const response = await requestWithRetry(() =>
        httpClient.post("/cleologin/api/v1/auth/autenticar", { username, password })
    );
    return response.data;
}

export async function desautenticar() {
    const response = await requestWithRetry(() =>
        httpClient.get("/cleologin/api/v1/auth/logout")
    );
    return response.data;
}