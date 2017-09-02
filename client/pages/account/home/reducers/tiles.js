'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');

const initialState = {
    logo: "flip",
    tile: [{
        id: undefined,
        state: false
    }],
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.FLIP_TILE) {
        const tiles = state.tile;

        for (let entry of tiles) {
            if (entry.id === action.id || entry.state) {
                entry.state = !entry.state;
            }
        };

        return ObjectAssign({}, state, {
            tile: tiles
        });
    }

    if (action.type === Constants.ADD_TILE) {
        const tiles = state.tile;

        tiles.push({
            id: action.id,
            state: false
        });

        return ObjectAssign({}, initialState, {
            tile: tiles
        });
    }

    if (action.type === Constants.CHANGE_LOGO) {

        return ObjectAssign({}, state, {
            logo: action.logo
        })
    }


    return state;
};


module.exports = reducer;
