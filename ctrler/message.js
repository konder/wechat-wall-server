var http = require('http');
var config = require('../config');
var users = {};
var guys = [];
var message = [];

var getUser = function (_userid) {
    if (!users[_userid]) {
        // 在没有加载完，使用默认值填充
        users[_userid] = {'userid': _userid};
        var wx_user_api = config.wechat.api.user_info + '?access_token=' +
            config.wechat.access_token + '&lang=zh_CN&openid=' + _userid;
        http.get(wx_user_api, function (res) {
            var json = '';
            res.on('data', function (chunk) {
                json += chunk;
            }).on('end', function () {
                var _u = json && JSON.parse(json);
                //var gay = {openid: _u.openid, nickname: _u.nickname, avatar: _u.headimgurl};
                //guys.push(gay);
                _u && !_u['errcode'] && (users[_userid] = {
                    userid: _u.openid,
                    name: _u.nickname,
                    gender: _u.sex,
                    avatar: _u.headimgurl
                });
            })
        }).on('error', function (e) {
            console.log(e);
        });
    }
    return users[_userid];
};

exports.addUser = function (_u) {
    var _userid = _u.openid;
    if (!users[_userid]) {
        var gay = {openid: _u.openid, nickname: _u.nickname, avatar: _u.headimgurl};
        guys.push(gay);
        _u && !_u['errcode'] && (users[_userid] = {
            userid: _u.openid,
            name: _u.nickname,
            gender: _u.sex,
            avatar: _u.headimgurl
        });
    }
}

exports.all = function () {
    console.log(guys);
    return guys;
}

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
    message.forEach(function (e) {
        e.author = getUser(e.userid);
        _oldMessage.push(e);
    });
    message = [];
    return _oldMessage;
}