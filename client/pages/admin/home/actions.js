'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static getUserCount() {

        ApiActions.get(
            `/api/users/count`,
            undefined,
            Store,
            Constants.GET_USERS,
            Constants.GET_USERS_RESPONSE
        );
    }

    static getSessionCount() {

        ApiActions.get(
            `/api/sessions/count`,
            undefined,
            Store,
            Constants.GET_SESSIONS,
            Constants.GET_SESSIONS_RESPONSE
        );
    }

    static updateSessionCount(data) {

        const count = data.count;
        Store.dispatch({
            type: Constants.UPDATE_SESSIONS,
            count
        });
    }

    static updateUserCount(data) {

        const count = data.count;
        Store.dispatch({
            type: Constants.UPDATE_USERS,
            count
        });
    }

    static updateGameStatistics(data) {

        const stats = data.games;
        Store.dispatch({
            type: Constants.UPDATE_GAME_STATISTICS,
            stats
        });
    }

    static updateApiStatistics(data) {

        const count = data.count;
        Store.dispatch({
            type: Constants.UPDATE_API_CALLS,
            count
        });
    }

    static getAllStatistics() {

        ApiActions.get(
            `/api/monitor`,
            undefined,
            Store,
            Constants.GET_STATISTICS,
            Constants.GET_STATISTICS_RESPONSE
        );
    }


}

module.exports = Actions;
