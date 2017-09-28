'use strict';

const Confidence = require('confidence');
const Config = require('./config');


const criteria = {
    env: process.env.NODE_ENV
};


const manifest = {
    server: {
        debug: {
            request: ['error']
        },
        cache: {
            name: 'redisCache',
            engine: require('catbox-redis'),
            shared: true,
            partition: 'cache',
            host: Config.get('/hapiRedis/host'),
            port: Config.get('/hapiRedis/port')
        },
        connections: {
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/web'),
        labels: ['web'],
        state: {
            isHttpOnly: false,
            isSecure: {
                $filter: 'env',
                production: true,
                $default: false
            }
        }
    }],
    registrations: [
        {
            plugin: 'bell'
        },
        {
            plugin: 'blipp'
        },
        {
            plugin: 'inert'
        },
        {
            plugin: 'vision'
        },
        {
            plugin: 'hapi-auth-cookie'
        },
        {
            plugin: {
                register: 'crumb',
                options: {
                    restful: true
                }
            }
        },
        {
            plugin: {
                register: 'visionary',
                options: {
                    engines: { jsx: 'hapi-react-views' },
                    compileOptions: {
                        removeCacheRegExp: '.jsx'
                    },
                    relativeTo: __dirname + '/../',
                    path: './server/web'
                }
            }
        },
        {
            plugin: {
                register: 'hapi-mongo-models',
                options: {
                    mongodb: Config.get('/hapiMongoModels/mongodb'),
                    models: {
                        Account: './server/models/account',
                        AdminGroup: './server/models/admin-group',
                        Admin: './server/models/admin',
                        AuthAttempt: './server/models/auth-attempt',
                        Session: './server/models/session',
                        User: './server/models/user',
                        Statistic: './server/models/statistic',
                        Score: './server/models/score'
                    },
                    autoIndex: Config.get('/hapiMongoModels/autoIndex')
                }
            }
        },
        {
            plugin: {
                register: 'good',
                options: {
                    ops: {
                        interval: 5000
                    },
                    reporters: {
                        consoleReporter: [
                            {
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{ log: '*', response: '*' }]
                            },
                            {
                                module: 'good-console'
                            },
                            'stdout'
                        ]
                    }
                }
            }
        },
        {
            plugin: 'hapi-io'
        },
        {
            plugin: {
                register: './server/hapi-io-redis',
                options: {
                    connection: {
                        host: Config.get('/hapiRedis/host'),
                        port: Config.get('/hapiRedis/port')
                    }
                }
            }
        },
        {
            plugin: './server/telemetry'
        },
        {
            plugin: './server/auth'
        },
        {
            plugin: './server/mailer'
        },
        {
            plugin: './server/api/accounts',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/admin-groups',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/admins',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/auth-attempts',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/contact',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/index',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/login',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/logout',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/sessions',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/signup',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/verify-account',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/users',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/statistics',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/scores',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/api/monitor',
            options: {
                routes: { prefix: '/api' }
            }
        },
        {
            plugin: './server/web/account'
        },
        {
            plugin: './server/web/admin'
        },
        {
            plugin: './server/web/main'
        },
        {
            plugin: './server/web/public'
        }
    ]
};


const store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
