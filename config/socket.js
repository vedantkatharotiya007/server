let io;
let callRooms = {};
import { Server } from "socket.io";

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // USER JOIN WITH MONGO USER ID
    socket.on("user", ({ mongouid }) => {
       socket.userId = mongouid;  
      socket.join(mongouid);
      console.log("User joined personal room:", mongouid);
    });

    // JOIN PRIVATE CHAT
    socket.on("join-chat", ({ chatId }) => {
      socket.join(chatId);
      console.log("User joined chat:", chatId);
    });

    // JOIN GROUP CHAT
    socket.on("join-groupchat", ({ chatId }) => {
      socket.join(chatId);
      console.log("User joined group chat:", chatId);
    });

    // SEND MESSAGE
    socket.on("send-message", (data) => {
      const { receiverId, groupId } = data;

      if (receiverId) {
        io.to(receiverId).emit("receive-message", data);
      }

      if (groupId) {
        io.to(groupId).emit("receive-message", data);
      }
    });

    // LEAVE CHAT
    socket.on("leave-chat", (data) => {
      if (!data) return;

      const { chatId} = data;

      socket.leave(chatId);
      

      console.log("User left:", chatId);
    });

    // CALL USER
    
    socket.on("call-user", ({ toUserId, fromUserId, callType, name, url, users,chatid }) => {
     if (!callRooms[chatid]) {
    callRooms[chatid] = [];
  }

  callRooms[chatid].push(fromUserId);
      if (Array.isArray(toUserId)) {

        const targets = toUserId.filter(id => id !== fromUserId);

        console.log("Calling users:", targets);

        targets.forEach(id => {

          io.to(id).emit("incoming-call", {
            fromUserId,
            callType,
            name,
            url,
            users,
            chatid
          });

        });

      } else {

        io.to(toUserId).emit("incoming-call", {
          fromUserId,
          callType,
          name,
          url,
          users,
          chatid
        });

      }


    });


    
    socket.on("accept-call", ({ toUserId ,users,chatId}) => {

      console.log("Call accepted by:", socket.userId);
      console.log("Call uid",toUserId);
      console.log("users:",users);
      console.log("chatid is",chatId);
      console.log(callRooms);
      
      callRooms[chatId].forEach((id) => {
        io.to(id).emit("call-accepted", socket.userId);
      })
      callRooms[chatId].push(socket.userId);
      


    });


    
    socket.on("reject-call", ({ toUserId,fromUserId }) => {


      console.log("Call rejected by:", toUserId);  
      io.to(toUserId).emit("call-rejected", fromUserId);

    });


    // =========================
    // WEBRTC SIGNALING
    // =========================

    // OFFER
    socket.on("offer", ({ toUserId, offer }) => {

      console.log("Offer from", socket.userId, "to", toUserId);

      io.to(toUserId).emit("offer", {
        offer,
        fromUserId: socket.userId
      });

    });


    // ANSWER
    socket.on("answer", ({ toUserId, answer }) => {

      console.log("Answer from", socket.userId, "to", toUserId);

      io.to(toUserId).emit("answer", {
        answer,
        fromUserId: socket.userId
      });

    });


    // ICE CANDIDATE
    socket.on("ice-candidate", ({ toUserId, candidate }) => {

      io.to(toUserId).emit("ice-candidate", {
        candidate,
        fromUserId: socket.userId
      });

    });


    // =========================
    // END CALL
    // =========================
    socket.on("end-call", ({ users,toUserId }) => {

      if (!users) return;
      if(Array.isArray(users)){
console.log(users);
console.log(toUserId);

      users.forEach((id) => {


          io.to(id).emit("call-ended", {
            fromUserId: socket.userId
          });

      

      });
    }else{
      io.to(users).emit("call-ended", {
        fromUserId: toUserId
      });
    }

     

    });
    socket.on("end-caller", ({ myId,chatid }) => {
if(!chatid || !myId) return;
    callRooms[chatid] =callRooms[chatid].filter((id) => id !== myId);

     console.log("remove this",myId);
     console.log("room is",callRooms[chatid]);

     

    });


    

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

  return io;
};

export const getIO = () => io;