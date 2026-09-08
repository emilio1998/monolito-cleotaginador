import { Router } from 'express';

const auth_login_routes = Router();

import { verificarLogin } from '../../controllers/Login/auth-login.js';


auth_login_routes.post('/verificarLogin', verificarLogin);

export default auth_login_routes;