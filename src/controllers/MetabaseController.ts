import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Anamnese } from "../entity/Anamnese";
import { Consulta } from "../entity/Consulta";
import * as Logic from "es6-fuzz";
import { getEvaluator } from "boon-js";
import { Resultados } from "../entity/Resultados";

export const getMetabaseData = async (request: Request, response: Response) => {
  var jwt = require("jsonwebtoken");

  // var METABASE_SITE_URL = "http://localhost:3000";
  // var METABASE_SECRET_KEY =
  //   "8a2c251afb81549d040c3bb1f830aadd25b60b5a6d7d5f8b7cc8d83166e9e2fe";

  var payload = {
    resource: { dashboard: 1 },
    params: {},
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
  };
  var token = jwt.sign(payload, process.env.METABASE_SECRET_KEY);

  var iframeUrl =
    process.env.METABASE_SITE_URL +
    "/embed/dashboard/" +
    token +
    "#bordered=false&titled=false";

  return response.json(iframeUrl);
};

export const getAnalysis = async (request: Request, response: Response) => {
  const { consultaId } = request.query;

  const consulta = await getRepository(Consulta).findOne({ id: +consultaId });
  let sintomas = 0;

  consulta.dor_cabeca ? (sintomas += 4) : null;
  consulta.febre ? (sintomas += 6) : null;
  consulta.nausea ? (sintomas += 3) : null;

  console.log(sintomas);

  //5, 10, 14 -> alto
  //0, 3, 5 -> baixo

  const anamnese = await getRepository(Anamnese).findOne({
    email: consulta.email,
  });
  let nivelComorbidades = 0;

  anamnese.diabetes ? (nivelComorbidades += 5) : null;
  anamnese.oncologico ? (nivelComorbidades += 4) : null;
  anamnese.cardiaco ? (nivelComorbidades += 5) : null;
  anamnese.uso_medicacao ? (nivelComorbidades += 3) : null;
  anamnese.exame_period ? (nivelComorbidades -= 4) : null;
  anamnese.hipertensao ? (nivelComorbidades += 6) : null;
  anamnese.tabagista ? (nivelComorbidades += 4) : null;
  anamnese.etilista ? (nivelComorbidades += 4) : null;
  anamnese.covid ? (nivelComorbidades += 4) : null;
  anamnese.exercio_fisico ? (nivelComorbidades -= 5) : null;

  nivelComorbidades <= 0 ? (nivelComorbidades = 0) : null;

  console.log(nivelComorbidades);
  //24, 30, 35 -> grave
  //12, 17, 26 -> medio
  //0, 7, 13 -> baixo

  var comorbidadesLogic = new Logic();
  console.log(comorbidadesLogic);

  var Triangle = comorbidadesLogic.c.Triangle;

  const lowComorbidades = new Triangle(0, 7, 13);
  const mediumComorbidades = new Triangle(12, 17, 26);
  const highComorbidades = new Triangle(24, 30, 35);

  comorbidadesLogic.init("low", lowComorbidades);
  comorbidadesLogic.or("medium", mediumComorbidades);
  comorbidadesLogic.or("high", highComorbidades);

  var sintomasLogic = new Logic();
  const poucosSintomas = new Triangle(0, 3, 5);
  const muitosSintomas = new Triangle(5, 10, 14);

  sintomasLogic.init("assintomatico", poucosSintomas);
  sintomasLogic.or("sintomatico", muitosSintomas);

  const test = getEvaluator("comorbidades.medium AND sintomas.sintomatico");

  console.log(test);

  const resComorbidades = comorbidadesLogic.defuzzify(
    nivelComorbidades,
    "comorbidades"
  );
  const resSintomas = sintomasLogic.defuzzify(sintomas, "sintomas");

  const jsBoonInput = {
    ...resComorbidades.boonJsInputs,
    ...resSintomas.boonJsInputs,
  };

  //se comorbidades low e sintomatico -> baixo
  //se comorbidades medium e sintomatico -> medio
  //se comorbidades high e sintomatico -> alto
  //se comorbidades low e assintomatico -> baixo
  //se comorbidades medium e assintomatico -> baixo
  //se comorbidades high e assintomatico -> medio

  let gravidade = "";

  if (jsBoonInput["comorbidades.low"] && jsBoonInput["sintomas.sintomatico"]) {
    gravidade = "baixo";
  } else if (
    jsBoonInput["comorbidades.medium"] &&
    jsBoonInput["sintomas.sintomatico"]
  ) {
    gravidade = "médio";
  } else if (
    jsBoonInput["comorbidades.high"] &&
    jsBoonInput["sintomas.sintomatico"]
  ) {
    gravidade = "alto";
  } else if (
    jsBoonInput["comorbidades.low"] &&
    jsBoonInput["sintomas.assintomatico"]
  ) {
    gravidade = "baixo";
  } else if (
    jsBoonInput["comorbidades.medium"] &&
    jsBoonInput["sintomas.assintomatico"]
  ) {
    gravidade = "baixo";
  } else if (
    jsBoonInput["comorbidades.high"] &&
    jsBoonInput["sintomas.assintomatico"]
  ) {
    gravidade = "médio";
  }

  const result = new Resultados();

  result.dataCad = new Date();
  result.gravidade = gravidade;
  result.idAnamnese = anamnese.id;
  result.idConsulta = consulta.id;
  result.idUser = consulta.usuariosId;

  const newResult = await getRepository(Resultados).save(result);

  return response.json(newResult);
};
