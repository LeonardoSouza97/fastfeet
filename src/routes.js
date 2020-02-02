import { Router } from 'express';
import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';
import RecipientController from './controllers/RecipientController';
import authMiddleware from './middlewares/auth';

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);
routes.put('/users', UserController.update);

export default routes;
