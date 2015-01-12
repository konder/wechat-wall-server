var http = require('http');
var config = require('../config');
var users = {};
var scores = {};

exports.getUser = function (_userid) {
    if (!users[_userid]) {
        // 在没有加载完，使用默认值填充
        users[_userid] = {'userid': _userid};

        http.get(config.wechatapi + '/user/' + _userid, function (res) {
            var json = '';
            res.on('data', function (chunk) {
                json += chunk;
            }).on('end', function () {
                var _u = json && JSON.parse(json);
                _u && (users[_userid] = {
                    userid: _u.userid,
                    name: _u.name,
                    gender: _u.gender,
                    avatar: _u.avatar
                });
            })
        }).on('error', function (e) {
            console.log(e);
        });
    }
    return users[_userid];
};

exports.add = function (_user) {
    var _userId = _user.userid;
    if (!scores[_userId]) {
        scores[_userId] = 0;
    }
    scores[_userId]++;
};

exports.reset = function () {
    scores = {};
};

exports.get = function () {
    return scores;
}