import { Router } from 'express';
import { webhookComunication } from './controllers/webhookController';

const routes = Router();

// routes.post('/auth', verificaLogin)
// routes.post('/users', saveUser)
routes.post('/webhook', webhookComunication);
routes.get('/', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Node Store API',
    version: '0.0.1',
  });
});

export default routes;