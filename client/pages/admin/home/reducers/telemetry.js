'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');

const initialState = {
    hydrated: false,
    users: undefined,
    sessions: undefined,
    games: {},
    apiCalls: undefined
};
const reducer = function (state = initialState, action) {


    if (action.type === Constants.GET_USERS) {

        return ObjectAssign({}, state, {
            hydrated: false
        });
    }

    if (action.type === Constants.GET_USERS_RESPONSE) {

        // If we can't retrieve the metrics then assign -1 so we know
        if (action.err) {
            return ObjectAssign({}, state, {
                hydrated: true,
                users: -1
            });
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            users: action.response
        });
    }

    if (action.type === Constants.GET_SESSIONS) {

        return ObjectAssign({}, state, {
            hydrated: false
        });
    }

    if (action.type === Constants.GET_SESSIONS_RESPONSE) {

        // If we can't retrieve the metrics then assign -1 so we know
        if (action.err) {
            return ObjectAssign({}, state, {
                hydrated: true,
                sessions: -1
            });
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            sessions: action.response
        });
    }

    if (action.type === Constants.UPDATE_SESSIONS) {

        return ObjectAssign({}, state, {
            sessions: state.sessions + action.count
        });
    }

    if (action.type === Constants.UPDATE_USERS) {

        return ObjectAssign({}, state, {
            users: state.users + action.count
        });
    }

    if (action.type === Constants.UPDATE_GAME_STATISTICS) {

        return ObjectAssign({}, state, {
            games: action.stats
        });
    }

    if (action.type === Constants.UPDATE_API_CALLS) {

        return ObjectAssign({}, state, {
            apiCalls: action.count
        });
    }

    if (action.type === Constants.GET_STATISTICS) {

        return ObjectAssign({}, state, {
            hydrated: false
        });
    }

    if (action.type === Constants.GET_STATISTICS_RESPONSE) {

        // If we can't retrieve the metrics then assign -1 so we know
        if (action.err) {
            return ObjectAssign({}, state, {
                hydrated: true,
                games: {
                    won: -1,
                    lost: -1,
                    abandoned: -1
                },
                apiCalls: -1
            });
        }

        return ObjectAssign({}, state, {
            hydrated: true,
            games: {
                won: action.response.games.won,
                lost: action.response.games.lost,
                abandoned: action.response.games.abandoned
            },
            apiCalls: action.response.apiCalls
        });
    }


    return state;
};


module.exports = reducer;
