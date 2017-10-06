'use strict';

const Hoek = require('hoek');
const Url = require('url');


exports.register = function (server, options, next) {

    Hoek.assert(options, 'options is required');

    const redirect = options.redirect || false;

    // Redirect all 'http' traffic in production
    server.ext({

        type: 'onRequest',
        method: function (request, reply) {

            const host = request.headers.host;
            const protocol = request.connection.info.protocol;

            if ((redirect === 'true') &&
                (process.env.NODE_ENV === 'production') &&
                (request.headers['x-forwarded-proto'] !== 'https')) {

                return reply()
                    .redirect(Url.format({
                        protocol,
                        hostname: host,
                        pathname: request.url.pathname,
                        search: request.url.search }))
                    .code(301);
            }

            return reply.continue();
        }
    });

    next();
};


exports.register.attributes = {
    name: 'https-redirect',
    version: '1.0.0'
};
