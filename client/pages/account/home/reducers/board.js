'use strict';

const Constants = require('../constants');
const ObjectAssign = require('object-assign');
const ParseValidation = require('../../../../helpers/parse-validation');
const Shuffle = require('../../../../helpers/shuffle');

const initialState = {
    hydrated: false,
    active: false,
    status: undefined,
    pairsToMatch: null,
    level: undefined,
    guess1: null,
    guess2: null,
    round: 1,
    cardSize: undefined,
    cards: [],
    flips: {},
    timestamp: undefined
};
const reducer = function (state = initialState, action) {

    if (action.type === Constants.START_GAME) {

        let cards = [];

        // Read the difficulty level and set the number of cards to create
        let number, pairsToMatch;
        switch(action.level) {
            case "casual":
                number = 16;
                pairsToMatch = 8;
                break;
            case "medium":
                number = 36;
                pairsToMatch = 18;
                break;
            case "hard":
                number = 64;
                pairsToMatch = 32;
                break;
            default:
                number = 0;
        }

        // Create the cards
        let code = null, count = 0;
        for (let i = 0; i < number; i += 2) {
            let index = Math.floor(Math.random() * 10000);

            // Define the image to match
            if (count < 10) {
                code = "0" + count;
            } else if (count == 30) {
                code = "1a";
            } else if (count == 31) {
                code = "1d";
            } else {
                code = count;
            }
            const unicode = "0xf0" + code;

            cards.push({
                id : i,
                rel : i + 1,
                flipped : false,
                discovered : false,
                data: String.fromCharCode(unicode)
            });

            cards.push({
                id : i + 1,
                rel : i,
                flipped : false,
                discovered : false,
                data: String.fromCharCode(unicode)
            });

            count += 1;
        }

        //If users' browser is using localhost
        // Assumption is that the User is a Developer - Do not shuffle the cards
        return ObjectAssign({}, initialState, {
            active: true,
            status: "in-progress",
            pairsToMatch: pairsToMatch,
            level: action.level,
            cards: (window.location.hostname == "localhost") ? cards : Shuffle(cards),
            cardSize: 100/Math.sqrt(number),
            timestamp: action.timeNow
        });
    }

    if (action.type === Constants.FLIP_CARD) {

        const round = state.round + 1;

        // First card selected
        if (state.round % 2 == 1) {
            let cardClicked = state.cards.find((card) => {
                return card.id === action.id;
            });

            return ObjectAssign({}, state, {
                guess1: cardClicked.id,
                guess2: null,
                round: round,
                cards: state.cards.map((card) => {
                    return card.id === action.id ?
                    ObjectAssign({}, card, { flipped: true }) :
                    ObjectAssign({}, card, { flipped: false })
                }),
                flips: {
                    total: isNaN(state.flips.total) ? state.flips.total = 1 : state.flips.total += 1,
                    matched: state.flips.matched,
                    wrong: state.flips.wrong
                }
            });

        // Second card selected
        } else {

            // Find the correct card match
            let cardClicked = state.cards.find((card) => {
                return card.id === action.id;
            });

            // It is a match!
            if (cardClicked.rel === state.guess1) {

                const pairsToMatch = state.pairsToMatch -= 1;

                return ObjectAssign({}, state, {
                    status: pairsToMatch === 0 ? "won" : state.status,
                    pairsToMatch: pairsToMatch,
                    guess1: state.guess1,
                    guess2: cardClicked.rel,
                    round: round,
                    cards: state.cards.map((card) => {
                        return (card.id === action.id || card.id === state.guess1) ?
                        ObjectAssign({}, card, { flipped: true, discovered: true }) :
                        card
                    }),
                    flips: {
                        total: state.flips.total ,
                        matched: isNaN(state.flips.matched) ? state.flips.matched = 1 : state.flips.matched += 1,
                        wrong: state.flips.wrong
                    }
                });

            // Nope continue trying
            } else {

                return ObjectAssign({}, state, {
                    guess1: state.guess1,
                    guess2: cardClicked.rel,
                    round: round,
                    cards: state.cards.map((card) => {
                        return card.id === action.id ?
                        ObjectAssign({}, card, { flipped: true }) :
                        card
                    }),
                    flips: {
                        total: state.flips.total += 1,
                        matched: state.flips.matched,
                        wrong: isNaN(state.flips.wrong) ? state.flips.wrong = 1 : state.flips.wrong += 1
                    }
                })
            }
        }
    }

    if (action.type === Constants.RESET_CARDS) {

        // Remove the 'flipped' flag resetting all cards to its original state
        return ObjectAssign({}, state, {
            guess1: null,
            guess2: null,
            cards: state.cards.map((card) => {
                return ObjectAssign({}, card, { flipped: false })
            })
        })
    }

    if (action.type === Constants.END_GAME) {

        return ObjectAssign({}, state, {
            active: false
        })
    }

    if (action.type === Constants.UPDATE_STATUS) {

        return ObjectAssign({}, state, {
            status: action.status
        })
    }

    if (action.type === Constants.UPDATE_HYDRATED) {

        return ObjectAssign({}, state, {
            hydrated: true
        })
    }

    if (action.type === Constants.END_GAME_UPDATE_STATUS) {

        return ObjectAssign({}, state, {
            active: false,
            hydrated: true,
            status: action.status
        })
    }


    return state;
};


module.exports = reducer;
