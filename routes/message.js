var express = require('express');
var router = express.Router();
var _ = require('underscore');

var message = require('../ctrler/message');

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    next();
})

router.post('/', function(req, res) {
    message.add(req.body);
    res.send('ok');
});

router.get('/', function(req, res) {
    res.send(message.fetch());
});

module.exports = router;