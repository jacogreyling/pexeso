'use strict';

// Time intervals
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;


exports.register = function (server, options, next) {

    // Create the global statistics cache object on startup
    const cache = server.cache({
        segment: 'telemetry',
        shared: true,
        expiresIn: 24 * HOUR,
        cache: 'redisCache',
        generateFunc: function (id, nxt) {

            const telemetry = {
                apiCalls: 0,
                games: {
                    won: 0,
                    lost: 0,
                    abandoned: 0
                }
            };

            return nxt(null, telemetry);
        },
        generateTimeout: false
    });

    // Create server extention to report telemetry data over web sockets
    server.ext([{

        // Count every /api call
        type: 'onRequest',
        method: function (request, reply) {

            if (request.path.startsWith('/api')) {

                // Retrieve the global statistics from cache
                cache.get('stats', (err, value, cached, log) => {

                    if (err) {
                        console.warn(err);
                    }

                    // Increment the API calls
                    value.apiCalls++;

                    // Update the global statistcs
                    cache.set('stats', value, null, (err) => {

                        if (err) {
                            console.warn(err);
                        }

                        // Get the socket.io object
                        const io = request.plugins['hapi-io'].io;

                        // Successfully created a new user, increment the user count
                        io.emit('api_calls', {
                            count: value.apiCalls
                        });
                    });
                });
            }

            return reply.continue();
        }
    }, {

        // Only calculate the statistics after a successful update
        type: 'onPostHandler',
        method: function (request, reply) {

            if ((request.path === '/api/statistics/my') && (request.method === 'patch')) {

                // Retrieve the global statistics from cache
                cache.get('stats', (err, value, cached, log) => {

                    if (err) {
                        console.warn(err);
                    }

                    // Update the server-side telemetry
                    switch (request.payload.status) {
                        case 'won':
                            value.games.won++;
                            break;
                        case 'lost':
                            value.games.lost++;
                            break;
                        case 'abandoned':
                            value.games.abandoned++;
                            break;
                        default:
                            // Do nothing
                    }

                    // Update the global statistcs
                    cache.set('stats', value, null, (err) => {

                        if (err) {
                            console.warn(err);
                        }

                        // Get the socket.io object
                        const io = request.plugins['hapi-io'].io;

                        // Successfully created a new user, increment the user count
                        io.emit('statistics', {
                            games: value.games
                        });
                    });
                });
            }

            return reply.continue();
        }
    }]);

    next();
};


exports.register.attributes = {
    name: 'telemetry',
    version: '1.0.0',
    dependencies: ['hapi-io', 'hapi-io-redis']
};
