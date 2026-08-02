const configuredUrl = process.env.BUSQUEDA_TAGS_URL || "http://127.0.0.1:16000";

export const BUSQUEDA_TAGS_URL = configuredUrl.replace(/\/$/, "");