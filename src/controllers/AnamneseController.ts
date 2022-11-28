import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Anamnese } from "../entity/Anamnese";

export const getAnamnese = async (request: Request, response: Response) => {
  const { email } = request.query;
  console.log(email);

  const fichas = await getRepository(Anamnese).find({
    email: email.toString(),
  });

  console.log(fichas);

  return response.json(fichas);
};

export const saveAnamnese = async (request: Request, response: Response) => {
  console.log(request.body);

  const { body } = request;
  let anamnese = new Anamnese();
  anamnese = body;

  const ficha = await getRepository(Anamnese).save(anamnese);
  response.json(ficha);
};
