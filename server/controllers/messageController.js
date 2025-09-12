import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Message from "../models/Message.js";
import { createDecipheriv } from "crypto";
// create an empty object to store serverside event connections
const connections ={};

// controller function for the server side event endpoint 

export const ssecontroller =(req,res)=>{
    const {userId} =req.params
    console.log('New Client Connected :', userId)

    // set sse headers

    res.setHeader('Content-Type','text/event-stream');
    res.setHeader('Cache-Control','no-cache');
    res.setHeader('Connection-type','keep-alive')
    res.setHeader('Access-Control-Allow-Origin','*')
 
   // add the client response object to the connections object
   
   connections[userId]=res

   // send an innitial event to the client
 res.write('log: Connected to SSE stream\n\n')+


   //handle client disconnection
   req.on('close', ()=>{
    // remove the client response object from the connections array
    delete connections[userId];
    console.log('Client disconnected');
   })


}

// send message 

export const sendMessage = async (req,res) => {
    try {
        const {userId} = req.auth();
        const {to_user_id,text} = req.auth();
        const image= req.file;

        let media_url ='';
        let message_type = (image || video) ? 'image' : 'text';


        if(message_type === 'image'){
            const filebuffer = fs.readFileSync(image.path)
            const response = await imagekit.upload({
                file:filebuffer,
                fileName:image.originalname,
            });
            media_url= imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:'auto'},
                    {format:'webp'},
                    {width:'1280'},
                ]
            })
        }

        const message = Message.create({
            from_user_id:userId,
            to_user_id,
            text,
            message_type,
            media_url
        })

        res.json({success:true,message});

        // send message to to_user_id using server side events;

        const messageWithUserData =await Message.findById(message._id).populate('from_user_id');
        if(connections[to_user_id]){
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`)
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// get chat messages 

 export const getChatMessage = async (req,res) => {
    try {
        const {userId} = req.auth();
        const {to_user_id} = req.body;

        const messages = await Message.find({
            $or:[
                {from_user_id:userId,to_user_id},
                {from_user_id:to_user_id,to_user_id:userId}
            ]
        }).sort({created_at: -1})

        // mark messages as seen 
     
         await Message.updateMany({from_user_id:to_user_id,to_user_id:userId},{seen:true})
         res.json({success:true,messages})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }
 }

 export const getUserRecentMessages = async (req,res) => {
    try {
        const {userId} = req.auth();
        const messages = await Message.find({to_user_id:userId}).populate('from_user_id to_user_id').sort({created_at:-1})
        res.json({success:true,messages})
    } catch (error) {
        res.json({success:false,message:error.message}) 
        
    }
 }