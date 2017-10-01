'use strict';

const Joi = require('joi');
const Boom = require('boom');

const internals = {};


internals.applyRoutes = function (server, next) {

    const User = server.plugins['hapi-mongo-models'].User;

    server.route({

        method: 'POST',
        path: '/verify',
        config: {
            validate: {
                payload: {
                    token: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            User.verifyUser(request.payload.token, (err, result) => {

                if (err){
                    reply(Boom.notFound(err));
                }

                if (result) {
                    reply({ success: true });
                }
                else {
                    reply(Boom.notFound('User Not Found, Please Contact and Administrator.'));
                }
            });
        }
    });

    next();
};


exports.register = function (server, options, next) {

    server.dependency('mailer', internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'verify-account'
};
