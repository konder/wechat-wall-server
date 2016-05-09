var express = require('express');
var router = express.Router();
var oAuth = require('wechat-oauth');
var config = require('../config');
var message = require('../ctrler/message');
var client = new oAuth(config.wechat.appid, config.wechat.secret);
var qr = require('qr-image');

router.get('/login', function (req, res) {
    var code = req.query.code;
    client.getAccessToken(code, function (err, result) {
        console.log(result.data);
        if (!result.data) {
            res.send('error');
            return;
        }
        var openid = result.data.openid;
        client.getUser(openid, function (err, result) {
            var userInfo = result;
            console.log(userInfo);
            message.addUser(userInfo);
            res.redirect('http://mp.weixin.qq.com/s?__biz=MzI1MDAzNzc1Nw==&mid=401993005&idx=1&sn=8f2e26a46902d15926f3fc3b9edabbc3&scene=0&previewkey=lNYRDB13zQAp0eqygxP%2F58wqSljwj2bfCUaCyDofEow%3D#wechat_redirect');
        });
    });

});

router.get('/qr/', function (req, res) {
    var url = client.getAuthorizeURL(config.wechat.api.redirectUrl, 'state', 'snsapi_userinfo');
    var img = qr.image(url, {size: 15, parse_url: true});
    res.writeHead(400, {'Content-Type': 'image/png'});
    img.pipe(res);
});

module.exports = router;