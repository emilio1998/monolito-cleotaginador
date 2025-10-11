import axios from "axios";
import { BUSQUEDA_TAGS_URL } from "../../lib/services/serviciosURL.js";

export async function getPostId(id_post) {
    const response = await axios.get(`${BUSQUEDA_TAGS_URL}/busqueda-tags/filtracion/mostrarPostDetalles/${id_post}`)

    return response.data.data;
}

export async function getGrupos() {
    const response = await axios.get(`${BUSQUEDA_TAGS_URL}/busqueda-tags/filtracion/listarGruposTags`)
    return response.data.grupos;
}

export async function getEtiquetasPorGrupo(id_grupo) {
    const response = await axios.get(`${BUSQUEDA_TAGS_URL}/busqueda-tags/filtracion/listarEtiquetasDinamico/${id_grupo}`)
    return response.data.data;
}

export async function getListarTags() {
    const response = await axios.get(`${BUSQUEDA_TAGS_URL}/busqueda-tags/filtracion/listarTags`)
    return response.data.data;
}