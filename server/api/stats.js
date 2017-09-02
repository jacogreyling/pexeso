'use strict';

const Async = require('async');
const AuthPlugin = require('../auth');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Stat = server.plugins['hapi-mongo-models'].Stat;


    server.route({
        method: 'GET',
        path: '/stats/{userId}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            Stat.findByUserId(request.params.userId, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                if (!stat) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(stat);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/stats/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.roles.account._id.toString();

            Stat.findByUserId(userId, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                if (!stat) {
                    return reply(Boom.notFound('Document not found.'));
                }

                reply(stat);
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/stats/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            },
            validate: {
                payload: {
                    figures: Joi.object().keys({
                        won: Joi.number().integer(),
                        lost: Joi.number().integer(),
                        abandoned: Joi.number().integer()
                    }).required(),
                    highscores: Joi.object().keys({
                        casual: Joi.number().integer(),
                        medium: Joi.number().integer(),
                        hard: Joi.number().integer()
                    }).required(),
                    flips: Joi.object().keys({
                        total: Joi.number().integer(),
                        matched: Joi.number().integer(),
                        wrong: Joi.number().integer()
                    }).required()
                }
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.roles.account._id.toString();
            const stats = request.payload;

            Stat.create(userId, stats, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                reply(stat);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/stats/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            },
            validate: {
                payload: {
                    figures: Joi.object().keys({
                        won: Joi.number().integer(),
                        lost: Joi.number().integer(),
                        abandoned: Joi.number().integer()
                    }),
                    highscores: Joi.object().keys({
                        casual: Joi.number().integer(),
                        medium: Joi.number().integer(),
                        hard: Joi.number().integer()
                    }),
                    flips: Joi.object().keys({
                        total: Joi.number().integer(),
                        matched: Joi.number().integer(),
                        wrong: Joi.number().integer()
                    })
                }
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.roles.account._id.toString();
            const filter = { 'userId': userId.toLowerCase() };
            const update = {
                $set: {
                    figures: request.payload.figures,
                    highscores: request.payload.highscores,
                    flips: request.payload.flips
                }
            };

            Stat.findOneAndUpdate(filter, update, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                reply(stat);
            });


        }
    });


    server.route({
        method: 'DELETE',
        path: '/stats/{userId}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const userId = request.params.userId;
            const filter = { 'userId': userId.toLowerCase() };

            Stat.findOneAndDelete(filter, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                if (!stat) {
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
    name: 'stats'
};
