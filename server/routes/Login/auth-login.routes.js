import { Router } from 'express';

const auth_login_routes = Router();

import { verificarLogin, cerrarSesion, sigueSesion } from '../../controllers/Login/auth-login.js';
import { validateJWT } from '../../lib/services/authMiddleware.js';


auth_login_routes.post('/verificarLogin', verificarLogin);
auth_login_routes.get('/cerrarSesion', cerrarSesion);
auth_login_routes.get('/sigueSesion', validateJWT(), sigueSesion);

export default auth_login_routes;