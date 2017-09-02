'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');

const initialState = {
    hydrated: false,
    showFetchFailure: false,
    statsAvailable: false,
    _id: undefined,
    status: undefined,
    figures: {
        won: undefined,
        lost: undefined,
        abandoned: undefined
    },
    highscores: {
        casual: undefined,
        medium: undefined,
        hard: undefined
    },
    flips: {
        total: undefined,
        matched: undefined,
        wrong: undefined
    }
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_STATS) {

        return ObjectAssign({}, state, {
            hydrated: false
        });
    }

    if (action.type === Constants.GET_STATS_RESPONSE) {

        // Check if we got a valid response back
        if (action.err) {
            return ObjectAssign({}, state, {
                hydrated: true,
                showFetchedFailure: true,
                statsAvailable: false
            })
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            showFetchFailure: !!action.err,
            _id: action.response._id,
            status: undefined,
            figures: action.response.figures,
            highscores: action.response.highscores,
            flips: action.response.flips
        });
    }

    if (action.type === Constants.CREATE_STATS) {

        return ObjectAssign({}, initialState, {
            hydrated: false
        });
    }

    if (action.type === Constants.CREATE_STATS_RESPONSE) {

        if (action.err) {
            return ObjectAssign({}, state, {
                hydrated: true,
                showFetchedFailure: true,
                statsAvailable: false
            })
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            showFetchFailure: !!action.err,
            _id: action.response._id,
            status: undefined,
            figures: action.response.figures,
            highscores: action.response.highscores,
            flips: action.response.flips
        });
    }

    if (action.type === Constants.UPDATE_STATS) {

        return ObjectAssign({}, state, {
            hydrated: true,
            status: action.stats.status,
            figures: action.stats.figures,
            highscores: action.stats.highscores,
            flips: action.stats.flips
        });
    }

    if (action.type === Constants.SAVE_STATS) {

        return ObjectAssign({}, state, {
            hydrated: false
        });
    }

    if (action.type === Constants.SAVE_STATS_RESPONSE) {

        if (action.err) {
            return ObjectAssign({}, state, {
                hydrated: true,
                showFetchedFailure: true,
                statsAvailable: false
            })
        }
        
        return ObjectAssign({}, state, {
            hydrated: true,
            showFetchFailure: !!action.err,
            _id: action.response._id,
            status: undefined,
            figures: action.response.figures,
            highscores: action.response.highscores,
            flips: action.response.flips
        });
    }


    return state;
};


module.exports = reducer;
