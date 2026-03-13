import User from "../models/user.js";
export const createuser =async (req, res) => {
   
let user=await User.findOne({clerkId:req.body.id});


if(!user){
    user=await User.create({clerkId:req.body.id,
        name: req.body.fullName,
        email: req.body?.emailAddresses[0]?.emailAddress,
        image:req.body.imageUrl ,
    
        friends: [],
        groups: []});
     return res.json({ message:"find new friends using gmail"});
        
}
const populatedUser = await User.findById(user._id).populate({
      path: "friends.user",
      select: "name _id image email clerkId",
    });
 console.log(populatedUser);
    
    
const populatedgroup = await User.findById(user._id).populate({
      path: "groups",
      select: "name _id members chatid",
    });
    
console.log(populatedgroup);


res.json({friends:[...populatedUser.friends,...populatedgroup.groups],mongouid:user._id});

};
export const searchuser = async (req, res) => {
  try {
    const { id, query } = req.body;

    const currentUser = await User.findOne({ clerkId: id });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const friendIds = currentUser.friends.map(
      (friend) => friend
    );
console.log(friendIds);

    const users = await User.find({
      email: { $regex: query, $options: "i" },
      clerkId: { $ne: id },
      _id: { $nin: friendIds }
    })

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const save = async (req, res) => {
  try {
    const { userId, token } = req.body;
    console.log(userId);
    console.log("hii")
    console.log(token);
    
    const user = await User.findOne({clerkId:userId});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.fcmTokens) {
      user.fcmTokens = [];
    }

    // ✅ prevent duplicate tokens (VERY IMPORTANT)
    if (!user.fcmTokens.includes(token)) {
      user.fcmTokens.push(token);
      await user.save();
    }

    console.log("✅ Token saved:", user._id);

    res.json({ message: "Token saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};