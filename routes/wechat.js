var express = require('express');
var router = express.Router();
var _ = require('underscore');
var messageService = require('../ctrler/message');
var wechat = require('wechat');

var config = {
    token: 'token',
    appid: 'appid',
    encodingAESKey: 'encodinAESKey'
};

router.use('/', wechat(config.token, wechat.text(function (message, req, res, next) {
    messageService.add(message);
    res.reply('消息上墙啦~！');
}).image(function (message, req, res, next) {
    message.PicUrl = message.PicUrl.replace('mmbiz.qpic.cn', '7xqdl0.com1.z0.glb.clouddn.com')
    messageService.add(message);
    res.reply('消息上墙啦~！');
})));
module.exports = router;