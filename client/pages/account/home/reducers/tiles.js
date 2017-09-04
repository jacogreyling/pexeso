'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');

const initialState = {
    logo: "flip"
};
const reducer = function (state = initialState, action) {


    if (action.type === Constants.CHANGE_LOGO) {

        return ObjectAssign({}, state, {
            logo: action.logo
        })
    }


    return state;
};


module.exports = reducer;
