import groups from "../models/groups.js";
import User from "../models/user.js";
import chat from "../models/chat.js";
import { getIO } from "../config/socket.js";
export const addgroup=async(req,res)=>{
  let io=getIO();
    const { name,members,adminId}=req.body
 const allMembers = [...new Set([...members, adminId])];
 let chatid=await chat.create({type:"group",members:allMembers});
 
    let group=await groups.create({name:name,members:[...members,adminId],admin:adminId,chatid:chatid._id});
 group.members.forEach(async (member) => {
   io.to(member.toString()).emit("create",group);
console.log(member);
 }) 
 const users = await User.find({ _id: { $in: allMembers } });

 
   let usersupdate= await User.updateMany(
      { _id: { $in: allMembers } },
      { $addToSet: { groups: group._id } } 
    );
   console.log(usersupdate);
   

res.json({message:"group added"});

}