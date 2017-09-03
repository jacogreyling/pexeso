'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static flipTile(id) {

        Store.dispatch({
            type: Constants.FLIP_TILE,
            id
        });
    }

    static addTile(id) {

        Store.dispatch({
            type: Constants.ADD_TILE,
            id
        });
    }

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

        // We need to create this object to update the database
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

        // Commit changes to the database
        if (['won', 'lost', 'abandoned'].indexOf(data.status) > -1) {

            ApiActions.put(
                '/api/stats/my',
                data.statistics,
                Store,
                Constants.SAVE_STATS,
                Constants.SAVE_STATS_RESPONSE
            );
        } else {

            // Just update the internal state (cache)
            Store.dispatch({
                type: Constants.UPDATE_STATS,
                stats: data.statistics
            });
        }
    }

    static startGame(level) {

        Store.dispatch({
            type: Constants.START_GAME,
            level
        });
    }

    static cancelGame() {

        // Stop the game
        Store.dispatch({
            type: Constants.STOP_GAME
        });

        // Change the logo of the tiles
        Store.dispatch({
            type: Constants.CHANGE_LOGO,
            logo: "flip"
        });
    }

    static stopGame(logo) {

        // Stop the game
        Store.dispatch({
            type: Constants.STOP_GAME
        });

        // Change the logo of the tiles
        Store.dispatch({
            type: Constants.CHANGE_LOGO,
            logo
        });
    }

    static flipCard(id) {

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
