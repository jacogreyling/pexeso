'use strict';

const Boom = require('boom');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Event = server.plugins['hapi-mongo-models'].Event;


    server.route({
        method: 'GET',
        path: '/events/{name}',
        config: {
            state: {
                parse: true,
                failAction: 'ignore'
            }
        },
        handler: function (request, reply) {

            const name = request.params.name;

            Event.findByEvent(name, (err, event) => {

                if (err) {
                    return reply(err);
                }

                if (!event) {
                    return reply(Boom.badRequest('Invalid event or key.'));
                }
                else  {

                    // If it's not an active event, don't add it!
                    if (!event.isActive) {
                        return reply(Boom.badRequest('The event is not active. Please speak to your event organizer.'));
                    }

                    let pexesoCookie = request.state['sid-pexeso'];

                    // Append if the cookie already exists                    
                    if (pexesoCookie === undefined) {
                        pexesoCookie = {
                            event: event.name
                        };
                    }
                    else {
                        pexesoCookie.event = event.name
                    }

                    // Set the cookie with the event in case a user has NOT authenticated yet
                    reply.state('sid-pexeso', pexesoCookie);
                }

                reply(event);
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
    name: 'events'
};
