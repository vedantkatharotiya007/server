import User from "../models/user.js";
import chat from "../models/chat.js";
import { getIO } from "../config/socket.js";

export const addfriend =async (req, res) => {
  let io=getIO();
     let user=await User.findOne({clerkId:req.body.userId});
       let friend=await User.findOne({_id:req.body.friendId});
 const alreadyFriend = user.friends.some(
  (f) => f.user.toString() === req.body.friendId
);
const alreadyFriend2 = friend.friends.some(
  (f) => f.user.toString() === user._id
)


if (alreadyFriend || alreadyFriend2) {
  return res.json({ message: "Friend already exists" });
}
let checkchat=await chat.findOne({members:{$all:[user._id,req.body.friendId]}});

if(!checkchat){
checkchat=await chat.create({type:"private",members:[user._id,req.body.friendId]});
}
if(user && friend){
      user.friends.push({user:req.body.friendId,chatId:checkchat._id});
    friend.friends.push({user:user._id,chatId:checkchat._id});
      
      
      io.to(user._id.toString()).emit("create",friend);
      io.to(req.body.friendId.toString()).emit("create",user);
    await user.save();
    await friend.save();
    res.json({ message:"friend added"});
    }
};