'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');
const Cards = require('../data/cards');

const initialState = {
    round: 1,
    guess1: null,
    guess2: null,
    cards: Cards()
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.FLIP_CARD) {
        let newState = { round: state.round + 1 };

        if (state.round % 2 == 1) {
            let cardClicked = state.cards.find((card) => {
                return card.id === action.id;
            });

            return ObjectAssign({}, newState, {
                guess1: cardClicked.id,
                guess2: null,
                cards: state.cards.map((card) => {
                    return card.id === action.id ?
                    ObjectAssign({}, card, { flipped: true }) :
                    ObjectAssign({}, card, { flipped: false })
                })
            });

        } else {
            let cardClicked = state.cards.find((card) => {
                return card.id === action.id;
            });

            if (cardClicked.rel === state.guess1) {
                return ObjectAssign({}, newState, {
                    guess1: state.guess1,
                    guess2: cardClicked.rel,
                    cards: state.cards.map((card) => {
                        return (card.id === action.id || card.id === state.guess1) ?
                        ObjectAssign({}, card, { flipped: true, discovered: true }) :
                        card
                    })
                });

            } else {
                return ObjectAssign({}, newState, {
                    guess1: state.guess1,
                    guess2: cardClicked.rel,
                    cards: state.cards.map((card) => {
                        return card.id === action.id ?
                        ObjectAssign({}, card, { flipped: true }) :
                        card
                    })
                })
            }
        }
    }

    if (action.type === Constants.RESTART_GAME) {
        return ObjectAssign({}, state, {
            round: 1,
            guess1: null,
            guess2: null,
            cards: Cards()
        });
    }

    return state;
};


module.exports = reducer;
