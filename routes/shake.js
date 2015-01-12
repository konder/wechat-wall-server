var express = require('express');
var router = express.Router();
var _ = require('underscore');

var shake = require('../ctrler/shake');

var score = function(){
    var _scoreArr = _.pairs(shake.get()).sort(function sortArr(_m, _n){
        return _n[1] - _m[1];
    }).slice(0, 500);
    var _score = [];
    _scoreArr.forEach(function(_e){
        var _user = shake.getUser(_e[0]) || {'userid': e[0], 'score': e[1]};
        _user['score'] = _e[1];
        _score.push(_user);
    });
    return _score;
};

// middleware specific to this router
router.use(function timeLog(req, res, next) {
    next();
})

router.get('/start', function(req, res) {
    shake.reset();
    res.send('ok');
});

router.get('/score', function(req, res) {
    res.send(score());
});

router.get('/end', function(req, res) {
    var _score = score();
    shake.reset();
    res.send(_score);
});

module.exports = router;