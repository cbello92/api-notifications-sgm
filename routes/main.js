const express = require('express');
const app = express();

app.use('/v1/docs', require('./docs'));

module.exports = app;