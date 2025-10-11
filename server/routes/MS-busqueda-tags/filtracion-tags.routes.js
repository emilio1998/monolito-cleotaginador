import { Router } from "express";

import { holaMundo, filtracionPorPost, listarGruposEtiquetas, listarTags } from "../../controllers/MS-busqueda-tags/filtracion-tags.js";

const filtracion_tags_routes = Router();

filtracion_tags_routes.get("/holaMundo", holaMundo);
filtracion_tags_routes.get("/filtracionPorPost/:id_post", filtracionPorPost);
filtracion_tags_routes.get("/listarGruposEtiquetas", listarGruposEtiquetas);
filtracion_tags_routes.get("/listarTags", listarTags);

export default filtracion_tags_routes;