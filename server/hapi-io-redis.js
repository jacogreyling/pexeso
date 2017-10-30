'use strict';

const Hoek = require('hoek');
const Redis = require('socket.io-redis');


exports.register = function (server, options, next) {

    Hoek.assert(options.connection, 'options.connection is required');

    const URL = options.connection.url || 'redis://localhost:6379';

    const io = server.plugins['hapi-io'].io;
    io.adapter(Redis(URL));
    next();
};

exports.register.attributes = {
    name: 'hapi-io-redis',
    version: '1.0.0',
    dependencies: 'hapi-io'
};
