import express from "express";
import {adminLogin, adminRegister} from "../controllers/AdminUserController.js";
import auth from "../middleware/auth.js";

const adminRouter = express.Router()

adminRouter.post('/signUp', adminRegister)
adminRouter.post('/signIn', adminLogin)
adminRouter.post('/verify', auth)

export default adminRouter