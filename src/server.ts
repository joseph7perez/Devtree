import express from 'express' // ESM Ecmascript Modules
import router from './router';

const app = express();

app.use('/', router) //con .use, se entra a todos lo metodos que hay en router, y lo usamos en el dominio principal


export default app