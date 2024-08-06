const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Adjust the path as necessary

// Register Function
exports.registerAdmin = async (req, res) => {
  const {email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundUser = await Admin.findOne({ email }).exec();
    if (foundUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Admin({
      email,
      password: hashedPassword, // Changed from 'pass' to 'password'
    });

    await user.save();

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Function
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundUser = await Admin.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const match = await bcrypt.compare(password, foundUser.password); // Changed from 'pass' to 'password'
    if (!match) return res.status(401).json({ message: "Wrong Password" });

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60m" }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      email: foundUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().exec();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id).exec();

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
