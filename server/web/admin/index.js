'use strict';

const internals = {};


internals.applyRoutes = function (server, next) {

    server.route({
        method: 'GET',
        path: '/admin/{glob*}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            // Add a simple html header so the client can render the proper
            // navbar with links to /account pages
            reply.view('admin/index', {
                roles: typeof request.auth.credentials.user.roles.account === 'object' ?
                    'admin, account' :
                    'admin'
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'web/admin'
};
