'use strict';

const React = require('react');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');


const propTypes = {
    card: PropTypes.object,
    flipCard: PropTypes.func
};


class CardListItem extends React.Component {
    constructor(props) {

        super(props);
    }

    render() {

        let cardClass = ClassNames({
            'flipper' : true,
            'flipped' : this.props.card.flipped || this.props.card.discovered
        });

        return (
            <li className="flip-container">
                <div className={cardClass}>
                    <div className="front" onClick={() => this.props.flipCard(this.props.card.id)}></div>
                    <div className="back">
                        <img src={this.props.card.url} />
                    </div>
                </div>
            </li>
        )
    }
}

CardListItem.propTypes = propTypes;


module.exports = CardListItem;
