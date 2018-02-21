'use strict';

const Boom = require('boom');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const Score = server.plugins['hapi-mongo-models'].Score;
    const User = server.plugins['hapi-mongo-models'].User;


    server.route({
        method: 'GET',
        path: '/scores/top/{level}',
        config: {
            auth: {
                strategy: 'session',
                scope: ['admin','account']
            },
            validate: {
                query: {
                    event: Joi.string().allow(''),
                    limit: Joi.number().default(10),
                }
            }
        },
        handler: function (request, reply) {

            const sort = Score.sortAdapter('-score');

            let limit = 10; // default
            if (request.query.limit) {
                limit = parseInt(request.query.limit);
            }

            let query = {
                score: { $gt: 0 },
                level: { $eq: request.params.level }
            }

            if ((typeof request.query.event !== 'undefined') && (request.query.event !== '')) {
                query.event = { $eq: request.query.event }
            }

            // We need to do this to 'sub' the 'userId' for 'username'
            const pipeline = [
                {
                    $match: query
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'username'
                    }
                },
                {
                    $sort: sort
                },
                {
                    $limit: limit
                },
                {
                    $project: {
                        username: { $arrayElemAt: ['$username.username', 0] },
                        userId: 1,
                        score: 1,
                        level: 1,
                        timestamp: 1
                    }
                }
            ];

            Score.aggregate(pipeline, (err, results) => {

                if (err) {
                    return reply(err);
                }

                return reply(results);
            });
        }
    });


    server.route({
        method: 'GET',
        path: '/scores',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            },
            validate: {
                query: {
                    username: Joi.string().allow(''),
                    dateFrom: Joi.date().allow(''),
                    level: Joi.string().default('casual'),
                    event: Joi.string().allow(''),
                    sort: Joi.string().default('-score'),
                    limit: Joi.number().default(10),
                    page: Joi.number().default(1)
                }
            }
        },
        handler: function (request, reply) {

            const query = {
                score: { $gt: 0 },
                level: { $eq: request.query.level }
            };
            const lookup = {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'username'
            };
            const fields = {
                username: { $arrayElemAt: ['$username.username', 0] },
                userId: 1,
                score: 1,
                level: 1,
                timestamp: 1
            };

            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            // If we want scores only for a specific event
            if ((typeof request.query.event !== 'undefined') && (request.query.event != '')) {
                query.event = { $eq: request.query.event };
            }

            // Add date range if it's part of the request
            if ((typeof request.query.dateFrom !== 'undefined') && (request.query.dateFrom !== '')) {

                query.timestamp = {
                    $gte: new Date(request.query.dateFrom)
                };
            }

            // Check to see if we want to filter by userId
            if ((typeof request.query.username !== 'undefined') && (request.query.username !== '')) {

                User.findByUsername(request.query.username, (error, user) => {

                    if (error) {
                        return reply(error);
                    }

                    let searchUser = '';
                    if ((user !== null) && (typeof user._id !== 'undefined')) {
                        searchUser = user._id;
                    }
                    query.userId = {
                        $eq: searchUser
                    };

                    Score.pagedAggregate(query, fields, lookup, sort, limit, page, (err, results) => {

                        if (err) {
                            return reply(err);
                        }

                        return reply(results);
                    });
                });
            }
            // Otherwise return results for all users
            else {

                Score.pagedAggregate(query, fields, lookup, sort, limit, page, (err, results) => {

                    if (err) {
                        return reply(err);
                    }

                    return reply(results);
                });
            }
        }
    });


    server.route({
        method: 'GET',
        path: '/scores/interval/{minutes}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            const now = new Date();

            const query = {
                timestamp: {
                    $gte: new Date(now.getTime() - 1000 * 60 * 60)
                }
            };

            const group = {
                _id: {
                    interval: { $add: [
                        { $subtract: [
                            { $subtract: ['$timestamp', new Date(0)] },
                            { $mod: [
                                { $subtract: ['$timestamp', new Date(0)] },
                                1000 * 60 * 1
                            ] }
                        ] },
                        new Date(0)
                    ] },
                    level: '$level'
                },
                count: {
                    $sum: 1
                }
            };

            const fields = {
                _id: 0,
                interval: '$_id.interval',
                level: '$_id.level',
                count: '$count'
            };

            const sort = {
                interval: -1
            };

            Score.groupAggregate(query, group, fields, sort, (err, results) => {

                if (err) {
                    return reply(err);
                }

                return reply(results);
            });
        }
    });


    server.route({
        method: 'DELETE',
        path: '/scores/{userId}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            const userId = request.params.userId;
            const filter = { 'userId': userId.toLowerCase() };

            Score.deleteMany(filter, (err, stat) => {

                if (err) {
                    return reply(err);
                }

                if (!stat) {
                    return reply(Boom.notFound('Document(s) not found.'));
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
    name: 'scores'
};
