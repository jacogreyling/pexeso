'use strict';


const internals = {};


internals.applyRoutes = function (server, next) {


    server.route({
        method: 'GET',
        path: '/monitor',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

                reply(request.server.app.telemetry);
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'telemetry'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'monitor'
};
