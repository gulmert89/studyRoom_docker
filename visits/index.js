const express = require('express');
const redis = require('redis');
const PORT_LISTENING = 8002;

const app = express();
const client = redis.createClient({
    host: "redis-server",
    port: 6379
});
client.set('visits', 0);

app.get('/', (req, res) => {
    client.get('visits', (err, visits) => {
        res.send('Number of visits: ' + visits);
        client.set("visits", parseInt(visits) + 1);
    });
});  // route handler

app.listen(PORT_LISTENING, () => {
    console.log(`Listening on port: ${PORT_LISTENING}`);
});