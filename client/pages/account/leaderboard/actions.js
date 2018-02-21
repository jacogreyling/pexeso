/* global window */
'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const Qs = require('qs');


class Actions {

    static retrieveTopTen(level) {

        this.retrieveTopTenForEvent(level, null);
    }

    static retrieveTopTenForEvent(level, event) {

        const query = {
            limit: 10,
            event
        };

        ApiActions.get(
            `/api/scores/top/${level}`,
            query,
            Store,
            Constants.GET_LIVE_SCORES,
            Constants.GET_LIVE_SCORES_RESPONSE
        );
    }

    static getUser() {

        ApiActions.get(
            '/api/users/my',
            undefined,
            Store,
            Constants.GET_USER,
            Constants.GET_USER_RESPONSE
        );
    }

    static getEvent() {

        ApiActions.get(
            '/api/accounts/my/event',
            undefined,
            Store,
            Constants.GET_EVENT,
            Constants.GET_EVENT_RESPONSE
        );
    }
    
    static setLevel(level, live) {

        // Change the difficulty level, and reset the state
        Store.dispatch({
            type: Constants.SET_LEVEL,
            level,
            live
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
