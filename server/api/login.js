'use strict';

const Async = require('async');
const Bcrypt = require('bcrypt');
const Boom = require('boom');
const Config = require('../../config/config');
const Joi = require('joi');


const internals = {};


internals.applyRoutes = function (server, next) {

    const AuthAttempt = server.plugins['hapi-mongo-models'].AuthAttempt;
    const Session = server.plugins['hapi-mongo-models'].Session;
    const User = server.plugins['hapi-mongo-models'].User;
    const Event = server.plugins['hapi-mongo-models'].Event;
    const Account = server.plugins['hapi-mongo-models'].Account;


    server.route({
        method: 'POST',
        path: '/login',
        config: {
            validate: {
                payload: {
                    username: Joi.string().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
                    assign: 'abuseDetected',
                    method: function (request, reply) {

                        const ip = request.info.remoteAddress;
                        const username = request.payload.username;

                        AuthAttempt.abuseDetected(ip, username, (err, detected) => {

                            if (err) {
                                return reply(err);
                            }

                            if (detected) {
                                return reply(Boom.badRequest('Maximum number of auth attempts reached. Please try again later.'));
                            }

                            reply();
                        });
                    }
                },
                {
                    assign: 'validated',
                    method: function (request, reply) {

                        
                        const mailer = request.server.plugins.mailer;
                        const username = request.payload.username;

                        User.checkValidation(username, (err, validationComplete) => {

                            if (err) {
                                return reply(err);
                            }

                            if (!validationComplete) {

                                // Async Method to send reminder Mail
                                Async.auto({
                                    user: function (done) {

                                        User.findByUsername(username, done);
                                    },
                                    sendEmail: ['user', function (results, done) {

                                        if (results.user) {

                                            console.log(results.user);

                                            request.payload.publicURL = Config.get('/baseUrl') + '/verify';
                                            request.payload.email = results.user.email;
                                            request.payload.verificationToken = results.user.verification.token;

                                            const emailOptions = {
                                                subject: 'Your ' + Config.get('/projectName') + ' account',
                                                to: {
                                                    name: request.payload.username,
                                                    address: results.user.email
                                                }
                                            };
                                            const template = 'welcome';

                                            mailer.sendEmail(emailOptions, template, request.payload, (err) => {

                                                if (err) {
                                                    console.warn('sending welcome email failed:', err.stack);
                                                }
                                            });

                                            done();
                                         } else {
                                            // Unknown User
                                            done('Username and password combination not found or account is inactive.', null);
                                        }

                                    }]
                                }, (err, results) => {

                                    if (err) {
                                        return reply(err);
                                    }

                                    return reply(Boom.badRequest('Please Check your inbox for your verification email before loggin in. If didnt receive an email please contact and administrator'));
                                });
                            } else {

                                reply(validationComplete);
                            }
                        });
                    }
                },
                {
                    assign: 'user',
                    method: function (request, reply) {

                        const username = request.payload.username;
                        const password = request.payload.password;

                        User.findByCredentials(username, password, (err, user) => {

                            if (err) {
                                return reply(err);
                            }

                            reply(user);
                        });
                    }
                },
                {
                    assign: 'logAttempt',
                    method: function (request, reply) {

                        if (request.pre.user) {
                            return reply();
                        }

                        const ip = request.info.remoteAddress;
                        const username = request.payload.username;

                        AuthAttempt.create(ip, username, (err, authAttempt) => {

                            if (err) {
                                return reply(err);
                            }

                            return reply(Boom.badRequest('Username and password combination not found or account is inactive.'));
                        });
                    }
                }, {
                    assign: 'event',
                    method: function (request, reply) {

                        Async.auto({
                            account: function (done) {

                                const username = request.pre.user.username !== undefined ? request.pre.user.username : '';

                                Account.findByUsername(username, done);
                            },
                            accountEvent: ['account', function (results, done) {

                                // Make sure there is an associated account
                                if (results.account === null) {
                                    return reply();
                                }

                                const event = results.account.event !== undefined ? results.account.event : '';

                                Event.findByEvent(event, done);
                            }],
                            cookieEvent: ['accountEvent', function (results, done) {

                                let event = '';
                                if (request.state['sid-pexeso'] && request.state['sid-pexeso'].event) {
                                    event = request.state['sid-pexeso'].event;
                                }

                                Event.findByEvent(event, done);
                            }],
                            updateAccount: ['cookieEvent', function (results, done) {

                                // First see if we have a *new* event in our cookie
                                if ((results.cookieEvent) && (results.cookieEvent.isActive === true)) {

                                    const id = results.account._id;
                                    const update = {
                                        $set: {
                                            event: results.cookieEvent.name
                                        }
                                    };

                                    Account.findByIdAndUpdate(id, update, done);
                                }
                                // Else check to see if the account holds an existing event
                                else {

                                    // Delete any inactive events from the account
                                    if ((results.accountEvent) && (results.accountEvent.isActive === false)) {

                                        const id = results.account._id;
                                        const rem = {
                                            $unset: {
                                                event: ''
                                            }
                                        };

                                        Account.findByIdAndUpdate(id, rem, done);
                                    } else {
                                        done(); // Do nothing
                                    }
                                }
                            }]
                        }, (err, results) => {

                            if (err) {
                                return reply(err);
                            }

                            return reply(results);
                        });
                    }
                }, {
                    assign: 'session',
                    method: function (request, reply) {

                        Session.create(request.pre.user._id.toString(), (err, session) => {

                            if (err) {
                                return reply(err);
                            }

                            return reply(session);
                        });
                    }
                }
            ]
        },
        handler: function (request, reply) {

            const credentials = request.pre.session._id.toString() + ':' + request.pre.session.key;
            const authHeader = 'Basic ' + new Buffer(credentials).toString('base64');

            const result = {
                user: {
                    _id: request.pre.user._id,
                    username: request.pre.user.username,
                    email: request.pre.user.email,
                    roles: request.pre.user.roles
                },
                session: request.pre.session,
                authHeader
            };

            // Update account..

            // Get the socket.io object
            const io = request.plugins['hapi-io'].io;

            // Successfully logged in, increment the login count
            io.emit('logged_in', {
                count: 1
            });

            request.cookieAuth.set(result);
            reply(result);
        }
    });


    server.route({
        method: 'POST',
        path: '/login/forgot',
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().required()
                }
            },
            pre: [{
                assign: 'user',
                method: function (request, reply) {

                    const conditions = {
                        email: request.payload.email
                    };

                    User.findOne(conditions, (err, user) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!user) {
                            return reply({
                                success: true
                            }).takeover();
                        }

                        reply(user);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            const mailer = request.server.plugins.mailer;

            Async.auto({
                keyHash: function (done) {

                    Session.generateKeyHash(done);
                },
                user: ['keyHash', function (results, done) {

                    const id = request.pre.user._id.toString();
                    const update = {
                        $set: {
                            resetPassword: {
                                token: results.keyHash.hash,
                                expires: Date.now() + 10000000
                            }
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }],
                email: ['user', function (results, done) {

                    const emailOptions = {
                        subject: 'Reset your ' + Config.get('/projectName') + ' password',
                        to: request.payload.email
                    };
                    const template = 'forgot-password';
                    const context = {
                        baseHref: Config.get('/baseUrl') + '/login/reset',
                        email: results.user.email,
                        key: results.keyHash.key
                    };

                    mailer.sendEmail(emailOptions, template, context, done);
                }]
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply({
                    success: true
                });
            });
        }
    });


    server.route({
        method: 'POST',
        path: '/login/reset',
        config: {
            validate: {
                payload: {
                    key: Joi.string().required(),
                    email: Joi.string().email().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
                assign: 'user',
                method: function (request, reply) {

                    const conditions = {
                        email: request.payload.email,
                        'resetPassword.expires': {
                            $gt: Date.now()
                        }
                    };

                    User.findOne(conditions, (err, user) => {

                        if (err) {
                            return reply(err);
                        }

                        if (!user) {
                            return reply(Boom.badRequest('Invalid email or key.'));
                        }

                        reply(user);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            Async.auto({
                keyMatch: function (done) {

                    const key = request.payload.key;
                    const token = request.pre.user.resetPassword.token;
                    Bcrypt.compare(key, token, done);
                },
                passwordHash: ['keyMatch', function (results, done) {

                    if (!results.keyMatch) {
                        return reply(Boom.badRequest('Invalid email or key.'));
                    }

                    User.generatePasswordHash(request.payload.password, done);
                }],
                user: ['passwordHash', function (results, done) {

                    const id = request.pre.user._id.toString();
                    const update = {
                        $set: {
                            password: results.passwordHash.hash
                        },
                        $unset: {
                            resetPassword: undefined
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }]
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                reply({
                    success: true
                });
            });
        }
    });


    next();
};


exports.register = function (server, options, next) {

    server.dependency(['mailer', 'hapi-mongo-models'], internals.applyRoutes);

    next();
};


exports.register.attributes = {
    name: 'login'
};