'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');

const initialState = {
    hydrated: false,
    loading: false,
    error: undefined,
    level: 'casual',
    position: undefined,
    data: [],
    pages: {},
    items: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_EVENT_SCORES) {

        // Find the right level
        const url = action.request.url.split('/');
        const level = url.pop();

        return ObjectAssign({}, state, {
            hydrated: false,
            loading: true,
            level
        });
    }

    if (action.type === Constants.GET_EVENT_SCORES_RESPONSE) {

        return ObjectAssign({}, state, {
            hydrated: true,
            loading: false,
            live: true,
            data: action.response
        });
    }

    if (action.type === Constants.SET_LEVEL) {

        if (typeof action.live === 'undefined') {
            return ObjectAssign({}, initialState, {
                level: action.level
            });
        }

        return ObjectAssign({}, initialState, {
            level: action.level,
            live: action.live
        });
    }

    return state;
};


module.exports = reducer;
