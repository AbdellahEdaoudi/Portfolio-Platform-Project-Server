const Message = require('../models/Messages');

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get message by ID
const getMessageById = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById({_id:id});
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new message
const createMessage = async (req, res) => {
  const messageData = req.body;
  try {
    const newMessage = await Message.create(messageData);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update message by ID
const updateMessageById = async (req, res) => {
  const { id } = req.params;
  const messageData = req.body;
  try {
    const updatedMessage = await Message.findByIdAndUpdate({_id:id}, messageData, { new: true });
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete message by ID
const deleteMessageById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete({_id:id});
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
  
// Delete all messages
const deleteAllMessages = async (req, res) => {
  try {
    const msg = await Message.deleteMany();
    res.status(200).json({ message: ` ${msg.deletedCount} : All messages deleted successfully`});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateReadOrNoForMessages = async (req, res) => {
  const { fromEmail, toEmail } = req.body; // القيمتين يجب أن تأتي من الـ frontend

  try {
    const result = await Message.updateMany(
      { from: fromEmail, to: toEmail },
      { readorno: true },
      { new: true, runValidators: true }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'No messages found' });
    }

    res.status(200).json({ message: 'Messages updated successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  updateMessageById,
  deleteMessageById,
  deleteAllMessages,
  updateReadOrNoForMessages,
};
