'use strict';

const Glue = require('glue');
const Hoek = require('hoek');
const BabelRegister = require('babel-core/register');
const Manifest = require('./config/manifest');


const composeOptions = {
    relativeTo: __dirname,
    preRegister: function (server, next) {

        BabelRegister();

        next();
    }
};

console.log('Starting HTTP Node server...');
console.log('NODE_ENV is ' + `"${process.env.NODE_ENV}"`);
Glue.compose(Manifest.get('/'), composeOptions, (err, server) => {

    if (err) {
        console.log('Server registration error: ', err);
    }

    server.start((err) => {

        Hoek.assert(!err, err);

        console.log('Server is listening on ' + server.info.uri.toLowerCase());
    });
});
