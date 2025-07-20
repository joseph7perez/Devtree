
import { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export const createAccount = async (req: Request, res: Response) => {    
    // await User.create(req.body) //Creando un documento, ingresando datos

    const { email, password } = req.body; //Obtener los datos neccesarios al enviar el formulario

    const userExists = await User.findOne({email}) // Buscar el usuario con ese email

    //console.log(userExists);
    
    if (userExists) {
        const error = new Error('El correo registrado ya esta en uso');
        res.status(409).json({error: error.message}); //Mostrar respuesta y detener el codigo
        return;
    } 

    const user = new User(req.body);
    //Hasheamos el password antes de guardarlo y reescribimos
    user.password = await hashPassword(password);    

    await user.save();

    res.status(201).send('Registro creado correctamente')    

}