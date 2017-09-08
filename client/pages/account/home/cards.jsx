'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const Card = require('./card.jsx');


const propTypes = {
    cards: PropTypes.array,
    round: PropTypes.number,
    status: PropTypes.string,
    cardSize: PropTypes.number,
    level: PropTypes.string,
};


class Cards extends React.Component {

    render() {

        return (
            <div style={{height: '100%', width: '100%'}}>
                {
                    this.props.cards.map(card =>
                        <Card
                            key={card.id}
                            round={this.props.round}
                            status={this.props.status}
                            card={card}
                            cardSize={this.props.cardSize}
                            level={this.props.level}
                        />
                    )
                }
        </div>
        );
    }
}

Cards.propTypes = propTypes;


module.exports = Cards;
