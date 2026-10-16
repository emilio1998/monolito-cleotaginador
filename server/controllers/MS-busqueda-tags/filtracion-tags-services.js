import axios from "axios";
import { BUSQUEDA_TAGS_URL } from "../../lib/services/serviciosURL.js";

const httpClient = axios.create({
    baseURL: BUSQUEDA_TAGS_URL,
    timeout: 30000,
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

export async function getPostId(id_post) {
    const response = await requestWithRetry(() =>
        httpClient.get(`/busqueda-tags/filtracion/mostrarPostDetalles/${id_post}`)
    );

    return response.data.data;
}

export async function getGrupos() {
    const response = await requestWithRetry(() =>
        httpClient.get("/busqueda-tags/filtracion/listarGruposTags")
    );
    return response.data;
}

export async function getEtiquetasPorGrupo(id_grupo) {
    const response = await requestWithRetry(() =>
        httpClient.get(`/busqueda-tags/filtracion/listarEtiquetasDinamico/${id_grupo}`)
    );
    return response.data.data;
}

export async function getPostsPorGrupo(id_grupo) {
    const response = await requestWithRetry(() =>
        httpClient.get(`/busqueda-tags/filtracion/listarPostsPorGrupo/${id_grupo}`)
    );
    return response.data.data;
}

export async function getPostsPorTag(id_tag) {
    const response = await requestWithRetry(() =>
        httpClient.get(`/busqueda-tags/filtracion/listarPostsPorTag/${id_tag}`)
    );
    return response.data.data;
}

export async function getImagenesPorPost(unicoArchivo, datosArchivo) {
    const response = await requestWithRetry(() =>
        httpClient.post(`/busqueda-tags/filtracion/listarImagenesPorPosts`, { UNICO_ARCHIVO: unicoArchivo, DATOS_ARCHIVO: datosArchivo })
    );
    return response.data.data;
}

export async function getListarTags(excluirGruposId = "") {
    const response = await requestWithRetry(() =>
        httpClient.post("/busqueda-tags/filtracion/listarTags", { excluirGrupos: excluirGruposId })
    );
    return response.data.data;
}

export async function getListarTagsPorPost(id_post) {
    const response = await requestWithRetry(() =>
        httpClient.get(`/busqueda-tags/filtracion/listarTagsPorPost/${id_post}`)
    );
    return response.data.data;
}