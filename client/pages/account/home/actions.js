'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const CalculateScore = require('../../../helpers/calculate-score');
const Md5 = require('../../../../node_modules/blueimp-md5/js/md5');


class Actions {
    static getStats() {

        ApiActions.get(
            '/api/statistics/my',
            undefined,
            Store,
            Constants.GET_STATS,
            Constants.GET_STATS_RESPONSE, (err, response) => {

                if (err) {

                    if (response.statusCode === 404) {

                        // No document found, let's initialize it first time
                        this.createStats();
                    }
                    else {

                        console.warn(err);
                    }
                }
            }
        );
    }

    static createStats() {

        // We need to create this 'empty' object and update the database
        const data = {};

        console.info('INFO: Creating empty Statistics object in collection.');

        ApiActions.post(
            '/api/statistics/my',
            data,
            Store,
            Constants.CREATE_STATS,
            Constants.CREATE_STATS_RESPONSE
        );
    }

    static updateStats(data) {

        // Calculate the score for this game
        let score = 0;
        const end = new Date();

        if (data.status === 'won') {
            score = CalculateScore({
                level: data.level,
                flips: data.flips,
                start: data.timestamp,
                end,
                timeout: data.timeout
            });
        };

        // Create the client secret key
        const clientSecKey = Md5('' + data.status + score +  data.level + '');

        // Build new statistics object (state)
        const stats = {
            flips: {
                total: typeof data.flips.total === 'undefined' ? 0 : data.flips.total,
                matched: typeof data.flips.matched === 'undefined' ? 0 : data.flips.matched,
                wrong: typeof data.flips.wrong === 'undefined' ? 0 : data.flips.wrong
            },
            status: data.status,
            score,
            time: (end - data.timestamp) / 1000,
            level: data.level,
            seckey : clientSecKey
        };

        // Update the database
        ApiActions.patch(
            '/api/statistics/my',
            stats,
            Store,
            Constants.SAVE_STATS,
            Constants.SAVE_STATS_RESPONSE
        );
    }

    static startGame(level) {

        const timeNow = new Date();

        Store.dispatch({
            type: Constants.START_GAME,
            level,
            timeNow
        });
    }

    static changeLogo(logo) {

        // Change the logo, in the tiles reducer
        Store.dispatch({
            type: Constants.CHANGE_LOGO,
            logo
        });
    }

    static endGame() {

        // Stop the game, in the board reducer
        Store.dispatch({
            type: Constants.END_GAME
        });
    }

    static gameStatisticsSaved() {

        // Finished processing the statistics, reset status
        Store.dispatch({
            type: Constants.UPDATE_HYDRATED
        });
    }

    static endGameAndUpdateStatus(status) {

        // Finished processing the statistics, reset status
        Store.dispatch({
            type: Constants.END_GAME_UPDATE_STATUS,
            status
        });
    }

    static flipCard(id) {

        //TODO: Move the business logic from the reducer to here

        Store.dispatch({
            type: Constants.FLIP_CARD,
            id
        });
    }

    static resetCards() {

        Store.dispatch({
            type: Constants.RESET_CARDS
        });
    }
}

module.exports = Actions;
