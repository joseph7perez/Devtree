import bcryptjs from 'bcryptjs'

export const hashPassword = async (password: string) => {
    const salt = await bcryptjs.genSalt(10)
    return await bcryptjs.hash(password, salt) 
}