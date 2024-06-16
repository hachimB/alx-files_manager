const express = require('express');
const router = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/', router);

app.listen(port, () => console.log('Server Up'));
