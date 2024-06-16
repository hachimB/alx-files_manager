const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);

app.listen(port, () => console.log('Server Up'));
