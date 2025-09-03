import { Router } from "express";
import { body } from 'express-validator'
import { createAccount, getUser, login, updateProfile } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router()

//Routing

/** Autenticación y registro */
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El nombre de usuario no puede ir vacio'), //Validar que el handle no puede ir vacio
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'), //Validar que el nombre no puede ir vacio
    body('email')
        .isEmail()
        .withMessage('El email no es válido'), //Validar que el email sea válido
    body('password')
        .isLength({min: 8})
        .withMessage('La contraseña debe contener al menos 8 caracteres'), //Validar la contraseña 
    handleInputErrors, //Manejo de errores
    createAccount
)

router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('El email no es válido'), //Validar que el email sea válido
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'), //Validar la contraseña 
    handleInputErrors, //Manejo de errores
    login
)

router.get('/user', authenticate ,getUser)

router.patch('/user', 
    body('handle')
        .notEmpty()
        .withMessage('El nombre de usuario no puede ir vacio'), //Validar que el handle no puede ir vacio
    handleInputErrors,
    authenticate, 
    updateProfile
)

router.post('/user/image', authenticate)

export default router