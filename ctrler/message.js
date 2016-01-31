var http = require('http');
var https = require('https');
var config = require('../config');
var users = {};
var guys = [];
var message = [];
var access_token;

var getUser = function (_userid) {
    if (!users[_userid]) {
        // 在没有加载完，使用默认值填充
        users[_userid] = {'userid': _userid};
        var wx_user_api = config.wechat.api.user_info + '?access_token=' +
            access_token + '&lang=zh_CN&openid=' + _userid;
        console.log(wx_user_api);
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

var getAccessToken = function () {
    var wx_access_token_api = config.wechat.api.access_token +
        'appid=' + config.wechat.appid + '&secret=' + config.wechat.secret;
    https.get(wx_access_token_api, function (res) {
        var json = '';
        res.on('data', function (chunk) {
            json += chunk;
        }).on('end', function () {
            var _u = json && JSON.parse(json);
            access_token = _u.access_token;
            console.log(access_token);
            return access_token;
        })
    }).on('error', function (e) {
        console.log(e);
    });
};

exports.setAccessToken = function () {
    return getAccessToken();
};

exports.addUser = function (_u) {
    var _userid = _u.openid;
    var isUser = true;
    guys.forEach(function (e) {
        if (e.openid == _userid)
            isUser = false;
    });
    if (isUser) {
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