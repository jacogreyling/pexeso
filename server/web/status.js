'use strict';

const Moment = require('moment');


exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/status',
        handler: function (request, reply) {

            return reply({
                running: true,
                started: Moment(server.info.started).format('LLL'),
                hostname:  server.info.host,
                id: server.info.id
            });
        }
    });


    next();
};


exports.register.attributes = {
    name: 'status'
};
