'use strict';

const Glue = require('glue');
const BabelRegister = require('babel-core/register');
const Manifest = require('./config/manifest');


const composeOptions = {
    relativeTo: __dirname,
    preRegister: function (server, next) {

        BabelRegister();

        next();
    }
};

Glue.compose(Manifest.get('/'), composeOptions, (err, server) => {

    if (err) {
        console.log('server.register err:', err);
    }

    server.start(() => {

        console.log('Server is listening on ' + server.info.uri.toLowerCase());
    });
});
