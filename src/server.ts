import express from 'express' // ESM Ecmascript Modules
import 'dotenv/config'
import router from './router';
import { connectDB } from './config/db';

const app = express();

connectDB();

// Leer datos del formulario
app.use(express.json())

app.use('/', router) //con .use, se entra a todos lo metodos que hay en router, y lo usamos en el dominio principal


export default app