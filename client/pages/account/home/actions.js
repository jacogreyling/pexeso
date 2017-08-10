'use strict';

const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static flipCard(id) {

        Store.dispatch({
            type: Constants.FLIP_CARD,
            id
        });
    }

    static restart() {

        Store.dispatch({
            type: Constants.RESTART_GAME
        });
    }
}

module.exports = Actions;
