'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const ClassNames = require('classnames');
const ReactTimeout = require('react-timeout');


const propTypes = {
    round: PropTypes.number,
    status: PropTypes.string,
    card: PropTypes.object,
    cardSize: PropTypes.number,
    level: PropTypes.string,
};

class Card extends React.Component {

    flipCard(id) {

        // Flip the card over
        Actions.flipCard(id);

        // If it's the second card in a pair
        if (this.props.round % 2 != 1) {

            setTimeout(() => {

                // We've won, now render the tiles again
                if (this.props.status === "won") {

                    Actions.endGame();
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
                onClick={() => this.flipCard(this.props.card.id)}>
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
