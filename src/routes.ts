import { Router } from "express";
import { saveUser, verificaLogin } from "./controllers/UsersController";

const routes = Router();

routes.post('/auth', verificaLogin)
routes.post('/users', saveUser)


export default routes;