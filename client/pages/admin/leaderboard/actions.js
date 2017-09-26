/* global window */
'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const Qs = require('qs');


class Actions {

    static retrieveTopTen(level) {

        const query = {
            limit: 10
        };

        ApiActions.get(
            `/api/scores/top/${level}`,
            query,
            Store,
            Constants.GET_TOP_SCORES,
            Constants.GET_TOP_SCORES_RESPONSE
        );
    }

    static setLevel(level) {

        // Change the difficulty level, and reset the state
        Store.dispatch({
            type: Constants.SET_LEVEL,
            level
        });
    }

    static insertScore(entry) {

        // Retrieve the global state
        const data = Store.getState().leaderboard.data;

        let newArray = [];
        let inserted = false;
        const limit = 10;
        for (let i = 0; i < limit; i++) {

            // If our new array is already at limit, stop!
            if (newArray.length === limit) {
                break;
            }

            // If we've reached the end of our array, insert row then break
            if (data.length - 1 < i) {
                if (!inserted) {
                    newArray.push(entry);
                }
                break;
            }

            // Add the remaining entries
            if (inserted) {
                newArray.push(data[i]);
                continue;
            }

            // Is the score bigger?
            if (data[i].score > entry.score) {
                newArray.push(data[i]);
            }  else {
                newArray.push(entry);
                newArray.push(data[i]);
                inserted = true;
            }
        }

        // Update the data
        Store.dispatch({
            type: Constants.UPDATE_TOP_SCORES,
            data: newArray
        });
    }

    static changeDateFrom(date) {

        // Update the date 'from'
        Store.dispatch({
            type: Constants.UPDATE_DATE_FROM,
            date
        });
    }

    static insertDateFrom(date) {

        // Update the date 'from'
        Store.dispatch({
            type: Constants.INSERT_DATE_FROM,
            date
        });
    }

    static resetDateFrom() {

        // Update the date 'from'
        Store.dispatch({
            type: Constants.RESET_DATE_FROM,
        });
    }

    static toggleLiveMode() {

        // Toggle between live and historical
        Store.dispatch({
            type: Constants.TOGGLE_LIVE_MODE
        });
    }

    static getResults(data) {

        ApiActions.get(
            `/api/scores`,
            data,
            Store,
            Constants.GET_RESULTS,
            Constants.GET_RESULTS_RESPONSE
        );
    }

    static changeSearchQuery(data, history) {

        history.push({
            pathname: '/admin/leaderboard',
            search: `?${Qs.stringify(data)}`
        });

        window.scrollTo(0, 0);
    }

    static resetSearchQuery(history) {

        history.push({
            pathname: '/admin/leaderboard'
        });

        window.scrollTo(0, 0);
    }
}


module.exports = Actions;
