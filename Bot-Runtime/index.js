const express = require('express');
const parser = require('body-parser');
const cors = require('cors');

const router = express.Router();
const app = express();

// Configuration
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(cors());

// Runtime
let currentId = 2;
let bots = [
    {
        id: 1,
        name: 'First Bot',
        template: 'Welcome-Bot',
        status: 'NOT_RUNNING'
    },
    {
        id: 2,
        name: 'Second Bot',
        template: 'FAQ-Bot',
        status: 'RUNNING'
    }
];

// Routes
router.get('/bot', (req, res) => {
    res.send(JSON.stringify(bots));
});

router.post('/bot', (req, res) => {
    if (!req.body.name || !req.body.template) {
        res.status(400).send('Malformed data');
    } else {
        let newBot = {
            id: ++currentId,
            name: req.body.name,
            template: req.body.template,
            status: 'NOT_RUNNING'
        };
    
        bots.push(newBot);
    
        res.status(201).send('Bot saved');
    }
});

router.get(['/bot/:id', '/bot/:id/status'], (req, res) => {
    let bot = bots.find((item) => item.id === parseInt(req.params.id));

    if (bot === undefined) {
        res.status(404).send('Not found');
    } else {
        res.send(JSON.stringify(bot));
    }
});

router.delete('/bot/:id', (req, res) => {
    let index = bots.findIndex((item) => item.id === parseInt(req.params.id));

    if (index === -1) {
        res.status(404).send('Not found');
    } else {
        // TODO: stop the bot, if it is running
        bots.splice(index, 1);
        res.send('Bot deleted');
    }
});

router.patch('/bot/:id', (req, res) => {
    let bot = bots.find((item) => item.id === parseInt(req.params.id));
    
    if (bot === undefined) {
        res.status(404).send('Not found');
    } else {
        // TODO: update the bot
        res.send(JSON.stringify(bot));
    }
});

router.post('/bot/:id/start', (req, res) => {
    let bot = bots.find((item) => item.id === parseInt(req.params.id));
    
    if (bot === undefined) {
        res.status(404).send('Not found');
    } else {
        // TODO: start the bot
        bot.status = 'RUNNING';
        res.send(JSON.stringify(bot));
    }
});

router.post('/bot/:id/restart', (req, res) => {
    let bot = bots.find((item) => item.id === parseInt(req.params.id));
    
    if (bot === undefined) {
        res.status(404).send('Not found');
    } else {
        // TODO: restart the bot
        bot.status = 'NOT_RUNNING';
        bot.status = 'RUNNING';
        res.send(JSON.stringify(bot));
    }
});

router.post('/bot/:id/stop', (req, res) => {
    let bot = bots.find((item) => item.id === parseInt(req.params.id));
    
    if (bot === undefined) {
        res.status(404).send('Not found');
    } else {
        // TODO: stop the bot
        bot.status = 'NOT_RUNNING';
        res.send(JSON.stringify(bot));
    }
});

app.use('/api/v1/manage', router);

app.listen(3000, () => {
    console.log('Bot Runtime is running on port 3000!');
});