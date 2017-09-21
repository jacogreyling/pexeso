'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');

const initialState = {
    hydrated: false,
    difficulty: 'casual',
    loading: false,
    error: undefined,
    data: []
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

    if (action.type === Constants.RESET_DIFFICULTY) {

        return ObjectAssign({}, initialState, {
            difficulty: action.level
        });
    }

    if (action.type === Constants.UPDATE_TOP_SCORES) {

        return ObjectAssign({}, initialState, {
            data: action.data
        });
    }


    return state;
};


module.exports = reducer;
