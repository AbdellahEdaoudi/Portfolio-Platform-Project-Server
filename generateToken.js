require('dotenv').config();
const jwt = require('jsonwebtoken');
const payload = { userId: 123 };
const secret = process.env.JWT_SECRET;
const token = jwt.sign(payload, secret, { expiresIn: '1000h' });
console.log("Generated Token:", token);
