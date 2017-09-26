'use strict';

const Async = require('async');
const AuthPlugin = require('../auth');
const Boom = require('boom');
const EscapeRegExp = require('escape-string-regexp');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const User = server.plugins['hapi-mongo-models'].User;
    const Score = server.plugins['hapi-mongo-models'].Score;


    server.route({
        method: 'GET',
        path: '/scores/top/{level}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            const page = 1;
            const sort = Score.sortAdapter('-score');
            const fields = {};

            let limit = 10; // default
            if (request.query.limit) {
                limit = parseInt(request.query.limit);
            }

            // We need to do this to 'sub' the 'userId' for 'username'
            const pipeline = [
                {
                    $match: {
                        score: { $gt: 0 },
                        level: { $eq: request.params.level}
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "username"
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
                        username: { $arrayElemAt: [ "$username.username", 0 ] },
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
                    sort: Joi.string().default('-score'),
                    limit: Joi.number().default(10),
                    page: Joi.number().default(1)
                }
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
        },
        handler: function (request, reply) {

            const query = {
                score: { $gt: 0 },
                level: { $eq: request.query.level}
            };
            const lookup = {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "username"
            }
            const fields = {
                username: { $arrayElemAt: [ "$username.username", 0 ] },
                score: 1,
                level: 1,
                timestamp: 1
            };

            const sort = request.query.sort;
            const limit = request.query.limit;
            const page = request.query.page;

            // Add date range if it's part of the request
            if ((typeof request.query.dateFrom !== 'undefined') && (request.query.dateFrom !== '')) {

                query.timestamp = {
                    $gte: new Date(request.query.dateFrom)
                };
            }

            Score.pagedAggregate(query, fields, lookup, sort, limit, page, (err, results) => {
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
            },
            pre: [
                AuthPlugin.preware.ensureAdminGroup('root')
            ]
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
