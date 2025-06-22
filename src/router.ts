import { Router } from "express";

const router = Router()

//Routing

/** Autenticación y registro */
router.get('/auth/register', (req, res) => {
    res.send('Desde register')
})


export default router