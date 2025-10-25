// sockets/socket.js
const User = require("../models/User");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    // When user connects
    socket.on("userConnected", async (email) => {
      if (!email) return console.error("Email is undefined, cannot update user status.");
      socket.email = email;
      try {
        await User.findOneAndUpdate({ email }, { isOnline: true });
        console.log(`✅ User ${email} is online.`);
      } catch (error) {
        console.error(`Error updating user status: ${error.message}`);
      }
    });

    // Messages
    socket.on("sendMessage", (data) => io.emit("receiveMessage", data));
    socket.on("updateMessage", (data) => io.emit("receiveUpdatedMessage", data));
    socket.on("deleteMessage", (id) => io.emit("receiveDeletedMessage", id));

    // Friend requests
    socket.on("sendFriendRequest", (data) => io.emit("receiveFriendRequest", data));
    socket.on("updateFriendRequest", (data) => io.emit("receiveUpdatedFriendRequest", data));
    socket.on("deleteFriendRequest", (id) => io.emit("receiveDeletedFriendRequest", id));

    // Disconnect
    socket.on("disconnect", async () => {
      if (socket.email) {
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
