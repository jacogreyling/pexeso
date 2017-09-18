'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const CalculateScore = require('../../../helpers/calculate-score');


class Actions {
    static getStats() {

        ApiActions.get(
            `/api/stats/my`,
            undefined,
            Store,
            Constants.GET_STATS,
            Constants.GET_STATS_RESPONSE, (err, response) => {
                if (err && err.message === "Not Found") {

                    // No document found, let's initialize it
                    this.createStats();
                }
            }
        );
    }

    static createStats() {

        // We need to create this 'empty' object to update the database
        const data = {
            figures: {
                won: 0,
                lost: 0,
                abandoned: 0
            },
            highscores: {
                casual: 0,
                medium: 0,
                hard: 0
            },
            flips: {
                total: 0,
                matched: 0,
                wrong: 0
            }
        }

        ApiActions.post(
            `/api/stats/my`,
            data,
            Store,
            Constants.CREATE_STATS,
            Constants.CREATE_STATS_RESPONSE
        );
    }

    static updateStats(data) {

        // Retrieve the global state
        const stats = Store.getState().stats;

        // Calculate the score for this game
        let score = 0;
        if (data.status === "won") {
            score = CalculateScore({
                level: data.level,
                flips: data.flips,
                start: data.timestamp
            });
        }

        // Calculate highscore
        let highscore = 0;
        switch(data.level) {
            case "casual":
                highscore = (score > stats.highscores.casual) ?
                    score :
                    stats.highscores.casual;
                break;
            case "medium":
                highscore = (score > stats.highscores.medium) ?
                    score :
                    stats.highscores.medium;
                break;
            case "hard":
                highscore = (score > stats.highscores.hard) ?
                    score :
                    stats.highscores.hard;
                break;
            default:
                // Do nothing
        }

        // Build new statistics object (state)
        const newStats = {
            figures: {
                won: data.status === "won" ?
                    stats.figures.won + 1 :
                    stats.figures.won,
                lost: data.status === "lost" ?
                    stats.figures.lost + 1 :
                    stats.figures.lost,
                abandoned: data.status === "abandoned" ?
                    stats.figures.abandoned + 1 :
                    stats.figures.abandoned
            },
            highscores: {
                casual: data.level === "casual" ?
                    highscore :
                    stats.highscores.casual,
                medium: data.level === "medium" ?
                    highscore :
                    stats.highscores.medium,
                hard: data.level === "hard" ?
                    highscore :
                    stats.highscores.hard
            },
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
            status: data.status
        }

        // Update the database
        ApiActions.put(
            '/api/stats/my',
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
