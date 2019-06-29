const express = require('express')
const fs = require('fs')
const app = express()

const bot = require('./bot/bot.js')

const port = process.env.PORT || 14000;

app.get('/test', function (req, res) {
    res.status(200)
});

app.listen(port, function () {
    console.log('Example app listening on port: ',port)
})