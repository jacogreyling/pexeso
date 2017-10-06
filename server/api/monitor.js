'use strict';

const Async = require('async');

const internals = {};


internals.applyRoutes = function (server, next) {

    const User = server.plugins['hapi-mongo-models'].User;
    const Session = server.plugins['hapi-mongo-models'].Session;


    server.route({
        method: 'GET',
        path: '/monitor',
        config: {
            auth: {
                strategy: 'session',
                scope: 'admin'
            }
        },
        handler: function (request, reply) {

            Async.auto({
                users: function (done) {

                    const query = {};

                    // Only count 'active' users
                    query.isActive = true;

                    User.count(query, done);
                },
                sessions: ['users', function (results, done) {

                    Session.count({}, done);
                }],
                cache: ['sessions', function (results, done) {

                    // Get the global state from the cache and reply
                    server.cache({ segment: 'telemetry', cache: 'redisCache' })
                        .get('stats', (err, value, cached, log) => {

                            done(err, value);
                        });
                }]
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                const data = {
                    users: results.users,
                    sessions: results.sessions,
                    games: results.cache.games,
                    apiCalls: results.cache.apiCalls
                };

                reply(data);
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['auth', 'telemetry'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'monitor'
};
