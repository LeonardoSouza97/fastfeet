import { Router } from 'express';
import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';
import authMiddleware from './middlewares/auth';

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
