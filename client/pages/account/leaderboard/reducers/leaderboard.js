'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');

const initialState = {
    hydrated: false,
    loading: false,
    error: undefined,
    dateFrom: undefined,
    level: 'casual',
    live: true,
    position: undefined,
    data: [],
    pages: {},
    items: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_LIVE_SCORES) {

        // Find the right level
        const url = action.request.url.split('/');
        const level = url.pop();

        return ObjectAssign({}, state, {
            hydrated: false,
            loading: true,
            level
        });
    }

    if (action.type === Constants.GET_LIVE_SCORES_RESPONSE) {

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

    if (action.type === Constants.UPDATE_LIVE_SCORES) {

        return ObjectAssign({}, state, {
            data: action.data,
            live: true,
            position: action.position
        });
    }

    if (action.type === Constants.REMOVE_NEW_POSITION) {

        return ObjectAssign({}, state, {
            position: undefined
        });
    }

    if (action.type === Constants.UPDATE_DATE_FROM) {

        return ObjectAssign({}, state, {
            dateFrom: action.date
        });
    }

    if (action.type === Constants.SET_DATE_FROM) {

        return ObjectAssign({}, state, {
            dateFrom: action.date,
            live: false
        });
    }

    if (action.type === Constants.RESET_DATE_FROM) {

        return ObjectAssign({}, state, {
            dateFrom: undefined
        });
    }

    if (action.type === Constants.SET_LIVE_MODE) {

        return ObjectAssign({}, state, {
            live: action.condition
        });
    }

    if (action.type === Constants.GET_RESULTS) {
        return ObjectAssign({}, state, {
            hydrated: false,
            loading: true
        });
    }

    if (action.type === Constants.GET_RESULTS_RESPONSE) {
        return ObjectAssign({}, state, {
            hydrated: true,
            loading: false,
            live: false,
            data: action.response.data,
            pages: action.response.pages,
            items: action.response.items
        });
    }


    return state;
};


module.exports = reducer;
