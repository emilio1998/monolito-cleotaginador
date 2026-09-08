const configuredUrl = process.env.BUSQUEDA_TAGS_URL || "http://127.0.0.1:16000";
const configuredApiUrlLogin = process.env.API_URL_LOGIN || "http://127.0.0.1:8082";

export const BUSQUEDA_TAGS_URL = configuredUrl.replace(/\/$/, "");
export const API_URL_LOGIN = configuredApiUrlLogin.replace(/\/$/, "");