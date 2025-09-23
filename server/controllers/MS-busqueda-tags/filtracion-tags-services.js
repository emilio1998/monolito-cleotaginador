import axios from "axios";
import { BUSQUEDA_TAGS_URL } from "../../lib/services/serviciosURL.js";

export async function getPostId(id_post) {
    const response = await axios.get(`${BUSQUEDA_TAGS_URL}/busqueda-tags/filtracion/mostrarPost/${id_post}`)

    return response.data.data;
}