const express = require('express');
const cors = require('cors');
let app = express();
app.use(cors());
app.get('/*', function (req, res) {
    res.send({ message: 'hello vue' });
});
module.exports = app;