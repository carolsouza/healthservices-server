import { Resultados } from "./../entity/Resultados";
import { Request, Response } from "express";
import { getRepository } from "typeorm";

export const getResultado = async (request: Request, response: Response) => {
  const { id } = request.params;

  const resultado = await getRepository(Resultados).findOne({
    idConsulta: +id,
  });
  return response.json(resultado);
};
