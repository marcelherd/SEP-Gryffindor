const express = require('express');
const app = express();
const fs = require('fs');
const parser = require('body-parser');
const cors = require('cors');


app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors())

app.get('/api/v1/discover', (req, res) => {
    console.log('hellloooo')
    let botFAQ = fs.readFileSync('C:/SEP-Gryffindor/Bot-Marketplace/FAQ-Bot/package.json');
    let botWelcome = fs.readFileSync('C:/SEP-Gryffindor/Bot-Marketplace/Welcome-Bot/package.json');
    botFAQ = JSON.parse(botFAQ);
    botWelcome = JSON.parse(botWelcome);
    let templateArray =[];
    templateArray.push(botFAQ.template);
    templateArray.push(botWelcome.template);
    console.log("array" + templateArray);
    res.json(templateArray);

});

app.listen(4000, () => {
    console.log('Bot Runtime is running on port 4000!');
});
