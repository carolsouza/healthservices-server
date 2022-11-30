import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Consulta } from "../entity/Consulta";

export const getConsultasByEmail = async (
  request: Request,
  response: Response
) => {
  const { email } = request.query;
  // console.log(request.query);

  // console.log(email);

  let consultas;

  if (email !== "") {
    consultas = await getRepository(Consulta).find({
      email: email.toString(),
    });
  }

  // console.log(consultas);
  if (consultas) {
    return response.json(consultas);
  } else {
    return response.status(404).send("Nenhuma consulta encontrada");
  }
};

export const getConsultasById = async (
  request: Request,
  response: Response
) => {
  const { id } = request.query;
  const { userId } = request.query;
  // console.log(request.query);

  // console.log(id);

  if (id !== "") {
    const consultas = await getRepository(Consulta).findOne({
      id: +id,
      usuariosId: +userId,
    });

    // console.log(consultas);

    if (consultas) {
      response.json({ consulta: consultas, email: consultas.email });
    } else {
      return response
        .status(400)
        .send("Nenhuma consulta com esse id para esse usuário!");
    }
  } else {
    return response.status(400).send("Campo em branco!");
  }
};

export const saveConsultas = async (request: Request, response: Response) => {
  console.log(request.body);

  const { body } = request;
  let consulta = new Consulta();
  consulta = body;

  const newConsulta = await getRepository(Consulta).save(consulta);
  response.json(newConsulta);
};

export const updateStatus = async (request: Request, response: Response) => {
  const { id } = request.params;
  console.log(id);

  const user = await getRepository(Consulta).update(id, { status: false });

  if (user.affected == 1) {
    const consultaUpdated = await getRepository(Consulta).findOne(id);
    return response.json(consultaUpdated);
  }

  return response.status(404).json({ message: "Consulta não encontrada" });
};
