import {Router} from 'express'
import { Login, Signup,getUserInfo,logout,updateProfile} from '../controllers/auth.js'
import { verifyToken } from '../middlewares/AuthMiddleware.js'

const authrouter = Router()

authrouter.post('/signup',Signup)
authrouter.post('/login',Login)
authrouter.get('/user-info',verifyToken,getUserInfo)
authrouter.post('/update-profile',verifyToken,updateProfile)
authrouter.post('/logout',logout)


export default authrouter