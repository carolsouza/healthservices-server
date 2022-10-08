import 'reflect-metadata';
//import { createConnection } from 'typeorm';
import * as express from 'express';
import * as cors from 'cors';
import routes from './routes';

const app = express();
//createConnection().catch((error) => console.log(error));

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.SERVERPORT, () => {
  console.log(`Server rodando na porta ${process.env.SERVERPORT}`);
});