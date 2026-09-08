import { Router } from 'express';

const auth_login_routes = Router();

import { verificarLogin } from '../../controllers/Login/auth-login.js';

import { validateJWT } from '../../lib/services/authMiddleware.js';



auth_login_routes.get('/verificarLogin', validateJWT(), verificarLogin);

export default auth_login_routes;