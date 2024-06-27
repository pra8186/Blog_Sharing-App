import AdminUser from "../models/AdminUser.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const adminRegister = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;

        const existingUser = await AdminUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = await AdminUser.create({
            email: email,
            username: username,
            password: hashedPassword
        })

        const token = jwt.sign({
            email: newUser.email,
            id: newUser._id
        }, JWT_SECRET_KEY, { expiresIn: '1h' })

        return res.status(200).json({ message:"Admin Registered Successfully" ,user: newUser, token: token });
    } catch (e) {
        return res.status(500).json({error:"Server error"})
    }
}

export const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const existingUser = await AdminUser.findOne({ email })
        if(!existingUser) {
            return res.status(404).json({ message: "User doesn't exist" })
        }
        const isPasswordCorrect  = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials", success:false})

        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id
        }, JWT_SECRET_KEY, { expiresIn: "1h" })

        return res.status(200).json({ message:"Login Successfull",user: existingUser, token: token })
    } catch (error) {
        return res.status(500).json({ message: "Permission Denied"})
    }
}