import { Router } from "express";
import filtracion_tags_routes from "./MS-busqueda-tags/filtracion-tags.routes.js";

const router = Router();

router
    .use('/XX3PROJECT/busqueda-tags', filtracion_tags_routes)
    .use('/', (req, res) => {
        return res.json("XX3PROJECT")
    })

export default router;