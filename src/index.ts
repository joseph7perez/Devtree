import colors from 'colors';
import app from "./server";

const port = process.env.port || 4000;

app.listen(port, () => {
    console.log(colors.blue.italic( `Servidor funcionando en el puerto: ${port}` ));
    
})