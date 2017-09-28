'use strict';

const Hoek = require('hoek');
const redis = require('socket.io-redis');


const internals = {};


exports.register = function (server, options, next) {

    Hoek.assert(options.connection, 'options.connection is required');

    const host = options.connection.host || 'localhost';
    const port = options.connection.port || 6379;

    const io = server.plugins['hapi-io'].io;
    io.adapter(redis({
        host: host,
        port: port
    }));

    next();
};

exports.register.attributes = {
    name: 'hapi-io-redis',
    version: '1.0.0',
    dependencies: 'hapi-io'
};
