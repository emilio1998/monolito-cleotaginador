import { Router } from "express";
import filtracion_tags_routes from "./MS-busqueda-tags/filtracion-tags.routes.js";
import auth_login_routes from "./Login/auth-login.routes.js";
import filtracion_posts_routes from "./Monolito/filtracion-posts.routes.js";

const router = Router();

router
    .use('/XX3PROJECT/busqueda-tags', filtracion_tags_routes)
    .use('/XX3PROJECT/login', auth_login_routes)
    .use('/XX3PROJECT/monolito', filtracion_posts_routes)

    .use('/', (req, res) => {
        return res.json("XX3PROJECT")
    })

export default router;