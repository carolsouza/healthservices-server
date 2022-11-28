import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Consulta } from "../entity/Consulta";

export const getConsultas = async (request: Request, response: Response) => {
  const { email } = request.query;
  // console.log(request.query);

  // console.log(email);

  const consultas = await getRepository(Consulta).find({
    email: email.toString(),
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
