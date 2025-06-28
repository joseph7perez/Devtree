import colors from 'colors';
import app from "./server";

const port = process.env.port || 4000;

app.listen(port, () => {
    console.log(colors.blue.italic( `Servidor funcionando en el puerto: ${port}` ));
    
})

type Product = {
    id: number
    price: number
    name: string
}

type ProductId = Pick<Product, 'id'> //Selecciona id
// type ProductId = Omit<Product, 'id'> //Omite id

// interface ProductId {
//     id: Product['id']
// }
// interface Product {
//     id: number
//     price: number
//     name: string
// }

let product : Product = {
    id: 1,
    price: 200,
    name: "Dior"
}