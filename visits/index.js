const express = require('express');
const redis = require('redis');
const process = require('process');
// ports
const CONTAINER_PORT = 2023;
const LOCAL_PORT = 1989;

const app = express();
const client = redis.createClient({
    host: "redis-server",
    port: 6379
});
client.set('visits', 0);

app.get('/', (req, res) => {  // route handler
    // process.exit(0);  // This wasn't commented out when the lesson finished
    // but I changed it anyway.
    client.get('visits', (err, visits) => {
        res.send('Number of visits: ' + visits);
        client.set("visits", parseInt(visits) + 1);
    });
});

app.listen(CONTAINER_PORT, () => {
    console.log(`Listening on port: ${LOCAL_PORT}`);
});


// Version 2 //
/*
const express = require('express');
const redis = require('redis');
const CONTAINER_PORT = 2023;
const LOCAL_PORT = 1989;

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
});

app.listen(CONTAINER_PORT, () => {
    console.log(`Listening on port: ${LOCAL_PORT}`);
});
*/


// Version 1 //
/*
const express = require('express');
const redis = require('redis');
const CONTAINER_PORT = 2023;
const LOCAL_PORT = 1989;

const app = express();
const client = redis.createClient();
client.set('visits', 0);

app.get('/', (req, res) => {
    client.get('visits', (err, visits) => {
        res.send('Number of visits: ' + visits);
        client.set("visits", parseInt(visits) + 1);
    });
});

app.listen(CONTAINER_PORT, () => {
    console.log(`Listening on port: ${LOCAL_PORT}`);
});
*/
