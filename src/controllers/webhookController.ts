/**
 * Arquivo: controllers/webhookController.ts
 * Descrição: arquivo responsável pela manipulação das sqls no banco relacionado ao dialogFlow.
 * Data: 08/10/2022
 * Autor: David Guedes
 */
 'use strict';
 const db = require('../config/database');
 
 import { Request, Response } from 'express';
 const { WebhookClient } = require('dialogflow-fulfillment');
 
 export const webhookComunication = async (
   request: Request,
   response: Response
 ) => {
   const agent = new WebhookClient({ request, response });
   console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
   console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
   function welcome(agent) {
     agent.add(`Welcome to my agent!`);
   }
 
   function fallback(agent) {
     agent.add(`I didn't understand`);
     agent.add(`I'm sorry, can you try again?`);
   }
 
   function webhook(agent) {
     agent.add(`LULA LÁ`);
   }
 
   async function triagemUsuario(agent) {
     const qry =
       'INSERT INTO pacientes(nome,sexo, data_nasc, altura, peso) VALUES($1, $2, $3, $4, $5) RETURNING *';
     const values = [
       agent.parameters.nome,
       agent.parameters.sexo,
       agent.parameters.data_nasc,
       agent.parameters.altura,
       agent.parameters.peso,
     ];
 
     /*pool.query('SELECT NOW()', (err, res) => {
         console.log(err, res);
       });*/
 
     /*
       let result;
       await pool.query(qry, values, (err, res) => {
         console.log(err, res);
         result = res.rows;
         pool.end();
       });*/
 
     console.log('res: ');
 
     let result;
     await db
       .query(qry, values)
       .then((res) => {
         console.log(res.rows[0]);
         result = res.rows[0];
         //see log for output
       })
       .catch((e) => console.error(e.stack));
 
     agent.add(
       `Certo, ${result.nome}. Sua data de nascimento é ${result.data_nasc} e seu gênero é ${result.sexo}. Agora precisaremos realizar a coleta dos dados para anamnese. :)`
     );
   }
 
   let intentMap = new Map();
   intentMap.set('Default Welcome Intent', welcome);
   intentMap.set('Default Fallback Intent', fallback);
   intentMap.set('webhook', webhook);
   intentMap.set('triagem.usuario', triagemUsuario);
   agent.handleRequest(intentMap);
 };
 