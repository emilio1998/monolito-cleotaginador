import { Router } from 'express';

const auth_login_routes = Router();

import { verificarLogin, cerrarSesion } from '../../controllers/Login/auth-login.js';


auth_login_routes.post('/verificarLogin', verificarLogin);
auth_login_routes.get('/cerrarSesion', cerrarSesion);

export default auth_login_routes;