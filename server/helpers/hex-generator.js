module.exports = function(length) {
    var chars = '0123456789ABCDEF';
    var text = '';

    length = length || 6;

    for (var i = 0; i < length; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return text;
}