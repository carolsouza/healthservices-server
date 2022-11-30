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
import {
  getConsultasByEmail,
  getConsultasById,
  saveConsultas,
  updateStatus,
} from "./controllers/ConsultaController";
import { getAnamnese, saveAnamnese } from "./controllers/AnamneseController";
import { getAnalysis, getMetabaseData } from "./controllers/MetabaseController";

const routes = Router();

//rotas de usuário
routes.post("/auth", verificaLogin);
routes.post("/users", saveUser);
routes.get("/users", getUsers);
routes.get("/users/:id", getUser);
routes.patch("/users/:id", updateUser);
routes.delete("/users/:id", removeUser);

//rotas de consultas
routes.get("/consultas-email", getConsultasByEmail);
routes.get("/consultas", getConsultasById);
routes.post("/consultas", saveConsultas);
routes.patch("/consultas/:id", updateStatus);

//rotas de anamnese
routes.get("/anamnese", getAnamnese);
routes.post("/anamnese", saveAnamnese);

//rotas do metabase
routes.get("/metabase", getMetabaseData);
routes.get("/analysis", getAnalysis);

routes.post("/webhook", webhookComunication);
routes.get("/", (req, res) => {
  res.status(200).send({
    success: "true",
    message: "Node Store API",
    version: "0.0.1",
  });
});

export default routes;
