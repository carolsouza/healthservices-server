import { Router } from "express";
import {
  getUser,
  getUsers,
  removeUser,
  saveUser,
  updateUser,
  verificaLogin,
} from "./controllers/UsersController";
import { webhookComunication } from "./controllers/WebhookController";

const routes = Router();

//rotas de usuário
routes.post("/auth", verificaLogin);
routes.post("/users", saveUser);
routes.get("/users", getUsers);
routes.get("/users/:id", getUser);
routes.patch("/users/:id", updateUser);
routes.delete("/users/:id", removeUser);

routes.post("/webhook", webhookComunication);
routes.get("/", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "Node Store API",
    version: "0.0.1",
  });
});

export default routes;
