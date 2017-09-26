'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');

const initialState = {
    hydrated: false,
    loading: false,
    error: undefined,
    dateFrom: undefined,
    level: 'casual',
    live: true,
    data: [],
    pages: {},
    items: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_TOP_SCORES) {

        return ObjectAssign({}, state, {
            hydrated: false,
            loading: true
        });
    }

    if (action.type === Constants.GET_TOP_SCORES_RESPONSE) {

        return ObjectAssign({}, state, {
            hydrated: true,
            loading: false,
            data: action.response
        });
    }

    if (action.type === Constants.SET_LEVEL) {

        // We must also clear the data object since we're changing levels
        return ObjectAssign({}, state, {
            level: action.level,
            data: [],
            pages: {},
            items: {}
        });
    }

    if (action.type === Constants.UPDATE_TOP_SCORES) {

        return ObjectAssign({}, state, {
            data: action.data
        });
    }

    if (action.type === Constants.UPDATE_DATE_FROM) {

        return ObjectAssign({}, state, {
            dateFrom: action.date
        });
    }

    if (action.type === Constants.INSERT_DATE_FROM) {

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

    if (action.type === Constants.TOGGLE_LIVE_MODE) {

        return ObjectAssign({}, state, {
            live: !state.live
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
            data: action.response.data,
            pages: action.response.pages,
            items: action.response.items
        });
    }


    return state;
};


module.exports = reducer;
