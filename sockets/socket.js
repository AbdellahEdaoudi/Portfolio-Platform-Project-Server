// sockets/socket.js
const User = require("../models/User");

const onlineUsers = new Map();

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    socket.on("userConnected", async (email) => {
      if (!email) return console.error("Email is undefined, cannot update user status.");

      socket.email = email;
      onlineUsers.set(email, socket.id);

      try {
        await User.findOneAndUpdate({ email }, { isOnline: true });
        console.log(`✅ User ${email} is online.`);
      } catch (error) {
        console.error(`Error updating user status: ${error.message}`);
      }
    });

    socket.on("sendMessage", (data) => {
      const { to } = data;
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", data);
      }
    });

    socket.on("updateMessage", (data) => {
      const { to } = data;
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveUpdatedMessage", data);
      }
    });

    socket.on("deleteMessage", (data) => {
      const { to, id } = data;
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveDeletedMessage", id);
      }
    });

    socket.on("sendFriendRequest", (data) => {
      const { to } = data;
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveFriendRequest", data);
      }
    });

    socket.on("updateFriendRequest", (data) => {
      const { from } = data;
      const receiverSocketId = onlineUsers.get(from);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveUpdatedFriendRequest", data);
      }
    });

    socket.on("deleteFriendRequest", (data) => {
      const { to, id } = data;
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveDeletedFriendRequest", id);
      }
    });

    socket.on("disconnect", async () => {
      if (socket.email) {
        onlineUsers.delete(socket.email);
        try {
          await User.findOneAndUpdate({ email: socket.email }, { isOnline: false });
          console.log(`❌ User ${socket.email} is offline.`);
        } catch (error) {
          console.error(`Error updating user status: ${error.message}`);
        }
      } else {
        console.log("A user disconnected (no email assigned)");
      }
    });
  });
}

module.exports = { socketHandler };
