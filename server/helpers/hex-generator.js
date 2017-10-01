'use strict';

module.exports = function (length) {

    const chars = '0123456789ABCDEF';

    let text = '';

    length = length || 6;

    for (let i = 0; i < length; ++i) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return text;
};
