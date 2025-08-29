import { CorsOptions } from "cors";

export const corsConfig : CorsOptions = {
                   //origin: de donde se envia la peticion, el dominio - la url
    origin: function(origin, callback) { 

        const whiteList = [process.env.FRONTEND_URL_DEV]

        if (process.argv[2] === '--api') {
            whiteList.push(undefined)
        }

        if(whiteList.includes(origin)) {
            callback(null, true) //Aceptamos las conexión
            
        } else {
            callback(new Error('Error de CORS'))    
        }
    } 
}