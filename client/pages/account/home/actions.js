'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const ObjectAssign = require('object-assign');
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

        console.info("INFO: Creating empty Statistics object in collection.");

        ApiActions.post(
            '/api/statistics/my',
            data,
            Store,
            Constants.CREATE_STATS,
            Constants.CREATE_STATS_RESPONSE
        );
    }

    static updateStats(data) {

        // Retrieve the global state
        const stats = Store.getState().statistics;

        // Calculate the score for this game
        let score = 0;
        if (data.status === 'won') {
            score = CalculateScore({
                level: data.level,
                flips: data.flips,
                start: data.timestamp,
                timeout: data.timeout
            });
        };

        // Create the client secret key
        const clientSecKey = Md5('' + data.status + score +  data.level + '');

        // Calculate highscore
        let highscore = 0;
        switch (data.level) {
            case 'casual':
                highscore = (score > stats.highscores.casual.score) ?
                    score :
                    stats.highscores.casual.score;
                break;
            case 'medium':
                highscore = (score > stats.highscores.medium.score) ?
                    score :
                    stats.highscores.medium.score;
                break;
            case 'hard':
                highscore = (score > stats.highscores.hard.score) ?
                    score :
                    stats.highscores.hard.score;
                break;
            default:
                // Do nothing
        };

        // If the two scores are the same, it means we have a new highscore
        const isHighscore = ((highscore === score) && (highscore > 0)) ?
            true :
            false;

        // Validate the figures object
        let figures;
        if (typeof stats.figures === 'undefined') {

            // This means something went wrong, it should at least be '0'
            console.error("ERROR: The stats.figures object is empty!");

            figures = {
                won: data.status === 'won' ?
                    1 :
                    0,
                lost: data.status === 'lost' ?
                    1 :
                    0,
                abandoned: data.status === 'abandoned' ?
                    1 :
                    0
            }
        } else {

            // Update our figures object
            figures = {
                won: data.status === 'won' ?
                    stats.figures.won + 1 :
                    stats.figures.won,
                lost: data.status === 'lost' ?
                    stats.figures.lost + 1 :
                    stats.figures.lost,
                abandoned: data.status === 'abandoned' ?
                    stats.figures.abandoned + 1 :
                    stats.figures.abandoned
            }
        }

        // Build new statistics object (state)
        const newStats = {
            figures,
            flips: {
                total: (isNaN(stats.flips.total) ?
                    0 :
                    stats.flips.total) + ((isNaN(data.flips.total) ||
                    (typeof data.flips.total === 'undefined')) ?
                    0 :
                    data.flips.total),
                matched: (isNaN(stats.flips.matched) ?
                    0 :
                    stats.flips.matched) + ((isNaN(data.flips.matched) ||
                    (typeof data.flips.matched === 'undefined')) ?
                    0 :
                    data.flips.matched),
                wrong: (isNaN(stats.flips.wrong) ?
                    0 :
                    stats.flips.wrong) + ((isNaN(data.flips.wrong) ||
                    (typeof data.flips.wrong === 'undefined')) ?
                    0 :
                    data.flips.wrong)
            },
            status: data.status,
            highscore: isHighscore,
            score,
            level: data.level,
            seckey : clientSecKey
        };

        // Update the database
        ApiActions.put(
            '/api/statistics/my',
            newStats,
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
