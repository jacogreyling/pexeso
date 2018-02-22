/* global window */
'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const Qs = require('qs');


class Actions {

    static retrieveTopTenForMyEvent(level) {

        const query = null;

        ApiActions.get(
            `/api/scores/top/event/${level}`,
            query,
            Store,
            Constants.GET_EVENT_SCORES,
            Constants.GET_EVENT_SCORES_RESPONSE
        );

    }

    static setLevel(level) {

        // Change the difficulty level, and reset the state
        Store.dispatch({
            type: Constants.SET_LEVEL,
            level
        });
    }

    static changeSearchQuery(data, history) {

        history.push({
            pathname: '/account/leaderboard',
            search: `?${Qs.stringify(data)}`
        });

        window.scrollTo(0, 0);
    }

    static resetSearchQuery(history) {

        history.push({
            pathname: '/account/leaderboard'
        });

        window.scrollTo(0, 0);
    }
}


module.exports = Actions;
