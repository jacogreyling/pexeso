'use strict';

const Async = require('async');
const Boom = require('boom');
const Hoek = require('hoek');
const Joi = require('joi');
const Md5 = require('../../node_modules/blueimp-md5/js/md5');

const internals = {};


internals.applyRoutes = function (server, next) {

    const Statistic = server.plugins['hapi-mongo-models'].Statistic;
    const Score = server.plugins['hapi-mongo-models'].Score;
    const Account = server.plugins['hapi-mongo-models'].Account;
    const Event = server.plugins['hapi-mongo-models'].Event;


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
            const username = request.auth.credentials.user.username.toString();

            Statistic.findByUserId(userId, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                if (!stat) {
                    return reply(Boom.notFound(`Document for ${username} not found.`));
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
                            score: Joi.number().integer()
                        }),
                        medium: Joi.object().keys({
                            score: Joi.number().integer()
                        }),
                        hard: Joi.object().keys({
                            score: Joi.number().integer()
                        })
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

            const userId = request.auth.credentials.user._id.toString();

            let stats = request.payload;
            if ((typeof stats === 'undefined') || (Hoek.deepEqual(stats, {}))) {

                stats = {
                    figures: {
                        won: 0,
                        lost: 0,
                        abandoned: 0
                    },
                    highscores: {
                        casual: {
                            score: 0,
                            timestamp: undefined
                        },
                        medium: {
                            score: 0,
                            timestamp: undefined
                        },
                        hard: {
                            score: 0,
                            timestamp: undefined
                        }
                    },
                    flips: {
                        total: 0,
                        matched: 0,
                        wrong: 0
                    }
                };
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
        method: 'PATCH',
        path: '/statistics/my',
        config: {
            auth: {
                strategy: 'session',
                scope: 'account'
            },
            validate: {
                payload: {
                    flips: Joi.object().keys({
                        total: Joi.number().integer(),
                        matched: Joi.number().integer(),
                        wrong: Joi.number().integer()
                    }),
                    status: Joi.string().required(),
                    score: Joi.number().integer().required(),
                    time: Joi.number().required(),
                    level: Joi.string().required(),
                    seckey: Joi.string().required()
                }
            },
            ext: {
                // Use the 'post-handler' to update the Scores collection
                onPostHandler: {
                    method: function (request, reply) {

                        const seckey = Md5(request.payload.status + request.payload.score + request.payload.level);

                        // Verify the security key is matching
                        if (request.payload.seckey === seckey) {

                            // On every successful round, update the games collections
                            if ((request.payload.status === 'won') && (request.auth.isAuthenticated)) {

                                Async.auto({
                                    account: function (done) {
        
                                        const username = request.auth.credentials.user.username !== undefined ? request.auth.credentials.user.username : '';
            
                                        Account.findByUsername(username, done);                            
                                    },
                                    event: ['account', function (results, done) {
                                        
                                        const event = results.account.event !== undefined ? results.account.event : '';
                            
                                        Event.findByEvent(event, done);
                                    }],
                                    updateScore: ['event', function (results, done) {

                                        let document = {
                                            userId: Score.ObjectId(request.auth.credentials.user._id.toString()),
                                            score: request.payload.score,
                                            time: request.payload.time,
                                            level: request.payload.level,
                                            timestamp: request.response.source.lastPlayed
                                        };

                                        if (results.event !== null) {
                                            document.event = results.event.name;
                                        }

                                        Score.insertOne(document, done);
                                    }]
                                }, (err, results) => {

                                    if (err) {
                                        console.warn('Could not update the Score collection with a new document: ' + err);
                                    }

                                    // Get the socket.io object
                                    const io = request.plugins['hapi-io'].io;

                                    let document = {
                                        _id: results.updateScore[0]._id,
                                        username: request.auth.credentials.user.username,
                                        score: request.payload.score,
                                        time: request.payload.time,
                                        level: request.payload.level,
                                        timestamp: request.response.source.lastPlayed
                                    };

                                    if (results.event !== null) {
                                        document.event = results.event.name;
                                    }

                                    // Successfully created a new user, increment the user count
                                    io.emit('new_score', document);
                                });
                            }
                        }

                        return reply.continue();
                    }
                }
            }
        },
        handler: function (request, reply) {

            const userId = request.auth.credentials.user._id.toString();
            const filter = { 'userId': userId.toLowerCase() };
            const date = new Date();
            const seckey = Md5(request.payload.status + request.payload.score + request.payload.level);

            //Verify the Security Key is Matching
            if (request.payload.seckey === seckey) {

                Statistic.findOne(filter, (err, stat) => {

                    if (err) {
                        return reply(err);
                    }

                    let update = {};

                    // Now lets update the figures
                    switch (request.payload.status) {
                        case 'won':
                            stat.figures.won++;
                            break;
                        case 'abandoned':
                            stat.figures.abandoned++;
                            break;
                        case 'lost':
                            stat.figures.lost++;
                            break;
                        default:
                            // Do nothing
                    }

                    // Update the highscore object
                    let highscore = {};
                    if (request.payload.score > stat.highscores[request.payload.level].score) {

                        highscore = {
                            score: request.payload.score,
                            timestamp: date
                        };
                    }

                    // Update the flips
                    stat.flips.total += request.payload.flips.total;
                    stat.flips.matched += request.payload.flips.matched;
                    stat.flips.wrong += request.payload.flips.wrong;

                    const key = 'highscores.' + request.payload.level;

                    if (highscore.score) {
                        update = {
                            $set: {
                                figures: stat.figures,
                                [key]: {
                                    score: request.payload.score,
                                    timestamp: date
                                },
                                flips: stat.flips,
                                lastPlayed: date
                            }
                        };
                    }
                    else {
                        update = {
                            $set: {
                                figures: stat.figures,
                                flips: stat.flips,
                                lastPlayed: date
                            }
                        };
                    }

                    Statistic.findByIdAndUpdate(stat._id, update, (err, data) => {

                        if (err) {
                            return reply(err);
                        }

                        reply(data);
                    });
                });
            }
            else {

                return reply(Boom.forbidden());
            }
        }
    });


    server.route({
        method: 'DELETE',
        path: '/statistics/{userId}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
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
