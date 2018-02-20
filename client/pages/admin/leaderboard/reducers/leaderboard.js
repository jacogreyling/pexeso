'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');

const initialState = {
    hydrated: false,
    loading: false,
    error: undefined,
    dateFrom: undefined,
    level: 'casual',
    events: [],
    selectedEvent: '',
    live: true,
    position: undefined,
    data: [],
    pages: {},
    items: {}
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.GET_LIVE_SCORES) {

        // Find the right level
        const url = action.request.url.split('/');
        const level = url.pop();

        const event = action.request.query.event;

        if ((typeof event !== 'undefined') && (event !== '')) {

            return ObjectAssign({}, state, {
                hydrated: false,
                loading: true,
                level,
                selectedEvent: event
            });            
        }
        else {
         
            return ObjectAssign({}, state, {
                hydrated: false,
                loading: true,
                level
            });
        }
    }

    if (action.type === Constants.GET_LIVE_SCORES_RESPONSE) {

        return ObjectAssign({}, state, {
            hydrated: true,
            loading: false,
            live: true,
            data: action.response
        });
    }

    if (action.type === Constants.SET_LEVEL) {

        if (typeof action.live === 'undefined') {
            return ObjectAssign({}, state, {
                level: action.level
            });
        }

        return ObjectAssign({}, state, {
            level: action.level,
            live: action.live
        });
    }

    if (action.type === Constants.UPDATE_LIVE_SCORES) {

        return ObjectAssign({}, state, {
            data: action.data,
            live: true,
            position: action.position
        });
    }

    if (action.type === Constants.REMOVE_NEW_POSITION) {

        return ObjectAssign({}, state, {
            position: undefined
        });
    }

    if (action.type === Constants.UPDATE_DATE_FROM) {

        return ObjectAssign({}, state, {
            dateFrom: action.date
        });
    }

    if (action.type === Constants.SET_DATE_FROM) {

        return ObjectAssign({}, state, {
            dateFrom: action.date,
            live: false
        });
    }

    if (action.type === Constants.RESET_DATE_FROM) {

        return ObjectAssign({}, state, {
            dateFrom: undefined
        });
    }

    if (action.type === Constants.SET_LIVE_MODE) {

        return ObjectAssign({}, state, {
            live: action.condition
        });
    }

    if (action.type === Constants.GET_RESULTS) {


        const event = action.request.query.event;

        if ((typeof event !== 'undefined') && (event !== '')) {
            
            return ObjectAssign({}, state, {
                hydrated: false,
                loading: true,
                selectedEvent: event
            });
        }
        else {

            return ObjectAssign({}, state, {
                hydrated: false,
                loading: true
            });
        }
        
    }

    if (action.type === Constants.GET_RESULTS_RESPONSE) {

        return ObjectAssign({}, state, {
            hydrated: true,
            loading: false,
            live: false,
            data: action.response.data,
            pages: action.response.pages,
            items: action.response.items
        });
    }

    if (action.type === Constants.GET_ACTIVE_EVENTS) {

        return ObjectAssign({}, state, {

        });
    }

    if (action.type === Constants.GET_ACTIVE_EVENTS_RESPONSE) {

        return ObjectAssign({}, state, {
            events: action.response
        });
    }

    if (action.type === Constants.SET_EVENT) {

        return ObjectAssign({}, state, {
            selectedEvent: action.name
        });
    }


    return state;
};


module.exports = reducer;
