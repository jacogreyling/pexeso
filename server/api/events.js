'use strict';

const Boom = require('boom');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Event = server.plugins['hapi-mongo-models'].Event;


    server.route({
        method: 'GET',
        path: '/events',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    name: Joi.string().allow(''),
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            }
        },
        handler: function (request, reply) {

            const query = {};
            if (request.query.name) {
                query.name = new RegExp('^.*?' + EscapeRegExp(request.query.name) + '.*$', 'i');
            }
            const fields = request.query.fields;
            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            Event.pagedFind(query, fields, sort, limit, page, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/events/event/{name}',
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


    server.route({
        method: 'GET',
        path: '/events/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            Event.findById(request.params.id, (err, event) => {

                if (err) {
                    return reply(err);
                }

                if (!event) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(event);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/events',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                payload: {
                    name: Joi.string().token().lowercase().required(),
                }
            }
        },
        handler: function (request, reply) {

            const name = request.payload.name;

            Event.create(name, (err, event) => {

                if (err) {
                    return reply(err);
                }

                reply(event);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/events/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string()
                },
                payload: {
                    name: Joi.string().token().lowercase().required(),
                    description: Joi.string(),
                    isActive: Joi.boolean().required()
                }
            }
        },
        handler: function (request, reply) {

            const id = request.params.id;
            const update = {
                $set: {
                    description: request.payload.description,
                    isActive: request.payload.isActive,
                    timestamp: new Date()
                }
            };

            Event.findByIdAndUpdate(id, update, (err, event) => {

                if (err) {
                    return reply(err);
                }

                if (!event) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(event);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/events/{id}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                params: {
                    id: Joi.string()
                }
            }
        },
        handler: function (request, reply) {

            Event.findByIdAndDelete(request.params.id, (err, event) => {

                if (err) {
                    return reply(err);
                }

                if (!event) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply({ success: true });
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
