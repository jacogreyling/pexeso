'use strict';

const React = require('react');
const Store = require('./store');
const Actions = require('./actions');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');


const propTypes = {
    position: PropTypes.string,
    twist: PropTypes.bool
};


class Tile extends React.Component {

    render() {

        const tileClass = ClassNames({
            'card' : true,
            'left' : this.props.position === "left",
            'twist' : this.props.twist,
            'active' : this.props.twist
        });

        return (
            <div className={tileClass}>
                <div className="flipper">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

Tile.propTypes = propTypes;


module.exports = Tile;
