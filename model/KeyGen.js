var KeyGen = {
    generateId: function(length) {
        if (length === undefined) length = 15;
        return Math.floor(Math.random() * Math.pow(10, length));
    }
};

module.exports = KeyGen;
