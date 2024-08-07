import mongoose from "mongoose";

import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'email must be required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password must be required'],
        
    },
    firstName:{
        type:String   
    },
    lastName:{
        type:String,
    },
    image:{
        type:String
    },
    profileSetup:{
        type:Boolean,
        default:false
    }
})

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

const User = mongoose.model('users',userSchema)
export default User;