var message = [];

exports.add = function (_message) {
    message.push(_message);
}

exports.fetch = function () {
    var _oldMessage = message;
    message = [];
    return _oldMessage;
}