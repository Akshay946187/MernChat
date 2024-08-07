import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:false
    },
    messageType:{
        type:String,
        enum:['text','file'],
        required:true
    },
    content:{
        type:String,
        required:function (){
            return this.message === "text"
        }
    },
    fileUrl:{
        type:String,
        required:function (){
            return this.message === "file"
        }
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});


const Message = mongoose.model('messages',messageSchema);

export default Message
