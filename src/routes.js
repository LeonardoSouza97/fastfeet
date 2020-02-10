import { Router } from 'express';
import multer from 'multer';
import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';
import RecipientController from './controllers/RecipientController';
import authMiddleware from './middlewares/auth';
import FileController from './controllers/FileController';
import DeliverymanController from './controllers/DeliverymanController';
import DeliveryController from './controllers/DeliveryController';
import multerConfig from './config/multer';

const upload = multer(multerConfig);

const routes = Router();

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);
routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

// routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
// routes.put('/delivery', DeliveryController.update);
// routes.delete('/delivery/:id', DeliveryController.delete);

routes.put('/users', UserController.update);

routes.post('/uploads', upload.single('file'), FileController.store);

export default routes;
