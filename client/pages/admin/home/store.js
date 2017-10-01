'use strict';

const Telemetry = require('./reducers/telemetry');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        telemetry: Telemetry
    })
);
