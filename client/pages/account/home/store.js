'use strict';

const Statistics = require('./reducers/statistics');
const Tiles = require('./reducers/tiles');
const Board = require('./reducers/board');
const Redux = require('redux');


module.exports = Redux.createStore(
    Redux.combineReducers({
        statistics: Statistics,
        tiles: Tiles,
        board: Board
    })
);
