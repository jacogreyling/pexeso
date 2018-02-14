/* global window */
'use strict';

const ApiActions = require('../../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');
const Qs = require('qs');


class Actions {
    static getEvent(name) {

        if (!global.window) {
            return;
        }

        const lowerCaseName = name.toLowerCase();

        ApiActions.get(
            `/api/events/${lowerCaseName}`,
            undefined,
            Store,
            Constants.GET_EVENT_BY_NAME,
            Constants.GET_EVENT_BY_NAME_RESPONSE,
            (err, response) => {

                if (!err) {
                
                    if (response && (response.isActive === true)) {
                        window.location.href = "/";
                    }                
                }
            }
        );
    }
}


module.exports = Actions;
