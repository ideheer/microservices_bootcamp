const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//register middleware
app.use((req, res, next) => {
    let username = "ideheer";
    let password ="123";
    let receivedUsername = req.body.username || req.query.username;
    let receivedPassword = req.body.password || req.query.password;
    if (req.body.username == receivedUsername && req.body.password == receivedPassword) {
        next();
    }
    else {
        res.status(403)
        res.send('Unauthorized')
    }
    console.log(req.body);
    console.log(req.query);
    console.log(req.headers)
});

function eventHandler(req, res) {
    res.send('Hello World!');
};

function secondEvent(req, res) {
    res.send('Second Event');
};

//event
app.post('/login', eventHandler);
app.get('/login', eventHandler)
app.get('/login2', secondEvent);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});