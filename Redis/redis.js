
const { createClient } = require('redis');

// TEST REDIS
const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-19685.c61.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 19685
    }
});
client.connect(console.log("Connect To Reddis")).catch(console.error);