'use strict';

const Confidence = require('confidence');
const Dotenv = require('dotenv');


Dotenv.config({ silent: true });

const criteria = {
    env: process.env.NODE_ENV
};


const config = {
    projectName: 'pexeso',
    port: {
        web: {
            $filter: 'env',
            production: process.env.PORT,
            test: 9000,
            $default: 8000
        }
    },
    ssl: {
        $filter: 'env',
        production: process.env.USE_SSL,
        $default: false
    },
    baseUrl: {
        $filter: 'env',
        $meta: 'values should not end in "/"',
        production: process.env.PUBLIC_URL,
        $default: 'http://localhost:8000'
    },
    authAttempts: {
        forIp: 50,
        forIpAndUser: 7
    },
    cookieSecret: {
        $filter: 'env',
        production: process.env.COOKIE_SECRET,
        $default: '!k3yb04rdK4tz~4qu4~k3yb04rdd0gz!'
    },
    hapiMongoModels: {
        mongodb: {
            uri: {
                $filter: 'env',
                production: process.env.MONGODB_URI,
                test: 'mongodb://localhost:27017/pexeso-test',
                $default: 'mongodb://localhost:27017/pexeso'
            }
        },
        autoIndex: true
    },
    hapiRedis: {
        host: {
            $filter: 'env',
            production: process.env.REDIS_HOST,
            test: 'localhost',
            $default: 'localhost'
        },
        port: {
            $filter: 'env',
            production: process.env.REDIS_PORT,
            test: 6379,
            $default: 6379
        },
        password: {
            $filter: 'env',
            production: process.env.REDIS_PASSWORD,
            test: 6379,
            $default: 6379
        }
    },
    nodemailer: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'ca.pexeso@gmail.com',
            pass: process.env.SMTP_PASSWORD
        }
    },
    system: {
        fromAddress: {
            name: 'Pexeso Admin',
            address: 'ca.pexeso@gmail.com'
        },
        toAddress: {
            name: 'Pexeso Admin',
            address: 'ca.pexeso@gmail.com'
        }
    }
};


const store = new Confidence.Store(config);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
