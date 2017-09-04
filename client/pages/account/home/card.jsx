'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const ClassNames = require('classnames');
const ReactTimeout = require('react-timeout');
const CalculateHighscore = require('../../../helpers/calculate-highscore');


const propTypes = {
    active: PropTypes.bool,
    card: PropTypes.object,
    cardSize: PropTypes.number,
    guess1: PropTypes.number,
    guess2: PropTypes.number,
    level: PropTypes.string,
    pairsToMatch: PropTypes.number,
    round: PropTypes.number,
    statistics: PropTypes.object,
    timestamp: PropTypes.instanceOf(Date)
};

class Card extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            card: props.card,
            statistics: props.statistics,
            round: props.round,
            guess1: props.guess1,
            pairsToMatch: props.pairsToMatch,
            timestamp: props.timestamp,
            level: props.level
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            card: nextProps.card,
            statistics: nextProps.statistics,
            round: nextProps.round,
            guess1: nextProps.guess1,
            pairsToMatch: nextProps.pairsToMatch,
            timestamp: nextProps.timestamp,
            level: nextProps.level
        });
    }

    flipCard(ids) {

        let flips = this.state.statistics.flips;
        let figures = this.state.statistics.figures;
        let highscores = this.state.statistics.highscores;

        // Set the game state
        let status = "in-progress";

        // Increase the flip count
        flips.total = flips.total + 1;

        // It's the second card, picked
        if (this.state.round % 2 != 1) {

            // It's a match!
            if (this.state.guess1 === ids.rel) {
                flips.matched = flips.matched + 1;

                // We won!
                if (this.state.pairsToMatch === 1) {
                    figures.won = figures.won + 1;
                    this.state.statistics.status = "won";

                    CalculateHighscore({
                        timestamp: this.state.timestamp,
                        level: this.state.level,
                        flips: flips,
                        highscores: highscores
                    });
                }

            // No match
            } else {
                flips.wrong = flips.wrong + 1;
            }
        // It's the first card picked
        } else {
            // Do nothing
        }

        // Update the statistics
        Actions.updateStats({
            status: status,
            statistics: {
                figures: figures,
                highscores: highscores,
                flips: flips
            }
        });

        // Flip the card over
        Actions.flipCard(ids.id);

        // If it's the second card in a pair
        if (this.state.round % 2 != 1) {

            setTimeout(() => {

                // We've won!
                if (this.state.pairsToMatch === 0) {

                    Actions.endGame("nice");

                // Flip it back
                } else {

                    Actions.resetCards();

                }
            }, 500);
        }

    }

    render() {

        // Create an empty div when a card was matched in a previous round
        if (this.props.card.discovered && !this.props.card.flipped) {
            return (
                    <div className="found"
                        style={{width: this.props.cardSize + '%', height: this.props.cardSize + '%'}}>
                    </div>
            );
        }

        let cardClass = ClassNames({
            'card' : true,
            'active' : this.props.card.flipped || this.props.card.discovered
        });

        let bClass = ClassNames({
            'b' : true,
            'casual' : this.props.level === "casual",
            'medium' : this.props.level === "medium",
            'hard' : this.props.level === "hard",
        });

        return (
            <div className={cardClass}
                style={{width: this.props.cardSize + '%', height: this.props.cardSize + '%'}}
                onClick={() => this.flipCard({
                    id: this.props.card.id,
                    rel: this.props.card.rel})}>
                <div className="flipper">
                    <div className="f"></div>
                    <div className={bClass} data-f={this.props.card.data}></div>
                </div>
            </div>
        );
    }
}

Card.propTypes = propTypes;


module.exports = Card;
