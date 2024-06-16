const express = require('express');
const router = require('./routes/index');

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(port, () => console.log('Server Up'));
