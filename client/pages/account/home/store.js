'use strict';

const Memory = require('./reducers/memory');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        memory: Memory
    })
);
