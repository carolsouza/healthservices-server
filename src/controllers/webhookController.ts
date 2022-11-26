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
const mailer = require('../modules/mailer');

export const webhookComunication = async (
  request: Request,
  response: Response
) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

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

  async function anamneseUsuario(agent) {
    const qrySelect = `SELECT * \
         FROM anamnese \
         WHERE email = $1`;
    let values = [agent.parameters.email];

    let result;
    await db
      .query(qrySelect, values)
      .then((res) => {
        console.log(res.rows[0]);
        result = res.rows[0];
        //see log for output
      })
      .catch((e) => console.error(e.stack));

    console.log('Result: ', result);
    if (result == undefined) {
      console.log('ta vindo no if');
      const qryInsert = `INSERT INTO anamnese(diabetes, oncologico, cardiaco, uso_medicacao, exame_period, exame_period_ultim, alergia_med, alergia_med_nome, funcionamento_intestino, ciclo_menstrual, anticoncepcional, hipertensao, email) \
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;
      let values = [
        agent.parameters.diabetes == 'Sim' ? true : false,
        agent.parameters.oncologico == 'Sim' ? true : false,
        agent.parameters.cardiaco == 'Sim' ? true : false,
        agent.parameters.uso_medicacao == 'Sim' ? true : false,
        agent.parameters.exame_period == 'Sim' ? true : false,
        agent.parameters.exame_period_ultim,
        agent.parameters.alergia_med == 'Sim' ? true : false,
        agent.parameters.alergia_med_nome,
        agent.parameters.funcionamento_intestino,
        agent.parameters.ciclo_menstrual,
        agent.parameters.anticoncepcional == 'Sim' ? true : false,
        agent.parameters.hipertensao == 'Sim' ? true : false,
        agent.parameters.email,
      ];

      console.log('values: ', values);

      await db
        .query(qryInsert, values)
        .then((res) => {
          console.log(res.rows[0]);
          result = res.rows[0];
          //see log for output
          agent.add(`Ficha de anamnese registrada com sucesso!`);
        })
        .catch((e) => {
          console.error(e.stack);
          agent.add(
            `Problemas ao cadastrar ficha de anamnese. Tente novamente!`
          );
        });
    } else {
      console.log('ta vindo no else');
      const qryUpdate = `UPDATE anamnese SET diabetes = $1, oncologico = $2, cardiaco = $3, uso_medicacao = $4, exame_period = $5, exame_period_ultim = $6, alergia_med = $7, alergia_med_nome = $8, funcionamento_intestino = $9, ciclo_menstrual = $10, anticoncepcional = $11, hipertensao = $12 \
      WHERE email = $13 RETURNING *`;
      let values = [
        agent.parameters.diabetes == 'Sim' ? true : false,
        agent.parameters.oncologico == 'Sim' ? true : false,
        agent.parameters.cardiaco == 'Sim' ? true : false,
        agent.parameters.uso_medicacao == 'Sim' ? true : false,
        agent.parameters.exame_period == 'Sim' ? true : false,
        agent.parameters.exame_period_ultim,
        agent.parameters.alergia_med == 'Sim' ? true : false,
        agent.parameters.alergia_med_nome,
        agent.parameters.funcionamento_intestino,
        agent.parameters.ciclo_menstrual,
        agent.parameters.anticoncepcional == 'Sim' ? true : false,
        agent.parameters.hipertensao == 'Sim' ? true : false,
        agent.parameters.email,
      ];

      console.log('values: ', values);

      await db
        .query(qryUpdate, values)
        .then((res) => {
          console.log(res.rows[0]);
          result = res.rows[0];
          //see log for output

          agent.add(`Ficha de anamnese atualizada com sucesso!`);
        })
        .catch((e) => {
          console.error(e.stack);
          agent.add(
            `Problemas ao atualizar ficha de anamnese. Tente novamente!`
          );
        });
    }
  }

  async function agendamentoConsulta(agent) {
    const qryInsert =
      'INSERT INTO consulta(especialidade, data_consulta, horario, email) \
      VALUES($1, $2, $3, $4) RETURNING *';
    let values = [
      agent.parameters.especialidade,
      agent.parameters.data_consulta,
      agent.parameters.horario,
      agent.parameters.email,
    ];

    let result;
    await db
      .query(qryInsert, values)
      .then(async (res) => {
        console.log(res.rows[0]);
        result = res.rows[0];
        //see log for output

        let resutEmail = await mailer.enviar(
          agent.parameters.email,
          'Agendamento de Consulta',
          emailTemplate(
            result.data_consulta,
            result.horario,
            result.especialidade
          )
        );

        agent.add(
          `Consulta agendada com sucesso! 📋✅
          Data: ${result.data_consulta.toLocaleDateString('pt-BR')} 🗓
          Horário: ${result.horario.getHours()}:${result.horario.getMinutes()} 🕒
          Especialidade: ${result.especialidade} 👩‍⚕️`
        );
      })
      .catch((e) => {
        console.error(e.stack);
        agent.add(`Problemas ao agendar a consulta. Tente novamente!`);
      });
  }

  async function welcome(agent) {
    const qry = `SELECT email, senha \
         FROM usuarios \
         WHERE email = $1 \
         AND senha = $2`;
    const values = [agent.parameters.email, agent.parameters.senha];

    let result;
    await db
      .query(qry, values)
      .then((res) => {
        console.log(res.rows[0]);
        result = res.rows[0];
        //see log for output
      })
      .catch((e) => console.error(e.stack));

    if (result) {
      console.log('ta vindo no if');
      agent.add(`Login realizado. Informe o que deseja.`);
      agent.context.set({
        name: 'welcome',
        lifespan: 2,
        parameters: { email: result.email, senha: result.senha },
      });
    } else {
      console.log('ta vindo no else');
      /*agent.context.set({
        name: 'dados_login',
        parameters: {
          senha: null,
          email: null,
        },
      });*/
      //agent.setContext({ name: 'Default Welcome Intent', lifespan: -1 });
      //console.log('agent: ', agent);
      agent.context.delete('data_welcome');
      //agent.context.set('currentintent-followup', 5, {});
      agent.context.set({ name: 'data_welcome', lifespanCount: -1 });
      agent.context.set({
        name: 'data_welcome',
        lifespan: 2,
        parameters: { email: null, senha: null },
      });
      //agent.context.delete('login');
      //agent.context.set({ name: 'Default Welcome Intent', lifespanCount: -1 });
      //agent.setContext({ name: 'data_welcome', lifespan: 2, parameters: { city: 'Rome' }});
      /*agent.context.set({
        name: 'welcome',
        lifespan: 2,
        parameters: { "email": null, "senha": null },
      });*/
      agent.add(`Dados inválidos.`);
    }
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('webhook', webhook);
  intentMap.set('triagem.usuario', triagemUsuario);
  intentMap.set('anamnese.usuario', anamneseUsuario);
  intentMap.set('agendamento.consulta', agendamentoConsulta);
  agent.handleRequest(intentMap);
};

function emailTemplate(data_consulta, horario, especialidade) {
  return `
    <div style="background-color: rgba(220, 220, 220, 0.4);">
      <div class="header" style="display: flex; align-items: center; justify-content: center; padding: 10px;">
          <h3 style="font-family: Arial, Helvetica, sans-serif; font-size: larger; margin: 0px; text-align: center; text-transform: uppercase;">Consulta Agendada</h3>
      </div>
      <div class="body" style="background-color: #FFF; display: flex; align-items: center; justify-content: center;">
          <p style="font-family: Arial, Helvetica, sans-serif; font-size: medium; line-height: 1.5; padding: 10px; margin: 0px; text-align: justify;">
              Consulta agendada com sucesso! 📋✅<br/>
              Data: <strong>${data_consulta.toLocaleDateString(
                'pt-BR'
              )}</strong> 🗓<br/>
              Horário: ${horario.getHours()}:${horario.getMinutes()} 🕒<br/>
              Especialidade: ${especialidade} 👩‍⚕️<br/>
          </p>
      </div>
      <div class="footer" style="display: flex; align-items: center; justify-content: center; padding: 5px;">
          <div style="display: flex; width: max-content;">
              <a href="/" style="text-decoration: none; text-align: center;">
              <span style="font-family: Arial, Helvetica, sans-serif; font-size: larger; color: #000; text-transform: uppercase;">HealthRecords</span>
              </a>
          </div>
      </div>
    </div>
  `;
}
