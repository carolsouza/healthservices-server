/**
 * Arquivo: config/database.js
 * Descrição: arquivo responsável pelas 'connectionStrings'
 * Data: 08/10/2022
 * Autor: David Guedes
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// ==> Conexão com a Base de Dados:
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('connect', () => {
  console.log('Base de Dados conectado com sucesso!');
});

module.exports = {
  query: (text: any, params: any) => pool.query(text, params),
};
