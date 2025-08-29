import express from 'express' // ESM Ecmascript Modules
import cors from 'cors';
import 'dotenv/config'
import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

connectDB();

const app = express();

// CORS
app.use(cors(corsConfig)) //middleware, agrega los cors de forma global en la aplicación

// Leer datos del formulario
app.use(express.json())

app.use('/', router) //con .use, se entra a todos lo metodos que hay en router, y lo usamos en el dominio principal


export default app