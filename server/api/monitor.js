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

            // Get the global state from the cache and reply
            server.cache({segment: 'telemetry', cache: 'redisCache'})
                .get('stats', (err, value, cached, log) => {

                reply(value);
            });
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
