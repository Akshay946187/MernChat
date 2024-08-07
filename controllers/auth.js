import { compare } from "bcrypt";
import User from "../models/userModels.js";
import jwt from 'jsonwebtoken';
import { response } from "express";

const maxTime = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxTime });
};

export const Signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
         // Check if the email already exists in the database
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(409).json({ message: 'Email already exists' });
         }
        const user = await User.create({ email, password });
        const token = createToken(email, user.id);
        
        // Setting the JWT token as a cookie
        res.cookie('jwt', token, {
            maxAge: maxTime,
            httpOnly: true,
            secure:true,
            sameSite: 'none' // Needs to be in quotes
        });
        
        return res.status(201).json({user});
    } catch (error) {
        console.error('Error in Signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// logincontroller
export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: 'user dosnot exist with the provided email' });
        }
        const auth = await compare(password,user.password)
        if(!auth){
            return res.json({message:"password is not correct"})
        }
        const token = createToken(email, user.id);
        
        // Setting the JWT token as a cookie
        res.cookie('jwt', token, {
            maxAge: maxTime,
            httpOnly: true,
            secure:true,
            sameSite: 'none' // Needs to be in quotes
        });
        
        return res.status(200).json({
            user:{
                email:user.email,
                password:user.password,
                id:user.id,
                profileSetup:user.profileSetup,
                firstName:user.firstName,
                lastName:user.lastName,
                image:user.image
            }
        });
    } catch (error) {
        console.error('Error in Signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// getuserinfo

export const getUserInfo = async (req,res)=>{
    
    try {
       const userData = await User.findById(req.userId)
       if(!userData){
        return res.status(404).send('user with the given id is not found')
       }
       return res.status(200).json({
        user:{
            email:userData.email,
            id:userData.id,
            profileSetup:userData.profileSetup,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image
        }
       })
    } catch (error) {
        res.status(400).json({message:error})
    }
}


// profileSetup
export const updateProfile = async (req,res)=>{
    
    try {
        const {userId} = req
        const {firstName,lastName} = req.body
        if(!firstName || !lastName){
            return res.status(400).send('all filds are required')
        }
       const userData = await User.findByIdAndUpdate(userId,{
        firstName,
        lastName,
        profileSetup:true
       },{new:true,runValidators:true})
       return res.status(200).json({
        user:{
            email:userData.email,
            id:userData.id,
            profileSetup:userData.profileSetup,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image
        }
       })
    } catch (error) {
        res.status(400).json({message:error})
    }
}


// logout

export const logout = async (req,res)=>{
    
    try {
        res.cookie('jwt', '', {
            maxAge: 1,
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            
        });
      res.status(200).send('logout sucfully')
    } catch (error) {
        res.status(400).json({message:error})
    }
}