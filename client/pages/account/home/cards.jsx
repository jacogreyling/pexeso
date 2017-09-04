'use strict';

const Actions = require('./actions');
const PropTypes = require('prop-types');
const React = require('react');
const Card = require('./card.jsx');


const propTypes = {
    active: PropTypes.bool,
    cards: PropTypes.array,
    cardSize: PropTypes.number,
    guess1: PropTypes.number,
    guess2: PropTypes.number,
    level: PropTypes.string,
    pairsToMatch: PropTypes.number,
    round: PropTypes.number,
    statistics: PropTypes.object,
    timestamp: PropTypes.instanceOf(Date)
};


class Cards extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            cards: props.cards,
            size: props.cards.length
        }

    }

    componentWillReceiveProps(nextProps) {

        this.setState({
            cards: nextProps.cards,
            size: nextProps.cards.length
        });
    }

    render() {

        // We don't need to pass the full cards array to each individual card
        const properties = Object.assign({}, this.props, {
            cards: undefined});

        return (
            <div style={{height: '100%', width: '100%'}}>
                {
                    this.props.cards.map(card =>
                        <Card
                            {...properties}
                            key={card.id}
                            card={card}
                        />
                    )
                }
        </div>
        );
    }
}

Cards.propTypes = propTypes;


module.exports = Cards;
