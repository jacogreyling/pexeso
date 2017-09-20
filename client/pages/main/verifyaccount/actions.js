/* global window */
'use strict';

const ApiActions = require('../../../actions/api');
const Constants = require('./constants');
const Store = require('./store');


class Actions {
    static verifyAccount(data) {

        ApiActions.post(
            '/api/verify',
            data,
            Store,
            Constants.VERIFYACCOUNT,
            Constants.VERIFYACCOUNT_RESPONSE,
            (err, response) => {

                if (!err) {
                    window.location.href = '/login';
                }
            }
        );
    }
};


module.exports = Actions;
