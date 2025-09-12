import mongoose from "mongoose"

const messageschema = new mongoose.Schema({
    from_user_id:{type:String,ref:'User',required:true},
    to_user_id:{type:String,ref:'User',required:true},
    text:{type:String,trim:true},
    message_type:{type:String,enum:['text','image','video']},
    media_url:{type:String},
    seen:{type:Boolean,default:false}
    
},{timestamps:true,minimize:false})

const Message = mongoose.model('Message',messageschema)

export default Message;