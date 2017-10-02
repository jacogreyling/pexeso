'use strict';

const Hoek = require('hoek');
const Redis = require('socket.io-redis');


exports.register = function (server, options, next) {

    Hoek.assert(options.connection, 'options.connection is required');

    const host = options.connection.host || 'localhost';
    const port = options.connection.port || 6379;

    const io = server.plugins['hapi-io'].io;
    io.adapter(Redis({
        host,
        port
    }));

    next();
};

exports.register.attributes = {
    name: 'hapi-io-redis',
    version: '1.0.0',
    dependencies: 'hapi-io'
};
