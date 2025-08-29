
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import slug from 'slug';
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {    
    // await User.create(req.body) //Creando un documento, ingresando datos

    const { email, password } = req.body; //Obtener los datos neccesarios al enviar el formulario

    //Comprobar si el email esta en uso
    const userExists = await User.findOne({email}) // Buscar el usuario con ese email
    //console.log(userExists);
    
    if (userExists) {
        const error = new Error('El correo registrado ya esta en uso');
        res.status(409).json({error: error.message}); //Mostrar respuesta y detener el codigo
        return;
    } 

    //Comprobar si el handle esta en uso
    const handle = slug(req.body.handle, '');
    const handleExists = await User.findOne({handle}) // Buscar el usuario con ese email

    if (handleExists) {
        const error = new Error('El nombre de usuario ya esta en uso');
        res.status(409).json({error: error.message}); //Mostrar respuesta y detener el codigo
        return;
    } 

    const user = new User(req.body);
    //Hasheamos el password antes de guardarlo y reescribimos
    user.password = await hashPassword(password);    
    user.handle = handle; //Pasarle el handle arreglado a la BD   

    // console.log(slug(handle, '')); //el segundo parametro es que lo deje sin espacios
    
    await user.save();

    res.status(201).send('Registro creado correctamente')    
}

export const login = async (req: Request, res: Response) => {  

    const { email, password } = req.body; //Obtener los datos neccesarios al enviar el formulario

    //Comprobar si el email esta registrado
    const user = await User.findOne({email}) // Buscar el usuario con ese email
    //console.log(user);
    if (!user) {
        const error = new Error('El correo no esta registrado');
        res.status(404).json({error: error.message}); //Mostrar respuesta y detener el codigo
        return;
    } 

    // Comprobar el password
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
        const error = new Error('Contraseña incorrecta');
        res.status(401).json({error: error.message}); //Mostrar respuesta y detener el codigo
        return;
    } 

    // Enviamos el ID del usuario autenticado
    const token = generateJWT({id: user._id})

    res.send(token)
}