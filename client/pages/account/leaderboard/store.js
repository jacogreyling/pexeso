'use strict';

const Leaderboard = require('./reducers/leaderboard');
const Redux = require('redux');
const User = require('./reducers/user');
const Events = require('./reducers/event');


module.exports = Redux.createStore(
    Redux.combineReducers({
        leaderboard: Leaderboard,
        user: User,
        event: Events
    })
);
