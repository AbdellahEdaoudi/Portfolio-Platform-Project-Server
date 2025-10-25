// sockets/socket.js
const User = require("../models/User");

// Map لتخزين المستخدمين المتصلين: email -> socket.id
const onlineUsers = new Map();

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    // عند اتصال المستخدم
    socket.on("userConnected", async (email) => {
      if (!email) return console.error("Email is undefined, cannot update user status.");

      socket.email = email; // حفظ البريد على الـ socket
      onlineUsers.set(email, socket.id); // إضافة للمستخدمين المتصلين

      try {
        await User.findOneAndUpdate({ email }, { isOnline: true });
        console.log(`✅ User ${email} is online.`);
      } catch (error) {
        console.error(`Error updating user status: ${error.message}`);
      }
    });

    // الرسائل
    socket.on("sendMessage", (data) => {
      const { to } = data;
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", data); // فقط للمستلم
      }
      // لا حاجة لإرسال للمرسل لأنه يحدّث واجهته مباشرة
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

    // طلبات الصداقة
    socket.on("sendFriendRequest", (data) => {
      const { to } = data;
      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveFriendRequest", data);
      }
    });

    socket.on("updateFriendRequest", (data) => {
      const { to } = data;
      const receiverSocketId = onlineUsers.get(to);
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

    // عند قطع الاتصال
    socket.on("disconnect", async () => {
      if (socket.email) {
        onlineUsers.delete(socket.email); // إزالة المستخدم من المتصلين
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
