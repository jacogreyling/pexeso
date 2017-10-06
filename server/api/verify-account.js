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

                    // Get the socket.io object
                    const io = request.plugins['hapi-io'].io;

                    // Successfully created a new user, increment the user count
                    io.emit('new_user', {
                        count: 1
                    });

                    reply({ success: true });
                }
                else {
                    reply(Boom.notFound('User not found, please contact your administrator.'));
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
