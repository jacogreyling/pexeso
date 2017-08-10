'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const CardListItem = require('./card-list-item.jsx');


const propTypes = {
    cards: PropTypes.array,
    flipCard: PropTypes.func
};


class CardList extends React.Component {
    constructor(props) {

        super(props);
    }

    render() {
        return (
            <ul className="cards">
                {
                    this.props.cards.map(card =>
                        <CardListItem
                            key={card.id}
                            card={card}
                            flipCard={this.props.flipCard}
                        />
                    )
                }
            </ul>
        )
    }
}

CardList.propTypes = propTypes;


module.exports = CardList;
