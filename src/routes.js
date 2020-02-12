import { Router } from 'express';
import multer from 'multer';
import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';
import RecipientController from './controllers/RecipientController';
import authMiddleware from './middlewares/auth';
import FileController from './controllers/FileController';
import DeliverymanController from './controllers/DeliverymanController';
import DeliveryController from './controllers/DeliveryController';
import DeliveriesClosedController from './controllers/DeliveriesClosedController';
import CheckInDeliveriesController from './controllers/CheckInDeliveriesController';
import ClosedDeliveriesController from './controllers/ClosedDeliveriesController';
import DeliveriesProblemController from './controllers/DeliveriesProblemController';
import CancelProblemController from './controllers/CancelProblemController';
import multerConfig from './config/multer';

const upload = multer(multerConfig);

const routes = Router();

routes.put('/users', UserController.update);

routes.post('/uploads', upload.single('file'), FileController.store);

routes.get(
  '/deliveryman/:deliveryman_id/deliveries',
  DeliveriesClosedController.index
);

routes.post('/delivery/:id/checkIn', CheckInDeliveriesController.update);

routes.post('/delivery/:id/closed', ClosedDeliveriesController.update);

routes.get('/delivery-problems', DeliveriesProblemController.index);
routes.get('/delivery/:id/problems', DeliveriesProblemController.show);
routes.post('/delivery/:id/problems', DeliveriesProblemController.store);

routes.delete('/problem/:id/cancel-delivery', CancelProblemController.delete);

routes.use(authMiddleware);

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

export default routes;
