'use strict';

const Telemetry = require('./reducers/telemetry');
const Graph = require('./reducers/graph');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        telemetry: Telemetry,
        graph: Graph
    })
);
