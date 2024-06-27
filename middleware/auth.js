import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const auth = async (req, res, next) => {
    try {
        const {token} = req.body

        if (!token) {
            return res.status(404).json({message: 'Log In Required'})
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY)
        return res.status(200).json({decoded: decoded})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message: 'Login Error'})
    }
}

export default auth