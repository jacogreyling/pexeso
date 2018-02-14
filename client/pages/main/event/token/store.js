'use strict';

const Constants = require('./constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');
const Redux = require('redux');


const initialState = {
    loading: false,
    success: false,
    error: undefined,
    event: undefined,
    description: undefined,
    startDate: undefined,
    endDate: undefined,
    isActive: undefined
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_EVENT_BY_NAME) {
        return ObjectAssign({}, state, {
            loading: true
        });
    }

    if (action.type === Constants.GET_EVENT_BY_NAME_RESPONSE) {

        // Check if we got a valid response back
        if (action.err) {
            return ObjectAssign({}, state, {
                loading: false,
                success: false,
                error: action.err
            });
        }

        if (action.response) {
            return ObjectAssign({}, state, {
                loading: false,
                success: true,
                error: undefined,
                event: action.response.event,
                description: action.response.description,
                startDate: action.response.startDate,
                endDate: action.response.endDate,
                isActive: action.response.isActive
            });
        }
        else {
            return ObjectAssign({}, state, {
                loading: false,
                success: true,
                error: undefined
            })
        }

        
    }

    return state;
};


module.exports = Redux.createStore(reducer);
