/**
 * This module implements the interface discover
 * 
 *
 * @module app
 */
const express = require('express');
const app = express();
const fs = require('fs');
const parser = require('body-parser');
const cors = require('cors');


app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors())

/**
 * responds with all bots templates formatted as json
 */
app.get('/api/v1/discover', (req, res) => {
    let botFAQ = fs.readFileSync('./FAQ-Bot/package.json');
    let botWelcome = fs.readFileSync('./Welcome-Bot/package.json');
    botFAQ = JSON.parse(botFAQ);
    botWelcome = JSON.parse(botWelcome);
    let templateArray =[];
    templateArray.push(botFAQ.template);
    templateArray.push(botWelcome.template);
    res.json(templateArray);

});

app.listen(4000, () => {
    console.log('Bot Marketplace is running on port 4000!');
});
