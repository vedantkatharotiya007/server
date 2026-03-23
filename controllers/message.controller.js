import User from "../models/user.js";
import Message from "../models/Message.js";
import Chat from "../models/chat.js";
import { getIO } from "../config/socket.js";
import admin from "../config/firebaseAdmin.js";
export const addmessage = async (req, res) => {
 
  let { userId,msg, friend } = req.body;
   let fileUrl = null;
    let fileType = null;
 if (typeof friend === "string") {
      friend = JSON.parse(friend);
    }
    console.log(req.file);
    
    if (req.file) {
      fileUrl = `/public/uploads/${req.file.filename}`;
      fileType = req.file.mimetype;
    }
  
  let user = await User.findOne({ clerkId:userId });
var chat1;



  if(friend.chatid){
 chat1=await Chat.findOne({ _id:friend.chatid });
 
if(chat1){
    chat1.lastMessage = msg;
    chat1.lastMessageAt = new Date();
    await chat1.save();
}
 }else{
    chat1=await Chat.findOne({ _id:friend.chatId });
if(chat1){
    chat1.lastMessage = msg;
    chat1.lastMessageAt = new Date();
    await chat1.save();
 }
}
   


console.log(chat1);


   
    let message = await Message.create({ chatId: chat1._id,senderId:user._id,file:fileUrl,fileType:fileType, text: msg });
   let io=getIO();
   
   if(friend.chatid){

    io.to(friend.chatid.toString()).emit("message", message);
   }else{

    io.to(friend.chatId.toString()).emit("message", message);
   }
  
   sendPushToChatMembers({
      chatMembers: chat1.members,
      senderId: user._id,
      messageText: msg,
    });

   

    res.json({ message: "message added" });
  

};
const sendPushToChatMembers = async ({ chatMembers, senderId, messageText }) => {
  try {
    const receiverIds = chatMembers.filter(
      (id) => id.toString() !== senderId.toString()
    );

    if (!receiverIds.length) return;
    

    const users = await User.find({
      _id: { $in: receiverIds },
    }).select("fcmTokens");

    
    let tokens = [];

    users.forEach((u) => {
      if (u.fcmTokens?.length) {
        tokens.push(...u.fcmTokens);
      }
    });

    tokens = [...new Set(tokens.filter(Boolean))];

    if (!tokens.length) {
      return;
    }
    console.log(tokens);
    

   let response = await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: "💬 New Message",
        body: messageText || "You have a new message",
      },
    });
    console.log("Success count:", response.successCount);
console.log("Failure count:", response.failureCount);
console.log("Responses:", response.responses);

  } catch (err) {
    console.error("❌ Push error:", err.message);
  }
};
export const getmessage = async (req, res) => {
  try {


  if(req.body.friend.chatid){

    const messages = await Message.find({ chatId: req.body.friend.chatid })
      .sort({ createdAt: 1 });
      
     return res.json(messages);
     
  }else{
       
    const messages = await Message.find({ chatId: req.body.friend.chatId })
      .sort({ createdAt: 1 });
      
     return res.json(messages);

  }
  

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
  
};