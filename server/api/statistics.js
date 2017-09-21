'use strict';

const Async = require('async');
const AuthPlugin = require('../auth');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Statistic = server.plugins['hapi-mongo-models'].Statistic;
    const Score = server.plugins['hapi-mongo-models'].Score;


    server.route({
        method: 'GET',
        path: '/statistics/{userId}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            Statistic.findByUserId(request.params.userId, (err, stat) => {

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
        path: '/statistics/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.user._id.toString();

            Statistic.findByUserId(userId, (err, stat) => {

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
        path: '/statistics/my',
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
                        casual: Joi.object().keys({
                            score: Joi.number().integer(),
                        }),
                        medium: Joi.object().keys({
                            score: Joi.number().integer(),
                        }),
                        hard: Joi.object().keys({
                            score: Joi.number().integer(),
                        }),
                    }),
                    flips: Joi.object().keys({
                        total: Joi.number().integer(),
                        matched: Joi.number().integer(),
                        wrong: Joi.number().integer()
                    }),
                    status: Joi.string().required()
                }
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.user._id.toString();
            const stats = request.payload;

            // Make sure we're in 'initialize' state
            if (request.payload.status !== 'initialize') {
                reply(Boom.badRequest('Invalid status, must \'initialize\' on POST'));
            }

            Statistic.create(userId, stats, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                reply(stat);
            });
        }
    });


    server.route({
        method: 'PUT',
        path: '/statistics/my',
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
                        casual: Joi.object().keys({
                            score: Joi.number().integer(),
                        }),
                        medium: Joi.object().keys({
                            score: Joi.number().integer(),
                        }),
                        hard: Joi.object().keys({
                            score: Joi.number().integer(),
                        }),
                    }),
                    flips: Joi.object().keys({
                        total: Joi.number().integer(),
                        matched: Joi.number().integer(),
                        wrong: Joi.number().integer()
                    }),
                    status: Joi.string().required(),
                    highscore: Joi.boolean().required(),
                    score: Joi.number().integer().required(),
                    level: Joi.string().required()
                }
            },
            ext: {
                onPostHandler: {
                    method: function (request, reply) {

                        // On every successful round, update the games collections
                        if ((request.payload.status === 'won') && (request.auth.isAuthenticated)) {

                            const document = {
                                userId: Score.ObjectId(request.auth.credentials.user._id.toString()),
                                score: request.payload.score,
                                level: request.payload.level,
                                timestamp: request.response.source.lastPlayed
                            }

                            Score.insertOne(document, (err, stat) => {

                                if (err) {
                                    console.warn("Could not update the game collection with a new document: " + err);
                                }

                                // Get the socket.io object
                                const io = request.plugins['hapi-io'].io;

                                // Successfully created a new user, increment the user count
                                io.emit('new_score', {
                                    _id: stat[0]._id.toString(),
                                    username: request.auth.credentials.user.username.toString(),
                                    score: request.payload.score,
                                    level: request.payload.level,
                                    timestamp: request.response.source.lastPlayed
                                });

                                return reply.continue();
                            });
                        } else {

                            return reply.continue();
                        }
                    }
                }
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.user._id.toString();
            const filter = { 'userId': userId.toLowerCase() };
            const date = new Date();

            let update = {};
            if (request.payload.highscore) {

                const key = "highscores." + request.payload.level;

                update = {
                    $set: {
                        figures: request.payload.figures,
                        [key]: {
                            score: request.payload.highscores[request.payload.level].score,
                            timestamp: date
                        },
                        flips: request.payload.flips,
                        lastPlayed: date
                    }
                };
            } else {

                update = {
                    $set: {
                        figures: request.payload.figures,
                        flips: request.payload.flips,
                        lastPlayed: date
                    }
                };
            }

            Statistic.findOneAndUpdate(filter, update, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                reply(stat);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/statistics/{userId}',
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

            Statistic.findOneAndDelete(filter, (err, stat) => {

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
    name: 'statistics'
};
