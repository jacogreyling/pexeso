'use strict';

const Hoek = require('hoek');
const Redis = require('socket.io-redis');


exports.register = function (server, options, next) {

    Hoek.assert(options.connection, 'options.connection is required');

    const host = options.connection.host || 'localhost';
    const port = options.connection.port || 6379;
    const URL = options.connection.URL || 'redis://localhost:6379';

    const io = server.plugins['hapi-io'].io;
    io.adapter(Redis(URL));
    next();

   /* if (options.connection.password !== 'null') {
        const io = server.plugins['hapi-io'].io;
        io.adapter(Redis({
            host,
            port
        }));

        next();
    } else {
        const password = options.connection.password || 'null';
        
        const pub = Redis(host, port, { auth_pass: password });
        const sub = Redis(host, port, { auth_pass: password });

        const io = server.plugins['hapi-io'].io;
        io.adapter(Redis({
            pubClient: pub, 
            subClient: sub
        }));

        next();
    } */
};

exports.register.attributes = {
    name: 'hapi-io-redis',
    version: '1.0.0',
    dependencies: 'hapi-io'
};
