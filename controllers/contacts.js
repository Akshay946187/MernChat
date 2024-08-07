import mongoose from 'mongoose';
import User from '../models/userModels.js'
import Message from '../models/messageModel.js';

export const searchContacts = async(req,res)=>{
    try {
        const {searchTerm} = req.body
        if(searchTerm === undefined || searchTerm === null){
            res.status(400).send('search something')
        }
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(sanitizedSearchTerm,"i")
        const contacts = await User.find({
            $and:[
                {_id:{$ne:req.userId}},
                {
                    $or:[{firstName:regex},{lastName:regex},{email:regex}]
                }
            ]
        })
        return res.status(200).json({contacts})

    } catch (error) {
        res.status(400).send(error)
    }
}

export const getContactsForDmList = async(req,res)=>{
    try {
    let {userId} = req
    userId = new mongoose.Types.ObjectId(userId)

    const contacts = await Message.aggregate([
        {
            $match:{
                $or:[{sender:userId},{recipient:userId}],
            },
        },
        {
            $sort:{timestamp:-1}
        },
        {
            $group:{
                _id:{
                    $cond:{
                        if:{$eq:["$sender",userId]},
                        then:"$recipient",
                        else:"$sender"
                    }
                },
                lastMessageTime:{$first:"$timestamp"},
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"_id",
                foreignField:"_id",
                as:"contactInfo",
            },
        },
        {
            $unwind:"$contactInfo",
        },
        {
            $project:{
                _id:1,
                lastMessageTime:1,
                email:"$contactInfo.email",
                firstName:"$contactInfo.firstName",
                lastName:"$contactInfo.lastName",
            }
        },
        {
            $sort:{lastMessageTime:-1}
        }
    ])

    return res.status(200).json({contacts})

    } catch (error) {
        res.status(400).send(error)
    }
}