'use strict';

const internals = {};


internals.applyRoutes = function (server, next) {

    server.route({
        method: 'GET',
        path: '/account/{glob*}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            }
        },
        handler: function (request, reply) {

            // Add a simple html header so the client can render the proper
            // navbar with links to /admin pages
            reply.view('account/index', {
                roles: typeof request.auth.credentials.user.roles.admin === 'object' ?
                    'admin, account' :
                    'account'
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
    name: 'web/account'
};
