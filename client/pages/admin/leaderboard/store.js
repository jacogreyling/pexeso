'use strict';

const Leaderboard = require('./reducers/leaderboard');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        leaderboard: Leaderboard
    })
);
