'use strict';

const Stats = require('./reducers/stats');
const Tiles = require('./reducers/tiles');
const Board = require('./reducers/board');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        stats: Stats,
        tiles: Tiles,
        board: Board
    })
);
