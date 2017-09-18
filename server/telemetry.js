'use strict';

const internals = {};


internals.telemetry = function (server, next) {

    // Set-up the server-specific run-time application state
    server.app.telemetry = {
        apiCalls: 0,
        games: {
            won: 0,
            lost: 0,
            abandoned: 0
        }
    }

    // Create 2x server extentions to report telemetry data over web sockets
    server.ext([{
        // Count every /api call
        type: 'onRequest',
        method: function (request, reply) {

            if (request.path.startsWith('/api')) {

                // Get the socket.io object
                const io = request.plugins['hapi-io'].io;

                // Successfully created a new user, increment the user count
                io.emit('api_calls', {
                    count: request.server.app.telemetry.apiCalls += 1
                });
            }

            return reply.continue();
        }
    }, {
        // Only calculate the statistics if successfully authenticated and validated
        type: 'onPreHandler',
        method: function (request, reply) {

            if ((request.path === '/api/stats/my') && (request.method === 'put')) {

                // Update the server-side telemetry
                switch (request.payload.status) {
                    case "won":
                        request.server.app.telemetry.games.won += 1;
                        break;
                    case "lost":
                        request.server.app.telemetry.games.lost += 1;
                        break;
                    case "abandoned":
                        request.server.app.telemetry.games.abandoned += 1;
                        break;
                    default:
                        // Do nothing
                }

                // Get the socket.io object
                const io = request.plugins['hapi-io'].io;

                // Successfully created a new user, increment the user count
                io.emit('statistics', {
                    games: request.server.app.telemetry.games
                });
            }

            return reply.continue();
        }
    }]);

    next();
};

exports.register = function (server, options, next) {

    server.dependency(['hapi-io'], internals.telemetry);

    next();
};


exports.register.attributes = {
    name: 'telemetry'
};
