'use strict';

const Confidence = require('confidence');
const Dotenv = require('dotenv');


Dotenv.config({
    silent: true
});

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
        forIp: 150,
        forIpAndUser: 70
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
        url: {
            $filter: 'env',
            production: process.env.REDIS_URL,
            test: 'null',
            $default: 'redis://localhost:6379'
        }
    },
    nodemailer: {
        host: process.env.SMTP_HOSTNAME,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        },
        tls: {
            ciphers: 'SSLv3'
        }
    },
    system: {
        fromAddress: {
            name: 'Pexeso Admin',
            address: process.env.SMTP_ADDRESS
        },
        toAddress: {
            name: 'Pexeso Admin',
            address: process.env.SMTP_ADDRESS
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