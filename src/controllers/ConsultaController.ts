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

  const consultas = await getRepository(Consulta).find({
    email: email.toString(),
  });

  console.log(consultas);

  return response.json(consultas);
};

export const getConsultasById = async (
  request: Request,
  response: Response
) => {
  const { id } = request.query;
  const { userId } = request.query;
  // console.log(request.query);

  console.log(id);

  const consultas = await getRepository(Consulta).findOne({
    id: +id,
    usuariosId: +userId,
  });

  console.log(consultas);

  return response.json(consultas);
};

export const saveConsultas = async (request: Request, response: Response) => {
  console.log(request.body);

  const { body } = request;
  let consulta = new Consulta();
  consulta = body;

  const newConsulta = await getRepository(Consulta).save(consulta);
  response.json(newConsulta);
};
