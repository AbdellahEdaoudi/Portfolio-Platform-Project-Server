// عندما يتصل المستخدم
socket.on('userConnected', async (userId) => {
    await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id });
    const users = await User.find();
    io.emit('updateUserStatus', users);
    
    const connectedUser = await User.findById(userId);
    if (connectedUser) {
      console.log(`User ${connectedUser.username} connected`);
    }
  });
  // عندما ينفصل المستخدم
  socket.on('disconnect', async () => {
    const disconnectedUser = await User.findOneAndUpdate({ socketId: socket.id }, { isOnline: false, socketId: null });
    if (disconnectedUser) {
      const users = await User.find();
      io.emit('updateUserStatus', users);
      console.log(`User ${disconnectedUser.username} disconnected`);
    }
  });

  app.put('/updateUsers', async (req, res) => {
    try {
      const updateResult = await User.updateOne({}, { $set: { isOnline: false } });
      res.status(200).json({ message: `${updateResult.modifiedCount} documents updated.` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });