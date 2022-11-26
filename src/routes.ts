import { Router } from 'express';
import {
  getUser,
  getUsers,
  removeUser,
  saveUser,
  updateUser,
  verificaLogin,
} from './controllers/UsersController';
import {
  removeTriagem,
  getTriagem,
  getTriagens,
  saveTriagem,
} from './controllers/TriagensController';
import { webhookComunication } from './controllers/webhookController';

const routes = Router();

//rotas de usuário
routes.post('/auth', verificaLogin);
routes.post('/users', saveUser);
routes.get('/users', getUsers);
routes.get('/users/:id', getUser);
routes.patch('/users/:id', updateUser);
routes.delete('/users/:id', removeUser);

routes.post('/webhook', webhookComunication);
routes.get('/', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Node Store API',
    version: '0.0.1',
  });
});

//rotas de triagem
routes.post('/triagem', saveTriagem);
routes.get('/triagem', getTriagens);
routes.get('/triagem/:id', getTriagem);
routes.delete('/triagem/:id', removeTriagem);

export default routes;
