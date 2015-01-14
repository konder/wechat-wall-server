var http = require('http');
var config = require('../config');

var users = {};
var message = [];

var getUser = function (_userid) {
    if (!users[_userid]) {
        // 在没有加载完，使用默认值填充
        users[_userid] = {'userid': _userid};

        http.get(config.wechatapi + '/user/' + _userid, function (res) {
            var json = '';
            res.on('data', function (chunk) {
                json += chunk;
            }).on('end', function () {
                var _u = json && JSON.parse(json);
                _u && _u['errmsg'] == 'ok' && (users[_userid] = {
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

exports.add = function (_message) {
    message.push({
        userid: _message.FromUserName,
        author: getUser(_message.FromUserName),
        content: _message.Content,
        image: _message.PicUrl,
        time: _message.CreateTime
    });
}

exports.fetch = function () {
    var _oldMessage = [];
    message.forEach(function(e){
        e.author = getUser(e.userid);
        _oldMessage.push(e);
    });
    message = [];
    return _oldMessage;
}