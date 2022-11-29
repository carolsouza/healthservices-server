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
import { getConsultas, saveConsultas } from "./controllers/ConsultaController";
import { getAnamnese, saveAnamnese } from "./controllers/AnamneseController";
import { getMetabaseData } from "./controllers/MetabaseController";

const routes = Router();

//rotas de usuário
routes.post("/auth", verificaLogin);
routes.post("/users", saveUser);
routes.get("/users", getUsers);
routes.get("/users/:id", getUser);
routes.patch("/users/:id", updateUser);
routes.delete("/users/:id", removeUser);

//rotas de consultas
routes.get("/consultas", getConsultas);
routes.post("/consultas", saveConsultas);

//rotas de anamnese
routes.get("/anamnese", getAnamnese);
routes.post("/anamnese", saveAnamnese);

//rotas do metabase
routes.get("/metabase", getMetabaseData);

routes.post("/webhook", webhookComunication);
routes.get("/", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "Node Store API",
    version: "0.0.1",
  });
});

export default routes;
