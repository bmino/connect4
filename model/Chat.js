var Chat = {
    create: function (username, msg) {
        return {
            speaker: username,
            msg: msg
        };
    }
};

module.exports = Chat;