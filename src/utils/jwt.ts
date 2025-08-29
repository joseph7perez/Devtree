import jwt, { JwtPayload } from 'jsonwebtoken'

export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d' //Para definir la duracion del JWT - 180 dias
    })
    
    return token
}