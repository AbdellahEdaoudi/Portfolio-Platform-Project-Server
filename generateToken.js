const jwt = require('jsonwebtoken');
const payload = { userId: 123 };
const secret = 'your_secret_key';
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log("Generated Token:", token);
