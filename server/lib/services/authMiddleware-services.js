import axios from "axios";
import { API_URL_LOGIN } from "./serviciosURL.js";

const httpClient = axios.create({
    baseURL: API_URL_LOGIN,
    timeout: 10000,
});

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

export async function getRefreshToken(tokenInRedis, tokenIdValue){
    return requestWithRetry(async () => {
        const response = await httpClient.post(
            "/cleologin/api/v1/auth/refreshToken",
            { keyTokenRedis: tokenInRedis },
            {
                headers: { 
                    'RefreshToken': tokenIdValue
                }
            }
        );
        return response.data;
    });
}