/* global window */
'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


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

    static resetDifficulty(level) {

        // Change the difficulty level, and reset the state
        Store.dispatch({
            type: Constants.RESET_DIFFICULTY,
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
}


module.exports = Actions;
