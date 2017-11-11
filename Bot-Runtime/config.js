const parser = require('body-parser');
const cors = require('cors');

module.exports = function(app) {
    app.use(parser.urlencoded({ extended: true }));
    app.use(parser.json());
    
    app.use(cors());
};