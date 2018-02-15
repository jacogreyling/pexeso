'use strict';

const Async = require('async');
const Boom = require('boom');
const Config = require('../../config/config');
const Joi = require('joi');
const HexGen = require('../helpers/hex-generator');

const internals = {};


internals.applyRoutes = function (server, next) {

    const Account = server.plugins['hapi-mongo-models'].Account;
    const User = server.plugins['hapi-mongo-models'].User;
    const Statistic = server.plugins['hapi-mongo-models'].Statistic;
    const Event = server.plugins['hapi-mongo-models'].Event;


    server.route({
        method: 'POST',
        path: '/signup',
        config: {
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            validate: {
                payload: {
                    name: Joi.string().required(),
                    email: Joi.string().email().lowercase().required(),
                    mobile: Joi.string().regex(/((?:\+27|27)|0)[\s-]?(\d{2})[\s-]?(\d{3})[\s-]?(\d{4})[\s]*$/gm).required(),
                    username: Joi.string().token().lowercase().required(),
                    password: Joi.string().required()
                }
            },
            pre: [{
                assign: 'usernameCheck',
                method: function (request, reply) {

                    const conditions = {
                        username: request.payload.username
                    };

                    User.findOne(conditions, (err, user) => {

                        if (err) {
                            return reply(err);
                        }

                        if (user) {
                            return reply(Boom.conflict('Username already in use.'));
                        }

                        reply(true);
                    });
                }
            }, {
                assign: 'emailCheck',
                method: function (request, reply) {

                    const conditions = {
                        email: request.payload.email
                    };

                    User.findOne(conditions, (err, user) => {

                        if (err) {
                            return reply(err);
                        }

                        if (user) {
                            return reply(Boom.conflict('Email already in use.'));
                        }

                        reply(true);
                    });
                }
            }]
        },
        handler: function (request, reply) {

            const mailer = request.server.plugins.mailer;

            Async.auto({
                user: function (done) {

                    const username = request.payload.username;
                    const password = request.payload.password;
                    const email = request.payload.email;

                    User.create(username, password, email, done);
                },
                account: ['user', function (results, done) {

                    const name = request.payload.name;

                    Account.create(name, done);
                }],
                cookieEvent: ['account', function (results, done) {

                    let event = '';
                    if (request.state['sid-pexeso'] && request.state['sid-pexeso'].event) {
                        event = request.state['sid-pexeso'].event;
                    }

                    Event.findByEvent(event, done);
                }],
                updateAccount: ['cookieEvent', function (results, done) {

                    // First see if the latest event is 'active'
                    if ((results.cookieEvent) && (results.cookieEvent.isActive === true)) {

                        const id = results.account._id;
                        const update = {
                            $set: {
                                event: results.cookieEvent.name
                            }
                        };

                        Account.findByIdAndUpdate(id, update, done);
                    }
                }],
                linkUser: ['account', function (results, done) {

                    const id = results.account._id.toString();
                    const mobilenum = request.payload.mobile;

                    const update = {
                        $set: {
                            user: {
                                id: results.user._id.toString(),
                                name: results.user.username,
                                mobile: mobilenum
                            }
                        }
                    };

                    Account.findByIdAndUpdate(id, update, done);
                }],
                linkAccount: ['account', function (results, done) {

                    const id = results.user._id.toString();
                    const update = {
                        $set: {
                            roles: {
                                account: {
                                    id: results.account._id.toString(),
                                    name: results.account.name.first + ' ' + results.account.name.last
                                }
                            }
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                }],
                statistics: ['account', function (results, done) {

                    const userId = results.user._id.toString();

                    // Empty stats object
                    const stats = {
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

                    Statistic.create(userId, stats, done);
                }],
                generateVerificationCode: ['account', function (results, done) {

                    const id = results.user._id.toString();
                    const verificationToken = HexGen(24).toLowerCase();

                    const update = {
                        $set: {
                            verification: {
                                token: verificationToken,
                                validated: false
                            }
                        }
                    };

                    User.findByIdAndUpdate(id, update, done);
                    request.payload.verificationToken = verificationToken;
                }],
                welcome: ['linkUser', 'linkAccount', 'generateVerificationCode', function (results, done) {

                    request.payload.publicURL = Config.get('/baseUrl') + '/verify';

                    const emailOptions = {
                        subject: 'Your ' + Config.get('/projectName') + ' account',
                        to: {
                            name: request.payload.name,
                            address: request.payload.email
                        }
                    };
                    const template = 'welcome';

                    mailer.sendEmail(emailOptions, template, request.payload, (err) => {

                        if (err) {
                            console.warn('sending welcome email failed:', err.stack);
                        }
                    });

                    done();
                }]
            }, (err, results) => {

                if (err) {
                    return reply(err);
                }

                const user = results.linkAccount;

                const result = {
                    user: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        roles: user.roles
                    }
                };

                reply(result);
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
    name: 'signup'
};
