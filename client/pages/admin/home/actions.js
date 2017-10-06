'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const Moment = require('moment');


class Actions {
    static getAllStatistics() {

        ApiActions.get(
            '/api/monitor',
            undefined,
            Store,
            Constants.GET_STATISTICS,
            Constants.GET_STATISTICS_RESPONSE
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

    static updateGamesWon(data) {

        Store.dispatch({
            type: Constants.ADD_GAMES_WON,
            data
        });
    }

    static updateGraphDatasets(data) {

        const now = Moment();

        // Create data object for the last two minutes, since interval can span
        // multiple minutes
        const t = Moment(now);
        const t_1 = Moment(now.subtract(1, 'minute'));

        const tmpData = {
            casual: {
                [t_1.format('H:mm')]: {
                    count: 0,
                    timestamp: t_1
                },
                [t.format('H:mm')]: {
                    count: 0,
                    timestamp: t
                }
            },
            medium: {
                [t_1.format('H:mm')]: {
                    count: 0,
                    timestamp: t_1
                },
                [t.format('H:mm')]: {
                    count: 0,
                    timestamp: t
                }
            },
            hard: {
                [t_1.format('H:mm')]: {
                    count: 0,
                    timestamp: t_1
                },
                [t.format('H:mm')]: {
                    count: 0,
                    timestamp: t
                }
            }
        };

        if (Array.isArray(data)) {
            // Lets loop over the array and group them
            for (const item of data) {

                const interval = Moment(item.timestamp).format('H:mm');

                tmpData[item.level][interval] = {
                    count: tmpData[item.level][interval].count += 1,
                    timestamp: Moment(item.timestamp)
                };
            }
        }

        Store.dispatch({
            type: Constants.UPDATE_DATASETS,
            tmpData
        });
    }

    static updateApiStatistics(data) {

        const count = data.count;
        Store.dispatch({
            type: Constants.UPDATE_API_CALLS,
            count
        });
    }

    static retrieveGameScores(interval) {

        let time = interval;
        if (typeof time !== 'number') {
            time = 0;
        }

        ApiActions.get(
            `/api/scores/interval/${time}`,
            undefined,
            Store,
            Constants.GET_GAME_SCORES,
            Constants.GET_GAME_SCORES_RESPONSE
        );
    }

}

module.exports = Actions;
