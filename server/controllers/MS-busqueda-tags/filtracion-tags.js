import { getGrupos, getPostId, getEtiquetasPorGrupo } from "./filtracion-tags-services.js";

export const holaMundo = async (req, res) => {
    try {
        return res.status(200).send({message: "HOLA MUNDO!!!"})
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio",
        });
    }
}

export const filtracionPorPost = async (req, res) => {
    try {
        const {id_post} = req.params;

        const post = await getPostId(id_post);
        return res.status(200).send({message: "OK!!!", data: post})
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio",
        });
    }
}

export const listarGruposEtiquetas = async (req, res) => {
    try {
        const grupos = await getGrupos();

        const resp = [];

        for (const grupo of grupos) {
            grupo.title = grupo.TITULO_GRUPO_TAG;
            delete grupo.TITULO_GRUPO_TAG;
            grupo.color = grupo.COLOR_TEXTO;
            delete grupo.COLOR_TEXTO;
            const etiquetas = await getEtiquetasPorGrupo(grupo.ID);
            resp.push({ ...grupo, etiquetas });
        }

        return res.status(200).send({message: "OK!!!", data: resp})
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio",
        });
    }
}
