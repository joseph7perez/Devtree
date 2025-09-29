
import { Request, Response } from "express";
import slug from 'slug';
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import formidable from "formidable"
import cloudinary from "../config/cloudinary";
import { v4 as uuid} from 'uuid'; //Para generar un nombre unico a la img


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

export const getUser = async (req: Request, res: Response) => {  
    res.json(req.user)    
}

export const updateProfile = async (req: Request, res: Response) => {  
    try {
        const { description, links } = req.body;

        //Comprobar si el handle esta en uso
        const handle = slug(req.body.handle, '');
        const handleExists = await User.findOne({handle}) // Buscar el usuario con ese email

        // Si el handle esta en uso y la persona que lo usa es diferente al usuario autenticado
        // para que el usuario pueda dejar el mismo handle
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('El nombre de usuario ya esta en uso');
            res.status(409).json({error: error.message}); //Mostrar respuesta y detener el codigo
            return;
        } 

        // Actualizar el Usuario
        req.user.description = description;
        req.user.handle = handle;
        req.user.links = links;

        await req.user.save();
        res.send('Perfil actualizado correctamente')
        
    } catch (e) {
        const error = new Error('Hubo un error');
        res.status(500).json({error: error.message})
        return
    }
}

export const uploadImage = async (req: Request, res: Response) => {  

    const form = formidable({multiples: false}); // Solo se puede subir una imagen
  
    try {
        form.parse(req, (error, fields, files) => {

            cloudinary.uploader.upload(files.file[0].filepath, {public_id: uuid()}, async function(error, result) {
                if(error){
                    const error = new Error('Hubo un error al subir la imagen');
                    res.status(500).json({error: error.message})
                    return
                }

                if (result) {
                    req.user.image = result.secure_url;
                    await req.user.save(); // Guardar la img en la BD
                    res.json({image: result.secure_url}) //Retornamos la imagen para que se refleje en automatico en la vista
                }  
            })
        })
    } catch (e) {
        const error = new Error('Hubo un error');
        res.status(500).json({error: error.message})
        return
    }
}

export const getUserByHandle = async (req: Request, res: Response) => { 
    try {

        const { handle } = req.params; //Traer el valor de la url
        const user = await User.findOne({handle}).select('-_id -__v -email -password') // con .select y "-" seleccionamos los datos que no queremos traer

        if (!user) {
            const error = new Error('El usuario no existe');
            res.status(404).json({error: error.message})
            return
        }

        //console.log(user);
        res.json(user)
        
    } catch (e) {
        const error = new Error('Hubo un error');
        res.status(500).json({error: error.message})
        return
    }
}