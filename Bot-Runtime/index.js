const express = require('express');
const parser = require('body-parser');
const cors = require('cors');

const app = express();

// Configuration
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

// Runtime


// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/manage/start', (req, res) => {
    let customerId = req.body.customerId;
    let template = req.body.template;
    let config = req.body.config;

    // start bot
    // return id
});

app.get('/manage/:id', (req, res) => {
    const id = req.params.id;
    // return status
});

app.post('/manage/:id/stop', (req, res) => {
    const id = req.params.id;
    // stop bot with id
});

app.listen(3000, () => {
    console.log('Bot Runtime is running on port 3000!');
});