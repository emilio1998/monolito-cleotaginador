const configuredUrl = process.env.BUSQUEDA_TAGS_URL;
const configuredApiUrlLogin = process.env.API_URL_LOGIN;

export const BUSQUEDA_TAGS_URL = configuredUrl.replace(/\/$/, "");
export const API_URL_LOGIN = configuredApiUrlLogin.replace(/\/$/, "");