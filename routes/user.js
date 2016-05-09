var express = require('express');
var router = express.Router();
var _ = require('underscore');

var message = require('../ctrler/message');

router.get('/', function (req, res) {
    res.jsonp(message.all());
});

module.exports = router;