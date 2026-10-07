import { getGrupos, getPostId, getEtiquetasPorGrupo, 
    getListarTags, getPostsPorGrupo, getPostsPorTag, getImagenesPorPost, getListarTagsPorPost } from "./filtracion-tags-services.js";

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

export const listarPostsPorGrupo = async (req, res) => {
    try {
        const grupos = await getGrupos();
        const obtenerGrupos = grupos.grupos

        const resp = [{ID: 0, title: "TODOS LOS POSTS", color: "#000000", posts: grupos.posts}];

        for (const grupo of obtenerGrupos) {
            grupo.title = grupo.TITULO_GRUPO_TAG;
            delete grupo.TITULO_GRUPO_TAG;
            grupo.color = grupo.COLOR_TEXTO;
            delete grupo.COLOR_TEXTO;
            const posts = await getPostsPorGrupo(grupo.ID);
            resp.push({ ...grupo, posts });
        }
        return res.status(200).send({message: "OK!!!", data: resp})
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio",
        });
    }
}

export const listarTags = async (req, res) => {
    try {
        const tags = await getListarTags();
        return res.status(200).send({message: "OK!!!", data: tags})
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio",
        });
    }
}

export const listarPostsPorTag = async (req, res) => {
    try {
        const {excluirGruposId = ""} = req.body;
        const tags = await getListarTags(excluirGruposId);

        const resp = [];

        resp.push({ID: 0, title: "TODOS LOS POSTS", color: "#000000", posts: await getPostsPorTag(0)});

        for (const tag of tags) {
            const posts = await getPostsPorTag(tag.ID);
            resp.push({ ...tag, posts });
        }

        return res.status(200).send({message: "OK!!!", data: resp})
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio",
        });
    }
}

export const listarImagenesPorPost = async (req, res) => {
    try {
        const { UNICO_ARCHIVO, DATOS_ARCHIVO, ID_POST } = req.body;
        const imagenes = await getImagenesPorPost(UNICO_ARCHIVO, DATOS_ARCHIVO);
        const tags = await getListarTagsPorPost(ID_POST);
        return res.status(200).send({message: "OK!!!", data: imagenes, dataTags: tags})
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({
            message: "Ha ocurrido un error al llamar al microservicio",
        });
    }
}
