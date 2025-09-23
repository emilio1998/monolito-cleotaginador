import { Router } from "express";

import { holaMundo, filtracionPorPost } from "../../controllers/MS-busqueda-tags/filtracion-tags.js";

const filtracion_tags_routes = Router();

filtracion_tags_routes.get("/holaMundo", holaMundo);
filtracion_tags_routes.get("/filtracionPorPost/:id_post", filtracionPorPost)

export default filtracion_tags_routes;