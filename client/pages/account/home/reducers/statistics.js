'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');

const initialState = {
    hydrated: false,
    showFetchFailure: false,
    statsAvailable: false,
    _id: undefined,
    figures: {
        won: undefined,
        lost: undefined,
        abandoned: undefined
    },
    highscores: {
        casual: {
            score: undefined,
            timestamp: undefined
        },
        medium: {
            score: undefined,
            timestamp: undefined
        },
        hard: {
            score: undefined,
            timestamp: undefined
        }
    },
    flips: {
        total: undefined,
        matched: undefined,
        wrong: undefined
    },
    lastPlayed: undefined
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
            });
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            showFetchFailure: !!action.err,
            _id: action.response._id,
            figures: action.response.figures,
            highscores: action.response.highscores,
            flips: action.response.flips,
            lastPlayed: action.response.lastPlayed
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
            });
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            showFetchFailure: !!action.err,
            _id: action.response._id,
            figures: action.response.figures,
            highscores: action.response.highscores,
            flips: action.response.flips,
            lastPlayed: null
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
                showFetchFailure: true,
                statsAvailable: false
            });
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            showFetchFailure: !!action.err,
            _id: action.response._id,
            figures: action.response.figures,
            highscores: action.response.highscores,
            flips: action.response.flips,
            lastPlayed: action.response.lastPlayed
        });
    }


    return state;
};


module.exports = reducer;
