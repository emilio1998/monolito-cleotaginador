import { getPostId } from "./filtracion-tags-services.js";

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