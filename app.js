const express = require('express');
const body_parser = require('body-parser');
const morgan = require('morgan');

const api = require('./routes/api');
const config = require('./config');
const port = process.env.PORT;

let app = express();

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());
app.use(morgan('dev'));
app.use('/static', express.static(__dirname + '/public'));
app.set('jwt-secret', config.secret);

app.use('/api',api);

app.listen(port, () => {
    console.log(`Express server is running at ${port}`);
});
