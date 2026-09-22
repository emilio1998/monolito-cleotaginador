import { Router } from 'express';
import { listarPosts } from '../../controllers/Monolito/filtracion-posts.js';

const router = Router();

router.get('/posts', listarPosts);

export default router;